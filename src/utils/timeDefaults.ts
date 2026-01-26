/**
 * Time Defaults Utility Functions
 * Handles smart defaults for booking times based on property settings
 */

import { DEFAULT_CHECKOUT_TIME, DEFAULT_CHECKIN_TIME } from './constants';
import type { Property } from '@/types/property';

/**
 * Convert database time format (HH:MM:SS) to frontend format (HH:MM)
 */
function formatTimeForInput(time: string): string {
  if (!time) return '';
  
  // If already in HH:MM format, return as-is
  if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
    return time;
  }
  
  // Convert HH:MM:SS to HH:MM
  if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(time)) {
    return time.substring(0, 5);
  }
  
  // Return original if format is unrecognized
  return time;
}

/**
 * Get the default checkout time for a property
 * Uses property-specific default if available, otherwise system default
 */
export function getDefaultCheckoutTime(property?: Property): string {
  console.log('🔍 getDefaultCheckoutTime called with property:', property);
  const dbTime = property?.default_checkout_time || DEFAULT_CHECKOUT_TIME;
  const result = formatTimeForInput(dbTime);
  console.log('🔍 getDefaultCheckoutTime result:', result);
  return result;
}

/**
 * Get the default checkin time for a property
 * Uses property-specific default if available, otherwise system default
 */
export function getDefaultCheckinTime(property?: Property): string {
  console.log('🔍 getDefaultCheckinTime called with property:', property);
  const dbTime = property?.default_checkin_time || DEFAULT_CHECKIN_TIME;
  const result = formatTimeForInput(dbTime);
  console.log('🔍 getDefaultCheckinTime result:', result);
  return result;
}

/**
 * Get both default times for a property
 */
export function getDefaultTimes(property?: Property): {
  checkout: string;
  checkin: string;
} {
  console.log('🔍 getDefaultTimes called with property:', property);
  const result = {
    checkout: getDefaultCheckoutTime(property),
    checkin: getDefaultCheckinTime(property)
  };
  console.log('🔍 getDefaultTimes result:', result);
  return result;
}

/**
 * Format time for display (e.g., '11:00' -> '11:00 AM')
 */
export function formatTimeForDisplay(time: string): string {
  if (!time) return '';
  
  // Convert to HH:MM format first if needed
  const normalizedTime = formatTimeForInput(time);
  
  try {
    const [hours, minutes] = normalizedTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return normalizedTime; // Return normalized time if parsing fails
  }
}

/**
 * Validate that checkin time is before checkout time (industry standard)
 * For guest stays: guests arrive (checkin), stay, then depart (checkout)
 */
export function validateTimeOrder(checkinTime: string, checkoutTime: string): {
  valid: boolean;
  error?: string;
} {
  if (!checkinTime || !checkoutTime) {
    return { valid: false, error: 'Both checkin and checkout times are required' };
  }

  try {
    const checkin = new Date(`2000-01-01T${checkinTime}:00`);
    const checkout = new Date(`2000-01-01T${checkoutTime}:00`);
    
    if (checkin >= checkout) {
      return { 
        valid: false, 
        error: 'Checkin time must be before checkout time' 
      };
    }
    
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid time format' };
  }
}

/**
 * Validate time format (HH:MM)
 */
export function validateTimeFormat(time: string): boolean {
  if (!time) return false;
  return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);
}

/**
 * Get time validation rules for Vuetify forms
 */
export function getTimeValidationRules(property?: Property) {
  const defaultTimes = getDefaultTimes(property);
  
  return [
    (v: string) => !!v || 'Time is required',
    (v: string) => validateTimeFormat(v) || 'Invalid time format (HH:MM)',
    (v: string) => {
      if (!v) return true;
      const checkinTime = v;
      const checkoutTime = defaultTimes.checkout;
      const validation = validateTimeOrder(checkinTime, checkoutTime);
      return validation.valid || validation.error || 'Invalid time order';
    }
  ];
}

/**
 * Get checkout time validation rules (depends on checkin time)
 */
export function getCheckoutTimeValidationRules(checkinTime: string) {
  
  return [
    (v: string) => !!v || 'Time is required',
    (v: string) => validateTimeFormat(v) || 'Invalid time format (HH:MM)',
    (v: string) => {
      if (!v || !checkinTime) return true;
      const validation = validateTimeOrder(checkinTime, v);
      return validation.valid || validation.error || 'Checkout time must be after checkin time';
    }
  ];
}

/**
 * Get hint text for time fields
 */
export function getTimeHint(field: 'checkout' | 'checkin', property?: Property): string {
  const defaultTimes = getDefaultTimes(property);
  const defaultTime = field === 'checkout' ? defaultTimes.checkout : defaultTimes.checkin;
  const displayTime = formatTimeForDisplay(defaultTime);
  
  return `Standard time: ${displayTime} (adjust as needed)`;
} 