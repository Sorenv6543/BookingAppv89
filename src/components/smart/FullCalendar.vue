<template>
  <div class="calendar-container">
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      class="custom-calendar"
    />
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import type { Booking, Property } from '@/types';

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
  (e: 'eventResize', resizeInfo: any): void;
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

// Convert bookings Map to FullCalendar events
const calendarEvents = computed(() => {
  const bookingsArray = Array.from(props.bookings.values());
   
  const events = bookingsArray.map(booking => {
    const property = props.properties.get(booking.property_id);
    const isTurn = booking.booking_type === 'turn';
    const isUrgent = booking.priority === 'urgent';
    
    return {
      id: booking.id,
      title: `${property?.name || 'Unknown Property'} - ${isTurn ? 'TURN' : 'Standard'}`,
      start: booking.checkout_date,
      end: booking.checkin_date,
      backgroundColor: getEventColor(booking),
      borderColor: getEventBorderColor(booking),
      textColor: getEventTextColor(booking),
      extendedProps: {
        booking,
        property,
        bookingType: booking.booking_type,
        status: booking.status,
        priority: booking.priority,
        guestCount: booking.guest_count,
        notes: booking.notes
      },
      classNames: [
        `booking-${booking.booking_type}`,
        `status-${booking.status}`,
        `priority-${booking.priority}`,
        isTurn ? 'turn-booking-event' : 'standard-booking-event',
        isUrgent && isTurn ? 'turn-urgent-event' : '',
        isUrgent ? 'urgent-event' : ''
      ].filter(Boolean)
    };
  });
   
  return events;
});

// Enhanced dynamic color system based on booking priority instead of status
const getEventColor = (booking: Booking): string => {
  const isDark = theme.global.current.value.dark;
  
  if (booking.booking_type === 'turn') {
    switch (booking.priority) {
      case 'urgent':
        return isDark ? '#FF1744' : '#D32F2F'; // Bright red for urgent turns
      case 'high':
        return isDark ? '#FF6D00' : '#F57C00'; // Orange for high priority turns
      case 'normal':
        return isDark ? '#FF9800' : '#FF6F00'; // Amber for normal turns
      case 'low':
        return isDark ? '#FFC107' : '#FFA000'; // Yellow for low priority turns
      default:
        return isDark ? '#FF5252' : '#F44336';
    }
  } else {
    switch (booking.priority) {
      case 'urgent':
        return isDark ? '#FF9800' : '#FF6F00'; // Orange for urgent standard
      case 'high':
        return isDark ? '#2196F3' : '#1976D2'; // Blue for high priority standard
      case 'normal':
        return isDark ? '#00BCD4' : '#0097A7'; // Cyan for normal
      case 'low':
        return isDark ? '#4CAF50' : '#388E3C'; // Green for low priority
      default:
        return isDark ? '#2196F3' : '#1976D2';
    }
  }
};

