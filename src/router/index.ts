// 🛣️ ROUTING & GUARDS LAYER

// src/router/index.ts - 🗺️ ROUTE DEFINITIONS

// ✅ Maps URLs to components
// ✅ Declares auth requirements via meta.requiresAuth
// ✅ Declares role requirements via meta.role
// ✅ Applies navigation guards

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, loadingGuard, afterNavigationGuard, developmentGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/index.vue'),
      meta: {
        layout: 'default'
      }
    },
    // Owner-specific routes
    {
      path: '/owner/dashboard',
      name: 'owner-dashboard',
      component: () => import('@/pages/owner/dashboard.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'owner'
      }
    },
    {
      path: '/owner/properties',
      name: 'owner-properties',
      component: () => import('@/pages/owner/properties/index.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'owner'
      }
    },
    {
      path: '/owner/calendar',
      name: 'owner-calendar',
      component: () => import('@/pages/owner/calendar.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'owner'
      }
    },
    {
      path: '/owner/bookings',
      name: 'owner-bookings',
      component: () => import('@/pages/owner/bookings/index.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'owner'
      }
    },
    // Legacy routes (redirect to owner-specific routes)
    {
      path: '/properties',
      name: 'properties',
      redirect: '/owner/properties'
    },
    {
      path: '/calendar',
      name: 'calendar',
      redirect: '/owner/calendar'
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/admin/index.vue'),
      meta: {
        layout: 'admin'
      }
    },
    {
      path: '/admin/schedule',
      name: 'admin-schedule',
      component: () => import('@/pages/admin/schedule/index.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/cleaners',
      name: 'admin-cleaners',
      component: () => import('@/pages/admin/cleaners/index.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/properties',
      name: 'admin-properties',
      component: () => import('@/pages/admin/properties/index.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('@/pages/admin/bookings/index.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/reports',
      name: 'admin-reports',
      component: () => import('@/pages/admin/reports/index.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
        role: 'admin'
      }
    },
    // Testing routes
    {
      path: '/testing/crud',
      name: 'crud-testing',
      component: () => import('@/pages/crud-testing.vue'),
      meta: {
        layout: 'default'
      }
    },
    // Demo routes - now in src/dev/demos/
    {
      path: '/demos/home-admin',
      name: 'home-admin-demo',
      component: () => import('@/dev/demos/HomeAdminDemo.vue'),
      meta: {
        layout: 'default'
      }
    },

    {
      path: '/demos/turn-alerts',
      name: 'turn-alerts-demo',
      component: () => import('@/dev/demos/TurnAlertsDemo.vue'),
      meta: {
        layout: 'default'
      }
    },

    {
      path: '/demos/property-card',
      name: 'property-card-demo',
      component: () => import('@/dev/demos/PropertyCardDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/components/smart/admin/use-admin-bookings',
      name: 'use-admin-bookings-demo',
      component: () => import('@/dev/demos/UseAdminBookingsDemo.vue'),
      meta: {
        layout: 'default'
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
        layout: 'default'
      }
    },
    {
      path: '/demos/use-owner-properties',
      name: 'use-owner-properties-demo',
      component: () => import('@/dev/demos/UseOwnerPropertiesDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/use-owner-calendar-state',
      name: 'use-owner-calendar-state-demo',
      component: () => import('@/dev/demos/UseOwnerCalendarStateDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/use-admin-properties',
      name: 'use-admin-properties-demo',
      component: () => import('@/dev/demos/UseAdminPropertiesDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/use-admin-calendar-state',
      name: 'use-admin-calendar-state-demo',
      component: () => import('@/dev/demos/UseAdminCalendarStateDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    // {
    //   path: '/demos/route-guards',
    //   name: 'route-guards-demo',
    //   component: () => import('@/pages/demos/route-guards.vue'),
    //   meta: {
    //     layout: 'default',
    //     public: true,
    //     demo: true,
    //     title: 'Route Guards Demo'
    //   }
    // },
    // {
    //   path: '/demos/admin-sidebar-width-test',
    //   name: 'admin-sidebar-width-test',
    //   component: () => import('@/pages/demos/admin-sidebar-width-test.vue'),
    //   meta: {
    //     layout: 'default',
    //     public: true,
    //     demo: true,
    //     title: 'Admin Sidebar Width Test'
    //   }
    // },


    // {
    //   path: '/testing/turn-alerts',
    //   name: 'turn-alerts-demo',
    //   component: () => import('@/components/dumb/TurnAlertsDemo.vue'),
    //   meta: {
    //     layout: 'default'
    //   }
    // },

    // Auth routes
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/pages/auth/login.vue'),
      meta: {
        layout: 'auth'
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
    // Catch-all route for 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/404.vue'),
      meta: {
        layout: 'default'
      }
    }
  ]
})

// Apply navigation guards
router.beforeEach(developmentGuard)
router.beforeEach(loadingGuard)
router.beforeEach(authGuard)
router.afterEach(afterNavigationGuard)

export default router 