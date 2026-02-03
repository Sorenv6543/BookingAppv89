# 🔌 Property Cleaning Scheduler - API Reference

## 📋 Overview

Complete API reference for the Property Cleaning Scheduler application, including TypeScript interfaces, component APIs, composable functions, and Supabase integration patterns.

**API Version**: 1.0  
**TypeScript**: 5.3+  
**Framework Compatibility**: Vue 3.4+

---

## 🏗️ Core Type System

### User Types (`src/types/user.ts`)

```typescript
export type UserRole = 'admin' | 'owner' | 'cleaner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  company_name?: string;
  notifications_enabled: boolean;
  timezone: string;
  theme: 'light' | 'dark';
  language: string;
  created_at: string;
  updated_at: string;
  access_level?: string; // For admin users
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  initializing: boolean;
  isAuthenticated: boolean;
}
```

### Property Types (`src/types/property.ts`)

```typescript
export type PropertyType = 'apartment' | 'house' | 'condo' | 'commercial';
export type PropertyStatus = 'active' | 'inactive' | 'maintenance';

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  property_type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  status: PropertyStatus;
  owner_id: string;
  cleaning_instructions?: string;
  access_instructions?: string;
  rate_per_hour?: number;
  estimated_hours?: number;
  created_at: string;
  updated_at: string;
}
```

### Booking Types (`src/types/booking.ts`)

```typescript
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type BookingType = 'regular' | 'deep' | 'move_out' | 'post_construction' | 'turn';
export type TurnPriority = 'standard' | 'urgent' | 'same_day';

export interface Booking {
  id: string;
  property_id: string;
  cleaner_id?: string;
  scheduled_date: string;
  start_time: string;
  end_time?: string;
  booking_type: BookingType;
  status: BookingStatus;
  special_instructions?: string;
  estimated_duration: number;
  actual_duration?: number;
  rate?: number;
  total_cost?: number;
  
  // Turn-specific fields
  is_turn: boolean;
  turn_priority?: TurnPriority;
  checkout_date?: string;
  checkin_date?: string;
  guest_count?: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
  created_by: string;
  
  // Relations (populated by queries)
  property?: Property;
  cleaner?: User;
  owner?: User;
}
```

### UI Types (`src/types/ui.ts`)

```typescript
export interface ModalState {
  isOpen: boolean;
  title: string;
  component?: any;
  props?: Record<string, any>;
  persistent?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  backgroundColor?: string;
  borderColor?: string;
  extendedProps?: {
    booking?: Booking;
    property?: Property;
    status?: BookingStatus;
    priority?: TurnPriority;
  };
}

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  persistent?: boolean;
  timeout?: number;
  actions?: NotificationAction[];
}
```

---

## 🔐 Authentication API

### useSupabaseAuth Composable

**Location**: `src/composables/supabase/useSupabaseAuth.ts`

```typescript
export interface SupabaseAuthAPI {
  // State
  user: Ref<User | null>;
  session: Ref<Session | null>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  initializing: Ref<boolean>;
  
  // Computed
  isAuthenticated: ComputedRef<boolean>;
  currentUserId: ComputedRef<string | null>;
  
  // Authentication Methods
  signIn(email: string, password: string): Promise<boolean>;
  signUp(email: string, password: string, userData: {
    name: string;
    role?: UserRole;
    company_name?: string;
  }): Promise<boolean>;
  signOut(): Promise<boolean>;
  
  // Profile Management
  updateProfile(updates: Partial<User>): Promise<boolean>;
  resetPassword(email: string): Promise<boolean>;
  loadUserProfile(userId: string): Promise<void>;
  
  // Session Management
  checkAuth(): Promise<void>;
  
  // Admin Functions
  getAllUsers(): Promise<User[]>;
  updateUserRole(userId: string, newRole: UserRole): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
  createAdminUser(userData: {
    email: string;
    password: string;
    name: string;
    access_level?: string;
  }): Promise<boolean>;
}
```

### Auth Store API

**Location**: `src/stores/auth.ts`

```typescript
export interface AuthStoreAPI {
  // State
  session: ComputedRef<Session | null>;
  user: ComputedRef<User | null>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<string | null>;
  initializing: ComputedRef<boolean>;
  isAuthenticated: ComputedRef<boolean>;
  
  // Role Checks
  isAdmin: ComputedRef<boolean>;
  isOwner: ComputedRef<boolean>;
  isCleaner: ComputedRef<boolean>;
  
  // Actions
  login(email: string, password: string): Promise<boolean>;
  logout(): Promise<boolean>;
  register(email: string, password: string, userData: {
    name: string;
    role?: UserRole;
    company_name?: string;
  }): Promise<boolean>;
  
  // Profile Management
  updateUserProfile(updates: Partial<User>): Promise<boolean>;
  requestPasswordReset(email: string): Promise<boolean>;
  
  // Admin Functions
  fetchAllUsers(): Promise<User[]>;
  changeUserRole(userId: string, newRole: UserRole): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
  
  // Utility
  clearError(): void;
  checkAuth(): Promise<void>;
  $reset(): void;
}
```

