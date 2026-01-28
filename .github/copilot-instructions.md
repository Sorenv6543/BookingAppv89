# BookingApp v89 – AI Agent Coding Instructions

> Multi-tenant property cleaning scheduler with role-based Owner/Admin UI, Supabase backend, and performance-tuned Vue 3 + TypeScript frontend.

## Big picture

- Core product: guest-stay booking plus cleaning operations; bookings model guest stays, `cleaning_tasks` model operational work between stays.
- Roles: Owner and Admin UIs are separate; Cleaner exists in types but has no dedicated UI yet.
- Tech stack: Vue 3 + Vite + Vuetify, Pinia for state, Supabase for auth/Postgres/RLS/realtime, PWA build with manifest optimization.

## Key workflows

- Dev server: `pnpm dev`.
- Tests: `pnpm test` (watch), `pnpm test:run`, `pnpm test:coverage`, `pnpm test:performance`.
- Production-style build: `pnpm build` (runs `vue-tsc --noEmit`, Vite build, manifest formatting/cleanup); fast build: `pnpm build:fast`.
- Role bundles: `pnpm build:owner-only`, `pnpm build:admin-only`, `pnpm build:production`.
- Performance/bundle analysis: `pnpm analyze:bundle`, `pnpm perf:analysis`, `pnpm perf:report`.

## Architecture & patterns

- Smart vs dumb components: data/orchestration in [src/components/smart](../src/components/smart), pure UI in [src/components/dumb](../src/components/dumb); smart components depend on stores/composables and pass plain props/events to dumb ones.
- Role separation: owner/admin smart components and pages are split under role-specific subfolders in [src/components/smart](../src/components/smart) and [src/pages](../src/pages); keep new role-specific logic in these folders.
- State: domain stores in [src/stores](../src/stores) use `Map` collections and cached computed maps for performance (see [src/stores/booking.ts](../src/stores/booking.ts)); prefer derived computeds over cloning arrays.
- Composables: data access and cross-cutting concerns live in [src/composables/admin](../src/composables/admin), [src/composables/owner](../src/composables/owner) and [src/composables/shared](../src/composables/shared); reuse them before adding new Supabase calls or ad-hoc state.
- Utilities: booking/cleaning rules in [src/utils/businessLogic.ts](../src/utils/businessLogic.ts), time defaults and Vuetify validation helpers in [src/utils/timeDefaults.ts](../src/utils/timeDefaults.ts), auth helpers in [src/utils/authHelpers.ts](../src/utils/authHelpers.ts).

## Domain rules (bookings & cleaning)

- Guest-stay model: `checkout_date` must be strictly after `checkin_date` (see comments in [src/utils/businessLogic.ts](../src/utils/businessLogic.ts)); do not reintroduce the older “cleaning window” booking model.
- Turn bookings: `booking_type === 'turn'` means A guest check out and a guest check in on the same day, critical for cleaning company; `validateTurnBooking` in [src/utils/businessLogic.ts](../src/utils/businessLogic.ts) enforces same calendar day and ≥ 1 hour duration and adds early/late time warnings.
- Priority: use `calculateBookingPriority` for all new prioritization logic; turn bookings are always at least `high`, with `urgent` when check-in is very close.
- Conflicts: use `detectBookingConflicts` and `validateBooking` for overlap detection and warnings instead of ad-hoc date math.
- Cleaning tasks: operational work is modeled via the `cleaning_tasks` table and types in [src/types/cleaningTask.ts](../src/types/cleaningTask.ts) and store in [src/stores/cleaningTask.ts](../src/stores/cleaningTask.ts); `getCleaningWindow` / `canScheduleCleaning` in `businessLogic.ts` are explicitly marked deprecated.
- Time defaults & validation: booking forms should use `getDefaultTimes`, `getTimeValidationRules`, `getCheckoutTimeValidationRules` and `getTimeHint` from [src/utils/timeDefaults.ts](../src/utils/timeDefaults.ts) instead of hard-coding time strings or rules.

## Auth, roles & routing

- Auth source of truth is `useAuthStore` in [src/stores/auth.ts](../src/stores/auth.ts), which delegates to `useSupabaseAuth` in [src/composables/supabase/useSupabaseAuth.ts](../src/composables/supabase/useSupabaseAuth.ts) outside test mode.
- Derive auth state via store computeds (`isAuthenticated`, `isOwner`, `isAdmin`, `isCleaner`, `user`, `session`); do not create separate refs for auth in components.
- Route protection and role checks live in [src/router/guards.ts](../src/router/guards.ts) and [src/router/index.ts](../src/router/index.ts); when adding pages, wire them through `authGuard` and use `meta.requiresAuth` / `meta.role` instead of custom per-component guards.
- Default dashboards for each role are computed by `getDefaultRouteForRole` in [src/utils/authHelpers.ts](../src/utils/authHelpers.ts); reuse this when redirecting after login or forbidden routes.

## Supabase & data integrity

- Supabase client is configured in [src/plugins/supabase.ts](../src/plugins/supabase.ts) and expects `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`; all DB access should go through this client.
- Schema, enums and constraints (including booking/cleaning and `user_role`) are defined under [supabase/migrations](../supabase/migrations) and helper SQL in [supabase/APPLY_THIS_FIX.sql](../supabase/APPLY_THIS_FIX.sql); when you change data shapes, update both migrations and the mirrored types in [src/types](../src/types).
- New queries and mutations should live in role-aware composables under [src/composables/admin](../src/composables/admin), [src/composables/owner](../src/composables/owner) or [src/composables/shared](../src/composables/shared); avoid raw REST/fetch.

## Performance & observability

- Stores and composables are tuned for performance: `Map`-based collections, cached filters, and computed helpers like `getUpcomingBookings` / `getUrgentTurns` in [src/utils/businessLogic.ts](../src/utils/businessLogic.ts); prefer building on these instead of re-filtering arrays.
- Long-lived Supabase subscriptions and other reactive streams should be tracked with `usePerformanceMonitor` from [src/composables/shared/usePerformanceMonitor.ts](../src/composables/shared/usePerformanceMonitor.ts); ensure you clean up on unmount to keep performance tests green.
- Use `pnpm test:performance`, `pnpm perf:analysis` and `pnpm perf:report` after significant changes to data flows, subscriptions or smart component structure.

## Gotchas & expectations

- This repo assumes strict TypeScript: `pnpm build` runs `vue-tsc --noEmit`; keep [src/types](../src/types) in sync with Supabase migrations and avoid `any` in domain types.
- Do not duplicate business rules (dates, times, statuses, priorities, cleaning logic) in components; call into the helpers in [src/utils/businessLogic.ts](../src/utils/businessLogic.ts) and [src/utils/timeDefaults.ts](../src/utils/timeDefaults.ts) from stores/composables instead.
- Auth, routing, and role-based access are considered “critical protection areas” along with [src/components/smart](../src/components/smart), [src/composables](../src/composables), [src/stores](../src/stores) and [vite.config.ts](../vite.config.ts); extend existing patterns rather than refactoring them.
- Before finishing a change, at minimum run `pnpm test:run` and `pnpm build`; for auth/routing or subscription-heavy changes also run `pnpm test:performance`.
