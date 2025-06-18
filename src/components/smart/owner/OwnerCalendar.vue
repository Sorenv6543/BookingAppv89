<template>
  <div class="owner-calendar-container">
    <!-- Owner Calendar Controls Integration -->
    <OwnerCalendarControls
      :current-date="currentDate"
      :view="currentView"
      :properties="myPropertyOptions"
      :loading="loading"
      class="mb-4"
      @navigation="handleCalendarNavigation"
      @view-change="handleViewChange"
      @property-filter="handlePropertyFilter"
      @booking-type-filter="handleBookingTypeFilter"
      @quick-action="handleQuickAction"
    />

    <!-- FullCalendar Component -->
    <v-card
      elevation="2"
      class="owner-calendar-card"
      :style="{ 
        height: calendarCardHeight,
        minHeight: mobile ? '400px' : '600px',
        maxHeight: mobile ? '70vh' : '80vh'
      }"
    >
      <div
        v-if="!isMounted || loading"
        class="calendar-loading d-flex flex-column align-center justify-center"
        :style="{ height: '400px' }"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-center mt-4">
          Loading your calendar...
        </p>
      </div>
      <FullCalendar
        v-else
        ref="calendarRef"
        :options="ownerCalendarOptions"
        class="owner-calendar"
        :style="{ 
          height: fullCalendarHeight,
          minHeight: mobile ? '350px' : '550px'
        }"
      />
    </v-card>

    <!-- Owner Turn Alerts (if any) -->
    <v-card
      v-if="myTurnAlerts.length > 0"
      class="mt-4"
      color="error"
      variant="tonal"
    >
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-alert</v-icon>
        Urgent Turn Cleanings Today
      </v-card-title>
      <v-card-text>
        <div
          v-for="alert in myTurnAlerts"
          :key="alert.id"
          class="mb-2 d-flex align-center justify-space-between"
        >
          <div>
            <strong>{{ getPropertyName(alert.property_id) }}</strong>
            <br>
            <small>{{ alert.timeUntilCheckout }}</small>
          </div>
          <v-btn
            color="error"
            variant="elevated"
            size="small"
            @click="handleTurnAlertClick(alert)"
          >
            View Details
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import { useTheme, useDisplay } from 'vuetify';

// Import Owner Components and Composables
import OwnerCalendarControls from '@/components/dumb/owner/OwnerCalendarControls.vue';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';
import { useOwnerCalendarState } from '@/composables/owner/useOwnerCalendarState';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
import { useUIStore } from '@/stores/ui';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';

interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'viewChange', view: string): void;
  (e: 'dateChange', date: Date): void;
  (e: 'bookingUpdate', data: { id: string; updates: any }): void;
}

const emit = defineEmits<Emits>();

// Composables and Stores
const theme = useTheme();
const { mobile } = useDisplay();
const uiStore = useUIStore();

// Owner-specific composables
const ownerBookings = useOwnerBookings();
const ownerCalendarState = useOwnerCalendarState();
const ownerProperties = useOwnerProperties();

// Component state
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const isMounted = ref(false);
const currentView = ref<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
const currentDate = ref(new Date());

// Filtering state
const selectedPropertyId = ref<string | null>(null);
const selectedBookingType = ref<'all' | 'standard' | 'turn'>('all');

// Loading state
const loading = computed(() => {
  return ownerBookings.loading.value || ownerProperties.loading.value;
});

// Calendar dimensions
const calendarCardHeight = computed(() => {
  return mobile.value ? '70vh' : '80vh';
});

const fullCalendarHeight = computed(() => {
  return mobile.value ? 'calc(70vh - 48px)' : 'calc(80vh - 48px)';
});

// Owner-specific data with filtering
const myPropertyOptions = computed(() => {
  return ownerProperties.myProperties.value.map(property => ({
    id: property.id,
    name: property.name
  }));
});

