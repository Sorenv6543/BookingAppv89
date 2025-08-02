# Database Schema & API Architecture Design

## Overview

This document outlines the comprehensive database schema design and API architecture for the Property Cleaning Scheduler, optimized for role-based access control, performance, and scalability.

## 1. Database Schema Design

### Core Entity Relationships

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   USER_PROFILES │    │   PROPERTIES    │    │    BOOKINGS     │
│                 │    │                 │    │                 │
│ id (PK)         │◄──┐│ id (PK)         │◄──┐│ id (PK)         │
│ email           │   ││ owner_id (FK)   │   ││ property_id(FK) │
│ name            │   ││ name            │   ││ owner_id (FK)   │
│ role            │   ││ address         │   ││ checkout_date   │
│ company_name    │   ││ cleaning_duration│   ││ checkin_date    │
│ ...             │   ││ pricing_tier    │   ││ booking_type    │
└─────────────────┘   │└─────────────────┘   │└─────────────────┘
                      │                      │
                      └──────────────────────┘
```

### Enhanced User Profiles Schema

```sql
-- User management with role-based architecture
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'cleaner');
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'system');
CREATE TYPE access_level AS ENUM ('full', 'limited', 'read_only');

CREATE TABLE user_profiles (
  -- Core identity
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  
  -- Contact and business information
  company_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT, 
  zip_code TEXT,
  phone TEXT,
  
  -- Verification status
  email_verified BOOLEAN DEFAULT FALSE,
  phone_verified BOOLEAN DEFAULT FALSE,
  
  -- User preferences (flattened for optimal performance)
  notifications_enabled BOOLEAN DEFAULT TRUE,
  timezone TEXT DEFAULT 'America/New_York',
  theme theme_type DEFAULT 'light',
  language TEXT DEFAULT 'en',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  
  -- Role-specific fields
  -- Admin fields
  access_level access_level, -- Admin only
  
  -- Cleaner fields  
  skills TEXT[], -- Cleaner only
  max_daily_bookings INTEGER, -- Cleaner only
  hourly_rate DECIMAL(10,2), -- Cleaner only
  location_lat DECIMAL(10,8), -- Cleaner only
  location_lng DECIMAL(11,8), -- Cleaner only
  availability_schedule JSONB, -- Cleaner schedule
  
  -- Performance and audit
  last_activity_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_role_fields CHECK (
    (role = 'admin' AND access_level IS NOT NULL) OR
    (role = 'cleaner' AND skills IS NOT NULL AND max_daily_bookings IS NOT NULL) OR
    (role = 'owner')
  )
);

-- Indexes for performance optimization
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_company ON user_profiles(company_name) WHERE company_name IS NOT NULL;
CREATE INDEX idx_user_profiles_location ON user_profiles(location_lat, location_lng) WHERE role = 'cleaner';
CREATE INDEX idx_user_profiles_active ON user_profiles(last_activity_at) WHERE last_activity_at > NOW() - INTERVAL '30 days';
```

### Properties Schema with Enhanced Metadata

```sql
-- Property types and pricing tiers
CREATE TYPE property_type AS ENUM ('apartment', 'house', 'condo', 'townhouse', 'studio', 'loft');
CREATE TYPE pricing_tier AS ENUM ('basic', 'standard', 'premium', 'luxury');

