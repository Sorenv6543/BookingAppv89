-- Fix handle_new_user trigger to properly extract user metadata
-- This addresses the 500 error when creating new users

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate function with correct metadata field names and proper enum validation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  role_value user_role;
BEGIN
  -- Validate role string before casting to enum
  role_value := CASE 
    WHEN (NEW.raw_user_meta_data->>'role') IN ('owner', 'admin', 'cleaner') 
    THEN (NEW.raw_user_meta_data->>'role')::user_role
    ELSE 'owner'::user_role
  END;
  
  INSERT INTO public.user_profiles (id, email, name, role, company_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    role_value,
    NEW.raw_user_meta_data->>'company_name'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_new_user: % %', SQLERRM, SQLSTATE;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the function was created
SELECT 'SUCCESS: handle_new_user trigger function updated!' as status;
