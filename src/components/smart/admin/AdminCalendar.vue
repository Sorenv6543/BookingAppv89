<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="admin-calendar-container">
    <!-- Page Header -->
    <div class="page-header" /> 

    <!-- Calendar Navigation -->
    <div class="calendar-navigation">
      <v-container
        fluid
        class="pa-0"
      >
        <div class="d-flex align-center justify-center">
          <!-- Previous Month Button -->
          <v-btn
            icon="mdi-chevron-left"
            color="primary"
            variant="elevated"
            size="x-small"
            @click="navigateToPreviousMonth"
          />
          
          <!-- Month and Year Display -->
          <div class="calendar-month-year mx-5">
            <h2 class="text-h5 font-weight-bold text-primary">
              {{ getCurrentMonthYear() }}
            </h2>
          </div>
          
          <!-- Next Month Button -->
          <v-btn
            icon="mdi-chevron-right"
            color="primary"
            variant="elevated"
            size="x-small"
            @click="navigateToNextMonth"
          />
        </div>
        
        <!-- New Booking Button -->
        <div class="d-flex justify-end mt-2">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="new-booking-btn"
            @click="openNewBookingForm"
          >
            New Booking
          </v-btn>
        </div>
      </v-container>
    </div>

    <!-- Admin Calendar: Shows all bookings across all properties -->
    <!-- Main Content -->
    <div class="page-content">
      <v-row
        no-gutters
        class="fill-height"
      >
        <!-- Calendar (Full Width) -->
        <v-col
          cols="12"
          md="12"
          class="calendar-col"
        >
          <FullCalendar
            ref="calendarRef"
            :bookings="allBookings"
            :properties="allProperties"
            :loading="loading"
            class="admin-calendar"
            @date-select="handleDateSelect"
            @event-click="handleEventClick"
            @event-drop="handleEventDrop"
            @event-resize="handleEventResize"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Context Menu -->
    <v-menu
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list density="compact">
        <v-list-item
          v-for="action in contextMenuActions"
          :key="action.key"
          :prepend-icon="action.icon"
          :title="action.title"
          @click="handleContextAction(action.key)"
        />
      </v-list>
    </v-menu>

    <!-- Cleaner Assignment Modal -->
    <CleanerAssignmentModal
      v-model="cleanerAssignmentModal.show"
      :booking="cleanerAssignmentModal.booking"
      :cleaners="cleanerAssignmentModal.cleaners"
      :properties="Array.from(allProperties.values())"
      :loading="cleanerAssignmentModal.loading"
      @assign="handleCleanerAssignment"
      @close="closeCleanerAssignmentModal"
    />

    <!-- Admin Booking Form Modal -->
    <AdminBookingForm
      v-model="adminBookingFormModal.show"
      :mode="adminBookingFormModal.mode"
      :booking="adminBookingFormModal.booking"
      :properties="Array.from(allProperties.values())"
      :cleaners="(allUsers as any).filter((user: any) => user.role === 'cleaner' || user.role === 'admin')"
      :loading="adminBookingFormModal.loading"
      :errors="adminBookingFormModal.errors"
      @submit="handleAdminBookingFormSubmit"
      @delete="handleAdminBookingFormDelete"
      @mark-complete="handleAdminBookingFormMarkComplete"
      @assign-cleaner="handleAdminBookingFormAssignCleaner"
      @open-cleaner-modal="handleAdminBookingFormOpenCleanerModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import CleanerAssignmentModal from '@/components/dumb/admin/CleanerAssignmentModal.vue'
import FullCalendar from '@/components/smart/FullCalendar.vue';
import AdminBookingForm from '@/components/dumb/admin/AdminBookingForm.vue';

import { useAdminCalendarState } from '@/composables/admin/useAdminCalendarState';
import { useAdminBookings } from '@/composables/admin/useAdminBookings';
import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement';
import type { Booking, User, Cleaner, BookingFormData } from '@/types'
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core'

