# Property Cleaning Scheduler - Architecture Patterns

## Role-Based Architecture Pattern

### Core Principle
The application implements a strict role-based architecture where all components, routes, and data access are filtered by user roles (Owner, Admin, Cleaner).

### Component Separation Pattern
```
Components Architecture:
├── smart/              # Data-aware components
│   ├── admin/         # Admin-only components (full data access)
│   ├── owner/         # Owner-only components (filtered data)
│   └── shared/        # Cross-role components (role-aware)
└── dumb/              # Pure UI components (props-driven)
    ├── admin/         # Admin-specific UI
    ├── owner/         # Owner-specific UI
    └── shared/        # Reusable UI components
```

### Smart Component Pattern
```typescript
// Required interface for all smart components
interface SmartComponentProps {
  // Automatic role context injection
  userRole?: UserRole
  permissions?: RolePermissions
  userId?: string
  
  // Performance monitoring requirement
  enablePerformanceMonitoring?: boolean
  componentName?: string
  
  // Standard component props
  modelValue?: any
  loading?: boolean
  error?: string | null
}

// Implementation pattern
export default defineComponent({
  name: 'ComponentName', // Required for performance tracking
  props: smartComponentProps,
  setup(props) {
    // Performance monitoring (required)
    const { trackSubscription } = useComponentPerformance(props.componentName)
    
    // Role-based data filtering (automatic)
    const filteredData = trackSubscription(
      computed(() => rawData.value.filter(item => 
        props.userRole === 'owner' 
          ? item.owner_id === props.userId
          : true // Admin sees all
      ))
    )
    
    return { filteredData }
  }
})
```

## State Management Pattern

### Pinia Store Architecture
```typescript
// Store pattern with role-based filtering
export const useDataStore = defineStore('data', () => {
  const { user } = useAuthStore()
  
  // Raw data (unfiltered)
  const allData = ref([])
  
  // Role-filtered computed properties
  const userData = computed(() => {
    if (user.value?.role === 'admin') return allData.value
    return allData.value.filter(item => item.owner_id === user.value?.id)
  })
  
  // Actions with role validation
  const createItem = async (data) => {
    // Role-based validation
    if (user.value?.role === 'owner') {
      data.owner_id = user.value.id // Enforce ownership
    }
    // Create item
  }
  
  return { userData, createItem }
})
```

### Supabase Integration Pattern
```typescript
// Composable pattern for Supabase integration
export function useSupabaseData<T>(tableName: string) {
  const { user } = useSupabaseAuth()
  const state = reactive({
    data: [] as T[],
    loading: false,
    error: null
  })
  
  // Role-based query building
  const buildQuery = () => {
    let query = supabase.from(tableName).select('*')
    
    // Automatic RLS (Row Level Security) policy application
    if (user.value?.role === 'owner') {
      query = query.eq('owner_id', user.value.id)
    }
    // Admin gets all data (RLS policies handle this)
    
    return query
  }
  
  const fetchData = async () => {
    state.loading = true
    try {
      const { data, error } = await buildQuery()
      if (error) throw error
      state.data = data || []
    } catch (err) {
      state.error = err
    } finally {
      state.loading = false
    }
  }
  
  return { ...toRefs(state), fetchData }
}
```

## Performance Optimization Pattern

### Subscription Tracking
```typescript
// Performance monitoring composable (required in all smart components)
export function useComponentPerformance(componentName: string) {
  const subscriptionCount = ref(0)
  const memoryUsage = ref(0)
  
  const trackSubscription = <T>(subscription: T): T => {
    subscriptionCount.value++
    
    // Warn if exceeding performance budget
    if (subscriptionCount.value > 40) {
      console.warn(`Component ${componentName} exceeds subscription limit: ${subscriptionCount.value}`)
    }
    
    return subscription
  }
  
  // Automatic lifecycle tracking
  onMounted(() => {
    console.log(`[${componentName}] Component mounted`)
  })
  
  onUnmounted(() => {
    console.log(`[${componentName}] Subscriptions: ${subscriptionCount.value}`)
  })
  
  return { trackSubscription }
}
```

### Bundle Splitting Pattern
```typescript
// Vite configuration for role-based code splitting
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Role-based chunking
          if (id.includes('/owner/') || id.includes('\\owner\\')) {
            return 'owner-app' // ~200KB bundle
          }
          if (id.includes('/admin/') || id.includes('\\admin\\')) {
            return 'admin-app' // ~300KB bundle
          }
          
          // Core application code
          if (id.includes('/stores/') || id.includes('/composables/shared/')) {
            return 'app-core'
          }
          
          // Third-party dependencies
          if (id.includes('node_modules')) {
            if (id.includes('vue')) return 'vue-core'
            if (id.includes('vuetify')) return 'vuetify'
            if (id.includes('@fullcalendar')) return 'calendar'
            return 'vendor'
          }
          
          return 'app'
        }
      }
    }
  }
})
```

