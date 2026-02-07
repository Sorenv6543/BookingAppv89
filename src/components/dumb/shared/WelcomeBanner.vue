<template>
  <v-card
    class="welcome-banner overflow-hidden"
    color="primary"
    variant="flat"
  >
    <div class="d-flex align-center pa-6">
      <div class="flex-grow-1">
        <h2 class="text-h5 font-weight-bold text-white mb-1">
          Congratulations {{ userName }}! 🎉
        </h2>
        <p class="text-body-2 text-white-darken-1 mb-4">
          Here's what's happening with your bookings today
        </p>
        <div class="d-flex flex-wrap ga-3">
          <v-chip
            color="white"
            variant="flat"
            size="small"
            prepend-icon="mdi-calendar-plus"
          >
            {{ stats.newBookings }} new bookings
          </v-chip>
          <v-chip
            color="white"
            variant="flat"
            size="small"
            prepend-icon="mdi-swap-horizontal"
          >
            {{ stats.activeTurns }} active turns
          </v-chip>
          <v-chip
            color="white"
            variant="flat"
            size="small"
            prepend-icon="mdi-check-circle"
          >
            {{ stats.completedToday }} completed
          </v-chip>
        </div>
      </div>
      <div class="welcome-illustration d-none d-sm-flex align-center justify-center">
        <v-icon
          size="120"
          color="white"
          style="opacity: 0.15"
        >
          mdi-home-city
        </v-icon>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
interface WelcomeStats {
  newBookings: number
  activeTurns: number
  completedToday: number
}

withDefaults(defineProps<{
  userName?: string
  stats?: WelcomeStats
}>(), {
  userName: 'Jonathan',
  stats: () => ({ newBookings: 0, activeTurns: 0, completedToday: 0 }),
})
</script>

<style scoped>
.welcome-banner {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%,
   #1565C0 100%) !important;
}

.welcome-illustration {
  min-width: 140px;
}

.text-white-darken-1 {
  color: rgba(255, 255, 255, 0.8) !important;
}
</style>
