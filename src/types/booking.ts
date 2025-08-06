/**
 * Booking Type Definitions
 * Types for bookings/events in the property cleaning scheduler
 */

/**
 * Valid booking types
 * 'turn' bookings are high priority same-day checkout/checkin
 * 'standard' bookings are regular cleanings with time gap
 */
export type BookingType = 'standard' | 'turn';

/**
 * Valid booking statuses
 * Defines the workflow of a booking
 */
export type BookingStatus = 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Booking Interface
 * Core data model for booking/cleaning events
 */
//todo 
export interface Booking {
  id: string;
  property_id: string;
  owner_id: string;
  guest_departure_date: string; // ISO date when guests leave (was checkout_date)
  guest_arrival_date: string;   // ISO date when new guests arrive (was checkin_date)
  guest_departure_time?: string; // Optional time when guests leave (HH:MM format)
  guest_arrival_time?: string;   // Optional time when guests arrive (HH:MM format)
  time_until_next_guest_arrival: number; // minutes
  booking_type: BookingType;
  status: BookingStatus;
  guest_count?: number;
  special_instructions?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assigned_cleaner_id?: string;
  upcharge_reason?: string;
  upcharge_amount?: number;
  cleaning_duration?: number; // minutes
  created_at?: string;
  updated_at?: string;
  // Add index signature to allow conversion to Record<string, unknown>
  [key: string]: unknown;
}

/**
 * Extended booking with calculated fields
 * Used for display and business logic
 */
export interface BookingWithMetadata extends Booking {
  property_name?: string;
  cleaning_window?: {
    start: string;
    end: string;
    duration: number; // minutes
  };
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

/**
 * Form data for creating/editing bookings
 * Includes optional start/end properties for FullCalendar integration
 */
export type BookingFormData = Omit<Booking, 'id' | 'created_at' | 'updated_at'> & {
  start?: string;
  end?: string;
};

/**
 * Map type for booking collections
 */
export type BookingMap = Map<string, Booking>;

/**
 * Type guard for Booking objects
 */
export function isBooking(obj: unknown): obj is Booking {
  if (typeof obj !== 'object' || obj === null) return false;
  const b = obj as Partial<Booking>;
  return (
    typeof b.id === 'string' &&
    typeof b.property_id === 'string' &&
    typeof b.guest_departure_date === 'string' &&
    typeof b.guest_arrival_date === 'string'
  );
}
