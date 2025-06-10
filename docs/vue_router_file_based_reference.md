# Vue Router 4 File-Based Routing + TypeScript Reference

## **Setup & Configuration**

### **Auto-Route Generator Plugin**
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

// Simple file-based routing plugin
function generateRoutes() {
  return {
    name: 'generate-routes',
    generateBundle() {
      // This would be implemented with a proper plugin
      // For now, we'll use manual route generation
    }
  };
}

export default defineConfig({
  plugins: [vue(), generateRoutes()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
```

### **Manual Route Generation (Recommended for TypeScript)**
```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// Import layouts
import DefaultLayout from '@/layouts/default.vue';
import AdminLayout from '@/layouts/admin.vue';
import AuthLayout from '@/layouts/auth.vue';

// Route definitions based on file structure
const routes: RouteRecordRaw[] = [
  // Root routes (pages/index.vue -> /)
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Dashboard'
    }
  },

  // Properties routes (pages/properties/)
  {
    path: '/properties',
    name: 'Properties',
    component: () => import('@/pages/properties/index.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Properties'
    }
  },
  {
    path: '/properties/create',
    name: 'PropertiesCreate',
    component: () => import('@/pages/properties/create.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Add Property'
    }
  },
  {
    path: '/properties/:id',
    name: 'PropertiesDetail',
    component: () => import('@/pages/properties/[id].vue'),
    props: true,
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Property Details'
    }
  },
  {
    path: '/properties/:id/edit',
    name: 'PropertiesEdit',
    component: () => import('@/pages/properties/[id]/edit.vue'),
    props: true,
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Edit Property'
    }
  },

  // Bookings routes (pages/bookings/)
  {
    path: '/bookings',
    name: 'Bookings',
    component: () => import('@/pages/bookings/index.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Bookings'
    }
  },
  {
    path: '/bookings/create',
    name: 'BookingsCreate',
    component: () => import('@/pages/bookings/create.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Add Booking'
    }
  },
  {
    path: '/bookings/:id',
    name: 'BookingsDetail',
    component: () => import('@/pages/bookings/[id].vue'),
    props: true,
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Booking Details'
    }
  },

  // Calendar route
  {
    path: '/calendar',
    name: 'Calendar',
    component: () => import('@/pages/calendar.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Calendar'
    }
  },

  // Admin routes (pages/admin/)
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('@/pages/admin/dashboard.vue'),
    meta: {
      layout: 'admin',
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Admin Dashboard'
    }
  },
  {
    path: '/admin/cleaners',
    name: 'AdminCleaners',
    component: () => import('@/pages/admin/cleaners.vue'),
    meta: {
      layout: 'admin',
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Manage Cleaners'
    }
  },
  {
    path: '/admin/schedule',
    name: 'AdminSchedule',
    component: () => import('@/pages/admin/schedule.vue'),
    meta: {
      layout: 'admin',
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Master Schedule'
    }
  },

  // Settings routes (pages/settings/)
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/settings/index.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Settings'
    }
  },
  {
    path: '/settings/profile',
    name: 'SettingsProfile',
    component: () => import('@/pages/settings/profile.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Profile Settings'
    }
  },
  {
    path: '/settings/notifications',
    name: 'SettingsNotifications',
    component: () => import('@/pages/settings/notifications.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,
      title: 'Notification Settings'
    }
  },

  // Auth routes (pages/auth/)
  {
    path: '/auth',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    name: 'AuthLogin',
    component: () => import('@/pages/auth/login.vue'),
    meta: {
      layout: 'auth',
      requiresGuest: true,
      title: 'Login'
    }
  },
  {
    path: '/auth/signup',
    name: 'AuthSignup',
    component: () => import('@/pages/auth/signup.vue'),
    meta: {
      layout: 'auth',
      requiresGuest: true,
      title: 'Sign Up'
    }
  },
  {
    path: '/auth/forgot-password',
    name: 'AuthForgotPassword',
    component: () => import('@/pages/auth/forgot-password.vue'),
    meta: {
      layout: 'auth',
      requiresGuest: true,
      title: 'Forgot Password'
    }
  },
  {
    path: '/auth/reset-password',
    name: 'AuthResetPassword',
    component: () => import('@/pages/auth/reset-password.vue'),
    meta: {
      layout: 'auth',
      requiresGuest: true,
      title: 'Reset Password'
    }
  },

  // Error routes
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/pages/404.vue'),
    meta: {
      layout: 'default',
      title: 'Page Not Found'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  }
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Set page title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Property Cleaning Scheduler`;
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth/login');
    return;
  }

  // Check guest-only routes
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/');
    return;
  }

  // Check admin requirements
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/404');
    return;
  }

  next();
});

export default router;
```

