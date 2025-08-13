# Property Cleaning Scheduler - Code Style & Conventions

## TypeScript Configuration

### Strict Mode Settings
- **Strict Mode**: Enabled (`strict: true`)
- **No Unused Locals**: Enabled (`noUnusedLocals: true`)
- **No Unused Parameters**: Enabled (`noUnusedParameters: true`)
- **No Fallthrough Cases**: Enabled (`noFallthroughCasesInSwitch: true`)
- **Target**: ES2020
- **Module**: ESNext with bundler resolution

### Type Definitions
- All interfaces defined in `src/types/` directory
- Domain-specific type files: `booking.ts`, `property.ts`, `user.ts`, etc.
- Export types through `src/types/index.ts`
- Use strict typing with no `any` types allowed

## Vue 3 Conventions

### Component Structure
- **Smart Components**: Handle data and business logic
  - Located in `src/components/smart/`
  - Use Composition API exclusively
  - Implement performance monitoring
  - Include role-based data filtering

- **Dumb Components**: Pure UI components
  - Located in `src/components/dumb/`
  - Props-driven with no direct state management
  - Emit events for parent communication
  - Reusable across different contexts

### Composition API Patterns
```typescript
// Preferred composable structure
export function useFeatureName() {
  // Reactive state
  const state = reactive({
    loading: false,
    error: null,
    data: []
  })
  
  // Computed properties
  const computedValue = computed(() => {
    return state.data.filter(item => item.active)
  })
  
  // Methods
  const fetchData = async () => {
    // Implementation
  }
  
  // Return reactive references
  return {
    ...toRefs(state),
    computedValue,
    fetchData
  }
}
```

### Component Naming
- **Pascal Case**: Component files (`HomeOwner.vue`, `PropertyCard.vue`)
- **Kebab Case**: HTML usage (`<property-card />`)
- **Role Prefixes**: Use role prefixes for role-specific components
  - `Owner*` for owner components (`OwnerDashboard.vue`)
  - `Admin*` for admin components (`AdminUsers.vue`)

## File Organization

### Path Aliases (configured in tsconfig.json and vite.config.ts)
```typescript
"@/*": ["./src/*"]
"@components/*": ["./src/components/*"]
"@composables/*": ["./src/composables/*"]
"@stores/*": ["./src/stores/*"]
"@types/*": ["./src/types/*"]
"@utils/*": ["./src/utils/*"]
"@layouts/*": ["./src/layouts/*"]
"@pages/*": ["./src/pages/*"]
"@plugins/*": ["./src/plugins/*"]
"@assets/*": ["./src/assets/*"]
```

### Import Organization
```typescript
// 1. Vue and core framework imports
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Third-party library imports
import { useDisplay } from 'vuetify'

// 3. Internal type imports
import type { Booking, Property } from '@types'

// 4. Internal component/composable imports
import { useAuthStore } from '@stores/auth'
import PropertyCard from '@components/shared/PropertyCard.vue'
```

## ESLint Configuration

### Enabled Rules
- **ESLint Recommended**: Base ESLint rules
- **TypeScript Recommended**: TypeScript-specific linting
- **Vue 3 Recommended**: Vue 3 specific rules

### Code Style
- **Indentation**: 2 spaces (enforced by ESLint)
- **Semicolons**: Used consistently
- **Quotes**: Single quotes preferred
- **Trailing Commas**: Allowed and encouraged

## Role-Based Architecture Patterns

### Smart Component Interface
```typescript
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
```

### Data Filtering Convention
- All data access filtered by user role automatically
- Owners see only their own data (`owner_id` filtering)
- Admins see all data (no filtering applied)
- Use reactive computed properties for filtered data

## Performance Conventions

### Component Performance Monitoring
```typescript
// Required in all smart components
export default defineComponent({
  name: 'ComponentName', // Required for performance tracking
  setup() {
    const { trackSubscription } = useComponentPerformance('ComponentName')
    
    // Track all reactive subscriptions
    const filteredData = trackSubscription(
      computed(() => data.value.filter(item => condition))
    )
    
    return { filteredData }
  }
})
```

### Subscription Limits
- **Maximum Subscriptions**: 40 per component
- **Memory Limit**: 100MB per component
- **Performance Budget**: 16ms render time (60fps)

## Testing Conventions

### Test File Structure
- **Unit Tests**: `*.spec.ts` files in `src/__tests__/`
- **Component Tests**: Mirror source structure in test directories
- **Mock Setup**: Centralized in `src/__tests__/setup/`

### Test Naming
```typescript
describe('ComponentName', () => {
  describe('when user is owner', () => {
    it('should filter data by owner ID', () => {
      // Test implementation
    })
  })
  
  describe('when user is admin', () => {
    it('should show all data', () => {
      // Test implementation
    })
  })
})
```

## SCSS/CSS Conventions

### File Organization
- **Global Styles**: `src/assets/main.css`
- **SCSS Variables**: `src/styles/variables.scss`
- **Responsive**: `src/styles/responsive.scss`

### Vuetify Integration
- Auto-import enabled for Vuetify components
- Custom theme configuration in `src/plugins/vuetify.ts`
- Material Design principles followed

## Error Handling Conventions

### Standardized Error Structure
```typescript
interface ErrorState {
  message: string
  code?: string
  details?: unknown
  timestamp: string
}
```

### Error Handling Pattern
```typescript
// In composables
const handleError = (error: Error) => {
  console.error(`[${composableName}]`, error)
  // Set reactive error state
  state.error = {
    message: error.message,
    timestamp: new Date().toISOString()
  }
}
```

## Git Conventions

### Branch Naming
- `feature/task-description`
- `bugfix/issue-description`
- `hotfix/critical-issue`

### Commit Messages
- Use conventional commit format
- Include task/issue references where applicable
- Keep first line under 50 characters