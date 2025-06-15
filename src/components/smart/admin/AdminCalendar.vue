<template>
  <div class="admin-calendar-container">
    <!-- Advanced Admin Calendar Toolbar -->
    <v-card
      class="admin-calendar-toolbar mb-4"
      elevation="2"
    >
      <v-card-text class="pb-2">
        <v-row
          align="center"
          no-gutters
        >
          <!-- View Controls -->
          <v-col
            cols="12"
            md="3"
            class="mb-2 mb-md-0"
          >
            <v-btn-toggle
              v-model="currentView"
              mandatory
              variant="outlined"
              density="compact"
              class="admin-view-toggle"
            >
              <v-btn
                value="dayGridMonth"
                size="small"
              >
                Month
              </v-btn>
              <v-btn
                value="timeGridWeek"
                size="small"
              >
                Week
              </v-btn>
              <v-btn
                value="timeGridDay"
                size="small"
              >
                Day
              </v-btn>
              <v-btn
                value="listWeek"
                size="small"
              >
                List
              </v-btn>
            </v-btn-toggle>
          </v-col>

          <!-- Date Navigation -->
          <v-col
            cols="12"
            md="4"
            class="mb-2 mb-md-0"
          >
            <div class="d-flex align-center justify-center">
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                size="small"
                @click="navigateCalendar('prev')"
              />
              <v-btn
                variant="text"
                class="mx-2 admin-date-title"
                @click="goToToday"
              >
                {{ currentDateTitle }}
              </v-btn>
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                size="small"
                @click="navigateCalendar('next')"
              />
            </div>
          </v-col>

          <!-- Admin Filters -->
          <v-col
            cols="12"
            md="5"
          >
            <div class="d-flex align-center justify-end flex-wrap ga-2">
              <!-- Cleaner Filter -->
              <v-select
                v-model="selectedCleaner"
                :items="cleanerFilterOptions"
                item-title="name"
                item-value="id"
                label="Filter by Cleaner"
                density="compact"
                variant="outlined"
                style="min-width: 150px; max-width: 200px;"
                clearable
                hide-details
              />

              <!-- Status Filter -->
              <v-select
                v-model="selectedStatuses"
                :items="statusFilterOptions"
                item-title="label"
                item-value="value"
                label="Filter by Status"
                density="compact"
                variant="outlined"
                style="min-width: 150px; max-width: 200px;"
                multiple
                clearable
                hide-details
              />

              <!-- Booking Type Filter -->
              <v-select
                v-model="selectedBookingTypes"
                :items="bookingTypeOptions"
                item-title="label"
                item-value="value"
                label="Booking Type"
                density="compact"
                variant="outlined"
                style="min-width: 120px; max-width: 150px;"
                multiple
                clearable
                hide-details
              />

              <!-- Quick Actions -->
              <v-btn
                color="primary"
                variant="elevated"
                size="small"
                prepend-icon="mdi-plus"
                @click="createNewBooking"
              >
                New Booking
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- FullCalendar Component -->
    <v-card
      elevation="2"
      class="admin-calendar-card"
    >
      <FullCalendar
        ref="calendarRef"
        :options="adminCalendarOptions"
        class="admin-calendar"
      />
    </v-card>

    <!-- Context Menu -->
    <v-menu
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list density="compact">
        <v-list-item
          v-for="action in contextMenuActions"
          :key="action.key"
          :prepend-icon="action.icon"
          :title="action.title"
          @click="handleContextAction(action.key)"
        />
      </v-list>
    </v-menu>

    <!-- Cleaner Assignment Modal -->
    <v-dialog
      v-model="cleanerAssignmentModal.show"
      max-width="500"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6">Assign Cleaner</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="cleanerAssignmentModal.selectedCleaner"
            :items="availableCleaners"
            item-title="name"
            item-value="id"
            label="Select Cleaner"
            variant="outlined"
            :loading="cleanerAssignmentModal.loading"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-avatar size="32">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.raw.email }} • Max: {{ item.raw.max_daily_bookings || 'N/A' }} bookings/day
                </v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-select>
          <v-textarea
            v-model="cleanerAssignmentModal.notes"
            label="Assignment Notes (Optional)"
            variant="outlined"
            rows="3"
            class="mt-4"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="cleanerAssignmentModal.show = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :loading="cleanerAssignmentModal.loading"
            @click="assignCleanerToBooking"
          >
            Assign
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, ref, watch, nextTick } from 'vue';
import { useTheme } from 'vuetify';
import type { Booking, Property, User, Cleaner } from '@/types';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';

