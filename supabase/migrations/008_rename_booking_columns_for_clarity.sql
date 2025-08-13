-- 008_rename_booking_columns_for_clarity.sql
-- Rename booking columns to be more intuitive for property owners
-- Property owners think: check-out (guests leave) -> cleaning period -> check-in (new guests arrive)

-- Drop the existing constraint first
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS booking_dates_valid;

-- Rename columns to match property owner's mental model
ALTER TABLE public.bookings 
RENAME COLUMN guest_departure_date TO checkout_date;

ALTER TABLE public.bookings 
RENAME COLUMN guest_arrival_date TO checkin_date;

-- Add the corrected constraint with proper logic
-- For cleaning bookings: checkout_date should be BEFORE checkin_date
-- This represents: guests leave -> cleaning period -> new guests arrive
ALTER TABLE public.bookings 
ADD CONSTRAINT booking_dates_valid 
CHECK (checkout_date < checkin_date);

-- Update indexes to use new column names
DROP INDEX IF EXISTS idx_bookings_guest_departure_date;
DROP INDEX IF EXISTS idx_bookings_guest_arrival_date;
DROP INDEX IF EXISTS idx_bookings_dates;

-- Create new indexes with correct column names
CREATE INDEX idx_bookings_checkout_date ON public.bookings(checkout_date);
CREATE INDEX idx_bookings_checkin_date ON public.bookings(checkin_date);
CREATE INDEX idx_bookings_dates ON public.bookings(checkout_date, checkin_date);

-- Add comments for clarity
COMMENT ON COLUMN public.bookings.checkout_date IS 'Date when previous guests check out (leave) - start of cleaning period';
COMMENT ON COLUMN public.bookings.checkin_date IS 'Date when new guests check in (arrive) - end of cleaning period';
COMMENT ON CONSTRAINT booking_dates_valid ON public.bookings IS 'Ensures checkout date is before checkin date for cleaning bookings';
