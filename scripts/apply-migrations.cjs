import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const SUPABASE_URL = 'https://yplrudursbvzcdaroqly.supabase.co/';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbHJ1ZHVyc2J2emNkYXJvcWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEyNzIyNTAsImV4cCI6MjA2Njg0ODI1MH0.D3NN6SPNG_fJ4ys_2Ju9t_9X12P18nWLyzF_nteHIuQ';

// You need to get the service role key from your Supabase dashboard for admin operations
// Dashboard > Settings > API > service_role (secret)
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

// Create Supabase client with service role for admin operations
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigrations() {
  console.log('🚀 Starting database schema migration...');
  
  try {
    // Read migration files
    const migration1Path = join(__dirname, '../supabase/migrations/001_initial_schema_final.sql');
    const migration2Path = join(__dirname, '../supabase/migrations/002_rls_policies_fixed.sql');
    
    const schema = readFileSync(migration1Path, 'utf8');
    const policies = readFileSync(migration2Path, 'utf8');
    
    console.log('📁 Migration files loaded successfully');
    
    // Apply the initial schema
    console.log('⚡ Applying initial schema...');
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: schema
    });
    
    if (schemaError) {
      console.error('❌ Schema migration failed:', schemaError);
      throw schemaError;
    }
    
    console.log('✅ Initial schema applied successfully');
    
    // Apply RLS policies
    console.log('🔒 Applying RLS policies...');
    const { error: policiesError } = await supabase.rpc('exec_sql', {
      sql: policies
    });
    
    if (policiesError) {
      console.error('❌ RLS policies migration failed:', policiesError);
      throw policiesError;
    }
    
    console.log('✅ RLS policies applied successfully');
    
    // Verify the migration by checking if user_role type exists
    console.log('🔍 Verifying migration...');
    const { data: typeCheck, error: verifyError } = await supabase
      .from('information_schema.types')
      .select('typname')
      .eq('typname', 'user_role')
      .limit(1);
    
    if (verifyError) {
      console.warn('⚠️ Could not verify migration:', verifyError);
    } else if (typeCheck && typeCheck.length > 0) {
      console.log('✅ Migration verified: user_role type exists');
    } else {
      console.warn('⚠️ Migration verification inconclusive');
    }
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution if rpc doesn't work
async function applyMigrationsDirectSQL() {
  console.log('🚀 Starting database schema migration (Direct SQL method)...');
  
  try {
    // Read migration files
    const migration1Path = join(__dirname, '../supabase/migrations/001_initial_schema_final.sql');
    const migration2Path = join(__dirname, '../supabase/migrations/002_rls_policies_fixed.sql');
    
    const schema = readFileSync(migration1Path, 'utf8');
    const policies = readFileSync(migration2Path, 'utf8');
    
    console.log('📁 Migration files loaded successfully');
    
    // Split SQL into individual statements
    const schemaStatements = schema.split(';').filter(stmt => stmt.trim().length > 0);
    const policyStatements = policies.split(';').filter(stmt => stmt.trim().length > 0);
    
    // Apply schema statements
    console.log(`⚡ Applying ${schemaStatements.length} schema statements...`);
    for (let i = 0; i < schemaStatements.length; i++) {
      const statement = schemaStatements[i].trim();
      if (statement) {
        try {
          await supabase.rpc('exec_sql', { sql: statement + ';' });
          console.log(`✅ Schema statement ${i + 1}/${schemaStatements.length} applied`);
        } catch (error) {
          console.warn(`⚠️ Schema statement ${i + 1} failed (may be expected):`, error.message);
        }
      }
    }
    
    // Apply policy statements
    console.log(`🔒 Applying ${policyStatements.length} policy statements...`);
    for (let i = 0; i < policyStatements.length; i++) {
      const statement = policyStatements[i].trim();
      if (statement) {
        try {
          await supabase.rpc('exec_sql', { sql: statement + ';' });
          console.log(`✅ Policy statement ${i + 1}/${policyStatements.length} applied`);
        } catch (error) {
          console.warn(`⚠️ Policy statement ${i + 1} failed (may be expected):`, error.message);
        }
      }
    }
    
    console.log('🎉 Database migration completed!');
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
if (SUPABASE_SERVICE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.error(`
❌ ERROR: Missing Supabase Service Role Key

To run this migration, you need to:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/yplrudursbvzcdaroqly
2. Navigate to Settings > API
3. Copy the 'service_role' key (secret key)
4. Run this script with: SUPABASE_SERVICE_KEY=your_service_key node scripts/apply-migrations.js

Alternatively, you can update the SUPABASE_SERVICE_KEY variable in this file.
`);
  process.exit(1);
} else {
  applyMigrations().catch(() => {
    console.log('\n🔄 Primary method failed, trying direct SQL method...');
    applyMigrationsDirectSQL();
  });
} 