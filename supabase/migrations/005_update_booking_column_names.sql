-- 005_update_booking_column_names.sql
-- Update booking column names to match application code
-- Fix column names and date constraint logic

-- ============================================================================
-- RENAME BOOKING COLUMNS TO MATCH APPLICATION CODE
-- ============================================================================

-- Drop the existing constraint first
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS booking_dates_valid;

-- Rename columns to match our application code
ALTER TABLE public.bookings 
RENAME COLUMN checkout_date TO guest_departure_date;

ALTER TABLE public.bookings 
RENAME COLUMN checkin_date TO guest_arrival_date;

-- Add the corrected constraint with proper logic
-- guest_arrival_date should be before guest_departure_date
ALTER TABLE public.bookings 
ADD CONSTRAINT booking_dates_valid 
CHECK (guest_arrival_date <= guest_departure_date);

-- Update indexes to use new column names
DROP INDEX IF EXISTS idx_bookings_checkout_date;
DROP INDEX IF EXISTS idx_bookings_checkin_date;
DROP INDEX IF EXISTS idx_bookings_dates;

-- Create new indexes with correct column names
CREATE INDEX idx_bookings_guest_departure_date ON public.bookings(guest_departure_date);
CREATE INDEX idx_bookings_guest_arrival_date ON public.bookings(guest_arrival_date);
CREATE INDEX idx_bookings_dates ON public.bookings(guest_arrival_date, guest_departure_date);

-- Add comment for clarity
COMMENT ON COLUMN public.bookings.guest_arrival_date IS 'Date when guest arrives (check-in date)';
COMMENT ON COLUMN public.bookings.guest_departure_date IS 'Date when guest departs (check-out date)';
COMMENT ON CONSTRAINT booking_dates_valid ON public.bookings IS 'Ensures arrival date is before or equal to departure date';