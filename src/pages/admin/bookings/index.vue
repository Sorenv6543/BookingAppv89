<template>
  <div class="admin-bookings-page">
    <!-- Page Header -->
    <div class="page-header">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <h1 class="text-h4 font-weight-bold">
              All Bookings
            </h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Manage all bookings across all properties and clients
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openCreateBookingDialog"
            >
              New Booking
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Filters and Search -->
    <div class="filters-section">
      <v-container fluid>
        <v-row align="center">
          <v-col
            cols="12"
            md="3"
          >
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search bookings..."
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-select
              v-model="typeFilter"
              :items="typeOptions"
              label="Type"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            md="2"
          >
            <v-select
              v-model="propertyFilter"
              :items="propertyOptions"
              label="Property"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col
            cols="12"
            md="3"
          >
            <div class="d-flex gap-2">
              <v-text-field
                v-model="dateFrom"
                type="date"
                label="From"
                variant="outlined"
                density="compact"
              />
              <v-text-field
                v-model="dateTo"
                type="date"
                label="To"
                variant="outlined"
                density="compact"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <v-container fluid>
        <!-- Bookings Table -->
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span>All Bookings ({{ filteredBookings.length }})</span>
            <div class="d-flex align-center gap-2">
              <v-select
                v-model="itemsPerPage"
                :items="[10, 25, 50, 100]"
                label="Items per page"
                variant="outlined"
                density="compact"
                style="width: 140px;"
              />
              <v-btn-toggle
                v-model="tableView"
                variant="outlined"
                density="compact"
              >
                <v-btn
                  value="table"
                  icon="mdi-table"
                />
                <v-btn
                  value="cards"
                  icon="mdi-view-grid"
                />
              </v-btn-toggle>
            </div>
          </v-card-title>
          
          <div
            v-if="filteredBookings.length === 0"
            class="text-center py-8"
          >
            <v-icon
              size="64"
              color="grey-lighten-1"
            >
              mdi-calendar-search
            </v-icon>
            <p class="text-h6 text-medium-emphasis mt-4">
              No bookings found
            </p>
            <p class="text-body-2 text-medium-emphasis">
              Try adjusting your filters or create a new booking
            </p>
          </div>

          <!-- Table View -->
          <v-data-table
            v-else-if="tableView === 'table'"
            :headers="tableHeaders"
            :items="paginatedBookings"
            :items-per-page="itemsPerPage"
            :sort-by="sortBy"
            :search="searchQuery"
            hide-default-footer
            class="bookings-table"
            @click:row="openBookingDetails"
          >
            <template #item.status="{ item }">
              <v-chip
                :color="getStatusColor(item.status)"
                size="small"
                variant="flat"
              >
                {{ item.status }}
              </v-chip>
            </template>

            <template #item.booking_type="{ item }">
              <div class="d-flex align-center gap-1">
                <v-chip
                  :color="item.booking_type === 'turn' ? 'warning' : 'primary'"
                  size="small"
                  variant="outlined"
                >
                  {{ item.booking_type === 'turn' ? 'Turn' : 'Standard' }}
                </v-chip>
                <v-chip
                  v-if="item.priority && item.priority !== 'normal'"
                  :color="getPriorityColor(item.priority)"
                  size="x-small"
                  variant="flat"
                >
                  {{ item.priority }}
                </v-chip>
              </div>
            </template>

            <template #item.property="{ item }">
              <div class="text-body-2">
                <div class="font-weight-medium">
                  {{ getPropertyName(item.property_id) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ getPropertyAddress(item.property_id) }}
                </div>
              </div>
            </template>

            <template #item.dates="{ item }">
              <div class="text-body-2">
                <div>{{ formatDate(item.checkout_date) }}</div>
                <div class="text-caption text-medium-emphasis">
                  → {{ formatDate(item.checkin_date) }}
                </div>
              </div>
            </template>

            <template #item.cleaner="{ item }">
              <div
                v-if="item.assigned_cleaner_id"
                class="text-body-2"
              >
                {{ getCleanerName(item.assigned_cleaner_id) }}
              </div>
              <v-chip
                v-else
                color="warning"
                size="small"
                variant="outlined"
              >
                Unassigned
              </v-chip>
            </template>

            <template #item.guest_count="{ item }">
              <div class="d-flex align-center">
                <v-icon
                  size="16"
                  class="mr-1"
                >
                  mdi-account-group
                </v-icon>
                {{ item.guest_count || '—' }}
              </div>
            </template>

            <template #item.created_at="{ item }">
              <span class="text-body-2">{{ formatDateTime(item.created_at) }}</span>
            </template>

            <template #item.actions="{ item }">
              <div class="d-flex align-center gap-1">
                <v-btn
                  v-if="!item.assigned_cleaner_id"
                  color="primary"
                  size="small"
                  variant="outlined"
                  @click.stop="assignCleaner(item)"
                >
                  Assign
                </v-btn>
                
                <v-menu>
                  <template #activator="{ props }">
                    <v-btn
                      icon="mdi-dots-vertical"
                      size="small"
                      variant="text"
                      v-bind="props"
                      @click.stop
                    />
                  </template>
                  <v-list>
                    <v-list-item @click="editBooking(item)">
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="duplicateBooking(item)">
                      <v-list-item-title>Duplicate</v-list-item-title>
                    </v-list-item>
                    <v-list-item
                      class="text-error"
                      @click="cancelBooking(item)"
                    >
                      <v-list-item-title>Cancel</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
          </v-data-table>

          <!-- Card View (Original) -->
          <div
            v-else
            class="bookings-list pa-4"
          >
            <div
              v-for="booking in paginatedBookings"
              :key="booking.id"
              class="booking-item"
              @click="openBookingDetails(booking)"
            >
              <div class="booking-main">
                <div class="booking-info">
                  <div class="d-flex align-center gap-2 mb-1">
                    <v-chip
                      :color="getStatusColor(booking.status)"
                      size="small"
                      variant="flat"
                    >
                      {{ booking.status }}
                    </v-chip>
                    <v-chip
                      :color="booking.booking_type === 'turn' ? 'warning' : 'primary'"
                      size="small"
                      variant="outlined"
                    >
                      {{ booking.booking_type === 'turn' ? 'Turn' : 'Standard' }}
                    </v-chip>
                    <v-chip
                      v-if="booking.priority && booking.priority !== 'normal'"
                      :color="getPriorityColor(booking.priority)"
                      size="small"
                      variant="flat"
                    >
                      {{ booking.priority }}
                    </v-chip>
                  </div>
                  
                  <h3 class="text-h6 font-weight-medium mb-1">
                    {{ getPropertyName(booking.property_id) }}
                  </h3>
                  
                  <div class="text-body-2 text-medium-emphasis mb-2">
                    <v-icon
                      size="16"
                      class="mr-1"
                    >
                      mdi-calendar
                    </v-icon>
                    {{ formatDate(booking.checkout_date) }}
                    <v-icon
                      size="16"
                      class="ml-3 mr-1"
                    >
                      mdi-arrow-right
                    </v-icon>
                    {{ formatDate(booking.checkin_date) }}
                  </div>
                  
                  <div class="d-flex align-center gap-4 mb-2">
                    <div
                      v-if="booking.assigned_cleaner_id"
                      class="text-body-2"
                    >
                      <v-icon
                        size="16"
                        class="mr-1"
                      >
                        mdi-account
                      </v-icon>
                      {{ getCleanerName(booking.assigned_cleaner_id) }}
                    </div>
                    <div
                      v-else
                      class="text-body-2 text-warning"
                    >
                      <v-icon
                        size="16"
                        class="mr-1"
                      >
                        mdi-account-alert
                      </v-icon>
                      No cleaner assigned
                    </div>
                    
                    <div
                      v-if="booking.guest_count"
                      class="text-body-2"
                    >
                      <v-icon
                        size="16"
                        class="mr-1"
                      >
                        mdi-account-group
                      </v-icon>
                      {{ booking.guest_count }} guests
                    </div>
                  </div>
                  
                  <div class="text-caption text-medium-emphasis">
                    Created: {{ formatDateTime(booking.created_at) }}
                  </div>
                </div>
                
                <div class="booking-actions">
                  <v-btn
                    v-if="!booking.assigned_cleaner_id"
                    color="primary"
                    size="small"
                    variant="outlined"
                    @click.stop="assignCleaner(booking)"
                  >
                    Assign Cleaner
                  </v-btn>
                  
                  <v-menu>
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        size="small"
                        variant="text"
                        v-bind="props"
                        @click.stop
                      />
                    </template>
                    <v-list>
                      <v-list-item @click="editBooking(booking)">
                        <v-list-item-title>Edit</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="duplicateBooking(booking)">
                        <v-list-item-title>Duplicate</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        class="text-error"
                        @click="cancelBooking(booking)"
                      >
                        <v-list-item-title>Cancel</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <v-card-actions v-if="filteredBookings.length > 0">
            <v-pagination
              v-model="currentPage"
              :length="Math.ceil(filteredBookings.length / itemsPerPage)"
              :total-visible="7"
            />
            <v-spacer />
            <span class="text-body-2 text-medium-emphasis">
              {{ ((currentPage - 1) * itemsPerPage) + 1 }}-{{ Math.min(currentPage * itemsPerPage, filteredBookings.length) }}
              of {{ filteredBookings.length }} bookings
            </span>
          </v-card-actions>
        </v-card>
      </v-container>
    </div>

    <!-- Create/Edit Booking Dialog -->
    <v-dialog
      v-model="showBookingDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          {{ editingBooking ? 'Edit Booking' : 'Create New Booking' }}
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-medium-emphasis mb-4">
            Admin booking form would be implemented here with full property and cleaner selection
          </p>
          <div class="text-center py-4">
            <v-icon
              size="48"
              color="grey-lighten-1"
            >
              mdi-form-select
            </v-icon>
            <p class="text-caption text-medium-emphasis mt-2">
              Integration with AdminBookingForm component needed
            </p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeBookingDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="saveBooking"
          >
            {{ editingBooking ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Cleaner Assignment Dialog -->
    <v-dialog
      v-model="showCleanerDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>Assign Cleaner</v-card-title>
        <v-card-text>
          <v-select
            v-model="selectedCleaner"
            :items="cleanerOptions"
            label="Select Cleaner"
            variant="outlined"
            item-title="name"
            item-value="id"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeCleanerDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="confirmCleanerAssignment"
          >
            Assign
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminBookings } from '@/composables/admin/useAdminBookings'
import { useAdminProperties } from '@/composables/admin/useAdminProperties'
import { useCleanerManagement } from '@/composables/admin/useCleanerManagement'
import type { Booking } from '@/types/booking'

// Composables
const { allBookings, updateBooking } = useAdminBookings()
const { allProperties } = useAdminProperties()
const { availableCleaners } = useCleanerManagement()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref('')
const typeFilter = ref('')
const propertyFilter = ref('')
const dateFrom = ref('')
const dateTo = ref('')

// Table state
const tableView = ref('table')
const itemsPerPage = ref(25)
const currentPage = ref(1)
const sortBy = ref([{ key: 'created_at', order: 'desc' }])

// Dialog state
const showBookingDialog = ref(false)
const showCleanerDialog = ref(false)
const editingBooking = ref<Booking | null>(null)
const selectedBookingForCleaner = ref<Booking | null>(null)
const selectedCleaner = ref('')

// Filter options
const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
]

