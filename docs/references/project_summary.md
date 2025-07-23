# Project Summary: Property Cleaning Scheduler
## **Multi-Tenant Role-Based Architecture**

## Project Overview

**Mission**: Build a web-based scheduling platform that eliminates communication breakdowns between a cleaning company and their 30-40 Airbnb/VRBO property owner clients, preventing missed cleanings and enabling business scaling.

**Core Problem**: Manual coordination between property owners and cleaning company leads to missed cleanings, communication breakdowns, and lost revenue.

**Solution**: **Multi-tenant role-based platform** where:
- **Property owners** (30-40 clients) input their checkout/checkin dates through a simple, focused interface
- **Cleaning business admin** sees all jobs across all clients in a unified master calendar with cleaner assignment and priority management
- **Turn bookings** (same-day checkout/checkin) are automatically prioritized system-wide

## Business Impact Goals

- **Eliminate missed cleanings** due to communication failures
- **Reduce manual coordination** for 30-40 existing clients
- **Enable business scaling** beyond current client capacity
- **Platform foundation** for expansion to other service industries
- **95%+ client retention** and improved service reliability
- **Multi-tenant architecture** supporting both property owners and cleaning business operations

---

## 🏗️ Technical Architecture (Role-Based Implementation)

### **Tech Stack**
- **Frontend**: Vue 3.5+ with Composition API + TypeScript
- **UI Framework**: Vuetify 3 (Material Design 3)
- **State Management**: Pinia with Map collections (shared across roles)
- **Routing**: Vue Router 4 with role-based route guards
- **Calendar**: FullCalendar.io v6 with role-specific implementations
- **Build Tool**: Vite 5 with code splitting for role-based components
- **Testing**: Vitest with role-specific test coverage
- **Database**: Ready for Supabase integration with RLS (Row Level Security)

### **Core Architectural Patterns**

#### **1. Role-Based Component Architecture**
Separate interfaces optimized for different user types:
```typescript
// Role-based component routing
const homeComponent = computed(() => {
  if (authStore.isAdmin) return HomeAdmin;    // Full business management
  if (authStore.isOwner) return HomeOwner;    // Personal property focus
  return AuthLogin;
});
```

#### **2. Multi-Tenant Data Architecture**
```typescript
// Owner-scoped operations
const useOwnerBookings = () => {
  const fetchMyBookings = () => 
    bookings.filter(b => b.owner_id === currentUser.id);
};

// Admin operations (no filtering)
const useAdminBookings = () => {
  const fetchAllBookings = () => bookings; // ALL data across ALL clients
};
```

#### **3. Map Collections Pattern (Shared Foundation)**
All state uses `Map<string, T>` for O(1) lookups across both role interfaces:
```typescript
// Shared state structure
properties: Map<string, Property> = new Map()  // Used by both roles
bookings: Map<string, Booking> = new Map()     // Filtered per role
modals: Map<string, ModalState> = new Map()    // Role-specific modals
```

#### **4. Role-Specific Orchestration Pattern**
Each role has its own orchestrator optimized for their workflow:
- **HomeOwner.vue**: Personal property management, simple booking creation
- **HomeAdmin.vue**: System-wide management, cleaner assignment, business analytics

#### **5. Turn vs Standard Booking Distinction (Cross-Role)**
Core business logic implemented consistently across both role interfaces:
```typescript
interface Booking {
  booking_type: 'standard' | 'turn'; // CRITICAL distinction
  priority: 'urgent' | 'high' | 'standard'; // Calculated based on type
}

// Priority alerts scale per role:
// Owner: Shows only THEIR urgent turns
// Admin: Shows ALL urgent turns system-wide
```

---

## 📁 Role-Based Project Structure

