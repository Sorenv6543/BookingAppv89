// 🛣️ ROUTING & GUARDS LAYER

// src/router/index.ts - 🗺️ ROUTE DEFINITIONS

// ✅ Maps URLs to components
// ✅ Declares auth requirements via meta.requiresAuth
// ✅ Declares role requirements via meta.role
// ✅ Applies navigation guards



import { createRouter, createWebHistory } from 'vue-router'
// import { authGuard, loadingGuard, afterNavigationGuard, developmentGuard } from '@/router/guards'

// 
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    // Auth routes - only accessible to unauthenticated users
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/auth/login.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/pages/auth/register.vue'),
      meta: {
        layout: 'auth'
      }
    },

    // Owner routes - only accessible to owner users
    {
      path: '/owner/dashboard',
      name: 'owner-dashboard',
      component: () => import('@/pages/owner/dashboard.vue'),
      meta: {
        layout: 'owner',
       
        role: 'owner'
      }
    },
    {
      path: '/owner/properties',
      name: 'owner-properties',
      component: () => import('@/pages/owner/properties/index.vue'),
      meta: {
        layout: 'owner',
       
        role: 'owner'
      }
    },
    {
      path: '/owner/calendar',
      name: 'owner-calendar',
      component: () => import('@/pages/owner/calendar.vue'),
      meta: {
        layout: 'owner',
       
        role: 'owner'
      }
    },
    {
      path: '/owner/bookings',
      name: 'owner-bookings',
      component: () => import('@/pages/owner/bookings/index.vue'),
      meta: {
        layout: 'owner',
        
        role: 'owner'
      }
    },

    // Admin routes - only accessible to admin users
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/admin/index.vue'),
      meta: {
        layout: 'admin',
        
        role: 'admin'
      }
    },
    {
      path: '/admin/schedule',
      name: 'admin-schedule',
      component: () => import('@/pages/admin/schedule/index.vue'),
      meta: {
        layout: 'admin',
        
        role: 'admin'
      }
    },
    {
      path: '/admin/cleaners',
      name: 'admin-cleaners',
      component: () => import('@/pages/admin/cleaners/index.vue'),
      meta: {
        layout: 'admin',
        
        role: 'admin'
      }
    },
    {
      path: '/admin/properties',
      name: 'admin-properties',
      component: () => import('@/pages/admin/properties/index.vue'),
      meta: {
        layout: 'admin',
        
        role: 'admin'
      }
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('@/pages/admin/bookings/index.vue'),
      meta: {
        layout: 'admin',
        
        role: 'admin'
      }
    },
    {
      path: '/admin/reports',
      name: 'admin-reports',
      component: () => import('@/pages/admin/reports/index.vue'),
      meta: {
        layout: 'admin',
        
        role: 'admin'
      }
    },
    
    // Testing routes
    {
      path: '/testing/crud',
      name: 'crud-testing',
      component: () => import('@/pages/crud-testing.vue'),
      meta: {
        
      }
    },

    // Demo routes - now in src/dev/demos/
    {
      path: '/demos',
      name: 'demos-index',
      component: () => import('@/pages/demos/index.vue'),
      meta: {
    
      }
    },
    {
      path: '/demos/pwa',
      name: 'pwa-demo',
      component: () => import('@/dev/demos/PWADemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/owner-data-store',
      name: 'owner-data-store-demo',
      component: () => import('@/dev/demos/OwnerDataStoreDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/admin-data-store',
      name: 'admin-data-store-demo',
      component: () => import('@/dev/demos/AdminDataStoreDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/owner-data-store',
      name: 'owner-data-store-demo',
      component: () => import('@/dev/demos/OwnerDataStoreDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/admin-user-management',
      name: 'admin-user-management-demo',
      component: () => import('@/dev/demos/AdminUserManagementDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/responsive-layout',
      name: 'responsive-layout-demo',
      component: () => import('@/dev/demos/ResponsiveLayoutDemo.vue'),
      meta: {

      }
    },

    {
      path: '/demos/home-admin',
      name: 'home-admin-demo',
      component: () => import('@/dev/demos/HomeAdminDemo.vue'),
      meta: {
        
      }
    },

    {
      path: '/demos/turn-alerts',
      name: 'turn-alerts-demo',
      component: () => import('@/dev/demos/TurnAlertsDemo.vue'),
      meta: {
        
      }
    },

    {
      path: '/demos/property-card',
      name: 'property-card-demo',
      component: () => import('@/dev/demos/PropertyCardDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/components/smart/admin/use-admin-bookings',
      name: 'use-admin-bookings-demo',
      component: () => import('@/dev/demos/UseAdminBookingsDemo.vue'),
      meta: {
        
      }
    },

    {
      path: '/components/smart/admin/admin-calendar',
      name: 'admin-calendar-demo',
      component: () => import('@/dev/demos/AdminCalendarDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/components/smart/owner/owner-calendar',
      name: 'owner-calendar-demo',
      component: () => import('@/dev/demos/OwnerCalendarDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/use-owner-bookings',
      name: 'use-owner-bookings-demo',
      component: () => import('@/dev/demos/UseOwnerBookingsDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/use-owner-properties',
      name: 'use-owner-properties-demo',
      component: () => import('@/dev/demos/UseOwnerPropertiesDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/use-owner-calendar-state',
      name: 'use-owner-calendar-state-demo',
      component: () => import('@/dev/demos/UseOwnerCalendarStateDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/use-admin-properties',
      name: 'use-admin-properties-demo',
      component: () => import('@/dev/demos/UseAdminPropertiesDemo.vue'),
      meta: {

      }
    },
    {
      path: '/demos/use-admin-calendar-state',
      name: 'use-admin-calendar-state-demo',
      component: () => import('@/dev/demos/UseAdminCalendarStateDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/owner-property-creation',
      name: 'owner-property-creation-demo',
      component: () => import('@/dev/demos/OwnerPropertyCreationDemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/pwa',
      name: 'pwa-demo',
      component: () => import('@/dev/demos/PWADemo.vue'),
      meta: {
        
      }
    },
    {
      path: '/demos/pwa-notifications',
      name: 'pwa-notifications-demo',
      component: () => import('@/components/dumb/shared/PWANotificationsEnhanced.vue'),
      meta: {
        
        public: true,
        demo: true,
        title: 'PWANotificationsEnhanced Demo'
      }
    },
 
    {
      path: '/demos/admin-sidebar-width-test',
      name: 'admin-sidebar-width-test',
      component: () => import('@/dev/demos/admin-sidebar-width-test.vue'),
      meta: {
        
        public: true,
        demo: true,
        title: 'Admin Sidebar Width Test'
      }
    },


    {
      path: '/testing/turn-alerts',
      name: 'turn-alerts-demo',
      component: () => import('@/dev/demos/TurnAlertsDemo.vue'),
      meta: {
        
      }
    },


  ]
})

// Apply navigation guards
// router.beforeEach(developmentGuard)
// router.beforeEach(loadingGuard)
// router.beforeEach(authGuard)
// router.afterEach(afterNavigationGuard)

export default router 