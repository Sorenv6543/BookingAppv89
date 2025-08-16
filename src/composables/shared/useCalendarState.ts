import { ref, computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useBookingStore } from '@/stores/booking';
import type { Booking } from '@/types';

/**
 * Composable for calendar view state management
 * Controls calendar display options, date ranges, and filtering
 */
export function useCalendarState() {
  const uiStore = useUIStore();
  const bookingStore = useBookingStore();
  
  // Calendar view state
  const currentView = ref<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const currentDate = ref<Date>(new Date());
  const dateRange = ref<{ start: Date; end: Date }>({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 7))
  });
  
  // Booking display filters
  const showPendingBookings = ref<boolean>(true);
  const showScheduledBookings = ref<boolean>(true);
  const showInProgressBookings = ref<boolean>(true);
  const showCompletedBookings = ref<boolean>(false);
  const showCancelledBookings = ref<boolean>(false);
  const showTurnBookings = ref<boolean>(true);
  const showStandardBookings = ref<boolean>(true);
  
  // Selected property filter (empty means show all)
  const selectedPropertyIds = ref<Set<string>>(new Set());
  
  /**
   * Change calendar view
   */
  function setCalendarView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') {
    currentView.value = view;
    
    // Update UI store
    uiStore.setFilter('calendarView', view);
  }
  
  /**
   * Navigate to specific date
   */
  function goToDate(date: Date) {
    currentDate.value = date;
    updateDateRange();
  }
  
  /**
   * Navigate to today
   */
  function goToToday() {
    currentDate.value = new Date();
    updateDateRange();
  }
  
  /**
   * Navigate to next period (day/week/month)
   */
  function next() {
    const date = new Date(currentDate.value);
    
    if (currentView.value === 'dayGridMonth') {
      date.setMonth(date.getMonth() + 1);
    } else if (currentView.value === 'timeGridWeek') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setDate(date.getDate() + 1);
    }
    
    currentDate.value = date;
    updateDateRange();
  }
  
  /**
   * Navigate to previous period (day/week/month)
   */
  function prev() {
    const date = new Date(currentDate.value);
    
    if (currentView.value === 'dayGridMonth') {
      date.setMonth(date.getMonth() - 1);
    } else if (currentView.value === 'timeGridWeek') {
      date.setDate(date.getDate() - 7);
    } else {
      date.setDate(date.getDate() - 1);
    }
    
    currentDate.value = date;
    updateDateRange();
  }
  
  /**
   * Update date range based on current view and date
   */
  function updateDateRange() {
    // Debug: Check what currentDate.value contains
    console.log('🔍 [useCalendarState] updateDateRange - currentDate.value:', {
      value: currentDate.value,
      type: typeof currentDate.value,
      isDate: currentDate.value instanceof Date,
      isValid: currentDate.value instanceof Date ? !isNaN(currentDate.value.getTime()) : false
    });

    // Ensure currentDate.value is a valid Date object
    let date: Date;
    if (currentDate.value instanceof Date && !isNaN(currentDate.value.getTime())) {
      date = new Date(currentDate.value);
    } else {
      console.warn('⚠️ [useCalendarState] currentDate.value is invalid, using current date');
      date = new Date();
      currentDate.value = date;
    }

    let start: Date;
    let end: Date;
    
    if (currentView.value === 'dayGridMonth') {
      // Start from first day of month
      start = new Date(date.getFullYear(), date.getMonth(), 1);
      
      // End on last day of month
      end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else if (currentView.value === 'timeGridWeek') {
      // Start from beginning of week (Sunday)
      const day = date.getDay();
      start = new Date(date);
      start.setDate(date.getDate() - day);
      
      // End at end of week (Saturday)
      end = new Date(start);
      end.setDate(start.getDate() + 6);
    } else {
      // Day view - just use the current date
      start = new Date(date);
      end = new Date(date);
    }
    
    // Set time to beginning/end of day
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    
    // Debug: Verify the dates are valid before setting
    console.log('🔍 [useCalendarState] updateDateRange - calculated dates:', {
      start: start.toISOString(),
      end: end.toISOString(),
      startValid: !isNaN(start.getTime()),
      endValid: !isNaN(end.getTime())
    });
    
    dateRange.value = { start, end };
    
    // Update UI store
    uiStore.setFilter('dateRangeStart', start.toISOString());
    uiStore.setFilter('dateRangeEnd', end.toISOString());
  }
  
  /**
   * Toggle booking status filter
   */
  function toggleStatusFilter(status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled') {
    switch (status) {
      case 'pending':
        showPendingBookings.value = !showPendingBookings.value;
        break;
      case 'scheduled':
        showScheduledBookings.value = !showScheduledBookings.value;
        break;
      case 'in_progress':
        showInProgressBookings.value = !showInProgressBookings.value;
        break;
      case 'completed':
        showCompletedBookings.value = !showCompletedBookings.value;
        break;
      case 'cancelled':
        showCancelledBookings.value = !showCancelledBookings.value;
        break;
    }
    
    // Update UI store
    uiStore.setFilter(`show${status.charAt(0).toUpperCase() + status.slice(1)}`, 
      status === 'pending' ? showPendingBookings.value :
      status === 'scheduled' ? showScheduledBookings.value :
      status === 'in_progress' ? showInProgressBookings.value :
      status === 'completed' ? showCompletedBookings.value :
      showCancelledBookings.value
    );
  }
  
  /**
   * Toggle booking type filter
   */
  function toggleTypeFilter(type: 'turn' | 'standard') {
    if (type === 'turn') {
      showTurnBookings.value = !showTurnBookings.value;
      uiStore.setFilter('showTurnBookings', showTurnBookings.value);
    } else {
      showStandardBookings.value = !showStandardBookings.value;
      uiStore.setFilter('showStandardBookings', showStandardBookings.value);
    }
  }
  
  /**
   * Toggle property filter
   */
  function togglePropertyFilter(propertyId: string) {
    if (selectedPropertyIds.value.has(propertyId)) {
      selectedPropertyIds.value.delete(propertyId);
    } else {
      selectedPropertyIds.value.add(propertyId);
    }
    
    // Update UI store
    uiStore.setFilter('selectedProperties', Array.from(selectedPropertyIds.value));
  }
  
  /**
   * Clear all property filters
   */
  function clearPropertyFilters() {
    selectedPropertyIds.value.clear();
    uiStore.setFilter('selectedProperties', []);
  }
  
  /**
   * Filter bookings based on current filters
   */
  function filterBookings(bookings: Booking[]): Booking[] {
    try {
      // Debug: Log the current date range and filter settings
    console.log('🔍 [useCalendarState] Debug - Filter settings:', {
      dateRange: {
        start: dateRange.value.start instanceof Date && !isNaN(dateRange.value.start.getTime()) 
          ? dateRange.value.start.toISOString() 
          : 'INVALID_DATE',
        end: dateRange.value.end instanceof Date && !isNaN(dateRange.value.end.getTime()) 
          ? dateRange.value.end.toISOString() 
          : 'INVALID_DATE'
      },
      showPending: showPendingBookings.value,
      showScheduled: showScheduledBookings.value,
      showInProgress: showInProgressBookings.value,
      showCompleted: showCompletedBookings.value,
      showCancelled: showCancelledBookings.value,
      showTurn: showTurnBookings.value,
      showStandard: showStandardBookings.value,
      selectedProperties: selectedPropertyIds.value.size
    });
    
    console.log('🔍 [useCalendarState] Processing bookings:', bookings.map(b => ({
      id: b.id,
              checkout_date: b.checkout_date,
              checkin_date: b.checkin_date,
              checkout_date_valid: b.checkout_date ? !isNaN(new Date(b.checkout_date).getTime()) : false,
              checkin_date_valid: b.checkin_date ? !isNaN(new Date(b.checkin_date).getTime()) : false,
      status: b.status,
      booking_type: b.booking_type
    })));
    
    const filtered = bookings.filter(booking => {
      // Filter by status
      if (
        (booking.status === 'pending' && !showPendingBookings.value) ||
        (booking.status === 'scheduled' && !showScheduledBookings.value) ||
        (booking.status === 'in_progress' && !showInProgressBookings.value) ||
        (booking.status === 'completed' && !showCompletedBookings.value) ||
        (booking.status === 'cancelled' && !showCancelledBookings.value)
      ) {
        console.log(`🔍 [useCalendarState] Filtered out booking ${booking.id} by status: ${booking.status}`);
        return false;
      }
      
      // Filter by type
      if (
        (booking.booking_type === 'turn' && !showTurnBookings.value) ||
        (booking.booking_type === 'standard' && !showStandardBookings.value)
      ) {
        console.log(`🔍 [useCalendarState] Filtered out booking ${booking.id} by type: ${booking.booking_type}`);
        return false;
      }
      
      // Debug: Log booking details to see what's happening
      console.log(`🔍 [useCalendarState] Booking ${booking.id} passed all filters:`, {
        status: booking.status,
        booking_type: booking.booking_type,
        showPending: showPendingBookings.value,
        showScheduled: showScheduledBookings.value,
        showInProgress: showInProgressBookings.value,
        showCompleted: showCompletedBookings.value,
        showCancelled: showCancelledBookings.value,
        showTurn: showTurnBookings.value,
        showStandard: showStandardBookings.value
      });
      
      // Filter by property
      if (selectedPropertyIds.value.size > 0 && !selectedPropertyIds.value.has(booking.property_id)) {
        console.log(`🔍 [useCalendarState] Filtered out booking ${booking.id} by property: ${booking.property_id}`);
        return false;
      }
      
      // Check if booking is within current date range (checkin = start, checkout = end)
      const bookingStart = new Date(booking.checkin_date);
      const bookingEnd = new Date(booking.checkout_date);
      
      // Debug: Check if the dates are valid
      const bookingStartValid = !isNaN(bookingStart.getTime());
      const bookingEndValid = !isNaN(bookingEnd.getTime());
      
      if (!bookingStartValid || !bookingEndValid) {
        console.log(`🔍 [useCalendarState] Booking ${booking.id} has invalid dates:`, {
          checkout_date: booking.checkout_date,
          checkin_date: booking.checkin_date,
          bookingStartValid,
          bookingEndValid
        });
        return false;
      }
      
      const isInRange = (
        (bookingStart >= dateRange.value.start && bookingStart <= dateRange.value.end) ||
        (bookingEnd >= dateRange.value.start && bookingEnd <= dateRange.value.end) ||
        (bookingStart <= dateRange.value.start && bookingEnd >= dateRange.value.end)
      );
      
      console.log(`🔍 [useCalendarState] Booking ${booking.id} date check:`, {
        bookingStart: bookingStart.toISOString(),
        bookingEnd: bookingEnd.toISOString(),
        rangeStart: dateRange.value.start.toISOString(),
        rangeEnd: dateRange.value.end.toISOString(),
        isInRange: isInRange,
        bookingStartValid,
        bookingEndValid
      });
      
      if (!isInRange) {
        console.log(`🔍 [useCalendarState] Booking ${booking.id} filtered out by date range`);
      }
      
      return isInRange;
    });
    
    console.log(`🔍 [useCalendarState] Filtered ${bookings.length} bookings down to ${filtered.length}`);
    console.log('🔍 [useCalendarState] Filtered bookings:', filtered.map(b => ({ id: b.id, status: b.status, booking_type: b.booking_type })));
    
    // Debug: Show the actual date range values
    console.log('🔍 [useCalendarState] Actual date range values:', {
      start: dateRange.value.start.toISOString(),
      end: dateRange.value.end.toISOString(),
      startDate: dateRange.value.start.toDateString(),
      endDate: dateRange.value.end.toDateString()
    });
    
    // Debug: Show what happened to each booking
    bookings.forEach(booking => {
      console.log(`🔍 [useCalendarState] Booking ${booking.id} final result:`, {
        id: booking.id,
        status: booking.status,
        booking_type: booking.booking_type,
        isInFiltered: filtered.some(b => b.id === booking.id)
      });
    });
    
    return filtered;
    } catch (error) {
      console.error('❌ [useCalendarState] Error in filterBookings:', error);
      return [];
    }
  }
  
  /**
   * Get formatted date range for display
   */
  function getFormattedDateRange(): string {
    const start = dateRange.value.start;
    const end = dateRange.value.end;
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric',
      year: start.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    };
    
    if (
      start.getDate() === end.getDate() && 
      start.getMonth() === end.getMonth() && 
      start.getFullYear() === end.getFullYear()
    ) {
      // Same day
      return start.toLocaleDateString('en-US', options);
    } else if (
      start.getMonth() === end.getMonth() && 
      start.getFullYear() === end.getFullYear()
    ) {
      // Same month and year
      return `${start.getDate()} - ${end.toLocaleDateString('en-US', options)}`;
    } else if (start.getFullYear() === end.getFullYear()) {
      // Same year
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    } else {
      // Different years
      return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      })}`;
    }
  }
  
  /**
   * Convert bookings to FullCalendar event format
   */
  function bookingsToEvents(bookings: Booking[]) {
    return filterBookings(bookings).map(booking => {
      // Get booking status for color coding
      const statusColors = {
        pending: '#FFA726',     // Orange
        scheduled: '#42A5F5',   // Blue
        in_progress: '#AB47BC', // Purple
        completed: '#66BB6A',   // Green
        cancelled: '#E53935'    // Red
      };
      
      // Get booking type for display
      const isPriority = booking.booking_type === 'turn';
      
      return {
        id: booking.id,
        title: isPriority ? '🔥 TURN BOOKING' : 'Standard Cleaning',
        start: booking.checkin_date,
        end: booking.checkout_date,
        backgroundColor: statusColors[booking.status],
        borderColor: statusColors[booking.status],
        textColor: '#FFFFFF',
        extendedProps: {
          booking_type: booking.booking_type,
          status: booking.status,
          property_id: booking.property_id,
          notes: booking.notes || '',
          priority: isPriority ? 'high' : 'normal'
        }
      };
    });
  }
  
  // Initialize date range on creation
  updateDateRange();
  
  return {
    // State
    currentView,
    currentDate,
    dateRange,
    showPendingBookings,
    showScheduledBookings,
    showInProgressBookings,
    showCompletedBookings,
    showCancelledBookings,
    showTurnBookings,
    showStandardBookings,
    selectedPropertyIds,
    
    // Calendar navigation
    setCalendarView,
    goToDate,
    goToToday,
    next,
    prev,
    updateDateRange,
    
    // Filtering
    toggleStatusFilter,
    toggleTypeFilter,
    togglePropertyFilter,
    clearPropertyFilters,
    filterBookings,
    
    // Formatting and conversion
    getFormattedDateRange,
    bookingsToEvents,
    
    // Computed properties
    formattedDateRange: computed(() => getFormattedDateRange()),
    filteredBookings: computed(() => filterBookings(bookingStore.bookingsArray)),
    calendarEvents: computed(() => bookingsToEvents(bookingStore.bookingsArray))
  };
}