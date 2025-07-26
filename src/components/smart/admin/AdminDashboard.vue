<template>
  <div class="admin-dashboard">
    <!-- Mobile Header with Sidebar Toggle -->
    <div
      v-if="mobile"
      class="mobile-header"
    >
      <v-app-bar
        color="surface"
        elevation="1"
        density="compact"
      >
        <v-btn
          icon="mdi-menu"
          @click="emit('toggleSidebar')"
        />
        <v-toolbar-title class="text-h6">
          Admin Dashboard
        </v-toolbar-title>
        <v-spacer />
        <v-btn
          icon="mdi-refresh"
          @click="refreshDashboard"
        />
      </v-app-bar>
    </div>

    <!-- Main Dashboard Content -->
    <div
      class="dashboard-content"
      :class="{ 'with-mobile-header': mobile }"
    >
      <!-- Header (Desktop only) -->
      <div
        v-if="!mobile"
        class="dashboard-header"
      >
        <v-container fluid>
          <v-row align="center">
            <v-col>
              <h1 class="text-h4 font-weight-bold mb-2">
                Admin Dashboard
              </h1>
              <p class="text-subtitle-1 text-medium-emphasis">
                {{ formattedDate }} • Manage your cleaning business operations
              </p>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                prepend-icon="mdi-refresh"
                @click="refreshDashboard"
              >
                Refresh Data
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Main Metrics -->
      <div class="metrics-section">
        <v-container fluid>
          <v-row>
            <v-col 
              v-for="metric in dashboardMetrics" 
              :key="metric.key"
              cols="6" 
              sm="6" 
              md="3"
              class="metric-col"
            >
              <v-card 
                class="metric-card" 
                :color="metric.color" 
                variant="tonal"
                :class="{ 'metric-card-mobile': mobile }"
              >
                <v-card-text class="text-center pa-2 pa-sm-3">
                  <v-icon 
                    :size="mobile ? 32 : 48" 
                    :color="metric.color" 
                    class="mb-1 mb-sm-2"
                  >
                    {{ metric.icon }}
                  </v-icon>
                  <div 
                    class="metric-value font-weight-bold"
                    :class="`text-${metric.color} ${mobile ? 'text-h5' : 'text-h3'}`"
                  >
                    {{ metric.value }}
                  </div>
                  <div :class="mobile ? 'text-caption' : 'text-subtitle-2'">
                    {{ metric.label }}
                  </div>
                  <v-divider class="my-1 my-sm-2" />
                  <div class="text-caption">
                    {{ metric.subtext }}
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Dashboard Widgets -->
      <div class="widgets-section">
        <v-container fluid>
          <v-row>
            <!-- Recent Activity -->
            <v-col
              cols="12"
              lg="6"
            >
              <v-card 
                class="dashboard-widget" 
                :height="mobile ? 300 : 400"
              >
                <v-card-title class="d-flex align-center pa-3 pa-sm-4">
                  <v-icon class="mr-2">
                    mdi-timeline-clock
                  </v-icon>
                  <span :class="mobile ? 'text-subtitle-1' : 'text-h6'">Recent Activity</span>
                  <v-spacer />
                  <v-btn
                    icon="mdi-open-in-new"
                    size="small"
                    variant="text"
                    @click="navigateTo('/admin/bookings')"
                  />
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-list :density="mobile ? 'compact' : 'default'">
                    <v-list-item
                      v-for="activity in recentActivities"
                      :key="activity.id"
                      class="activity-item"
                      :class="{ 'activity-item-mobile': mobile }"
                    >
                      <template #prepend>
                        <v-avatar
                          :color="activity.color"
                          :size="mobile ? 24 : 32"
                        >
                          <v-icon
                            :icon="activity.icon"
                            color="white"
                            :size="mobile ? 12 : 16"
                          />
                        </v-avatar>
                      </template>
                      
                      <div class="activity-content">
                        <div 
                          class="activity-title"
                          :class="mobile ? 'text-body-2' : 'text-body-1'"
                        >
                          {{ activity.title }}
                        </div>
                        <div 
                          class="activity-subtitle"
                          :class="mobile ? 'text-caption' : 'text-body-2'"
                        >
                          {{ activity.description }}
                        </div>
                        <div class="activity-time text-caption">
                          {{ activity.timeAgo }}
                        </div>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Revenue Chart -->
            <v-col
              cols="12"
              lg="6"
            >
              <v-card 
                class="dashboard-widget" 
                :height="mobile ? 300 : 400"
              >
                <v-card-title class="d-flex align-center pa-3 pa-sm-4">
                  <v-icon class="mr-2">
                    mdi-chart-line
                  </v-icon>
                  <span :class="mobile ? 'text-subtitle-1' : 'text-h6'">Revenue Overview</span>
                  <v-spacer />
                  <v-btn
                    icon="mdi-open-in-new"
                    size="small"
                    variant="text"
                    @click="navigateTo('/admin/reports')"
                  />
                </v-card-title>
                <v-card-text class="pa-2 pa-sm-4">
                  <div 
                    class="revenue-stats"
                    :class="{ 'revenue-stats-mobile': mobile }"
                  >
                    <div class="revenue-item">
                      <div class="revenue-label text-caption">
                        This Month
                      </div>
                      <div 
                        class="revenue-value text-success font-weight-bold"
                        :class="mobile ? 'text-body-1' : 'text-h6'"
                      >
                        ${{ dashboardData.revenueThisMonth.toLocaleString() }}
                      </div>
                    </div>
                    <div class="revenue-item">
                      <div class="revenue-label text-caption">
                        Last Month
                      </div>
                      <div 
                        class="revenue-value font-weight-bold"
                        :class="mobile ? 'text-body-1' : 'text-h6'"
                      >
                        ${{ dashboardData.revenueLastMonth.toLocaleString() }}
                      </div>
                    </div>
                    <div class="revenue-item">
                      <div class="revenue-label text-caption">
                        Growth
                      </div>
                      <div 
                        class="revenue-value font-weight-bold"
                        :class="`${revenueGrowth >= 0 ? 'text-success' : 'text-error'} ${mobile ? 'text-body-1' : 'text-h6'}`"
                      >
                        {{ revenueGrowth >= 0 ? '+' : '' }}{{ revenueGrowth.toFixed(1) }}%
                      </div>
                    </div>
                  </div>
                  
                  <!-- Placeholder for chart -->
                  <div
                    class="chart-placeholder"
                    :style="{ height: mobile ? '120px' : '160px' }"
                  >
                    <v-icon
                      :size="mobile ? 48 : 64"
                      color="grey-lighten-2"
                    >
                      mdi-chart-areaspline
                    </v-icon>
                    <p
                      class="text-center text-medium-emphasis mt-2"
                      :class="mobile ? 'text-caption' : 'text-body-2'"
                    >
                      Revenue chart visualization
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Property Status -->
            <v-col
              cols="12"
              lg="6"
            >
              <v-card 
                class="dashboard-widget" 
                :height="mobile ? 280 : 350"
              >
                <v-card-title class="d-flex align-center pa-3 pa-sm-4">
                  <v-icon class="mr-2">
                    mdi-home-analytics
                  </v-icon>
                  <span :class="mobile ? 'text-subtitle-1' : 'text-h6'">Property Status</span>
                  <v-spacer />
                  <v-btn
                    icon="mdi-open-in-new"
                    size="small"
                    variant="text"
                    @click="navigateTo('/admin/properties')"
                  />
                </v-card-title>
                <v-card-text class="pa-2 pa-sm-3">
                  <div 
                    class="property-status-grid"
                    :class="{ 'property-status-grid-mobile': mobile }"
                  >
                    <div class="status-item">
                      <div 
                        class="status-count text-success font-weight-bold"
                        :class="mobile ? 'text-h6' : 'text-h4'"
                      >
                        {{ dashboardData.propertiesActive }}
                      </div>
                      <div :class="mobile ? 'text-caption' : 'text-body-2'">
                        Active
                      </div>
                    </div>
                    <div class="status-item">
                      <div 
                        class="status-count text-warning font-weight-bold"
                        :class="mobile ? 'text-h6' : 'text-h4'"
                      >
                        {{ dashboardData.propertiesPending }}
                      </div>
                      <div :class="mobile ? 'text-caption' : 'text-body-2'">
                        Pending
                      </div>
                    </div>
                    <div class="status-item">
                      <div 
                        class="status-count text-info font-weight-bold"
                        :class="mobile ? 'text-h6' : 'text-h4'"
                      >
                        {{ dashboardData.propertiesScheduled }}
                      </div>
                      <div :class="mobile ? 'text-caption' : 'text-body-2'">
                        Scheduled
                      </div>
                    </div>
                    <div class="status-item">
                      <div 
                        class="status-count text-error font-weight-bold"
                        :class="mobile ? 'text-h6' : 'text-h4'"
                      >
                        {{ dashboardData.propertiesIssues }}
                      </div>
                      <div :class="mobile ? 'text-caption' : 'text-body-2'">
                        Issues
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Staff Performance -->
            <v-col
              cols="12"
              lg="6"
            >
              <v-card 
                class="dashboard-widget" 
                :height="mobile ? 280 : 350"
              >
                <v-card-title class="d-flex align-center pa-3 pa-sm-4">
                  <v-icon class="mr-2">
                    mdi-account-star
                  </v-icon>
                  <span :class="mobile ? 'text-subtitle-1' : 'text-h6'">Staff Performance</span>
                  <v-spacer />
                  <v-btn
                    icon="mdi-open-in-new"
                    size="small"
                    variant="text"
                    @click="navigateTo('/admin/cleaners')"
                  />
                </v-card-title>
                <v-card-text class="pa-1 pa-sm-2">
                  <v-list :density="mobile ? 'compact' : 'default'">
                    <v-list-item
                      v-for="cleaner in topPerformers"
                      :key="cleaner.id"
                      class="performer-item"
                      :class="{ 'performer-item-mobile': mobile }"
                    >
                      <template #prepend>
                        <v-avatar
                          color="primary"
                          :size="mobile ? 24 : 32"
                        >
                          <v-icon :size="mobile ? 14 : 16">
                            mdi-account
                          </v-icon>
                        </v-avatar>
                      </template>
                      
                      <div class="performer-content">
                        <div 
                          class="performer-name font-weight-medium"
                          :class="mobile ? 'text-body-2' : 'text-body-1'"
                        >
                          {{ cleaner.name }}
                        </div>
                        <div 
                          class="performer-stats"
                          :class="mobile ? 'text-caption' : 'text-body-2'"
                        >
                          {{ cleaner.completedJobs }} jobs • {{ cleaner.rating }}/5.0 rating
                        </div>
                      </div>
                      
                      <template #append>
                        <v-chip
                          :color="getPerformanceColor(cleaner.performance)"
                          :size="mobile ? 'x-small' : 'small'"
                          variant="flat"
                        >
                          {{ cleaner.performance }}%
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <!-- Calendar Preview Section -->
          <v-row class="mt-4">
            <v-col cols="12">
              <v-card class="dashboard-widget">
                <v-card-title class="d-flex align-center pa-3 pa-sm-4">
                  <v-icon class="mr-2">
                    mdi-calendar
                  </v-icon>
                  <span :class="mobile ? 'text-subtitle-1' : 'text-h6'">Calendar Overview</span>
                  <v-spacer />
                  <v-btn
                    color="primary"
                    variant="outlined"
                    size="small"
                    @click="navigateTo('/admin/schedule')"
                  >
                    <v-icon start>mdi-fullscreen</v-icon>
                    Full Calendar
                  </v-btn>
                </v-card-title>
                
                <v-card-text class="pa-2 pa-sm-4">
                  <!-- Calendar Preview Component -->
                  <div class="calendar-preview-container">
                    <AdminCalendar
                      :bookings="bookingStore.bookings"
                      :properties="propertyStore.properties"
                      :users="usersMap"
                      :loading="loading"
                      :preview-mode="true"
                      @date-select="handleCalendarDateSelect"
                      @event-click="handleCalendarEventClick"
                      @view-change="handleViewChange"
                      @date-change="handleDateChange"
                    />
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </div>
  </div>
