# Owner Smart Components

This folder contains orchestrator components specifically designed for property owners.

## Purpose

Owner smart components provide focused, simple interfaces for property owners (30-40 clients) to manage their properties and bookings. They emphasize:

- **Simplicity**: Clean, focused interfaces without complex features
- **Personal Data**: Shows only the owner's properties and bookings
- **Mobile-First**: Optimized for mobile devices since owners manage on-the-go
- **Quick Actions**: Fast property and booking creation

## Key Components (Planned)

- `HomeOwner.vue` - Main dashboard orchestrator for property owners
- `OwnerSidebar.vue` - Sidebar with owner-specific navigation and quick actions
- `OwnerCalendar.vue` - Calendar view filtered to owner's properties only
- `OwnerPropertyManager.vue` - Simple property management interface

## Data Scoping

All owner components use owner-specific composables that filter data to show only:
- Properties owned by the current user
- Bookings for the user's properties
- Turn alerts for the user's properties only
- Personal metrics and statistics

## Architecture

Owner components should:
- Use composables from `@/composables/owner/`
- Filter all data to current user's scope
- Provide simple, focused workflows
- Be mobile-responsive
- Minimize cognitive load

## Business Context

Property owners are the primary users (30-40 clients) who need to:
- Add their properties to the system
- Create bookings for checkout/checkin dates
- View their personal schedule
- Get alerts for urgent turns
- Access simple, fast interfaces without business management complexity 