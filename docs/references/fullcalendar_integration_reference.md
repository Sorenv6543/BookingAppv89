# FullCalendar.io + Vue 3 + TypeScript Integration Reference

## **Setup & Configuration**

### **Installation & Dependencies**
```bash
npm install @fullcalendar/vue3 @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction
```

### **FullCalendar Component with TypeScript**
```vue
<!-- components/smart/FullCalendar.vue -->
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
import type { CalendarOptions, EventApi, DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { computed, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import type { Booking, Property } from '@/types';

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
const calendarRef = useTemplateRef<InstanceType<typeof FullCalendar>>('calendarRef');

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
      default: return isDark ? '#FF5252' : '#F44336';
    }
  } else {
    switch (booking.status) {
      case 'pending': return isDark ? '#2196F3' : '#1976D2';
      case 'scheduled': return isDark ? '#00BCD4' : '#0097A7';
      case 'in_progress': return isDark ? '#4CAF50' : '#388E3C';
      case 'completed': return isDark ? '#9E9E9E' : '#757575';
      default: return isDark ? '#2196F3' : '#1976D2';
    }
  }
};

const getEventBorderColor = (booking: Booking): string => {
  return booking.booking_type === 'turn' ? '#D32F2F' : '#1976D2';
};

const getEventTextColor = (booking: Booking): string => {
  return '#FFFFFF';
};

// Calendar configuration
const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  
  // View settings
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },
  
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
  loading: props.loading,
  
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
  emit('eventClick', clickInfo);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  emit('eventDrop', dropInfo);
  emit('updateBooking', {
    id: booking.id,
    start: dropInfo.event.startStr,
    end: dropInfo.event.endStr || dropInfo.event.startStr
  });
};

const handleEventResize = (resizeInfo: any): void => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
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
  --fc-button-hover-bg-color: rgb(var(--v-theme-primary-darken-1));
  --fc-button-active-bg-color: rgb(var(--v-theme-primary-darken-2));
  --fc-today-bg-color: rgb(var(--v-theme-primary), 0.1);
}

/* Turn booking highlighting */
.fc-event.booking-turn {
  font-weight: bold;
  border-width: 2px !important;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(244, 67, 54, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 67, 54, 0); }
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
  background: #f44336;
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
```

## **Business Logic Integration**

