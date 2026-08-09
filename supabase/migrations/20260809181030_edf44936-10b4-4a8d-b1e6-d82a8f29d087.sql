-- ---------- Replace SECURITY DEFINER view with a synced directory table ----------
DROP VIEW IF EXISTS public.public_profiles;

CREATE TABLE IF NOT EXISTS public.public_directory (
  id                uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name      text,
  organization_name text,
  primary_role      public.app_role NOT NULL,
  organization_type public.organization_type,
  updated_at        timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.public_directory TO anon, authenticated;
GRANT ALL    ON public.public_directory TO service_role;
ALTER TABLE public.public_directory ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Directory is public" ON public.public_directory;
CREATE POLICY "Directory is public" ON public.public_directory
  FOR SELECT TO anon, authenticated USING (true);
-- no write policies: maintained exclusively by the sync trigger

CREATE INDEX IF NOT EXISTS idx_directory_role ON public.public_directory (primary_role);

CREATE OR REPLACE FUNCTION public.sync_public_directory()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.public_directory WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  IF NEW.status = 'active' THEN
    INSERT INTO public.public_directory
      (id, display_name, organization_name, primary_role, organization_type, updated_at)
    VALUES (NEW.id, NEW.full_name, NEW.organization_name, NEW.primary_role, NEW.organization_type, now())
    ON CONFLICT (id) DO UPDATE SET
      display_name      = EXCLUDED.display_name,
      organization_name = EXCLUDED.organization_name,
      primary_role      = EXCLUDED.primary_role,
      organization_type = EXCLUDED.organization_type,
      updated_at        = now();
  ELSE
    DELETE FROM public.public_directory WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS profiles_sync_directory ON public.profiles;
CREATE TRIGGER profiles_sync_directory
  AFTER INSERT OR UPDATE OR DELETE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_public_directory();

INSERT INTO public.public_directory (id, display_name, organization_name, primary_role, organization_type)
SELECT id, full_name, organization_name, primary_role, organization_type
FROM public.profiles WHERE status = 'active'
ON CONFLICT (id) DO NOTHING;

-- ---------- Internal functions must not be callable by API roles ----------
REVOKE ALL ON FUNCTION public.guard_profile_update()       FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_production_update()    FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_campaign_update()      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_notification_update()  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.validate_review_target()     FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_production_seats()      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_campaign_raised()       FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.sync_public_directory()      FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user()            FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.set_updated_at()             FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.log_security_event(text, text, uuid, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_active_user(uuid)         FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.book_ticket(uuid, integer)   FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.cancel_ticket(uuid)          FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.contribute_to_campaign(uuid, numeric, text, boolean) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_user_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_set_account_status(uuid, public.account_status) FROM PUBLIC, anon;