-- =====================================================
-- Property Cleaning Scheduler - Multi-Tenant Database Schema
-- Migration: 001_initial_schema.sql
-- Purpose: Create core tables with proper relationships for RLS
-- =====================================================

-- Create custom types for enums
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'cleaner');
CREATE TYPE booking_type AS ENUM ('standard', 'turn');
CREATE TYPE booking_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled');
CREATE TYPE pricing_tier AS ENUM ('basic', 'standard', 'premium', 'luxury');
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'condo', 'townhouse');
CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');
CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');

-- =====================================================
-- USER PROFILES TABLE
-- Extends auth.users with application-specific data
-- =====================================================
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  company_name TEXT, -- for property owners
  
  -- User settings
  notifications_enabled BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'UTC',
  theme theme_preference DEFAULT 'system',
  language TEXT DEFAULT 'en',
  
  -- Admin-specific fields
  access_level TEXT, -- 'full' | 'limited' for admin users
  
  -- Cleaner-specific fields  
  skills TEXT[], -- for cleaner users
  max_daily_bookings INTEGER, -- for cleaner users
  location_lat DECIMAL(10, 8), -- for cleaner users
  location_lng DECIMAL(11, 8), -- for cleaner users
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PROPERTIES TABLE
-- Core properties managed in the system
-- KEY: owner_id is critical for RLS filtering
-- =====================================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Property details
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  bedrooms INTEGER,
  bathrooms INTEGER,
  square_feet INTEGER,
  property_type property_type,
  
  -- Cleaning configuration
  cleaning_duration INTEGER NOT NULL, -- minutes
  special_instructions TEXT,
  pricing_tier pricing_tier NOT NULL DEFAULT 'standard',
  
  -- Status
  active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BOOKINGS TABLE  
-- Core booking/cleaning events
-- KEY: owner_id is critical for RLS filtering
-- =====================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  
  -- Booking details
  checkout_date TIMESTAMPTZ NOT NULL,
  checkin_date TIMESTAMPTZ NOT NULL,
  booking_type booking_type NOT NULL DEFAULT 'standard',
  status booking_status NOT NULL DEFAULT 'pending',
  
  -- Guest and cleaning details
  guest_count INTEGER,
  notes TEXT,
  priority priority_level DEFAULT 'normal',
  
  -- Cleaner assignment
  assigned_cleaner_id UUID REFERENCES public.user_profiles(id),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_dates CHECK (checkin_date >= checkout_date),
  CONSTRAINT valid_guest_count CHECK (guest_count IS NULL OR guest_count >= 0)
);

-- =====================================================
-- PERFORMANCE INDEXES
-- Critical for RLS policy performance
-- =====================================================

-- Indexes for RLS filtering (CRITICAL for performance)
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_bookings_owner_id ON public.bookings(owner_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);

-- Indexes for common queries
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_type ON public.bookings(booking_type);
CREATE INDEX idx_bookings_checkout_date ON public.bookings(checkout_date);
CREATE INDEX idx_bookings_checkin_date ON public.bookings(checkin_date);
CREATE INDEX idx_bookings_assigned_cleaner ON public.bookings(assigned_cleaner_id);

-- Indexes for user profiles
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

-- Composite indexes for common admin queries
CREATE INDEX idx_bookings_owner_status ON public.bookings(owner_id, status);
CREATE INDEX idx_bookings_property_status ON public.bookings(property_id, status);

-- =====================================================
-- UPDATED_AT TRIGGERS
-- Automatically update timestamps
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON public.user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at 
  BEFORE UPDATE ON public.properties 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at 
  BEFORE UPDATE ON public.bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONSTRAINTS & RELATIONSHIPS
-- Ensure data integrity
-- =====================================================

-- Ensure booking owner matches property owner
ALTER TABLE public.bookings 
ADD CONSTRAINT booking_property_owner_match 
CHECK (
  owner_id = (
    SELECT owner_id 
    FROM public.properties 
    WHERE id = property_id
  )
);

-- Ensure cleaner users have cleaner role
ALTER TABLE public.bookings
ADD CONSTRAINT assigned_cleaner_role_check
CHECK (
  assigned_cleaner_id IS NULL OR 
  (
    SELECT role 
    FROM public.user_profiles 
    WHERE id = assigned_cleaner_id
  ) = 'cleaner'
);

-- =====================================================
-- REALTIME PUBLICATION
-- Enable real-time subscriptions for frontend
-- =====================================================

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;

-- =====================================================
-- SEED DATA FOR DEVELOPMENT
-- Basic admin user and test data
-- =====================================================

-- Note: In production, admin users should be created through proper auth flow
-- This is for development/testing only

-- Insert test user profiles (will be replaced with real auth users)
INSERT INTO public.user_profiles (id, email, name, role, access_level) 
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@cleaningscheduler.com', 'System Admin', 'admin', 'full'),
  ('00000000-0000-0000-0000-000000000002', 'owner1@example.com', 'Property Owner 1', 'owner', NULL),
  ('00000000-0000-0000-0000-000000000003', 'owner2@example.com', 'Property Owner 2', 'owner', NULL)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.user_profiles IS 'Extended user profile information for application roles and settings';
COMMENT ON TABLE public.properties IS 'Properties managed in the cleaning scheduler - filtered by owner_id for multi-tenancy';
COMMENT ON TABLE public.bookings IS 'Booking/cleaning events - filtered by owner_id for multi-tenancy';

COMMENT ON COLUMN public.bookings.owner_id IS 'CRITICAL: Used for RLS filtering - owner sees only their bookings';
COMMENT ON COLUMN public.properties.owner_id IS 'CRITICAL: Used for RLS filtering - owner sees only their properties';
COMMENT ON COLUMN public.user_profiles.role IS 'Determines access level: owner=filtered data, admin=all data, cleaner=assigned tasks';

-- =====================================================
-- SCHEMA VALIDATION
-- Ensure everything is properly set up
-- =====================================================

-- Verify tables exist
DO $$
DECLARE
    table_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('user_profiles', 'properties', 'bookings');
    
    IF table_count != 3 THEN
        RAISE EXCEPTION 'Schema creation failed: Expected 3 tables, found %', table_count;
    END IF;
    
    RAISE NOTICE 'Schema creation successful: % tables created', table_count;
END $$; 