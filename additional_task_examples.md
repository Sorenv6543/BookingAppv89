# 📚 Additional Task Examples & Quick Reference

## **TASK-061: Create OwnerCalendar.vue Component**

### **Quick Implementation Pattern**

```vue
<!-- src/components/smart/owner/OwnerCalendar.vue -->
<template>
  <div class="owner-calendar">
    <!-- Calendar Header with Owner Controls -->
    <OwnerCalendarControls
      v-model:view="calendarView"
      v-model:selected-property="selectedPropertyId"
      :properties="ownerProperties"
      :loading="loading"
      @add-booking="showAddBookingDialog = true"
      @export-calendar="handleExport"
    />
    
    <!-- FullCalendar Integration -->
    <FullCalendar
      ref="calendarRef"
      :options="calendarOptions"
      class="owner-calendar__content"
    />
    
    <!-- Owner Booking Dialog -->
    <v-dialog v-model="showAddBookingDialog" max-width="600">
      <OwnerBookingForm
        :properties="ownerProperties"
        :selected-date="selectedDate"
        @save="handleBookingSave"
        @cancel="showAddBookingDialog = false"
      />
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { useOwnerDataStore } from '@/stores/ownerData'
import { useCalendarState } from '@/composables/shared/useCalendarState'
import OwnerCalendarControls from '@/components/dumb/owner/OwnerCalendarControls.vue'
import OwnerBookingForm from '@/components/dumb/owner/OwnerBookingForm.vue'
import type { CalendarOptions, EventInput } from '@fullcalendar/core'

// Owner data store
const ownerData = useOwnerDataStore()
const { calendarView, selectedDate } = useCalendarState()

// Local state
const calendarRef = ref()
const selectedPropertyId = ref<string | null>(null)
const showAddBookingDialog = ref(false)
const loading = ref(false)

// Owner-specific data (pre-filtered by store)
const ownerProperties = computed(() => ownerData.ownerProperties)
const ownerBookings = computed(() => {
  // Further filter by selected property if needed
  if (selectedPropertyId.value) {
    return ownerData.getPropertyBookings(selectedPropertyId.value)
  }
  return ownerData.ownerBookings
})

// Calendar configuration
const calendarOptions = computed((): CalendarOptions => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: calendarView.value,
  headerToolbar: false, // Use custom header
  events: ownerBookings.value.map(booking => ({
    id: booking.id,
    title: `${booking.property_name} - ${booking.guest_count} guests`,
    start: booking.checkin_date,
    end: booking.checkout_date,
    backgroundColor: booking.booking_type === 'turn' ? '#ff9800' : '#2196f3',
    borderColor: booking.booking_type === 'turn' ? '#f57c00' : '#1976d2',
    extendedProps: {
      booking,
      bookingType: booking.booking_type,
      status: booking.status
    }
  })),
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  select: handleDateSelect,
  eventClick: handleEventClick,
  height: 'auto'
}))

// Event handlers
const handleDateSelect = (selectInfo: any) => {
  selectedDate.value = new Date(selectInfo.start)
  showAddBookingDialog.value = true
}

const handleEventClick = (clickInfo: any) => {
  const booking = clickInfo.event.extendedProps.booking
  // Navigate to booking details or show edit dialog
  navigateToBooking(booking.id)
}

const handleBookingSave = async (bookingData: any) => {
  try {
    loading.value = true
    await ownerData.createBooking(bookingData)
    showAddBookingDialog.value = false
  } finally {
    loading.value = false
  }
}

const handleExport = () => {
  // Export owner's calendar data
  exportOwnerCalendar(ownerBookings.value)
}
</script>
```

---

## **TASK-062: Create AdminSidebar.vue Component**

### **Quick Implementation Pattern**

