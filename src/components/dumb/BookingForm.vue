<template>
  <v-dialog
    v-model="isOpen"
    max-width="700px"
    max-height="90vh"
    persistent
    scrollable
    @keydown.esc="handleClose"
  >
    <v-card class="modal-card">
      <v-card-title class="text-h5 pb-2 flex-shrink-0">
        {{ formTitle }}
        <v-chip
          v-if="form.booking_type === 'turn'"
          color="error"
          size="small"
          class="ml-2"
        >
          URGENT TURN
        </v-chip>
      </v-card-title>
      
      <v-divider />
      
      <v-card-text class="modal-content">
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
                  label="Property"
                  :rules="propertyRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('property_id')"
                  prepend-inner-icon="mdi-home"
                />
              </v-col>
            </v-row>
            
            <!-- Dates and Times -->
            <v-row>
              <v-col
                cols="12"
                md="6"
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
                  prepend-inner-icon="mdi-calendar-plus"
                  @update:model-value="updateBookingType"
                />
              </v-col>
              
              <v-col
                cols="12"
                md="6"
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
                  prepend-inner-icon="mdi-calendar-remove"
                  @update:model-value="updateBookingType"
                />
              </v-col>
            </v-row>
            
            <!-- Times (Required) -->
            <v-row>
              <v-col
                cols="12"
                md="6"
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
                md="6"
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
            
            <!-- Booking Type and Guest Count -->
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="form.booking_type"
                  :items="bookingTypeItems"
                  label="Booking Type"
                  :rules="bookingTypeRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('booking_type')"
                  prepend-inner-icon="mdi-tag"
                />
                
                <v-checkbox
                  v-model="autoDetectType"
                  label="Auto-detect booking type from dates"
                  :disabled="loading"
                />
              </v-col>
              
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="form.guest_count"
                  label="Guest Count"
                  type="number"
                  min="1"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('guest_count')"
                  hint="Optional"
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
                  label="Notes"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('notes')"
                  hint="Special instructions, requirements, etc."
                  persistent-hint
                  :counter="500"
                  rows="3"
                  prepend-inner-icon="mdi-note-text"
                />
              </v-col>
            </v-row>
            
            <!-- Status (Edit mode only) -->
            <v-row v-if="mode === 'edit'">
              <v-col cols="12">
                <v-select
                  v-model="form.status"
                  :items="statusItems"
                  label="Status"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('status')"
                  prepend-inner-icon="mdi-progress-check"
                />
              </v-col>
            </v-row>
            
            <!-- Turn Booking Warning -->
            <v-row v-if="showTurnWarning">
              <v-col cols="12">
                <v-alert
                  type="warning"
                  variant="tonal"
                  title="Same-Day Turnover"
                  text="This booking has same-day checkout and checkin dates, which typically indicates a 'turn' booking (urgent same-day cleaning between guests)."
                  class="mb-0"
                />
              </v-col>
            </v-row>
            
            <!-- Turn Booking Error -->
            <v-row v-if="showTurnError">
              <v-col cols="12">
                <v-alert
                  type="error"
                  variant="tonal"
                  title="Invalid Turn Booking"
                  text="Turn bookings must have checkout and checkin on the same day. Please adjust dates or change booking type to standard."
                  class="mb-0"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      
      <v-divider />
      
      <v-card-actions>
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
          v-if="mode === 'edit'"
          color="error"
          variant="text"
          :disabled="loading"
          :loading="loading"
          @click="handleDelete"
        >
          Delete
        </v-btn>
        
        <v-btn
          color="primary"
          variant="text"
          :disabled="!formValid || loading || showTurnError"
          :loading="loading"
          @click="handleSubmit"
        >
          {{ submitButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';
import { usePropertyStore } from '@/stores/property';
import type { Booking, BookingFormData, BookingStatus, BookingType, Property } from '@/types';
import type { VForm } from 'vuetify/components';
import { safeString } from '@/utils/typeHelpers';
import { 
  getDefaultTimes, 
  getTimeValidationRules, 
  getCheckinTimeValidationRules, 
  getTimeHint 
} from '@/utils/timeDefaults';

// PROPS & EMITS
interface Props {
  open?: boolean;
  mode?: 'create' | 'edit';
  booking?: Booking;
  initialData?: Partial<BookingFormData>;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', booking: BookingFormData): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'create',
  booking: undefined,
  initialData: undefined
});

const emit = defineEmits<Emits>();

// STORES
const propertyStore = usePropertyStore();

// FORM REFS
const formRef = ref<VForm | null>(null);
const formValid = ref<boolean>(false);
const loading = ref<boolean>(false);
const errors = ref<Map<string, string>>(new Map());
const autoDetectType = ref<boolean>(true);

// FORM DATA
const form = reactive<Partial<BookingFormData>>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  checkout_time: '', // Required time when guests leave
  checkin_time: '',   // Required time when guests arrive
  booking_type: 'standard',
  guest_count: undefined,
  notes: '',
  status: 'pending',
  owner_id: '', // Will be set by the parent component
});

