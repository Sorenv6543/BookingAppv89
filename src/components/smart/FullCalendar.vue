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
      @delete-booking="handleDeleteBooking"
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
import type { DateClickArg } from '@fullcalendar/interaction';
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
  (e: 'deleteBooking', bookingId: string): void;
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
      start: booking.checkin_date,
      end: addOneDay(booking.checkout_date), // FullCalendar end is exclusive, so +1 to include checkout day
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

// Terminal Swiss color system
const getEventColor = (booking: Booking): string => {
  if (booking.booking_type === 'turn') {
    switch (booking.priority) {
      case 'urgent': return '#E53935'; // Red accent for urgent turns
      case 'high': return '#000000'; // Black for high priority turns
      case 'normal': return '#333333'; // Dark gray for normal turns
      case 'low': return '#777777'; // Gray for low priority turns
      default: return '#000000';
    }
  } else {
    switch (booking.priority) {
      case 'urgent': return '#E53935'; // Red accent for urgent standard
      case 'high': return '#000000'; // Black for high priority
      case 'normal': return '#E4E4E4'; // Light gray for normal
      case 'low': return '#DDDDDD'; // Lighter gray for low
      default: return '#E4E4E4';
    }
  }
};

const getEventBorderColor = (booking: Booking): string => {
  if (booking.booking_type === 'turn') {
    switch (booking.priority) {
      case 'urgent': return '#E53935';
      case 'high': return '#000000';
      case 'normal': return '#333333';
      case 'low': return '#777777';
      default: return '#000000';
    }
  } else {
    switch (booking.priority) {
      case 'urgent': return '#E53935';
      case 'high': return '#000000';
      case 'normal': return '#E4E4E4';
      case 'low': return '#DDDDDD';
      default: return '#E4E4E4';
    }
  }
};

