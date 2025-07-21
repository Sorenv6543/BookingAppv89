<!-- eslint-disable vue/valid-v-slot -->
<template>
  <v-container
    fluid
    class="pa-6"
  >
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon
              class="mr-3"
              color="primary"
            >
              mdi-office-building-cog
            </v-icon>
            <span>useAdminProperties Composable Demo</span>
            <v-spacer />
            <v-chip
              color="success"
              variant="outlined"
            >
              <v-icon start>
                mdi-shield-check
              </v-icon>
              Admin System-Wide Access
            </v-chip>
          </v-card-title>
          <v-card-subtitle>
            Testing admin-specific property management with system-wide data access (no owner filtering)
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>

    <!-- System Metrics Overview -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-chart-line
            </v-icon>
            System Property Metrics
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  variant="outlined"
                  color="primary"
                >
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">
                      {{ systemPropertyMetrics.total }}
                    </div>
                    <div class="text-subtitle-1">
                      Total Properties
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  variant="outlined"
                  color="success"
                >
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">
                      {{ systemPropertyMetrics.active }}
                    </div>
                    <div class="text-subtitle-1">
                      Active Properties
                    </div>
                    <div class="text-caption">
                      ({{ systemPropertyMetrics.activePercentage }}%)
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  variant="outlined"
                  color="warning"
                >
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">
                      {{ systemPropertyMetrics.ownerCount }}
                    </div>
                    <div class="text-subtitle-1">
                      Property Owners
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  variant="outlined"
                  color="info"
                >
                  <v-card-text class="text-center">
                    <div class="text-h4 font-weight-bold">
                      {{ systemPropertyMetrics.averageCleaningDuration }}
                    </div>
                    <div class="text-subtitle-1">
                      Avg Duration (min)
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Properties by Owner -->
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card class="mb-6">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-account-group
            </v-icon>
            Properties by Owner
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(properties, ownerId) in propertiesByOwner"
                :key="ownerId"
                class="mb-2"
              >
                <template #prepend>
                  <v-avatar
                    color="primary"
                    size="small"
                  >
                    <v-icon>mdi-account</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title>Owner: {{ ownerId.substring(0, 8) }}...</v-list-item-title>
                <v-list-item-subtitle>{{ properties.length }} properties</v-list-item-subtitle>
                <template #append>
                  <v-chip
                    size="small"
                    color="primary"
                  >
                    {{ properties.length }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Properties by Pricing Tier -->
      <v-col
        cols="12"
        md="6"
      >
        <v-card class="mb-6">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-currency-usd
            </v-icon>
            Properties by Pricing Tier
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(properties, tier) in propertiesByPricingTier"
                :key="tier"
                class="mb-2"
              >
                <template #prepend>
                  <v-avatar
                    :color="getTierColor(tier)"
                    size="small"
                  >
                    <v-icon>{{ getTierIcon(tier) }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-capitalize">
                  {{ tier }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ properties.length }} properties</v-list-item-subtitle>
                <template #append>
                  <v-chip
                    size="small"
                    :color="getTierColor(tier)"
                  >
                    {{ properties.length }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Admin Operations -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-cog
            </v-icon>
            Admin Operations
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-btn
                  :loading="loading"
                  color="primary"
                  variant="outlined"
                  block
                  class="mb-3"
                  @click="testFetchAllProperties"
                >
                  <v-icon start>
                    mdi-download
                  </v-icon>
                  Fetch All Properties
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-btn
                  :loading="loading"
                  color="warning"
                  variant="outlined"
                  block
                  class="mb-3"
                  @click="testBulkUpdate"
                >
                  <v-icon start>
                    mdi-pencil-box-multiple
                  </v-icon>
                  Test Bulk Update
                </v-btn>
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-btn
                  color="info"
                  variant="outlined"
                  block
                  class="mb-3"
                  @click="testAnalytics"
                >
                  <v-icon start>
                    mdi-chart-bar
                  </v-icon>
                  Generate Analytics
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Property Analytics -->
    <v-row v-if="analytics">
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-chart-pie
            </v-icon>
            Property Analytics Report
          </v-card-title>
          <v-card-text>
            <v-row>
              <!-- Top Performers -->
              <v-col
                cols="12"
                md="6"
              >
                <v-card
                  variant="outlined"
                  class="mb-4"
                >
                  <v-card-title class="text-h6">
                    <v-icon
                      class="mr-2"
                      color="success"
                    >
                      mdi-trophy
                    </v-icon>
                    Top Performing Properties
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item
                        v-for="(performer, index) in (analytics as any).topPerformers"
                        :key="performer.property.id"
                        class="mb-1"
                      >
                        <template #prepend>
                          <v-chip
                            size="small"
                            :color="index === 0 ? 'success' : 'primary'"
                          >
                            #{{ index + 1 }}
                          </v-chip>
                        </template>
                        <v-list-item-title>{{ performer.property.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          Revenue: ${{ performer.revenueProjection }} | 
                          Utilization: {{ Math.round(performer.utilizationRate * 100) }}%
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Under Performers -->
              <v-col
                cols="12"
                md="6"
              >
                <v-card
                  variant="outlined"
                  class="mb-4"
                >
                  <v-card-title class="text-h6">
                    <v-icon
                      class="mr-2"
                      color="warning"
                    >
                      mdi-alert-circle
                    </v-icon>
                    Under Performing Properties
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item
                        v-for="performer in (analytics as any).underPerformers"
                        :key="performer.property.id"
                        class="mb-1"
                      >
                        <template #prepend>
                          <v-chip
                            size="small"
                            color="warning"
                          >
                            {{ Math.round(performer.utilizationRate * 100) }}%
                          </v-chip>
                        </template>
                        <v-list-item-title>{{ performer.property.name }}</v-list-item-title>
                        <v-list-item-subtitle>
                          Bookings: {{ performer.totalBookings }} | 
                          Avg Gap: {{ performer.averageGapDays }} days
                        </v-list-item-subtitle>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Revenue by Tier -->
            <v-row>
              <v-col cols="12">
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    <v-icon
                      class="mr-2"
                      color="success"
                    >
                      mdi-currency-usd
                    </v-icon>
                    Revenue Projection by Tier
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col
                        v-for="(revenue, tier) in (analytics as any).revenueByTier"
                        :key="tier"
                        cols="12"
                        md="3"
                      >
                        <v-card
                          variant="outlined"
                          :color="getTierColor(tier as unknown as PricingTier)"
                        >
                          <v-card-text class="text-center">
                            <div class="text-h6 font-weight-bold">
                              ${{ revenue }}
                            </div>  
                            <div class="text-subtitle-2 text-capitalize">
                              {{ tier }}
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                    <v-divider class="my-4" />
                    <div class="text-center">
                      <div class="text-h5 font-weight-bold text-success">
                        Total Projected Revenue: ${{ (analytics as any).totalProjectedRevenue }}
                      </div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Property Utilization Data -->
    <v-row>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon class="mr-2">
              mdi-chart-timeline-variant
            </v-icon>
            Property Utilization Data
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="utilizationHeaders"
              :items="utilizationItems"
              :items-per-page="10"
              class="elevation-1"
            >
              <template #item.property.name="{ item }">
                <div class="font-weight-medium">
                  {{ item.property.name }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  {{ item.property.address }}
                </div>
              </template>
              
              <template #item.utilizationRate="{ item }">
                <!-- eslint-disable-next-line vue/no-v-html -->
                <v-progress-linear
                  :model-value="item.utilizationRate * 100"
                  :color="getUtilizationColor(item.utilizationRate)"
                  height="20"
                  rounded
                >
                  <template #default>
                    <span class="text-caption font-weight-bold">
                      {{ Math.round(item.utilizationRate * 100) }}%
                    </span>
                  </template>
                </v-progress-linear>
              </template>
              
              <!-- eslint-disable-next-line vue/no-v-html -->
              <template #item.cleaningLoad="{ item }">
                <v-chip
                  :color="getLoadColor(item.cleaningLoad)"
                  size="small"
                  variant="outlined"
                >
                  {{ item.cleaningLoad }}
                </v-chip>
              </template>
              
              <!-- eslint-disable-next-line vue/no-v-html -->
              <template #item.revenueProjection="{ item }">
                <div class="font-weight-medium">
                  ${{ item.revenueProjection }}
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Active vs Inactive Properties -->
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            <v-icon
              class="mr-2"
              color="success"
            >
              mdi-check-circle
            </v-icon>
            Active Properties
          </v-card-title>
          <v-card-text>
            <div class="text-h3 text-success">
              {{ allActiveProperties.length }}
            </div>
            <div class="text-caption">
              Currently active properties
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-card>
          <v-card-title>
            <v-icon
              class="mr-2"
              color="warning"
            >
              mdi-pause-circle
            </v-icon>
            Inactive Properties
          </v-card-title>
          <v-card-text>
            <div class="text-h3 text-warning">
              {{ allProperties.length - allActiveProperties.length }}
            </div>
            <div class="text-caption">
              Currently inactive properties
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Property Filtering Demo -->
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon
              class="mr-2"
              color="primary"
            >
              mdi-filter
            </v-icon>
            Advanced Property Filtering Demo
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="filterCriteria.owner_id"
                  :items="ownerOptions"
                  label="Filter by Owner"
                  clearable
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="filterCriteria.pricing_tier"
                  :items="tierOptions"
                  label="Filter by Pricing Tier"
                  clearable
                  variant="outlined"
                  density="compact"
                />
              </v-col>
              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="filterCriteria.active"
                  :items="activeOptions"
                  label="Filter by Status"
                  clearable
                  variant="outlined"
                  density="compact"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12">
                <v-btn
                  color="primary"
                  variant="outlined"
                  class="mr-2"
                  @click="testFilterProperties"
                >
                  <v-icon start>
                    mdi-filter
                  </v-icon>
                  Apply Filters
                </v-btn>
                <v-btn
                  color="secondary"
                  variant="outlined"
                  @click="clearFilters"
                >
                  <v-icon start>
                    mdi-filter-off
                  </v-icon>
                  Clear Filters
                </v-btn>
              </v-col>
            </v-row>
            <v-row v-if="filteredResults.length > 0">
              <v-col cols="12">
                <v-alert
                  type="info"
                  variant="outlined"
                  class="mt-4"
                >
                  <v-icon start>
                    mdi-information
                  </v-icon>
                  Found {{ filteredResults.length }} properties matching your criteria
                </v-alert>
                <v-list>
                  <v-list-item
                    v-for="property in (filteredResults.slice(0, 5) as Property[])"
                    :key="property.id"
                  >
                    <template #prepend>
                      <v-icon :color="property.active ? 'success' : 'warning'">
                        {{ property.active ? 'mdi-check-circle' : 'mdi-pause-circle' }}
                      </v-icon>
                    </template>
                    <v-list-item-title>{{ property.name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ property.address }} • {{ property.pricing_tier }} tier
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
                <div
                  v-if="filteredResults.length > 5"
                  class="text-caption text-center mt-2"
                >
                  ... and {{ filteredResults.length - 5 }} more properties
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Status Messages -->
    <v-row>
      <v-col cols="12">
        <v-alert
          v-if="success || composableSuccess"
          type="success"
          variant="outlined"
          closable
          class="mb-4"
          @click:close="success = null"
        >
          <v-icon start>
            mdi-check-circle
          </v-icon>
          {{ success || composableSuccess }}
        </v-alert>
        
        <v-alert
          v-if="error || composableError"
          type="error"
          variant="outlined"
          closable
          class="mb-4"
          @click:close="error = null"
        >
          <v-icon start>
            mdi-alert-circle
          </v-icon>
          {{ error || composableError }}
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useAdminProperties } from '@/composables/admin/useAdminProperties';
import type { PricingTier, Property } from '@/types';

// Use the admin properties composable
const {
  // State
  loading,
  error: composableError,
  success: composableSuccess,
  
  // System-wide data (no filtering)
  allProperties,
  allActiveProperties,
  propertiesByOwner,
  propertiesByPricingTier,
  systemPropertyMetrics,
  propertyUtilizationData,
  
  // Admin operations
  fetchAllProperties,
  bulkUpdateProperties,
  getPropertyAnalytics,
  filterProperties
} = useAdminProperties();

// Demo state
const analytics = ref<unknown>(null);
const filterCriteria = ref({
  owner_id: '',
  pricing_tier: '',
  active: null as boolean | null
});
const filteredResults = ref<unknown[]>([]);
const error = ref<string | null>(null);
const success = ref<string | null>(null);

// Computed properties for demo display
const utilizationItems = computed(() => {
  return Object.values(propertyUtilizationData.value);
});

const utilizationHeaders = [
  { title: 'Property', key: 'property.name', sortable: true },
  { title: 'Total Bookings', key: 'totalBookings', sortable: true },
  { title: 'Turn Bookings', key: 'turnBookings', sortable: true },
  { title: 'Utilization', key: 'utilizationRate', sortable: true },
  { title: 'Cleaning Load', key: 'cleaningLoad', sortable: true },
  { title: 'Revenue Projection', key: 'revenueProjection', sortable: true }
];

// Filter options for demo
const ownerOptions = computed(() => {
  const owners = new Set(allProperties.value.map(p => p.owner_id));
  return Array.from(owners).map(id => ({
    title: `Owner ${id.slice(0, 8)}...`,
    value: id
  }));
});

const tierOptions = [
  { title: 'Basic', value: 'basic' },
  { title: 'Standard', value: 'standard' },
  { title: 'Premium', value: 'premium' },
  { title: 'Luxury', value: 'luxury' }
];

const activeOptions = [
  { title: 'Active', value: true },
  { title: 'Inactive', value: false }
];

// Helper functions
function getTierColor(tier: PricingTier): string {
  const colors = {
    basic: 'blue-grey',
    standard: 'blue',
    premium: 'purple',
    luxury: 'amber'
  };
  return colors[tier] || 'grey';
}

function getTierIcon(tier: PricingTier): string {
  const icons = {
    basic: 'mdi-home',
    standard: 'mdi-home-plus',
    premium: 'mdi-home-heart',
    luxury: 'mdi-home-luxury'
  };
  return icons[tier] || 'mdi-home';
}

function getUtilizationColor(rate: number): string {
  if (rate < 0.3) return 'error';
  if (rate < 0.7) return 'warning';
  return 'success';
}

function getLoadColor(load: 'light' | 'moderate' | 'heavy'): string {
  const colors = {
    light: 'success',
    moderate: 'warning',
    heavy: 'error'
  };
  return colors[load];
}

// Demo functions
async function testFetchAllProperties() {
  const result = await fetchAllProperties();
  console.log('Fetch all properties result:', result);
}

async function testBulkUpdate() {
  // Get first 3 properties for testing
  const propertyIds = allProperties.value.slice(0, 3).map(p => p.id);
  
  if (propertyIds.length === 0) {
    error.value = 'No properties available for bulk update test';
    return;
  }
  
  const updates = {
    special_instructions: 'Updated via bulk operation - Admin test'
  };
  
  const result = await bulkUpdateProperties(propertyIds, updates);
  console.log('Bulk update result:', result);
}

function testAnalytics() {
  analytics.value = getPropertyAnalytics();
  console.log('Property analytics:', analytics.value);
}

function testFilterProperties() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const criteria: any = {};
  
  if (filterCriteria.value.owner_id) {
    criteria.owner_id = filterCriteria.value.owner_id;
  }
  
  if (filterCriteria.value.pricing_tier) {
    criteria.pricing_tier = filterCriteria.value.pricing_tier;
  }
  
  if (filterCriteria.value.active !== null) {
    criteria.active = filterCriteria.value.active;
  }
  
  filteredResults.value = filterProperties(criteria);
  console.log('Filter results:', filteredResults.value);
}

function clearFilters() {
  filterCriteria.value = {
    owner_id: '',
    pricing_tier: '',
    active: null
  };
  filteredResults.value = [];
}

// Initialize demo data on mount
onMounted(async () => {
  console.log('UseAdminProperties Demo initialized');
  console.log('System metrics:', systemPropertyMetrics.value);
  console.log('Properties by owner:', propertiesByOwner.value);
  console.log('Properties by tier:', propertiesByPricingTier.value);
  
  // Auto-generate analytics for demo
  setTimeout(() => {
    testAnalytics();
  }, 1000);
});
</script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.text-h4 {
  line-height: 1.2;
}

.v-progress-linear {
  border-radius: 10px;
}
</style> 