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
      :class="{ 'sidebar-open': sidebarOpen && !mobile }"
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
    <!--test-->
    <!-- Owner Sidebar -->
    <OwnerSidebar
      v-model="sidebarOpen"
      @create-booking="handleCreateBooking"
      @create-property="handleCreateProperty"
      @edit-property="handleEditProperty"
      @view-property="handleViewProperty"
    />

    <!-- Main Calendar Area -->
    <div
      class="calendar-main-container"
      :class="{ 'sidebar-open': sidebarOpen && !mobile }"
    >
      <div class="calendar-layout">
        <!-- Calendar Header - Fixed height -->
        <v-card
          flat
          density="compact"
          class="calendar-header-card flex-shrink-0 prominent-header"
          elevation="3"
        >
          <v-card-text class="pa-4">
            <div class="d-flex align-center justify-space-between">
              <!-- Left Navigation Arrow -->
              <v-btn
                icon="mdi-chevron-left"
                variant="elevated"
                density="comfortable"
                size="default"
                class="nav-arrow-prominent"
                color="primary"
                @click="handlePrevious"
              />
              
              <!-- Centered Month Display -->
              <div class="month-display-prominent">
                <div class="month-title">
                  {{ formattedMonthYear }}
                </div>
              </div>
              
              <!-- Right Navigation Arrow -->
              <v-btn
                icon="mdi-chevron-right"
                variant="elevated"
                density="comfortable"
                size="default"
                class="nav-arrow-prominent"
                color="primary"
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
      :booking="eventModalMode === 'edit' ? eventModalData : undefined"
      :initial-data="eventModalMode === 'create' ? eventModalData : undefined"
      :quick-turn="quickTurnActive"
      :existing-booking="quickTurnExistingBooking"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @save-quick-turn="handleQuickTurnSave"
      @delete="handleEventModalDelete"
      @add-turn="handleAddTurnToExisting"
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
    />

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
      
      <!-- Quick Turn -->
      <div class="speed-dial-action">
        <span class="text-body-2 font-weight-medium">Quick Turn</span>
        <v-fab
          icon="mdi-swap-horizontal"
          size="small"
          color="warning"
          rounded="circle"
          @click="handleCreateQuickTurn"
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
import { useSupabaseBookings } from '@/composables/supabase/useSupabaseBookings';
import { useUIStore } from '@/stores/ui';

import { useAuthStore } from '@/stores/auth';
import { useCalendarState } from '@/composables/shared/useCalendarState';

// Business logic composables
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings-supabase';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';

// Types
import type { Booking, Property, BookingFormData, PropertyFormData, ModalData } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import type { EventResizeDoneArg } from '@fullcalendar/interaction';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';

// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================


const propertyStore = usePropertyStore();
const { bookings, createBooking: createSupabaseBooking, createQuickTurn } = useSupabaseBookings();
const uiStore = useUIStore();
const authStore = useAuthStore();
const { xs, mobile } = useDisplay();

// ============================================================================
// COMPOSABLES - BUSINESS LOGIC
// ============================================================================
const { 
  loading: bookingsLoading, 
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
  next,
  prev,
  updateDateRange
} = useCalendarState();