const typeOptions = [
  { title: 'Standard', value: 'standard' },
  { title: 'Turn', value: 'turn' }
]

// Table headers
const tableHeaders = [
  { title: 'Status', key: 'status', sortable: true, width: '120px' },
  { title: 'Type', key: 'booking_type', sortable: true, width: '140px' },
  { title: 'Property', key: 'property', sortable: false, width: '200px' },
  { title: 'Dates', key: 'dates', sortable: true, width: '150px' },
  { title: 'Cleaner', key: 'cleaner', sortable: false, width: '140px' },
  { title: 'Guests', key: 'guest_count', sortable: true, width: '80px' },
  { title: 'Created', key: 'created_at', sortable: true, width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px', align: 'end' }
]

// Computed properties
const propertyOptions = computed(() => {
  return allProperties.value.map(property => ({
    title: property.name,
    value: property.id
  }))
})

const cleanerOptions = computed(() => {
  return availableCleaners.value.map(cleaner => ({
    id: cleaner.id,
    name: cleaner.name
  }))
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBookings.value.slice(start, end)
})

const filteredBookings = computed(() => {
  let bookings = allBookings.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    bookings = bookings.filter(booking => {
      const propertyName = getPropertyName(booking.property_id).toLowerCase()
      const cleanerName = booking.assigned_cleaner_id 
        ? getCleanerName(booking.assigned_cleaner_id).toLowerCase()
        : ''
      return propertyName.includes(query) || cleanerName.includes(query)
    })
  }

  // Status filter
  if (statusFilter.value) {
    bookings = bookings.filter(booking => booking.status === statusFilter.value)
  }

  // Type filter
  if (typeFilter.value) {
    bookings = bookings.filter(booking => booking.booking_type === typeFilter.value)
  }

  // Property filter
  if (propertyFilter.value) {
    bookings = bookings.filter(booking => booking.property_id === propertyFilter.value)
  }

  // Date range filter
  if (dateFrom.value) {
    bookings = bookings.filter(booking => booking.checkout_date >= dateFrom.value)
  }
  if (dateTo.value) {
    bookings = bookings.filter(booking => booking.checkout_date <= dateTo.value)
  }

  // Sort by date (most recent first)
  return bookings.sort((a, b) => {
    const dateA = new Date(a.checkout_date)
    const dateB = new Date(b.checkout_date)
    return dateB.getTime() - dateA.getTime()
  })
})

