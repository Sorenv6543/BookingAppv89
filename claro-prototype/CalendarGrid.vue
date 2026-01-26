<template>
  <div class="calendar-container">
    <!-- Header Controls -->
    <div class="calendar-header">
      <div class="header-left">
        <button @click="previousWeek" class="btn-icon">
          <ChevronLeftIcon class="w-5 h-5" />
        </button>
        <h2 class="week-title">{{ weekRangeText }}</h2>
        <button @click="nextWeek" class="btn-icon">
          <ChevronRightIcon class="w-5 h-5" />
        </button>
      </div>
      <div class="header-right">
        <button @click="viewMode = 'cleaners'" 
                :class="['view-toggle', { active: viewMode === 'cleaners' }]">
          Cleaners View
        </button>
        <button @click="viewMode = 'properties'" 
                :class="['view-toggle', { active: viewMode === 'properties' }]">
          Properties View
        </button>
      </div>
    </div>

    <!-- Main Calendar Grid -->
    <div class="calendar-wrapper">
      <div class="calendar-grid" :class="`view-${viewMode}`">
        <!-- Header Row -->
        <div class="grid-header">
          <div class="corner-cell">{{ viewMode === 'cleaners' ? 'Cleaners' : 'Properties' }}</div>
          <template v-for="day in weekDays" :key="day.date">
            <div class="day-header">
              <div class="day-name">{{ day.name }}</div>
              <div class="day-date">{{ day.date }}</div>
            </div>
          </template>
        </div>

        <!-- Time Slots -->
        <template v-for="slot in timeSlots" :key="slot">
          <div class="slot-section">
            <div class="slot-label">{{ slot }}</div>
            
            <!-- Rows (Cleaners or Properties) -->
            <template v-if="viewMode === 'cleaners'">
              <div v-for="cleaner in cleaners" :key="`${cleaner.id}-${slot}`" class="grid-row">
                <CleanerCell :cleaner="cleaner" :slot="slot" />
                
                <template v-for="day in weekDays" :key="`${cleaner.id}-${day.date}-${slot}`">
                  <TimeSlotCell
                    :cleanerId="cleaner.id"
                    :day="day.date"
                    :slot="slot"
                    :jobs="getJobsForSlot(cleaner.id, day.date, slot)"
                    @drop="handleJobDrop"
                    @job-click="selectJob"
                  />
                </template>
              </div>
            </template>

            <template v-else>
              <!-- Properties view implementation -->
              <div v-for="property in properties" :key="`${property.id}-${slot}`" class="grid-row">
                <PropertyCell :property="property" />
                <!-- Property slots... -->
              </div>
            </template>
          </div>
        </template>
      </div>

      <!-- Unassigned Jobs Sidebar -->
      <aside class="sidebar">
        <UnassignedJobs 
          :jobs="unassignedJobs"
          @drag-start="handleDragStart"
          @request-ai-suggestion="requestAISuggestion"
        />
        
        <AISuggestionPanel
          v-if="showAIPanel"
          :job="selectedJob"
          :suggestions="aiSuggestions"
          @accept="acceptSuggestion"
          @close="showAIPanel = false"
        />
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/vue/24/outline'
import type { Job, Cleaner, Property, TimeSlot, AISuggestion } from './types'
import CleanerCell from './CleanerCell.vue'
import PropertyCell from './PropertyCell.vue'
import TimeSlotCell from './TimeSlotCell.vue'
import UnassignedJobs from './UnassignedJobs.vue'
import AISuggestionPanel from './AISuggestionPanel.vue'
import { useCalendarStore } from './stores/calendar'
import { useJobDragDrop } from './composables/useJobDragDrop'
import { useAISuggestions } from './composables/useAISuggestions'

// Store & Composables
const calendarStore = useCalendarStore()
const { draggedJob, handleDragStart, handleDragEnd } = useJobDragDrop()
const { aiSuggestions, requestSuggestion } = useAISuggestions()

// State
const viewMode = ref<'cleaners' | 'properties'>('cleaners')
const currentWeek = ref(new Date())
const selectedJob = ref<Job | null>(null)
const showAIPanel = ref(false)

// Mock data (replace with API calls)
const cleaners = ref<Cleaner[]>([
  { 
    id: '1', 
    name: 'Maria S.', 
    status: 'available',
    availability: {
      monday: { morning: true, afternoon: true },
      tuesday: { morning: true, afternoon: false }
    },
    skills: ['deep-clean', 'fast-turnaround'],
    rating: 4.8,
    location: { lat: 30.2672, lng: -97.7431 }
  },
  // ... more cleaners
])

const properties = ref<Property[]>([
  {
    id: '1',
    name: 'Sunset Villa',
    address: '123 Main St, Austin, TX',
    bedrooms: 3,
    bathrooms: 2,
    cleaning_fee: 150,
    owner_id: 'owner-1'
  },
  // ... more properties
])

const jobs = ref<Job[]>([
  {
    id: '1',
    property_id: '1',
    cleaner_id: '1',
    scheduled_date: '2025-01-15',
    time_slot: 'morning',
    status: 'assigned',
    priority: 'normal',
    is_same_day_turn: false,
    duration_minutes: 150,
    checklist: [
      { id: '1', task: 'Clean kitchen', completed: false, required: true },
      { id: '2', task: 'Vacuum all rooms', completed: false, required: true }
    ]
  },
  // ... more jobs
])

