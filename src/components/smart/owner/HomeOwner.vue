<!-- 
🏠 ROLE-SPECIFIC INTERFACES
👤 OWNER INTERFACE
src/components/smart/owner/HomeOwner.vue - 

✅ FILTERED VIEW - Owner sees only their data
✅ Filters properties by owner_id
✅ Filters bookings by owner_id
✅ Prevents access to other owners' data
 -->

<template>
  <div class="home-owner-layout">
    <!-- Brand Overlay - Fixed on top of everything -->


    <!-- Main App Header -->
    <v-app-bar
      order="0"
      app
      flat
      height="56"
      class="main-app-header"
      color="white"
    >
      <v-app-bar-nav-icon
        color="black"
        @click="toggleSidebar"
      />
      <!--logo-->
      <v-app-bar-title class="app-title">
        <div class="brand-container">
          <div class="brand-icon">
            C
          </div>
          <span class="brand-text">Claro</span>
        </div>
      </v-app-bar-title>
      <!--logo-->
    </v-app-bar>

    <!-- Owner Sidebar -->
    <OwnerSidebar
      v-model="sidebarOpen"
      :temporary="mobile"
      scrim="true"
      scrim-color="scrimColor"   
      scrim-opacity="0.9"
      scrim-blur-amount="20"
      scrim-blur-radius="20"
     


      @create-booking="handleCreateBooking"
      @create-property="handleCreateProperty"
      v-bind:style="{ height: '100vh' }"
    />

    <!-- Main Calendar Area -->
    <div class="calendar-main-container">
      <div class="calendar-layout">
        <!-- Calendar Header - Fixed height -->
        <v-card
          flat
          density="compact"
          class="calendar-header-card flex-shrink-0"
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <!-- Left Navigation Arrow -->
              <v-btn
                icon="mdi-chevron-left"
                variant="text"
                density="comfortable"
                size="default"
                class="nav-arrow-simple"
                @click="handlePrevious"
              />
              
              <!-- Centered Month Display -->
              <div class="month-pill-display">
                {{ formattedMonthYear }}
              </div>
              
              <!-- Right Navigation Arrow -->
              <v-btn
                icon="mdi-chevron-right"
                variant="text"
                density="comfortable"
                size="default"
                class="nav-arrow-simple"
                @click="handleNext"
              />
            </div>
          </v-card-text>
        </v-card>

        <!-- Calendar Content - Flexible height -->
        <div class="calendar-content flex-grow-1">
          <OwnerCalendar
            ref="calendarRef"
            :bookings="ownerFilteredBookings"
            :loading="loading"
            :current-view="currentView"
            :current-date="currentDate"
            :properties="ownerPropertiesMap"
            @date-select="handleDateSelect"
            @event-click="handleEventClick"
            @event-drop="handleEventDrop"
            @event-resize="handleEventResize"
            @view-change="handleCalendarViewChange"
            @date-change="handleCalendarDateChange"
            @create-booking="handleCreateBookingFromCalendar"
            @update-booking="handleUpdateBooking"
          />
        </div>
      </div>
    </div>

    <!-- Owner-focused Modals -->
    <BookingForm
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
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

    <!-- Custom Scrim Overlay (doesn't affect main FAB) -->
    <div
      v-if="mobile && speedDialOpen"
      class="speed-dial-custom-scrim"
      @click="speedDialOpen = false"
    ></div>

    <!-- Mobile Enhanced Speed Dial FAB -->
    <v-speed-dial
      v-if="mobile"
      v-model="speedDialOpen"
      location="bottom end"
      transition="scale-y-transition"
      :open-on-hover="false"
      :scrim="false"
    >
      <!-- Main FAB Button (Activator) -->
      <template #activator="{ props, isActive }">
        <v-fab
          v-bind="props"
          :icon="isActive ? 'mdi-close' : 'mdi-plus'"
          size="large"
          color="primary"
          rounded="circle"
          app
          appear
        />
      </template>

      <!-- Speed Dial Actions -->
      <!-- Add Turn -->
      <div class="speed-dial-action">
        <span class="text-body-2 font-weight-medium">Add Turn</span>
        <v-fab
          icon="mdi-rotate-right"
          size="small"
          color="warning"
          rounded="circle"
          @click="handleCreateTurn"
        />
      </div>
      
      <!-- Add Property -->
      <div class="speed-dial-action">
        <span class="text-body-2 font-weight-medium">Add House</span>
        <v-fab
          icon="mdi-home-plus"
          size="small" 
          color="info"
          rounded="circle"
          @click="handleCreateProperty"
        />
      </div>
      
      <!-- Add Booking -->
      <div class="speed-dial-action">
        <span class="text-body-2 font-weight-medium">Add Booking</span>
        <v-fab
          icon="mdi-calendar-plus"
          size="default"
          color="success"
          rounded="circle"
          @click="handleCreateBooking"
        />
      </div>
      
      <!-- Dashboard -->
      <div class="speed-dial-action">
        <span class="text-body-2 font-weight-medium">Dashboard</span>
        <v-fab
          icon="mdi-view-dashboard"
          size="large"
          color="secondary"
          rounded="circle"
          @click="toggleSidebar"
        />
      </div>
    </v-speed-dial>
  </div>
</template>

<script setup lang="ts">
//import { useRealtimeSync } from '@/composables/supabase/useRealtimeSync';


// Real-time sync will auto-initialize when user is authenticated
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useDisplay } from 'vuetify';

