<template>
  <div class="owner-calendar-page">
    <!-- App Bar -->
    <div class="calendar-app-bar">
      <div class="app-bar-brand">
        <div class="brand-icon">C</div>
        <span class="brand-text">Claro</span>
      </div>
      <v-btn
        icon
        variant="text"
        size="small"
        color="white"
        @click="handleQuickBooking"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>

    <!-- Calendar with toolbar -->
    <div class="calendar-content">
      <OwnerCalendar
        ref="ownerCalendarRef"
        :bookings="ownerBookingsMap"
        :properties="ownerPropertiesMap"
        :loading="loading"
        @date-select="handleDateSelect"
        @event-click="handleEventClick"
        @event-drop="handleEventDrop"
        @event-resize="handleEventResize"
        @create-booking="handleCreateBooking"
        @update-booking="handleUpdateBooking"
        @delete-booking="handleDeleteBooking"
      />
    </div>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialogVisible" max-width="400" persistent>
      <v-card>
        <v-card-title class="text-h6">Delete Booking</v-card-title>
        <v-card-text>Are you sure you want to delete this booking? This action cannot be undone.</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialogVisible = false">Cancel</v-btn>
          <v-btn color="error" variant="elevated" @click="confirmDelete">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import OwnerCalendar from '@/components/smart/owner/OwnerCalendar.vue';
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
import { useUIStore } from '@/stores/ui';
import type { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/core';

// Meta information for this page
defineOptions({
  name: 'OwnerCalendarPage'
});

// Composables
const {
  myBookings: ownerBookings,
  fetchMyBookings,
  updateMyBooking,
  deleteMyBooking
} = useOwnerBookings();

const {
  myProperties: ownerProperties,
  fetchMyProperties
} = useOwnerProperties();

// Stores
const uiStore = useUIStore();

// Refs
const ownerCalendarRef = ref<InstanceType<typeof OwnerCalendar> | null>(null);

// Computed
const loading = computed(() => {
  return false;
});

// Convert arrays to Maps for component compatibility
const ownerBookingsMap = computed(() => {
  const map = new Map<string, any>();
  ownerBookings.value.forEach(booking => {
    map.set(booking.id, booking);
  });
  return map;
});

const ownerPropertiesMap = computed(() => {
  const map = new Map<string, any>();
  ownerProperties.value.forEach(property => {
    map.set(property.id, property);
  });
  return map;
});

// Event handlers
// Helper: FullCalendar end dates are exclusive, subtract 1 day to get actual checkout
const subtractOneDay = (dateStr: string): string => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  uiStore.openModal('eventModal', 'create', {
    checkin_date: selectInfo.startStr,
    checkout_date: subtractOneDay(selectInfo.endStr)
  });
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  const booking = clickInfo.event.extendedProps.booking;
  if (booking) {
    uiStore.openModal('eventModal', 'edit', booking);
  }
};

const handleEventDrop = async (dropInfo: EventDropArg): Promise<void> => {
  const booking = dropInfo.event.extendedProps.booking;
  if (booking) {
    try {
      const endStr = dropInfo.event.endStr || dropInfo.event.startStr;
      await updateMyBooking(booking.id, {
        checkin_date: dropInfo.event.startStr,
        checkout_date: subtractOneDay(endStr)
      });
      uiStore.showNotification('Booking updated successfully', 'success');
    } catch {
      uiStore.showNotification('Failed to update booking', 'error');
      dropInfo.revert();
    }
  }
};

const handleCreateBooking = (): void => {
  uiStore.openModal('eventModal', 'create');
};

const handleEventResize = async (resizeInfo: EventDropArg): Promise<void> => {
  const booking = resizeInfo.event.extendedProps.booking;
  if (booking) {
    try {
      const endStr = resizeInfo.event.endStr || resizeInfo.event.startStr;
      await updateMyBooking(booking.id, {
        checkin_date: resizeInfo.event.startStr,
        checkout_date: subtractOneDay(endStr)
      });
      uiStore.showNotification('Booking updated successfully', 'success');
    } catch {
      uiStore.showNotification('Failed to update booking', 'error');
      resizeInfo.revert();
    }
  }
};

const handleUpdateBooking = async (data: { id: string; start: string; end: string }): Promise<void> => {
  try {
    await updateMyBooking(data.id, {
      checkin_date: data.start,
      checkout_date: subtractOneDay(data.end)
    });
    uiStore.showNotification('Booking updated successfully', 'success');
  } catch {
    uiStore.showNotification('Failed to update booking', 'error');
  }
};

const handleQuickBooking = (): void => {
  uiStore.openModal('eventModal', 'create');
};

// Delete booking state
const deleteDialogVisible = ref(false);
const pendingDeleteId = ref<string | null>(null);

const handleDeleteBooking = (bookingId: string): void => {
  pendingDeleteId.value = bookingId;
  deleteDialogVisible.value = true;
};

const confirmDelete = async (): Promise<void> => {
  if (pendingDeleteId.value) {
    try {
      await deleteMyBooking(pendingDeleteId.value);
      uiStore.showNotification('Booking deleted successfully', 'success');
    } catch {
      uiStore.showNotification('Failed to delete booking', 'error');
    }
  }
  deleteDialogVisible.value = false;
  pendingDeleteId.value = null;
};

// Initialize data
onMounted(async () => {
  await Promise.all([
    fetchMyBookings(),
    fetchMyProperties()
  ]);
});
</script>

<style scoped>
.owner-calendar-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FFFFFF;
  font-family: 'Inter', sans-serif;
}

/* Terminal Swiss App Bar */
.calendar-app-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  background: #000000;
  color: #FFFFFF;
}

.app-bar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  width: 28px;
  height: 28px;
  background: #E53935;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  font-size: 14px;
}

.brand-text {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  font-size: 18px;
  color: #FFFFFF;
}

.calendar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
