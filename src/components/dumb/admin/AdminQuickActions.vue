<template>
  <v-card
    class="admin-quick-actions"
    :elevation="elevation"
    :variant="variant"
  >
    <v-card-title class="text-h6 pb-2 d-flex align-center">
      <v-icon class="mr-2">mdi-cog</v-icon>
      Admin Actions
      <v-spacer />
      <v-chip
        v-if="urgentCount > 0"
        color="error"
        size="small"
        variant="elevated"
      >
        <v-icon start size="small">mdi-alert</v-icon>
        {{ urgentCount }} Urgent
      </v-chip>
    </v-card-title>
    
    <v-divider />
    
    <v-card-text class="pa-3">
      <v-container fluid class="pa-0">
        <!-- Critical Actions Row -->
        <v-row class="mb-2">
          <v-col
            cols="6"
            sm="6"
            md="12"
            lg="6"
          >
            <v-btn
              color="error"
              variant="elevated"
              block
              size="large"
              :loading="loading"
              :disabled="disabled"
              @click="handleAction('manage-urgent-turns')"
            >
              <v-icon class="mr-2">mdi-clock-alert</v-icon>
              <span class="d-none d-sm-inline">Urgent</span>
              Turns
              <v-badge
                v-if="urgentCount > 0"
                :content="urgentCount"
                color="white"
                text-color="error"
                inline
                class="ml-1"
              />
            </v-btn>
          </v-col>
          
          <v-col
            cols="6"
            sm="6"
            md="12"
            lg="6"
          >
            <v-btn
              color="primary"
              variant="elevated"
              block
              size="large"
              :loading="loading"
              :disabled="disabled"
              @click="handleAction('assign-cleaners')"
            >
              <v-icon class="mr-2">mdi-account-hard-hat</v-icon>
              <span class="d-none d-sm-inline">Assign</span>
              Cleaners
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Primary Management Actions Row -->
        <v-row class="mb-2">
          <v-col
            cols="6"
            sm="6"
            md="12"
            lg="6"
          >
            <v-btn
              color="secondary"
              variant="tonal"
              block
              :loading="loading"
              :disabled="disabled"
              @click="handleAction('master-calendar')"
            >
              <v-icon class="mr-2">mdi-calendar-multiple</v-icon>
              <span class="d-none d-sm-inline">Master</span>
              Calendar
            </v-btn>
          </v-col>
          
          <v-col
            cols="6"
            sm="6"
            md="12"
            lg="6"
          >
            <v-btn
              color="info"
              variant="tonal"
              block
              :loading="loading"
              :disabled="disabled"
              @click="handleAction('create-booking')"
            >
              <v-icon class="mr-2">mdi-calendar-plus</v-icon>
              <span class="d-none d-sm-inline">New</span>
              Booking
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Bulk Operations (Collapsible) -->
        <v-expand-transition>
          <div v-if="showBulkActions">
            <v-divider class="my-3" />
            
            <v-row class="mb-2">
              <v-col cols="12">
                <div class="text-subtitle-2 text-medium-emphasis mb-2">
                  <v-icon size="small" class="mr-1">mdi-format-list-bulleted-square</v-icon>
                  Bulk Operations
                </div>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col
                cols="6"
                sm="6"
                md="12"
                lg="6"
              >
                <v-btn
                  color="warning"
                  variant="outlined"
                  block
                  :loading="loading"
                  :disabled="disabled"
                  @click="handleAction('bulk-assign')"
                >
                  <v-icon class="mr-2">mdi-account-multiple</v-icon>
                  <span class="d-none d-sm-inline">Bulk</span>
                  Assign
                </v-btn>
              </v-col>
              
              <v-col
                cols="6"
                sm="6"
                md="12"
                lg="6"
              >
                <v-btn
                  color="orange"
                  variant="outlined"
                  block
                  :loading="loading"
                  :disabled="disabled"
                  @click="handleAction('bulk-reschedule')"
                >
                  <v-icon class="mr-2">mdi-calendar-sync</v-icon>
                  <span class="d-none d-sm-inline">Bulk</span>
                  Reschedule
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        
        <!-- Management Actions (Collapsible) -->
        <v-expand-transition>
          <div v-if="showManagementActions">
            <v-divider class="my-3" />
            
            <v-row class="mb-2">
              <v-col cols="12">
                <div class="text-subtitle-2 text-medium-emphasis mb-2">
                  <v-icon size="small" class="mr-1">mdi-cog-outline</v-icon>
                  Business Management
                </div>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col
                cols="6"
                sm="6"
                md="12"
                lg="6"
              >
                <v-btn
                  color="success"
                  variant="outlined"
                  block
                  :loading="loading"
                  :disabled="disabled"
                  @click="handleAction('manage-cleaners')"
                >
                  <v-icon class="mr-2">mdi-account-group</v-icon>
                  <span class="d-none d-sm-inline">Manage</span>
                  Cleaners
                </v-btn>
              </v-col>
              
              <v-col
                cols="6"
                sm="6"
                md="12"
                lg="6"
              >
                <v-btn
                  color="purple"
                  variant="outlined"
                  block
                  :loading="loading"
                  :disabled="disabled"
                  @click="handleAction('view-reports')"
                >
                  <v-icon class="mr-2">mdi-chart-line</v-icon>
                  <span class="d-none d-sm-inline">Business</span>
                  Reports
                </v-btn>
              </v-col>
            </v-row>
            
            <v-row class="mt-2">
              <v-col
                cols="6"
                sm="6"
                md="12"
                lg="6"
              >
                <v-btn
                  color="indigo"
                  variant="outlined"
                  block
                  :loading="loading"
                  :disabled="disabled"
                  @click="handleAction('manage-properties')"
                >
                  <v-icon class="mr-2">mdi-home-group</v-icon>
                  <span class="d-none d-sm-inline">All</span>
                  Properties
                </v-btn>
              </v-col>
              
              <v-col
                cols="6"
                sm="6"
                md="12"
                lg="6"
              >
                <v-btn
                  color="teal"
                  variant="outlined"
                  block
                  :loading="loading"
                  :disabled="disabled"
                  @click="handleAction('system-settings')"
                >
                  <v-icon class="mr-2">mdi-cog-box</v-icon>
                  <span class="d-none d-sm-inline">System</span>
                  Settings
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        
        <!-- Action Toggles -->
        <v-row class="mt-2">
          <v-col cols="6">
            <v-btn
              variant="text"
              size="small"
              block
              @click="showBulkActions = !showBulkActions"
            >
              <v-icon class="mr-1">
                {{ showBulkActions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              {{ showBulkActions ? 'Hide' : 'Bulk' }} Actions
            </v-btn>
          </v-col>
          
          <v-col cols="6">
            <v-btn
              variant="text"
              size="small"
              block
              @click="showManagementActions = !showManagementActions"
            >
              <v-icon class="mr-1">
                {{ showManagementActions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              {{ showManagementActions ? 'Hide' : 'More' }} Tools
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Quick Stats (Optional) -->
        <v-expand-transition>
          <div v-if="showStats">
            <v-divider class="my-3" />
            
            <v-row>
              <v-col cols="12">
                <div class="text-subtitle-2 text-medium-emphasis mb-2">
                  <v-icon size="small" class="mr-1">mdi-chart-box</v-icon>
                  Quick Stats
                </div>
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-h6 text-primary">{{ todayBookings }}</div>
                  <div class="text-caption text-medium-emphasis">Today</div>
                </div>
              </v-col>
              
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-h6 text-warning">{{ unassignedCount }}</div>
                  <div class="text-caption text-medium-emphasis">Unassigned</div>
                </div>
              </v-col>
              
              <v-col cols="4">
                <div class="text-center">
                  <div class="text-h6 text-success">{{ completedToday }}</div>
                  <div class="text-caption text-medium-emphasis">Completed</div>
                </div>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        
        <!-- Stats Toggle -->
        <v-row class="mt-1">
          <v-col cols="12">
            <v-btn
              variant="text"
              size="x-small"
              block
              @click="showStats = !showStats"
            >
              <v-icon class="mr-1" size="small">
                {{ showStats ? 'mdi-chevron-up' : 'mdi-chart-box-outline' }}
              </v-icon>
              {{ showStats ? 'Hide Stats' : 'Show Stats' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
interface Props {
  loading?: boolean
  disabled?: boolean
  elevation?: number
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
  urgentCount?: number
  todayBookings?: number
  unassignedCount?: number
  completedToday?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  elevation: 2,
  variant: 'elevated',
  urgentCount: 0,
  todayBookings: 0,
  unassignedCount: 0,
  completedToday: 0
})

// Emits
interface Emits {
  (e: 'action', actionType: AdminActionType): void
}

const emit = defineEmits<Emits>()

// Types
type AdminActionType = 
  | 'manage-urgent-turns'
  | 'assign-cleaners'
  | 'master-calendar'
  | 'create-booking'
  | 'bulk-assign'
  | 'bulk-reschedule'
  | 'manage-cleaners'
  | 'view-reports'
  | 'manage-properties'
  | 'system-settings'

// Local state
const showBulkActions = ref(false)
const showManagementActions = ref(false)
const showStats = ref(false)

// Methods
function handleAction(actionType: AdminActionType) {
  if (props.loading || props.disabled) return
  
  emit('action', actionType)
}

// Computed (removed unused hasUrgentItems to fix linter warning)
</script>

<style scoped>
.admin-quick-actions {
  min-height: 200px;
}

.admin-quick-actions .v-btn {
  text-transform: none;
  font-weight: 500;
}

.admin-quick-actions .v-btn--size-large {
  min-height: 48px;
}

.admin-quick-actions .v-chip {
  font-size: 0.75rem;
}

.admin-quick-actions .v-badge {
  font-size: 0.7rem;
}

/* Responsive text adjustments */
@media (max-width: 600px) {
  .admin-quick-actions .v-btn .v-icon {
    margin-right: 4px !important;
  }
}

/* Stats section styling */
.admin-quick-actions .text-h6 {
  font-weight: 600;
  line-height: 1.2;
}

.admin-quick-actions .text-caption {
  font-size: 0.7rem;
  line-height: 1.1;
}
</style> 