</template>

<!-- This violate current project archetectute where HomaAdmin handles state flow (props) emits as described in project_summary.md -->

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import AdminCalendar from './AdminCalendar.vue';
import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement';
import { useBookingStore } from '@/stores/booking';
import { usePropertyStore } from '@/stores/property';

// Props & Emits
interface Emits {
  (e: 'toggleSidebar'): void;
}

const emit = defineEmits<Emits>();

// Composables
const router = useRouter();
const { mobile } = useDisplay();
const bookingStore = useBookingStore();
const propertyStore = usePropertyStore();
const { users: allUsers, fetchAllUsers } = useAdminUserManagement();

// Reactive state
const loading = ref(false);

// Create users Map for AdminCalendar
const usersMap = computed(() => {
  const map = new Map();
  allUsers.value.forEach(user => {
    map.set(user.id, user);
  });
  return map;
});

// Dashboard data (mock data)
const dashboardData = ref({
  totalProperties: 127,
  propertiesThisMonth: 8,
  activeBookings: 45,
  completedToday: 12,
  urgentTurns: 7,
  availableCleaners: 15,
  totalCleaners: 23,
  revenueThisMonth: 45750,
  revenueLastMonth: 42300,
  propertiesActive: 98,
  propertiesPending: 15,
  propertiesScheduled: 12,
  propertiesIssues: 2
});

