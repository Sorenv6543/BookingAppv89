<template>
  <v-card class="pa-5">
    <div class="d-flex align-center justify-space-between mb-4">
      <div>
        <div class="text-h6 font-weight-bold">
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="text-caption text-medium-emphasis"
        >
          {{ subtitle }}
        </div>
      </div>
      <v-btn-toggle
        v-model="activeFilter"
        density="compact"
        variant="outlined"
        divided
        mandatory
      >
        <v-btn
          v-for="f in filters"
          :key="f"
          size="small"
          :value="f"
        >
          {{ f }}
        </v-btn>
      </v-btn-toggle>
    </div>

    <!-- SVG Trend Line -->
    <div class="chart-container">
      <svg
        :viewBox="`0 0 ${chartWidth} ${chartHeight}`"
        preserveAspectRatio="none"
        class="trend-svg"
      >
        <!-- Grid lines -->
        <line
          v-for="i in 4"
          :key="'grid-' + i"
          :x1="0"
          :y1="(chartHeight / 5) * i"
          :x2="chartWidth"
          :y2="(chartHeight / 5) * i"
          stroke="#E0E0E0"
          stroke-width="0.5"
          stroke-dasharray="4,4"
        />
        <!-- Area fill -->
        <path
          :d="areaPath"
          :fill="`url(#gradient-${uid})`"
        />
        <!-- Line -->
        <polyline
          :points="polylinePoints"
          fill="none"
          stroke="rgb(var(--v-theme-primary))"
          stroke-width="2"
          stroke-linejoin="round"
          stroke-linecap="round"
        />
        <!-- Dots -->
        <circle
          v-for="(pt, i) in points"
          :key="'dot-' + i"
          :cx="pt.x"
          :cy="pt.y"
          r="3"
          fill="white"
          stroke="rgb(var(--v-theme-primary))"
          stroke-width="1.5"
        />
        <defs>
          <linearGradient
            :id="`gradient-${uid}`"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="rgb(var(--v-theme-primary))"
              stop-opacity="0.15"
            />
            <stop
              offset="100%"
              stop-color="rgb(var(--v-theme-primary))"
              stop-opacity="0.01"
            />
          </linearGradient>
        </defs>
      </svg>
      <!-- Labels -->
      <div class="chart-labels d-flex justify-space-between mt-2">
        <span
          v-for="(label, i) in labels"
          :key="i"
          class="text-caption text-disabled"
        >
          {{ label }}
        </span>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  title?: string
  subtitle?: string
  data?: number[]
  labels?: string[]
  filters?: string[]
}>(), {
  title: 'Total Bookings',
  subtitle: 'Monthly booking trends',
  data: () => [10, 25, 15, 30, 22, 35, 28],
  labels: () => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  filters: () => ['This Week', 'This Month'],
})

const activeFilter = ref(props.filters[0])
const uid = Math.random().toString(36).slice(2, 8)
const chartWidth = 400
const chartHeight = 160
const padding = 10

const points = computed(() => {
  const max = Math.max(...props.data, 1)
  const step = (chartWidth - padding * 2) / Math.max(props.data.length - 1, 1)
  return props.data.map((val, i) => ({
    x: padding + i * step,
    y: padding + (chartHeight - padding * 2) * (1 - val / max),
  }))
})

const polylinePoints = computed(() =>
  points.value.map(p => `${p.x},${p.y}`).join(' ')
)

const areaPath = computed(() => {
  const pts = points.value
  if (!pts.length) return ''
  const first = pts[0]
  const last = pts[pts.length - 1]
  const line = pts.map(p => `L${p.x},${p.y}`).join(' ')
  return `M${first.x},${chartHeight} ${line} L${last.x},${chartHeight} Z`
})
</script>

<style scoped>
.chart-container {
  position: relative;
}

.trend-svg {
  width: 100%;
  height: 160px;
}
</style>
