<template>
  <v-dialog
    v-model="isOpen"
    max-width="780px"
    persistent
    scrollable
    scrim="rgba(0,0,0,0.6)"
    @keydown.esc="handleClose"
  >
    <v-card class="modal-card" rounded="xl" elevation="12">
<!-- Header with gradient -->
<div
  class="modal-header"
  elevation="10"
  style="background: linear-gradient(90deg, #3B82F6 0%, #2563EB 100%); padding: 16px 24px; border-top-left-radius: 12px; border-top-right-radius: 12px;"
>
        <div class="d-flex align-center ga-2">
          <v-icon :color="quickTurn ? 'white' : 'white'" size="26">
            {{ quickTurn ? 'mdi-lightning-bolt' : (mode === 'edit' ? 'mdi-calendar-edit' : 'mdi-calendar-plus') }}
          </v-icon>
          <span class="text-h5 font-weight-bold white--text" style="color: white;">{{ formTitle }}</span>
          <v-chip
            v-if="form.booking_type === 'turn'"
            color="white"
            text-color="error"
            size="small"
            variant="elevated"
            prepend-icon="mdi-alert-circle"
            class="ml-2"
          >
            URGENT TURN
          </v-chip>
          <v-spacer />
          <v-btn
            icon="mdi-close"
            variant="tonal"
            size="small"
            style="color: white;"
            @click="handleClose"
          />
        </div>
      </div>

      <v-card-text class="modal-content px-6 pt-5" style="background: #FAFBFC;">
        <v-form
          ref="formRef"
          v-model="formValid"
          @submit.prevent="handleSubmit"
        >
          <!-- Quick Turn: Outgoing Guest Header -->
          <div v-if="quickTurn" class="section-label mb-3">
            <v-icon color="error" size="18">mdi-account-arrow-right</v-icon>
            <span>{{ existingBooking ? 'Existing Booking (Outgoing Guest)' : 'Outgoing Guest' }}</span>
          </div>

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
                :disabled="loading"
                :error-messages="errors.get('property_id')"
                prepend-inner-icon="mdi-home-city"
                bg-color="white"
              />
            </v-col>
          </v-row>

          <!-- Check-in: Date + Time on same row -->
          <div class="section-label mb-2">
            <v-icon color="primary" size="18">mdi-login-variant</v-icon>
            <span>Check-in</span>
          </div>
          <v-row>
            <v-col cols="12" sm="7">
              <v-menu v-model="menuCheckinDate" :close-on-content-click="false">
                <template #activator="{ props: menuProps }">
                  <v-text-field
                    v-bind="menuProps"
                    :model-value="formatDisplayDate(form.checkin_date as string)"
                    label="Date"
                    readonly
                    :rules="dateRules"
                    required
                    :disabled="loading || outgoingReadonly"
                    :error-messages="errors.get('checkin_date')"
                    prepend-inner-icon="mdi-calendar"
                    append-inner-icon="mdi-menu-down"
                    bg-color="eggshell"
                    shadow="sm"
                  />
                </template>
                <v-date-picker
                  :model-value="toDatePickerValue(form.checkin_date as string)"
                  color="primary"
                  show-adjacent-months
                  @update:model-value="(v: unknown) => onDatePick(v, 'checkin_date', 'menuCheckinDate')"
                />
              </v-menu>
            </v-col>
            <v-col cols="12" sm="5">
              <v-menu v-model="menuCheckinTime" :close-on-content-click="false">
                <template #activator="{ props: menuProps }">
                  <v-text-field
                    v-bind="menuProps"
                    :model-value="formatDisplayTime(form.checkin_time as string)"
                    label="Time"
                    readonly
                    :rules="checkinTimeRules"
                    required
                    :disabled="loading"
                    :error-messages="errors.get('checkin_time')"
                    prepend-inner-icon="mdi-clock-outline"
                    append-inner-icon="mdi-menu-down"
                    bg-color="eggshell"
                    box-shadow="xl"
                  />
                </template>
                <v-time-picker
                  :model-value="form.checkin_time as string"
                  format="ampm"
                  color="primary"
                  scrollable
                  @update:model-value="(v: string | null) => { form.checkin_time = v ?? ''; menuCheckinTime = false; }"
                />
              </v-menu>
            </v-col>
          </v-row>

          <!-- Check-out: Date + Time on same row -->
          <div class="section-label mb-2">
            <v-icon color="error" size="18">mdi-logout-variant</v-icon>
            <span>Check-out</span>
          </div>
          <v-row>
            <v-col cols="12" sm="7">
              <v-menu v-model="menuCheckoutDate" :close-on-content-click="false">
                <template #activator="{ props: menuProps }">
                  <v-text-field
                    v-bind="menuProps"
                    :model-value="formatDisplayDate(form.checkout_date as string)"
                    label="Date"
                    readonly
                    :rules="dateRules"
                    required
                    :disabled="loading || outgoingReadonly"
                    :error-messages="errors.get('checkout_date')"
                    prepend-inner-icon="mdi-calendar"
                    append-inner-icon="mdi-menu-down"
                    bg-color="eggshell  "
                    box-shadow="xl"
                  />
                </template>
                <v-date-picker
                  :model-value="toDatePickerValue(form.checkout_date as string)"
                  color="primary"
                  show-adjacent-months
                  @update:model-value="(v: unknown) => onDatePick(v, 'checkout_date', 'menuCheckoutDate')"
                />
              </v-menu>
            </v-col>
            <v-col cols="12" sm="5">
              <v-menu v-model="menuCheckoutTime" :close-on-content-click="false">
                <template #activator="{ props: menuProps }">
                  <v-text-field
                    v-bind="menuProps"
                    :model-value="formatDisplayTime(form.checkout_time as string)"
                    label="Time"
                    readonly
                    :rules="checkoutTimeRules"
                    required
                    :disabled="loading"
                    :error-messages="errors.get('checkout_time')"
                    prepend-inner-icon="mdi-clock-outline"
                    append-inner-icon="mdi-menu-down"
                    bg-color="eggshell"
                    box-shadow="xl" 
                  />
                </template>
                <v-time-picker
                  :model-value="form.checkout_time as string"
                  format="ampm"
                  color="primary"
                  scrollable
                  @update:model-value="(v: string | null) => { form.checkout_time = v ?? ''; menuCheckoutTime = false; }"
                />
              </v-menu>
            </v-col>
          </v-row>

          <!-- Booking Type and Guest Count (hidden in quickTurn mode) -->
          <v-row v-if="!quickTurn">
            <v-col cols="12" md="6">
              <v-select
                v-model="form.booking_type"
                :items="bookingTypeItems"
                label="Booking Type"
                :rules="bookingTypeRules"
                required
                :disabled="loading"
                :error-messages="errors.get('booking_type')"
                prepend-inner-icon="mdi-tag-outline"
              />

              <v-checkbox
                v-model="autoDetectType"
                label="Auto-detect booking type from dates"
                :disabled="loading"
                density="compact"
                hide-details
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model.number="form.guest_count"
                label="Guest Count"
                type="number"
                min="1"
                :disabled="loading"
                :error-messages="errors.get('guest_count')"
                hint="Optional"
                persistent-hint
                prepend-inner-icon="mdi-account-group-outline"
              />
            </v-col>
          </v-row>

          <!-- Notes -->
          <v-row>
            <v-col cols="12">
              <v-textarea
                v-model="form.notes"
                label="Notes"
                :disabled="loading"
                :error-messages="errors.get('notes')"
                hint="Special instructions, requirements, etc."
                persistent-hint
                :counter="500"
                rows="3"
                prepend-inner-icon="mdi-note-edit-outline"
              />
            </v-col>
          </v-row>

          <!-- Quick Turn: Cleaning Window Badge -->
          <v-alert v-if="quickTurn && cleaningWindow" type="info" variant="tonal" density="compact" class="mb-4">
            <div class="d-flex align-center ga-2">
              <v-icon>mdi-broom</v-icon>
              <span class="font-weight-bold">Cleaning Window: {{ cleaningWindow }}</span>
              <span class="text-medium-emphasis">(between checkout and next check-in)</span>
            </div>
          </v-alert>

          <!-- Quick Turn: Incoming Guest Section -->
          <template v-if="quickTurn">
            <v-divider class="my-4" />
            <div class="section-label mb-3">
              <v-icon color="success" size="18">mdi-account-arrow-left</v-icon>
              <span>Incoming Guest</span>
            </div>

            <!-- Incoming Check-in: Date + Time -->
            <div class="section-label mb-2" style="font-size: 0.75rem;">
              <v-icon color="primary" size="16">mdi-login-variant</v-icon>
              <span>Check-in</span>
            </div>
            <v-row>
              <v-col cols="12" sm="7">
                <v-text-field
                  :model-value="formatDisplayDate(incomingForm.checkin_date as string)"
                  label="Date"
                  readonly
                  disabled
                  hint="Same as outgoing checkout"
                  persistent-hint
                  prepend-inner-icon="mdi-calendar"
                  bg-color="white"
                />
              </v-col>
              <v-col cols="12" sm="5">
                <v-menu v-model="menuIncomingCheckinTime" :close-on-content-click="false">
                  <template #activator="{ props: menuProps }">
                    <v-text-field
                      v-bind="menuProps"
                      :model-value="formatDisplayTime(incomingForm.checkin_time as string)"
                      label="Time"
                      readonly
                      :rules="[(v: string) => !!v || 'Time is required']"
                      required
                      :disabled="loading"
                      prepend-inner-icon="mdi-clock-outline"
                      append-inner-icon="mdi-menu-down"
                      bg-color="white"
                    />
                  </template>
                  <v-time-picker
                    :model-value="incomingForm.checkin_time as string"
                    format="ampm"
                    color="primary"
                    scrollable
                    @update:model-value="(v: string | null) => { incomingForm.checkin_time = v ?? ''; menuIncomingCheckinTime = false; }"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <!-- Incoming Check-out: Date + Time -->
            <div class="section-label mb-2" style="font-size: 0.75rem;">
              <v-icon color="error" size="16">mdi-logout-variant</v-icon>
              <span>Check-out</span>
            </div>
            <v-row>
              <v-col cols="12" sm="7">
                <v-menu v-model="menuIncomingCheckoutDate" :close-on-content-click="false">
                  <template #activator="{ props: menuProps }">
                    <v-text-field
                      v-bind="menuProps"
                      :model-value="formatDisplayDate(incomingForm.checkout_date as string)"
                      label="Date"
                      readonly
                      :rules="dateRules"
                      required
                      :disabled="loading"
                      prepend-inner-icon="mdi-calendar"
                      append-inner-icon="mdi-menu-down"
                      bg-color="white"
                    />
                  </template>
                  <v-date-picker
                    :model-value="toDatePickerValue(incomingForm.checkout_date as string)"
                    color="primary"
                    show-adjacent-months
                    @update:model-value="(v: unknown) => onIncomingDatePick(v)"
                  />
                </v-menu>
              </v-col>
              <v-col cols="12" sm="5">
                <v-menu v-model="menuIncomingCheckoutTime" :close-on-content-click="false">
                  <template #activator="{ props: menuProps }">
                    <v-text-field
                      v-bind="menuProps"
                      :model-value="formatDisplayTime(incomingForm.checkout_time as string)"
                      label="Time"
                      readonly
                      :rules="[(v: string) => !!v || 'Time is required']"
                      required
                      :disabled="loading"
                      prepend-inner-icon="mdi-clock-outline"
                      append-inner-icon="mdi-menu-down"
                      bg-color="white"
                    />
                  </template>
                  <v-time-picker
                    :model-value="incomingForm.checkout_time as string"
                    format="ampm"
                    color="primary"
                    scrollable
                    @update:model-value="(v: string | null) => { incomingForm.checkout_time = v ?? ''; menuIncomingCheckoutTime = false; }"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="incomingForm.notes"
                  label="Incoming Guest Notes"
                  :disabled="loading"
                  hint="Notes for the incoming guest booking"
                  persistent-hint
                  :counter="500"
                  rows="2"
                  prepend-inner-icon="mdi-note-edit-outline"
                />
              </v-col>
            </v-row>
          </template>

          <!-- Status (Edit mode only) -->
          <v-row v-if="mode === 'edit' && !quickTurn">
            <v-col cols="12">
              <v-select
                v-model="form.status"
                :items="statusItems"
                label="Status"
                :disabled="loading"
                :error-messages="errors.get('status')"
                prepend-inner-icon="mdi-list-status"
              />
            </v-col>
          </v-row>

          <!-- Turn Booking Warning -->
          <v-alert
            v-if="showTurnWarning"
            type="warning"
            variant="tonal"
            title="Same-Day Turnover"
            text="This booking has same-day checkout and checkin dates, which typically indicates a 'turn' booking (urgent same-day cleaning between guests)."
            class="mb-4"
            prepend-icon="mdi-alert-outline"
          />

          <!-- Turn Booking Error -->
          <v-alert
            v-if="showTurnError"
            type="error"
            variant="tonal"
            title="Invalid Turn Booking"
            text="Turn bookings must have checkout and checkin on the same day. Please adjust dates or change booking type to standard."
            class="mb-4"
            prepend-icon="mdi-alert-circle-outline"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="px-6 py-4">
        <v-btn
          variant="text"
          :disabled="loading"
          prepend-icon="mdi-close"
          @click="handleClose"
        >
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn
          v-if="mode === 'edit' && !quickTurn"
          color="warning"
          variant="tonal"
          :disabled="loading"
          prepend-icon="mdi-lightning-bolt"
          @click="emit('add-turn', booking!)"
        >
          Add Turn
        </v-btn>

        <v-btn
          v-if="mode === 'edit' && !quickTurn"
          color="error"
          variant="tonal"
          :disabled="loading"
          :loading="loading"
          prepend-icon="mdi-delete-outline"
          @click="handleDelete"
        >
          Delete
        </v-btn>

        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!formValid || loading || showTurnError"
          :loading="loading"
          :prepend-icon="mode === 'create' || quickTurn ? 'mdi-check-circle' : 'mdi-content-save'"
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
} from '@/utils/timeDefaults';

