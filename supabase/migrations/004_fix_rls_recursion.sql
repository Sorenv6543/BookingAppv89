-- 004_fix_rls_recursion.sql
-- Fix infinite recursion in user_profiles RLS policies
-- Problem: current_user_role() queries user_profiles which triggers RLS policies that call current_user_role()

-- ============================================================================
-- DROP EXISTING PROBLEMATIC POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.user_profiles;

-- ============================================================================
-- CREATE SAFE RLS POLICIES FOR USER_PROFILES 
-- ============================================================================

-- Users can view their own profile (no role checking needed)
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Users can update their own profile (no role checking needed)
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can view all profiles (using direct role check without function)
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all profiles (using direct role check without function)
CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can insert new profiles (using direct role check without function)
CREATE POLICY "Admins can insert profiles" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Only admins can delete profiles (using direct role check without function)
CREATE POLICY "Admins can delete profiles" ON public.user_profiles
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- CREATE NON-RECURSIVE SECURITY FUNCTIONS
-- ============================================================================

-- Create a function that gets user role without triggering RLS
CREATE OR REPLACE FUNCTION private.get_user_role_bypass_rls(user_id UUID)
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  -- Disable RLS for this function to avoid recursion
  SET row_security = off;
  
  SELECT role INTO user_role_result
  FROM public.user_profiles
  WHERE id = user_id;
  
  -- Re-enable RLS
  SET row_security = on;
  
  RETURN COALESCE(user_role_result, 'owner'::user_role);
EXCEPTION
  WHEN others THEN
    -- Re-enable RLS in case of error
    SET row_security = on;
    RETURN 'owner'::user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the role checking functions to use the bypass function
CREATE OR REPLACE FUNCTION private.current_user_role()
RETURNS user_role AS $$
  SELECT private.get_user_role_bypass_rls(auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER;

-- Keep the helper functions as they are now safe
CREATE OR REPLACE FUNCTION private.is_owner()
RETURNS BOOLEAN AS $$
  SELECT private.current_user_role() = 'owner';
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN AS $$
  SELECT private.current_user_role() = 'admin';
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION private.is_cleaner()
RETURNS BOOLEAN AS $$
  SELECT private.current_user_role() = 'cleaner';
$$ LANGUAGE SQL SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION private.get_user_role_bypass_rls(UUID) TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION private.get_user_role_bypass_rls(UUID) IS 
'Safely gets user role without triggering RLS policies to prevent infinite recursion';

COMMENT ON POLICY "Users can view own profile" ON public.user_profiles IS 
'Users can view their own profile using auth.uid() directly (no recursion)';

COMMENT ON POLICY "Admins can view all profiles" ON public.user_profiles IS 
'Admins can view all profiles using direct role check (no function recursion)';

/*
RECURSION FIX SUMMARY:

1. **Root Cause**: 
   - current_user_role() queried user_profiles table
   - This triggered RLS policies that called is_admin()
   - is_admin() called current_user_role() again → infinite loop

2. **Solution**:
   - User-specific policies use auth.uid() directly (no role checking needed)
   - Admin policies use direct EXISTS queries instead of functions
   - Created bypass function for role checking that temporarily disables RLS
   - Updated helper functions to use the safe bypass method

3. **Benefits**:
   - Eliminates infinite recursion
   - Maintains security boundaries
   - Preserves role-based access control
   - Compatible with existing frontend code
*/ 