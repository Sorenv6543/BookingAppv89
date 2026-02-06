<template>
  <v-alert
    :color="getAlertColor()"
    :icon="getAlertIcon()"
    :variant="variant"
    :closable="closable"
    :class="[
      'urgent-turn-indicator',
      `role-${userRole}`,
      {
        'urgent-turn-indicator--animated': animated,
        'urgent-turn-indicator--striped': striped
      }
    ]"
    @click:close="emit('close')"
  >
    <template #title>
      <div class="d-flex align-center">
        <span class="alert-title">{{ getAlertTitle() }}</span>
        <v-spacer />
        <TurnPriorityBadge 
          v-if="showPriorityBadge"
          :priority="priority"
          :user-role="userRole"
          :animated="animated"
          size="small"
        />
      </div>
    </template>

    <div class="alert-content">
      <!-- Main Message -->
      <div class="main-message mb-3">
        {{ getMainMessage() }}
      </div>

      <!-- Booking Details -->
      <div
        v-if="showDetails"
        class="booking-details"
      >
        <v-row dense>
          <v-col
            cols="12"
            md="6"
          >
            <div class="detail-item">
              <v-icon
                icon="mdi-home"
                size="small"
                class="mr-2"
              />
              <strong>Property:</strong> {{ propertyName || 'Unknown Property' }}
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <div class="detail-item">
              <v-icon
                icon="mdi-timer-outline"
                size="small"
                class="mr-2"
              />
              <strong>Time Remaining:</strong> 
              <span :class="getTimeRemainingClass()">{{ formatTimeRemaining() }}</span>
            </div>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col
            cols="12"
            md="6"
          >
            <div class="detail-item">
              <v-icon
                icon="mdi-logout"
                size="small"
                class="mr-2"
              />
              <strong>Checkout:</strong> {{ formatDateTime(checkoutDate) }}
            </div>
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <div class="detail-item">
              <v-icon
                icon="mdi-login"
                size="small"
                class="mr-2"
              />
              <strong>Check-in:</strong> {{ formatDateTime(checkinDate) }}
            </div>
          </v-col>
        </v-row>

        <div
          v-if="cleaningWindow"
          class="cleaning-window mt-2"
        >
          <v-icon
            icon="mdi-clock-fast"
            size="small"
            class="mr-2"
          />
          <strong>Cleaning Window:</strong> 
          {{ cleaningWindow.duration }} minutes 
          ({{ formatTime(cleaningWindow.start) }} - {{ formatTime(cleaningWindow.end) }})
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        v-if="showActions"
        class="action-buttons mt-3"
      >
        <v-btn
          :color="getActionColor()"
          size="small"
          variant="flat"
          prepend-icon="mdi-eye"
          class="mr-2"
          @click="emit('view')"
        >
          View Details
        </v-btn>
        <v-btn
          v-if="userRole === 'admin'"
          color="success"
          size="small"
          variant="flat"
          prepend-icon="mdi-account-check"
          class="mr-2"
          @click="emit('assign')"
        >
          Assign Cleaner
        </v-btn>
        <v-btn
          color="primary"
          size="small"
          variant="outlined"
          prepend-icon="mdi-calendar-edit"
          @click="emit('reschedule')"
        >
          {{ userRole === 'admin' ? 'Manage' : 'Reschedule' }}
        </v-btn>
      </div>

      <!-- Real-time countdown -->
      <div
        v-if="showCountdown && timeRemaining !== undefined"
        class="countdown-timer mt-2"
      >
        <v-progress-linear
          :model-value="getProgressValue()"
          :color="getProgressColor()"
          height="6"
          striped
          class="mb-1"
        />
        <div class="countdown-text">
          <v-icon
            icon="mdi-timer-sand"
            size="x-small"
            class="mr-1"
          />
          <span class="text-caption">{{ getCountdownText() }}</span>
        </div>
      </div>
    </div>
  </v-alert>
</template>

<script setup lang="ts">

import TurnPriorityBadge from './TurnPriorityBadge.vue';

type BookingPriority = 'low' | 'normal' | 'high' | 'urgent';

interface CleaningWindow {
  start: string;
  end: string;
  duration: number; // minutes
}

interface Props {
  priority: BookingPriority;
  userRole?: 'owner' | 'admin' | 'cleaner';
  propertyName?: string;
  checkoutDate: string;
  checkinDate: string;
  cleaningWindow?: CleaningWindow;
  timeRemaining?: number; // minutes until checkout
  animated?: boolean;
  striped?: boolean;
  closable?: boolean;
  showDetails?: boolean;
  showActions?: boolean;
  showPriorityBadge?: boolean;
  showCountdown?: boolean;
  variant?: 'flat' | 'tonal' | 'outlined' | 'text';
}

interface Emits {
  (e: 'close'): void;
  (e: 'view'): void;
  (e: 'assign'): void;
  (e: 'reschedule'): void;
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'owner',
  propertyName: undefined,
  cleaningWindow: undefined,
  timeRemaining: undefined,
  animated: true,
  striped: true,
  closable: true,
  showDetails: true,
  showActions: true,
  showPriorityBadge: true,
  showCountdown: true,
  variant: 'tonal'
});

const emit = defineEmits<Emits>();

