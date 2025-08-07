<template>
  <v-container class="responsive-grid">
    <v-row>
      <v-col cols="12">
        <v-card class="mb-4">
          <v-card-title class="d-flex align-center">
            <v-icon
              icon="mdi-responsive"
              class="mr-2"
            />
            Responsive Layout System Demo
          </v-card-title>
          <v-card-text>
            <p>This demo shows the responsive layout system in action across different breakpoints.</p>
            
            <!-- Current Breakpoint Info -->
            <v-alert
              :type="alertType"
              variant="tonal"
              class="mb-4"
            >
              <strong>Current Breakpoint:</strong> {{ currentBreakpoint.toUpperCase() }} 
              ({{ width }}x{{ height }})
              <br>
              <strong>Device Type:</strong> {{ deviceType }}
            </v-alert>

            <!-- Layout State Info -->
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    Layout State
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>Drawer Open</v-list-item-title>
                        <template #append>
                          <v-chip 
                            :color="isDrawerOpen ? 'success' : 'default'"
                            size="small"
                          >
                            {{ isDrawerOpen ? 'Yes' : 'No' }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Drawer Permanent</v-list-item-title>
                        <template #append>
                          <v-chip 
                            :color="shouldDrawerBePermanent ? 'primary' : 'default'"
                            size="small"
                          >
                            {{ shouldDrawerBePermanent ? 'Yes' : 'No' }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Rail Mode</v-list-item-title>
                        <template #append>
                          <v-chip 
                            :color="isDrawerRail ? 'warning' : 'default'"
                            size="small"
                          >
                            {{ isDrawerRail ? 'Yes' : 'No' }}
                          </v-chip>
                        </template>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Drawer Width</v-list-item-title>
                        <template #append>
                          <v-chip size="small">
                            {{ drawerWidth }}px
                          </v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
              
              <v-col
                cols="12"
                sm="6"
              >
                <v-card variant="outlined">
                  <v-card-title class="text-h6">
                    Breakpoint Info
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <v-list-item-title>Mobile</v-list-item-title>
                        <template #append>
                          <v-icon :color="isMobile ? 'success' : 'default'">
                            {{ isMobile ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                          </v-icon>
                        </template>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Tablet</v-list-item-title>
                        <template #append>
                          <v-icon :color="isTablet ? 'success' : 'default'">
                            {{ isTablet ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                          </v-icon>
                        </template>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-title>Desktop</v-list-item-title>
                        <template #append>
                          <v-icon :color="isDesktop ? 'success' : 'default'">
                            {{ isDesktop ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                          </v-icon>
                        </template>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <!-- Layout Controls -->
            <v-card
              variant="outlined"
              class="mt-4"
            >
              <v-card-title class="text-h6">
                Layout Controls
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-btn
                      :prepend-icon="isDrawerOpen ? 'mdi-menu-open' : 'mdi-menu'"
                      :color="isDrawerOpen ? 'primary' : 'default'"
                      variant="outlined"
                      block
                      @click="toggleDrawer"
                    >
                      {{ isDrawerOpen ? 'Close' : 'Open' }} Drawer
                    </v-btn>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-btn
                      :prepend-icon="isDrawerRail ? 'mdi-menu-open' : 'mdi-menu'"
                      :color="isDrawerRail ? 'warning' : 'default'"
                      variant="outlined"
                      block
                      :disabled="!isDesktop"
                      @click="isDrawerRail = !isDrawerRail"
                    >
                      Toggle Rail Mode
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Responsive Features Demo -->
            <v-card
              variant="outlined"
              class="mt-4"
            >
              <v-card-title class="text-h6">
                Responsive Features
              </v-card-title>
              <v-card-text>
                <!-- Responsive Grid Demo -->
                <v-row class="mb-4">
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card
                      color="primary"
                      variant="tonal"
                    >
                      <v-card-text class="text-center">
                        <v-icon size="large">
                          mdi-cellphone
                        </v-icon>
                        <div class="text-caption mt-2">
                          Mobile: 12 cols
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card
                      color="secondary"
                      variant="tonal"
                    >
                      <v-card-text class="text-center">
                        <v-icon size="large">
                          mdi-tablet
                        </v-icon>
                        <div class="text-caption mt-2">
                          Tablet: 6 cols
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card
                      color="success"
                      variant="tonal"
                    >
                      <v-card-text class="text-center">
                        <v-icon size="large">
                          mdi-laptop
                        </v-icon>
                        <div class="text-caption mt-2">
                          Medium: 4 cols
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card
                      color="warning"
                      variant="tonal"
                    >
                      <v-card-text class="text-center">
                        <v-icon size="large">
                          mdi-monitor
                        </v-icon>
                        <div class="text-caption mt-2">
                          Desktop: 3 cols
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>

                <!-- Responsive Utilities Demo -->
                <div class="d-flex flex-wrap gap-2 mb-4">
                  <v-chip
                    class="show-mobile hide-tablet hide-desktop"
                    color="primary"
                  >
                    Mobile Only
                  </v-chip>
                  <v-chip
                    class="hide-mobile show-tablet hide-desktop"
                    color="secondary"
                  >
                    Tablet Only
                  </v-chip>
                  <v-chip
                    class="hide-mobile hide-tablet show-desktop"
                    color="success"
                  >
                    Desktop Only
                  </v-chip>
                  <v-chip
                    class="hide-mobile"
                    color="info"
                  >
                    Tablet & Desktop
                  </v-chip>
                </div>

                <!-- Touch-friendly elements on mobile -->
                <div
                  v-if="isMobile"
                  class="mobile-optimized"
                >
                  <v-alert
                    type="info"
                    variant="tonal"
                    class="mb-3"
                  >
                    Mobile optimizations active: larger touch targets, adjusted spacing
                  </v-alert>
                  <div class="d-flex flex-column gap-3">
                    <v-btn
                      size="large"
                      color="primary"
                      block
                    >
                      Large Touch Button
                    </v-btn>
                    <v-btn
                      size="large"
                      color="secondary"
                      block
                    >
                      Another Touch Button
                    </v-btn>
                  </div>
                </div>

                <!-- Desktop-specific features -->
                <div
                  v-if="isDesktop"
                  class="hide-mobile"
                >
                  <v-alert
                    type="success"
                    variant="tonal"
                    class="mb-3"
                  >
                    Desktop features active: hover effects, smaller targets, dense layout
                  </v-alert>
                  <div class="d-flex gap-2">
                    <v-btn
                      size="small"
                      color="primary"
                    >
                      Hover Me
                    </v-btn>
                    <v-btn
                      size="small"
                      color="secondary"
                    >
                      Dense Button
                    </v-btn>
                    <v-btn
                      size="small"
                      color="success"
                    >
                      Desktop Action
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- CSS Classes Applied -->
            <v-card
              variant="outlined"
              class="mt-4"
            >
              <v-card-title class="text-h6">
                Applied CSS Classes
              </v-card-title>
              <v-card-text>
                <v-chip-group>
                  <v-chip 
                    v-for="(value, key) in layoutClasses"
                    :key="key"
                    :color="value ? 'primary' : 'default'"
                    size="small"
                  >
                    {{ key }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>

            <!-- CSS Variables -->
            <v-card
              variant="outlined"
              class="mt-4"
            >
              <v-card-title class="text-h6">
                CSS Variables
              </v-card-title>
              <v-card-text>
                <v-simple-table>
                  <tbody>
                    <tr
                      v-for="(value, key) in layoutStyles"
                      :key="key"
                    >
                      <td><code>{{ key }}</code></td>
                      <td><strong>{{ value }}</strong></td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useResponsiveLayout } from '@/composables/shared/useResponsiveLayout'

// Use the responsive layout composable
const {
  // Breakpoint info
  currentBreakpoint,
  width,
  height,
  isMobile,
  isTablet,
  isDesktop,
  
  // Layout state
  isDrawerOpen,
  shouldDrawerBePermanent,
  isDrawerRail,
  drawerWidth,
  
  // Layout properties
  layoutClasses,
  layoutStyles,
  
  // Methods
  toggleDrawer
} = useResponsiveLayout()

// Computed properties for the demo
const deviceType = computed(() => {
  if (isMobile.value) return 'Mobile'
  if (isTablet.value) return 'Tablet'
  if (isDesktop.value) return 'Desktop'
  return 'Unknown'
})

const alertType = computed((): 'info' | 'warning' | 'success' | 'error' => {
  if (isMobile.value) return 'info'
  if (isTablet.value) return 'warning'
  if (isDesktop.value) return 'success'
  return 'error'
})
</script>

<style scoped>
.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

/* Demo-specific hover effects for desktop */
@media (min-width: 960px) {
  .v-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
}

/* Mobile-specific touch feedback */
@media (max-width: 599px) {
  .v-btn:active {
    transform: scale(0.98);
  }
}
</style> 