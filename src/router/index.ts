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