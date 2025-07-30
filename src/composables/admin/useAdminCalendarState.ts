import { ref, computed } from 'vue';
import { useCalendarState } from '@/composables/shared/useCalendarState';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useUIStore } from '@/stores/ui';
import type { Booking, BookingStatus, BookingType } from '@/types';

/**
 * Admin-specific calendar state composable
 * Extends shared useCalendarState functionality with admin system-wide access
 * 
 * Key Features:
 * - NO filtering - access ALL calendar events across all owners
 * - Admin-specific calendar features (cleaner views, advanced filters)
 * - System-wide calendar management
 * - Cleaner assignment calendar logic
 */
export function useAdminCalendarState() {
  // Get shared functionality and stores
  const baseCalendarState = useCalendarState();
  const bookingStore = useBookingStore();
  const propertyStore = usePropertyStore();
  const uiStore = useUIStore();
  
  // Admin-specific state
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  const success = ref<string | null>(null);
  
  // Admin-specific calendar filters
  const selectedCleanerIds = ref<Set<string>>(new Set());
  const selectedOwnerIds = ref<Set<string>>(new Set());
  const showUnassignedOnly = ref<boolean>(false);
  const showOverdueOnly = ref<boolean>(false);
  const calendarViewMode = ref<'standard' | 'cleaner' | 'owner' | 'priority'>('standard');
  
  // COMPUTED PROPERTIES - Admin system-wide data access (NO filtering)
  
  /**
   * Get ALL bookings across all owners (no filtering)
   * This is the key difference from owner version
   */
  const allBookings = computed(() => {
    return bookingStore.bookings;
  });
  
  /**
   * Get ALL properties across all owners (no filtering)
   */
  const allProperties = computed(() => {
    return propertyStore.properties;
  });
  
  /**
   * Get system-wide turn alerts (all urgent turns across all properties)
   */
  const systemTurnAlerts = computed(() => {
    const now = new Date();
    const sixHoursFromNow = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    
    return Array.from(bookingStore.bookings.values())
      .filter(booking => {
        if (booking.booking_type !== 'turn' || booking.status === 'completed') {
          return false;
        }
        
        const checkoutTime = new Date(booking.checkout_date);
        return checkoutTime <= sixHoursFromNow;
      })
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime())
      .map(booking => {
        const property = propertyStore.properties.get(booking.property_id);
        const hoursUntil = Math.max(0, Math.floor((new Date(booking.checkout_date).getTime() - now.getTime()) / (1000 * 60 * 60)));
        
        return {
          ...booking,
          property_name: property?.name || 'Unknown Property',
          property_address: property?.address || 'Unknown Address',
          hours_until_checkout: hoursUntil,
          priority: hoursUntil <= 2 ? 'urgent' as const : 'high' as const,
          alert_message: hoursUntil <= 2 
            ? `URGENT: Turn in ${hoursUntil}h` 
            : `Turn in ${hoursUntil}h`
        };
      });
  });
  
  /**
   * Get cleaner schedules (bookings grouped by cleaner)
   */
  const cleanerSchedules = computed(() => {
    const schedules: Record<string, Booking[]> = {
      unassigned: []
    };
    
    Array.from(bookingStore.bookings.values()).forEach(booking => {
      if (!booking.assigned_cleaner_id) {
        schedules.unassigned.push(booking);
      } else {
        if (!schedules[booking.assigned_cleaner_id]) {
          schedules[booking.assigned_cleaner_id] = [];
        }
        schedules[booking.assigned_cleaner_id].push(booking);
      }
    });
    
    return schedules;
  });
  
  /**
   * Get owner schedules (bookings grouped by owner)
   */
  const ownerSchedules = computed(() => {
    const schedules: Record<string, Booking[]> = {};
    
    Array.from(bookingStore.bookings.values()).forEach(booking => {
      if (!schedules[booking.owner_id]) {
        schedules[booking.owner_id] = [];
      }
      schedules[booking.owner_id].push(booking);
    });
    
    return schedules;
  });
  
  /**
   * Get system-wide metrics and analytics
   */
  const systemMetrics = computed(() => {
    const bookings = Array.from(bookingStore.bookings.values());
    const total = bookings.length;
    const turns = bookings.filter(b => b.booking_type === 'turn').length;
    const urgentTurns = systemTurnAlerts.value.length;
    const unassigned = bookings.filter(b => !b.assigned_cleaner_id && b.status !== 'completed' && b.status !== 'cancelled').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    
    return {
      total,
      turns,
      urgentTurns,
      unassigned,
      completed,
      pending,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      turnPercentage: total > 0 ? Math.round((turns / total) * 100) : 0
    };
  });
  
  // HELPER FUNCTIONS
  
  /**
   * Get booking color based on status
   */
  function getBookingColor(status: BookingStatus): string {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'scheduled': return '#2196f3';
      case 'in_progress': return '#9c27b0';
      case 'completed': return '#4caf50';
      case 'cancelled': return '#f44336';
      default: return '#757575';
    }
  }
  
  /**
   * Get booking border color based on status
   */
  function getBookingBorderColor(status: BookingStatus): string {
    switch (status) {
      case 'pending': return '#e65100';
      case 'scheduled': return '#1565c0';
      case 'in_progress': return '#6a1b9a';
      case 'completed': return '#2e7d32';
      case 'cancelled': return '#c62828';
      default: return '#424242';
    }
  }
  
  /**
   * Handle admin event click with business logic
   */
  function handleAdminEventClick(eventInfo: any) {
    const booking = eventInfo.event.extendedProps.booking as Booking;
    
    // Admin-specific logic: show different options based on booking state
    if (booking.status === 'pending' && !booking.assigned_cleaner_id) {
      // Show cleaner assignment modal
      uiStore.openModal('cleanerAssignment', { booking });
    } else if (booking.status === 'in_progress') {
      // Show completion options
      uiStore.openModal('bookingActions', { booking, actions: ['complete', 'cancel'] });
    } else {
      // Show standard booking details
      uiStore.openModal('bookingDetails', { booking });
    }
  }
  
  /**
   * Get cleaner schedule for specific cleaner
   */
  function getCleanerSchedule(cleanerId: string) {
    return cleanerSchedules.value[cleanerId] || [];
  }
  
  /**
   * Get owner schedule for specific owner
   */
  function getOwnerSchedule(ownerId: string) {
    return ownerSchedules.value[ownerId] || [];
  }
  
  /**
   * Advanced filtering for admin interface
   */
  function filterByMultipleCriteria(criteria: {
    status?: BookingStatus[];
    bookingType?: BookingType[];
    cleanerIds?: string[];
    ownerIds?: string[];
    propertyIds?: string[];
    dateRange?: { start: string; end: string };
    unassignedOnly?: boolean;
    overdueOnly?: boolean;
    priorityOnly?: boolean;
  }) {
    return Array.from(bookingStore.bookings.values()).filter(booking => {
      // Status filter
      if (criteria.status && criteria.status.length > 0) {
        if (!criteria.status.includes(booking.status)) return false;
      }
      
      // Booking type filter
      if (criteria.bookingType && criteria.bookingType.length > 0) {
        if (!criteria.bookingType.includes(booking.booking_type)) return false;
      }
      
      // Cleaner filter
      if (criteria.cleanerIds && criteria.cleanerIds.length > 0) {
        if (!booking.assigned_cleaner_id || !criteria.cleanerIds.includes(booking.assigned_cleaner_id)) {
          return false;
        }
      }
      
      // Owner filter
      if (criteria.ownerIds && criteria.ownerIds.length > 0) {
        if (!criteria.ownerIds.includes(booking.owner_id)) return false;
      }
      
      // Property filter
      if (criteria.propertyIds && criteria.propertyIds.length > 0) {
        if (!criteria.propertyIds.includes(booking.property_id)) return false;
      }
      
      // Unassigned filter
      if (criteria.unassignedOnly) {
        if (booking.assigned_cleaner_id) return false;
      }
      
      // Overdue filter
      if (criteria.overdueOnly) {
        const checkoutTime = new Date(booking.checkout_date);
        if (checkoutTime > new Date()) return false;
      }
      
      // Priority filter (turns only)
      if (criteria.priorityOnly) {
        if (booking.booking_type !== 'turn') return false;
      }
      
      // Date range filter
      if (criteria.dateRange) {
        const bookingDate = new Date(booking.checkout_date);
        const startDate = new Date(criteria.dateRange.start);
        const endDate = new Date(criteria.dateRange.end);
        if (bookingDate < startDate || bookingDate > endDate) return false;
      }
      
      return true;
    });
  }
  
  // Return admin-specific interface
  return {
    // State
    loading,
    error,
    success,
    
    // Calendar state from base composable
    currentView: baseCalendarState.currentView,
    currentDate: baseCalendarState.currentDate,
    
    // Computed properties (system-wide, no filtering)
    allBookings,
    allProperties,
    systemTurnAlerts,
    cleanerSchedules,
    ownerSchedules,
    systemMetrics,
    
    // Admin-specific filters
    selectedCleanerIds,
    selectedOwnerIds,
    showUnassignedOnly,
    showOverdueOnly,
    calendarViewMode,
    
    // Functions
    handleAdminEventClick,
    getCleanerSchedule,
    getOwnerSchedule,
    filterByMultipleCriteria,
    setCalendarView: baseCalendarState.setCalendarView,
    goToDate: baseCalendarState.goToDate,
    
    // Helper functions
    getBookingColor,
    getBookingBorderColor
  };
} 