// Owner-specific components
import OwnerSidebar from '@/components/smart/owner/OwnerSidebar.vue';
import OwnerCalendar from '@/components/smart/owner/OwnerCalendar.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue';

// State management
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';

import { useAuthStore } from '@/stores/auth';
import { useCalendarState } from '@/composables/shared/useCalendarState';
  // Business logic composables

import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
// Types
import type { Booking, Property, BookingFormData, PropertyFormData,  } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';


// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================

//useRealtimeSync(); // Just call it for side effects
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { xs, md, lg, mobile, sm } = useDisplay();

// ============================================================================
// COMPOSABLES - BUSINESS LOGIC
// ============================================================================
const { 
  loading: bookingsLoading, 
  createMyBooking, 
  updateMyBooking,
  deleteMyBooking
} = useOwnerBookings();

const { 
  loading: propertiesLoading, 
  createMyProperty,
  updateMyProperty,
  deleteMyProperty,
} = useOwnerProperties();

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
const calendarRef = ref<InstanceType<typeof OwnerCalendar> | null>(null);
const sidebarOpen = ref(!xs.value);
const selectedPropertyFilter = ref<string | null>(null);
const speedDialOpen = ref(false);
const scrimColor = ref('rgba(0, 0, 0, 0.9)');

// ============================================================================
// OWNER-SPECIFIC DATA ACCESS
// ============================================================================

// Get current owner's user ID with debugging
const currentOwnerId = computed(() => {
  const userId = authStore.user?.id;
  return userId;
});

// Check if user is authenticated and is an owner
const isOwnerAuthenticated = computed(() => {
  const authenticated = !!(authStore.isAuthenticated && 
         authStore.user?.role === 'owner' && 
         currentOwnerId.value);
  
  return authenticated;
});

// ============================================================================
// COMPUTED STATE - OWNER-FILTERED DATA
// ============================================================================

// Fix the infinite loop by using a more stable loading computed
const loading = computed(() => {
  // Use a simple OR operation without excessive call counting
  // The call counting was useful for debugging but caused performance issues
  return bookingsLoading.value || 
    propertiesLoading.value || 
    uiStore.isLoading('bookings') || 
    uiStore.isLoading('properties');
});

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    month: 'long'
  };
  return currentDate.value.toLocaleDateString('en-US', options);
});

const formattedMonthYear = computed(() => {
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric'
  };
  return currentDate.value.toLocaleDateString('en-US', options);
});

