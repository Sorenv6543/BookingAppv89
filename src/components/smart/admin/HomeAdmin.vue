<!-- 
👑 ADMIN INTERFACE
 src/components/smart/admin/HomeAdmin.vue - 

✅ UNFILTERED VIEW - Admin sees all data
✅ Access to all properties across all owners
✅ System-wide metrics and controls
✅ Can manage any owner's data 
-->
<template>
  <div class="home-admin-container">
    <v-row
      no-gutters
      class="fill-height"
    >
      <!-- Sidebar Column -->
      <v-col 
        cols="12" 
        lg="3" 
        xl="2" 
        class="sidebar-column"
        :class="{ 'mobile-hidden': !sidebarOpen }"
      >
        <v-btn
          v-if="$vuetify.display.lgAndDown"
          icon="mdi-menu"
          variant="text"
          class="mr-4"
          @click="toggleSidebar"
        />
        <AdminSidebar
          :today-turns="systemTodayTurns"
          :upcoming-cleanings="systemUpcomingCleanings"
          :properties="allPropertiesMap"
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
          <!-- Admin-focused Calendar Controls -->
          <div class="d-flex align-center">
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
            <div class="text-h6">
              {{ formattedDate }}
            </div>
            
            <!-- System-wide Metrics -->
            <div class="ml-4 text-caption text-medium-emphasis">
              {{ systemMetricsText }}
            </div>
            
            <v-spacer />
            
            <!-- Admin Quick Actions -->
            <v-btn
              color="warning"
              variant="outlined"
              prepend-icon="mdi-account-hard-hat"
              class="mr-2"
              @click="handleAssignCleaners"
            >
              Assign Cleaners
            </v-btn>
            <v-btn
              color="info"
              variant="outlined"
              prepend-icon="mdi-chart-line"
              class="mr-2"
              @click="handleGenerateReports"
            >
              Reports
            </v-btn>
            <v-btn
              color="primary"
              prepend-icon="mdi-cog"
              class="mr-4"
              @click="handleManageSystem"
            >
              Manage System
            </v-btn>
            
            <v-btn-toggle
              v-model="currentView"
              mandatory
              class="ml-4"
            >
              <v-btn value="dayGridMonth">
                Month
              </v-btn>
              <v-btn value="timeGridWeek">
                Week
              </v-btn>
              <v-btn value="timeGridDay">
                Day
              </v-btn>
            </v-btn-toggle>
          </div>
        </div>

        <!-- TODO: Replace with AdminCalendar.vue when TASK-039H is complete -->
        <AdminCalendar 
          ref="calendarRef"
          :bookings="adminFilteredBookings"
          :loading="loading"
          :current-view="currentView"
          :current-date="currentDate"
          :properties="allPropertiesMap"
          :users="allUsersMap"
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

    <!-- Admin-focused Modals -->
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

    <!-- TODO: Add admin-specific modals -->
    <!-- CleanerAssignmentModal -->
    <!-- ReportsModal -->
    <!-- SystemManagementModal -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useDisplay } from 'vuetify';

// Admin components (using generic components for now)

import AdminSidebar from '@/components/smart/admin/AdminSidebar.vue';
import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue';

// State management
import { useUserStore } from '@/stores/user';
import { usePropertyStore } from '@/stores/property';
import { useBookingStore } from '@/stores/booking';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';

// Business logic composables
import { useBookings } from '@/composables/shared/useBookings';
import { useProperties } from '@/composables/shared/useProperties';
import { useCalendarState } from '@/composables/shared/useCalendarState';

// Types
import type { Booking, Property, BookingFormData, PropertyFormData, CalendarView } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Import event logger for component communication
import eventLogger from '@/composables/shared/useComponentEventLogger';

// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================
const userStore = useUserStore();
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
const calendarRef = ref<InstanceType<typeof AdminCalendar> | null>(null);
const sidebarOpen = ref(!xs.value);
const selectedPropertyFilter = ref<string | null>(null);

