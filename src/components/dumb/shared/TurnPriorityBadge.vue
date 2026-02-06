<template>
  <v-chip
    :class="[
      'priority-badge',
      `priority-${priority}`,
      {
        'priority-badge--animated': animated,
        'priority-badge--clickable': clickable,
        'priority-badge--closable': closable,
        'owner-interface': userRole === 'owner',
        'admin-interface': userRole === 'admin'
      }
    ]"
    :color="getBadgeColor()"
    :variant="variant"
    :size="size"
    :closable="closable"
    :label="label"
    @click="handleClick"
    @click:close="handleClose"
  >
    <template
      v-if="showIcon"
      #prepend
    >
      <v-icon
        :icon="getPriorityIcon()"
        :size="getIconSize()"
        class="mr-1"
      />
    </template>

    <span class="priority-text">
      {{ getPriorityText() }}
    </span>

    <template
      v-if="showTimeRemaining && timeRemaining"
      #append
    >
      <v-chip
        size="x-small"
        :color="getTimeColor()"
        class="ml-1 time-chip"
        label
      >
        {{ formatTimeRemaining() }}
      </v-chip>
    </template>
  </v-chip>
</template>

<script setup lang="ts">
type BookingPriority = 'low' | 'normal' | 'high' | 'urgent';

interface Props {
  priority: BookingPriority;
  userRole?: 'owner' | 'admin' | 'cleaner';
  animated?: boolean;
  clickable?: boolean;
  closable?: boolean;
  label?: boolean;
  showIcon?: boolean;
  showTimeRemaining?: boolean;
  timeRemaining?: number; // minutes
  size?: 'x-small' | 'small' | 'default' | 'large' | 'x-large';
  variant?: 'flat' | 'tonal' | 'outlined' | 'text' | 'elevated';
}

interface Emits {
  (e: 'click'): void;
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  userRole: 'owner',
  animated: true,
  clickable: false,
  closable: false,
  label: true,
  showIcon: true,
  showTimeRemaining: false,
  timeRemaining: undefined,
  size: 'small',
  variant: 'flat'
});

const emit = defineEmits<Emits>();

// Get role-based colors
const getBadgeColor = (): string => {
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
      return 'primary';
  }
};

// Get priority icons
const getPriorityIcon = (): string => {
  switch (props.priority) {
    case 'urgent':
      return 'mdi-alert-circle';
    case 'high':
      return 'mdi-clock-fast';
    case 'normal':
      return 'mdi-clock-outline';
    case 'low':
      return 'mdi-clock-check-outline';
    default:
      return 'mdi-information-outline';
  }
};

// Get icon size based on chip size
const getIconSize = (): string => {
  switch (props.size) {
    case 'x-small':
      return 'x-small';
    case 'small':
      return 'small';
    case 'large':
      return 'default';
    case 'x-large':
      return 'large';
    default:
      return 'small';
  }
};

// Get role-based priority text
const getPriorityText = (): string => {
  const isOwner = props.userRole === 'owner';
  
  switch (props.priority) {
    case 'urgent':
      return isOwner ? 'Needs Attention' : 'URGENT';
    case 'high':
      return isOwner ? 'High Priority' : 'HIGH';
    case 'normal':
      return isOwner ? 'Normal' : 'NORMAL';
    case 'low':
      return isOwner ? 'Low Priority' : 'LOW';
    default:
      return 'Standard';
  }
};

// Get time remaining color
const getTimeColor = (): string => {
  if (!props.timeRemaining) return 'grey';
  
  if (props.timeRemaining <= 30) {
    return 'error';
  } else if (props.timeRemaining <= 60) {
    return 'warning';
  } else {
    return 'success';
  }
};

// Format time remaining
const formatTimeRemaining = (): string => {
  if (!props.timeRemaining) return '';
  
  const hours = Math.floor(props.timeRemaining / 60);
  const minutes = props.timeRemaining % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

// Event handlers
const handleClick = (): void => {
  if (props.clickable) {
    emit('click');
  }
};

const handleClose = (): void => {
  if (props.closable) {
    emit('close');
  }
};
</script>

<style scoped>
.priority-badge {
  transition: all 0.3s ease;
}

.priority-badge--animated.priority-urgent {
  animation: urgentPulse 2s ease-in-out infinite;
}

.priority-badge--clickable {
  cursor: pointer;
}

.priority-badge--clickable:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
}

.priority-text {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.time-chip {
  font-size: 0.65rem;
  font-weight: 700;
}

/* Role-based styling */
.owner-interface .priority-urgent {
  animation: none;
}

.owner-interface .priority-urgent:hover {
  animation: urgentGlow 1s ease-in-out infinite alternate;
}

.admin-interface .priority-urgent {
  animation: urgentPulse 1.5s ease-in-out infinite;
}

.admin-interface .priority-urgent:hover {
  animation: urgentGlow 1s ease-in-out infinite alternate, shake 0.5s ease-in-out;
}
</style> 