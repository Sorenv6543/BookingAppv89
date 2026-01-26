# Fix Signup 500 Error - Step-by-Step Instructions

## Problem
User signup fails with a 500 error: "Database error saving new user"

## Root Cause (Confirmed by Supabase AI)
**ERROR: type "user_role" does not exist (SQLSTATE 42704)**

The enum types were never created in the database:
- `user_role` - Missing! (causes the signup failure)
- `booking_type`, `booking_status`, `property_type`, `pricing_tier`, `priority_level`, `theme_preference` - Also likely missing

When the `handle_new_user()` trigger tries to insert into `user_profiles` with `role::user_role`, PostgreSQL cannot find the enum type and the transaction fails.

**Secondary Issues:**
- Missing `SECURITY DEFINER` (runs with caller's privileges instead of elevated privileges)
- Missing `SET search_path` (schema resolution issues)
- Missing exception handling (generic error messages)
- Missing proper grants (lacks execute permissions)

## Solution - Apply This Fix

### Step 1: Open Supabase SQL Editor

Go to: **https://supabase.com/dashboard/project/otmfvzkokrxduipxkyga/sql/new**

### Step 2: Copy and Run the Complete Fix Script

**UPDATED FIX:** Copy **ALL** contents from: `supabase/FIX_MISSING_ENUMS.sql`

This script will:
1. **Create all missing enum types** (user_role, booking_type, etc.)
2. **Fix the trigger function** with proper security configuration
3. **Re-enable RLS**
4. **Verify everything is working**

Or paste this directly:

```sql
-- ============================================================================
-- COMPLETE FIX FOR SIGNUP 500 ERROR
-- ============================================================================

-- ============================================================================
-- CREATE MISSING ENUM TYPES (idempotent - safe to run multiple times)
-- ============================================================================

-- Create user_role enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('owner', 'manager', 'staff', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create booking_type enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE booking_type AS ENUM ('standard', 'turn');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create booking_status enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create property_type enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE property_type AS ENUM ('apartment', 'house', 'condo', 'villa', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Create priority_level enum if it doesn't exist
DO $$ BEGIN
  CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- DROP EXISTING TRIGGER AND FUNCTION
-- ============================================================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with proper security configuration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- Run with elevated privileges (bypasses RLS)
SET search_path = public, auth -- Explicitly set schema search path
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'owner'::user_role),
    NEW.raw_user_meta_data->>'company_name'
  );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    RAISE;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Set postgres ownership
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Verification queries
SELECT
    trigger_name,
    event_manipulation,
    event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

SELECT '✅ SUCCESS: Trigger function updated!' as status;
```

### Step 3: Verify the Fix Was Applied

After running the script, you should see:

1. **Trigger verification** - Shows `on_auth_user_created` trigger on `auth.users`
2. **RLS status** - Shows `rls_enabled: true` for `user_profiles`
3. **Success message** - "✅ SUCCESS: Trigger function updated!"

### Step 4: Test Signup

1. Navigate to: **http://localhost:3000/auth/register**
2. Fill in the registration form:
   - **Email:** Your email address
   - **Password:** At least 8 characters
   - **Name:** Your full name
   - **Account Type:** Select "Property Owner"
   - **Company Name:** Your company name
3. Click "Create Account"
4. **Expected result:** No 500 error, redirects to login or dashboard

### Step 5: Verify User Was Created

Run this query in Supabase SQL Editor:

```sql
-- Check user profiles were created
SELECT
    id,
    email,
    name,
    role,
    company_name,
    created_at
FROM user_profiles
ORDER BY created_at DESC
LIMIT 5;

-- Check auth users exist
SELECT
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

You should see your newly created user in both tables.

## What Changed

### Before (Broken)
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role, company_name)
  VALUES (...);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Problems:**
- Missing `SET search_path`
- No exception handling
- No explicit grants
- No postgres ownership

### After (Fixed)
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public, auth
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (...)
  VALUES (...);
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error: % %', SQLERRM, SQLSTATE;
    RAISE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
```

**Improvements:**
- ✅ `SET search_path` - Explicit schema resolution
- ✅ Exception handling - Detailed error logging
- ✅ Proper grants - authenticated + service_role
- ✅ Postgres ownership - Superuser privileges

## Troubleshooting

### If signup still fails:

1. **Check Supabase logs:**
   - Go to: https://supabase.com/dashboard/project/otmfvzkokrxduipxkyga/logs
   - Look for errors mentioning "handle_new_user"

2. **Verify trigger exists:**
   ```sql
   SELECT * FROM information_schema.triggers
   WHERE trigger_name = 'on_auth_user_created';
   ```

3. **Check function security:**
   ```sql
   SELECT proname, prosecdef, proconfig
   FROM pg_proc
   WHERE proname = 'handle_new_user';
   ```
   - `prosecdef` should be `true` (SECURITY DEFINER)
   - `proconfig` should include `{search_path=public,auth}`

4. **Verify trigger function exists and has correct configuration:**
   ```sql
   -- Check that handle_new_user function exists with proper security settings
   SELECT 
       proname,
       prosecdef as "SECURITY DEFINER",
       proconfig as "config (should contain search_path)",
       prokind
   FROM pg_proc
   WHERE proname = 'handle_new_user';
   ```
   
   **Expected output:**
   - `proname`: `handle_new_user`
   - `SECURITY DEFINER`: `true` (function runs with elevated privileges)
   - `config`: Should contain `{search_path=public,auth}` (explicit schema resolution)
   - `prokind`: `f` (normal function)

### If you see "permission denied" errors:

The function may not have proper ownership. Run:
```sql
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
```

## Next Steps

After signup works:

1. ✅ Commit updated `supabase/combined_migration.sql` to git
2. ✅ Test login with newly created user
3. ✅ Verify role-based access works (Owner dashboard)
4. ✅ Update `SUPABASE_SETUP_INSTRUCTIONS.md` with this fix

## Files Updated

- ✅ `supabase/APPLY_THIS_FIX.sql` - Complete fix script
- ✅ `supabase/combined_migration.sql` - Updated with proper trigger configuration
- ✅ `FIX_SIGNUP_ERROR.md` - This document