// ============================================================================
// ADMIN-SPECIFIC DATA ACCESS
// ============================================================================

// Check if user is authenticated and is an admin
const isAdminAuthenticated = computed(() => {
  return authStore.isAuthenticated && 
         authStore.user?.role === 'admin';
});

// ============================================================================
// COMPUTED STATE - ADMIN ALL-DATA ACCESS (NO FILTERING)
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

// ALL properties (no owner filtering for admin)
const allPropertiesMap = computed(() => {
  if (!isAdminAuthenticated.value) {
    return new Map<string, Property>();
  }

  // Admin sees ALL properties across ALL owners
  if (propertyStore.properties instanceof Map) {
    return propertyStore.properties;
  } else {
    const map = new Map<string, Property>();
    propertyStore.propertiesArray.forEach(property => {
      if (property && property.id) {
        map.set(property.id, property);
      }
    });
    return map;
  }
});

// ALL users (no filtering for admin)
const allUsersMap = computed(() => {
  const map = new Map<string, any>();
  
  if (!isAdminAuthenticated.value) {
    return map;
  }

  // For now, just include the current user
  // TODO: Implement user management store for all users when needed
  if (userStore.user) {
    map.set(userStore.user.id, userStore.user);
  }
  
  return map;
});

// ALL bookings (no owner filtering for admin)
const allBookingsMap = computed(() => {
  if (!isAdminAuthenticated.value) {
    return new Map<string, Booking>();
  }

  // Admin sees ALL bookings across ALL owners
  const map = new Map<string, Booking>();
  bookingStore.bookingsArray.forEach(booking => {
    if (booking && booking.id) {
      map.set(booking.id, booking);
    }
  });
  
  return map;
});

// System-wide today's turn bookings (all owners)
const systemTodayTurns = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const turns = new Map<string, Booking>();
  
  if (!isAdminAuthenticated.value) {
    return turns;
  }

  // Admin sees ALL turn bookings for today across ALL owners
  Array.from(allBookingsMap.value.values()).forEach(booking => {
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

// System-wide upcoming cleanings (all owners)
const systemUpcomingCleanings = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inOneWeek = new Date(today);
  inOneWeek.setDate(inOneWeek.getDate() + 7);
  
  const cleanings = new Map<string, Booking>();
  
  if (!isAdminAuthenticated.value) {
    return cleanings;
  }

  // Admin sees ALL upcoming cleanings across ALL owners
  Array.from(allBookingsMap.value.values()).forEach(booking => {
    const checkoutDate = new Date(booking.checkout_date);
    if (checkoutDate >= today && checkoutDate <= inOneWeek) {
      cleanings.set(booking.id, booking);
    }
  });
  
  return cleanings;
});

