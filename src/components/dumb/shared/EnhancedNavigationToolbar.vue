<template>
  <v-card class="enhanced-navigation-toolbar" elevation="2">
    <v-card-text class="pb-2">
      <v-row align="center" no-gutters>
        <!-- Year Navigation (New Feature) -->
        <v-col cols="12" lg="2" class="mb-2 mb-lg-0">
          <div class="d-flex align-center year-navigation">
            <v-btn
              icon="mdi-chevron-double-left"
              variant="text"
              size="small"
              :disabled="loading"
              @click="$emit('navigate', 'prevYear')"
            />
            
            <v-chip
              variant="outlined"
              size="small"
              class="mx-2"
              @click="openDatePicker"
            >
              {{ currentYear }}
            </v-chip>
            
            <v-btn
              icon="mdi-chevron-double-right"
              variant="text"
              size="small"
              :disabled="loading"
              @click="$emit('navigate', 'nextYear')"
            />
          </div>
        </v-col>

        <!-- Enhanced Month Navigation -->
        <v-col cols="12" lg="4" class="mb-2 mb-lg-0">
          <div class="d-flex align-center month-navigation justify-center">
            <!-- History Back -->
            <v-btn
              icon="mdi-arrow-left"
              variant="text"
              size="small"
              :disabled="loading || !canGoBack"
              @click="$emit('navigate', 'historyBack')"
            />
            
            <!-- Previous Month -->
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              size="small"
              :disabled="loading"
              @click="$emit('navigate', 'prev')"
            />
            
            <!-- Current Date Display (Clickable) -->
            <v-btn
              variant="text"
              class="mx-2 current-date-display"
              :disabled="loading"
              @click="openDatePicker"
            >
              {{ currentMonthYear }}
            </v-btn>
            
            <!-- Next Month -->
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              size="small"
              :disabled="loading"
              @click="$emit('navigate', 'next')"
            />
            
            <!-- History Forward -->
            <v-btn
              icon="mdi-arrow-right"
              variant="text"
              size="small"
              :disabled="loading || !canGoForward"
              @click="$emit('navigate', 'historyForward')"
            />
          </div>
        </v-col>

        <!-- Navigation Tools -->
        <v-col cols="12" lg="6">
          <div class="d-flex align-center justify-end flex-wrap ga-2">
            <!-- Smart Navigation Toggle -->
            <v-btn
              :prepend-icon="showSmartNavigation ? 'mdi-navigation' : 'mdi-navigation-outline'"
              :color="showSmartNavigation ? 'primary' : 'default'"
              :variant="showSmartNavigation ? 'elevated' : 'outlined'"
              size="small"
              @click="toggleSmartNavigation"
            >
              {{ mobile ? 'Smart' : 'Smart Nav' }}
              <v-badge
                v-if="totalSmartNavCount > 0"
                :content="totalSmartNavCount"
                color="error"
                inline
                class="ml-1"
              />
            </v-btn>

            <!-- Date Picker Button -->
            <v-btn
              prepend-icon="mdi-calendar"
              variant="outlined"
              size="small"
              :disabled="loading"
              @click="openDatePicker"
            >
              {{ mobile ? 'Date' : 'Go to Date' }}
            </v-btn>

            <!-- Today Button -->
            <v-btn
              prepend-icon="mdi-calendar-today"
              color="primary"
              variant="outlined"
              size="small"
              :disabled="loading"
              @click="$emit('navigate', 'today')"
            >
              {{ mobile ? 'Today' : 'Today' }}
            </v-btn>

            <!-- View Toggle -->
            <v-btn-toggle
              :model-value="currentView"
              mandatory
              variant="outlined"
              density="compact"
              class="view-toggle"
              @update:model-value="$emit('viewChange', $event)"
            >
              <v-btn value="dayGridMonth" size="small">
                {{ mobile ? 'M' : 'Month' }}
              </v-btn>
              <v-btn value="timeGridWeek" size="small">
                {{ mobile ? 'W' : 'Week' }}
              </v-btn>
              <v-btn value="timeGridDay" size="small">
                {{ mobile ? 'D' : 'Day' }}
              </v-btn>
              <v-btn value="listWeek" size="small">
                {{ mobile ? 'L' : 'List' }}
              </v-btn>
            </v-btn-toggle>

            <!-- Keyboard Shortcuts Info -->
            <v-btn
              v-if="!mobile"
              icon="mdi-keyboard"
              variant="text"
              size="small"
              @click="showKeyboardShortcuts = !showKeyboardShortcuts"
            />
          </div>
        </v-col>
      </v-row>
      
      <!-- Keyboard Shortcuts Help -->
      <v-expand-transition>
        <v-alert
          v-show="showKeyboardShortcuts"
          type="info"
          variant="tonal"
          class="mt-3"
          closable
          @click:close="showKeyboardShortcuts = false"
        >
          <template #title>
            <v-icon class="mr-2">mdi-keyboard</v-icon>
            Keyboard Shortcuts
          </template>
          
          <div class="keyboard-shortcuts">
            <div class="shortcut-row">
              <kbd>←/→</kbd> <span>Navigate months</span>
            </div>
            <div class="shortcut-row">
              <kbd>Ctrl + ←/→</kbd> <span>Navigate years</span>
            </div>
            <div class="shortcut-row">
              <kbd>Home</kbd> <span>Go to today</span>
            </div>
            <div class="shortcut-row">
              <kbd>Ctrl + D</kbd> <span>Open date picker</span>
            </div>
            <div class="shortcut-row">
              <kbd>Ctrl + M/W</kbd> <span>Switch to Month/Week view</span>
            </div>
            <div class="shortcut-row">
              <kbd>Alt + ←/→</kbd> <span>Navigation history</span>
            </div>
          </div>
        </v-alert>
      </v-expand-transition>
    </v-card-text>

    <!-- Date Picker Modal -->
    <DatePickerModal
      v-model:visible="datePickerVisible"
      :current-date="currentDate"
      @date-selected="handleDateSelected"
      @cancel="datePickerVisible = false"
    />

    <!-- Smart Navigation Panel -->
    <v-expand-transition>
      <SmartNavigationPanel
        v-show="showSmartNavigation"
        :visible="showSmartNavigation"
        :smart-navigation-counts="smartNavigationCounts"
        :users="props.users"
        :show-owner-navigation="isAdmin"
        :show-status-navigation="isAdmin"
        class="mt-2"
        @navigate="handleSmartNavigation"
        @navigate-to-owner="handleOwnerNavigation"
        @navigate-to-status="handleStatusNavigation"
        @close="showSmartNavigation = false"
      />
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import type { User } from '@/types';
import DatePickerModal from './DatePickerModal.vue';
import SmartNavigationPanel from './SmartNavigationPanel.vue';

