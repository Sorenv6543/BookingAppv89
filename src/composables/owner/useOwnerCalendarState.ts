import { ref, computed } from 'vue';
import { useCalendarState } from '@/composables/shared/useCalendarState';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';
import { useAuthStore } from '@/stores/auth';
import { useUIStore } from '@/stores/ui';

/**
 * Owner-specific calendar state composable
 * Extends shared useCalendarState functionality with owner data filtering
 * 
 * Key Features:
 * - All calendar events filtered to current owner's bookings only
 * - Owner-specific event handling (create/edit only owner's bookings)
 * - Simplified calendar controls (no admin features)
 * - Owner-scoped turn alerts and property filtering
 * - Owner-friendly error messages and validation
 */
export function useOwnerCalendarState() {
  // Get shared functionality and stores
  const baseCalendarState = useCalendarState();
  const ownerBookings = useOwnerBookings();
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  
  // Owner-specific state
  const ownerError = ref<string | null>(null);
  const ownerLoading = ref<boolean>(false);
  const ownerSuccess = ref<string | null>(null);
  
  // Get current user ID
  const currentUserId = computed(() => authStore.user?.id);
  
  // OWNER-SPECIFIC COMPUTED PROPERTIES
  
  /**
   * Get calendar events for current owner's bookings only
   */
  const myCalendarEvents = computed(() => {
    if (!currentUserId.value) return [];
    
    return baseCalendarState.bookingsToEvents(ownerBookings.myBookings.value);
  });
  
  /**
   * Get filtered bookings for current owner only
   */
  const myFilteredBookings = computed(() => {
    if (!currentUserId.value) return [];
    
    return baseCalendarState.filterBookings(ownerBookings.myBookings.value);
  });
  
  /**
   * Get today's turn alerts for current owner only
   */
  const myTurnAlerts = computed(() => {
    return ownerBookings.myTodayTurns.value.map(booking => ({
      ...booking,
      alertMessage: `Urgent: Turn cleaning needed for ${getPropertyName(booking.property_id)}`,
      priority: 'urgent' as const,
      timeUntilCheckout: getTimeUntilCheckout(booking.guest_departure_date)
    }));
  });
  
  /**
   * Get property options for current owner (for filtering)
   */
  const myPropertyOptions = computed(() => {
    return ownerBookings.myProperties.value.map(property => ({
      id: property.id,
      name: property.name,
      address: property.address,
      active: property.active
    }));
  });
  
  /**
   * Get owner-specific calendar title
   */
  const ownerCalendarTitle = computed(() => {
    const propertyCount = ownerBookings.myProperties.value.length;
    const bookingCount = ownerBookings.myBookings.value.length;
    
    if (propertyCount === 0) {
      return 'My Calendar - No Properties';
    } else if (propertyCount === 1) {
      return `My Calendar - ${ownerBookings.myProperties.value[0].name}`;
    } else {
      return `My Calendar - ${propertyCount} Properties, ${bookingCount} Bookings`;
    }
  });
  
  // OWNER-SPECIFIC FUNCTIONS
  
  /**
   * Get calendar events formatted for owner's bookings only
   */
  function getOwnerCalendarEvents(): any[] {
    if (!currentUserId.value) {
      ownerError.value = 'Please log in to view your calendar';
      return [];
    }
    
    try {
      const events = myCalendarEvents.value.map(event => ({
        ...event,
        // Add owner-specific styling
        className: `owner-event ${event.extendedProps.booking_type === 'turn' ? 'owner-turn-event' : 'owner-standard-event'}`,
        // Add owner-specific title prefix
        title: `${event.extendedProps.booking_type === 'turn' ? '🔥 ' : '🏠 '}${event.title}`,
        // Add owner-specific extended properties
        extendedProps: {
          ...event.extendedProps,
          isOwnerBooking: true,
          canEdit: true,
          canDelete: true,
          propertyName: getPropertyName(event.extendedProps.property_id)
        }
      }));
      
      ownerError.value = null;
      return events;
    } catch (error) {
      ownerError.value = 'Unable to load your calendar events. Please try again.';
      return [];
    }
  }
  
  /**
   * Handle date selection for creating new owner booking
   */
  function handleOwnerDateSelect(_selectInfo: any) {
    if (!currentUserId.value) {
      ownerError.value = 'Please log in to create bookings';
      return;
    }
    
    if (ownerBookings.myProperties.value.length === 0) {
      ownerError.value = 'You need to add a property before creating bookings';
      uiStore.openModal('property-form', 'create');
      return;
    }
    
    try {
      // Open booking form for creating new booking
      uiStore.openModal('booking-form', 'create');
      ownerError.value = null;
      ownerSuccess.value = 'Select your property and booking details';
    } catch (error) {
      ownerError.value = 'Unable to create booking. Please try again.';
    }
  }
  
  /**
   * Handle event click for editing owner's booking
   */
  function handleOwnerEventClick(clickInfo: any) {
    if (!currentUserId.value) {
      ownerError.value = 'Please log in to edit bookings';
      return;
    }
    
    const bookingId = clickInfo.event.id;
    const booking = ownerBookings.myBookings.value.find(b => b.id === bookingId);
    
    if (!booking) {
      ownerError.value = 'You can only edit your own bookings';
      return;
    }
    
    try {
      // Open booking form in edit mode
      uiStore.openModal('booking-form', 'edit');
      ownerError.value = null;
    } catch (error) {
      ownerError.value = 'Unable to edit booking. Please try again.';
    }
  }
  
  /**
   * Get owner's turn alerts with priority and timing information
   */
  function getOwnerTurnAlerts() {
    if (!currentUserId.value) return [];
    
    return myTurnAlerts.value.map(alert => ({
      ...alert,
      actionText: 'View Details',
      canAssignCleaner: false, // Owners can't assign cleaners
      showPropertyName: true,
      urgencyLevel: calculateUrgencyLevel(alert.guest_departure_date)
    }));
  }
  
  /**
   * Filter calendar by specific owner property
   */
  function filterByOwnerProperty(propertyId: string) {
    if (!currentUserId.value) {
      ownerError.value = 'Please log in to filter calendar';
      return;
    }
    
    // Validate property belongs to owner
    const ownerProperty = ownerBookings.myProperties.value.find(p => p.id === propertyId);
    if (!ownerProperty) {
      ownerError.value = 'You can only filter by your own properties';
      return;
    }
    
    try {
      // Use base calendar state's property filter
      baseCalendarState.togglePropertyFilter(propertyId);
      ownerError.value = null;
      ownerSuccess.value = `Filtered to show ${ownerProperty.name} bookings only`;
    } catch (error) {
      ownerError.value = 'Unable to apply property filter. Please try again.';
    }
  }
  
  /**
   * Clear all property filters for owner
   */
  function clearOwnerPropertyFilters() {
    try {
      baseCalendarState.clearPropertyFilters();
      ownerError.value = null;
      ownerSuccess.value = 'Showing all your bookings';
    } catch (error) {
      ownerError.value = 'Unable to clear filters. Please try again.';
    }
  }
  
  /**
   * Validate if owner can access a specific booking
   */
  function validateOwnerBookingAccess(bookingId: string): boolean {
    if (!currentUserId.value) return false;
    
    const booking = ownerBookings.myBookings.value.find(b => b.id === bookingId);
    return !!booking;
  }
  
  /**
   * Get owner-specific calendar statistics
   */
  function getOwnerCalendarStats() {
    const stats = {
      totalProperties: ownerBookings.myProperties.value.length,
      totalBookings: ownerBookings.myBookings.value.length,
      urgentTurns: myTurnAlerts.value.length,
      upcomingCleanings: ownerBookings.myUpcomingCleanings.value.length,
      pendingBookings: ownerBookings.myBookingsByStatus.value.pending.length,
      completedThisMonth: getCompletedThisMonth()
    };
    
    return stats;
  }
  
  // HELPER FUNCTIONS
  
  /**
   * Get property name by ID
   */
  function getPropertyName(propertyId: string): string {
    const property = ownerBookings.myProperties.value.find(p => p.id === propertyId);
    return property?.name || 'Unknown Property';
  }
  
  /**
   * Calculate time until checkout
   */
  function getTimeUntilCheckout(checkoutDate: string): string {
    const now = new Date();
    const checkout = new Date(checkoutDate);
    const diffMs = checkout.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 0) return 'Overdue';
    if (diffHours < 1) return 'Less than 1 hour';
    if (diffHours === 1) return '1 hour';
    return `${diffHours} hours`;
  }
  
  /**
   * Calculate urgency level based on time until checkout
   */
  function calculateUrgencyLevel(checkoutDate: string): 'low' | 'medium' | 'high' | 'critical' {
    const now = new Date();
    const checkout = new Date(checkoutDate);
    const diffHours = (checkout.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'critical'; // Overdue
    if (diffHours < 2) return 'critical'; // Less than 2 hours
    if (diffHours < 4) return 'high';     // Less than 4 hours
    if (diffHours < 8) return 'medium';   // Less than 8 hours
    return 'low';                         // More than 8 hours
  }
  
  /**
   * Get completed bookings count for current month
   */
  function getCompletedThisMonth(): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return ownerBookings.myBookings.value.filter(booking => {
      if (booking.status !== 'completed') return false;
      
      const completedDate = new Date(booking.updated_at || booking.created_at || new Date().toISOString());
      return completedDate >= startOfMonth && completedDate <= endOfMonth;
    }).length;
  }
  
  return {
    // Inherit base calendar state functionality
    ...baseCalendarState,
    
    // Owner-specific computed properties
    myCalendarEvents,
    myFilteredBookings,
    myTurnAlerts,
    myPropertyOptions,
    ownerCalendarTitle,
    
    // Owner-specific functions
    getOwnerCalendarEvents,
    handleOwnerDateSelect,
    handleOwnerEventClick,
    getOwnerTurnAlerts,
    filterByOwnerProperty,
    clearOwnerPropertyFilters,
    validateOwnerBookingAccess,
    getOwnerCalendarStats,
    
    // Owner-specific state
    ownerError,
    ownerLoading,
    ownerSuccess,
    
    // Helper functions
    getPropertyName,
    getTimeUntilCheckout,
    calculateUrgencyLevel
  };
} 