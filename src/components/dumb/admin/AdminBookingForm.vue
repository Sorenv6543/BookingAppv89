<template>
  <v-dialog
    v-model="isOpen"
    max-width="800px"
    persistent
    scrollable
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-card-title class="text-h5 pb-2 d-flex align-center">
        {{ formTitle }}
        <v-chip
          v-if="form.booking_type === 'turn'"
          color="error"
          size="small"
          class="ml-2"
          variant="elevated"
        >
          <v-icon start>mdi-clock-alert</v-icon>
          URGENT TURN
        </v-chip>
        <v-chip
          v-if="form.priority === 'high'"
          color="warning"
          size="small"
          class="ml-2"
        >
          HIGH PRIORITY
        </v-chip>
        <v-spacer />
        <v-chip
          :color="getStatusColor(form.status)"
          variant="tonal"
          size="small"
        >
          {{ form.status?.toUpperCase() }}
        </v-chip>
      </v-card-title>
      
      <v-divider />
      
      <v-card-text class="pa-0">
        <v-form
          ref="formRef"
          v-model="formValid"
          @submit.prevent="handleSubmit"
        >
          <v-container>
            <!-- Property and Owner Information -->
            <v-row>
              <v-col cols="12" md="8">
                <v-select
                  v-model="form.property_id"
                  :items="propertiesArray"
                  item-title="name"
                  item-value="id"
                  label="Property"
                  :rules="propertyRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('property_id')"
                  prepend-inner-icon="mdi-home"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-avatar color="primary" size="small">
                          <v-icon>mdi-home</v-icon>
                        </v-avatar>
                      </template>
                      <template #subtitle>
                        {{ getPropertyOwnerName(item.raw.owner_id) }} • {{ item.raw.address }}
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
              
              <v-col cols="12" md="4">
                <v-select
                  v-model="form.status"
                  :items="statusOptions"
                  label="Booking Status"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('status')"
                  prepend-inner-icon="mdi-clipboard-list"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-chip
                          :color="getStatusColor(item.value)"
                          size="x-small"
                          variant="dot"
                        />
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            
            <!-- Dates and Times -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.checkout_date"
                  label="Checkout Date & Time"
                  type="datetime-local"
                  :rules="dateRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('checkout_date')"
                  hint="When guests depart"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar-export"
                  @update:model-value="updateBookingType"
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="form.checkin_date"
                  label="Checkin Date & Time"
                  type="datetime-local"
                  :rules="dateRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('checkin_date')"
                  hint="When new guests arrive"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar-import"
                  @update:model-value="updateBookingType"
                />
              </v-col>
            </v-row>
            
            <!-- Cleaner Assignment Section -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined" class="mb-4">
                  <v-card-title class="text-subtitle-1 py-2">
                    <v-icon class="mr-2">mdi-account-hard-hat</v-icon>
                    Cleaner Assignment
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="form.assigned_cleaner_id"
                          :items="availableCleaners"
                          item-title="name"
                          item-value="id"
                          label="Assigned Cleaner"
                          variant="outlined"
                          :disabled="loading"
                          :error-messages="errors.get('assigned_cleaner_id')"
                          clearable
                          prepend-inner-icon="mdi-account"
                        >
                          <template #item="{ props, item }">
                            <v-list-item v-bind="props">
                              <template #prepend>
                                <v-avatar :color="getCleanerAvailabilityColor(item.raw)" size="small">
                                  <v-icon>mdi-account</v-icon>
                                </v-avatar>
                              </template>
                              <template #subtitle>
                                {{ getCleanerSubtitle(item.raw) }}
                              </template>
                              <template #append>
                                <v-chip
                                  :color="getCleanerAvailabilityColor(item.raw)"
                                  size="x-small"
                                  variant="dot"
                                >
                                  {{ getCleanerAvailabilityText(item.raw) }}
                                </v-chip>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>
                      
                      <v-col cols="12" md="6">
                        <v-btn
                          variant="outlined"
                          color="primary"
                          :disabled="!form.property_id || !form.checkout_date"
                          @click="openCleanerAssignmentModal"
                        >
                          <v-icon start>mdi-magnify</v-icon>
                          Find Best Cleaner
                        </v-btn>
                      </v-col>
                    </v-row>
                    
                    <!-- Cleaner Details -->
                    <v-row v-if="selectedCleaner">
                      <v-col cols="12">
                        <v-alert
                          type="info"
                          variant="tonal"
                          class="mt-2"
                        >
                          <template #title>
                            Cleaner: {{ selectedCleaner.name }}
                          </template>
                          <p class="mb-1">
                            <strong>Skills:</strong> {{ selectedCleaner.skills.join(', ') }}
                          </p>
                          <p class="mb-1">
                            <strong>Today's Bookings:</strong> {{ getCleanerTodayBookings(selectedCleaner.id) }}/{{ selectedCleaner.max_daily_bookings }}
                          </p>
                          <p class="mb-0">
                            <strong>Performance Rating:</strong> 
                            <v-rating
                              :model-value="getCleanerRating(selectedCleaner.id)"
                              readonly
                              size="small"
                              density="compact"
                              class="d-inline-flex ml-2"
                            />
                          </p>
                        </v-alert>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            
            <!-- Booking Details -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model.number="form.guest_count"
                  label="Guest Count"
                  type="number"
                  min="1"
                  max="20"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('guest_count')"
                  hint="Affects cleaning duration estimate"
                  persistent-hint
                  prepend-inner-icon="mdi-account-group"
                />
              </v-col>
              
              <v-col cols="12" sm="6">
                <v-select
                  v-model="form.priority"
                  :items="priorityOptions"
                  label="Priority Level"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('priority')"
                  prepend-inner-icon="mdi-flag"
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-icon :color="getPriorityColor(item.value)">
                          {{ getPriorityIcon(item.value) }}
                        </v-icon>
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            
            <!-- Notes and Instructions -->
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form.notes"
                  label="Cleaning Instructions & Notes"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('notes')"
                  hint="Special requirements, client preferences, or operational notes"
                  persistent-hint
                  :counter="500"
                  rows="3"
                  prepend-inner-icon="mdi-note-text"
                />
              </v-col>
            </v-row>
            
            <!-- Business Impact Alerts -->
            <v-row v-if="showBusinessImpactAlert">
              <v-col cols="12">
                <v-alert
                  :type="businessImpactAlert.type"
                  variant="tonal"
                  :title="businessImpactAlert.title"
                  class="mb-0"
                >
                  <p v-for="message in businessImpactAlert.messages" :key="message" class="mb-1">
                    {{ message }}
                  </p>
                </v-alert>
              </v-col>
            </v-row>
            
            <!-- Validation Errors -->
            <v-row v-if="showDateError">
              <v-col cols="12">
                <v-alert
                  type="error"
                  variant="tonal"
                  title="Scheduling Conflict"
                  text="Invalid date configuration detected. Please review checkout/checkin times."
                  class="mb-0"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      
      <v-divider />
      
      <v-card-actions class="pa-4">
        <v-btn
          color="grey-darken-1"
          variant="text"
          :disabled="loading"
          @click="handleClose"
        >
          Cancel
        </v-btn>
        
        <v-btn
          v-if="mode === 'edit'"
          color="error"
          variant="outlined"
          :disabled="loading"
          @click="handleDelete"
        >
          <v-icon start>mdi-delete</v-icon>
          Delete
        </v-btn>
        
        <v-spacer />
        
        <v-btn
          v-if="mode === 'edit' && form.status !== 'completed'"
          color="success"
          variant="tonal"
          :disabled="loading || !form.assigned_cleaner_id"
          @click="handleMarkComplete"
        >
          <v-icon start>mdi-check</v-icon>
          Mark Complete
        </v-btn>
        
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          :disabled="!formValid"
          @click="handleSubmit"
        >
          <v-icon start>{{ mode === 'create' ? 'mdi-plus' : 'mdi-content-save' }}</v-icon>
          {{ submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import type { Property } from '@/types/property'
import type { Booking, BookingFormData } from '@/types/booking'
import type { Cleaner } from '@/types/user'

// Props
interface Props {
  modelValue: boolean
  mode: 'create' | 'edit'
  booking?: Booking | null
  properties: Property[]
  cleaners: Cleaner[]
  loading?: boolean
  errors?: Map<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  errors: () => new Map()
})

// Emits
interface Emits {
  'update:modelValue': [value: boolean]
  'submit': [data: BookingFormData]
  'delete': [id: string]
  'mark-complete': [id: string]
  'assign-cleaner': [bookingId: string, cleanerId: string]
  'open-cleaner-modal': [booking: Partial<BookingFormData>]
}

const emit = defineEmits<Emits>()

// Form state
const formRef = ref()
const formValid = ref(false)

// Default form data
const defaultForm: BookingFormData = {
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  booking_type: 'standard',
  guest_count: undefined,
  notes: '',
  status: 'pending',
  assigned_cleaner_id: '',
  priority: 'standard'
}

const form = ref<BookingFormData>({ ...defaultForm })

// Computed properties
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formTitle = computed(() => {
  if (props.mode === 'create') {
    return 'Schedule New Cleaning'
  }
  return `Edit Booking #${props.booking?.id?.slice(-6) || 'New'}`
})

const submitButtonText = computed(() => {
  return props.mode === 'create' ? 'Schedule Cleaning' : 'Update Booking'
})

const propertiesArray = computed(() => {
  return Array.from(props.properties).map(property => ({
    ...property,
    title: `${property.name} - ${property.address}`
  }))
})

const availableCleaners = computed(() => {
  return props.cleaners.filter(cleaner => {
    // Filter based on availability and skills if needed
    return true // Simplified for now
  })
})

const selectedCleaner = computed(() => {
  if (!form.value.assigned_cleaner_id) return null
  return props.cleaners.find(c => c.id === form.value.assigned_cleaner_id)
})

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
]

