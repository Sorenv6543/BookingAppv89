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
      path: '/owner/bookings',
      name: 'owner-bookings',
      component: () => import('@/components/dumb/owner/OwnerBookings.vue'),
      meta: {
        layout: 'default',
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
      component: () => import('@/pages/admin/index.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/schedule',
      name: 'admin-schedule',
      component: () => import('@/pages/admin/schedule/index.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/properties',
      name: 'admin-properties',
      component: () => import('@/pages/admin/properties/index.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/bookings',
      name: 'admin-bookings',
      component: () => import('@/pages/admin/bookings/index.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/cleaners',
      name: 'admin-cleaners',
      component: () => import('@/pages/admin/cleaners/index.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true,
        role: 'admin'
      }
    },
    {
      path: '/admin/reports',
      name: 'admin-reports',
      component: () => import('@/pages/admin/reports/index.vue'),
      meta: {
        layout: 'default',
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
    // LEGACY REDIRECTS
    // ===========================================
    {
      path: '/properties',
      name: 'properties-legacy',
      redirect: '/owner/properties'
    },

    {
      path: '/bookings',
      name: 'bookings-legacy',
      redirect: '/owner/bookings'
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