// COMPUTED PROPERTIES
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});

const formTitle = computed((): string => {
  return props.mode === 'create' ? 'Create Booking' : 'Edit Booking';
});

const submitButtonText = computed((): string => {
  return props.mode === 'create' ? 'Create' : 'Save';
});

const propertiesArray = computed((): Property[] => {
  // Use the store's activeProperties which should be filtered by owner via RLS
  return propertyStore.activeProperties;
});

// Get selected property for default times
const selectedProperty = computed((): Property | undefined => {
  console.log('🔍 selectedProperty computed - form.property_id:', form.property_id);
  if (!form.property_id) {
    console.log('🔍 selectedProperty computed - no property_id, returning undefined');
    return undefined;
  }
  const property = propertyStore.getPropertyById(form.property_id as string);
  console.log('🔍 selectedProperty computed - found property:', property);
  return property;
});

// Time validation rules and hints
const checkoutTimeRules = computed(() => getTimeValidationRules(selectedProperty.value));
const checkinTimeRules = computed(() => getCheckinTimeValidationRules((form.checkout_time as string) || ''));
const checkoutTimeHint = computed(() => getTimeHint('checkout', selectedProperty.value));
const checkinTimeHint = computed(() => getTimeHint('checkin', selectedProperty.value));

// Check if dates indicate a turn booking (same day)
const isTurnBooking = computed((): boolean => {
  if (!form.checkout_date || !form.checkin_date) return false;
  
  const checkoutDate = new Date(form.checkout_date as string);
  const checkinDate = new Date(form.checkin_date as string);
  
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    return false;
  }
  
  return checkoutDate.toDateString() === checkinDate.toDateString();
});

// Show warning if dates indicate turn but type is standard
const showTurnWarning = computed((): boolean => {
  return isTurnBooking.value && form.booking_type === 'standard';
});

// Show error if type is turn but dates are not same day
const showTurnError = computed((): boolean => {
  return !isTurnBooking.value && form.booking_type === 'turn';
});

// DROPDOWN OPTIONS
const bookingTypeItems = [
  { title: 'Standard Booking', value: 'standard', subtitle: 'Regular cleaning with time gap between guests' },
  { title: 'Turn (Urgent)', value: 'turn', subtitle: 'Same-day checkout/checkin, high priority' }
];

const statusItems = [
  { title: 'Pending', value: 'pending' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'In Progress', value: 'in_progress' },
  { title: 'Completed', value: 'completed' },
  { title: 'Cancelled', value: 'cancelled' }
];

// VALIDATION RULES
const propertyRules = [
  (v: string) => !!v || 'Property is required',
  (v: string) => {
    const property = propertyStore.getPropertyById(v);
    return !!property || 'Selected property does not exist';
  }
];

const dateRules = [
  (v: string) => !!v || 'Date is required',
  (v: string) => {
    const date = new Date(v);
    return !isNaN(date.getTime()) || 'Invalid date format';
  }
];

const bookingTypeRules = [
  (v: string) => !!v || 'Booking type is required',
  (v: string) => ['standard', 'turn'].includes(v) || 'Invalid booking type'
];

// METHODS
// Automatically update booking type based on dates if auto-detect is enabled
function updateBookingType(): void {
  if (!autoDetectType.value) return;
  if (!form.checkout_date || !form.checkin_date) return;
  
  const checkoutDate = new Date(form.checkout_date as string);
  const checkinDate = new Date(form.checkin_date as string);
  
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    return;
  }
  
  const isSameDay = checkoutDate.toDateString() === checkinDate.toDateString();
  form.booking_type = isSameDay ? 'turn' : 'standard';
}

