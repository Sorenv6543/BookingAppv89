-- =====================================================
-- Auto-create user profiles on auth.users insert
-- Migration: 003_user_profile_trigger.sql  
-- Purpose: Automatically create user_profiles when users sign up
-- =====================================================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user profile from auth metadata
  INSERT INTO public.user_profiles (
    id,
    email,
    name,
    role,
    company_name,
    notifications_enabled,
    timezone,
    theme,
    language
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'owner'),
    NEW.raw_user_meta_data->>'company_name',
    COALESCE((NEW.raw_user_meta_data->>'notifications_enabled')::boolean, true),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
    COALESCE((NEW.raw_user_meta_data->>'theme')::theme_preference, 'system'),
    COALESCE(NEW.raw_user_meta_data->>'language', 'en')
  );
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Create trigger to fire on new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_profiles TO postgres, anon, authenticated, service_role;

-- Comment
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates user_profiles record when new user signs up to auth.users'; 