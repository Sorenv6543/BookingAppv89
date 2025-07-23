-- 001_initial_schema.sql
-- Multi-tenant database schema for property cleaning scheduler
-- TASK-080: Database Schema & RLS Setup

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
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  checkout_date TIMESTAMPTZ NOT NULL,
  checkin_date TIMESTAMPTZ NOT NULL,
  booking_type booking_type NOT NULL DEFAULT 'standard',
  status booking_status NOT NULL DEFAULT 'pending',
  guest_count INTEGER,
  notes TEXT,
  priority priority_level NOT NULL DEFAULT 'normal',
  assigned_cleaner_id UUID REFERENCES public.user_profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Business rule constraints
  CONSTRAINT booking_dates_valid CHECK (checkin_date >= checkout_date),
  CONSTRAINT assigned_cleaner_is_cleaner CHECK (
    assigned_cleaner_id IS NULL OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = assigned_cleaner_id AND role = 'cleaner')
  )
);

-- Indexes for performance (critical for RLS)
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);

CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_active ON public.properties(active);
CREATE INDEX idx_properties_owner_active ON public.properties(owner_id, active);

CREATE INDEX idx_bookings_owner_id ON public.bookings(owner_id);
CREATE INDEX idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(checkout_date, checkin_date);
CREATE INDEX idx_bookings_assigned_cleaner ON public.bookings(assigned_cleaner_id);
CREATE INDEX idx_bookings_owner_status ON public.bookings(owner_id, status);

-- Triggers for updated_at timestamps
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
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email), 
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Security definer functions for RLS (performance optimization)
CREATE OR REPLACE FUNCTION private.current_user_id()
RETURNS UUID AS $$
  SELECT auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

CREATE OR REPLACE FUNCTION private.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
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

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA private TO authenticated;

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Initial admin user setup (will be created via SQL or manually)
-- This allows the first admin to be created without RLS blocking
CREATE OR REPLACE FUNCTION public.create_admin_user(
  user_email TEXT,
  user_name TEXT
)
RETURNS UUID AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- This function should only be called during initial setup
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

COMMENT ON TABLE public.user_profiles IS 'User profiles extending auth.users with role-based fields';
COMMENT ON TABLE public.properties IS 'Properties owned by users, with owner_id for multi-tenant filtering';
COMMENT ON TABLE public.bookings IS 'Cleaning bookings with owner_id and property_id relationships';
COMMENT ON FUNCTION private.is_owner() IS 'Security definer function to check if current user is owner';
COMMENT ON FUNCTION private.is_admin() IS 'Security definer function to check if current user is admin'; 