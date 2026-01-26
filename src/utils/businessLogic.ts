import type { Booking, BookingStatus } from '@/types/booking';
import type { Property } from '@/types/property';

/**
 * Calculate booking priority based on booking type and timing
 * Priority is based on urgency of cleaning after guest checkout
 */
export const calculateBookingPriority = (booking: Booking): 'low' | 'normal' | 'high' | 'urgent' => {
  const checkoutDate = new Date(booking.checkout_date);
  
  // Turn bookings (same-day stays) are always high priority or urgent
  if (booking.booking_type === 'turn') {
    const hoursUntilCheckout = (checkoutDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilCheckout <= 2) return 'urgent';   // Less than 2 hours
    if (hoursUntilCheckout <= 6) return 'high';     // Less than 6 hours
    return 'high'; // All turns are at least high priority
  }
  
  // Standard bookings priority based on time until checkout (when cleaning is needed)
  const hoursUntilCheckout = (checkoutDate.getTime() - new Date().getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilCheckout <= 4) return 'urgent';      // Less than 4 hours
  if (hoursUntilCheckout <= 12) return 'high';       // Less than 12 hours
  if (hoursUntilCheckout <= 24) return 'normal';     // Less than 24 hours
  return 'low'; // More than 24 hours
};

/**
 * Calculate the cleaning window after a guest stay
 * In hotel model: cleaning happens AFTER checkout, before next booking (if any)
 */
export const getCleaningWindow = (booking: Booking, _property: Property): {
  start: string;
  end: string;
  duration: number;
  bufferTime: number;
} => {
  const checkoutDate = new Date(booking.checkout_date);
  const cleaningDuration = _property.cleaning_duration || 120; // Default 2 hours
  
  if (booking.booking_type === 'turn') {
    // Turn: Same-day stay, tight cleaning window after checkout
    // Cleaning starts immediately after guest checks out
    const cleaningStart = new Date(checkoutDate.getTime() + (30 * 60 * 1000)); // 30 min after checkout
    const cleaningEnd = new Date(cleaningStart.getTime() + (cleaningDuration * 60 * 1000));
    
    return {
      start: cleaningStart.toISOString(),
      end: cleaningEnd.toISOString(),
      duration: cleaningDuration,
      bufferTime: 30
    };
  } else {
    // Standard: Multi-day stay, flexible cleaning window after checkout
    const cleaningStart = new Date(checkoutDate);
    cleaningStart.setHours(11, 0, 0, 0); // Default 11 AM start (or same day if checkout is later)
    if (cleaningStart < checkoutDate) {
      cleaningStart.setTime(checkoutDate.getTime() + (60 * 60 * 1000)); // 1 hour after checkout
    }
    
    const cleaningEnd = new Date(cleaningStart.getTime() + (cleaningDuration * 60 * 1000));
    
    return {
      start: cleaningStart.toISOString(),
      end: cleaningEnd.toISOString(),
      duration: cleaningDuration,
      bufferTime: 60
    };
  }
};

/**
 * Check if a cleaning can be scheduled for a booking
 * In hotel model: checks if the booking duration allows for cleaning after checkout
 */
export const canScheduleCleaning = (booking: Booking, _property: Property): {
  possible: boolean;
  reason?: string;
  suggestedTimes?: string[];
} => {
  const checkoutDate = new Date(booking.checkout_date);
  const checkinDate = new Date(booking.checkin_date);
  
  // For hotel model, we primarily check if the booking dates are valid
  // Cleaning happens after checkout, so we just need valid booking duration
  const bookingDuration = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60); // minutes
  
  if (bookingDuration < 60) { // Less than 1 hour
    return {
      possible: false,
      reason: `Booking too short. Minimum 60 minutes required.`,
      suggestedTimes: [
        new Date(checkinDate.getTime() + (60 * 60 * 1000)).toISOString()
      ]
    };
  }
  
  return { possible: true };
};

/**
 * Validate a turn booking for potential issues
 * Turn bookings are same-day stays with rapid turnover
 */
export const validateTurnBooking = (
  booking: Partial<Booking>, 
  _property: Property
): { valid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  if (booking.booking_type !== 'turn') {
    return { valid: true, errors, warnings };
  }
  
  const checkoutDate = new Date(booking.checkout_date!);
  const checkinDate = new Date(booking.checkin_date!);
  
  // Check if same day (turn bookings are same-day stays)
  if (checkoutDate.toDateString() !== checkinDate.toDateString()) {
    errors.push('Turn bookings must have checkin and checkout on the same day');
  }
  
  // Check minimum stay duration for same-day
  const timeDiff = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60); // minutes
  const minTime = 120; // Minimum 2 hours for same-day stay
  
  if (timeDiff < minTime) {
    errors.push(`Same-day stay too short. Need at least ${minTime} minutes, have ${Math.floor(timeDiff)} minutes.`);
  }
  
  // Check if checkin is after typical checkin time (11 AM)
  if (checkinDate.getHours() < 11) {
    warnings.push('Early checkin for same-day stay');
  }
  
  // Check if checkout is before typical checkout time (3 PM)
  if (checkoutDate.getHours() > 15) {
    warnings.push('Late checkout for same-day stay');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Detect time conflicts between bookings
 * In hotel model: bookings conflict if guest stays overlap
 */
export const detectBookingConflicts = (
  booking: Booking,
  existingBookings: Booking[]
): Booking[] => {
  const checkinTime = new Date(booking.checkin_date);
  const checkoutTime = new Date(booking.checkout_date);
  
  // Check for overlapping bookings (same property, overlapping guest stays)
  return existingBookings.filter(otherBooking => {
    if (otherBooking.id === booking.id || otherBooking.property_id !== booking.property_id) {
      return false; // Same booking or different property
    }
    
    const otherCheckin = new Date(otherBooking.checkin_date);
    const otherCheckout = new Date(otherBooking.checkout_date);
    
    // Check for overlap: two bookings overlap if one starts before the other ends
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
  
  const checkoutDate = new Date(booking.checkout_date);
  const checkinDate = new Date(booking.checkin_date);
  
  // Check if checkout is after checkin (standard hotel model)
  if (checkoutDate <= checkinDate) {
    errors.push('Check-out date must be after check-in date');
  }
  
  // For turn bookings, use the specialized validation
  if (booking.booking_type === 'turn') {
    const turnValidation = validateTurnBooking(booking, property);
    errors.push(...turnValidation.errors);
    warnings.push(...turnValidation.warnings);
  } else {
    // Standard booking validation (multi-day stays)
    const stayDuration = (checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60); // hours
    if (stayDuration < 3) {
      warnings.push('Very short stay duration. Consider using turn booking type for same-day stays.');
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
  // const thisMonth = new Date().toISOString().slice(0, 7) // Reserved for future metrics
  
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
    
    const checkoutDate = new Date(booking.checkout_date)
    
    if (checkoutDate > now && ['confirmed', 'scheduled'].includes(booking.status)) {
      upcomingBookings++
    }
    
    if (booking.booking_type === 'turn' && 
        booking.status === 'pending' && 
        checkoutDate <= twentyFourHours) {
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
    
    // Booking overlaps range if it starts before range ends AND ends after range starts
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
        new Date(booking.checkout_date) <= cutoffTime) {
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
    // Recent bookings are those that checked in within the last N days
    if (new Date(booking.checkin_date) >= cutoffDate) {
      recent.set(id, booking)
    }
  })
  
  return recent
} 