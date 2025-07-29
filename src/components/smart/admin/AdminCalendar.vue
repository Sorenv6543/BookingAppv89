<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="admin-calendar-container">
    <!-- Admin Calendar: Shows all bookings across all properties -->
    <FullCalendar
      ref="calendarRef"
      :bookings="props.bookings"
      :properties="props.properties"
      :loading="props.loading"
      class="admin-calendar"
      @date-select="handleDateSelect"
      @event-click="handleEventClick"
      @event-drop="handleEventDrop"
      @event-resize="handleEventResize"
      @create-booking="handleCreateBooking"
    />

    <!-- Context Menu -->
    <v-menu
      v-model="contextMenu.show"
      :position-x="contextMenu.x"
      :position-y="contextMenu.y"
      absolute
      offset-y
    >
      <v-list density="compact">
        <v-list-item
          v-for="action in contextMenuActions"
          :key="action.key"
          :prepend-icon="action.icon"
          :title="action.title"
          @click="handleContextAction(action.key)"
        />
      </v-list>
    </v-menu>

    <!-- Cleaner Assignment Modal -->
    <CleanerAssignmentModal
      v-model="cleanerAssignmentModal.show"
      :booking="cleanerAssignmentModal.booking"
      :cleaners="cleanerAssignmentModal.cleaners"
      :properties="Array.from(props.properties.values())"
      :loading="cleanerAssignmentModal.loading"
      @assign="handleCleanerAssignment"
      @close="closeCleanerAssignmentModal"
    />

    <!-- Booking Details Modal -->
    <BookingDetailsModal
      v-model="bookingDetailsModal.show"
      :booking="bookingDetailsModal.booking"
      :property="bookingDetailsModal.property"
      :cleaner="bookingDetailsModal.cleaner"
      @update="handleBookingUpdate"
      @delete="handleBookingDelete"
      @close="closeBookingDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import FullCalendar from '@/components/smart/FullCalendar.vue';
import CleanerAssignmentModal from '@/components/dumb/admin/CleanerAssignmentModal.vue';
import BookingDetailsModal from '@/components/dumb/admin/BookingDetailsModal.vue';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';
import type { Booking, Property, User, Cleaner } from '@/types';

// Props
interface Props {
  bookings?: Map<string, Booking>;
  properties?: Map<string, Property>;
  users?: Map<string, User>;
  loading?: boolean;
  previewMode?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  bookings: () => new Map<string, Booking>(),
  properties: () => new Map<string, Property>(),
  users: () => new Map<string, User>(),
  loading: false,
  previewMode: false
});

// Emits
interface Emits {
  (e: 'dateSelect', selectInfo: DateSelectArg): void;
  (e: 'eventClick', clickInfo: EventClickArg): void;
  (e: 'eventDrop', dropInfo: EventDropArg): void;
  (e: 'createBooking', data: { start: string; end: string; propertyId?: string }): void;
  (e: 'updateBooking', data: { id: string; updates: Partial<Booking> }): void;
  (e: 'assignCleaner', data: { bookingId: string; cleanerId: string; notes?: string }): void;
  (e: 'updateBookingStatus', data: { bookingId: string; status: Booking['status'] }): void;
  (e: 'viewChange', view: string): void;
  (e: 'dateChange', date: Date): void;
}

const emit = defineEmits<Emits>();

// Calendar reference
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null);

// Component state
const isMounted = ref(false);

// Context menu state
const contextMenu = ref({
  show: false,
  x: 0,
  y: 0,
  booking: null as Booking | null
});

// Cleaner assignment modal state
const cleanerAssignmentModal = ref({
  show: false,
  booking: null as Booking | null,
  cleaners: [] as Cleaner[],
  loading: false
});

// Booking details modal state
const bookingDetailsModal = ref({
  show: false,
  booking: null as Booking | null,
  property: null as Property | null,
  cleaner: null as User | null
});

// Context menu actions
const contextMenuActions = computed(() => {
  if (!contextMenu.value.booking) return [];
  
  const booking = contextMenu.value.booking;
  const actions = [
    {
      key: 'view',
      title: 'View Details',
      icon: 'mdi-eye'
    },
    {
      key: 'edit',
      title: 'Edit Booking',
      icon: 'mdi-pencil'
    }
  ];

  // Add cleaner assignment action if no cleaner assigned
  if (!booking.cleaner_id) {
    actions.push({
      key: 'assign',
      title: 'Assign Cleaner',
      icon: 'mdi-account-plus'
    });
  }

  // Add status change actions
  if (booking.status !== 'completed') {
    actions.push({
      key: 'complete',
      title: 'Mark Complete',
      icon: 'mdi-check-circle'
    });
  }

  if (booking.status !== 'cancelled') {
    actions.push({
      key: 'cancel',
      title: 'Cancel Booking',
      icon: 'mdi-close-circle'
    });
  }

  return actions;
});

