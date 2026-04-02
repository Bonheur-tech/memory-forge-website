-- Add email column to user_roles so staff list doesn't need auth.users access
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS email TEXT;
