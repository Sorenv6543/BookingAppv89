<template>
  <div class="calendar-container">
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      class="custom-calendar"
    />
    
    <!-- Owner Day View Bottom Sheet -->
    <OwnerDayViewBottomSheet
      v-model:visible="dayViewVisible"
      :date="selectedDate"
      :bookings="selectedDayBookings"
      :properties="properties"
      @view-booking="handleViewBooking"
      @edit-booking="handleEditBooking"
      @complete-booking="handleCompleteBooking"
      @add-booking="handleAddBookingFromDayView"
    />
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, ref, watch, onMounted, onUnmounted, onBeforeUnmount } from 'vue';
import { useTheme } from 'vuetify';
import type { Booking, Property } from '@/types';
import { getMobileCalendarOptions, handleViewportResize } from '@/utils/mobileViewport';
import OwnerDayViewBottomSheet from '@/components/dumb/owner/OwnerDayViewBottomSheet.vue';
import { useAuthStore } from '@/stores/auth';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';

interface Props {
  bookings: Map<string, Booking>;
  properties: Map<string, Property>;
  loading?: boolean;
}

interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'eventDrop', dropInfo: EventDropArg): void;
  (e: 'eventResize', resizeInfo: EventDropArg): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'updateBooking', data: { id: string; start: string; end: string }): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

// Theme integration
const theme = useTheme();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Auth store for owner filtering
const authStore = useAuthStore();

// Day view bottom sheet state
const dayViewVisible = ref(false);
const selectedDate = ref<Date | null>(null);
const selectedDayBookings = ref<Booking[]>([]);

// Convert bookings Map to FullCalendar events
const calendarEvents = computed(() => {
  const bookingsArray = Array.from(props.bookings.values());
   
  const events = bookingsArray.map(booking => {
    const property = props.properties.get(booking.property_id);
    const isTurn = booking.booking_type === 'turn';
    const isUrgent = booking.priority === 'urgent';
    
    const eventColor = getEventColor(booking);
    const borderColor = getEventBorderColor(booking);
    const textColor = getEventTextColor(booking);
    
    return {
      id: booking.id,
      title: `${property?.name || 'Unknown Property'} - ${isTurn ? 'TURN' : 'Standard'}`,
      start: booking.checkout_date,
      end: addOneDay(booking.checkin_date), // Add one day to make end date inclusive
      backgroundColor: eventColor,
      borderColor: borderColor,
      textColor: textColor,
      editable: true,
      startEditable: true,
      durationEditable: true,
      overlap: true,
      extendedProps: {
        booking,
        property,
        bookingType: booking.booking_type,
        status: booking.status,
        priority: booking.priority,
        guestCount: booking.guest_count,
        notes: booking.notes,
        eventColor,
        borderColor,
        textColor
      },
      classNames: [
        `booking-${booking.booking_type}`,
        `status-${booking.status}`,
        `priority-${booking.priority}`,
        `type-${booking.booking_type}-${booking.priority}`,
        isTurn ? 'turn-booking-event' : 'standard-booking-event',
        isUrgent && isTurn ? 'turn-urgent-event' : '',
        isUrgent ? 'urgent-event' : ''
      ].filter(Boolean)
    };
  });
   
  return events;
});

// Helper function to add one day to a date string
const addOneDay = (dateString: string): string => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

