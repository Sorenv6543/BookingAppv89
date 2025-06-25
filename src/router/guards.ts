// 🛣️ ROUTING & GUARDS LAYER

// src/router/guards.ts - 🛡️ ROUTE PROTECTION

// ✅ Runs before EVERY route change
// ✅ Checks if user is authenticated
// ✅ Checks if user has required role
// ✅ Redirects unauthorized users
// ✅ Shows error messages

import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import type { UserRole } from '@/types/user'
import type { NavigationError } from '@/types/router'

/**
 * Role-based route guards for multi-tenant architecture
 * Handles authentication and authorization for property owners vs admin users
 */

/**
 * Check if a user has permission to access a route based on their role
 */
function hasRolePermission(userRole: UserRole | undefined, requiredRole: UserRole | undefined): boolean {
  // If no specific role is required, allow access
  if (!requiredRole) return true
  
  // If user has no role, deny access
  if (!userRole) return false
  
  // Exact role match
  if (userRole === requiredRole) return true
  
  // Business rule: Admin can access owner routes for support purposes
  // But owners cannot access admin routes
  if (userRole === 'admin' && requiredRole === 'owner') return true
  
  // All other cases: deny access
  return false
}

/**
 * Get the default route for a user based on their role
 */
function getDefaultRouteForRole(userRole: UserRole | undefined): string {
  switch (userRole) {
    case 'owner':
      return '/owner/dashboard'
    case 'admin':
      return '/admin'
    case 'cleaner':
      return '/cleaner/dashboard' // Future implementation
    default:
      return '/auth/login'
  }
}

/**
 * Check if a route is public (accessible without authentication)
 */
function isPublicRoute(to: RouteLocationNormalized): boolean {
  // Auth routes are always public
  if (to.path.startsWith('/auth/')) return true
  
  // Demo and testing routes are public for development
  if (to.path.startsWith('/demos/') || to.path.startsWith('/testing/')) return true
  
  // Routes explicitly marked as public
  if (to.meta.public === true) return true
  
  // 404 page is public
  if (to.name === 'not-found') return true
  
  return false
}

/**
 * Show navigation error to user
 */
function showNavigationError(error: NavigationError) {
  const uiStore = useUIStore()
  
  // Add error notification using the existing notification system
  uiStore.addNotification('error', 'Access Denied', error.message, true)
}

/**
 * Main navigation guard - handles authentication and role-based access control
 */
export async function authGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  try {
    // Check if route is public (no auth required)
    if (isPublicRoute(to)) {
      // If user is authenticated and trying to access auth pages, redirect to their dashboard
      if (authStore.isAuthenticated && to.path.startsWith('/auth/')) {
        const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
        return next(defaultRoute)
      }
      return next()
    }
    
    // For protected routes, check authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      const error: NavigationError = {
        type: 'auth',
        message: 'You must be logged in to access this page.',
        redirectTo: '/auth/login'
      }
      showNavigationError(error)
      return next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
    }
    
    // Check role-based permissions
    if (to.meta.role && !hasRolePermission(authStore.user?.role, to.meta.role)) {
      const userRole = authStore.user?.role || 'unknown'
      const requiredRole = to.meta.role
      
      const error: NavigationError = {
        type: 'role',
        message: `Access denied. This page requires ${requiredRole} privileges, but you are logged in as ${userRole}.`,
        redirectTo: getDefaultRouteForRole(authStore.user?.role)
      }
      showNavigationError(error)
      
      // Redirect to user's appropriate dashboard
      const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
      return next(defaultRoute)
    }
    
    // Handle root route - redirect based on user role
    if (to.path === '/' && authStore.isAuthenticated) {
      const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
      return next(defaultRoute)
    }
    
    // All checks passed, allow navigation
    next()
    
  } catch (error) {
    console.error('Navigation guard error:', error)
    
    const navError: NavigationError = {
      type: 'network',
      message: 'An error occurred while checking your permissions. Please try again.',
      redirectTo: '/auth/login'
    }
    showNavigationError(navError)
    
    next('/auth/login')
  }
}

/**
 * Loading guard - shows loading state during navigation
 */
export function loadingGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const uiStore = useUIStore()
  
  // Show loading state for route transitions
  uiStore.setLoading('navigation', true)
  
  next()
}

/**
 * After navigation guard - cleanup loading states
 */
export function afterNavigationGuard(
  to: RouteLocationNormalized
) {
  const uiStore = useUIStore()
  
  // Clear navigation loading state
  uiStore.setLoading('navigation', false)
  
  // Set page title based on route meta
  if (to.meta.title) {
    document.title = `${to.meta.title} - Property Cleaning Scheduler`
  } else {
    document.title = 'Property Cleaning Scheduler'
  }
}

/**
 * Development guard - logs navigation for debugging
 */
export function developmentGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  // Temporarily disable verbose navigation logging to reduce console noise
  // if (import.meta.env.DEV) {
  //   console.log('🚦 Navigation:', {
  //     from: from.path,
  //     to: to.path,
  //     meta: to.meta,
  //     requiresAuth: to.meta.requiresAuth,
  //     role: to.meta.role
  //   })
  // }
  
  next()
} 