-- Confirm admin user email (bypasses email verification requirement)
UPDATE auth.users
SET
  email_confirmed_at = now(),
  confirmation_token  = '',
  updated_at          = now()
WHERE id = '319ea719-c150-4284-bbf9-ce525d135d89';

-- Grant admin role to the user
INSERT INTO public.user_roles (user_id, role)
VALUES ('319ea719-c150-4284-bbf9-ce525d135d89', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