// Enhanced dynamic color system with more variety
const getEventColor = (booking: Booking): string => {
  const isDark = theme.global.current.value.dark;
  
  if (booking.booking_type === 'turn') {
    switch (booking.priority) {
      case 'urgent':
        return isDark ? '#64748b' : '#475569'; // Dark slate for urgent turns
      case 'high':
        return isDark ? '#78716c' : '#64748b'; // Slate for high priority turns
      case 'normal':
        return isDark ? '#9ca3af' : '#78716c'; // Stone for normal turns
      case 'low':
        return isDark ? '#d1d5db' : '#9ca3af'; // Cool gray for low priority turns
      default:
        return isDark ? '#6b7280' : '#475569';
    }
  } else {
    switch (booking.priority) {
      case 'urgent':
        return isDark ? '#7c3aed' : '#6366f1'; // Indigo for urgent standard
      case 'high':
        return isDark ? '#a855f7' : '#8b5cf6'; // Violet for high priority standard
      case 'normal':
        return isDark ? '#0ea5e9' : '#06b6d4'; // Cyan for normal
      case 'low':
        return isDark ? '#22c55e' : '#10b981'; // Emerald for low priority
      default:
        return isDark ? '#3b82f6' : '#2563eb';
    }
  }
};

const getEventBorderColor = (booking: Booking): string => {
  if (booking.booking_type === 'turn') {
    switch (booking.priority) {
      case 'urgent':
        return '#334155'; // Dark slate border for urgent turns
      case 'high':
        return '#475569'; // Slate border for high priority turns
      case 'normal':
        return '#57534e'; // Stone border for normal turns
      case 'low':
        return '#6b7280'; // Cool gray border for low priority turns
      default:
        return '#334155';
    }
  } else {
    switch (booking.priority) {
      case 'urgent':
        return '#4f46e5'; // Indigo border for urgent standard
      case 'high':
        return '#7c3aed'; // Violet border for high priority standard
      case 'normal':
        return '#0891b2'; // Cyan border for normal
      case 'low':
        return '#059669'; // Emerald border for low priority
      default:
        return '#1d4ed8';
    }
  }
};

const getEventTextColor = (booking: Booking): string => {
  // Use white text for better contrast on colored backgrounds
  if (booking.status === 'completed') {
    return '#E0E0E0'; // Lighter text for completed bookings
  }
  return '#FFFFFF';
};

// Mobile viewport height management
const mobileOptions = ref(getMobileCalendarOptions());
let cleanupViewportListener: (() => void) | null = null;

// Calendar configuration
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
  // View settings
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: '',
    center: '',
    right: ''
  },
  
  
  // Event settings - mobile optimized
  events: calendarEvents.value,
  eventDisplay: mobileOptions.value.eventDisplay,
  eventOverlap: true,
  eventResizableFromStart: true,
  eventResizableFromEnd: true,
  eventStartEditable: true,
  eventDurationEditable: true,
  
  // Interaction settings
  selectable: true,
  selectMirror: true,
  editable: true,
  droppable: true,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize, // Enable resize handler
  
  // Date/time settings
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  slotDuration: '01:00:00',
  snapDuration: '00:30:00',
  
  // Use mobile-optimized height calculation
  height: mobileOptions.value.height,
  aspectRatio: undefined, // Remove aspect ratio constraints for full height
  expandRows: true, // Make calendar rows expand to fill available height
  
  // Custom styling based on theme
  themeSystem: 'standard',
  
  // Event handlers
  select: handleDateSelect,
  eventClick: handleEventClick,
  dayClick: handleDayClick,
  
  // Loading state
  loading: handleLoading,
  
  // Calendar lifecycle
  datesSet: handleCalendarMount,
  viewDidMount: handleViewMount,
  
  // Custom rendering
  eventContent: renderEventContent,
  
  // Business hours (optional)
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Monday - Sunday
    startTime: '08:00',
    endTime: '18:00'
  },
  
  // Weekend styling
  weekends: true,
  
  // Month view specific - mobile optimized
  dayMaxEvents: mobileOptions.value.dayMaxEvents,
  moreLinkClick: 'popover', // Show popover for more events
  
  // Week/day view specific
  allDaySlot: false,
  nowIndicator: true,
  scrollTime: '08:00:00'
}));

// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  // Log emitting event to Home
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'dateSelect',
    { start: selectInfo.startStr, end: selectInfo.endStr },
    'emit'
  );
  
  emit('dateSelect', selectInfo);
  
  // Optionally auto-create booking
  emit('createBooking', {
    start: selectInfo.startStr,
    end: selectInfo.endStr
  });
  
  // Clear selection
  selectInfo.view.calendar.unselect();
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  // Log emitting event to Home
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventClick',
    { id: clickInfo.event.id },
    'emit'
  );
  
  emit('eventClick', clickInfo);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  // Log emitting event to Home
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventDrop',
    { 
      id: booking.id, 
      start: dropInfo.event.startStr, 
      end: dropInfo.event.endStr || dropInfo.event.startStr 
    },
    'emit'
  );
  
  emit('eventDrop', dropInfo);
  emit('updateBooking', {
    id: booking.id,
    start: dropInfo.event.startStr,
    end: dropInfo.event.endStr || dropInfo.event.startStr
  });
};

// Enable the event resize handler
const handleEventResize = (resizeInfo: any): void => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  // Log emitting event to Home
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventResize',
    { 
      id: booking.id, 
      start: resizeInfo.event.startStr, 
      end: resizeInfo.event.endStr || resizeInfo.event.startStr 
    },
    'emit'
  );
  
  emit('eventResize', resizeInfo);
  emit('updateBooking', {
    id: booking.id,
    start: resizeInfo.event.startStr,
    end: resizeInfo.event.endStr || resizeInfo.event.startStr
  });
};

const handleDayClick = (dayClickInfo: { date: Date; dateStr: string }): void => {
  console.log('🗓️ [FullCalendar] Day clicked:', dayClickInfo.dateStr);
  
  // Set the selected date
  selectedDate.value = dayClickInfo.date;
  
  // Find bookings for this specific day
  const clickedDate = dayClickInfo.dateStr;
  const dayBookings = Array.from(props.bookings.values()).filter(booking => {
    const checkoutDate = booking.checkout_date;
    const checkinDate = booking.checkin_date;
    
    // Check if the clicked date falls within the booking period
    return clickedDate >= checkoutDate && clickedDate < checkinDate;
  });
  
  selectedDayBookings.value = dayBookings;
  
  // Show the bottom sheet
  dayViewVisible.value = true;
  
  console.log('📅 [FullCalendar] Day view opened with', dayBookings.length, 'bookings for date:', clickedDate);
  console.log('📅 [FullCalendar] Day bookings:', dayBookings.map(b => ({
    id: b.id,
    property_id: b.property_id,
    arrival: b.checkin_date,
            checkout: b.checkout_date
  })));
};



// Custom event rendering with enhanced visual variety
const renderEventContent = (eventInfo: { event: { extendedProps: { booking: Booking; property: Property; eventColor?: string; borderColor?: string; textColor?: string }; backgroundColor?: string; borderColor?: string; textColor?: string } }) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const eventColor = eventInfo.event.extendedProps.eventColor || eventInfo.event.backgroundColor;
  const borderColor = eventInfo.event.extendedProps.borderColor || eventInfo.event.borderColor;
  const textColor = eventInfo.event.extendedProps.textColor || eventInfo.event.textColor;
  
  // Get priority icon
  const getPriorityIcon = (priority: string, type: string) => {
    if (type === 'turn') {
      switch (priority) {
        case 'urgent': return '🚨';
        case 'high': return '🔥';
        case 'normal': return '🏠';
        case 'low': return '🧹';
        default: return '🏠';
      }
    } else {
      switch (priority) {
        case 'urgent': return '⚡';
        case 'high': return '⭐';
        case 'normal': return '🏠';
        case 'low': return '✨';
        default: return '🏠';
      }
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'pending': return '⏳';
      case 'confirmed': return '📋';
      case 'in_progress': return '🔄';
      default: return '📋';
    }
  };
  
  const priorityIcon = getPriorityIcon(booking.priority || 'normal', booking.booking_type);
  const statusBadge = getStatusBadge(booking.status || 'pending');
  
  return {
    html: `
      <div class="fc-event-content-wrapper booking-${booking.booking_type} priority-${booking.priority}" 
           style="background-color: ${eventColor}; border-color: ${borderColor}; color: ${textColor};">
        <div class="fc-event-title">
          ${priorityIcon} ${property?.name || 'Property'}
        </div>
        <div class="fc-event-subtitle">
          ${statusBadge} ${booking.status.toUpperCase()}
          ${booking.guest_count ? ` • ${booking.guest_count}👥` : ''}
        </div>
      </div>
    `
  };
};


