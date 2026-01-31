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
          <v-icon start>
            mdi-clock-alert
          </v-icon>
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
          :color="getStatusColor((form.status as string) || 'pending')"
          variant="tonal"
          size="small"
        >
          {{ ((form.status as string) || 'pending').toUpperCase() }}
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
              <v-col
                cols="12"
                md="8"
              >
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
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-avatar
                          color="primary"
                          size="small"
                        >
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
              
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="form.status"
                  :items="statusOptions"
                  label="Booking Status"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('status')"
                  prepend-inner-icon="mdi-clipboard-list"
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
                      <template #prepend>
                        <v-chip
                          :color="getStatusColor(item.value)"
                          size="x-small"
                          variant="tonal"
                        />
                      </template>
                    </v-list-item>
                  </template>
                </v-select>
              </v-col>
            </v-row>
            
            <!-- Dates -->
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.checkin_date"
                  label="Check-in Date"
                  type="date"
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
               
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.checkout_date"
                  label="Check-out Date"
                  type="date"
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
            </v-row>
            
            <!-- Times (Required) -->
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.checkin_time"
                  label="Check-in Time"
                  type="time"
                  :rules="checkinTimeRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('checkin_time')"
                  :hint="checkinTimeHint"
                  persistent-hint
                  prepend-inner-icon="mdi-clock-outline"
                />
              </v-col>
              
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="form.checkout_time"
                  label="Check-out Time"
                  type="time"
                  :rules="checkoutTimeRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('checkout_time')"
                  :hint="checkoutTimeHint"
                  persistent-hint
                  prepend-inner-icon="mdi-clock-outline"
                />
              </v-col>
            </v-row>
            
            <!-- Cleaner Assignment Section -->
            <v-row>
              <v-col cols="12">
                <v-card
                  variant="outlined"
                  class="mb-4"
                >
                  <v-card-title class="text-subtitle-1 py-2">
                    <v-icon class="mr-2">
                      mdi-account-hard-hat
                    </v-icon>
                    Cleaner Assignment
                  </v-card-title>
                  <v-divider />
                  <v-card-text>
                    <v-row>
                      <v-col
                        cols="12"
                        md="6"
                      >
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
                          <template #item="{ props: itemProps, item }">
                            <v-list-item v-bind="itemProps">
                              <template #prepend>
                                <v-avatar
                                  :color="getCleanerAvailabilityColor(item.raw)"
                                  size="small"
                                >
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
                                  variant="tonal"
                                >
                                  {{ getCleanerAvailabilityText(item.raw) }}
                                </v-chip>
                              </template>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>
                      
                      <v-col
                        cols="12"
                        md="6"
                      >
                        <v-btn
                          variant="outlined"
                          color="primary"
                          :disabled="!form.property_id || !form.checkout_date"
                          @click="openCleanerAssignmentModal"
                        >
                          <v-icon start>
                            mdi-magnify
                          </v-icon>
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
              <v-col
                cols="12"
                sm="6"
              >
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
              
              <v-col
                cols="12"
                sm="6"
              >
                <v-select
                  v-model="form.priority"
                  :items="priorityOptions"
                  label="Priority Level"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('priority')"
                  prepend-inner-icon="mdi-flag"
                >
                  <template #item="{ props: itemProps, item }">
                    <v-list-item v-bind="itemProps">
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
                  <p
                    v-for="message in businessImpactAlert.messages"
                    :key="message"
                    class="mb-1"
                  >
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
                  title="Invalid Dates"
                  text="Checkout date must be after checkin date. Guests must check in before checking out."
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
          <v-icon start>
            mdi-delete
          </v-icon>
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
          <v-icon start>
            mdi-check
          </v-icon>
          Mark Complete
        </v-btn>
        
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          :disabled="!formValid"
          @click="handleSubmit"
        >
          <v-icon start>
            {{ mode === 'create' ? 'mdi-plus' : 'mdi-content-save' }}
          </v-icon>
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
import { safeString } from '@/utils/typeHelpers'
import { 
  getDefaultTimes, 
  getTimeValidationRules, 
  getCheckinTimeValidationRules, 
  getTimeHint 
} from '@/utils/timeDefaults'
import { usePropertyStore } from '@/stores/property'

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
  booking: null,
  loading: false,
  errors: () => new Map()
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: BookingFormData]
  'delete': [id: string]
  'mark-complete': [id: string]
  'assign-cleaner': [bookingId: string, cleanerId: string]
  'open-cleaner-modal': [booking: Partial<BookingFormData>]
}>()

// Form state
const formRef = ref()
const formValid = ref(false)

// Default form data
const defaultForm: BookingFormData = {
  owner_id: '', // Required field for admin forms
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  checkout_time: '',
  checkin_time: '',
  booking_type: 'standard',
  guest_count: undefined,
  notes: '',
  status: 'pending',
  assigned_cleaner_id: '',
  priority: 'normal'
}

