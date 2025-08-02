# 🛠️ Property Cleaning Scheduler - Development Guide

## 🎯 Quick Start

**Prerequisites**: Node.js 18+, pnpm, Git  
**Tech Stack**: Vue 3 + TypeScript + Vite + Vuetify + Supabase  
**Development Server**: `http://localhost:3000`

```bash
# Clone and setup
git clone https://github.com/your-org/property-cleaning-scheduler.git
cd property-cleaning-scheduler
pnpm install

# Start development
pnpm run dev
```

---

## 🏗️ Project Architecture

### Role-Based Structure
```
src/
├── components/
│   ├── dumb/               # Pure UI components
│   │   ├── admin/         # Admin-specific UI
│   │   ├── owner/         # Owner-specific UI
│   │   └── shared/        # Reusable components
│   └── smart/             # Business logic components
│       ├── admin/         # Admin orchestration
│       ├── owner/         # Owner orchestration
│       └── shared/        # Cross-role smart components
├── composables/           # Vue 3 composition functions
│   ├── admin/            # Admin business logic
│   ├── owner/            # Owner business logic
│   ├── shared/           # Shared business logic
│   └── supabase/         # Database integration
├── pages/                # Route components
├── stores/               # Pinia state management
├── types/                # TypeScript definitions
└── utils/                # Utility functions
```

### Component Patterns

#### Smart/Dumb Component Separation
```typescript
// Dumb Component (Pure UI)
// src/components/dumb/shared/PropertyCard.vue
<template>
  <v-card>
    <v-card-title>{{ property.name }}</v-card-title>
    <v-card-text>{{ property.address }}</v-card-text>
    <v-card-actions>
      <v-btn @click="$emit('edit', property)">Edit</v-btn>
      <v-btn @click="$emit('delete', property)">Delete</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Property } from '@/types';

interface Props {
  property: Property;
}
defineProps<Props>();

interface Emits {
  edit: [property: Property];
  delete: [property: Property];
}
defineEmits<Emits>();
</script>
```

```typescript
// Smart Component (Business Logic)
// src/components/smart/owner/OwnerProperties.vue
<template>
  <div>
    <PropertyCard
      v-for="property in properties"
      :key="property.id"
      :property="property"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup lang="ts">
import { useOwnerProperties } from '@/composables/owner/useOwnerProperties';
import PropertyCard from '@/components/dumb/shared/PropertyCard.vue';

const { properties, loading, updateProperty, deleteProperty } = useOwnerProperties();

const handleEdit = async (property: Property) => {
  // Business logic for editing
};

const handleDelete = async (property: Property) => {
  await deleteProperty(property.id);
};
</script>
```

---

## 🔧 Development Workflow

### Git Workflow
```bash
# Feature development
git checkout -b feature/new-feature-name
# Make changes
git add .
git commit -m "feat: implement new feature"
git push origin feature/new-feature-name
# Create PR to main branch
```

### Code Quality
```bash
# Linting and formatting
pnpm run lint              # ESLint with auto-fix
pnpm run lint:check        # Check without fixing

# Type checking
vue-tsc --noEmit           # TypeScript validation

# Testing
pnpm run test              # Run test suite
pnpm run test:coverage     # Coverage report
pnpm run test:ui           # Test UI dashboard
```

### Build Commands
```bash
# Development builds
pnpm run dev               # Hot reload dev server
pnpm run build:fast        # Quick build (no type check)

# Production builds
pnpm run build             # Full production build
pnpm run build:owner-only  # Owner interface only
pnpm run build:admin-only  # Admin interface only

# Analysis
pnpm run analyze:bundle    # Bundle size analysis
pnpm run perf:analysis     # Performance metrics
```

---

## 📝 Coding Standards

### TypeScript Guidelines

#### Interface Definitions
```typescript
// Use interfaces for object shapes
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Use type unions for constraints
export type UserRole = 'admin' | 'owner' | 'cleaner';
export type BookingStatus = 'pending' | 'confirmed' | 'completed';

// Use generics for reusable types
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  loading: boolean;
}
```

#### Vue 3 Composition API
```typescript
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

// Props with TypeScript
interface Props {
  initialValue?: string;
  required?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  initialValue: '',
  required: false
});

// Emits with TypeScript
interface Emits {
  update: [value: string];
  change: [event: Event];
}
const emit = defineEmits<Emits>();

// Reactive state
const value = ref(props.initialValue);
const isValid = computed(() => value.value.length > 0);

// Lifecycle
onMounted(() => {
  console.log('Component mounted');
});

// Methods
const handleChange = (newValue: string) => {
  value.value = newValue;
  emit('update', newValue);
};
</script>
```

#### Composable Functions
```typescript
// src/composables/shared/useApiCall.ts
import { ref, type Ref } from 'vue';

export function useApiCall<T>() {
  const data: Ref<T | null> = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const execute = async (apiCall: () => Promise<T>): Promise<boolean> => {
    try {
      loading.value = true;
      error.value = null;
      data.value = await apiCall();
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
      return false;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    data.value = null;
    error.value = null;
    loading.value = false;
  };

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}
```

