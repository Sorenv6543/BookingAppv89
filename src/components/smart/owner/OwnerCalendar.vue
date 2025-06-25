<template>
  <div class="owner-calendar-container">
    <v-card
      :style="{ height: calendarCardHeight }"
    >
      <FullCalendar
        ref="calendarRef"
        :options="ownerCalendarOptions"
        class="owner-calendar"
        :style="{ height: fullCalendarHeight }"
      />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg, EventApi, ViewApi, Duration } from '@fullcalendar/core';
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
  currentView?: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  currentDate?: Date;
}

interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'viewChange', view: string): void;
  (e: 'dateChange', date: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  currentView: 'timeGridWeek',
  currentDate: () => new Date()
});

const emit = defineEmits<Emits>();

// Theme integration
const theme = useTheme();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Convert owner's bookings Map to FullCalendar events
const ownerCalendarEvents = computed(() => {
  return Array.from(props.bookings.values()).map(booking => {
    const property = props.properties.get(booking.property_id);
    const isTurn = booking.booking_type === 'turn';
    
    return {
      id: booking.id,
      title: `${property?.name || 'My Property'} ${isTurn ? '🔥 TURN' : ''}`,
      start: booking.checkout_date,
      end: booking.checkin_date,
      backgroundColor: getOwnerEventColor(booking),
      borderColor: getOwnerEventBorderColor(booking),
      textColor: getOwnerEventTextColor(booking),
      extendedProps: {
        booking,
        property,
        bookingType: booking.booking_type,
        status: booking.status,
        guestCount: booking.guest_count,
        notes: booking.notes
      },
      classNames: [
        `owner-booking-${booking.booking_type}`,
        `owner-status-${booking.status}`,
        isTurn ? 'owner-priority-urgent' : 'owner-priority-normal'
      ]
    };
  });
});

// Owner-focused color system (simpler than admin version)
const getOwnerEventColor = (booking: Booking): string => {
  const isDark = theme.global.current.value.dark;
  
  if (booking.booking_type === 'turn') {
    // Turn bookings - urgent red/orange colors
    switch (booking.status) {
      case 'pending': return isDark ? '#FF5252' : '#F44336'; // Urgent red
      case 'scheduled': return isDark ? '#FF9800' : '#FF6F00'; // Warning orange
      case 'in_progress': return isDark ? '#4CAF50' : '#2E7D32'; // Success green
      case 'completed': return isDark ? '#9E9E9E' : '#616161'; // Muted gray
      default: return isDark ? '#FF5252' : '#F44336';
    }
  } else {
    // Standard bookings - calmer blue colors
    switch (booking.status) {
      case 'pending': return isDark ? '#2196F3' : '#1976D2'; // Primary blue
      case 'scheduled': return isDark ? '#00BCD4' : '#0097A7'; // Cyan
      case 'in_progress': return isDark ? '#4CAF50' : '#388E3C'; // Green
      case 'completed': return isDark ? '#9E9E9E' : '#757575'; // Gray
      default: return isDark ? '#2196F3' : '#1976D2';
    }
  }
};

const getOwnerEventBorderColor = (booking: Booking): string => {
  return booking.booking_type === 'turn' ? '#D32F2F' : '#1976D2';
};

const getOwnerEventTextColor = (booking: Booking): string => {
  return booking.status === 'completed' ? '#E0E0E0' : '#FFFFFF';
};

// Owner-focused calendar configuration (simplified)
const ownerCalendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
  // View settings - basic views only
  initialView: props.currentView,
  headerToolbar: false, // We'll handle toolbar externally
  
  // Event settings
  events: ownerCalendarEvents.value,
  eventDisplay: 'block',
  eventOverlap: false,
  
  // Owner interaction settings (simplified)
  selectable: true,
  selectMirror: true,
  editable: false, // No drag-and-drop for owners (admin feature)
  droppable: false, // No drag-to-assign (admin feature)
  
  // Date/time settings
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  slotDuration: '01:00:00',
  
  // Appearance - owner-friendly
  height: 'auto',
  aspectRatio: 1.8,
  
  // Custom styling based on theme
  themeSystem: 'standard',
  
  // Event handlers - owner-specific
  select: handleOwnerDateSelect,
  eventClick: handleOwnerEventClick,
  datesSet: handleDatesSet,
  
  // Loading state
  loading: handleLoading,
  
  // Custom rendering - owner-focused
  eventContent: renderOwnerEventContent,
  dayCellContent: renderOwnerDayCell,
  
  // Business hours
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

