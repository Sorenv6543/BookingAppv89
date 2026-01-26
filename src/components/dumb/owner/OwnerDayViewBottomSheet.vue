<template>
  <v-bottom-sheet
    v-model="internalVisible"
    :inset="useDisplay().mdAndUp.value"
    :persistent="false"
    max-width="600px"
    class="owner-day-view-sheet"
  >
    <v-card class="day-view-card">
      <!-- Header -->
      <v-card-title class="day-view-header">
        <div class="header-content">
          <div class="date-info">
            <h3 class="date-title">
              {{ formattedDate }}
            </h3>
            <p class="booking-count">
              {{ bookings.length }} booking{{ bookings.length !== 1 ? 's' : '' }}
            </p>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="close-button"
            @click="closeSheet"
          />
        </div>
      </v-card-title>

      <!-- Swipe indicator -->
      <div class="swipe-indicator" />

      <!-- Bookings List -->
      <v-card-text class="bookings-container">
        <div
          ref="bookingsListRef"
          class="bookings-list"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <div
            v-for="(booking, index) in bookings"
            :key="booking.id"
            class="booking-item"
            :class="{
              'booking-turn': booking.booking_type === 'turn',
              'booking-urgent': booking.priority === 'urgent',
              'booking-high': booking.priority === 'high'
            }"
          >
            <!-- Booking Header -->
            <div class="booking-header">
              <div class="property-info">
                <h4 class="property-name">
                  <v-icon
                    size="small"
                    class="property-icon"
                  >
                    mdi-home
                  </v-icon>
                  {{ getPropertyName(booking.property_id || '') }}
                  <v-chip
                    v-if="booking.booking_type === 'turn'"
                    size="x-small"
                    color="error"
                    variant="elevated"
                    class="turn-chip"
                  >
                    TURN
                  </v-chip>
                </h4>
                <p class="booking-times">
                  {{ formatBookingTime(safeString(booking.checkout_date)) }} → {{ formatBookingTime(safeString(booking.checkin_date)) }}
                </p>
              </div>
              <div class="priority-indicator">
                <v-chip
                  :color="getPriorityColor(booking.priority || 'normal')"
                  size="small"
                  variant="elevated"
                >
                  {{ (booking.priority || 'normal').toUpperCase() }}
                </v-chip>
              </div>
            </div>

            <!-- Booking Details -->
            <div class="booking-details">
              <div
                v-if="booking.guest_count"
                class="detail-row"
              >
                <v-icon
                  size="small"
                  class="detail-icon"
                >
                  mdi-account-multiple
                </v-icon>
                <span>{{ booking.guest_count }} guest{{ booking.guest_count !== 1 ? 's' : '' }}</span>
              </div>
              <div class="detail-row">
                <v-icon
                  size="small"
                  class="detail-icon"
                >
                  mdi-circle-medium
                </v-icon>
                <span class="status-text">{{ (booking.status || 'pending').replace('_', ' ').toUpperCase() }}</span>
              </div>
              <div
                v-if="booking.notes"
                class="detail-row notes-row"
              >
                <v-icon
                  size="small"
                  class="detail-icon"
                >
                  mdi-note-text
                </v-icon>
                <span class="notes-text">{{ booking.notes }}</span>
              </div>
            </div>

            <!-- Actions -->
            <div class="booking-actions">
              <v-btn
                variant="text"
                size="small"
                prepend-icon="mdi-eye"
                class="action-btn"
                @click="viewBooking(booking)"
              >
                View
              </v-btn>
              <v-btn
                variant="text"
                size="small"
                prepend-icon="mdi-pencil"
                class="action-btn"
                @click="editBooking(booking)"
              >
                Edit
              </v-btn>
              <v-btn
                v-if="booking.status !== 'completed'"
                variant="text"
                size="small"
                prepend-icon="mdi-check"
                color="success"
                class="action-btn"
                @click="markComplete(booking)"
              >
                Complete
              </v-btn>
            </div>

            <!-- Divider -->
            <v-divider
              v-if="index < bookings.length - 1"
              class="booking-divider"
            />
          </div>

          <!-- Empty State -->
          <div
            v-if="bookings.length === 0"
            class="empty-state"
          >
            <v-icon
              size="64"
              color="grey-lighten-1"
            >
              mdi-calendar-blank
            </v-icon>
            <h4 class="empty-title">
              No bookings for this day
            </h4>
            <p class="empty-subtitle">
              Get started by adding your first booking
            </p>
            <v-btn
              variant="elevated"
              color="primary"
              prepend-icon="mdi-plus"
              class="empty-state-btn"
              size="large"
              @click="addBooking"
            >
              Add Booking for {{ formattedDate }}
            </v-btn>
          </div>
        </div>
      </v-card-text>

      <!-- Footer Actions - Only show when there are existing bookings -->
      <v-card-actions
        v-if="bookings.length > 0"
        class="day-view-footer"
      >
        <v-btn
          variant="elevated"
          color="primary"
          prepend-icon="mdi-plus"
          class="add-booking-btn"
          block
          @click="addBooking"
        >
          Add Another Booking
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useDisplay } from 'vuetify';
import type { Booking, Property } from '@/types';
import { safeString } from '@/utils/typeHelpers';