// Programmatic calendar methods with enhanced safety checks
const goToDate = (date: string | Date): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi && typeof calendarApi.gotoDate === 'function') {
      calendarApi.gotoDate(date);
    }
  } catch (error) {
    console.warn('Error going to date:', error);
  }
};

const changeView = (viewName: string): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi && typeof calendarApi.changeView === 'function') {
      calendarApi.changeView(viewName);
    }
  } catch (error) {
    console.warn('Error changing view:', error);
  }
};

const refreshEvents = (): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi && typeof calendarApi.refetchEvents === 'function') {
      calendarApi.refetchEvents();
    }
  } catch (error) {
    console.warn('Error refreshing events:', error);
  }
};

// Watch for theme changes and update calendar
watch(() => theme.global.current.value.dark, () => {
  refreshEvents();
});

// Watch for changes in props from Home
watch(() => props.bookings, (newBookings, oldBookings) => {
  console.log('🔍 [FullCalendar] Bookings prop changed:', {
    newSize: newBookings.size,
    oldSize: oldBookings?.size || 0,
    newBookingIds: Array.from(newBookings.keys()),
    newBookings: Array.from(newBookings.values()).map(b => ({
      id: b.id,
      property_id: b.property_id,
      owner_id: b.owner_id,
        checkin_date: b.checkin_date,
      checkout_date: b.checkout_date
    }))
  });
  
  // Log receiving updated bookings from Home
  eventLogger.logEvent(
    'Home',
    'FullCalendar',
    'bookingsUpdate',
    { count: newBookings.size },
    'receive'
  );
  
  // FullCalendar will automatically update with the new events
  // Reattach more link listeners after events update
  setTimeout(() => {
    attachMoreLinkListeners();
  }, 200);
}, { immediate: true }); // Removed deep: true to prevent excessive re-runs


// Day view bottom sheet event handlers
const handleViewBooking = (booking: Booking): void => {
  // Close the bottom sheet first
  dayViewVisible.value = false;
  
  // Find the FullCalendar event and trigger click
  const calendarApi = calendarRef.value?.getApi();
  if (calendarApi) {
    const event = calendarApi.getEventById(booking.id);
    if (event) {
      // Simulate event click
      const clickInfo = {
        event: event,
        jsEvent: new MouseEvent('click'),
        view: calendarApi.view,
        el: document.createElement('div') // Provide a dummy element
      };
      handleEventClick(clickInfo as EventClickArg);
    }
  }
  
  console.log('👁️ [FullCalendar] View booking from day view:', booking.id);
};

const handleEditBooking = (booking: Booking): void => {
  // Close the bottom sheet and emit edit event
  dayViewVisible.value = false;
  
  // Emit edit event (can be handled by parent)
  emit('eventClick', {
    event: {
      id: booking.id,
      extendedProps: { booking, isEdit: true }
    }
  } as unknown as EventClickArg);
  
  console.log('✏️ [FullCalendar] Edit booking from day view:', booking.id);
};

const handleCompleteBooking = (booking: Booking): void => {
  // Update booking status and emit event
  
  emit('updateBooking', {
    id: booking.id,
    start: booking.checkout_date,
    end: booking.checkin_date
  });
  
  console.log('✅ [FullCalendar] Complete booking from day view:', booking.id);
};

