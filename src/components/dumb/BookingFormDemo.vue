<template>
  <div class="booking-form-demo">
    <h2 class="text-h5 mb-4">Booking Form Demo</h2>
    
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Create New Booking</v-card-title>
          <v-card-text>
            <p>Click the button below to open the booking form in create mode.</p>
            <v-btn
              color="primary"
              @click="openCreateModal"
              class="mt-2"
            >
              Create Booking
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>Edit Existing Booking</v-card-title>
          <v-card-text>
            <p>Click the button below to open the booking form in edit mode with sample data.</p>
            <v-btn
              color="secondary"
              @click="openEditModal"
              class="mt-2"
            >
              Edit Sample Booking
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <v-row class="mt-6">
      <v-col cols="12">
        <v-card v-if="lastAction">
          <v-card-title>Last Action</v-card-title>
          <v-card-text>
            <pre>{{ lastAction }}</pre>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Booking Form Modal -->
    <BookingForm
      :open="isModalOpen"
      :mode="modalMode"
      :booking="selectedBooking"
      @close="closeModal"
      @save="handleSave"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BookingForm from './BookingForm.vue';
import type { Booking, BookingFormData } from '@/types';

// Modal state
const isModalOpen = ref<boolean>(false);
const modalMode = ref<'create' | 'edit'>('create');
const selectedBooking = ref<Booking | null>(null);
const lastAction = ref<any>(null);

// Sample booking for edit mode
const sampleBooking: Booking = {
  id: '1234',
  property_id: '5678',
  owner_id: 'owner1',
  checkout_date: new Date().toISOString().split('T')[0],
  checkin_date: new Date().toISOString().split('T')[0],
  booking_type: 'turn',
  status: 'pending',
  guest_count: 2,
  notes: 'Sample booking for demonstration',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

// Open modal in create mode
function openCreateModal(): void {
  modalMode.value = 'create';
  selectedBooking.value = null;
  isModalOpen.value = true;
}

// Open modal in edit mode with sample data
function openEditModal(): void {
  modalMode.value = 'edit';
  selectedBooking.value = sampleBooking;
  isModalOpen.value = true;
}

// Close modal
function closeModal(): void {
  isModalOpen.value = false;
}

// Handle save event
function handleSave(data: BookingFormData): void {
  lastAction.value = {
    type: 'save',
    mode: modalMode.value,
    data
  };
  console.log('Save booking:', data);
  closeModal();
}

// Handle delete event
function handleDelete(id: string): void {
  lastAction.value = {
    type: 'delete',
    id
  };
  console.log('Delete booking:', id);
  closeModal();
}
</script>

<style scoped>
.booking-form-demo {
  padding: 1rem;
}

pre {
  background-color: rgba(0, 0, 0, 0.05);
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style> 