interface Props {
  bookings: Map<string, Booking>;
  properties: Map<string, Property>;
  users: Map<string, User>;
  loading?: boolean;
}

interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'eventDrop', dropInfo: EventDropArg): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'updateBooking', data: { id: string; updates: Partial<Booking> }): void;
  (e: 'assignCleaner', data: { bookingId: string; cleanerId: string; notes?: string }): void;
  (e: 'updateBookingStatus', data: { bookingId: string; status: Booking['status'] }): void;
  (e: 'viewChange', view: string): void;
  (e: 'dateChange', date: Date): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

// Theme integration
const theme = useTheme();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Admin calendar state
const currentView = ref<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('timeGridWeek');
const currentDateTitle = ref('');

// Admin filtering state
const selectedCleaner = ref<string | null>(null);
const selectedStatuses = ref<Booking['status'][]>([]);
const selectedBookingTypes = ref<Booking['booking_type'][]>([]);

// Context menu state
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  booking: null as Booking | null
});

// Cleaner assignment modal state
const cleanerAssignmentModal = ref({
  show: false,
  booking: null as Booking | null,
  selectedCleaner: null as string | null,
  notes: '',
  loading: false
});

// Get all cleaners from users Map
const availableCleaners = computed(() => {
  return Array.from(props.users.values())
    .filter(user => user.role === 'cleaner')
    .map(cleaner => ({
      id: cleaner.id,
      name: cleaner.name,
      email: cleaner.email,
      max_daily_bookings: (cleaner as Cleaner).max_daily_bookings || 5
    }));
});

// Filter options
const cleanerFilterOptions = computed(() => [
  { id: 'unassigned', name: 'Unassigned Only' },
  ...availableCleaners.value
]);

const statusFilterOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' }
];

const bookingTypeOptions = [
  { label: 'Turn Bookings', value: 'turn' },
  { label: 'Standard Bookings', value: 'standard' }
];

// Admin sees ALL bookings (no owner filtering)
const allBookings = computed(() => {
  return Array.from(props.bookings.values());
});

// Apply admin filters to bookings
const filteredBookings = computed(() => {
  let filtered = allBookings.value;

  // Filter by cleaner
  if (selectedCleaner.value) {
    if (selectedCleaner.value === 'unassigned') {
      filtered = filtered.filter(booking => !booking.assigned_cleaner_id);
    } else {
      filtered = filtered.filter(booking => booking.assigned_cleaner_id === selectedCleaner.value);
    }
  }

  // Filter by status
  if (selectedStatuses.value.length > 0) {
    filtered = filtered.filter(booking => selectedStatuses.value.includes(booking.status));
  }

  // Filter by booking type
  if (selectedBookingTypes.value.length > 0) {
    filtered = filtered.filter(booking => selectedBookingTypes.value.includes(booking.booking_type));
  }

  return filtered;
});

// Convert admin's filtered bookings to FullCalendar events
const adminCalendarEvents = computed(() => {
  return filteredBookings.value.map(booking => {
    const property = props.properties.get(booking.property_id);
    const owner = props.users.get(booking.owner_id);
    const cleaner = booking.assigned_cleaner_id ? props.users.get(booking.assigned_cleaner_id) : undefined;
    const isTurn = booking.booking_type === 'turn';
    
    return {
      id: booking.id,
      title: getAdminEventTitle(booking, property, owner, cleaner),
      start: booking.checkout_date,
      end: booking.checkin_date,
      backgroundColor: getAdminEventColor(booking),
      borderColor: getAdminEventBorderColor(booking),
      textColor: getAdminEventTextColor(booking),
      extendedProps: {
        booking,
        property,
        owner,
        cleaner,
        bookingType: booking.booking_type,
        status: booking.status,
        assignmentStatus: booking.assigned_cleaner_id ? 'assigned' : 'unassigned'
      },
      classNames: [
        `admin-booking-${booking.booking_type}`,
        `admin-status-${booking.status}`,
        `admin-assignment-${booking.assigned_cleaner_id ? 'assigned' : 'unassigned'}`,
        isTurn ? 'admin-priority-urgent' : 'admin-priority-normal'
      ]
    };
  });
});

