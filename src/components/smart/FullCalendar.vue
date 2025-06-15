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
  return Array.from(props.bookings.values()).map(booking => {
    const property = props.properties.get(booking.property_id);
    const isTurn = booking.booking_type === 'turn';
    
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
        guestCount: booking.guest_count,
        notes: booking.notes
      },
      classNames: [
        `booking-${booking.booking_type}`,
        `status-${booking.status}`,
        isTurn ? 'priority-high' : 'priority-normal'
      ]
    };
  });
});

// Dynamic color system based on booking type and status
const getEventColor = (booking: Booking): string => {
  const isDark = theme.global.current.value.dark;
  
  if (booking.booking_type === 'turn') {
    switch (booking.status) {
      case 'pending': return isDark ? '#FF5252' : '#F44336';
      case 'scheduled': return isDark ? '#FF9800' : '#FF6F00';
      case 'in_progress': return isDark ? '#4CAF50' : '#2E7D32';
      case 'completed': return isDark ? '#9E9E9E' : '#616161';
      case 'cancelled': return isDark ? '#757575' : '#424242';
      default: return isDark ? '#FF5252' : '#F44336';
    }
  } else {
    switch (booking.status) {
      case 'pending': return isDark ? '#2196F3' : '#1976D2';
      case 'scheduled': return isDark ? '#00BCD4' : '#0097A7';
      case 'in_progress': return isDark ? '#4CAF50' : '#388E3C';
      case 'completed': return isDark ? '#9E9E9E' : '#757575';
      case 'cancelled': return isDark ? '#757575' : '#424242';
      default: return isDark ? '#2196F3' : '#1976D2';
    }
  }
};

const getEventBorderColor = (booking: Booking): string => {
  return booking.booking_type === 'turn' ? '#D32F2F' : '#1976D2';
};

const getEventTextColor = (booking: Booking): string => {
  // Use a lighter text color for completed bookings
  return booking.status === 'completed' ? '#E0E0E0' : '#FFFFFF';
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
  
  // Appearance
  height: 'auto',
  aspectRatio: 1.8,
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
  emit('updateBooking', {
    id: booking.id,
    start: dropInfo.event.startStr,
    end: dropInfo.event.endStr || dropInfo.event.startStr
  });
};

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
      end: resizeInfo.event.endStr 
    },
    'emit'
  );
  
  emit('updateBooking', {
    id: booking.id,
    start: resizeInfo.event.startStr,
    end: resizeInfo.event.endStr
  });
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
watch(() => props.bookings, (newBookings) => {
  // Log receiving updated bookings from Home
  eventLogger.logEvent(
    'Home',
    'FullCalendar',
    'bookingsUpdate',
    { count: newBookings.size },
    'receive'
  );
  
  // FullCalendar will automatically update with the new events
}, { deep: true });

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