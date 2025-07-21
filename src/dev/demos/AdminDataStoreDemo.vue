<!-- 
🎯 ADMIN DATA STORE DEMO
Showcases the admin data store with system-wide access and analytics
Based on TASK-072 implementation
-->

<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon
              icon="mdi-shield-crown"
              class="mr-3"
            />
            Admin Data Store Demo
            <v-spacer />
            <v-chip
              color="info"
              variant="tonal"
              size="small"
            >
              System-Wide Access
            </v-chip>
          </v-card-title>
          
          <v-card-text>
            <v-alert
              type="info"
              variant="tonal"
              title="TASK-072: Admin Store-Level Architecture"
              class="mb-4"
            >
              <p class="mb-2">
                This demo showcases the admin data store with system-wide access and business analytics.
              </p>
              <ul class="ml-4">
                <li><strong>No data filtering</strong> - admin sees all properties and bookings</li>
                <li><strong>System-wide metrics</strong> - total properties, owners, revenue</li>
                <li><strong>Owner analytics</strong> - performance across all clients</li>
                <li><strong>Critical alerts</strong> - unassigned cleanings, overdue turns</li>
              </ul>
            </v-alert>

            <!-- System Metrics -->
            <v-row class="mb-4">
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  color="primary"
                  variant="tonal"
                >
                  <v-card-title>Properties</v-card-title>
                  <v-card-text>
                    <div class="text-h4">
                      {{ adminData.systemMetrics.totalProperties }}
                    </div>
                    <div class="text-caption">
                      {{ adminData.systemMetrics.activeProperties }} active
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  color="success"
                  variant="tonal"
                >
                  <v-card-title>Owners</v-card-title>
                  <v-card-text>
                    <div class="text-h4">
                      {{ adminData.systemMetrics.totalOwners }}
                    </div>
                    <div class="text-caption">
                      Property owners
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  color="warning"
                  variant="tonal"
                >
                  <v-card-title>Urgent Turns</v-card-title>
                  <v-card-text>
                    <div class="text-h4">
                      {{ adminData.systemMetrics.urgentTurns }}
                    </div>
                    <div class="text-caption">
                      Within 24 hours
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col
                cols="12"
                md="3"
              >
                <v-card
                  color="info"
                  variant="tonal"
                >
                  <v-card-title>Revenue</v-card-title>
                  <v-card-text>
                    <div class="text-h4">
                      ${{ adminData.systemMetrics.totalRevenue.toLocaleString() }}
                    </div>
                    <div class="text-caption">
                      Total system revenue
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Critical Alerts -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-alert-circle"
                      class="mr-2"
                    />
                    Critical Alerts ({{ adminData.criticalAlerts.length }})
                  </v-card-title>
                  
                  <v-card-text>
                    <div v-if="adminData.criticalAlerts.length > 0">
                      <v-alert
                        v-for="alert in adminData.criticalAlerts"
                        :key="alert.title"
                        :type="alert.type"
                        variant="tonal"
                        class="mb-2"
                      >
                        <template #prepend>
                          <v-avatar 
                            :color="getAlertColor(alert.type)"
                            size="40"
                          >
                            <span class="text-h6">{{ alert.count }}</span>
                          </v-avatar>
                        </template>
                        
                        <v-alert-title>{{ alert.title }}</v-alert-title>
                        <div>{{ alert.message }}</div>
                        
                        <template #append>
                          <v-btn
                            :color="getAlertColor(alert.type)"
                            variant="outlined"
                            size="small"
                            @click="handleAlert(alert.action)"
                          >
                            Take Action
                          </v-btn>
                        </template>
                      </v-alert>
                    </div>
                    
                    <v-alert
                      v-else
                      type="success"
                      variant="tonal"
                    >
                      <v-icon
                        icon="mdi-check-circle"
                        class="mr-2"
                      />
                      No critical alerts! System is running smoothly.
                    </v-alert>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Owner Analytics -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-chart-bar"
                      class="mr-2"
                    />
                    Owner Performance Analytics
                  </v-card-title>
                  
                  <v-card-text>
                    <v-data-table
                      :headers="ownerHeaders"
                      :items="adminData.ownerAnalytics"
                      item-key="ownerId"
                      class="elevation-1"
                    >
                      <template #item.properties="{ item }">
                        <v-chip
                          size="small"
                          color="primary"
                          variant="tonal"
                        >
                          {{ item.properties.length }}
                        </v-chip>
                      </template>
                      
                      <template #item.bookings="{ item }">
                        <v-chip
                          size="small"
                          color="success"
                          variant="tonal"
                        >
                          {{ item.bookings.length }}
                        </v-chip>
                      </template>
                      
                      <template #item.revenue="{ item }">
                        <strong>${{ item.revenue.toLocaleString() }}</strong>
                      </template>
                    </v-data-table>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Performance Insights -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-speedometer"
                      class="mr-2"
                    />
                    Performance Insights
                  </v-card-title>
                  
                  <v-card-text>
                    <v-row>
                      <v-col
                        cols="12"
                        md="3"
                      >
                        <v-card
                          color="surface-variant"
                          variant="tonal"
                        >
                          <v-card-title>Avg Bookings</v-card-title>
                          <v-card-text>
                            <div class="text-h6">
                              {{ adminData.performanceInsights.avgBookingsPerProperty }}
                            </div>
                            <div class="text-caption">
                              Per property
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      
                      <v-col
                        cols="12"
                        md="3"
                      >
                        <v-card
                          color="surface-variant"
                          variant="tonal"
                        >
                          <v-card-title>Turn Rate</v-card-title>
                          <v-card-text>
                            <div class="text-h6">
                              {{ adminData.performanceInsights.turnPercentage }}%
                            </div>
                            <div class="text-caption">
                              Same-day turns
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      
                      <v-col
                        cols="12"
                        md="3"
                      >
                        <v-card
                          color="surface-variant"
                          variant="tonal"
                        >
                          <v-card-title>Completion</v-card-title>
                          <v-card-text>
                            <div class="text-h6">
                              {{ adminData.performanceInsights.completionRate }}%
                            </div>
                            <div class="text-caption">
                              Success rate
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                      
                      <v-col
                        cols="12"
                        md="3"
                      >
                        <v-card
                          color="surface-variant"
                          variant="tonal"
                        >
                          <v-card-title>Avg Revenue</v-card-title>
                          <v-card-text>
                            <div class="text-h6">
                              ${{ adminData.performanceInsights.avgRevenue }}
                            </div>
                            <div class="text-caption">
                              Per booking
                            </div>
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- All Properties (System-Wide) -->
            <v-row class="mb-4">
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-home-group"
                      class="mr-2"
                    />
                    All Properties ({{ adminData.allProperties.length }})
                    <v-spacer />
                    <v-btn
                      color="primary"
                      variant="tonal"
                      @click="showAllProperties = !showAllProperties"
                    >
                      {{ showAllProperties ? 'Hide' : 'Show' }} Details
                    </v-btn>
                  </v-card-title>
                  
                  <v-expand-transition>
                    <v-card-text v-if="showAllProperties">
                      <v-row>
                        <v-col
                          v-for="property in adminData.allProperties.slice(0, 6)"
                          :key="property.id"
                          cols="12"
                          md="6"
                          lg="4"
                        >
                          <v-card variant="outlined">
                            <v-card-title class="d-flex align-center">
                              <v-icon 
                                :icon="property.active ? 'mdi-home' : 'mdi-home-off'"
                                :color="property.active ? 'success' : 'grey'"
                                class="mr-2"
                              />
                              {{ property.name }}
                            </v-card-title>
                            <v-card-text>
                              <div class="text-caption mb-2">
                                Owner: {{ property.owner_id.substring(0, 8) }}
                              </div>
                              <div class="text-caption mb-2">
                                Address: {{ property.address || 'No address' }}
                              </div>
                              <v-chip
                                size="small"
                                variant="tonal"
                              >
                                {{ property.pricing_tier }}
                              </v-chip>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>

            <!-- All Bookings (System-Wide) -->
            <v-row>
              <v-col cols="12">
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon
                      icon="mdi-calendar-multiple"
                      class="mr-2"
                    />
                    All Bookings ({{ adminData.allBookings.length }})
                    <v-spacer />
                    <v-btn
                      color="secondary"
                      variant="tonal"
                      @click="showAllBookings = !showAllBookings"
                    >
                      {{ showAllBookings ? 'Hide' : 'Show' }} Details
                    </v-btn>
                  </v-card-title>
                  
                  <v-expand-transition>
                    <v-card-text v-if="showAllBookings">
                      <v-list>
                        <v-list-item
                          v-for="booking in adminData.allBookings.slice(0, 10)"
                          :key="booking.id"
                        >
                          <template #prepend>
                            <v-avatar 
                              :color="getBookingTypeColor(booking.booking_type)"
                              size="40"
                            >
                              <v-icon :icon="getBookingTypeIcon(booking.booking_type)" />
                            </v-avatar>
                          </template>
                          
                          <v-list-item-title>
                            Property: {{ booking.property_id.substring(0, 8) }}
                          </v-list-item-title>
                          <v-list-item-subtitle>
                            {{ formatDate(booking.checkout_date) }} → {{ formatDate(booking.checkin_date) }}
                          </v-list-item-subtitle>
                          
                          <template #append>
                            <div class="d-flex flex-column align-end">
                              <v-chip 
                                :color="getStatusColor(booking.status)"
                                size="small"
                                variant="tonal"
                                class="mb-1"
                              >
                                {{ booking.status }}
                              </v-chip>
                              <div class="text-caption">
                                Owner: {{ booking.owner_id.substring(0, 8) }}
                              </div>
                            </div>
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-expand-transition>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminDataStore } from '@/stores/adminData'

