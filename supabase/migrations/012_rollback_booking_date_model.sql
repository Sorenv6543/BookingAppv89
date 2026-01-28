-- Migration 012: Rollback script for booking date model changes
-- Use this ONLY if migration 011 causes production issues
-- 
-- WARNING: This rollback will:
-- 1. Remove the cleaning_tasks table and all its data
-- 2. Swap booking dates back to the old "cleaning window" model
-- 3. Restore the old date constraint (checkout < checkin)
-- 
-- IMPORTANT: Make a full database backup before running this rollback!

BEGIN;

-- ============================================================================
-- PART 1: Drop Triggers and Functions
-- ============================================================================

-- Drop the trigger first (if it was enabled)
DROP TRIGGER IF EXISTS trg_generate_turnover_task ON public.bookings;

-- Drop the trigger function
DROP FUNCTION IF EXISTS public.generate_turnover_task();

-- ============================================================================
-- PART 2: Swap Dates Back to Old Model (Cleaning Window)
-- ============================================================================

-- Swap dates back to old model where checkout_date < checkin_date
-- This reverses the swap done in migration 011
-- OLD MODEL: checkout_date (guests leave) < checkin_date (next guests arrive)
UPDATE public.bookings
SET 
  checkin_date = checkout_date,
  checkout_date = checkin_date
WHERE checkin_date < checkout_date; -- Only swap if in new model format

-- ============================================================================
-- PART 3: Drop New Constraint and Restore Old Constraint
-- ============================================================================

-- Drop the new date constraint (checkin < checkout)
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS booking_dates_valid;

-- Restore old constraint (checkout < checkin for cleaning window)
ALTER TABLE public.bookings
ADD CONSTRAINT booking_dates_valid CHECK (checkout_date < checkin_date);

-- ============================================================================
-- PART 4: Drop Cleaning Tasks Table
-- ============================================================================

-- Drop cleaning_tasks table (cascade to remove RLS policies and triggers)
DROP TABLE IF EXISTS public.cleaning_tasks CASCADE;

-- ============================================================================
-- PART 5: Restore Old Column Comments (Cleaning Window Semantics)
-- ============================================================================

-- Update booking column comments back to cleaning window semantics
COMMENT ON COLUMN public.bookings.checkout_date IS 'When the previous guest checks out (cleaning window start) - date format';
COMMENT ON COLUMN public.bookings.checkin_date IS 'When the next guest checks in (cleaning window end) - date format';
COMMENT ON COLUMN public.bookings.checkout_time IS 'Time when previous guest departs (HH:MM format)';
COMMENT ON COLUMN public.bookings.checkin_time IS 'Time when next guest arrives (HH:MM format)';
COMMENT ON COLUMN public.bookings.booking_type IS 'Type: turn (same-day cleaning), standard (multi-day cleaning), block (unavailable)';
COMMENT ON CONSTRAINT booking_dates_valid ON public.bookings IS 'Ensures checkout date is before checkin date for cleaning windows (old model)';

-- Restore assigned_cleaner_id comment (no longer deprecated)
COMMENT ON COLUMN public.bookings.assigned_cleaner_id IS 'Reference to the cleaner assigned to this booking cleanup';

COMMIT;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these queries after rollback to verify data integrity

-- Check 1: All bookings should have correct date ordering (old model)
SELECT 
  'Booking Date Order Check' AS check_name,
  COUNT(*) AS total_bookings,
  SUM(CASE WHEN checkout_date < checkin_date THEN 1 ELSE 0 END) AS valid_bookings,
  SUM(CASE WHEN checkout_date >= checkin_date THEN 1 ELSE 0 END) AS invalid_bookings
FROM public.bookings;

-- Check 2: Verify cleaning_tasks table is removed
SELECT 
  'Cleaning Tasks Table Check' AS check_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'cleaning_tasks'
    ) THEN '✗ FAILED - Table still exists'
    ELSE '✓ PASSED - Table removed'
  END AS status;

-- Check 3: Verify constraint is correct
SELECT 
  'Constraint Check' AS check_name,
  constraint_name,
  check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'booking_dates_valid';

-- Check 4: Sample booking data (first 10 records)
SELECT 
  id, 
  property_id,
  checkout_date,
  checkin_date,
  booking_type,
  CASE 
    WHEN checkout_date < checkin_date THEN '✓ Valid (old model)'
    ELSE '✗ INVALID - needs manual fix'
  END AS validation_status,
  checkout_date - checkin_date AS days_between
FROM public.bookings
ORDER BY checkout_date DESC
LIMIT 10;

-- ============================================================================
-- ROLLBACK COMPLETE
-- ============================================================================

-- If you see any INVALID bookings in the verification queries above,
-- you may need to manually fix them before the application can function properly.
-- 
-- Next steps after rollback:
-- 1. Verify all checks above pass
-- 2. Redeploy frontend code to use old booking model
-- 3. Test booking creation and viewing
-- 4. Monitor for any remaining issues
