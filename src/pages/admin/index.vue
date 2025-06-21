<!-- 
👑 ADMIN INTERFACE
 src/pages/admin/index.vue - Admin Dashboard

✅ UNFILTERED VIEW - Admin sees all data
✅ Access to all properties across all owners
✅ System-wide metrics and controls
✅ Can manage any owner's data 
-->
<template>
  <div class="admin-dashboard-container">
    <!-- Admin Dashboard Header -->
    <div class="admin-dashboard-header">
      <div class="d-flex align-center justify-space-between flex-wrap">
        <div>
          <h2 class="text-h4 font-weight-bold mb-1">
            Admin Dashboard
          </h2>
          <div class="text-subtitle-1 text-medium-emphasis">
            {{ formattedDate }}
          </div>
        </div>

        <!-- System-wide Metrics -->
        <div class="admin-metrics d-flex align-center flex-wrap ga-4">
          <v-chip
            color="primary"
            variant="outlined"
            prepend-icon="mdi-home-group"
          >
            {{ allPropertiesMap.size }} Properties
          </v-chip>
          <v-chip
            color="info"
            variant="outlined"
            prepend-icon="mdi-calendar-edit"
          >
            {{ allBookingsMap.size }} Bookings
          </v-chip>
          <v-chip
            color="warning"
            variant="outlined"
            prepend-icon="mdi-fire"
          >
            {{ systemTodayTurns.size }} Urgent Turns
          </v-chip>
          <v-chip
            color="success"
            variant="outlined"
            prepend-icon="mdi-calendar-clock"
          >
            {{ systemUpcomingCleanings.size }} Upcoming
          </v-chip>
        </div>
      </div>
    </div>

    <AdminVbar
      :loading="loading"
      @toggle-drawer="toggleDrawer"
      @logout="logout"
      @create-booking="createBooking"
      @create-property="createProperty"
    />
    <!-- OwnerSidebar: Shows only current owner's data -->
    <AdminSidebar
      :today-turns="systemTodayTurns"
      :upcoming-cleanings="systemUpcomingCleanings"
      :properties="allPropertiesMap"
      :loading="loading"
      @navigate-to-booking="handleNavigateToBooking"
      @navigate-to-date="handleNavigateToDate"
      @filter-by-property="handleFilterByProperty" 
    />
    <!-- Admin Calendar - Full Width -->
    <div class="admin-calendar-wrapper">
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
        @assign-cleaner="handleCleanerAssign"
        @update-booking-status="handleStatusChange"
      />
    </div>

    <!-- Admin-focused Modals -->
    <AdminBookingModal
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalData"
      @close="handleEventModalClose"
      @save="handleEventModalSave"
      @delete="handleEventModalDelete"
      @assign-cleaner="handleCleanerAssign"
      @status-change="handleStatusChange"
    />

    <AdminPropertyModal
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Admin components (using generic components for now)
import AdminVbar from '@/components/smart/admin/AdminVbar.vue';
import AdminSidebar from '@/components/dumb/admin/AdminSidebar.vue';

import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue';
import AdminBookingModal from '@/components/dumb/admin/AdminBookingModal.vue';

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
import type { Booking, Property, BookingFormData, PropertyFormData, BookingStatus, User } from '@/types';
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
  prev
} = useCalendarState();

// ============================================================================
// LOCAL STATE
// ============================================================================
const calendarRef = ref<InstanceType<typeof AdminCalendar> | null>(null);

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
  const map = new Map<string, User>();
  
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

