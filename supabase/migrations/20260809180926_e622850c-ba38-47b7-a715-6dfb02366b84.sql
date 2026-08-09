-- =====================================================================
-- Mancha production security hardening — database layer
-- =====================================================================

-- ---------- 0. Helper functions ----------

CREATE OR REPLACE FUNCTION public.is_active_user(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = _user_id AND status = 'active');
$$;
REVOKE ALL ON FUNCTION public.is_active_user(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_active_user(uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;

-- ---------- 1. Security audit log ----------

CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id     uuid,
  action       text NOT NULL,
  target_table text,
  target_id    uuid,
  details      jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.security_audit_log TO authenticated;
GRANT ALL    ON public.security_audit_log TO service_role;
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins read audit log" ON public.security_audit_log;
CREATE POLICY "Admins read audit log" ON public.security_audit_log
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
-- no INSERT/UPDATE/DELETE policies: only SECURITY DEFINER code may write

CREATE INDEX IF NOT EXISTS idx_audit_created  ON public.security_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_target   ON public.security_audit_log (target_table, target_id);

CREATE OR REPLACE FUNCTION public.log_security_event(
  _action text, _target_table text, _target_id uuid, _details jsonb DEFAULT '{}'::jsonb
) RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.security_audit_log (actor_id, action, target_table, target_id, details)
  VALUES (auth.uid(), _action, _target_table, _target_id, COALESCE(_details, '{}'::jsonb));
$$;
REVOKE ALL ON FUNCTION public.log_security_event(text, text, uuid, jsonb) FROM PUBLIC;

-- ---------- 2. Profiles: block privilege escalation ----------

CREATE OR REPLACE FUNCTION public.guard_profile_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_admin boolean := public.has_role(auth.uid(), 'admin');
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'profile id is immutable';
  END IF;

  IF NOT is_admin THEN
    -- Non-admins may never touch security-sensitive columns.
    NEW.primary_role      := OLD.primary_role;
    NEW.status            := OLD.status;
    NEW.email             := OLD.email;
    NEW.organization_type := OLD.organization_type;
    NEW.created_at        := OLD.created_at;
  ELSE
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      -- Explicit state machine: pending->active|suspended, active<->suspended
      IF NOT (
        (OLD.status = 'pending'   AND NEW.status IN ('active','suspended')) OR
        (OLD.status = 'active'    AND NEW.status = 'suspended') OR
        (OLD.status = 'suspended' AND NEW.status = 'active')
      ) THEN
        RAISE EXCEPTION 'invalid account status transition % -> %', OLD.status, NEW.status;
      END IF;
      IF NEW.id = auth.uid() THEN
        RAISE EXCEPTION 'administrators cannot change their own account status';
      END IF;
      PERFORM public.log_security_event('profile.status_change', 'profiles', NEW.id,
        jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    IF NEW.primary_role IS DISTINCT FROM OLD.primary_role THEN
      RAISE EXCEPTION 'use admin_set_user_role() to change roles';
    END IF;
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS profiles_guard_update ON public.profiles;
CREATE TRIGGER profiles_guard_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_update();

-- Public, non-sensitive directory (no email / phone / status).
CREATE OR REPLACE VIEW public.public_profiles
WITH (security_invoker = false) AS
  SELECT id, full_name, organization_name, primary_role, organization_type
  FROM public.profiles
  WHERE status = 'active';

GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- ---------- 3. Roles: admin-only, audited, last-admin protected ----------

CREATE OR REPLACE FUNCTION public.admin_set_user_role(_user_id uuid, _role public.app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  old_role public.app_role;
  admin_count int;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'administrators cannot change their own role';
  END IF;

  SELECT primary_role INTO old_role FROM public.profiles WHERE id = _user_id;
  IF old_role IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF old_role = 'admin' AND _role <> 'admin' THEN
    SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
    IF admin_count <= 1 THEN
      RAISE EXCEPTION 'cannot remove the last administrator';
    END IF;
  END IF;

  DELETE FROM public.user_roles WHERE user_id = _user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  UPDATE public.profiles SET primary_role = _role WHERE id = _user_id;

  PERFORM public.log_security_event('role.change', 'user_roles', _user_id,
    jsonb_build_object('from', old_role, 'to', _role));
END $$;
REVOKE ALL ON FUNCTION public.admin_set_user_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, public.app_role) TO authenticated;

-- profiles.primary_role changes are blocked by the guard trigger, so the RPC
-- must bypass it. Re-implement via direct catalog-safe path:
CREATE OR REPLACE FUNCTION public.guard_profile_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  is_admin boolean := public.has_role(auth.uid(), 'admin');
  internal boolean := COALESCE(current_setting('mancha.internal', true), 'off') = 'on';
BEGIN
  IF NEW.id <> OLD.id THEN
    RAISE EXCEPTION 'profile id is immutable';
  END IF;

  IF internal THEN
    RETURN NEW;
  END IF;

  IF NOT is_admin THEN
    NEW.primary_role      := OLD.primary_role;
    NEW.status            := OLD.status;
    NEW.email             := OLD.email;
    NEW.organization_type := OLD.organization_type;
    NEW.created_at        := OLD.created_at;
  ELSE
    IF NEW.status IS DISTINCT FROM OLD.status THEN
      IF NOT (
        (OLD.status = 'pending'   AND NEW.status IN ('active','suspended')) OR
        (OLD.status = 'active'    AND NEW.status = 'suspended') OR
        (OLD.status = 'suspended' AND NEW.status = 'active')
      ) THEN
        RAISE EXCEPTION 'invalid account status transition % -> %', OLD.status, NEW.status;
      END IF;
      IF NEW.id = auth.uid() THEN
        RAISE EXCEPTION 'administrators cannot change their own account status';
      END IF;
      PERFORM public.log_security_event('profile.status_change', 'profiles', NEW.id,
        jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    IF NEW.primary_role IS DISTINCT FROM OLD.primary_role THEN
      RAISE EXCEPTION 'use admin_set_user_role() to change roles';
    END IF;
  END IF;

  RETURN NEW;
END $$;

CREATE OR REPLACE FUNCTION public.admin_set_user_role(_user_id uuid, _role public.app_role)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  old_role public.app_role;
  admin_count int;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF _user_id = auth.uid() THEN
    RAISE EXCEPTION 'administrators cannot change their own role';
  END IF;

  SELECT primary_role INTO old_role FROM public.profiles WHERE id = _user_id;
  IF old_role IS NULL THEN
    RAISE EXCEPTION 'user not found';
  END IF;

  IF old_role = 'admin' AND _role <> 'admin' THEN
    SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';
    IF admin_count <= 1 THEN
      RAISE EXCEPTION 'cannot remove the last administrator';
    END IF;
  END IF;

  PERFORM set_config('mancha.internal', 'on', true);
  DELETE FROM public.user_roles WHERE user_id = _user_id;
  INSERT INTO public.user_roles (user_id, role) VALUES (_user_id, _role)
    ON CONFLICT (user_id, role) DO NOTHING;
  UPDATE public.profiles SET primary_role = _role WHERE id = _user_id;
  PERFORM set_config('mancha.internal', 'off', true);

  PERFORM public.log_security_event('role.change', 'user_roles', _user_id,
    jsonb_build_object('from', old_role, 'to', _role));
END $$;

-- Admin approval helper (audited, uses the status state machine).
CREATE OR REPLACE FUNCTION public.admin_set_account_status(_user_id uuid, _status public.account_status)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  UPDATE public.profiles SET status = _status WHERE id = _user_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'user not found';
  END IF;
END $$;
REVOKE ALL ON FUNCTION public.admin_set_account_status(uuid, public.account_status) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_set_account_status(uuid, public.account_status) TO authenticated;

-- ---------- 4. Productions: role-gated creation, protected counters ----------

DROP POLICY IF EXISTS "Groups manage own productions" ON public.productions;
CREATE POLICY "Groups create productions" ON public.productions
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = group_id
    AND public.is_active_user(auth.uid())
    AND (public.has_role(auth.uid(), 'theatre_group') OR public.has_role(auth.uid(), 'admin'))
  );

CREATE OR REPLACE FUNCTION public.guard_production_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.group_id <> OLD.group_id THEN
      RAISE EXCEPTION 'production ownership is immutable';
    END IF;
    -- seats_sold may only move through platform logic (nested trigger / definer RPC)
    IF NEW.seats_sold IS DISTINCT FROM OLD.seats_sold
       AND pg_trigger_depth() < 2
       AND COALESCE(current_setting('mancha.internal', true), 'off') <> 'on' THEN
      NEW.seats_sold := OLD.seats_sold;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS productions_guard_update ON public.productions;
CREATE TRIGGER productions_guard_update
  BEFORE UPDATE ON public.productions
  FOR EACH ROW EXECUTE FUNCTION public.guard_production_update();

ALTER TABLE public.productions
  DROP CONSTRAINT IF EXISTS productions_prices_nonneg,
  DROP CONSTRAINT IF EXISTS productions_seats_valid,
  DROP CONSTRAINT IF EXISTS productions_text_limits;
ALTER TABLE public.productions
  ADD CONSTRAINT productions_prices_nonneg CHECK (
    COALESCE(ticket_price,0) >= 0 AND COALESCE(ticket_price,0) <= 1000000 AND
    COALESCE(livestream_price,0) >= 0 AND COALESCE(livestream_price,0) <= 1000000 AND
    COALESCE(archive_price,0) >= 0 AND COALESCE(archive_price,0) <= 1000000),
  ADD CONSTRAINT productions_seats_valid CHECK (
    COALESCE(max_seats,0) >= 0 AND COALESCE(max_seats,0) <= 100000
    AND seats_sold >= 0 AND seats_sold <= COALESCE(max_seats, 0)),
  ADD CONSTRAINT productions_text_limits CHECK (
    length(title) BETWEEN 1 AND 200
    AND length(COALESCE(description,'')) <= 5000
    AND length(COALESCE(venue,'')) <= 200
    AND length(COALESCE(youtube_url,'')) <= 500
    AND length(COALESCE(poster_url,'')) <= 1000);

CREATE INDEX IF NOT EXISTS idx_productions_published ON public.productions (is_published, show_date);
CREATE INDEX IF NOT EXISTS idx_productions_group     ON public.productions (group_id, created_at DESC);

-- Make counter sync authoritative (runs as owner, not as the booking user).
CREATE OR REPLACE FUNCTION public.sync_production_seats()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE public.productions SET seats_sold = seats_sold + NEW.seat_count WHERE id = NEW.production_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status = 'confirmed' AND NEW.status <> 'confirmed' THEN
      UPDATE public.productions SET seats_sold = GREATEST(0, seats_sold - OLD.seat_count) WHERE id = NEW.production_id;
    ELSIF OLD.status <> 'confirmed' AND NEW.status = 'confirmed' THEN
      UPDATE public.productions SET seats_sold = seats_sold + NEW.seat_count WHERE id = NEW.production_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE public.productions SET seats_sold = GREATEST(0, seats_sold - OLD.seat_count) WHERE id = OLD.production_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

-- ---------- 5. Tickets: server-authoritative booking ----------

DROP POLICY IF EXISTS "Users book own tickets"   ON public.tickets;
DROP POLICY IF EXISTS "Users cancel own tickets" ON public.tickets;
REVOKE INSERT, UPDATE ON public.tickets FROM authenticated;

ALTER TABLE public.tickets
  DROP CONSTRAINT IF EXISTS tickets_amounts_valid,
  DROP CONSTRAINT IF EXISTS tickets_seat_count_max;
ALTER TABLE public.tickets
  ADD CONSTRAINT tickets_amounts_valid CHECK (unit_price >= 0 AND total_price >= 0),
  ADD CONSTRAINT tickets_seat_count_max CHECK (seat_count BETWEEN 1 AND 20);

CREATE INDEX IF NOT EXISTS idx_tickets_user       ON public.tickets (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_production ON public.tickets (production_id);

CREATE OR REPLACE FUNCTION public.book_ticket(_production_id uuid, _seat_count integer)
RETURNS public.tickets LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  prod public.productions%ROWTYPE;
  code text;
  new_ticket public.tickets%ROWTYPE;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  IF NOT public.is_active_user(uid) THEN RAISE EXCEPTION 'account is not active'; END IF;
  IF _seat_count IS NULL OR _seat_count < 1 OR _seat_count > 10 THEN
    RAISE EXCEPTION 'seat count must be between 1 and 10';
  END IF;

  -- Atomic: lock the production row for the whole transaction.
  SELECT * INTO prod FROM public.productions WHERE id = _production_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'production not found'; END IF;
  IF NOT prod.is_published THEN RAISE EXCEPTION 'this show is not open for booking'; END IF;
  IF prod.status IN ('draft','cancelled','archived') THEN
    RAISE EXCEPTION 'this show is not open for booking';
  END IF;
  IF prod.show_date IS NOT NULL AND prod.show_date < CURRENT_DATE THEN
    RAISE EXCEPTION 'this show has already taken place';
  END IF;
  IF prod.group_id = uid THEN RAISE EXCEPTION 'you cannot book your own production'; END IF;
  IF COALESCE(prod.max_seats,0) - prod.seats_sold < _seat_count THEN
    RAISE EXCEPTION 'only % seat(s) remain', GREATEST(0, COALESCE(prod.max_seats,0) - prod.seats_sold);
  END IF;

  code := 'MN-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10));

  INSERT INTO public.tickets (production_id, user_id, seat_count, unit_price, total_price, booking_code, status)
  VALUES (_production_id, uid, _seat_count,
          COALESCE(prod.ticket_price, 0),
          COALESCE(prod.ticket_price, 0) * _seat_count,
          code, 'confirmed')
  RETURNING * INTO new_ticket;

  INSERT INTO public.notifications (user_id, type, title, body, link) VALUES
    (uid, 'booking', 'Booking confirmed · ' || prod.title,
     _seat_count || ' seat(s) · code ' || code, '/dashboard/audience/tickets'),
    (prod.group_id, 'booking', 'New booking · ' || prod.title,
     _seat_count || ' seat(s)', '/dashboard/group/productions');

  RETURN new_ticket;
END $$;
REVOKE ALL ON FUNCTION public.book_ticket(uuid, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_ticket(uuid, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.cancel_ticket(_ticket_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  t public.tickets%ROWTYPE;
  prod public.productions%ROWTYPE;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  SELECT * INTO t FROM public.tickets WHERE id = _ticket_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ticket not found'; END IF;
  SELECT * INTO prod FROM public.productions WHERE id = t.production_id;

  IF NOT (t.user_id = uid OR prod.group_id = uid OR public.has_role(uid, 'admin')) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  IF t.status <> 'confirmed' THEN RAISE EXCEPTION 'ticket is not active'; END IF;
  IF prod.show_date IS NOT NULL AND prod.show_date < CURRENT_DATE
     AND NOT public.has_role(uid, 'admin') THEN
    RAISE EXCEPTION 'past shows cannot be cancelled';
  END IF;

  UPDATE public.tickets SET status = 'cancelled' WHERE id = _ticket_id;
  PERFORM public.log_security_event('ticket.cancel', 'tickets', _ticket_id,
    jsonb_build_object('by', uid, 'owner', t.user_id));
END $$;
REVOKE ALL ON FUNCTION public.cancel_ticket(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.cancel_ticket(uuid) TO authenticated;

-- ---------- 6. Funding: server-authoritative contributions ----------

DROP POLICY IF EXISTS "Groups create campaigns" ON public.funding_campaigns;
CREATE POLICY "Groups create campaigns" ON public.funding_campaigns
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = group_id
    AND public.is_active_user(auth.uid())
    AND (public.has_role(auth.uid(), 'theatre_group') OR public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Users create own contributions" ON public.funding_contributions;
REVOKE INSERT ON public.funding_contributions FROM authenticated;

ALTER TABLE public.funding_campaigns
  DROP CONSTRAINT IF EXISTS campaigns_amounts_valid,
  DROP CONSTRAINT IF EXISTS campaigns_text_limits;
ALTER TABLE public.funding_campaigns
  ADD CONSTRAINT campaigns_amounts_valid CHECK (
    goal_amount >= 0 AND goal_amount <= 1000000000 AND raised_amount >= 0),
  ADD CONSTRAINT campaigns_text_limits CHECK (
    length(title) BETWEEN 1 AND 200
    AND length(COALESCE(description,'')) <= 5000
    AND length(COALESCE(purpose,'')) <= 500);

ALTER TABLE public.funding_contributions
  DROP CONSTRAINT IF EXISTS contributions_amount_bounds,
  DROP CONSTRAINT IF EXISTS contributions_message_limit;
ALTER TABLE public.funding_contributions
  ADD CONSTRAINT contributions_amount_bounds CHECK (amount >= 50 AND amount <= 1000000),
  ADD CONSTRAINT contributions_message_limit CHECK (length(COALESCE(message,'')) <= 500);

CREATE INDEX IF NOT EXISTS idx_contrib_campaign ON public.funding_contributions (campaign_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contrib_user     ON public.funding_contributions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_campaigns_group  ON public.funding_campaigns (group_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.guard_campaign_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.group_id <> OLD.group_id THEN
    RAISE EXCEPTION 'campaign ownership is immutable';
  END IF;
  IF NEW.raised_amount IS DISTINCT FROM OLD.raised_amount
     AND pg_trigger_depth() < 2
     AND COALESCE(current_setting('mancha.internal', true), 'off') <> 'on' THEN
    NEW.raised_amount := OLD.raised_amount;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS campaigns_guard_update ON public.funding_campaigns;
CREATE TRIGGER campaigns_guard_update
  BEFORE UPDATE ON public.funding_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.guard_campaign_update();

CREATE OR REPLACE FUNCTION public.sync_campaign_raised()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.funding_campaigns SET raised_amount = raised_amount + NEW.amount WHERE id = NEW.campaign_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.funding_campaigns SET raised_amount = GREATEST(0, raised_amount - OLD.amount) WHERE id = OLD.campaign_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

-- NOTE: simulated contribution. No real payment processing is performed.
CREATE OR REPLACE FUNCTION public.contribute_to_campaign(
  _campaign_id uuid, _amount numeric, _message text DEFAULT NULL, _is_anonymous boolean DEFAULT false
) RETURNS public.funding_contributions LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  c public.funding_campaigns%ROWTYPE;
  row_out public.funding_contributions%ROWTYPE;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'authentication required'; END IF;
  IF NOT public.is_active_user(uid) THEN RAISE EXCEPTION 'account is not active'; END IF;
  IF _amount IS NULL OR _amount < 50 OR _amount > 1000000 THEN
    RAISE EXCEPTION 'contribution must be between 50 and 1,000,000';
  END IF;
  IF length(COALESCE(_message,'')) > 500 THEN RAISE EXCEPTION 'message too long'; END IF;

  SELECT * INTO c FROM public.funding_campaigns WHERE id = _campaign_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'campaign not found'; END IF;
  IF c.status <> 'active' THEN RAISE EXCEPTION 'this campaign is closed'; END IF;
  IF c.deadline IS NOT NULL AND c.deadline < CURRENT_DATE THEN
    RAISE EXCEPTION 'this campaign has ended';
  END IF;
  IF c.group_id = uid THEN RAISE EXCEPTION 'you cannot fund your own campaign'; END IF;

  INSERT INTO public.funding_contributions (campaign_id, user_id, amount, message, is_anonymous)
  VALUES (_campaign_id, uid, round(_amount, 2), NULLIF(_message,''), COALESCE(_is_anonymous,false))
  RETURNING * INTO row_out;

  INSERT INTO public.notifications (user_id, type, title, body, link) VALUES
    (c.group_id, 'funding', 'New contribution · ' || c.title,
     'A supporter contributed to your campaign.', '/dashboard/group/funding');

  RETURN row_out;
END $$;
REVOKE ALL ON FUNCTION public.contribute_to_campaign(uuid, numeric, text, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.contribute_to_campaign(uuid, numeric, text, boolean) TO authenticated;

-- ---------- 7. Reviews: validated targets, length limits ----------

ALTER TABLE public.reviews
  DROP CONSTRAINT IF EXISTS reviews_comment_limit;
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_comment_limit CHECK (length(COALESCE(comment,'')) <= 2000);

CREATE INDEX IF NOT EXISTS idx_reviews_target ON public.reviews (target_type, target_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.validate_review_target()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_active_user(NEW.user_id) THEN
    RAISE EXCEPTION 'account is not active';
  END IF;
  IF NEW.target_type = 'production' THEN
    IF NOT EXISTS (SELECT 1 FROM public.productions
                   WHERE id = NEW.target_id AND is_published) THEN
      RAISE EXCEPTION 'you can only review a published production';
    END IF;
    IF EXISTS (SELECT 1 FROM public.productions
               WHERE id = NEW.target_id AND group_id = NEW.user_id) THEN
      RAISE EXCEPTION 'you cannot review your own production';
    END IF;
  ELSIF NEW.target_type = 'group' THEN
    IF NOT EXISTS (SELECT 1 FROM public.profiles
                   WHERE id = NEW.target_id AND primary_role = 'theatre_group' AND status = 'active') THEN
      RAISE EXCEPTION 'unknown theatre group';
    END IF;
    IF NEW.target_id = NEW.user_id THEN
      RAISE EXCEPTION 'you cannot review yourself';
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS reviews_validate_target ON public.reviews;
CREATE TRIGGER reviews_validate_target
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.validate_review_target();

-- ---------- 8. Notifications: no user-forged notifications ----------

DROP POLICY IF EXISTS "Users insert own notifications" ON public.notifications;
REVOKE INSERT ON public.notifications FROM authenticated;

ALTER TABLE public.notifications
  DROP CONSTRAINT IF EXISTS notifications_text_limits;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_text_limits CHECK (
    length(title) BETWEEN 1 AND 200
    AND length(COALESCE(body,'')) <= 1000
    AND length(COALESCE(link,'')) <= 300);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications (user_id, created_at DESC);

-- Restrict the read-own UPDATE policy to the `read` flag only via a guard.
CREATE OR REPLACE FUNCTION public.guard_notification_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.user_id := OLD.user_id;
  NEW.type    := OLD.type;
  NEW.title   := OLD.title;
  NEW.body    := OLD.body;
  NEW.link    := OLD.link;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS notifications_guard_update ON public.notifications;
CREATE TRIGGER notifications_guard_update
  BEFORE UPDATE ON public.notifications
  FOR EACH ROW EXECUTE FUNCTION public.guard_notification_update();

-- ---------- 9. Signup trigger: never trust client metadata for admin ----------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  meta            JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  role_text       TEXT  := lower(COALESCE(meta->>'role', 'audience'));
  chosen_role     public.app_role;
  org_type_text   TEXT  := NULLIF(meta->>'organization_type', '');
  chosen_org_type public.organization_type;
  new_status      public.account_status;
BEGIN
  IF role_text = 'admin' OR role_text NOT IN
     ('audience','theatre_group','theatre_artist','organization') THEN
    chosen_role := 'audience';
  ELSE
    chosen_role := role_text::public.app_role;
  END IF;

  IF org_type_text IS NOT NULL
     AND org_type_text IN ('corporate','university','tourism_board','film_ott') THEN
    chosen_org_type := org_type_text::public.organization_type;
  ELSE
    chosen_org_type := NULL;
  END IF;

  new_status := CASE WHEN chosen_role = 'audience' THEN 'active' ELSE 'pending' END;

  INSERT INTO public.profiles (
    id, email, full_name, phone, primary_role,
    organization_type, organization_name, status
  ) VALUES (
    NEW.id, NEW.email,
    left(NULLIF(meta->>'full_name', ''), 120),
    left(NULLIF(meta->>'phone', ''), 30),
    chosen_role,
    CASE WHEN chosen_role = 'organization' THEN chosen_org_type ELSE NULL END,
    CASE WHEN chosen_role IN ('organization','theatre_group')
         THEN left(NULLIF(meta->>'organization_name', ''), 200) ELSE NULL END,
    new_status
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, chosen_role) ON CONFLICT DO NOTHING;

  RETURN NEW;
END $$;