// Computed
const weekDays = computed(() => {
  const days = []
  const start = new Date(currentWeek.value)
  start.setDate(start.getDate() - start.getDay() + 1) // Monday
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(start)
    date.setDate(start.getDate() + i)
    days.push({
      name: date.toLocaleDateString('en', { weekday: 'short' }),
      date: date.toISOString().split('T')[0]
    })
  }
  return days
})

const weekRangeText = computed(() => {
  const start = weekDays.value[0].date
  const end = weekDays.value[6].date
  return `${formatDate(start)} - ${formatDate(end)}`
})

const unassignedJobs = computed(() => 
  jobs.value.filter(job => !job.cleaner_id)
)

const timeSlots: TimeSlot[] = ['morning', 'afternoon']

// Methods
const getJobsForSlot = (cleanerId: string, date: string, slot: TimeSlot) => {
  return jobs.value.filter(job => 
    job.cleaner_id === cleanerId &&
    job.scheduled_date === date &&
    job.time_slot === slot
  )
}

const handleJobDrop = (event: DragEvent, cleanerId: string, date: string, slot: TimeSlot) => {
  if (!draggedJob.value) return
  
  const job = jobs.value.find(j => j.id === draggedJob.value?.id)
  if (job) {
    job.cleaner_id = cleanerId
    job.scheduled_date = date
    job.time_slot = slot
    job.status = 'assigned'
    
    // Emit success notification
    calendarStore.showNotification({
      type: 'success',
      message: `Job assigned successfully`
    })
  }
  
  handleDragEnd()
}

const selectJob = (job: Job) => {
  selectedJob.value = job
}

const requestAISuggestion = async (job: Job) => {
  selectedJob.value = job
  showAIPanel.value = true
  await requestSuggestion(job)
}

const acceptSuggestion = (suggestion: AISuggestion) => {
  if (!selectedJob.value) return
  
  const job = jobs.value.find(j => j.id === selectedJob.value?.id)
  if (job) {
    job.cleaner_id = suggestion.cleaner_id
    job.status = 'assigned'
    // Auto-assign optimal time slot based on suggestion
    job.scheduled_date = suggestion.recommended_date || weekDays.value[0].date
    job.time_slot = suggestion.recommended_slot || 'morning'
  }
  
  showAIPanel.value = false
  selectedJob.value = null
}

const previousWeek = () => {
  const prev = new Date(currentWeek.value)
  prev.setDate(prev.getDate() - 7)
  currentWeek.value = prev
}

const nextWeek = () => {
  const next = new Date(currentWeek.value)
  next.setDate(next.getDate() + 7)
  currentWeek.value = next
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en', { 
    month: 'short', 
    day: 'numeric' 
  })
}

// Lifecycle
onMounted(() => {
  // Load initial data
  calendarStore.loadWeekData(currentWeek.value)
  
  // Set up real-time subscriptions
  const jobChannel = calendarStore.subscribeToJobUpdates()
  const cleanerChannel = calendarStore.subscribeToCleanerUpdates()
  
  onUnmounted(() => {
    jobChannel.unsubscribe()
    cleanerChannel.unsubscribe()
  })
})
</script>

<style scoped>
.calendar-container {
  @apply h-full flex flex-col bg-gray-50;
}

.calendar-header {
  @apply flex justify-between items-center p-4 bg-white border-b;
}

.header-left {
  @apply flex items-center gap-3;
}

.week-title {
  @apply text-lg font-semibold text-gray-900;
}

.btn-icon {
  @apply p-2 rounded-lg hover:bg-gray-100 transition-colors;
}

.header-right {
  @apply flex gap-2;
}

.view-toggle {
  @apply px-4 py-2 rounded-lg text-sm font-medium transition-colors;
  @apply text-gray-600 hover:bg-gray-100;
}

.view-toggle.active {
  @apply bg-blue-100 text-blue-700;
}

.calendar-wrapper {
  @apply flex-1 flex overflow-hidden;
}

.calendar-grid {
  @apply flex-1 overflow-auto p-4;
  display: grid;
  grid-template-columns: 180px repeat(7, minmax(120px, 1fr));
  gap: 2px;
  background: #e5e7eb;
}

.grid-header {
  @apply contents;
}

.corner-cell {
  @apply bg-white p-3 font-semibold text-gray-700;
  border-radius: 8px 0 0 0;
}

.day-header {
  @apply bg-white p-3 text-center;
}

.day-name {
  @apply text-sm font-medium text-gray-700;
}

.day-date {
  @apply text-xs text-gray-500;
}

.slot-section {
  @apply contents;
}

.slot-label {
  @apply bg-gray-100 p-2 text-xs uppercase tracking-wider text-gray-600 font-semibold;
  grid-column: 1 / -1;
}

.grid-row {
  @apply contents;
}

.sidebar {
  @apply w-80 bg-white border-l p-4 overflow-y-auto;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .calendar-grid {
    grid-template-columns: 100px repeat(7, minmax(80px, 1fr));
  }
  
  .sidebar {
    @apply fixed bottom-0 left-0 right-0 w-full border-t border-l-0;
    @apply transform transition-transform;
  }
  
  .sidebar.collapsed {
    @apply translate-y-full;
  }
}
</style>