// Reset form to default or to booking data
function resetForm(): void {
  console.log('🔍 resetForm called - mode:', props.mode);
  errors.value.clear();
  
  if (props.mode === 'edit' && props.booking) {
    console.log('🔍 resetForm - editing existing booking');
    // Populate form with existing booking data
    // Convert dates to the format expected by Vuetify date inputs (YYYY-MM-DD)
    const checkoutDate = props.booking.checkout_date;
    const checkinDate = props.booking.checkin_date;
    
    Object.assign(form, {
      property_id: props.booking.property_id,
      checkout_date: formatDateForInput(safeString(checkoutDate)),
      checkin_date: formatDateForInput(safeString(checkinDate)),
      checkin_time: props.booking.checkin_time || '',
      checkout_time: props.booking.checkout_time || '',
      booking_type: props.booking.booking_type,
      guest_count: props.booking.guest_count,
      notes: props.booking.notes,
      status: props.booking.status,
      owner_id: props.booking.owner_id
    });
  } else {
    console.log('🔍 resetForm - creating new booking');
    // Reset to defaults for create mode, but use initial data if provided
    const defaults = {
      property_id: '',
      checkout_date: '',
      checkin_date: '',
      checkout_time: '', // Will be set with smart defaults
      checkin_time: '',   // Will be set with smart defaults
      booking_type: 'standard',
      guest_count: undefined,
      notes: '',
      status: 'pending',
      owner_id: ''
    };
    
    // Merge defaults with initial data, mapping calendar date properties
    const initialData = props.initialData || {};
    
    const formData = { 
      ...defaults, 
      ...initialData,
      // Map calendar date properties to form properties  
      checkin_date: initialData.start || initialData.checkin_date || '',      // ✅ start = checkin
      checkout_date: initialData.end || initialData.checkout_date || ''    // ✅ end = checkout
    };
    
    // Format dates if they exist
    if (formData.checkout_date) {
      formData.checkout_date = formatDateForInput(String(formData.checkout_date));
    }
    if (formData.checkin_date) {
      formData.checkin_date = formatDateForInput(String(formData.checkin_date));
    }
    
    Object.assign(form, formData);
    console.log('🔍 resetForm - form data after reset:', {
      property_id: form.property_id,
      checkout_time: form.checkout_time,
      checkin_time: form.checkin_time
    });
  }
}

// Validate form
async function validate(): Promise<boolean> {
  errors.value.clear();
  
  if (!formRef.value) return false;
  
  const { valid } = await formRef.value.validate();
  if (!valid) return false;
  
  // Additional validation
  const checkoutDate = new Date(String(form.checkout_date || ''));
  const checkinDate = new Date(String(form.checkin_date || ''));
  
  // Check if dates are valid
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    errors.value.set('checkout_date', 'Invalid date format');
    errors.value.set('checkin_date', 'Invalid date format');
    return false;
  }
  
  // Check if checkin is before or same as checkout (guests must arrive before or same day they leave)
  if (checkinDate > checkoutDate) {
    errors.value.set('checkout_date', 'Check-out date must be after or same as check-in date (guest stay period)');
    return false;
  }
  
  // Check turn booking consistency
  if (form.booking_type === 'turn' && !isTurnBooking.value) {
    errors.value.set('booking_type', 'Turn bookings must have checkout and checkin on the same day');
    return false;
  }
  
  // Validate required times
  if (!form.checkout_time) {
    errors.value.set('checkout_time', 'Checkout time is required');
    return false;
  }
  
  if (!form.checkin_time) {
    errors.value.set('checkin_time', 'Checkin time is required');
    return false;
  }
  
  // Validate time order for same-day turns only
  if (form.checkout_time && form.checkin_time && isTurnBooking.value) {
    const checkoutTime = new Date(`2000-01-01T${form.checkout_time}:00`);
    const checkinTime = new Date(`2000-01-01T${form.checkin_time}:00`);
    
    if (checkinTime >= checkoutTime) {
      errors.value.set('checkin_time', 'For same-day turns, check-in time must be before check-out time (guest stay before they leave)');
      return false;
    }
  }
  
  // All validation passed
  return true;
}