## Route Protection Pattern

### Route Guard Implementation
```typescript
// Route guard with role-based protection
export const requireAuth = (to: RouteLocationNormalized) => {
  const { isAuthenticated, user } = useAuthStore()
  
  if (!isAuthenticated.value) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  return true
}

export const requireRole = (allowedRoles: UserRole[]) => {
  return (to: RouteLocationNormalized) => {
    const { user } = useAuthStore()
    
    if (!allowedRoles.includes(user.value?.role)) {
      // Redirect based on user's actual role
      const defaultRoute = user.value?.role === 'admin' 
        ? '/admin/dashboard' 
        : '/owner/dashboard'
      return { path: defaultRoute }
    }
    
    return true
  }
}

// Route configuration with guards
const routes = [
  {
    path: '/owner',
    component: OwnerLayout,
    beforeEnter: [requireAuth, requireRole(['owner'])],
    children: [
      { path: 'dashboard', component: OwnerDashboard },
      { path: 'properties', component: OwnerProperties }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    beforeEnter: [requireAuth, requireRole(['admin'])],
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: AdminUsers }
    ]
  }
]
```

## Error Handling Pattern

### Standardized Error Management
```typescript
// Global error handling composable
export function useErrorHandler() {
  const errors = ref<ErrorState[]>([])
  
  const handleError = (error: Error | string, context?: string) => {
    const errorState: ErrorState = {
      message: typeof error === 'string' ? error : error.message,
      code: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
      context,
      timestamp: new Date().toISOString()
    }
    
    errors.value.push(errorState)
    
    // Log with context
    console.error(`[${context || 'Global'}]`, errorState)
    
    // Remove error after timeout
    setTimeout(() => {
      const index = errors.value.findIndex(e => e.timestamp === errorState.timestamp)
      if (index > -1) errors.value.splice(index, 1)
    }, 5000)
  }
  
  return { errors: readonly(errors), handleError }
}
```

## Testing Pattern

### Role-Based Testing Strategy
```typescript
// Test utilities for role-based components
export const createOwnerTestWrapper = (component: Component, props = {}) => {
  const mockOwnerUser = {
    id: 'owner-1',
    role: 'owner',
    email: 'owner@test.com'
  }
  
  return mount(component, {
    props: {
      userRole: 'owner',
      userId: mockOwnerUser.id,
      permissions: getOwnerPermissions(),
      ...props
    },
    global: {
      plugins: [createTestPinia()],
      mocks: {
        $auth: { user: mockOwnerUser }
      }
    }
  })
}

export const createAdminTestWrapper = (component: Component, props = {}) => {
  const mockAdminUser = {
    id: 'admin-1', 
    role: 'admin',
    email: 'admin@test.com'
  }
  
  return mount(component, {
    props: {
      userRole: 'admin',
      userId: mockAdminUser.id,
      permissions: getAdminPermissions(),
      ...props
    },
    global: {
      plugins: [createTestPinia()],
      mocks: {
        $auth: { user: mockAdminUser }
      }
    }
  })
}

// Role-based test pattern
describe('PropertyList Component', () => {
  describe('when user is owner', () => {
    it('should show only owned properties', async () => {
      const wrapper = createOwnerTestWrapper(PropertyList)
      // Test owner-specific behavior
    })
  })
  
  describe('when user is admin', () => {
    it('should show all properties', async () => {
      const wrapper = createAdminTestWrapper(PropertyList)
      // Test admin-specific behavior
    })
  })
})
```

## PWA & Service Worker Pattern

### Workbox Configuration Pattern
```typescript
// PWA configuration with role-based caching
VitePWA({
  workbox: {
    runtimeCaching: [
      {
        // Cache role-based chunks differently
        urlPattern: ({ url }) => {
          const roleChunks = ['admin-app', 'owner-app', 'shared-logic']
          return roleChunks.some(chunk => url.pathname.includes(chunk))
        },
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'role-based-chunks',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          }
        }
      },
      {
        // API caching with role consideration
        urlPattern: ({ url }) => url.pathname.startsWith('/api'),
        handler: 'NetworkFirst',
        options: {
          cacheName: 'api-cache',
          networkTimeoutSeconds: 3,
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 24 * 60 * 60 // 24 hours
          }
        }
      }
    ]
  }
})
```

## Design Patterns Summary

1. **Role-Based Architecture**: All components filter data by user role
2. **Smart/Dumb Separation**: Business logic separated from UI
3. **Performance-First**: Subscription tracking and memory management
4. **Type Safety**: Strict TypeScript with comprehensive type definitions
5. **Error Boundaries**: Standardized error handling across components
6. **Test-Driven**: Role-based testing utilities and patterns
7. **Progressive Enhancement**: PWA features with offline capability
8. **Security-First**: Route protection and data access control