// Admin-specific event title formatting
const getAdminEventTitle = (booking: Booking, property?: Property, owner?: User, cleaner?: User): string => {
  const isTurn = booking.booking_type === 'turn';
  const propertyName = property?.name || 'Unknown Property';
  const ownerName = owner?.name || 'Unknown Owner';
  const cleanerName = cleaner?.name || 'Unassigned';
  
  return `${isTurn ? '🔥 ' : ''}${propertyName} (${ownerName}) → ${cleanerName}`;
};

// Admin-specific color system based on assignment status and booking type
const getAdminEventColor = (booking: Booking): string => {
  const isDark = theme.global.current.value.dark;
  const isAssigned = !!booking.assigned_cleaner_id;
  const isTurn = booking.booking_type === 'turn';
  
  if (!isAssigned) {
    // Unassigned bookings - urgent colors
    return isTurn 
      ? (isDark ? '#FF5252' : '#F44336') // Urgent red for unassigned turns
      : (isDark ? '#FF9800' : '#FF6F00'); // Warning orange for unassigned standard
  }
  
  // Assigned bookings - status-based colors
  switch (booking.status) {
    case 'pending':
      return isDark ? '#2196F3' : '#1976D2'; // Blue - scheduled but not started
    case 'scheduled':
      return isDark ? '#00BCD4' : '#0097A7'; // Cyan - confirmed and ready
    case 'in_progress':
      return isDark ? '#4CAF50' : '#388E3C'; // Green - currently being cleaned
    case 'completed':
      return isDark ? '#9E9E9E' : '#757575'; // Gray - finished
    default:
      return isDark ? '#2196F3' : '#1976D2';
  }
};

const getAdminEventBorderColor = (booking: Booking): string => {
  const isTurn = booking.booking_type === 'turn';
  const isAssigned = !!booking.assigned_cleaner_id;
  
  if (isTurn && !isAssigned) return '#D32F2F'; // Urgent red border for unassigned turns
  if (isTurn) return '#FF6F00'; // Orange border for assigned turns
  if (!isAssigned) return '#F57C00'; // Orange border for unassigned standard
  return '#1976D2'; // Blue border for assigned standard
};

const getAdminEventTextColor = (booking: Booking): string => {
  return booking.status === 'completed' ? '#E0E0E0' : '#FFFFFF';
};

// Admin-focused calendar configuration with advanced features
const adminCalendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
  
  // View settings - all views available for admin
  initialView: currentView.value,
  headerToolbar: false, // We handle toolbar externally
  
  // Event settings
  events: adminCalendarEvents.value,
  eventDisplay: 'block',
  eventOverlap: true, // Allow overlapping for admin view
  
  // Admin interaction settings (full features)
  selectable: true,
  selectMirror: true,
  editable: true, // Enable drag-and-drop for admin
  droppable: true, // Enable drag-to-assign
  eventResizable: true, // Allow resizing events
  eventDurationEditable: true,
  
  // Date/time settings
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '05:00:00',
  slotMaxTime: '23:00:00',
  slotDuration: '00:30:00', // 30-minute slots for admin precision
  
  // Appearance - admin-focused
  height: 'auto',
  aspectRatio: 1.6,
  
  // Custom styling based on theme
  themeSystem: 'standard',
  
  // Event handlers - admin-specific
  select: handleAdminDateSelect,
  eventClick: handleAdminEventClick,
  eventDrop: handleAdminEventDrop,
  eventResize: handleAdminEventResize,
  datesSet: handleDatesSet,
  
  // Loading state
  loading: handleLoading,
  
  // Custom rendering - admin-focused
  eventContent: renderAdminEventContent,
  dayCellContent: renderAdminDayCell,
  
  // Business hours
  businessHours: {
    daysOfWeek: [1, 2, 3, 4, 5, 6, 0], // Monday - Sunday
    startTime: '06:00',
    endTime: '20:00'
  },
  
  // Weekend styling
  weekends: true,
  
  // Month view specific
  dayMaxEvents: 5, // Show more events for admin
  moreLinkClick: 'popover',
  
  // Week/day view specific
  allDaySlot: false,
  nowIndicator: true,
  scrollTime: '07:00:00',
  
  // List view specific
  listDayFormat: { weekday: 'long', month: 'short', day: 'numeric' },
  
  // Right-click context menu
  eventMouseEnter: (info) => {
    info.el.style.cursor = 'pointer';
  },
  
  // Custom event rendering for admin features
  eventDidMount: (info) => {
    // Add right-click context menu
    info.el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showContextMenu(e, info.event.extendedProps.booking);
    });
  }
}));