// Use the admin calendar state composable for centralized state management
const {
  // State
  loading,
  
  currentView,
  currentDate,
  
  // Computed properties
  allBookings,
  allProperties,
  
  // Functions
 
  setCalendarView,
  goToDate
} = useAdminCalendarState();

// Additional composables for admin functionality
const { updateBooking, deleteBooking, createBooking, assignCleanerToBooking } = useAdminBookings();
const { users: allUsers } = useAdminUserManagement();

// Calendar reference
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Component state
const currentViewingDate = ref(new Date());

// Context menu state
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  booking: null as Booking | null
});

// Cleaner assignment modal state
const cleanerAssignmentModal = ref({
  show: false,
  booking: null as Booking | null,
  cleaners: [] as Cleaner[],
  loading: false
});

// Admin booking form modal state
const adminBookingFormModal = ref({
  show: false,
  mode: 'edit' as 'create' | 'edit',
  booking: null as Booking | null,
  loading: false,
  errors: new Map<string, string[]>()
});

// Context menu actions
const contextMenuActions = computed(() => {
  if (!contextMenu.value.booking) return [];
  
  const booking = contextMenu.value.booking;
  const actions = [
    {
      key: 'view',
      title: 'View Details',
      icon: 'mdi-eye'
    },
    {
      key: 'edit',
      title: 'Edit Booking',
      icon: 'mdi-pencil'
    }
  ];

  // Add cleaner assignment action if no cleaner assigned
  if (!booking.assigned_cleaner_id) {
    actions.push({
      key: 'assign',
      title: 'Assign Cleaner',
      icon: 'mdi-account-plus'
    });
  }

  // Add status change actions
  if (booking.status !== 'completed') {
    actions.push({
      key: 'complete',
      title: 'Mark Complete',
      icon: 'mdi-check-circle'
    });
  }

  if (booking.status !== 'cancelled') {
    actions.push({
      key: 'cancel',
      title: 'Cancel Booking',
      icon: 'mdi-close-circle'
    });
  }

  return actions;
});

// Event handlers - simplified using composable
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  console.log('🗓️ [AdminCalendar] Date selected:', selectInfo.startStr, 'to', selectInfo.endStr);
  
  // Create a new booking with the selected date range
  // Ensure logical order: departure (checkout) should be before arrival (checkin)
  const departureDate = selectInfo.startStr;
  const arrivalDate = selectInfo.endStr || selectInfo.startStr;
  
  // If departure is after arrival, swap them for logical booking
  const finalDepartureDate = departureDate <= arrivalDate ? departureDate : arrivalDate;
  const finalArrivalDate = departureDate <= arrivalDate ? arrivalDate : departureDate;
  
  const newBooking: Booking = {
    id: crypto.randomUUID(),
    property_id: '',
    owner_id: '',
            checkout_date: finalDepartureDate,
        checkin_date: finalArrivalDate,
    checkout_time: '11:00',
    checkin_time: '15:00',
    booking_type: 'standard',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Open the booking form in create mode
  openAdminBookingFormModal(newBooking, 'create');
};

// Function to open new booking form
const openNewBookingForm = (): void => {
  console.log('🚀 [AdminCalendar] Opening new booking form');
  
  // Create a new booking with today's date
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const newBooking: Booking = {
    id: crypto.randomUUID(),
    property_id: '',
    owner_id: '',
            checkout_date: today,      // Guests leave today
        checkin_date: tomorrowStr,  // New guests arrive tomorrow
    checkout_time: '11:00',
    checkin_time: '15:00',
    booking_type: 'standard',
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Open the booking form in create mode
  openAdminBookingFormModal(newBooking, 'create');
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  console.log('👆 [AdminCalendar] Event clicked:', clickInfo.event.id);
  
  // Extract booking data from the event
  const booking = clickInfo.event.extendedProps.booking as Booking;
  if (booking) {
    // Open the AdminBookingForm modal in edit mode
    openAdminBookingFormModal(booking, 'edit');
  }
};

const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  console.log('🎯 [AdminCalendar] Event dropped:', dropInfo.event.id);
  const booking = dropInfo.event.extendedProps.booking as Booking;
  
  try {
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    });
  } catch (error) {
    console.error('Failed to update booking:', error);
    dropInfo.revert();
  }
};

