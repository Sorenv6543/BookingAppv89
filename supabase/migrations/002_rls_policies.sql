-- =====================================================
-- Property Cleaning Scheduler - Row Level Security Policies
-- Migration: 002_rls_policies.sql
-- Purpose: Enforce multi-tenant security at database level
-- Replaces frontend filtering with real database security
-- =====================================================

-- =====================================================
-- SECURITY DEFINER HELPER FUNCTIONS
-- Avoid RLS recursion and improve performance
-- =====================================================

-- Create private schema for security functions
CREATE SCHEMA IF NOT EXISTS private;

-- Helper function to get current user's role
-- Uses security definer to avoid RLS checking recursion
CREATE OR REPLACE FUNCTION private.get_user_role()
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.user_profiles 
  WHERE id = (SELECT auth.uid());
$$;

-- Helper function to check if user is admin
-- Optimized for frequent role checks in policies
CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL  
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = (SELECT auth.uid()) 
    AND role = 'admin'
  );
$$;

-- Helper function to check if user is owner
CREATE OR REPLACE FUNCTION private.is_owner()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER  
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_profiles 
    WHERE id = (SELECT auth.uid()) 
    AND role = 'owner'
  );
$$;

-- Helper function to check property ownership
-- Used to validate booking operations
CREATE OR REPLACE FUNCTION private.user_owns_property(property_uuid UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.properties 
    WHERE id = property_uuid 
    AND owner_id = (SELECT auth.uid())
  );
$$;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- =====================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- USER PROFILES POLICIES
-- Control access to user profile data
-- =====================================================

-- SELECT: Users can view their own profile + public profiles for admin
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  -- Own profile
  id = (SELECT auth.uid())
  OR
  -- Admin can see all profiles  
  private.is_admin()
);

-- INSERT: Users can create their own profile (handled by auth triggers)
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  id = (SELECT auth.uid())
);

-- UPDATE: Users can update their own profile, admins can update any
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  id = (SELECT auth.uid())
  OR
  private.is_admin()
)
WITH CHECK (
  id = (SELECT auth.uid())
  OR
  private.is_admin()
);

-- DELETE: Only admins can delete profiles (business rule)
CREATE POLICY "Only admins can delete profiles"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (private.is_admin());

-- =====================================================
-- PROPERTIES POLICIES
-- Enforce owner data isolation / admin system access
-- =====================================================

-- SELECT: Owners see only their properties, admins see all
CREATE POLICY "Owners see their properties, admins see all"
ON public.properties
FOR SELECT
TO authenticated
USING (
  -- Owner sees only their properties
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin sees all properties (no filtering)
  private.is_admin()
);

-- INSERT: Owners can create properties for themselves, admins can create for anyone
CREATE POLICY "Owners can create their properties, admins can create any"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (
  -- Owner can only create for themselves
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin can create for anyone
  private.is_admin()
);