// Admin-specific event handlers
const handleAdminDateSelect = (selectInfo: DateSelectArg): void => {
  eventLogger.logEvent(
    'AdminCalendar',
    'HomeAdmin',
    'dateSelect',
    { start: selectInfo.startStr, end: selectInfo.endStr },
    'emit'
  );
  
  emit('dateSelect', selectInfo);
  emit('createBooking', {
    start: selectInfo.startStr,
    end: selectInfo.endStr
  });
  
  selectInfo.view.calendar.unselect();
};

const handleAdminEventClick = (clickInfo: EventClickArg): void => {
  eventLogger.logEvent(
    'AdminCalendar',
    'HomeAdmin',
    'eventClick',
    { id: clickInfo.event.id },
    'emit'
  );
  
  emit('eventClick', clickInfo);
};

const handleAdminEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  eventLogger.logEvent(
    'AdminCalendar',
    'HomeAdmin',
    'eventDrop',
    { 
      id: booking.id,
      newStart: dropInfo.event.startStr,
      newEnd: dropInfo.event.endStr
    },
    'emit'
  );
  
  emit('eventDrop', dropInfo);
  
  // Update booking dates
  emit('updateBooking', {
    id: booking.id,
    updates: {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    }
  });
};

const handleAdminEventResize = (resizeInfo: any): void => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  eventLogger.logEvent(
    'AdminCalendar',
    'HomeAdmin',
    'eventResize',
    { 
      id: booking.id,
      newEnd: resizeInfo.event.endStr
    },
    'emit'
  );
  
  // Update booking end date
  emit('updateBooking', {
    id: booking.id,
    updates: {
      checkin_date: resizeInfo.event.endStr
    }
  });
};

const handleDatesSet = (dateInfo: any): void => {
  const newDate = new Date(dateInfo.start);
  currentDateTitle.value = dateInfo.view.title;
  
  eventLogger.logEvent(
    'AdminCalendar',
    'HomeAdmin',
    'dateChange',
    { date: newDate.toISOString(), title: dateInfo.view.title },
    'emit'
  );
  
  emit('dateChange', newDate);
};

const handleLoading = (isLoading: boolean): void => {
  eventLogger.logEvent(
    'AdminCalendar',
    'HomeAdmin',
    'loadingState',
    { isLoading },
    'emit'
  );
};

// Context menu functionality
const showContextMenu = (event: MouseEvent, booking: Booking): void => {
  contextMenu.value = {
    show: true,
    x: event.clientX,
    y: event.clientY,
    booking
  };
};

const contextMenuActions = computed(() => {
  const booking = contextMenu.value.booking;
  if (!booking) return [];
  
  const actions = [
    { key: 'edit', title: 'Edit Booking', icon: 'mdi-pencil' },
    { key: 'assign', title: 'Assign Cleaner', icon: 'mdi-account-plus' },
    { key: 'status', title: 'Change Status', icon: 'mdi-check-circle' },
    { key: 'duplicate', title: 'Duplicate', icon: 'mdi-content-copy' },
    { key: 'delete', title: 'Delete', icon: 'mdi-delete' }
  ];
  
  // Add status-specific actions
  if (booking.status === 'pending') {
    actions.splice(2, 0, { key: 'schedule', title: 'Mark Scheduled', icon: 'mdi-calendar-check' });
  }
  
  if (booking.status === 'scheduled') {
    actions.splice(2, 0, { key: 'start', title: 'Start Cleaning', icon: 'mdi-play' });
  }
  
  if (booking.status === 'in_progress') {
    actions.splice(2, 0, { key: 'complete', title: 'Mark Complete', icon: 'mdi-check' });
  }
  
  return actions;
});

const handleContextAction = (action: string): void => {
  const booking = contextMenu.value.booking;
  if (!booking) return;
  
  contextMenu.value.show = false;
  
  switch (action) {
    case 'edit':
      emit('eventClick', { event: { id: booking.id, extendedProps: { booking } } } as any);
      break;
    case 'assign':
      openCleanerAssignmentModal(booking);
      break;
    case 'schedule':
      emit('updateBookingStatus', { bookingId: booking.id, status: 'scheduled' });
      break;
    case 'start':
      emit('updateBookingStatus', { bookingId: booking.id, status: 'in_progress' });
      break;
    case 'complete':
      emit('updateBookingStatus', { bookingId: booking.id, status: 'completed' });
      break;
    case 'status':
      // Open status change dialog (would need to be implemented)
      break;
    case 'duplicate':
      // Duplicate booking logic
      break;
    case 'delete':
      // Delete booking with confirmation
      break;
  }
};

