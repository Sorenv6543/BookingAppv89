#!/usr/bin/env node

/**
 * Fix Database Schema for TASK-080
 * Check and apply missing columns in bookings table
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env.local file for:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabaseSchema() {
  console.log('🔍 Checking database schema...\n');

  try {
    // Check if bookings table exists and get its structure
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'bookings')
      .eq('table_schema', 'public');

    if (tableError) {
      console.error('❌ Error checking table structure:', tableError);
      return;
    }

    console.log('📊 Current bookings table columns:');
    if (tableInfo && tableInfo.length > 0) {
      tableInfo.forEach(col => {
        console.log(`  - ${col.column_name} (${col.data_type}, nullable: ${col.is_nullable})`);
      });
    } else {
      console.log('  No columns found - table may not exist');
    }

    // Check for specific required columns
    const requiredColumns = ['id', 'property_id', 'owner_id', 'checkout_date', 'checkin_date', 'booking_type', 'status'];
    const existingColumns = tableInfo ? tableInfo.map(col => col.column_name) : [];
    
    console.log('\n🔍 Checking required columns:');
    const missingColumns = requiredColumns.filter(col => !existingColumns.includes(col));
    
    if (missingColumns.length > 0) {
      console.log('❌ Missing columns:', missingColumns);
      console.log('\n⚠️  Database schema needs to be updated.');
      console.log('Please run the Supabase migrations:');
      console.log('1. Install Supabase CLI: npm install -g supabase');
      console.log('2. Start Supabase: supabase start');
      console.log('3. Apply migrations: supabase db reset');
    } else {
      console.log('✅ All required columns exist');
    }

    // Test a simple query to see if the table is accessible
    console.log('\n🧪 Testing table access...');
    const { data: testData, error: testError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('❌ Table access error:', testError);
    } else {
      console.log('✅ Table is accessible');
      console.log(`📊 Found ${testData ? testData.length : 0} records`);
    }

  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

async function applySchemaFix() {
  console.log('\n🔧 Attempting to apply schema fix...\n');

  try {
    // This would require admin privileges to modify schema
    // For now, just provide instructions
    console.log('⚠️  Schema modification requires admin privileges.');
    console.log('Please apply the migrations manually:\n');
    
    console.log('1. Install Supabase CLI:');
    console.log('   npm install -g supabase\n');
    
    console.log('2. Start Supabase locally:');
    console.log('   supabase start\n');
    
    console.log('3. Apply migrations:');
    console.log('   supabase db reset\n');
    
    console.log('4. Or apply to remote database:');
    console.log('   supabase db push\n');

  } catch (error) {
    console.error('❌ Error applying schema fix:', error);
  }
}

async function main() {
  console.log('🚀 Database Schema Fix for TASK-080');
  console.log('===================================\n');

  await checkDatabaseSchema();
  await applySchemaFix();

  console.log('\n📚 Next Steps:');
  console.log('1. Apply the Supabase migrations to create the proper schema');
  console.log('2. Verify the bookings table has all required columns');
  console.log('3. Test the application to ensure data access works correctly');
  console.log('4. Check that RLS policies are properly applied\n');
}

main().catch(console.error); 