// Get role-based alert styling
const getAlertColor = (): string => {
  const isOwner = props.userRole === 'owner';
  
  switch (props.priority) {
    case 'urgent':
      return isOwner ? 'warning' : 'error';
    case 'high':
      return 'warning';
    case 'normal':
      return 'primary';
    case 'low':
      return 'info';
    default:
      return 'warning';
  }
};

const getAlertIcon = (): string => {
  switch (props.priority) {
    case 'urgent':
      return 'mdi-alert-circle';
    case 'high':
      return 'mdi-clock-alert';
    case 'normal':
      return 'mdi-information';
    case 'low':
      return 'mdi-information-outline';
    default:
      return 'mdi-alert';
  }
};

// Role-based messaging
const getAlertTitle = (): string => {
  const isOwner = props.userRole === 'owner';
  
  switch (props.priority) {
    case 'urgent':
      return isOwner ? 'Urgent Cleaning Required' : 'CRITICAL TURN BOOKING';
    case 'high':
      return isOwner ? 'High Priority Cleaning' : 'HIGH PRIORITY TURN';
    case 'normal':
      return isOwner ? 'Scheduled Cleaning' : 'SCHEDULED TURN';
    case 'low':
      return isOwner ? 'Upcoming Cleaning' : 'LOW PRIORITY TURN';
    default:
      return 'Turn Booking Alert';
  }
};

const getMainMessage = (): string => {
  const isOwner = props.userRole === 'owner';
  const isUrgent = props.priority === 'urgent';
  
  if (isOwner) {
    if (isUrgent) {
      return 'Your property needs immediate attention for the upcoming guest check-in. Please ensure cleaning is scheduled as soon as possible.';
    } else {
      return 'A cleaning has been scheduled for your property to prepare for the next guest arrival.';
    }
  } else {
    if (isUrgent) {
      return 'IMMEDIATE ACTION REQUIRED: Critical turn booking with minimal cleaning time. Assign cleaner immediately to prevent guest impact.';
    } else {
      return 'Turn booking requires attention. Review cleaning assignment and timeline to ensure timely completion.';
    }
  }
};

// Styling helpers
const getActionColor = (): string => {
  return props.priority === 'urgent' ? getAlertColor() : 'primary';
};

const getTimeRemainingClass = (): string => {
  if (props.timeRemaining === undefined) return '';
  
  if (props.timeRemaining <= 30) {
    return 'text-error font-weight-bold';
  } else if (props.timeRemaining <= 60) {
    return 'text-warning font-weight-medium';
  } else {
    return 'text-success';
  }
};

const getProgressColor = (): string => {
  if (props.timeRemaining === undefined) return 'primary';
  
  if (props.timeRemaining <= 30) {
    return 'error';
  } else if (props.timeRemaining <= 60) {
    return 'warning';
  } else {
    return 'success';
  }
};

const getProgressValue = (): number => {
  if (props.timeRemaining === undefined || !props.cleaningWindow) return 0;
  
  const totalTime = props.cleaningWindow.duration;
  const remaining = props.timeRemaining;
  
  return Math.max(0, Math.min(100, ((totalTime - remaining) / totalTime) * 100));
};

// Time formatting functions
const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString([], { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatTimeRemaining = (): string => {
  if (props.timeRemaining === undefined) return 'Unknown';
  
  const hours = Math.floor(props.timeRemaining / 60);
  const minutes = props.timeRemaining % 60;
  
  if (props.timeRemaining <= 0) {
    return 'Overdue!';
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

const getCountdownText = (): string => {
  if (props.timeRemaining === undefined) return '';
  
  if (props.timeRemaining <= 0) {
    return 'OVERDUE - Immediate action required';
  } else if (props.timeRemaining <= 30) {
    return 'CRITICAL - Less than 30 minutes remaining';
  } else if (props.timeRemaining <= 60) {
    return 'URGENT - Less than 1 hour remaining';
  } else {
    return `${formatTimeRemaining()} until checkout`;
  }
};
</script>

<style scoped>
.urgent-turn-indicator {
  position: relative;
  overflow: hidden;
}

.urgent-turn-indicator--animated.role-admin .v-alert__content {
  animation: urgentPulse 2s ease-in-out infinite;
}

.urgent-turn-indicator--striped::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent 25%,
    rgba(255, 255, 255, 0.1) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 50%,
    transparent 75%,
    rgba(255, 255, 255, 0.1) 75%
  );
  background-size: 20px 20px;
  animation: urgentStripes 2s linear infinite;
  pointer-events: none;
}

.alert-title {
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}

.main-message {
  font-size: 0.95rem;
  line-height: 1.5;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.cleaning-window {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  padding: 8px;
  background: rgba(var(--v-theme-surface), 0.5);
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.countdown-timer {
  background: rgba(var(--v-theme-surface), 0.3);
  padding: 8px;
  border-radius: 4px;
  border-left: 3px solid currentColor;
}

.countdown-text {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Role-specific styling */
.role-owner .urgent-turn-indicator--animated {
  animation: none;
}

.role-owner .urgent-turn-indicator--animated:hover::before {
  animation: urgentStripes 1s linear infinite;
}

.role-admin .urgent-turn-indicator--animated {
  animation: urgentGlow 3s ease-in-out infinite alternate;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .alert-title {
    font-size: 1rem;
  }
  
  .main-message {
    font-size: 0.9rem;
  }
  
  .detail-item {
    font-size: 0.85rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .action-buttons .v-btn {
    width: 100%;
  }
}
</style> 