// Cleaner assignment functionality
const openCleanerAssignmentModal = (booking: Booking): void => {
  cleanerAssignmentModal.value = {
    show: true,
    booking,
    selectedCleaner: booking.assigned_cleaner_id || null,
    notes: '',
    loading: false
  };
};

const assignCleanerToBooking = async (): Promise<void> => {
  const modal = cleanerAssignmentModal.value;
  if (!modal.booking || !modal.selectedCleaner) return;
  
  modal.loading = true;
  
  try {
    emit('assignCleaner', {
      bookingId: modal.booking.id,
      cleanerId: modal.selectedCleaner,
      notes: modal.notes
    });
    
    modal.show = false;
  } catch (error) {
    console.error('Failed to assign cleaner:', error);
  } finally {
    modal.loading = false;
  }
};

// Calendar navigation methods
const navigateCalendar = (direction: 'prev' | 'next'): void => {
  if (calendarRef.value) {
    const api = calendarRef.value.getApi();
    if (direction === 'prev') {
      api.prev();
    } else {
      api.next();
    }
  }
};

const goToToday = (): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().today();
  }
};

const createNewBooking = (): void => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  emit('createBooking', {
    start: today.toISOString().split('T')[0],
    end: tomorrow.toISOString().split('T')[0]
  });
};

// Admin-focused custom event rendering
const renderAdminEventContent = (eventInfo: any) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const owner = eventInfo.event.extendedProps.owner as User;
  const cleaner = eventInfo.event.extendedProps.cleaner as User;
  const isTurn = booking.booking_type === 'turn';
  const isAssigned = !!booking.assigned_cleaner_id;
  
  return {
    html: `
      <div class="admin-event-content">
        <div class="admin-event-title">
          ${isTurn ? '🔥 ' : ''}${property?.name || 'Unknown Property'}
        </div>
        <div class="admin-event-owner">
          Owner: ${owner?.name || 'Unknown'}
        </div>
        <div class="admin-event-cleaner ${isAssigned ? 'assigned' : 'unassigned'}">
          ${isAssigned ? `👤 ${cleaner?.name}` : '⚠️ Unassigned'}
        </div>
        <div class="admin-event-status">
          ${booking.status.toUpperCase()}
        </div>
        ${isTurn ? '<div class="admin-turn-badge">URGENT TURN</div>' : ''}
      </div>
    `
  };
};

// Admin-focused day cell rendering
const renderAdminDayCell = (dayInfo: any) => {
  const dayBookings = allBookings.value.filter(booking => {
    const checkoutDate = new Date(booking.checkout_date).toDateString();
    const dayDate = dayInfo.date.toDateString();
    return checkoutDate === dayDate;
  });
  
  const turnCount = dayBookings.filter(b => b.booking_type === 'turn').length;
  const unassignedCount = dayBookings.filter(b => !b.assigned_cleaner_id).length;
  const totalCount = dayBookings.length;
  
  return {
    html: `
      <div class="admin-day-number">
        ${dayInfo.dayNumberText}
        ${turnCount > 0 ? `<span class="admin-turn-indicator">${turnCount}</span>` : ''}
        ${unassignedCount > 0 ? `<span class="admin-unassigned-indicator">${unassignedCount}</span>` : ''}
        ${totalCount > 0 && turnCount === 0 && unassignedCount === 0 ? `<span class="admin-booking-indicator">${totalCount}</span>` : ''}
      </div>
    `
  };
};

// Watch for view changes
watch(currentView, (newView) => {
  if (calendarRef.value) {
    calendarRef.value.getApi().changeView(newView);
    emit('viewChange', newView);
  }
});

// Watch for theme changes and update calendar
watch(() => theme.global.current.value.dark, () => {
  nextTick(() => {
    if (calendarRef.value) {
      calendarRef.value.getApi().refetchEvents();
    }
  });
});

// Watch for changes in props from HomeAdmin
watch(() => props.bookings, (newBookings) => {
  eventLogger.logEvent(
    'HomeAdmin',
    'AdminCalendar',
    'bookingsUpdate',
    { count: newBookings.size },
    'receive'
  );
}, { deep: true });

