import { createRouter, createWebHistory } from 'vue-router'

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
    {
      path: '/properties',
      name: 'properties',
      component: () => import('@/pages/properties/index.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: () => import('@/pages/calendar/index.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/pages/admin/index.vue'),
      meta: {
        layout: 'admin'
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
    // Demo routes
    {
      path: '/demos/home-admin',
      name: 'home-admin-demo',
      component: () => import('@/components/smart/admin/HomeAdminDemo.vue'),
      meta: {
        layout: 'default'
      }
    },

    {
      path: '/demos/turn-alerts',
      name: 'turn-alerts-demo',
      component: () => import('@/components/dumb/TurnAlertsDemo.vue'),
      meta: {
        layout: 'default'
      }
    },

    {
      path: '/demos/property-card',
      name: 'property-card-demo',
      component: () => import('@/components/dumb/PropertyCardDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/components/smart/admin/use-admin-bookings',
      name: 'use-admin-bookings-demo',
      component: () => import('@/components/smart/admin/UseAdminBookingsDemo.vue'),
      meta: {
        layout: 'default'
      }
    },

    {
      path: '/components/smart/admin/admin-calendar',
      name: 'admin-calendar-demo',
      component: () => import('@/components/smart/admin/AdminCalendarDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/components/smart/owner/owner-calendar',
      name: 'owner-calendar-demo',
      component: () => import('@/components/smart/owner/OwnerCalendarDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/use-owner-bookings',
      name: 'use-owner-bookings-demo',
      component: () => import('@/components/smart/owner/UseOwnerBookingsDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/use-owner-properties',
      name: 'use-owner-properties-demo',
      component: () => import('@/components/demos/UseOwnerPropertiesDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/use-owner-calendar-state',
      name: 'use-owner-calendar-state-demo',
      component: () => import('@/components/smart/owner/UseOwnerCalendarStateDemo.vue'),
      meta: {
        layout: 'default'
      }
    },


    {
      path: '/testing/turn-alerts',
      name: 'turn-alerts-demo',
      component: () => import('@/components/dumb/TurnAlertsDemo.vue'),
      meta: {
        layout: 'default'
      }
    },

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

export default router 