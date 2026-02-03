<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    persistent
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-card-title class="text-h5 pb-2">
        {{ formTitle }}
        <v-chip
          v-if="form.booking_type === 'turn'"
          color="error"
          size="small"
          class="ml-2"
        >
          SAME-DAY CLEANING
        </v-chip>
      </v-card-title>
      
      <v-divider />
      
      <v-card-text>
        <v-form
          ref="formRef"
          v-model="formValid"
          @submit.prevent="handleSubmit"
        >
          <v-container>
            <!-- Property Selection -->
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="form.property_id"
                  :items="propertiesArray"
                  item-title="name"
                  item-value="id"
                  label="Select Property"
                  :rules="propertyRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('property_id')"
                  prepend-inner-icon="mdi-home"
                />
              </v-col>
            </v-row>
            
            <!-- Dates - Check-in first, then Check-out -->
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
                  hint="When guests arrive (start of stay)"
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
                  hint="When guests leave (end of stay)"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar-export"
                  @update:model-value="updateBookingType"
                />
              </v-col>
            </v-row>
            
            <!-- Times (Required) - Check-in first, then Check-out -->
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
            
            <!-- Guest Count -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model.number="form.guest_count"
                  label="Number of Guests (Optional)"
                  type="number"
                  min="1"
                  max="20"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('guest_count')"
                  hint="Helps determine cleaning requirements"
                  persistent-hint
                  prepend-inner-icon="mdi-account-group"
                />
              </v-col>
            </v-row>
            
            <!-- Notes -->
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form.notes"
                  label="Special Instructions (Optional)"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('notes')"
                  hint="Any special cleaning requirements or notes"
                  persistent-hint
                  :counter="300"
                  rows="3"
                  prepend-inner-icon="mdi-note-text"
                />
              </v-col>
            </v-row>
            
            <!-- Same-Day Cleaning Alert -->
            <v-row v-if="showSameDayAlert">
              <v-col cols="12">
                <v-alert
                  type="info"
                  variant="tonal"
                  title="Same-Day Cleaning Required"
                  class="mb-0"
                >
                  <p>Your guests are checking out and new guests are checking in on the same day.</p>
                  <p class="mb-0">
                    This requires priority same-day cleaning service.
                  </p>
                </v-alert>
              </v-col>
            </v-row>
            
            <!-- Date Validation Error -->
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
        
        <v-spacer />
        
        <v-btn
          color="primary"
          variant="elevated"
          :loading="loading"
          :disabled="!formValid"
          @click="handleSubmit"
        >
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
import { 
  getDefaultTimes, 
  getTimeValidationRules, 
  getCheckinTimeValidationRules, 
  getTimeHint 
} from '@/utils/timeDefaults'

// Props
interface Props {
  modelValue: boolean
  mode: 'create' | 'edit'
  booking?: Booking | null
  properties: Map<string, Property>
  loading?: boolean
  errors?: Map<string, string[]>
}

const props = withDefaults(defineProps<Props>(), {
  booking: null,
  loading: false,
  errors: () => new Map()
})

// Emits
interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', data: BookingFormData): void
  (e: 'close'): void
}

const emit = defineEmits<Emits>()

// Reactive data
const formRef = ref()
const formValid = ref(false)
const autoDetectType = ref(true)

// Form data - using standardized field names
const form = ref<BookingFormData>({
  property_id: '',
  owner_id: '',
  checkin_date: '',   // When guests arrive (start of stay)
  checkout_date: '',  // When guests leave (end of stay)
  checkin_time: '',   // Time guests arrive
  checkout_time: '',  // Time guests leave
  booking_type: 'standard',
  status: 'pending',
  guest_count: undefined,
  notes: ''
})

// Computed properties
const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value)
})

const formTitle = computed(() => {
  return props.mode === 'create' ? 'Schedule Cleaning' : 'Update Booking'
})

const submitButtonText = computed(() => {
  return props.mode === 'create' ? 'Schedule Cleaning' : 'Update Booking'
})

const propertiesArray = computed(() => {
  return Array.from(props.properties.values()).map(property => ({
    id: property.id,
    name: property.name,
    address: property.address
  }))
})

