# BookingApp v89 - AI Agent Coding Instructions

> Multi-tenant property cleaning scheduler with role-based architecture (Owner/Admin), Supabase integration, and PWA support.

## Architecture Overview

### Data Model: Cleaning-Window Booking System
- **Standard Booking**: `checkout_date < checkin_date` (guest departure → next guest arrival with cleaning window between)
- **Turn Booking**: Same-day `checkout_date == checkin_date` (urgent same-day turnover, high priority)
- **Constraint**: Database enforces `CHECK (checkout_date < checkin_date)` on bookings table (guests must depart before or at same time as next guests arrive)
- **Key Fields**: `checkout_date`, `checkin_date`, `booking_type`, `status`, `priority`

### Component Architecture: Smart/Dumb Separation
```
src/components/
├── smart/              # Data-aware (handle Supabase, business logic)
│   ├── admin/         # AdminDashboard, AdminUsers, AdminCalendar
│   ├── owner/         # OwnerDashboard, OwnerProperties, OwnerCalendar
│   └── shared/        # FullCalendar, PropertyCard, shared widgets
└── dumb/              # Pure UI (accept props, emit events)
    ├── forms/         # BookingForm, AdminBookingForm, OwnerBookingForm
    ├── layouts/       # Layout containers
    └── navigation/    # Navigation components
```

**Pattern**: Smart components fetch data and manage state; dumb components display data and delegate events. Smart components automatically filter data by user role (Supabase RLS).

### Role-Based Access Control
- **Owner**: Sees only their own properties and bookings (enforced via RLS)
- **Admin**: Sees all properties/bookings, can manage cleaners and system settings
- **Cleaner**: (Role exists in enum but not yet implemented in UI)
- **RLS Policies**: Every table has RLS enabled; queries are automatically filtered server-side

### State Management
- **Primary Store**: Pinia (booking.ts, property.ts, auth.ts, ui.ts)
- **Real-time**: Supabase subscriptions in composables (`useAdminBookings`, `useOwnerBookings`)
- **Performance**: Tracks subscription count (target ≤40) and memory usage to detect leaks

## Critical Development Workflows

### Build & Test Commands
```bash
# Development
pnpm run dev              # Start dev server with HMR
pnpm run test             # Run tests in watch mode
pnpm run test:run         # Single test run
pnpm run test:coverage    # Coverage report with v8

# Production Builds
pnpm run build            # Full build (TypeScript check + minify)
pnpm run build:fast       # Skip TypeScript check (dev only)
pnpm run build:pwa        # PWA build with manifest optimization

# Performance Analysis
pnpm run perf:analysis    # Bundle + regression test report
pnpm run analyze:bundle   # Visualize bundle size
```

### TypeScript & Validation
- **Zero Errors Required**: All production code must pass `vue-tsc --noEmit` without errors
- **Strict Mode**: `tsconfig.json` uses strict: true; no `any` types in bookings/properties
- **Type Files**: Core types in `src/types/` (booking.ts, property.ts, enums shared with database)

### Testing Standards
- **Test Framework**: Vitest + Vue Test Utils + Playwright (e2e)
- **Test Files**: `src/__tests__/` mirror source structure
- **Coverage Target**: 89 tests passing (100% pass rate); vitest@^4.0.18 + @vitest/coverage-v8@^4.0.17 aligned
- **Performance Tests**: Detect memory leaks in `performance-regression.spec.ts`

## Project-Specific Patterns

### Booking Validation
Located in `src/utils/businessLogic.ts` and forms:
1. **Date Order**: Always validate `checkoutDate <= checkinDate` (cleaning window: guests depart, then cleaning, then next guests arrive)
2. **Turn Consistency**: If `booking_type == 'turn'`, dates MUST be same day (`checkoutDate == checkinDate`)
3. **Time Order (turns only)**: For same-day turns, `checkout_time < checkin_time` (guests leave before next guests arrive)
4. **Optional Times**: `checkout_time` and `checkin_time` are optional fields; validation only checks order if both provided

**Error Messages**: Use role-appropriate language in `src/utils/errorMessages.ts` (user_role-keyed messages)

