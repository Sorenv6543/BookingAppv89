-- 010_fix_user_profiles_rls_recursion.sql
-- CRITICAL FIX: Eliminate infinite recursion in user_profiles RLS policies
-- The issue: Admin policies query user_profiles table within user_profiles policies → recursion

-- ============================================================================
-- DROP ALL EXISTING user_profiles POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can insert profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can delete profiles" ON public.user_profiles;

-- ============================================================================
-- CREATE SECURITY DEFINER FUNCTION TO BYPASS RLS
-- ============================================================================

-- This function runs with elevated privileges and bypasses RLS to check role
CREATE OR REPLACE FUNCTION auth.user_has_role(check_role user_role)
RETURNS BOOLEAN AS $$
DECLARE
  user_role_value user_role;
BEGIN
  -- Query user_profiles without triggering RLS (SECURITY DEFINER bypasses it)
  SELECT role INTO user_role_value
  FROM public.user_profiles
  WHERE id = auth.uid()
  LIMIT 1;
  
  RETURN COALESCE(user_role_value = check_role, false);
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION auth.user_has_role(user_role) TO authenticated;

-- ============================================================================
-- CREATE SAFE RLS POLICIES WITHOUT RECURSION
-- ============================================================================

-- Policy 1: Users can view their OWN profile (no role check needed)
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Policy 2: Users can update their OWN profile (no role check needed)
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Policy 3: Admins can view ALL profiles (using SECURITY DEFINER function)
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (auth.user_has_role('admin'));

-- Policy 4: Admins can update ALL profiles (using SECURITY DEFINER function)
CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (auth.user_has_role('admin'))
  WITH CHECK (auth.user_has_role('admin'));

-- Policy 5: Admins can insert new profiles (using SECURITY DEFINER function)
CREATE POLICY "Admins can insert profiles" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.user_has_role('admin'));

-- Policy 6: Admins can delete profiles (using SECURITY DEFINER function)
CREATE POLICY "Admins can delete profiles" ON public.user_profiles
  FOR DELETE TO authenticated
  USING (auth.user_has_role('admin'));

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON FUNCTION auth.user_has_role(user_role) IS 
'SECURITY DEFINER function that bypasses RLS to check user role without recursion. Used by user_profiles RLS policies.';

COMMENT ON POLICY "Users can view own profile" ON public.user_profiles IS 
'Non-recursive: uses auth.uid() directly';

COMMENT ON POLICY "Admins can view all profiles" ON public.user_profiles IS 
'Non-recursive: uses SECURITY DEFINER function that bypasses RLS';

/*
===============================================================================
RECURSION FIX EXPLANATION
===============================================================================

**The Problem:**
- Admin policies had: EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
- This query triggers user_profiles RLS policies again → infinite loop (42P17 error)

**The Solution:**
- Created auth.user_has_role() as SECURITY DEFINER function
- SECURITY DEFINER runs with function owner's privileges (bypasses RLS)
- Function directly queries user_profiles without triggering RLS
- Policies call this function instead of querying user_profiles directly

**Security:**
- Function is tightly scoped (only checks role, no data exposure)
- Granted to authenticated users only
- Cannot be exploited to bypass other security checks
===============================================================================
*/