```vue
<!-- src/components/smart/admin/AdminSidebar.vue -->
<template>
  <v-navigation-drawer
    v-model="isOpen"
    :rail="isRail"
    app
    class="admin-sidebar"
  >
    <!-- Admin Profile with Role Indicator -->
    <v-list-item class="admin-profile">
      <template #prepend>
        <v-avatar color="primary">
          <v-icon>mdi-shield-account</v-icon>
        </v-avatar>
      </template>
      <v-list-item-title>{{ authStore.user?.name }}</v-list-item-title>
      <v-list-item-subtitle>System Administrator</v-list-item-subtitle>
    </v-list-item>

    <!-- System Overview Dashboard -->
    <v-list-item v-if="!isRail" class="system-overview">
      <div class="admin-metrics">
        <div class="metric-item">
          <div class="metric-value">{{ systemMetrics.totalProperties }}</div>
          <div class="metric-label">Total Properties</div>
        </div>
        <div class="metric-item">
          <div class="metric-value">{{ systemMetrics.activeBookings }}</div>
          <div class="metric-label">Active Bookings</div>
        </div>
        <div class="metric-item">
          <div class="metric-value text-warning">{{ systemMetrics.urgentTurns }}</div>
          <div class="metric-label">Urgent Turns</div>
        </div>
      </div>
    </v-list-item>

    <!-- Admin Navigation -->
    <v-list density="compact" nav>
      <!-- System Dashboard -->
      <v-list-item
        prepend-icon="mdi-view-dashboard-variant"
        title="System Dashboard"
        @click="navigateTo('/admin')"
      />

      <!-- Property Management -->
      <v-list-group value="properties">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-home-group"
            title="All Properties"
          />
        </template>
        <v-list-item title="Property List" @click="navigateTo('/admin/properties')" />
        <v-list-item title="Add Property" @click="showAddPropertyDialog = true" />
        <v-list-item title="Property Analytics" @click="navigateTo('/admin/properties/analytics')" />
      </v-list-group>

      <!-- Booking Management -->
      <v-list-item
        prepend-icon="mdi-calendar-multiple"
        title="All Bookings"
        @click="navigateTo('/admin/bookings')"
      />

      <!-- Cleaner Management -->
      <v-list-item
        prepend-icon="mdi-account-hard-hat"
        title="Cleaner Management"
        @click="navigateTo('/admin/cleaners')"
      />

      <!-- Turn Management -->
      <v-list-item
        prepend-icon="mdi-swap-horizontal"
        title="Turn Management"
        @click="navigateTo('/admin/turns')"
      />

      <!-- Reports & Analytics -->
      <v-list-group value="reports">
        <template #activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-chart-box"
            title="Reports"
          />
        </template>
        <v-list-item title="Revenue Report" @click="navigateTo('/admin/reports/revenue')" />
        <v-list-item title="Occupancy Report" @click="navigateTo('/admin/reports/occupancy')" />
        <v-list-item title="Cleaner Performance" @click="navigateTo('/admin/reports/cleaners')" />
      </v-list-group>

      <!-- System Settings -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="System Settings"
        @click="navigateTo('/admin/settings')"
      />
    </v-list>

    <!-- Critical Alerts -->
    <template #append>
      <v-alert
        v-if="criticalAlerts.length > 0"
        type="warning"
        variant="tonal"
        density="compact"
        class="ma-2"
      >
        <div class="text-caption">
          {{ criticalAlerts.length }} Critical Alert{{ criticalAlerts.length > 1 ? 's' : '' }}
        </div>
        <v-btn
          size="small"
          variant="text"
          @click="showAlertsDialog = true"
        >
          View Details
        </v-btn>
      </v-alert>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAdminDataStore } from '@/stores/adminData'
import { useAuthStore } from '@/stores/auth'

// Admin sees ALL data - no filtering
const adminData = useAdminDataStore()
const authStore = useAuthStore()

const systemMetrics = computed(() => adminData.systemMetrics)
const criticalAlerts = computed(() => adminData.criticalAlerts)
</script>
```

---

## **TASK-067: Move Demo Components Script**

### **Automated Demo Component Organization**

```bash
#!/bin/bash
# scripts/organize-demo-components.sh

echo "🚀 Organizing demo components..."

# Create dev folder structure
mkdir -p src/dev/demos
mkdir -p src/dev/pages
mkdir -p src/dev/components

# Move demo components
echo "📁 Moving demo components..."
mv src/components/demos/* src/dev/demos/ 2>/dev/null || echo "No demo components to move"
mv src/pages/demos/* src/dev/pages/ 2>/dev/null || echo "No demo pages to move"

# Move demo-specific components
echo "📁 Moving demo-specific files..."
mv src/components/dumb/PropertyCardDemo.vue src/dev/demos/ 2>/dev/null || echo "PropertyCardDemo.vue not found"

# Update vite.config.ts to exclude dev folder from production
echo "⚙️ Updating vite.config.ts..."
cat >> vite.config.ts << 'EOF'

// Exclude dev folder from production builds
if (process.env.NODE_ENV === 'production') {
  config.build = config.build || {}
  config.build.rollupOptions = config.build.rollupOptions || {}
  config.build.rollupOptions.external = config.build.rollupOptions.external || []
  
  if (Array.isArray(config.build.rollupOptions.external)) {
    config.build.rollupOptions.external.push(/^\/src\/dev\/.*/)
  }
}
EOF

# Update router to conditionally include dev routes
echo "🛣️ Creating dev router..."
cat > src/dev/router.ts << 'EOF'
// src/dev/router.ts - Development-only routes
import type { RouteRecordRaw } from 'vue-router'

export const devRoutes: RouteRecordRaw[] = [
  {
    path: '/dev',
    name: 'dev-index',
    component: () => import('./pages/index.vue'),
    meta: { requiresAuth: false, devOnly: true }
  },
  {
    path: '/dev/demos',
    name: 'dev-demos',
    component: () => import('./pages/demos.vue'),
    meta: { requiresAuth: false, devOnly: true }
  }
]

// Only include dev routes in development
export const getDevRoutes = (): RouteRecordRaw[] => {
  return import.meta.env.DEV ? devRoutes : []
}
EOF

echo "✅ Demo components organized!"
echo "📋 Summary:"
echo "   - Demo components moved to src/dev/"
echo "   - Production builds will exclude dev folder"
echo "   - Dev routes only available in development"
```

---