### Naming Conventions

```typescript
// Files: kebab-case
user-management.vue
use-admin-bookings.ts
property-modal.vue

// Components: PascalCase
<PropertyCard />
<AdminDashboard />
<OwnerBookingForm />

// Variables/Functions: camelCase
const userName = 'John';
const fetchUserData = () => {};

// Constants: SCREAMING_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// Types/Interfaces: PascalCase
interface UserProfile {}
type BookingStatus = 'pending' | 'confirmed';
```

---

## 🎨 UI Development

### Vuetify 3 Usage

#### Component Structure
```vue
<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>{{ title }}</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-text-field
                v-model="name"
                :rules="nameRules"
                label="Name"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
```

#### Theme Configuration
```typescript
// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1976d2',
          secondary: '#424242',
          accent: '#82b1ff',
          error: '#ff5252',
          info: '#2196f3',
          success: '#4caf50',
          warning: '#ffc107'
        }
      }
    }
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi }
  }
});
```

### Responsive Design
```scss
// src/styles/responsive.scss
@use 'vuetify/settings' as v;

// Mobile first approach
.responsive-container {
  padding: 16px;
  
  @media #{map-get(v.$display-breakpoints, 'sm-and-up')} {
    padding: 24px;
  }
  
  @media #{map-get(v.$display-breakpoints, 'md-and-up')} {
    padding: 32px;
  }
}

// Vuetify breakpoint helpers
.hidden-sm-and-down {
  @media #{map-get(v.$display-breakpoints, 'sm-and-down')} {
    display: none !important;
  }
}
```

---

## 🗄️ Data Management

### Pinia Store Structure
```typescript
// src/stores/booking.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Booking, BookingStatus } from '@/types';

export const useBookingStore = defineStore('booking', () => {
  // State
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const upcomingBookings = computed(() =>
    bookings.value.filter(b => new Date(b.scheduled_date) > new Date())
  );
  
  const bookingsByStatus = computed(() => (status: BookingStatus) =>
    bookings.value.filter(b => b.status === status)
  );

  // Actions
  const fetchBookings = async () => {
    try {
      loading.value = true;
      // API call logic
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error';
    } finally {
      loading.value = false;
    }
  };

  const addBooking = (booking: Booking) => {
    bookings.value.push(booking);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const index = bookings.value.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings.value[index] = { ...bookings.value[index], ...updates };
    }
  };

  const removeBooking = (id: string) => {
    const index = bookings.value.findIndex(b => b.id === id);
    if (index !== -1) {
      bookings.value.splice(index, 1);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    bookings,
    loading,
    error,
    
    // Getters
    upcomingBookings,
    bookingsByStatus,
    
    // Actions
    fetchBookings,
    addBooking,
    updateBooking,
    removeBooking,
    clearError
  };
});
```

### Supabase Integration
```typescript
// src/composables/supabase/useSupabaseBookings.ts
import { ref } from 'vue';
import { supabase } from '@/plugins/supabase';
import type { Booking } from '@/types';

export function useSupabaseBookings() {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchBookings = async () => {
    try {
      loading.value = true;
      const { data, error: fetchError } = await supabase
        .from('bookings')
        .select(`
          *,
          property:properties(*),
          cleaner:user_profiles(*)
        `)
        .order('scheduled_date', { ascending: true });

      if (fetchError) throw fetchError;
      bookings.value = data || [];
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch bookings';
    } finally {
      loading.value = false;
    }
  };

  const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      loading.value = true;
      const { data, error: createError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (createError) throw createError;
      if (data) bookings.value.push(data);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create booking';
      return false;
    } finally {
      loading.value = false;
    }
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    createBooking
  };
}
```

---

## 🧪 Testing Strategy

### Unit Testing with Vitest
```typescript
// src/__tests__/composables/useBookings.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useBookings } from '@/composables/shared/useBookings';

// Mock Supabase
vi.mock('@/plugins/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          data: [],
          error: null
        }))
      }))
    }))
  }
}));

describe('useBookings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty state', () => {
    const { bookings, loading, error } = useBookings();
    
    expect(bookings.value).toEqual([]);
    expect(loading.value).toBe(false);
    expect(error.value).toBe(null);
  });

  it('should fetch bookings successfully', async () => {
    const { fetchBookings, bookings, loading } = useBookings();
    
    await fetchBookings();
    
    expect(loading.value).toBe(false);
    expect(bookings.value).toEqual([]);
  });
});
```