// Dashboard metrics for the top cards
const dashboardMetrics = computed(() => [
  {
    key: 'properties',
    icon: 'mdi-home-city',
    color: 'primary',
    value: dashboardData.value.totalProperties,
    label: mobile.value ? 'Properties' : 'Total Properties',
    subtext: `+${dashboardData.value.propertiesThisMonth} this month`
  },
  {
    key: 'bookings',
    icon: 'mdi-calendar-check',
    color: 'success',
    value: dashboardData.value.activeBookings,
    label: mobile.value ? 'Bookings' : 'Active Bookings',
    subtext: `${dashboardData.value.completedToday} completed today`
  },
  {
    key: 'urgent',
    icon: 'mdi-alert-circle',
    color: 'warning',
    value: dashboardData.value.urgentTurns,
    label: mobile.value ? 'Urgent' : 'Urgent Turns',
    subtext: 'Need attention'
  },
  {
    key: 'cleaners',
    icon: 'mdi-account-hard-hat',
    color: 'info',
    value: dashboardData.value.availableCleaners,
    label: mobile.value ? 'Available' : 'Available Cleaners',
    subtext: `${dashboardData.value.totalCleaners} total cleaners`
  }
]);

// Recent activities (mock data)
const recentActivities = ref([
  {
    id: '1',
    title: 'New booking created',
    description: 'Sunset Villa - Turn cleaning scheduled',
    timeAgo: '5 min ago',
    color: 'success',
    icon: 'mdi-calendar-plus'
  },
  {
    id: '2',
    title: 'Cleaner assigned',
    description: 'Sarah J. assigned to Ocean View Apt',
    timeAgo: '15 min ago',
    color: 'primary',
    icon: 'mdi-account-check'
  },
  {
    id: '3',
    title: 'Booking completed',
    description: 'Mountain Lodge cleaning finished',
    timeAgo: '1 hr ago',
    color: 'success',
    icon: 'mdi-check-circle'
  }
]);

