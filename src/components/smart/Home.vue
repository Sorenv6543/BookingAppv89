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
          :current-view="currentView"
          :current-date="currentDate"
          @date-select="handleDateSelect"
          @event-click="handleEventClick"
          @event-drop="handleEventDrop"
          @event-resize="handleEventResize"
          @view-change="handleCalendarViewChange"
          @date-change="handleCalendarDateChange"
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

    <!-- PropertyModal integration -->
    <PropertyModal
      :open="propertyModalOpen"
      :mode="propertyModalMode"
      :property="propertyModalData"
      @close="handlePropertyModalClose"
      @save="handlePropertyModalSave"
      @delete="handlePropertyModalDelete"
    />

    <!-- Confirmation Dialog -->
    <ConfirmationDialog
      :open="confirmDialogOpen"
      :title="confirmDialogTitle"
      :message="confirmDialogMessage"
      :confirm-text="confirmDialogConfirmText"
      :cancel-text="confirmDialogCancelText"
      :dangerous="confirmDialogDangerous"
      @confirm="handleConfirmDialogConfirm"
      @cancel="handleConfirmDialogCancel"
      @close="handleConfirmDialogClose"
    />

    <!-- NotificationSystem will be implemented in a separate task -->
    <!-- <NotificationSystem /> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';
import Sidebar from './Sidebar.vue';
import FullCalendar from './FullCalendar.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmationDialog from '@/components/dumb/ConfirmationDialog.vue';

// TODO: Import these components when they're created
// import PropertyModal from '@/components/dumb/PropertyModal.vue';
// import NotificationSystem from '@/components/dumb/NotificationSystem.vue';

// State management
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';

// Business logic composables
import { useBookings } from '@/composables/useBookings';
import { useProperties } from '@/composables/useProperties';
import { useCalendarState } from '@/composables/useCalendarState';

// Types
import type { Booking, Property, BookingFormData, PropertyFormData } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Import event logger for component communication
import eventLogger from '@/composables/useComponentEventLogger';

// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================

const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const { xs } = useDisplay();

// ============================================================================
// COMPOSABLES - BUSINESS LOGIC
// ============================================================================

const { 
  loading: bookingsLoading, 
  createBooking, 
  updateBooking, 
  deleteBooking,
  fetchAllBookings
} = useBookings();

const { 
  loading: propertiesLoading, 
  createProperty,
  updateProperty,
  deleteProperty,
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

// Property Modal
const propertyModalOpen = computed(() => uiStore.isModalOpen('propertyModal'));
const propertyModalMode = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return (modal?.mode as 'create' | 'edit') || 'create';
});
const propertyModalData = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return modal?.data || null;
});

// Confirmation Dialog
const confirmDialogOpen = computed(() => uiStore.isConfirmDialogOpen('confirmDialog'));
const confirmDialogTitle = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.title || 'Confirm';
});
const confirmDialogMessage = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.message || 'Are you sure you want to proceed?';
});
const confirmDialogConfirmText = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.confirmText || 'Confirm';
});
const confirmDialogCancelText = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.cancelText || 'Cancel';
});
const confirmDialogDangerous = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.dangerous || false;
});
const confirmDialogData = computed(() => {
  const dialog = uiStore.getConfirmDialogState('confirmDialog');
  return dialog?.data || null;
});

// ============================================================================
// SIDEBAR EVENT HANDLERS
// ============================================================================

const handleNavigateToBooking = (bookingId: string): void => {
  // Log receiving event from Sidebar
  eventLogger.logEvent(
    'Sidebar', 
    'Home', 
    'navigateToBooking', 
    bookingId, 
    'receive'
  );
  
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
  // Log receiving event from Sidebar
  eventLogger.logEvent(
    'Sidebar', 
    'Home', 
    'navigateToDate', 
    date, 
    'receive'
  );
  
  goToDate(date);
  
  // Log emitting event to FullCalendar
  eventLogger.logEvent(
    'Home', 
    'FullCalendar', 
    'goToDate', 
    date, 
    'emit'
  );
  
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(date);
  }
};