CREATE TABLE properties (
  -- Core property identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  
  -- Property characteristics
  bedrooms INTEGER CHECK (bedrooms >= 0),
  bathrooms DECIMAL(3,1) CHECK (bathrooms >= 0), -- Support half baths
  square_feet INTEGER CHECK (square_feet > 0),
  property_type property_type,
  
  -- Location data for cleaner assignment
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  
  -- Cleaning configuration
  cleaning_duration INTEGER NOT NULL CHECK (cleaning_duration > 0), -- minutes
  special_instructions TEXT,
  pricing_tier pricing_tier NOT NULL DEFAULT 'standard',
  base_price DECIMAL(10,2) CHECK (base_price >= 0),
  
  -- Property metadata
  amenities TEXT[], -- Pool, hot tub, pets, etc.
  access_instructions TEXT, -- Gate codes, key location
  wifi_network TEXT,
  wifi_password TEXT,
  
  -- Business rules
  turn_time_hours INTEGER DEFAULT 4 CHECK (turn_time_hours >= 0), -- Min hours between bookings
  max_guests INTEGER,
  pet_friendly BOOLEAN DEFAULT FALSE,
  
  -- Status and performance
  active BOOLEAN DEFAULT TRUE,
  priority_level INTEGER DEFAULT 1 CHECK (priority_level BETWEEN 1 AND 5),
  
  -- Property analytics (computed fields)
  avg_cleaning_time INTEGER, -- Actual average from completed bookings
  completion_rate DECIMAL(5,2) DEFAULT 100.00, -- % of bookings completed successfully
  customer_rating DECIMAL(3,2), -- Average rating from property owners
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_booking_at TIMESTAMPTZ,
  
  -- Full-text search
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', name || ' ' || address || ' ' || COALESCE(special_instructions, ''))
  ) STORED
);

-- Performance indexes
CREATE INDEX idx_properties_owner ON properties(owner_id) WHERE active = TRUE;
CREATE INDEX idx_properties_location ON properties(latitude, longitude) WHERE active = TRUE;
CREATE INDEX idx_properties_pricing ON properties(pricing_tier, base_price);
CREATE INDEX idx_properties_search ON properties USING GIN(search_vector);
CREATE INDEX idx_properties_active_priority ON properties(priority_level DESC, created_at DESC) WHERE active = TRUE;
```

### Bookings Schema with Workflow Management

```sql
-- Booking types and statuses
CREATE TYPE booking_type AS ENUM ('standard', 'turn');
CREATE TYPE booking_status AS ENUM ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled');
CREATE TYPE priority_level AS ENUM ('low', 'normal', 'high', 'urgent');

CREATE TABLE bookings (
  -- Core booking identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES user_profiles(id),
  
  -- Booking schedule
  checkout_date TIMESTAMPTZ NOT NULL,
  checkin_date TIMESTAMPTZ NOT NULL,
  booking_type booking_type NOT NULL DEFAULT 'standard',
  status booking_status NOT NULL DEFAULT 'pending',
  
  -- Cleaning window calculation
  cleaning_start_time TIMESTAMPTZ,
  cleaning_end_time TIMESTAMPTZ,
  estimated_duration INTEGER, -- minutes (from property settings)
  actual_duration INTEGER, -- minutes (tracked during cleaning)
  
  -- Booking details
  guest_count INTEGER CHECK (guest_count > 0),
  notes TEXT,
  special_requests TEXT,
  priority priority_level DEFAULT 'normal',
  
  -- Financial tracking
  quoted_price DECIMAL(10,2),
  final_price DECIMAL(10,2),
  payment_status TEXT DEFAULT 'pending',
  
  -- Assignment and execution
  assigned_cleaner_id UUID REFERENCES user_profiles(id),
  assigned_at TIMESTAMPTZ,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Quality tracking
  owner_rating INTEGER CHECK (owner_rating BETWEEN 1 AND 5),
  owner_feedback TEXT,
  cleaner_notes TEXT,
  before_photos TEXT[], -- URLs to before photos
  after_photos TEXT[], -- URLs to after photos
  
  -- Workflow tracking
  confirmation_sent_at TIMESTAMPTZ,
  reminder_sent_at TIMESTAMPTZ,
  follow_up_sent_at TIMESTAMPTZ,
  
  -- Audit and performance
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Business constraints
  CONSTRAINT valid_date_order CHECK (checkout_date <= checkin_date),
  CONSTRAINT valid_cleaning_window CHECK (
    cleaning_start_time IS NULL OR cleaning_end_time IS NULL OR 
    cleaning_start_time < cleaning_end_time
  ),
  CONSTRAINT valid_assignment CHECK (
    assigned_cleaner_id IS NULL OR 
    (SELECT role FROM user_profiles WHERE id = assigned_cleaner_id) = 'cleaner'
  )
);

