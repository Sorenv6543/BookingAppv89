<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <div class="admin-schedule-page">
    <!-- Page Header -->
    <div class="page-header" /> 

    <!-- Calendar Navigation -->
    <div class="calendar-navigation">
      <v-container fluid>
        <div class="d-flex align-center justify-center">
          <!-- Previous Month Button -->
          <v-btn
            icon="mdi-chevron-left"
            variant="text"
            size="large"
            @click="navigateToPreviousMonth"
          />
          
          <!-- Month and Year Display -->
          <div class="calendar-month-year mx-6">
            <h2 class="text-h5 font-weight-bold text-primary">
              {{ getCurrentMonthYear() }}
            </h2>
          </div>
          
          <!-- Next Month Button -->
          <v-btn
            icon="mdi-chevron-right"
            variant="text"
            size="large"
            @click="navigateToNextMonth"
          />
        </div>
      </v-container>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <v-row no-gutters class="fill-height">
        <!-- Calendar (Full Width) -->
        <v-col cols="12" md="12" class="calendar-col">
          <AdminCalendar
            :bookings="bookingStore.bookings"
            :properties="propertyStore.properties"
            :users="usersMap"
            :loading="loading"
            :current-date="currentDate"
            @date-select="handleDateSelect"
            @event-click="handleEventClick"
            @event-drop="handleEventDrop"
            @create-booking="handleCreateBooking"
            @update-booking="handleUpdateBooking"
            @assign-cleaner="handleAssignCleaner"
            @update-booking-status="handleUpdateBookingStatus"
            @view-change="handleViewChange"
            @date-change="handleDateChange"
          />
        </v-col>
      </v-row>
    </div>

    <!-- Modals -->
    <BookingForm
      v-if="uiStore.modals.get('event')?.open"
      :booking="selectedBooking || undefined"
      :is-edit="isEditMode"
      @save="handleBookingSave"
      @close="closeBookingModal"
    />

    <CleanerAssignmentModal
      v-if="uiStore.modals.get('cleanerAssignment')?.open"
      :model-value="true"
      :booking="selectedBooking"
      :properties="Array.from(propertyStore.properties.values())"
      :cleaners="[]"
      @assign="handleCleanerAssign"
      @update:model-value="closeCleanerAssignmentModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue'
import BookingForm from '@/components/dumb/BookingForm.vue'
import CleanerAssignmentModal from '@/components/dumb/admin/CleanerAssignmentModal.vue'
import { useAdminBookings } from '@/composables/admin/useAdminBookings';
import { useCleanerManagement } from '@/composables/admin/useCleanerManagement'
import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement'
import { useUIStore } from '@/stores/ui'
import { useBookingStore } from '@/stores/booking'
import { usePropertyStore } from '@/stores/property'
import { useUserStore } from '@/stores/user'
import type { Booking, BookingFormData } from '@/types/booking'
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core'

// Stores and composables
const uiStore = useUIStore()
const bookingStore = useBookingStore()
const propertyStore = usePropertyStore()
const { users: allUsers, fetchAllUsers } = useAdminUserManagement()
// const router = useRouter()
const { createBooking: createBookingFn, updateBooking } = useAdminBookings()
const { assignCleanerToBooking } = useCleanerManagement()

// Reactive state
// const selectedPropertyId = ref<string | null>(null)
const selectedBooking = ref<Booking | null>(null)
const selectedDate = ref<string | null>(null)
const isEditMode = ref(false)
const loading = ref(false)
const currentView = ref('dayGridMonth')
const currentDate = ref(new Date())
const currentViewingDate = ref(new Date()) // For calendar navigation

// Create users Map for AdminCalendar
const usersMap = computed(() => {
  const map = new Map()
  allUsers.value.forEach(user => {
    map.set(user.id, user)
  })
  return map
})

// // Event handlers
const handlePropertySelected = (propertyId: string | null) => {
  selectedPropertyId.value = propertyId
}

const handleTurnAlertClicked = (booking: Booking) => {
  selectedBooking.value = booking
  isEditMode.value = true
  uiStore.openModal('event')
}

// const handleQuickAction = (action: string) => {
//   switch (action) {
//     case 'assign-cleaners':
//       // Navigate to cleaner assignment view
//       router.push('/admin/cleaners')
//       break
//     case 'generate-report':
//       // Navigate to reports
//       router.push('/admin/reports')
//       break
//     case 'manage-schedule':
//       // Already on schedule page - could show help or settings
//       break
//   }
// }