const handleFilterByProperty = (propertyId: string | null): void => {
  // Log receiving event from Sidebar
  eventLogger.logEvent(
    'Sidebar', 
    'Home', 
    'filterByProperty', 
    propertyId, 
    'receive'
  );
  
  selectedPropertyFilter.value = propertyId;
  if (propertyId) {
    togglePropertyFilter(propertyId);
  } else {
    clearPropertyFilters();
  }
  uiStore.setPropertyFilter(propertyId);
  
  // Log data update to FullCalendar
  eventLogger.logEvent(
    'Home', 
    'FullCalendar', 
    'filteredBookingsUpdate', 
    { propertyId, count: filteredBookings.value.size }, 
    'emit'
  );
};

const handleCreateBooking = (data?: Partial<BookingFormData>): void => {
  // Log receiving event from Sidebar
  eventLogger.logEvent(
    'Sidebar', 
    'Home', 
    'createBooking', 
    data, 
    'receive'
  );
  
  uiStore.openModal('eventModal', 'create', data);
};

const handleCreateProperty = (): void => {
  // Log receiving event from Sidebar
  eventLogger.logEvent(
    'Sidebar', 
    'Home', 
    'createProperty', 
    null, 
    'receive'
  );
  
  uiStore.openModal('propertyModal', 'create');
};

// ============================================================================
// CALENDAR EVENT HANDLERS
// ============================================================================

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  // Log receiving event from FullCalendar
  eventLogger.logEvent(
    'FullCalendar', 
    'Home', 
    'dateSelect', 
    { start: selectInfo.startStr, end: selectInfo.endStr }, 
    'receive'
  );
  
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
  };

  // Open the booking form
  uiStore.openModal('eventModal', 'create', bookingData);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  // Log receiving event from FullCalendar
  eventLogger.logEvent(
    'FullCalendar', 
    'Home', 
    'eventClick', 
    { id: clickInfo.event.id }, 
    'receive'
  );
  
  const booking = bookingStore.getBookingById(clickInfo.event.id);
  if (booking) {
    uiStore.openModal('eventModal', 'edit', booking);
  }
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

const handleEventResize = async (resizeInfo: any): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  try {
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr
    });
    
    uiStore.addNotification('success', 'Booking Updated', 'Booking duration has been updated successfully.');
  } catch (error) {
    console.error('Failed to resize booking:', error);
    resizeInfo.revert();
    
    uiStore.addNotification('error', 'Update Failed', 'Failed to update booking duration. Please try again.');
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

const handleCalendarViewChange = (view: string): void => {
  currentView.value = view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
  setCalendarView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
};

const handleCalendarDateChange = (date: Date): void => {
  currentDate.value = date;
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
  // Instead of directly deleting, show a confirmation dialog
  uiStore.openConfirmDialog(
    'confirmDialog',
    'Delete Booking',
    'Are you sure you want to delete this booking? This action cannot be undone.',
    {
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: { action: 'deleteBooking', id: bookingId }
    }
  );
  
  // Close the event modal after confirming deletion
  uiStore.closeModal('eventModal');
};

// Property Modal Handlers
// These handlers will be used when the PropertyModal component is created
const handlePropertyModalClose = (): void => {
  uiStore.closeModal('propertyModal');
};

const handlePropertyModalSave = async (data: PropertyFormData): Promise<void> => {
  try {
    if (propertyModalMode.value === 'create') {
      await createProperty(data);
      uiStore.addNotification('success', 'Property Created', 'New property has been created successfully.');
    } else {
      const property = propertyModalData.value as Property;
      await updateProperty(property.id, data);
      uiStore.addNotification('success', 'Property Updated', 'Property has been updated successfully.');
    }
    
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to save property:', error);
    uiStore.addNotification('error', 'Save Failed', 'Failed to save property. Please try again.');
  }
};

const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  // Instead of directly deleting, show a confirmation dialog
  uiStore.openConfirmDialog(
    'confirmDialog',
    'Delete Property',
    'Are you sure you want to delete this property? This action cannot be undone.',
    {
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: { action: 'deleteProperty', id: propertyId }
    }
  );
};

