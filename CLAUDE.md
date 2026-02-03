# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Multi-tenant property cleaning scheduler with role-based Owner/Admin UI. Core product: guest-stay booking plus cleaning operations. Tech stack: Vue 3 + Vite + Vuetify, Pinia for state, Supabase for auth/Postgres/RLS/realtime.

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
pnpm build:owner-only       # Owner-only bundle
pnpm build:admin-only       # Admin-only bundle

# Linting
pnpm lint                   # ESLint with auto-fix

# Analysis
pnpm analyze:bundle         # Bundle size analysis
pnpm perf:analysis          # Performance analysis
```

## Architecture

### Smart vs Dumb Components
- **Smart components** (`src/components/smart/`): Data-aware, orchestration logic, depend on stores/composables
- **Dumb components** (`src/components/dumb/`): Pure UI, receive props and emit events only

### Role Separation
Owner and Admin have separate component trees:
- `src/components/smart/admin/` - Admin-only components
- `src/components/smart/owner/` - Owner-only components
- `src/components/smart/shared/` - Cross-role components
- `src/pages/` - Role-specific pages follow same structure

### State Management
- Domain stores in `src/stores/` use `Map` collections and cached computed maps for performance
- Prefer derived computeds over cloning arrays
- Example: `src/stores/booking.ts` for booking state patterns

### Composables Organization
- `src/composables/admin/` - Admin-specific data access
- `src/composables/owner/` - Owner-specific data access
- `src/composables/shared/` - Cross-cutting concerns
- `src/composables/supabase/` - Supabase integration
- Reuse existing composables before adding new Supabase calls

### Key Utilities
- `src/utils/businessLogic.ts` - Booking/cleaning rules, priority calculation, conflict detection
- `src/utils/timeDefaults.ts` - Time defaults and Vuetify validation helpers
- `src/utils/authHelpers.ts` - Auth helpers including `getDefaultRouteForRole`

## Domain Rules

### Booking Model
- Guest-stay model: `checkout_date` must be strictly after `checkin_date`
- `booking_type === 'turn'`: Same-day short stays; validated via `validateTurnBooking`
- Priority: Use `calculateBookingPriority` - turn bookings are always at least `high`
- Conflicts: Use `detectBookingConflicts` and `validateBooking` instead of ad-hoc date math

### Cleaning Tasks
- Operational work modeled via `cleaning_tasks` table and `src/types/cleaningTask.ts`
- `getCleaningWindow` / `canScheduleCleaning` in businessLogic.ts are deprecated

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

## Performance

- Stores use `Map`-based collections with cached filters
- Use computed helpers like `getUpcomingBookings` / `getUrgentTurns` from businessLogic.ts
- Track subscriptions with `usePerformanceMonitor` from `src/composables/shared/usePerformanceMonitor.ts`
- Clean up subscriptions on unmount to keep performance tests green
- Run `pnpm test:performance` after significant data flow changes

## Critical Files

These areas require careful modification - extend existing patterns rather than refactoring:
- `src/components/smart/` - Working role-based components
- `src/composables/` - Performance-optimized logic
- `src/stores/` - Role-based state management
- `src/router/` - Authentication and role guards
- `vite.config.ts` - Build optimization settings

<<<<<<< Updated upstream
## Vuetify 3 UI/UX Patterns

### Setup
- **Version**: Vuetify 3.8.8 with `vite-plugin-vuetify` for auto-imports
- **Icons**: MDI (`mdi-*`) via `@mdi/font`
- **Config**: `src/plugins/vuetify.ts` - theme colors, component defaults, breakpoints

### Component Defaults (already configured)
These defaults are set globally - don't override unless necessary:
- `VBtn`: `variant="flat"`, `rounded`, no uppercase
- `VCard`: `elevation="2"`, `rounded="lg"`, `pa-2`
- `VTextField/VSelect/VTextarea`: `variant="outlined"`, `density="comfortable"`, `rounded="lg"`, `hideDetails="auto"`
- `VDialog`: `max-width="700px"`, `rounded="lg"`
- `VAlert`: `variant="tonal"`, `rounded="lg"`

### Layout Patterns
```vue
<!-- Standard form layout -->
<v-container>
  <v-row>
    <v-col cols="12" md="6">
      <v-text-field v-model="field" label="Label" :rules="rules" />
    </v-col>
  </v-row>
</v-container>

<!-- Modal with scroll -->
<v-dialog v-model="open" persistent scrollable>
  <v-card class="d-flex flex-column" style="max-height: 90vh">
    <v-card-title>Title</v-card-title>
    <v-divider />
    <v-card-text class="flex-grow-1 overflow-y-auto">Content</v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn @click="close">Cancel</v-btn>
      <v-btn color="primary" @click="save">Save</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
