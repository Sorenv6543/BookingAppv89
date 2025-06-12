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
          :properties="propertiesMap"
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
          <!-- Calendar Controls - Simple version since CalendarControls component may not exist -->
          <div class="d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" @click="handlePrevious" class="mr-2" />
            <v-btn 
              variant="outlined" 
              @click="handleGoToday" 
              class="mr-2"
            >
              Today
            </v-btn>
            <v-btn icon="mdi-arrow-right" variant="text" @click="handleNext" class="mr-4" />
            
            <div class="text-h6">{{ formattedDate }}</div>
            
            <v-spacer></v-spacer>
            
            <v-btn-toggle v-model="currentView" mandatory class="ml-4">
              <v-btn value="dayGridMonth">Month</v-btn>
              <v-btn value="timeGridWeek">Week</v-btn>
              <v-btn value="timeGridDay">Day</v-btn>
            </v-btn-toggle>
          </div>
        </div>

        <FullCalendar
          ref="calendarRef"
          :bookings="filteredBookings"
          :properties="propertiesMap"
          :loading="loading"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @create-booking="handleCreateBookingFromCalendar"
          @update-booking="handleUpdateBooking"
        />
      </v-col>
    </v-row>

    <!-- Global Modals (managed by UI state) -->
    <BookingForm
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @delete="handleEventModalDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';
import Sidebar from './Sidebar.vue';
import FullCalendar from './FullCalendar.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';

// State management
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';

// Business logic composables
import { useBookings } from '@/composables/useBookings';
import { useProperties } from '@/composables/useProperties';
import { useCalendarState } from '@/composables/useCalendarState';

// Types
import type { Booking, Property, BookingFormData } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================

const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
const { xs } = useDisplay();

// ============================================================================
// COMPOSABLES - BUSINESS LOGIC
// ============================================================================

const { 
  loading: bookingsLoading, 
  createBooking, 
  updateBooking, 
  deleteBooking,
} = useBookings();

const { 
  loading: propertiesLoading, 
  fetchAllProperties
} = useProperties();

const {
  currentView,
  currentDate,
  filterBookings,
  setCalendarView,
  goToDate,
  goToToday,
  next,
  prev,
  clearPropertyFilters,
  togglePropertyFilter
} = useCalendarState();

// ============================================================================
// LOCAL STATE
// ============================================================================

const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);
const sidebarOpen = ref(!xs.value);
const selectedPropertyFilter = ref<string | null>(null);

// ============================================================================
// COMPUTED STATE - DERIVED DATA
// ============================================================================

const loading = computed(() => 
  bookingsLoading.value || 
  propertiesLoading.value || 
  uiStore.isLoading('bookings') || 
  uiStore.isLoading('properties')
);

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return currentDate.value.toLocaleDateString('en-US', options);
});

// Properties data
const propertiesMap = computed(() => {
  const map = new Map<string, Property>();
  
  if (propertyStore.properties instanceof Map) {
    return propertyStore.properties;
  }
  
  propertyStore.propertiesArray.forEach(property => {
    if (property && property.id) {
      map.set(property.id, property);
    }
  });
  
  return map;
});

// Today's turn bookings
const todayTurns = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const turns = new Map<string, Booking>();
  
  bookingStore.bookingsArray.forEach(booking => {
    if (
      booking.booking_type === 'turn' &&
      new Date(booking.checkout_date) >= today &&
      new Date(booking.checkout_date) < tomorrow
    ) {
      turns.set(booking.id, booking);
    }
  });
  
  return turns;
});

// Upcoming cleanings
const upcomingCleanings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  
  const cleanings = new Map<string, Booking>();
  
  bookingStore.bookingsArray.forEach(booking => {
    const checkoutDate = new Date(booking.checkout_date);
    if (checkoutDate >= today && checkoutDate <= inOneWeek) {
      cleanings.set(booking.id, booking);
    }
  });
  
  return cleanings;
});

// Filtered bookings based on current filters
const filteredBookings = computed(() => {
  let bookings = Array.from(bookingStore.bookings.values());
  
  // Apply property filter if selected
  if (selectedPropertyFilter.value) {
    bookings = bookings.filter(booking => booking.property_id === selectedPropertyFilter.value);
  }
  
  // Apply calendar state filters
  bookings = filterBookings(bookings);
  
  // Convert to Map for components that expect Map format
  const map = new Map<string, Booking>();
  bookings.forEach(booking => {
    map.set(booking.id, booking);
  });
  
  return map;
});

// ============================================================================
// UI STATE - MODAL MANAGEMENT
// ============================================================================

// Event Modal
const eventModalOpen = computed(() => uiStore.isModalOpen('eventModal'));
const eventModalMode = computed(() => {
  const modal = uiStore.getModalState('eventModal');
  return (modal?.mode as 'create' | 'edit') || 'create';
});
const eventModalData = computed(() => {
  const modal = uiStore.getModalState('eventModal');
  return modal?.data || null;
});

// ============================================================================
// SIDEBAR EVENT HANDLERS
// ============================================================================

