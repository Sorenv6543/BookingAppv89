<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="admin-calendar-container">
    <!-- Advanced Admin Calendar Toolbar -->
    <v-card
      v-if="!previewMode"
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

              <!-- Simplified View Toggle -->
              <v-switch
                v-model="isSimplifiedView"
                :label="mobile ? 'Simple' : 'Simplified View'"
                color="primary"
                density="compact"
                hide-details
                class="admin-view-toggle-switch"
              />

              <!-- Color Picker Toggle -->
              <v-btn
                :color="showColorPicker ? 'primary' : 'default'"
                variant="outlined"
                size="small"
                prepend-icon="mdi-palette"
                @click="showColorPicker = !showColorPicker"
              >
                {{ mobile ? 'Colors' : 'Event Colors' }}
              </v-btn>

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

    <!-- Color Picker Panel -->
    <v-expand-transition>
      <v-card
        v-show="showColorPicker"
        class="admin-color-picker-panel mb-4"
        elevation="2"
      >
        <v-card-title class="text-h6 pb-2">
          <v-icon class="mr-2">mdi-palette</v-icon>
          Customize Event Colors
        </v-card-title>
        <v-card-text>
          <v-row>
            <!-- Check-out Color -->
            <v-col cols="12" sm="4">
              <div class="color-picker-item">
                <div class="d-flex align-center mb-2">
                  <div 
                    class="color-preview mr-3"
                    :style="{ backgroundColor: eventColors.checkout }"
                  ></div>
                  <span class="font-weight-medium">Check-out Events</span>
                </div>
                <v-text-field
                  v-model="eventColors.checkout"
                  type="color"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="color-input"
                />
              </div>
            </v-col>

            <!-- Check-in Color -->
            <v-col cols="12" sm="4">
              <div class="color-picker-item">
                <div class="d-flex align-center mb-2">
                  <div 
                    class="color-preview mr-3"
                    :style="{ backgroundColor: eventColors.checkin }"
                  ></div>
                  <span class="font-weight-medium">Check-in Events</span>
                </div>
                <v-text-field
                  v-model="eventColors.checkin"
                  type="color"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="color-input"
                />
              </div>
            </v-col>

            <!-- Turn Color -->
            <v-col cols="12" sm="4">
              <div class="color-picker-item">
                <div class="d-flex align-center mb-2">
                  <div 
                    class="color-preview mr-3"
                    :style="{ backgroundColor: eventColors.turn }"
                  ></div>
                  <span class="font-weight-medium">Turn Events</span>
                </div>
                <v-text-field
                  v-model="eventColors.turn"
                  type="color"
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="color-input"
                />
              </div>
            </v-col>
          </v-row>

          <!-- Preset Color Options -->
          <v-divider class="my-4" />
          <div class="preset-colors">
            <span class="text-subtitle-2 mb-3 d-block">Quick Presets:</span>
            
            <!-- Basic Presets -->
            <div class="preset-section mb-3">
              <span class="text-caption text-medium-emphasis mb-2 d-block">Basic:</span>
              <div class="d-flex flex-wrap ga-2">
                <v-btn size="small" variant="outlined" @click="applyPreset('default')">Default</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('vibrant')">Vibrant</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('pastel')">Pastel</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('dark')">Dark</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('monochrome')">Monochrome</v-btn>
              </div>
            </div>

            <!-- Nature Presets -->
            <div class="preset-section mb-3">
              <span class="text-caption text-medium-emphasis mb-2 d-block">Nature:</span>
              <div class="d-flex flex-wrap ga-2">
                <v-btn size="small" variant="outlined" @click="applyPreset('ocean')">Ocean</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('sunset')">Sunset</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('forest')">Forest</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('autumn')">Autumn</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('tropical')">Tropical</v-btn>
              </div>
            </div>

            <!-- Specialty Presets -->
            <div class="preset-section">
              <span class="text-caption text-medium-emphasis mb-2 d-block">Specialty:</span>
              <div class="d-flex flex-wrap ga-2">
                <v-btn size="small" variant="outlined" @click="applyPreset('berry')">Berry</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('neon')">Neon</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('ice')">Ice</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('vintage')">Vintage</v-btn>
                <v-btn size="small" variant="outlined" @click="applyPreset('royal')">Royal</v-btn>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-expand-transition>

    <!-- FullCalendar Component -->
    <v-card
      elevation="2"
      class="admin-calendar-card"
      :style="{ height: calendarCardHeight }"
    >
      <div
        v-if="!isMounted || !isCalendarReady"
        class="calendar-loading"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        />
        <p class="text-center mt-4">
          Loading calendar...
        </p>
      </div>
      <FullCalendar
        v-else
        ref="calendarRef"
        :options="adminCalendarOptions"
        class="admin-calendar"
        :style="{ height: fullCalendarHeight, width: '100%' }"
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
import type { CalendarOptions, DateSelectArg, EventClickArg, EventDropArg, EventApi, ViewApi, Duration } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useTheme, useDisplay } from 'vuetify';
import type { Booking, Property, User, Cleaner } from '@/types';
import { getMobileCalendarOptions, handleViewportResize } from '@/utils/mobileViewport';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';