// Owner-specific event handlers
const handleOwnerDateSelect = (selectInfo: DateSelectArg): void => {
  // Log emitting event to HomeOwner
  eventLogger.logEvent(
    'OwnerCalendar',
    'HomeOwner',
    'dateSelect',
    { start: selectInfo.startStr, end: selectInfo.endStr },
    'emit'
  );
  
  emit('dateSelect', selectInfo);
  
  // Auto-create booking for owner
  emit('createBooking', {
    start: selectInfo.startStr,
    end: selectInfo.endStr
  });
  
  // Clear selection
  selectInfo.view.calendar.unselect();
};

const handleOwnerEventClick = (clickInfo: EventClickArg): void => {
  // Log emitting event to HomeOwner
  eventLogger.logEvent(
    'OwnerCalendar',
    'HomeOwner',
    'eventClick',
    { id: clickInfo.event.id },
    'emit'
  );
  
  emit('eventClick', clickInfo);
};

const handleDatesSet = (dateInfo: any): void => {
  // Handle view/date changes with debouncing to prevent duplicate events
  const newDate = new Date(dateInfo.start);
  
  // Only emit if date actually changed (prevents duplicate events)
  if (props.currentDate.toDateString() !== newDate.toDateString()) {
    eventLogger.logEvent(
      'OwnerCalendar',
      'HomeOwner',
      'dateChange',
      { date: newDate.toISOString() },
      'emit'
    );
    
    emit('dateChange', newDate);
  }
};

const handleLoading = (isLoading: boolean): void => {
  eventLogger.logEvent(
    'OwnerCalendar',
    'HomeOwner',
    'loadingState',
    { isLoading },
    'emit'
  );
};

// Owner-focused custom event rendering
const renderOwnerEventContent = (eventInfo: any) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const isTurn = booking.booking_type === 'turn';
  
  return {
    html: `
      <div class="owner-event-content">
        <div class="owner-event-title">
          ${isTurn ? '🔥 ' : ''}${property?.name || 'My Property'}
        </div>
        <div class="owner-event-details">
          ${booking.status.toUpperCase()}
          ${booking.guest_count ? ` • ${booking.guest_count} guests` : ''}
        </div>
        ${isTurn ? '<div class="owner-turn-badge">URGENT TURN</div>' : ''}
      </div>
    `
  };
};

// Owner-focused day cell rendering
const renderOwnerDayCell = (dayInfo: any) => {
  const dayBookings = Array.from(props.bookings.values())
    .filter(booking => {
      const checkoutDate = new Date(booking.checkout_date).toDateString();
      const dayDate = dayInfo.date.toDateString();
      return checkoutDate === dayDate;
    });
  
  const myTurnCount = dayBookings.filter(b => b.booking_type === 'turn').length;
  const myBookingCount = dayBookings.length;
  
  return {
    html: `
      <div class="owner-day-number">
        ${dayInfo.dayNumberText}
        ${myTurnCount > 0 ? `<span class="owner-turn-indicator">${myTurnCount}</span>` : ''}
        ${myBookingCount > 0 && myTurnCount === 0 ? `<span class="owner-booking-indicator">${myBookingCount}</span>` : ''}
      </div>
    `
  };
};
// Height calculations for responsive full-viewport calendar
const calendarCardHeight = computed(() => {
  // Calculate available height: viewport minus toolbar height (approx 120px)
  return 'calc(100vh - 180px)';
});

