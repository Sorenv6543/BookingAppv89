#!/usr/bin/env node

/**
 * Apply Supabase Migrations for TASK-080b
 * Database Schema & RLS Setup
 * 
 * This script helps apply the migration files created for multi-tenant security
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 TASK-080b : Supabase Migration Setup');
console.log('=====================================\n');

// Check if migration files exist
const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
const schemaFile = path.join(migrationsDir, '001_initial_schema.sql');
const rlsFile = path.join(migrationsDir, '002_rls_policies.sql');

console.log('📋 Checking migration files...');

if (!fs.existsSync(schemaFile)) {
  console.error('❌ Schema file not found:', schemaFile);
  process.exit(1);
}

if (!fs.existsSync(rlsFile)) {
  console.error('❌ RLS policies file not found:', rlsFile);
  process.exit(1);
}

console.log('✅ Migration files found!');
console.log('  - 001_initial_schema.sql');
console.log('  - 002_rls_policies.sql\n');

console.log('🔧 To apply these migrations, run the following commands:\n');

console.log('1. Start Supabase locally:');
console.log('   supabase start\n');

console.log('2. Apply schema migration:');
console.log(`   supabase db reset\n`);

console.log('3. Or apply manually via SQL:');
console.log('   supabase db reset --db-url="your-database-url"\n');

console.log('4. Verify the setup:');
console.log('   node scripts/verify-supabase-setup.js\n');

console.log('📖 Migration Details:');
console.log('=====================');

// Read and display migration summaries
try {
  // Verify files can be read
  fs.readFileSync(schemaFile, 'utf8');
  fs.readFileSync(rlsFile, 'utf8');
  
  console.log('\n📊 Schema Migration (001_initial_schema.sql):');
  console.log('- Multi-tenant user profiles table');
  console.log('- Properties table with owner_id filtering');
  console.log('- Bookings table with owner_id and property_id relationships');
  console.log('- Performance indexes for RLS queries');
  console.log('- Security definer functions for role checking');
  console.log('- Enum types for consistent data validation');

  console.log('\n🔐 RLS Policies Migration (002_rls_policies.sql):');
  console.log('- Owner data isolation policies');
  console.log('- Admin system-wide access policies');
  console.log('- Cleaner limited access policies');
  console.log('- Security validation functions');
  console.log('- RLS testing and verification functions');

  console.log('\n🎯 Security Model:');
  console.log('- Owners: Can only access their own properties and bookings');
  console.log('- Admins: Can access all data across all tenants');
  console.log('- Cleaners: Can only access assigned bookings');
  console.log('- Database-level security (not just frontend filtering)');

} catch (err) {
  console.error('Error reading migration files:', err.message);
}

console.log('\n🚀 Ready to implement true multi-tenant security!');
console.log('   This replaces frontend filtering with database-level RLS.\n');

// Check for Supabase CLI
const { execSync } = require('child_process');

try {
  execSync('supabase --version', { stdio: 'pipe' });
  console.log('✅ Supabase CLI is installed');
} catch {
  console.log('⚠️  Supabase CLI not found. Install with:');
  console.log('   npm install -g supabase');
}

console.log('\n📚 Next Steps:');
console.log('1. Review migration files in supabase/migrations/');
console.log('2. Start local Supabase: supabase start');
console.log('3. Apply migrations: supabase db reset');
console.log('4. Test RLS policies with sample data');
console.log('5. Update composables to use Supabase client');
console.log('6. Verify multi-tenant security isolation\n'); 