// FullCalendar TypeScript interfaces based on documentation
interface EventResizeInfo {
  event: EventApi;
  relatedEvents: EventApi[];
  oldEvent: EventApi;
  endDelta: Duration;
  startDelta: Duration;
  revert: () => void;
  view: ViewApi;
  el: HTMLElement;
  jsEvent: MouseEvent | TouchEvent;
}

interface DatesSetInfo {
  view: ViewApi;
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  timeZone: string;
}

interface EventContentInfo {
  event: EventApi;
  timeText: string;
  view: ViewApi;
  el: HTMLElement;
}

interface DayCellContentInfo {
  date: Date;
  dateStr: string;
  dayNumberText: string;
  view: ViewApi;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  isOther: boolean;
}

interface Props {
  bookings: Map<string, Booking>;
  properties: Map<string, Property>;
  users: Map<string, User>;
  loading?: boolean;
  previewMode?: boolean;
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
  loading: false,
  previewMode: false
});

const emit = defineEmits<Emits>();

// Theme integration and mobile detection
const theme = useTheme();
const { mobile } = useDisplay();
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Component mounting state
const isMounted = ref(false);
const isCalendarReady = ref(false);

// Mobile viewport height management from OwnerCalendar
const mobileOptions = ref(getMobileCalendarOptions());
let cleanupViewportListener: (() => void) | null = null;

// Admin calendar state
const currentView = ref<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek'>('dayGridMonth');
const currentDateTitle = ref('');

// Admin filtering state
const selectedCleaner = ref<string | null>(null);
const selectedStatuses = ref<Booking['status'][]>([]);
const selectedBookingTypes = ref<Booking['booking_type'][]>([]);

// Calendar display toggle - default to simplified view
const isSimplifiedView = ref(true);

// Color customization state
const showColorPicker = ref(false);
const eventColors = ref({
  checkout: '#2196F3', // Blue
  checkin: '#4CAF50',  // Green
  turn: '#FF9800'      // Orange
});

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

// Height calculations for responsive full-viewport calendar
const calendarCardHeight = computed(() => {
  // Calculate available height: viewport minus toolbar height (approx 120px)
  return 'calc(100vh - 180px)';
});