const handleNavigateToBooking = (bookingId: string): void => {
  const booking = bookingStore.getBookingById(bookingId);
  if (booking) {
    const bookingDate = new Date(booking.checkout_date);
    handleNavigateToDate(bookingDate);
    
    // Highlight the booking (if calendar API allows)
    setTimeout(() => {
      const calendarApi = calendarRef.value?.getApi?.();
      if (calendarApi) {
        const event = calendarApi.getEventById(bookingId);
        if (event) {
          // Add a highlighted class for visual indication
          event.setProp('classNames', [...event.classNames, 'highlighted']);
          
          // Remove the highlight after a few seconds
          setTimeout(() => {
            event.setProp('classNames', event.classNames.filter(c => c !== 'highlighted'));
          }, 3000);
        }
      }
    }, 100);
  }
};

const handleNavigateToDate = (date: Date): void => {
  goToDate(date);
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(date);
  }
};

const handleFilterByProperty = (propertyId: string | null): void => {
  selectedPropertyFilter.value = propertyId;
  if (propertyId) {
    togglePropertyFilter(propertyId);
  } else {
    clearPropertyFilters();
  }
  uiStore.setPropertyFilter(propertyId);
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

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    booking_type: 'standard' // Default to standard booking
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
    
    uiStore.addNotification('success', 'Booking Updated', 'Booking dates have been updated successfully.');
  } catch (error) {
    console.error('Failed to update booking:', error);
    dropInfo.revert();
    
    uiStore.addNotification('error', 'Update Failed', 'Failed to update booking dates. Please try again.');
  }
};

const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string }): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: data.start,
    checkin_date: data.end,
    property_id: data.propertyId,
    booking_type: 'standard' // Default to standard booking
  };
  
  handleCreateBooking(bookingData);
};

const handleUpdateBooking = async (data: { id: string; start: string; end: string }): Promise<void> => {
  try {
    await updateBooking(data.id, {
      checkout_date: data.start,
      checkin_date: data.end
    });
    
    uiStore.addNotification('success', 'Booking Updated', 'Booking dates have been updated successfully.');
  } catch (error) {
    console.error('Failed to update booking:', error);
    
    uiStore.addNotification('error', 'Update Failed', 'Failed to update booking. Please try again.');
    
    // Refresh the calendar to revert the UI
    calendarRef.value?.refreshEvents?.();
  }
};

// ============================================================================
// CALENDAR CONTROL HANDLERS
// ============================================================================

const handleGoToday = (): void => {
  goToToday();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(currentDate.value);
  }
};

const handlePrevious = (): void => {
  prev();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(currentDate.value);
  }
};

const handleNext = (): void => {
  next();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(currentDate.value);
  }
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
      uiStore.addNotification('success', 'Booking Created', 'New booking has been created successfully.');
    } else {
      const booking = eventModalData.value as Booking;
      await updateBooking(booking.id, data);
      uiStore.addNotification('success', 'Booking Updated', 'Booking has been updated successfully.');
    }
    
    uiStore.closeModal('eventModal');
    
    // Refresh calendar events
    calendarRef.value?.refreshEvents?.();
  } catch (error) {
    console.error('Failed to save booking:', error);
    uiStore.addNotification('error', 'Save Failed', 'Failed to save booking. Please try again.');
  }
};

const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  try {
    await deleteBooking(bookingId);
    uiStore.closeModal('eventModal');
    uiStore.addNotification('success', 'Booking Deleted', 'Booking has been deleted successfully.');
    
    // Refresh calendar events
    calendarRef.value?.refreshEvents?.();
  } catch (error) {
    console.error('Failed to delete booking:', error);
    uiStore.addNotification('error', 'Delete Failed', 'Failed to delete booking. Please try again.');
  }
};

// ============================================================================
// LIFECYCLE & WATCHERS
// ============================================================================

// Initialize data on mount
onMounted(async () => {
  try {
    // Set loading state
    uiStore.setLoading('bookings', true);
    uiStore.setLoading('properties', true);
    
    // Fetch data
    await Promise.all([
      fetchAllProperties(),
      bookingStore.fetchBookings()
    ]);
    
    // Clear loading state
    uiStore.setLoading('bookings', false);
    uiStore.setLoading('properties', false);
  } catch (error) {
    console.error('Failed to initialize data:', error);
    uiStore.addNotification('error', 'Initialization Failed', 'Failed to load data. Please refresh the page.');
    
    // Clear loading state
    uiStore.setLoading('bookings', false);
    uiStore.setLoading('properties', false);
  }
});

// Watch for changes in current view
watch(currentView, (newView) => {
  setCalendarView(newView);
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.changeView(newView);
  }
});

// Watch for changes in selected property filter
watch(selectedPropertyFilter, (newPropertyId) => {
  // This will trigger the recomputation of filteredBookings
  uiStore.setPropertyFilter(newPropertyId);
});

// Watch for display size changes and adjust sidebar
watch(xs, (isExtraSmall) => {
  sidebarOpen.value = !isExtraSmall;
});

// Cleanup on unmount
onUnmounted(() => {
  // Clear any event listeners or timers if needed
});
</script>

<style scoped>
.home-container {
  height: 100vh;
  overflow: hidden;
}

.fill-height {
  height: 100%;
}

.sidebar-column {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
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
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
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

/* Dark mode support */
:deep(.v-theme--dark) .sidebar-column,
:deep(.v-theme--dark) .calendar-header {
  border-color: rgba(255, 255, 255, 0.12);
}
</style> 