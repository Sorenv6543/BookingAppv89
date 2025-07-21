// 🛣️ ROUTING & GUARDS LAYER

// src/router/index.ts - 🗺️ ROUTE DEFINITIONS

// ✅ Maps URLs to components
// ✅ Declares auth requirements via meta.requiresAuth
// ✅ Declares role requirements via meta.role
// ✅ Applies navigation guards



import { createRouter, createWebHistory } from 'vue-router' 

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
      component: () => import('@/components/smart/owner/OwnerProperties.vue'),
      meta: {
        layout: 'owner',
        role: 'owner'
      }
    },
    {
      path: '/owner/dashboard',
      name: 'owner-dashboard',
      component: () => import('@/pages/owner/dashboard.vue'),
      meta: {
        layout: 'owner',
        role: 'owner'
      }
    },

    // Admin routes - only accessible to admin users
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/pages/admin/dashboard.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/admin/properties',
      name: 'admin-properties',
      component: () => import('@/components/smart/admin/AdminProperties.vue'),
      meta: {
        layout: 'default',
        role: 'admin'
      }
    },
    {
      path: '/admin/properties/:id',
      name: 'admin-properties-view',
      component: () => import('@/pages/admin/properties/view.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/owner/properties/:id',
      name: 'owner-properties-view',
      component: () => import('@/pages/owner/properties/view.vue'),
      meta: {
        layout: 'owner',
        role: 'owner'
      }
    },
    {
      path: '/admin/properties/:id/edit',
      name: 'admin-properties-edit',
      component: () => import('@/pages/admin/properties/edit.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/owner/properties/:id/edit',
      name: 'owner-properties-edit',
      component: () => import('@/pages/owner/properties/edit.vue'),
      meta: {
        layout: 'owner',
        role: 'owner'
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
    {
      path: '/owner/profile',
      name: 'owner-profile',
      component: () => import('@/pages/owner/profile.vue'),
      meta: {
        layout: 'owner',
        role: 'owner'
      }
    },

    // Admin routes - only accessible to admin users
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/pages/admin/dashboard.vue'),
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
    {
      path: '/admin/profile',
      name: 'admin-profile',
      component: () => import('@/pages/admin/profile.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/admin/settings',
      name: 'admin-settings',
      component: () => import('@/pages/admin/settings.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/admin/owners',
      name: 'admin-owners',
      component: () => import('@/pages/admin/owners/index.vue'),
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
      path: '/admin/users',
      name: 'admin-users',
      component: () => import('@/pages/admin/users/index.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/admin/users/:id',
      name: 'admin-users-view',
      component: () => import('@/pages/admin/users/view.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/admin/users/:id/edit',
      name: 'admin-users-edit',
      component: () => import('@/pages/admin/users/edit.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/demos/owner-calendar',
      name: 'owner-calendar-demo',
      component: () => import('@/dev/demos/OwnerCalendarDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
  
  ]
})

// // Apply navigation guards
// router.beforeEach(developmentGuard)
// router.beforeEach(loadingGuard)
// router.beforeEach(authGuard)
// router.afterEach(afterNavigationGuard)

export default router 