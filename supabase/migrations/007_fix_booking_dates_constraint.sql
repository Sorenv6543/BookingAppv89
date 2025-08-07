-- 007_fix_booking_dates_constraint.sql
-- Fix the booking_dates_valid constraint which is currently backwards
-- For cleaning bookings: guest_departure_date should be BEFORE guest_arrival_date

-- First, fix the existing data by swapping the dates
-- The current data has departure_date > arrival_date, which is backwards
-- We need to swap them so departure_date < arrival_date
UPDATE public.bookings 
SET 
  guest_departure_date = guest_arrival_date,
  guest_arrival_date = guest_departure_date
WHERE guest_departure_date > guest_arrival_date;

-- Drop the existing incorrect constraint
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS booking_dates_valid;

-- Add the corrected constraint with proper logic
-- guest_departure_date should be BEFORE guest_arrival_date for cleaning bookings
ALTER TABLE public.bookings 
ADD CONSTRAINT booking_dates_valid 
CHECK (guest_departure_date < guest_arrival_date);

-- Update the comment to reflect the correct logic
COMMENT ON CONSTRAINT booking_dates_valid ON public.bookings IS 'Ensures departure date is before arrival date for cleaning bookings';
