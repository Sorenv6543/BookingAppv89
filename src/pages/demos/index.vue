<template>
  <v-container class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="pa-6">
          <v-card-title class="text-h4 mb-4">
            <v-icon class="mr-3" color="primary">mdi-test-tube</v-icon>
            Demo Components
          </v-card-title>
          
          <v-card-subtitle class="mb-6">
            Browse and test all available demo components from the /dev folder
          </v-card-subtitle>
          
          <v-row>
            <v-col
              v-for="demo in demoRoutes"
              :key="demo.name"
              cols="12"
              md="6"
              lg="4"
            >
              <v-card
                variant="outlined"
                class="demo-card"
                hover
                @click="navigateToDemo(demo.path)"
              >
                <v-card-title class="text-h6">
                  <v-icon :icon="demo.icon" class="mr-2" :color="demo.color" />
                  {{ demo.title }}
                </v-card-title>
                <v-card-text>
                  <p class="text-body-2 mb-2">{{ demo.description }}</p>
                  <v-chip
                    :color="demo.category.color"
                    size="small"
                    variant="tonal"
                  >
                    {{ demo.category.name }}
                  </v-chip>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    color="primary"
                    variant="text"
                    size="small"
                    @click.stop="navigateToDemo(demo.path)"
                  >
                    View Demo
                    <v-icon class="ml-1">mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

interface DemoRoute {
  name: string
  path: string
  title: string
  description: string
  icon: string
  color: string
  category: {
    name: string
    color: string
  }
}

const demoRoutes: DemoRoute[] = [
  {
    name: 'admin-calendar-demo',
    path: '/demos/admin-calendar-demo',
    title: 'Admin Calendar Demo',
    description: 'Full-featured admin calendar with system-wide booking management',
    icon: 'mdi-calendar-multiple',
    color: 'primary',
    category: { name: 'Admin', color: 'primary' }
  },
  {
    name: 'admin-quick-actions-demo',
    path: '/demos/admin-quick-actions-demo',
    title: 'Admin Quick Actions Demo',
    description: 'Quick action buttons and controls for admin operations',
    icon: 'mdi-lightning-bolt',
    color: 'warning',
    category: { name: 'Admin', color: 'primary' }
  },
  {
    name: 'admin-sidebar',
    path: '/demos/admin-sidebar',
    title: 'Admin Sidebar',
    description: 'Complete admin sidebar with system-wide data and controls',
    icon: 'mdi-view-sidebar',
    color: 'secondary',
    category: { name: 'Admin', color: 'primary' }
  },

  {
      name: 'calendar-header-blue-gradient',
      path: '/demos/calendar-header-blue-gradient',
      title: 'Calendar Header',
      description: 'Calendar header with blue gradient styling',
      icon: 'mdi-calendar-month',
      color: 'info',
      category: { name: 'UI', color: 'info' }
    },
    
    
    {
        name: 'home-admin-demo',
        path: '/demos/home-admin-demo',
        title: 'Home Admin Demo',
        description: 'Complete admin home interface with multi-tenant data',
        icon: 'mdi-home-city',
        color: 'primary',
        category: { name: 'Admin', color: 'primary' }
    },
    {
        name: 'owner-sidebar-demo',
        path: '/demos/owner-sidebar-demo',
        title: 'Owner Sidebar Demo',
        description: 'Property owner sidebar with filtered data and controls',
        icon: 'mdi-home-account',
        color: 'green',
        category: { name: 'Owner', color: 'green' }
    },
    {
        name: 'property-card-demo',
        path: '/demos/property-card-demo',
        title: 'Property Card Demo',
        description: 'Property display cards with various states and actions',
        icon: 'mdi-home-variant',
        color: 'orange',
        category: { name: 'Property', color: 'orange' }
    },
    {
        name: 'role-routing',
        path: '/demos/role-routing',
        title: 'Role Routing',
        description: 'Role-based routing and navigation testing',
        icon: 'mdi-account-multiple',
        color: 'purple',
        category: { name: 'Auth', color: 'success' }
    },
    {
        name: 'route-guards',
        path: '/demos/route-guards',
        title: 'Route Guards',
        description: 'Route protection and guard testing',
        icon: 'mdi-shield-account',
        color: 'warning',
        category: { name: 'Auth', color: 'success' }
    },
    {
        name: 'sidebar',
        path: '/demos/sidebar',
        title: 'Sidebar',
        description: 'Base sidebar component',
        icon: 'mdi-menu',
        color: 'grey',
        category: { name: 'UI', color: 'info' }
    },
    {
        name: 'sidebar-demo',
        path: '/demos/sidebar-demo',
        title: 'Sidebar Demo',
        description: 'Interactive sidebar component demonstration',
        icon: 'mdi-menu-open',
        color: 'grey',
        category: { name: 'UI', color: 'info' }
  },
  {
      name: 'turn-alerts-demo',
      path: '/demos/turn-alerts-demo',
      title: 'Turn Alerts Demo',
    description: 'Urgent turn notification and alert components',
    icon: 'mdi-bell-alert',
    color: 'error',
    category: { name: 'Booking', color: 'yellow' }
},
{
    name: 'turn-visual-indicators',
    path: '/demos/turn-visual-indicators',
    title: 'Turn Visual Indicators',
    description: 'Visual indicators for urgent turn bookings',
    icon: 'mdi-fire',
    color: 'red',
    category: { name: 'Booking', color: 'yellow' }
},
{
    name: 'use-admin-bookings-demo',
    path: '/demos/use-admin-bookings-demo',
    title: 'Admin Bookings Composable',
    description: 'Test the useAdminBookings composable functionality',
    icon: 'mdi-calendar-edit',
    color: 'primary',
    category: { name: 'Composable', color: 'teal' }
},
{
    name: 'use-admin-calendar-state-demo',
    path: '/demos/use-admin-calendar-state-demo',
    title: 'Admin Calendar State',
    description: 'Test the useAdminCalendarState composable',
    icon: 'mdi-calendar-month-outline',
    color: 'primary',
    category: { name: 'Composable', color: 'teal' }
},
{
    name: 'use-admin-properties-demo',
    path: '/demos/use-admin-properties-demo',
    title: 'Admin Properties Composable',
    description: 'Test the useAdminProperties composable functionality',
    icon: 'mdi-home-city-outline',
    color: 'primary',
    category: { name: 'Composable', color: 'teal' }
},
{
    name: 'use-owner-calendar-state-demo',
    path: '/demos/use-owner-calendar-state-demo',
    title: 'Owner Calendar State',
    description: 'Test the useOwnerCalendarState composable functionality',
    icon: 'mdi-calendar-account',
    color: 'green',
    category: { name: 'Composable', color: 'teal' }
},
{
    name: 'use-owner-bookings-demo',
    path: '/demos/use-owner-bookings-demo',
    title: 'Owner Bookings Composable',
    description: 'Test the useOwnerBookings composable functionality',
    icon: 'mdi-calendar-check',
    color: 'green',
    category: { name: 'Composable', color: 'teal' }
},

{
  name: 'auth-flow',
  path: '/demos/auth-flow',
  title: 'Authentication Flow',
  description: 'Test authentication, role switching, and navigation flows',
  icon: 'mdi-account-check',
  color: 'success',
  category: { name: 'Auth', color: 'success' }
},
]

const navigateToDemo = (path: string) => {
    router.push(path)
}
</script>

<style scoped>
.demo-card {
    transition: all 0.3s ease;
    cursor: pointer;
    height: 100%;
}

.demo-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.v-card-title {
    padding-bottom: 8px;
}

.v-card-text {
  flex-grow: 1;
}
</style> 