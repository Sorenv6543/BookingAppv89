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
    const date = new Date(currentDate.value);
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
    return bookings.filter(booking => {
      // Filter by status
      if (
        (booking.status === 'pending' && !showPendingBookings.value) ||
        (booking.status === 'scheduled' && !showScheduledBookings.value) ||
        (booking.status === 'in_progress' && !showInProgressBookings.value) ||
        (booking.status === 'completed' && !showCompletedBookings.value) ||
        (booking.status === 'cancelled' && !showCancelledBookings.value)
      ) {
        return false;
      }
      
      // Filter by type
      if (
        (booking.booking_type === 'turn' && !showTurnBookings.value) ||
        (booking.booking_type === 'standard' && !showStandardBookings.value)
      ) {
        return false;
      }
      
      // Filter by property
      if (selectedPropertyIds.value.size > 0 && !selectedPropertyIds.value.has(booking.property_id)) {
        return false;
      }
      
      // Check if booking is within current date range
      const bookingStart = new Date(booking.checkout_date);
      const bookingEnd = new Date(booking.checkin_date);
      
      return (
        (bookingStart >= dateRange.value.start && bookingStart <= dateRange.value.end) ||
        (bookingEnd >= dateRange.value.start && bookingEnd <= dateRange.value.end) ||
        (bookingStart <= dateRange.value.start && bookingEnd >= dateRange.value.end)
      );
    });
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
        start: booking.checkout_date,
        end: booking.checkin_date,
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