-- =====================================================
-- TASK-081: Authentication & User Management - Database Setup
-- Run this in Supabase Dashboard > SQL Editor
-- =====================================================

-- Create custom types for enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'cleaner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- =====================================================
-- USER PROFILES TABLE
-- Essential for user registration to work
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  company_name TEXT,
  
  -- User settings
  notifications_enabled BOOLEAN DEFAULT true,
  timezone TEXT DEFAULT 'UTC',
  theme theme_preference DEFAULT 'system',
  language TEXT DEFAULT 'en',
  
  -- Admin-specific fields
  access_level TEXT,
  
  -- Cleaner-specific fields  
  skills TEXT[],
  max_daily_bookings INTEGER,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- AUTO-CREATE USER PROFILES ON REGISTRATION
-- This is CRITICAL for registration to work
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'owner')::user_role,
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    company_name = EXCLUDED.company_name;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto-creating user profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

-- =====================================================
-- VERIFY SETUP
-- =====================================================
SELECT 
  'Database setup complete! You can now register users.' as status,
  COUNT(*) as existing_profiles
FROM public.user_profiles;

-- Show table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position; 