// Top performers (mock data)
const topPerformers = ref([
  {
    id: '1',
    name: 'Sarah Johnson',
    completedJobs: 48,
    rating: 4.9,
    performance: 98
  },
  {
    id: '2',
    name: 'Mike Chen',
    completedJobs: 42,
    rating: 4.8,
    performance: 95
  },
  {
    id: '3',
    name: 'Emma Davis',
    completedJobs: 39,
    rating: 4.7,
    performance: 92
  }
]);

// Computed properties
const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

const revenueGrowth = computed(() => {
  const current = dashboardData.value.revenueThisMonth;
  const previous = dashboardData.value.revenueLastMonth;
  return ((current - previous) / previous) * 100;
});

// Methods
const refreshDashboard = () => {
  loading.value = true;
  // TODO: Implement actual data refresh
  setTimeout(() => {
    loading.value = false;
  }, 1000);
};

const navigateTo = (path: string) => {
  router.push(path);
};

const getPerformanceColor = (performance: number) => {
  if (performance >= 95) return 'success';
  if (performance >= 85) return 'primary';
  if (performance >= 75) return 'warning';
  return 'error';
};

// Calendar preview handlers
const handleCalendarDateSelect = (selectInfo: any) => {
  // Navigate to full calendar with date selection
  router.push(`/admin/schedule?date=${selectInfo.startStr}&action=create`);
};