// PROPS & EMITS
interface QuickTurnPayload {
  property_id: string;
  outgoing: BookingFormData & { booking_id?: string };
  incoming: BookingFormData;
}

interface Props {
  open?: boolean;
  mode?: 'create' | 'edit';
  booking?: Booking;
  initialData?: Partial<BookingFormData>;
  quickTurn?: boolean;
  existingBooking?: Booking;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', booking: BookingFormData): void;
  (e: 'save-quick-turn', payload: QuickTurnPayload): void;
  (e: 'delete', id: string): void;
  (e: 'add-turn', booking: Booking): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'create',
  booking: undefined,
  initialData: undefined,
  quickTurn: false,
  existingBooking: undefined
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

// MENU STATES for date/time pickers
const menuCheckinDate = ref(false);
const menuCheckoutDate = ref(false);
const menuCheckinTime = ref(false);
const menuCheckoutTime = ref(false);
const menuIncomingCheckoutDate = ref(false);
const menuIncomingCheckinTime = ref(false);
const menuIncomingCheckoutTime = ref(false);

// FORM DATA
const form = reactive<Partial<BookingFormData>>({
  property_id: '',
  checkout_date: '',
  checkin_date: '',
  checkout_time: '',
  checkin_time: '',
  booking_type: 'standard',
  guest_count: undefined,
  notes: '',
  status: 'pending',
  owner_id: '',
});

// QUICK TURN - Incoming guest form data
const incomingForm = reactive<Partial<BookingFormData>>({
  property_id: '',
  checkin_date: '',
  checkout_date: '',
  checkin_time: '',
  checkout_time: '',
  booking_type: 'standard',
  guest_count: undefined,
  notes: '',
  status: 'pending',
  owner_id: '',
});

// DATE/TIME DISPLAY HELPERS
function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    // Parse as local date (YYYY-MM-DD)
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return dateStr; }
}

