<template>
  <v-card class="turn-alerts" :elevation="3" :color="hasUrgentTurns ? 'error-lighten-4' : 'warning-lighten-4'" :class="{ 'has-urgent': hasUrgentTurns }">
    <v-card-title class="d-flex align-center">
      <v-icon :icon="hasUrgentTurns ? 'mdi-alert-circle' : 'mdi-clock-alert'" class="mr-2" :color="hasUrgentTurns ? 'error' : 'warning'"></v-icon>
      Turn Alerts
      <v-badge 
        :content="bookings.length.toString()" 
        :color="hasUrgentTurns ? 'error' : 'warning'"
        class="ml-2"
      ></v-badge>
      <v-spacer></v-spacer>
      <v-btn 
        variant="text" 
        :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="toggleExpanded"
      ></v-btn>
    </v-card-title>
    
    <v-expand-transition>
      <div v-if="expanded">
        <v-card-text class="pt-0">
          <v-list v-if="bookings.length > 0" class="turn-list">
            <v-list-item 
              v-for="booking in limitedBookings" 
              :key="booking.id" 
              :value="booking.id"
              :border="true"
              class="mb-2 rounded turn-list-item"
              :class="booking.priority === 'urgent' ? 'urgent-turn' : 'high-turn'"
            >
              <template v-slot:prepend>
                <v-icon :icon="booking.priority === 'urgent' ? 'mdi-alert' : 'mdi-clock-fast'" :color="getPriorityColor(booking.priority)"></v-icon>
              </template>
              
              <v-list-item-title class="font-weight-bold">{{ getPropertyName(booking) }}</v-list-item-title>
              <v-list-item-subtitle>
                <div class="d-flex flex-column">
                  <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                  <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                  <span v-if="booking.cleaning_window" class="text-caption">
                    <v-icon icon="mdi-timer-outline" size="small"></v-icon>
                    Window: {{ getCleaningWindowText(booking) }}
                  </span>
                </div>
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <div class="d-flex flex-column">
                  <v-btn size="small" color="primary" class="mb-1" @click.stop="emit('view', booking.id)">
                    <v-icon icon="mdi-eye" size="small" class="mr-1"></v-icon>
                    View
                  </v-btn>
                  <v-btn size="small" color="success" @click.stop="emit('assign', booking.id)">
                    <v-icon icon="mdi-account-check" size="small" class="mr-1"></v-icon>
                    Assign
                  </v-btn>
                </div>
              </template>
            </v-list-item>
            
            <div v-if="props.bookings.length > props.limit" class="text-center mt-2">
              <v-btn variant="text" color="primary" size="small" @click="emit('view-all')">
                View all {{ props.bookings.length }} turns
              </v-btn>
            </div>
          </v-list>
          <div v-else class="text-center py-2">
            No urgent turn bookings at this time.
          </div>
        </v-card-text>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { BookingWithMetadata } from '@/types';

interface Props {
  bookings: BookingWithMetadata[];
  initialExpanded?: boolean;
  limit?: number;
}

interface Emits {
  (e: 'view', id: string): void;
  (e: 'assign', id: string): void;
  (e: 'toggle-expanded', expanded: boolean): void;
  (e: 'view-all'): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialExpanded: true,
  limit: 5
});

const emit = defineEmits<Emits>();

const expanded = ref(props.initialExpanded);

function toggleExpanded() {
  expanded.value = !expanded.value;
  emit('toggle-expanded', expanded.value);
}

const hasUrgentTurns = computed((): boolean => {
  return props.bookings.some(booking => booking.priority === 'urgent');
});

const limitedBookings = computed((): BookingWithMetadata[] => {
  // Sort by priority (urgent first) then by checkout date
  const sorted = [...props.bookings].sort((a, b) => {
    // Priority sort (urgent > high)
    if (a.priority !== b.priority) {
      return a.priority === 'urgent' ? -1 : 1;
    }
    
    // Then by checkout date (earlier first)
    return new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime();
  });
  
  return sorted.slice(0, props.limit);
});

function getPriorityColor(priority: string): string {
  return priority === 'urgent' ? 'error' : 'warning';
}

function getPropertyName(booking: BookingWithMetadata): string {
  return booking.property_name || `Property #${booking.property_id.substring(0, 8)}`;
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getCleaningWindowText(booking: BookingWithMetadata): string {
  if (!booking.cleaning_window) return 'Not calculated';
  
  const duration = booking.cleaning_window.duration;
  if (duration < 60) {
    return `${duration} min`;
  }
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  
  if (minutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${minutes}m`;
}
</script>

<style scoped>
.turn-alerts {
  border-left: 4px solid;
  border-color: var(--v-error-base);
}

.turn-alerts.has-urgent {
  animation: pulse 2s infinite;
}

.turn-list {
  background-color: transparent;
}

.turn-list-item {
  margin-bottom: 8px;
  transition: transform 0.2s;
}

.turn-list-item:hover {
  transform: translateY(-2px);
}

.urgent-turn {
  border-left: 3px solid var(--v-error-base) !important;
}

.high-turn {
  border-left: 3px solid var(--v-warning-base) !important;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(244, 67, 54, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
  }
}
</style> 