// Confirmation Dialog Handlers
const handleConfirmDialogConfirm = (): void => {
  const data = confirmDialogData.value;
  
  if (!data) return;
  
  // Handle different confirmation actions
  switch (data.action) {
    case 'deleteProperty':
      deleteProperty(data.id)
        .then(() => {
          uiStore.addNotification('success', 'Property Deleted', 'Property has been deleted successfully.');
        })
        .catch((error) => {
          console.error('Failed to delete property:', error);
          uiStore.addNotification('error', 'Delete Failed', 'Failed to delete property. Please try again.');
        });
      break;
      
    case 'deleteBooking':
      deleteBooking(data.id)
        .then(() => {
          uiStore.addNotification('success', 'Booking Deleted', 'Booking has been deleted successfully.');
          // Refresh calendar events
          calendarRef.value?.refreshEvents?.();
        })
        .catch((error) => {
          console.error('Failed to delete booking:', error);
          uiStore.addNotification('error', 'Delete Failed', 'Failed to delete booking. Please try again.');
        });
      break;
      
    default:
      console.warn('Unknown confirmation action:', data.action);
  }
  
  uiStore.closeConfirmDialog('confirmDialog');
};

const handleConfirmDialogCancel = (): void => {
  uiStore.closeConfirmDialog('confirmDialog');
};

const handleConfirmDialogClose = (): void => {
  uiStore.closeConfirmDialog('confirmDialog');
};

// ============================================================================
// LIFECYCLE & WATCHERS
// ============================================================================

// Initialize data on mount
onMounted(async () => {
  // Enable event logger for testing
  eventLogger.setEnabled(true);
  
  // Log component mounting
  eventLogger.logEvent(
    'System', 
    'Home', 
    'mounted', 
    { timestamp: Date.now() }, 
    'receive'
  );
  
  try {
    // Set loading state
    uiStore.setLoading('bookings', true);
    uiStore.setLoading('properties', true);
    
    // Fetch data
    if (authStore.isAuthenticated) {
      await Promise.all([
        fetchAllProperties(),
        fetchAllBookings()
      ]);
    }
    
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

// Watch for authentication changes
watch(() => authStore.isAuthenticated, async (isAuthenticated) => {
  if (isAuthenticated) {
    try {
      uiStore.setLoading('bookings', true);
      uiStore.setLoading('properties', true);
      
      await Promise.all([
        fetchAllProperties(),
        fetchAllBookings()
      ]);
      
      uiStore.setLoading('bookings', false);
      uiStore.setLoading('properties', false);
    } catch (error) {
      console.error('Failed to fetch data after authentication:', error);
      uiStore.addNotification('error', 'Data Fetch Failed', 'Failed to load your data after login. Please refresh the page.');
      
      uiStore.setLoading('bookings', false);
      uiStore.setLoading('properties', false);
    }
  } else {
    // Clear data when user logs out
    propertyStore.clearAll();
    bookingStore.clearAll();
    userStore.clearUserPreferences();
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
/* Container theming */
.home-container {
  height: 100vh;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-on-background));
}

.fill-height {
  height: 100%;
}

/* Sidebar column theming */
.sidebar-column {
  background: rgb(var(--v-theme-surface));
  border-right: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  height: 100vh;
  overflow-y: auto;
}

/* Calendar column theming */
.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-background));
}

/* Calendar header theming */
.calendar-header {
  padding: 16px;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  display: flex;
  align-items: center;
  min-height: 64px;
  color: rgb(var(--v-theme-on-surface));
}

.mobile-hidden {
  display: none;
}

@media (min-width: 1264px) {
  .mobile-hidden {
    display: block;
  }
}

/* Card theming */
:deep(.v-card) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.v-card:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-on-surface), 0.15);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
}

/* Button theming */
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.v-btn--variant-elevated),
:deep(.v-btn--variant-flat) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}

:deep(.v-btn--variant-outlined) {
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-btn--variant-text) {
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}

/* Text theming */
:deep(.text-h6),
:deep(.text-h5),
:deep(.text-h4) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.text-subtitle-1),
:deep(.text-subtitle-2) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}

/* Icon theming */
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-btn .v-icon) {
  color: inherit !important;
}

/* Badge theming */
:deep(.v-badge .v-badge__badge) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
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