---

## 📅 Calendar API

### Calendar Event Management

```typescript
export interface CalendarAPI {
  // Event Creation
  createEvent(eventData: {
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    bookingId?: string;
    propertyId?: string;
  }): CalendarEvent;
  
  // Event Manipulation
  updateEvent(eventId: string, updates: Partial<CalendarEvent>): void;
  deleteEvent(eventId: string): void;
  
  // View Management
  changeView(view: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'): void;
  navigateToDate(date: string): void;
  
  // Event Handlers
  onEventClick(callback: (eventInfo: any) => void): void;
  onDateSelect(callback: (selectInfo: any) => void): void;
  onEventDrop(callback: (dropInfo: any) => void): void;
  onEventResize(callback: (resizeInfo: any) => void): void;
}
```

### FullCalendar Integration

**Location**: `src/components/smart/FullCalendar.vue`

```typescript
interface FullCalendarProps {
  events: CalendarEvent[];
  initialView?: string;
  headerToolbar?: object;
  height?: string | number;
  selectable?: boolean;
  editable?: boolean;
  dayMaxEvents?: boolean | number;
  
  // Event handlers
  onEventClick?: (eventInfo: any) => void;
  onDateSelect?: (selectInfo: any) => void;
  onEventDrop?: (dropInfo: any) => void;
  onEventResize?: (resizeInfo: any) => void;
}

interface FullCalendarEmits {
  eventClick: [eventInfo: any];
  dateSelect: [selectInfo: any];
  eventDrop: [dropInfo: any];
  eventResize: [resizeInfo: any];
}
```

---

## 🏢 Business Logic APIs

### Owner Booking Management

**Location**: `src/composables/owner/useOwnerBookings.ts`

```typescript
export interface OwnerBookingsAPI {
  // State
  bookings: Ref<Booking[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  
  // CRUD Operations
  fetchBookings(): Promise<void>;
  createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<boolean>;
  updateBooking(bookingId: string, updates: Partial<Booking>): Promise<boolean>;
  deleteBooking(bookingId: string): Promise<boolean>;
  
  // Specialized Operations
  scheduleCleaningFor(propertyId: string, date: string, type: BookingType): Promise<boolean>;
  cancelBooking(bookingId: string, reason?: string): Promise<boolean>;
  rescheduleBooking(bookingId: string, newDate: string, newTime: string): Promise<boolean>;
  
  // Queries
  getBookingsForProperty(propertyId: string): Booking[];
  getUpcomingBookings(days?: number): Booking[];
  getBookingsByDateRange(startDate: string, endDate: string): Booking[];
  getBookingsByStatus(status: BookingStatus): Booking[];
  
  // Turn Management
  createTurnBooking(turnData: {
    propertyId: string;
    checkoutDate: string;
    checkinDate: string;
    guestCount?: number;
    priority?: TurnPriority;
  }): Promise<boolean>;
  
  // Calendar Integration
  getCalendarEvents(): CalendarEvent[];
  
  // Utility
  clearError(): void;
  refresh(): Promise<void>;
}
```

### Admin User Management

**Location**: `src/composables/admin/useAdminUserManagement.ts`

```typescript
export interface AdminUserManagementAPI {
  // State
  users: Ref<User[]>;
  cleaners: Ref<User[]>;
  owners: Ref<User[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  
  // User CRUD
  fetchAllUsers(): Promise<void>;
  createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<boolean>;
  updateUser(userId: string, updates: Partial<User>): Promise<boolean>;
  deleteUser(userId: string): Promise<boolean>;
  
  // Role Management
  changeUserRole(userId: string, newRole: UserRole): Promise<boolean>;
  bulkUpdateRoles(updates: Array<{ userId: string; role: UserRole }>): Promise<boolean>;
  
  // User Queries
  getUsersByRole(role: UserRole): User[];
  searchUsers(query: string): User[];
  getActiveUsers(): User[];
  
  // Cleaner Management
  assignCleanerToBooking(cleanerId: string, bookingId: string): Promise<boolean>;
  getCleanerSchedule(cleanerId: string, dateRange: { start: string; end: string }): Booking[];
  getCleanerAvailability(cleanerId: string, date: string): boolean;
  
  // Analytics
  getUserStatistics(): {
    totalUsers: number;
    adminCount: number;
    ownerCount: number;
    cleanerCount: number;
    activeUsers: number;
  };
  
  // Utility
  clearError(): void;
  refresh(): Promise<void>;
}
```