function formatDisplayTime(timeStr: string): string {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
  } catch { return timeStr; }
}

// Convert YYYY-MM-DD string to a Date for VDatePicker
function toDatePickerValue(dateStr: string): Date | undefined {
  if (!dateStr) return undefined;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return undefined;
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

// Handle date picker selection
function onDatePick(value: unknown, field: 'checkin_date' | 'checkout_date', menuRef: string) {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    form[field] = `${y}-${m}-${d}`;
    updateBookingType();
  }
  // Close menu
  if (menuRef === 'menuCheckinDate') menuCheckinDate.value = false;
  if (menuRef === 'menuCheckoutDate') menuCheckoutDate.value = false;
}

function onIncomingDatePick(value: unknown) {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, '0');
    const d = String(value.getDate()).padStart(2, '0');
    incomingForm.checkout_date = `${y}-${m}-${d}`;
  }
  menuIncomingCheckoutDate.value = false;
}

// COMPUTED PROPERTIES

// Quick turn: auto-lock incoming checkin_date to outgoing checkout_date
watch(() => form.checkout_date, (newDate) => {
  if (props.quickTurn && newDate) {
    incomingForm.checkin_date = newDate as string;
  }
});

// Quick turn: share property_id
watch(() => form.property_id, (newId) => {
  if (props.quickTurn && newId) {
    incomingForm.property_id = newId as string;
  }
});

