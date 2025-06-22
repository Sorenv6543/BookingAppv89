<template>
  <v-container>
    <!-- Current Status Display -->
    <v-row>
      <v-col cols="12">
        <v-alert
          :color="getStatusColor(booking.status)"
          variant="tonal"
          class="mb-4"
        >
          <template #prepend>
            <v-icon :icon="getStatusIcon(booking.status)" />
          </template>
          <div class="d-flex align-center">
            <div>
              <div class="text-h6">Current Status</div>
              <div class="text-body-2">
                {{ getStatusDescription(booking.status) }}
              </div>
            </div>
            <v-spacer />
            <v-chip
              :color="getStatusColor(booking.status)"
              size="large"
              variant="elevated"
            >
              {{ booking.status.toUpperCase() }}
            </v-chip>
          </div>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Status Change Section -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1 py-3">
            <v-icon class="mr-2">mdi-clipboard-check</v-icon>
            Update Status
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-select
              v-model="selectedStatus"
              :items="statusOptions"
              label="New Status"
              variant="outlined"
              :disabled="loading"
              prepend-inner-icon="mdi-clipboard-list"
              :error-messages="statusError"
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
                  <template #subtitle>
                    {{ getStatusDescription(item.value) }}
                  </template>
                </v-list-item>
              </template>
            </v-select>
            
            <v-btn
              color="primary"
              variant="elevated"
              :loading="loading"
              :disabled="!selectedStatus || selectedStatus === booking.status"
              @click="handleStatusChange"
              class="mt-2"
              block
            >
              <v-icon start>mdi-check-circle</v-icon>
              Update Status
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card variant="outlined" class="mb-4">
          <v-card-title class="text-subtitle-1 py-3">
            <v-icon class="mr-2">mdi-note-text</v-icon>
            Add Note
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-textarea
              v-model="newNote"
              label="Add a note about this status change"
              variant="outlined"
              :disabled="loading"
              :error-messages="noteError"
              auto-grow
              rows="3"
              counter="500"
              :rules="[rules.maxLength(500)]"
              prepend-inner-icon="mdi-pencil"
              hint="Optional note to document the status change"
              persistent-hint
            />
            
            <v-btn
              color="secondary"
              variant="tonal"
              :loading="loading"
              :disabled="!newNote.trim()"
              @click="handleAddNote"
              class="mt-2"
              block
            >
              <v-icon start>mdi-plus</v-icon>
              Add Note
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Status History -->
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 py-3">
            <v-icon class="mr-2">mdi-history</v-icon>
            Status History
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div v-if="statusHistory.length === 0" class="text-center text-medium-emphasis py-4">
              <v-icon size="48" class="mb-2">mdi-history</v-icon>
              <div>No status changes recorded yet</div>
            </div>
            
            <v-timeline
              v-else
              density="compact"
              class="mt-2"
            >
              <v-timeline-item
                v-for="(item, index) in statusHistory"
                :key="index"
                :dot-color="getStatusColor(item.status)"
                size="small"
              >
                <template #opposite>
                  <div class="text-caption text-medium-emphasis">
                    {{ formatDate(item.timestamp) }}
                  </div>
                </template>
                
                <v-card variant="tonal" class="mb-2">
                  <v-card-text class="py-2">
                    <div class="d-flex align-center">
                      <v-chip
                        :color="getStatusColor(item.status)"
                        size="small"
                        variant="elevated"
                        class="mr-2"
                      >
                        {{ item.status.toUpperCase() }}
                      </v-chip>
                      <span class="text-body-2">{{ item.description }}</span>
                    </div>
                    <div v-if="item.note" class="text-caption text-medium-emphasis mt-1">
                      Note: {{ item.note }}
                    </div>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Booking, BookingStatus } from '@/types';

// PROPS & EMITS
interface Props {
  booking: Booking;
  loading?: boolean;
}

interface Emits {
  (e: 'status-change', data: { bookingId: string; status: BookingStatus }): void;
  (e: 'add-note', note: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
});

const emit = defineEmits<Emits>();

// STATE
const selectedStatus = ref<BookingStatus | null>(null);
const newNote = ref<string>('');
const statusError = ref<string>('');
const noteError = ref<string>('');

// COMPUTED
const statusOptions = computed(() => [
  { 
    title: 'Pending', 
    value: 'pending' as BookingStatus,
    subtitle: 'Waiting for scheduling'
  },
  { 
    title: 'Scheduled', 
    value: 'scheduled' as BookingStatus,
    subtitle: 'Cleaner assigned and scheduled'
  },
  { 
    title: 'In Progress', 
    value: 'in_progress' as BookingStatus,
    subtitle: 'Cleaning currently in progress'
  },
  { 
    title: 'Completed', 
    value: 'completed' as BookingStatus,
    subtitle: 'Cleaning finished successfully'
  },
  { 
    title: 'Cancelled', 
    value: 'cancelled' as BookingStatus,
    subtitle: 'Booking has been cancelled'
  }
]);

// Mock status history - in real app this would come from props or API
const statusHistory = computed(() => [
  {
    status: 'pending' as BookingStatus,
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    description: 'Booking created',
    note: 'Initial booking request from property owner'
  },
  {
    status: 'scheduled' as BookingStatus,
    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
    description: 'Cleaner assigned',
    note: 'Assigned to John Smith for tomorrow morning'
  }
]);

// VALIDATION RULES
const rules = {
  maxLength: (max: number) => (v: string) => 
    !v || v.length <= max || `Maximum ${max} characters allowed`
};

// HELPER FUNCTIONS
function getStatusColor(status: BookingStatus): string {
  const colors = {
    pending: 'orange',
    scheduled: 'blue',
    in_progress: 'purple',
    completed: 'green',
    cancelled: 'red'
  };
  return colors[status] || 'grey';
}

function getStatusIcon(status: BookingStatus): string {
  const icons = {
    pending: 'mdi-clock-outline',
    scheduled: 'mdi-calendar-check',
    in_progress: 'mdi-progress-clock',
    completed: 'mdi-check-circle',
    cancelled: 'mdi-cancel'
  };
  return icons[status] || 'mdi-help-circle';
}

function getStatusDescription(status: BookingStatus): string {
  const descriptions = {
    pending: 'Booking is waiting to be scheduled',
    scheduled: 'Cleaner has been assigned and scheduled',
    in_progress: 'Cleaning is currently being performed',
    completed: 'Cleaning has been completed successfully',
    cancelled: 'Booking has been cancelled'
  };
  return descriptions[status] || 'Unknown status';
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// EVENT HANDLERS
function handleStatusChange(): void {
  if (!selectedStatus.value) {
    statusError.value = 'Please select a status';
    return;
  }

  if (selectedStatus.value === props.booking.status) {
    statusError.value = 'Status is already set to this value';
    return;
  }

  statusError.value = '';
  emit('status-change', {
    bookingId: props.booking.id,
    status: selectedStatus.value
  });

  // Reset selection after successful change
  selectedStatus.value = null;
}

function handleAddNote(): void {
  const note = newNote.value.trim();
  
  if (!note) {
    noteError.value = 'Please enter a note';
    return;
  }

  if (note.length > 500) {
    noteError.value = 'Note is too long (max 500 characters)';
    return;
  }

  noteError.value = '';
  emit('add-note', note);

  // Reset note after successful addition
  newNote.value = '';
}
</script>

<style scoped>
.v-timeline {
  padding-left: 0;
}

.v-card-title {
  font-weight: 600;
}

.v-alert {
  border-left: 4px solid currentColor;
}
</style> 