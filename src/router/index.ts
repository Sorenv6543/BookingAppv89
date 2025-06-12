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
    // Demo routes
    {
      path: '/demos/property-card',
      name: 'property-card-demo',
      component: () => import('@/components/dumb/PropertyCardDemo.vue'),
      meta: {
        layout: 'default'
      }
    },
    {
      path: '/demos/booking-form',
      name: 'booking-form-demo',
      component: () => import('@/components/dumb/BookingFormDemo.vue'),
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