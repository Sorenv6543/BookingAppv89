/**
 * Type Helper Utilities
 * Safe type conversion and accessor functions for handling unknown types
 */

import type { Booking } from '@/types/booking';

/**
 * Safely converts unknown values to Date objects
 * @param value - The value to convert to Date
 * @returns Valid Date object or current date if invalid
 */
export function safeDate(value: unknown): Date {
  if (value instanceof Date) {
    return value;
  }
  
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  
  // Fallback to current date for any other type
  return new Date();
}

/**
 * Safely converts unknown values to strings
 * @param value - The value to convert to string
 * @param fallback - Fallback string if conversion fails
 * @returns Valid string
 */
export function safeString(value: unknown, fallback: string = ''): string {
  if (typeof value === 'string') {
    return value;
  }
  
  if (value === null || value === undefined) {
    return fallback;
  }
  
  return String(value);
}

/**
 * Safely accesses booking field with proper typing
 * @param booking - The booking object (possibly with unknown types)
 * @param field - The field name to access
 * @returns Typed field value or fallback
 */
export function safeBookingField(booking: any, field: keyof Booking): string {
  const value = booking?.[field];
  return safeString(value);
}

/**
 * Safely gets departure date from booking
 * @param booking - The booking object
 * @returns Valid Date object
 */
export function safeDepartureDate(booking: any): Date {
  const dateValue = booking?.guest_departure_date;
  return safeDate(dateValue);
}

/**
 * Safely gets arrival date from booking
 * @param booking - The booking object
 * @returns Valid Date object
 */
export function safeArrivalDate(booking: any): Date {
  const dateValue = booking?.guest_arrival_date;
  return safeDate(dateValue);
}

/**
 * Type guard to check if value is a valid date string
 * @param value - Value to check
 * @returns True if valid date string
 */
export function isValidDateString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

/**
 * Type guard for checking if object has booking-like properties
 * @param obj - Object to check
 * @returns True if object has basic booking properties
 */
export function isBookingLike(obj: any): obj is Partial<Booking> {
  return obj && 
         typeof obj === 'object' && 
         obj.guest_departure_date &&
         obj.guest_arrival_date;
}