// Get selected property for default times
const selectedProperty = computed((): Property | undefined => {
  if (!form.value.property_id) return undefined;
  return props.properties.get(form.value.property_id);
});

// Time validation rules and hints
const checkoutTimeRules = computed(() => getTimeValidationRules(selectedProperty.value));
const checkinTimeRules = computed(() => getCheckinTimeValidationRules(form.value.checkout_time as string || ''));
const checkoutTimeHint = computed(() => getTimeHint('checkout', selectedProperty.value));
const checkinTimeHint = computed(() => getTimeHint('checkin', selectedProperty.value));

const showSameDayAlert = computed(() => {
  return form.value.checkout_date && 
         form.value.checkin_date && 
         form.value.checkout_date === form.value.checkin_date
})

const showDateError = computed(() => {
  if (!form.value.checkout_date || !form.value.checkin_date) return false
  const checkinDate = new Date(String(form.value.checkin_date || ''))
  const checkoutDate = new Date(String(form.value.checkout_date || ''))
  if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime())) return false
  // Standard hotel model: checkin must be BEFORE checkout (guests arrive, then depart)
  return checkinDate >= checkoutDate
})


// Validation rules
const propertyRules = [
  (v: string) => !!v || 'Please select a property'
]

const dateRules = [
  (v: string) => !!v || 'Date is required',
  (v: string) => {
    const date = new Date(v)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date >= today || 'Date cannot be in the past'
  }
]

// Methods
const updateBookingType = () => {
  if (!autoDetectType.value) return
  
  if (form.value.checkout_date && form.value.checkin_date) {
    const checkoutDate = new Date(String(form.value.checkout_date || ''))
    const checkinDate = new Date(String(form.value.checkin_date || ''))
    
    // Check if dates are valid
    if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) return
    
    // Same day = turn booking
    if (checkoutDate.toDateString() === checkinDate.toDateString()) {
      form.value.booking_type = 'turn'
    } else {
      form.value.booking_type = 'standard'
    }
  }
}

const resetForm = () => {
  form.value = {
    property_id: '',
    owner_id: '',
    checkin_date: '',
    checkout_date: '',
    checkin_time: '',
    checkout_time: '',
    booking_type: 'standard',
    status: 'pending',
    guest_count: undefined,
    notes: ''
  }

  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const populateForm = (booking: Booking) => {
  form.value = {
    property_id: booking.property_id,
    owner_id: booking.owner_id,
    checkin_date: booking.checkin_date,
    checkout_date: booking.checkout_date,
    checkin_time: booking.checkin_time || '',
    checkout_time: booking.checkout_time || '',
    booking_type: booking.booking_type,
    status: booking.status,
    guest_count: booking.guest_count,
    notes: booking.notes || ''
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  const { valid } = await formRef.value.validate()
  if (!valid) return
  
  // Additional validation
  if (showDateError.value) return
  
  emit('submit', { ...form.value })
}

const handleClose = () => {
  emit('close')
  emit('update:modelValue', false)
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    if (props.mode === 'edit' && props.booking) {
      populateForm(props.booking)
    } else {
      resetForm()
    }
    
    nextTick(() => {
      if (formRef.value) {
        formRef.value.resetValidation()
      }
    })
  }
})

watch(() => props.booking, (newBooking) => {
  if (newBooking && props.mode === 'edit') {
    populateForm(newBooking)
  }
})

// Watch for property selection to set default times
watch(() => form.value.property_id, (newPropertyId) => {
  if (newPropertyId && props.mode === 'create') {
    const property = props.properties.get(newPropertyId);
    if (property) {
      const defaultTimes = getDefaultTimes(property);
      // Only set defaults if times are not already set
      if (!form.value.checkout_time) {
        form.value.checkout_time = defaultTimes.checkout;
      }
      if (!form.value.checkin_time) {
        form.value.checkin_time = defaultTimes.checkin;
      }
    }
  }
})
</script>

<style scoped>
.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}

.v-card-actions {
  background-color: rgb(var(--v-theme-surface-variant));
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .v-dialog {
    margin: 16px;
  }
  
  .v-card {
    margin: 0;
  }
}
</style> 
