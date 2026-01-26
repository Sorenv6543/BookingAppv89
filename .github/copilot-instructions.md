# BookingApp v89 – AI Agent Coding Instructions

> Multi-tenant property cleaning scheduler with role-based architecture (Owner/Admin), Supabase integration, and PWA + performance optimizations.

**You are working in a production-ready Vue 3 + TypeScript + Supabase app. Preserve the existing role-based architecture and performance guarantees.**

## AI agent quickstart

- For any feature, locate the relevant store in `src/stores` and any role-specific composables in `src/composables/admin` or `src/composables/owner` before touching components.
- Implement data orchestration in a smart component under `src/components/smart/{owner,admin,shared}` and pass plain props/events into dumb components under `src/components/dumb`.
- Read and reuse existing helpers in `src/utils/businessLogic.ts` and `src/utils/timeDefaults.ts` instead of adding new booking/validation rules inline.
- When you change data shapes or rules, update both `supabase/migrations/*` and matching types in `src/types/*`.
- Before finishing, run `pnpm test:run` and `pnpm build` to keep tests passing and type-checking clean.

## Big picture

- Multi-tenant property cleaning scheduler with distinct Owner and Admin interfaces; a Cleaner role exists in types but is not yet surfaced in the UI.
- Frontend: Vue 3 + Vite + Vuetify with smart/dumb component split under `src/components/smart` and `src/components/dumb`, pages under `src/pages`, and route guards in `src/router/guards.ts`.
- State & data access: domain stores in `src/stores` (`booking.ts`, `property.ts`, `cleaningTask.ts`, `auth.ts`, `ui.ts`) plus Supabase-based composables under `src/composables/supabase` and role-specific data composables under `src/composables/admin` and `src/composables/owner`.
- Backend: Supabase (auth, Postgres, RLS, realtime) with schema and constraints in `supabase/migrations/` and configuration in `supabase/config.toml` and `src/plugins/supabase.ts`.

## Core workflows

- Dev server: `pnpm dev`.
- Type-safe production build: `pnpm build` (runs `vue-tsc --noEmit` then Vite build and manifest formatting/cleanup).
- Faster build without type-checking (dev-only): `pnpm build:fast`.
- Role-specific bundles: `pnpm build:owner-only`, `pnpm build:admin-only`, `pnpm build:production`.
- Tests: `pnpm test` (Vitest watch), `pnpm test:run` (CI-style), `pnpm test:coverage`, `pnpm test:performance`.
- Performance / bundle analysis: `pnpm analyze:bundle`, `pnpm perf:analysis`.

## Domain & business rules

- Bookings now model guest stays: `checkin_date < checkout_date` (see comments in `src/utils/businessLogic.ts` and the later booking migrations); do **not** reintroduce the old “cleaning-window” model.
- Turn bookings are same-day short stays: check-in and check-out on the same calendar day and at least one hour apart; use `validateTurnBooking` and `validateBooking` in `src/utils/businessLogic.ts` instead of duplicating validation logic.
- Cleaning scheduling is handled via the `cleaning_tasks` table and related store/types (`src/stores/cleaningTask.ts`, `src/types/cleaningTask.ts`); `getCleaningWindow` / `canScheduleCleaning` in `businessLogic.ts` are marked **DEPRECATED** and should not be extended for new features.
- Priority, conflict detection, and workflow transitions live in `businessLogic.ts` (`calculateBookingPriority`, `detectBookingConflicts`, `getAvailableStatusTransitions`, `canTransitionBookingStatus`); reuse these helpers from stores/components rather than hand-rolling new rules.
- Time defaults and validation for booking forms are centralized in `src/utils/timeDefaults.ts` (`getDefaultTimes`, `validateTimeOrder`, `getTimeValidationRules`, `getCheckoutTimeValidationRules`, `getTimeHint`); UI-level validation should call into these helpers.

## Auth, roles, and routing

- Auth single source of truth is `useAuthStore` in `src/stores/auth.ts`, which delegates to `useSupabaseAuth` in `src/composables/supabase/useSupabaseAuth.ts` in non-test modes and uses fallback refs in tests.
- New code must **not** create ad-hoc auth state; always rely on the store’s computed values (`user`, `session`, `isAuthenticated`, `isOwner`, `isAdmin`, `isCleaner`) and methods (`login`, `logout`, `register`, `checkAuth`, `updateUserProfile`, etc.).
- Route protection and role-based access live in `src/router/guards.ts` and `src/router/index.ts`; when adding new pages or layouts, wire them through these guards instead of doing inline role checks in components.
- Supabase user profile loading uses a resilient, timeout-guarded flow with fallback profiles inside `useSupabaseAuth`; keep interaction with auth/user data inside that composable or the auth store.

## Components, state, and performance

- Follow the smart/dumb split documented in `README.md` and `docs/SYSTEM_ARCHITECTURE.md`: smart components under `src/components/smart/*` handle data fetching, role filtering, and orchestration; dumb components under `src/components/dumb/*` are pure UI and receive all data via props.
- Stores typically use `Map` collections (e.g., bookings, properties) for performance; iterate with `Array.from(map.values())` and keep derived collections (owner vs admin views, upcoming vs past, etc.) as computed properties instead of duplicating arrays.
- Supabase subscriptions and other long-lived reactive sources should be wrapped with the shared performance monitoring composable (e.g., `usePerformanceMonitor` / `trackSubscription` pattern used in existing smart components); when you add a new subscription, make sure it is tracked and unsubscribed on teardown.
- Be especially careful in “critical protection areas”: `src/components/smart`, `src/composables`, `src/stores`, `src/router`, and `vite.config.ts` are tuned for production; prefer extending existing patterns over refactoring them.

## Supabase & data integrity

- Schema, RLS policies, and booking/cleaning constraints are defined in `supabase/migrations/` (see the booking date constraint fixes and later migrations) and `supabase/APPLY_THIS_FIX.sql`; keep frontend invariants aligned with those constraints.
- All data access should go through the Supabase client configured in `src/plugins/supabase.ts` and the existing composables under `src/composables/admin`, `src/composables/owner`, and `src/composables/supabase`; avoid creating raw `fetch`/REST calls.
- When changing enums or constraints (e.g., `booking_status`, `booking_type`, `user_role`), update both the Supabase migrations and their mirrored TypeScript types under `src/types`.

## Gotchas & expectations

- TypeScript is strict: production changes must compile cleanly with `vue-tsc` and keep types in `src/types/*` in sync with the database.
- Maintain the verified performance characteristics (reduced subscriptions, role-based bundling, PWA optimization)—use the existing scripts and performance tests (`perf:*`, `test:performance`) to validate significant changes to data flows or component hierarchies.
- Prefer updating documentation in `docs/` (especially `SYSTEM_ARCHITECTURE.md`, `IMPLEMENTATION_GUIDE.md`, and `docs/references/*`) when you introduce new patterns, rather than inventing parallel conventions.