const fullCalendarHeight = computed(() => {
  // FullCalendar height should fill the card minus padding
  return 'calc(100vh - 200px)';
});

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
  if (isSimplifiedView.value) {
    // Simplified view: create individual events for check-in, check-out, and turns
    const events: any[] = [];
    
    filteredBookings.value.forEach(booking => {
      const property = props.properties.get(booking.property_id);
      const owner = props.users.get(booking.owner_id);
      const cleaner = booking.assigned_cleaner_id ? props.users.get(booking.assigned_cleaner_id) : undefined;
      const isTurn = booking.booking_type === 'turn';
      
      // Check-out event (single day) - using custom color with glassmorphism
      events.push({
        id: `${booking.id}-checkout`,
        title: `${(property?.address || property?.name || 'PROPERTY').toUpperCase()} - OUT`,
        start: booking.checkout_date,
        allDay: true,
        backgroundColor: eventColors.value.checkout,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        textColor: '#ffffff',
        extendedProps: {
          booking,
          property,
          owner,
          cleaner,
          eventType: 'checkout',
          bookingType: booking.booking_type,
          status: booking.status,
          assignmentStatus: booking.assigned_cleaner_id ? 'assigned' : 'unassigned'
        },
        classNames: [
          'admin-simplified-checkout',
          `admin-booking-${booking.booking_type}`,
          `admin-status-${booking.status}`
        ]
      });
      
      // Check-in event (single day) - using custom color with glassmorphism
      events.push({
        id: `${booking.id}-checkin`,
        title: `${(property?.address || property?.name || 'PROPERTY').toUpperCase()} - IN`,
        start: booking.checkin_date,
        allDay: true,
        backgroundColor: eventColors.value.checkin,
        borderColor: 'rgba(255, 255, 255, 0.3)',
        textColor: '#ffffff',
        extendedProps: {
          booking,
          property,
          owner,
          cleaner,
          eventType: 'checkin',
          bookingType: booking.booking_type,
          status: booking.status,
          assignmentStatus: booking.assigned_cleaner_id ? 'assigned' : 'unassigned'
        },
        classNames: [
          'admin-simplified-checkin',
          `admin-booking-${booking.booking_type}`,
          `admin-status-${booking.status}`
        ]
      });
      
      // Turn event (if it's a turn booking) - single day between checkout and checkin
      if (isTurn) {
        const checkoutDate = new Date(booking.checkout_date);
        const checkinDate = new Date(booking.checkin_date);
        
        // Turn happens the day after checkout (or same day if same-day turn)
        const turnDate = new Date(checkoutDate);
        if (checkoutDate.toDateString() !== checkinDate.toDateString()) {
          turnDate.setDate(turnDate.getDate() + 1);
        }
        
        events.push({
          id: `${booking.id}-turn`,
          title: `${(property?.address || property?.name || 'PROPERTY').toUpperCase()} - TURN`,
          start: turnDate.toISOString().split('T')[0],
          allDay: true,
          backgroundColor: eventColors.value.turn,
          borderColor: 'rgba(255, 255, 255, 0.4)',
          textColor: '#ffffff',
          extendedProps: {
            booking,
            property,
            owner,
            cleaner,
            eventType: 'turn',
            bookingType: booking.booking_type,
            status: booking.status,
            assignmentStatus: booking.assigned_cleaner_id ? 'assigned' : 'unassigned'
          },
          classNames: [
            'admin-simplified-turn',
            `admin-booking-${booking.booking_type}`,
            `admin-status-${booking.status}`,
            'admin-priority-urgent'
          ]
        });
      }
    });
    
    return events;
  }
  
  // Full view: show booking as date ranges (original implementation)
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

