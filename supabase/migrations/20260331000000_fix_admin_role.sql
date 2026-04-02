-- ============================================================
-- Fix: Assign super_admin role to admin@gmail.com by email
-- and extend all RLS policies to cover super_admin
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Confirm email and assign super_admin role to admin@gmail.com
UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, now()),
  updated_at         = now()
WHERE email = 'admin@gmail.com';

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::app_role
FROM auth.users
WHERE email = 'admin@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- 2. user_roles: add SELECT for super_admin, INSERT and DELETE for admins
DROP POLICY IF EXISTS "Super admins can view all roles"   ON public.user_roles;
CREATE POLICY "Super admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Admins can insert roles"           ON public.user_roles;
CREATE POLICY "Admins can insert roles" ON public.user_roles
  FOR INSERT WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

DROP POLICY IF EXISTS "Admins can delete roles"           ON public.user_roles;
CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

-- 3. submissions: extend all policies to include super_admin
DROP POLICY IF EXISTS "Super admins can view submissions"   ON public.submissions;
CREATE POLICY "Super admins can view submissions" ON public.submissions
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins can update submissions" ON public.submissions;
CREATE POLICY "Super admins can update submissions" ON public.submissions
  FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins can delete submissions" ON public.submissions;
CREATE POLICY "Super admins can delete submissions" ON public.submissions
  FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- 4. messages: extend all policies to include super_admin
DROP POLICY IF EXISTS "Super admins can view messages"   ON public.messages;
CREATE POLICY "Super admins can view messages" ON public.messages
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins can update messages" ON public.messages;
CREATE POLICY "Super admins can update messages" ON public.messages
  FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins can delete messages" ON public.messages;
CREATE POLICY "Super admins can delete messages" ON public.messages
  FOR DELETE USING (public.has_role(auth.uid(), 'super_admin'));

-- 5. competition_settings: extend to include super_admin
DROP POLICY IF EXISTS "Super admins can update settings" ON public.competition_settings;
CREATE POLICY "Super admins can update settings" ON public.competition_settings
  FOR UPDATE USING (public.has_role(auth.uid(), 'super_admin'));

DROP POLICY IF EXISTS "Super admins can insert settings" ON public.competition_settings;
CREATE POLICY "Super admins can insert settings" ON public.competition_settings
  FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'super_admin'));
