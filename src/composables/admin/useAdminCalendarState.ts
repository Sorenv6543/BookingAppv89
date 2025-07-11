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
    return Array.from(bookingStore.bookings.values());
  });
  
  /**
   * Get ALL properties across all owners (no filtering)
   */
  const allProperties = computed(() => {
    return Array.from(propertyStore.properties.values());
  });
  
  /**
   * Get system-wide turn alerts (all urgent turns across all properties)
   */
  const systemTurnAlerts = computed(() => {
    const now = new Date();
    const sixHoursFromNow = new Date(now.getTime() + (6 * 60 * 60 * 1000));
    
    return allBookings.value
      .filter(booking => {
        if (booking.booking_type !== 'turn' || booking.status === 'completed') {
          return false;
        }
        
        const checkoutTime = new Date(booking.checkout_date);
        return checkoutTime <= sixHoursFromNow;
      })
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime())
      .map(booking => {
        const property = allProperties.value.find(p => p.id === booking.property_id);
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
    
    allBookings.value.forEach(booking => {
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
   * Get admin calendar events - format ALL bookings for calendar (no filtering)
   */
  function getAdminCalendarEvents() {
    let bookingsToShow = allBookings.value;
    
    // Apply admin-specific filters
    if (selectedCleanerIds.value.size > 0) {
      bookingsToShow = bookingsToShow.filter(booking => 
        booking.assigned_cleaner_id && selectedCleanerIds.value.has(booking.assigned_cleaner_id)
      );
    }
    
    if (selectedOwnerIds.value.size > 0) {
      bookingsToShow = bookingsToShow.filter(booking => 
        selectedOwnerIds.value.has(booking.owner_id)
      );
    }
    
    if (showUnassignedOnly.value) {
      bookingsToShow = bookingsToShow.filter(booking => !booking.assigned_cleaner_id);
    }
    
    if (showOverdueOnly.value) {
      const now = new Date();
      bookingsToShow = bookingsToShow.filter(booking => {
        const checkoutTime = new Date(booking.checkout_date);
        return booking.status === 'pending' && checkoutTime < now;
      });
    }
    
    // Apply base calendar filtering
    const filteredBookings = baseCalendarState.filterBookings(bookingsToShow);
    
    // Convert to calendar events with admin-specific enhancements
    return filteredBookings.map(booking => {
      const property = allProperties.value.find(p => p.id === booking.property_id);
      const isPriority = booking.booking_type === 'turn';
      const isOverdue = new Date(booking.checkout_date) < new Date() && booking.status === 'pending';
      const isUnassigned = !booking.assigned_cleaner_id;
      
      // Admin-specific color coding
      let backgroundColor = '#42A5F5'; // Default blue
      let borderColor = '#42A5F5';
      
      if (isOverdue) {
        backgroundColor = '#E53935'; // Red for overdue
        borderColor = '#E53935';
      } else if (isPriority) {
        backgroundColor = '#FF5722'; // Deep orange for turns
        borderColor = '#FF5722';
      } else if (isUnassigned) {
        backgroundColor = '#FFA726'; // Orange for unassigned
        borderColor = '#FFA726';
      } else {
        // Status-based colors
        const statusColors = {
          pending: '#FFA726',     // Orange
          scheduled: '#42A5F5',   // Blue
          in_progress: '#AB47BC', // Purple
          completed: '#66BB6A',   // Green
          cancelled: '#E53935'    // Red
        };
        backgroundColor = statusColors[booking.status];
        borderColor = statusColors[booking.status];
      }
      
      // Admin-specific title with more details
      let title = '';
      if (isPriority) {
        title = '🔥 TURN';
      } else {
        title = 'Cleaning';
      }
      
      if (isUnassigned) {
        title += ' (Unassigned)';
      }
      
      if (property) {
        title += ` - ${property.name}`;
      }
      
      return {
        id: booking.id,
        title,
        start: booking.checkout_date,
        end: booking.checkin_date,
        backgroundColor,
        borderColor,
        textColor: '#FFFFFF',
        extendedProps: {
          booking_type: booking.booking_type,
          status: booking.status,
          property_id: booking.property_id,
          property_name: property?.name || 'Unknown Property',
          property_address: property?.address || 'Unknown Address',
          owner_id: booking.owner_id,
          assigned_cleaner_id: booking.assigned_cleaner_id,
          notes: booking.notes || '',
          priority: isPriority ? 'high' : 'normal',
          is_overdue: isOverdue,
          is_unassigned: isUnassigned,
          guest_count: booking.guest_count
        }
      };
    });
  }
  
  /**
   * Handle admin event click - admin booking management interface
   */
  function handleAdminEventClick(eventInfo: any) {
    const booking = allBookings.value.find(b => b.id === eventInfo.event.id);
    if (!booking) {
      error.value = 'Booking not found';
      return;
    }
    
    // Open admin booking management modal with enhanced options
    uiStore.openModal('adminBookingModal', 'edit', {
      booking,
      mode: 'admin-edit',
      availableActions: [
        'edit-details',
        'assign-cleaner',
        'update-status',
        'view-history',
        'generate-report'
      ]
    });
    
    success.value = `Opened admin management for booking: ${booking.id}`;
  }
  
  /**
   * Get specific cleaner's schedule
   */
  function getCleanerSchedule(cleanerId: string) {
    const cleanerBookings = cleanerSchedules.value[cleanerId] || [];
    
    // Filter by current date range
    const filteredBookings = baseCalendarState.filterBookings(cleanerBookings);
    
    // Calculate cleaner metrics
    const totalHours = filteredBookings.reduce((total, booking) => {
      const property = allProperties.value.find(p => p.id === booking.property_id);
      return total + (property?.cleaning_duration || 2); // Default 2 hours
    }, 0);
    
    const completedBookings = filteredBookings.filter(b => b.status === 'completed').length;
    const pendingBookings = filteredBookings.filter(b => b.status === 'pending').length;
    const turnBookings = filteredBookings.filter(b => b.booking_type === 'turn').length;
    
    return {
      cleanerId,
      bookings: filteredBookings,
      metrics: {
        totalBookings: filteredBookings.length,
        totalHours,
        completedBookings,
        pendingBookings,
        turnBookings,
        completionRate: filteredBookings.length > 0 
          ? Math.round((completedBookings / filteredBookings.length) * 100) 
          : 0
      },
      events: filteredBookings.map(booking => {
        const property = allProperties.value.find(p => p.id === booking.property_id);
        return {
          id: booking.id,
          title: `${booking.booking_type === 'turn' ? '🔥 TURN' : 'Cleaning'} - ${property?.name || 'Unknown'}`,
          start: booking.checkout_date,
          end: booking.checkin_date,
          backgroundColor: booking.booking_type === 'turn' ? '#FF5722' : '#42A5F5',
          extendedProps: {
            ...booking,
            property_name: property?.name,
            property_address: property?.address
          }
        };
      })
    };
  }
  
  /**
   * Advanced filtering with multiple criteria
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
    let filteredBookings = allBookings.value;
    
    // Filter by status
    if (criteria.status && criteria.status.length > 0) {
      filteredBookings = filteredBookings.filter(booking => 
        criteria.status!.includes(booking.status)
      );
    }
    
    // Filter by booking type
    if (criteria.bookingType && criteria.bookingType.length > 0) {
      filteredBookings = filteredBookings.filter(booking => 
        criteria.bookingType!.includes(booking.booking_type)
      );
    }
    
    // Filter by cleaner
    if (criteria.cleanerIds && criteria.cleanerIds.length > 0) {
      filteredBookings = filteredBookings.filter(booking => 
        booking.assigned_cleaner_id && criteria.cleanerIds!.includes(booking.assigned_cleaner_id)
      );
    }
    
    // Filter by owner
    if (criteria.ownerIds && criteria.ownerIds.length > 0) {
      filteredBookings = filteredBookings.filter(booking => 
        criteria.ownerIds!.includes(booking.owner_id)
      );
    }
    
    // Filter by property
    if (criteria.propertyIds && criteria.propertyIds.length > 0) {
      filteredBookings = filteredBookings.filter(booking => 
        criteria.propertyIds!.includes(booking.property_id)
      );
    }
    
    // Filter by date range
    if (criteria.dateRange) {
      const startDate = new Date(criteria.dateRange.start);
      const endDate = new Date(criteria.dateRange.end);
      
      filteredBookings = filteredBookings.filter(booking => {
        const bookingStart = new Date(booking.checkout_date);
        const bookingEnd = new Date(booking.checkin_date);
        
        return (
          (bookingStart >= startDate && bookingStart <= endDate) ||
          (bookingEnd >= startDate && bookingEnd <= endDate) ||
          (bookingStart <= startDate && bookingEnd >= endDate)
        );
      });
    }
    
    // Filter unassigned only
    if (criteria.unassignedOnly) {
      filteredBookings = filteredBookings.filter(booking => !booking.assigned_cleaner_id);
    }
    
    // Filter overdue only
    if (criteria.overdueOnly) {
      const now = new Date();
      filteredBookings = filteredBookings.filter(booking => {
        const checkoutTime = new Date(booking.checkout_date);
        return booking.status === 'pending' && checkoutTime < now;
      });
    }
    
    // Filter priority only (turns)
    if (criteria.priorityOnly) {
      filteredBookings = filteredBookings.filter(booking => booking.booking_type === 'turn');
    }
    
    return filteredBookings;
  }
  
  /**
   * Get calendar events with admin-specific formatting
   */
  const adminCalendarEvents = computed(() => getAdminCalendarEvents());
  
  return {
    // Extend base calendar state
    ...baseCalendarState,
    
    // Admin-specific state
    loading,
    error,
    success,
    selectedCleanerIds,
    selectedOwnerIds,
    showUnassignedOnly,
    showOverdueOnly,
    calendarViewMode,
    
    // Admin-specific computed properties
    allBookings,
    allProperties,
    systemTurnAlerts,
    cleanerSchedules,
    adminCalendarEvents,
    
    // Admin-specific functions
    getAdminCalendarEvents,
    handleAdminEventClick,
    getCleanerSchedule,
    filterByMultipleCriteria
  };
} 