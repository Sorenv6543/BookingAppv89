<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <div class="admin-schedule-page">
    <!-- Page Header -->
    <div class="page-header">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <h2 class="text-h4 font-weight-bold">
              Master Schedule - 
            </h2>
            <h2>admin/schedule/index.vue line 12</h2>
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
      <v-container fluid class="pa-0" style="height: 100%;">
        <!-- Mobile Layout: Stacked sidebar and calendar -->
        <div v-if="!mdAndUp" class="mobile-layout">
          <!-- Mobile Sidebar -->
          <AdminSidebar 
            @property-selected="handlePropertySelected"
            @turn-alert-clicked="handleTurnAlertClicked"
            @quick-action="handleQuickAction"
            class="mb-4"
          />
          
          <!-- Mobile Calendar -->
          <AdminCalendar
            :bookings="bookingStore.bookings"
            :properties="propertyStore.properties"
            :users="new Map()"
            @event-click="handleEventClick"
            @date-select="handleDateSelect"
            @event-drop="handleEventDrop"
            class="mobile-calendar"
          />
        </div>

        <!-- Desktop Layout: Side-by-side layout -->
        <v-row v-else no-gutters class="fill-height">
          <!-- Desktop Sidebar -->
          <v-col cols="12" md="3" class="sidebar-col">
            <AdminSidebar 
              @property-selected="handlePropertySelected"
              @turn-alert-clicked="handleTurnAlertClicked"
              @quick-action="handleQuickAction"
            />
          </v-col>
          
          <!-- Desktop Calendar -->
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'

import { useAdminBookings } from '@/composables/admin/useAdminBookings'
import { useCleanerManagement } from '@/composables/admin/useCleanerManagement'
import { useUIStore } from '@/stores/ui'
import { useBookingStore } from '@/stores/booking'
import { usePropertyStore } from '@/stores/property'
import { useUserStore } from '@/stores/user'
import type { Booking, BookingFormData } from '@/types/booking'

// Responsive display
const { mdAndUp } = useDisplay()

// Stores and composables
const uiStore = useUIStore()
const bookingStore = useBookingStore()
const propertyStore = usePropertyStore()
const router = useRouter()
const { createBooking: createBookingFn, updateBooking } = useAdminBookings()
const { assignCleanerToBooking } = useCleanerManagement()

// Reactive state
const selectedPropertyId = ref<string | null>(null)
const selectedBooking = ref<Booking | null>(null)
const selectedDate = ref<string | null>(null)
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
  selectedDate.value = date
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
</script>

<style scoped>
.admin-schedule-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-header {
  flex-shrink: 0;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-outline-variant));
  padding: 16px 0;
}

.page-content {
  flex: 1;
  overflow: hidden;
  background: rgb(var(--v-theme-background));
}

.mobile-layout {
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mobile-calendar {
  flex: 1;
  min-height: 0;
}

.sidebar-col {
  border-right: 1px solid rgb(var(--v-theme-outline-variant));
  background: rgb(var(--v-theme-surface));
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.calendar-col {
  background: rgb(var(--v-theme-background));
  overflow: hidden;
}

/* Mobile responsive adjustments */
@media (max-width: 959px) {
  .page-header {
    padding: 12px 0;
  }
  
  .page-header h1 {
    font-size: 1.5rem !important;
  }
  
  .mobile-layout {
    padding: 8px;
  }
}

/* Tablet specific adjustments */
@media (min-width: 600px) and (max-width: 959px) {
  .mobile-layout {
    padding: 12px;
  }
}

/* Desktop optimizations */
@media (min-width: 960px) {
  .sidebar-col {
    max-width: 320px;
    min-width: 280px;
  }
}
</style> 