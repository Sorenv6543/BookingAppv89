/**
 * User Type Definitions
 * Types for users in the property cleaning scheduler
 */

/**
 * Valid user roles in the system
 */
export type UserRole = 'owner' | 'admin' | 'cleaner';

/**
 * User settings interface
 * Contains customizable user preferences
 */
export interface UserSettings {
  notifications: boolean;
  timezone: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
}

/**
 * Base User interface
 * Core data model for all users
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  settings: UserSettings;
  created_at?: string;
  updated_at?: string;
}

/**
 * Property Owner user
 * Has properties that need cleaning
 */
export interface PropertyOwner extends User {
  role: 'owner';
  company_name?: string;
}

/**
 * Admin user
 * Manages the cleaning company
 */
export interface Admin extends User {
  role: 'admin';
  access_level: 'full' | 'limited';
}

/**
 * Cleaner user
 * Performs the actual cleaning work
 */
export interface Cleaner extends User {
  role: 'cleaner';
  skills: string[];
  max_daily_bookings: number;
  location?: {
    lat: number;
    lng: number;
  };
}

/**
 * Type guard for PropertyOwner
 */
export function isPropertyOwner(user: User): user is PropertyOwner {
  return user.role === 'owner';
}

/**
 * Type guard for Admin
 */
export function isAdmin(user: User): user is Admin {
  return user.role === 'admin';
}

/**
 * Type guard for Cleaner
 */
export function isCleaner(user: User): user is Cleaner {
  return user.role === 'cleaner';
}