// Admin's filtered bookings (all data with filters applied)
const adminFilteredBookings = computed(() => {
  let bookings = Array.from(allBookingsMap.value.values());
  
  // Apply property filter if selected (can be any property)
  if (selectedPropertyFilter.value) {
    bookings = bookings.filter(booking => 
      booking.property_id === selectedPropertyFilter.value
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

// System-wide metrics for admin header
const systemMetricsText = computed(() => {
  const totalProperties = allPropertiesMap.value.size;
  const totalBookings = allBookingsMap.value.size;
  const urgentTurns = systemTodayTurns.value.size;
  const upcomingCleanings = systemUpcomingCleanings.value.size;
  
  return `${totalProperties} properties • ${totalBookings} bookings • ${urgentTurns} urgent turns • ${upcomingCleanings} upcoming`;
});

// ============================================================================
// UI STATE - MODAL MANAGEMENT
// ============================================================================

// Event Modal State
const eventModalOpen = computed(() => uiStore.isModalOpen('event'));
const eventModalMode = computed((): 'create' | 'edit' | undefined => {
  const modalState = uiStore.getModalState('event');
  const mode = modalState?.mode;
  return (mode === 'create' || mode === 'edit') ? mode : undefined;
});
const eventModalData = computed((): Booking | undefined => {
  const modalData = uiStore.getModalData('event') as any;
  return modalData?.booking || undefined;
});

// Property Modal State
const propertyModalOpen = computed(() => uiStore.isModalOpen('property'));
const propertyModalMode = computed((): 'create' | 'edit' | undefined => {
  const modalState = uiStore.getModalState('property');
  const mode = modalState?.mode;
  return (mode === 'create' || mode === 'edit') ? mode : undefined;
});
const propertyModalData = computed((): Property | undefined => {
  const modalData = uiStore.getModalData('property') as any;
  return modalData?.property || undefined;
});

// Confirmation Dialog State
const confirmDialogOpen = computed(() => uiStore.isConfirmDialogOpen('confirm'));
const confirmDialogTitle = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.title || '';
});
const confirmDialogMessage = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.message || '';
});
const confirmDialogConfirmText = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.confirmText || 'Confirm';
});
const confirmDialogCancelText = computed((): string => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return dialogState?.cancelText || 'Cancel';
});
const confirmDialogDangerous = computed((): boolean => {
  const dialogState = uiStore.getConfirmDialogState('confirm');
  return Boolean(dialogState?.dangerous) || false;
});

// ============================================================================
// EVENT HANDLERS - NAVIGATION
// ============================================================================

const handleNavigateToBooking = (bookingId: string): void => {
  try {
    // Log receiving event from AdminSidebar (or generic Sidebar)
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'navigateToBooking',
      bookingId,
      'receive'
    );

    // Open booking modal for editing
    const booking = allBookingsMap.value.get(bookingId);
    if (booking) {
      uiStore.openModal('event', 'edit', {
        booking: booking
      });
    } else {
      console.warn(`Booking with ID ${bookingId} not found`);
    }
  } catch (error) {
    console.error('Error navigating to booking:', error);
    // TODO: Show admin-specific error notification
  }
};

const handleNavigateToDate = (date: Date): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'navigateToDate',
      date,
      'receive'
    );

    goToDate(date);
  } catch (error) {
    console.error('Error navigating to date:', error);
    // TODO: Show admin-specific error notification
  }
};

const handleFilterByProperty = (propertyId: string | null): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'filterByProperty',
      propertyId,
      'receive'
    );

    selectedPropertyFilter.value = propertyId;
    
    // Admin can filter by any property (not just their own)
    if (propertyId) {
      togglePropertyFilter(propertyId);
    } else {
      clearPropertyFilters();
    }
  } catch (error) {
    console.error('Error filtering by property:', error);
    // TODO: Show admin-specific error notification
  }
};

// ============================================================================
// EVENT HANDLERS - ADMIN-SPECIFIC ACTIONS
// ============================================================================

const handleAssignCleaners = (): void => {
  try {
    eventLogger.logEvent(
      'HomeAdmin',
      'HomeAdmin',
      'assignCleaners',
      null,
      'emit'
    );

    // TODO: Open cleaner assignment modal when TASK-039Q is complete
    console.log('Admin: Assign Cleaners clicked');
    // uiStore.openModal('cleanerAssignment', { bookings: unassignedBookings });
  } catch (error) {
    console.error('Error opening cleaner assignment:', error);
  }
};

const handleGenerateReports = (): void => {
  try {
    eventLogger.logEvent(
      'HomeAdmin',
      'HomeAdmin',
      'generateReports',
      null,
      'emit'
    );

    // TODO: Open reports modal or navigate to reports page
    console.log('Admin: Generate Reports clicked');
    // uiStore.openModal('reports', { dateRange: currentWeek });
  } catch (error) {
    console.error('Error opening reports:', error);
  }
};