### **Calendar Event Utilities**
```typescript
// utils/calendarHelpers.ts
import type { Booking, Property } from '@/types';
import type { EventInput } from '@fullcalendar/core';

export interface CalendarEvent extends EventInput {
  extendedProps: {
    booking: Booking;
    property?: Property;
    bookingType: 'standard' | 'turn';
    status: string;
    guestCount?: number;
    notes?: string;
  };
}

export const convertBookingToEvent = (
  booking: Booking, 
  property?: Property
): CalendarEvent => {
  const isTurn = booking.booking_type === 'turn';
  const title = `${property?.name || 'Unknown Property'}${isTurn ? ' (TURN)' : ''}`;
  
  return {
    id: booking.id,
    title,
    start: booking.checkout_date,
    end: booking.checkin_date,
    backgroundColor: getBookingColor(booking),
    borderColor: getBookingBorderColor(booking),
    textColor: '#FFFFFF',
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
};

export const getBookingColor = (booking: Booking): string => {
  const colors = {
    turn: {
      pending: '#F44336',
      scheduled: '#FF9800', 
      in_progress: '#4CAF50',
      completed: '#9E9E9E',
      cancelled: '#757575'
    },
    standard: {
      pending: '#2196F3',
      scheduled: '#00BCD4',
      in_progress: '#4CAF50', 
      completed: '#9E9E9E',
      cancelled: '#757575'
    }
  };
  
  return colors[booking.booking_type][booking.status] || colors.standard.pending;
};

export const getBookingBorderColor = (booking: Booking): string => {
  return booking.booking_type === 'turn' ? '#D32F2F' : '#1976D2';
};

export const filterBookingsByDate = (
  bookings: Map<string, Booking>,
  date: Date,
  type: 'checkout' | 'checkin' = 'checkout'
): Booking[] => {
  const targetDate = date.toISOString().split('T')[0];
  
  return Array.from(bookings.values()).filter(booking => {
    const bookingDate = type === 'checkout' 
      ? booking.checkout_date.split('T')[0]
      : booking.checkin_date.split('T')[0];
    return bookingDate === targetDate;
  });
};

export const getTurnBookingsForDay = (
  bookings: Map<string, Booking>,
  date: Date
): Booking[] => {
  return filterBookingsByDate(bookings, date, 'checkout')
    .filter(booking => booking.booking_type === 'turn');
};

export const calculateCleaningWindow = (
  checkout: string,
  checkin: string,
  cleaningDuration: number = 120 // minutes
): { start: string; end: string; duration: number } => {
  const checkoutTime = new Date(checkout);
  const checkinTime = new Date(checkin);
  
  // Standard checkout is usually 11 AM, checkin is 3 PM
  const cleaningStart = new Date(checkoutTime);
  cleaningStart.setHours(11, 0, 0, 0);
  
  const cleaningEnd = new Date(cleaningStart);
  cleaningEnd.setMinutes(cleaningEnd.getMinutes() + cleaningDuration);
  
  // Ensure cleaning ends before checkin
  if (cleaningEnd > checkinTime) {
    cleaningEnd.setTime(checkinTime.getTime() - (30 * 60 * 1000)); // 30 min buffer
  }
  
  return {
    start: cleaningStart.toISOString(),
    end: cleaningEnd.toISOString(),
    duration: Math.floor((cleaningEnd.getTime() - cleaningStart.getTime()) / (1000 * 60))
  };
};
```

### **Calendar State Management**
```typescript
// composables/useCalendarState.ts
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { usePropertyStore } from '@/stores/property';
import { useUIStore } from '@/stores/ui';
import type { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import type { Booking, Property } from '@/types';

export const useCalendarState = () => {
  const userStore = useUserStore();
  const uiStore = useUIStore();
  
  const currentView = ref<string>('dayGridMonth');
  const currentDate = ref<Date>(new Date());
  const selectedDateRange = ref<{ start: string; end: string } | null>(null);

  // Computed calendar data
  const calendarBookings = computed(() => userStore.events);
  const calendarProperties = computed(() => userStore.houses);
  
  // Filter bookings by current view period
  const visibleBookings = computed(() => {
    // This would filter bookings based on current calendar view
    return Array.from(calendarBookings.value.values());
  });
  
  // Today's turn bookings (high priority)
  const todayTurns = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return Array.from(calendarBookings.value.values())
      .filter(booking => 
        booking.checkout_date.startsWith(today) && 
        booking.booking_type === 'turn'
      );
  });
  
  // Upcoming cleanings in next 7 days
  const upcomingCleanings = computed(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return Array.from(calendarBookings.value.values())
      .filter(booking => {
        const checkoutDate = new Date(booking.checkout_date);
        return checkoutDate <= nextWeek && checkoutDate >= new Date();
      })
      .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
  });

  // Calendar event handlers
  const handleDateSelect = (selectInfo: DateSelectArg): void => {
    selectedDateRange.value = {
      start: selectInfo.startStr,
      end: selectInfo.endStr
    };
    
    // Open create booking modal
    uiStore.openModal('eventModal', 'create', {
      checkout_date: selectInfo.startStr,
      checkin_date: selectInfo.endStr
    });
  };

  const handleEventClick = (clickInfo: EventClickArg): void => {
    const booking = clickInfo.event.extendedProps.booking as Booking;
    
    // Open edit booking modal
    uiStore.openModal('eventModal', 'edit', booking);
    
    // Prevent browser navigation if event has URL
    clickInfo.jsEvent.preventDefault();
  };

  const handleDateChange = (date: Date): void => {
    currentDate.value = date;
  };

  const handleViewChange = (view: string): void => {
    currentView.value = view;
  };

  // Navigation methods
  const goToToday = (): Date => {
    const today = new Date();
    currentDate.value = today;
    return today;
  };

  const goToDate = (date: Date): void => {
    currentDate.value = date;
  };

  const navigateToBooking = (bookingId: string): boolean => {
    const booking = calendarBookings.value.get(bookingId);
    if (booking) {
      const checkoutDate = new Date(booking.checkout_date);
      goToDate(checkoutDate);
      return true;
    }
    return false;
  };

  // Filter methods
  const filterByProperty = (propertyId: string): Booking[] => {
    return Array.from(calendarBookings.value.values())
      .filter(booking => booking.property_id === propertyId);
  };

  const filterByStatus = (status: Booking['status']): Booking[] => {
    return Array.from(calendarBookings.value.values())
      .filter(booking => booking.status === status);
  };

  const filterByBookingType = (type: 'standard' | 'turn'): Booking[] => {
    return Array.from(calendarBookings.value.values())
      .filter(booking => booking.booking_type === type);
  };

  return {
    // State
    currentView,
    currentDate,
    selectedDateRange,
    
    // Computed
    calendarBookings,
    calendarProperties,
    visibleBookings,
    todayTurns,
    upcomingCleanings,
    
    // Event handlers
    handleDateSelect,
    handleEventClick,
    handleDateChange,
    handleViewChange,
    
    // Navigation
    goToToday,
    goToDate,
    navigateToBooking,
    
    // Filters
    filterByProperty,
    filterByStatus,
    filterByBookingType
  };
};
```