// Owner's properties only - stabilized to prevent loops
const ownerPropertiesMap = computed(() => {
  const map = new Map<string, Property>();
  
  if (!isOwnerAuthenticated.value || !currentOwnerId.value) {
    return map;
  }

  // Filter properties by owner_id
  if (propertyStore.properties instanceof Map) {
    propertyStore.properties.forEach((property, id) => {
      if (property.owner_id === currentOwnerId.value) {
        map.set(id, property);
      }
    });
  } else {
    propertyStore.propertiesArray
      .filter(property => property.owner_id === currentOwnerId.value)
      .forEach(property => {
        if (property && property.id) {
          map.set(property.id, property);
        }
      });
  }
  
  return map;
});

// Owner's bookings only - stabilized with better error handling
const ownerBookingsMap = computed(() => {
  const map = new Map<string, Booking>();
  
  if (!isOwnerAuthenticated.value || !currentOwnerId.value) {
    return map;
  }

  try {
    // Filter bookings by owner_id
    const ownerBookings = bookingStore.bookingsArray
      .filter(booking => booking.owner_id === currentOwnerId.value);
      
    ownerBookings.forEach(booking => {
      if (booking && booking.id) {
        map.set(booking.id, booking);
      }
    });
  } catch (error) {
    console.error('❌ [HomeOwner] Error filtering owner bookings:', error);
  }
  
  return map;
});

// Owner's today's turn bookings - stabilized
const ownerTodayTurns = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const turns = new Map<string, Booking>();
  
  if (!isOwnerAuthenticated.value) {
    return turns;
  }

  try {
    // Filter owner's bookings for today's turns
    Array.from(ownerBookingsMap.value.values()).forEach(booking => {
      if (
        booking.booking_type === 'turn' &&
        new Date(booking.checkout_date) >= today &&
        new Date(booking.checkout_date) < tomorrow
      ) {
        turns.set(booking.id, booking);
      }
    });
  } catch (error) {
    console.error('❌ [HomeOwner] Error filtering today turns:', error);
  }
  
  return turns;
});

// Owner's upcoming cleanings - stabilized
const ownerUpcomingCleanings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  
  const cleanings = new Map<string, Booking>();
  
  if (!isOwnerAuthenticated.value) {
    return cleanings;
  }

  try {
    // Filter owner's bookings for upcoming cleanings
    Array.from(ownerBookingsMap.value.values()).forEach(booking => {
      const checkoutDate = new Date(booking.checkout_date);
      if (checkoutDate >= today && checkoutDate <= inOneWeek) {
        cleanings.set(booking.id, booking);
      }
    });
  } catch (error) {
    console.error('❌ [HomeOwner] Error filtering upcoming cleanings:', error);
  }
  
  return cleanings;
});

// Owner's filtered bookings - stabilized with better error handling
const ownerFilteredBookings = computed(() => {
  const map = new Map<string, Booking>();
  
  try {
    let bookings = Array.from(ownerBookingsMap.value.values());
    
    // Apply property filter if selected (within owner's properties)
    if (selectedPropertyFilter.value) {
      bookings = bookings.filter(booking => 
        booking.property_id === selectedPropertyFilter.value &&
        ownerPropertiesMap.value.has(booking.property_id)
      );
    }
    
    // Apply calendar state filters
    bookings = filterBookings(bookings);
    
    // Convert to Map for components that expect Map format
    bookings.forEach(booking => {
      map.set(booking.id, booking);
    });
  } catch (error) {
    console.error('❌ [HomeOwner] Error filtering bookings:', error);
  }
  
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
  return modal?.data as Booking | undefined;
});

// Property Modal
const propertyModalOpen = computed(() => uiStore.isModalOpen('propertyModal'));
const propertyModalMode = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return (modal?.mode as 'create' | 'edit') || 'create';
});
const propertyModalData = computed(() => {
  const modal = uiStore.getModalState('propertyModal');
  return modal?.data as Property | undefined;
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
  return dialog?.data;
});

// ============================================================================
// OWNER-SPECIFIC EVENT HANDLERS
// ============================================================================