```

### Form Validation
```vue
<script setup lang="ts">
import type { VForm } from 'vuetify/components'

const formRef = ref<VForm | null>(null)
const formValid = ref(false)

// Rules are arrays of validator functions
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

<template>
  <v-form ref="formRef" v-model="formValid" @submit.prevent="submit">
    <v-text-field v-model="name" :rules="rules" />
    <v-btn type="submit" :disabled="!formValid">Submit</v-btn>
  </v-form>
</template>
```

### Common Components Reference
| Need | Component | Key Props |
|------|-----------|-----------|
| Form input | `v-text-field` | `type`, `label`, `:rules`, `prepend-inner-icon` |
| Dropdown | `v-select` | `:items`, `item-title`, `item-value` |
| Date input | `v-text-field type="date"` | Native HTML5 date picker |
| Time input | `v-text-field type="time"` | Native HTML5 time picker |
| Modal | `v-dialog` | `v-model`, `persistent`, `scrollable`, `max-width` |
| Feedback | `v-alert` | `type="success/error/warning/info"`, `variant="tonal"` |
| Loading | `v-btn :loading="true"` | Built-in spinner |
| Status | `v-chip` | `color`, `size="small"` |

### Icons (MDI)
Common icons used in this project:
- Navigation: `mdi-home`, `mdi-calendar`, `mdi-account`
- Actions: `mdi-plus`, `mdi-pencil`, `mdi-delete`, `mdi-check`
- Status: `mdi-alert`, `mdi-clock-outline`, `mdi-progress-check`
- Form: `mdi-calendar-plus`, `mdi-calendar-remove`, `mdi-note-text`

### Responsive Breakpoints
```typescript
// From vuetify.ts display config
xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920

// Usage in templates
<v-col cols="12" md="6" lg="4">  <!-- Full on mobile, half on tablet, third on desktop -->
```

### Theme Colors
Use semantic colors, not hex values:
- `primary`, `secondary`, `accent`
- `error`, `warning`, `success`, `info`
- Access variants: `primary-darken-1`, `primary-lighten-2`

### Existing Dumb Components
Check `src/components/dumb/shared/` before creating new UI:
- `ConfirmationDialog.vue` - Confirm/cancel dialogs
- `LoadingSpinner.vue` - Loading states
- `ErrorAlert.vue` - Error display
- `SkeletonLoader.vue` - Content placeholders
- `EnhancedToast.vue` - Notifications

## Fixing Type Errors

### Diagnostic Commands
```bash
pnpm build 2>&1 | head -50      # See first 50 lines of errors
vue-tsc --noEmit 2>&1 | grep -A2 "error TS"  # Just the errors with context
```

### Common Error Patterns

| Error | Likely Cause | Fix |
|-------|--------------|-----|
| `Property 'x' does not exist on type 'never'` | Uninitialized ref or empty array inference | Add explicit type: `ref<Booking[]>([])` |
| `Type 'X \| undefined' is not assignable to 'X'` | Optional chaining or Map.get() | Add null check or use `!` if guaranteed |
| `Argument of type 'X' is not assignable to parameter of type 'Y'` | Supabase row vs app type mismatch | Cast via `as Booking` or map fields explicitly |
| `Cannot find name 'defineProps'` | Missing Vue macro import | Vue 3.3+ auto-imports; check `<script setup lang="ts">` |
| `Object is possibly 'undefined'` | Accessing computed before data loads | Guard with `v-if` in template or `?.` in script |

### Type Locations
- **Domain types**: `src/types/` - Booking, Property, User, etc.
- **Supabase rows**: Inferred from `supabase.from('table').select()` - may need casting to domain types
- **Component props**: Define with `defineProps<{ prop: Type }>()` - import types from `@types/*`
- **Store state**: Pinia stores use `Map<string, T>` - use `.get()` with undefined checks

### Supabase ↔ App Type Mapping
Supabase returns snake_case rows; app types match this convention. When types drift:
1. Check `supabase/migrations/` for column changes
2. Update corresponding type in `src/types/`
3. Run `pnpm build` to find all affected code

### Vue-Specific Patterns
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

### Store Patterns (Pinia + Map)
```typescript
// Map access always returns T | undefined
const booking = bookingMap.get(id)  // Booking | undefined
if (!booking) return

// Computed from Map values
const list = computed(() => [...bookingMap.values()])
```

=======
>>>>>>> Stashed changes
## Gotchas

- Strict TypeScript: `pnpm build` runs `vue-tsc --noEmit`; keep `src/types/` in sync with Supabase migrations
- Don't duplicate business rules in components - call helpers in businessLogic.ts and timeDefaults.ts
- Before finishing changes: run `pnpm test:run` and `pnpm build`
- For auth/routing or subscription changes: also run `pnpm test:performance`
