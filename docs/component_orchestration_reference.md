# Component Orchestration & State Flow Reference

## **Architecture Overview**

### **Home.vue as Central Orchestrator Pattern**
```
┌─────────────────────────────────────────────────────────┐
│                     Home.vue                            │
│               (Central Orchestrator)                    │
│                                                         │
│  ┌─────────────────┐           ┌─────────────────────┐  │
│  │   Sidebar.vue   │           │  FullCalendar.vue   │  │
│  │   (Smart)       │  ←─────→  │     (Smart)         │  │
│  │                 │           │                     │  │
│  └─────────────────┘           └─────────────────────┘  │
│           │                             │               │
│           ▼                             ▼               │
│  ┌─────────────────┐           ┌─────────────────────┐  │
│  │  Pinia Stores   │           │   Composables       │  │
│  │  - userStore    │           │  - useBookings      │  │
│  │  - uiStore      │           │  - useProperties    │  │
│  │  - authStore    │           │  - useCalendar      │  │
│  └─────────────────┘           └─────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## **Home.vue - Central Orchestrator**

### **Main Orchestrator Implementation**
```vue
<!-- components/smart/Home.vue -->
<template>
  <div class="home-container">
    <v-row no-gutters class="fill-height">
      <!-- Sidebar Column -->
      <v-col 
        cols="12" 
        lg="3" 
        xl="2" 
        class="sidebar-column"
        :class="{ 'mobile-hidden': !sidebarOpen }"
      >
        <Sidebar
          :today-turns="todayTurns"
          :upcoming-cleanings="upcomingCleanings"
          :properties="propertiesArray"
          :loading="loading"
          @navigate-to-booking="handleNavigateToBooking"
          @navigate-to-date="handleNavigateToDate"
          @filter-by-property="handleFilterByProperty"
          @create-booking="handleCreateBooking"
          @create-property="handleCreateProperty"
        />
      </v-col>

      <!-- Main Calendar Column -->
      <v-col 
        cols="12" 
        lg="9" 
        xl="10" 
        class="calendar-column"
      >
        <div class="calendar-header">
          <v-btn
            v-if="$vuetify.display.lgAndDown"
            icon="mdi-menu"
            variant="text"
            @click="toggleSidebar"
            class="mr-4"
          />
          <CalendarControls
            :current-view="currentView"
            :current-date="currentDate"
            @view-change="handleViewChange"
            @date-change="handleDateChange"
            @today="handleGoToday"
            @prev="handlePrevious"
            @next="handleNext"
          />
        </div>

        <FullCalendar
          ref="calendarRef"
          :bookings="filteredBookings"
          :properties="propertiesMap"
          :loading="loading"
          :current-view="currentView"
          :current-date="currentDate"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @event-resize="handleEventResize"
          @view-change="handleCalendarViewChange"
          @date-change="handleCalendarDateChange"
        />
      </v-col>
    </v-row>

    <!-- Global Modals (managed by UI state) -->
    <EventModal
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
      :properties="propertiesMap"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @delete="handleEventModalDelete"
    />

    <PropertyModal
      :open="propertyModalOpen"
      :mode="propertyModalMode"
      :property="propertyModalData"
      @close="handlePropertyModalClose"
      @save="handlePropertyModalSave"
      @delete="handlePropertyModalDelete"
    />

    <!-- Notification System -->
    <NotificationSystem />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';
import Sidebar from './Sidebar.vue';
import FullCalendar from './FullCalendar.vue';
import CalendarControls from '@/components/dumb/CalendarControls.vue';
import EventModal from '@/components/dumb/BookingForm/EventModal.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import NotificationSystem from '@/components/dumb/NotificationSystem.vue';

// State management
import { useUserStore } from '@/stores/user';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

// Business logic composables
import { useBookings } from '@/composables/useBookings';
import { useProperties } from '@/composables/useProperties';
import { useCalendarState } from '@/composables/useCalendarState';

// Types
import type { Booking, Property, BookingFormData, PropertyFormData } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================

const userStore = useUserStore();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { name: displaySize } = useDisplay();

// ============================================================================
// COMPOSABLES - BUSINESS LOGIC
// ============================================================================

const { 
  loading: bookingsLoading, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  fetchBookings 
} = useBookings();

const { 
  loading: propertiesLoading, 
  createProperty, 
  updateProperty, 
  deleteProperty,
  fetchProperties 
} = useProperties();

const {
  currentView,
  currentDate,
  selectedPropertyFilter,
  filterByProperty,
  clearPropertyFilter,
  todayTurns,
  upcomingCleanings
} = useCalendarState();