const handleNavigateToBooking = (bookingId: string): void => {
      // Log receiving event from OwnerSidebar
    eventLogger.logEvent(
      'OwnerSidebar', 
    'HomeOwner', 
    'navigateToBooking', 
    bookingId, 
    'receive'
  );
  
  // Only navigate to owner's bookings
  const booking = ownerBookingsMap.value.get(bookingId);
  if (booking) {
    const bookingDate = new Date(booking.checkout_date);
    handleNavigateToDate(bookingDate);
    
    // Highlight the booking
    setTimeout(() => {
      const calendarApi = calendarRef.value?.getApi?.();
      if (calendarApi) {
        const event = calendarApi.getEventById(bookingId);
        if (event) {
          event.setProp('classNames', [...event.classNames, 'highlighted']);
          setTimeout(() => {
            event.setProp('classNames', event.classNames.filter(c => c !== 'highlighted'));
          }, 3000);
        }
      }
    }, 100);
  } else {
    // Owner-friendly error message
    console.warn('Booking not found in your properties');
  }
};

const handleNavigateToDate = (date: Date): void => {
      eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'navigateToDate', 
    date, 
    'receive'
  );
  
  goToDate(date);
  
  eventLogger.logEvent(
    'HomeOwner', 
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
      eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'filterByProperty', 
    propertyId, 
    'receive'
  );
  
  // Only allow filtering by owner's properties
  if (propertyId && !ownerPropertiesMap.value.has(propertyId)) {
    console.warn('Cannot filter by property not owned by current user');
    return;
  }
  
  selectedPropertyFilter.value = propertyId;
  if (propertyId) {
    togglePropertyFilter(propertyId);
  } else {
    clearPropertyFilters();
  }
  uiStore.setPropertyFilter(propertyId);
  
  eventLogger.logEvent(
    'HomeOwner', 
    'FullCalendar', 
    'filteredBookingsUpdate', 
    { propertyId, count: ownerFilteredBookings.value.size }, 
    'emit'
  );
};

const handleCreateBooking = (data?: Partial<BookingFormData>): void => {
      eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'createBooking', 
    data, 
    'receive'
  );

  // Ensure owner_id is set for new bookings
  const bookingData = {
    ...data,
    owner_id: currentOwnerId.value
  };
  
  uiStore.openModal('eventModal', 'create', bookingData);
};

const handleCreateProperty = (): void => {
      eventLogger.logEvent(
      'OwnerSidebar',
      'HomeOwner',
      'createProperty', 
    null, 
    'receive'
  );
  
  // Ensure owner_id is set for new properties
  const propertyData = {
    owner_id: currentOwnerId.value
  };
  
  uiStore.openModal('propertyModal', 'create', propertyData);
};

const handleCreateTurn = (): void => {
  eventLogger.logEvent(
    'SpeedDial',
    'HomeOwner',
    'createTurn', 
    null, 
    'emit'
  );
  
  // Ensure owner_id is set for new turn bookings
  const turnData = {
    owner_id: currentOwnerId.value,
    booking_type: 'turn'
  };
  
  uiStore.openModal('eventModal', 'create', turnData);
};

// ============================================================================
// CALENDAR EVENT HANDLERS
// ============================================================================

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  eventLogger.logEvent(
    'FullCalendar', 
    'HomeOwner', 
    'dateSelect', 
    { start: selectInfo.startStr, end: selectInfo.endStr }, 
    'receive'
  );
  
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
    owner_id: currentOwnerId.value
  };
  
  uiStore.openModal('eventModal', 'create', bookingData);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  eventLogger.logEvent(
    'FullCalendar', 
    'HomeOwner', 
    'eventClick', 
    { id: clickInfo.event.id }, 
    'receive'
  );
  
  // Only allow editing owner's bookings
  const booking = ownerBookingsMap.value.get(clickInfo.event.id);
  if (booking) {
    uiStore.openModal('eventModal', 'edit', { booking });
  } else {
    console.warn('Cannot edit booking not owned by current user');
  }
};

