# Project Summary: Property Cleaning Scheduler

## Project Overview

**Mission**: Build a web-based scheduling platform that eliminates communication breakdowns between a cleaning company and their 30-40 Airbnb/VRBO property owner clients, preventing missed cleanings and enabling business scaling.

**Core Problem**: Manual coordination between property owners and cleaning company leads to missed cleanings, communication breakdowns, and lost revenue.

**Solution**: Automated scheduling platform where property owners input their checkout/checkin dates, and the cleaning company sees all jobs in a unified master calendar with priority indicators for same-day "turns."

## Business Impact Goals

- **Eliminate missed cleanings** due to communication failures
- **Reduce manual coordination** for 30-40 existing clients
- **Enable business scaling** beyond current client capacity
- **Platform foundation** for expansion to other service industries
- **95%+ client retention** and improved service reliability

## Technical Architecture

### **Tech Stack**
- **Frontend**: Vue 3 + TypeScript + Composition API
- **UI Framework**: Vuetify 3 (Material Design)
- **State Management**: Pinia with TypeScript
- **Routing**: Vue Router 4 (file-based routing)
- **Database**: Supabase (PostgreSQL + real-time)
- **Authentication**: Supabase Auth
- **Calendar**: FullCalendar.io
- **Build Tool**: Vite
- **Hosting**: Supabase (backend) + Netlify/Vercel (frontend)

### **Data Architecture Patterns**
- **Map Collections**: Use `Map<string, T>` instead of arrays for better performance
- **TypeScript Interfaces**: Strict typing with comprehensive interfaces
- **Reactive State**: Pinia stores with reactive Map collections
- **Single Source of Truth**: Home.vue orchestrates all data flow

## Project Structure

```
/property-cleaning-scheduler
├── src/
│   ├── types/                       # TypeScript interfaces
│   │   ├── index.ts                 # Main exports
│   │   ├── user.ts                  # User interfaces
│   │   ├── booking.ts               # Booking/event interfaces
│   │   ├── property.ts              # Property interfaces
│   │   └── ui.ts                    # UI state interfaces
│   ├── components/
│   │   ├── dumb/                    # Pure UI components
│   │   │   ├── PropertyCard.vue
│   │   │   ├── BookingForm/EventModal.vue
│   │   │   ├── UserSettings.vue
│   │   │   └── LoginLogout.vue
│   │   └── smart/                   # Business logic components
│   │       ├── FullCalendar.vue     # Calendar with logic
│   │       ├── Sidebar.vue          # Smart sidebar
│   │       └── Home.vue             # Main orchestrator
│   ├── pages/                       # Auto-routed pages
│   │   ├── index.vue               # Home (contains Home.vue)
│   │   ├── properties/index.vue    # Properties list
│   │   ├── properties/[id].vue     # Property detail
│   │   └── admin/dashboard.vue     # Admin dashboard
│   ├── layouts/
│   │   ├── default.vue             # Main layout
│   │   └── admin.vue               # Admin layout
│   ├── stores/                     # Pinia stores
│   │   ├── user.ts                 # User data + Map collections
│   │   ├── ui.ts                   # UI state + Modal management
│   │   └── auth.ts                 # Authentication state
│   ├── composables/                # Business logic
│   │   ├── useBookings.ts          # Booking CRUD + logic
│   │   ├── useAuth.ts              # Auth operations
│   │   ├── useCalendar.ts          # Calendar management
│   │   └── useHouses.ts            # Property CRUD + logic
│   └── utils/
│       ├── supabase.ts             # Supabase client
│       ├── constants.ts            # App constants
│       └── helpers.ts              # Type guards, validators
```

## Core Data Models

