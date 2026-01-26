import type { Booking, BookingStatus } from '@/types/booking';
import type { Property } from '@/types/property';

/**
 * Calculate booking priority based on booking type and timing
 * NOTE: As of migration 011, checkin_date < checkout_date (guest stays)
 */
export const calculateBookingPriority = (booking: Booking): 'low' | 'normal' | 'high' | 'urgent' => {
  const checkinDate = new Date(booking.checkin_date);
  const checkoutDate = new Date(booking.checkout_date);
  
  // Turn bookings are always high priority or urgent
  if (booking.booking_type === 'turn') {
    const hoursUntilCheckin = (checkinDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilCheckin <= 2) return 'urgent';   // Less than 2 hours
    if (hoursUntilCheckin <= 6) return 'high';     // Less than 6 hours
    return 'high'; // All turns are at least high priority
  }
  
  // Standard bookings priority based on time until checkin
  const hoursUntilCheckin = (checkinDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilCheckin <= 4) return 'urgent';      // Less than 4 hours
  if (hoursUntilCheckin <= 12) return 'high';       // Less than 12 hours
  if (hoursUntilCheckin <= 24) return 'normal';     // Less than 24 hours
  return 'low'; // More than 24 hours
};

/**
 * Calculate the cleaning window for a booking
 * DEPRECATED: As of migration 011, use cleaning_tasks table instead
 * This is kept for backward compatibility with existing code
 */
export const getCleaningWindow = (booking: Booking, property: Property): {
  start: string;
  end: string;
  duration: number;
  bufferTime: number;
} => {
  const checkinDate = new Date(booking.checkin_date);
  const checkoutDate = new Date(booking.checkout_date);
  const cleaningDuration = property.cleaning_duration || 120; // Default 2 hours
  
  // For guest stays, cleaning happens after checkout
  // We'll schedule it for checkout time with default duration
  const cleaningStart = new Date(checkoutDate);
  const cleaningEnd = new Date(cleaningStart.getTime() + (cleaningDuration * 60 * 1000));
  
  return {
    start: cleaningStart.toISOString(),
    end: cleaningEnd.toISOString(),
    duration: cleaningDuration,
    bufferTime: 60
  };
};

/**
 * Check if a cleaning can be scheduled for a booking
 * DEPRECATED: As of migration 011, use cleaning_tasks table instead
 */
export const canScheduleCleaning = (booking: Booking, property: Property): {
  possible: boolean;
  reason?: string;
  suggestedTimes?: string[];
} => {
  const checkinDate = new Date(booking.checkin_date);
  const checkoutDate = new Date(booking.checkout_date);
  const stayDuration = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60); // minutes
  
  // For the new model, we can always schedule cleaning after checkout
  return { possible: true };
};

/**
 * Validate a turn booking for potential issues
 * NOTE: As of migration 011, turn bookings are same-day bookings where
 * guests check in and check out on the same day (short stay)
 */
export const validateTurnBooking = (
  booking: Partial<Booking>, 
  property: Property
): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (booking.booking_type !== 'turn') {
    return { valid: true, errors, warnings };
  }
  
  const checkinDate = new Date(booking.checkin_date!);
  const checkoutDate = new Date(booking.checkout_date!);
  
  // Check if same day
  if (checkinDate.toDateString() !== checkoutDate.toDateString()) {
    errors.push('Turn bookings must have checkin and checkout on the same day');
  }
  
  // Check minimum stay time
  const stayDuration = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60); // minutes
  
  if (stayDuration < 60) {
    errors.push(`Turn bookings must be at least 1 hour long. Current duration: ${Math.floor(stayDuration)} minutes.`);
  }
  
  // Check if checkin is before typical checkin time (3 PM)
  if (checkinDate.getHours() < 15) {
    warnings.push('Early checkin for same-day booking');
  }
  
  // Check if checkout is after typical checkout time (11 AM)
  if (checkoutDate.getHours() > 11) {
    warnings.push('Late checkout for same-day booking may impact next booking');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Detect time conflicts between bookings
 * NOTE: As of migration 011, bookings represent guest stays (checkin < checkout)
 */
export const detectBookingConflicts = (
  booking: Booking,
  existingBookings: Booking[]
): Booking[] => {
  const checkinTime = new Date(booking.checkin_date);
  const checkoutTime = new Date(booking.checkout_date);
  
  // Check for overlapping bookings
  return existingBookings.filter(otherBooking => {
    if (otherBooking.id === booking.id || otherBooking.property_id !== booking.property_id) {
      return false; // Same booking or different property
    }
    
    const otherCheckin = new Date(otherBooking.checkin_date);
    const otherCheckout = new Date(otherBooking.checkout_date);
    
    // Check for overlap (guest stays overlapping)
    return (
      // Case 1: New booking starts before existing ends AND new booking ends after existing starts
      (checkinTime < otherCheckout && checkoutTime > otherCheckin) ||
      // Case 2: Existing booking starts before new ends AND existing booking ends after new starts
      (otherCheckin < checkoutTime && otherCheckout > checkinTime)
    );
  });
};

/**
 * Validate a booking for scheduling
 * NOTE: As of migration 011, bookings represent guest stays (checkin < checkout)
 */
export const validateBooking = (
  booking: Partial<Booking>,
  property: Property,
  existingBookings: Booking[] = []
): { 
  valid: boolean; 
  errors: string[]; 
  warnings: string[];
  conflicts?: Booking[];
} => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Basic validation
  if (!booking.checkin_date || !booking.checkout_date) {
    errors.push('Check-in and check-out dates are required');
    return { valid: false, errors, warnings };
  }
  
  const checkinDate = new Date(booking.checkin_date);
  const checkoutDate = new Date(booking.checkout_date);
  
  // Check if checkout is after checkin (industry standard)
  if (checkoutDate <= checkinDate) {
    errors.push('Check-out date must be after check-in date');
  }
  
  // For turn bookings, use the specialized validation
  if (booking.booking_type === 'turn') {
    const turnValidation = validateTurnBooking(booking, property);
    errors.push(...turnValidation.errors);
    warnings.push(...turnValidation.warnings);
  } else {
    // Standard booking validation
    const stayDuration = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60); // hours
    if (stayDuration < 1) {
      warnings.push('Very short stay (less than 1 hour). Consider marking as a turn booking.');
    }
  }
  
  // Check for conflicts with existing bookings
  const conflicts = booking.id ? 
    detectBookingConflicts(booking as Booking, existingBookings) : 
    [];
    
  if (conflicts.length > 0) {
    warnings.push(`Found ${conflicts.length} potential scheduling conflicts`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    conflicts: conflicts.length > 0 ? conflicts : undefined
  };
};