const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  // Verify owner can modify this booking
  if (!ownerBookingsMap.value.has(booking.id)) {
    console.warn('Cannot modify booking not owned by current user');
    dropInfo.revert();
    return;
  }
  
  // Prevent multiple simultaneous updates
  if (bookingsLoading.value) {
    console.warn('Update already in progress');
    dropInfo.revert();
    return;
  }
  
  try {
    // Use nextTick to batch reactive updates
    await nextTick();
    
    const result = await updateMyBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr,
      owner_id: booking.owner_id,
    });
    
    if (!result) {
      throw new Error('Update failed');
    }
    
    // Additional nextTick to ensure DOM updates complete
    await nextTick();
    
  } catch (error) {
    console.error('Failed to update your booking:', error);
    dropInfo.revert();
  }
};

const handleEventResize = async (resizeInfo: { event: { extendedProps: { booking: Booking }; startStr: string; endStr: string }; revert: () => void }): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  // Verify owner can modify this booking
  if (!ownerBookingsMap.value.has(booking.id)) {
    console.warn('Cannot modify booking not owned by current user');
    resizeInfo.revert();
    return;
  }
  
  // Prevent multiple simultaneous updates
  if (bookingsLoading.value) {
    console.warn('Resize update already in progress');
    resizeInfo.revert();
    return;
  }
  
  try {
    // Use nextTick to batch reactive updates
    await nextTick();
    
    const result = await updateMyBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr,
      owner_id: booking.owner_id,
    });
    
    if (!result) {
      throw new Error('Resize update failed');
    }
    
    // Additional nextTick to ensure DOM updates complete
    await nextTick();
    
  } catch (error) {
    console.error('Failed to update your booking:', error);
    resizeInfo.revert();
  }
};

// ============================================================================
// CALENDAR CONTROL HANDLERS
// ============================================================================

const handlePrevious = (): void => {
  prev();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.prev();
  }
};

const handleNext = (): void => {
  next();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.next();
  }
};


const handleViewChange = (view: string): void => {
  // Map display strings to FullCalendar view types
  const calendarView = view === 'Week' ? 'timeGridWeek' : 
                      view === 'Day' ? 'timeGridDay' : 
                      'dayGridMonth';
  setCalendarView(calendarView);
};

const handleCalendarViewChange = (view: string): void => {
  // Map CalendarView to FullCalendar view type
  const calendarView = view === 'week' ? 'timeGridWeek' : 
                      view === 'day' ? 'timeGridDay' : 
                      'dayGridMonth';
  setCalendarView(calendarView);
};

const handleCalendarDateChange = (date: Date): void => {
  goToDate(date);
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.gotoDate(date);
  }
};


const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string | undefined; }): void => {
  const bookingData = {
    ...data,
    owner_id: currentOwnerId.value
  };
  uiStore.openModal('eventModal', 'create', bookingData);
};

const handleUpdateBooking = (data: { id: string; start: string; end: string }): void => {
  // Verify owner can update this booking
  if (!ownerBookingsMap.value.has(data.id)) {
    console.warn('Cannot update booking not owned by current user');
    return;
  }
  
  updateMyBooking(data.id, {
    checkout_date: data.start,
    checkin_date: data.end,
    owner_id: currentOwnerId.value,
  });
};

// ============================================================================
// MODAL EVENT HANDLERS
// ============================================================================

const handleEventModalClose = (): void => {
  uiStore.closeModal('eventModal');
};

const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    // Ensure owner_id is set
    const bookingData = {
      ...data,
      owner_id: currentOwnerId.value
    };
    
    if (eventModalMode.value === 'create') {
      await createMyBooking(bookingData as BookingFormData);
    } else if (eventModalData.value) {
      // Fix: eventModalData.value contains { booking } not the booking directly
      const booking = (eventModalData.value as any)?.booking || eventModalData.value;
      
      console.log('🔍 [HomeOwner] Editing booking:', { 
        bookingId: booking?.id,
        isInOwnerMap: booking?.id ? ownerBookingsMap.value.has(booking.id) : false,
        ownerMapSize: ownerBookingsMap.value.size
      });
      
      // Verify owner can update this booking
      if (!booking?.id || !ownerBookingsMap.value.has(booking.id)) {
        console.error('🚨 [HomeOwner] Booking ownership check failed - booking not found in owner map');
        throw new Error('Cannot update booking not owned by current user');
      }
      await updateMyBooking(booking.id, bookingData as Partial<BookingFormData>);
    }
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('Failed to save your booking:', error);
  }
};