interface Props {
  visible: boolean;
  date: Date | null;
  bookings: Booking[];
  properties: Map<string, Property>;
}

interface Emits {
  (e: 'update:visible', value: boolean): void;
  (e: 'view-booking', booking: Booking): void;
  (e: 'edit-booking', booking: Booking): void;
  (e: 'complete-booking', booking: Booking): void;
  (e: 'add-booking', date: Date): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Reactive state
const internalVisible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
});

const bookingsListRef = ref<HTMLElement>();

// Touch gesture handling
const touchStartY = ref(0);
const touchStartX = ref(0);
const isDragging = ref(false);

// Computed properties
const formattedDate = computed(() => {
  if (!props.date) return '';
  return props.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Helper functions
const getPropertyName = (propertyId: string): string => {
  if (!propertyId) return 'Unknown Property';
  const property = props.properties.get(propertyId);
  return property?.name || 'Unknown Property';
};

const formatBookingTime = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid Date';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'urgent': return 'error';
    case 'high': return 'warning';
    case 'normal': return 'primary';
    case 'low': return 'success';
    default: return 'grey';
  }
};

// Event handlers
const closeSheet = (): void => {
  internalVisible.value = false;
};

const viewBooking = (booking: Booking): void => {
  emit('view-booking', booking);
};

const editBooking = (booking: Booking): void => {
  emit('edit-booking', booking);
};

const markComplete = (booking: Booking): void => {
  emit('complete-booking', booking);
};

const addBooking = (): void => {
  if (props.date) {
    emit('add-booking', props.date);
  }
};

// Touch gesture handlers for swipe navigation
const handleTouchStart = (event: TouchEvent): void => {
  if (event.touches.length === 1) {
    touchStartY.value = event.touches[0].clientY;
    touchStartX.value = event.touches[0].clientX;
    isDragging.value = false;
  }
};

const handleTouchMove = (event: TouchEvent): void => {
  if (event.touches.length === 1) {
    const deltaY = Math.abs(event.touches[0].clientY - touchStartY.value);
    const deltaX = Math.abs(event.touches[0].clientX - touchStartX.value);
    
    // Determine if this is a vertical or horizontal swipe
    if (deltaY > 10 || deltaX > 10) {
      isDragging.value = true;
    }
  }
};

const handleTouchEnd = (event: TouchEvent): void => {
  if (isDragging.value && event.changedTouches.length === 1) {
    const endY = event.changedTouches[0].clientY;
    const endX = event.changedTouches[0].clientX;
    const deltaY = endY - touchStartY.value;
    const deltaX = endX - touchStartX.value;
    
    // Check for swipe down to close (only if swiping down significantly)
    if (deltaY > 100 && Math.abs(deltaX) < 50) {
      closeSheet();
    }
  }
  
  isDragging.value = false;
};

