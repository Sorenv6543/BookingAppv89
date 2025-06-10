# Property Cleaning Business Logic Reference

## **Core Business Concepts**

### **Booking Types & Priority System**
```typescript
// types/business.ts
export interface BookingBusinessLogic {
  // Core booking types
  type: 'standard' | 'turn';
  
  // Priority calculation
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  // Cleaning window calculation
  cleaningWindow: {
    start: string;
    end: string;
    duration: number; // minutes
    bufferTime: number; // minutes before checkin
  };
  
  // Status workflow
  workflow: {
    current: BookingStatus;
    next: BookingStatus[];
    canTransition: boolean;
  };
}

export type BookingStatus = 
  | 'pending'      // Just created, needs scheduling
  | 'scheduled'    // Cleaner assigned, time confirmed
  | 'in_progress'  // Cleaning currently happening
  | 'completed'    // Cleaning finished
  | 'cancelled';   // Booking cancelled

export interface TurnBooking extends Booking {
  booking_type: 'turn';
  // Same-day checkout and checkin
  urgency: 'critical'; // Always critical for turns
  maxCleaningTime: number; // Maximum time available between guests
}

export interface StandardBooking extends Booking {
  booking_type: 'standard';
  urgency: 'normal' | 'low';
  flexibleScheduling: boolean; // Can be scheduled flexibly
}
```

### **Priority Calculation Logic**
```typescript
// utils/businessLogic.ts
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
```

## **Workflow Management**

### **Booking Status Workflow**
```typescript
// composables/useBookingWorkflow.ts
export const useBookingWorkflow = () => {
  const userStore = useUserStore();
  const uiStore = useUIStore();

  const getAvailableTransitions = (booking: Booking): BookingStatus[] => {
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

  const canTransitionTo = (booking: Booking, newStatus: BookingStatus): boolean => {
    return getAvailableTransitions(booking).includes(newStatus);
  };

  const transitionBooking = async (
    bookingId: string, 
    newStatus: BookingStatus,
    notes?: string
  ): Promise<void> => {
    const booking = userStore.events.get(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!canTransitionTo(booking, newStatus)) {
      throw new Error(`Cannot transition from ${booking.status} to ${newStatus}`);
    }

    // Business logic for specific transitions
    switch (newStatus) {
      case 'scheduled':
        if (!booking.assigned_cleaner_id) {
          throw new Error('Cannot schedule booking without assigned cleaner');
        }
        break;
      case 'in_progress':
        // Auto-set start time
        break;
      case 'completed':
        // Auto-set completion time and trigger invoice generation
        await handleBookingCompletion(booking);
        break;
    }

    // Update booking
    const updates: Partial<Booking> = {
      status: newStatus,
      updated_at: new Date().toISOString()
    };

    if (notes) {
      updates.notes = notes;
    }

    await updateBooking(bookingId, updates);

    // Trigger side effects
    await handleStatusTransitionSideEffects(booking, newStatus);
  };

  const handleBookingCompletion = async (booking: Booking): Promise<void> => {
    // Generate invoice
    // Send completion notification
    // Update cleaning schedule
    // Mark property as clean
    
    uiStore.addNotification({
      type: 'success',
      title: 'Cleaning Completed',
      message: `Cleaning for ${getPropertyName(booking)} has been completed.`
    });
  };

  const handleStatusTransitionSideEffects = async (
    booking: Booking, 
    newStatus: BookingStatus
  ): Promise<void> => {
    switch (newStatus) {
      case 'scheduled':
        // Send scheduling confirmation
        // Update cleaner calendar
        break;
      case 'in_progress':
        // Notify property owner
        // Start tracking
        break;
      case 'completed':
        // Generate invoice
        // Send completion photos
        // Request feedback
        break;
      case 'cancelled':
        // Release cleaner
        // Notify stakeholders
        break;
    }
  };

  return {
    getAvailableTransitions,
    canTransitionTo,
    transitionBooking
  };
};
```

