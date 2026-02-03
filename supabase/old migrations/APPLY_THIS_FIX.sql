-- ============================================================================
-- COMPLETE FIX FOR SIGNUP 500 ERROR
-- ============================================================================
-- This fixes the "Database error saving new user" issue by properly
-- configuring the handle_new_user() trigger function with:
-- 1. SECURITY DEFINER (elevated privileges)
-- 2. SET search_path (explicit schema resolution)
-- 3. Exception handling (detailed error logging)
-- 4. Proper permissions (authenticated + service_role)
-- 5. Postgres ownership (superuser privileges)
-- ============================================================================

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Recreate function with proper security configuration
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

-- Step 3: Grant execute permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Step 4: Ensure the function owner has the right permissions
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Step 5: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Re-enable RLS on user_profiles (was disabled for testing)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

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
SELECT '✅ SUCCESS: Trigger function updated with proper security configuration!' as status;
SELECT '📝 Next: Test signup at http://localhost:3000/auth/register' as next_step;