// Updated event handlers for new AdminCalendar
const handleEventClick = (clickInfo: EventClickArg) => {
  const booking = clickInfo.event.extendedProps.booking as Booking
  selectedBooking.value = booking
  isEditMode.value = true
  uiStore.openModal('event')
}

const handleDateSelect = (selectInfo: DateSelectArg) => {
  // Create new booking for selected date range
  selectedDate.value = selectInfo.startStr
  selectedBooking.value = null
  isEditMode.value = false
  uiStore.openModal('event')
}

const handleEventDrop = async (dropInfo: EventDropArg) => {
  const booking = dropInfo.event.extendedProps.booking as Booking
  try {
    await updateBooking(booking.id, {
      checkout_date: dropInfo.event.startStr,
      checkin_date: dropInfo.event.endStr || dropInfo.event.startStr
    })
  } catch (error) {
    console.error('Failed to update booking:', error)
    // Revert the drop if update fails
    dropInfo.revert()
  }
}



const handleBookingSave = async (bookingData: Partial<Booking>) => {
  try {
    if (isEditMode.value && selectedBooking.value) {
      await updateBooking(selectedBooking.value.id, bookingData)
    } else {
      // Ensure required fields are present for creation
      if (bookingData.property_id && bookingData.checkout_date && bookingData.checkin_date) {
        await createBookingFn(bookingData as BookingFormData)
      }
    }
    closeBookingModal()
  } catch (error) {
    console.error('Failed to save booking:', error)
  }
}

const closeBookingModal = () => {
  uiStore.closeModal('event')
  selectedBooking.value = null
}

const handleCleanerAssign = async (cleanerId: string) => {
  if (selectedBooking.value) {
    try {
      await assignCleanerToBooking(cleanerId, selectedBooking.value.id)
      closeCleanerAssignmentModal()
    } catch (error) {
      console.error('Failed to assign cleaner:', error)
    }
  }
}

const closeCleanerAssignmentModal = () => {
  uiStore.closeModal('cleanerAssignment')
  selectedBooking.value = null
}

// New handlers for integrated AdminCalendar
const handleCreateBooking = async (data: { start: string; end: string; propertyId?: string }) => {
  selectedDate.value = data.start
  selectedBooking.value = null
  isEditMode.value = false
  uiStore.openModal('event')
}

const handleUpdateBooking = async (data: { id: string; updates: Partial<Booking> }) => {
  try {
    loading.value = true
    await updateBooking(data.id, data.updates)
  } catch (error) {
    console.error('Failed to update booking:', error)
  } finally {
    loading.value = false
  }
}

const handleAssignCleaner = async (data: { bookingId: string; cleanerId: string; notes?: string }) => {
  try {
    loading.value = true
    await assignCleanerToBooking(data.cleanerId, data.bookingId)
  } catch (error) {
    console.error('Failed to assign cleaner:', error)
  } finally {
    loading.value = false
  }
}

const handleUpdateBookingStatus = async (data: { bookingId: string; status: Booking['status'] }) => {
  try {
    loading.value = true
    await updateBooking(data.bookingId, { status: data.status })
  } catch (error) {
    console.error('Failed to update booking status:', error)
  } finally {
    loading.value = false
  }
}

const handleViewChange = (view: string) => {
  currentView.value = view
}

const handleDateChange = (date: Date) => {
  currentDate.value = date
  currentViewingDate.value = date // Sync with navigation
}

// Calendar navigation functions
const getCurrentMonthYear = () => {
  return currentViewingDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

const navigateToPreviousMonth = () => {
  const newDate = new Date(currentViewingDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentViewingDate.value = newDate;
  currentDate.value = newDate; // Update calendar view
}

const navigateToNextMonth = () => {
  const newDate = new Date(currentViewingDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentViewingDate.value = newDate;
  currentDate.value = newDate; // Update calendar view
}

// Initialize data on mount
onMounted(async () => {
  // Fetch all data so admin can see all owner bookings
  loading.value = true
  try {
    await Promise.all([
      fetchAllUsers(),
      bookingStore.fetchBookings(),
      propertyStore.fetchProperties()
    ])
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.admin-schedule-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.page-header {
  flex-shrink: 0;
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  background: rgb(var(--v-theme-surface));
}

.calendar-navigation {
  flex-shrink: 0;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 16px 0;
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
  flex: 1;
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
    padding: 12px 0;
  }
  
  .calendar-month-year {
    min-width: 200px;
  }
  
  .calendar-month-year h2 {
    font-size: 1.3rem;
  }
}
</style> 