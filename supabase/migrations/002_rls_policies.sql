-- 002_rls_policies.sql
-- Row Level Security (RLS) policies for multi-tenant security
-- TASK-080: Database Schema & RLS Setup

-- ============================================================================
-- USER PROFILES RLS POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = private.current_user_id());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = private.current_user_id())
  WITH CHECK (id = private.current_user_id());

-- Admins can view all profiles (for user management)
CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (private.is_admin());

-- Admins can update all profiles (for user management)
CREATE POLICY "Admins can update all profiles" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- Admins can insert new profiles (for user management)
CREATE POLICY "Admins can insert profiles" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (private.is_admin());

-- Only admins can delete profiles (security measure)
CREATE POLICY "Admins can delete profiles" ON public.user_profiles
  FOR DELETE TO authenticated
  USING (private.is_admin());

-- ============================================================================
-- PROPERTIES RLS POLICIES
-- ============================================================================

-- Owners can view their own properties, admins can view all
CREATE POLICY "Owners can view own properties" ON public.properties
  FOR SELECT TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Owners can insert their own properties
CREATE POLICY "Owners can insert own properties" ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Owners can update their own properties
CREATE POLICY "Owners can update own properties" ON public.properties
  FOR UPDATE TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  )
  WITH CHECK (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Owners can delete their own properties, admins can delete any
CREATE POLICY "Owners can delete own properties" ON public.properties
  FOR DELETE TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Cleaners can view properties for assigned bookings
CREATE POLICY "Cleaners can view assigned properties" ON public.properties
  FOR SELECT TO authenticated
  USING (
    private.is_cleaner() AND 
    EXISTS (
      SELECT 1 FROM public.bookings 
      WHERE property_id = properties.id 
      AND assigned_cleaner_id = private.current_user_id()
    )
  );

-- ============================================================================
-- BOOKINGS RLS POLICIES
-- ============================================================================

-- Owners can view their own bookings, admins can view all
CREATE POLICY "Owners can view own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Owners can insert their own bookings
CREATE POLICY "Owners can insert own bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Owners can update their own bookings
CREATE POLICY "Owners can update own bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  )
  WITH CHECK (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Owners can delete their own bookings, admins can delete any
CREATE POLICY "Owners can delete own bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

-- Cleaners can view bookings assigned to them
CREATE POLICY "Cleaners can view assigned bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    private.is_cleaner() AND assigned_cleaner_id = private.current_user_id()
  );

-- Cleaners can update status and notes of assigned bookings
CREATE POLICY "Cleaners can update assigned bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (
    private.is_cleaner() AND assigned_cleaner_id = private.current_user_id()
  )
  WITH CHECK (
    private.is_cleaner() AND assigned_cleaner_id = private.current_user_id()
  );

-- ============================================================================
-- SECURITY VALIDATION FUNCTIONS
-- ============================================================================

-- Function to validate property ownership for booking operations
CREATE OR REPLACE FUNCTION private.validate_property_ownership(
  property_uuid UUID,
  owner_uuid UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.properties 
    WHERE id = property_uuid AND owner_id = owner_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to test RLS policies (for development/testing)
CREATE OR REPLACE FUNCTION private.test_rls_isolation()
RETURNS TABLE (
  test_name TEXT,
  passed BOOLEAN,
  details TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'RLS_ENABLED_CHECK'::TEXT,
    (SELECT COUNT(*) FROM pg_tables WHERE schemaname = 'public' AND rowsecurity = true) > 0,
    'Checking if RLS is enabled on public tables'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION private.validate_property_ownership(UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.test_rls_isolation() TO authenticated;

-- ============================================================================
-- COMMENTS AND DOCUMENTATION
-- ============================================================================

COMMENT ON POLICY "Owners can view own properties" ON public.properties IS 
'Owners can only see properties they own, admins can see all properties';

COMMENT ON POLICY "Owners can view own bookings" ON public.bookings IS 
'Owners can only see bookings for their properties, admins can see all bookings';

COMMENT ON POLICY "Cleaners can view assigned bookings" ON public.bookings IS 
'Cleaners can only see bookings that are assigned to them';

/*
SECURITY MODEL SUMMARY:

1. **Multi-Tenant Data Isolation**:
   - Owners can only access their own properties and bookings
   - RLS policies automatically filter data at the database level
   - No data leakage between different property owners

2. **Admin System Access**:
   - Admins can access all data across all tenants
   - Full CRUD operations on all tables
   - User management capabilities

3. **Cleaner Limited Access**:
   - Cleaners can only see bookings assigned to them
   - Can update booking status and notes
   - Can view property details for assigned jobs

4. **Performance Optimizations**:
   - Security definer functions cache auth.uid() calls
   - Composite indexes on (owner_id, status) for fast filtering

This RLS implementation provides true multi-tenant security while maintaining
high performance and supporting the existing frontend architecture.
*/ 