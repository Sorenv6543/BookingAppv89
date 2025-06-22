<template>
  <v-container>
    <!-- Current Assignment Display -->
    <v-row>
      <v-col cols="12">
        <v-alert
          :color="booking.assigned_cleaner_id ? 'success' : 'warning'"
          variant="tonal"
          class="mb-4"
        >
          <template #prepend>
            <v-icon :icon="booking.assigned_cleaner_id ? 'mdi-account-check' : 'mdi-account-question'" />
          </template>
          <div class="d-flex align-center">
            <div>
              <div class="text-h6">
                {{ booking.assigned_cleaner_id ? 'Cleaner Assigned' : 'No Cleaner Assigned' }}
              </div>
              <div class="text-body-2">
                {{ booking.assigned_cleaner_id ? getAssignedCleanerName() : 'This booking needs a cleaner assignment' }}
              </div>
            </div>
            <v-spacer />
            <v-chip
              v-if="booking.assigned_cleaner_id"
              color="success"
              size="large"
              variant="elevated"
            >
              <v-icon start>mdi-account-hard-hat</v-icon>
              ASSIGNED
            </v-chip>
            <v-chip
              v-else
              color="warning"
              size="large"
              variant="elevated"
            >
              <v-icon start>mdi-account-off</v-icon>
              UNASSIGNED
            </v-chip>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Cleaner Assignment Section -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1 py-3">
            <v-icon class="mr-2">mdi-account-hard-hat</v-icon>
            Assign Cleaner
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-select
              v-model="selectedCleaner"
              :items="availableCleaners"
              item-title="name"
              item-value="id"
              label="Select Cleaner"
              variant="outlined"
              :disabled="loading"
              prepend-inner-icon="mdi-account"
              :error-messages="assignmentError"
              clearable
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
            
            <div class="d-flex gap-2 mt-2">
              <v-btn
                color="primary"
                variant="elevated"
                :loading="loading"
                :disabled="!selectedCleaner"
                @click="handleAssign"
                class="flex-grow-1"
              >
                <v-icon start>mdi-account-plus</v-icon>
                Assign Cleaner
              </v-btn>
              
              <v-btn
                v-if="booking.assigned_cleaner_id"
                color="error"
                variant="tonal"
                :loading="loading"
                @click="handleUnassign"
              >
                <v-icon start>mdi-account-minus</v-icon>
                Unassign
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1 py-3">
            <v-icon class="mr-2">mdi-magnify</v-icon>
            Quick Actions
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-btn
              color="secondary"
              variant="tonal"
              :disabled="loading"
              @click="findBestCleaner"
              class="mb-2"
              block
            >
              <v-icon start>mdi-auto-fix</v-icon>
              Auto-Assign Best
            </v-btn>
            
            <v-btn
              color="info"
              variant="outlined"
              :disabled="loading"
              @click="showAvailableCleaners"
              class="mb-2"
              block
            >
              <v-icon start>mdi-calendar-search</v-icon>
              Check Availability
            </v-btn>
            
            <v-btn
              v-if="booking.booking_type === 'turn'"
              color="error"
              variant="elevated"
              :disabled="loading"
              @click="urgentAssign"
              block
            >
              <v-icon start>mdi-alert</v-icon>
              Urgent Assign
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Cleaner Details -->
    <v-row v-if="selectedCleanerDetails">
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 py-3">
            <v-icon class="mr-2">mdi-account-details</v-icon>
            Cleaner Details
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <div class="d-flex align-center mb-2">
                  <v-avatar size="48" class="mr-3">
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <div class="text-h6">{{ selectedCleanerDetails.name }}</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ selectedCleanerDetails.email }}
                    </div>
                  </div>
                </div>
              </v-col>
              
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 mb-1">Availability</div>
                <v-chip
                  :color="getCleanerAvailabilityColor(selectedCleanerDetails)"
                  size="small"
                  variant="tonal"
                >
                  {{ getCleanerAvailabilityText(selectedCleanerDetails) }}
                </v-chip>
              </v-col>
              
              <v-col cols="12" md="4">
                <div class="text-subtitle-2 mb-1">Skills</div>
                <div class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="skill in selectedCleanerDetails.skills"
                    :key="skill"
                    size="x-small"
                    variant="outlined"
                  >
                    {{ skill }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { Booking } from '@/types';

// Mock Cleaner interface - in real app this would be imported from types
interface Cleaner {
  id: string;
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  availability: 'available' | 'busy' | 'unavailable';
  rating?: number;
}

// PROPS & EMITS
interface Props {
  booking: Booking;
  cleaners: Cleaner[];
  loading?: boolean;
}

interface Emits {
  (e: 'assign', data: { bookingId: string; cleanerId: string }): void;
  (e: 'unassign', bookingId: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  cleaners: () => []
});

const emit = defineEmits<Emits>();

// STATE
const selectedCleaner = ref<string | null>(null);
const assignmentError = ref<string>('');

// COMPUTED
const availableCleaners = computed(() => {
  return props.cleaners.filter(cleaner => cleaner.availability !== 'unavailable');
});

const selectedCleanerDetails = computed(() => {
  if (!selectedCleaner.value) return null;
  return props.cleaners.find(cleaner => cleaner.id === selectedCleaner.value) || null;
});

// HELPER FUNCTIONS
function getAssignedCleanerName(): string {
  if (!props.booking.assigned_cleaner_id) return '';
  const cleaner = props.cleaners.find(c => c.id === props.booking.assigned_cleaner_id);
  return cleaner?.name || 'Unknown Cleaner';
}

function getCleanerAvailabilityColor(cleaner: Cleaner): string {
  const colors = {
    available: 'success',
    busy: 'warning',
    unavailable: 'error'
  };
  return colors[cleaner.availability] || 'grey';
}

function getCleanerAvailabilityText(cleaner: Cleaner): string {
  const texts = {
    available: 'Available',
    busy: 'Busy',
    unavailable: 'Unavailable'
  };
  return texts[cleaner.availability] || 'Unknown';
}

function getCleanerSubtitle(cleaner: Cleaner): string {
  const skillsText = cleaner.skills.slice(0, 2).join(', ');
  const ratingText = cleaner.rating ? ` • ${cleaner.rating}/5 ⭐` : '';
  return `${skillsText}${ratingText}`;
}

// EVENT HANDLERS
function handleAssign(): void {
  if (!selectedCleaner.value) {
    assignmentError.value = 'Please select a cleaner';
    return;
  }

  if (selectedCleaner.value === props.booking.assigned_cleaner_id) {
    assignmentError.value = 'This cleaner is already assigned';
    return;
  }

  assignmentError.value = '';
  emit('assign', {
    bookingId: props.booking.id,
    cleanerId: selectedCleaner.value
  });

  // Reset selection after successful assignment
  selectedCleaner.value = null;
}

function handleUnassign(): void {
  emit('unassign', props.booking.id);
}

function findBestCleaner(): void {
  // Simple algorithm to find best available cleaner
  const available = availableCleaners.value.filter(c => c.availability === 'available');
  if (available.length === 0) {
    assignmentError.value = 'No cleaners available';
    return;
  }

  // Sort by rating (if available) and select the best
  const best = available.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  selectedCleaner.value = best.id;
  assignmentError.value = '';
}

function showAvailableCleaners(): void {
  console.log('Showing cleaner availability calendar...');
  // This would typically open a calendar modal
}

function urgentAssign(): void {
  // For urgent turn bookings, auto-assign the first available cleaner
  const available = availableCleaners.value.filter(c => c.availability === 'available');
  if (available.length === 0) {
    assignmentError.value = 'No cleaners available for urgent assignment';
    return;
  }

  selectedCleaner.value = available[0].id;
  handleAssign();
}

// WATCHERS
watch(() => props.booking.assigned_cleaner_id, (newCleanerId) => {
  if (newCleanerId) {
    selectedCleaner.value = null; // Reset selection when booking already has a cleaner
  }
});
</script>

<style scoped>
.v-card-title {
  font-weight: 600;
}

.v-alert {
  border-left: 4px solid currentColor;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style> 