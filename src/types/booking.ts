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
export interface Booking {
  id: string;
  property_id: string;
  owner_id: string;
  checkout_date: string; // ISO date when guests leave
  checkin_date: string;  // ISO date when new guests arrive
  booking_type: BookingType;
  status: BookingStatus;
  guest_count?: number;
  notes?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  assigned_cleaner_id?: string;
  created_at?: string;
  updated_at?: string;
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
 */
export type BookingFormData = Omit<Booking, 'id' | 'created_at' | 'updated_at'>;

/**
 * Map type for booking collections
 */
export type BookingMap = Map<string, Booking>;

/**
 * Type guard for Booking objects
 */
export function isBooking(obj: any): obj is Booking {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.property_id === 'string' &&
    typeof obj.checkout_date === 'string' &&
    typeof obj.checkin_date === 'string';
}
