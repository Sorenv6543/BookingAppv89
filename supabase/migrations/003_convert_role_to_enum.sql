-- Convert users.role from varchar to user_role enum
ALTER TABLE users
  ALTER COLUMN role TYPE user_role
  USING role::user_role; 