const getEventTextColor = (booking: Booking): string => {
  // Terminal Swiss: dark text on light backgrounds, white on dark
  if (booking.booking_type === 'standard' && (booking.priority === 'normal' || booking.priority === 'low')) {
    return '#000000';
  }
  if (booking.status === 'completed') {
    return '#999999';
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
  dateClick: handleDateClick,
  
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

const handleDateClick = (arg: DateClickArg): void => {
  console.log('🗓️ [FullCalendar] Day clicked:', arg.dateStr);
  
  const clickedDate = arg.dateStr;
  const currentUserId = authStore.user?.id;
  const dayBookings = Array.from(props.bookings.values()).filter(booking => {
    const checkinDate = booking.checkin_date;
    const checkoutDate = booking.checkout_date;
    const dateMatches = clickedDate >= checkinDate && clickedDate < checkoutDate;
    const ownerMatches = !currentUserId || booking.owner_id === currentUserId;
    return dateMatches && ownerMatches;
  });
  
  // Only open bottom sheet if there are bookings for this date
  if (dayBookings.length === 0) {
    console.log('📅 [FullCalendar] No bookings for date:', clickedDate, '- skipping day view');
    return;
  }
  
  selectedDate.value = arg.date;
  selectedDayBookings.value = dayBookings;
  dayViewVisible.value = true;
  
  console.log('📅 [FullCalendar] Day view opened with', dayBookings.length, 'bookings for date:', clickedDate);
};



// Terminal Swiss event rendering - clean, no emojis, monospace status
const renderEventContent = (eventInfo: { event: { extendedProps: { booking: Booking; property: Property; eventColor?: string; borderColor?: string; textColor?: string }; backgroundColor?: string; borderColor?: string; textColor?: string } }) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const textColor = eventInfo.event.extendedProps.textColor || eventInfo.event.textColor || '#FFFFFF';

  // Status dot color based on Terminal Swiss status system
  const getStatusDotColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#E53935';
      case 'in_progress': return '#000000';
      case 'confirmed': return '#000000';
      case 'completed': return '#DDDDDD';
      default: return '#999999';
    }
  };

  const dotColor = getStatusDotColor(booking.status || 'pending');

  return {
    html: `
      <div class="fc-event-content-wrapper" style="color: ${textColor};">
        <div class="fc-event-title" style="font-family: Inter, sans-serif; font-weight: 500; font-size: 11px; line-height: 1.2;">
          <span class="status-dot" style="display: inline-block; width: 6px; height: 6px; background: ${dotColor}; margin-right: 4px; flex-shrink: 0;"></span>
          ${property?.name || 'Property'}
        </div>
        <div class="fc-event-subtitle" style="font-family: 'JetBrains Mono', monospace; font-weight: 400; font-size: 9px; opacity: 0.85; margin-top: 1px; padding-left: 10px;">
          ${booking.status.toUpperCase()}
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

const handleDeleteBooking = (booking: Booking): void => {
  dayViewVisible.value = false;
  emit('deleteBooking', booking.id);
  console.log('🗑️ [FullCalendar] Delete booking from day view:', booking.id);
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
  const clickedIso = clickedDate.toISOString().split('T')[0];
  const dayBookings: Booking[] = [];
  
  Array.from(props.bookings.values()).forEach(booking => {
    // Compare using ISO-only date strings to avoid timezone drift
    const checkin = booking.checkin_date;   // inclusive start
    const checkout = booking.checkout_date; // exclusive end
    const dateMatches = clickedIso >= checkin && clickedIso < checkout;
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
/* ================================================================ */
/* Terminal Swiss Design System - Calendar Styles                    */
/* Zero radius, no shadows, 1px borders, Inter + JetBrains Mono    */
/* ================================================================ */

.calendar-container {
  height: 100%;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
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
  --fc-border-color: #E4E4E4;
  --fc-button-bg-color: #000000;
  --fc-button-border-color: #000000;
  --fc-button-hover-bg-color: #333333;
  --fc-button-active-bg-color: #000000;
  --fc-today-bg-color: rgba(229, 57, 53, 0.06);
}

/* Terminal Swiss: All events have 0 border-radius, no shadows */
:deep(.fc-event) {
  box-shadow: none !important;
  border-radius: 0 !important;
  transition: opacity 0.15s !important;
  border-left: 3px solid #E53935 !important;
  font-family: 'Inter', sans-serif !important;
}

:deep(.fc-daygrid-event.fc-event) {
  background-color: inherit !important;
  border-color: inherit !important;
}

/* Turn booking - red left border */
:deep(.fc-event.booking-turn) {
  border-left: 3px solid #E53935 !important;
}

/* Standard booking - black left border */
:deep(.fc-event.booking-standard) {
  border-left: 3px solid #000000 !important;
}

/* Priority-based left border colors */
:deep(.fc-event.priority-urgent) {
  border-left: 3px solid #E53935 !important;
}

:deep(.fc-event.priority-high) {
  border-left: 3px solid #000000 !important;
}

:deep(.fc-event.priority-normal) {
  border-left: 3px solid #777777 !important;
}

:deep(.fc-event.priority-low) {
  border-left: 3px solid #DDDDDD !important;
}

/* Hover: subtle opacity change, no shadow */
:deep(.fc-event:hover) {
  opacity: 0.85 !important;
  cursor: grab !important;
  box-shadow: none !important;
  transform: none !important;
}

:deep(.fc-event:active) {
  cursor: grabbing !important;
}

/* Drag feedback - minimal */
:deep(.fc-event-dragging) {
  opacity: 0.7 !important;
  z-index: 999 !important;
  box-shadow: none !important;
  transform: none !important;
}

:deep(.fc-event-mirror) {
  opacity: 0.75 !important;
  box-shadow: none !important;
  transform: none !important;
}

/* Today highlight - subtle red accent */
:deep(.fc-daygrid-day.fc-day-today) {
  background-color: rgba(229, 57, 53, 0.06) !important;
}

:deep(.fc-daygrid-day:hover) {
  background-color: rgba(0, 0, 0, 0.03) !important;
}

/* Resize handles */
:deep(.fc-event-resizer) {
  background-color: #E53935 !important;
  border: none !important;
  border-radius: 0 !important;
  width: 4px !important;
}

/* Status-based styling */
:deep(.fc-event.status-completed) {
  opacity: 0.5;
}

/* Custom event content */
.fc-event-content-wrapper {
  padding: 2px 4px;
}

/* Force hide FullCalendar popovers */
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

/* Header toolbar - hidden (custom toolbar in OwnerCalendar) */
:deep(.fc-header-toolbar) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  display: none !important;
}

/* Column headers - Terminal Swiss black */
:deep(.fc-col-header-cell) {
  background: #000000 !important;
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

:deep(.fc .fc-col-header-cell-cushion) {
  color: #FFFFFF !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 500 !important;
  font-size: 11px !important;
  text-transform: uppercase !important;
  letter-spacing: 1px !important;
  padding: 8px 4px !important;
  margin: 0 !important;
  text-decoration: none !important;
}

:deep(.fc-col-header) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

/* Day numbers - JetBrains Mono */
:deep(.fc-daygrid-day-number) {
  font-family: 'JetBrains Mono', monospace !important;
  font-weight: 400 !important;
  font-size: 13px !important;
  color: #000000 !important;
  text-decoration: none !important;
  padding: 4px 8px !important;
}

:deep(.fc-daygrid-day.fc-day-today .fc-daygrid-day-number) {
  color: #E53935 !important;
  font-weight: 600 !important;
}

/* Grid structure - clean 1px borders */
:deep(.fc-view) {
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
}

:deep(.fc-view-harness) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.fc-scrollgrid) {
  margin: 0 !important;
  padding: 0 !important;
  border: 1px solid #E4E4E4 !important;
}

:deep(.fc-scrollgrid-section-header),
:deep(.fc-scrollgrid-section-body),
:deep(.fc-daygrid-header),
:deep(.fc-daygrid-body) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.fc) {
  margin: 0 !important;
  padding: 0 !important;
}

:deep(.fc-daygrid-day-frame) {
  padding: 1px !important;
  margin: 0 !important;
}

:deep(.fc-daygrid-day) {
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.fc table) {
  border-spacing: 0 !important;
  border-collapse: collapse !important;
}

:deep(.fc td),
:deep(.fc th) {
  padding: 0 !important;
  margin: 0 !important;
  border: 1px solid #E4E4E4 !important;
}

/* More link styling */
:deep(.fc-more-link) {
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 10px !important;
  color: #E53935 !important;
  font-weight: 500 !important;
}

/* Mobile viewport specific fixes */
@media (max-width: 959px) {
  .calendar-container {
    position: relative;
    height: calc(100vh - 48px - 56px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
    min-height: 400px;
    max-height: calc(100vh - 100px);
  }

  .custom-calendar {
    position: relative;
    height: 100% !important;
    width: 100% !important;
  }

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
    -webkit-overflow-scrolling: touch;
  }

  :deep(.fc-daygrid-body) {
    min-height: 300px;
  }

  :deep(.fc-daygrid-day-frame) {
    min-height: 40px;
  }

  :deep(.fc-event) {
    margin: 1px 0;
    font-size: 0.7rem;
  }
}

/* Desktop-specific */
@media (min-width: 960px) {
  :deep(.fc-event) {
    font-size: 0.75rem !important;
    min-height: 22px !important;
    padding: 2px 4px !important;
    margin: 1px 0 !important;
  }

  :deep(.fc-daygrid-day-frame) {
    min-height: 120px !important;
  }
}
</style> 