// Event title formatting for full view (simplified view creates its own titles)
const getAdminEventTitle = (booking: Booking, property?: Property, owner?: User, cleaner?: User): string => {
  const checkoutDate = new Date(booking.checkout_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const checkinDate = new Date(booking.checkin_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const propertyName = property?.name || 'Unknown Property';
  const isTurn = booking.booking_type === 'turn';
  
  // Full view: Property Name - Checkout → Checkin
  return `${isTurn ? '🔥 ' : ''}${propertyName} - ${checkoutDate} → ${checkinDate}`;
};

// Enhanced dynamic color system from OwnerCalendar - prioritized for admin view
const getAdminEventColor = (booking: Booking): string => {
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

const getAdminEventBorderColor = (booking: Booking): string => {
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

const getAdminEventTextColor = (booking: Booking): string => {
  // Use white text for better contrast on colored backgrounds
  if (booking.status === 'completed') {
    return '#E0E0E0'; // Lighter text for completed bookings
  }
  return '#FFFFFF';
};

// Admin-focused calendar configuration with advanced features
const adminCalendarOptions = computed<CalendarOptions>(() => {
  // Don't return options until component is ready
  if (!isMounted.value || !isCalendarReady.value) {
    return {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: false,
      events: []
    };
  }
  
  return {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    
    // View settings - all views available for admin
    initialView: currentView.value,
    headerToolbar: false, // We handle toolbar externally
  
  // Event settings - mobile optimized from OwnerCalendar
  events: adminCalendarEvents.value,
  eventDisplay: mobileOptions.value.eventDisplay,
  eventOverlap: true, // Allow overlapping for admin view
  eventResizableFromStart: true,
  
  // Admin interaction settings (full features)
  selectable: true,
  selectMirror: true,
  editable: true, // Enable drag-and-drop for admin
  droppable: true, // Enable drag-to-assign
  eventDurationEditable: true,
  
  // Date/time settings
  locale: 'en',
  timeZone: 'local',
  slotMinTime: '06:00:00',
  slotMaxTime: '22:00:00',
  slotDuration: '01:00:00',
  snapDuration: '00:30:00',
  
  // Use mobile-optimized height calculation from OwnerCalendar
  height: props.previewMode ? '100%' : mobileOptions.value.height,
  aspectRatio: undefined, // Remove aspect ratio constraints for full height
  expandRows: true, // Make calendar rows expand to fill available height
  
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
  // Removed dayCellContent to eliminate extra numbers on dates
  
  // Business hours
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
  };
});

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

const handleAdminEventResize = (resizeInfo: EventResizeInfo): void => {
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
      checkin_date: resizeInfo.event.endStr || resizeInfo.event.end?.toISOString()
    }
  });
};

const handleDatesSet = (dateInfo: DatesSetInfo): void => {
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
    case 'edit': {
      // Create a minimal EventClickArg structure for the emit - only use required properties
      const mockEvent = {
        id: booking.id,
        extendedProps: { booking },
        start: booking.checkout_date,
        end: booking.checkin_date,
        title: `${booking.booking_type} - ${booking.id}`
      };
      emit('eventClick', { 
        event: mockEvent,
        el: document.createElement('div'), // Mock DOM element
        jsEvent: new MouseEvent('click'), // Mock mouse event
        view: { type: 'timeGridWeek' } // Mock view
      } as unknown as EventClickArg);
      break;
    }
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

// Color preset functions
const applyPreset = (presetName: string): void => {
  const presets = {
    default: {
      checkout: '#2196F3', // Blue
      checkin: '#4CAF50',  // Green  
      turn: '#FF9800'      // Orange
    },
    vibrant: {
      checkout: '#E91E63', // Pink
      checkin: '#00BCD4',  // Cyan
      turn: '#FF5722'      // Deep Orange
    },
    pastel: {
      checkout: '#81C784', // Light Green
      checkin: '#64B5F6',  // Light Blue
      turn: '#FFB74D'      // Light Orange
    },
    dark: {
      checkout: '#424242', // Dark Gray
      checkin: '#616161',  // Medium Gray
      turn: '#212121'      // Very Dark Gray
    },
    monochrome: {
      checkout: '#9E9E9E', // Gray
      checkin: '#757575',  // Dark Gray
      turn: '#424242'      // Darker Gray
    },
    ocean: {
      checkout: '#0277BD', // Deep Blue
      checkin: '#00796B',  // Teal
      turn: '#00ACC1'      // Light Blue
    },
    sunset: {
      checkout: '#D84315', // Deep Orange
      checkin: '#F57C00',  // Orange
      turn: '#FFB300'      // Amber
    },
    forest: {
      checkout: '#2E7D32', // Dark Green
      checkin: '#388E3C',  // Green
      turn: '#689F38'      // Light Green
    },
    berry: {
      checkout: '#7B1FA2', // Purple
      checkin: '#C2185B',  // Pink
      turn: '#E91E63'      // Deep Pink
    },
    autumn: {
      checkout: '#BF360C', // Deep Orange Red
      checkin: '#E65100',  // Orange
      turn: '#F57F17'      // Yellow Orange
    },
    neon: {
      checkout: '#FF1744', // Neon Red
      checkin: '#00E676',  // Neon Green
      turn: '#FF6D00'      // Neon Orange
    },
    ice: {
      checkout: '#B3E5FC', // Ice Blue
      checkin: '#C8E6C9',  // Ice Green
      turn: '#FFE0B2'      // Ice Orange
    },
    vintage: {
      checkout: '#8D6E63', // Brown
      checkin: '#A1887F',  // Light Brown
      turn: '#BCAAA4'      // Very Light Brown
    },
    royal: {
      checkout: '#1A237E', // Deep Blue
      checkin: '#4A148C',  // Deep Purple
      turn: '#B71C1C'      // Deep Red
    },
    tropical: {
      checkout: '#00BCD4', // Cyan
      checkin: '#4CAF50',  // Green
      turn: '#FFEB3B'      // Yellow
    }
  };
  
  if (presets[presetName as keyof typeof presets]) {
    eventColors.value = { ...presets[presetName as keyof typeof presets] };
  }
};

// Watch for theme changes and update calendar from OwnerCalendar
watch(() => theme.global.current.value.dark, () => {
  if (calendarRef.value) {
    // Force refresh events to apply new theme colors
    const calendarApi = calendarRef.value.getApi();
    if (calendarApi) {
      calendarApi.refetchEvents();
    }
  }
});

// Enhanced event rendering from OwnerCalendar with admin-specific additions
const renderAdminEventContent = (eventInfo: EventContentInfo) => {
  const booking = eventInfo.event.extendedProps.booking as Booking;
  const property = eventInfo.event.extendedProps.property as Property;
  const owner = eventInfo.event.extendedProps.owner as User;
  const cleaner = eventInfo.event.extendedProps.cleaner as User;
  const eventType = eventInfo.event.extendedProps.eventType; // 'checkout', 'checkin', 'turn' for simplified view
  const isAssigned = !!booking.assigned_cleaner_id;
  
  // For simplified view, the events already have their own titles and colors set
  if (isSimplifiedView.value) {
    // Just return the event as-is since titles and colors are already set in adminCalendarEvents
    return {
      html: `
        <div class="fc-event-content-wrapper admin-simplified-${eventType}" 
             style="background-color: ${eventInfo.event.backgroundColor}; border-color: ${eventInfo.event.borderColor}; color: ${eventInfo.event.textColor};">
          <div class="fc-event-title">
            ${eventInfo.event.title} ${!isAssigned ? '⚠️' : ''}
          </div>
        </div>
      `
    };
  }
  
  // Full view content
  const eventColor = getAdminEventColor(booking);
  const borderColor = getAdminEventBorderColor(booking);
  const textColor = getAdminEventTextColor(booking);
  
  // Priority-based icons from OwnerCalendar
  const getPriorityIcon = (priority: string, bookingType: string) => {
    if (bookingType === 'turn') {
      switch (priority) {
        case 'urgent': return '🔥';
        case 'high': return '⏰';
        case 'normal': return '🏠';
        case 'low': return '📋';
        default: return '🏠';
      }
    } else {
      switch (priority) {
        case 'urgent': return '⚡';
        case 'high': return '📈';
        case 'normal': return '📊';
        case 'low': return '📉';
        default: return '📊';
      }
    }
  };
  
  const priorityIcon = getPriorityIcon(booking.priority, booking.booking_type);
  
  return {
    html: `
      <div class="fc-event-content-wrapper booking-${booking.booking_type} priority-${booking.priority}" 
           style="background-color: ${eventColor}; border-color: ${borderColor}; color: ${textColor};">
        <div class="fc-event-title">
          ${priorityIcon} ${property?.name || 'Property'} ${!isAssigned ? '⚠️' : ''}
        </div>
      </div>
    `
  };
};

// Admin-focused day cell rendering
const renderAdminDayCell = (dayInfo: DayCellContentInfo) => {
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

// Watch for simplified view toggle changes
watch(isSimplifiedView, () => {
  nextTick(() => {
    if (calendarRef.value) {
      calendarRef.value.getApi().refetchEvents();
    }
  });
});

// Watch for color changes and update calendar
watch(eventColors, () => {
  nextTick(() => {
    if (calendarRef.value) {
      calendarRef.value.getApi().refetchEvents();
    }
  });
}, { deep: true });

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
  const validViews: readonly string[] = ['dayGridMonth', 'timeGridWeek', 'timeGridDay', 'listWeek'];
  if (validViews.includes(viewName)) {
    currentView.value = viewName as typeof currentView.value;
  } else {
    console.warn(`Invalid view name: ${viewName}. Using default 'timeGridWeek'.`);
    currentView.value = 'timeGridWeek';
  }
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

// Window resize handler for calendar responsiveness
const handleWindowResize = (): void => {
  if (calendarRef.value) {
    nextTick(() => {
      const calendarApi = calendarRef.value?.getApi();
      if (calendarApi) {
        calendarApi.updateSize();
      }
    });
  }
};

// Lifecycle hooks for proper DOM mounting
onMounted(async () => {
  isMounted.value = true;
  
  // Wait for DOM to be fully ready
  await nextTick();
  
  // Set up mobile viewport listener from OwnerCalendar
  cleanupViewportListener = handleViewportResize((newOptions) => {
    mobileOptions.value = newOptions;
  });
  
  // Add a small delay to ensure Vuetify layout is ready
  setTimeout(() => {
    isCalendarReady.value = true;
    
    // Add resize listener after calendar is ready
    window.addEventListener('resize', handleWindowResize);
  }, 100);
});

onBeforeUnmount(() => {
  // Remove resize listener
  window.removeEventListener('resize', handleWindowResize);
  
  // Clean up mobile viewport listener
  if (cleanupViewportListener) {
    cleanupViewportListener();
    cleanupViewportListener = null;
  }
  
  // Clean up calendar instance if needed
  if (calendarRef.value) {
    try {
      const calendarApi = calendarRef.value.getApi();
      if (calendarApi) {
        calendarApi.destroy();
      }
    } catch (error) {
      console.warn('Error cleaning up calendar:', error);
    }
  }
});
</script>

<style scoped>
.admin-calendar-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.calendar-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.admin-calendar-toolbar {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgb(var(--v-theme-outline), 0.12);
  flex-shrink: 0;
}

.admin-view-toggle {
  border: 1px solid rgb(var(--v-theme-outline), 0.38);
}

.admin-date-title {
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
}

.admin-view-toggle-switch {
  max-width: 180px;
}

/* Color Picker Panel Styles - Glassmorphism Effect */
.admin-color-picker-panel {
  background: rgba(var(--v-theme-surface), 0.7) !important;
  backdrop-filter: blur(20px) saturate(1.8);
  -webkit-backdrop-filter: blur(20px) saturate(1.8);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  animation: glassmorphismFadeIn 0.4s ease-out;
}

@keyframes glassmorphismFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
    backdrop-filter: blur(0px);
    -webkit-backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    transform: translateY(0px) scale(1);
    backdrop-filter: blur(20px) saturate(1.8);
    -webkit-backdrop-filter: blur(20px) saturate(1.8);
  }
}

.admin-color-picker-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
  z-index: 1;
}