const filteredOwnerBookings = computed(() => {
  let bookings = ownerBookings.myBookings.value;

  // Filter by property if selected
  if (selectedPropertyId.value) {
    bookings = bookings.filter(booking => booking.property_id === selectedPropertyId.value);
  }

  // Filter by booking type if selected
  if (selectedBookingType.value !== 'all') {
    bookings = bookings.filter(booking => booking.booking_type === selectedBookingType.value);
  }

  return bookings;
});

// Convert owner's filtered bookings to FullCalendar events
const ownerCalendarEvents = computed(() => {
  return filteredOwnerBookings.value.map(booking => {
    const property = ownerProperties.myProperties.value.find(p => p.id === booking.property_id);
    const isTurn = booking.booking_type === 'turn';
    
    return {
      id: booking.id,
      title: `${property?.name || 'My Property'}${isTurn ? ' 🔥 TURN' : ''}`,
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
        priority: booking.priority,
        guestCount: booking.guest_count,
        notes: booking.notes,
        isOwnerBooking: true,
        canEdit: true,
        canDelete: true
      },
      classNames: [
        `owner-booking-${booking.booking_type}`,
        `owner-status-${booking.status}`,
        `owner-priority-${booking.priority}`,
        isTurn ? 'owner-turn-event' : 'owner-standard-event'
      ].filter(Boolean)
    };
  });
});

// Get owner's turn alerts
const myTurnAlerts = computed(() => {
  return ownerCalendarState.myTurnAlerts.value;
});

// Owner-focused color system
const getOwnerEventColor = (booking: any): string => {
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

const getOwnerEventBorderColor = (booking: any): string => {
  if (booking.booking_type === 'turn') {
    return '#B71C1C'; // Dark red border for turns
  }
  return '#1976D2'; // Blue border for standard
};

const getOwnerEventTextColor = (booking: any): string => {
  return booking.status === 'completed' ? '#E0E0E0' : '#FFFFFF';
};

// Owner calendar configuration
const ownerCalendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
  // View settings
  initialView: currentView.value,
  headerToolbar: false, // We use OwnerCalendarControls
  
  // Event settings
  events: ownerCalendarEvents.value,
  eventDisplay: 'block',
  eventOverlap: false,
  eventResizableFromStart: false, // Simpler for owners
  
  // Interaction settings - owner-friendly
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
  snapDuration: '00:30:00',
  
  // Appearance
  height: 'auto',
  aspectRatio: mobile.value ? 1.2 : 1.8,
  
  // Custom styling based on theme
  themeSystem: 'standard',
  
  // Event handlers - owner-specific
  select: handleOwnerDateSelect,
  eventClick: handleOwnerEventClick,
  datesSet: handleDatesSet,
  
  // Custom rendering
  eventContent: renderOwnerEventContent,
  dayCellContent: renderOwnerDayCell,
  
  // Business hours
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0],
    startTime: '08:00',
    endTime: '18:00'
  },
  
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
  eventLogger.logEvent(
    'OwnerCalendar',
    'HomeOwner',
    'dateSelect',
    { start: selectInfo.startStr, end: selectInfo.endStr },
    'emit'
  );
  
  emit('dateSelect', selectInfo);
  
  // Open booking form for owner
  emit('createBooking', {
    start: selectInfo.startStr,
    end: selectInfo.endStr,
    propertyId: selectedPropertyId.value || undefined
  });
  
  selectInfo.view.calendar.unselect();
};

const handleOwnerEventClick = (clickInfo: EventClickArg): void => {
  const booking = clickInfo.event.extendedProps.booking;
  
  // Validate owner access
  if (!ownerCalendarState.validateOwnerBookingAccess(booking.id)) {
    uiStore.showError('You can only edit your own bookings');
    return;
  }
  
  eventLogger.logEvent(
    'OwnerCalendar',
    'HomeOwner',
    'eventClick',
    { id: clickInfo.event.id },
    'emit'
  );
  
  emit('eventClick', clickInfo);
};