// ============================================================================
// COMPUTED STATE - DERIVED DATA
// ============================================================================

const loading = computed(() => bookingsLoading.value || propertiesLoading.value);

// Convert Maps to Arrays for components that need arrays
const propertiesArray = computed(() => Array.from(userStore.houses.values()));
const propertiesMap = computed(() => userStore.houses);

// Filtered bookings based on current filters
const filteredBookings = computed(() => {
  let bookings = userStore.events;
  
  if (selectedPropertyFilter.value) {
    const filtered = new Map<string, Booking>();
    Array.from(bookings.entries()).forEach(([id, booking]) => {
      if (booking.property_id === selectedPropertyFilter.value) {
        filtered.set(id, booking);
      }
    });
    return filtered;
  }
  
  return bookings;
});

// ============================================================================
// UI STATE - MODAL MANAGEMENT
// ============================================================================

const sidebarOpen = ref<boolean>(displaySize.value !== 'xs');

// Event Modal
const eventModalOpen = computed(() => uiStore.getModal('eventModal')?.open || false);
const eventModalMode = computed(() => uiStore.getModal('eventModal')?.mode || 'create');
const eventModalData = computed(() => uiStore.getModal('eventModal')?.data || null);

// Property Modal
const propertyModalOpen = computed(() => uiStore.getModal('propertyModal')?.open || false);
const propertyModalMode = computed(() => uiStore.getModal('propertyModal')?.mode || 'create');
const propertyModalData = computed(() => uiStore.getModal('propertyModal')?.data || null);

// ============================================================================
// SIDEBAR EVENT HANDLERS
// ============================================================================

const handleNavigateToBooking = (bookingId: string): void => {
  const booking = userStore.events.get(bookingId);
  if (booking) {
    const bookingDate = new Date(booking.checkout_date);
    handleNavigateToDate(bookingDate);
    
    // Highlight the booking
    setTimeout(() => {
      const calendarApi = calendarRef.value?.getApi();
      const event = calendarApi?.getEventById(bookingId);
      if (event) {
        event.setProp('classNames', [...event.classNames, 'highlighted']);
        setTimeout(() => {
          event.setProp('classNames', event.classNames.filter(c => c !== 'highlighted'));
        }, 3000);
      }
    }, 100);
  }
};

const handleNavigateToDate = (date: Date): void => {
  currentDate.value = date;
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.gotoDate(date);
};

const handleFilterByProperty = (propertyId: string | null): void => {
  if (propertyId) {
    filterByProperty(propertyId);
  } else {
    clearPropertyFilter();
  }
};

const handleCreateBooking = (data?: Partial<BookingFormData>): void => {
  uiStore.openModal('eventModal', 'create', data);
};

const handleCreateProperty = (): void => {
  uiStore.openModal('propertyModal', 'create');
};

// ============================================================================
// CALENDAR EVENT HANDLERS
// ============================================================================

const calendarRef = useTemplateRef<InstanceType<typeof FullCalendar>>('calendarRef');

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    booking_type: 'standard'
  };
  
  handleCreateBooking(bookingData);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  const booking = clickInfo.event.extendedProps.booking as Booking;
  uiStore.openModal('eventModal', 'edit', booking);
};

const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  try {
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    });
    
    uiStore.addNotification({
      type: 'success',
      title: 'Booking Updated',
      message: 'Booking dates have been updated successfully.'
    });
  } catch (error) {
    console.error('Failed to update booking:', error);
    dropInfo.revert();
    
    uiStore.addNotification({
      type: 'error',
      title: 'Update Failed',
      message: 'Failed to update booking dates. Please try again.'
    });
  }
};

const handleEventResize = async (resizeInfo: any): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  try {
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr
    });
    
    uiStore.addNotification({
      type: 'success',
      title: 'Booking Updated',
      message: 'Booking duration has been updated successfully.'
    });
  } catch (error) {
    console.error('Failed to resize booking:', error);
    resizeInfo.revert();
    
    uiStore.addNotification({
      type: 'error',
      title: 'Update Failed',
      message: 'Failed to update booking duration. Please try again.'
    });
  }
};

// ============================================================================
// CALENDAR CONTROL HANDLERS
// ============================================================================

const handleViewChange = (view: string): void => {
  currentView.value = view;
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.changeView(view);
};

const handleDateChange = (date: Date): void => {
  currentDate.value = date;
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.gotoDate(date);
};

const handleCalendarViewChange = (view: string): void => {
  currentView.value = view;
};

const handleCalendarDateChange = (date: Date): void => {
  currentDate.value = date;
};

