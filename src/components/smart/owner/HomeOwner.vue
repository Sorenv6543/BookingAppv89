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
  <div class="home-owner-container">
    <!-- Owner Sidebar - Fixed to left edge -->
    <div 
      class="sidebar-column"
      :class="{ 
        'sidebar-hidden': !sidebarOpen && $vuetify.display.mdAndDown,
        'sidebar-visible': sidebarOpen || $vuetify.display.lgAndUp 
      }"
    >
      <OwnerSidebar
        :today-turns="ownerTodayTurns"
        :upcoming-cleanings="ownerUpcomingCleanings"
        :properties="ownerPropertiesMap"
        :loading="loading"
        @navigate-to-booking="handleNavigateToBooking"
        @navigate-to-date="handleNavigateToDate"
        @filter-by-property="handleFilterByProperty"
        @create-booking="handleCreateBooking"
        @create-property="handleCreateProperty"
      />
    </div>

    <!-- Main Calendar Area - Fills remaining space -->
    <div class="calendar-column">
         <!-- Owner Calendar Header - Fixed to top of calendar area -->
         <v-card flat class="calendar-header-card">
           <v-card-text class="pa-3">
             <div class="d-flex align-center">
               <!-- Mobile menu button -->
               <v-btn
                 v-if="$vuetify.display.mdAndDown"
                 icon="mdi-menu"
                 variant="text"
                 class="mr-4"
                 @click="toggleSidebar"
               />
               
               <!-- Calendar Navigation -->
               <v-btn
                 icon="mdi-arrow-left"
                 variant="text"
                 class="mr-2"
                 @click="handlePrevious"
               />
               <v-btn 
                 variant="outlined" 
                 class="mr-2" 
                 @click="handleGoToday"
               >
                 Today
               </v-btn>
               <v-btn
                 icon="mdi-arrow-right"
                 variant="text"
                 class="mr-4"
                 @click="handleNext"
               />
               <div class="text-h6 mr-4">
                 {{ formattedDate }}
               </div>
               
               <v-spacer />
               
               <!-- Owner Quick Actions -->
               <v-btn
                 v-if="$vuetify.display.smAndUp"
                 color="primary"
                 variant="outlined"
                 prepend-icon="mdi-plus"
                 class="mr-2"
                 @click="handleCreateProperty"
               >
                 Add Property
               </v-btn>
               <v-btn
                 color="primary"
                 prepend-icon="mdi-calendar-plus"
                 class="mr-4"
                 @click="handleCreateBooking"
               >
                 Add Booking
               </v-btn>
               
               <!-- Calendar View Toggle -->
               <v-btn-toggle
                 v-model="currentView"
                 mandatory
                 density="compact"
                 class="ml-2"
               >
                 <v-btn value="dayGridMonth" size="small">
                   Month
                 </v-btn>
                 <v-btn value="timeGridWeek" size="small">
                   Week
                 </v-btn>
                 <v-btn value="timeGridDay" size="small">
                   Day
                 </v-btn>
               </v-btn-toggle>
             </div>
           </v-card-text>
         </v-card>

         <!-- Owner Calendar - Fixed height below header -->
         <div class="calendar-content">
           <OwnerCalendar
             ref="calendarRef"
             :bookings="ownerFilteredBookings"
             :properties="ownerPropertiesMap"
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
         </div>
     </div>

    <!-- Owner-focused Modals (always available) - Ensure they appear above fixed container -->
    <div style="position: relative; z-index: 1000;">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
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

// Business logic composables
import { useBookings } from '@/composables/shared/useBookings';
import { useProperties } from '@/composables/shared/useProperties';
import { useCalendarState } from '@/composables/shared/useCalendarState';

// Types
import type { Booking, Property, BookingFormData, PropertyFormData,  } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';


// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================
const propertyStore = usePropertyStore();
const bookingStore = useBookingStore();
const uiStore = useUIStore();
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
const calendarRef = ref<InstanceType<typeof OwnerCalendar> | null>(null);
const sidebarOpen = ref(!xs.value);
const selectedPropertyFilter = ref<string | null>(null);

// ============================================================================
// OWNER-SPECIFIC DATA ACCESS
// ============================================================================

// Get current owner's user ID with debugging
let currentOwnerIdCallCount = 0;
const currentOwnerId = computed(() => {
  currentOwnerIdCallCount++;
  const userId = authStore.user?.id;
  console.log(`🔍 [HomeOwner] currentOwnerId computed (call #${currentOwnerIdCallCount}):`, {
    user: authStore.user,
    userId,
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.user?.role
  });
  
  if (currentOwnerIdCallCount > 10) {
    console.error('❌ [HomeOwner] Infinite loop detected in currentOwnerId computed!');
  }
  
  return userId;
});