const handleAddBookingFromDayView = (date: Date): void => {
  // Close the bottom sheet
  dayViewVisible.value = false;
  
  // Create date strings for the selected date
  const startStr = date.toISOString().split('T')[0];
  const endDate = new Date(date);
  endDate.setDate(endDate.getDate() + 1);
  const endStr = endDate.toISOString().split('T')[0];
  
  // Emit create booking event
  emit('createBooking', {
    start: startStr,
    end: endStr
  });
  
  console.log('➕ [FullCalendar] Add booking from day view for date:', startStr);
};

// Add new handler function after the other event handlers
const handleLoading = (isLoading: boolean): void => {
  // You can emit an event or handle loading state changes here
  console.log('Calendar loading state:', isLoading);
  
  // Log loading state
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'loadingState',
    { isLoading },
    'emit'
  );
};

// Calendar mount handlers to manually attach more link listeners
const handleCalendarMount = (): void => {
  attachMoreLinkListeners();
};

const handleViewMount = (): void => {
  // Reattach listeners when view changes (month/week/day)
  setTimeout(() => {
    attachMoreLinkListeners();
  }, 100);
};

// Manually attach click listeners to more links
const attachMoreLinkListeners = (): void => {
  if (!calendarRef.value) return;
  
  try {
    const calendarApi = calendarRef.value.getApi();
    if (!calendarApi) return;
    
    const calendarEl = calendarRef.value.$el || calendarApi.el;
    if (!calendarEl) return;
  
    // Find all "+N more" links
    const moreLinks = calendarEl.querySelectorAll('.fc-more-link');
    
    moreLinks.forEach((link: Element) => {
      // Remove existing listeners to prevent duplicates
      link.removeEventListener('click', handleManualMoreLinkClick);
      link.removeEventListener('mousedown', handleManualMoreLinkClick);
      link.removeEventListener('touchstart', handleManualMoreLinkClick);
      
      // Add our custom click handlers with high priority (capture phase)
      link.addEventListener('click', handleManualMoreLinkClick, true);
      link.addEventListener('mousedown', handleManualMoreLinkClick, true);
      link.addEventListener('touchstart', handleManualMoreLinkClick, { passive: false, capture: true });
    });
    
    console.log('📎 [FullCalendar] Attached listeners to', moreLinks.length, 'more links');
  } catch (error) {
    console.warn('Error attaching more link listeners:', error);
  }
};