const form = ref<BookingFormData>({ ...defaultForm })

// Computed properties
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const propertyName = computed(() => {
  if (!props.booking?.property_id) return 'Unknown Property'
  const property = props.properties.find(p => p.id === props.booking?.property_id)
  return property?.name || 'Unknown Property'
})

const formTitle = computed(() => {
  if (props.mode === 'create') {
    return 'Schedule New Cleaning'
  }
  return `Edit Booking "${propertyName.value}"`
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
  return props.cleaners.filter(() => {
    // Filter based on availability and skills if needed
    return true // Simplified for now
  })
})

const selectedCleaner = computed(() => {
  if (!form.value.assigned_cleaner_id) return null
  return props.cleaners.find(c => c.id === form.value.assigned_cleaner_id)
})

// Get selected property for default times
const selectedProperty = computed((): Property | undefined => {
  if (!form.value.property_id) return undefined;
  return props.properties.find(p => p.id === form.value.property_id);
});

// Time validation rules and hints
const checkoutTimeRules = computed(() => getTimeValidationRules(selectedProperty.value));
const checkinTimeRules = computed(() => getCheckinTimeValidationRules((form.value.checkout_time as string) || ''));
const checkoutTimeHint = computed(() => getTimeHint('checkin', selectedProperty.value));
const checkinTimeHint = computed(() => getTimeHint('checkout', selectedProperty.value));

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
]

const priorityOptions = [
  { title: 'Low', value: 'low' },
  { title: 'Normal', value: 'normal' },
  { title: 'High', value: 'high' },
  { title: 'Urgent', value: 'urgent' }
]

// Commented out unused computed - was causing TS warning
// const showSameDayAlert = computed(() => {
  //   if (!form.value.checkout_date || !form.value.checkin_date) return false
  //   const checkoutDate = new Date(form.value.checkout_date).toDateString()
  //   const checkinDate = new Date(form.value.checkin_date).toDateString()
  //   return checkoutDate === checkinDate
  // })
  
  const showDateError = computed(() => {
    if (!form.value.checkout_date || !form.value.checkin_date) return false
    // Standard hotel model: checkin should be before checkout (guests arrive, then depart)
    return new Date(form.value.checkin_date as string) >= new Date(form.value.checkout_date as string)
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
    
    // Debug logging to see what's happening
    console.log('🔍 [AdminBookingForm] Validating date:', v)
    
    // Parse date as local date to avoid timezone issues
    const [year, month, day] = v.split('-').map(Number)
    const selectedDate = new Date(year, month - 1, day) // month is 0-indexed
    const today = new Date()
    
    console.log('🔍 [AdminBookingForm] Selected date object:', selectedDate)
    console.log('🔍 [AdminBookingForm] Today object:', today)
    
    // Set both dates to midnight for fair comparison (date only, no time)
    const selectedDateOnly = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    
    console.log('🔍 [AdminBookingForm] Selected date only:', selectedDateOnly)
    console.log('🔍 [AdminBookingForm] Today only:', todayOnly)
    console.log('🔍 [AdminBookingForm] Comparison result:', selectedDateOnly >= todayOnly)
    
    const isValid = selectedDateOnly >= todayOnly
    console.log('🔍 [AdminBookingForm] Validation result:', isValid ? 'VALID' : 'INVALID - Date in past')
    
    return isValid || 'Date cannot be in the past'
  }
]