```
/property-cleaning-scheduler
├── src/
│   ├── types/                       # ✅ Shared TypeScript interfaces
│   │   ├── index.ts                 # Main exports
│   │   ├── user.ts                  # User & role interfaces
│   │   ├── booking.ts               # Booking/event interfaces
│   │   ├── property.ts              # Property interfaces
│   │   ├── ui.ts                    # UI state interfaces
│   │   └── cleaner.ts               # 🆕 Cleaner interfaces (admin)
│   │
│   ├── stores/                      # ✅ Shared Pinia stores with Maps
│   │   ├── user.ts                  # User data + Map collections
│   │   ├── property.ts              # Property CRUD + Map state
│   │   ├── booking.ts               # Booking CRUD + Map state
│   │   ├── ui.ts                    # UI state + Modal management
│   │   └── auth.ts                  # Authentication state
│   │
│   ├── composables/                 # 🔄 Role-based business logic
│   │   ├── shared/                  # 🆕 Base business logic
│   │   │   ├── useAuth.ts           # Authentication (shared)
│   │   │   ├── useValidation.ts     # Form validation (shared)
│   │   │   └── useErrorHandler.ts   # Error handling (shared)
│   │   ├── owner/                   # 🆕 Property owner operations
│   │   │   ├── useOwnerBookings.ts  # Owner-scoped booking CRUD
│   │   │   ├── useOwnerProperties.ts # Owner-scoped property CRUD
│   │   │   ├── useOwnerCalendarState.ts # Owner calendar logic
│   │   │   └── useOwnerDashboard.ts # Owner dashboard data
│   │   └── admin/                   # 🆕 Business admin operations
│   │       ├── useAdminBookings.ts  # System-wide booking management
│   │       ├── useAdminProperties.ts # System-wide property management
│   │       ├── useAdminCalendarState.ts # Master calendar logic
│   │       ├── useCleanerManagement.ts # Cleaner assignment/scheduling
│   │       └── useReporting.ts      # Business analytics
│   │
│   ├── utils/                       # ✅ Shared business logic
│   │   ├── businessLogic.ts         # Priority calc, validation, conflicts
│   │   ├── supabase.ts              # Database client
│   │   ├── apiHelpers.ts            # API utilities
│   │   └── constants.ts             # App constants
│   │
│   ├── components/
│   │   ├── dumb/                    # 🔄 Role-specific + shared UI
│   │   │   ├── shared/              # 🆕 Shared across roles
│   │   │   │   ├── PropertyCard.vue     # ✅ Reusable property display
│   │   │   │   ├── TurnAlerts.vue       # ✅ Turn notifications (data differs per role)
│   │   │   │   ├── UpcomingCleanings.vue # ✅ Cleaning schedule (data differs per role)
│   │   │   │   ├── ThemePicker.vue      # ✅ Theme selection
│   │   │   │   └── ConfirmationDialog.vue # ✅ Confirmations
│   │   │   ├── owner/               # 🆕 Owner-specific UI
│   │   │   │   ├── OwnerBookingForm.vue # Simple booking form
│   │   │   │   ├── OwnerCalendarControls.vue # Basic calendar controls
│   │   │   │   └── OwnerQuickActions.vue # Owner action buttons
│   │   │   └── admin/               # 🆕 Admin-specific UI
│   │   │       ├── AdminBookingForm.vue # Advanced booking + cleaner assignment
│   │   │       ├── AdminCalendarControls.vue # Advanced calendar controls
│   │   │       ├── CleanerAssignmentModal.vue # Cleaner management
│   │   │       └── TurnPriorityPanel.vue # System-wide turn management
│   │   │
│   │   └── smart/                   # 🔄 Role-specific orchestrators
│   │       ├── shared/              # 🆕 Shared smart components
│   │       │   └── GlobalNotificationHandler.vue
│   │       ├── owner/               # 🆕 Property owner interface
│   │       │   ├── HomeOwner.vue    # Owner dashboard orchestrator
│   │       │   ├── OwnerSidebar.vue # Owner-scoped sidebar
│   │       │   └── OwnerCalendar.vue # Owner-scoped calendar
│   │       └── admin/               # 🆕 Business admin interface
│   │           ├── HomeAdmin.vue    # Admin dashboard orchestrator
│   │           ├── AdminSidebar.vue # System-wide sidebar
│   │           ├── AdminCalendar.vue # Master calendar with cleaner assignment
│   │           └── CleanerManagement.vue # Cleaner scheduling interface
│   │
│   ├── pages/                       # 🔄 Role-based routing
│   │   ├── index.vue                # 🔄 Role-based router
│   │   ├── auth/                    # 🆕 Authentication pages
│   │   │   ├── login.vue            
│   │   │   └── signup.vue           
│   │   ├── owner/                   # 🆕 Property owner pages
│   │   │   ├── dashboard.vue        # Owner main interface
│   │   │   ├── properties/          
│   │   │   │   └── index.vue        # Owner properties management
│   │   │   ├── bookings/            
│   │   │   │   └── index.vue        # Owner bookings management
│   │   │   └── calendar.vue         # Owner calendar view
│   │   ├── admin/                   # 🔄 Expanded admin pages
│   │   │   ├── index.vue            # Admin dashboard
│   │   │   ├── schedule/            # Master schedule management
│   │   │   │   ├── index.vue        # Master calendar
│   │   │   │   └── turns.vue        # System-wide turn management
│   │   │   ├── cleaners/            # Cleaner management
│   │   │   │   └── index.vue        
│   │   │   ├── properties/          # All properties management
│   │   │   │   └── index.vue        
│   │   │   └── reports/             # Business reporting
│   │   │       └── index.vue        
│   │   └── demos/                   # ✅ Component demos for testing
│   │
│   ├── layouts/                     # 🔄 Role-specific layouts
│   │   ├── default.vue              # ✅ Shared main layout
│   │   ├── admin.vue                # ✅ Admin-specific layout
│   │   ├── auth.vue                 # ✅ Authentication layout
│   │   └── owner.vue                # 🆕 Owner-specific layout
│   │
│   └── __tests__/                   # 🔄 Role-based testing
│       ├── stores/                  # ✅ Shared store tests
│       ├── components/              # 🔄 Role-specific component tests
│       │   ├── shared/              
│       │   ├── owner/               
│       │   └── admin/               
│       ├── composables/             # 🔄 Role-specific composable tests
│       │   ├── shared/              
│       │   ├── owner/               
│       │   └── admin/               
│       └── utils/                   # ✅ Shared business logic tests
```