const handleManageSystem = (): void => {
  try {
    eventLogger.logEvent(
      'HomeAdmin',
      'HomeAdmin',
      'manageSystem',
      null,
      'emit'
    );

    // TODO: Open system management modal or navigate to admin settings
    console.log('Admin: Manage System clicked');
    // uiStore.openModal('systemManagement', {});
  } catch (error) {
    console.error('Error opening system management:', error);
  }
};

// ============================================================================
// EVENT HANDLERS - CRUD OPERATIONS
// ============================================================================

const handleCreateBooking = (): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'createBooking',
      null,
      'receive'
    );

    // Admin can create bookings for any property
    uiStore.openModal('event', 'create', {
      booking: null
    });
  } catch (error) {
    console.error('Error creating booking:', error);
  }
};

const handleCreateProperty = (): void => {
  try {
    eventLogger.logEvent(
      'Sidebar',
      'HomeAdmin',
      'createProperty',
      null,
      'receive'
    );

    // Admin can create properties for any owner
    uiStore.openModal('property', 'create', {
      property: null
    });
  } catch (error) {
    console.error('Error creating property:', error);
  }
};

const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string }): void => {
  try {
    eventLogger.logEvent(
      'FullCalendar',
      'HomeAdmin',
      'createBooking',
      data,
      'receive'
    );

    // Convert FullCalendar data format to BookingFormData format
    const bookingData: Partial<BookingFormData> = {
      checkout_date: data.start,
      checkin_date: data.end,
      property_id: data.propertyId,
      booking_type: 'standard',
      status: 'pending'
    };

    uiStore.openModal('event', 'create', {
      booking: bookingData
    });
  } catch (error) {
    console.error('Error creating booking from calendar:', error);
  }
};

// ============================================================================
// EVENT HANDLERS - CALENDAR INTERACTIONS
// ============================================================================

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  try {
    const data = {
      start: selectInfo.startStr,
      end: selectInfo.endStr
    };

    handleCreateBookingFromCalendar(data);
  } catch (error) {
    console.error('Error handling date select:', error);
  }
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  try {
    const bookingId = clickInfo.event.id;
    const booking = allBookingsMap.value.get(bookingId);
    
    if (booking) {
      uiStore.openModal('event', 'edit', {
        booking: booking
      });
    }
  } catch (error) {
    console.error('Error handling event click:', error);
  }
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  try {
    const bookingId = dropInfo.event.id;
    const booking = allBookingsMap.value.get(bookingId);
    
    if (booking) {
      const updatedBooking: Partial<BookingFormData> = {
        ...booking,
        checkout_date: dropInfo.event.startStr,
        checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
      };
      
      updateBooking(bookingId, updatedBooking);
    }
  } catch (error) {
    console.error('Error handling event drop:', error);
    // Revert the event
    dropInfo.revert();
  }
};

const handleEventResize = (resizeInfo: any): void => {
  try {
    const bookingId = resizeInfo.event.id;
    const booking = allBookingsMap.value.get(bookingId);
    
    if (booking) {
      const updatedBooking: Partial<BookingFormData> = {
        ...booking,
        checkout_date: resizeInfo.event.startStr,
        checkin_date: resizeInfo.event.endStr || resizeInfo.event.startStr
      };
      
      updateBooking(bookingId, updatedBooking);
    }
  } catch (error) {
    console.error('Error handling event resize:', error);
    // Revert the event
    resizeInfo.revert();
  }
};

const handleUpdateBooking = (data: { id: string; start: string; end: string }): void => {
  try {
    // Convert FullCalendar data format to BookingFormData format
    const booking = allBookingsMap.value.get(data.id);
    if (booking) {
      const bookingData: Partial<BookingFormData> = {
        ...booking,
        checkout_date: data.start,
        checkin_date: data.end
      };
      updateBooking(data.id, bookingData);
    }
  } catch (error) {
    console.error('Error updating booking:', error);
  }
};

// ============================================================================
// EVENT HANDLERS - CALENDAR CONTROLS
// ============================================================================