-- Performance and query optimization indexes
CREATE INDEX idx_bookings_property_dates ON bookings(property_id, checkout_date, checkin_date);
CREATE INDEX idx_bookings_owner ON bookings(owner_id, created_at DESC);
CREATE INDEX idx_bookings_cleaner ON bookings(assigned_cleaner_id, cleaning_start_time) WHERE assigned_cleaner_id IS NOT NULL;
CREATE INDEX idx_bookings_status ON bookings(status, priority, created_at DESC);
CREATE INDEX idx_bookings_schedule ON bookings(cleaning_start_time, cleaning_end_time) WHERE status IN ('scheduled', 'in_progress');
CREATE INDEX idx_bookings_type_priority ON bookings(booking_type, priority, checkout_date);

-- Partial indexes for common queries
CREATE INDEX idx_bookings_pending ON bookings(created_at DESC) WHERE status = 'pending';
CREATE INDEX idx_bookings_active ON bookings(cleaning_start_time) WHERE status IN ('scheduled', 'in_progress');
CREATE INDEX idx_bookings_upcoming ON bookings(checkout_date) WHERE checkout_date > NOW() AND status != 'cancelled';
```

### Support Tables for Enhanced Functionality

```sql
-- Cleaner availability tracking
CREATE TABLE cleaner_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cleaner_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  available BOOLEAN DEFAULT TRUE,
  reason TEXT, -- If unavailable
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_time_range CHECK (start_time < end_time),
  CONSTRAINT valid_cleaner_role CHECK (
    (SELECT role FROM user_profiles WHERE id = cleaner_id) = 'cleaner'
  ),
  
  UNIQUE(cleaner_id, date, start_time, end_time)
);

-- System notifications and messaging
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- booking_reminder, assignment_update, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB, -- Additional structured data
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, created_at DESC) WHERE read = FALSE;
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);

-- Audit log for important changes
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id),
  action TEXT NOT NULL, -- create, update, delete, login, etc.
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_table ON audit_log(table_name, record_id, created_at DESC);
```

## 2. Row-Level Security (RLS) Policies

### User Profile Security

```sql
-- Enable RLS on user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = OLD.role);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage user roles
CREATE POLICY "Admins can manage users" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

### Property Security

```sql
-- Enable RLS on properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Property owners can manage their properties
CREATE POLICY "Owners can manage own properties" ON properties
  FOR ALL USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cleaners can view properties they're assigned to
CREATE POLICY "Cleaners can view assigned properties" ON properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM bookings b
      JOIN user_profiles u ON u.id = auth.uid()
      WHERE b.property_id = properties.id 
        AND b.assigned_cleaner_id = auth.uid()
        AND u.role = 'cleaner'
    )
  );
```

### Booking Security

```sql
-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Property owners can manage bookings for their properties
CREATE POLICY "Owners can manage own bookings" ON bookings
  FOR ALL USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM properties p 
      WHERE p.id = bookings.property_id AND p.owner_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Cleaners can view and update assigned bookings
CREATE POLICY "Cleaners can manage assigned bookings" ON bookings
  FOR SELECT USING (
    assigned_cleaner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Cleaners can update assigned bookings" ON bookings
  FOR UPDATE USING (assigned_cleaner_id = auth.uid())
  WITH CHECK (assigned_cleaner_id = auth.uid());
```

## 3. API Architecture Design

### Composable-Based Data Layer