const cleaningWindow = computed((): string => {
  if (!props.quickTurn || !form.checkout_time || !incomingForm.checkin_time) return '';
  const co = form.checkout_time as string;
  const ci = incomingForm.checkin_time as string;
  try {
    const coDate = new Date(`2000-01-01T${co}:00`);
    const ciDate = new Date(`2000-01-01T${ci}:00`);
    const diffMs = ciDate.getTime() - coDate.getTime();
    if (diffMs <= 0) return 'No gap';
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.round((diffMs % 3600000) / 60000);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  } catch { return ''; }
});

const outgoingReadonly = computed(() => props.quickTurn && !!props.existingBooking);

const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});

const formTitle = computed((): string => {
  if (props.quickTurn) return 'Quick Turn';
  return props.mode === 'create' ? 'Create Booking' : 'Edit Booking';
});

const submitButtonText = computed((): string => {
  if (props.quickTurn) return 'Create Turn';
  return props.mode === 'create' ? 'Create' : 'Save';
});

const propertiesArray = computed((): Property[] => {
  return propertyStore.activeProperties;
});

// Get selected property for default times
const selectedProperty = computed((): Property | undefined => {
  if (!form.property_id) return undefined;
  return propertyStore.getPropertyById(form.property_id as string);
});

// Time validation rules and hints
const checkoutTimeRules = computed(() => {
  if (isTurnBooking.value) {
    return getTimeValidationRules(selectedProperty.value);
  }
  return [(v: string) => !!v || 'Time is required'];
});