### **Turn Management System**
```typescript
// composables/useTurnManagement.ts
export const useTurnManagement = () => {
  const userStore = useUserStore();
  const uiStore = useUIStore();

  const getTodayTurns = (): Booking[] => {
    const today = new Date().toISOString().split('T')[0];
    
    return Array.from(userStore.events.values())
      .filter(booking => 
        booking.booking_type === 'turn' && 
        booking.checkout_date.startsWith(today)
      )
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
  };

  const getUpcomingTurns = (days: number = 7): Booking[] => {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + days);
    
    return Array.from(userStore.events.values())
      .filter(booking => {
        if (booking.booking_type !== 'turn') return false;
        
        const checkoutDate = new Date(booking.checkout_date);
        return checkoutDate >= now && checkoutDate <= futureDate;
      })
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
  };

  const getConflictingBookings = (booking: Booking): Booking[] => {
    if (booking.booking_type !== 'turn') return [];
    
    const checkoutTime = new Date(booking.checkout_date);
    const checkinTime = new Date(booking.checkin_date);
    
    // Check for overlapping bookings that might conflict with cleaning
    return Array.from(userStore.events.values())
      .filter(otherBooking => {
        if (otherBooking.id === booking.id) return false;
        
        const otherCheckout = new Date(otherBooking.checkout_date);
        const otherCheckin = new Date(otherBooking.checkin_date);
        
        // Check for time conflicts
        return (
          (otherCheckout >= checkoutTime && otherCheckout <= checkinTime) ||
          (otherCheckin >= checkoutTime && otherCheckin <= checkinTime) ||
          (otherCheckout <= checkoutTime && otherCheckin >= checkinTime)
        );
      });
  };

  const validateTurnBooking = (
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
    
    // Check for conflicts
    const conflicts = getConflictingBookings(booking as Booking);
    if (conflicts.length > 0) {
      warnings.push(`${conflicts.length} potential scheduling conflicts detected`);
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

  const optimizeTurnSchedule = (turns: Booking[]): {
    schedule: Array<{
      booking: Booking;
      cleaningWindow: { start: string; end: string; duration: number };
      priority: number;
      conflicts: string[];
    }>;
    recommendations: string[];
  } => {
    const schedule = turns.map(turn => {
      const property = userStore.getPropertyById(turn.property_id);
      const cleaningWindow = property ? getCleaningWindow(turn, property) : null;
      const priority = calculateBookingPriority(turn);
      const conflicts = getConflictingBookings(turn);
      
      return {
        booking: turn,
        cleaningWindow: cleaningWindow || { start: '', end: '', duration: 0 },
        priority: priority === 'urgent' ? 4 : priority === 'high' ? 3 : priority === 'normal' ? 2 : 1,
        conflicts: conflicts.map(c => `Conflicts with ${getPropertyName(c)}`)
      };
    });
    
    // Sort by priority and time
    schedule.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return new Date(a.booking.checkout_date).getTime() - new Date(b.booking.checkout_date).getTime();
    });
    
    const recommendations: string[] = [];
    
    // Generate recommendations
    const urgentTurns = schedule.filter(s => s.priority === 4);
    if (urgentTurns.length > 3) {
      recommendations.push(`High workload: ${urgentTurns.length} urgent turns today. Consider additional staff.`);
    }
    
    const conflictedTurns = schedule.filter(s => s.conflicts.length > 0);
    if (conflictedTurns.length > 0) {
      recommendations.push(`${conflictedTurns.length} turns have scheduling conflicts. Review and adjust.`);
    }
    
    return { schedule, recommendations };
  };

  return {
    getTodayTurns,
    getUpcomingTurns,
    getConflictingBookings,
    validateTurnBooking,
    optimizeTurnSchedule
  };
};
```

## **Property Management Logic**

