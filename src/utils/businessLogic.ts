import type { Booking, BookingStatus } from '@/types/booking';
import type { Property } from '@/types/property';

/**
 * Calculate booking priority based on booking type and timing
 */
export const calculateBookingPriority = (booking: Booking): 'low' | 'normal' | 'high' | 'urgent' => {
  const now = new Date();
  const checkoutDate = new Date(booking.checkout_date);
  const checkinDate = new Date(booking.checkin_date);
  
  // Turn bookings are always high priority or urgent
  if (booking.booking_type === 'turn') {
    const hoursUntilCheckout = (checkoutDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilCheckout <= 2) return 'urgent';   // Less than 2 hours
    if (hoursUntilCheckout <= 6) return 'high';     // Less than 6 hours
    return 'high'; // All turns are at least high priority
  }
  
  // Standard bookings priority based on time until checkin
  const hoursUntilCheckin = (checkinDate.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntilCheckin <= 4) return 'urgent';      // Less than 4 hours
  if (hoursUntilCheckin <= 12) return 'high';       // Less than 12 hours
  if (hoursUntilCheckin <= 24) return 'normal';     // Less than 24 hours
  return 'low'; // More than 24 hours
};

/**
 * Calculate the cleaning window for a booking
 */
export const getCleaningWindow = (booking: Booking, property: Property): {
  start: string;
  end: string;
  duration: number;
  bufferTime: number;
} => {
  const checkoutDate = new Date(booking.checkout_date);
  const checkinDate = new Date(booking.checkin_date);
  const cleaningDuration = property.cleaning_duration || 120; // Default 2 hours
  
  if (booking.booking_type === 'turn') {
    // Turn: Cleaning must happen between checkout and checkin
    const availableTime = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60);
    const bufferTime = 30; // 30 minute buffer before checkin
    const maxCleaningTime = Math.max(60, availableTime - bufferTime); // Minimum 1 hour
    
    const cleaningStart = new Date(checkoutDate.getTime() + (30 * 60 * 1000)); // 30 min after checkout
    const cleaningEnd = new Date(cleaningStart.getTime() + (Math.min(cleaningDuration, maxCleaningTime) * 60 * 1000));
    
    return {
      start: cleaningStart.toISOString(),
      end: cleaningEnd.toISOString(),
      duration: Math.min(cleaningDuration, maxCleaningTime),
      bufferTime
    };
  } else {
    // Standard: Flexible scheduling between checkout and checkin
    const cleaningStart = new Date(checkoutDate);
    cleaningStart.setHours(11, 0, 0, 0); // Default 11 AM start
    
    const cleaningEnd = new Date(cleaningStart.getTime() + (cleaningDuration * 60 * 1000));
    
    // Ensure cleaning ends at least 1 hour before checkin
    const oneHourBeforeCheckin = new Date(checkinDate.getTime() - (60 * 60 * 1000));
    if (cleaningEnd > oneHourBeforeCheckin) {
      cleaningEnd.setTime(oneHourBeforeCheckin.getTime());
    }
    
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
 */
export const canScheduleCleaning = (booking: Booking, property: Property): {
  possible: boolean;
  reason?: string;
  suggestedTimes?: string[];
} => {
  const checkoutDate = new Date(booking.checkout_date);
  const checkinDate = new Date(booking.checkin_date);
  const timeDiff = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60); // minutes
  
  const minCleaningTime = property.cleaning_duration || 120;
  const bufferTime = booking.booking_type === 'turn' ? 30 : 60;
  const requiredTime = minCleaningTime + bufferTime;
  
  if (timeDiff < requiredTime) {
    return {
      possible: false,
      reason: `Insufficient time. Need ${requiredTime} minutes, have ${Math.floor(timeDiff)} minutes.`,
      suggestedTimes: [
        new Date(checkoutDate.getTime() + (requiredTime * 60 * 1000)).toISOString()
      ]
    };
  }
  
  return { possible: true };
};

/**
 * Validate a turn booking for potential issues
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
  
  const checkoutDate = new Date(booking.checkout_date!);
  const checkinDate = new Date(booking.checkin_date!);
  
  // Check if same day
  if (checkoutDate.toDateString() !== checkinDate.toDateString()) {
    errors.push('Turn bookings must have checkout and checkin on the same day');
  }
  
  // Check minimum time gap
  const timeDiff = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60); // minutes
  const minTime = (property.cleaning_duration || 120) + 30; // cleaning time + buffer
  
  if (timeDiff < minTime) {
    errors.push(`Insufficient time for turn cleaning. Need at least ${minTime} minutes, have ${Math.floor(timeDiff)} minutes.`);
  }
  
  // Check if checkout is after typical checkout time (11 AM)
  if (checkoutDate.getHours() > 12) {
    warnings.push('Late checkout may impact cleaning schedule');
  }
  
  // Check if checkin is before typical checkin time (3 PM)
  if (checkinDate.getHours() < 15) {
    warnings.push('Early checkin may require rushed cleaning');
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Detect time conflicts between bookings
 */
export const detectBookingConflicts = (
  booking: Booking,
  existingBookings: Booking[]
): Booking[] => {
  const checkoutTime = new Date(booking.checkout_date);
  const checkinTime = new Date(booking.checkin_date);
  
  // Check for overlapping bookings
  return existingBookings.filter(otherBooking => {
    if (otherBooking.id === booking.id || otherBooking.property_id !== booking.property_id) {
      return false; // Same booking or different property
    }
    
    const otherCheckout = new Date(otherBooking.checkout_date);
    const otherCheckin = new Date(otherBooking.checkin_date);
    
    // Check for overlap
    return (
      // Case 1: New booking starts before existing ends AND new booking ends after existing starts
      (checkoutTime <= otherCheckin && checkinTime >= otherCheckout) ||
      // Case 2: Existing booking starts before new ends AND existing booking ends after new starts
      (otherCheckout <= checkinTime && otherCheckin >= checkoutTime)
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
  if (!booking.checkout_date || !booking.checkin_date) {
    errors.push('Checkout and checkin dates are required');
    return { valid: false, errors, warnings };
  }
  
  const checkoutDate = new Date(booking.checkout_date);
  const checkinDate = new Date(booking.checkin_date);
  
  // Check if checkin is after checkout
  if (checkinDate <= checkoutDate) {
    errors.push('Checkin date must be after checkout date');
  }
  
  // For turn bookings, use the specialized validation
  if (booking.booking_type === 'turn') {
    const turnValidation = validateTurnBooking(booking, property);
    errors.push(...turnValidation.errors);
    warnings.push(...turnValidation.warnings);
  } else {
    // Standard booking validation
    const timeDiff = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60 * 60); // hours
    if (timeDiff < 3) {
      warnings.push('Very short time between checkout and checkin. Consider marking as a turn booking.');
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
  const thisMonth = new Date().toISOString().slice(0, 7)
  
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
    
    if (checkinDate > now && ['confirmed', 'scheduled'].includes(booking.status)) {
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
    const bookingStart = new Date(booking.checkout_date).getTime()
    const bookingEnd = new Date(booking.checkin_date).getTime()
    
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
    if (new Date(booking.checkout_date) >= cutoffDate) {
      recent.set(id, booking)
    }
  })
  
  return recent
} 