// Event handlers
const handleDateSelect = (selectInfo: DateSelectArg): void => {
  emit('dateSelect', selectInfo);
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  const bookingId = clickInfo.event.id;
  const booking = props.bookings.get(bookingId);
  
  if (booking) {
    openBookingDetailsModal(booking);
  }
  
  emit('eventClick', clickInfo);
};

const handleEventDrop = (dropInfo: EventDropArg): void => {
  emit('eventDrop', dropInfo);
};

const handleEventResize = (resizeInfo: EventDropArg): void => {
  // Handle event resize if needed
  console.log('Event resized:', resizeInfo);
};

const handleCreateBooking = (data: { start: string; end: string; propertyId?: string }): void => {
  emit('createBooking', data);
};

// Context menu handlers
const handleContextAction = (action: string): void => {
  const booking = contextMenu.value.booking;
  if (!booking) return;

  switch (action) {
    case 'view':
      openBookingDetailsModal(booking);
      break;
    case 'edit':
      openBookingDetailsModal(booking);
      break;
    case 'assign':
      openCleanerAssignmentModal(booking);
      break;
    case 'complete':
      emit('updateBookingStatus', { bookingId: booking.id, status: 'completed' });
      break;
    case 'cancel':
      emit('updateBookingStatus', { bookingId: booking.id, status: 'cancelled' });
      break;
  }
  
  contextMenu.value.show = false;
};

// Modal handlers
const openBookingDetailsModal = (booking: Booking): void => {
  const property = props.properties.get(booking.property_id);
  const cleaner = booking.cleaner_id && typeof booking.cleaner_id === 'string' ? props.users.get(booking.cleaner_id) : null;
  
  bookingDetailsModal.value = {
    show: true,
    booking,
    property: property || null,
    cleaner: cleaner || null
  };
};

const closeBookingDetailsModal = (): void => {
  bookingDetailsModal.value.show = false;
  bookingDetailsModal.value.booking = null;
  bookingDetailsModal.value.property = null;
  bookingDetailsModal.value.cleaner = null;
};

const openCleanerAssignmentModal = (booking: Booking): void => {
  // Get available cleaners (users with cleaner role)
  const cleaners = Array.from(props.users.values()).filter(user => 
    user.role === 'cleaner' || user.role === 'admin'
  ) as Cleaner[];
  
  cleanerAssignmentModal.value = {
    show: true,
    booking,
    cleaners,
    loading: false
  };
};

const closeCleanerAssignmentModal = (): void => {
  cleanerAssignmentModal.value.show = false;
  cleanerAssignmentModal.value.booking = null;
  cleanerAssignmentModal.value.cleaners = [];
  cleanerAssignmentModal.value.loading = false;
};

const handleCleanerAssignment = async (cleanerId: string): Promise<void> => {
  cleanerAssignmentModal.value.loading = true;
  
  try {
    const booking = cleanerAssignmentModal.value.booking;
    if (booking) {
      emit('assignCleaner', { bookingId: booking.id, cleanerId });
    }
    closeCleanerAssignmentModal();
  } catch (error) {
    console.error('Failed to assign cleaner:', error);
  } finally {
    cleanerAssignmentModal.value.loading = false;
  }
};

const handleBookingUpdate = (data: { id: string; updates: Partial<Booking> }): void => {
  emit('updateBooking', data);
  closeBookingDetailsModal();
};

const handleBookingDelete = (bookingId: string): void => {
  // Handle booking deletion
  console.log('Delete booking:', bookingId);
  closeBookingDetailsModal();
};

// Lifecycle
onMounted(() => {
  isMounted.value = true;
  console.log('🎨 [AdminCalendar] Component mounted');
});

onBeforeUnmount(() => {
  console.log('🎨 [AdminCalendar] Component unmounting');
});
</script>

<style scoped>
.admin-calendar-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.admin-calendar {
  flex: 1;
  min-height: 600px;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .admin-calendar {
    min-height: 500px;
  }
}
</style> 