.admin-color-picker-panel .v-card-title,
.admin-color-picker-panel .v-card-text {
  position: relative;
  z-index: 2;
}

.color-picker-item {
  padding: 12px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--v-theme-outline), 0.15);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.color-picker-item:hover {
  background: rgba(var(--v-theme-surface-variant), 0.5);
  transform: translateY(-2px);
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.color-preview {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
}

.color-preview:hover {
  transform: scale(1.1);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.color-input {
  width: 100%;
}

.color-input :deep(.v-field__input) {
  padding: 0;
  height: 40px;
}

.color-input :deep(input[type="color"]) {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.preset-colors {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.preset-section {
  padding: 12px;
  border-radius: 10px;
  background: rgba(var(--v-theme-surface-variant), 0.2);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(var(--v-theme-outline), 0.08);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.preset-section:hover {
  background: rgba(var(--v-theme-surface-variant), 0.25);
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.preset-section:not(:last-child) {
  margin-bottom: 12px;
}

/* Glassmorphism Preset Buttons */
.preset-section .v-btn {
  background: rgba(var(--v-theme-surface), 0.6) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(var(--v-theme-outline), 0.2) !important;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease !important;
}

.preset-section .v-btn:hover {
  background: rgba(var(--v-theme-primary), 0.1) !important;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.preset-section .v-btn:active {
  transform: translateY(0px) scale(0.98);
  box-shadow: 
    0 2px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.admin-calendar-card {
  background: rgb(var(--v-theme-surface));
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.admin-calendar {
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.admin-calendar {
  --fc-border-color: rgb(var(--v-theme-on-surface), 0.12);
  --fc-button-bg-color: rgb(var(--v-theme-primary));
  --fc-button-border-color: rgb(var(--v-theme-primary));
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
  --fc-event-border-radius: 4px;
  flex: 1;
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

/* Simplified view event styling - matching dashboard colors */
.admin-simplified-checkout,
.admin-simplified-checkin,
.admin-simplified-turn {
  font-weight: 600 !important;
  border-radius: 6px !important;
}

.admin-simplified-checkout {
  background-color: rgb(var(--v-theme-info)) !important;
  border-color: rgb(var(--v-theme-info)) !important;
}

.admin-simplified-checkin {
  background-color: rgb(var(--v-theme-success)) !important;
  border-color: rgb(var(--v-theme-success)) !important;
}

.admin-simplified-turn {
  background-color: rgb(var(--v-theme-warning)) !important;
  border-color: rgb(var(--v-theme-warning)) !important;
  animation: admin-turn-pulse 2s infinite;
}

@keyframes admin-turn-pulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.8; 
    transform: scale(1.02);
  }
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
    font-size: 0.75em;
  }
  
  .admin-event-dates {
    font-size: 0.7em;
  }
  
  .admin-event-owner-small {
    font-size: 0.65em;
  }
  
  .admin-turn-badge {
    font-size: 0.55em;
    padding: 0px 2px;
  }
}

/* Enhanced Calendar Styles from OwnerCalendar */
:deep(.fc) {
  height: 100%;
  width: 100%;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  flex-direction: column;
}

:deep(.fc-view-harness) {
  flex: 1;
  overflow: auto;
}

:deep(.fc-scrollgrid) {
  border: 1px solid rgb(var(--v-theme-outline), 0.12) !important;
}

/* Enhanced Event Styling with Glassmorphism Effect */
:deep(.fc-event) {
  background: rgba(var(--v-event-bg), 0.8) !important;
  backdrop-filter: blur(12px) saturate(1.5) !important;
  -webkit-backdrop-filter: blur(12px) saturate(1.5) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
  border-radius: 8px !important;
  height: 32px !important;
  min-height: 32px !important;
  max-height: 32px !important;
  position: relative !important;
  overflow: hidden !important;
}

/* Glass reflection effect */
:deep(.fc-event)::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.15) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
  border-radius: inherit;
}

:deep(.fc-daygrid-event.fc-event) {
  background-color: inherit !important;
  border-color: inherit !important;
  color: #ffffff !important;
  height: 32px !important;
  min-height: 32px !important;
}

/* Turn Booking Styles with Enhanced Glassmorphism */
:deep(.fc-event.booking-turn) {
  font-weight: bold;
  border: 2px solid rgba(255, 255, 255, 0.6) !important;
  backdrop-filter: blur(16px) saturate(2) !important;
  -webkit-backdrop-filter: blur(16px) saturate(2) !important;
  animation: glassPulse 3s infinite;
  position: relative;
  box-shadow: 
    0 6px 20px rgba(0, 0, 0, 0.12),
    0 3px 10px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
}

@keyframes glassPulse {
  0%, 100% { 
    backdrop-filter: blur(16px) saturate(2);
    -webkit-backdrop-filter: blur(16px) saturate(2);
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.12),
      0 3px 10px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  50% { 
    backdrop-filter: blur(20px) saturate(2.5);
    -webkit-backdrop-filter: blur(20px) saturate(2.5);
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.15),
      0 4px 12px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
  }
}

:deep(.fc-event.booking-turn::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  border-radius: inherit;
}

:deep(.fc-event.booking-standard) {
  border-width: 2px !important;
  position: relative;
}

:deep(.fc-event.booking-standard::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%);
  border-radius: inherit;
}

/* Priority-based Colors for Turn Bookings */
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

/* Priority-based Colors for Standard Bookings */
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

/* Interactive States with Glassmorphism */
:deep(.fc-event:hover) {
  backdrop-filter: blur(16px) saturate(1.8) !important;
  -webkit-backdrop-filter: blur(16px) saturate(1.8) !important;
  border: 1px solid rgba(255, 255, 255, 0.5) !important;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.15),
    0 4px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.3) !important;
  transform: translateY(-2px) scale(1.02) !important;
  cursor: grab !important;
}

:deep(.fc-event:active) {
  backdrop-filter: blur(8px) saturate(1.2) !important;
  -webkit-backdrop-filter: blur(8px) saturate(1.2) !important;
  transform: translateY(0px) scale(0.98) !important;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1) !important;
  cursor: grabbing !important;
}

/* Drag feedback with glassmorphism */
:deep(.fc-event-dragging) {
  opacity: 0.9 !important;
  backdrop-filter: blur(20px) saturate(2) !important;
  -webkit-backdrop-filter: blur(20px) saturate(2) !important;
  transform: rotate(3deg) scale(1.05) !important;
  z-index: 999 !important;
  box-shadow: 
    0 12px 32px rgba(0, 0, 0, 0.2),
    0 6px 16px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4) !important;
}