// Manual more link click handler
const handleManualMoreLinkClick = (event: Event): void => {
  // Aggressively prevent all default behaviors
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  
  const linkElement = event.currentTarget as HTMLElement;
  
  // Hide any existing popovers immediately
  const existingPopovers = document.querySelectorAll('.fc-popover, .fc-more-popover');
  existingPopovers.forEach(popover => {
    (popover as HTMLElement).style.display = 'none';
    popover.remove();
  });
  
  // Find the day cell that contains this more link
  const dayCell = linkElement.closest('.fc-daygrid-day') as HTMLElement;
  if (!dayCell) {
    console.error('Could not find day cell for more link');
    return;
  }
  
  // Get the date from the day cell - try multiple approaches
  let dateAttr = dayCell.getAttribute('data-date');
  
  // Fallback: try to get from aria-label or other attributes
  if (!dateAttr) {
    dateAttr = dayCell.getAttribute('aria-label');
  }
  
  // Another fallback: try to get from the day number element
  if (!dateAttr) {
    const dayNumber = dayCell.querySelector('.fc-daygrid-day-number');
    if (dayNumber) {
      const dayText = dayNumber.textContent?.trim();
      if (dayText) {
        // Get current month/year from calendar API
        const calendarApi = calendarRef.value?.getApi();
        if (calendarApi) {
          const currentView = calendarApi.view;
          const currentDate = currentView.currentStart;
          const year = currentDate.getFullYear();
          const month = currentDate.getMonth();
          const day = parseInt(dayText);
          
          // Create proper date string
          const date = new Date(year, month, day);
          dateAttr = date.toISOString().split('T')[0];
        }
      }
    }
  }
  
  if (!dateAttr) {
    console.error('Could not extract date from day cell');
    return;
  }
  
  // Fix timezone issue by parsing date components manually
  const [year, month, day] = dateAttr.split('-').map(Number);
  const clickedDate = new Date(year, month - 1, day); // month is 0-indexed in JS Date
  const currentUserId = authStore.user?.id;
  
  // Debug logging
  console.log('📅 [FullCalendar] Debug info:', {
    linkElement,
    dayCell,
    dateAttr,
    clickedDate: clickedDate.toDateString(),
    iso: clickedDate.toISOString()
  });
  
  // Filter bookings for this date (same logic as before)
  const clickedDateStr = clickedDate.toDateString();
  const dayBookings: Booking[] = [];
  
  Array.from(props.bookings.values()).forEach(booking => {
    const checkoutDate = new Date(booking.checkout_date);
    const checkinDate = new Date(booking.checkin_date);
    
    // Check if the clicked date falls within the booking period
    const bookingStartsOnDate = checkoutDate.toDateString() === clickedDateStr;
    const bookingSpansDate = clickedDate >= checkoutDate && clickedDate < checkinDate;
    
    const dateMatches = bookingStartsOnDate || bookingSpansDate;
    const ownerMatches = !currentUserId || booking.owner_id === currentUserId;
    
    if (dateMatches && ownerMatches) {
      dayBookings.push(booking);
    }
  });
  
  // Set state and open bottom sheet
  selectedDate.value = clickedDate;
  selectedDayBookings.value = dayBookings;
  dayViewVisible.value = true;
  
  console.log('📅 [FullCalendar] Manual more link clicked for date:', clickedDate.toDateString(), 'with', dayBookings.length, 'owner bookings');
};

// Lifecycle hooks for mobile viewport management
onMounted(() => {
  // Set up viewport resize listener for mobile
  cleanupViewportListener = handleViewportResize(() => {
    mobileOptions.value = getMobileCalendarOptions();
  });
});

onBeforeUnmount(() => {
  // Clean up calendar instance before component unmounts
  if (calendarRef.value) {
    try {
      const calendarApi = calendarRef.value.getApi();
      if (calendarApi && typeof calendarApi.destroy === 'function') {
        calendarApi.destroy();
      }
    } catch (error) {
      console.warn('Calendar cleanup error in beforeUnmount:', error);
    } finally {
      // Clear the ref to prevent further access
      calendarRef.value = null;
    }
  }
  
  // Clean up viewport listener early
  if (cleanupViewportListener) {
    cleanupViewportListener();
    cleanupViewportListener = null;
  }
});

onUnmounted(() => {
  // Ensure everything is cleaned up
  if (calendarRef.value) {
    calendarRef.value = null;
  }
  if (cleanupViewportListener) {
    cleanupViewportListener();
    cleanupViewportListener = null;
  }
});

// Expose methods to parent
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi: () => {
    if (!calendarRef.value) return null;
    
    try {
      return calendarRef.value.getApi() || null;
    } catch (error) {
      console.warn('Error getting calendar API:', error);
      return null;
    }
  }
});
</script>

<style scoped>
.calendar-container {
  height: 100%;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.custom-calendar {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  flex: 1;
  min-height: 0;
}

.custom-calendar {
  --fc-border-color: rgb(var(--v-theme-on-surface), 0.12);
  --fc-button-bg-color: rgb(var(--v-theme-primary));
  --fc-button-border-color: rgb(var(--v-theme-primary));
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
}

/* Turn booking highlighting */
.fc-event.booking-turn {
  font-weight: bold;
  border-width: 3px !important;
  animation: pulse 2s infinite;
  position: relative;
}

.fc-event.booking-turn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(45deg, #ff0000, #ff6600, #ff0000);
  border-radius: 2px 2px 0 0;
}

/* Standard booking styling */
.fc-event.booking-standard {
  border-width: 2px !important;
  position: relative;
}

.fc-event.booking-standard::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(45deg, currentColor, transparent, currentColor);
  border-radius: 2px 2px 0 0;
}

