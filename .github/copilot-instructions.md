# BookingApp v89 – AI Coding Guide

> Vue 3 + TypeScript + Vuetify + Supabase multi-tenant cleaning scheduler (Owner/Admin). Booking model uses checkout→clean→checkin windows; RLS enforces role isolation.

## Architecture & Patterns
- **Smart vs Dumb**: `src/components/smart/**` fetch + orchestrate (role-filtered via Supabase/composables); `src/components/dumb/**` are pure UI/emit only.
- **Data model**: `bookings` require `checkout_date < checkin_date`; turns have `checkout_date == checkin_date`. Key enums: `user_role`, `booking_type`, `booking_status`, `priority_level`, `property_type`.
- **Composables**: `useAdminBookings`, `useOwnerBookings`, Supabase wrappers under `src/composables/**` (real-time, role-filtered). Follow existing date mapping (checkin = start, checkout = end).
- **State**: Pinia stores in `src/stores` (auth, booking, property, ui). Supabase auth flows use JWT in localStorage.
- **Routing/guards**: Role-based access in router guards; owners see own data, admin sees all (RLS still authoritative).

## Build, Test, Perf
- Dev: `pnpm run dev`
- Type check: `vue-tsc --noEmit`
- Tests: `pnpm run test:run` (Vitest); coverage `pnpm run test:coverage`.
- Builds: `pnpm run build` (full), `pnpm run build:fast` (no type check), `pnpm run build:pwa`.
- Perf: `pnpm run perf:analysis`, `pnpm run analyze:bundle`.

## Booking Rules (apply everywhere)
1) `checkout_date <= checkin_date` (DB CHECK enforces). Turns: dates equal.  
2) If both times provided on turns, require `checkout_time < checkin_time`; times optional otherwise.  
3) Cleaning window helpers in `src/utils/businessLogic.ts`; defaults in `src/utils/timeDefaults.ts`.  
4) Error copy lives in `src/utils/errorMessages.ts` (role-aware messaging).

## PWA/Performance
- Role-based code splitting in `vite.config.ts`; keep chunks aligned to admin/owner/shared.
- Track Supabase subscriptions (target ≤40) and memory; unsubscribe on unmount; debug logs use 🚀 prefix.
- PWA manifests auto-formatted via `scripts/format-manifest.js`; battery-aware caching in PWA build.

## Supabase Integration
- Tables: `user_profiles`, `properties`, `bookings`; all RLS-enabled. Trigger `handle_new_user` inserts profile (SECURITY DEFINER).
- Enum creation scripts under `supabase/`; keep casts (e.g., `::user_role`) valid by ensuring enums exist before triggers.
- API via `@supabase/supabase-js@^2.50.0`; errors mapped to friendly messages.

## Conventions & Pitfalls
- Keep smart components role-filtered; do not duplicate client-side filtering in dumb components.
- Maintain checkin/checkout ordering in handlers (checkin = start, checkout = end) to satisfy DB constraint.
- No `any` for booking/property flows; types in `src/types/*.ts` govern contracts.
- Watch for subscription leaks and unnecessary reactivity in composables.
- Environment secrets are git-ignored; use `.env.local` (never commit secrets).

## Key References
- Business logic: `src/utils/businessLogic.ts`, `src/utils/timeDefaults.ts`.
- Types: `src/types/booking.ts`, `property.ts`, enums shared with DB.
- Composables: `src/composables/admin/useAdminBookings.ts`, `src/composables/owner/useOwnerBookings.ts`.
- UI examples: `src/components/smart/admin/AdminDashboard.vue`, `src/components/smart/owner/HomeOwner.vue`, shared calendar components.

## Before PR/Commit
- `pnpm run test:run` and `pnpm run build` succeed (type-clean).
- Validate booking date/time rules and RLS assumptions.
- Ensure subscriptions cleaned up; no 🚀 leak warnings in console.