### **User**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'cleaner';
  settings: UserSettings;
}
```

### **Property**
```typescript
interface Property {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  cleaning_duration: number; // minutes
  special_instructions?: string;
  pricing_tier: 'basic' | 'premium' | 'luxury';
  active: boolean;
}
```

### **Booking** (Key Business Entity)
```typescript
interface Booking {
  id: string;
  property_id: string;
  owner_id: string;
  checkout_date: string;
  checkin_date: string;
  booking_type: 'standard' | 'turn'; // CRITICAL: turns = same-day priority
  guest_count?: number;
  notes?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
}
```

## Key Business Rules

### **Booking Types**
- **Standard Booking**: Regular checkout → checkin with gap between guests
- **Turn Booking**: Same-day checkout and checkin (HIGHEST PRIORITY for cleaning company)

### **Priority System**
1. **Turns**: Highest priority - same-day cleaning required
2. **Standard**: Priority based on next checkin date
3. **Visual Indicators**: Clear UI distinction between booking types

### **User Flows**
- **Property Owner**: Add properties → Enter bookings → View cleaning schedule
- **Cleaning Admin**: View master calendar → Assign cleaners → Update status → Track turns

## State Management Architecture

### **User Store (stores/user.ts)**
```typescript
{
  user: User | null;
  houses: Map<string, Property>;    // propertyId -> Property
  events: Map<string, Booking>;     // bookingId -> Booking
  settings: UserSettings;
}
```

### **UI Store (stores/ui.ts)**
```typescript
{
  modals: Map<string, ModalState>;     // modalId -> state
  sidebars: Map<string, boolean>;     // sidebarId -> open/closed
  loading: boolean;
  errors: Map<string, string>;        // errorKey -> message
  notifications: Notification[];
}
```

### **Component Architecture**
- **Home.vue**: Central orchestrator, single source of truth
- **Dumb Components**: Pure UI, receive props, emit events
- **Smart Components**: Business logic, store integration
- **Composables**: Reusable business logic (CRUD operations)

## Development Phases

### **Phase 1: MVP - Manual Booking System** (Months 1-2)
**Status**: Ready to begin
**Objectives**:
- [ ] Project setup with TypeScript + Vue 3 + Vuetify
- [ ] Core interfaces and type system
- [ ] Pinia stores with Map collections
- [ ] Authentication system (basic)
- [ ] Property management (CRUD)
- [ ] Manual booking entry system
- [ ] Basic calendar view with FullCalendar
- [ ] EventModal for booking creation/editing
- [ ] Turn vs Standard booking type distinction

**MVP Success Criteria**:
- Property owners can add properties and bookings manually
- Cleaning company sees unified calendar with all bookings
- Turn bookings clearly highlighted as high priority
- Basic CRUD operations working
- Mobile-responsive design

### **Phase 2: Enhanced Dashboard & Reporting** (Month 3)
- Advanced filtering and search
- Cleaner assignment and status tracking
- Basic analytics and reporting
- Notification system

### **Phase 3: Airbnb Integration** (Month 4)
- Airbnb API or iCal integration
- Automated calendar sync
- Sync status monitoring

### **Phase 4: VRBO Integration & Advanced Features** (Month 5+)
- VRBO iCal integration
- SMS notifications
- Advanced analytics

### **Phase 5: Business Management Features** (Months 6-8)
- Automated invoicing
- Payment processing (Stripe)
- Equipment tracking
- Advanced reporting

## Critical Implementation Patterns

### **Map Usage Pattern**
```typescript
// Always use Map for collections
const houses = new Map<string, Property>();
const events = new Map<string, Booking>();

// Convert to arrays when needed for UI
const housesArray = computed(() => Array.from(houses.values()));
```

### **Modal Management Pattern**
```typescript
// UI Store manages all modal states
const openEventModal = (mode: 'create' | 'edit', data?: Booking) => {
  uiStore.openModal('eventModal', mode, data);
};
```

### **Component Communication Pattern**
```typescript
// Home.vue coordinates between components
// FullCalendar.vue emits events → Home.vue → Sidebar.vue receives updates
// EventModal.vue emits save → Home.vue → composables handle business logic
```

## Key Files to Create First

1. **src/types/** - All TypeScript interfaces
2. **src/stores/user.ts** - Core data store with Map collections
3. **src/stores/ui.ts** - UI state management
4. **src/composables/useBookings.ts** - Booking business logic
5. **src/components/smart/Home.vue** - Central orchestrator
6. **src/components/dumb/BookingForm/EventModal.vue** - Booking form
7. **src/components/smart/FullCalendar.vue** - Calendar integration

## Current Status

**Ready to Begin**: All architectural decisions made, comprehensive PRD completed, TypeScript structure defined, essential reference documentation created.

**Documentation Strategy**: Context7 MCP (90% coverage) + Essential reference docs (10% coverage)

**Next Immediate Steps**:
1. Set up Context7 MCP for real-time documentation
2. Initialize Vite + Vue 3 + TypeScript project
3. Create core TypeScript interfaces (using reference docs)
4. Set up Vuetify 3 and Pinia
5. Build foundational Pinia stores with Map collections
6. Create Home.vue as central orchestrator

**Essential Reference Docs Created**:
- Vue 3 + TypeScript patterns
- Vuetify 3 + TypeScript integration  
- Component orchestration architecture
- Business logic patterns (turns, bookings, properties)

## Future Integration Points

- **Supabase Database**: Real-time subscriptions for live updates
- **FullCalendar.io**: Vue 3 integration for calendar views
- **Vuetify 3**: Material Design UI components
- **API Integrations**: Airbnb/VRBO calendar syncing (Phase 3+)

## Success Metrics

- **Technical**: Sub-2-second load times, 95%+ uptime, mobile-responsive
- **Business**: 90%+ client adoption, 50% reduction in missed cleanings
- **User Experience**: Intuitive interface, minimal training required

---

*This summary should be referenced for all development decisions to maintain consistency and architectural integrity throughout the project.*