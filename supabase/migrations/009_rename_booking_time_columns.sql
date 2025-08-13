-- 009_rename_booking_time_columns.sql
-- Rename booking time columns to be consistent with date column naming
-- Property owners think: check-out (guests leave) -> cleaning period -> check-in (new guests arrive)

-- Rename time columns to match property owner's mental model
ALTER TABLE public.bookings 
RENAME COLUMN guest_departure_time TO checkout_time;

ALTER TABLE public.bookings 
RENAME COLUMN guest_arrival_time TO checkin_time;

-- Add comments for clarity
COMMENT ON COLUMN public.bookings.checkout_time IS 'Time when previous guests check out (leave) - start of cleaning period';
COMMENT ON COLUMN public.bookings.checkin_time IS 'Time when new guests check in (arrive) - end of cleaning period';