## **Usage in Home.vue Orchestrator**

### **Calendar Integration Pattern**
```vue
<!-- components/smart/Home.vue -->
<script setup lang="ts">
import FullCalendar from './FullCalendar.vue';
import Sidebar from './Sidebar.vue';
import { useCalendarState } from '@/composables/useCalendarState';
import { useBookings } from '@/composables/useBookings';

const { 
  calendarBookings, 
  calendarProperties,
  todayTurns,
  handleDateSelect,
  handleEventClick 
} = useCalendarState();

const { createBooking, updateBooking } = useBookings();

// Handle calendar events from child component
const onCalendarDateSelect = (selectInfo: any): void => {
  handleDateSelect(selectInfo);
};

const onCalendarEventClick = (clickInfo: any): void => {
  handleEventClick(clickInfo);
};

const onCreateBooking = async (data: any): Promise<void> => {
  try {
    await createBooking(data);
  } catch (error) {
    console.error('Failed to create booking:', error);
  }
};

const onUpdateBooking = async (data: any): Promise<void> => {
  try {
    await updateBooking(data.id, {
      checkout_date: data.start,
      checkin_date: data.end
    });
  } catch (error) {
    console.error('Failed to update booking:', error);
  }
};
</script>

<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters style="height: 100vh;">
      <!-- Sidebar -->
      <v-col cols="12" md="3" lg="2">
        <Sidebar 
          :today-turns="todayTurns"
          :properties="calendarProperties"
          @navigate-to-booking="navigateToBooking"
        />
      </v-col>
      
      <!-- Main Calendar -->
      <v-col cols="12" md="9" lg="10">
        <FullCalendar
          :bookings="calendarBookings"
          :properties="calendarProperties"
          @date-select="onCalendarDateSelect"
          @event-click="onCalendarEventClick"
          @create-booking="onCreateBooking"
          @update-booking="onUpdateBooking"
        />
      </v-col>
    </v-row>
  </v-container>
</template>
```

This reference provides comprehensive patterns for integrating FullCalendar.io with your Vue 3 + TypeScript + Vuetify stack, specifically tailored for the property cleaning scheduler's business logic and component orchestration architecture.