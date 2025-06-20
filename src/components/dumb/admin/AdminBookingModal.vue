<template>
  <v-dialog
    v-model="isOpen"
    max-width="900px"
    persistent
    @keydown.esc="handleClose"
  >
    <v-card>
      <v-card-title class="text-h5 pb-2 d-flex align-center">
        <div class="d-flex align-center">
          {{ formTitle }}
          <v-chip
            v-if="booking?.booking_type === 'turn'"
            color="error"
            size="small"
            class="ml-2"
          >
            URGENT TURN
          </v-chip>
          <v-chip
            v-if="booking?.status"
            :color="getStatusColor(booking.status)"
            size="small"
            class="ml-2"
          >
            {{ booking.status.toUpperCase() }}
          </v-chip>
        </div>
        <v-spacer />
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="handleClose"
        />
      </v-card-title>
      
      <v-divider />
      
      <v-card-text class="pa-0">
        <v-container>
          <!-- Admin Action Tabs -->
          <v-tabs
            v-model="activeTab"
            bg-color="transparent"
            class="mb-4"
          >
            <v-tab value="details">
              <v-icon start>mdi-pencil</v-icon>
              Edit Details
            </v-tab>
            <v-tab value="cleaner" :disabled="!booking">
              <v-icon start>mdi-account-hard-hat</v-icon>
              Assign Cleaner
            </v-tab>
            <v-tab value="status" :disabled="!booking">
              <v-icon start>mdi-check-circle</v-icon>
              Update Status
            </v-tab>
            <v-tab value="history" :disabled="!booking">
              <v-icon start>mdi-history</v-icon>
              View History
            </v-tab>
            <v-tab value="reports" :disabled="!booking">
              <v-icon start>mdi-chart-line</v-icon>
              Generate Report
            </v-tab>
          </v-tabs>

          <v-tabs-window v-model="activeTab">
            <!-- Edit Details Tab -->
            <v-tabs-window-item value="details">
              <AdminBookingForm
                v-model="showBookingForm"
                :mode="mode === 'create' ? 'create' : 'edit'"
                :booking="booking"
                :properties="allProperties"
                :cleaners="allCleaners"
                :loading="loading"
                @submit="handleBookingSubmit"
                @delete="handleBookingDelete"
                @assign-cleaner="handleCleanerAssign"
                @mark-complete="handleMarkComplete"
              />
            </v-tabs-window-item>

            <!-- Cleaner Assignment Tab -->
            <v-tabs-window-item value="cleaner">
              <CleanerAssignmentPanel
                v-if="booking"
                :booking="booking"
                :cleaners="allCleaners"
                :loading="loading"
                @assign="handleCleanerAssign"
                @unassign="handleCleanerUnassign"
              />
            </v-tabs-window-item>

            <!-- Status Management Tab -->
            <v-tabs-window-item value="status">
              <StatusManagementPanel
                v-if="booking"
                :booking="booking"
                :loading="loading"
                @status-change="handleStatusChange"
                @add-note="handleAddNote"
              />
            </v-tabs-window-item>

            <!-- History Tab -->
            <v-tabs-window-item value="history">
              <BookingHistoryPanel
                v-if="booking"
                :booking="booking"
              />
            </v-tabs-window-item>

            <!-- Reports Tab -->
            <v-tabs-window-item value="reports">
              <BookingReportsPanel
                v-if="booking"
                :booking="booking"
                @generate-report="handleGenerateReport"
              />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-container>
      </v-card-text>
      
      <v-divider />
      
      <v-card-actions class="pa-4">
        <v-btn
          color="grey-darken-1"
          variant="text"
          :disabled="loading"
          @click="handleClose"
        >
          Close
        </v-btn>
        
        <v-spacer />
        
        <!-- Quick Actions -->
        <v-btn
          v-if="booking && booking.status === 'pending'"
          color="primary"
          variant="tonal"
          :loading="loading"
          @click="handleQuickSchedule"
        >
          <v-icon start>mdi-calendar-check</v-icon>
          Quick Schedule
        </v-btn>
        
        <v-btn
          v-if="booking && booking.booking_type === 'turn'"
          color="error"
          variant="tonal"
          :loading="loading"
          @click="handleUrgentAssign"
        >
          <v-icon start>mdi-alert</v-icon>
          Urgent Assign
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAdminBookings } from '@/composables/admin/useAdminBookings';
import { useAdminProperties } from '@/composables/admin/useAdminProperties';
import { useCleanerManagement } from '@/composables/admin/useCleanerManagement';
import { useUIStore } from '@/stores/ui';
import AdminBookingForm from '@/components/dumb/admin/AdminBookingForm.vue';
import CleanerAssignmentPanel from '@/components/dumb/admin/CleanerAssignmentPanel.vue';
import StatusManagementPanel from '@/components/dumb/admin/StatusManagementPanel.vue';
import BookingHistoryPanel from '@/components/dumb/admin/BookingHistoryPanel.vue';
import BookingReportsPanel from '@/components/dumb/admin/BookingReportsPanel.vue';
import type { Booking, BookingFormData, BookingStatus } from '@/types';

// PROPS & EMITS
interface Props {
  open?: boolean;
  mode?: 'create' | 'admin-edit' | 'edit' | 'view';
  booking?: Booking | null;
  availableActions?: string[];
}

interface Emits {
  (e: 'close'): void;
  (e: 'booking-updated', booking: Booking): void;
  (e: 'booking-deleted', bookingId: string): void;
  (e: 'cleaner-assigned', data: { bookingId: string; cleanerId: string }): void;
  (e: 'status-changed', data: { bookingId: string; status: BookingStatus }): void;
}

