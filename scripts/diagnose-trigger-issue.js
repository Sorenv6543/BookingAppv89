import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env
const SUPABASE_URL = 'https://yplrudursbvzcdaroqly.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbHJ1ZHVyc2J2emNkYXJvcWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzIyNTAsImV4cCI6MjA2Njg0ODI1MH0.D3NN6SPNG_fJ4ys_2Ju9t_9X12P18nWLyzF_nteHIuQ';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function diagnoseTriggerIssue() {
  console.log('🔍 Diagnosing trigger and function issues...\n');
  
  try {
    // Check if user_profiles table structure is correct
    console.log('1️⃣ Checking user_profiles table structure...');
    try {
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable')
        .eq('table_name', 'user_profiles')
        .eq('table_schema', 'public');
      
      if (columnsError) {
        console.log('❌ Cannot check table structure:', columnsError.message);
      } else if (columns && columns.length > 0) {
        console.log('✅ user_profiles table columns:');
        columns.forEach(col => {
          console.log(`   - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
        });
      } else {
        console.log('❌ user_profiles table not found');
      }
    } catch (err) {
      console.log('⚠️ Could not check table structure:', err.message);
    }

    // Test if we can insert into user_profiles manually
    console.log('\n2️⃣ Testing manual insert into user_profiles...');
    try {
      const testUser = {
        id: '00000000-0000-0000-0000-000000000001', // Fake UUID for testing
        email: 'test@example.com',
        name: 'Test User',
        role: 'owner'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('user_profiles')
        .insert(testUser)
        .select();
      
      if (insertError) {
        if (insertError.message.includes('violates foreign key constraint')) {
          console.log('⚠️ Insert failed due to foreign key constraint (expected - fake user ID)');
        } else if (insertError.message.includes('user_role')) {
          console.log('❌ Insert failed due to user_role type issue:', insertError.message);
        } else {
          console.log('❌ Insert failed:', insertError.message);
        }
      } else {
        console.log('✅ Manual insert would work (structure is correct)');
        // Clean up the test record
        await supabase.from('user_profiles').delete().eq('id', testUser.id);
      }
    } catch (err) {
      console.log('❌ Manual insert test failed:', err.message);
    }

    // Check existing users in auth.users vs user_profiles
    console.log('\n3️⃣ Checking existing users...');
    try {
      const { data: profileCount, error: profileError } = await supabase
        .from('user_profiles')
        .select('id', { count: 'exact' });
      
      if (profileError) {
        console.log('❌ Cannot count user profiles:', profileError.message);
      } else {
        console.log(`📊 Current user_profiles count: ${profileCount?.length || 0}`);
      }
    } catch (err) {
      console.log('⚠️ Could not check user profiles count:', err.message);
    }

    console.log('\n4️⃣ Testing user registration with detailed error...');
    try {
      const testEmail = `diagnostic-test-${Date.now()}@example.com`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: {
            name: 'Diagnostic Test User',
            role: 'owner'
          }
        }
      });

      if (authError) {
        console.log('❌ Registration failed:', authError.message);
        if (authError.message.includes('Database error saving new user')) {
          console.log('💡 This confirms the trigger/function is broken');
        }
      } else {
        console.log('✅ Registration successful!');
        console.log('🎉 The issue appears to be resolved');
        
        // Clean up test user
        if (authData.user) {
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.log('🧹 Test user cleaned up');
        }
      }
    } catch (err) {
      console.log('❌ Registration test failed:', err.message);
    }

    console.log('\n📋 RECOMMENDED ACTIONS:');
    console.log('Since the trigger exists but registration still fails:');
    console.log('1. The function might be broken or missing');
    console.log('2. Run the function-only fix in Supabase SQL Editor:');
    console.log(`
-- Fix the function (keep existing trigger)
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
`);
    
  } catch (error) {
    console.error('💥 Diagnosis failed:', error);
  }
}

diagnoseTriggerIssue(); 