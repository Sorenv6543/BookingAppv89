# BookingApp v89 – Copilot Instructions

> Multi-tenant property cleaning scheduler with role-based Owner/Admin UI, Supabase backend, and Vue 3 + TypeScript frontend.

## Commands

```bash
# Development
pnpm dev                    # Start dev server

# Testing
pnpm test                   # Run tests in watch mode
pnpm test:run               # Run tests once
pnpm test -- path/to/file   # Run single test file
pnpm test:coverage          # Run with coverage
pnpm test:performance       # Performance regression tests

# Building
pnpm build                  # Full production build (runs vue-tsc --noEmit first)
pnpm build:fast             # Skip type checking for quick iteration
pnpm build:owner-only       # Owner-only bundle (~200KB)
pnpm build:admin-only       # Admin-only bundle (~300KB)

# Linting & Analysis
pnpm lint                   # ESLint with auto-fix
pnpm analyze:bundle         # Bundle size analysis
```

## Architecture

### Smart vs Dumb Components
- **Smart components** (`src/components/smart/`): Data-aware, depend on stores/composables, pass props/events to dumb components
- **Dumb components** (`src/components/dumb/`): Pure UI, receive props and emit events only

### Role Separation
Owner and Admin have separate component trees under role-specific subfolders:
- `src/components/smart/admin/` and `src/pages/admin/` - Admin interface
- `src/components/smart/owner/` and `src/pages/owner/` - Owner interface
- `src/components/smart/shared/` - Cross-role components

### State Management
- Domain stores in `src/stores/` use `Map` collections and cached computed maps
- Prefer derived computeds over cloning arrays
- Reference pattern: `src/stores/booking.ts`

```typescript
// Map access always returns T | undefined - add null checks
const booking = bookingMap.get(id)  // Booking | undefined
if (!booking) return

// Computed from Map values
const list = computed(() => [...bookingMap.values()])
```

### Composables
Reuse existing composables before adding new Supabase calls:
- `src/composables/admin/` - Admin-specific data access
- `src/composables/owner/` - Owner-specific data access
- `src/composables/shared/` - Cross-cutting concerns
- `src/composables/supabase/` - Supabase integration

### Key Utilities
- `src/utils/businessLogic.ts` - Booking/cleaning rules, priority calculation, conflict detection
- `src/utils/timeDefaults.ts` - Time defaults and Vuetify validation helpers
- `src/utils/authHelpers.ts` - Auth helpers including `getDefaultRouteForRole`

## Domain Rules

### Booking Model
- Guest-stay model: `checkout_date` must be strictly after `checkin_date`
- `booking_type === 'turn'`: Same-day short stays validated via `validateTurnBooking`
- Priority: Use `calculateBookingPriority` - turn bookings are always at least `high`
- Conflicts: Use `detectBookingConflicts` and `validateBooking` instead of ad-hoc date math

### Time Validation
Use helpers from `src/utils/timeDefaults.ts`:
- `getDefaultTimes`, `getTimeValidationRules`, `getCheckoutTimeValidationRules`, `getTimeHint`
- Don't hard-code time strings or validation rules in components

## Auth & Routing

### Auth Source of Truth
- `useAuthStore` in `src/stores/auth.ts` delegates to `useSupabaseAuth` outside test mode
- Derive auth state via store computeds: `isAuthenticated`, `isOwner`, `isAdmin`, `user`, `session`
- Don't create separate refs for auth in components

### Route Protection
- Guards in `src/router/guards.ts` and `src/router/index.ts`
- Use `meta.requiresAuth` / `meta.role` on routes
- `getDefaultRouteForRole` handles post-login redirects

## Supabase Integration

- Client configured in `src/plugins/supabase.ts`
- Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`
- Schema and RLS policies in `supabase/migrations/`
- New queries/mutations go in role-aware composables under `src/composables/`
- Keep `src/types/` in sync with Supabase migrations
- Supabase returns snake_case rows matching app types; cast with `as Booking` when needed

## Vuetify 3 Patterns

### Component Defaults (configured in `src/plugins/vuetify.ts`)
These defaults are set globally - don't override unless necessary:
- `VBtn`: `variant="flat"`, `rounded`, no uppercase
- `VCard`: `elevation="2"`, `rounded="lg"`
- `VTextField/VSelect/VTextarea`: `variant="outlined"`, `density="comfortable"`, `hideDetails="auto"`
- `VDialog`: `max-width="700px"`, `rounded="lg"`

### Form Validation
```vue
<script setup lang="ts">
import type { VForm } from 'vuetify/components'

const formRef = ref<VForm | null>(null)
const formValid = ref(false)

const rules = [
  (v: string) => !!v || 'Required',
  (v: string) => v.length >= 3 || 'Min 3 characters'
]

async function submit() {
  const { valid } = await formRef.value!.validate()
  if (!valid) return
  // proceed...
}
</script>
```

### Existing Dumb Components
Check `src/components/dumb/shared/` before creating new UI:
- `ConfirmationDialog.vue`, `LoadingSpinner.vue`, `ErrorAlert.vue`, `SkeletonLoader.vue`, `EnhancedToast.vue`

### Icons
Use MDI icons (`mdi-*`) - common ones: `mdi-plus`, `mdi-pencil`, `mdi-delete`, `mdi-check`, `mdi-calendar`, `mdi-alert`

## TypeScript Patterns

### Vue-Specific
```typescript
// Ref typing
const bookings = ref<Booking[]>([])
const selected = ref<Booking | null>(null)

// Computed with explicit return
const sorted = computed<Booking[]>(() => [...bookings.value].sort(...))

// Props with defaults
withDefaults(defineProps<{ mode?: 'view' | 'edit' }>(), { mode: 'view' })

// Emits typing
const emit = defineEmits<{ update: [booking: Booking]; cancel: [] }>()
```

### Common Type Errors

| Error | Fix |
|-------|-----|
| `Property 'x' does not exist on type 'never'` | Add explicit type: `ref<Booking[]>([])` |
| `Type 'X \| undefined' is not assignable to 'X'` | Add null check or use `!` if guaranteed |
| `Object is possibly 'undefined'` | Guard with `v-if` in template or `?.` in script |

## Performance

- Stores use `Map`-based collections with cached filters
- Track subscriptions with `usePerformanceMonitor` from `src/composables/shared/usePerformanceMonitor.ts`
- Clean up subscriptions on unmount
- Run `pnpm test:performance` after significant data flow changes

## Critical Conventions

### Extend, Don't Refactor
These areas require careful modification - extend existing patterns:
- `src/components/smart/` - Role-based components
- `src/composables/` - Performance-optimized logic
- `src/stores/` - Role-based state management
- `src/router/` - Authentication and role guards

### Business Logic Location
Don't duplicate business rules in components - call helpers from stores/composables:
- Date/time logic → `businessLogic.ts`, `timeDefaults.ts`
- Priority/status → `businessLogic.ts`
- Auth/role checks → `authHelpers.ts`, `useAuthStore`

### Before Finishing Changes
```bash
pnpm test:run && pnpm build  # Minimum for all changes
pnpm test:performance        # Also run for auth/routing/subscription changes
```