// Programmatic calendar methods for admin
const goToDate = (date: string | Date): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().gotoDate(date);
  }
};

const changeView = (viewName: string): void => {
  currentView.value = viewName as any;
};

const refreshEvents = (): void => {
  if (calendarRef.value) {
    calendarRef.value.getApi().refetchEvents();
  }
};

// Expose methods to parent (HomeAdmin)
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi: () => calendarRef.value?.getApi()
});
</script>

<style scoped>
.admin-calendar-container {
  height: 100%;
  width: 100%;
}

.admin-calendar-toolbar {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline), 0.12);
}

.admin-view-toggle {
  border: 1px solid rgb(var(--v-theme-outline), 0.38);
}

.admin-date-title {
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
}

.admin-calendar-card {
  background: rgb(var(--v-theme-surface));
}

.admin-calendar {
  --fc-border-color: rgb(var(--v-theme-on-surface), 0.12);
  --fc-button-bg-color: rgb(var(--v-theme-primary));
  --fc-button-border-color: rgb(var(--v-theme-primary));
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
  --fc-event-border-radius: 4px;
}

/* Admin-specific turn booking highlighting */
.fc-event.admin-booking-turn {
  font-weight: bold;
  border-width: 2px !important;
}

.fc-event.admin-priority-urgent {
  animation: admin-pulse 3s infinite;
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
}

@keyframes admin-pulse {
  0% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(var(--v-theme-error), 0); }
  100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0); }
}

/* Admin-specific assignment status styling */
.fc-event.admin-assignment-unassigned {
  border-style: dashed !important;
  border-width: 2px !important;
}

.fc-event.admin-assignment-assigned {
  border-style: solid !important;
}

/* Admin-specific status styling */
.fc-event.admin-status-pending {
  opacity: 0.9;
}

.fc-event.admin-status-in_progress {
  font-weight: bold;
  border-width: 3px !important;
}

.fc-event.admin-status-completed {
  opacity: 0.6;
  text-decoration: line-through;
}

/* Admin-specific day cell indicators */
.admin-turn-indicator {
  background: rgb(var(--v-theme-error));
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 9px;
  margin-left: 2px;
  font-weight: bold;
  animation: admin-pulse 3s infinite;
}

.admin-unassigned-indicator {
  background: rgb(var(--v-theme-warning));
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 9px;
  margin-left: 2px;
  font-weight: bold;
}

.admin-booking-indicator {
  background: rgb(var(--v-theme-primary));
  color: white;
  border-radius: 50%;
  padding: 1px 4px;
  font-size: 9px;
  margin-left: 2px;
  font-weight: bold;
}

/* Admin-specific event content styling */
.admin-event-content {
  padding: 2px;
  font-size: 0.8em;
}

.admin-event-title {
  font-weight: 600;
  font-size: 0.9em;
  margin-bottom: 1px;
}

.admin-event-owner {
  font-size: 0.75em;
  opacity: 0.8;
  margin-bottom: 1px;
}

.admin-event-cleaner {
  font-size: 0.75em;
  font-weight: 500;
  margin-bottom: 1px;
}

.admin-event-cleaner.unassigned {
  color: rgb(var(--v-theme-warning));
  font-weight: bold;
}

.admin-event-cleaner.assigned {
  color: rgb(var(--v-theme-success));
}

.admin-event-status {
  font-size: 0.7em;
  opacity: 0.9;
  font-weight: 500;
}

.admin-turn-badge {
  background: rgba(var(--v-theme-error), 0.2);
  color: rgb(var(--v-theme-error));
  font-size: 0.65em;
  padding: 1px 3px;
  border-radius: 3px;
  margin-top: 1px;
  font-weight: bold;
  text-align: center;
}

/* Admin-specific day cell styling */
.admin-day-number {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .admin-calendar-toolbar .v-row {
    flex-direction: column;
  }
  
  .admin-calendar-toolbar .v-col {
    margin-bottom: 8px !important;
  }
  
  .admin-view-toggle {
    width: 100%;
  }
  
  .admin-event-content {
    font-size: 0.7em;
  }
}

@media (max-width: 600px) {
  .admin-calendar {
    --fc-event-border-radius: 2px;
  }
  
  .admin-event-content {
    font-size: 0.65em;
    padding: 1px;
  }
  
  .admin-event-title {
    font-size: 0.8em;
  }
}
</style> 