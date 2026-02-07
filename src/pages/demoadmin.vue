<template>
  <v-app>
    <!-- Dark Sidebar -->
    <DashboardSidebar
      v-model="drawerOpen"
      permanent
      dark
      brand-name="MATERIO"
      brand-subtitle="Admin"
      :active-route="'/demoadmin'"
      :groups="sidebarGroups"
      @navigate="(to: string) => $router.push(to)"
    />

    <!-- Top Bar -->
    <v-app-bar
      flat
      color="white"
      border="b"
    >
      <v-app-bar-nav-icon @click="drawerOpen = !drawerOpen" />
      <v-text-field
        placeholder="Search bookings, properties..."
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        density="compact"
        hide-details
        single-line
        class="mx-4"
        style="max-width: 400px"
      />
      <v-spacer />
      <v-btn
        icon
        variant="text"
        size="small"
      >
        <v-icon>mdi-translate</v-icon>
      </v-btn>
      <v-btn
        icon
        variant="text"
        size="small"
      >
        <v-icon>mdi-apps</v-icon>
      </v-btn>
      <v-btn
        icon
        variant="text"
        size="small"
      >
        <v-badge
          color="error"
          content="4"
          dot
        >
          <v-icon>mdi-bell-outline</v-icon>
        </v-badge>
      </v-btn>
      <v-avatar
        color="primary"
        size="34"
        class="ml-3 mr-2"
      >
        <span class="text-caption font-weight-bold text-white">JD</span>
      </v-avatar>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container
        fluid
        class="pa-6"
      >
        <!-- Row 1: Welcome Banner + Trend Chart -->
        <v-row class="mb-2">
          <v-col
            cols="12"
            lg="5"
          >
            <WelcomeBanner
              user-name="Jonathan"
              :stats="{ newBookings: 54, activeTurns: 4, completedToday: 12 }"
            />
          </v-col>
          <v-col
            cols="12"
            lg="7"
          >
            <TrendChart
              title="Total Bookings"
              subtitle="Weekly booking activity"
              :data="[18, 32, 24, 45, 38, 52, 41]"
              :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']"
              :filters="['This Week', 'This Month']"
            />
          </v-col>
        </v-row>

        <!-- Row 2: Stats Cards -->
        <StatsCardGrid
          :cards="statsCards"
          class="mb-6"
        />

        <!-- Row 3: Calendar + Event Filters -->
        <v-row class="mb-6">
          <v-col
            cols="12"
            lg="3"
          >
            <!-- Mini Calendar + Filters -->
            <v-card class="mb-4">
              <v-card-text class="pa-4">
                <v-btn
                  color="primary"
                  block
                  prepend-icon="mdi-plus"
                  class="mb-4"
                  style="background: linear-gradient(135deg, #7C6DF0, #9B8AFB)"
                >
                  Add Event
                </v-btn>
                <!-- Mini date picker -->
                <v-date-picker
                  v-model="selectedDate"
                  color="primary"
                  hide-header
                  show-adjacent-months
                  density="compact"
                  class="mini-calendar"
                />
              </v-card-text>
            </v-card>
            <v-card>
              <v-card-title class="text-subtitle-2 font-weight-bold">
                Event Filters
              </v-card-title>
              <v-card-text class="pt-0">
                <div
                  v-for="filter in eventFilters"
                  :key="filter.label"
                  class="d-flex align-center mb-2"
                >
                  <v-checkbox
                    v-model="filter.active"
                    :color="filter.color"
                    density="compact"
                    hide-details
                    class="mr-2 flex-grow-0"
                  />
                  <div
                    class="rounded-circle mr-2"
                    :style="{
                      width: '10px',
                      height: '10px',
                      backgroundColor: filter.color,
                    }"
                  />
                  <span class="text-body-2">{{ filter.label }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            cols="12"
            lg="9"
          >
            <!-- Main Calendar -->
            <v-card>
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center ga-2">
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="prevMonth"
                  >
                    <v-icon>mdi-chevron-left</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="nextMonth"
                  >
                    <v-icon>mdi-chevron-right</v-icon>
                  </v-btn>
                  <span class="text-h6 font-weight-bold ml-2">
                    {{ monthLabel }}
                  </span>
                </div>
                <v-btn-toggle
                  v-model="calendarView"
                  density="compact"
                  variant="outlined"
                  divided
                  mandatory
                >
                  <v-btn
                    value="month"
                    size="small"
                  >
                    Month
                  </v-btn>
                  <v-btn
                    value="week"
                    size="small"
                  >
                    Week
                  </v-btn>
                  <v-btn
                    value="day"
                    size="small"
                  >
                    Day
                  </v-btn>
                  <v-btn
                    value="list"
                    size="small"
                  >
                    List
                  </v-btn>
                </v-btn-toggle>
              </v-card-title>
              <v-divider />
              <v-card-text class="pa-0">
                <!-- Calendar Grid -->
                <table class="calendar-grid">
                  <thead>
                    <tr>
                      <th
                        v-for="day in weekDays"
                        :key="day"
                      >
                        {{ day }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(week, wi) in calendarWeeks"
                      :key="wi"
                    >
                      <td
                        v-for="(day, di) in week"
                        :key="di"
                        :class="{
                          'other-month': !day.currentMonth,
                          'is-today': day.isToday,
                        }"
                      >
                        <div class="day-number">
                          {{ day.date }}
                        </div>
                        <div
                          v-for="(event, ei) in day.events"
                          :key="ei"
                          class="calendar-event"
                          :style="{ backgroundColor: event.color + '20', color: event.color, borderLeft: `3px solid ${event.color}` }"
                        >
                          {{ event.title }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Row 4: Recent Items + Upcoming Schedule -->
        <v-row>
          <v-col
            cols="12"
            lg="7"
          >
            <RecentItemsList
              title="Recent Bookings"
              action-text="View All"
              :items="recentBookings"
              @action="$router.push('/admin/bookings')"
            />
          </v-col>
          <v-col
            cols="12"
            lg="5"
          >
            <UpcomingScheduleCard
              title="Upcoming Schedule"
              :tabs="scheduleTabs"
            />
          </v-col>
        </v-row>

        <!-- Footer -->
        <div class="d-flex align-center justify-space-between mt-8 text-caption text-medium-emphasis">
          <span>© 2026 Made With ❤️ by BookingApp</span>
          <div class="d-flex ga-4">
            <a
              href="#"
              class="text-decoration-none text-medium-emphasis"
            >License</a>
            <a
              href="#"
              class="text-decoration-none text-medium-emphasis"
            >Documentation</a>
            <a
              href="#"
              class="text-decoration-none text-medium-emphasis"
            >Support</a>
          </div>
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DashboardSidebar from '@/components/dumb/shared/DashboardSidebar.vue'
import WelcomeBanner from '@/components/dumb/shared/WelcomeBanner.vue'
import StatsCardGrid from '@/components/dumb/shared/StatsCardGrid.vue'
import TrendChart from '@/components/dumb/shared/TrendChart.vue'
import RecentItemsList from '@/components/dumb/shared/RecentItemsList.vue'
import UpcomingScheduleCard from '@/components/dumb/shared/UpcomingScheduleCard.vue'

const drawerOpen = ref(true)
const selectedDate = ref<Date | null>(null)
const calendarView = ref('month')
const currentMonth = ref(new Date(2026, 1, 1)) // February 2026

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const monthLabel = computed(() => {
  return currentMonth.value.toLocaleString('default', { month: 'long', year: 'numeric' })
})

function prevMonth() {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() - 1)
  currentMonth.value = d
}

function nextMonth() {
  const d = new Date(currentMonth.value)
  d.setMonth(d.getMonth() + 1)
  currentMonth.value = d
}

interface CalendarEvent {
  title: string
  color: string
}

interface CalendarDay {
  date: number
  currentMonth: boolean
  isToday: boolean
  events: CalendarEvent[]
}

const sampleEvents: Record<string, CalendarEvent[]> = {
  '2026-02-01': [{ title: 'CS Visa Design Review', color: '#7C6DF0' }],
  '2026-02-05': [{ title: 'Don Grossi', color: '#FF9800' }],
  '2026-02-10': [{ title: "Doctor's Appointment", color: '#4CAF50' }],
  '2026-02-11': [{ title: 'Meeting With Client', color: '#2196F3' }],
  '2026-02-14': [{ title: 'Family Trip', color: '#E91E63' }],
  '2026-02-20': [{ title: 'Cleaning Turn', color: '#00BCD4' }],
  '2026-02-28': [{ title: 'Monthly Meeting', color: '#7C6DF0' }],
}

const calendarWeeks = computed<CalendarDay[][]>(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const today = new Date()

  const weeks: CalendarDay[][] = []
  let week: CalendarDay[] = []

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    week.push({ date: daysInPrevMonth - i, currentMonth: false, isToday: false, events: [] })
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
    week.push({
      date: d,
      currentMonth: true,
      isToday,
      events: sampleEvents[dateStr] ?? [],
    })
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }

  // Next month days
  let nextDay = 1
  while (week.length < 7 && week.length > 0) {
    week.push({ date: nextDay++, currentMonth: false, isToday: false, events: [] })
  }
  if (week.length) weeks.push(week)

  return weeks
})