---

## 🔧 Role-Based Data Models & Business Logic

### **Multi-Tenant User Model**
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'cleaner'; // CRITICAL: determines interface
  settings: UserSettings;
  created_at: string;
  updated_at: string;
}

// Role-based interface routing
interface PropertyOwner extends User { role: 'owner' }    // 30-40 clients
interface BusinessAdmin extends User { role: 'admin' }    // Cleaning company
interface Cleaner extends User { role: 'cleaner' }        // Field staff
```

### **Multi-Tenant Property Model**
```typescript
interface Property {
  id: string;
  owner_id: string;              // Links to specific property owner
  name: string;
  address: string;
  cleaning_duration: number;
  special_instructions?: string;
  pricing_tier: 'basic' | 'premium' | 'luxury';
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Owner sees: Only properties where owner_id === user.id
// Admin sees: ALL properties across ALL owners
```

### **Multi-Tenant Booking Model**
```typescript
interface Booking {
  id: string;
  property_id: string;
  owner_id: string;              // Links to specific property owner
  checkout_date: string;
  checkin_date: string;
  booking_type: 'standard' | 'turn'; // CRITICAL: affects priority
  guest_count?: number;
  notes?: string;
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed';
  assigned_cleaner_id?: string;   // Admin assigns cleaners
  priority: 'urgent' | 'high' | 'standard'; // Calculated
  created_at: string;
  updated_at: string;
}

// Owner sees: Only bookings where owner_id === user.id
// Admin sees: ALL bookings across ALL owners
```

### **Role-Specific Business Logic**

#### **Owner-Scoped Priority Calculation**
```typescript
export const getOwnerTurnAlerts = (
  userId: string, 
  allBookings: Map<string, Booking>
): Booking[] => {
  const today = new Date().toISOString().split('T')[0];
  return Array.from(allBookings.values())
    .filter(booking => 
      booking.owner_id === userId &&           // OWNER'S data only
      booking.checkout_date.startsWith(today) &&
      booking.booking_type === 'turn' &&
      booking.status !== 'completed'
    );
};
```

#### **Admin System-Wide Priority Calculation**
```typescript
export const getSystemTurnAlerts = (
  allBookings: Map<string, Booking>
): Booking[] => {
  const now = new Date();
  return Array.from(allBookings.values())     // ALL data, no filtering
    .filter(booking => {
      const checkoutTime = new Date(booking.checkout_date);
      const hoursUntil = (checkoutTime.getTime() - now.getTime()) / (1000 * 60 * 60);
      return booking.booking_type === 'turn' && 
             hoursUntil <= 6 && 
             booking.status !== 'completed';
    })
    .sort((a, b) => new Date(a.checkout_date).getTime() - new Date(b.checkout_date).getTime());
};
```

---

## 🔄 Role-Based Component Communication

### **Property Owner Interface Flow**
```
┌─────────────────┐    owner events    ┌────────────────┐    owner props    ┌─────────────────┐
│  OwnerSidebar   │ ─────────────────► │  HomeOwner.vue │ ───────────────► │  OwnerCalendar  │
│   (Smart)       │                    │ (Orchestrator) │                  │    (Smart)      │
│                 │                    │                │                  │                 │
│ • My Properties │                    │ • Owner Data   │                  │ • My Bookings   │
│ • My Turns      │                    │ • Simple CRUD  │                  │ • Simple Edit   │
│ • Quick Actions │                    │ • Personal UI  │                  │ • Basic Views   │
└─────────────────┘                    └────────────────┘                  └─────────────────┘
```

### **Business Admin Interface Flow**
```
┌─────────────────┐    admin events    ┌────────────────┐    admin props    ┌─────────────────┐
│  AdminSidebar   │ ─────────────────► │  HomeAdmin.vue │ ───────────────► │  AdminCalendar  │
│   (Smart)       │                    │ (Orchestrator) │                  │    (Smart)      │
│                 │                    │                │                  │                 │
│ • All Properties│                    │ • All Data     │                  │ • All Bookings  │
│ • System Turns  │                    │ • Advanced CRUD│                  │ • Cleaner Assign│
│ • Cleaner Queue │                    │ • Business UI  │                  │ • Status Mgmt   │
│ • Analytics     │                    │ • Reporting    │                  │ • Advanced Views│
└─────────────────┘                    └────────────────┘                  └─────────────────┘
```

### **Shared State, Role-Filtered Views**
```
                    ┌──────────────────┐
                    │   Pinia Stores   │
                    │   (Shared Maps)  │
                    │                  │
                    │ • properties Map │
                    │ • bookings Map   │
                    │ • users Map      │
                    └──────────────────┘
                           │
                  ┌────────┴────────┐
                  │                 │
        ┌─────────▼───────┐ ┌───────▼─────────┐
        │ Owner Interface │ │ Admin Interface │
        │                 │ │                 │
        │ Filtered Data:  │ │ All Data:       │
        │ • My Properties │ │ • All Properties│
        │ • My Bookings   │ │ • All Bookings  │
        │ • My Turns      │ │ • System Turns  │
        └─────────────────┘ └─────────────────┘
```

---

## 🧪 Role-Based Testing Strategy

### **Testing Architecture**
```typescript
// Owner-specific testing
describe('useOwnerBookings', () => {
  it('should filter bookings to current owner only', () => {
    const { fetchMyBookings } = useOwnerBookings();
    const result = fetchMyBookings();
    expect(result.every(b => b.owner_id === currentUser.id)).toBe(true);
  });
});

// Admin-specific testing  
describe('useAdminBookings', () => {
  it('should return all bookings without filtering', () => {
    const { fetchAllBookings } = useAdminBookings();
    const result = fetchAllBookings();
    expect(result.length).toBe(allBookings.length); // No filtering
  });
});

// Cross-role integration testing
describe('Role-based data isolation', () => {
  it('should prevent owners from accessing other owners data', () => {
    // Test data isolation between roles
  });
});
```

### **Role-Specific Test Coverage**
- **Owner Interface**: Personal data filtering, simple workflows
- **Admin Interface**: System-wide data access, complex workflows  
- **Shared Components**: Same UI with different data per role
- **Integration**: Cross-role data updates, security boundaries

---

## 🚀 Multi-Tenant Development Workflow

### **Role-Based Development Patterns**

#### **Data Scoping Pattern**
```typescript
// ✅ GOOD: Filter at composable level
const useOwnerBookings = () => {
  const myBookings = computed(() => 
    Array.from(bookings.value.values())
      .filter(b => b.owner_id === currentUser.id)
  );
};

// ✅ GOOD: No filtering for admin
const useAdminBookings = () => {
  const allBookings = computed(() => 
    Array.from(bookings.value.values()) // All data
  );
};
```

#### **Component Reuse Pattern**
```typescript
// Same dumb component, different data per role
<TurnAlerts :turns="myTurns" />      <!-- Owner: only their turns -->
<TurnAlerts :turns="systemTurns" />  <!-- Admin: all system turns -->
```

#### **Role-Based Error Handling**
```typescript
// Owner errors: user-friendly messaging
const ownerError = "Unable to save your booking. Please try again.";

// Admin errors: technical details + business impact
const adminError = "Booking save failed. 3 cleaners affected. System impact: High.";
```

### **Security Considerations**

#### **Frontend Data Filtering (UX Only)**
⚠️ **Important**: Frontend role filtering is for **user experience only**, not security.
```typescript
// Frontend filtering = UX optimization
const ownerBookings = allBookings.filter(b => b.owner_id === user.id);
// An owner could still access other data via dev tools!
```

#### **Future Database Security (Phase 2)**
```sql
-- Supabase RLS will provide real security
CREATE POLICY "owners_see_own_bookings" ON bookings 
FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "admins_see_all_bookings" ON bookings 
FOR SELECT USING (user_role() = 'admin');
```

---

## 🎯 Updated Roadmap

### **Phase 1: Role-Based MVP** (Current - 4-6 weeks)
- [x] **Foundation**: Types, stores, shared business logic ✅
- [x] **Shared Components**: Reusable UI components ✅  
- [ ] **Role Split**: Owner vs Admin interfaces (2 weeks)
- [ ] **Role Logic**: Role-specific composables (1 week)
- [ ] **Testing**: Role-based test coverage (1 week)
- [ ] **Polish**: Error handling, routing, guards (1 week)

**MVP Success Criteria**:
- **Property owners** can manage their properties/bookings via simple interface
- **Cleaning business admin** can manage all properties/bookings/cleaners via advanced interface
- **Data isolation** prevents owners from seeing other owners' data (frontend)
- **Turn priority system** works for both roles with appropriate scoping
- **Mobile responsive** for both interfaces

### **Phase 2: Supabase Integration** (2-3 weeks)
- [ ] Database setup with multi-tenant schema
- [ ] Row Level Security (RLS) policies for real data security
- [ ] Real-time subscriptions for cross-role updates
- [ ] Authentication with role-based routing
- [ ] Replace frontend filtering with database filtering

### **Phase 3: Advanced Multi-Tenant Features** (4-6 weeks)
- [ ] Cleaner assignment and scheduling system
- [ ] Business analytics and reporting dashboard
- [ ] Email/SMS notification system
- [ ] Performance optimization for large client base
- [ ] Mobile app considerations

### **Phase 4: Business Scaling** (Ongoing)
- [ ] Airbnb/VRBO integration
- [ ] Automated invoicing and payments
- [ ] Advanced business intelligence
- [ ] Platform expansion to other service industries

---

## 🔧 Development Guidelines (Role-Based)

### **Code Standards**
- **Role Separation**: Clear separation of owner vs admin functionality
- **Data Filtering**: Filter at composable level, not component level
- **Component Reuse**: Maximize reuse of dumb components across roles
- **Security Awareness**: Document frontend vs backend security boundaries
- **TypeScript**: Strict mode with role-based type safety

### **Architecture Principles**
1. **Multi-Tenant First**: Design for 30-40 property owner clients + admin
2. **Role-Based Interfaces**: Optimize each interface for its user type
3. **Shared Foundation**: Reuse types, stores, business logic, and dumb components
4. **Data Isolation**: Owners see only their data, admins see all data
5. **Turn Priority**: Same business logic, different scoping per role
6. **Security Layered**: Frontend filtering for UX + database RLS for security

### **Multi-Tenant Success Metrics**
- **Property Owner Satisfaction**: Simple interface, fast workflows
- **Admin Efficiency**: Comprehensive tools, system-wide visibility
- **Data Security**: No cross-owner data leakage
- **Performance**: Fast loading for both single-owner and all-owner data sets
- **Scalability**: Can handle 50+ property owners without performance degradation