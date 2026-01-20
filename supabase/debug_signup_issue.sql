-- Debug script to identify signup issues
-- Run this in Supabase SQL Editor to diagnose the problem

-- 1. Check if the trigger exists
SELECT
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 2. Check if the function exists
SELECT
    routine_name,
    routine_type,
    security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'handle_new_user';

-- 3. Check RLS policies on user_profiles
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'user_profiles'
ORDER BY policyname;

-- 4. Check if RLS is enabled
SELECT
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'user_profiles';

-- 5. Test if we can manually insert (this will help identify the exact error)
-- NOTE: This is a test - comment out if you don't want to create a test user
/*
DO $$
DECLARE
    test_id UUID := gen_random_uuid();
BEGIN
    -- Try to insert directly
    INSERT INTO public.user_profiles (id, email, name, role, company_name)
    VALUES (
        test_id,
        'test@example.com',
        'Test User',
        'owner'::user_role,
        'Test Company'
    );

    RAISE NOTICE 'SUCCESS: Direct insert worked!';

    -- Clean up test data
    DELETE FROM public.user_profiles WHERE id = test_id;
    RAISE NOTICE 'Test user cleaned up';
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;
*/