// OwnerCalendarControls event handlers
const handleCalendarNavigation = (direction: 'prev' | 'next' | 'today'): void => {
  if (!calendarRef.value) return;
  
  const api = calendarRef.value.getApi();
  
  switch (direction) {
    case 'prev':
      api.prev();
      break;
    case 'next':
      api.next();
      break;
    case 'today':
      api.today();
      break;
  }
  
  currentDate.value = api.getDate();
  emit('dateChange', currentDate.value);
};

const handleViewChange = (view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'): void => {
  currentView.value = view;
  
  if (calendarRef.value) {
    calendarRef.value.getApi().changeView(view);
  }
  
  emit('viewChange', view);
};

const handlePropertyFilter = (propertyId: string | null): void => {
  selectedPropertyId.value = propertyId;
  
  eventLogger.logEvent(
    'OwnerCalendar',
    'OwnerCalendar',
    'propertyFilter',
    { propertyId },
    'emit'
  );
};

const handleBookingTypeFilter = (bookingType: 'all' | 'standard' | 'turn'): void => {
  selectedBookingType.value = bookingType;
  
  eventLogger.logEvent(
    'OwnerCalendar',
    'OwnerCalendar',
    'bookingTypeFilter',
    { bookingType },
    'internal'
  );
};

const handleQuickAction = (action: 'add-booking'): void => {
  if (action === 'add-booking') {
    if (ownerProperties.myProperties.value.length === 0) {
      uiStore.showError('You need to add a property before creating bookings');
      return;
    }
    
    // Open booking form
    emit('createBooking', {
      start: new Date().toISOString(),
      end: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    });
  }
};

const handleDatesSet = (dateInfo: any): void => {
  currentDate.value = new Date(dateInfo.start);
  emit('dateChange', currentDate.value);
};

const handleTurnAlertClick = (alert: any): void => {
  // Find the event and click it to open details
  const event = ownerCalendarEvents.value.find(e => e.id === alert.id);
  if (event && calendarRef.value) {
    const api = calendarRef.value.getApi();
    const fcEvent = api.getEventById(alert.id);
    if (fcEvent) {
      // Simulate event click
      emit('eventClick', {
        event: fcEvent,
        el: null,
        jsEvent: new MouseEvent('click'),
        view: api.view
      } as EventClickArg);
    }
  }
};

// Custom rendering functions
const renderOwnerEventContent = (eventInfo: any) => {
  const booking = eventInfo.event.extendedProps.booking;
  const property = eventInfo.event.extendedProps.property;
  const isTurn = booking.booking_type === 'turn';
  
  return {
    html: `
      <div class="owner-event-content">
        <div class="owner-event-title">
          ${isTurn ? '🔥 ' : '🏠 '}${property?.name || 'My Property'}
        </div>
        <div class="owner-event-details">
          ${booking.status.toUpperCase()}
          ${booking.guest_count ? ` • ${booking.guest_count} guests` : ''}
        </div>
        ${isTurn && booking.priority === 'urgent' ? '<div class="owner-turn-badge">URGENT</div>' : ''}
      </div>
    `
  };
};

const renderOwnerDayCell = (dayInfo: any) => {
  const dayBookings = filteredOwnerBookings.value.filter(booking => {
    const checkoutDate = new Date(booking.checkout_date).toDateString();
    const dayDate = dayInfo.date.toDateString();
    return checkoutDate === dayDate;
  });
  
  const turnCount = dayBookings.filter(b => b.booking_type === 'turn').length;
  const bookingCount = dayBookings.length;
  
  return {
    html: `
      <div class="owner-day-number">
        ${dayInfo.dayNumberText}
        ${turnCount > 0 ? `<span class="owner-turn-indicator">${turnCount}</span>` : ''}
        ${bookingCount > 0 && turnCount === 0 ? `<span class="owner-booking-indicator">${bookingCount}</span>` : ''}
      </div>
    `
  };
};

