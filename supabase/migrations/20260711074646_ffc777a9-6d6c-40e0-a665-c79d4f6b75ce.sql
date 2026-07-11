
-- =========================================================
-- Enums
-- =========================================================
CREATE TYPE public.app_role AS ENUM (
  'admin',
  'theatre_group',
  'theatre_artist',
  'audience',
  'organization'
);

CREATE TYPE public.organization_type AS ENUM (
  'corporate',
  'university',
  'tourism_board',
  'film_ott'
);

CREATE TYPE public.account_status AS ENUM (
  'active',
  'pending',
  'suspended'
);

-- =========================================================
-- profiles
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  primary_role public.app_role NOT NULL DEFAULT 'audience',
  organization_type public.organization_type,
  organization_name TEXT,
  status public.account_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- user_roles (roles live in their own table — never on profiles)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- has_role — SECURITY DEFINER so RLS policies don't recurse
-- =========================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========================================================
-- updated_at trigger
-- =========================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- =========================================================
-- Signup handler — creates profile + user_roles row
-- Reads role / org data from raw_user_meta_data supplied at signUp.
-- Audience becomes active immediately; every other role starts pending.
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  meta            JSONB := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb);
  role_text       TEXT  := lower(COALESCE(meta->>'role', 'audience'));
  chosen_role     public.app_role;
  org_type_text   TEXT  := NULLIF(meta->>'organization_type', '');
  chosen_org_type public.organization_type;
  new_status      public.account_status;
BEGIN
  -- Never allow self-signup as admin.
  IF role_text = 'admin' OR role_text NOT IN (
    'audience', 'theatre_group', 'theatre_artist', 'organization'
  ) THEN
    chosen_role := 'audience';
  ELSE
    chosen_role := role_text::public.app_role;
  END IF;

  IF org_type_text IS NOT NULL
     AND org_type_text IN ('corporate', 'university', 'tourism_board', 'film_ott') THEN
    chosen_org_type := org_type_text::public.organization_type;
  ELSE
    chosen_org_type := NULL;
  END IF;

  IF chosen_role = 'audience' THEN
    new_status := 'active';
  ELSE
    new_status := 'pending';
  END IF;

  INSERT INTO public.profiles (
    id, email, full_name, phone, primary_role,
    organization_type, organization_name, status
  ) VALUES (
    NEW.id,
    NEW.email,
    NULLIF(meta->>'full_name', ''),
    NULLIF(meta->>'phone', ''),
    chosen_role,
    CASE WHEN chosen_role = 'organization' THEN chosen_org_type ELSE NULL END,
    CASE WHEN chosen_role IN ('organization', 'theatre_group')
         THEN NULLIF(meta->>'organization_name', '') ELSE NULL END,
    new_status
  );

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, chosen_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- RLS policies — profiles
-- =========================================================
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =========================================================
-- RLS policies — user_roles
-- =========================================================
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
