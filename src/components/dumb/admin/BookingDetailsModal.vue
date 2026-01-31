<template>
  <v-dialog
    :model-value="modelValue"
    max-width="600px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h5">
        Booking Details
        <v-spacer />
        <v-btn
          icon
          @click="$emit('close')"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text v-if="booking">
        <v-row>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="text-subtitle-2 text-medium-emphasis">
              Property
            </div>
            <div class="text-body-1">
              {{ property?.name || 'N/A' }}
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="text-subtitle-2 text-medium-emphasis">
              Cleaner
            </div>
            <div class="text-body-1">
              {{ cleaner?.name || 'Unassigned' }}
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="text-subtitle-2 text-medium-emphasis">
              Date
            </div>
            <div class="text-body-1">
              {{ formatDate(booking.checkout_date) }}
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="text-subtitle-2 text-medium-emphasis">
              Time
            </div>
            <div class="text-body-1">
              {{ booking.checkout_time || 'N/A' }}
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="text-subtitle-2 text-medium-emphasis">
              Status
            </div>
            <div class="text-body-1">
              <v-chip
                :color="getStatusColor(booking.status)"
                size="small"
              >
                {{ booking.status }}
              </v-chip>
            </div>
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <div class="text-subtitle-2 text-medium-emphasis">
              Priority
            </div>
            <div class="text-body-1">
              <v-chip
                :color="getPriorityColor(booking.priority || 'low')"
                size="small"
              >
                {{ booking.priority || 'N/A' }}
              </v-chip>
            </div>
          </v-col>
          <v-col
            v-if="booking.notes"
            cols="12"
          >
            <div class="text-subtitle-2 text-medium-emphasis">
              Notes
            </div>
            <div class="text-body-1">
              {{ booking.notes }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text v-else>
        <div class="text-center pa-4">
          <v-icon
            size="48"
            color="grey"
          >
            mdi-calendar-remove
          </v-icon>
          <div class="text-h6 mt-2">
            No booking selected
          </div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          @click="$emit('close')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Booking, Property, User } from '@/types';

interface Props {
  modelValue: boolean;
  booking: Booking | null;
  property: Property | null;
  cleaner: User | null;
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}

defineProps<Props>();
defineEmits<Emits>();

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString();
}

function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'success';
    case 'in_progress':
      return 'warning';
    case 'cancelled':
      return 'error';
    default:
      return 'grey';
  }
}

function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'success';
    default:
      return 'grey';
  }
}
</script> 