// Utility functions
const getPropertyName = (propertyId: string): string => {
  const property = ownerProperties.myProperties.value.find(p => p.id === propertyId);
  return property?.name || 'Unknown Property';
};

// Programmatic methods
const goToDate = (date: string | Date): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().gotoDate(date);
    currentDate.value = new Date(date);
  }
};

const changeView = (viewName: string): void => {
  handleViewChange(viewName as any);
};

const refreshEvents = (): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().refetchEvents();
  }
};

// Lifecycle
onMounted(async () => {
  // Fetch owner's data
  await Promise.all([
    ownerBookings.fetchMyBookings(),
    ownerProperties.fetchMyProperties()
  ]);
  
  isMounted.value = true;
  
  await nextTick();
  refreshEvents();
});

// Watch for theme changes
watch(() => theme.global.current.value.dark, () => {
  nextTick(() => refreshEvents());
});

// Watch for data changes
watch(() => ownerBookings.myBookings.value, () => {
  nextTick(() => refreshEvents());
}, { deep: true });

// Expose methods to parent
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

.owner-calendar-card {
  overflow: hidden;
}

.calendar-loading {
  height: 100%;
  min-height: 400px;
}

.owner-calendar {
  --fc-border-color: rgb(var(--v-theme-on-surface), 0.12);
  --fc-button-bg-color: rgb(var(--v-theme-primary));
  --fc-button-border-color: rgb(var(--v-theme-primary));
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
  --fc-page-bg-color: rgb(var(--v-theme-surface));
  --fc-neutral-bg-color: rgb(var(--v-theme-surface-variant), 0.3);
  --fc-neutral-text-color: rgb(var(--v-theme-on-surface));
  --fc-list-event-hover-bg-color: rgb(var(--v-theme-surface-variant), 0.5);
}

/* Owner-specific turn booking highlighting */
.fc-event.owner-turn-event {
  font-weight: bold;
  border-width: 2px !important;
  position: relative;
}

.fc-event.owner-turn-event.owner-priority-urgent {
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
}

.fc-event.owner-status-completed .fc-event-title {
  text-decoration: line-through;
}

/* Owner-specific priority indicators */
.fc-event.owner-priority-urgent {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}

.fc-event.owner-priority-high {
  border-left: 3px solid rgb(var(--v-theme-warning)) !important;
}

/* Owner-specific day cell indicators */
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
  font-size: 0.9em;
}

.owner-event-title {
  font-weight: 600;
  font-size: 0.85em;
  line-height: 1.2;
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
  flex-wrap: wrap;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .owner-calendar {
    --fc-daygrid-event-dot-width: 6px;
  }
  
  .owner-event-content {
    font-size: 0.8em;
  }
  
  .owner-event-title {
    font-size: 0.8em;
  }
  
  .owner-event-details {
    font-size: 0.7em;
  }
  
  .owner-turn-badge {
    font-size: 0.65em;
  }
  
  .owner-turn-indicator,
  .owner-booking-indicator {
    font-size: 9px;
    padding: 1px 3px;
  }
}

@media (max-width: 600px) {
  .owner-calendar {
    --fc-daygrid-event-dot-width: 5px;
  }
  
  .owner-event-content {
    font-size: 0.75em;
  }
  
  .owner-event-title {
    font-size: 0.75em;
  }
  
  .owner-event-details {
    font-size: 0.65em;
  }
}

/* Dark theme adjustments */
.v-theme--dark .owner-calendar {
  --fc-page-bg-color: rgb(var(--v-theme-surface));
  --fc-neutral-bg-color: rgb(var(--v-theme-surface-bright));
  --fc-neutral-text-color: rgb(var(--v-theme-on-surface));
  --fc-list-event-hover-bg-color: rgb(var(--v-theme-surface-variant));
}
</style> 