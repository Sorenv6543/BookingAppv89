<template>
  <v-row>
    <v-col
      v-for="(card, i) in cards"
      :key="i"
      cols="12"
      sm="6"
      lg="3"
    >
      <v-card class="pa-4">
        <div class="d-flex align-center justify-space-between mb-3">
          <v-avatar
            :color="card.color ?? 'primary'"
            size="42"
            variant="tonal"
          >
            <v-icon size="22">{{ card.icon ?? 'mdi-chart-line' }}</v-icon>
          </v-avatar>
          <v-chip
            v-if="card.trend"
            :color="card.trend.startsWith('+') || card.trend.startsWith('↑') ? 'success' : 'error'"
            size="x-small"
            variant="tonal"
          >
            {{ card.trend }}
          </v-chip>
        </div>
        <div class="text-h5 font-weight-bold mb-1">{{ card.value }}</div>
        <div class="text-body-2 text-medium-emphasis">{{ card.title }}</div>
        <div v-if="card.subtitle" class="text-caption text-disabled mt-1">
          {{ card.subtitle }}
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
interface StatCard {
  title: string
  value: string | number
  subtitle?: string
  trend?: string
  color?: string
  icon?: string
}

withDefaults(defineProps<{
  cards?: StatCard[]
}>(), {
  cards: () => [],
})
</script>