// Handle form submission
async function handleSubmit(): Promise<void> {
  loading.value = true;
  
  try {
    const isValid = await validate();
    if (!isValid) {
      loading.value = false;
      return;
    }
    
    // Ensure all required fields are present
    if (!form.property_id || !form.checkout_date || !form.checkin_date || !form.booking_type) {
      errors.value.set('form', 'Please fill in all required fields');
      loading.value = false;
      return;
    }
    
    // Prepare data for emission
    const bookingData: BookingFormData = {
      property_id: form.property_id,
      checkout_date: form.checkout_date,
      checkin_date: form.checkin_date,
      checkout_time: form.checkout_time,
      checkin_time: form.checkin_time,
      booking_type: form.booking_type as BookingType,
      status: (form.status as BookingStatus) || 'pending',
      owner_id: form.owner_id as string,
      guest_count: form.guest_count,
      notes: form.notes
    };
    
    // Emit save event with booking data
    emit('save', bookingData);
    
    // Reset and close (parent component will handle actual saving)
    loading.value = false;
    resetForm();
    isOpen.value = false;
  } catch (err) {
    console.error('Error submitting form:', err);
    errors.value.set('form', err instanceof Error ? err.message : 'An error occurred');
    loading.value = false;
  }
}

// Handle booking deletion
function handleDelete(): void {
  if (props.mode !== 'edit' || !props.booking) return;
  
  loading.value = true;
  emit('delete', props.booking.id);
  
  // Parent component will handle actual deletion
  loading.value = false;
  isOpen.value = false;
}

// Handle modal close
function handleClose(): void {
  resetForm();
  emit('close');
}

// Format date for input field (ensure YYYY-MM-DD format)
function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  
  // If it's already in YYYY-MM-DD format, return as-is
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }
  
  // Try to parse and format the date
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date:', dateStr);
      return '';
    }
    
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', dateStr, error);
    return '';
  }
}

// LIFECYCLE HOOKS
onMounted(() => {
  resetForm();
});

// WATCHERS
watch(() => props.open, (newValue) => {
  if (newValue) {
    // Add small delay to ensure props are fully updated
    nextTick(() => {
      resetForm();
    });
  }
});

watch(() => props.booking, (newBooking, oldBooking) => {
  if (props.open && props.mode === 'edit' && newBooking && newBooking.id !== oldBooking?.id) {
    resetForm();
  }
});

watch(() => props.initialData, (newInitialData) => {
  if (props.open && props.mode === 'create' && newInitialData) {
    resetForm();
  }
});

// Watch for property selection to set default times
watch(() => form.property_id, (newPropertyId) => {
  console.log('🔍 Property watcher triggered with newPropertyId:', newPropertyId);
  console.log('🔍 Current form mode:', props.mode);
  console.log('🔍 Current form times:', {
    checkout: form.checkout_time,
    checkin: form.checkin_time
  });
  
  if (newPropertyId && props.mode === 'create') {
    const property = propertyStore.getPropertyById(newPropertyId as string);
    console.log('🔍 Found property:', property);
    
    if (property) {
      const defaultTimes = getDefaultTimes(property);
      console.log('🔍 Got default times:', defaultTimes);
      
      // Only set defaults if times are not already set
      if (!form.checkout_time) {
        console.log('🔍 Setting checkout time to:', defaultTimes.checkout);
        form.checkout_time = defaultTimes.checkout;
      } else {
        console.log('🔍 Checkout time already set, not overriding');
      }
      
      if (!form.checkin_time) {
        console.log('🔍 Setting checkin time to:', defaultTimes.checkin);
        form.checkin_time = defaultTimes.checkin;
      } else {
        console.log('🔍 Checkin time already set, not overriding');
      }
    } else {
      console.log('🔍 Property not found in store');
    }
  } else {
    console.log('🔍 Skipping default time setting - conditions not met');
  }
});
</script>

<style scoped>
.v-alert {
  margin-top: 8px;
}

/* Modal viewport constraints */
.modal-card {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-content {
  overflow-y: auto;
  flex: 1;
  max-height: calc(90vh - 120px); /* Subtract header and footer space */
}
</style> 