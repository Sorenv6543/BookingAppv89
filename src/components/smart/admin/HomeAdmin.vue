<!-- 
👑 ADMIN INTERFACE
 src/components/smart/admin/HomeAdmin.vue - 

✅ UNFILTERED VIEW - Admin sees all data
✅ Access to all properties across all owners
✅ System-wide metrics and controls
✅ Can manage any owner's data 

 -->
<template>
  <div class="home-admin-layout">
    <!-- Main Dashboard Content (sidebar and header are now in admin layout) -->
    <AdminDashboard />
    

    </div>
   
  
    

      <!-- Owner-focused Modals -->
      <BookingForm
      :open="eventModalOpen"
      :mode="eventModalMode"
      :booking="eventModalMode === 'edit' ? eventModalData : undefined"
      :initial-data="eventModalMode === 'create' ? eventModalData : undefined"
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useDisplay } from 'vuetify';

// Owner-specific components

import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue';
import AdminDashboard from './AdminDashboard.vue';
import BookingForm from '@/components/dumb/BookingForm.vue';
import PropertyModal from '@/components/dumb/PropertyModal.vue';
import ConfirmationDialog from '@/components/dumb/shared/ConfirmationDialog.vue';


import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { useCalendarState } from '@/composables/shared/useCalendarState';




import { useAdminBookings } from '@/composables/admin/useAdminBookings';
import { useAdminProperties } from '@/composables/admin/useAdminProperties';
  import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement';
  import type { Booking, Property, BookingFormData, PropertyFormData,  } from '@/types';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// ============================================================================
// STORE CONNECTIONS & STATE
// ============================================================================

//useRealtimeSync(); // Just call it for side effects
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
  deleteBooking
} = useAdminBookings();

const { 
  createProperty,
  updateProperty,
  deleteProperty,
} = useAdminProperties();

const {
  currentView,
  currentDate,
  setCalendarView,
  goToDate,
  next,
  prev
} = useCalendarState();

// ============================================================================
// LOCAL STATE
// ============================================================================
const calendarRef = ref<InstanceType<typeof AdminCalendar> | null>(null);
const sidebarOpen = ref(false);
const selectedPropertyFilter = ref<string | null>(null);


  
const { users: allUsers, fetchAllUsers } = useAdminUserManagement()


const selectedDate = ref<string | null>(null)
const isEditMode = ref(false)
const loading = ref(false)


// Computed properties for admin authentication and data
const isAdminAuthenticated = computed(() => authStore.isAuthenticated && authStore.user?.role === 'admin');

const allProperties = computed(() => Array.from(propertyStore.properties.values()));
const allBookings = computed(() => Array.from(bookingStore.bookings.values()));
const systemMetrics = computed(() => ({
  totalProperties: allProperties.value.length,
  totalBookings: allBookings.value.length,
  totalUsers: allUsers.value.length
}));
const systemPropertyMetrics = computed(() => ({
  activeProperties: allProperties.value.filter(p => p.status === 'active').length,
  inactiveProperties: allProperties.value.filter(p => p.status === 'inactive').length
}));

const usersMap = {
  users: allUsers,
  fetchAllUsers: fetchAllUsers,
  selectedDate: selectedDate,
  isEditMode: isEditMode,
  loading: loading,
  currentView: currentView,
}


// ============================================================================
// CALENDAR EVENT HANDLERS
// ============================================================================

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  const bookingData: Partial<BookingFormData> = {
    checkout_date: selectInfo.startStr,
    checkin_date: selectInfo.endStr,
  };
  
  uiStore.openModal('eventModal', 'create', bookingData);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  // Check if this is an edit event from the bottom sheet
  const extendedProps = clickInfo.event.extendedProps;
  if (extendedProps && extendedProps.isEdit && extendedProps.booking) {
    // Use the booking data directly from the bottom sheet
    const booking = extendedProps.booking as Booking;
    uiStore.openModal('eventModal', 'edit', booking);
    return;
  }
  
  // Fallback: Admin can edit any booking
  const booking = extendedProps?.booking as Booking;
  if (booking) {
    uiStore.openModal('eventModal', 'edit', booking);
  }
};

const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  // Prevent multiple simultaneous updates
  if (bookingsLoading.value) {
    console.warn('Update already in progress');
    dropInfo.revert();
    return;
  }
  
  try {
    // Use nextTick to batch reactive updates
    await nextTick();
    
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr,
    });
    
    // Additional nextTick to ensure DOM updates complete
    await nextTick();
    
  } catch (error) {
    console.error('Failed to update booking:', error);
    dropInfo.revert();
  }
};

