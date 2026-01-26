<template>
  <v-card
    v-if="visible"
    class="smart-navigation-panel"
    elevation="2"
  >
    <v-card-title class="pb-2">
      <v-icon class="mr-2">
        mdi-navigation
      </v-icon>
      Quick Navigation
      <v-spacer />
      <v-btn
        icon="mdi-close"
        variant="text"
        size="small"
        @click="$emit('close')"
      />
    </v-card-title>

    <v-card-text>
      <!-- Primary Navigation Options -->
      <div class="navigation-section mb-4">
        <span class="text-subtitle-2 mb-3 d-block">Primary:</span>
        <div class="d-flex flex-wrap ga-2">
          <v-btn
            v-for="option in primaryOptions"
            :key="option.key"
            :prepend-icon="option.icon"
            :variant="option.available ? 'elevated' : 'outlined'"
            :color="option.available ? 'primary' : 'default'"
            :disabled="!option.available"
            size="small"
            @click="handleNavigation(option.key)"
          >
            {{ option.label }}
            <v-badge
              v-if="option.count && option.count > 0"
              :content="option.count"
              color="error"
              inline
              class="ml-1"
            />
          </v-btn>
        </div>
      </div>

      <!-- Time-Based Navigation -->
      <div class="navigation-section mb-4">
        <span class="text-subtitle-2 mb-3 d-block">Time-Based:</span>
        <div class="d-flex flex-wrap ga-2">
          <v-btn
            v-for="option in timeBasedOptions"
            :key="option.key"
            :prepend-icon="option.icon"
            variant="outlined"
            size="small"
            @click="handleNavigation(option.key)"
          >
            {{ option.label }}
          </v-btn>
        </div>
      </div>

      <!-- Property Owner Navigation (Admin Only) -->
      <div 
        v-if="showOwnerNavigation && topOwners.length > 0"
        class="navigation-section mb-4"
      >
        <span class="text-subtitle-2 mb-3 d-block">Top Property Owners:</span>
        <div class="d-flex flex-wrap ga-2">
          <v-btn
            v-for="owner in topOwners"
            :key="owner.id"
            :prepend-icon="'mdi-account'"
            variant="outlined"
            size="small"
            @click="handleOwnerNavigation(owner.id)"
          >
            {{ owner.name }}
            <v-badge
              v-if="owner.upcomingBookings > 0"
              :content="owner.upcomingBookings"
              color="info"
              inline
              class="ml-1"
            />
          </v-btn>
        </div>
      </div>

      <!-- Status-Based Navigation (Admin Only) -->
      <div 
        v-if="showStatusNavigation"
        class="navigation-section"
      >
        <span class="text-subtitle-2 mb-3 d-block">By Status:</span>
        <div class="d-flex flex-wrap ga-2">
          <v-btn
            v-for="status in statusOptions"
            :key="status.key"
            :prepend-icon="status.icon"
            :color="status.color"
            variant="outlined"
            size="small"
            :disabled="status.count === 0"
            @click="handleStatusNavigation(status.key)"
          >
            {{ status.label }}
            <v-badge
              v-if="status.count > 0"
              :content="status.count"
              :color="status.color"
              inline
              class="ml-1"
            />
          </v-btn>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useBookingStore } from '@/stores/booking';
import type { User } from '@/types';
import { safeDepartureDate } from '@/utils/typeHelpers';

interface Props {
  visible: boolean;
  smartNavigationCounts: {
    nextTurn: number;
    nextUrgent: number;
    busiest: number;
  };
  users?: Map<string, User>;
  showOwnerNavigation?: boolean;
  showStatusNavigation?: boolean;
}

interface Emits {
  (e: 'navigate', option: string): void;
  (e: 'navigateToOwner', ownerId: string): void;
  (e: 'navigateToStatus', status: string): void;
  (e: 'close'): void;
}

const props = withDefaults(defineProps<Props>(), {
  users: () => new Map<string, User>(),
  showOwnerNavigation: false,
  showStatusNavigation: false
});

const emit = defineEmits<Emits>();

// Stores
const bookingStore = useBookingStore();