// Check if user is authenticated and is an owner
let isOwnerAuthenticatedCallCount = 0;
const isOwnerAuthenticated = computed(() => {
  isOwnerAuthenticatedCallCount++;
  const authenticated = !!(authStore.isAuthenticated && 
         authStore.user?.role === 'owner' && 
         currentOwnerId.value);
  
  console.log(`🔍 [HomeOwner] isOwnerAuthenticated computed (call #${isOwnerAuthenticatedCallCount}):`, {
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.user?.role,
    currentOwnerId: currentOwnerId.value,
    result: authenticated
  });
  
  if (isOwnerAuthenticatedCallCount > 10) {
    console.error('❌ [HomeOwner] Infinite loop detected in isOwnerAuthenticated computed!');
  }
  
  return authenticated;
});

// ============================================================================
// COMPUTED STATE - OWNER-FILTERED DATA
// ============================================================================

let loadingCallCount = 0;
const loading = computed(() => {
  loadingCallCount++;
  const result = bookingsLoading.value || 
    propertiesLoading.value || 
    uiStore.isLoading('bookings') || 
    uiStore.isLoading('properties');
  
  if (loadingCallCount > 20) {
    console.error(`❌ [HomeOwner] Infinite loop detected in loading computed! (call #${loadingCallCount})`);
  }
  
  return result;
});

const formattedDate = computed(() => {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return currentDate.value.toLocaleDateString('en-US', options);
});

