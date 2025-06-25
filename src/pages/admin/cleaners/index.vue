<template>
  <div class="admin-cleaners-page">
    <!-- Page Header -->
    <div class="page-header">
      <v-container fluid>
        <v-row align="center">
          <v-col>
            <h1 class="text-h4 font-weight-bold">Cleaner Management</h1>
            <p class="text-subtitle-1 text-medium-emphasis">
              Manage cleaner profiles, availability, and performance
            </p>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              prepend-icon="mdi-account-plus"
              @click="showAddDialog = true"
            >
              Add Cleaner
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Stats Cards -->
    <div class="stats-section">
      <v-container fluid>
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon color="primary" size="40" class="me-3">mdi-account-group</v-icon>
                  <div>
                    <div class="text-h5 font-weight-bold">{{ cleanerStats.total }}</div>
                    <div class="text-caption text-medium-emphasis">Total Cleaners</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon color="success" size="40" class="me-3">mdi-check-circle</v-icon>
                  <div>
                    <div class="text-h5 font-weight-bold">{{ cleanerStats.available }}</div>
                    <div class="text-caption text-medium-emphasis">Available Today</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon color="warning" size="40" class="me-3">mdi-clock-outline</v-icon>
                  <div>
                    <div class="text-h5 font-weight-bold">{{ cleanerStats.busy }}</div>
                    <div class="text-caption text-medium-emphasis">Currently Busy</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-icon color="info" size="40" class="me-3">mdi-star</v-icon>
                  <div>
                    <div class="text-h5 font-weight-bold">4.8</div>
                    <div class="text-caption text-medium-emphasis">Average Rating</div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Main Content -->
    <div class="page-content">
      <v-container fluid>
        <!-- Search and Filters -->
        <v-row class="mb-4">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Search cleaners..."
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status"
              variant="outlined"
              density="compact"
              clearable
            />
          </v-col>
          <v-col cols="12" md="3">
            <v-btn
              color="secondary"
              variant="outlined"
              block
              @click="resetFilters"
            >
              Reset Filters
            </v-btn>
          </v-col>
        </v-row>

        <!-- Cleaners Grid -->
        <v-row>
          <v-col
            v-for="cleaner in filteredCleaners"
            :key="cleaner.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="cleaner-card">
              <v-card-text>
                <div class="d-flex align-center mb-3">
                  <v-avatar size="48" class="me-3">
                    <v-icon size="24">mdi-account</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <div class="text-h6 font-weight-medium">{{ cleaner.name }}</div>
                    <div class="text-caption text-medium-emphasis">{{ cleaner.email }}</div>
                  </div>
                  <v-chip
                    color="success"
                    size="small"
                    variant="flat"
                  >
                    Active
                  </v-chip>
                </div>

                <!-- Skills -->
                <div class="mb-3">
                  <div class="text-caption text-medium-emphasis mb-1">Skills</div>
                  <div class="d-flex flex-wrap ga-1">
                    <v-chip
                      v-for="skill in cleaner.skills.slice(0, 3)"
                      :key="skill"
                      size="x-small"
                      variant="outlined"
                    >
                      {{ skill }}
                    </v-chip>
                    <v-chip
                      v-if="cleaner.skills.length > 3"
                      size="x-small"
                      variant="outlined"
                    >
                      +{{ cleaner.skills.length - 3 }}
                    </v-chip>
                  </div>
                </div>

                <!-- Stats -->
                <div class="d-flex justify-space-between mb-3">
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold">{{ cleaner.max_daily_bookings }}</div>
                    <div class="text-caption text-medium-emphasis">Max Daily</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold">4.8</div>
                    <div class="text-caption text-medium-emphasis">Rating</div>
                  </div>
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold">85%</div>
                    <div class="text-caption text-medium-emphasis">Utilization</div>
                  </div>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  variant="text"
                  size="small"
                  prepend-icon="mdi-calendar"
                  @click="viewSchedule(cleaner)"
                >
                  Schedule
                </v-btn>
                <v-btn
                  variant="text"
                  size="small"
                  prepend-icon="mdi-pencil"
                  @click="editCleaner(cleaner)"
                >
                  Edit
                </v-btn>
                <v-spacer />
                <v-btn
                  variant="text"
                  size="small"
                  color="error"
                  icon="mdi-delete"
                  @click="handleDeleteCleaner(cleaner)"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <div v-if="filteredCleaners.length === 0" class="text-center py-8">
          <v-icon size="64" color="grey-lighten-1">mdi-account-search</v-icon>
          <div class="text-h6 mt-4 mb-2">No cleaners found</div>
          <div class="text-body-2 text-medium-emphasis">
            Try adjusting your search criteria or add a new cleaner
          </div>
        </div>
      </v-container>
    </div>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="showAddDialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editingCleaner ? 'Edit' : 'Add' }} Cleaner</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="formData.name"
              label="Full Name"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-3"
            />
            <v-text-field
              v-model="formData.email"
              label="Email"
              type="email"
              :rules="[rules.required, rules.email]"
              variant="outlined"
              class="mb-3"
            />
            <v-select
              v-model="formData.skills"
              :items="availableSkills"
              label="Skills"
              multiple
              chips
              variant="outlined"
              class="mb-3"
            />
            <v-text-field
              v-model.number="formData.max_daily_bookings"
              label="Max Daily Bookings"
              type="number"
              :rules="[rules.required, rules.positive]"
              variant="outlined"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text @click="closeDialog">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="!formValid"
            :loading="saving"
            @click="saveCleaner"
          >
            {{ editingCleaner ? 'Update' : 'Create' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCleanerManagement } from '@/composables/admin/useCleanerManagement'
import type { Cleaner } from '@/types/user'

// Router and composables
const router = useRouter()
const { allCleaners, loading: _loading, fetchCleaners, createCleaner, updateCleaner, deleteCleaner } = useCleanerManagement()

// Reactive state
const searchQuery = ref('')
const statusFilter = ref<string | null>(null)
const showAddDialog = ref(false)
const editingCleaner = ref<Cleaner | null>(null)
const formValid = ref(false)
const saving = ref(false)

// Form data
const formData = ref({
  name: '',
  email: '',
  skills: [] as string[],
  max_daily_bookings: 4
})

// Options
const statusOptions = [
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
  { title: 'On Leave', value: 'on_leave' }
]

const availableSkills = [
  'Standard Cleaning',
  'Deep Cleaning',
  'Move-in/Move-out',
  'Post-Construction',
  'Carpet Cleaning',
  'Window Cleaning',
  'Pressure Washing',
  'Organizing'
]

// Validation rules
const rules = {
  required: (value: any) => !!value || 'This field is required',
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Invalid email address'
  },
  positive: (value: number) => value > 0 || 'Must be greater than 0'
}

