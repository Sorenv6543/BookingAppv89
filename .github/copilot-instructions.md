# BookingApp v89 - AI Agent Coding Instructions

> Multi-tenant property cleaning scheduler with role-based architecture (Owner/Admin), Supabase integration, and PWA support.

## Architecture Overview

### Data Model: Industry Best Practices (Migration 011+)

**IMPORTANT**: As of migration 011 (January 2026), this application follows vacation rental industry best practices:

#### Bookings = Guest Stays
- Represent when guests occupy the property
- **Standard Model**: `checkin_date < checkout_date` (guests arrive, stay, then depart)
- **Turn Bookings**: Same-day bookings where `checkin_date` and `checkout_date` are on the same day (short stays)
- **Constraint**: Database enforces `CHECK (checkin_date < checkout_date)` on bookings table
- **Key Fields**: `checkin_date`, `checkout_date`, `booking_type`, `status`, `priority`

#### Cleaning Tasks = Operational Work
- Separate `cleaning_tasks` table for cleaning, maintenance, and inspection tasks
- Auto-generated "turnover" tasks between bookings (future enhancement)
- Assigned to cleaners with checklists and photo documentation
- **Task Types**: `turnover`, `deep_clean`, `inspection`, `maintenance`
- **Key Fields**: `scheduled_start`, `scheduled_end`, `task_type`, `status`, `assigned_cleaner_id`

#### Data Flow
1. Owner/Admin creates booking (guest stay)
2. Database trigger auto-creates cleaning_task (turnover) - *currently disabled, pending refactoring*
3. Admin assigns cleaner to task
4. Cleaner views task, completes checklist, uploads photos
5. Task marked complete, property ready for next guest

#### References
- **Industry Standards**: VRMA, Operto, SuiteOp, TouchStay
- **User Research**: https://www.perplexity.ai/search/i-m-writing-an-app-for-a-house-iFc4Sg53S3eSSQ60hwMmqA#3
- **Migration**: `supabase/migrations/011_implement_best_practices_model.sql`

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
- **Primary Store**: Pinia (booking.ts, property.ts, cleaningTask.ts, auth.ts, ui.ts)
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
1. **Date Order**: Always validate `checkin_date < checkout_date` (industry standard: guests arrive, stay, then depart)
2. **Turn Consistency**: If `booking_type == 'turn'`, dates MUST be same day (same-day short stay)
3. **Time Order (turns only)**: For same-day turns, `checkin_time < checkout_time` (guests arrive, then depart same day)
4. **Optional Times**: `checkin_time` and `checkout_time` are optional fields; validation only checks order if both provided

**Error Messages**: Use role-appropriate language in `src/utils/errorMessages.ts` (user_role-keyed messages)

### Form Time Handling
- **Auto-Population**: `getDefaultTimes()` in `src/utils/timeDefaults.ts` provides default checkin/checkout times based on property
- **BookingForm.vue**: Times are optional; auto-populated when property is selected, but form still submits without times if not set
- **Validation**: Only validates time order for same-day turns; missing times don't block submission

### Cleaning Task Management (New in Migration 011)
- **Separate Table**: `cleaning_tasks` table stores operational cleaning work
- **Auto-Generation**: Trigger function exists but is disabled pending refactoring
- **Manual Creation**: Admins and owners can manually create cleaning tasks
- **Cleaner Access**: Cleaners see only their assigned tasks via RLS policies
- **Store**: `src/stores/cleaningTask.ts` manages cleaning task state
- **Types**: `src/types/cleaningTask.ts` defines CleaningTask interface

### Cleaning Window Calculation (Deprecated)
- **DEPRECATED**: `getCleaningWindow()` in businessLogic.ts is kept for backward compatibility
- **Use Instead**: Create cleaning_tasks records linked to bookings
- **Migration Note**: Old logic assumed `checkout_date < checkin_date` (cleaning window model); new model uses `checkin_date < checkout_date` (guest stays)

### Performance Optimization
- **Subscription Tracking**: All smart components log subscription count and memory (debug logs prefixed with 🚀)
- **Role-Based Code Splitting**: Separate bundles for owner/admin routes to reduce initial load
- **PWA Optimization**: Battery-aware caching; manifest auto-formatted on build

