/**
 * Property Type Definitions
 * Types for properties managed in the cleaning scheduler
 */

/**
 * Valid pricing tiers for properties
 */
export type PricingTier = 'basic' | 'standard' | 'premium' | 'luxury';

/**
 * Property Interface
 * Core data model for properties in the system
 */
export interface Property {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  property_type?: 'apartment' | 'house' | 'condo' | 'townhouse';
  cleaning_duration: number; // minutes
  special_instructions?: string;
  pricing_tier: PricingTier;
  active: boolean;
  default_checkout_time?: string; // HH:MM format, e.g., '11:00'
  default_checkin_time?: string;  // HH:MM format, e.g., '15:00'
  created_at?: string;
  updated_at?: string;
}

/**
 * Record-compatible wrapper for boundaries that require Record<string, unknown>.
 */
export type PropertyRecord = Property & Record<string, unknown>;

/**
 * Extended property interface with analytics
 * Used for property dashboard views
 */
export interface PropertyWithMetrics extends Property {
  metrics: {
    utilizationRate: number;
    averageGapBetweenBookings: number;
    turnPercentage: number;
    revenueProjection: number;
    cleaningLoad: 'light' | 'moderate' | 'heavy';
  };
}

/**
 * Property form data
 * Used for creating/editing properties
 */
export type PropertyFormData = Omit<Property, 'id' | 'created_at' | 'updated_at'>;

/**
 * Map type for property collections
 */
export type PropertyMap = Map<string, Property>;

/**
 * Type guard for Property objects
 */
export function isProperty(obj: unknown): obj is Property {
  if (typeof obj !== 'object' || obj === null) return false;
  const p = obj as Partial<Property>;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.address === 'string' &&
    typeof p.cleaning_duration === 'number' &&
    typeof p.active === 'boolean'
  );
}