const fullCalendarHeight = computed(() => {
  // FullCalendar height should fill the card minus padding
  return 'calc(100vh - 200px)';
});
// Programmatic calendar methods for owner
const goToDate = (date: string | Date): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().gotoDate(date);
  }
};

const changeView = (viewName: string): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().changeView(viewName);
    
    eventLogger.logEvent(
      'OwnerCalendar',
      'HomeOwner',
      'viewChange',
      { view: viewName },
      'emit'
    );
    
    emit('viewChange', viewName);
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

// Watch for changes in props from HomeOwner
watch(() => props.bookings, (newBookings) => {
  // Log receiving updated bookings from HomeOwner
  eventLogger.logEvent(
    'HomeOwner',
    'OwnerCalendar',
    'bookingsUpdate',
    { count: newBookings.size },
    'receive'
  );
}, { deep: true });

// Watch for view changes from parent
watch(() => props.currentView, (newView) => {
  if (newView && calendarRef.value) {
    const currentCalendarView = calendarRef.value.getApi().view.type;
    if (currentCalendarView !== newView) {
      calendarRef.value.getApi().changeView(newView);
    }
  }
});

// Watch for date changes from parent (with infinite loop prevention)
watch(() => props.currentDate, (newDate) => {
  if (newDate && calendarRef.value) {
    const currentCalendarDate = calendarRef.value.getApi().getDate();
    const newDateStr = newDate.toDateString();
    const currentDateStr = currentCalendarDate.toDateString();
    
    // Only update if the date is actually different (prevents infinite loop)
    if (newDateStr !== currentDateStr) {
      calendarRef.value.getApi().gotoDate(newDate);
    }
  }
});

// Expose methods to parent (HomeOwner)
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi: () => calendarRef.value?.getApi()
});
</script>

<style scoped>
.owner-calendar-container {
  height: 100%;
  width: 100%;
}

.owner-calendar {
  --fc-border-color: rgb(var(--v-theme-on-surface), 0.12);
  --fc-button-bg-color: rgb(var(--v-theme-primary));
  --fc-button-border-color: rgb(var(--v-theme-primary));
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
}

/* Owner-specific turn booking highlighting */
.fc-event.owner-booking-turn {
  font-weight: bold;
  border-width: 2px !important;
  animation: owner-pulse 2s infinite;
}

@keyframes owner-pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.7); }
  70% { box-shadow: 0 0 0 8px rgba(var(--v-theme-error), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0); }
}

/* Owner-specific status styling */
.fc-event.owner-status-pending {
  opacity: 0.9;
}

.fc-event.owner-status-completed {
  opacity: 0.6;
  text-decoration: line-through;
}

.fc-event.owner-priority-urgent {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}

/* Owner-specific turn indicator in day cells */
.owner-turn-indicator {
  background: rgb(var(--v-theme-error));
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 10px;
  margin-left: 4px;
  font-weight: bold;
  animation: owner-pulse 2s infinite;
}

.owner-booking-indicator {
  background: rgb(var(--v-theme-primary));
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 10px;
  margin-left: 4px;
  font-weight: bold;
}

/* Owner-specific event content styling */
.owner-event-content {
  padding: 2px;
}

.owner-event-title {
  font-weight: 600;
  font-size: 0.85em;
}

.owner-event-details {
  font-size: 0.75em;
  opacity: 0.9;
  margin-top: 1px;
}

.owner-turn-badge {
  background: rgba(var(--v-theme-error), 0.2);
  color: rgb(var(--v-theme-error));
  font-size: 0.7em;
  padding: 1px 4px;
  border-radius: 4px;
  margin-top: 2px;
  font-weight: bold;
  text-align: center;
}

/* Owner-specific day cell styling */
.owner-day-number {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive adjustments for owner calendar */
@media (max-width: 768px) {
  .owner-event-title {
    font-size: 0.8em;
  }
  
  .owner-event-details {
    font-size: 0.7em;
  }
  
  .owner-turn-badge {
    font-size: 0.65em;
  }
}
</style> 