const handleCalendarViewChange = (view: CalendarView): void => {
  try {
    // Convert generic CalendarView to FullCalendar-specific view names
    let fullCalendarView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';
    switch (view) {
      case 'month':
        fullCalendarView = 'dayGridMonth';
        break;
      case 'week':
        fullCalendarView = 'timeGridWeek';
        break;
      case 'day':
        fullCalendarView = 'timeGridDay';
        break;
      default:
        fullCalendarView = 'timeGridWeek';
    }
    setCalendarView(fullCalendarView);
  } catch (error) {
    console.error('Error changing calendar view:', error);
  }
};

const handleCalendarDateChange = (date: Date): void => {
  try {
    goToDate(date);
  } catch (error) {
    console.error('Error changing calendar date:', error);
  }
};

const handlePrevious = (): void => {
  try {
    prev();
  } catch (error) {
    console.error('Error going to previous:', error);
  }
};

const handleNext = (): void => {
  try {
    next();
  } catch (error) {
    console.error('Error going to next:', error);
  }
};

const handleGoToday = (): void => {
  try {
    goToToday();
  } catch (error) {
    console.error('Error going to today:', error);
  }
};

// ============================================================================
// EVENT HANDLERS - MODAL MANAGEMENT
// ============================================================================

const handleEventModalClose = (): void => {
  try {
    uiStore.closeModal('event');
  } catch (error) {
    console.error('Error closing event modal:', error);
  }
};

const handleEventModalSave = async (bookingData: BookingFormData): Promise<void> => {
  try {
    if (eventModalMode.value === 'create') {
      await createBooking(bookingData);
    } else if (eventModalMode.value === 'edit') {
      // Get the booking ID from modal data since BookingFormData doesn't include id
      const modalData = uiStore.getModalData('event') as any;
      const bookingId = modalData?.booking?.id;
      if (bookingId) {
        await updateBooking(bookingId, bookingData);
      }
    }
    
    uiStore.closeModal('event');
  } catch (error) {
    console.error('Error saving booking:', error);
    // TODO: Show admin-specific error notification
  }
};

