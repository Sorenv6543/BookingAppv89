<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card variant="outlined">
          <v-card-title class="text-subtitle-1 py-3">
            <v-icon class="mr-2">mdi-chart-line</v-icon>
            Generate Reports
          </v-card-title>
          <v-divider />
          <v-card-text>
            <div class="text-center text-medium-emphasis py-8">
              <v-icon size="64" class="mb-4">mdi-chart-line</v-icon>
              <div class="text-h6 mb-2">Reports Feature Coming Soon</div>
              <div class="text-body-2">
                Booking reports and analytics will be available here.
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Booking } from '@/types';

// PROPS & EMITS
interface Props {
  booking: Booking;
}

interface Emits {
  (e: 'generate-report', reportType: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.v-card-title {
  font-weight: 600;
}
</style> 