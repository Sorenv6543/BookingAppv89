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
          v-if="form.active"
          color="success"
          size="small"
          class="ml-2"
        >
          ACTIVE
        </v-chip>
        <v-chip
          v-else
          color="grey"
          size="small"
          class="ml-2"
        >
          INACTIVE
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
            <!-- Property Name -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="Property Name"
                  :rules="nameRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('name')"
                  hint="Enter the property name as it should appear in the system"
                  persistent-hint
                  prepend-inner-icon="mdi-home"
                />
              </v-col>
            </v-row>
            
            <!-- Property Address -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.address"
                  label="Property Address"
                 
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('address')"
                  hint="Full address including street, city, state, and zip code"
                  persistent-hint
                  prepend-inner-icon="mdi-map-marker"
                />
              </v-col>
            </v-row>
            
            <!-- Cleaning Duration and Pricing Tier -->
            <v-row>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model.number="form.cleaning_duration"
                  label="Cleaning Duration (minutes)"
                  type="number"
                  min="1"
                  :rules="durationRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('cleaning_duration')"
                  hint="Time required for standard cleaning"
                  persistent-hint
                  prepend-inner-icon="mdi-clock-outline"
                />
              </v-col>
              
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="form.pricing_tier"
                  :items="pricingTierItems"
                  label="Pricing Tier"
                  :rules="pricingTierRules"
                  required
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('pricing_tier')"
                  hint="Determines pricing and service level"
                  persistent-hint
                  prepend-inner-icon="mdi-currency-usd"
                />
              </v-col>
            </v-row>
            
            <!-- Special Instructions -->
            <v-row>
              <v-col cols="12">
                <v-textarea
                  v-model="form.special_instructions"
                  label="Special Instructions"
                  variant="outlined"
                  :disabled="loading"
                  :error-messages="errors.get('special_instructions')"
                  hint="Any special cleaning requirements or notes"
                  persistent-hint
                  :counter="1000"
                  rows="4"
                  prepend-inner-icon="mdi-note-text"
                />
              </v-col>
            </v-row>
            
            <!-- Active Status -->
            <v-row>
              <v-col cols="12">
                <v-checkbox
                  v-model="form.active"
                  label="Active Property"
                  :disabled="loading"
                  :error-messages="errors.get('active')"
                  hint="Inactive properties won't appear in booking calendars"
                  persistent-hint
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
          :disabled="!formValid || loading"
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
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { Property, PropertyFormData, PricingTier } from '@/types';
import type { VForm } from 'vuetify/components';

// PROPS & EMITS
interface Props {
  open?: boolean;
  mode?: 'create' | 'edit';
  property?: Property;
}

interface Emits {
  (e: 'close'): void;
  (e: 'save', property: PropertyFormData): void;
  (e: 'delete', id: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'create',
  property: undefined
});

const emit = defineEmits<Emits>();

// STORES
const authStore = useAuthStore();

// FORM REFS
const formRef = ref<VForm | null>(null);
const formValid = ref<boolean>(false);
const loading = ref<boolean>(false);
const errors = ref<Map<string, string>>(new Map());

// FORM DATA
const form = reactive<Partial<PropertyFormData>>({
  name: '',
  address: '',
  cleaning_duration: 60, // Default to 1 hour
  pricing_tier: 'basic',
  special_instructions: '',
  active: true,
  owner_id: '', // Will be set by the parent component or from auth store
});

// COMPUTED PROPERTIES
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});

const formTitle = computed((): string => {
  return props.mode === 'create' ? 'Create Property' : 'Edit Property';
});

const submitButtonText = computed((): string => {
  return props.mode === 'create' ? 'Create' : 'Save';
});

// DROPDOWN OPTIONS
const pricingTierItems = [
  { title: 'Basic', value: 'basic', subtitle: 'Standard cleaning service' },
  { title: 'Premium', value: 'premium', subtitle: 'Enhanced cleaning with additional services' },
  { title: 'Luxury', value: 'luxury', subtitle: 'Comprehensive premium cleaning package' }
];

// VALIDATION RULES
const nameRules = [
  (v: string) => !!v || 'Property name is required',
  (v: string) => (v && v.length <= 100) || 'Name must be less than 100 characters'
];


const durationRules = [
  (v: number) => !!v || 'Cleaning duration is required',
  (v: number) => (v && v > 0) || 'Duration must be greater than 0',
  (v: number) => (v && v <= 480) || 'Duration cannot exceed 8 hours (480 minutes)'
];

