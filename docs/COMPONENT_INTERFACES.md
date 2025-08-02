# Component Interface Specifications

## Overview

This document defines standardized interfaces for all components in the Property Cleaning Scheduler, ensuring consistency, type safety, and optimal performance across the role-based architecture.

## 1. Component Architecture Standards

### Role-Based Component Hierarchy

```
Components Classification:
├── Smart Components (Data-Aware)
│   ├── Admin Components (/admin/)
│   ├── Owner Components (/owner/)  
│   └── Shared Components (/shared/)
└── UI Components (Pure Presentation)
    ├── Form Components (/forms/)
    ├── Layout Components (/layouts/)
    └── Navigation Components (/navigation/)
```

### Component Naming Conventions

```typescript
// Smart Components (PascalCase with prefix)
AdminDashboard.vue          // Admin-specific component
OwnerProperties.vue         // Owner-specific component  
SharedCalendar.vue          // Cross-role component
UserProfile.vue            // Shared user component

// UI Components (PascalCase with purpose)
FormInput.vue              // Reusable form input
LayoutSidebar.vue          // Layout component
NavigationMenu.vue         // Navigation component
```

## 2. Smart Component Interfaces

### Base Smart Component Interface

```typescript
/**
 * Standard interface for all smart (data-aware) components
 * Ensures consistent prop and emit patterns across role-based components
 */
interface SmartComponentProps {
  // Core data binding
  modelValue?: any
  loading?: boolean
  error?: string | null
  
  // User context (automatically injected)
  userRole?: UserRole
  permissions?: RolePermissions
  userId?: string
  
  // Component configuration
  config?: ComponentConfig
  variant?: ComponentVariant
  disabled?: boolean
  
  // Performance tracking
  enablePerformanceMonitoring?: boolean
  componentName?: string
}

interface SmartComponentEmits {
  // Standard data binding
  'update:modelValue': (value: any) => void
  
  // State management
  'loading': (state: boolean) => void
  'error': (error: Error | string | null) => void
  'success': (message?: string) => void
  
  // User actions
  'action': (action: ComponentAction) => void
  'navigate': (route: string) => void
  
  // Performance events
  'performance-metric': (metric: PerformanceMetric) => void
}

interface ComponentConfig {
  showHeader?: boolean
  allowEdit?: boolean
  enableRealtime?: boolean
  cacheStrategy?: 'aggressive' | 'moderate' | 'minimal'
  performanceProfile?: 'high' | 'standard' | 'minimal'
}

type ComponentVariant = 'default' | 'compact' | 'detailed' | 'minimal'

interface ComponentAction {
  type: string
  payload?: any
  target?: string
  metadata?: Record<string, any>
}
```

### Role-Specific Component Extensions

#### Admin Components
```typescript
interface AdminComponentProps extends SmartComponentProps {
  // Admin-specific permissions
  adminLevel?: 'full' | 'limited'
  canManageUsers?: boolean
  canViewReports?: boolean
  canModifySystem?: boolean
  
  // Admin data scope
  organizationId?: string
  departmentId?: string
  
  // Admin UI preferences
  showAdvancedOptions?: boolean
  enableBulkOperations?: boolean
}

interface AdminComponentEmits extends SmartComponentEmits {
  // Admin-specific actions
  'user-action': (action: UserManagementAction) => void
  'system-change': (change: SystemChangeEvent) => void
  'report-generated': (report: ReportData) => void
  'bulk-operation': (operation: BulkOperation) => void
}

// Example: AdminUsers.vue
interface AdminUsersProps extends AdminComponentProps {
  users?: User[]
  selectedUsers?: string[]
  filterBy?: UserFilter
  sortBy?: UserSortOption
  showInactive?: boolean
}
```