const handleGoToday = (): void => {
  const today = new Date();
  handleDateChange(today);
};

const handlePrevious = (): void => {
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.prev();
};

const handleNext = (): void => {
  const calendarApi = calendarRef.value?.getApi();
  calendarApi?.next();
};

// ============================================================================
// MODAL EVENT HANDLERS
// ============================================================================

const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value;
};

// Event Modal Handlers
const handleEventModalClose = (): void => {
  uiStore.closeModal('eventModal');
};

const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    if (eventModalMode.value === 'create') {
      await createBooking(data);
    } else {
      const booking = eventModalData.value as Booking;
      await updateBooking(booking.id, data);
    }
    
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('Failed to save booking:', error);
    // Error handling is done in the composables
  }
};

const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  try {
    await deleteBooking(bookingId);
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('Failed to delete booking:', error);
    // Error handling is done in the composables
  }
};

// Property Modal Handlers
const handlePropertyModalClose = (): void => {
  uiStore.closeModal('propertyModal');
};

const handlePropertyModalSave = async (data: PropertyFormData): Promise<void> => {
  try {
    if (propertyModalMode.value === 'create') {
      await createProperty(data);
    } else {
      const property = propertyModalData.value as Property;
      await updateProperty(property.id, data);
    }
    
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to save property:', error);
    // Error handling is done in the composables
  }
};

const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  try {
    await deleteProperty(propertyId);
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to delete property:', error);
    // Error handling is done in the composables
  }
};

// ============================================================================
// LIFECYCLE & WATCHERS
// ============================================================================

// Initialize data on mount
onMounted(async () => {
  if (authStore.isAuthenticated) {
    try {
      await Promise.all([
        fetchProperties(),
        fetchBookings()
      ]);
    } catch (error) {
      console.error('Failed to initialize data:', error);
      uiStore.addNotification({
        type: 'error',
        title: 'Initialization Failed',
        message: 'Failed to load your data. Please refresh the page.'
      });
    }
  }
});

// Watch for authentication changes
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    await Promise.all([
      fetchProperties(),
      fetchBookings()
    ]);
  } else {
    // Clear data when user logs out
    userStore.clearAllData();
  }
});

// Watch for display size changes and adjust sidebar
watch(() => displaySize.value, (newSize) => {
  sidebarOpen.value = newSize !== 'xs';
});

// Cleanup on unmount
onUnmounted(() => {
  // Any cleanup needed
});
</script>

<style scoped>
.home-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar-column {
  border-right: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  height: 100vh;
  overflow-y: auto;
}

.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  padding: 16px;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  display: flex;
  align-items: center;
  min-height: 64px;
}

.mobile-hidden {
  display: none;
}

@media (min-width: 1264px) {
  .mobile-hidden {
    display: block;
  }
}

/* Highlight animation for navigated bookings */
:deep(.fc-event.highlighted) {
  animation: highlight-pulse 3s ease-in-out;
}

@keyframes highlight-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.7); }
  50% { box-shadow: 0 0 0 20px rgba(var(--v-theme-primary), 0); }
}
</style>
```

## **Component Communication Patterns**

### **Props vs Events vs Store Pattern**
```typescript
// Communication Strategy:
// - Props: Pass data DOWN to child components
// - Events: Send actions UP from child components  
// - Store: Share state ACROSS components
// - Composables: Business logic and data operations

// Example: Sidebar to Home to Calendar communication
interface ComponentCommunication {
  // Sidebar emits to Home
  sidebarToHome: {
    'navigate-to-booking': (bookingId: string) => void;
    'navigate-to-date': (date: Date) => void;
    'filter-by-property': (propertyId: string | null) => void;
    'create-booking': (data?: Partial<BookingFormData>) => void;
  };
  
  // Home passes to Calendar
  homeToCalendar: {
    bookings: Map<string, Booking>;
    properties: Map<string, Property>;
    currentView: string;
    currentDate: Date;
  };
  
  // Calendar emits to Home
  calendarToHome: {
    'date-select': (selectInfo: DateSelectArg) => void;
    'event-click': (clickInfo: EventClickArg) => void;
    'event-drop': (dropInfo: EventDropArg) => void;
  };
}
```

### **Smart vs Dumb Component Pattern**
```vue
<!-- Smart Component Example: Sidebar.vue -->
<template>
  <div class="sidebar">
    <!-- Dumb UI components receive props and emit events -->
    <TurnAlerts 
      :turns="todayTurns" 
      @navigate-to-booking="$emit('navigateToBooking', $event)"
    />
    
    <UpcomingCleanings 
      :cleanings="upcomingCleanings"
      @navigate-to-booking="$emit('navigateToBooking', $event)"
      @navigate-to-date="$emit('navigateToDate', $event)"
    />
    
    <PropertyFilter
      :properties="properties"
      :selected="selectedProperty"
      @change="handlePropertyFilterChange"
    />
    
    <QuickActions 
      @create-booking="$emit('createBooking')"
      @create-property="$emit('createProperty')"
    />
  </div>