---

## 🏠 Property Management APIs

### Property Operations

**Location**: `src/composables/shared/useProperties.ts`

```typescript
export interface PropertiesAPI {
  // State
  properties: Ref<Property[]>;
  loading: Ref<boolean>;
  error: Ref<string | null>;
  
  // CRUD Operations
  fetchProperties(): Promise<void>;
  createProperty(propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<boolean>;
  updateProperty(propertyId: string, updates: Partial<Property>): Promise<boolean>;
  deleteProperty(propertyId: string): Promise<boolean>;
  
  // Property Queries
  getPropertiesByOwner(ownerId: string): Property[];
  getPropertiesByStatus(status: PropertyStatus): Property[];
  getPropertiesByType(type: PropertyType): Property[];
  searchProperties(query: string): Property[];
  
  // Property Analytics
  getPropertyStatistics(propertyId: string): {
    totalBookings: number;
    completedCleanings: number;
    averageRating: number;
    totalRevenue: number;
    upcomingBookings: number;
  };
  
  // Utility
  clearError(): void;
  refresh(): Promise<void>;
}
```

---

## 🔄 Real-time Sync API

### Supabase Real-time Integration

**Location**: `src/composables/supabase/useRealtimeSync.ts`

```typescript
export interface RealtimeSyncAPI {
  // Connection State
  connected: Ref<boolean>;
  error: Ref<string | null>;
  
  // Channel Management
  subscribeToBookings(): void;
  subscribeToProperties(): void;
  subscribeToUsers(): void;
  unsubscribeAll(): void;
  
  // Event Handlers
  onBookingChange(callback: (payload: any) => void): void;
  onPropertyChange(callback: (payload: any) => void): void;
  onUserChange(callback: (payload: any) => void): void;
  
  // Manual Sync
  syncBookings(): Promise<void>;
  syncProperties(): Promise<void>;
  syncUsers(): Promise<void>;
  
  // Utility
  reconnect(): void;
  getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' | 'error';
}
```

---

## 🎨 UI Component APIs

### Modal Management

```typescript
export interface ModalAPI {
  // State
  modals: Ref<Record<string, ModalState>>;
  
  // Modal Operations
  openModal(id: string, config: {
    title: string;
    component?: any;
    props?: Record<string, any>;
    persistent?: boolean;
  }): void;
  closeModal(id: string): void;
  closeAllModals(): void;
  
  // Modal Queries
  isModalOpen(id: string): boolean;
  getModalState(id: string): ModalState | null;
}
```

### Notification System

```typescript
export interface NotificationAPI {
  // State
  notifications: Ref<Notification[]>;
  
  // Notification Operations
  showNotification(notification: Omit<Notification, 'id'>): string;
  showSuccess(title: string, message: string, options?: {
    persistent?: boolean;
    timeout?: number;
  }): void;
  showError(title: string, message: string, options?: {
    persistent?: boolean;
    timeout?: number;
  }): void;
  showWarning(title: string, message: string, options?: {
    persistent?: boolean;
    timeout?: number;
  }): void;
  showInfo(title: string, message: string, options?: {
    persistent?: boolean;
    timeout?: number;
  }): void;
  
  // Notification Management
  dismissNotification(id: string): void;
  dismissAll(): void;
  
  // Notification Queries
  getActiveNotifications(): Notification[];
  getNotificationCount(): number;
}
```

---

## 🛡️ Error Handling API

### Error Management

**Location**: `src/composables/shared/useErrorHandler.ts`

```typescript
export interface ErrorHandlerAPI {
  // Error State
  errors: Ref<ErrorInfo[]>;
  hasErrors: Ref<boolean>;
  
  // Error Handling
  handleError(error: unknown, context?: ErrorContext): void;
  handleApiError(error: any, operation: string): void;
  handleValidationErrors(errors: ValidationError[]): void;
  
  // Error Recovery
  retryOperation(operationId: string): Promise<void>;
  recoverFromError(errorId: string, action: ErrorRecoveryAction): Promise<void>;
  
  // Error Queries
  getErrorsByCategory(category: ErrorCategory): ErrorInfo[];
  getRecentErrors(minutes: number): ErrorInfo[];
  getCriticalErrors(): ErrorInfo[];
  
  // Error Cleanup
  clearError(errorId: string): void;
  clearAllErrors(): void;
  clearErrorsByCategory(category: ErrorCategory): void;
}
```