:deep(.fc-event-mirror) {
  opacity: 0.7 !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  transform: rotate(-2deg) scale(0.95) !important;
}

/* Status-based styling */
:deep(.fc-event.status-pending) {
  opacity: 0.8;
}

:deep(.fc-event.status-completed) {
  opacity: 0.6;
  text-decoration: line-through;
}

/* Event Content Styling - Increased Height for Uppercase Text */
.fc-event-content-wrapper {
  padding: 4px 6px !important;
  height: 28px !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
}

:deep(.fc-event-title) {
  font-size: 0.8em !important;
  line-height: 1.3 !important;
  margin: 0 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
}

.fc-event-subtitle {
  display: none !important; /* Hide subtitle to save space */
}

.admin-event-assignment {
  display: none !important; /* Hide assignment to save space */
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1; 
  }
  50% { 
    opacity: 0.8; 
  }
}

/* Mobile Responsiveness with Glassmorphism */
@media (max-width: 768px) {
  :deep(.fc-event) {
    margin: 1px 0;
    height: 28px !important;
    min-height: 28px !important;
    max-height: 28px !important;
    backdrop-filter: blur(10px) saturate(1.4) !important;
    -webkit-backdrop-filter: blur(10px) saturate(1.4) !important;
    border-radius: 6px !important;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.75em !important;
  }
  
  :deep(.fc-event:hover) {
    backdrop-filter: blur(14px) saturate(1.6) !important;
    -webkit-backdrop-filter: blur(14px) saturate(1.6) !important;
    transform: translateY(-1px) scale(1.01) !important;
  }
}

@media (max-width: 600px) {
  :deep(.fc-event) {
    height: 24px !important;
    min-height: 24px !important;
    max-height: 24px !important;
    margin: 1px 0 !important;
    backdrop-filter: blur(8px) saturate(1.3) !important;
    -webkit-backdrop-filter: blur(8px) saturate(1.3) !important;
    border-radius: 4px !important;
  }
  
  .fc-event-content-wrapper {
    height: 20px !important;
    padding: 2px 4px !important;
  }
  
  :deep(.fc-event-title) {
    font-size: 0.7em !important;
    line-height: 1.2 !important;
  }
  
  :deep(.fc-event:hover) {
    backdrop-filter: blur(12px) saturate(1.5) !important;
    -webkit-backdrop-filter: blur(12px) saturate(1.5) !important;
  }
}
</style> 