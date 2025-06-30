import { createClient } from '@supabase/supabase-js';

// You need your service role key for admin operations
const SUPABASE_URL = 'https://yplrudursbvzcdaroqly.supabase.co/';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixUserRegistration() {
  console.log('🔧 Fixing user registration trigger...\n');
  
  if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
    console.error(`
❌ ERROR: Missing Supabase Service Role Key

To fix user registration, you need to:
1. Go to: https://supabase.com/dashboard/project/yplrudursbvzcdaroqly/settings/api
2. Copy the 'service_role' key (secret key)
3. Run: SUPABASE_SERVICE_KEY=your_service_key node scripts/fix-user-registration.js
`);
    return;
  }

  try {
    // Step 1: Drop existing trigger if it exists (to avoid conflicts)
    console.log('1️⃣ Cleaning up existing trigger...');
    const dropTriggerSQL = `
      DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
    `;
    
    await supabase.rpc('exec_sql', { sql: dropTriggerSQL });
    console.log('✅ Existing trigger cleaned up');

    // Step 2: Drop existing function if it exists
    console.log('2️⃣ Cleaning up existing function...');
    const dropFunctionSQL = `
      DROP FUNCTION IF EXISTS create_user_profile();
    `;
    
    await supabase.rpc('exec_sql', { sql: dropFunctionSQL });
    console.log('✅ Existing function cleaned up');

    // Step 3: Create the user profile creation function
    console.log('3️⃣ Creating user profile function...');
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_user_profile()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.user_profiles (id, email, name, role)
        VALUES (
          NEW.id,
          NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
          COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'owner'::user_role)
        );
        RETURN NEW;
      END;
      $$ language 'plpgsql' SECURITY DEFINER;
    `;
    
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    if (functionError) {
      console.error('❌ Function creation failed:', functionError);
      throw functionError;
    }
    console.log('✅ User profile function created');

    // Step 4: Create the trigger
    console.log('4️⃣ Creating user profile trigger...');
    const createTriggerSQL = `
      CREATE TRIGGER create_user_profile_trigger
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION create_user_profile();
    `;
    
    const { error: triggerError } = await supabase.rpc('exec_sql', { sql: createTriggerSQL });
    if (triggerError) {
      console.error('❌ Trigger creation failed:', triggerError);
      throw triggerError;
    }
    console.log('✅ User profile trigger created');

    // Step 5: Test user registration
    console.log('5️⃣ Testing user registration...');
    const testEmail = `test-${Date.now()}@example.com`;
    const { data: testUser, error: testError } = await supabase.auth.signUp({
      email: testEmail,
      password: 'TestPassword123!',
      options: {
        data: {
          name: 'Test User',
          role: 'owner'
        }
      }
    });

    if (testError) {
      console.error('❌ Test registration failed:', testError.message);
    } else {
      console.log('✅ Test registration successful!');
      
      // Clean up test user
      if (testUser.user) {
        await supabase.auth.admin.deleteUser(testUser.user.id);
        console.log('🧹 Test user cleaned up');
      }
    }

    console.log('\n🎉 User registration fix completed!');
    console.log('You should now be able to register new users in your application.');
    
  } catch (error) {
    console.error('💥 Fix failed:', error);
    console.log('\n🔧 Manual Fix Option:');
    console.log('If the automated fix failed, go to your Supabase SQL Editor and run:');
    console.log(`
-- 1. Create the function
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'owner'::user_role)
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 2. Create the trigger
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();
`);
  }
}

fixUserRegistration(); 