```typescript
// Core data access composable with role-based filtering
export function useDataLayer<T extends BaseEntity>(
  entityType: EntityType,
  options: DataLayerOptions = {}
) {
  const { user, isAuthenticated } = useAuthStore()
  const cache = useCache()
  const performance = usePerformanceMonitor()
  
  // Role-based query builder
  const buildQuery = (baseQuery: PostgrestQueryBuilder<any>) => {
    if (!user.value) return baseQuery.limit(0) // No data without auth
    
    switch (user.value.role) {
      case 'owner':
        return baseQuery.eq('owner_id', user.value.id)
      
      case 'cleaner':
        if (entityType === 'bookings') {
          return baseQuery.eq('assigned_cleaner_id', user.value.id)
        }
        if (entityType === 'properties') {
          return baseQuery.in('id', 
            supabase.from('bookings')
              .select('property_id')
              .eq('assigned_cleaner_id', user.value.id)
          )
        }
        break
        
      case 'admin':
        return baseQuery // Admins see all data
    }
    
    return baseQuery.limit(0) // Default: no access
  }
  
  // Cached data fetching with performance tracking
  const fetchData = async (filters: DataFilters = {}): Promise<T[]> => {
    if (!isAuthenticated.value) return []
    
    const cacheKey = generateCacheKey(entityType, user.value.id, user.value.role, filters)
    
    return performance.measureRolePerformance(
      user.value.role,
      `fetch_${entityType}`,
      async () => {
        // Check cache first
        const cached = cache.get<T[]>(cacheKey)
        if (cached && !options.skipCache) {
          performance.trackCachePerformance('data_fetch', true)
          return cached
        }
        
        // Build and execute query
        let query = buildQuery(supabase.from(entityType).select('*'))
        
        // Apply additional filters
        if (filters.dateRange) {
          query = query
            .gte('created_at', filters.dateRange.start)
            .lte('created_at', filters.dateRange.end)
        }
        
        if (filters.status) {
          query = query.eq('status', filters.status)
        }
        
        if (filters.search) {
          query = query.textSearch('search_vector', filters.search)
        }
        
        // Apply sorting
        const sortBy = filters.sortBy || 'created_at'
        const sortOrder = filters.sortOrder || 'desc'
        query = query.order(sortBy, { ascending: sortOrder === 'asc' })
        
        // Apply pagination
        if (filters.limit) {
          query = query.limit(filters.limit)
        }
        if (filters.offset) {
          query = query.range(filters.offset, filters.offset + (filters.limit || 50))
        }
        
        const { data, error } = await query
        
        if (error) {
          console.error(`Error fetching ${entityType}:`, error)
          throw new Error(`Failed to fetch ${entityType}: ${error.message}`)
        }
        
        // Cache the results
        const cacheTimeout = getCacheTimeout(entityType, user.value.role)
        cache.set(cacheKey, data || [], cacheTimeout)
        performance.trackCachePerformance('data_fetch', false)
        
        return data || []
      }
    )
  }
  
  // Create operation with role validation
  const createRecord = async (data: Partial<T>): Promise<T | null> => {
    if (!canCreateRecord(user.value.role, entityType)) {
      throw new Error(`Insufficient permissions to create ${entityType}`)
    }
    
    const recordData = {
      ...data,
      ...(user.value.role === 'owner' && { owner_id: user.value.id }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { data: result, error } = await supabase
      .from(entityType)
      .insert(recordData)
      .select()
      .single()
    
    if (error) {
      throw new Error(`Failed to create ${entityType}: ${error.message}`)
    }
    
    // Invalidate relevant cache entries
    await invalidateCache(entityType, user.value.id, user.value.role)
    
    return result
  }
  
  // Update operation with ownership validation
  const updateRecord = async (id: string, updates: Partial<T>): Promise<T | null> => {
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString()
    }
    
    let query = supabase
      .from(entityType)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    // Apply role-based update restrictions
    query = buildQuery(query as any) as any
    
    const { data: result, error } = await query
    
    if (error) {
      throw new Error(`Failed to update ${entityType}: ${error.message}`)
    }
    
    // Invalidate cache
    await invalidateCache(entityType, user.value.id, user.value.role)
    
    return result
  }
  
  return {
    fetchData,
    createRecord,
    updateRecord,
    // ... other CRUD operations
  }
}

// Type definitions for data layer
interface DataLayerOptions {
  skipCache?: boolean
  cacheTimeout?: number
  enableRealtime?: boolean
}

interface DataFilters {
  dateRange?: { start: string; end: string }
  status?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

type EntityType = 'user_profiles' | 'properties' | 'bookings' | 'notifications'

interface BaseEntity {
  id: string
  created_at?: string
  updated_at?: string
}
```