### Form Time Handling
- **Auto-Population**: `getDefaultTimes()` in `src/utils/timeDefaults.ts` provides default checkout/checkin times based on property
- **BookingForm.vue**: Times are optional; auto-populated when property is selected, but form still submits without times if not set
- **Validation**: Only validates time order for same-day turns; missing times don't block submission

### Cleaning Window Calculation
- **Standard Bookings**: Flexible scheduling between checkout and checkin (default 11 AM start)
- **Turn Bookings**: Tight window; 30-min buffer after checkout, cleaning must complete 1 hour before checkin
- **Reference**: `getCleaningWindow()` in businessLogic.ts calculates available time window

### Performance Optimization
- **Subscription Tracking**: All smart components log subscription count and memory (debug logs prefixed with 🚀)
- **Role-Based Code Splitting**: Separate bundles for owner/admin routes to reduce initial load
- **PWA Optimization**: Battery-aware caching; manifest auto-formatted on build

### Priority Calculation
Turn bookings always ≥ high priority; standard bookings escalate based on hours until checkin:
- Turn + ≤2 hours: `urgent`
- Turn + ≤6 hours: `high`
- Standard + ≤4 hours: `urgent`
- Standard + ≤12 hours: `high`

## Critical Integration Points

### Supabase Configuration
- **Project ID**: Referenced as `{SUPABASE_PROJECT_ID}` placeholder in docs; actual ID in `.env.local`
- **Auth Flow**: JWT tokens stored in localStorage; auto-refreshed by Supabase client
- **RLS Enforcement**: Policies check `auth.uid()` and `user_profiles.role` column
- **Enum Types**: `user_role`, `booking_type`, `booking_status`, `property_type` defined in migrations

### Database Constraints
- **Booking Dates**: `CHECK (checkout_date < checkin_date)` ensures valid cleaning-window model (guests depart before next guests arrive)
- **User Roles**: `role` column typed as `user_role` enum; defaults to `'owner'`
- **Trigger Functions**: `handle_new_user()` creates `user_profiles` row on auth.users insert (SECURITY DEFINER)

### API Communication
- **Supabase SDK**: `@supabase/supabase-js@^2.50.0` for queries/subscriptions
- **Composables**: Wrap Supabase calls (e.g., `useAdminBookings`, `useOwnerBookings`)
- **Error Handling**: Supabase errors mapped to user-friendly messages via errorMessages.ts

## Common Pitfalls to Avoid

1. **Date Model Confusion**: Remember `checkout_date < checkin_date` (cleaning window: guests depart, then cleaning, then next guests arrive); NOT `checkin < checkout`
2. **Time Validation**: Only validate time order for same-day turns; times are optional elsewhere
3. **RLS Policy Loops**: Avoid recursive role checks in policies (use direct `auth.uid()` queries)
4. **Subscription Leaks**: Always unsubscribe from Supabase channels; monitor logs for 🚀 prefix warnings
5. **Component Role Filtering**: Smart components automatically filter by role; don't re-filter in dumb components
6. **TypeScript Strict Mode**: No `any` types; use union types or generics instead

## Key Files by Purpose

| Purpose | File(s) |
|---------|---------|
| **Booking Rules** | `src/utils/businessLogic.ts` |
| **Error Messages** | `src/utils/errorMessages.ts` |
| **Type Definitions** | `src/types/booking.ts`, `property.ts` |
| **Form Components** | `src/components/dumb/BookingForm.vue`, `AdminBookingForm.vue` |
| **State Management** | `src/stores/booking.ts`, `property.ts`, `auth.ts` |
| **Composables** | `src/composables/admin/useAdminBookings.ts`, `owner/useOwnerBookings.ts` |
| **Database Schema** | `supabase/migrations/` |
| **Build Config** | `vite.config.ts`, `tsconfig.json` |

## Verification Steps Before Commit

- [ ] `pnpm run test:run` passes (89 tests)
- [ ] `pnpm run build` succeeds (TypeScript check + minify)
- [ ] No `🚀` debug logs indicate subscription leaks in console
- [ ] Date validation: `checkin <= checkout` for all booking types
- [ ] RLS: No recursive role checks in Supabase policies
- [ ] Form times: Optional fields don't block submission