// Owner's properties only
let ownerPropertiesMapCallCount = 0;
const ownerPropertiesMap = computed(() => {
  ownerPropertiesMapCallCount++;
  const map = new Map<string, Property>();
  
  if (ownerPropertiesMapCallCount > 20) {
    console.error(`❌ [HomeOwner] Infinite loop detected in ownerPropertiesMap computed! (call #${ownerPropertiesMapCallCount})`);
  }
  
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

// ADDING BACK COMPLEX COMPUTED PROPERTIES ONE BY ONE TO FIND THE CULPRIT

// Owner's bookings only - TESTING THIS FIRST
let ownerBookingsMapCallCount = 0;
const ownerBookingsMap = computed(() => {
  ownerBookingsMapCallCount++;
  console.log(`🔍 [HomeOwner] ownerBookingsMap computed (call #${ownerBookingsMapCallCount})`);
  
  if (ownerBookingsMapCallCount > 20) {
    console.error('❌ [HomeOwner] Infinite loop detected in ownerBookingsMap computed!');
    return new Map<string, Booking>();
  }
  const map = new Map<string, Booking>();
  
  if (!isOwnerAuthenticated.value || !currentOwnerId.value) {
    return map;
  }

  // Filter bookings by owner_id
  bookingStore.bookingsArray
    .filter(booking => booking.owner_id === currentOwnerId.value)
    .forEach(booking => {
      if (booking && booking.id) {
        map.set(booking.id, booking);
      }
    });
  
  return map;
});

// ADDING BACK DEPENDENT COMPUTED PROPERTIES WITH DEBUGGING

// Owner's today's turn bookings - TESTING THIS NEXT
let ownerTodayTurnsCallCount = 0;
const ownerTodayTurns = computed(() => {
  ownerTodayTurnsCallCount++;
  console.log(`🔍 [HomeOwner] ownerTodayTurns computed (call #${ownerTodayTurnsCallCount})`);
  
  if (ownerTodayTurnsCallCount > 20) {
    console.error('❌ [HomeOwner] Infinite loop detected in ownerTodayTurns computed!');
    return new Map<string, Booking>();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const turns = new Map<string, Booking>();
  
  if (!isOwnerAuthenticated.value) {
    return turns;
  }

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
  
  return turns;
});

// Owner's upcoming cleanings - TESTING THIS NEXT
let ownerUpcomingCleaningsCallCount = 0;
const ownerUpcomingCleanings = computed(() => {
  ownerUpcomingCleaningsCallCount++;
  console.log(`🔍 [HomeOwner] ownerUpcomingCleanings computed (call #${ownerUpcomingCleaningsCallCount})`);
  
  if (ownerUpcomingCleaningsCallCount > 20) {
    console.error('❌ [HomeOwner] Infinite loop detected in ownerUpcomingCleanings computed!');
    return new Map<string, Booking>();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  
  const cleanings = new Map<string, Booking>();
  
  if (!isOwnerAuthenticated.value) {
    return cleanings;
  }

  // Filter owner's bookings for upcoming cleanings
  Array.from(ownerBookingsMap.value.values()).forEach(booking => {
    const checkoutDate = new Date(booking.checkout_date);
    if (checkoutDate >= today && checkoutDate <= inOneWeek) {
      cleanings.set(booking.id, booking);
    }
  });
  
  return cleanings;
});

// Owner's filtered bookings - TESTING THE MOST COMPLEX ONE
let ownerFilteredBookingsCallCount = 0;
const ownerFilteredBookings = computed(() => {
  ownerFilteredBookingsCallCount++;
  console.log(`🔍 [HomeOwner] ownerFilteredBookings computed (call #${ownerFilteredBookingsCallCount})`);
  
  if (ownerFilteredBookingsCallCount > 20) {
    console.error('❌ [HomeOwner] Infinite loop detected in ownerFilteredBookings computed!');
    return new Map<string, Booking>();
  }

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
  
  try {
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    });
  } catch (error) {
    console.error('Failed to update your booking:', error);
    dropInfo.revert();
  }
};

const handleEventResize = async (resizeInfo: { event: any; revert: () => void }): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  // Verify owner can modify this booking
  if (!ownerBookingsMap.value.has(booking.id)) {
    console.warn('Cannot modify booking not owned by current user');
    resizeInfo.revert();
    return;
  }
  
  try {
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr
    });
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

const handleGoToday = (): void => {
  goToToday();
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.today();
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
  
  updateBooking(data.id, {
    checkout_date: data.start,
    checkin_date: data.end
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
      await createBooking(bookingData as BookingFormData);
    } else if (eventModalData.value) {
      // Verify owner can update this booking
      if (!ownerBookingsMap.value.has(eventModalData.value.id)) {
        throw new Error('Cannot update booking not owned by current user');
      }
      await updateBooking(eventModalData.value.id, bookingData as Partial<BookingFormData>);
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
      await createProperty(propertyData as PropertyFormData);
    } else if (propertyModalData.value) {
      // Verify owner can update this property
      if (!ownerPropertiesMap.value.has(propertyModalData.value.id)) {
        throw new Error('Cannot update property not owned by current user');
      }
      await updateProperty(propertyModalData.value.id, propertyData as Partial<PropertyFormData>);
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
      await deleteBooking(data.id as string);
      uiStore.closeModal('eventModal');
    } catch (error) {
      console.error('Failed to delete your booking:', error);
    }
  } else if (data?.type === 'property' && data?.id) {
    try {
      await deleteProperty(data.id as string    );
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
    // Wait for auth loading to complete
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
  
  // Load owner's data only if properly authenticated
  if (isOwnerAuthenticated.value) {
    console.log('✅ [HomeOwner] User is authenticated as owner, loading data...');
    try {
      await Promise.all([
        fetchAllProperties(),
        fetchAllBookings()
      ]);
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
        fetchAllProperties(),
        fetchAllBookings()
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
/* =================================================================== */
/* OWNER LAYOUT - EDGE-TO-EDGE FIXED POSITIONING */
/* =================================================================== */

/*
 * IMPORTANT: Fixed positioning breaks out of Vuetify's v-main padding
 * This ensures the sidebar reaches the true left edge of the viewport
 * and the calendar stretches to the true right edge.
 */
.home-owner-container {
  position: fixed;
  top: 64px; /* Below app-bar */
  left: 0; /* True left edge of viewport */
  right: 0; /* True right edge of viewport */
  bottom: 0;
  height: calc(100vh - 64px); /* Account for app-bar height */
  width: 100vw; /* Full viewport width */
  overflow: hidden;
  display: flex; /* Flexbox for sidebar + calendar layout */
  z-index: 1; /* Above v-main, below modals */
}

/* No longer needed - using direct flexbox on container */

/* =================================================================== */
/* SIDEBAR COLUMN - FIXED TO LEFT EDGE */
/* =================================================================== */

.sidebar-column {
  width: 320px; /* Fixed width sidebar */
  min-width: 320px; /* Prevent shrinking */
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
  transition: all 0.3s ease;
  flex-shrink: 0;
  position: relative; /* Desktop: always visible, positioned normally */
}

/* Mobile: Sidebar overlay */
@media (max-width: 959px) {
  .sidebar-column {
    position: absolute; /* Absolute to the fixed parent container */
    top: 0; /* Relative to parent container */
    left: 0;
    z-index: 1005;
    width: 300px;
    min-width: 300px;
    height: 100%; /* Full height of parent container */
    transform: translateX(-100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.2);
  }
  
  .sidebar-column.sidebar-visible {
    transform: translateX(0);
  }
  
  .sidebar-column.sidebar-hidden {
    transform: translateX(-100%);
  }
  
  /* On mobile, calendar takes full width when sidebar is hidden */
  .calendar-column {
    flex: 1;
    margin-left: 0;
  }
}

/* Desktop: Sidebar always visible, attached to left edge */
@media (min-width: 960px) {
  .sidebar-column {
    position: relative;
    transform: translateX(0) !important;
  }
  
  .sidebar-column.sidebar-hidden,
  .sidebar-column.sidebar-visible {
    transform: translateX(0) !important;
  }
  
  /* On desktop, calendar fills remaining space after fixed sidebar */
  .calendar-column {
    flex: 1;
    margin-left: 0;
    width: calc(100vw - 320px); /* Explicit width calculation */
  }
}

/* =================================================================== */
/* CALENDAR COLUMN - FILLS REMAINING SPACE */
/* =================================================================== */

.calendar-column {
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex item overflow */
  position: relative;
  flex: 1; /* Take remaining space after sidebar */
}

/* Calendar Header - Fixed height */
.calendar-header-card {
  flex-shrink: 0;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
  z-index: 1;
}

/* Calendar Content - Flexible height */
.calendar-content {
  flex: 1;
  min-height: 0; /* Allow shrinking */
  position: relative;
  overflow: hidden;
}

/* =================================================================== */
/* RESPONSIVE BREAKPOINT FIXES */
/* =================================================================== */

/* Small screens (mobile) */
@media (max-width: 599px) {
  .home-owner-container {
    top: 56px; /* Smaller mobile app-bar */
    height: calc(100vh - 56px);
  }
  
  .sidebar-column {
    top: 0; /* Relative to parent container */
    height: 100%; /* Full height of parent container */
  }
}

/* Medium screens (tablets) */
@media (min-width: 600px) and (max-width: 959px) {
  .calendar-column {
    margin-left: 0;
  }
}

/* Large screens (desktop) - Edge-to-edge layout */
@media (min-width: 960px) {
  .home-owner-container {
    top: 64px; /* Standard app-bar height */
    height: calc(100vh - 64px);
  }
  
  .calendar-column {
    margin-left: 0;
  }
}

/* Extra large screens - Prevent calendar disappearing */
@media (min-width: 1280px) {
  .calendar-column {
    min-width: 600px; /* Ensure calendar never disappears */
  }
}

/* =================================================================== */
/* OWNER-SPECIFIC THEME VARIABLES */
/* =================================================================== */

.home-owner-container {
  --owner-primary: rgb(var(--v-theme-primary));
  --owner-accent: rgb(var(--v-theme-secondary));
  --owner-surface: rgb(var(--v-theme-surface));
  --owner-border: rgb(var(--v-theme-on-surface), 0.12);
}

/* =================================================================== */
/* ENHANCED CALENDAR STYLING FOR OWNERS */
/* =================================================================== */

/* Owner booking highlights */
:deep(.fc-event.highlighted) {
  animation: owner-highlight 3s ease-in-out;
  box-shadow: 0 0 0 3px var(--owner-primary);
}

:deep(.fc-event.booking-turn) {
  font-weight: 600;
  border-width: 2px !important;
}

:deep(.fc-event.priority-urgent) {
  animation: pulse-urgent 2s infinite;
}

/* =================================================================== */
/* ANIMATIONS */
/* =================================================================== */

@keyframes owner-highlight {
  0% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--owner-primary);
  }
  50% { 
    transform: scale(1.02);
    box-shadow: 0 0 0 6px rgba(var(--v-theme-primary), 0.3);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 0 0 3px var(--owner-primary);
  }
}

@keyframes pulse-urgent {
  0% { 
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
  }
  70% { 
    box-shadow: 0 0 0 8px rgba(244, 67, 54, 0);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}

/* =================================================================== */
/* MOBILE OVERLAY BACKDROP & INTERACTION */
/* =================================================================== */

@media (max-width: 959px) {
  /* Backdrop overlay when sidebar is open */
  .home-owner-container::before {
    content: '';
    position: absolute; /* Use absolute since parent is now fixed */
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    pointer-events: none;
  }
  
  .home-owner-container:has(.sidebar-visible)::before {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }
  
  /* Allow clicking backdrop to close sidebar */
  .home-owner-container:has(.sidebar-visible)::before {
    cursor: pointer;
  }
}
</style> 