// Computed properties
const filteredCleaners = computed(() => {
  let filtered = allCleaners.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(cleaner => 
      cleaner.name.toLowerCase().includes(query) ||
      cleaner.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

const cleanerStats = computed(() => ({
  total: allCleaners.value.length,
  available: Math.floor(allCleaners.value.length * 0.7),
  busy: Math.floor(allCleaners.value.length * 0.3)
}))

// Methods
const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = null
}

const viewSchedule = (cleaner: Cleaner) => {
  router.push(`/admin/schedule?cleaner=${cleaner.id}`)
}

const editCleaner = (cleaner: Cleaner) => {
  editingCleaner.value = cleaner
  formData.value = {
    name: cleaner.name,
    email: cleaner.email,
    skills: [...cleaner.skills],
    max_daily_bookings: cleaner.max_daily_bookings
  }
  showAddDialog.value = true
}

const handleDeleteCleaner = async (cleaner: Cleaner) => {
  if (confirm(`Are you sure you want to delete ${cleaner.name}?`)) {
    try {
      await deleteCleaner(cleaner.id)
    } catch (error) {
      console.error('Failed to delete cleaner:', error)
    }
  }
}

const saveCleaner = async () => {
  saving.value = true
  try {
    if (editingCleaner.value) {
      await updateCleaner(editingCleaner.value.id, formData.value)
    } else {
      await createCleaner(formData.value)
    }
    closeDialog()
  } catch (error) {
    console.error('Failed to save cleaner:', error)
  } finally {
    saving.value = false
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  editingCleaner.value = null
  formData.value = {
    name: '',
    email: '',
    skills: [],
    max_daily_bookings: 4
  }
}

// Lifecycle
onMounted(() => {
  fetchCleaners()
})
</script>

<style scoped>
.admin-cleaners-page {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.page-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 1rem 0;
}

.stats-section {
  padding: 1rem 0;
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
}

.page-content {
  padding: 2rem 0;
}

.cleaner-card {
  height: 100%;
  transition: transform 0.2s ease-in-out;
}

.cleaner-card:hover {
  transform: translateY(-2px);
}
</style> 