const eventFilters = ref([
  { label: 'Check-in', color: '#4CAF50', active: true },
  { label: 'Personal', color: '#FF9800', active: true },
  { label: 'Business', color: '#2196F3', active: true },
  { label: 'Family', color: '#E91E63', active: true },
  { label: 'Holiday', color: '#00BCD4', active: true },
  { label: 'ETC', color: '#9E9E9E', active: true },
])

const sidebarGroups = [
  {
    title: 'Dashboards',
    items: [
      {
        label: 'Dashboards',
        icon: 'mdi-view-dashboard',
        children: [
          { label: 'eCommerce', to: '/demoadmin' },
          { label: 'Analytics', to: '/admin/reports' },
        ],
      },
    ],
  },
  {
    items: [
      { label: 'Chat', icon: 'mdi-message-outline' },
      { label: 'Calendar', icon: 'mdi-calendar-blank', to: '/demoadmin' },
      { label: 'Kanban', icon: 'mdi-view-column-outline' },
      { label: 'Invoice', icon: 'mdi-file-document-outline', to: '/invoice' },
      {
        label: 'User',
        icon: 'mdi-account-outline',
        children: [
          { label: 'All Users', to: '/admin/users' },
          { label: 'Property Owners', to: '/admin/property-owners' },
        ],
      },
      {
        label: 'Roles & Permissions',
        icon: 'mdi-shield-account-outline',
        children: [
          { label: 'Roles', to: '/admin/users' },
          { label: 'Permissions' },
        ],
      },
      {
        label: 'Pages',
        icon: 'mdi-file-outline',
        children: [
          { label: 'Authentication' },
          { label: 'Wizard Examples' },
          { label: 'Dialog Examples' },
        ],
      },
    ],
  },
  {
    title: 'UI Elements',
    items: [
      { label: 'Typography', icon: 'mdi-format-text' },
      { label: 'Icons', icon: 'mdi-star-outline' },
      { label: 'Cards', icon: 'mdi-card-outline' },
      { label: 'Components', icon: 'mdi-puzzle-outline' },
      { label: 'Extensions', icon: 'mdi-package-variant' },
    ],
  },
  {
    title: 'Forms & Tables',
    items: [
      { label: 'Form Elements', icon: 'mdi-form-textbox' },
      { label: 'Form Layouts', icon: 'mdi-page-layout-body' },
      { label: 'Form Wizard', icon: 'mdi-wizard-hat' },
      { label: 'Form Validation', icon: 'mdi-check-decagram-outline' },
      { label: 'Tables', icon: 'mdi-table' },
    ],
  },
  {
    title: 'Charts',
    items: [
      { label: 'Charts', icon: 'mdi-chart-bar' },
    ],
  },
]

