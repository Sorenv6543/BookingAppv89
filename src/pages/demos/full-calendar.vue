<script setup lang="ts">
import { ref } from 'vue'
import FullCalendar from '@/dev/FullCalendar.vue'
import type { Booking, Property } from '@/types'

// Demo data
const demoBookings = ref(new Map<string, Booking>())
const demoProperties = ref(new Map<string, Property>())
</script>

<template>
  <FullCalendar 
    :bookings="demoBookings" 
    :properties="demoProperties"
  />
</template>

<style scoped>
</style> 