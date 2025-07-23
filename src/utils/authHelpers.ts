// 🔐 AUTHENTICATION LAYER

// src/utils/authHelpers.ts - 🛠️ AUTH UTILITIES
// ✅ Route mapping for each role
// ✅ Role-specific UI messages
// ✅ Navigation validation helpers
// ✅ State cleanup utilities

import type { UserRole, User, UserSettings, PropertyOwner, Admin, Cleaner } from '@/types'

export function getDefaultRouteForRole(userRole: UserRole | undefined): string {
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
 * Get role-specific welcome message
 */
export function getWelcomeMessageForRole(userRole: UserRole | undefined, userName?: string): string {
  const name = userName ? ` ${userName}` : ''
  
  switch (userRole) {
    case 'owner':
      return `Welcome back${name}! Manage your properties and bookings.`
    case 'admin':
      return `Welcome back${name}! Access your business dashboard.`
    case 'cleaner':
      return `Welcome back${name}! Check your cleaning schedule.`
    default:
      return 'Welcome! Please log in to continue.'
  }
}

/**
 * Get role display name for UI
 */
export function getRoleDisplayName(role: UserRole): string {
  switch (role) {
    case 'owner':
      return 'Property Owner'
    case 'admin':
      return 'Business Admin'
    case 'cleaner':
      return 'Cleaning Staff'
    default:
      return 'Unknown Role'
  }
}

/**
 * Get available roles for registration
 */
export function getAvailableRoles(): Array<{ value: UserRole; title: string; description: string }> {
  return [
    {
      value: 'owner',
      title: 'Property Owner',
      description: 'Manage your Airbnb/VRBO properties and cleaning schedules'
    },
    {
      value: 'admin',
      title: 'Business Admin',
      description: 'Manage cleaning business operations and all client properties'
    },
    {
      value: 'cleaner',
      title: 'Cleaning Staff',
      description: 'Access your cleaning assignments and schedule'
    }
  ]
}

/**
 * Validate if a role transition is allowed
 */
export function canSwitchToRole(currentRole: UserRole, targetRole: UserRole): boolean {
  // Admin can switch to any role for support purposes
  if (currentRole === 'admin') {
    return ['owner', 'cleaner'].includes(targetRole)
  }
  
  // Other roles cannot switch
  return false
}

/**
 * Get role-specific error messages
 */
export function getRoleSpecificErrorMessage(error: string, userRole?: UserRole): string {
  if (!userRole) return error
  
  switch (userRole) {
    case 'owner':
      // Owner-friendly language
      return error.replace(/system/gi, 'application')
                  .replace(/database/gi, 'data')
                  .replace(/server/gi, 'service')
    case 'admin':
      // Admin gets technical details
      return `[Admin] ${error}`
    case 'cleaner':
      // Cleaner-friendly language
      return error.replace(/booking/gi, 'cleaning job')
                  .replace(/property/gi, 'location')
    default:
      return error
  }
}

/**
 * Clear all role-specific cached state
 * This function coordinates clearing state across all stores
 */
export function clearAllRoleSpecificState() {
  // Note: This function will be called from components that have access to stores
  // The actual store clearing will be done in the auth store
  console.log('Clearing all role-specific state...')
  
  // Clear any cached data in localStorage that might be role-specific
  const keysToRemove = [
    'owner-preferences',
    'admin-preferences', 
    'cleaner-preferences',
    'cached-properties',
    'cached-bookings',
    'cached-cleaners'
  ]
  
  keysToRemove.forEach(key => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`Failed to clear localStorage key: ${key}`, error)
    }
  })
}

/**
 * Role-based navigation validation
 */
export function validateRoleNavigation(userRole: UserRole | undefined, targetPath: string): {
  allowed: boolean
  redirectTo?: string
  message?: string
} {
  if (!userRole) {
    return {
      allowed: false,
      redirectTo: '/auth/login',
      message: 'Authentication required'
    }
  }
  
  // Owner trying to access admin routes
  if (userRole === 'owner' && targetPath.startsWith('/admin')) {
    return {
      allowed: false,
      redirectTo: '/owner/dashboard',
      message: 'Access denied. Admin privileges required.'
    }
  }
  
  // Cleaner trying to access owner/admin routes
  if (userRole === 'cleaner' && (targetPath.startsWith('/admin') || targetPath.startsWith('/owner'))) {
    return {
      allowed: false,
      redirectTo: '/cleaner/dashboard',
      message: 'Access denied. Insufficient privileges.'
    }
  }
  
  // Admin can access any route (for support purposes)
  return { allowed: true }
}

/**
 * Generate role-specific success messages
 */