### **Property Categorization & Pricing**
```typescript
// utils/propertyLogic.ts
export const calculatePropertyMetrics = (
  property: Property, 
  bookings: Booking[]
): {
  utilizationRate: number;
  averageGapBetweenBookings: number;
  turnPercentage: number;
  revenueProjection: number;
  cleaningLoad: 'light' | 'moderate' | 'heavy';
} => {
  const propertyBookings = bookings.filter(b => b.property_id === property.id);
  const completedBookings = propertyBookings.filter(b => b.status === 'completed');
  
  if (completedBookings.length === 0) {
    return {
      utilizationRate: 0,
      averageGapBetweenBookings: 0,
      turnPercentage: 0,
      revenueProjection: 0,
      cleaningLoad: 'light'
    };
  }
  
  // Calculate utilization rate (nights booked / total nights)
  const totalNights = completedBookings.reduce((sum, booking) => {
    const checkout = new Date(booking.checkout_date);
    const checkin = new Date(booking.checkin_date);
    const nights = (checkin.getTime() - checkout.getTime()) / (1000 * 60 * 60 * 24);
    return sum + Math.ceil(nights);
  }, 0);
  
  const daysInPeriod = 30; // Last 30 days
  const utilizationRate = Math.min(100, (totalNights / daysInPeriod) * 100);
  
  // Calculate average gap between bookings
  const sortedBookings = [...completedBookings].sort(
    (a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime()
  );
  
  let totalGapHours = 0;
  let gapCount = 0;
  
  for (let i = 1; i < sortedBookings.length; i++) {
    const prevCheckin = new Date(sortedBookings[i - 1].checkin_date);
    const currentCheckout = new Date(sortedBookings[i].checkout_date);
    const gap = (currentCheckout.getTime() - prevCheckin.getTime()) / (1000 * 60 * 60);
    
    if (gap > 0) {
      totalGapHours += gap;
      gapCount++;
    }
  }
  
  const averageGapBetweenBookings = gapCount > 0 ? totalGapHours / gapCount : 0;
  
  // Calculate turn percentage
  const turnBookings = propertyBookings.filter(b => b.booking_type === 'turn');
  const turnPercentage = (turnBookings.length / propertyBookings.length) * 100;
  
  // Estimate cleaning load
  let cleaningLoad: 'light' | 'moderate' | 'heavy' = 'light';
  
  if (turnPercentage > 50 || averageGapBetweenBookings < 6) {
    cleaningLoad = 'heavy';
  } else if (turnPercentage > 25 || averageGapBetweenBookings < 12) {
    cleaningLoad = 'moderate';
  }
  
  // Revenue projection (simplified)
  const basePrice = getPricingTierRate(property.pricing_tier);
  const bookingsPerMonth = (propertyBookings.length / 30) * 30; // Normalize to monthly
  const revenueProjection = bookingsPerMonth * basePrice;
  
  return {
    utilizationRate,
    averageGapBetweenBookings,
    turnPercentage,
    revenueProjection,
    cleaningLoad
  };
};

export const getPricingTierRate = (tier: 'basic' | 'premium' | 'luxury'): number => {
  const rates = {
    basic: 75,    // $75 per cleaning
    premium: 125, // $125 per cleaning
    luxury: 200   // $200 per cleaning
  };
  
  return rates[tier] || rates.basic;
};

export const suggestOptimalCleaningDuration = (
  property: Property,
  bookings: Booking[]
): {
  suggested: number;
  current: number;
  reasoning: string;
} => {
  const metrics = calculatePropertyMetrics(property, bookings);
  const current = property.cleaning_duration || 120;
  
  let suggested = current;
  let reasoning = 'Current duration appears appropriate';
  
  // Adjust based on cleaning load
  if (metrics.cleaningLoad === 'heavy' && metrics.turnPercentage > 40) {
    suggested = Math.min(current + 30, 180); // Add 30 min, max 3 hours
    reasoning = 'High turn percentage suggests need for more thorough cleaning time';
  } else if (metrics.cleaningLoad === 'light' && metrics.averageGapBetweenBookings > 24) {
    suggested = Math.max(current - 15, 90); // Reduce 15 min, min 1.5 hours
    reasoning = 'Light usage allows for slightly reduced cleaning time';
  }
  
  // Adjust based on property tier
  if (property.pricing_tier === 'luxury' && suggested < 150) {
    suggested = 150;
    reasoning = 'Luxury properties require minimum 2.5 hours for premium service';
  }
  
  return { suggested, current, reasoning };
};
```

