-- ============================================================
-- Fix: ensure every authenticated user can read their own role
-- (enables the client-side fetchRole fallback for all roles)
-- ============================================================

-- The original migration already has "Users can view own roles"
-- but only for the original enum values (admin, user).
-- Ensure the policy exists and covers all roles.
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Ensure super_admin can also view all roles (for staff management)
DROP POLICY IF EXISTS "Super admins can view all roles" ON public.user_roles;
CREATE POLICY "Super admins can view all roles" ON public.user_roles
  FOR SELECT USING (public.has_role(auth.uid(), 'super_admin'));

-- Ensure get_user_role RPC is callable by all authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;

-- Ensure get_rankings RPC is callable by all authenticated users
GRANT EXECUTE ON FUNCTION public.get_rankings(TEXT) TO authenticated;