### Real-time Synchronization

```typescript
// Real-time data synchronization with role-based filtering
export function useRealtimeSync<T extends BaseEntity>(
  entityType: EntityType,
  options: RealtimeOptions = {}
) {
  const { user } = useAuthStore()
  const data = ref<T[]>([])
  const connected = ref(false)
  const error = ref<string | null>(null)
  
  let channel: RealtimeChannel | null = null
  
  const startSync = () => {
    if (!user.value || channel) return
    
    const channelName = `${entityType}_${user.value.role}_${user.value.id}`
    
    channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: entityType,
        filter: buildRealtimeFilter(user.value.role, user.value.id, entityType)
      }, handleRealtimeChange)
      .on('subscribe', (status) => {
        connected.value = status === 'SUBSCRIBED'
        if (status === 'CHANNEL_ERROR') {
          error.value = 'Failed to subscribe to real-time updates'
        }
      })
      .subscribe()
  }
  
  const stopSync = () => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
      connected.value = false
    }
  }
  
  const handleRealtimeChange = (payload: RealtimePostgresChangesPayload<T>) => {
    const { eventType, new: newRecord, old: oldRecord } = payload
    
    switch (eventType) {
      case 'INSERT':
        if (newRecord && shouldIncludeRecord(newRecord, user.value.role, user.value.id)) {
          data.value.push(newRecord)
        }
        break
        
      case 'UPDATE':
        if (newRecord) {
          const index = data.value.findIndex(item => item.id === newRecord.id)
          if (index >= 0) {
            data.value[index] = newRecord
          }
        }
        break
        
      case 'DELETE':
        if (oldRecord) {
          const index = data.value.findIndex(item => item.id === oldRecord.id)
          if (index >= 0) {
            data.value.splice(index, 1)
          }
        }
        break
    }
  }
  
  // Auto-start/stop based on component lifecycle
  onMounted(() => {
    if (options.autoStart !== false) {
      startSync()
    }
  })
  
  onUnmounted(() => {
    stopSync()
  })
  
  // Watch for user changes
  watch(() => user.value?.id, (newUserId, oldUserId) => {
    if (newUserId !== oldUserId) {
      stopSync()
      if (newUserId) {
        startSync()
      }
    }
  })
  
  return {
    data: readonly(data),
    connected: readonly(connected),
    error: readonly(error),
    startSync,
    stopSync
  }
}

// Helper functions
function buildRealtimeFilter(role: UserRole, userId: string, entityType: EntityType): string {
  switch (role) {
    case 'owner':
      return `owner_id=eq.${userId}`
    case 'cleaner':
      if (entityType === 'bookings') {
        return `assigned_cleaner_id=eq.${userId}`
      }
      return `id=eq.${userId}` // Fallback for other entities
    case 'admin':
      return '' // No filter for admin (sees all)
    default:
      return 'id=eq.never' // Block access for unknown roles
  }
}

function shouldIncludeRecord<T extends BaseEntity>(
  record: T, 
  role: UserRole, 
  userId: string
): boolean {
  const recordAny = record as any
  
  switch (role) {
    case 'owner':
      return recordAny.owner_id === userId
    case 'cleaner':
      return recordAny.assigned_cleaner_id === userId || recordAny.id === userId
    case 'admin':
      return true
    default:
      return false
  }
}

interface RealtimeOptions {
  autoStart?: boolean
  bufferTime?: number
  maxRetries?: number
}
```

### API Performance Optimization