const getEventBorderColor = (booking: Booking): string => {
  if (booking.booking_type === 'turn') {
    switch (booking.priority) {
      case 'urgent':
        return '#B71C1C'; // Dark red border for urgent turns
      case 'high':
        return '#E65100'; // Dark orange border for high priority turns
      case 'normal':
        return '#FF6F00'; // Orange border for normal turns
      case 'low':
        return '#F57F17'; // Dark yellow border for low priority turns
      default:
        return '#D32F2F';
    }
  } else {
    switch (booking.priority) {
      case 'urgent':
        return '#E65100'; // Dark orange border for urgent standard
      case 'high':
        return '#0D47A1'; // Dark blue border for high priority standard
      case 'normal':
        return '#006064'; // Dark cyan border for normal
      case 'low':
        return '#1B5E20'; // Dark green border for low priority
      default:
        return '#1976D2';
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

// Calendar configuration
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
  // View settings
  initialView: 'dayGridMonth',
  headerToolbar: false,
  
  
  // Event settings
  events: calendarEvents.value,
  eventDisplay: 'block',
  eventOverlap: false,
  eventResizableFromStart: true,
  
  // Interaction settings
  selectable: true,
  selectMirror: true,
  editable: true,
  droppable: true,
  
  // Date/time settings
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  slotDuration: '01:00:00',
  snapDuration: '00:30:00',
  
  // Appearance - Full viewport height
  height: '100%',
  aspectRatio: undefined, // Remove aspect ratio constraints for full height
  expandRows: true, // Make calendar rows expand to fill available height
  eventBackgroundColor: theme.global.current.value.colors.primary,
  eventBorderColor: theme.global.current.value.colors.primary,
  eventTextColor: '#FFFFFF',
  
  // Custom styling based on theme
  themeSystem: 'standard',
  
  // Event handlers
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventDrop: handleEventDrop,
  eventResize: handleEventResize,
  
  // Loading state
  loading: handleLoading,
  
  // Custom rendering
  eventContent: renderEventContent,
  dayCellContent: renderDayCell,
  
  // Business hours (optional)
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Monday - Sunday
    startTime: '08:00',
    endTime: '18:00'
  },
  
  // Weekend styling
  weekends: true,
  
  // Month view specific
  dayMaxEvents: 3,
  moreLinkClick: 'popover',
  
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
  // Removed duplicate updateBooking emit to prevent infinite loops
};

const handleEventResize = (resizeInfo: any): void => {
  const booking = (resizeInfo as { event: { extendedProps: { booking: Booking }; startStr: string; endStr: string } }).event.extendedProps.booking;
  
  // Log emitting event to Home
  eventLogger.logEvent(
    'FullCalendar',
    'Home',
    'eventResize',
    { 
      id: booking.id, 
      start: resizeInfo.event.startStr, 
      end: resizeInfo.event.endStr 
    },
    'emit'
  );
  
  emit('eventResize', resizeInfo);
  // Removed duplicate updateBooking emit to prevent infinite loops
};

// Custom event rendering
const renderEventContent = (eventInfo: any) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const isTurn = booking.booking_type === 'turn';
  
  return {
    html: `
      <div class="fc-event-content-wrapper">
        <div class="fc-event-title">
          ${isTurn ? '🔥 ' : ''}${property?.name || 'Property'}
        </div>
        <div class="fc-event-subtitle">
          ${booking.status.toUpperCase()}
          ${booking.guest_count ? ` • ${booking.guest_count} guests` : ''}
        </div>
      </div>
    `
  };
};

// Custom day cell rendering
const renderDayCell = (dayInfo: any) => {
  const dayBookings = Array.from(props.bookings.values())
    .filter(booking => {
      const checkoutDate = new Date(booking.checkout_date).toDateString();
      const dayDate = dayInfo.date.toDateString();
      return checkoutDate === dayDate;
    });
  
  const turnCount = dayBookings.filter(b => b.booking_type === 'turn').length;
  
  return {
    html: `
      <div class="fc-daygrid-day-number">
        ${dayInfo.dayNumberText}
        ${turnCount > 0 ? `<span class="turn-indicator">${turnCount}</span>` : ''}
      </div>
    `
  };
};

// Programmatic calendar methods
const goToDate = (date: string | Date): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().gotoDate(date);
  }
};

const changeView = (viewName: string): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().changeView(viewName);
  }
};

const refreshEvents = (): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().refetchEvents();
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
      checkout_date: b.checkout_date,
      checkin_date: b.checkin_date
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
}, { immediate: true }); // Removed deep: true to prevent excessive re-runs

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

// Expose methods to parent
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi: () => calendarRef.value?.getApi()
});
</script>

<style scoped>
.calendar-container {
  height: 100%;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
}

.custom-calendar {
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
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
  border-width: 2px !important;
  animation: pulse 2s infinite;
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

/* Turn indicator in day cells */
.turn-indicator {
  background: rgb(var(--v-theme-error));
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 10px;
  margin-left: 4px;
  font-weight: bold;
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
</style> 