const handleCalendarEventClick = (clickInfo: any) => {
  // Navigate to full calendar with event selected
  const booking = clickInfo.event.extendedProps.booking;
  router.push(`/admin/schedule?booking=${booking.id}`);
};

const handleViewChange = (view: string) => {
  console.log('Calendar view changed:', view);
};

const handleDateChange = (date: Date) => {
  console.log('Calendar date changed:', date);
};

// Lifecycle
onMounted(async () => {
  console.log('Admin dashboard component mounted');
  
  // Load calendar data for preview
  try {
    await Promise.all([
      fetchAllUsers(),
      bookingStore.fetchBookings(),
      propertyStore.fetchProperties()
    ]);
    console.log('✅ [AdminDashboard] Calendar data loaded for preview');
  } catch (error) {
    console.error('❌ [AdminDashboard] Failed to fetch calendar data:', error);
  }
});
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.mobile-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

.dashboard-content {
  min-height: 100vh;
}

.dashboard-content.with-mobile-header {
  padding-top: 0;
}

.dashboard-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 24px 0;
}

.metrics-section {
  padding: 16px 0 32px 0;
}

.metric-col {
  padding: 4px 8px;
}

.metric-card {
  height: 100%;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-4px);
}

.metric-card-mobile {
  min-height: 100px;
}

.metric-card-mobile .v-card-text {
  padding: 8px !important;
}

.widgets-section {
  padding-bottom: 32px;
}

.dashboard-widget {
  transition: transform 0.2s;
  margin-bottom: 16px;
}

.dashboard-widget:hover {
  transform: translateY(-2px);
}

.activity-item {
  border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.5);
  padding: 12px 16px;
}

.activity-item-mobile {
  padding: 8px 12px;
}

.activity-content {
  flex: 1;
}

.activity-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.activity-subtitle {
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 2px;
}

.activity-time {
  color: rgb(var(--v-theme-outline));
}

.revenue-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.revenue-stats-mobile {
  gap: 8px;
  margin-bottom: 16px;
}

.revenue-item {
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  background: rgba(var(--v-theme-surface-variant), 0.5);
}

.revenue-label {
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 4px;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(var(--v-theme-outline), 0.3);
  border-radius: 8px;
}

.property-status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.property-status-grid-mobile {
  gap: 8px;
}

.status-item {
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.performer-item {
  border-bottom: 1px solid rgba(var(--v-theme-surface-variant), 0.5);
  padding: 12px 8px;
}

.performer-item-mobile {
  padding: 8px 4px;
}

.performer-content {
  flex: 1;
}

.performer-name {
  margin-bottom: 4px;
}

.performer-stats {
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Mobile specific adjustments */
@media (max-width: 599px) {
  .metrics-section {
    padding: 8px 0 16px 0;
  }
  
  .metric-col {
    padding: 2px 4px;
  }
  
  .revenue-stats {
    grid-template-columns: 1fr;
    gap: 6px;
    margin-bottom: 12px;
  }
  
  .property-status-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .status-item {
    padding: 12px;
  }
  
  .dashboard-widget {
    margin-bottom: 8px;
  }
}

/* Calendar Preview Styles */
.calendar-preview-container {
  height: 500px;
  overflow: hidden;
}

.calendar-preview-container :deep(.fc) {
  height: 100%;
}

.calendar-preview-container :deep(.fc-toolbar-chunk) {
  display: flex;
  align-items: center;
}

@media (max-width: 960px) {
  .calendar-preview-container {
    height: 400px;
  }
}

@media (max-width: 600px) {
  .calendar-preview-container {
    height: 300px;
  }
}
</style>