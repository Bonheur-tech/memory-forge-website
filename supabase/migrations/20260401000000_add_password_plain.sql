-- Add password_plain to user_roles so super admin can view and manage staff credentials
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS password_plain TEXT;