// Store
const adminDataStore = useAdminDataStore()

// Local state
const showAllProperties = ref(false)
const showAllBookings = ref(false)

// Get admin data from store
const adminData = computed(() => adminDataStore)

// Table headers for owner analytics
const ownerHeaders = [
  { title: 'Owner ID', value: 'ownerId', key: 'ownerId' },
  { title: 'Owner Name', value: 'ownerName', key: 'ownerName' },
  { title: 'Properties', value: 'properties', key: 'properties' },
  { title: 'Bookings', value: 'bookings', key: 'bookings' },
  { title: 'Revenue', value: 'revenue', key: 'revenue' }
]

// Methods
const getAlertColor = (type: string): string => {
  const colors: Record<string, string> = {
    warning: 'warning',
    error: 'error',
    info: 'info'
  }
  return colors[type] || 'grey'
}

const handleAlert = (action: string) => {
  console.log('Handle alert action:', action)
  // This would navigate to the appropriate admin interface
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString()
}

const getBookingTypeColor = (type: string): string => {
  return type === 'turn' ? 'warning' : 'primary'
}

const getBookingTypeIcon = (type: string): string => {
  return type === 'turn' ? 'mdi-swap-horizontal' : 'mdi-calendar-check'
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'warning',
    scheduled: 'info',
    in_progress: 'primary',
    completed: 'success',
    cancelled: 'error'
  }
  return colors[status] || 'grey'
}
</script>

<style scoped>
.v-card {
  height: 100%;
}
</style> 