// Watch for visibility changes to handle focus
watch(internalVisible, async (newVisible) => {
  if (newVisible) {
    await nextTick();
    // Auto-focus on the sheet for accessibility
    if (bookingsListRef.value) {
      bookingsListRef.value.focus();
    }
  }
});
</script>

<style scoped>
.owner-day-view-sheet {
  z-index: 9999;
}

.day-view-card {
  border-radius: 20px 20px 0 0 !important;
  max-height: 65vh;
  overflow: hidden;
}

.day-view-header {
  padding: 16px 20px 8px;
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 20px 20px 0 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}

.date-info {
  flex: 1;
}

.date-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: rgb(var(--v-theme-on-surface));
}

.booking-count {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 4px 0 0;
}

.close-button {
  margin-left: 16px;
}

.swipe-indicator {
  width: 40px;
  height: 4px;
  background: rgb(var(--v-theme-on-surface-variant));
  border-radius: 2px;
  margin: 8px auto 16px;
  opacity: 0.5;
}

.bookings-container {
  padding: 0 20px 20px;
  max-height: 50vh;
  overflow-y: auto;
}

.bookings-list {
  outline: none;
}

.booking-item {
  padding: 16px;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid rgb(var(--v-theme-outline-variant));
  margin-bottom: 20px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
}

.booking-item:hover {
  background: rgb(var(--v-theme-surface-bright));
  border-color: rgb(var(--v-theme-primary));
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1);
}

.booking-turn {
  border-left: 4px solid rgb(var(--v-theme-error)) !important;
  background: rgb(var(--v-theme-error), 0.05);
}

.booking-urgent {
  animation: pulse-urgent 2s infinite;
}

.booking-high {
  border-left: 4px solid rgb(var(--v-theme-warning)) !important;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.property-info {
  flex: 1;
}

.property-name {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.property-icon {
  color: rgb(var(--v-theme-primary));
}

.turn-chip {
  font-size: 0.6rem !important;
  height: 18px !important;
}

.booking-times {
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 0;
}

.priority-indicator {
  margin-left: 12px;
}

.booking-details {
  margin-bottom: 16px;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 0.875rem;
  color: rgb(var(--v-theme-on-surface-variant));
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-icon {
  color: rgb(var(--v-theme-on-surface-variant));
}

.status-text {
  text-transform: capitalize;
}

.notes-row {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.notes-text {
  font-style: italic;
  color: rgb(var(--v-theme-on-surface-variant));
  padding-left: 24px;
  line-height: 1.4;
}

.booking-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.action-btn {
  min-width: auto;
  padding: 0 12px;
}

.booking-divider {
  margin: 16px 0;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.empty-title {
  margin: 16px 0 8px;
  color: rgb(var(--v-theme-on-surface));
}

.empty-subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  margin: 0 0 24px;
}

.empty-state-btn {
  border-radius: 12px;
  font-weight: 600;
  margin-top: 8px;
}

.day-view-footer {
  padding: 16px 20px;
  background: rgb(var(--v-theme-surface-variant));
}

.add-booking-btn {
  border-radius: 12px;
  font-weight: 600;
}

@keyframes pulse-urgent {
  0% { 
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0.3);
  }
  70% { 
    box-shadow: 0 0 0 8px rgba(var(--v-theme-error), 0);
  }
  100% { 
    box-shadow: 0 0 0 0 rgba(var(--v-theme-error), 0);
  }
}

/* Mobile-specific optimizations */
@media (max-width: 599px) {
  .day-view-card {
    max-height: 70vh;
  }
  
  .date-title {
    font-size: 1.125rem;
  }
  
  .booking-item {
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .property-name {
    font-size: 0.9rem;
  }
  
  .booking-actions {
    gap: 4px;
  }
  
  .action-btn {
    padding: 0 8px;
    font-size: 0.8rem;
  }
}

/* Touch feedback */
.booking-item:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.action-btn:active {
  transform: scale(0.95);
}

/* Smooth scrolling */
.bookings-container {
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
}
</style>