const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  // Verify owner can delete this booking
  if (!ownerBookingsMap.value.has(bookingId)) {
    console.warn('Cannot delete booking not owned by current user');
    return;
  }
  
    uiStore.openConfirmDialog('confirmDialog', {
    title: 'Delete Booking',
    message: 'Are you sure you want to delete this booking? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    dangerous: true,
    data: { type: 'booking', id: bookingId }
  });
};

const handlePropertyModalClose = (): void => {
  uiStore.closeModal('propertyModal');
};

const handlePropertyModalSave = async (data: PropertyFormData): Promise<void> => {
  try {
    // Ensure owner_id is set
    const propertyData = {
      ...data,
      owner_id: currentOwnerId.value
    };
    
    if (propertyModalMode.value === 'create') {
      await createMyProperty(propertyData as PropertyFormData);
    } else if (propertyModalData.value) {
      // Verify owner can update this property
      if (!ownerPropertiesMap.value.has(propertyModalData.value.id)) {
        throw new Error('Cannot update property not owned by current user');
      }
      await updateMyProperty(propertyModalData.value.id, propertyData as Partial<PropertyFormData>);
    }
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to save your property:', error);
  }
};

const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  // Verify owner can delete this property
  if (!ownerPropertiesMap.value.has(propertyId)) {
    console.warn('Cannot delete property not owned by current user');
    return;
  }
  
  uiStore.openConfirmDialog('confirmDialog', {
    title: 'Delete Property',
    message: 'Are you sure you want to delete this property? This will also delete all associated bookings. This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel',
    dangerous: true,
    data: { type: 'property', id: propertyId }
  });
};

// ============================================================================
// CONFIRMATION DIALOG HANDLERS
// ============================================================================