#### Owner Components  
```typescript
interface OwnerComponentProps extends SmartComponentProps {
  // Owner-specific context
  companyName?: string
  propertyCount?: number
  subscriptionTier?: 'basic' | 'premium' | 'enterprise'
  
  // Owner data scope
  properties?: Property[]
  bookings?: Booking[]
  
  // Owner preferences
  defaultView?: 'calendar' | 'list' | 'grid'
  showMetrics?: boolean
}

interface OwnerComponentEmits extends SmartComponentEmits {
  // Owner-specific actions
  'property-action': (action: PropertyAction) => void
  'booking-action': (action: BookingAction) => void
  'report-request': (type: ReportType) => void
}

// Example: OwnerDashboard.vue
interface OwnerDashboardProps extends OwnerComponentProps {
  dateRange?: DateRange
  showUpcoming?: boolean
  metricsType?: 'revenue' | 'occupancy' | 'performance'
}
```

#### Shared Components
```typescript
interface SharedComponentProps extends SmartComponentProps {
  // Cross-role functionality
  accessLevel?: 'read' | 'write' | 'admin'
  
  // Shared data types
  calendarEvents?: CalendarEvent[]
  notifications?: Notification[]
  
  // Common UI preferences
  theme?: 'light' | 'dark' | 'system'
  language?: string
  timezone?: string
}

interface SharedComponentEmits extends SmartComponentEmits {
  // Shared actions
  'calendar-event': (event: CalendarEventAction) => void
  'notification-action': (action: NotificationAction) => void
  'preference-change': (preference: UserPreference) => void
}
```

## 3. UI Component Interfaces

### Base UI Component Interface

```typescript
/**
 * Standard interface for pure UI components
 * Focuses on presentation and user interaction without data awareness
 */
interface UIComponentProps {
  // Visual configuration
  variant?: UIVariant
  size?: ComponentSize
  color?: ComponentColor
  disabled?: boolean
  loading?: boolean
  
  // Layout and spacing
  fullWidth?: boolean
  margin?: SpacingValue
  padding?: SpacingValue
  
  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  ariaExpanded?: boolean
  tabIndex?: number
  
  // Theming
  theme?: 'light' | 'dark' | 'system'
  
  // Animation and interaction
  animated?: boolean
  clickable?: boolean
  hoverable?: boolean
  
  // Performance
  lazy?: boolean
  virtualScroll?: boolean
}

interface UIComponentEmits {
  // Standard UI interactions
  'click': (event: MouseEvent) => void
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
  'keydown': (event: KeyboardEvent) => void
  
  // Value changes
  'change': (value: any) => void
  'input': (value: any) => void
  
  // UI state changes
  'expand': (expanded: boolean) => void
  'collapse': (collapsed: boolean) => void
  'toggle': (state: boolean) => void
}

type UIVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type ComponentColor = 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error'
type SpacingValue = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto'
```

### Form Component Interfaces

```typescript
// Form Input Components
interface FormInputProps extends UIComponentProps {
  // Input-specific props
  modelValue?: string | number | boolean
  type?: InputType
  placeholder?: string
  required?: boolean
  readonly?: boolean
  
  // Validation
  rules?: ValidationRule[]
  errorMessage?: string
  valid?: boolean
  
  // Input formatting
  mask?: string
  format?: InputFormat
  
  // Input behavior
  clearable?: boolean
  showPassword?: boolean
  counter?: boolean
  maxLength?: number
}

interface FormInputEmits extends UIComponentEmits {
  'update:modelValue': (value: string | number | boolean) => void
  'validate': (valid: boolean, message?: string) => void
  'clear': () => void
}

type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
type InputFormat = 'currency' | 'percentage' | 'date' | 'time' | 'datetime'

interface ValidationRule {
  test: (value: any) => boolean | string
  message?: string
}
```

### Layout Component Interfaces

```typescript
// Layout Container Components
interface LayoutContainerProps extends UIComponentProps {
  // Container behavior
  fluid?: boolean
  centered?: boolean
  scrollable?: boolean
  
  // Grid system
  cols?: number | GridBreakpoints
  gap?: SpacingValue
  alignItems?: AlignValue
  justifyContent?: JustifyValue
  
  // Responsive behavior
  breakpoints?: GridBreakpoints
  responsive?: boolean
}

interface GridBreakpoints {
  xs?: number
  sm?: number  
  md?: number
  lg?: number
  xl?: number
}

type AlignValue = 'start' | 'center' | 'end' | 'stretch'
type JustifyValue = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
```

