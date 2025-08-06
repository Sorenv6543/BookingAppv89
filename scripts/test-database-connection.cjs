#!/usr/bin/env node

/**
 * Test Database Connection for TASK-080
 * Check what tables and columns are actually available
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n');

  try {
    // Test basic connection
    console.log('1. Testing auth service...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Auth service error:', authError);
    } else {
      console.log('✅ Auth service working');
      if (authData.session) {
        console.log('   User logged in:', authData.session.user.id);
      } else {
        console.log('   No active session');
      }
    }

    // Test if bookings table exists
    console.log('\n2. Testing bookings table...');
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (bookingsError) {
      console.error('❌ Bookings table error:', bookingsError);
      
      // Try to get table info
      console.log('\n3. Checking available tables...');
      const { data: tablesData, error: tablesError } = await supabase
        .from('pg_tables')
        .select('tablename')
        .eq('schemaname', 'public');

      if (tablesError) {
        console.error('❌ Cannot check tables:', tablesError);
      } else if (tablesData) {
        console.log('📊 Available tables:');
        tablesData.forEach(table => {
          console.log(`   - ${table.tablename}`);
        });
      }
    } else {
      console.log('✅ Bookings table accessible');
      console.log(`📊 Found ${bookingsData ? bookingsData.length : 0} records`);
      
      if (bookingsData && bookingsData.length > 0) {
        console.log('📋 Sample booking columns:');
        const sampleBooking = bookingsData[0];
        Object.keys(sampleBooking).forEach(key => {
          console.log(`   - ${key}: ${typeof sampleBooking[key]}`);
        });
      }
    }

    // Test properties table
    console.log('\n4. Testing properties table...');
    const { data: propertiesData, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);

    if (propertiesError) {
      console.error('❌ Properties table error:', propertiesError);
    } else {
      console.log('✅ Properties table accessible');
      console.log(`📊 Found ${propertiesData ? propertiesData.length : 0} records`);
    }

    // Test user_profiles table
    console.log('\n5. Testing user_profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);

    if (profilesError) {
      console.error('❌ User profiles table error:', profilesError);
    } else {
      console.log('✅ User profiles table accessible');
      console.log(`📊 Found ${profilesData ? profilesData.length : 0} records`);
    }

  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

async function main() {
  console.log('🚀 Database Connection Test for TASK-080');
  console.log('========================================\n');

  await testConnection();

  console.log('\n📚 Analysis:');
  console.log('If tables are missing or have wrong columns, the database schema needs to be updated.');
  console.log('Please run the Supabase migrations to fix the schema.\n');
}

main().catch(console.error); 