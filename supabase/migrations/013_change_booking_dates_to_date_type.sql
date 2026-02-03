-- Change booking date columns from TIMESTAMPTZ to DATE
-- This allows storing dates without time components

-- Drop existing constraints that reference these columns
ALTER TABLE public.bookings
DROP CONSTRAINT IF EXISTS booking_dates_valid;

-- Change column types to DATE
ALTER TABLE public.bookings
ALTER COLUMN checkin_date TYPE DATE USING checkin_date::DATE;

ALTER TABLE public.bookings
ALTER COLUMN checkout_date TYPE DATE USING checkout_date::DATE;

-- Re-add constraint with DATE comparison
ALTER TABLE public.bookings
ADD CONSTRAINT booking_dates_valid 
CHECK (checkin_date <= checkout_date);

-- Update comments
COMMENT ON COLUMN public.bookings.checkin_date IS 'Date when guests check in (arrive) - DATE only, no time component';
COMMENT ON COLUMN public.bookings.checkout_date IS 'Date when guests check out (depart) - DATE only, no time component';