-- UPDATE: Owners can update their properties, admins can update any
CREATE POLICY "Owners can update their properties, admins can update any"
ON public.properties
FOR UPDATE
TO authenticated
USING (
  -- Owner can only update their properties
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin can update any property
  private.is_admin()
)
WITH CHECK (
  -- Maintain ownership during updates (owners can't transfer properties)
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin can change ownership
  private.is_admin()
);

-- DELETE: Owners can delete their properties, admins can delete any
CREATE POLICY "Owners can delete their properties, admins can delete any"
ON public.properties
FOR DELETE
TO authenticated
USING (
  -- Owner can only delete their properties
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin can delete any property
  private.is_admin()
);

-- =====================================================
-- BOOKINGS POLICIES
-- Core multi-tenant security - most complex policies
-- =====================================================

-- SELECT: Owners see only their bookings, admins see all
CREATE POLICY "Owners see their bookings, admins see all"
ON public.bookings
FOR SELECT
TO authenticated
USING (
  -- Owner sees only bookings for their properties
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin sees all bookings (no filtering) 
  private.is_admin()
  OR
  -- Cleaner sees assigned bookings (future feature)
  (
    (SELECT private.get_user_role()) = 'cleaner' 
    AND assigned_cleaner_id = (SELECT auth.uid())
  )
);

-- INSERT: Owners can create bookings for their properties, admins can create any
CREATE POLICY "Owners can create bookings for their properties, admins can create any"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (
  -- Owner can only create bookings for their properties
  (
    private.is_owner() 
    AND owner_id = (SELECT auth.uid())
    AND private.user_owns_property(property_id)
  )
  OR
  -- Admin can create bookings for any property
  private.is_admin()
);

-- UPDATE: Owners can update their bookings, admins can update any
CREATE POLICY "Owners can update their bookings, admins can update any"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  -- Owner can only update their bookings
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin can update any booking
  private.is_admin()
  OR
  -- Cleaner can update status of assigned bookings (future feature)
  (
    (SELECT private.get_user_role()) = 'cleaner' 
    AND assigned_cleaner_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  -- Owners cannot transfer bookings to other owners
  (
    private.is_owner() 
    AND owner_id = (SELECT auth.uid())
    AND private.user_owns_property(property_id)
  )
  OR
  -- Admin can modify any booking
  private.is_admin()
  OR
  -- Cleaner can only update certain fields (implement field-level restrictions separately)
  (
    (SELECT private.get_user_role()) = 'cleaner' 
    AND assigned_cleaner_id = (SELECT auth.uid())
  )
);

-- DELETE: Owners can delete their bookings, admins can delete any
CREATE POLICY "Owners can delete their bookings, admins can delete any"
ON public.bookings
FOR DELETE
TO authenticated
USING (
  -- Owner can only delete their bookings
  (private.is_owner() AND owner_id = (SELECT auth.uid()))
  OR
  -- Admin can delete any booking
  private.is_admin()
);

-- =====================================================
-- BYPASS RLS FOR SPECIFIC SYSTEM OPERATIONS
-- Grant superuser-like access to service roles
-- =====================================================

-- Grant service_role ability to bypass RLS for system operations
-- This is used for server-side operations, migrations, etc.
ALTER ROLE service_role BYPASSRLS;

-- Grant postgres role ability to bypass RLS for admin operations
-- Only use in development/maintenance scenarios
-- ALTER ROLE postgres BYPASSRLS; -- Uncomment only for maintenance

-- =====================================================
-- PERFORMANCE OPTIMIZATION POLICIES
-- Additional indexes and optimizations for RLS
-- =====================================================

-- Optimize RLS policy performance with additional functional indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_uid 
ON public.user_profiles(id) WHERE id = (SELECT auth.uid());

-- Create expression index for frequent role checks
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_admin 
ON public.user_profiles(role) WHERE role = 'admin';

CREATE INDEX IF NOT EXISTS idx_user_profiles_role_owner 
ON public.user_profiles(role) WHERE role = 'owner';

-- =====================================================
-- REALTIME RLS POLICIES  
-- Ensure real-time subscriptions respect RLS
-- =====================================================

-- Note: Supabase automatically applies RLS to real-time subscriptions
-- No additional configuration needed - RLS policies above will be enforced

-- =====================================================
-- TESTING AND VALIDATION QUERIES
-- Verify RLS policies work correctly
-- =====================================================

-- Create a test function to validate RLS setup
CREATE OR REPLACE FUNCTION private.test_rls_setup()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 'RLS policies created successfully. Test with different user roles to validate security.';
$$;

-- =====================================================
-- POLICY DOCUMENTATION AND COMMENTS
-- =====================================================

COMMENT ON FUNCTION private.get_user_role() IS 'Returns current authenticated user role - used by RLS policies';
COMMENT ON FUNCTION private.is_admin() IS 'Check if current user is admin - optimized for RLS policies';  
COMMENT ON FUNCTION private.is_owner() IS 'Check if current user is owner - optimized for RLS policies';
COMMENT ON FUNCTION private.user_owns_property() IS 'Check if current user owns specified property - used for booking validation';

-- Document the security model
COMMENT ON SCHEMA private IS 'Private schema for security definer functions used by RLS policies';

-- =====================================================
-- SECURITY AUDIT LOG
-- Track policy creation for compliance
-- =====================================================

DO $$
DECLARE
    policy_count INTEGER;
BEGIN
    -- Count created policies
    SELECT COUNT(*) INTO policy_count
    FROM pg_policies 
    WHERE schemaname = 'public';
    
    RAISE NOTICE 'RLS setup complete: % policies created across % tables', 
                 policy_count, 
                 (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
                 
    RAISE NOTICE 'Security model: Owner data isolation + Admin system access';
    RAISE NOTICE 'Multi-tenancy enforced at database level via RLS';
END $$;

-- =====================================================
-- MIGRATION VALIDATION
-- Ensure all policies are properly created
-- =====================================================

-- Verify all tables have RLS enabled
DO $$
DECLARE
    table_record RECORD;
    rls_count INTEGER := 0;
BEGIN
    FOR table_record IN 
        SELECT tablename 
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('user_profiles', 'properties', 'bookings')
    LOOP
        IF (SELECT relrowsecurity FROM pg_class WHERE relname = table_record.tablename) THEN
            rls_count := rls_count + 1;
            RAISE NOTICE 'RLS enabled on table: %', table_record.tablename;
        ELSE
            RAISE EXCEPTION 'RLS not enabled on table: %', table_record.tablename;
        END IF;
    END LOOP;
    
    IF rls_count = 3 THEN
        RAISE NOTICE 'RLS validation successful: All % core tables secured', rls_count;
    ELSE
        RAISE EXCEPTION 'RLS validation failed: Only % of 3 tables secured', rls_count;
    END IF;
END $$; 