const pricingTierRules = [
  (v: string) => !!v || 'Pricing tier is required',
  (v: string) => ['basic', 'premium', 'luxury'].includes(v) || 'Invalid pricing tier'
];

// METHODS
// Reset form to default or to property data
function resetForm(): void {
  errors.value.clear();
  
  if (props.mode === 'edit' && props.property) {
    // Populate form with existing property data
    Object.assign(form, {
      name: props.property.name,
      address: props.property.address,
      cleaning_duration: props.property.cleaning_duration,
      pricing_tier: props.property.pricing_tier,
      special_instructions: props.property.special_instructions || '',
      active: props.property.active,
      owner_id: props.property.owner_id
    });
  } else {
    // Reset to defaults for create mode
    Object.assign(form, {
      name: '',
      address: '',
      cleaning_duration: 60,
      pricing_tier: 'basic',
      special_instructions: '',
      active: true,
      owner_id: authStore.user?.id || '' // Set owner to current user by default
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
  if (!form.name || String(form.name).trim() === '') {
    errors.value.set('name', 'Property name cannot be empty');
    return false;
  }
  
  if (!form.address || String(form.address).trim() === '') {
    errors.value.set('address', 'Property address cannot be empty');
    return false;
  }
  
  if (!form.cleaning_duration || Number(form.cleaning_duration) <= 0) {
    errors.value.set('cleaning_duration', 'Cleaning duration must be greater than 0');
    return false;
  }
  
  if (!form.pricing_tier || !['basic', 'premium', 'luxury'].includes(String(form.pricing_tier))) {
    errors.value.set('pricing_tier', 'Invalid pricing tier');
    return false;
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
    if (!form.name || !form.address || !form.cleaning_duration || !form.pricing_tier || form.active === undefined) {
      errors.value.set('form', 'Please fill in all required fields');
      loading.value = false;
      return;
    }
    
    // Prepare data for emission
    const propertyData: PropertyFormData = {
      name: form.name,
      address: form.address,
      cleaning_duration: form.cleaning_duration,
      pricing_tier: form.pricing_tier as PricingTier,
      special_instructions: form.special_instructions,
      active: form.active,
      owner_id: form.owner_id || authStore.user?.id || ''
    };
    
    // Emit save event with property data
    emit('save', propertyData);
    
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

// Handle property deletion
function handleDelete(): void {
  if (props.mode !== 'edit' || !props.property) return;
  
  loading.value = true;
  emit('delete', props.property.id);
  
  // Parent component will handle actual deletion
  loading.value = false;
  isOpen.value = false;
}

// Handle modal close
function handleClose(): void {
  resetForm();
  emit('close');
}

// LIFECYCLE HOOKS
onMounted(() => {
  resetForm();
});

// WATCHERS
watch(() => props.open, (newValue) => {
  if (newValue) {
    resetForm();
  }
});

watch(() => props.property, () => {
  if (props.open && props.mode === 'edit') {
    resetForm();
  }
});
</script>

<style scoped>
/* Dialog theming */
:deep(.v-dialog .v-card) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}

/* Card title theming */
:deep(.v-card-title) {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}

/* Form field theming */
:deep(.v-field) {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-field:hover) {
  border-color: rgba(var(--v-theme-primary), 0.5) !important;
}

:deep(.v-field--focused) {
  border-color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-field__input) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-label) {
  color: rgba(var(--v-theme-on-surface), 0.6) !important;
}

:deep(.v-label--active) {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Select menu theming */
:deep(.v-select__selection) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-list) {
  background: rgb(var(--v-theme-surface)) !important;
}

:deep(.v-list-item) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-list-item:hover) {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}

/* Button theming */
:deep(.v-btn) {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

:deep(.v-btn--variant-elevated),
:deep(.v-btn--variant-flat) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}

:deep(.v-btn--variant-outlined) {
  border-color: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-btn--variant-text) {
  color: rgb(var(--v-theme-primary)) !important;
}

:deep(.v-btn.text-error) {
  color: rgb(var(--v-theme-error)) !important;
}

:deep(.v-btn:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(var(--v-theme-primary), 0.3);
}

/* Icon theming */
:deep(.v-icon) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-btn .v-icon) {
  color: inherit !important;
}

/* Switch theming */
:deep(.v-switch .v-selection-control__input) {
  color: rgb(var(--v-theme-primary)) !important;
}

/* Error message theming */
:deep(.v-messages__message) {
  color: rgb(var(--v-theme-error)) !important;
}

/* Divider theming */
:deep(.v-divider) {
  border-color: rgba(var(--v-theme-on-surface), 0.12) !important;
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