/**
 * Get the workflow status transitions available for a booking
 */
export const getAvailableStatusTransitions = (booking: Booking): BookingStatus[] => {
  switch (booking.status) {
    case 'pending':
      return ['scheduled', 'cancelled'];
    case 'scheduled':
      return ['in_progress', 'cancelled'];
    case 'in_progress':
      return ['completed', 'scheduled']; // Can go back if issues
    case 'completed':
      return []; // Terminal state
    case 'cancelled':
      return ['pending']; // Can reactivate
    default:
      return [];
  }
};

/**
 * Check if a booking can transition to a new status
 */
export const canTransitionBookingStatus = (booking: Booking, newStatus: BookingStatus): boolean => {
  return getAvailableStatusTransitions(booking).includes(newStatus);
};

// Extracted shared logic from stores to eliminate duplication
export const calculateSystemMetrics = (
  properties: Map<string, Property>,
  bookings: Map<string, Booking>
) => {
  const now = new Date()
  const twentyFourHours = new Date(now.getTime() + 24 * 60 * 60 * 1000)
  
  let totalProperties = 0
  let activeProperties = 0
  const ownerIds = new Set<string>()
  
  // Single pass through properties
  properties.forEach(property => {
    totalProperties++
    if (property.active) activeProperties++
    ownerIds.add(property.owner_id)
  })
  
  let totalBookings = 0
  let upcomingBookings = 0
  let urgentTurns = 0
  
  // Single pass through bookings
  bookings.forEach(booking => {
    totalBookings++
    
    const checkinDate = new Date(booking.checkin_date)
    const checkoutDate = new Date(booking.checkout_date)
    
    // Upcoming bookings are those where guests haven't checked in yet
    if (checkinDate > now && ['confirmed', 'scheduled'].includes(booking.status)) {
      upcomingBookings++
    }
    
    // Urgent turns are same-day bookings starting within 24 hours
    if (booking.booking_type === 'turn' && 
        booking.status === 'pending' && 
        checkinDate <= twentyFourHours) {
      urgentTurns++
    }
  })
  
  return {
    totalProperties,
    activeProperties,
    totalOwners: ownerIds.size,
    totalBookings,
    upcomingBookings,
    urgentTurns
  }
}

export const filterBookingsByDateRange = (
  bookings: Map<string, Booking>,
  startDate: string,
  endDate: string
): Map<string, Booking> => {
  const start = new Date(startDate).getTime()
  const end = new Date(endDate).getTime()
  const filtered = new Map<string, Booking>()
  
  bookings.forEach((booking, id) => {
    const bookingStart = new Date(booking.checkin_date).getTime()
    const bookingEnd = new Date(booking.checkout_date).getTime()
    
    // Include if booking overlaps with date range
    if (bookingStart <= end && bookingEnd >= start) {
      filtered.set(id, booking)
    }
  })
  
  return filtered
}

export const getUrgentTurns = (
  bookings: Map<string, Booking>,
  hoursAhead: number = 24
): Map<string, Booking> => {
  const cutoffTime = new Date(Date.now() + hoursAhead * 60 * 60 * 1000)
  const urgentTurns = new Map<string, Booking>()
  
  bookings.forEach((booking, id) => {
    if (booking.booking_type === 'turn' &&
        booking.status === 'pending' &&
        new Date(booking.checkin_date) <= cutoffTime) {
      urgentTurns.set(id, booking)
    }
  })
  
  return urgentTurns
}

export const getUpcomingBookings = (
  bookings: Map<string, Booking>
): Map<string, Booking> => {
  const now = new Date()
  const upcoming = new Map<string, Booking>()
  
  bookings.forEach((booking, id) => {
    // Upcoming bookings are those where guests haven't checked in yet
    if (new Date(booking.checkin_date) > now &&
        ['confirmed', 'scheduled', 'pending'].includes(booking.status)) {
      upcoming.set(id, booking)
    }
  })
  
  return upcoming
}

export const getRecentBookings = (
  bookings: Map<string, Booking>,
  daysBack: number = 30
): Map<string, Booking> => {
  const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)
  const recent = new Map<string, Booking>()
  
  bookings.forEach((booking, id) => {
    // Recent bookings are those that checked in within the time window
    if (new Date(booking.checkin_date) >= cutoffDate) {
      recent.set(id, booking)
    }
  })
  
  return recent
} 