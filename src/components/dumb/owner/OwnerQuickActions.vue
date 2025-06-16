<template>
  <v-card
    class="owner-quick-actions"
    :elevation="elevation"
    :variant="variant"
  >
    <v-card-title class="text-h6 pb-2">
      <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
      Quick Actions
    </v-card-title>
    
    <v-divider />
    
    <v-card-text class="pa-3">
      <v-container fluid class="pa-0">
        <!-- Primary Actions Row -->
        <v-row class="mb-2">
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
              @click="handleAction('add-booking')"
            >
              <v-icon class="mr-2">mdi-calendar-plus</v-icon>
              <span class="d-none d-sm-inline">Schedule</span>
              <span class="d-sm-none">Book</span>
              Cleaning
            </v-btn>
          </v-col>
          
          <v-col
            cols="6"
            sm="6"
            md="12"
            lg="6"
          >
            <v-btn
              color="secondary"
              variant="elevated"
              block
              size="large"
              :loading="loading"
              :disabled="disabled"
              @click="handleAction('add-property')"
            >
              <v-icon class="mr-2">mdi-home-plus</v-icon>
              <span class="d-none d-sm-inline">Add</span>
              Property
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Secondary Actions Row -->
        <v-row>
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
              @click="handleAction('view-calendar')"
            >
              <v-icon class="mr-2">mdi-calendar</v-icon>
              <span class="d-none d-sm-inline">View</span>
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
              color="success"
              variant="tonal"
              block
              :loading="loading"
              :disabled="disabled"
              @click="handleAction('view-properties')"
            >
              <v-icon class="mr-2">mdi-home-group</v-icon>
              <span class="d-none d-sm-inline">My</span>
              Properties
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Additional Actions (Collapsible) -->
        <v-expand-transition>
          <div v-if="showMoreActions">
            <v-divider class="my-3" />
            
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
                  @click="handleAction('view-bookings')"
                >
                  <v-icon class="mr-2">mdi-clipboard-list</v-icon>
                  <span class="d-none d-sm-inline">My</span>
                  Bookings
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
                  @click="handleAction('contact-support')"
                >
                  <v-icon class="mr-2">mdi-help-circle</v-icon>
                  <span class="d-none d-sm-inline">Get</span>
                  Help
                </v-btn>
              </v-col>
            </v-row>
          </div>
        </v-expand-transition>
        
        <!-- Show More/Less Toggle -->
        <v-row class="mt-2">
          <v-col cols="12">
            <v-btn
              variant="text"
              size="small"
              block
              @click="showMoreActions = !showMoreActions"
            >
              <v-icon class="mr-1">
                {{ showMoreActions ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
              </v-icon>
              {{ showMoreActions ? 'Show Less' : 'More Actions' }}
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
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  elevation: 2,
  variant: 'elevated'
})

// Emits
interface Emits {
  (e: 'action', actionType: OwnerActionType): void
}

const emit = defineEmits<Emits>()

// Types
type OwnerActionType = 
  | 'add-booking' 
  | 'add-property' 
  | 'view-calendar' 
  | 'view-properties' 
  | 'view-bookings' 
  | 'contact-support'

// Reactive data
const showMoreActions = ref(false)

// Methods
const handleAction = (actionType: OwnerActionType) => {
  emit('action', actionType)
}
</script>

<style scoped>
.owner-quick-actions {
  width: 100%;
}

.v-card-title {
  background-color: rgb(var(--v-theme-surface-variant));
}

/* Ensure consistent button heights */
.v-btn {
  min-height: 48px;
}

/* Mobile optimizations */
@media (max-width: 600px) {
  .v-btn {
    min-height: 44px;
    font-size: 0.875rem;
  }
  
  .v-icon {
    font-size: 1.2rem !important;
  }
}

/* Tablet optimizations */
@media (min-width: 601px) and (max-width: 960px) {
  .v-btn {
    min-height: 52px;
  }
}

/* Animation for expand transition */
.v-expand-transition-enter-active,
.v-expand-transition-leave-active {
  transition: all 0.3s ease;
}

.v-expand-transition-enter-from,
.v-expand-transition-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 