// Primary navigation options
const primaryOptions = computed(() => [
  {
    key: 'today',
    label: 'Today',
    icon: 'mdi-calendar-today',
    available: true,
    count: 0
  },
  {
    key: 'nextTurn',
    label: 'Next Turn',
    icon: 'mdi-fire',
    available: props.smartNavigationCounts.nextTurn > 0,
    count: props.smartNavigationCounts.nextTurn
  },
  {
    key: 'nextUrgent',
    label: 'Next Urgent',
    icon: 'mdi-alert',
    available: props.smartNavigationCounts.nextUrgent > 0,
    count: props.smartNavigationCounts.nextUrgent
  },
  {
    key: 'busiest',
    label: 'Busiest Day',
    icon: 'mdi-calendar-clock',
    available: props.smartNavigationCounts.busiest > 0,
    count: props.smartNavigationCounts.busiest
  }
]);

// Time-based navigation options
const timeBasedOptions = [
  {
    key: 'thisWeek',
    label: 'This Week',
    icon: 'mdi-calendar-week'
  },
  {
    key: 'nextWeek',
    label: 'Next Week',
    icon: 'mdi-calendar-arrow-right'
  },
  {
    key: 'thisMonth',
    label: 'This Month',
    icon: 'mdi-calendar-month'
  },
  {
    key: 'nextMonth',
    label: 'Next Month',
    icon: 'mdi-calendar-plus'
  }
];

// Top property owners with upcoming bookings
const topOwners = computed(() => {
  if (!props.showOwnerNavigation) return [];

  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  // Count upcoming bookings per owner
  const ownerBookingCounts = new Map<string, number>();
  
  Array.from(bookingStore.bookings.values())
    .filter(booking => {
      const checkoutDate = safeDepartureDate(booking);
      return checkoutDate >= now && 
             checkoutDate <= nextMonth &&
             booking.status !== 'completed' &&
             booking.status !== 'cancelled';
    })
    .forEach(booking => {
      const count = ownerBookingCounts.get(booking.owner_id) || 0;
      ownerBookingCounts.set(booking.owner_id, count + 1);
    });

  // Get top 5 owners by booking count
  return Array.from(ownerBookingCounts.entries())
    .map(([ownerId, bookingCount]) => {
      const user = props.users.get(ownerId);
      return {
        id: ownerId,
        name: user?.name || 'Unknown Owner',
        upcomingBookings: bookingCount
      };
    })
    .sort((a, b) => b.upcomingBookings - a.upcomingBookings)
    .slice(0, 5);
});

// Status-based navigation options
const statusOptions = computed(() => {
  if (!props.showStatusNavigation) return [];

  const now = new Date();
  const statusCounts = {
    pending: 0,
    scheduled: 0,
    in_progress: 0,
    unassigned: 0
  };

  Array.from(bookingStore.bookings.values())
    .filter(booking => {
      const checkoutDate = safeDepartureDate(booking);
      return checkoutDate >= now;
    })
    .forEach(booking => {
      if (booking.status === 'pending') statusCounts.pending++;
      if (booking.status === 'scheduled') statusCounts.scheduled++;
      if (booking.status === 'in_progress') statusCounts.in_progress++;
      if (!booking.assigned_cleaner_id) statusCounts.unassigned++;
    });

  return [
    {
      key: 'pending',
      label: 'Pending',
      icon: 'mdi-clock-outline',
      color: 'warning',
      count: statusCounts.pending
    },
    {
      key: 'scheduled',
      label: 'Scheduled',
      icon: 'mdi-calendar-check',
      color: 'info',
      count: statusCounts.scheduled
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      icon: 'mdi-play',
      color: 'primary',
      count: statusCounts.in_progress
    },
    {
      key: 'unassigned',
      label: 'Unassigned',
      icon: 'mdi-account-off',
      color: 'error',
      count: statusCounts.unassigned
    }
  ];
});

// Event handlers
const handleNavigation = (option: string): void => {
  emit('navigate', option);
};

const handleOwnerNavigation = (ownerId: string): void => {
  emit('navigateToOwner', ownerId);
};

const handleStatusNavigation = (status: string): void => {
  emit('navigateToStatus', status);
};
</script>

<style scoped>
.smart-navigation-panel {
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
}

.navigation-section {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(var(--v-theme-outline), 0.08);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

.navigation-section:hover {
  background: rgba(var(--v-theme-surface-variant), 0.4);
  transform: translateY(-1px);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.navigation-section .v-btn {
  margin: 2px;
  transition: all 0.2s ease;
}

.navigation-section .v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.v-badge {
  font-size: 0.75rem;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .smart-navigation-panel {
    margin: 8px;
    max-width: calc(100vw - 16px);
  }

  .navigation-section .v-btn {
    font-size: 0.75rem;
    padding: 4px 8px;
    margin: 1px;
  }

  .text-subtitle-2 {
    font-size: 0.875rem;
  }
}
</style>