### Navigation Component Interfaces

```typescript
// Navigation Components
interface NavigationProps extends UIComponentProps {
  // Navigation structure
  items?: NavigationItem[]
  activeItem?: string
  
  // Navigation behavior
  mode?: 'horizontal' | 'vertical'
  collapsible?: boolean
  persistent?: boolean
  
  // Role-based navigation
  filterByRole?: boolean
  userRole?: UserRole
  permissions?: RolePermissions
}

interface NavigationItem {
  id: string
  label: string
  icon?: string
  route?: string
  action?: () => void
  children?: NavigationItem[]
  requiredRole?: UserRole[]
  requiredPermission?: string
  badge?: string | number
  disabled?: boolean
}

interface NavigationEmits extends UIComponentEmits {
  'item-click': (item: NavigationItem) => void
  'expand': (itemId: string) => void
  'collapse': (itemId: string) => void
}
```

## 4. Performance-Optimized Component Patterns

### Component Performance Integration

```typescript
/**
 * Performance monitoring mixin for components
 * Automatically tracks component lifecycle and performance metrics
 */
export function useComponentPerformance(componentName: string) {
  const performance = usePerformanceMonitor()
  const measurement = performance.measureComponentPerformance(componentName)
  
  // Automatic lifecycle tracking
  onMounted(() => {
    measurement.startMeasurement()
  })
  
  onUnmounted(() => {
    measurement.endMeasurement()
  })
  
  // Subscription tracking
  const trackSubscription = <T>(subscription: T): T => {
    measurement.recordSubscription()
    return subscription
  }
  
  // Memory usage tracking
  const trackMemory = (operation: () => any) => {
    const before = performance.getMemoryUsage?.() || 0
    const result = operation()
    const after = performance.getMemoryUsage?.() || 0
    measurement.recordMemoryUsage(after - before)
    return result
  }
  
  return { trackSubscription, trackMemory }
}

// Usage in components
export default defineComponent({
  name: 'AdminDashboard',
  setup() {
    const { trackSubscription } = useComponentPerformance('AdminDashboard')
    
    // Track reactive subscriptions
    const userStore = trackSubscription(useAuthStore())
    const adminData = trackSubscription(useAdminData())
    
    return { userStore, adminData }
  }
})
```

### Component Lazy Loading Pattern

```typescript
/**
 * Role-based component lazy loading
 * Reduces initial bundle size and improves performance
 */
interface LazyComponentConfig {
  component: () => Promise<any>
  loading?: Component
  error?: Component
  delay?: number
  timeout?: number
  
  // Role-based loading
  requiredRole?: UserRole[]
  fallbackComponent?: Component
}

export function useLazyComponent(config: LazyComponentConfig) {
  const { user } = useAuthStore()
  
  const canLoadComponent = computed(() => {
    if (!config.requiredRole) return true
    return config.requiredRole.includes(user.value?.role)
  })
  
  const component = computed(() => {
    if (!canLoadComponent.value) {
      return config.fallbackComponent || EmptyComponent
    }
    
    return defineAsyncComponent({
      loader: config.component,
      loadingComponent: config.loading,
      errorComponent: config.error,
      delay: config.delay || 200,
      timeout: config.timeout || 3000
    })
  })
  
  return { component, canLoadComponent }
}
```

## 5. Component Testing Interfaces

### Testing Utilities