## **TASK-078: Build Optimization Configuration**

### **Enhanced Vite Configuration**

```typescript
// vite.config.ts - Enhanced configuration
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      vuetify({
        autoImport: true,
        styles: {
          configFile: 'src/styles/variables.scss'
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      // Optimize for production
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      rollupOptions: {
        // Code splitting
        output: {
          manualChunks: {
            // Vendor chunks
            vue: ['vue', 'vue-router', 'pinia'],
            vuetify: ['vuetify'],
            
            // Role-based chunks
            'owner-components': [
              './src/components/smart/owner/HomeOwner.vue',
              './src/components/smart/owner/OwnerSidebar.vue',
              './src/components/smart/owner/OwnerCalendar.vue'
            ],
            'admin-components': [
              './src/components/smart/admin/HomeAdmin.vue',
              './src/components/smart/admin/AdminSidebar.vue',
              './src/components/smart/admin/AdminCalendar.vue'
            ],
            
            // Shared utilities
            'shared-utils': [
              './src/composables/shared/useAuth.ts',
              './src/composables/shared/useBookings.ts',
              './src/composables/shared/useProperties.ts'
            ]
          }
        },
        
        // Exclude dev folder from production
        external: mode === 'production' ? [/^\/src\/dev\/.*$/] : []
      },
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Generate source maps for debugging
      sourcemap: mode !== 'production'
    },
    
    // Development server optimization
    server: {
      hmr: {
        overlay: false
      }
    },
    
    // Define global constants
    define: {
      __DEV__: mode !== 'production',
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  }
})
```

---

## **TASK-081: Admin Component Testing Example**

### **Admin Component Test Pattern**

```typescript
// src/components/smart/admin/__tests__/AdminSidebar.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import AdminSidebar from '../AdminSidebar.vue'
import { mountAdminComponent, expectAdminDataAccess } from '@/test/utils/roleBasedMounting'

describe('AdminSidebar.vue', () => {
  it('should display system-wide metrics', async () => {
    const wrapper = await mountAdminComponent(AdminSidebar, {
      adminData: {
        allProperties: [
          { name: 'Property 1', owner_id: 'owner1' },
          { name: 'Property 2', owner_id: 'owner2' },
          { name: 'Property 3', owner_id: 'owner1' }
        ],
        allBookings: [
          { property_id: 'prop1', owner_id: 'owner1', status: 'confirmed' },
          { property_id: 'prop2', owner_id: 'owner2', status: 'pending' }
        ]
      }
    })

    // Admin should see ALL properties and bookings
    expect(wrapper.find('[data-testid="total-properties"]').text()).toContain('3')
    expect(wrapper.find('[data-testid="total-bookings"]').text()).toContain('2')
    
    // Verify admin has access to system-wide data
    expectAdminDataAccess(wrapper)
  })

  it('should show admin-specific navigation', async () => {
    const wrapper = await mountAdminComponent(AdminSidebar)

    // Should show admin-only features
    expect(wrapper.find('[data-testid="cleaner-management"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="system-reports"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="admin-settings"]').exists()).toBe(true)
  })

  it('should display critical system alerts', async () => {
    const wrapper = await mountAdminComponent(AdminSidebar, {
      adminData: {
        allBookings: [
          {
            booking_type: 'turn',
            status: 'pending',
            checkout_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Overdue
            assigned_cleaner_id: null
          }
        ]
      }
    })

    // Should show critical alerts
    const alertsSection = wrapper.find('[data-testid="critical-alerts"]')
    expect(alertsSection.exists()).toBe(true)
    expect(alertsSection.text()).toContain('Critical Alert')
  })
})
```

---

## **Quick Reference Commands**

### **Development Workflow**

```bash
# Start development
npm run dev

# Run tests for specific role
npm run test src/components/smart/owner/
npm run test src/components/smart/admin/

# Type checking
npm run type-check

# Build for production
npm run build

# Organize demo components
./scripts/organize-demo-components.sh

# Audit imports
npm run audit:imports

# Fix import paths
./scripts/fix-imports.sh
```

### **File Structure Quick Reference**

```
src/
├── components/
│   ├── smart/
│   │   ├── owner/          # Owner-specific smart components
│   │   ├── admin/          # Admin-specific smart components
│   │   └── shared/         # Shared smart components
│   └── dumb/
│       ├── owner/          # Owner-specific UI components
│       ├── admin/          # Admin-specific UI components
│       └── shared/         # Shared UI components
├── composables/
│   ├── owner/              # Owner-specific composables
│   ├── admin/              # Admin-specific composables
│   └── shared/             # Shared composables ✅
├── stores/
│   ├── ownerData.ts        # Owner-filtered data store
│   ├── adminData.ts        # Admin system-wide data store
│   └── [existing stores]   # Your current stores
├── dev/                    # Development-only code
│   ├── demos/              # Demo components
│   └── pages/              # Demo pages
└── test/
    └── utils/
        └── roleBasedMounting.ts # Role-based testing utilities
```

This additional documentation provides quick implementation patterns and examples for the remaining critical tasks, helping you maintain consistency and speed up development.