export function getRoleSpecificSuccessMessage(action: 'login' | 'logout' | 'register', userRole?: UserRole): string {
  switch (action) {
    case 'login':
      switch (userRole) {
        case 'owner':
          return 'Successfully logged in! Welcome to your property dashboard.'
        case 'admin':
          return 'Successfully logged in! Welcome to your business dashboard.'
        case 'cleaner':
          return 'Successfully logged in! Check your cleaning assignments.'
        default:
          return 'Successfully logged in!'
      }
    case 'logout':
      return 'Successfully logged out. Thank you for using Property Cleaning Scheduler!'
    case 'register':
      switch (userRole) {
        case 'owner':
          return 'Account created! Start by adding your first property.'
        case 'admin':
          return 'Admin account created! Access your business dashboard.'
        case 'cleaner':
          return 'Account created! Your cleaning assignments will appear here.'
        default:
          return 'Account created successfully!'
      }
    default:
      return 'Operation completed successfully!'
  }
}

/**
 * Authentication Helper Functions
 * Utilities for working with user authentication and profile data
 */

/**
 * Creates a User object with both flattened and nested settings
 * Ensures compatibility with both old and new patterns
 */
export function createUserWithSettings(userData: Partial<User> & {
  settings?: UserSettings;
}): User {
  const baseUser: User = {
    id: userData.id || '',
    email: userData.email || '',
    name: userData.name || '',
    role: userData.role || 'owner',
    
    // Flattened settings (primary)
    notifications_enabled: userData.settings?.notifications ?? userData.notifications_enabled ?? true,
    timezone: userData.settings?.timezone ?? userData.timezone ?? 'UTC',
    theme: userData.settings?.theme ?? userData.theme ?? 'light',
    language: userData.settings?.language ?? userData.language ?? 'en',
    
    // Nested settings (for backward compatibility)
    settings: userData.settings ? {
      notifications: userData.settings.notifications,
      timezone: userData.settings.timezone,
      theme: userData.settings.theme,
      language: userData.settings.language,
    } : {
      notifications: userData.notifications_enabled ?? true,
      timezone: userData.timezone ?? 'UTC',
      theme: userData.theme ?? 'light',
      language: userData.language ?? 'en',
    },
    
    // Optional fields
    company_name: userData.company_name,
    access_level: userData.access_level,
    skills: userData.skills,
    max_daily_bookings: userData.max_daily_bookings,
    location_lat: userData.location_lat,
    location_lng: userData.location_lng,
    created_at: userData.created_at,
    updated_at: userData.updated_at,
  };

  return baseUser;
}

/**
 * Creates a PropertyOwner with proper type compatibility
 */
export function createPropertyOwner(ownerData: Partial<PropertyOwner> & {
  settings?: UserSettings;
}): PropertyOwner {
  const baseUser = createUserWithSettings(ownerData);
  return {
    ...baseUser,
    role: 'owner',
    company_name: ownerData.company_name,
  } as PropertyOwner;
}

/**
 * Creates an Admin with proper type compatibility
 */
export function createAdmin(adminData: Partial<Admin> & {
  settings?: UserSettings;
}): Admin {
  const baseUser = createUserWithSettings(adminData);
  return {
    ...baseUser,
    role: 'admin',
    access_level: adminData.access_level || 'limited',
  } as Admin;
}

/**
 * Creates a Cleaner object with both flattened and nested settings
 * Ensures compatibility with Cleaner interface requirements
 */
export function createCleaner(cleanerData: Partial<Cleaner> & {
  settings?: UserSettings;
}): Cleaner {
  const baseCleaner: Cleaner = {
    id: cleanerData.id || '',
    email: cleanerData.email || '',
    name: cleanerData.name || '',
    role: 'cleaner',
    
    // Flattened settings (primary)
    notifications_enabled: cleanerData.settings?.notifications ?? cleanerData.notifications_enabled ?? true,
    timezone: cleanerData.settings?.timezone ?? cleanerData.timezone ?? 'UTC',
    theme: cleanerData.settings?.theme ?? cleanerData.theme ?? 'light',
    language: cleanerData.settings?.language ?? cleanerData.language ?? 'en',
    
    // Nested settings (for compatibility)
    settings: {
      notifications: cleanerData.settings?.notifications ?? cleanerData.notifications_enabled ?? true,
      timezone: cleanerData.settings?.timezone ?? cleanerData.timezone ?? 'UTC',
      theme: cleanerData.settings?.theme ?? cleanerData.theme ?? 'light',
      language: cleanerData.settings?.language ?? cleanerData.language ?? 'en'
    },
    
    // Cleaner-specific properties
    skills: cleanerData.skills ?? [],
    max_daily_bookings: cleanerData.max_daily_bookings ?? 5,
    
    // Timestamps
    created_at: cleanerData.created_at ?? new Date().toISOString(),
    updated_at: cleanerData.updated_at ?? new Date().toISOString()
  };

  return baseCleaner;
}

/**
 * Converts nested settings to flattened format
 */
export function flattenUserSettings(settings: UserSettings): Partial<User> {
  return {
    notifications_enabled: settings.notifications,
    timezone: settings.timezone,
    theme: settings.theme,
    language: settings.language,
  };
}

/**
 * Converts flattened settings to nested format
 */
export function nestUserSettings(user: User): UserSettings {
  return {
    notifications: user.notifications_enabled,
    timezone: user.timezone,
    theme: user.theme,
    language: user.language,
  };
} 