const handleEventResize = async (resizeInfo: EventDropArg): Promise<void> => {
  console.log('🔄 [AdminCalendar] Event resized:', resizeInfo.event.id);
  const booking = resizeInfo.event.extendedProps.booking as Booking;
  
  try {
    await updateBooking(booking.id, {
      checkout_date: resizeInfo.event.startStr,
      checkin_date: resizeInfo.event.endStr
    });
  } catch (error) {
    console.error('Failed to update booking:', error);
    resizeInfo.revert();
  }
};

// Programmatic calendar methods
const goToDateInCalendar = (date: string | Date): void => {
  console.log('🗓️ [AdminCalendar] goToDate called:', date);
  const targetDate = typeof date === 'string' ? new Date(date) : date;
  
  if (calendarRef.value) {
    calendarRef.value.goToDate(targetDate);
  }
};

const changeView = (view: string): void => {
  console.log('👁️ [AdminCalendar] changeView called:', view);
  
  if (calendarRef.value) {
    calendarRef.value.changeView(view);
  }
  setCalendarView(view as 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay');
};

const refreshEvents = (): void => {
  console.log('🔄 [AdminCalendar] refreshEvents called');
  if (calendarRef.value) {
    calendarRef.value.refreshEvents();
  }
};

const getApi = () => {
  return calendarRef.value?.getApi() || null;
};

// Calendar navigation functions
const getCurrentMonthYear = () => {
  return currentViewingDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const navigateToPreviousMonth = () => {
  const newDate = new Date(currentViewingDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentViewingDate.value = newDate;
  goToDateInCalendar(newDate);
};

const navigateToNextMonth = () => {
  const newDate = new Date(currentViewingDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentViewingDate.value = newDate;
  goToDateInCalendar(newDate);
};

// Context menu handlers
const handleContextAction = (action: string): void => {
  const booking = contextMenu.value.booking;
  if (!booking) return;

  switch (action) {
    case 'view':
      openAdminBookingFormModal(booking, 'edit');
      break;
    case 'edit':
      openAdminBookingFormModal(booking, 'edit');
      break;
    case 'assign':
      openCleanerAssignmentModal(booking);
      break;
    case 'complete':
      updateBooking(booking.id, { status: 'completed' });
      break;
    case 'cancel':
      updateBooking(booking.id, { status: 'cancelled' });
      break;
  }
  
  contextMenu.value.show = false;
};

// Admin booking form modal handlers
const openAdminBookingFormModal = (booking: Booking, mode: 'create' | 'edit' = 'edit'): void => {
  adminBookingFormModal.value = {
    show: true,
    mode,
    booking: mode === 'edit' ? booking : null,
    loading: false,
    errors: new Map<string, string[]>()
  };
};

const closeAdminBookingFormModal = (): void => {
  adminBookingFormModal.value.show = false;
  adminBookingFormModal.value.booking = null;
  adminBookingFormModal.value.loading = false;
  adminBookingFormModal.value.errors = new Map<string, string[]>();
};

const openCleanerAssignmentModal = (booking: Booking): void => {
  // Get available cleaners (users with cleaner role)
  const cleaners = allUsers.value.filter((user: User) => 
    user.role === 'cleaner' || user.role === 'admin'
  ) as Cleaner[];
  
  cleanerAssignmentModal.value = {
    show: true,
    booking,
    cleaners,
    loading: false
  };
};

const closeCleanerAssignmentModal = (): void => {
  cleanerAssignmentModal.value.show = false;
  cleanerAssignmentModal.value.booking = null;
  cleanerAssignmentModal.value.cleaners = [];
  cleanerAssignmentModal.value.loading = false;
};

const handleCleanerAssignment = async (cleanerId: string): Promise<void> => {
  cleanerAssignmentModal.value.loading = true;
  
  try {
    const booking = cleanerAssignmentModal.value.booking;
    if (booking) {
      await assignCleanerToBooking(cleanerId, booking.id);
    }
    closeCleanerAssignmentModal();
  } catch (error) {
    console.error('Failed to assign cleaner:', error);
  } finally {
    cleanerAssignmentModal.value.loading = false;
  }
};

// Admin booking form event handlers
const handleAdminBookingFormSubmit = async (data: Record<string, unknown>): Promise<void> => {
  adminBookingFormModal.value.loading = true;
  try {
    if (adminBookingFormModal.value.mode === 'create') {
      await createBooking(data as BookingFormData);
    } else if (adminBookingFormModal.value.booking) {
      await updateBooking(adminBookingFormModal.value.booking.id, data);
    }
    closeAdminBookingFormModal();
  } catch (error) {
    console.error('Failed to save booking:', error);
  } finally {
    adminBookingFormModal.value.loading = false;
  }
};

const handleAdminBookingFormDelete = async (bookingId: string): Promise<void> => {
  adminBookingFormModal.value.loading = true;
  try {
    await deleteBooking(bookingId);
    closeAdminBookingFormModal();
  } catch (error) {
    console.error('Failed to delete booking:', error);
  } finally {
    adminBookingFormModal.value.loading = false;
  }
};

const handleAdminBookingFormMarkComplete = async (bookingId: string): Promise<void> => {
  adminBookingFormModal.value.loading = true;
  try {
    await updateBooking(bookingId, { status: 'completed' });
    closeAdminBookingFormModal();
  } catch (error) {
    console.error('Failed to mark booking complete:', error);
  } finally {
    adminBookingFormModal.value.loading = false;
  }
};

const handleAdminBookingFormAssignCleaner = async (bookingId: string, cleanerId: string): Promise<void> => {
  try {
    await updateBooking(bookingId, { assigned_cleaner_id: cleanerId });
  } catch (error) {
    console.error('Failed to assign cleaner:', error);
  }
};

const handleAdminBookingFormOpenCleanerModal = (booking: Partial<BookingFormData>): void => {
  console.log('Open cleaner modal for booking:', booking);
  // Could implement cleaner modal logic here
};

// Watchers
watch(() => currentView.value, (newView) => {
  console.log('🎯 [AdminCalendar] Current view changed from parent:', newView);
  
  nextTick(() => {
    if (newView && calendarRef.value) {
      changeView(newView);
    }
  });
});

watch(() => currentDate.value, (newDate) => {
  console.log('📅 [AdminCalendar] Current date changed from parent:', newDate);
  
  nextTick(() => {
    if (newDate && calendarRef.value) {
      goToDate(newDate);
    }
  });
});

onMounted(async () => {
  console.log('🎬 [AdminCalendar] Component mounted');
  await nextTick();
  console.log('🔗 [AdminCalendar] Component ready');
});

// Expose methods to parent
defineExpose({
  goToDate,
  changeView,
  refreshEvents,
  getApi
});
</script>

<style scoped>
.admin-calendar-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  background: rgb(var(--v-theme-surface));
}

.calendar-navigation {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 0px 0;
}

.calendar-month-year {
  min-width: 250px;
  text-align: center;
}

.calendar-month-year h2 {
  margin: 0;
  color: rgb(var(--v-theme-primary));
}

.page-content {
  flex-grow: 1;
  overflow: hidden;
}

.sidebar-col {
  border-right: 1px solid rgb(var(--v-theme-surface-variant));
  height: 100%;
  overflow-y: auto;
}

.calendar-col {
  height: 100%;
  overflow: hidden;
}

@media (max-width: 960px) {
  .sidebar-col {
    border-right: none;
    border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  }
  
  .calendar-navigation {
    padding: 0px 0;
  }
  
  .calendar-month-year {
    min-width: 200px;
  }
  
  .calendar-month-year h2 {
    font-size: 1.3rem;
  }
}
.admin-calendar-container{
  margin-top: 0px;
}
.v-btn{
  margin-top: 0px;
}
/* Mobile optimizations */
@media (max-width: 768px) {
  .admin-calendar {
    min-height: 100vh;
  }
}
</style> 