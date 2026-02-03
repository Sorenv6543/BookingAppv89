-- RLS Policy Test Script
-- Run this in Supabase SQL Editor to verify RLS is working correctly
-- Before running: Create two test users with different owner_ids

-- ============================================================================
-- SETUP: Create test data (run once)
-- ============================================================================

-- First, check if we have test users
SELECT id, email, role FROM auth.users LIMIT 5;
SELECT id, email, role FROM user_profiles LIMIT 5;

-- ============================================================================
-- TEST 1: Verify RLS is enabled on all tables
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_profiles', 'properties', 'bookings')
ORDER BY tablename;

-- Expected: All tables should show rls_enabled = true

-- ============================================================================
-- TEST 2: List all RLS policies
-- ============================================================================
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ============================================================================
-- TEST 3: Test owner isolation (requires two different owner accounts)
-- ============================================================================

-- Replace these with actual user IDs from your auth.users table
-- Owner A: Replace 'OWNER_A_ID' with a real user ID
-- Owner B: Replace 'OWNER_B_ID' with a different user ID

-- Simulate being Owner A
-- In the app, login as Owner A and run:
-- SELECT * FROM bookings;
-- Should only return Owner A's bookings

-- Simulate being Owner B  
-- In the app, login as Owner B and run:
-- SELECT * FROM bookings;
-- Should only return Owner B's bookings (different from Owner A)

-- ============================================================================
-- TEST 4: Verify helper functions exist
-- ============================================================================
SELECT 
    routine_schema,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'private'
AND routine_name IN ('current_user_id', 'is_admin', 'is_owner', 'is_cleaner');

-- Expected: All 4 functions should exist

-- ============================================================================
-- TEST 5: Check booking insert constraints
-- ============================================================================

-- This should FAIL if checkout_date <= checkin_date
-- INSERT INTO bookings (property_id, owner_id, checkin_date, checkout_date, status)
-- VALUES ('some-property-id', 'some-owner-id', '2026-02-20', '2026-02-19', 'pending');
-- Expected: ERROR - check constraint violation

-- ============================================================================
-- TEST 6: Verify property-booking relationship
-- ============================================================================
SELECT 
    b.id as booking_id,
    b.owner_id as booking_owner,
    p.id as property_id,
    p.owner_id as property_owner,
    b.owner_id = p.owner_id as owner_matches
FROM bookings b
JOIN properties p ON b.property_id = p.id
LIMIT 10;

-- Expected: owner_matches should be TRUE for all rows

-- ============================================================================
-- CLEANUP (optional - run only if you want to remove test data)
-- ============================================================================
-- DELETE FROM bookings WHERE property_id IN (SELECT id FROM properties WHERE name LIKE 'TEST_%');
-- DELETE FROM properties WHERE name LIKE 'TEST_%';

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- After running these tests, verify:
-- ✓ RLS is enabled on all 3 tables
-- ✓ Policies exist for SELECT, INSERT, UPDATE, DELETE
-- ✓ Owner isolation works (owners can't see each other's data)
-- ✓ Admins can see all data
-- ✓ Helper functions are available
