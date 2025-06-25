import 'vue-router'

// Extend Vue Router's RouteMeta interface to include our custom meta fields
declare module 'vue-router' {
  interface RouteMeta {
    // Layout to use for this route
    layout?: 'default' | 'admin' | 'auth'
    
    // Whether this route requires authentication
    requiresAuth?: boolean
    
    // Specific role required to access this route
    role?: 'owner' | 'admin' | 'cleaner'
    
    // Whether this route is public (accessible without auth)
    public?: boolean
    
    // Custom title for the route (for breadcrumbs, page titles, etc.)
    title?: string
    
    // Whether this route should be hidden from navigation
    hidden?: boolean
    
    // Icon for navigation (if applicable)
    icon?: string
    
    // Whether this route is for development/demo purposes
    demo?: boolean
  }
}

// User role type available from ./user.ts
// export type UserRole = 'owner' | 'admin' | 'cleaner' // Removed duplicate export

// Route guard result types
export interface RouteGuardResult {
  allowed: boolean
  redirect?: string
  error?: string
}

// Navigation error types for better error handling
export interface NavigationError {
  type: 'auth' | 'role' | 'permission' | 'network'
  message: string
  code?: string
  redirectTo?: string
}

export {} 