// ============================================================================
// LOCAL STATE
// ============================================================================
const calendarRef = ref<InstanceType<typeof OwnerCalendar> | null>(null);
const sidebarOpen = ref(false);
const selectedPropertyFilter = ref<string | null>(null);
const speedDialOpen = ref(false);

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

  // Filter properties by owner_id using the store's Map
  const allProperties = propertyStore.properties;
  allProperties.forEach((property, id) => {
    if (property.owner_id === currentOwnerId.value) {
      map.set(id, property);
    }
  });
  
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
    const ownerBookings = bookings.value
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
    const filteredBookings = filterBookings(bookings);

    // Convert to Map for components that expect Map format
    filteredBookings.forEach(booking => {
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

// Quick Turn state
const quickTurnActive = ref(false);
const quickTurnExistingBooking = ref<Booking | undefined>(undefined);

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

const handleAddTurnToExisting = (booking: Booking): void => {
  // Close the edit modal, then open quick turn with the existing booking
  uiStore.closeModal('eventModal');
  nextTick(() => {
    handleCreateQuickTurn(booking);
  });
};

const handleCreateQuickTurn = (existingBooking?: Booking): void => {
  quickTurnActive.value = true;
  quickTurnExistingBooking.value = existingBooking;
  const bookingData = existingBooking
    ? { property_id: existingBooking.property_id, owner_id: currentOwnerId.value }
    : { owner_id: currentOwnerId.value };
  uiStore.openModal('eventModal', 'create', bookingData);
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

const handleEditProperty = (property: Property): void => {
  eventLogger.logEvent(
    'OwnerSidebar',
    'HomeOwner',
    'editProperty',
    property,
    'receive'
  );
  uiStore.openModal('propertyModal', 'edit', property as unknown as ModalData);
};

const handleViewProperty = (property: Property): void => {
  eventLogger.logEvent(
    'OwnerSidebar',
    'HomeOwner',
    'viewProperty',
    property,
    'receive'
  );
  uiStore.openModal('propertyModal', 'view', property as unknown as ModalData);
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
// HELPER FUNCTIONS
// ============================================================================

/**
 * Subtract one day from a date string.
 * Used to convert FullCalendar's exclusive end dates to our database's inclusive checkout_date.
 * FullCalendar end dates are exclusive (the day AFTER the last visible day),
 * but checkout_date in our DB is the actual last day of the booking.
 */
const subtractOneDay = (dateStr: string): string => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
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
  
  // FullCalendar uses exclusive end dates, so subtract one day for checkout_date
  const bookingData: Partial<BookingFormData> = {
    checkin_date: selectInfo.startStr,              // Guests arrive on start date
    checkout_date: subtractOneDay(selectInfo.endStr), // Convert exclusive end to inclusive checkout
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
  
  // Check if this is an edit event from the bottom sheet
  const extendedProps = clickInfo.event.extendedProps;
  if (extendedProps && extendedProps.isEdit && extendedProps.booking) {
    // Use the booking data directly from the bottom sheet
    const booking = extendedProps.booking as Booking;
    uiStore.openModal('eventModal', 'edit', booking as unknown as ModalData);
    return;
  }

  // Fallback: Only allow editing owner's bookings
  const booking = ownerBookingsMap.value.get(clickInfo.event.id);
  if (booking) {
    uiStore.openModal('eventModal', 'edit', booking as unknown as ModalData);
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
    
    // FullCalendar uses exclusive end dates, so we need to subtract one day
    // to get the correct checkout_date for our database
    const endStr = dropInfo.event.endStr || dropInfo.event.startStr;
    const checkoutDate = subtractOneDay(endStr);
    
    const result = await updateMyBooking(booking.id, {
      checkin_date: dropInfo.event.startStr,
      checkout_date: checkoutDate,
      owner_id: booking.owner_id,
    });
    
    if (!result) {
      throw new Error('Update failed');
    }
    
    // Show success notification
    uiStore.showNotification('Your booking has been successfully moved to the new date.', 'success');
    
    // Additional nextTick to ensure DOM updates complete
    await nextTick();
    
  } catch (error) {
    console.error('Failed to update your booking:', error);
    dropInfo.revert();
  }
};

const handleEventResize = async (resizeInfo: EventResizeDoneArg): Promise<void> => {
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
    
    // FullCalendar uses exclusive end dates, so we need to subtract one day
    // to get the correct checkout_date for our database
    const checkoutDate = subtractOneDay(resizeInfo.event.endStr);
    
    const result = await updateMyBooking(booking.id, {
      checkin_date: resizeInfo.event.startStr,
      checkout_date: checkoutDate,
      owner_id: booking.owner_id,
    });
    
    if (!result) {
      throw new Error('Resize update failed');
    }
    
    // Show success notification
    uiStore.showNotification('Your booking duration has been successfully updated.', 'success');
    
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
  // Check if this is adjacent to an existing booking (turn detection)
  if (data.propertyId) {
    const adjacentBooking = Array.from(ownerBookingsMap.value.values()).find(
      b => b.property_id === data.propertyId && b.checkout_date === data.start
    );
    if (adjacentBooking) {
      handleCreateQuickTurn(adjacentBooking);
      return;
    }
  }

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
  quickTurnActive.value = false;
  quickTurnExistingBooking.value = undefined;
  uiStore.closeModal('eventModal');
};

const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    console.log('🔍 [DEBUG] HomeOwner.handleEventModalSave - Raw form data:', {
      checkin_date: data.checkin_date,
      checkout_date: data.checkout_date,
      checkin_time: data.checkin_time,
      checkout_time: data.checkout_time,
      property_id: data.property_id,
      booking_type: data.booking_type
    });
    
    // Ensure owner_id is set
    const bookingData: BookingFormData = {
      ...data,
      owner_id: currentOwnerId.value ?? data.owner_id
    };
    
    console.log('🔍 [DEBUG] HomeOwner.handleEventModalSave - Final booking data:', {
      checkin_date: bookingData.checkin_date,
      checkout_date: bookingData.checkout_date,
      checkin_time: bookingData.checkin_time,
      checkout_time: bookingData.checkout_time,
      property_id: bookingData.property_id,
      owner_id: bookingData.owner_id,
      booking_type: bookingData.booking_type
    });
    
    // Capture modal state before any async work (closing the form can clear it)
    const mode = eventModalMode.value;
    const editBooking = eventModalData.value;

    if (mode === 'create') {
      console.log('🔍 [DEBUG] HomeOwner - Calling createSupabaseBooking...');
      const bookingId = await createSupabaseBooking(bookingData as BookingFormData);
      console.log('🔍 [DEBUG] HomeOwner - createSupabaseBooking result:', bookingId);
      
      if (!bookingId) {
        console.error('❌ [HomeOwner] Booking creation failed - no ID returned');
        throw new Error('Failed to create booking. Please try again.');
      }
      console.log('✅ [HomeOwner] Booking created successfully:', bookingId);
    } else if (editBooking) {
      // Verify owner can update this booking
      if (!editBooking.id || !ownerBookingsMap.value.has(editBooking.id)) {
        console.error('🚨 [HomeOwner] Booking ownership check failed - booking not found in owner map');
        throw new Error('Cannot update booking not owned by current user');
      }
      await updateMyBooking(editBooking.id, bookingData as Partial<BookingFormData>);
    }
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('❌ Failed to save your booking:', error);
    // Show error to user - don't silently fail
    alert(error instanceof Error ? error.message : 'Failed to save booking');
  }
};

const handleQuickTurnSave = async (payload: { property_id: string; outgoing: BookingFormData & { booking_id?: string }; incoming: BookingFormData }): Promise<void> => {
  try {
    await createQuickTurn(payload);
    quickTurnActive.value = false;
    quickTurnExistingBooking.value = undefined;
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('Failed to create quick turn:', error);
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

let ownerDataLoaded = false;

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
  if (isOwnerAuthenticated.value) {
   console.log('✅ [HomeOwner] User is authenticated as owner, loading data...');
    try {
      // Fetch properties — bookings are already fetched by useSupabaseBookings onMounted
      await propertyStore.fetchProperties();
      ownerDataLoaded = true;
     console.log('✅ [HomeOwner] Owner data loaded successfully');
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

// Watch for authentication changes — skip if onMounted already loaded data
watch(isOwnerAuthenticated, async (newValue, oldValue) => {
 console.log('🔄 [HomeOwner] isOwnerAuthenticated changed:', {
    from: oldValue,
    to: newValue,
    user: authStore.user
  });
  if (newValue && !oldValue) {
    if (ownerDataLoaded) {
     console.log('⏭️ [HomeOwner] Data already loaded by onMounted, skipping');
      return;
    }
    // User became authenticated - load data
   console.log('✅ [HomeOwner] User became authenticated, loading data...');
    try {
      // Fetch properties — bookings are already fetched by useSupabaseBookings onMounted
      await propertyStore.fetchProperties();
      ownerDataLoaded = true;
     console.log('✅ [HomeOwner] Data loaded after auth change');

      // Initialize calendar state after auth change
      updateDateRange();
     console.log('✅ [HomeOwner] Calendar state initialized after auth change');
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
  transition: margin-left 0.3s ease-in-out;
  margin-left: 0;
  background: #FAFAFA;
}

.calendar-main-container.sidebar-open {
  margin-left: 300px; /* Match sidebar width */
}

/* Responsive behavior - overlay on mobile */
@media (max-width: 959px) {
  .calendar-main-container.sidebar-open {
    margin-left: 0; /* No push on mobile */
  }
  
  .main-app-header.sidebar-open {
    margin-left: 0; /* No push on mobile */
  }
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
  /* Fixed height for consistent layout calculations */
  height: 48px;
  min-height: 48px;
  max-height: 48px;
}

.prominent-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.9) 100%) !important;
  border-bottom: 3px solid rgba(var(--v-theme-secondary), 0.8) !important;
  height: 70px !important;
  min-height: 70px !important;
  max-height: 70px !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.25) !important;
}

.calendar-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  /* Mobile-specific height management */
  height: calc(100% - 70px); /* Subtract prominent header card height */
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

/* Prominent Navigation Arrows */
.nav-arrow-prominent {
  border-radius: 12px !important;
  background: rgba(255, 255, 255, 0.95) !important;
  color: rgb(var(--v-theme-primary)) !important;
  border: 2px solid rgba(255, 255, 255, 0.8) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.3s ease !important;
}

.nav-arrow-prominent:hover {
  background: rgba(255, 255, 255, 1) !important;
  transform: scale(1.05) !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
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

/* Prominent Month Display */
.month-display-prominent {
  background: rgba(255, 255, 255, 0.95);
  color: rgb(var(--v-theme-primary));
  padding: 8px 24px;
  border-radius: 16px;
  text-align: center;
  min-width: 200px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.month-title {
  font-weight: 700;
  font-size: 1.1rem;
  line-height: 1.2;
  color: rgb(var(--v-theme-primary));
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.month-subtitle {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(var(--v-theme-primary), 0.8);
  line-height: 1;
  margin-top: 2px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ================================================================ */
/* RESPONSIVE MOBILE-FIRST ENHANCEMENTS */
/* ================================================================ */

/* Mobile viewport stretching with safe area support */
@media (max-width: 959px) {
  .home-owner-layout {
    height: 100vh !important;
    /* Support for devices with notches/safe areas */
    height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
  }
  
  .calendar-main-container {
    /* Account for app bar + safe area top */
    height: calc(100vh - 56px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
    margin-top: calc(33px + env(safe-area-inset-top)) !important;
    /* Prevent content from being hidden behind navigation bars */
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .calendar-header-card .v-card-text {
    padding: 4px 8px !important;
  }
  
  .prominent-header {
    height: 60px !important;
    min-height: 60px !important;
    max-height: 60px !important;
  }
  
  .calendar-content {
    height: calc(100% - 60px) !important;
  }
  
  /* Compact navigation on mobile */
  .month-pill-display {
    font-size: 0.9rem !important;
    padding: 6px 14px;
    min-width: 120px;
  }
  
  .month-display-prominent {
    min-width: 160px !important;
    padding: 6px 16px !important;
  }
  
  .month-title {
    font-size: 1rem !important;
  }
  
  .month-subtitle {
    font-size: 0.7rem !important;
  }
  
  .nav-arrow-simple {
    min-width: 32px !important;
    width: 32px !important;
    height: 32px !important;
  }
  
  .nav-arrow-prominent {
    min-width: 40px !important;
    width: 40px !important;
    height: 40px !important;
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
    margin-left: 0; /* No permanent sidebar offset - toggleable sidebar */
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
  transition: margin-left 0.3s ease-in-out;
  margin-left: 0;
}

.main-app-header.sidebar-open {
  margin-left: 300px; /* Match sidebar width */
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
