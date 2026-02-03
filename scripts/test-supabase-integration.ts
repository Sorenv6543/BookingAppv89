/**
 * E2E Integration Test Script for Supabase
 * Run with: npx tsx scripts/test-supabase-integration.ts
 * 
 * Prerequisites:
 * - Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
 * - Have at least one user in your Supabase auth
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables. Create .env.local with:');
  console.error('   VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.error('   VITE_SUPABASE_ANON_KEY=your-anon-key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test configuration
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@example.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: string;
}

const results: TestResult[] = [];

function log(message: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') {
  const prefix = {
    info: '🔍',
    success: '✅',
    error: '❌',
    warn: '⚠️'
  }[type];
  console.log(`${prefix} ${message}`);
}

async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  try {
    await testFn();
    results.push({ name, passed: true });
    log(`${name}`, 'success');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: errorMessage });
    log(`${name}: ${errorMessage}`, 'error');
  }
}

// ============================================================================
// TESTS
// ============================================================================

async function testConnection() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  log(`Connection successful. Session: ${data.session ? 'active' : 'none'}`, 'info');
}

async function testAuth() {
  // Try to sign in (won't work without valid credentials, but tests the endpoint)
  const { error } = await supabase.auth.signInWithPassword({
    email: TEST_EMAIL,
    password: TEST_PASSWORD
  });
  
  // If credentials are wrong, that's expected - we're just testing the endpoint works
  if (error && !error.message.includes('Invalid login credentials')) {
    throw error;
  }
  
  log('Auth endpoint responsive', 'info');
}

async function testBookingsTableAccess() {
  const { data, error } = await supabase
    .from('bookings')
    .select('id')
    .limit(1);
  
  // If no session, we expect an RLS error - that's correct behavior
  if (error && error.code === 'PGRST301') {
    log('Bookings table protected by RLS (expected without auth)', 'info');
    return;
  }
  
  if (error) throw error;
  log(`Bookings table accessible. Found ${data?.length || 0} rows`, 'info');
}

async function testPropertiesTableAccess() {
  const { data, error } = await supabase
    .from('properties')
    .select('id')
    .limit(1);
  
  if (error && error.code === 'PGRST301') {
    log('Properties table protected by RLS (expected without auth)', 'info');
    return;
  }
  
  if (error) throw error;
  log(`Properties table accessible. Found ${data?.length || 0} rows`, 'info');
}

async function testUserProfilesTableAccess() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id')
    .limit(1);
  
  if (error && error.code === 'PGRST301') {
    log('User profiles table protected by RLS (expected without auth)', 'info');
    return;
  }
  
  if (error) throw error;
  log(`User profiles table accessible. Found ${data?.length || 0} rows`, 'info');
}

async function testRealtimeConnection() {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      channel.unsubscribe();
      reject(new Error('Realtime connection timeout'));
    }, 5000);

    const channel = supabase
      .channel('test-channel')
      .on('system', { event: '*' }, (payload) => {
        log(`Realtime event: ${JSON.stringify(payload)}`, 'info');
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          clearTimeout(timeout);
          channel.unsubscribe();
          resolve();
        } else if (status === 'CHANNEL_ERROR') {
          clearTimeout(timeout);
          channel.unsubscribe();
          reject(new Error('Realtime channel error'));
        }
      });
  });
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('\n========================================');
  console.log('  Supabase Integration Test Suite');
  console.log('========================================\n');
  
  log(`Testing against: ${supabaseUrl}`, 'info');
  console.log('');

  await runTest('Connection Test', testConnection);
  await runTest('Auth Endpoint Test', testAuth);
  await runTest('Bookings Table RLS', testBookingsTableAccess);
  await runTest('Properties Table RLS', testPropertiesTableAccess);
  await runTest('User Profiles Table RLS', testUserProfilesTableAccess);
  await runTest('Realtime Connection', testRealtimeConnection);

  console.log('\n========================================');
  console.log('  Test Results');
  console.log('========================================\n');

  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;

  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌';
    console.log(`  ${icon} ${r.name}${r.error ? `: ${r.error}` : ''}`);
  });

  console.log('');
  console.log(`  Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('⚠️  Some tests failed. Check the troubleshooting guide:');
    console.log('   docs/supabase_migration/supabase-troubleshooting.md');
    process.exit(1);
  } else {
    console.log('🎉 All tests passed!');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
