<template>
  <v-card
    class="upcoming-cleanings glass-card fade-in"
    :elevation="3"
    :class="{ 'has-urgent': hasUrgentCleanings }"
  >
    <v-card-title class="d-flex align-center">
      <v-icon
        icon="mdi-broom"
        class="mr-2"
        color="primary"
      />
      Upcoming Cleanings
      <v-badge 
        :content="bookings.length.toString()" 
        color="primary"
        class="ml-2"
      />
      <v-spacer />
      <v-btn 
        variant="text" 
        :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="toggleExpanded"
      />
    </v-card-title>
    
    <v-expand-transition>
      <div v-if="expanded">
        <v-card-text class="pt-0">
          <!-- Time period expansion panels -->
          <v-expansion-panels
            v-model="openPanels"
            multiple
          >
            <!-- Today's cleanings -->
            <v-expansion-panel v-if="todayCleanings.length > 0">
              <v-expansion-panel-title>
                Today ({{ todayCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- List of today's cleanings -->
                <v-list class="cleaning-list">
                  <v-list-item 
                    v-for="booking in limitedTodayCleanings" 
                    :key="booking.id" 
                    :value="booking.id"
                    :border="true"
                    class="mb-2 rounded cleaning-list-item"
                    :class="booking.booking_type === 'turn' ? 'turn-booking' : 'standard-booking'"
                  >
                    <template #prepend>
                      <v-icon 
                        :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'" 
                        :color="getPriorityColor(booking.priority)"
                      />
                    </template>
                    
                    <v-list-item-title class="font-weight-bold">
                      {{ getPropertyName(booking) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-column">
                        <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                        <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                        <span
                          v-if="booking.cleaning_window"
                          class="text-caption"
                        >
                          <v-icon
                            icon="mdi-timer-outline"
                            size="small"
                          />
                          Window: {{ getCleaningWindowText(booking) }}
                        </span>
                      </div>
                    </v-list-item-subtitle>
                    
                    <template #append>
                      <div class="d-flex flex-column">
                        <v-btn
                          size="small"
                          color="primary"
                          class="mb-1"
                          @click.stop="emit('view', booking.id)"
                        >
                          <v-icon
                            icon="mdi-eye"
                            size="small"
                            class="mr-1"
                          />
                          View
                        </v-btn>
                        <v-btn
                          size="small"
                          color="success"
                          @click.stop="emit('assign', booking.id)"
                        >
                          <v-icon
                            icon="mdi-account-check"
                            size="small"
                            class="mr-1"
                          />
                          Assign
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                
                <div
                  v-if="todayCleanings.length > limit"
                  class="text-center mt-2"
                >
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="emit('view-all', 'today')"
                  >
                    View all {{ todayCleanings.length }} cleanings
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- Tomorrow's cleanings -->
            <v-expansion-panel v-if="tomorrowCleanings.length > 0">
              <v-expansion-panel-title>
                Tomorrow ({{ tomorrowCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- List of tomorrow's cleanings -->
                <v-list class="cleaning-list">
                  <v-list-item 
                    v-for="booking in limitedTomorrowCleanings" 
                    :key="booking.id" 
                    :value="booking.id"
                    :border="true"
                    class="mb-2 rounded cleaning-list-item"
                    :class="booking.booking_type === 'turn' ? 'turn-booking' : 'standard-booking'"
                  >
                    <template #prepend>
                      <v-icon 
                        :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'" 
                        :color="getPriorityColor(booking.priority)"
                      />
                    </template>
                    
                    <v-list-item-title class="font-weight-bold">
                      {{ getPropertyName(booking) }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <div class="d-flex flex-column">
                        <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                        <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                        <span
                          v-if="booking.cleaning_window"
                          class="text-caption"
                        >
                          <v-icon
                            icon="mdi-timer-outline"
                            size="small"
                          />
                          Window: {{ getCleaningWindowText(booking) }}
                        </span>
                      </div>
                    </v-list-item-subtitle>
                    
                    <template #append>
                      <div class="d-flex flex-column">
                        <v-btn
                          size="small"
                          color="primary"
                          class="mb-1"
                          @click.stop="emit('view', booking.id)"
                        >
                          <v-icon
                            icon="mdi-eye"
                            size="small"
                            class="mr-1"
                          />
                          View
                        </v-btn>
                        <v-btn
                          size="small"
                          color="success"
                          @click.stop="emit('assign', booking.id)"
                        >
                          <v-icon
                            icon="mdi-account-check"
                            size="small"
                            class="mr-1"
                          />
                          Assign
                        </v-btn>
                      </div>
                    </template>
                  </v-list-item>
                </v-list>
                
                <div
                  v-if="tomorrowCleanings.length > limit"
                  class="text-center mt-2"
                >
                  <v-btn
                    variant="text"
                    color="primary"
                    size="small"
                    @click="emit('view-all', 'tomorrow')"
                  >
                    View all {{ tomorrowCleanings.length }} cleanings
                  </v-btn>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            
            <!-- Upcoming cleanings -->
            <v-expansion-panel v-if="upcomingCleanings.length > 0">
              <v-expansion-panel-title>
                Upcoming ({{ upcomingCleanings.length }})
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <!-- List of upcoming cleanings grouped by date -->
                <template
                  v-for="(group, date) in groupedUpcomingCleanings"
                  :key="date"
                >
                  <div class="date-heading mb-2">
                    {{ formatDate(date) }}
                  </div>
                  <v-list class="cleaning-list">
                    <v-list-item 
                      v-for="booking in group.slice(0, limit)" 
                      :key="booking.id" 
                      :value="booking.id"
                      :border="true"
                      class="mb-2 rounded cleaning-list-item"
                      :class="booking.booking_type === 'turn' ? 'turn-booking' : 'standard-booking'"
                    >
                      <template #prepend>
                        <v-icon 
                          :icon="booking.booking_type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-broom'" 
                          :color="getPriorityColor(booking.priority)"
                        />
                      </template>
                      
                      <v-list-item-title class="font-weight-bold">
                        {{ getPropertyName(booking) }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <div class="d-flex flex-column">
                          <span>Checkout: {{ formatTime(booking.checkout_date) }}</span>
                          <span>Checkin: {{ formatTime(booking.checkin_date) }}</span>
                          <span
                            v-if="booking.cleaning_window"
                            class="text-caption"
                          >
                            <v-icon
                              icon="mdi-timer-outline"
                              size="small"
                            />
                            Window: {{ getCleaningWindowText(booking) }}
                          </span>
                        </div>
                      </v-list-item-subtitle>
                      
                      <template #append>
                        <div class="d-flex flex-column">
                          <v-btn
                            size="small"
                            color="primary"
                            class="mb-1"
                            @click.stop="emit('view', booking.id)"
                          >
                            <v-icon
                              icon="mdi-eye"
                              size="small"
                              class="mr-1"
                            />
                            View
                          </v-btn>
                          <v-btn
                            size="small"
                            color="success"
                            @click.stop="emit('assign', booking.id)"
                          >
                            <v-icon
                              icon="mdi-account-check"
                              size="small"
                              class="mr-1"
                            />
                            Assign
                          </v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                  
                  <div
                    v-if="group.length > limit"
                    class="text-center mt-2 mb-4"
                  >
                    <v-btn
                      variant="text"
                      color="primary"
                      size="small"
                      @click="emit('view-all', date)"
                    >
                      View all {{ group.length }} cleanings for {{ formatDate(date) }}
                    </v-btn>
                  </div>
                </template>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
          
          <div
            v-if="bookings.length === 0"
            class="text-center py-2"
          >
            No upcoming cleanings scheduled.
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
  daysAhead?: number;
}

interface Emits {
  (e: 'view', id: string): void;
  (e: 'assign', id: string): void;
  (e: 'toggle-expanded', expanded: boolean): void;
  (e: 'view-all', period: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  initialExpanded: true,
  limit: 5,
  daysAhead: 7
});

const emit = defineEmits<Emits>();

const expanded = ref(props.initialExpanded);
const openPanels = ref([0]); // Default open today's panel

function toggleExpanded() {
  expanded.value = !expanded.value;
  emit('toggle-expanded', expanded.value);
}

// Helper functions
function isToday(date: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return today.getTime() === checkDate.getTime();
}

function isTomorrow(date: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  const checkDate = new Date(date);
  checkDate.setHours(0, 0, 0, 0);
  
  return tomorrow.getTime() === checkDate.getTime();
}

function isWithinDays(date: string, days: number): boolean {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + days);
  maxDate.setHours(23, 59, 59, 999);
  
  const checkDate = new Date(date);
  
  return checkDate <= maxDate;
}

function getDateString(date: string): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

// Check if any cleanings are urgent
const hasUrgentCleanings = computed((): boolean => {
  return props.bookings.some(booking => booking.priority === 'urgent');
});

// Computed properties for grouped cleanings
const todayCleanings = computed((): BookingWithMetadata[] => {
  return props.bookings
    .filter(booking => isToday(booking.checkout_date))
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
});

const tomorrowCleanings = computed((): BookingWithMetadata[] => {
  return props.bookings
    .filter(booking => isTomorrow(booking.checkout_date))
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
});

const upcomingCleanings = computed((): BookingWithMetadata[] => {
  return props.bookings
    .filter(booking => !isToday(booking.checkout_date) && 
                      !isTomorrow(booking.checkout_date) && 
                      isWithinDays(booking.checkout_date, props.daysAhead))
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
});

// Group upcoming cleanings by date
const groupedUpcomingCleanings = computed(() => {
  const groups: Record<string, BookingWithMetadata[]> = {};
  
  upcomingCleanings.value.forEach(booking => {
    const dateKey = getDateString(booking.checkout_date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(booking);
  });
  
  return groups;
});

// Limited cleanings for display
const limitedTodayCleanings = computed((): BookingWithMetadata[] => {
  return todayCleanings.value.slice(0, props.limit);
});

const limitedTomorrowCleanings = computed((): BookingWithMetadata[] => {
  return tomorrowCleanings.value.slice(0, props.limit);
});

// Formatting functions
function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
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

function getPropertyName(booking: BookingWithMetadata): string {
  return booking.property_name || `Property #${booking.property_id.substring(0, 8)}`;
}

function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'urgent': return 'error';
    case 'high': return 'warning';
    case 'normal': return 'primary';
    case 'low': 
    default: return 'success';
  }
}
</script>

<style scoped>
/* Main card theming */
.upcoming-cleanings {
  background: rgb(var(--v-theme-secondary)) !important;
  color: rgb(var(--v-theme-secondary)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
}

.upcoming-cleanings.has-urgent {
  border-left-color: rgb(var(--v-theme-error)) !important;
}

/* List theming */
.cleaning-list {
  background: transparent !important;
}

.cleaning-list-item {
  background: rgb(var(--v-theme-surface)) !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
  margin-bottom: 8px;
  transition: transform 0.2s, border-color 0.2s;
}

.cleaning-list-item:hover {
  transform: translateY(-2px);
  border-color: rgba(var(--v-theme-primary), 0.3) !important;
  box-shadow: 0 2px 8px rgba(var(--v-theme-on-surface), 0.15);
}

/* Booking type indicators */
.turn-booking {
  border-left: 3px solid rgb(var(--v-theme-warning)) !important;
}

.standard-booking {
  border-left: 3px solid rgb(var(--v-theme-primary)) !important;
}

/* Date heading theming */
.date-heading {
  font-weight: 500;
  color: rgb(var(--v-theme-primary)) !important;
  border-bottom: 1px solid rgba(var(--v-theme-primary), 0.3) !important;
  padding-bottom: 4px;
}

/* Card title theming */
:deep(.v-card-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

/* Badge theming */
:deep(.v-badge .v-badge__badge) {
  background: rgb(var(--v-theme-primary)) !important;
  color: rgb(var(--v-theme-on-primary)) !important;
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

:deep(.v-btn--variant-tonal) {
  background: rgba(var(--v-theme-primary), 0.12) !important;
  color: rgb(var(--v-theme-primary)) !important;
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

/* List item text theming */
:deep(.v-list-item-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-list-item-subtitle) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}

/* Expansion panel theming */
:deep(.v-expansion-panel) {
  background: rgb(var(--v-theme-surface)) !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.12) !important;
}

:deep(.v-expansion-panel-title) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-expansion-panel-text) {
  color: rgba(var(--v-theme-on-surface), 0.8) !important;
}
</style> 