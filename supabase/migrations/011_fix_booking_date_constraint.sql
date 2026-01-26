-- 011_fix_booking_date_constraint.sql
-- Fix booking date constraint to use standard hotel model
-- Guest checkin should be ON OR BEFORE checkout (guests arrive, then depart)
-- Allow same-day bookings (turn bookings) where checkin_date == checkout_date

-- Drop the backwards constraint
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS booking_dates_valid;

-- Add the CORRECT constraint
-- Standard hotel model: guests check in (arrive), then check out (depart)
-- So checkin_date must be ON OR BEFORE checkout_date
-- This allows same-day stays (turn bookings) where dates are equal but times differ
ALTER TABLE public.bookings 
ADD CONSTRAINT booking_dates_valid 
CHECK (checkin_date <= checkout_date);

-- Update comments to reflect correct model
COMMENT ON COLUMN public.bookings.checkin_date IS 'Date when guests check in (arrive) - start of guest stay';
COMMENT ON COLUMN public.bookings.checkout_date IS 'Date when guests check out (depart) - end of guest stay';
COMMENT ON CONSTRAINT booking_dates_valid ON public.bookings IS 'Ensures checkin date is on or before checkout date (standard hotel model, allows same-day stays for turn bookings)';
