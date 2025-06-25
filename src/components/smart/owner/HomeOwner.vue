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
  <!-- MINIMAL TEMPLATE FOR DEBUGGING - Let's see if this can mount -->
  <div class="home-owner-minimal pa-4">
    <v-card class="pa-4">
      <v-card-title>🏠 HomeOwner Component - Debug Mode</v-card-title>
      <v-card-text>
        <div class="debug-info">
          <p><strong>✅ Script Setup:</strong> Running</p>
          <p><strong>✅ Auth Status:</strong> {{ authStore.isAuthenticated ? 'Authenticated' : 'Not Authenticated' }}</p>
          <p><strong>✅ User:</strong> {{ authStore.user?.name || 'None' }} ({{ authStore.user?.role || 'No Role' }})</p>
          <p><strong>✅ User ID:</strong> {{ currentOwnerId || 'undefined' }}</p>
          <p><strong>✅ Is Owner Auth:</strong> {{ isOwnerAuthenticated ? 'Yes' : 'No' }}</p>
          <p><strong>🎨 Template:</strong> Rendering Successfully</p>
          <p><strong>⏰ Mount Status:</strong> <span id="mount-status">Waiting for onMounted...</span></p>
        </div>
        
        <v-alert type="info" class="mt-4">
          <strong>Debug Test:</strong> If you see "Component Mounted!" below, the basic component works.
          Then we can gradually add back the complex template parts.
        </v-alert>
      </v-card-text>
    </v-card>
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
  return dialog?.data || null;
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
  
  // Update the UI to show successful mount
  const mountStatusElement = document.getElementById('mount-status');
  if (mountStatusElement) {
    mountStatusElement.innerHTML = '✅ Component Mounted Successfully!';
    mountStatusElement.style.color = 'green';
    mountStatusElement.style.fontWeight = 'bold';
  }
  
  console.log('🔍 [HomeOwner] Basic mount test - simplified template worked!');
  
  // For now, skip the complex data loading while we debug
  // TODO: Re-enable data loading once we identify the template issue
  console.log('⏭️ [HomeOwner] Skipping data loading in debug mode');
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
.home-owner-container {
  height: 100vh;
  overflow: hidden;
}

.sidebar-column {
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgb(var(--v-theme-on-surface), 0.12);
}

.calendar-column {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  padding: 16px;
  border-bottom: 1px solid rgb(var(--v-theme-on-surface), 0.12);
  background: rgb(var(--v-theme-surface));
  flex-shrink: 0;
}

.mobile-hidden {
  display: none;
}

@media (min-width: 1024px) {
  .mobile-hidden {
    display: block;
  }
}

/* Owner-specific styling */
.home-owner-container {
  --owner-primary: rgb(var(--v-theme-primary));
  --owner-accent: rgb(var(--v-theme-secondary));
}

/* Highlighted booking animation for owner */
:deep(.fc-event.highlighted) {
  animation: owner-highlight 3s ease-in-out;
  box-shadow: 0 0 0 3px var(--owner-primary);
}

@keyframes owner-highlight {
  0% { 
    transform: scale(1);
    box-shadow: 0 0 0 0 var(--owner-primary);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 0 0 6px rgba(var(--v-theme-primary), 0.3);
  }
  100% { 
    transform: scale(1);
    box-shadow: 0 0 0 3px var(--owner-primary);
  }
}
</style> 