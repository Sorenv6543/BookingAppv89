<template>
  <div class="admin-schedule-page">
    <!-- Page Header -->
    <div class="page-header">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <h1 class="text-h4 font-weight-bold">Master Schedule</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              System-wide calendar and cleaner assignment management
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="createBooking"
            >
              New Booking
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <v-container fluid class="pa-0">
        <v-row no-gutters class="fill-height">
          <!-- Sidebar -->
          <v-col cols="12" md="3" class="sidebar-col">
            <AdminSidebar 
              @property-selected="handlePropertySelected"
              @turn-alert-clicked="handleTurnAlertClicked"
              @quick-action="handleQuickAction"
            />
          </v-col>
          
          <!-- Calendar -->
          <v-col cols="12" md="9" class="calendar-col">
            <AdminCalendar
              :bookings="bookingStore.bookings"
              :properties="propertyStore.properties"
              :users="new Map()"
              @event-click="handleEventClick"
              @date-select="handleDateSelect"
              @event-drop="handleEventDrop"
            />
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Modals -->
    <BookingForm
      v-if="uiStore.modals.get('event')?.isOpen"
      :booking="selectedBooking"
      :is-edit="isEditMode"
      @save="handleBookingSave"
      @close="closeBookingModal"
    />

    <CleanerAssignmentModal
      v-if="uiStore.modals.get('cleanerAssignment')?.isOpen"
      :booking="selectedBooking"
      @assign="handleCleanerAssign"
      @close="closeCleanerAssignmentModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminSidebar from '@/components/smart/admin/AdminSidebar.vue'
import AdminCalendar from '@/components/smart/admin/AdminCalendar.vue'
import BookingForm from '@/components/dumb/BookingForm.vue'
import CleanerAssignmentModal from '@/components/dumb/admin/CleanerAssignmentModal.vue'
import { useAdminBookings } from '@/composables/admin/useAdminBookings'
import { useCleanerManagement } from '@/composables/admin/useCleanerManagement'
import { useUIStore } from '@/stores/ui'
import { useBookingStore } from '@/stores/booking'
import { usePropertyStore } from '@/stores/property'
import { useUserStore } from '@/stores/user'
import type { Booking } from '@/types/booking'

// Stores and composables
const uiStore = useUIStore()
const bookingStore = useBookingStore()
const propertyStore = usePropertyStore()
const userStore = useUserStore()
const router = useRouter()
const { createBooking: createBookingFn, updateBooking } = useAdminBookings()
const { assignCleanerToBooking } = useCleanerManagement()

// Reactive state
const selectedPropertyId = ref<string | null>(null)
const selectedBooking = ref<Booking | null>(null)
const isEditMode = ref(false)

// Event handlers
const handlePropertySelected = (propertyId: string | null) => {
  selectedPropertyId.value = propertyId
}

const handleTurnAlertClicked = (booking: Booking) => {
  selectedBooking.value = booking
  isEditMode.value = true
  uiStore.openModal('event')
}

const handleQuickAction = (action: string) => {
  switch (action) {
    case 'assign-cleaners':
      // Navigate to cleaner assignment view
      router.push('/admin/cleaners')
      break
    case 'generate-report':
      // Navigate to reports
      router.push('/admin/reports')
      break
    case 'manage-schedule':
      // Already on schedule page - could show help or settings
      break
  }
}

const handleEventClick = (booking: Booking) => {
  selectedBooking.value = booking
  isEditMode.value = true
  uiStore.openModal('event')
}

const handleDateSelect = (date: string) => {
  // Create new booking for selected date
  selectedBooking.value = null
  isEditMode.value = false
  uiStore.openModal('event')
}

const handleEventDrop = async (booking: Booking, newDate: string) => {
  try {
    await updateBooking(booking.id, {
      ...booking,
      checkout_date: newDate
    })
  } catch (error) {
    console.error('Failed to update booking:', error)
  }
}

const createBooking = () => {
  selectedBooking.value = null
  isEditMode.value = false
  uiStore.openModal('event')
}

const handleBookingSave = async (bookingData: Partial<Booking>) => {
  try {
    if (isEditMode.value && selectedBooking.value) {
      await updateBooking(selectedBooking.value.id, bookingData)
    } else {
      await createBookingFn(bookingData)
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
}
</style> 