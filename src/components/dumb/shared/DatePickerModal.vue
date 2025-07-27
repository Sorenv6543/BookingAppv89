<template>
  <v-dialog
    :model-value="visible"
    @update:model-value="(value) => emit('update:visible', value)"
    max-width="400"
    persistent
    @keydown.esc="handleCancel"
    @keydown.enter="handleConfirm"
  >
    <v-card class="date-picker-modal">
      <v-card-title class="d-flex align-center">
        <v-icon class="mr-2">mdi-calendar</v-icon>
        Go to Date
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="handleCancel"
        />
      </v-card-title>

      <v-card-text class="pb-0">
        <!-- Date Picker -->
        <v-date-picker
          v-model="selectedDate"
          color="primary"
          show-adjacent-months
          :max="maxDate"
          :min="minDate"
          width="100%"
          class="date-picker-calendar"
        />

        <!-- Quick Date Options -->
        <v-divider class="my-4" />
        
        <div class="quick-date-options">
          <span class="text-subtitle-2 mb-3 d-block">Quick Options:</span>
          
          <div class="d-flex flex-wrap ga-2">
            <v-btn
              v-for="option in quickDateOptions"
              :key="option.key"
              :prepend-icon="option.icon"
              variant="outlined"
              size="small"
              @click="selectQuickDate(option.key)"
            >
              {{ option.label }}
            </v-btn>
          </div>
        </div>

        <!-- Manual Date Input -->
        <v-divider class="my-4" />
        
        <v-text-field
          v-model="manualDateInput"
          label="Or type date (YYYY-MM-DD)"
          placeholder="2024-12-25"
          variant="outlined"
          density="compact"
          :error-messages="dateInputError"
          @input="handleManualDateInput"
          @keydown.enter="handleConfirm"
        />
      </v-card-text>

      <v-card-actions class="px-4 pb-4">
        <v-btn
          variant="text"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
        
        <v-spacer />
        
        <v-btn
          color="primary"
          variant="elevated"
          :disabled="!isValidDate"
          @click="handleConfirm"
        >
          Go to Date
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
  visible: boolean;
  currentDate?: Date;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'dateSelected', date: Date): void;
  (e: 'cancel'): void;
}

const props = withDefaults(defineProps<Props>(), {
  currentDate: () => new Date()
});

const emit = defineEmits<Emits>();

// Local state
const selectedDate = ref<Date>(new Date());
const manualDateInput = ref('');
const dateInputError = ref('');

// Date constraints
const minDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 2); // 2 years in the past
  return date;
});

const maxDate = computed(() => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 2); // 2 years in the future
  return date;
});

// Quick date options
const quickDateOptions = [
  { key: 'today', label: 'Today', icon: 'mdi-calendar-today' },
  { key: 'tomorrow', label: 'Tomorrow', icon: 'mdi-calendar-plus' },
  { key: 'nextWeek', label: 'Next Week', icon: 'mdi-calendar-arrow-right' },
  { key: 'nextMonth', label: 'Next Month', icon: 'mdi-calendar-month' },
  { key: 'startOfMonth', label: 'Start of Month', icon: 'mdi-calendar-start' },
  { key: 'endOfMonth', label: 'End of Month', icon: 'mdi-calendar-end' }
];

// Computed properties
const isValidDate = computed(() => {
  if (!selectedDate.value) return false;
  
  const date = new Date(selectedDate.value);
  return date >= minDate.value && date <= maxDate.value;
});

// Watchers
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    // Reset to current date when modal opens
    selectedDate.value = new Date(props.currentDate);
    manualDateInput.value = formatDateForInput(props.currentDate);
    dateInputError.value = '';
  }
});

watch(() => props.currentDate, (newDate) => {
  if (props.visible) {
    selectedDate.value = new Date(newDate);
    manualDateInput.value = formatDateForInput(newDate);
  }
});

// Methods
const formatDateForInput = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

const selectQuickDate = (option: string): void => {
  const now = new Date();
  let targetDate: Date;

  switch (option) {
    case 'today':
      targetDate = new Date();
      break;
    case 'tomorrow':
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1);
      break;
    case 'nextWeek':
      targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 7);
      break;
    case 'nextMonth':
      targetDate = new Date();
      targetDate.setMonth(targetDate.getMonth() + 1);
      break;
    case 'startOfMonth':
      targetDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'endOfMonth':
      targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      break;
    default:
      targetDate = new Date();
  }

  selectedDate.value = targetDate;
  manualDateInput.value = formatDateForInput(targetDate);
  dateInputError.value = '';
};

const handleManualDateInput = (): void => {
  dateInputError.value = '';
  
  if (!manualDateInput.value) {
    return;
  }

  // Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(manualDateInput.value)) {
    dateInputError.value = 'Invalid format. Use YYYY-MM-DD';
    return;
  }

  const inputDate = new Date(manualDateInput.value);
  
  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    dateInputError.value = 'Invalid date';
    return;
  }

  // Check if date is within allowed range
  if (inputDate < minDate.value || inputDate > maxDate.value) {
    dateInputError.value = 'Date must be within 2 years of current date';
    return;
  }

  // Update selected date
  selectedDate.value = inputDate;
};

const handleConfirm = (): void => {
  if (isValidDate.value) {
    emit('dateSelected', selectedDate.value);
    emit('update:visible', false);
  }
};

const handleCancel = (): void => {
  emit('cancel');
  emit('update:visible', false);
};
</script>

<style scoped>
.date-picker-modal {
  max-height: 90vh;
  overflow-y: auto;
}

.date-picker-calendar {
  width: 100% !important;
}

.quick-date-options {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.quick-date-options .v-btn {
  margin: 2px;
  font-size: 0.875rem;
}

/* Enhanced styling for better UX */
:deep(.v-date-picker) {
  box-shadow: none !important;
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
  border-radius: 8px;
}

:deep(.v-date-picker-header) {
  background: rgba(var(--v-theme-primary), 0.1);
}

:deep(.v-date-picker-month) {
  background: rgb(var(--v-theme-surface));
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .date-picker-modal {
    margin: 16px;
    max-width: calc(100vw - 32px);
  }

  .quick-date-options .v-btn {
    font-size: 0.75rem;
    padding: 4px 8px;
  }

  :deep(.v-date-picker) {
    transform: scale(0.9);
    transform-origin: center;
  }
}
</style>
