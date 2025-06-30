# Manual Supabase Database Setup

If you prefer to apply the database schema manually instead of using the migration script, follow these steps:

## Step 1: Access Supabase SQL Editor

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/yplrudursbvzcdaroqly
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **"New Query"**

## Step 2: Apply Schema Migration

Copy and paste the contents of `supabase/migrations/001_initial_schema_final.sql` into the SQL editor and click **"Run"**.

This will create:
- `user_role` enum type (fixing the current error)
- `user_profiles`, `properties`, and `bookings` tables
- All necessary indexes and triggers

## Step 3: Apply RLS Policies

Copy and paste the contents of `supabase/migrations/002_rls_policies_fixed.sql` into a new query and click **"Run"**.

This will create:
- Row Level Security policies for multi-tenant access
- Helper functions for role-based filtering
- Security constraints

## Step 4: Verify Setup

Run this query to verify the setup worked:

```sql
-- Check if user_role type exists
SELECT typname FROM pg_type WHERE typname = 'user_role';

-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_profiles', 'properties', 'bookings');

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'properties', 'bookings');
```

You should see:
- ✅ `user_role` type exists
- ✅ All 3 tables exist
- ✅ RLS is enabled (`rowsecurity = true`) on all tables

## Troubleshooting

If you get errors during migration:
- Some statements might fail if they already exist (this is normal)
- Focus on the main error: "user_role does not exist" should be resolved
- If you still get the error, ensure the first migration (schema) completed successfully

## Alternative: Quick Fix

If you only want to fix the immediate error, run this minimal SQL:

```sql
-- Create the missing user_role type
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'cleaner');

-- Create user_profiles table (minimal version)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create trigger to auto-create profiles
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'owner'::user_role)
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER IF NOT EXISTS create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();
```

This minimal setup should resolve the "user_role does not exist" error and allow user registration to work. 