// src/router/index.ts - Curated Route Definitions

import { createRouter, createWebHistory } from 'vue-router'
import { authGuard, loadingGuard, afterNavigationGuard, developmentGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Root route - role-based redirect
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/index.vue'), // Role-based routing component
      meta: {
        layout: 'default'
      }
    },

    // ===========================================
    // OWNER ROUTES
    // ===========================================
    {
      path: '/owner',
      name: 'owner',
      component: () => import('@/pages/owner/index.vue'),
      meta: {
        layout: 'owner',
        requiresAuth: true,
        role: 'owner'
      }
    },
    {
      path: '/owner/properties',
      name: 'owner-properties',
      component: () => import('@/pages/owner/properties/index.vue'),
      meta: {
        layout: 'owner',
        requiresAuth: true,
        role: 'owner'
      }
    },
    {
      path: '/owner/bookings',
      name: 'owner-bookings',
      component: () => import('@/components/dumb/owner/OwnerBookings.vue'),
      meta: {
        layout: 'owner',
        requiresAuth: true,
        role: 'owner'
      }
    },


    // ===========================================
    // ADMIN ROUTES
    // ===========================================
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/components/smart/admin/AdminHome.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
        role: 'admin'
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
      path: '/admin/reports',
      name: 'admin-reports',
      component: () => import('@/pages/admin/reports/index.vue'),
      meta: {
        layout: 'admin',
        requiresAuth: true,
        role: 'admin'
      }
    },

    // ===========================================
    // AUTH ROUTES
    // ===========================================
    {
      path: '/auth/login',
      name: 'login',
      component: () => import('@/pages/auth/login.vue'),
      meta: {
        layout: 'auth',
        public: true
      }
    },
    {
      path: '/auth/register',
      name: 'register',
      component: () => import('@/pages/auth/register.vue'),
      meta: {
        layout: 'auth',
        public: true
      }
    },


    // ===========================================
    // DEVELOPMENT/TESTING ROUTES
    // ===========================================
    {
      path: '/testing/crud',
      name: 'crud-testing',
      component: () => import('@/pages/crud-testing.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },

    // ===========================================
    // DEMO ROUTES
    // ===========================================
    {
      path: '/demos',
      name: 'demos',
      component: () => import('@/pages/demos/index.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/admin-calendar-demo',
      name: 'admin-calendar-demo',
      component: () => import('@/pages/demos/admin-calendar-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/admin-quick-actions-demo',
      name: 'admin-quick-actions-demo',
      component: () => import('@/pages/demos/admin-quick-actions-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/admin-sidebar',
      name: 'admin-sidebar',
      component: () => import('@/pages/demos/admin-sidebar.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },

    {
      path: '/demos/auth-flow',
      name: 'auth-flow',
      component: () => import('@/pages/demos/auth-flow.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/calendar-header-blue-gradient',
      name: 'calendar-header-blue-gradient',
      component: () => import('@/pages/demos/calendar-header-blue-gradient.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },


    {
      path: '/demos/home-admin-demo',
      name: 'home-admin-demo',
      component: () => import('@/pages/demos/home-admin-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/owner-sidebar-demo',
      name: 'owner-sidebar-demo',
      component: () => import('@/pages/demos/owner-sidebar-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/property-card-demo',
      name: 'property-card-demo',
      component: () => import('@/pages/demos/property-card-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/role-routing',
      name: 'role-routing',
      component: () => import('@/pages/demos/role-routing.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/route-guards',
      name: 'route-guards',
      component: () => import('@/pages/demos/route-guards.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/sidebar',
      name: 'sidebar',
      component: () => import('@/pages/demos/sidebar.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/sidebar-demo',
      name: 'sidebar-demo',
      component: () => import('@/pages/demos/sidebar-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/turn-alerts-demo',
      name: 'turn-alerts-demo',
      component: () => import('@/pages/demos/turn-alerts-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/turn-visual-indicators',
      name: 'turn-visual-indicators',
      component: () => import('@/pages/demos/turn-visual-indicators.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/use-admin-bookings-demo',
      name: 'use-admin-bookings-demo',
      component: () => import('@/pages/demos/use-admin-bookings-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/use-admin-calendar-state-demo',
      name: 'use-admin-calendar-state-demo',
      component: () => import('@/pages/demos/use-admin-calendar-state-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/use-admin-properties-demo',
      name: 'use-admin-properties-demo',
      component: () => import('@/pages/demos/use-admin-properties-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/use-owner-calendar-state-demo',
      name: 'use-owner-calendar-state-demo',
      component: () => import('@/pages/demos/use-owner-calendar-state-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/use-owner-bookings-demo',
      name: 'use-owner-bookings-demo',
      component: () => import('@/pages/demos/use-owner-bookings-demo.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },
    {
      path: '/demos/dev-index',
      name: 'dev-index',
      component: () => import('@/pages/demos/dev-index.vue'),
      meta: {
        layout: 'default',
        development: true
      }
    },



    // ===========================================
    // ERROR ROUTES
    // ===========================================
    {
      path: '/404',
      name: 'not-found',
      component: () => import('@/pages/404.vue'),
      meta: {
        layout: 'default',
        public: true
      }
    },
    // Catch-all route - must be last
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ]
})

// Apply navigation guards in order
router.beforeEach(developmentGuard)
router.beforeEach(loadingGuard)
router.beforeEach(authGuard)
router.afterEach(afterNavigationGuard)

export default router