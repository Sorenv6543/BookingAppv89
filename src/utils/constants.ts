/**
 * System Constants for Property Cleaning Scheduler
 */

// Booking Time Defaults (from TIMEDEFAULT.md)
export const DEFAULT_CHECKOUT_TIME = '11:00';
export const DEFAULT_CHECKIN_TIME = '15:00'; // 3:00 PM

// Time formatting helpers
export const TIME_FORMAT = 'HH:mm';
export const TIME_DISPLAY_FORMAT = 'h:mm A'; // 11:00 AM, 3:00 PM

// Business logic constants
export const MIN_CLEANING_WINDOW_MINUTES = 120; // 2 hours minimum
export const TURN_BUFFER_MINUTES = 30; // 30 minutes buffer for turn bookings
export const STANDARD_BUFFER_MINUTES = 60; // 1 hour buffer for standard bookings

// Validation constants
export const MAX_GUEST_COUNT = 20;
export const MIN_GUEST_COUNT = 1;

// UI constants
export const MAX_NOTES_LENGTH = 500;
export const MAX_PROPERTY_NAME_LENGTH = 100;
export const MAX_ADDRESS_LENGTH = 200; 