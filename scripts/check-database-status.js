import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env
const SUPABASE_URL = 'https://yplrudursbvzcdaroqly.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbHJ1ZHVyc2J2emNkYXJvcWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzIyNTAsImV4cCI6MjA2Njg0ODI1MH0.D3NN6SPNG_fJ4ys_2Ju9t_9X12P18nWLyzF_nteHIuQ';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkDatabaseStatus() {
  console.log('🔍 Checking current database status...\n');
  
  try {
    // Check if user_role type exists
    console.log('1️⃣ Checking user_role type...');
    const { data: typeData, error: typeError } = await supabase
      .from('pg_type')
      .select('typname')
      .eq('typname', 'user_role')
      .limit(1);
      
    if (typeError) {
      console.log('❌ Cannot check user_role type:', typeError.message);
    } else if (typeData && typeData.length > 0) {
      console.log('✅ user_role type exists');
    } else {
      console.log('❌ user_role type does not exist');
    }

    // Check if main tables exist
    console.log('\n2️⃣ Checking main tables...');
    const tablesToCheck = ['user_profiles', 'properties', 'bookings'];
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
          
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log(`❌ Table '${tableName}' does not exist`);
          } else {
            console.log(`⚠️ Table '${tableName}' exists but error accessing it:`, error.message);
          }
        } else {
          console.log(`✅ Table '${tableName}' exists and accessible`);
        }
      } catch (err) {
        console.log(`❌ Table '${tableName}' check failed:`, err.message);
      }
    }

    // Check if we can create a test user profile
    console.log('\n3️⃣ Testing user profile creation...');
    try {
      // Try to sign up a test user (this will test the trigger)
      const testEmail = `test-${Date.now()}@example.com`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: {
            name: 'Test User',
            role: 'owner'
          }
        }
      });

      if (authError) {
        if (authError.message.includes('user_role')) {
          console.log('❌ User registration still failing due to user_role issues');
        } else {
          console.log('⚠️ User registration error (may be expected):', authError.message);
        }
      } else {
        console.log('✅ User registration appears to be working');
        
        // Clean up the test user
        if (authData.user) {
          await supabase.auth.admin.deleteUser(authData.user.id);
          console.log('🧹 Test user cleaned up');
        }
      }
    } catch (err) {
      console.log('❌ User registration test failed:', err.message);
    }

    console.log('\n📋 Summary:');
    console.log('- If user_role type exists but tables are missing, run the complete schema migration');
    console.log('- If tables exist but user registration fails, check the trigger setup');
    console.log('- If everything looks good, try creating a real user in your app');
    
  } catch (error) {
    console.error('💥 Database status check failed:', error);
  }
}

checkDatabaseStatus(); 