/* Add elevation to all booking events */
:deep(.fc-event) {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06) !important;
  transition: all 0.2s ease !important;
  border-radius: 4px !important;
}

/* Remove any color overrides and use higher specificity */
:deep(.fc-daygrid-event.fc-event) {
  background-color: inherit !important;
  border-color: inherit !important;
  color: #ffffff !important;
}

/* Force specific type and priority combinations with higher specificity */
:deep(.fc-daygrid-event.fc-event.type-turn-urgent),
:deep(.fc-timegrid-event.fc-event.type-turn-urgent) {
  background-color: #475569 !important;
  border-color: #334155 !important;
  color: #ffffff !important;
}

:deep(.fc-daygrid-event.fc-event.type-turn-high),
:deep(.fc-timegrid-event.fc-event.type-turn-high) {
  background-color: #64748b !important;
  border-color: #475569 !important;
  color: #ffffff !important;
}

:deep(.fc-daygrid-event.fc-event.type-turn-normal),
:deep(.fc-timegrid-event.fc-event.type-turn-normal) {
  background-color: #78716c !important;
  border-color: #57534e !important;
  color: #ffffff !important;
}

:deep(.fc-daygrid-event.fc-event.type-turn-low),
:deep(.fc-timegrid-event.fc-event.type-turn-low) {
  background-color: #9ca3af !important;
  border-color: #6b7280 !important;
  color: #ffffff !important;
}

:deep(.fc-daygrid-event.fc-event.type-standard-urgent),
:deep(.fc-timegrid-event.fc-event.type-standard-urgent) {
  background-color: #6366f1 !important;
  border-color: #4f46e5 !important;
  color: #ffffff !important;
}

:deep(.fc-daygrid-event.fc-event.type-standard-high),
:deep(.fc-timegrid-event.fc-event.type-standard-high) {
  background-color: #8b5cf6 !important;
  border-color: #7c3aed !important;
  color: #ffffff !important;
}

:deep(.fc-daygrid-event.fc-event.type-standard-normal),
:deep(.fc-timegrid-event.fc-event.type-standard-normal) {
  background-color: #06b6d4 !important;
  border-color: #0891b2 !important;
  color: #ffffff !important;
}

:deep(.fc-daygrid-event.fc-event.type-standard-low),
:deep(.fc-timegrid-event.fc-event.type-standard-low) {
  background-color: #10b981 !important;
  border-color: #059669 !important;
  color: #ffffff !important;
}

/* Additional fallback based on priority class */
:deep(.fc-event.priority-urgent) {
  background-color: #475569 !important;
  border-color: #334155 !important;
}

:deep(.fc-event.priority-high) {
  background-color: #64748b !important;
  border-color: #475569 !important;
}

:deep(.fc-event.priority-normal) {
  background-color: #78716c !important;
  border-color: #57534e !important;
}

:deep(.fc-event.priority-low) {
  background-color: #9ca3af !important;
  border-color: #6b7280 !important;
}

:deep(.fc-event:hover) {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-1px) !important;
  cursor: grab !important;
}

:deep(.fc-event:active) {
  cursor: grabbing !important;
}

/* Drag feedback */
:deep(.fc-event-dragging) {
  opacity: 0.75 !important;
  transform: rotate(2deg) !important;
  z-index: 999 !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3) !important;
}

:deep(.fc-event-mirror) {
  opacity: 0.8 !important;
  transform: rotate(-2deg) !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2) !important;
}

/* Drop zone feedback */
:deep(.fc-daygrid-day.fc-day-today) {
  background-color: rgba(var(--v-theme-primary), 0.05) !important;
}

:deep(.fc-daygrid-day:hover) {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
}

/* Resize handles */
:deep(.fc-event-resizer) {
  background-color: rgba(255, 255, 255, 0.8) !important;
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  border-radius: 2px !important;
}