---

## 📊 Performance API

### Performance Monitoring

**Location**: `src/composables/shared/usePerformanceMonitor.ts`

```typescript
export interface PerformanceAPI {
  // Metrics Collection
  startTiming(operationName: string): string;
  endTiming(timingId: string): number;
  recordMetric(name: string, value: number, unit?: string): void;
  
  // Performance Queries
  getMetrics(): Record<string, any>;
  getAverageTime(operationName: string): number;
  getPerformanceScore(): number;
  
  // Monitoring
  enableMonitoring(): void;
  disableMonitoring(): void;
  exportMetrics(): any;
}
```

---

## 🔧 Utility APIs

### Loading State Management

```typescript
export interface LoadingStateAPI {
  // State
  isLoading: Ref<boolean>;
  loadingOperations: Ref<Record<string, LoadingOperation>>;
  
  // Loading Operations
  startLoading(operation: string, options?: LoadingStateOptions): void;
  stopLoading(operation: string): void;
  setGlobalLoading(loading: boolean): void;
  
  // Loading Queries
  isOperationLoading(operation: string): boolean;
  getLoadingOperations(): string[];
  getLoadingProgress(operation: string): number | null;
}
```

### Form Validation

```typescript
export interface ValidationAPI {
  // Validation Rules
  required(message?: string): (value: any) => boolean | string;
  email(message?: string): (value: string) => boolean | string;
  minLength(min: number, message?: string): (value: string) => boolean | string;
  maxLength(max: number, message?: string): (value: string) => boolean | string;
  pattern(regex: RegExp, message?: string): (value: string) => boolean | string;
  
  // Form Validation
  validateForm(data: Record<string, any>, rules: Record<string, Function[]>): ValidationError[];
  validateField(value: any, rules: Function[]): string | null;
  
  // Utility
  isValidEmail(email: string): boolean;
  isValidPhoneNumber(phone: string): boolean;
  sanitizeInput(input: string): string;
}
```

---

## 🔌 Integration APIs

### Supabase Client Configuration

```typescript
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  options?: {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
    realtime?: {
      enabled?: boolean;
    };
  };
}
```

### Route Guard API

```typescript
export interface RouteGuardAPI {
  // Guard Functions
  authGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): Promise<void>;
  roleGuard(requiredRole: UserRole): NavigationGuard;
  loadingGuard(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void;
  
  // Utility Functions
  getDefaultRouteForRole(role?: UserRole): string;
  checkRoutePermissions(route: RouteLocationNormalized, user: User | null): boolean;
}
```

---

## 📝 Usage Examples

### Authentication Flow

```typescript
// Sign in a user
const auth = useSupabaseAuth();
const success = await auth.signIn('user@example.com', 'password');

if (success) {
  console.log('User signed in:', auth.user.value);
} else {
  console.error('Sign in failed:', auth.error.value);
}
```

### Booking Management

```typescript
// Create a new booking
const ownerBookings = useOwnerBookings();
const booking = await ownerBookings.createBooking({
  property_id: 'prop-123',
  scheduled_date: '2025-01-15',
  start_time: '10:00',
  booking_type: 'regular',
  status: 'confirmed',
  estimated_duration: 180, // 3 hours
  is_turn: false,
  created_by: auth.user.value?.id || ''
});
```

### Real-time Updates

```typescript
// Subscribe to booking changes
const realtime = useRealtimeSync();
realtime.onBookingChange((payload) => {
  console.log('Booking updated:', payload);
  // Update local state
});
```

---

## 🔧 Environment Configuration

### Required Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Configuration
VITE_APP_NAME="Property Cleaning Scheduler"
VITE_APP_VERSION=0.89.0

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_REALTIME=true
VITE_ENABLE_NOTIFICATIONS=true
```

---

## 📚 Additional Resources

- **[Component Examples](references/complete_component_examples.md)** - Complete component implementations
- **[Business Logic Reference](references/business_logic_reference.md)** - Core business rules
- **[Error Handling Guide](references/error_handling_reference.md)** - Error management patterns
- **[Performance Guide](references/performance_optimization_reference.md)** - Performance optimization
- **[Testing Guide](testing-procedures.md)** - Testing strategies and examples

---

**API Version**: 1.0  
**Last Updated**: January 2025  
**Framework**: Vue 3 + TypeScript + Supabase