const handleEventResize = async (resizeInfo: EventDropArg): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  // Prevent multiple simultaneous updates
  if (bookingsLoading.value) {
    console.warn('Resize update already in progress');
    resizeInfo.revert();
    return;
  }
  
  try {
    // Use nextTick to batch reactive updates
    await nextTick();
    
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr,
    });
    
    // Additional nextTick to ensure DOM updates complete
    await nextTick();
    
  } catch (error) {
    console.error('Failed to update booking:', error);
    resizeInfo.revert();
  }
};

// ============================================================================
// CALENDAR CONTROL HANDLERS
// ============================================================================

// const handlePrevious = (): void => {
//   prev();
//   const calendarApi = calendarRef.value?.getApi?.();
//   if (calendarApi) {
//     calendarApi.prev();
//   }
// };

// const handleNext = (): void => {
//   next();
//   const calendarApi = calendarRef.value?.getApi?.();
//   if (calendarApi) {
//     calendarApi.next();
//   }
// };


// const handleCalendarViewChange = (view: string): void => {
//   // Map CalendarView to FullCalendar view type
//   const calendarView = view === 'week' ? 'timeGridWeek' : 
//                       view === 'day' ? 'timeGridDay' : 
//                       'dayGridMonth';
//   setCalendarView(calendarView);
// };

// const handleCalendarDateChange = (date: Date): void => {
//   goToDate(date);
//   const calendarApi = calendarRef.value?.getApi?.();
//   if (calendarApi) {
//     calendarApi.gotoDate(date);
//   }
// };


// const handleCreateBookingFromCalendar = (data: { start: string; end: string; propertyId?: string | undefined; }): void => {
//   const bookingData = {
//     ...data,
//     owner_id: currentOwnerId.value
//   };
//   uiStore.openModal('eventModal', 'create', bookingData);
// };

// const handleUpdateBooking = (data: { id: string; updates: Partial<Booking> }): void => {
//   // Admin can update any booking
//   updateBooking(data.id, data.updates);
// };

const handleCreateBooking = (data: { start: string; end: string; propertyId?: string }): void => {
  const bookingData = {
    ...data,
  };
  uiStore.openModal('eventModal', 'create', bookingData);
};

const handleAssignCleaner = (data: { bookingId: string; cleanerId: string; notes?: string }): void => {
  // Admin can assign cleaners to any booking
  console.log('Assign cleaner:', data);
};

// const handleUpdateBookingStatus = (data: { bookingId: string; status: Booking['status'] }): void => {
//   // Admin can update status of any booking
//   updateBooking(data.bookingId, { status: data.status });
// };

// const handleViewChange = (view: string): void => {
//   setCalendarView(view);
// };

const handleDateChange = (date: Date): void => {
  goToDate(date);
};

const handleUpdateBooking = (data: { id: string; updates: Partial<Booking> }): void => {
  // Admin can update any booking
  updateBooking(data.id, data.updates);
};

const handleUpdateBookingStatus = (data: { bookingId: string; status: Booking['status'] }): void => {
  // Admin can update status of any booking
  updateBooking(data.bookingId, { status: data.status });
};

const handleViewChange = (view: string): void => {
  // Validate view type before setting
  const validViews = ['timeGridWeek', 'dayGridMonth', 'timeGridDay'] as const;
  if (validViews.includes(view as any)) {
    setCalendarView(view as 'timeGridWeek' | 'dayGridMonth' | 'timeGridDay');
  }
};

// ============================================================================
// MODAL EVENT HANDLERS
// ============================================================================

const handleEventModalClose = (): void => {
  uiStore.closeModal('eventModal');
};

const handleEventModalSave = async (data: BookingFormData): Promise<void> => {
  try {
    
    const bookingData = {
      ...data,
     
    };
    
    if (eventModalMode.value === 'create') {
      await createBooking(bookingData as BookingFormData);
    } else if (eventModalData.value) {
      // eventModalData.value should be the booking directly
      const booking = eventModalData.value;
      
      // Verify owner can update this booking
      if (authStore.user?.role !== 'admin') {
        console.error('🚨 [HomeAdmin] Booking ownership check failed - booking not found in owner map');
        throw new Error('Cannot update booking not owned by current user');
      }
      await updateBooking(booking.id, bookingData as Partial<BookingFormData>);
    }
    uiStore.closeModal('eventModal');
  } catch (error) {
    console.error('Failed to save the booking:', error);
  }
};