const checkinTimeRules = computed(() => {
  if (isTurnBooking.value) {
    return getCheckinTimeValidationRules((form.checkout_time as string) || '');
  }
  return [(v: string) => !!v || 'Time is required'];
});


// Check if dates indicate a turn booking (same day)
const isTurnBooking = computed((): boolean => {
  if (!form.checkout_date || !form.checkin_date) return false;
  const checkoutDate = new Date(form.checkout_date as string);
  const checkinDate = new Date(form.checkin_date as string);
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) return false;
  return checkoutDate.toDateString() === checkinDate.toDateString();
});

const showTurnWarning = computed((): boolean => {
  return isTurnBooking.value && form.booking_type === 'standard';
});

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
];

const bookingTypeRules = [
  (v: string) => !!v || 'Booking type is required',
  (v: string) => ['standard', 'turn'].includes(v) || 'Invalid booking type'
];

// METHODS
function updateBookingType(): void {
  if (!autoDetectType.value) return;
  if (!form.checkout_date || !form.checkin_date) return;
  const checkoutDate = new Date(form.checkout_date as string);
  const checkinDate = new Date(form.checkin_date as string);
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) return;
  const isSameDay = checkoutDate.toDateString() === checkinDate.toDateString();
  form.booking_type = isSameDay ? 'turn' : 'standard';
}

function resetForm(): void {
  errors.value.clear();

  if (props.mode === 'edit' && props.booking) {
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
    const defaults = {
      property_id: '',
      checkout_date: '',
      checkin_date: '',
      checkout_time: '',
      checkin_time: '',
      booking_type: 'standard',
      guest_count: undefined,
      notes: '',
      status: 'pending',
      owner_id: ''
    };
    const initialData = props.initialData || {};
    const formData = {
      ...defaults,
      ...initialData,
      checkin_date: initialData.start || initialData.checkin_date || '',
      checkout_date: initialData.end || initialData.checkout_date || ''
    };
    if (formData.checkout_date) {
      formData.checkout_date = formatDateForInput(String(formData.checkout_date));
    }
    if (formData.checkin_date) {
      formData.checkin_date = formatDateForInput(String(formData.checkin_date));
    }
    Object.assign(form, formData);
  }

  // Reset incoming form for quick turn mode
  if (props.quickTurn) {
    if (props.existingBooking) {
      Object.assign(form, {
        property_id: props.existingBooking.property_id,
        checkin_date: formatDateForInput(props.existingBooking.checkin_date),
        checkout_date: formatDateForInput(props.existingBooking.checkout_date),
        checkin_time: props.existingBooking.checkin_time || '',
        checkout_time: props.existingBooking.checkout_time || '',
        booking_type: props.existingBooking.booking_type,
        owner_id: props.existingBooking.owner_id,
      });
    }
    Object.assign(incomingForm, {
      property_id: form.property_id || '',
      checkin_date: form.checkout_date || '',
      checkout_date: '',
      checkin_time: '',
      checkout_time: '',
      booking_type: 'standard',
      guest_count: undefined,
      notes: '',
      status: 'pending',
      owner_id: form.owner_id || '',
    });
  }
}