const statsCards = [
  { title: 'Properties', value: '24', subtitle: '3 new this month', trend: '+12%', color: 'primary', icon: 'mdi-home-group' },
  { title: 'Customers', value: '6,390', subtitle: 'Last Year', trend: '+26%', color: 'success', icon: 'mdi-account-group' },
  { title: 'Bookings', value: '12,460', subtitle: 'Last Month', trend: '+18%', color: 'info', icon: 'mdi-calendar-check' },
  { title: 'Turns Today', value: '432', subtitle: '28 pending', trend: '↑ 8%', color: 'warning', icon: 'mdi-swap-horizontal' },
]

const recentBookings = [
  { name: '3330 Savanna Trail', subtitle: 'Palm Springs, CA · Check-in Feb 3', value: '$1,200', status: 'Confirmed', statusColor: 'success', icon: 'mdi-home' },
  { name: '1245 Desert Rose Dr', subtitle: 'Cathedral City, CA · Check-in Feb 5', value: '$890', status: 'Pending', statusColor: 'warning', icon: 'mdi-home' },
  { name: '789 Wishing Well Trl', subtitle: 'Palm Springs, CA · Turn Feb 2', value: '$150', status: 'Turn', statusColor: 'info', icon: 'mdi-swap-horizontal' },
  { name: '456 Mountain View', subtitle: 'Rancho Mirage, CA · Check-in Feb 6', value: '$2,100', status: 'Confirmed', statusColor: 'success', icon: 'mdi-home' },
  { name: '102 Sunrise Blvd', subtitle: 'Palm Desert, CA · Check-in Feb 7', value: '$750', status: 'Cancelled', statusColor: 'error', icon: 'mdi-home' },
]