// Methods
const updateBookingType = () => {
      if (!form.value.checkout_date || !form.value.checkin_date) return
  
  console.log('🔄 [AdminBookingForm] updateBookingType called')
      console.log('🔄 [AdminBookingForm] checkout_date:', form.value.checkout_date)
    console.log('🔄 [AdminBookingForm] checkin_date:', form.value.checkin_date)
  
  // Parse dates as local dates to avoid timezone issues
  const parseDateString = (dateStr: string) => {
    if (!dateStr) return null
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day).toDateString()
  }
  
      const checkoutDate = parseDateString(form.value.checkout_date as string)
    const checkinDate = parseDateString(form.value.checkin_date as string)
  
  console.log('🔄 [AdminBookingForm] parsed checkoutDate:', checkoutDate)
  console.log('🔄 [AdminBookingForm] parsed checkinDate:', checkinDate)
  
  if (checkoutDate === checkinDate) {
    console.log('🔄 [AdminBookingForm] Same day - setting to turn/urgent')
    form.value.booking_type = 'turn'
    form.value.priority = 'urgent'
  } else {
    console.log('🔄 [AdminBookingForm] Different days - setting to standard')
    form.value.booking_type = 'standard'
    if (form.value.priority === 'urgent') {
      form.value.priority = 'normal'
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
  console.debug('Getting bookings for cleaner:', cleanerId)
  return Math.floor(Math.random() * 5) // Mock data
}

const getCleanerRating = (cleanerId: string) => {
  // This would typically come from performance data
  console.debug('Getting rating for cleaner:', cleanerId)
  return 4 + Math.random() // Mock rating between 4-5
}

const openCleanerAssignmentModal = () => {
  emit('open-cleaner-modal', form.value)
}

const handleSubmit = async () => {
  console.log('🚀 [AdminBookingForm] handleSubmit called')
  
  if (!formRef.value) {
    console.error('🚀 [AdminBookingForm] No form ref')
    return
  }
  
  const { valid } = await formRef.value.validate()
  console.log('🚀 [AdminBookingForm] Form validation result:', valid)
  
  if (!valid) {
    console.error('🚀 [AdminBookingForm] Form validation failed')
    return
  }
  
  // Additional validation for required fields
  if (!form.value.owner_id) {
    console.error('🚀 [AdminBookingForm] Owner ID is required')
    // Try to auto-populate from selected property
    if (form.value.property_id) {
      const propertyStore = usePropertyStore();
      const property = propertyStore.getPropertyById(form.value.property_id as string);
      if (property && property.owner_id) {
        console.log('🚀 [AdminBookingForm] Auto-populating owner_id from property')
        form.value.owner_id = property.owner_id;
      } else {
        console.error('🚀 [AdminBookingForm] Cannot auto-populate owner_id - property not found or has no owner')
        return;
      }
    } else {
      console.error('🚀 [AdminBookingForm] Cannot auto-populate owner_id - no property selected')
      return;
    }
  }
  
  // Clean form data
  const cleanFormData: BookingFormData = {
    ...form.value,
    assigned_cleaner_id: form.value.assigned_cleaner_id || '',
    owner_id: form.value.owner_id || '',
    property_id: form.value.property_id || '',
    checkout_date: form.value.checkout_date,
    checkin_date: form.value.checkin_date,
    checkout_time: form.value.checkout_time,
    checkin_time: form.value.checkin_time,
    guest_count: form.value.guest_count || 1,
    notes: form.value.notes || '',
    priority: form.value.priority || 'normal',
    booking_type: form.value.booking_type || 'standard'
  };
  
  console.log('🚀 [AdminBookingForm] Submitting cleaned form data:', cleanFormData)
  
  emit('submit', cleanFormData)
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
    // Format dates for HTML date input (YYYY-MM-DD) without timezone conversion
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return ''
      
      // If it's already in YYYY-MM-DD format, return it directly
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString
      }
      
      // Parse date as local date to avoid timezone conversion issues
      const date = new Date(dateString)
      
      // Handle timezone conversion by using local date methods
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      
      return `${year}-${month}-${day}`
    }
    
    form.value = {
      owner_id: newBooking.owner_id,
      property_id: newBooking.property_id,
      // Use dates as stored in database (no swapping)
              checkin_date: formatDateForInput(safeString(newBooking.checkin_date)),
        checkout_date: formatDateForInput(safeString(newBooking.checkout_date)),
      checkin_time: newBooking.checkin_time || '',
      checkout_time: newBooking.checkout_time || '',
      booking_type: newBooking.booking_type,
      guest_count: newBooking.guest_count,
      notes: newBooking.notes || '',
      status: newBooking.status,
      assigned_cleaner_id: newBooking.assigned_cleaner_id || '',
      priority: newBooking.priority || 'normal'
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

// Watch for property selection to set default times and owner
watch(() => form.value.property_id, (newPropertyId) => {
  console.log('🔍 Property watcher triggered with newPropertyId:', newPropertyId);
  console.log('🔍 Current form mode:', props.mode);
  console.log('🔍 Current form times:', { 
          departure: form.value.checkout_time,
      arrival: form.value.checkin_time 
  });
  
  if (newPropertyId && props.mode === 'create') {
    const propertyStore = usePropertyStore();
    const property = propertyStore.getPropertyById(newPropertyId as string);
    console.log('🔍 Found property:', property);
    
    if (property) {
      // Auto-populate owner_id from property
      if (!form.value.owner_id && property.owner_id) {
        console.log('🔍 Auto-populating owner_id from property:', property.owner_id);
        form.value.owner_id = property.owner_id;
      }
      
      const defaultTimes = getDefaultTimes(property);
      console.log('🔍 Got default times:', defaultTimes);
      
      // Only set defaults if times are not already set
      if (!form.value.checkout_time) {
        console.log('🔍 Setting default checkout time:', defaultTimes.checkout);
        form.value.checkout_time = defaultTimes.checkout;
      }
      if (!form.value.checkin_time) {
        console.log('🔍 Setting default checkin time:', defaultTimes.checkin);
        form.value.checkin_time = defaultTimes.checkin;
      }
    }
  }
});
</script>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}

.v-alert {
  border-left: 4px solid rgb(var(--v-theme-primary));
}
</style>