## **Cleaning Team Assignment Logic**

### **Cleaner Optimization**
```typescript
// composables/useCleanerAssignment.ts
export const useCleanerAssignment = () => {
  interface Cleaner {
    id: string;
    name: string;
    skills: string[];
    availability: { [date: string]: boolean };
    currentLoad: number; // Current bookings for the day
    maxDailyBookings: number;
    preferredPropertyTypes: ('basic' | 'premium' | 'luxury')[];
    location: { lat: number; lng: number };
  }

  const findOptimalCleaner = (
    booking: Booking,
    property: Property,
    cleaners: Cleaner[]
  ): { cleaner: Cleaner | null; confidence: number; reasoning: string } => {
    const bookingDate = new Date(booking.checkout_date).toISOString().split('T')[0];
    
    // Filter available cleaners
    const availableCleaners = cleaners.filter(cleaner => 
      cleaner.availability[bookingDate] && 
      cleaner.currentLoad < cleaner.maxDailyBookings
    );
    
    if (availableCleaners.length === 0) {
      return {
        cleaner: null,
        confidence: 0,
        reasoning: 'No cleaners available for this date'
      };
    }
    
    // Score each cleaner
    const scoredCleaners = availableCleaners.map(cleaner => {
      let score = 0;
      const factors: string[] = [];
      
      // Property type preference
      if (cleaner.preferredPropertyTypes.includes(property.pricing_tier)) {
        score += 20;
        factors.push('property type preference');
      }
      
      // Current load (prefer less loaded cleaners)
      const loadScore = ((cleaner.maxDailyBookings - cleaner.currentLoad) / cleaner.maxDailyBookings) * 15;
      score += loadScore;
      factors.push('workload balance');
      
      // Turn booking expertise
      if (booking.booking_type === 'turn' && cleaner.skills.includes('turn_specialist')) {
        score += 25;
        factors.push('turn specialization');
      }
      
      // Special requirements
      if (property.special_instructions && cleaner.skills.includes('detailed_cleaning')) {
        score += 10;
        factors.push('detailed cleaning skills');
      }
      
      // Distance/location factor would go here if we had routing
      // For now, assume equal
      
      return {
        cleaner,
        score,
        factors
      };
    });
    
    // Sort by score and pick the best
    scoredCleaners.sort((a, b) => b.score - a.score);
    const best = scoredCleaners[0];
    
    const confidence = Math.min(100, (best.score / 60) * 100); // Max score ~60
    
    return {
      cleaner: best.cleaner,
      confidence,
      reasoning: `Selected based on: ${best.factors.join(', ')}`
    };
  };

  const getCleanerSchedule = (cleaner: Cleaner, date: string): {
    bookings: Booking[];
    totalDuration: number;
    conflicts: string[];
    recommendations: string[];
  } => {
    // This would integrate with the actual cleaner scheduling system
    // For now, return mock data structure
    
    return {
      bookings: [],
      totalDuration: 0,
      conflicts: [],
      recommendations: []
    };
  };

  return {
    findOptimalCleaner,
    getCleanerSchedule
  };
};
```

This reference provides comprehensive business logic patterns specific to the property cleaning domain, including booking workflows, turn management, priority systems, and cleaner assignment algorithms.