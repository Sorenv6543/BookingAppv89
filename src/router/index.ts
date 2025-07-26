// 🛣️ ROUTING & GUARDS LAYER

// src/router/index.ts - 🗺️ ROUTE DEFINITIONS

// ✅ Maps URLs to components
// ✅ Declares auth requirements via meta.requiresAuth
// ✅ Declares role requirements via meta.role
// ✅ Applies navigation guards

import { createRouter, createWebHistory } from 'vue-router' 

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
      name: 'HomeOwner',
      component: () => import('@/pages/owner/dashboard.vue'),
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
    {
      path: '/owner/profile',
      name: 'owner-profile',
      component: () => import('@/pages/owner/profile.vue'),
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

    // Admin routes - only accessible to admin users
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: () => import('@/pages/admin/index.vue'),
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
      component: () => import('@/pages/admin/properties/index.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/admin/properties/:id/edit',
      name: 'admin-properties-edit',
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
    // {
    //   path: '/admin/profile',
    //   name: 'admin-profile',
    //   component: () => import('@/pages/admin/profile/index.vue'),
    //   meta: {
    //     layout: 'admin',
    //     role: 'admin'
    //   }
    // },
    // {
    //   path: '/admin/settings',
    //   name: 'admin-settings',
    //   component: () => import('@/pages/admin/settings/index.vue'),
    //   meta: {
    //     layout: 'admin',
    //     role: 'admin'
    //   }
    // },
    // {
    //   path: '/admin/owners',
    //   name: 'admin-owners',
    //   component: () => import('@/pages/admin/owners/index.vue'),
    //   meta: {
    //     layout: 'admin',
    //     role: 'admin'
    //   }
    // },
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
      component: () => import('@/pages/admin/users/index.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },
    {
      path: '/admin/users/:id/edit',
      name: 'admin-users-edit',
      component: () => import('@/pages/admin/users/index.vue'),
      meta: {
        layout: 'admin',
        role: 'admin'
      }
    },

    // Development Demo Routes - Admin Demos
    // Only available in development mode for testing composables
    {
      path: '/dev/admin/calendar-demo',
      name: 'admin-calendar-demo',
      component: () => import('@/dev/demos/Admin/AdminCalendarDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/data-store-demo',
      name: 'admin-data-store-demo',
      component: () => import('@/dev/demos/Admin/AdminDataStoreDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/quick-actions-demo',
      name: 'admin-quick-actions-demo',
      component: () => import('@/dev/demos/Admin/AdminQuickActionsDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/sidebar-demo',
      name: 'admin-sidebar-demo',
      component: () => import('@/dev/demos/Admin/AdminSidebarDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/user-management-demo',
      name: 'admin-user-management-demo',
      component: () => import('@/dev/demos/Admin/AdminUserManagementDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/user-manage-v1',
      name: 'admin-user-manage-v1',
      component: () => import('@/dev/demos/Admin/AdminUserManagev1.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/home-demo',
      name: 'home-admin-demo',
      component: () => import('@/dev/demos/Admin/HomeAdminDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/turn-alerts-demo',
      name: 'turn-alerts-demo',
      component: () => import('@/dev/demos/Admin/TurnAlertsDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/ui-ux-enhancements-demo',
      name: 'ui-ux-enhancements-demo',
      component: () => import('@/dev/demos/Admin/UIUXEnhancementsDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/use-admin-bookings-demo',
      name: 'use-admin-bookings-demo',
      component: () => import('@/dev/demos/Admin/UseAdminBookingsDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/use-admin-calendar-state-demo',
      name: 'use-admin-calendar-state-demo',
      component: () => import('@/dev/demos/Admin/UseAdminCalendarStateDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/use-admin-properties-demo',
      name: 'use-admin-properties-demo',
      component: () => import('@/dev/demos/Admin/UseAdminPropertiesDemo.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    },
    {
      path: '/dev/admin/turn-visual-indicators',
      name: 'turn-visual-indicators',
      component: () => import('@/dev/demos/Admin/turn-visual-indicators.vue'),
      meta: {
        layout: 'admin',
        role: 'admin',
        development: true
      }
    }
  ]
})

// // Apply navigation guards
// router.beforeEach(developmentGuard)
// router.beforeEach(loadingGuard)
// router.beforeEach(authGuard)
// router.afterEach(afterNavigationGuard)

export default router 