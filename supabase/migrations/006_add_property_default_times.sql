-- Migration: Add default time fields to properties table
-- Description: Add default checkout and checkin times to properties for smart booking defaults
-- Date: 2025-01-XX

-- Add default time columns to properties table
ALTER TABLE public.properties 
ADD COLUMN default_checkout_time TIME DEFAULT '11:00',
ADD COLUMN default_checkin_time TIME DEFAULT '15:00';

-- Add comments for documentation
COMMENT ON COLUMN public.properties.default_checkout_time IS 'Default checkout time for this property (HH:MM format)';
COMMENT ON COLUMN public.properties.default_checkin_time IS 'Default checkin time for this property (HH:MM format)';

-- Add constraint to ensure valid time format
ALTER TABLE public.properties 
ADD CONSTRAINT valid_default_checkout_time CHECK (default_checkout_time IS NULL OR default_checkout_time::text ~ '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'),
ADD CONSTRAINT valid_default_checkin_time CHECK (default_checkin_time IS NULL OR default_checkin_time::text ~ '^([01]?[0-9]|2[0-3]):[0-5][0-9]$');

-- Update existing properties to have the default times
UPDATE public.properties 
SET 
  default_checkout_time = '11:00',
  default_checkin_time = '15:00'
WHERE default_checkout_time IS NULL OR default_checkin_time IS NULL; 