### Component Testing
```typescript
// src/__tests__/components/PropertyCard.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createVuetify } from 'vuetify';
import PropertyCard from '@/components/dumb/shared/PropertyCard.vue';
import type { Property } from '@/types';

const vuetify = createVuetify();

const mockProperty: Property = {
  id: '1',
  name: 'Test Property',
  address: '123 Test St',
  city: 'Test City',
  state: 'TS',
  zip_code: '12345',
  property_type: 'apartment',
  status: 'active',
  owner_id: 'owner-1',
  created_at: '2025-01-01',
  updated_at: '2025-01-01'
};

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    const wrapper = mount(PropertyCard, {
      props: { property: mockProperty },
      global: { plugins: [vuetify] }
    });

    expect(wrapper.text()).toContain('Test Property');
    expect(wrapper.text()).toContain('123 Test St');
  });

  it('emits edit event when edit button is clicked', async () => {
    const wrapper = mount(PropertyCard, {
      props: { property: mockProperty },
      global: { plugins: [vuetify] }
    });

    await wrapper.find('[data-test="edit-button"]').trigger('click');
    
    expect(wrapper.emitted('edit')).toBeTruthy();
    expect(wrapper.emitted('edit')?.[0]).toEqual([mockProperty]);
  });
});
```

### E2E Testing with Playwright
```typescript
// e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow user to sign in', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('[data-test="email-input"]', 'test@example.com');
    await page.fill('[data-test="password-input"]', 'password123');
    await page.click('[data-test="sign-in-button"]');
    
    await expect(page).toHaveURL('/owner/dashboard');
    await expect(page.locator('[data-test="user-menu"]')).toBeVisible();
  });
  
  test('should display error for invalid credentials', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.fill('[data-test="email-input"]', 'invalid@example.com');
    await page.fill('[data-test="password-input"]', 'wrongpassword');
    await page.click('[data-test="sign-in-button"]');
    
    await expect(page.locator('[data-test="error-message"]')).toBeVisible();
    await expect(page.locator('[data-test="error-message"]')).toContainText('Invalid credentials');
  });
});
```

---

## 🔧 Environment Configuration

### Development Environment
```bash
# .env.development
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your_local_key
VITE_APP_ENV=development
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MOCK_DATA=true
```

### Production Environment
```bash
# .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_key
VITE_APP_ENV=production
VITE_ENABLE_DEVTOOLS=false
VITE_ENABLE_MOCK_DATA=false
```

### Environment Type Safety
```typescript
// src/types/env.d.ts
interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_APP_ENV: 'development' | 'production' | 'test';
  readonly VITE_ENABLE_DEVTOOLS: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

---

## 🚀 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
pnpm run analyze:bundle

# Performance metrics
pnpm run perf:analysis
```

### Code Splitting
```typescript
// Lazy load components
const AdminDashboard = defineAsyncComponent(() => import('@/components/smart/admin/AdminDashboard.vue'));

// Route-based splitting
const routes = [
  {
    path: '/admin',
    component: () => import('@/layouts/admin.vue'),
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/admin/dashboard.vue')
      }
    ]
  }
];
```

### Performance Monitoring
```typescript
// src/utils/performance.ts
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Usage
measurePerformance('Component Render', () => {
  // Component rendering logic
});
```

---

## 🛡️ Security Best Practices

### Authentication Guards
```typescript
// src/router/guards.ts
export const authGuard = async (to: RouteLocationNormalized) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/auth/login';
  }
  
  if (to.meta.role && authStore.user?.role !== to.meta.role) {
    return '/unauthorized';
  }
};
```

### Input Sanitization
```typescript
// src/utils/sanitize.ts
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim()
    .slice(0, 1000); // Limit length
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
```

### Content Security Policy
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://your-project.supabase.co">
```

---

## 🐛 Debugging

### Vue DevTools
```typescript
// Enable in development
if (import.meta.env.DEV) {
  app.config.globalProperties.$log = console.log;
}
```

### Error Tracking
```typescript
// src/utils/errorTracking.ts
export const trackError = (error: Error, context: string) => {
  console.error(`[${context}]`, error);
  
  // Send to error tracking service in production
  if (import.meta.env.PROD) {
    // Sentry, LogRocket, etc.
  }
};
```

### Debug Utilities
```typescript
// src/utils/debug.ts
export const debugLog = (message: string, data?: any) => {
  if (import.meta.env.DEV) {
    console.log(`[DEBUG] ${message}`, data);
  }
};

export const performanceLog = (operation: string, duration: number) => {
  if (import.meta.env.DEV && duration > 100) {
    console.warn(`[PERFORMANCE] ${operation} took ${duration}ms`);
  }
};
```

---

## 📚 Additional Resources

- **[API Reference](API_REFERENCE.md)** - Complete API documentation
- **[Component Examples](references/complete_component_examples.md)** - Implementation examples
- **[Business Logic Reference](references/business_logic_reference.md)** - Core business rules
- **[Deployment Guide](deployment-guide.md)** - Production deployment
- **[Testing Procedures](testing-procedures.md)** - Testing strategies

---

**Development Guide Version**: 2.0  
**Last Updated**: January 2025  
**Framework**: Vue 3 + TypeScript + Vite + Vuetify + Supabase