## **Page Components Structure**

### **File Structure Convention**
```
src/pages/
├── index.vue                  # / (Home/Dashboard)
├── calendar.vue               # /calendar
├── 404.vue                    # /404
├── properties/
│   ├── index.vue             # /properties
│   ├── create.vue            # /properties/create
│   ├── [id].vue              # /properties/:id
│   └── [id]/
│       └── edit.vue          # /properties/:id/edit
├── bookings/
│   ├── index.vue             # /bookings
│   ├── create.vue            # /bookings/create
│   └── [id].vue              # /bookings/:id
├── admin/
│   ├── dashboard.vue         # /admin/dashboard
│   ├── cleaners.vue          # /admin/cleaners
│   └── schedule.vue          # /admin/schedule
├── settings/
│   ├── index.vue             # /settings
│   ├── profile.vue           # /settings/profile
│   └── notifications.vue    # /settings/notifications
└── auth/
    ├── login.vue             # /auth/login
    ├── signup.vue            # /auth/signup
    ├── forgot-password.vue   # /auth/forgot-password
    └── reset-password.vue    # /auth/reset-password
```

### **Page Component Template**
```vue
<!-- pages/index.vue (Home Dashboard) -->
<template>
  <div class="home-page">
    <PageHeader 
      title="Dashboard" 
      :breadcrumbs="breadcrumbs"
    />
    
    <v-container fluid>
      <!-- Dashboard content using Home.vue orchestrator -->
      <Home />
    </v-container>
  </div>
</template>

<script setup lang="ts">
import Home from '@/components/smart/Home.vue';
import PageHeader from '@/components/dumb/PageHeader.vue';

// Meta information
defineOptions({
  name: 'HomePage'
});

// Breadcrumbs
const breadcrumbs = [
  { title: 'Home', to: '/', disabled: true }
];

// SEO meta
useSeoMeta({
  title: 'Dashboard | Property Cleaning Scheduler',
  description: 'Manage your property bookings and cleaning schedule'
});
</script>
```

### **Dynamic Route Pages**
```vue
<!-- pages/properties/[id].vue -->
<template>
  <div class="property-detail-page">
    <PageHeader 
      :title="property?.name || 'Property Details'"
      :breadcrumbs="breadcrumbs"
      :loading="loading"
    />
    
    <v-container v-if="property" fluid>
      <v-row>
        <v-col cols="12" md="8">
          <PropertyDetails :property="property" />
        </v-col>
        <v-col cols="12" md="4">
          <PropertyBookings 
            :property-id="property.id"
            :bookings="propertyBookings"
          />
        </v-col>
      </v-row>
    </v-container>
    
    <v-container v-else-if="!loading" fluid>
      <v-alert type="error" variant="tonal">
        Property not found
      </v-alert>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useProperties } from '@/composables/useProperties';
import PropertyDetails from '@/components/dumb/PropertyDetails.vue';
import PropertyBookings from '@/components/dumb/PropertyBookings.vue';
import PageHeader from '@/components/dumb/PageHeader.vue';

// Route handling
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { loading, fetchProperties } = useProperties();

// Props from route params
interface Props {
  id: string;
}

const props = defineProps<Props>();

// Get property from store
const property = computed(() => {
  return userStore.getPropertyById(props.id);
});

// Get property bookings
const propertyBookings = computed(() => {
  return userStore.getEventsByProperty(props.id);
});

// Breadcrumbs
const breadcrumbs = computed(() => [
  { title: 'Home', to: '/' },
  { title: 'Properties', to: '/properties' },
  { title: property.value?.name || 'Property', to: route.path, disabled: true }
]);

// Fetch data on mount
onMounted(async () => {
  if (!property.value) {
    try {
      await fetchProperties();
      
      // If still not found after fetch, redirect to 404
      if (!property.value) {
        router.push('/404');
      }
    } catch (error) {
      console.error('Failed to fetch property:', error);
      router.push('/404');
    }
  }
});

// SEO meta
useSeoMeta({
  title: computed(() => `${property.value?.name || 'Property'} | Property Cleaning Scheduler`),
  description: computed(() => `Details for ${property.value?.name || 'property'} at ${property.value?.address || 'unknown address'}`)
});
</script>
```