### Priority Calculation
Booking priority based on time until checkin:
- Turn + ≤2 hours until checkin: `urgent`
- Turn + ≤6 hours until checkin: `high`
- Turn + >6 hours: `high` (all turns are at least high priority)
- Standard + ≤4 hours until checkin: `urgent`
- Standard + ≤12 hours until checkin: `high`
- Standard + ≤24 hours until checkin: `normal`
- Standard + >24 hours: `low`

## Critical Integration Points

### Supabase Configuration
- **Project ID**: Referenced as `{SUPABASE_PROJECT_ID}` placeholder in docs; actual ID in `.env.local`
- **Auth Flow**: JWT tokens stored in localStorage; auto-refreshed by Supabase client
- **RLS Enforcement**: Policies check `auth.uid()` and `user_profiles.role` column
- **Enum Types**: `user_role`, `booking_type`, `booking_status`, `property_type` defined in migrations

### Database Constraints
- **Booking Dates**: `CHECK (checkin_date < checkout_date)` ensures valid guest stay model (industry standard)
- **Cleaning Tasks**: `CHECK (scheduled_start < scheduled_end)` ensures valid task scheduling
- **User Roles**: `role` column typed as `user_role` enum; defaults to `'owner'`
- **Trigger Functions**: `handle_new_user()` creates `user_profiles` row on auth.users insert (SECURITY DEFINER)
- **Auto-Generation**: `generate_turnover_task()` exists but trigger is disabled pending refactoring for new booking model

### API Communication
- **Supabase SDK**: `@supabase/supabase-js@^2.50.0` for queries/subscriptions
- **Composables**: Wrap Supabase calls (e.g., `useAdminBookings`, `useOwnerBookings`)
- **Error Handling**: Supabase errors mapped to user-friendly messages via errorMessages.ts

## Common Pitfalls to Avoid

1. **Date Model**: CORRECT model is `checkin_date < checkout_date` (guests arrive, stay, then depart - industry standard). OLD model was backwards.
2. **Time Validation**: Only validate time order for same-day turns; times are optional elsewhere
3. **RLS Policy Loops**: Avoid recursive role checks in policies (use direct `auth.uid()` queries)
4. **Subscription Leaks**: Always unsubscribe from Supabase channels; monitor logs for 🚀 prefix warnings
5. **Component Role Filtering**: Smart components automatically filter by role; don't re-filter in dumb components
6. **TypeScript Strict Mode**: No `any` types; use union types or generics instead
7. **Cleaning Tasks**: Use `cleaning_tasks` table for operational work; don't repurpose bookings for cleaning scheduling

## Key Files by Purpose

| Purpose | File(s) |
|---------|---------|
| **Booking Rules** | `src/utils/businessLogic.ts` |
| **Cleaning Task Store** | `src/stores/cleaningTask.ts` |
| **Error Messages** | `src/utils/errorMessages.ts` |
| **Type Definitions** | `src/types/booking.ts`, `property.ts`, `cleaningTask.ts` |
| **Form Components** | `src/components/dumb/BookingForm.vue`, `AdminBookingForm.vue` |
| **State Management** | `src/stores/booking.ts`, `property.ts`, `cleaningTask.ts`, `auth.ts` |
| **Composables** | `src/composables/admin/useAdminBookings.ts`, `owner/useOwnerBookings.ts` |
| **Database Schema** | `supabase/migrations/` |
| **Build Config** | `vite.config.ts`, `tsconfig.json` |

## Verification Steps Before Commit

- [ ] `pnpm run test:run` passes (89 tests)
- [ ] `pnpm run build` succeeds (TypeScript check + minify)
- [ ] No `🚀` debug logs indicate subscription leaks in console
- [ ] Date validation: `checkin_date < checkout_date` for all bookings (industry standard)
- [ ] RLS: No recursive role checks in Supabase policies
- [ ] Form times: Optional fields don't block submission
- [ ] Migration 011 applies cleanly to existing database
