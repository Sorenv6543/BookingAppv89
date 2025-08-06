<template>
  <div class="admin-dashboard">
    <!-- Main Content -->
    <div class="dashboard-content">
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
                Business overview and upcoming schedule management
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

      <!-- Overview Cards -->
      <div class="overview-cards">
        <v-container fluid>
          <v-row>
            <!-- Properties Card -->
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="overview-card h-100"
                elevation="2"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <v-icon
                      color="primary"
                      size="40"
                    >
                      mdi-home-city
                    </v-icon>
                    <v-chip
                      :color="propertiesData.activeProperties > 0 ? 'success' : 'warning'"
                      size="small"
                      variant="flat"
                    >
                      {{ propertiesData.activeProperties }} Active
                    </v-chip>
                  </div>
                  <div class="mb-2">
                    <div class="text-h5 font-weight-bold text-primary">
                      {{ propertiesData.totalProperties }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Properties
                    </div>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2">Currently Booked:</span>
                    <span class="text-body-2 font-weight-bold">
                      {{ propertiesData.bookedProperties }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Clients Card -->
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="overview-card h-100"
                elevation="2"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <v-icon
                      color="info"
                      size="40"
                    >
                      mdi-account-group
                    </v-icon>
                    <v-chip
                      color="info"
                      size="small"
                      variant="flat"
                    >
                      Property Owners
                    </v-chip>
                  </div>
                  <div class="mb-2">
                    <div class="text-h5 font-weight-bold text-info">
                      {{ clientsData.totalClients }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Clients
                    </div>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2">Active This Month:</span>
                    <span class="text-body-2 font-weight-bold">
                      {{ clientsData.activeThisMonth }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Total Checkouts Card -->
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="overview-card h-100"
                elevation="2"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <v-icon
                      color="success"
                      size="40"
                    >
                      mdi-calendar-check
                    </v-icon>
                    <v-chip
                      color="success"
                      size="small"
                      variant="flat"
                    >
                      All Bookings
                    </v-chip>
                  </div>
                  <div class="mb-2">
                    <div class="text-h5 font-weight-bold text-success">
                      {{ bookingsData.totalCheckouts }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Checkouts
                    </div>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2">This Week:</span>
                    <span class="text-body-2 font-weight-bold">
                      {{ bookingsData.checkoutsThisWeek }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Total Turns Card -->
            <v-col
              cols="12"
              sm="6"
              md="3"
            >
              <v-card
                class="overview-card h-100"
                elevation="2"
              >
                <v-card-text class="pa-4">
                  <div class="d-flex align-center justify-space-between mb-3">
                    <v-icon
                      color="warning"
                      size="40"
                    >
                      mdi-fire
                    </v-icon>
                    <v-chip
                      :color="bookingsData.urgentTurns > 0 ? 'error' : 'warning'"
                      size="small"
                      variant="flat"
                    >
                      {{ bookingsData.urgentTurns }} Urgent
                    </v-chip>
                  </div>
                  <div class="mb-2">
                    <div class="text-h5 font-weight-bold text-warning">
                      {{ bookingsData.totalTurns }}
                    </div>
                    <div class="text-caption text-medium-emphasis">
                      Total Turns
                    </div>
                  </div>
                  <v-divider class="my-2" />
                  <div class="d-flex justify-space-between">
                    <span class="text-body-2">This Week:</span>
                    <span class="text-body-2 font-weight-bold">
                      {{ bookingsData.turnsThisWeek }}
                    </span>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Calendar Preview Section -->
      <div class="calendar-preview-section">
        <v-container fluid>
          <v-row>
            <v-col cols="12">
              <v-card
                class="calendar-preview-card"
                elevation="2"
              >
                <v-card-title class="d-flex align-center justify-space-between pa-4">
                  <!-- Calendar Navigation -->
                  <div class="d-flex align-center justify-space-between flex-grow-1">
                    <!-- Previous Month Button -->
                    <v-btn
                      icon="mdi-chevron-left"
                      variant="text"
                      size="small"
                      @click="navigateToPreviousMonth"
                    />
                    
                    <!-- Month and Year Display -->
                    <div class="calendar-month-year">
                      <h3 class="text-h6 font-weight-bold">
                        {{ getCurrentMonthYear() }}
                      </h3>
                    </div>
                    
                    <!-- Next Month Button -->
                    <v-btn
                      icon="mdi-chevron-right"
                      variant="text"
                      size="small"
                      @click="navigateToNextMonth"
                    />
                  </div>
                  
                  <!-- Master Schedule Button -->
                  <v-btn
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-calendar-search"
                    size="small"
                    class="ms-4"
                    @click="goToMasterSchedule"
                  >
                    Open Full Calendar
                  </v-btn>
                </v-card-title>
                
                <v-card-text>
                  <v-row>
                    <!-- Mini Calendar -->
                    <v-col
                      cols="12"
                      md="4"
                    >
                      <div class="mini-calendar">
                        <div class="calendar-grid">
                          <div class="calendar-header">
                            <div
                              v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
                              :key="day"
                              class="day-header"
                            >
                              {{ day }}
                            </div>
                          </div>
                          <div class="calendar-body">
                            <div
                              v-for="day in getCalendarDays()"
                              :key="day.date"
                              class="calendar-day"
                              :class="{
                                'today': day.isToday,
                                'has-bookings': day.bookingCount > 0,
                                'has-turns': day.turnCount > 0,
                                'other-month': !day.isCurrentMonth
                              }"
                            >
                              <span class="day-number">{{ day.day }}</span>
                              <div
                                v-if="day.bookingCount > 0"
                                class="booking-dots"
                              >
                                <div
                                  v-for="n in Math.min(day.bookingCount, 3)"
                                  :key="n"
                                  class="booking-dot"
                                  :class="{ 'turn-dot': day.turnCount > 0 && n <= day.turnCount }"
                                />
                                <span
                                  v-if="day.bookingCount > 3"
                                  class="more-indicator"
                                >
                                  +{{ day.bookingCount - 3 }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-col>

                    <!-- Schedule Insights -->
                    <v-col
                      cols="12"
                      md="8"
                    >
                      <div class="schedule-insights">
                        <h3 class="text-h6 font-weight-bold mb-3">
                          Weekly Schedule Insights
                        </h3>
                        
                        <!-- This Week Summary -->
                        <v-row class="mb-4">
                          <v-col
                            cols="6"
                            md="3"
                          >
                            <div class="insight-card">
                              <div class="insight-value text-primary">
                                {{ getWeeklyStats().totalBookings }}
                              </div>
                              <div class="insight-label">
                                This Week
                              </div>
                            </div>
                          </v-col>
                          <v-col
                            cols="6"
                            md="3"
                          >
                            <div class="insight-card">
                              <div class="insight-value text-warning">
                                {{ getWeeklyStats().turns }}
                              </div>
                              <div class="insight-label">
                                Turns
                              </div>
                            </div>
                          </v-col>
                          <v-col
                            cols="6"
                            md="3"
                          >
                            <div class="insight-card">
                              <div class="insight-value text-success">
                                {{ getWeeklyStats().completed }}
                              </div>
                              <div class="insight-label">
                                Completed
                              </div>
                            </div>
                          </v-col>
                          <v-col
                            cols="6"
                            md="3"
                          >
                            <div class="insight-card">
                              <div class="insight-value text-info">
                                {{ getWeeklyStats().upcoming }}
                              </div>
                              <div class="insight-label">
                                Upcoming
                              </div>
                            </div>
                          </v-col>
                        </v-row>

                        <!-- Quick Schedule Overview -->
                        <div class="schedule-overview">
                          <h4 class="text-body-1 font-weight-medium mb-2">
                            Today's Schedule
                          </h4>
                          <div
                            v-if="getTodaySchedule().length === 0"
                            class="text-body-2 text-medium-emphasis"
                          >
                            No bookings scheduled for today
                          </div>
                          <div
                            v-else
                            class="today-schedule"
                          >
                            <div
                              v-for="booking in getTodaySchedule().slice(0, 3)"
                              :key="booking.id"
                              class="schedule-item"
                            >
                              <v-chip
                                :color="booking.booking_type === 'turn' ? 'warning' : 'primary'"
                                size="small"
                                variant="flat"
                                class="me-2"
                              >
                                {{ formatTime(booking.guest_arrival_date) }}
                              </v-chip>
                              <span class="text-body-2">
                                {{ getPropertyName(booking.property_id) }}
                              </span>
                              <v-chip
                                v-if="booking.booking_type === 'turn'"
                                color="error"
                                size="x-small"
                                variant="flat"
                                class="ms-2"
                              >
                                TURN
                              </v-chip>
                            </div>
                            <div
                              v-if="getTodaySchedule().length > 3"
                              class="text-caption text-medium-emphasis mt-2"
                            >
                              +{{ getTodaySchedule().length - 3 }} more bookings
                            </div>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Upcoming Bookings Section -->
      <div class="upcoming-section">
        <v-container fluid>
          <!-- Section Header -->
          <v-row>
            <v-col>
              <div class="d-flex align-center justify-space-between mb-4">
                <h2 class="text-h5 font-weight-bold">
                  Upcoming Bookings & Turns
                </h2>
                <v-btn-toggle
                  v-model="selectedTimeFilter"
                  variant="outlined"
                  mandatory
                  density="compact"
                >
                  <v-btn value="today">
                    Today
                  </v-btn>
                  <v-btn value="tomorrow">
                    Tomorrow
                  </v-btn>
                  <v-btn value="week">
                    Next 7 Days
                  </v-btn>
                </v-btn-toggle>
              </div>
            </v-col>
          </v-row>

          <!-- Time Period Content -->
          <v-row>
            <!-- Checkouts Column -->
            <v-col
              cols="12"
              md="6"
            >
              <v-card
                class="upcoming-card"
                elevation="1"
              >
                <v-card-title class="d-flex align-center">
                  <v-icon
                    color="success"
                    class="me-2"
                  >
                    mdi-exit-to-app
                  </v-icon>
                  Checkouts {{ timeFilterLabel }}
                  <v-spacer />
                  <v-chip
                    color="success"
                    size="small"
                    variant="flat"
                  >
                    {{ filteredCheckouts.length }}
                  </v-chip>
                </v-card-title>
                
                <v-card-text class="pa-0">
                  <div
                    v-if="filteredCheckouts.length === 0"
                    class="text-center py-6"
                  >
                    <v-icon
                      size="48"
                      color="grey-lighten-1"
                    >
                      mdi-calendar-blank
                    </v-icon>
                    <p class="text-body-1 text-medium-emphasis mt-2">
                      No checkouts {{ timeFilterLabel.toLowerCase() }}
                    </p>
                  </div>

                  <div
                    v-else
                    class="bookings-list"
                  >
                    <v-list density="compact">
                      <v-list-item
                        v-for="checkout in filteredCheckouts"
                        :key="checkout.id"
                        class="booking-item"
                      >
                        <template #prepend>
                          <v-avatar
                            color="success"
                            size="40"
                          >
                            <v-icon color="white">
                              mdi-exit-to-app
                            </v-icon>
                          </v-avatar>
                        </template>

                        <v-list-item-title class="font-weight-medium">
                          {{ getPropertyName(checkout.property_id) }}
                        </v-list-item-title>
                        
                        <v-list-item-subtitle class="booking-details">
                          <div class="text-body-2 mb-1">
                            📍 {{ getPropertyAddress(checkout.property_id) }}
                          </div>
                          <div class="d-flex align-center flex-wrap gap-2">
                            <v-chip
                              size="x-small"
                              color="primary"
                              variant="flat"
                            >
                              🕐 {{ formatTime(checkout.guest_departure_date) }}
                            </v-chip>
                            <v-chip
                              size="x-small"
                              color="info"
                              variant="flat"
                            >
                              👥 {{ checkout.guest_count || 'N/A' }} guests
                            </v-chip>
                            <v-chip
                              size="x-small"
                              color="warning"
                              variant="flat"
                            >
                              ➡️ Check-in: {{ getNextCheckinDays(checkout) }}
                            </v-chip>
                          </div>
                        </v-list-item-subtitle>

                        <template #append>
                          <v-btn
                            icon="mdi-eye"
                            size="small"
                            variant="text"
                            @click="viewBooking(checkout)"
                          />
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- Turns Column -->
            <v-col
              cols="12"
              md="6"
            >
              <v-card
                class="upcoming-card"
                elevation="1"
              >
                <v-card-title class="d-flex align-center">
                  <v-icon
                    color="warning"
                    class="me-2"
                  >
                    mdi-fire
                  </v-icon>
                  Turns {{ timeFilterLabel }}
                  <v-spacer />
                  <v-chip
                    :color="filteredTurns.length > 0 ? 'warning' : 'success'"
                    size="small"
                    variant="flat"
                  >
                    {{ filteredTurns.length }}
                  </v-chip>
                </v-card-title>
                
                <v-card-text class="pa-0">
                  <div
                    v-if="filteredTurns.length === 0"
                    class="text-center py-6"
                  >
                    <v-icon
                      size="48"
                      color="grey-lighten-1"
                    >
                      mdi-calendar-check
                    </v-icon>
                    <p class="text-body-1 text-medium-emphasis mt-2">
                      No turns {{ timeFilterLabel.toLowerCase() }}
                    </p>
                  </div>

                  <div
                    v-else
                    class="bookings-list"
                  >
                    <v-list density="compact">
                      <v-list-item
                        v-for="turn in filteredTurns"
                        :key="turn.id"
                        class="booking-item turn-item"
                      >
                        <template #prepend>
                          <v-avatar
                            :color="getTurnUrgencyColor(turn)"
                            size="40"
                          >
                            <v-icon color="white">
                              mdi-fire
                            </v-icon>
                          </v-avatar>
                        </template>

                        <v-list-item-title class="font-weight-medium">
                          {{ getPropertyName(turn.property_id) }}
                        </v-list-item-title>
                        
                        <v-list-item-subtitle class="booking-details">
                          <div class="text-body-2 mb-1">
                            📍 {{ getPropertyAddress(turn.property_id) }}
                          </div>
                          <div class="d-flex align-center flex-wrap gap-2">
                            <v-chip
                              size="x-small"
                              color="error"
                              variant="flat"
                            >
                              ⚡ {{ getCleaningWindow(turn) }}
                            </v-chip>
                            <v-chip
                              size="x-small"
                              color="primary"
                              variant="flat"
                            >
                              🕐 {{ formatTime(turn.guest_departure_date) }}
                            </v-chip>
                            <v-chip
                              size="x-small"
                              color="info"
                              variant="flat"
                            >
                              👥 {{ turn.guest_count || 'N/A' }} guests
                            </v-chip>
                            <v-chip
                              size="x-small"
                              color="warning"
                              variant="flat"
                            >
                              ➡️ Check-in: {{ getNextCheckinDays(turn) }}
                            </v-chip>
                          </div>
                        </v-list-item-subtitle>

                        <template #append>
                          <div class="d-flex align-center gap-1">
                            <v-btn
                              icon="mdi-account-hard-hat"
                              size="small"
                              variant="text"
                              color="primary"
                              @click="assignCleaner(turn)"
                            />
                            <v-btn
                              icon="mdi-eye"
                              size="small"
                              variant="text"
                              @click="viewBooking(turn)"
                            />
                          </div>
                        </template>
                      </v-list-item>
                    </v-list>
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

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDisplay } from 'vuetify';
import { useAdminBookings } from '@/composables/admin/useAdminBookings';
import { useAdminProperties } from '@/composables/admin/useAdminProperties';
import { useAdminUserManagement } from '@/composables/admin/useAdminUserManagement';
import type { Booking } from '@/types';

// Composables
const router = useRouter();
const { mobile } = useDisplay();
  const { 
    allBookings, 
    fetchAllBookings 
  } = useAdminBookings();
const { 
  allProperties, 
  fetchAllProperties 
} = useAdminProperties();
const { 
  users, 
  fetchAllUsers 
} = useAdminUserManagement();

// Reactive state
const selectedTimeFilter = ref('today');
const loading = ref(false);
const currentViewingDate = ref(new Date()); // For calendar navigation

// Computed data for overview cards
const propertiesData = computed(() => {
  const total = allProperties.value.length;
  const active = allProperties.value.filter(p => p.active).length;
  const booked = allBookings.value.filter(b => {
    const today = new Date().toISOString().split('T')[0];
    return b.guest_departure_date >= today && b.status !== 'completed';
  }).length;

  return {
    totalProperties: total,
    activeProperties: active,
    bookedProperties: booked
  };
});

const clientsData = computed(() => {
  const propertyOwners = users.value.filter(u => u.role === 'owner');
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  
  const activeThisMonth = allBookings.value
    .filter(b => b.guest_departure_date >= firstDayOfMonth)
    .map(b => allProperties.value.find(p => p.id === b.property_id)?.owner_id)
    .filter(Boolean)
    .reduce((acc, ownerId) => acc.add(ownerId), new Set()).size;

  return {
    totalClients: propertyOwners.length,
    activeThisMonth
  };
});

const bookingsData = computed(() => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekStart = startOfWeek.toISOString().split('T')[0];
  const weekEnd = endOfWeek.toISOString().split('T')[0];

  const allBookingsCount = allBookings.value.length;
  const turns = allBookings.value.filter(b => b.booking_type === 'turn');
  const urgentTurns = turns.filter(b => {
    const checkoutTime = new Date(b.guest_departure_date);
    const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    return hoursUntil <= 6 && b.status !== 'completed';
  });

  const checkoutsThisWeek = allBookings.value.filter(b => 
    b.guest_departure_date >= weekStart && b.guest_departure_date <= weekEnd
  ).length;

  const turnsThisWeek = turns.filter(b => 
    b.guest_departure_date >= weekStart && b.guest_departure_date <= weekEnd
  ).length;

  
  return {
    totalCheckouts: allBookingsCount,
    totalTurns: turns.length,
    urgentTurns: urgentTurns.length,
    checkoutsThisWeek,
    turnsThisWeek
  };
});

// Time filter computed
const timeFilterLabel = computed(() => {
  switch (selectedTimeFilter.value) {
    case 'today': return 'Today';
    case 'tomorrow': return 'Tomorrow';
    case 'week': return 'Next 7 Days';
    default: return 'Today';
  }
});

// Filtered bookings
const filteredCheckouts = computed(() => {
  const filter = getDateFilter(selectedTimeFilter.value);
  return allBookings.value
    .filter(booking => 
      booking.booking_type !== 'turn' && 
      booking.guest_departure_date >= filter.start && 
      booking.guest_departure_date <= filter.end &&
      booking.status !== 'completed'
    )
    .sort((a, b) => new Date(a.guest_departure_date).getTime() - new Date(b.guest_departure_date).getTime());
});

const filteredTurns = computed(() => {
  const filter = getDateFilter(selectedTimeFilter.value);
  return allBookings.value
    .filter(booking => 
      booking.booking_type === 'turn' && 
      booking.guest_departure_date >= filter.start && 
      booking.guest_departure_date <= filter.end &&
      booking.status !== 'completed'
    )
    .sort((a, b) => new Date(a.guest_departure_date).getTime() - new Date(b.guest_departure_date).getTime());
});

// Helper functions
function getDateFilter(filter: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (filter) {
    case 'today':
      return {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
    case 'tomorrow': {
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return {
        start: tomorrow.toISOString().split('T')[0],
        end: tomorrow.toISOString().split('T')[0]
      };
    }
    case 'week': {
      const weekEnd = new Date(today);
      weekEnd.setDate(today.getDate() + 6);
      return {
        start: today.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0]
      };
    }
    default:
      return {
        start: today.toISOString().split('T')[0],
        end: today.toISOString().split('T')[0]
      };
  }
}

function getPropertyName(propertyId: string): string {
  const property = allProperties.value.find(p => p.id === propertyId);
  return property?.name || 'Unknown Property';
}

function getPropertyAddress(propertyId: string): string {
  const property = allProperties.value.find(p => p.id === propertyId);
  return property?.address || 'Address not available';
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
}

function getNextCheckinDays(booking: Booking): string {
  if (booking.guest_arrival_date) {
    const checkinDate = new Date(booking.guest_arrival_date);
    const checkoutDate = new Date(booking.guest_departure_date);
    const diffTime = checkinDate.getTime() - checkoutDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Same day';
    if (diffDays === 1) return 'Next day';
    return `${diffDays} days`;
  }
  return 'Not set';
}

function getCleaningWindow(turn: Booking): string {
  // Calculate cleaning window based on checkout and checkin times
  const checkoutTime = new Date(turn.guest_departure_date);
  const checkinTime = turn.guest_arrival_date ? new Date(turn.guest_arrival_date) : null;
  
  if (!checkinTime) return 'TBD';
  
  const diffHours = (checkinTime.getTime() - checkoutTime.getTime()) / (1000 * 60 * 60);
  
  if (diffHours <= 2) return '⚡ URGENT';
  if (diffHours <= 4) return '🔥 TIGHT';
  return `${Math.round(diffHours)}h window`;
}

function getTurnUrgencyColor(turn: Booking): string {
  const now = new Date();
  const checkoutTime = new Date(turn.guest_departure_date);
  const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  if (hoursUntil <= 2) return 'error';
  if (hoursUntil <= 6) return 'warning';
  return 'orange';
}

// Actions
function refreshDashboard() {
  loading.value = true;
  Promise.all([
    fetchAllBookings(),
    fetchAllProperties(),
    fetchAllUsers()
  ]).finally(() => {
    loading.value = false;
  });
}

function goToMasterSchedule() {
  router.push('/admin/schedule');
}

function viewBooking(booking: Booking) {
  router.push(`/admin/bookings/${booking.id}`);
}

function assignCleaner(turn: Booking) {
  // TODO: Open cleaner assignment modal
  console.log('Assign cleaner to turn:', turn.id);
}

// Calendar preview methods
function getCurrentMonthYear() {
  return currentViewingDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function navigateToPreviousMonth() {
  const newDate = new Date(currentViewingDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentViewingDate.value = newDate;
}

function navigateToNextMonth() {
  const newDate = new Date(currentViewingDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentViewingDate.value = newDate;
}

function getCalendarDays() {
  const year = currentViewingDate.value.getFullYear();
  const month = currentViewingDate.value.getMonth();
  
  // Get first day of month and calculate starting point
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const currentDate = new Date(startDate);
  const today = new Date().toISOString().split('T')[0];
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayBookings = allBookings.value.filter(b => b.guest_departure_date.startsWith(dateStr));
    const turns = dayBookings.filter(b => b.booking_type === 'turn');
    
    days.push({
      day: currentDate.getDate(),
      date: dateStr,
      isToday: dateStr === today,
      isCurrentMonth: currentDate.getMonth() === month,
      bookingCount: dayBookings.length,
      turnCount: turns.length
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return days;
}

function getWeeklyStats() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const weekStart = startOfWeek.toISOString().split('T')[0];
  const weekEnd = endOfWeek.toISOString().split('T')[0];

  const weekBookings = allBookings.value.filter(b => 
    b.guest_departure_date >= weekStart && b.guest_departure_date <= weekEnd
  );

  return {
    totalBookings: weekBookings.length,
    turns: weekBookings.filter(b => b.booking_type === 'turn').length,
    completed: weekBookings.filter(b => b.status === 'completed').length,
    upcoming: weekBookings.filter(b => b.status !== 'completed' && b.status !== 'cancelled').length
  };
}

function getTodaySchedule() {
  const today = new Date().toISOString().split('T')[0];
  return allBookings.value
    .filter(booking => booking.guest_departure_date.startsWith(today) && booking.status !== 'completed')
    .sort((a, b) => new Date(a.guest_departure_date).getTime() - new Date(b.guest_departure_date).getTime());
}

// Initialize
onMounted(() => {
  refreshDashboard();
});
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: rgb(var(--v-theme-background));
}

.dashboard-content {
  min-height: 100vh;
}

.dashboard-header {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 24px 0;
}

.overview-cards {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 24px 0;
}

.overview-card {
  transition: transform 0.2s, box-shadow 0.2s;
  border-radius: 12px;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.upcoming-section {
  padding: 24px 0;
}

.calendar-preview-section {
  background: rgb(var(--v-theme-surface));
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 24px 0;
}

.calendar-preview-card {
  border-radius: 12px;
}

/* Calendar Navigation Header */
.calendar-month-year {
  flex: 1;
  text-align: center;
}

.calendar-month-year h3 {
  margin: 0;
  color: rgb(var(--v-theme-primary));
}

/* Mini Calendar Styles */
.mini-calendar {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  padding: 16px;
}

.calendar-grid {
  width: 100%;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.day-header {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface-variant));
  padding: 4px;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  position: relative;
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2px;
  border-radius: 4px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-day:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: scale(1.05);
}

.calendar-day.today {
  background: rgb(var(--v-theme-primary));
  color: white;
}

.calendar-day.today .day-number {
  color: white;
  font-weight: 700;
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.has-bookings {
  border-color: rgb(var(--v-theme-success));
}

.calendar-day.has-turns {
  border-color: rgb(var(--v-theme-warning));
  border-width: 2px;
}

.day-number {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

.booking-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  margin-top: 2px;
  justify-content: center;
}

.booking-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgb(var(--v-theme-success));
}

.booking-dot.turn-dot {
  background: rgb(var(--v-theme-warning));
}

.more-indicator {
  font-size: 0.6rem;
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
}

/* Schedule Insights Styles */
.schedule-insights {
  height: 100%;
}

.insight-card {
  text-align: center;
  padding: 12px;
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
}

.insight-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.insight-label {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  margin-top: 4px;
}

.schedule-overview {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 8px;
  padding: 16px;
}

.today-schedule {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.schedule-item {
  display: flex;
  align-items: center;
  background: rgb(var(--v-theme-surface));
  padding: 8px;
  border-radius: 6px;
}

.upcoming-card {
  border-radius: 12px;
  height: 100%;
}

.bookings-list {
  max-height: 400px;
  overflow-y: auto;
}

.booking-item {
  border-bottom: 1px solid rgb(var(--v-theme-surface-variant));
  padding: 12px 16px;
}

.booking-item:last-child {
  border-bottom: none;
}

.turn-item {
  background: rgba(var(--v-theme-warning), 0.05);
}

.booking-details {
  margin-top: 4px;
}

@media (max-width: 599px) {
  .dashboard-header,
  .overview-cards,
  .calendar-preview-section,
  .upcoming-section {
    padding: 16px 0;
  }
  
  .overview-card .v-card-text {
    padding: 16px !important;
  }
  
  .bookings-list {
    max-height: 300px;
  }
  
  .booking-item {
    padding: 8px 12px;
  }
  
  /* Mobile calendar adjustments */
  .mini-calendar {
    padding: 12px;
  }
  
  .calendar-day {
    padding: 1px;
  }
  
  .day-number {
    font-size: 0.7rem;
  }
  
  .booking-dot {
    width: 3px;
    height: 3px;
  }
  
  .insight-card {
    padding: 8px;
  }
  
  .insight-value {
    font-size: 1.25rem;
  }
  
  .insight-label {
    font-size: 0.7rem;
  }
  
  .schedule-overview {
    padding: 12px;
  }
  
  .schedule-item {
    padding: 6px;
  }
  
  /* Mobile calendar navigation */
  .calendar-month-year h3 {
    font-size: 1.1rem;
  }
  
  .calendar-preview-card .v-card-title {
    padding: 12px !important;
  }
  
  .calendar-preview-card .v-btn {
    min-width: 32px !important;
  }
}
</style>
