-- ============================================================================
-- COMBINED MIGRATION SCRIPT FOR SUPABASE
-- Property Cleaning Scheduler Database Schema
-- ============================================================================
-- This script combines all migrations (001-009) into a single file
-- for easy deployment to a new Supabase project
-- ============================================================================

-- Enable UUID extension for primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Create enum types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'cleaner');
CREATE TYPE booking_type AS ENUM ('standard', 'turn');
CREATE TYPE booking_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'condo', 'townhouse');
CREATE TYPE pricing_tier AS ENUM ('basic', 'standard', 'premium', 'luxury');
CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');

-- Create private schema for security functions
CREATE SCHEMA IF NOT EXISTS private;

-- ============================================================================
-- TABLES
-- ============================================================================

-- User profiles table (extends auth.users)
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  company_name TEXT,

  -- User settings
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  theme theme_preference NOT NULL DEFAULT 'system',
  language TEXT NOT NULL DEFAULT 'en',

  -- Admin-specific fields
  access_level TEXT CHECK (access_level IN ('full', 'limited')),

  -- Cleaner-specific fields
  skills TEXT[],
  max_daily_bookings INTEGER,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  property_type property_type,
  cleaning_duration INTEGER NOT NULL DEFAULT 120, -- minutes
  special_instructions TEXT,
  pricing_tier pricing_tier NOT NULL DEFAULT 'standard',
  active BOOLEAN NOT NULL DEFAULT true,
  default_checkout_time TIME DEFAULT '11:00',
  default_checkin_time TIME DEFAULT '15:00',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_default_checkout_time CHECK (default_checkout_time IS NULL OR default_checkout_time::text ~ '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'),
  CONSTRAINT valid_default_checkin_time CHECK (default_checkin_time IS NULL OR default_checkin_time::text ~ '^([01]?[0-9]|2[0-3]):[0-5][0-9]$')
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  checkout_date TIMESTAMPTZ NOT NULL,
  checkout_time TIME,
  checkin_date TIMESTAMPTZ NOT NULL,
  checkin_time TIME,
  booking_type booking_type NOT NULL DEFAULT 'standard',
  status booking_status NOT NULL DEFAULT 'pending',
  guest_count INTEGER,
  notes TEXT,
  priority priority_level NOT NULL DEFAULT 'normal',
  assigned_cleaner_id UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Business rule constraints
  CONSTRAINT booking_dates_valid CHECK (checkout_date < checkin_date)
  -- Note: Cleaner role validation will be handled by a trigger instead of CHECK constraint
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_active ON public.properties(active);
CREATE INDEX idx_properties_owner_active ON public.properties(owner_id, active);

CREATE INDEX idx_bookings_owner_id ON public.bookings(owner_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_checkout_date ON public.bookings(checkout_date);
CREATE INDEX idx_bookings_checkin_date ON public.bookings(checkin_date);
CREATE INDEX idx_bookings_dates ON public.bookings(checkout_date, checkin_date);
CREATE INDEX idx_bookings_assigned_cleaner ON public.bookings(assigned_cleaner_id);
CREATE INDEX idx_bookings_owner_status ON public.bookings(owner_id, status);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Trigger function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON public.properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create user profile on auth user creation
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

-- Grant execute permissions to the function
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Ensure the function owner has the right permissions
ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Validate assigned cleaner role on bookings
CREATE OR REPLACE FUNCTION validate_assigned_cleaner()
RETURNS TRIGGER AS $$
BEGIN
  -- If assigned_cleaner_id is not null, verify it's a cleaner
  IF NEW.assigned_cleaner_id IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = NEW.assigned_cleaner_id AND role = 'cleaner'
    ) THEN
      RAISE EXCEPTION 'assigned_cleaner_id must reference a user with role cleaner';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_booking_cleaner
  BEFORE INSERT OR UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION validate_assigned_cleaner();

-- Security definer functions for RLS (non-recursive version)
CREATE OR REPLACE FUNCTION private.current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

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

CREATE OR REPLACE FUNCTION private.current_user_role()
RETURNS user_role AS $$
  SELECT private.get_user_role_bypass_rls(auth.uid());
$$ LANGUAGE SQL SECURITY DEFINER;

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

-- Admin user creation function
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email TEXT,
  user_name TEXT
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role, access_level)
  VALUES (
    gen_random_uuid(),
    user_email,
    user_name,
    'admin'::user_role,
    'full'
  )
  RETURNING id INTO new_user_id;

  RETURN new_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA private TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_admin_user(TEXT, TEXT) TO authenticated;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- USER PROFILES POLICIES (non-recursive version)
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

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

CREATE POLICY "Admins can insert profiles" ON public.user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete profiles" ON public.user_profiles
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- PROPERTIES POLICIES
CREATE POLICY "Owners can view own properties" ON public.properties
  FOR SELECT TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

CREATE POLICY "Owners can insert own properties" ON public.properties
  FOR INSERT TO authenticated
  WITH CHECK (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

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

CREATE POLICY "Owners can delete own properties" ON public.properties
  FOR DELETE TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

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

-- BOOKINGS POLICIES
CREATE POLICY "Owners can view own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

CREATE POLICY "Owners can insert own bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

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

CREATE POLICY "Owners can delete own bookings" ON public.bookings
  FOR DELETE TO authenticated
  USING (
    (private.is_owner() AND owner_id = private.current_user_id()) OR
    private.is_admin()
  );

CREATE POLICY "Cleaners can view assigned bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (
    private.is_cleaner() AND assigned_cleaner_id = private.current_user_id()
  );

CREATE POLICY "Cleaners can update assigned bookings" ON public.bookings
  FOR UPDATE TO authenticated
  USING (
    private.is_cleaner() AND assigned_cleaner_id = private.current_user_id()
  )
  WITH CHECK (
    private.is_cleaner() AND assigned_cleaner_id = private.current_user_id()
  );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE public.user_profiles IS 'User profiles extending auth.users with role-based fields';
COMMENT ON TABLE public.properties IS 'Properties owned by users, with owner_id for multi-tenant filtering';
COMMENT ON TABLE public.bookings IS 'Cleaning bookings with owner_id and property_id relationships';

COMMENT ON COLUMN public.properties.default_checkout_time IS 'Default checkout time for this property (HH:MM format)';
COMMENT ON COLUMN public.properties.default_checkin_time IS 'Default checkin time for this property (HH:MM format)';

COMMENT ON COLUMN public.bookings.checkout_date IS 'Date when previous guests check out (leave) - start of cleaning period';
COMMENT ON COLUMN public.bookings.checkin_date IS 'Date when new guests check in (arrive) - end of cleaning period';
COMMENT ON COLUMN public.bookings.checkout_time IS 'Time when previous guests check out (leave) - start of cleaning period';
COMMENT ON COLUMN public.bookings.checkin_time IS 'Time when new guests check in (arrive) - end of cleaning period';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- This schema includes:
-- - Multi-tenant data isolation with RLS
-- - Role-based access control (owner, admin, cleaner)
-- - Non-recursive RLS policies to prevent infinite loops
-- - Proper indexing for performance
-- - Automatic timestamp management
-- - User profile creation on auth signup
-- ============================================================================
