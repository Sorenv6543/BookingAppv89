<template>
  <div class="use-admin-bookings-demo">
    <h1>useAdminBookings Composable Demo</h1>
    <p class="demo-description">
      Testing admin-specific booking composable with system-wide data access (NO filtering)
    </p>

    <!-- Loading and Error States -->
    <div
      v-if="loading"
      class="loading"
    >
      Loading admin booking data...
    </div>
    
    <div
      v-if="error"
      class="error"
    >
      Error: {{ error }}
    </div>
    
    <div
      v-if="success"
      class="success"
    >
      Success: {{ success }}
    </div>

    <!-- System Metrics Dashboard -->
    <section class="metrics-section">
      <h2>System-Wide Metrics</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <h3>Total Bookings</h3>
          <div class="metric-value">
            {{ systemMetrics.total }}
          </div>
        </div>
        <div class="metric-card">
          <h3>Turn Bookings</h3>
          <div class="metric-value">
            {{ systemMetrics.turns }}
          </div>
          <div class="metric-subtitle">
            {{ systemMetrics.turnPercentage }}% of total
          </div>
        </div>
        <div class="metric-card">
          <h3>Urgent Turns Today</h3>
          <div class="metric-value urgent">
            {{ systemMetrics.urgentTurns }}
          </div>
        </div>
        <div class="metric-card">
          <h3>Unassigned</h3>
          <div class="metric-value warning">
            {{ systemMetrics.unassigned }}
          </div>
        </div>
        <div class="metric-card">
          <h3>Completion Rate</h3>
          <div class="metric-value">
            {{ systemMetrics.completionRate }}%
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Actions -->
    <section class="actions-section">
      <h2>Admin Actions</h2>
      <div class="action-buttons">
        <button
          :disabled="loading"
          @click="handleFetchAllBookings"
        >
          Fetch All Bookings
        </button>
        <button
          :disabled="loading"
          @click="handleTestCleanerAssignment"
        >
          Test Cleaner Assignment
        </button>
        <button
          :disabled="loading"
          @click="handleTestStatusUpdate"
        >
          Test Status Update
        </button>
        <button
          :disabled="loading"
          @click="handleTestBulkAssignment"
        >
          Test Bulk Assignment
        </button>
      </div>
    </section>

    <!-- System Turn Alerts -->
    <section class="alerts-section">
      <h2>System Turn Alerts</h2>
      <div class="turn-alerts">
        <div class="alert-summary">
          <p><strong>Total:</strong> {{ turnAlerts.total }}</p>
          <p><strong>Assigned:</strong> {{ turnAlerts.assigned }}</p>
          <p><strong>Unassigned:</strong> {{ turnAlerts.unassigned }}</p>
        </div>
        <div
          v-if="turnAlerts.alerts.length > 0"
          class="alert-list"
        >
          <div 
            v-for="alert in turnAlerts.alerts" 
            :key="alert.id"
            class="alert-item"
            :class="alert.priority"
          >
            <div class="alert-info">
              <strong>{{ alert.id.substring(0, 8) }}</strong>
              <span>{{ alert.checkout_date }} → {{ alert.checkin_date }}</span>
              <span class="status">{{ alert.status }}</span>
            </div>
            <div
              class="alert-impact"
              :class="alert.assigned_cleaner_id ? 'assigned' : 'unassigned'"
            >
              {{ alert.businessImpact }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bookings by Status -->
    <section class="status-section">
      <h2>Bookings by Status (System-Wide)</h2>
      <div class="status-grid">
        <div 
          v-for="(bookings, status) in bookingsByStatus" 
          :key="status"
          class="status-card"
        >
          <h3>{{ status.replace('_', ' ').toUpperCase() }}</h3>
          <div class="status-count">
            {{ bookings.length }}
          </div>
          <div class="status-list">
            <div 
              v-for="booking in bookings.slice(0, 3)" 
              :key="booking.id"
              class="booking-item"
            >
              {{ booking.id.substring(0, 8) }} - {{ booking.booking_type }}
            </div>
            <div
              v-if="bookings.length > 3"
              class="more-items"
            >
              +{{ bookings.length - 3 }} more
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cleaner Workload Analysis -->
    <section class="workload-section">
      <h2>Cleaner Workload Analysis</h2>
      <div class="workload-summary">
        <p><strong>Total Cleaners:</strong> {{ cleanerAnalysis.totalCleaners }}</p>
        <p><strong>Unassigned Bookings:</strong> {{ cleanerAnalysis.unassignedCount }}</p>
        <p><strong>Average Workload Score:</strong> {{ cleanerAnalysis.averageWorkload.toFixed(1) }}</p>
      </div>
      <div class="cleaner-workloads">
        <div 
          v-for="(workload, cleanerId) in cleanerAnalysis.cleanerWorkloads" 
          :key="cleanerId"
          class="cleaner-card"
        >
          <h4>Cleaner {{ cleanerId.substring(0, 8) }}</h4>
          <div class="workload-stats">
            <span>Assigned: {{ workload.assigned }}</span>
            <span>Completed: {{ workload.completed }}</span>
            <span>Pending: {{ workload.pending }}</span>
            <span class="workload-score">Score: {{ workload.workloadScore }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Property Utilization Report -->
    <section class="utilization-section">
      <h2>Property Utilization Report</h2>
      <div class="utilization-summary">
        <p><strong>Total Properties:</strong> {{ propertyReport.totalProperties }}</p>
        <p><strong>Average Utilization:</strong> {{ propertyReport.averageUtilization.toFixed(1) }}%</p>
        <p><strong>Average Turn Rate:</strong> {{ propertyReport.averageTurnRate.toFixed(1) }}%</p>
      </div>
      <div class="property-stats">
        <div 
          v-for="[propertyId, stats] in Object.entries(propertyReport.propertyStats).slice(0, 5)" 
          :key="propertyId"
          class="property-card"
        >
          <h4>Property {{ propertyId.substring(0, 8) }}</h4>
          <div class="property-metrics">
            <span>Total: {{ stats.totalBookings }}</span>
            <span>Turns: {{ stats.turnBookings }}</span>
            <span>Completed: {{ stats.completedBookings }}</span>
            <span>Utilization: {{ stats.utilizationRate }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Advanced Filtering Demo -->
    <section class="filtering-section">
      <h2>Advanced Filtering Demo</h2>
      <div class="filter-controls">
        <label>
          <input 
            v-model="filterCriteria.unassignedOnly" 
            type="checkbox"
            @change="applyFilters"
          >
          Unassigned Only
        </label>
        <select
          v-model="filterCriteria.status"
          @change="applyFilters"
        >
          <option value="">
            All Statuses
          </option>
          <option value="pending">
            Pending
          </option>
          <option value="scheduled">
            Scheduled
          </option>
          <option value="in_progress">
            In Progress
          </option>
          <option value="completed">
            Completed
          </option>
        </select>
        <select
          v-model="filterCriteria.bookingType"
          @change="applyFilters"
        >
          <option value="">
            All Types
          </option>
          <option value="standard">
            Standard
          </option>
          <option value="turn">
            Turn
          </option>
        </select>
      </div>
      <div class="filtered-results">
        <h3>Filtered Results: {{ filteredBookings.length }} bookings</h3>
        <div class="booking-list">
          <div 
            v-for="booking in filteredBookings.slice(0, 10)" 
            :key="booking.id"
            class="booking-card"
          >
            <div class="booking-header">
              <strong>{{ booking.id.substring(0, 8) }}</strong>
              <span class="booking-type">{{ booking.booking_type }}</span>
              <span class="booking-status">{{ booking.status }}</span>
            </div>
            <div class="booking-details">
              <span>{{ booking.checkout_date }} → {{ booking.checkin_date }}</span>
              <span>{{ booking.assigned_cleaner_id ? 'Assigned' : 'Unassigned' }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Raw Data Display -->
    <section class="data-section">
      <h2>Raw Data (First 5 Bookings)</h2>
      <pre class="data-display">{{ JSON.stringify(allBookings.slice(0, 5), null, 2) }}</pre>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminBookings } from '@/composables/admin/useAdminBookings-supabase';/useAdminBookings';
import type { BookingStatus, BookingType } from '@/types';

// Use the admin bookings composable
const {
  // State
  loading,
  error,
  success,
  
  // Computed properties (system-wide, no filtering)
  allBookings,
  systemMetrics,
  bookingsByStatus,
  
  // Admin operations
  fetchAllBookings,
  assignCleaner,
  updateBookingStatus,
  bulkAssignCleaner,
  
  // Analytics
  getSystemTurnAlerts,
  getCleanerWorkloadAnalysis,
  getPropertyUtilizationReport,
  
  // Advanced filtering
  filterBookings
} = useAdminBookings();

// Demo state
const filterCriteria = ref<{
  unassignedOnly: boolean;
  status: BookingStatus | '';
  bookingType: BookingType | '';
}>({
  unassignedOnly: false,
  status: '',
  bookingType: ''
});

const filteredBookings = ref(allBookings.value);

// Computed analytics
const turnAlerts = computed(() => getSystemTurnAlerts());
const cleanerAnalysis = computed(() => getCleanerWorkloadAnalysis());
const propertyReport = computed(() => getPropertyUtilizationReport());

// Demo action handlers
async function handleFetchAllBookings() {
  await fetchAllBookings();
}

async function handleTestCleanerAssignment() {
  if (allBookings.value.length > 0) {
    const firstBooking = allBookings.value[0];
    const testCleanerId = 'test-cleaner-123';
    await assignCleaner(firstBooking.id, testCleanerId);
  }
}

async function handleTestStatusUpdate() {
  if (allBookings.value.length > 0) {
    const firstBooking = allBookings.value[0];
    await updateBookingStatus(firstBooking.id, 'scheduled');
  }
}

async function handleTestBulkAssignment() {
  const unassignedBookingIds = allBookings.value
    .filter(b => !b.assigned_cleaner_id)
    .slice(0, 3)
    .map(b => b.id);
  
  if (unassignedBookingIds.length > 0) {
    const testCleanerId = 'bulk-test-cleaner-456';
    await bulkAssignCleaner(unassignedBookingIds, testCleanerId);
  }
}

function applyFilters() {
  const criteria: any = {};
  
  if (filterCriteria.value.unassignedOnly) {
    criteria.unassignedOnly = true;
  }
  
  if (filterCriteria.value.status) {
    criteria.status = [filterCriteria.value.status];
  }
  
  if (filterCriteria.value.bookingType) {
    criteria.bookingType = [filterCriteria.value.bookingType];
  }
  
  filteredBookings.value = filterBookings(criteria);
}

// Initialize demo
onMounted(async () => {
  await handleFetchAllBookings();
  applyFilters();
});
</script>

<style scoped>
.use-admin-bookings-demo {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.demo-description {
  color: #666;
  margin-bottom: 30px;
  font-style: italic;
}

.loading {
  background: #e3f2fd;
  color: #1976d2;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.error {
  background: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.success {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
}

section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.metric-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
}

.metric-value {
  font-size: 2em;
  font-weight: bold;
  color: #007bff;
}

.metric-value.urgent {
  color: #dc3545;
}

.metric-value.warning {
  color: #ffc107;
}

.metric-subtitle {
  font-size: 0.9em;
  color: #666;
  margin-top: 5px;
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.alert-summary {
  background: #fff3cd;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 15px;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 4px;
  background: #f8f9fa;
}

.alert-item.urgent {
  border-left: 4px solid #dc3545;
}

.alert-item.high {
  border-left: 4px solid #ffc107;
}

.alert-impact.unassigned {
  color: #dc3545;
  font-weight: bold;
}

.alert-impact.assigned {
  color: #28a745;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.status-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.status-count {
  font-size: 1.5em;
  font-weight: bold;
  color: #007bff;
  margin: 10px 0;
}

.booking-item {
  font-size: 0.9em;
  color: #666;
  margin: 2px 0;
}

.cleaner-workloads {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.cleaner-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.workload-stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.workload-score {
  font-weight: bold;
  color: #007bff;
}

.property-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.property-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.property-metrics {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
}

.filter-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-controls label {
  display: flex;
  align-items: center;
  gap: 5px;
}

.filter-controls select {
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.booking-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

.booking-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.booking-type {
  background: #007bff;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

.booking-status {
  background: #28a745;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

.booking-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  color: #666;
}

.data-display {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 0.9em;
}
</style> 