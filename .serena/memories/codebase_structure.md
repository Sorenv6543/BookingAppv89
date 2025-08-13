# Property Cleaning Scheduler - Codebase Structure

## Root Directory Structure
```
property-cleaning-scheduler/
├── docs/                    # Project documentation
├── e2e/                    # Playwright E2E tests
├── public/                 # Static assets
├── scripts/                # Build and utility scripts
├── src/                    # Main source code
├── supabase/              # Database migrations and config
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── vitest.config.ts       # Vitest test configuration
└── playwright.config.ts   # Playwright E2E configuration
```

## Source Code Structure (src/)

### Component Architecture
```
src/components/
├── dumb/                   # Pure UI components (no business logic)
│   ├── admin/             # Admin-specific UI components
│   ├── owner/             # Owner-specific UI components  
│   └── shared/            # Cross-role UI components
└── smart/                 # Data-aware components
    ├── admin/             # Admin interface (AdminDashboard, AdminUsers)
    ├── owner/             # Owner interface (HomeOwner, OwnerProperties) 
    └── shared/            # Cross-role (FullCalendar, PropertyCard)
```

### Business Logic & State
```
src/composables/
├── admin/                 # Admin-specific business logic
├── owner/                 # Owner-specific business logic
├── shared/                # Cross-role business logic  
└── supabase/             # Supabase integration composables

src/stores/               # Pinia state management
├── adminData.ts          # Admin data management
├── ownerData.ts          # Owner data management
├── auth.ts               # Authentication state
├── booking.ts            # Booking management  
├── property.ts           # Property management
├── ui.ts                 # UI state
└── user.ts              # User management
```

### Type Definitions
```
src/types/
├── api.ts               # API response types
├── booking.ts           # Booking-related types
├── property.ts          # Property-related types
├── user.ts             # User and role types
├── ui.ts               # UI component types
├── router.ts           # Route types
└── index.ts            # Exported types
```

### Pages & Routing
```
src/pages/
├── admin/              # Admin pages (/admin/*)
│   ├── bookings/       # Admin booking management
│   ├── users/         # User management
│   └── dashboard.vue   # Admin dashboard
├── owner/             # Owner pages (/owner/*)
│   ├── properties/    # Property management
│   ├── bookings/      # Owner bookings
│   └── calendar.vue   # Owner calendar
└── auth/             # Authentication pages
```

### Layouts & Infrastructure
```
src/layouts/
├── default.vue         # Base layout
├── admin.vue          # Admin-specific layout
├── owner.vue          # Owner-specific layout
└── auth.vue           # Authentication layout

src/router/
├── index.ts           # Route definitions
└── guards.ts          # Route protection & role validation

src/plugins/
├── vuetify.ts         # Vuetify configuration
└── supabase.ts        # Supabase client setup
```

### Utilities & Assets
```
src/utils/
├── authHelpers.ts      # Authentication utilities
├── businessLogic.ts    # Business rule helpers
├── errorMessages.ts    # Error message constants
├── mobileViewport.ts   # Mobile responsive utilities
└── typeHelpers.ts      # TypeScript helper functions

src/assets/
└── main.css           # Global styles

src/styles/
├── variables.scss      # SCSS variables
└── responsive.scss     # Responsive design styles
```

## Database Structure (supabase/)
```
supabase/
├── config.toml         # Supabase project configuration
└── migrations/         # Database migration files
```

## Testing Structure
```
src/__tests__/
├── components/         # Component tests
├── composables/        # Composable tests
│   ├── admin/         # Admin composable tests
│   └── owner/         # Owner composable tests
├── stores/            # Store tests
├── setup/             # Test setup and utilities
└── utils/             # Utility tests
```

## Key Files
- **Entry Point**: `src/main.ts`
- **App Component**: `src/App.vue`
- **Route Protection**: `src/router/guards.ts`
- **Auth Logic**: `src/composables/supabase/useSupabaseAuth.ts`
- **Type Definitions**: `src/types/` directory
- **Performance**: Custom monitoring in composables
- **PWA Config**: `vite.config.ts` PWA plugin section