// Event Modal State
const eventModalOpen = computed(() => uiStore.isModalOpen('event'));
const eventModalMode = computed((): 'create' | 'admin-edit' | undefined => {
  const modalState = uiStore.getModalState('event');
  const mode = modalState?.mode;
  return (mode === 'create' || mode === 'admin-edit') ? mode : undefined;
});
const eventModalData = computed((): Booking | undefined => {
  const modalData = uiStore.getModalData('event') as { booking?: Booking };
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
  const modalData = uiStore.getModalData('property') as { property?: Property };
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
// EVENT HANDLERS - ADMIN-SPECIFIC ACTIONS
// ============================================================================

const handleAssignCleaners = (): void => {
  try {
    eventLogger.logEvent(
      'AdminDashboard',
      'AdminDashboard',
      'assignCleaners',
      null,
      'emit'
    );

    // TODO: Open cleaner assignment modal when implemented
    console.log('Admin: Assign Cleaners clicked');
  } catch (error) {
    console.error('Error opening cleaner assignment:', error);
  }
};

const handleGenerateReports = (): void => {
  try {
    eventLogger.logEvent(
      'AdminDashboard',
      'AdminDashboard',
      'generateReports',
      null,
      'emit'
    );

    // TODO: Open reports modal or navigate to reports page
    console.log('Admin: Generate Reports clicked');
  } catch (error) {
    console.error('Error opening reports:', error);
  }
};

const handleManageSystem = (): void => {
  try {
    eventLogger.logEvent(
      'AdminDashboard',
      'AdminDashboard',
      'manageSystem',
      null,
      'emit'
    );

    // TODO: Open system management modal or navigate to admin settings
    console.log('Admin: Manage System clicked');
  } catch (error) {
    console.error('Error opening system management:', error);
  }
};

const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string }): void => {
  try {
    eventLogger.logEvent(
      'AdminCalendar',
      'AdminDashboard',
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
      uiStore.openModal('event', 'admin-edit', {
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

const handleEventResize = (resizeInfo: { event: { id: string; startStr: string; endStr?: string; end?: Date }; revert: () => void }): void => {
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

const handleUpdateBooking = (data: { id: string; updates: Partial<Booking> }): void => {
  try {
    updateBooking(data.id, data.updates);
  } catch (error) {
    console.error('Error updating booking:', error);
  }
};

// ============================================================================
// EVENT HANDLERS - CALENDAR CONTROLS
// ============================================================================

const handleCalendarViewChange = (view: string): void => {
  try {
    setCalendarView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
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
    } else if (eventModalMode.value === 'admin-edit') {
      // Get the booking ID from modal data since BookingFormData doesn't include id
      const modalData = uiStore.getModalData('event') as { booking?: Booking };
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
      const modalData = uiStore.getModalData('property') as { property?: Property };
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

// New admin-specific handlers for enhanced BookingModal
const handleCleanerAssign = async (data: { bookingId: string; cleanerId: string }): Promise<void> => {
  try {
    // This would typically use useCleanerManagement composable
    console.log('Assigning cleaner:', data);
    
    // Update the booking in the store
    const booking = allBookingsMap.value.get(data.bookingId);
    if (booking) {
      const updatedBooking = { ...booking, assigned_cleaner_id: data.cleanerId, status: 'scheduled' as const };
      allBookingsMap.value.set(data.bookingId, updatedBooking);
      
      // Show success notification
      uiStore.addNotification('success', 'Cleaner Assigned', 'Cleaner has been successfully assigned to the booking.');
    }
  } catch (error) {
    console.error('Error assigning cleaner:', error);
    uiStore.addNotification('error', 'Assignment Failed', 'Failed to assign cleaner to booking.');
  }
};

const handleStatusChange = async (data: { bookingId: string; status: BookingStatus }): Promise<void> => {
  try {
    // Update the booking status in the store
    const booking = allBookingsMap.value.get(data.bookingId);
    if (booking) {
      const updatedBooking = { ...booking, status: data.status };
      allBookingsMap.value.set(data.bookingId, updatedBooking);
      
      // Show success notification
      uiStore.addNotification('success', 'Status Updated', `Booking status changed to ${data.status}.`);
    }
  } catch (error) {
    console.error('Error updating status:', error);
    uiStore.addNotification('error', 'Status Update Failed', 'Failed to update booking status.');
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
// LIFECYCLE HOOKS
// ============================================================================

onMounted(async () => {
  try {
    // Admin needs to fetch ALL data
    await Promise.all([
      fetchAllBookings(),
      fetchAllProperties()
    ]);
  } catch (error) {
    console.error('Error initializing AdminDashboard:', error);
    // TODO: Show admin-specific error notification
  }
});

onUnmounted(() => {
  // Cleanup if needed
});
</script>

<style scoped>
.admin-dashboard-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: 0;
}

.admin-dashboard-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12);
  padding: 24px;
  flex-shrink: 0;
}

.admin-metrics {
  gap: 8px;
}

.calendar-controls {
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  padding-top: 16px;
}

.admin-calendar-wrapper {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow: hidden;
}

/* Mobile responsive adjustments */
@media (max-width: 960px) {
  .admin-dashboard-header {
    padding: 16px;
  }
  
  .admin-metrics {
    margin-top: 16px;
  }
  
  .calendar-controls .d-flex {
    flex-direction: column;
    gap: 12px;
  }
  
  .admin-calendar-wrapper {
    padding: 8px;
  }
}

@media (max-width: 600px) {
  .admin-dashboard-header {
    padding: 12px;
  }
  
  .admin-calendar-wrapper {
    padding: 4px;
  }
  
  .calendar-controls .d-flex > div {
    width: 100%;
    justify-content: center;
  }
}
</style> 