```typescript
/**
 * Component testing utilities with role-based context
 */
interface ComponentTestContext {
  user: User
  permissions: RolePermissions
  mockData: TestData
  performance: MockPerformanceMonitor
}

interface ComponentTestOptions {
  role: UserRole
  props?: Record<string, any>
  slots?: Record<string, any>
  global?: {
    plugins?: any[]
    mocks?: Record<string, any>
  }
}

export function createComponentTest<T>(
  component: T,
  options: ComponentTestOptions
) {
  const mockUser = createMockUser(options.role)
  const mockAuthStore = createMockAuthStore(mockUser)
  
  return mount(component as any, {
    props: options.props,
    slots: options.slots,
    global: {
      plugins: [createTestingPinia()],
      mocks: {
        $authStore: mockAuthStore,
        ...options.global?.mocks
      },
      ...options.global
    }
  })
}

// Example test usage
describe('AdminDashboard', () => {
  it('should render admin-specific content', () => {
    const wrapper = createComponentTest(AdminDashboard, {
      role: 'admin',
      props: { showAdvancedOptions: true }
    })
    
    expect(wrapper.find('[data-testid="admin-controls"]').exists()).toBe(true)
  })
  
  it('should track performance metrics', () => {
    const wrapper = createComponentTest(AdminDashboard, { 
      role: 'admin' 
    })
    
    // Performance tracking assertions
    expect(mockPerformanceMonitor.measureComponentPerformance)
      .toHaveBeenCalledWith('AdminDashboard')
  })
})
```

## 6. Component Documentation Standards

### Component Documentation Template

```typescript
/**
 * @component ComponentName
 * @description Brief description of component purpose and functionality
 * 
 * @example
 * <ComponentName
 *   :model-value="value"
 *   :loading="loading"
 *   @update:model-value="handleUpdate"
 * />
 * 
 * @props {ComponentProps} - See interface definition
 * @emits {ComponentEmits} - See interface definition
 * 
 * @accessibility
 * - Supports ARIA labels and descriptions
 * - Keyboard navigation compliant
 * - Screen reader compatible
 * 
 * @performance
 * - Tracks component render time
 * - Monitors subscription count
 * - Measures memory usage
 * 
 * @roles Supported user roles
 * @permissions Required permissions
 */
```

### Props Documentation Pattern

```typescript
interface ComponentProps {
  /**
   * The current value of the component
   * @default undefined
   * @example "John Doe"
   */
  modelValue?: string
  
  /**
   * Loading state indicator
   * @default false
   * @reactive true
   */
  loading?: boolean
  
  /**
   * User role for access control
   * @required-for role-based components
   * @type {'owner' | 'admin' | 'cleaner'}
   */
  userRole?: UserRole
  
  /**
   * Component configuration object
   * @default { showHeader: true, allowEdit: false }
   * @see ComponentConfig
   */
  config?: ComponentConfig
}
```

## 7. Implementation Guidelines

### Component Creation Checklist

#### For Smart Components:
- [ ] Extends appropriate role-based interface (Admin/Owner/Shared)
- [ ] Implements performance monitoring integration
- [ ] Includes proper TypeScript typing
- [ ] Handles loading and error states
- [ ] Implements accessibility standards
- [ ] Includes comprehensive tests
- [ ] Documents props, emits, and usage examples

#### For UI Components:
- [ ] Extends base UI component interface
- [ ] Implements theme support
- [ ] Includes size and variant options
- [ ] Handles disabled and loading states
- [ ] Supports accessibility attributes
- [ ] Includes visual regression tests
- [ ] Documents styling and customization options

### Performance Optimization Guidelines

1. **Subscription Management**: Use `trackSubscription()` for all reactive dependencies
2. **Memory Monitoring**: Implement memory usage tracking for data-heavy components  
3. **Lazy Loading**: Use role-based lazy loading for admin/owner-specific components
4. **Caching**: Implement appropriate caching strategies based on component type
5. **Bundle Splitting**: Separate admin, owner, and shared component bundles

### Accessibility Requirements

1. **ARIA Support**: All interactive components must support ARIA attributes
2. **Keyboard Navigation**: Components must be keyboard accessible
3. **Screen Reader**: Components must provide meaningful screen reader content
4. **Focus Management**: Proper focus handling for complex interactions
5. **Color Contrast**: All visual elements must meet WCAG contrast requirements

This interface specification ensures consistent, performant, and accessible component development across the entire role-based architecture.