const handleConfirmDialogConfirm = async (): Promise<void> => {
  const data = confirmDialogData.value;
  
  if (data?.type === 'booking' && data?.id) {
    try {
      await deleteMyBooking(data.id as string);
      uiStore.closeModal('eventModal');
    } catch (error) {
      console.error('Failed to delete your booking:', error);
    }
  } else if (data?.type === 'property' && data?.id) {
    try {
      await deleteMyProperty(data.id as string    );
      uiStore.closeModal('propertyModal');
    } catch (error) {
      console.error('Failed to delete your property:', error);
    }
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
// SIDEBAR MANAGEMENT
// ============================================================================

const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value;
};

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

console.log('🔄 [HomeOwner] Script setup running...');

// Watch for template rendering (proper debugging)
watch(isOwnerAuthenticated, (newValue) => {
  console.log('🎨 [HomeOwner] Template will render, isOwnerAuthenticated:', newValue);
}, { immediate: true });

onMounted(async () => {
  console.log('🚀 [HomeOwner] Component mounted successfully!');
  // Wait for auth to be properly initialized
  if (authStore.loading) {
    console.log('⏳ [HomeOwner] Auth store still loading, waiting...');
    const maxWait = 5000; // 5 seconds max
    const startTime = Date.now();
    while (authStore.loading && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  console.log('🔍 [HomeOwner] Auth state after waiting:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    loading: authStore.loading,
    isOwnerAuthenticated: isOwnerAuthenticated.value
  });
  if (isOwnerAuthenticated.value) {
    console.log('✅ [HomeOwner] User is authenticated as owner, loading data...');
    try {
      // Fetch data using store methods directly for better performance
      await Promise.all([
        propertyStore.fetchProperties(),
        bookingStore.fetchBookings()
      ]);
      console.log('✅ [HomeOwner] Owner data loaded successfully');
      
      // Debug data after loading
      console.log('🔍 [HomeOwner] Data state after loading:', {
        allProperties: propertyStore.propertiesArray.length,
        allBookings: bookingStore.bookingsArray.length,
        ownerProperties: ownerPropertiesMap.value.size,
        ownerBookings: ownerBookingsMap.value.size,
        filteredBookings: ownerFilteredBookings.value.size
      });
      
      // Debug booking data specifically
      console.log('🔍 [HomeOwner] Bookings data:', {
        allBookings: bookingStore.bookingsArray.map(b => ({
          id: b.id,
          owner_id: b.owner_id,
          property_id: b.property_id,
          checkout_date: b.checkout_date,
          checkin_date: b.checkin_date
        })),
        currentUserId: currentOwnerId.value
      });
      
    } catch (error) {
      console.error('❌ [HomeOwner] Failed to load your data:', error);
    }
  } else {
    console.warn('⚠️ [HomeOwner] User is not authenticated as owner, skipping data load');
  }
});

onUnmounted(() => {
  // Cleanup if needed
});

// ============================================================================
// RESPONSIVE BEHAVIOR
// ============================================================================

watch(xs, (newValue) => {
  if (newValue) {
    sidebarOpen.value = false;
  }
});

// Watch for authentication changes
watch(isOwnerAuthenticated, async (newValue, oldValue) => {
  console.log('🔄 [HomeOwner] isOwnerAuthenticated changed:', { 
    from: oldValue, 
    to: newValue,
    user: authStore.user
  });
  if (newValue && !oldValue) {
    // User became authenticated - load data
    console.log('✅ [HomeOwner] User became authenticated, loading data...');
    try {
      await Promise.all([
        propertyStore.fetchProperties(),
        bookingStore.fetchBookings()
      ]);
      console.log('✅ [HomeOwner] Data loaded after auth change');
    } catch (error) {
      console.error('❌ [HomeOwner] Failed to load data after auth change:', error);
    }
  } else if (!newValue && oldValue) {
    // User became unauthenticated - could clear data if needed
    console.log('⚠️ [HomeOwner] User became unauthenticated');
  }
});
</script>

<style scoped>
/* ================================================================ */
/* MOBILE-FIRST CALENDAR VIEWPORT LAYOUT */
/* ================================================================ */

.home-owner-layout {
  height: 100%;
  width: 100%;
  display: flex;
}




.calendar-main-container {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.calendar-layout {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.calendar-header-card {
  flex-shrink: 0;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
}

.calendar-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
}

/* Clean Calendar Header Layout */

/* Simple Navigation Arrows */
.nav-arrow-simple {
  border-radius: 8px !important;
  color: #666 !important;
  border: 1px solid #e0e0e0 !important;
  background: #ffffff !important;
}

.nav-arrow-simple:hover {
  background: #f5f5f5 !important;
  color: #333 !important;
  border-color: #ccc !important;
}

/* Centered Month Pill Display */
.month-pill-display {
  background: #e3f2fd;
  color: #1976d2;
  font-weight: 600;
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 20px;
  text-align: center;
  min-width: 140px;
  border: 1px solid #bbdefb;
}

/* ================================================================ */
/* RESPONSIVE MOBILE-FIRST ENHANCEMENTS */
/* ================================================================ */

/* Mobile viewport stretching */
@media (max-width: 959px) {
  .home-owner-layout {
    height: 100vh !important;
  }
  
  .calendar-main-container {
    height: calc(100vh - 56px) !important;
    margin-top: 56px !important;
  }
  
  .calendar-header-card .v-card-text {
    padding: 6px 8px !important;
  }
  
  /* Compact navigation on mobile */
  .month-pill-display {
    font-size: 0.9rem !important;
    padding: 8px 16px;
    min-width: 120px;
  }
  
  .nav-arrow-simple {
    min-width: 36px !important;
    width: 36px !important;
    height: 36px !important;
  }
  
  /* More compact buttons on mobile */
  .calendar-header-card .v-btn {
    min-width: auto !important;
  }
}

/* Tablet optimizations */
@media (min-width: 600px) and (max-width: 959px) {
  .calendar-header-card .v-card-text {
    padding: 12px 16px !important;
  }
  
  /* Medium navigation on tablet */
  .month-pill-display {
    font-size: 1rem !important;
    padding: 10px 20px;
    min-width: 130px;
  }
}

/* Desktop optimizations */
@media (min-width: 960px) {
  .calendar-main-container {
    margin-left: 280px; /* Account for permanent sidebar */
    height: calc(100vh - 56px) !important;
    margin-top: 56px !important;
  }
  
  /* Full size navigation on desktop */
  .month-pill-display {
    font-size: 1.1rem !important;
    padding: 12px 24px;
    min-width: 140px;
  }
}

/* ================================================================ */
/* CALENDAR ENHANCEMENTS */
/* ================================================================ */

/* Enhanced turn booking styling for owners */
:deep(.fc-event.booking-turn) {
  font-weight: 600;
  border-width: 3px !important;
  position: relative;
}

/* Urgent priority styling with owner branding */
:deep(.fc-event.priority-urgent) {
  animation: pulse-owner-urgent 2s infinite;
  border-color: #d32f2f !important;
}

/* High priority styling */
:deep(.fc-event.priority-high) {
  border-left: 4px solid #ff9800 !important;
}

/* ================================================================ */
/* ANIMATIONS */
/* ================================================================ */

@keyframes pulse-owner-urgent {
  0% { 
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.8);
    transform: scale(1);
  }
  70% { 
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0);
    transform: scale(1.01);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
    transform: scale(1);
  }
}

/* ================================================================ */
/* SPEED DIAL ACTIONS - CSS GRID FOR PERFECT ALIGNMENT */
/* ================================================================ */

.speed-dial-action {
  display: grid;
  grid-template-columns: 1fr auto; /* Text flexible, FAB fixed */
  align-items: center; /* Center vertically */
  gap: 8px; /* Space between text and FAB */
  width: 140px; /* Fixed width for consistent alignment */
  margin-bottom: 8px; /* Space between actions */
}

.speed-dial-action .text-body-2 {
  justify-self: end; /* Align text to right of its column */
  white-space: nowrap; /* Prevent text wrapping */
}

.speed-dial-action .v-fab {
  justify-self: center; /* Center FAB in its column */
}

/* ================================================================ */
/* CUSTOM SPEED DIAL SCRIM - EXCLUDES MAIN FAB */
/* ================================================================ */

.speed-dial-custom-scrim {
  position: fixed;
  top: 0;
  left: 0;
  right: 88px; /* Leave space for FAB on the right */
  bottom: 88px; /* Leave space for FAB at the bottom */
  background: rgba(255, 255, 255, 0.86); /* White with 86% opacity */
  z-index: 1500; /* Below speed dial (2000) but above content */
  pointer-events: auto; /* Allow clicks to close */
}

/* Additional overlay piece to cover top-right corner */
.speed-dial-custom-scrim::after {
  content: '';
  position: absolute;
  top: 0;
  right: -88px;
  width: 88px;
  height: calc(100vh - 88px);
  background: rgba(255, 255, 255, 0.86);
}

/* Ensure speed dial and its actions are above the custom scrim */
.v-speed-dial {
  z-index: 1000 !important;
}

/* ================================================================ */
/* MAIN APP HEADER */
/* ================================================================ */

.main-app-header {
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid #e0e0e0 !important;
  z-index: 19 !important; /* Lower than sidebar z-index */
}

.app-title {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brand-icon {
  background: #1976d2;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1.1rem;
}

.brand-text {
  color: black;
  font-weight: 600;
  font-size: 1.1rem;
}

.main-app-header .v-app-bar-nav-icon {
  color: black !important;
}

.main-app-header .v-app-bar-nav-icon:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}



/* ================================================================ */
</style> 