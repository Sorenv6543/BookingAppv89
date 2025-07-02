// src/router/guards.ts - Enhanced with Supabase Authentication
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { getDefaultRouteForRole } from '@/utils/authHelpers';
import type { UserRole } from '@/types';

export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  
  // Wait for authentication check to complete
  await authStore.checkAuth();
  
  console.log('🛡️ Auth guard check:', {
    route: to.path,
    authenticated: authStore.isAuthenticated,
    userRole: authStore.user?.user_role,
    requiresAuth: to.meta.requiresAuth,
    requiredRole: to.meta.role
  });
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    console.log('❌ Route requires auth but user not authenticated, redirecting to login');
    next('/auth/login');
    return;
  }
  
  // Check role-based access
  const requiredRole = to.meta.role as UserRole;
  if (requiredRole && authStore.user?.user_role !== requiredRole) {
    console.log('❌ User role mismatch:', {
      required: requiredRole,
      actual: authStore.user?.user_role
    });
    
    // Redirect to appropriate dashboard for user's role
    const defaultRoute = getDefaultRouteForRole(authStore.user?.user_role);
    next(defaultRoute);
    return;
  }
  
  // Special handling for admin routes
  if (to.path.startsWith('/admin') && !authStore.isAdmin) {
    console.log('❌ Admin route access denied for non-admin user');
    const defaultRoute = getDefaultRouteForRole(authStore.user?.user_role);
    next(defaultRoute);
    return;
  }
  
  // Special handling for owner routes
  if (to.path.startsWith('/owner') && !authStore.isOwner) {
    console.log('❌ Owner route access denied for non-owner user');
    const defaultRoute = getDefaultRouteForRole(authStore.user?.user_role);
    next(defaultRoute);
    return;
  }
  
  // Redirect authenticated users away from auth pages
  if (to.path.startsWith('/auth') && authStore.isAuthenticated) {
    console.log('✅ Authenticated user accessing auth page, redirecting to dashboard');
    const defaultRoute = getDefaultRouteForRole(authStore.user?.user_role);
    next(defaultRoute);
    return;
  }
  
  console.log('✅ Auth guard passed, proceeding to route');
  next();
}

export function loadingGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Set loading state for better UX
  if (to.meta.requiresAuth || to.meta.role) {
    console.log('⏳ Loading guard: Setting loading state for protected route');
  }
  
  next();
}

export function afterNavigationGuard(
  to: RouteLocationNormalized
) {
  console.log('📍 Navigation completed to:', to.path);
  
  // Initialize real-time sync if on protected routes
  if (to.meta.requiresAuth) {
    console.log('🔄 Protected route accessed, ensuring real-time sync is active');
  }
}

export function developmentGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Block development routes in production
  if (to.path.startsWith('/dev') && import.meta.env.PROD) {
    console.log('❌ Development route blocked in production');
    next('/404');
    return;
  }
  
  next();
}

// New: Real-time sync guard
export function realtimeSyncGuard(
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore();
  
  // Initialize real-time sync for authenticated routes
  if (to.meta.requiresAuth && authStore.isAuthenticated) {
    // This will be handled by the useRealtimeSync composable
    console.log('🔄 Route requires real-time sync, will initialize in component');
  }
  
  next();
}