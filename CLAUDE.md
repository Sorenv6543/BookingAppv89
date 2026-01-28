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

## Gotchas

- Strict TypeScript: `pnpm build` runs `vue-tsc --noEmit`; keep `src/types/` in sync with Supabase migrations
- Don't duplicate business rules in components - call helpers in businessLogic.ts and timeDefaults.ts
- Before finishing changes: run `pnpm test:run` and `pnpm build`
- For auth/routing or subscription changes: also run `pnpm test:performance`