const handleEventModalDelete = async (bookingId: string): Promise<void> => {
  // Verify owner can delete this booking
  if (authStore.user?.role !== 'admin') {
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
    };
    
    if (propertyModalMode.value === 'create') {
      await createProperty(propertyData as PropertyFormData);
    } else if (propertyModalData.value) {
      // Verify owner can update this property
      if (authStore.user?.role !== 'admin') {
        throw new Error('Cannot update property not owned by current admin');
      }
      await updateProperty(propertyModalData.value.id, propertyData as Partial<PropertyFormData>);
    }
    uiStore.closeModal('propertyModal');
  } catch (error) {
    console.error('Failed to save the property:', error);
  }
};

const handlePropertyModalDelete = async (propertyId: string): Promise<void> => {
  // Verify owner can delete this property
    if (authStore.user?.role !== 'admin') {
    console.warn('Cannot delete property not owned by current admin');
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
// CONFIRMATION DIALOG HANDLERS
// ============================================================================

const handleConfirmDialogConfirm = async (): Promise<void> => {
  const data = confirmDialogData.value;
  
  if (data?.type === 'booking' && data?.id) {
    try {
      // Admin can delete any booking - no ownership check needed
      await deleteBooking(data.id as string);
      uiStore.closeModal('eventModal');
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  } else if (data?.type === 'property' && data?.id) {
    try {
      // Admin can delete any property - no ownership check needed
      await deleteProperty(data.id as string);
      uiStore.closeModal('propertyModal');
    } catch (error) {
      console.error('Failed to delete property:', error);
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

console.log('🔄 [HomeAdmin] Admin component script setup running...');

// Watch for template rendering (proper debugging)
watch(isAdminAuthenticated, (newValue) => {
  console.log('🎨 [HomeAdmin] Template will render, isAdminAuthenticated:', newValue);
}, { immediate: true });

onMounted(async () => {
  console.log('🚀 [HomeAdmin] Admin component mounted successfully!');
  // Wait for auth to be properly initialized
  if (authStore.loading) {
    console.log('⏳ [HomeAdmin] Auth store still loading, waiting...');
    const maxWait = 5000; // 5 seconds max
    const startTime = Date.now();
    while (authStore.loading && (Date.now() - startTime) < maxWait) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  console.log('🔍 [HomeAdmin] Auth state after waiting:', {
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    loading: authStore.loading,
    isAdminAuthenticated: isAdminAuthenticated.value
  });
  
  if (isAdminAuthenticated.value) {
    console.log('✅ [HomeAdmin] User is authenticated as admin, loading system data...');
    try {
      // Fetch ALL data across system - admin has full access
      await Promise.all([
        propertyStore.fetchProperties(),
        bookingStore.fetchBookings(),
        fetchAllUsers()
      ]);
      console.log('✅ [HomeAdmin] System data loaded successfully');
      
      // Debug data after loading
      console.log('🔍 [HomeAdmin] System data state after loading:', {
        allProperties: allProperties.value.length,
        allBookings: allBookings.value.length,
        allUsers: allUsers.value.length,
        systemMetrics: systemMetrics.value,
        propertyMetrics: systemPropertyMetrics.value
      });
      
    } catch (error) {
      console.error('❌ [HomeAdmin] Failed to load system data:', error);
    }
  } else {
    console.warn('⚠️ [HomeAdmin] User is not authenticated as admin, redirecting or showing error');
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
watch(isAdminAuthenticated, async (newValue, oldValue) => {
  console.log('🔄 [HomeAdmin] isAdminAuthenticated changed:', { 
    from: oldValue, 
    to: newValue,
    user: authStore.user
  });
  if (newValue && !oldValue) {
    // User became authenticated as admin - load all system data
    console.log('✅ [HomeAdmin] User gained admin authentication, loading system data...');
    try {
      await Promise.all([
        propertyStore.fetchProperties(),
        bookingStore.fetchBookings(),
        fetchAllUsers()
      ]);
      console.log('✅ [HomeAdmin] System data loaded after auth change');
    } catch (error) {
      console.error('❌ [HomeAdmin] Failed to load system data after auth change:', error);
    }
  } else if (!newValue && oldValue) {
    // User lost admin authentication
    console.log('⚠️ [HomeAdmin] User lost admin authentication');
  }
});
</script>

<style scoped>
/* ================================================================ */
/* ADMIN-SPECIFIC LAYOUT STYLES */
/* ================================================================ */

.home-admin-layout {
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
}

.calendar-main-container.sidebar-open {
  margin-left: 280px; /* Match sidebar width */
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
  height: 48px;
  min-height: 48px;
  max-height: 48px;
}

.prominent-header {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgba(var(--v-theme-primary), 0.9) 100%) !important;
  border-bottom: 3px solid rgba(var(--v-theme-secondary), 0.8) !important;
  height: 80px !important;
  min-height: 80px !important;
  max-height: 80px !important;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.25) !important;
}

/* Admin-specific header styling */
.admin-header {
  background: linear-gradient(135deg, #d32f2f 0%, rgba(211, 47, 47, 0.9) 100%) !important;
  border-bottom: 3px solid rgba(255, 152, 0, 0.8) !important;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.25) !important;
}

.calendar-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  height: calc(100% - 80px); /* Subtract admin header height */
}

/* Admin-specific navigation arrows */
.nav-arrow-prominent.admin-nav {
  background: rgba(255, 255, 255, 0.95) !important;
  color: #d32f2f !important;
  border: 2px solid rgba(255, 255, 255, 0.8) !important;
}

.nav-arrow-prominent.admin-nav:hover {
  background: rgba(255, 255, 255, 1) !important;
  transform: scale(1.05) !important;
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2) !important;
}

/* Admin month display */
.month-display-prominent.admin-month {
  background: rgba(255, 255, 255, 0.95);
  color: #d32f2f;
  padding: 12px 24px;
  border-radius: 16px;
  text-align: center;
  min-width: 250px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

.admin-metrics {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(211, 47, 47, 0.8);
  line-height: 1;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* ================================================================ */
/* MAIN APP HEADER - ADMIN STYLING */
/* ================================================================ */

.main-app-header {
  background: white !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  border-bottom: 1px solid #e0e0e0 !important;
  z-index: 19 !important;
  transition: margin-left 0.3s ease-in-out;
  margin-left: 0;
}

.main-app-header.sidebar-open {
  margin-left: 280px;
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

/* Admin brand styling */
.brand-icon.admin-brand {
  background: #d32f2f;
  border: 2px solid #ff9800;
  animation: admin-pulse 3s infinite;
}

@keyframes admin-pulse {
  0% { 
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0.7);
  }
  70% { 
    box-shadow: 0 0 0 6px rgba(211, 47, 47, 0);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(211, 47, 47, 0);
  }
}

.brand-text {
  color: #d32f2f;
  font-weight: 700;
  font-size: 1.1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.main-app-header .v-app-bar-nav-icon {
  color: #d32f2f !important;
}

.main-app-header .v-app-bar-nav-icon:hover {
  background: rgba(211, 47, 47, 0.05) !important;
}

/* ================================================================ */
/* ADMIN SPEED DIAL ACTIONS */
/* ================================================================ */

.speed-dial-action {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 8px;
  width: 140px;
  margin-bottom: 8px;
}

.speed-dial-action .text-body-2 {
  justify-self: end;
  white-space: nowrap;
  color: #d32f2f;
  font-weight: 600;
}

.speed-dial-action .v-fab {
  justify-self: center;
}

/* ================================================================ */
/* RESPONSIVE MOBILE-FIRST ENHANCEMENTS */
/* ================================================================ */

@media (max-width: 959px) {
  .home-admin-layout {
    height: 100vh !important;
    height: calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
  }
  
  .calendar-main-container {
    height: calc(100vh - 56px - env(safe-area-inset-top) - env(safe-area-inset-bottom)) !important;
    margin-top: calc(56px + env(safe-area-inset-top)) !important;
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .prominent-header.admin-header {
    height: 70px !important;
    min-height: 70px !important;
    max-height: 70px !important;
  }
  
  .calendar-content {
    height: calc(100% - 70px) !important;
  }
  
  .month-display-prominent.admin-month {
    min-width: 180px !important;
    padding: 8px 16px !important;
  }
}

@media (min-width: 960px) {
  .calendar-main-container {
    margin-left: 0;
    height: calc(100vh - 56px) !important;
    margin-top: 56px !important;
  }
}
</style>
