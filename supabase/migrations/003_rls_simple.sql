-- =====================================================
-- Property Cleaning Scheduler - Row Level Security Policies (SIMPLE)
-- Migration: 003_rls_simple.sql
-- Purpose: Enforce multi-tenant security at database level
-- Approach: Direct SQL in policies (no helper functions)
-- =====================================================

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

-- SELECT: Users can view their own profile + admin can see all profiles
CREATE POLICY "Users can view their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
  -- Own profile
  id = auth.uid()
  OR
  -- Admin can see all profiles  
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- INSERT: Users can create their own profile (handled by auth triggers)
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  id = auth.uid()
);

-- UPDATE: Users can update their own profile, admins can update any
CREATE POLICY "Users can update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
  id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  id = auth.uid()
  OR
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- DELETE: Only admins can delete profiles (business rule)
CREATE POLICY "Only admins can delete profiles"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

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
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin sees all properties (no filtering)
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- INSERT: Owners can create properties for themselves, admins can create for anyone
CREATE POLICY "Owners can create their properties, admins can create any"
ON public.properties
FOR INSERT
TO authenticated
WITH CHECK (
  -- Owner can only create for themselves
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin can create for anyone
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- UPDATE: Owners can update their properties, admins can update any
CREATE POLICY "Owners can update their properties, admins can update any"
ON public.properties
FOR UPDATE
TO authenticated
USING (
  -- Owner can only update their properties
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin can update any property
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  -- Maintain ownership during updates (owners can't transfer properties)
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin can change ownership
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- DELETE: Owners can delete their properties, admins can delete any
CREATE POLICY "Owners can delete their properties, admins can delete any"
ON public.properties
FOR DELETE
TO authenticated
USING (
  -- Owner can only delete their properties
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin can delete any property
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
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
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin sees all bookings (no filtering) 
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
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
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
    AND EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = property_id AND p.owner_id = auth.uid()
    )
  )
  OR
  -- Admin can create bookings for any property
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- UPDATE: Owners can update their bookings, admins can update any
CREATE POLICY "Owners can update their bookings, admins can update any"
ON public.bookings
FOR UPDATE
TO authenticated
USING (
  -- Owner can only update their bookings
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin can update any booking
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
)
WITH CHECK (
  -- Owners cannot transfer bookings to other owners
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
    AND EXISTS (
      SELECT 1 FROM public.properties p 
      WHERE p.id = property_id AND p.owner_id = auth.uid()
    )
  )
  OR
  -- Admin can modify any booking
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- DELETE: Owners can delete their bookings, admins can delete any
CREATE POLICY "Owners can delete their bookings, admins can delete any"
ON public.bookings
FOR DELETE
TO authenticated
USING (
  -- Owner can only delete their bookings
  (
    owner_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.user_profiles up 
      WHERE up.id = auth.uid() AND up.role = 'owner'
    )
  )
  OR
  -- Admin can delete any booking
  EXISTS (
    SELECT 1 FROM public.user_profiles up 
    WHERE up.id = auth.uid() AND up.role = 'admin'
  )
);

-- =====================================================
-- PERFORMANCE OPTIMIZATION INDEXES
-- Additional indexes for RLS performance
-- =====================================================

-- Role-specific indexes for faster policy evaluation
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_admin 
ON public.user_profiles(role) WHERE role = 'admin';

CREATE INDEX IF NOT EXISTS idx_user_profiles_role_owner 
ON public.user_profiles(role) WHERE role = 'owner';

-- =====================================================
-- VALIDATION AND TESTING
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
        RAISE NOTICE 'Security model: Direct SQL policies for owner data isolation + admin system access';
    ELSE
        RAISE EXCEPTION 'RLS validation failed: Only % of 3 tables secured', rls_count;
    END IF;
END $$; 