</template>

<script setup lang="ts">
// Smart component: Has business logic, connects to stores/composables
import { computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import TurnAlerts from '@/components/dumb/TurnAlerts.vue';
import UpcomingCleanings from '@/components/dumb/UpcomingCleanings.vue';
import PropertyFilter from '@/components/dumb/PropertyFilter.vue';
import QuickActions from '@/components/dumb/QuickActions.vue';

const uiStore = useUIStore();
const selectedProperty = computed(() => uiStore.selectedPropertyFilter);

const handlePropertyFilterChange = (propertyId: string | null): void => {
  // Business logic handled in smart component
  uiStore.setPropertyFilter(propertyId);
  $emit('filterByProperty', propertyId);
};
</script>
```

```vue
<!-- Dumb Component Example: TurnAlerts.vue -->
<template>
  <v-card v-if="turns.length > 0" class="mb-4" color="error" variant="tonal">
    <v-card-title class="text-h6">
      <v-icon icon="mdi-alert" class="mr-2" />
      Urgent Turns Today
    </v-card-title>
    
    <v-card-text>
      <div 
        v-for="turn in turns" 
        :key="turn.id"
        class="turn-item"
        @click="$emit('navigateToBooking', turn.id)"
      >
        <div class="turn-property">{{ getPropertyName(turn) }}</div>
        <div class="turn-time">{{ formatTime(turn.checkout_date) }}</div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
// Dumb component: Pure UI, only receives props and emits events
import type { Booking, Property } from '@/types';

interface Props {
  turns: Booking[];
  properties?: Map<string, Property>;
}

interface Emits {
  (e: 'navigateToBooking', bookingId: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Pure functions for UI logic only
const getPropertyName = (booking: Booking): string => {
  return props.properties?.get(booking.property_id)?.name || 'Unknown Property';
};

const formatTime = (datetime: string): string => {
  return new Date(datetime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>
```

## **State Flow Patterns**

### **Unidirectional Data Flow**
```typescript
// Data flows in one direction:
// Store → Home.vue → Child Components → Events → Home.vue → Composables → Store

/*
┌─────────────┐
│    Store    │ ← ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
└─────────────┘                                    │
       │                                           │
       ▼ (props)                                   │
┌─────────────┐                                    │
│  Home.vue   │                                    │
│(Orchestrator)│                                   │
└─────────────┘                                    │
       │                                           │
       ▼ (props)                                   │
┌─────────────┐                                    │
│   Child     │                                    │
│ Component   │                                    │
└─────────────┘                                    │
       │                                           │
       ▼ (events)                               (update)
┌─────────────┐                                    │
│ Home.vue    │                                    │
│ (handlers)  │                                    │
└─────────────┘                                    │
       │                                           │
       ▼ (method calls)                            │
┌─────────────┐                                    │
│ Composables │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
│   & API     │
└─────────────┘
*/
```

### **Error Handling Flow**
```typescript
// composables/useErrorHandling.ts
export const useErrorHandling = () => {
  const uiStore = useUIStore();

  const handleError = (error: unknown, context: string): void => {
    console.error(`Error in ${context}:`, error);
    
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    
    uiStore.addNotification({
      type: 'error',
      title: 'Error',
      message: `${context}: ${message}`
    });
  };

  const handleSuccess = (message: string, title = 'Success'): void => {
    uiStore.addNotification({
      type: 'success',
      title,
      message
    });
  };

  return {
    handleError,
    handleSuccess
  };
};

// Usage in Home.vue
const { handleError, handleSuccess } = useErrorHandling();

const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    if (eventModalMode.value === 'create') {
      await createBooking(data);
      handleSuccess('Booking created successfully');
    } else {
      const booking = eventModalData.value as Booking;
      await updateBooking(booking.id, data);
      handleSuccess('Booking updated successfully');
    }
    
    uiStore.closeModal('eventModal');
  } catch (error) {
    handleError(error, 'Save Booking');
  }
};
```

This reference provides comprehensive patterns for implementing the component orchestration architecture with Home.vue as the central coordinator, managing state flow between smart and dumb components while maintaining clear separation of concerns.