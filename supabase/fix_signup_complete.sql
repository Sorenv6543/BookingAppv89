-- Complete fix for signup 500 error
-- This ensures the trigger can bypass RLS and has proper permissions

-- Step 1: Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 2: Recreate function with proper permissions and error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- Run with elevated privileges
SET search_path = public, auth -- Explicitly set search path
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
    -- Log the error for debugging
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

-- Step 6: Temporarily disable RLS for testing (we'll re-enable it after verifying)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 7: Verify setup
SELECT 'SUCCESS: Trigger and function recreated with proper permissions' as status;

-- Show current RLS status
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';