const priorityOptions = [
  { title: 'Standard', value: 'standard' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' }
]

const showSameDayAlert = computed(() => {
  if (!form.value.checkout_date || !form.value.checkin_date) return false
  const checkoutDate = new Date(form.value.checkout_date).toDateString()
  const checkinDate = new Date(form.value.checkin_date).toDateString()
  return checkoutDate === checkinDate
})

const showDateError = computed(() => {
  if (!form.value.checkout_date || !form.value.checkin_date) return false
  return new Date(form.value.checkin_date) < new Date(form.value.checkout_date)
})

const showBusinessImpactAlert = computed(() => {
  return businessImpactAlert.value.messages.length > 0
})

const businessImpactAlert = computed(() => {
  const alert = {
    type: 'info' as 'info' | 'warning' | 'error',
    title: '',
    messages: [] as string[]
  }

  if (form.value.booking_type === 'turn') {
    alert.type = 'warning'
    alert.title = 'High Business Impact'
    alert.messages.push('Same-day turnovers require immediate attention')
    alert.messages.push('Client satisfaction and revenue directly affected')
  }

  if (form.value.priority === 'urgent' && !form.value.assigned_cleaner_id) {
    alert.type = 'error'
    alert.title = 'Critical: Urgent Booking Unassigned'
    alert.messages.push('Urgent bookings must have assigned cleaners')
  }

  return alert
})

// Validation rules
const propertyRules = [
  (v: string) => !!v || 'Property selection is required'
]

const dateRules = [
  (v: string) => !!v || 'Date is required',
  (v: string) => {
    if (!v) return true
    const date = new Date(v)
    const now = new Date()
    return date >= now || 'Date cannot be in the past'
  }
]

// Methods
const updateBookingType = () => {
  if (!form.value.checkout_date || !form.value.checkin_date) return
  
  const checkoutDate = new Date(form.value.checkout_date).toDateString()
  const checkinDate = new Date(form.value.checkin_date).toDateString()
  
  if (checkoutDate === checkinDate) {
    form.value.booking_type = 'turn'
    form.value.priority = 'urgent'
  } else {
    form.value.booking_type = 'standard'
    if (form.value.priority === 'urgent') {
      form.value.priority = 'standard'
    }
  }
}

const getStatusColor = (status: string) => {
  const colors = {
    pending: 'orange',
    scheduled: 'blue',
    in_progress: 'purple',
    completed: 'green',
    cancelled: 'red'
  }
  return colors[status as keyof typeof colors] || 'grey'
}

const getPriorityColor = (priority: string) => {
  const colors = {
    standard: 'grey',
    high: 'orange',
    urgent: 'red'
  }
  return colors[priority as keyof typeof colors] || 'grey'
}

const getPriorityIcon = (priority: string) => {
  const icons = {
    standard: 'mdi-flag',
    high: 'mdi-flag-triangle',
    urgent: 'mdi-alert'
  }
  return icons[priority as keyof typeof icons] || 'mdi-flag'
}

const getPropertyOwnerName = (ownerId: string) => {
  // This would typically come from a users store or prop
  return `Owner ${ownerId.slice(-4)}`
}

const getCleanerAvailabilityColor = (cleaner: Cleaner) => {
  // Simplified availability check
  const todayBookings = getCleanerTodayBookings(cleaner.id)
  if (todayBookings >= cleaner.max_daily_bookings) return 'red'
  if (todayBookings >= cleaner.max_daily_bookings * 0.8) return 'orange'
  return 'green'
}

const getCleanerAvailabilityText = (cleaner: Cleaner) => {
  const todayBookings = getCleanerTodayBookings(cleaner.id)
  if (todayBookings >= cleaner.max_daily_bookings) return 'Unavailable'
  if (todayBookings >= cleaner.max_daily_bookings * 0.8) return 'Limited'
  return 'Available'
}

const getCleanerSubtitle = (cleaner: Cleaner) => {
  return `${cleaner.skills.slice(0, 2).join(', ')} • ${getCleanerTodayBookings(cleaner.id)}/${cleaner.max_daily_bookings} bookings`
}

const getCleanerTodayBookings = (cleanerId: string) => {
  // This would typically come from bookings store
  return Math.floor(Math.random() * 5) // Mock data
}

const getCleanerRating = (cleanerId: string) => {
  // This would typically come from performance data
  return 4 + Math.random() // Mock rating between 4-5
}

const openCleanerAssignmentModal = () => {
  emit('open-cleaner-modal', form.value)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  emit('submit', { ...form.value })
}

const handleClose = () => {
  isOpen.value = false
}

const handleDelete = () => {
  if (props.booking?.id) {
    emit('delete', props.booking.id)
  }
}

const handleMarkComplete = () => {
  if (props.booking?.id) {
    emit('mark-complete', props.booking.id)
  }
}

// Watch for booking changes
watch(() => props.booking, (newBooking) => {
  if (newBooking) {
    form.value = {
      property_id: newBooking.property_id,
      checkout_date: newBooking.checkout_date,
      checkin_date: newBooking.checkin_date,
      booking_type: newBooking.booking_type,
      guest_count: newBooking.guest_count,
      notes: newBooking.notes || '',
      status: newBooking.status,
      assigned_cleaner_id: newBooking.assigned_cleaner_id || '',
      priority: newBooking.priority || 'standard'
    }
  } else {
    form.value = { ...defaultForm }
  }
}, { immediate: true })

// Watch for modal close
watch(isOpen, (newValue) => {
  if (!newValue) {
    nextTick(() => {
      form.value = { ...defaultForm }
      formRef.value?.resetValidation()
    })
  }
})
</script>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}

.v-alert {
  border-left: 4px solid rgb(var(--v-theme-primary));
}
</style>