const props = withDefaults(defineProps<Props>(), {
  open: false,
  mode: 'admin-edit',
  booking: null,
  availableActions: () => ['edit-details', 'assign-cleaner', 'update-status', 'view-history']
});

const emit = defineEmits<Emits>();

// COMPOSABLES
const uiStore = useUIStore();
const { allBookings, updateBooking, deleteBooking } = useAdminBookings();
const { allProperties } = useAdminProperties();
const { allCleaners, assignCleanerToBooking, unassignCleaner } = useCleanerManagement();

// STATE
const loading = ref<boolean>(false);
const activeTab = ref<string>('details');
const showBookingForm = ref<boolean>(true);

// COMPUTED
const isOpen = computed({
  get: () => props.open,
  set: (value: boolean) => {
    if (!value) emit('close');
  }
});

const formTitle = computed((): string => {
  if (props.mode === 'create') {
    return 'Create New Booking';
  }
  if (props.mode === 'admin-edit') {
    return `Admin Edit: Booking #${props.booking?.id?.slice(-6) || 'New'}`;
  }
  return 'Edit Booking';
});

// STATUS HELPER
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

// EVENT HANDLERS
async function handleBookingSubmit(bookingData: BookingFormData): Promise<void> {
  loading.value = true;
  
  try {
    if (props.mode === 'create') {
      // Handle new booking creation
      // This would typically call a create function
      console.log('Creating new booking:', bookingData);
    } else if (props.booking) {
      // Update existing booking
      const updated = await updateBooking(props.booking.id, bookingData);
      if (updated) {
        emit('booking-updated', updated);
        uiStore.addNotification('success', 'Booking Updated', 'Booking has been successfully updated.');
      }
    }
  } catch (error) {
    console.error('Error saving booking:', error);
    uiStore.addNotification('error', 'Save Failed', 'Failed to save booking changes.');
  } finally {
    loading.value = false;
  }
}

async function handleBookingDelete(): Promise<void> {
  if (!props.booking) return;
  
  loading.value = true;
  
  try {
    const success = await deleteBooking(props.booking.id);
    if (success) {
      emit('booking-deleted', props.booking.id);
      uiStore.addNotification('success', 'Booking Deleted', 'Booking has been successfully deleted.');
      handleClose();
    }
  } catch (error) {
    console.error('Error deleting booking:', error);
    uiStore.addNotification('error', 'Delete Failed', 'Failed to delete booking.');
  } finally {
    loading.value = false;
  }
}

async function handleCleanerAssign(data: { bookingId: string; cleanerId: string }): Promise<void> {
  loading.value = true;
  
  try {
    const success = await assignCleanerToBooking(data.cleanerId, data.bookingId);
    if (success) {
      emit('cleaner-assigned', data);
      uiStore.addNotification('success', 'Cleaner Assigned', 'Cleaner has been successfully assigned.');
    }
  } catch (error) {
    console.error('Error assigning cleaner:', error);
    uiStore.addNotification('error', 'Assignment Failed', 'Failed to assign cleaner.');
  } finally {
    loading.value = false;
  }
}

async function handleCleanerUnassign(bookingId: string): Promise<void> {
  loading.value = true;
  
  try {
    const success = await unassignCleaner(bookingId);
    if (success) {
      uiStore.addNotification('success', 'Cleaner Unassigned', 'Cleaner has been unassigned from booking.');
    }
  } catch (error) {
    console.error('Error unassigning cleaner:', error);
    uiStore.addNotification('error', 'Unassign Failed', 'Failed to unassign cleaner.');
  } finally {
    loading.value = false;
  }
}

async function handleStatusChange(data: { bookingId: string; status: BookingStatus }): Promise<void> {
  loading.value = true;
  
  try {
    // This would call a status update function
    emit('status-changed', data);
    uiStore.addNotification('success', 'Status Updated', `Booking status changed to ${data.status}.`);
  } catch (error) {
    console.error('Error updating status:', error);
    uiStore.addNotification('error', 'Status Update Failed', 'Failed to update booking status.');
  } finally {
    loading.value = false;
  }
}

function handleAddNote(note: string): void {
  console.log('Adding note:', note);
  uiStore.addNotification('info', 'Note Added', 'Note has been added to booking.');
}

function handleMarkComplete(): void {
  if (props.booking) {
    handleStatusChange({ bookingId: props.booking.id, status: 'completed' });
  }
}

function handleGenerateReport(reportType: string): void {
  console.log('Generating report:', reportType);
  uiStore.addNotification('info', 'Report Generated', `${reportType} report has been generated.`);
}

// QUICK ACTIONS
async function handleQuickSchedule(): Promise<void> {
  if (props.booking) {
    await handleStatusChange({ bookingId: props.booking.id, status: 'scheduled' });
  }
}

async function handleUrgentAssign(): Promise<void> {
  if (props.booking) {
    // This would open a quick cleaner selection or auto-assign logic
    uiStore.addNotification('info', 'Urgent Assignment', 'Initiating urgent cleaner assignment...');
  }
}

function handleClose(): void {
  activeTab.value = 'details';
  emit('close');
}

// WATCHERS
watch(() => props.open, (newValue) => {
  if (newValue) {
    activeTab.value = 'details';
    showBookingForm.value = true;
  }
});

watch(() => props.availableActions, (newActions) => {
  if (newActions && newActions.length > 0) {
    // Set default tab based on available actions
    if (newActions.includes('edit-details')) {
      activeTab.value = 'details';
    } else if (newActions.includes('assign-cleaner')) {
      activeTab.value = 'cleaner';
    } else if (newActions.includes('update-status')) {
      activeTab.value = 'status';
    }
  }
});
</script>

<style scoped>
.v-tabs {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-tab {
  min-width: 140px;
}

.v-card-actions {
  background-color: rgb(var(--v-theme-surface));
}
</style> 