// Helper methods
const getPropertyName = (propertyId: string): string => {
  const property = allProperties.value.find(p => p.id === propertyId)
  return property?.name || 'Unknown Property'
}

const getCleanerName = (cleanerId: string): string => {
  const cleaner = availableCleaners.value.find(c => c.id === cleanerId)
  return cleaner?.name || 'Unknown Cleaner'
}

const getPropertyAddress = (propertyId: string): string => {
  const property = allProperties.value.find(p => p.id === propertyId)
  return property?.address || 'Unknown Address'
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'warning',
    scheduled: 'info',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    low: 'grey',
    normal: 'primary',
    high: 'orange',
    urgent: 'error'
  }
  return colors[priority] || 'primary'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

// Dialog methods
const openCreateBookingDialog = () => {
  editingBooking.value = null
  showBookingDialog.value = true
}

const openBookingDetails = (booking: Booking) => {
  console.log('Opening booking details:', booking.id)
  // Navigate to booking details or open details modal
}

const editBooking = (booking: Booking) => {
  editingBooking.value = booking
  showBookingDialog.value = true
}

const closeBookingDialog = () => {
  showBookingDialog.value = false
  editingBooking.value = null
}

const saveBooking = () => {
  console.log('Saving booking...')
  // Implement booking save logic
  closeBookingDialog()
}