interface Props {
  currentView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
  currentDate: Date;
  currentMonthYear: string;
  currentYear: number;
  canGoBack: boolean;
  canGoForward: boolean;
  smartNavigationCounts: {
    nextTurn: number;
    nextUrgent: number;
    busiest: number;
  };
  users?: Map<string, User>;
  loading?: boolean;
}

interface Emits {
  (e: 'navigate', action: string): void;
  (e: 'viewChange', view: string): void;
  (e: 'dateSelected', date: Date): void;
  (e: 'smartNavigate', option: string): void;
  (e: 'ownerNavigate', ownerId: string): void;
  (e: 'statusNavigate', status: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  users: () => new Map<string, User>(),
  loading: false
});

const emit = defineEmits<Emits>();

// Composables
const { mobile } = useDisplay();
const authStore = useAuthStore();

// Local state
const datePickerVisible = ref(false);
const showSmartNavigation = ref(false);
const showKeyboardShortcuts = ref(false);

// Computed properties
const isAdmin = computed(() => authStore.user?.role === 'admin');

const totalSmartNavCount = computed(() => {
  return props.smartNavigationCounts.nextTurn + 
         props.smartNavigationCounts.nextUrgent + 
         props.smartNavigationCounts.busiest;
});

// Methods
const openDatePicker = (): void => {
  datePickerVisible.value = true;
};

const toggleSmartNavigation = (): void => {
  showSmartNavigation.value = !showSmartNavigation.value;
};

const handleDateSelected = (date: Date): void => {
  emit('dateSelected', date);
};

const handleSmartNavigation = (option: string): void => {
  emit('smartNavigate', option);
  showSmartNavigation.value = false;
};

const handleOwnerNavigation = (ownerId: string): void => {
  emit('ownerNavigate', ownerId);
  showSmartNavigation.value = false;
};

const handleStatusNavigation = (status: string): void => {
  emit('statusNavigate', status);
  showSmartNavigation.value = false;
};
</script>

<style scoped>
.enhanced-navigation-toolbar {
  background: rgba(var(--v-theme-surface), 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(var(--v-theme-outline), 0.2);
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.year-navigation {
  justify-content: center;
  background: rgba(var(--v-theme-primary), 0.05);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

.month-navigation {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-radius: 8px;
  padding: 4px;
  border: 1px solid rgba(var(--v-theme-outline), 0.1);
}

.current-date-display {
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
  min-width: 160px;
  font-size: 0.95rem;
}

.view-toggle {
  border: 1px solid rgba(var(--v-theme-outline), 0.38);
  border-radius: 6px;
}

.keyboard-shortcuts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-top: 8px;
}

.shortcut-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
}

kbd {
  background: rgba(var(--v-theme-on-surface), 0.1);
  border: 1px solid rgba(var(--v-theme-on-surface), 0.2);
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 0.75rem;
  min-width: 40px;
  text-align: center;
}

/* Enhanced button interactions */
.enhanced-navigation-toolbar .v-btn {
  transition: all 0.2s ease;
}

.enhanced-navigation-toolbar .v-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.enhanced-navigation-toolbar .v-btn:active {
  transform: translateY(0px);
}

/* Year navigation special styling */
.year-navigation .v-chip {
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
}

.year-navigation .v-chip:hover {
  background: rgba(var(--v-theme-primary), 0.1);
  transform: scale(1.05);
}

/* Mobile responsive adjustments */
@media (max-width: 1280px) {
  .enhanced-navigation-toolbar .v-row {
    flex-direction: column;
    gap: 8px;
  }

  .enhanced-navigation-toolbar .v-col {
    margin-bottom: 8px !important;
  }

  .current-date-display {
    min-width: 120px;
    font-size: 0.875rem;
  }
}

@media (max-width: 600px) {
  .year-navigation,
  .month-navigation {
    scale: 0.9;
  }

  .current-date-display {
    min-width: 100px;
    font-size: 0.8rem;
  }

  .view-toggle .v-btn {
    min-width: 32px;
    padding: 0 8px;
  }

  .keyboard-shortcuts {
    grid-template-columns: 1fr;
  }
}
</style>