```typescript
// Request batching and optimization
export function useAPIOptimization() {
  const requestBatcher = new Map<string, Promise<any>>()
  const requestQueue: Array<{ key: string; resolver: Function; rejecter: Function }> = []
  
  // Batch similar requests together
  const batchRequest = async <T>(
    key: string,
    requestFn: () => Promise<T>,
    batchWindow = 50
  ): Promise<T> => {
    // Check if identical request is already in flight
    if (requestBatcher.has(key)) {
      return requestBatcher.get(key)
    }
    
    // Create batched promise
    const batchedPromise = new Promise<T>((resolve, reject) => {
      requestQueue.push({ key, resolver: resolve, rejecter: reject })
      
      // Process batch after delay
      setTimeout(async () => {
        const batchItems = requestQueue.splice(0, requestQueue.length)
        
        try {
          const result = await requestFn()
          batchItems.forEach(item => item.resolver(result))
        } catch (error) {
          batchItems.forEach(item => item.rejecter(error))
        } finally {
          requestBatcher.delete(key)
        }
      }, batchWindow)
    })
    
    requestBatcher.set(key, batchedPromise)
    return batchedPromise
  }
  
  // Request deduplication
  const deduplicateRequest = <T>(
    key: string,
    requestFn: () => Promise<T>
  ): Promise<T> => {
    if (requestBatcher.has(key)) {
      return requestBatcher.get(key)
    }
    
    const promise = requestFn().finally(() => {
      requestBatcher.delete(key)
    })
    
    requestBatcher.set(key, promise)
    return promise
  }
  
  return { batchRequest, deduplicateRequest }
}

// Database query optimization
export function useQueryOptimization() {
  // Query result caching with intelligent invalidation
  const queryCache = new Map<string, {
    data: any
    timestamp: number
    dependencies: string[]
  }>()
  
  const getCachedQuery = <T>(
    key: string,
    maxAge: number = 300000 // 5 minutes default
  ): T | null => {
    const cached = queryCache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > maxAge) {
      queryCache.delete(key)
      return null
    }
    
    return cached.data
  }
  
  const setCachedQuery = <T>(
    key: string,
    data: T,
    dependencies: string[] = []
  ) => {
    queryCache.set(key, {
      data,
      timestamp: Date.now(),
      dependencies
    })
  }
  
  const invalidateCache = (dependency: string) => {
    for (const [key, value] of queryCache.entries()) {
      if (value.dependencies.includes(dependency)) {
        queryCache.delete(key)
      }
    }
  }
  
  return { getCachedQuery, setCachedQuery, invalidateCache }
}
```

## 4. Migration and Deployment Strategy

### Database Migration Scripts

```sql
-- Migration: 001_initial_schema.sql
-- Create initial database schema with RLS policies

-- Migration: 002_performance_indexes.sql  
-- Add performance-optimized indexes

-- Migration: 003_audit_triggers.sql
-- Add audit logging triggers
CREATE OR REPLACE FUNCTION trigger_audit_log()
  RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    NOW()
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to key tables
CREATE TRIGGER audit_user_profiles
  AFTER INSERT OR UPDATE OR DELETE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER audit_properties  
  AFTER INSERT OR UPDATE OR DELETE ON properties
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();

CREATE TRIGGER audit_bookings
  AFTER INSERT OR UPDATE OR DELETE ON bookings
  FOR EACH ROW EXECUTE FUNCTION trigger_audit_log();
```

### Performance Monitoring Queries

```sql
-- Query performance monitoring
CREATE VIEW performance_metrics AS
SELECT 
  schemaname,
  tablename,
  seq_scan,
  seq_tup_read,
  idx_scan,
  idx_tup_fetch,
  n_tup_ins,
  n_tup_upd,
  n_tup_del,
  n_tup_hot_upd,
  n_live_tup,
  n_dead_tup,
  vacuum_count,
  autovacuum_count,
  analyze_count,
  autoanalyze_count
FROM pg_stat_user_tables
WHERE schemaname = 'public';

-- Index usage analysis
CREATE VIEW index_usage AS
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

This comprehensive database and API design provides a solid foundation for the Property Cleaning Scheduler with optimal performance, security, and scalability.