async function validate(): Promise<boolean> {
  errors.value.clear();
  if (!formRef.value) return false;
  const { valid } = await formRef.value.validate();
  if (!valid) return false;

  const checkoutDate = new Date(String(form.checkout_date || ''));
  const checkinDate = new Date(String(form.checkin_date || ''));
  if (isNaN(checkoutDate.getTime()) || isNaN(checkinDate.getTime())) {
    errors.value.set('checkout_date', 'Invalid date format');
    errors.value.set('checkin_date', 'Invalid date format');
    return false;
  }
  if (checkinDate > checkoutDate) {
    errors.value.set('checkout_date', 'Check-out date must be after or same as check-in date');
    return false;
  }
  if (form.booking_type === 'turn' && !isTurnBooking.value) {
    errors.value.set('booking_type', 'Turn bookings must have checkout and checkin on the same day');
    return false;
  }
  if (!form.checkout_time) {
    errors.value.set('checkout_time', 'Checkout time is required');
    return false;
  }
  if (!form.checkin_time) {
    errors.value.set('checkin_time', 'Checkin time is required');
    return false;
  }
  if (form.checkout_time && form.checkin_time && isTurnBooking.value) {
    const checkoutTime = new Date(`2000-01-01T${form.checkout_time}:00`);
    const checkinTime = new Date(`2000-01-01T${form.checkin_time}:00`);
    if (checkinTime >= checkoutTime) {
      errors.value.set('checkin_time', 'For same-day turns, check-in time must be before check-out time');
      return false;
    }
  }
  return true;
}

async function handleSubmit(): Promise<void> {
  loading.value = true;
  try {
    const isValid = await validate();
    if (!isValid) {
      loading.value = false;
      return;
    }
    if (!form.property_id || !form.checkout_date || !form.checkin_date || !form.booking_type) {
      errors.value.set('form', 'Please fill in all required fields');
      loading.value = false;
      return;
    }
    const bookingData: BookingFormData = {
      property_id: form.property_id,
      checkout_date: form.checkout_date,
      checkin_date: form.checkin_date,
      checkout_time: form.checkout_time || '',
      checkin_time: form.checkin_time || '',
      booking_type: form.booking_type as BookingType,
      status: (form.status as BookingStatus) || 'pending',
      owner_id: form.owner_id as string,
      guest_count: form.guest_count,
      notes: form.notes
    };

    if (props.quickTurn) {
      if (!incomingForm.checkout_date || !incomingForm.checkin_time || !incomingForm.checkout_time) {
        errors.value.set('form', 'Please fill in all incoming guest fields');
        loading.value = false;
        return;
      }
      const incomingData: BookingFormData = {
        property_id: form.property_id,
        checkin_date: incomingForm.checkin_date as string,
        checkout_date: incomingForm.checkout_date as string,
        checkin_time: incomingForm.checkin_time as string || '',
        checkout_time: incomingForm.checkout_time as string || '',
        booking_type: 'standard' as BookingType,
        status: 'pending' as BookingStatus,
        owner_id: form.owner_id as string,
        guest_count: incomingForm.guest_count,
        notes: incomingForm.notes,
      };
      emit('save-quick-turn', {
        property_id: form.property_id,
        outgoing: {
          ...bookingData,
          booking_id: props.existingBooking?.id,
        },
        incoming: incomingData,
      });
      loading.value = false;
      return;
    }

    emit('save', bookingData);
    loading.value = false;
  } catch (err) {
    console.error('Error submitting form:', err);
    errors.value.set('form', err instanceof Error ? err.message : 'An error occurred');
    loading.value = false;
  }
}

function handleDelete(): void {
  if (props.mode !== 'edit' || !props.booking) return;
  emit('delete', props.booking.id);
}

function handleClose(): void {
  resetForm();
  emit('close');
}

function formatDateForInput(dateStr: string): string {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
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
    nextTick(() => { resetForm(); });
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
  if (newPropertyId && props.mode === 'create') {
    const property = propertyStore.getPropertyById(newPropertyId as string);
    if (property) {
      const defaultTimes = getDefaultTimes(property);
      if (!form.checkout_time) form.checkout_time = defaultTimes.checkout;
      if (!form.checkin_time) form.checkin_time = defaultTimes.checkin;
    }
  }
});
</script>

<style scoped>
.modal-card {
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
  padding: 20px 24px;
  flex-shrink: 0;
}

.modal-content {
  overflow-y: auto;
  flex: 1;
  max-height: calc(90vh - 160px);
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #37474F;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