const handleEventModalDelete = (bookingId: string): void => {
  try {
    // Show confirmation dialog for admin
    uiStore.openConfirmDialog('confirm', {
      title: 'Delete Booking',
      message: 'Are you sure you want to delete this booking? This action cannot be undone and will affect the property owner.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: {
        onConfirm: () => {
          deleteBooking(bookingId);
          uiStore.closeModal('event');
          uiStore.closeConfirmDialog('confirm');
        }
      }
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
  }
};

const handlePropertyModalClose = (): void => {
  try {
    uiStore.closeModal('property');
  } catch (error) {
    console.error('Error closing property modal:', error);
  }
};

const handlePropertyModalSave = async (propertyData: PropertyFormData): Promise<void> => {
  try {
    if (propertyModalMode.value === 'create') {
      await createProperty(propertyData);
    } else if (propertyModalMode.value === 'edit') {
      // Get the property ID from modal data since PropertyFormData doesn't include id
      const modalData = uiStore.getModalData('property') as any;
      const propertyId = modalData?.property?.id;
      if (propertyId) {
        await updateProperty(propertyId, propertyData);
      }
    }
    
    uiStore.closeModal('property');
  } catch (error) {
    console.error('Error saving property:', error);
    // TODO: Show admin-specific error notification
  }
};

const handlePropertyModalDelete = (propertyId: string): void => {
  try {
    // Show confirmation dialog for admin with business impact warning
    const property = allPropertiesMap.value.get(propertyId);
    const relatedBookings = Array.from(allBookingsMap.value.values())
      .filter(booking => booking.property_id === propertyId);
    
    uiStore.openConfirmDialog('confirm', {
      title: 'Delete Property',
      message: `Are you sure you want to delete "${property?.name}"? This will affect ${relatedBookings.length} bookings and impact the property owner's business.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      dangerous: true,
      data: {
        onConfirm: () => {
          deleteProperty(propertyId);
          uiStore.closeModal('property');
          uiStore.closeConfirmDialog('confirm');
        }
      }
    });
  } catch (error) {
    console.error('Error deleting property:', error);
  }
};

// ============================================================================
// EVENT HANDLERS - CONFIRMATION DIALOG
// ============================================================================

const handleConfirmDialogConfirm = (): void => {
  try {
    const confirmData = uiStore.getConfirmDialogState('confirm');
    const onConfirm = confirmData?.data?.onConfirm;
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm();
    }
  } catch (error) {
    console.error('Error handling confirm dialog confirm:', error);
  }
};

const handleConfirmDialogCancel = (): void => {
  try {
    const confirmData = uiStore.getConfirmDialogState('confirm');
    const onCancel = confirmData?.data?.onCancel;
    if (onCancel && typeof onCancel === 'function') {
      onCancel();
    }
    uiStore.closeConfirmDialog('confirm');
  } catch (error) {
    console.error('Error handling confirm dialog cancel:', error);
  }
};

const handleConfirmDialogClose = (): void => {
  try {
    uiStore.closeConfirmDialog('confirm');
  } catch (error) {
    console.error('Error closing confirm dialog:', error);
  }
};

// ============================================================================
// UI HELPERS
// ============================================================================

const toggleSidebar = (): void => {
  sidebarOpen.value = !sidebarOpen.value;
};

// ============================================================================
// LIFECYCLE HOOKS
// ============================================================================

onMounted(async () => {
  try {
    // Admin needs to fetch ALL data
    await Promise.all([
      fetchAllBookings(),
      fetchAllProperties()
    ]);
    
    // Set up responsive sidebar
    watch(xs, (newVal) => {
      sidebarOpen.value = !newVal;
    }, { immediate: true });
    
  } catch (error) {
    console.error('Error initializing HomeAdmin:', error);
    // TODO: Show admin-specific error notification
  }
});

onUnmounted(() => {
  // Cleanup if needed
});
</script>

<style scoped>
.home-admin-container {
  /* Remove fixed height to work with Vuetify layout */
  min-height: calc(100vh - 64px); /* Account for app bar */
  overflow: hidden;
}

.sidebar-column {
  /* Use min-height instead of fixed height */
  min-height: calc(100vh - 64px);
  overflow-y: auto;
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgb(var(--v-theme-surface));
}

.calendar-column {
  /* Use min-height instead of fixed height */
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.calendar-header {
  padding: 16px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  background-color: rgb(var(--v-theme-surface));
  flex-shrink: 0;
}

.mobile-hidden {
  display: none;
}

/* Admin-specific styling */
.home-admin-container .calendar-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
}

.home-admin-container .calendar-header .v-btn {
  color: rgb(var(--v-theme-on-primary));
}

.home-admin-container .calendar-header .text-h6 {
  color: rgb(var(--v-theme-on-primary));
  font-weight: 600;
}

/* System metrics styling */
.home-admin-container .text-caption {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 1024px) {
  .sidebar-column {
    position: fixed;
    top: 64px; /* Account for app bar */
    left: 0;
    z-index: 1000;
    width: 100% !important;
    max-width: 400px;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    height: calc(100vh - 64px); /* Account for app bar */
  }
  
  .mobile-hidden {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .sidebar-column:not(.mobile-hidden) {
    transform: translateX(0);
  }
}

@media (max-width: 600px) {
  .calendar-header {
    padding: 8px;
  }
  
  .calendar-header .d-flex {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .calendar-header .v-btn-toggle {
    margin-left: 0 !important;
    margin-top: 8px;
  }
}

/* Admin color scheme */
.home-admin-container {
  --admin-primary: rgb(var(--v-theme-primary));
  --admin-secondary: rgb(var(--v-theme-secondary));
  --admin-warning: rgb(var(--v-theme-warning));
  --admin-info: rgb(var(--v-theme-info));
}
</style> 