-- ============================================================================
-- COMPLETE FIX: Create Missing Enum Types + Fix Trigger Function
-- ============================================================================
-- Root Cause: The user_role enum type (and possibly others) were never created
-- This causes: "ERROR: type 'user_role' does not exist (SQLSTATE 42704)"
-- When: The handle_new_user trigger tries to insert into user_profiles
-- ============================================================================

-- Step 1: Create all enum types (with IF NOT EXISTS equivalent using DO block)
DO $$
BEGIN
    -- Create user_role enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('owner', 'admin', 'cleaner');
        RAISE NOTICE 'Created enum type: user_role';
    ELSE
        RAISE NOTICE 'Enum type user_role already exists';
    END IF;

    -- Create booking_type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_type') THEN
        CREATE TYPE booking_type AS ENUM ('standard', 'turn');
        RAISE NOTICE 'Created enum type: booking_type';
    ELSE
        RAISE NOTICE 'Enum type booking_type already exists';
    END IF;

    -- Create booking_status enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled');
        RAISE NOTICE 'Created enum type: booking_status';
    ELSE
        RAISE NOTICE 'Enum type booking_status already exists';
    END IF;

    -- Create property_type enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'property_type') THEN
        CREATE TYPE property_type AS ENUM ('apartment', 'house', 'condo', 'townhouse');
        RAISE NOTICE 'Created enum type: property_type';
    ELSE
        RAISE NOTICE 'Enum type property_type already exists';
    END IF;

    -- Create pricing_tier enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'pricing_tier') THEN
        CREATE TYPE pricing_tier AS ENUM ('basic', 'standard', 'premium', 'luxury');
        RAISE NOTICE 'Created enum type: pricing_tier';
    ELSE
        RAISE NOTICE 'Enum type pricing_tier already exists';
    END IF;

    -- Create priority_level enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'priority_level') THEN
        CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');
        RAISE NOTICE 'Created enum type: priority_level';
    ELSE
        RAISE NOTICE 'Enum type priority_level already exists';
    END IF;

    -- Create theme_preference enum
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theme_preference') THEN
        CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');
        RAISE NOTICE 'Created enum type: theme_preference';
    ELSE
        RAISE NOTICE 'Enum type theme_preference already exists';
    END IF;
END $$;

-- Step 2: Drop existing trigger and function (if they exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Recreate function with proper security configuration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- Run with elevated privileges (bypasses RLS)
SET search_path = public, auth -- Explicitly set schema search path
LANGUAGE plpgsql
AS $$
BEGIN
  -- Insert into user_profiles with explicit schema reference
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
    -- Log the error for debugging (visible in Supabase logs)
    RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
    -- Re-raise to prevent user creation if profile creation fails
    RAISE;
END;
$$;

-- Step 4: Grant execute permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Step 5: Ensure the function owner has the right permissions
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Step 6: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Re-enable RLS on user_profiles (if it was disabled)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify all enum types exist
SELECT
    typname as enum_name,
    array_agg(enumlabel ORDER BY enumsortorder) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
WHERE typname IN ('user_role', 'booking_type', 'booking_status', 'property_type', 'pricing_tier', 'priority_level', 'theme_preference')
GROUP BY typname
ORDER BY typname;

-- Verify trigger exists and is active
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Verify function has SECURITY DEFINER and proper configuration
SELECT
    p.proname as function_name,
    CASE WHEN p.prosecdef THEN 'SECURITY DEFINER' ELSE 'SECURITY INVOKER' END as security_type,
    p.proconfig as function_config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'handle_new_user';

-- Verify RLS is enabled
SELECT
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

-- Show success message
SELECT '✅ SUCCESS: All enum types created and trigger function fixed!' as status;
SELECT '📝 Next: Test signup at http://localhost:3000/auth/register' as next_step;