const scheduleTabs = [
  {
    label: 'Checkouts',
    items: [
      { title: 'Savanna Trail · Guest: Hobbs', subtitle: '10:00 AM · 2 nights', icon: 'mdi-logout', iconColor: 'error' },
      { title: 'Desert Rose Dr · Guest: Miller', subtitle: '11:00 AM · 5 nights', icon: 'mdi-logout', iconColor: 'error' },
      { title: 'Mountain View · Guest: Chen', subtitle: '12:00 PM · 3 nights', icon: 'mdi-logout', iconColor: 'error' },
    ],
  },
  {
    label: 'Check-ins',
    items: [
      { title: 'Wishing Well Trl · Guest: Davis', subtitle: '3:00 PM · 4 nights', icon: 'mdi-login', iconColor: 'success' },
      { title: 'Sunrise Blvd · Guest: Wilson', subtitle: '4:00 PM · 2 nights', icon: 'mdi-login', iconColor: 'success' },
    ],
  },
  {
    label: 'Turns',
    items: [
      { title: 'Savanna Trail · Cleaner: Maria', subtitle: '11:30 AM · Deep clean', icon: 'mdi-broom', iconColor: 'primary' },
      { title: 'Desert Rose Dr · Cleaner: Carlos', subtitle: '1:00 PM · Standard', icon: 'mdi-broom', iconColor: 'primary' },
    ],
  },
]
</script>

<style scoped>
.calendar-grid {
  width: 100%;
  border-collapse: collapse;
}

.calendar-grid th {
  padding: 12px 8px;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid #eee;
}

.calendar-grid td {
  padding: 6px;
  vertical-align: top;
  height: 100px;
  width: 14.28%;
  border: 1px solid #f0f0f0;
  transition: background-color 0.15s;
}

.calendar-grid td:hover {
  background-color: rgba(124, 109, 240, 0.04);
}

.day-number {
  font-size: 0.82rem;
  font-weight: 500;
  padding: 2px 6px;
  margin-bottom: 4px;
}

.is-today .day-number {
  background: #7C6DF0;
  color: #fff;
  border-radius: 50%;
  display: inline-block;
  width: 26px;
  height: 26px;
  line-height: 22px;
  text-align: center;
}

.other-month {
  opacity: 0.35;
}

.calendar-event {
  font-size: 0.7rem;
  padding: 2px 6px;
  margin-bottom: 2px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.mini-calendar {
  width: 100% !important;
}

.mini-calendar :deep(.v-date-picker-month) {
  padding: 0;
}
</style>