// Cleaner assignment methods
const assignCleaner = (booking: Booking) => {
  selectedBookingForCleaner.value = booking
  selectedCleaner.value = ''
  showCleanerDialog.value = true
}

const closeCleanerDialog = () => {
  showCleanerDialog.value = false
  selectedBookingForCleaner.value = null
  selectedCleaner.value = ''
}

const confirmCleanerAssignment = async () => {
  if (selectedBookingForCleaner.value && selectedCleaner.value) {
    try {
      await updateBooking(selectedBookingForCleaner.value.id, {
        assigned_cleaner_id: selectedCleaner.value,
        status: 'scheduled'
      })
      console.log('Cleaner assigned successfully')
    } catch (error) {
      console.error('Failed to assign cleaner:', error)
    }
  }
  closeCleanerDialog()
}

// Booking actions
const duplicateBooking = (booking: Booking) => {
  console.log('Duplicating booking:', booking.id)
  // Implement booking duplication logic
}

const cancelBooking = async (booking: Booking) => {
  try {
    await updateBooking(booking.id, { status: 'cancelled' })
    console.log('Booking cancelled successfully')
  } catch (error) {
    console.error('Failed to cancel booking:', error)
  }
}
</script>

<style scoped>
.admin-bookings-page {
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

.filters-section {
  flex-shrink: 0;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
}

.page-content {
  flex: 1;
  overflow-y: auto;
  background: rgb(var(--v-theme-background));
}

.bookings-list {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.bookings-table {
  max-height: calc(100vh - 400px);
}

.bookings-table .v-data-table__tbody tr {
  cursor: pointer;
}

.bookings-table .v-data-table__tbody tr:hover {
  background: rgb(var(--v-theme-surface-variant));
}

.booking-item {
  padding: 16px;
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  cursor: pointer;
  transition: background-color 0.2s;
}

.booking-item:hover {
  background: rgb(var(--v-theme-surface-variant));
}

.booking-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.booking-info {
  flex: 1;
}

.booking-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media (max-width: 960px) {
  .admin-bookings-page {
    height: auto;
  }
  
  .page-content {
    overflow-y: visible;
  }
  
  .bookings-list {
    max-height: none;
    overflow-y: visible;
  }
  
  .booking-main {
    flex-direction: column;
    align-items: stretch;
  }
  
  .booking-actions {
    justify-content: flex-end;
    margin-top: 12px;
  }
}
</style> 