:deep(.fc-event-resizer:hover) {
  background-color: rgba(255, 255, 255, 1) !important;
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(var(--v-theme-error), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0); }
}

/* Status-based styling */
.fc-event.status-pending {
  opacity: 0.8;
}

.fc-event.status-completed {
  opacity: 0.6;
  text-decoration: line-through;
}


/* Custom event content */
.fc-event-content-wrapper {
  padding: 2px;
}

.fc-event-subtitle {
  font-size: 0.75em;
  opacity: 0.9;
  margin-top: 1px;
}

/* Force hide any FullCalendar popovers/tooltips */
:deep(.fc-popover),
:deep(.fc-more-popover),
:deep(.fc-popover-header),
:deep(.fc-popover-body),
:deep(.fc-popover-close) {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* Remove unnecessary padding and dead space */
:deep(.fc-header-toolbar) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc .fc-col-header-cell-cushion) {
  padding: 2px 4px !important;
  margin: 0 !important;
}

:deep(.fc-col-header) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc-col-header-cell) {
  padding: 2px !important;
  margin: 0 !important;
  border: none !important;
}

:deep(.fc-view) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc-view-harness) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.fc-daygrid-header) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc-daygrid-body) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.fc-scrollgrid) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc-scrollgrid-section-header) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc-scrollgrid-section-body) {
  margin: 0 !important;
  padding: 0 !important;
}

/* Remove any container spacing */
:deep(.fc) {
  margin: 0 !important;
  padding: 0 !important;
}

/* Ensure day cells have minimal padding */
:deep(.fc-daygrid-day-frame) {
  padding: 1px !important;
  margin: 0 !important;
}

:deep(.fc-daygrid-day) {
  padding: 0 !important;
  margin: 0 !important;
}

/* Remove any table spacing */
:deep(.fc table) {
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}

:deep(.fc td),
:deep(.fc th) {
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

/* Mobile viewport specific fixes with proper height calculations */
@media (max-width: 959px) {
  .calendar-container {
    position: relative;
    /* Use calculated height instead of 100% */
    height: calc(100vh - 56px - 60px - env(safe-area-inset-top) - env(safe-area-inset-bottom) - 20px) !important;
    min-height: 400px; /* Minimum height for very small screens */
    max-height: calc(100vh - 100px); /* Maximum height to prevent overflow */
  }
  
  .custom-calendar {
    position: relative;
    height: 100% !important;
    width: 100% !important;
  }
  
  /* Ensure FullCalendar takes full available space on mobile */
  :deep(.fc) {
    height: 100% !important;
    width: 100% !important;
  }
  
  :deep(.fc-view-harness) {
    height: 100% !important;
    width: 100% !important;
  }
  
  :deep(.fc-scroller) {
    height: 100% !important;
    overflow-y: auto !important;
    /* Smooth scrolling on mobile */
    -webkit-overflow-scrolling: touch;
  }
  
  /* Fix for mobile browser address bar height changes */
  :deep(.fc-daygrid-body) {
    min-height: 300px; /* Ensure minimum content height */
  }
  
  /* Prevent horizontal scrolling on mobile */
  :deep(.fc-daygrid-day-frame) {
    min-height: 40px;
  }
  
  /* Mobile-optimized event spacing */
  :deep(.fc-event) {
    margin: 1px 0;
    font-size: 0.75rem;
  }
}

/* Desktop-specific booking size optimization */
@media (min-width: 960px) {
  :deep(.fc-event) {
    font-size: 0.75rem !important;
    min-height: 22px !important;
    padding: 2px 4px !important;
    margin: 1px 0 !important;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.75rem !important;
    line-height: 1.1 !important;
  }
  
  :deep(.fc-event-subtitle) {
    font-size: 0.65rem !important;
    line-height: 1 !important;
  }
  
  :deep(.fc-daygrid-day-frame) {
    min-height: 120px !important;
  }
}
</style> 