## **Layout System Integration**

### **Layout Wrapper Component**
```vue
<!-- App.vue -->
<template>
  <component :is="layoutComponent" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import DefaultLayout from '@/layouts/default.vue';
import AdminLayout from '@/layouts/admin.vue';
import AuthLayout from '@/layouts/auth.vue';

const route = useRoute();

// Dynamic layout based on route meta
const layoutComponent = computed(() => {
  const layoutName = route.meta.layout as string || 'default';
  
  switch (layoutName) {
    case 'admin':
      return AdminLayout;
    case 'auth':
      return AuthLayout;
    case 'default':
    default:
      return DefaultLayout;
  }
});
</script>
```

### **Layout Components**
```vue
<!-- layouts/default.vue -->
<template>
  <v-app>
    <!-- Navigation Drawer -->
    <AppDrawer v-model="drawer" />
    
    <!-- App Bar -->
    <AppBar @toggle-drawer="drawer = !drawer" />
    
    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
    
    <!-- Footer -->
    <AppFooter />
    
    <!-- Global Modals -->
    <EventModal />
    <ConfirmDialog />
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppDrawer from '@/components/layout/AppDrawer.vue';
import AppBar from '@/components/layout/AppBar.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
import EventModal from '@/components/dumb/BookingForm/EventModal.vue';
import ConfirmDialog from '@/components/dumb/ConfirmDialog.vue';

const drawer = ref<boolean>(true);
</script>
```

```vue
<!-- layouts/admin.vue -->
<template>
  <v-app>
    <!-- Admin Navigation -->
    <AdminDrawer v-model="drawer" />
    
    <!-- Admin App Bar -->
    <AdminAppBar @toggle-drawer="drawer = !drawer" />
    
    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AdminDrawer from '@/components/layout/AdminDrawer.vue';
import AdminAppBar from '@/components/layout/AdminAppBar.vue';

const drawer = ref<boolean>(true);
</script>
```

## **Route Utilities & Composables**

