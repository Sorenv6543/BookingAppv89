// src/router/guards.ts - Route Guards with Supabase Authentication
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getDefaultRouteForRole } from '@/utils/authHelpers';
import type { UserRole } from '@/types';

export async function authGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();

  // Non-auth routes: skip waiting entirely
  const needsAuth = to.meta.requiresAuth || to.meta.role;
  if (!needsAuth) {
    // Redirect authenticated users away from auth pages
    if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
      const defaultRoute = getDefaultRouteForRole(authStore.user?.role);
      next(defaultRoute);
      return;
    }
    next();
    return;
  }

  // Wait for auth initialization (max 500ms)
  const maxWaitTime = 500;
  const checkInterval = 50;
  let waitedTime = 0;

  while (authStore.initializing && waitedTime < maxWaitTime) {
    await new Promise(resolve => setTimeout(resolve, checkInterval));
    waitedTime += checkInterval;
  }

  if (authStore.initializing) {
    console.warn('Auth initialization timeout in guard, proceeding anyway');
  }

  // Check authentication
  if (!authStore.isAuthenticated) {
    next('/auth/login');
    return;
  }

  // Check role-based access
  const requiredRole = to.meta.role as UserRole;
  if (requiredRole && authStore.user?.role !== requiredRole) {
    const defaultRoute = getDefaultRouteForRole(authStore.user?.role);
    next(defaultRoute);
    return;
  }

  next();
}

export function loadingGuard(
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  next();
}

export function afterNavigationGuard(
  _to: RouteLocationNormalized
) {
  // No-op — available for future use (e.g. analytics, realtime sync)
}

export function developmentGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  if (to.path.startsWith('/dev') && import.meta.env.PROD) {
    next('/404');
    return;
  }
  next();
}
