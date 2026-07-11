
-- =========================================================================
-- ENUMS
-- =========================================================================
CREATE TYPE public.production_status AS ENUM ('draft','upcoming','live','completed','archived','cancelled');
CREATE TYPE public.ticket_status     AS ENUM ('confirmed','cancelled','used');
CREATE TYPE public.campaign_status   AS ENUM ('active','completed','closed');
CREATE TYPE public.review_target     AS ENUM ('production','group','training');
CREATE TYPE public.notification_type AS ENUM (
  'application','approval','booking','funding','meetup','training','collaboration','sponsorship','review','system'
);

-- =========================================================================
-- UPDATED_AT HELPER (reuse public.set_updated_at if exists)
-- =========================================================================
-- set_updated_at already exists per project context.

-- =========================================================================
-- PRODUCTIONS
-- =========================================================================
CREATE TABLE public.productions (
  id               UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  description      TEXT,
  genre            TEXT,
  language         TEXT DEFAULT 'Bangla',
  duration_min     INT  DEFAULT 90,
  venue            TEXT,
  show_date        DATE,
  show_time        TIME,
  poster_url       TEXT,
  youtube_url      TEXT,
  cast_list        JSONB DEFAULT '[]'::jsonb,
  crew_list        JSONB DEFAULT '[]'::jsonb,
  ticket_price     NUMERIC(10,2) DEFAULT 0,
  livestream_price NUMERIC(10,2) DEFAULT 0,
  archive_price    NUMERIC(10,2) DEFAULT 0,
  max_seats        INT DEFAULT 100,
  seats_sold       INT NOT NULL DEFAULT 0,
  status           public.production_status NOT NULL DEFAULT 'draft',
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.productions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.productions TO authenticated;
GRANT ALL ON public.productions TO service_role;
ALTER TABLE public.productions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published productions"
  ON public.productions FOR SELECT
  USING (is_published = TRUE OR auth.uid() = group_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Groups manage own productions"
  ON public.productions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = group_id);

CREATE POLICY "Groups update own productions"
  ON public.productions FOR UPDATE TO authenticated
  USING (auth.uid() = group_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = group_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Groups delete own productions"
  ON public.productions FOR DELETE TO authenticated
  USING (auth.uid() = group_id OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER productions_set_updated_at
  BEFORE UPDATE ON public.productions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX productions_group_idx ON public.productions(group_id);
CREATE INDEX productions_status_idx ON public.productions(status);

-- =========================================================================
-- TICKETS
-- =========================================================================
CREATE TABLE public.tickets (
  id             UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  production_id  UUID NOT NULL REFERENCES public.productions(id) ON DELETE CASCADE,
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seat_count     INT  NOT NULL DEFAULT 1 CHECK (seat_count > 0),
  unit_price     NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_price    NUMERIC(10,2) NOT NULL DEFAULT 0,
  booking_code   TEXT NOT NULL UNIQUE,
  status         public.ticket_status NOT NULL DEFAULT 'confirmed',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.tickets TO authenticated;
GRANT ALL ON public.tickets TO service_role;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own tickets"
  ON public.tickets FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(),'admin')
    OR EXISTS (SELECT 1 FROM public.productions p WHERE p.id = production_id AND p.group_id = auth.uid())
  );

CREATE POLICY "Users book own tickets"
  ON public.tickets FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users cancel own tickets"
  ON public.tickets FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER tickets_set_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX tickets_user_idx ON public.tickets(user_id);
CREATE INDEX tickets_prod_idx ON public.tickets(production_id);

-- Auto-maintain seats_sold
CREATE OR REPLACE FUNCTION public.sync_production_seats()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
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

CREATE TRIGGER tickets_sync_seats
  AFTER INSERT OR UPDATE OR DELETE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.sync_production_seats();

-- =========================================================================
-- FUNDING CAMPAIGNS
-- =========================================================================
CREATE TABLE public.funding_campaigns (
  id             UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  production_id  UUID REFERENCES public.productions(id) ON DELETE SET NULL,
  title          TEXT NOT NULL,
  description    TEXT,
  purpose        TEXT,
  cover_url      TEXT,
  goal_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
  raised_amount  NUMERIC(12,2) NOT NULL DEFAULT 0,
  deadline       DATE,
  status         public.campaign_status NOT NULL DEFAULT 'active',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.funding_campaigns TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.funding_campaigns TO authenticated;
GRANT ALL ON public.funding_campaigns TO service_role;
ALTER TABLE public.funding_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view campaigns"
  ON public.funding_campaigns FOR SELECT USING (TRUE);

CREATE POLICY "Groups create campaigns"
  ON public.funding_campaigns FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = group_id);

CREATE POLICY "Groups update own campaigns"
  ON public.funding_campaigns FOR UPDATE TO authenticated
  USING (auth.uid() = group_id OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (auth.uid() = group_id OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Groups delete own campaigns"
  ON public.funding_campaigns FOR DELETE TO authenticated
  USING (auth.uid() = group_id OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER funding_campaigns_set_updated_at
  BEFORE UPDATE ON public.funding_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================================
-- FUNDING CONTRIBUTIONS
-- =========================================================================
CREATE TABLE public.funding_contributions (
  id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id   UUID NOT NULL REFERENCES public.funding_campaigns(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount        NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  message       TEXT,
  is_anonymous  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.funding_contributions TO authenticated;
GRANT ALL ON public.funding_contributions TO service_role;
ALTER TABLE public.funding_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View contributions if owner/self/admin"
  ON public.funding_contributions FOR SELECT TO authenticated
  USING (
    auth.uid() = user_id
    OR public.has_role(auth.uid(),'admin')
    OR EXISTS (SELECT 1 FROM public.funding_campaigns c WHERE c.id = campaign_id AND c.group_id = auth.uid())
  );

CREATE POLICY "Users create own contributions"
  ON public.funding_contributions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Auto-maintain raised_amount
CREATE OR REPLACE FUNCTION public.sync_campaign_raised()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.funding_campaigns SET raised_amount = raised_amount + NEW.amount WHERE id = NEW.campaign_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.funding_campaigns SET raised_amount = GREATEST(0, raised_amount - OLD.amount) WHERE id = OLD.campaign_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END $$;

CREATE TRIGGER funding_sync_raised
  AFTER INSERT OR DELETE ON public.funding_contributions
  FOR EACH ROW EXECUTE FUNCTION public.sync_campaign_raised();

CREATE INDEX contrib_campaign_idx ON public.funding_contributions(campaign_id);
CREATE INDEX contrib_user_idx     ON public.funding_contributions(user_id);

-- =========================================================================
-- REVIEWS
-- =========================================================================
CREATE TABLE public.reviews (
  id           UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_type  public.review_target NOT NULL,
  target_id    UUID NOT NULL,
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating       INT  NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (target_type, target_id, user_id)
);

GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view reviews" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users write own reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own reviews"  ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users/admin delete reviews" ON public.reviews FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER reviews_set_updated_at
  BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX reviews_target_idx ON public.reviews(target_type, target_id);

-- =========================================================================
-- REVIEW REPLIES
-- =========================================================================
CREATE TABLE public.review_replies (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id  UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.review_replies TO anon;
GRANT SELECT, INSERT, DELETE ON public.review_replies TO authenticated;
GRANT ALL ON public.review_replies TO service_role;
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view replies" ON public.review_replies FOR SELECT USING (TRUE);
CREATE POLICY "Owners reply" ON public.review_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners delete own reply" ON public.review_replies FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- =========================================================================
-- NOTIFICATIONS
-- =========================================================================
CREATE TABLE public.notifications (
  id         UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       public.notification_type NOT NULL DEFAULT 'system',
  title      TEXT NOT NULL,
  body       TEXT,
  link       TEXT,
  read       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own notifications" ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users insert own notifications" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users mark own notifications" ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications" ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE INDEX notif_user_idx ON public.notifications(user_id, read, created_at DESC);