### **Route Helper Composable**
```typescript
// composables/useRouting.ts
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';

export const useRouting = () => {
  const route = useRoute();
  const router = useRouter();

  // Current route information
  const currentRoute = computed(() => route);
  const routeName = computed(() => route.name as string);
  const routeParams = computed(() => route.params);
  const routeQuery = computed(() => route.query);
  
  // Navigation helpers
  const navigateTo = (to: RouteLocationRaw): Promise<any> => {
    return router.push(to);
  };

  const navigateToProperty = (id: string): Promise<any> => {
    return router.push({ name: 'PropertiesDetail', params: { id } });
  };

  const navigateToBooking = (id: string): Promise<any> => {
    return router.push({ name: 'BookingsDetail', params: { id } });
  };

  const navigateToPropertyEdit = (id: string): Promise<any> => {
    return router.push({ name: 'PropertiesEdit', params: { id } });
  };

  const goBack = (): void => {
    router.back();
  };

  const goForward = (): void => {
    router.forward();
  };

  // URL generation helpers
  const getPropertyUrl = (id: string): string => {
    return router.resolve({ name: 'PropertiesDetail', params: { id } }).href;
  };

  const getBookingUrl = (id: string): string => {
    return router.resolve({ name: 'BookingsDetail', params: { id } }).href;
  };

  // Query parameter helpers
  const updateQuery = (query: Record<string, any>): Promise<any> => {
    return router.push({ 
      ...route, 
      query: { ...route.query, ...query } 
    });
  };

  const clearQuery = (): Promise<any> => {
    return router.push({ ...route, query: {} });
  };

  // Breadcrumb generation
  const generateBreadcrumbs = (): Array<{ title: string; to?: string; disabled?: boolean }> => {
    const breadcrumbs = [{ title: 'Home', to: '/' }];
    
    const pathSegments = route.path.split('/').filter(segment => segment);
    
    pathSegments.forEach((segment, index) => {
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const isLast = index === pathSegments.length - 1;
      
      // Customize based on route patterns
      if (segment === 'properties') {
        breadcrumbs.push({ 
          title: 'Properties', 
          to: isLast ? undefined : '/properties',
          disabled: isLast 
        });
      } else if (segment === 'bookings') {
        breadcrumbs.push({ 
          title: 'Bookings', 
          to: isLast ? undefined : '/bookings',
          disabled: isLast 
        });
      } else if (segment === 'admin') {
        breadcrumbs.push({ 
          title: 'Admin', 
          to: isLast ? undefined : '/admin',
          disabled: isLast 
        });
      } else if (segment === 'create') {
        breadcrumbs.push({ 
          title: 'Create', 
          disabled: true 
        });
      } else if (segment === 'edit') {
        breadcrumbs.push({ 
          title: 'Edit', 
          disabled: true 
        });
      } else if (segment.match(/^[a-f0-9-]{36}$/)) {
        // UUID pattern - this is an ID
        breadcrumbs.push({ 
          title: 'Details', 
          to: isLast ? undefined : path,
          disabled: isLast 
        });
      }
    });
    
    return breadcrumbs;
  };

  return {
    // State
    currentRoute,
    routeName,
    routeParams,
    routeQuery,
    
    // Navigation
    navigateTo,
    navigateToProperty,
    navigateToBooking,
    navigateToPropertyEdit,
    goBack,
    goForward,
    
    // URL generation
    getPropertyUrl,
    getBookingUrl,
    
    // Query management
    updateQuery,
    clearQuery,
    
    // Utilities
    generateBreadcrumbs
  };
};
```

### **Page Component Composable**
```typescript
// composables/usePage.ts
import { computed, onMounted } from 'vue';
import { useRouting } from './useRouting';
import { useUIStore } from '@/stores/ui';

interface PageMeta {
  title: string;
  description?: string;
  requiresAuth?: boolean;
  layout?: string;
}

export const usePage = (meta: PageMeta) => {
  const { generateBreadcrumbs } = useRouting();
  const uiStore = useUIStore();

  // Generate breadcrumbs automatically
  const breadcrumbs = computed(() => generateBreadcrumbs());

  // Set page title
  const pageTitle = computed(() => 
    `${meta.title} | Property Cleaning Scheduler`
  );

  // Handle page loading states
  const setLoading = (loading: boolean): void => {
    uiStore.loading = loading;
  };

  // Handle page errors
  const setError = (error: string): void => {
    uiStore.setError('page', error);
  };

  const clearError = (): void => {
    uiStore.clearError('page');
  };

  // Page lifecycle
  onMounted(() => {
    document.title = pageTitle.value;
    clearError();
  });

  return {
    breadcrumbs,
    pageTitle,
    setLoading,
    setError,
    clearError
  };
};
```

This reference provides comprehensive patterns for implementing file-based routing with Vue Router 4 and TypeScript, specifically tailored for your property cleaning scheduler's page structure and navigation requirements.