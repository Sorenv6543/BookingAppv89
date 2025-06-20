# Comprehensive Prompting Instructions: Tasks 060A-070 (Architecture-Enhanced)

## Overview
This document provides detailed prompting instructions for the enhanced task sequence, integrating critical architectural improvements with the original tasks 061-070. The focus is on eliminating code duplication, establishing HomeOwner and HomeAdmin as true single sources of truth, and creating thin orchestrator components with business logic properly abstracted to composables.

## 🚨 CRITICAL ARCHITECTURAL CONTEXT
**Major Issue Identified**: Current codebase has 2940+ lines of duplicated business logic across Home.vue (1020+ lines), HomeOwner.vue (~900 lines), and HomeAdmin.vue (1020+ lines). This violates the single source of truth principle and creates massive maintenance overhead.

**Solution**: Extract all business logic to dashboard composables and transform components into thin orchestrators (~300 lines each).

---
## ---------------------------------------------------------------------------------------------------------------------------------
## 🚨 **CRITICAL ARCHITECTURAL TASKS (MUST COMPLETE FIRST)**
### **TASK-060A: Create useOwnerDashboard Composable**
**Complexity Rating: 8/10** - High complexity due to massive business logic extraction

### **Sequential Thinking Approach**
```
1. **Analysis Phase**: Examine HomeOwner.vue business logic
   - Identify all business logic currently in HomeOwner.vue (~900 lines)
   - Map data access patterns and state management
   - Catalog all owner-specific operations and workflows

2. **Extraction Design Phase**: Plan composable architecture
   - Design clean interface for HomeOwner.vue orchestration
   - Plan role-specific data filtering and access patterns
   - Design owner-specific error handling and validation

3. **Implementation Phase**: Create comprehensive composable
   - Extract owner data access (properties, bookings, calendar)
   - Extract owner actions (create, update, delete operations)
   - Extract owner-specific business rules and validation
   - Implement proper error handling and state management

4. **Integration Design Phase**: Plan HomeOwner.vue integration
   - Design minimal component interface
   - Plan prop passing and event handling through composables
   - Ensure clean separation of concerns

5. **Verification Phase**: Validate architecture improvement
   - Test composable functionality in isolation
   - Verify clean interface design
   - Prepare for HomeOwner.vue refactoring
```

### **Context7 Documentation**
```bash
# Vue.js composables and business logic patterns
get-library-docs /vuejs/docs --topic="composition-api composables business-logic-extraction"

# Advanced state management patterns
get-library-docs /vuejs/pinia --topic="composables-integration complex-state-patterns"

# TypeScript for composable interfaces
get-library-docs /microsoft/typescript --topic="interfaces generics composable-typing"
```

### **Vuetify RAG Server Usage**
```bash
# Not heavily needed for this task - focus on business logic extraction
# May need for UI state management patterns if applicable
```

### **Implementation Requirements**
- **File Location**: `src/composables/owner/useOwnerDashboard.ts`
- **Key Extractions**:
  - All data access logic from HomeOwner.vue
  - All business operations (CRUD for bookings/properties)
  - All owner-specific validation and error handling
  - All calendar state management
  - All UI state management (modals, loading states)
- **Interface Design**: Clean, minimal API for component consumption
- **Expected Impact**: Enable HomeOwner.vue reduction from ~900 to ~200 lines

### **Implementation Pattern** (REQUIRED):
```typescript
// useOwnerDashboard.ts
export function useOwnerDashboard() {
  // Data (all owner-scoped)
  const ownerData = reactive({
    properties: computed(() => /* owner filtering logic */),
    bookings: computed(() => /* owner filtering logic */),
    todayTurns: computed(() => /* owner turn logic */),
    upcomingCleanings: computed(() => /* owner cleaning logic */),
    calendarEvents: computed(() => /* owner calendar logic */)
  });

  // Actions (all owner-scoped operations)
  const ownerActions = {
    createBooking: async (data: BookingFormData) => {
      // Extract from HomeOwner.vue
    },
    updateBooking: async (id: string, data: Partial<Booking>) => {
      // Extract from HomeOwner.vue  
    },
    deleteBooking: async (id: string) => {
      // Extract from HomeOwner.vue
    },
    navigateToBooking: (id: string) => {
      // Extract from HomeOwner.vue
    },
    handleEventClick: (event: EventClickArg) => {
      // Extract from HomeOwner.vue
    }
  };

  // Calendar state (owner-specific)
  const calendarState = reactive({
    currentView: ref('dayGridMonth'),
    currentDate: ref(new Date()),
    selectedPropertyIds: ref<string[]>([])
  });

  return {
    ownerData,
    ownerActions, 
    calendarState
  };
}
```

### **Verification**: Creates foundation for thin HomeOwner.vue orchestrator

---
## ---------------------------------------------------------------------------------------------------------------------------------
### **TASK-060B: Create useAdminDashboard Composable**
**Complexity Rating: 9/10** - Very high complexity due to system-wide business logic

### **Sequential Thinking Approach**
```
1. **Analysis Phase**: Examine HomeAdmin.vue business logic
   - Identify all business logic currently in HomeAdmin.vue (1020+ lines)
   - Map system-wide data access patterns
   - Catalog all admin-specific operations and workflows
   - Analyze cleaner management and system administration logic

2. **Extraction Design Phase**: Plan comprehensive composable architecture
   - Design clean interface for HomeAdmin.vue orchestration
   - Plan system-wide data access without filtering
   - Design admin-specific error handling with business impact
   - Plan cleaner assignment and system management workflows

3. **Implementation Phase**: Create comprehensive admin composable
   - Extract admin data access (all properties, all bookings, system metrics)
   - Extract admin actions (cleaner assignment, system management)
   - Extract business analytics and reporting functionality
   - Implement admin-specific error handling and notifications

4. **System Integration Phase**: Handle complex admin workflows
   - Integrate cleaner management operations
   - Implement business reporting and analytics
   - Handle system-wide notifications and alerts
   - Manage complex admin state

5. **Verification Phase**: Validate comprehensive functionality
   - Test all admin operations in isolation
   - Verify system-wide data access
   - Prepare for HomeAdmin.vue refactoring
```

### **Context7 Documentation**
```bash
# Advanced Vue.js patterns for complex business logic
get-library-docs /vuejs/docs --topic="composition-api advanced-patterns complex-state"

# Enterprise state management patterns
get-library-docs /vuejs/pinia --topic="enterprise-patterns complex-operations"

# TypeScript for complex interfaces
get-library-docs /microsoft/typescript --topic="advanced-types complex-interfaces enterprise-patterns"
```

### **Implementation Requirements**
- **File Location**: `src/composables/admin/useAdminDashboard.ts`
- **Key Extractions**:
  - All system-wide data access logic from HomeAdmin.vue
  - All admin business operations (cleaner assignment, system management)
  - All business analytics and reporting functionality
  - All admin-specific validation and error handling
  - All system calendar state management
  - All admin UI state management

### **Implementation Pattern** (REQUIRED):
```typescript
// useAdminDashboard.ts
export function useAdminDashboard() {
  // Data (system-wide, no filtering)
  const adminData = reactive({
    allProperties: computed(() => /* no filtering - all data */),
    allBookings: computed(() => /* no filtering - all data */),
    systemMetrics: computed(() => /* business calculations */),
    urgentTurns: computed(() => /* system-wide urgent turns */),
    cleanerQueue: computed(() => /* cleaner assignments */),
    allCalendarEvents: computed(() => /* system calendar */)
  });

  // Actions (admin-specific operations)  
  const adminActions = {
    assignCleaner: async (bookingId: string, cleanerId: string) => {
      // Extract from HomeAdmin.vue
    },
    generateReport: async (type: ReportType) => {
      // Extract from HomeAdmin.vue
    },
    manageSystem: () => {
      // Extract from HomeAdmin.vue
    },
    updateBookingStatus: async (id: string, status: BookingStatus) => {
      // Extract from HomeAdmin.vue
    }
  };

  // System state (admin-specific)
  const systemState = reactive({
    currentView: ref('dayGridMonth'),
    selectedCleaners: ref<string[]>([]),
    systemAlerts: ref<SystemAlert[]>([])
  });

  return {
    adminData,
    adminActions,
    systemState
  };
}
```
      <--------------------------------------------------------------------------------------------------------------------------------wwwwwwwwwwwwwwww>
### **Expected Impact**: Enable HomeAdmin.vue reduction from 1020+ to ~200 lines
### **Verification**: Creates foundation for thin HomeAdmin.vue orchestrator
**Complexity Rating: 8/10** - High complexity due to role-based data filtering and calendar integration

### **Sequential Thinking Approach**
Use this structured thinking process:

```
1. **Research Phase**: Understand existing calendar patterns
   - Analyze current FullCalendar.vue implementation
   - Identify owner-specific requirements vs admin features
   - Research role-based data filtering patterns

2. **Design Phase**: Plan component architecture
   - Define component interface (props, emits, slots)
   - Plan data filtering logic for owner properties only
   - Design owner-specific calendar controls

3. **Implementation Phase**: Build the component
   - Create base calendar structure
   - Implement role-based event filtering
   - Add owner-specific controls and workflows

4. **Integration Phase**: Connect to existing systems
   - Integrate with stores (auth, properties, bookings)
   - Ensure proper data isolation
   - Test calendar event creation/editing workflows

5. **Verification Phase**: Comprehensive testing
   - Verify only owner's properties appear
   - Test all owner-specific calendar features
   - Ensure no admin-only features are accessible
```

### **Context7 Documentation**
```bash
# Essential Vue.js patterns for complex components
resolve-library-id "vue"
get-library-docs /vuejs/docs --topic="composition-api reactive-data calendar-components"

# TypeScript interfaces for calendar events
resolve-library-id "typescript"
get-library-docs /microsoft/typescript --topic="interfaces generics type-guards"

# FullCalendar integration patterns
resolve-library-id "fullcalendar"
get-library-docs /fullcalendar/fullcalendar --topic="vue-integration event-filtering"
```

### **Vuetify RAG Server Usage**
```bash
# Use Vuetify RAG for calendar styling and layout
# Focus on: v-calendar, v-date-picker, v-card layouts
# Key components: v-toolbar, v-btn, v-menu for calendar controls
```

### **Implementation Requirements**
- **File Location**: `src/components/smart/owner/OwnerCalendar.vue`
- **Key Features**: 
  - Filter calendar events to owner's properties only
  - Owner-specific calendar controls (OwnerCalendarControls)
  - Owner-specific event creation workflows
  - Remove admin-only features (cleaner assignment, system-wide view)
  - Owner-specific calendar views (My Properties, My Bookings)
  - Owner-specific event styling and indicators

### **Dependencies**: OwnerCalendarControls.vue component
### **Verification**: Owner sees only their property events and bookings

---
## ---------------------------------------------------------------------------------------------------------------------------------
## 🔧 **TASK-062: Create AdminSidebar.vue Component**
**Complexity Rating: 6/10** - Medium-high complexity due to comprehensive admin navigation

### **Sequential Thinking Approach**
```
1. **Analysis Phase**: Map admin navigation requirements
   - Inventory all admin features and sections
   - Analyze current generic sidebar patterns
   - Identify admin-specific navigation needs

2. **Architecture Phase**: Design comprehensive admin nav
   - Plan hierarchical navigation structure
   - Design system status indicators
   - Plan role switcher integration

3. **Implementation Phase**: Build admin navigation
   - Create main navigation sections
   - Add system status indicators and alerts
   - Implement business metrics display
   - Add role switcher functionality

4. **Styling Phase**: Apply admin-focused design
   - Use admin-appropriate colors and iconography
   - Ensure professional admin interface feel
   - Optimize for admin workflow efficiency

5. **Integration Phase**: Connect to admin systems
   - Link to all admin routes and features
   - Connect business metrics data
   - Test role switching functionality
```

### **Context7 Documentation**
```bash
# Vue.js navigation patterns
get-library-docs /vuejs/docs --topic="router-navigation component-communication"

# TypeScript for navigation interfaces
get-library-docs /microsoft/typescript --topic="interfaces enums type-safety"
```

### **Vuetify RAG Server Usage**
```bash
# Essential for comprehensive admin sidebar
# Focus on: v-navigation-drawer, v-list, v-list-item-group
# Key components: v-badge, v-chip (for status), v-divider, v-expansion-panels
# Icons: mdi-icons for admin-specific actions
```

### **Implementation Requirements**
- **File Location**: `src/components/smart/admin/AdminSidebar.vue`
- **Full Feature Set**: Cleaners, Properties, Bookings, Reports, System Settings
- **System Controls**: Status indicators, role switcher, business metrics
- **Admin Styling**: Professional admin-focused UI with comprehensive navigation

### **Verification**: Admin sees full system navigation and controls

---
## ---------------------------------------------------------------------------------------------------------------------------------
## 🔍 **TASK-063: Fix TypeScript Errors in Admin Components**
**Complexity Rating: 6/10** - Medium-high due to cross-component error resolution

### **Sequential Thinking Approach**
```
1. **Discovery Phase**: Identify all TypeScript errors
   - Run `npm run type-check` to get complete error list
   - Categorize errors by type (missing types, incorrect interfaces, etc.)
   - Prioritize critical errors vs warnings

2. **Analysis Phase**: Understand error patterns
   - Identify common error patterns across components
   - Analyze missing type definitions
   - Review existing type patterns in codebase

3. **Resolution Phase**: Fix errors systematically
   - Start with interface and type definition errors
   - Fix prop and emit type errors
   - Resolve store integration typing issues
   - Update import/export statements

4. **Validation Phase**: Ensure comprehensive type coverage
   - Re-run type checking after each fix batch
   - Verify IntelliSense works correctly
   - Test component interfaces in development

5. **Documentation Phase**: Update type documentation
   - Add JSDoc comments for complex types
   - Document type patterns for future development
```

### **Context7 Documentation**
```bash
# TypeScript best practices for Vue.js
get-library-docs /microsoft/typescript --topic="interfaces type-guards error-handling strict-mode"
get-library-docs /vuejs/docs --topic="typescript composition-api props-typing"

# Pinia store typing patterns
resolve-library-id "pinia"
get-library-docs /vuejs/pinia --topic="typescript-support state-typing"
```

### **Vuetify RAG Server Usage**
```bash
# Use for Vuetify component type definitions
# Focus on: component prop types, event types, theme typing
```

### **Implementation Requirements**
- **Scope**: All files in `src/components/smart/admin/` and `src/components/dumb/admin/`
- **Common Issues**: Missing type definitions, incorrect prop types, store typing
- **Tools**: Use `npm run type-check` to identify specific errors

### **Verification**: `npm run type-check` passes without errors

---
## ---------------------------------------------------------------------------------------------------------------------------------
## 🔧 **TASK-064: Fix AdminCalendar.vue Implementation Issues**
**Complexity Rating: 8/10** - High complexity due to DOM mounting and component lifecycle issues

### **Sequential Thinking Approach**
```
1. **Problem Analysis Phase**: Understand current issues
   - Reproduce "Cannot read properties of null (reading 'parentNode')" error
   - Analyze component lifecycle and DOM mounting patterns
   - Identify specific failure points in calendar initialization

2. **Root Cause Investigation**: Deep dive into issues
   - Examine FullCalendar DOM mounting requirements
   - Review Vue.js component lifecycle vs calendar needs
   - Analyze timing issues between Vue mounting and calendar init

3. **Solution Design Phase**: Plan comprehensive fixes
   - Design DOM mounting safety checks
   - Plan component lifecycle management improvements
   - Design error boundaries and retry mechanisms

4. **Implementation Phase**: Apply systematic fixes
   - Add DOM element existence checks
   - Implement proper component lifecycle management
   - Add error boundaries for calendar failures
   - Implement retry mechanisms for initialization

5. **Testing Phase**: Comprehensive validation
   - Test calendar mounting in various scenarios
   - Verify admin calendar features work correctly
   - Test error recovery and retry mechanisms
```

### **Context7 Documentation**
```bash
# Vue.js lifecycle and DOM interaction
get-library-docs /vuejs/docs --topic="lifecycle-hooks dom-manipulation component-mounting"

# FullCalendar Vue integration
resolve-library-id "fullcalendar"
get-library-docs /fullcalendar/fullcalendar --topic="vue-integration dom-mounting error-handling"
```

### **Vuetify RAG Server Usage**
```bash
# Calendar layout and container components
# Focus on: v-container, v-row, v-col for calendar layouts
# Error display: v-alert, v-snackbar for error handling
```

### **Implementation Requirements**
- **File Location**: `src/components/smart/admin/AdminCalendar.vue`
- **Critical Fixes**: Resolve DOM mounting null pointer errors
- **Error Handling**: Add comprehensive error boundaries
- **Admin Features**: Ensure all admin calendar functionality works

### **Verification**: Admin calendar route loads without errors

---
## ---------------------------------------------------------------------------------------------------------------------------------
## 🔗 **TASK-065: Transform HomeOwner.vue into Thin Orchestrator**
**Complexity Rating: 9/10** - CRITICAL architectural transformation

### **🚨 PRIMARY OBJECTIVE**
**Transform HomeOwner.vue from 900+ line business logic component into ~200 line thin orchestrator using useOwnerDashboard composable**

### **Sequential Thinking Approach**
```
1. **Current State Analysis Phase**: Assess existing HomeOwner.vue
   - Measure current component size (~900 lines)
   - Identify all business logic that should be extracted
   - Map current component dependencies and data flow
   - Document current architectural violations

2. **Refactoring Design Phase**: Plan thin orchestrator transformation
   - Design minimal component interface using useOwnerDashboard
   - Plan removal of all business logic from component
   - Design clean prop passing and event delegation
   - Plan component size reduction strategy

3. **Implementation Phase**: Execute orchestrator transformation
   - Replace all business logic with useOwnerDashboard calls
   - Integrate OwnerSidebar and OwnerCalendar components
   - Remove all computed properties with business logic
   - Remove all methods with business operations
   - Keep only UI-specific logic (sidebar toggle, responsive behavior)

4. **Integration Testing Phase**: Verify functionality preservation
   - Test that all owner functionality still works
   - Verify role-based data filtering through composables
   - Test component communication through composable actions
   - Ensure no regression in user experience

5. **Architecture Validation Phase**: Confirm transformation success
   - Measure final component size (~200 lines target)
   - Verify no business logic remains in component
   - Confirm single source of truth established
   - Validate clean separation of concerns
```

### **Context7 Documentation**
```bash
# Thin component patterns and orchestration
get-library-docs /vuejs/docs --topic="component-orchestration thin-components presentation-logic"

# Advanced composable integration
get-library-docs /vuejs/docs --topic="composables-integration component-composition"

# Clean architecture patterns
get-library-docs /vuejs/docs --topic="clean-architecture separation-of-concerns"
```

### **Vuetify RAG Server Usage**
```bash
# Layout orchestration for thin components
# Focus on: clean component structure, minimal templates
# Key components: v-row, v-col for simple orchestration layouts
```

### **Implementation Requirements**

#### **BEFORE (Current - WRONG)**:
```vue
<!-- HomeOwner.vue - ~900 lines with business logic -->
<script setup>
// ❌ BAD: Business logic in component
const ownerBookings = computed(() => 
  Array.from(bookingStore.bookings.values())
    .filter(b => b.owner_id === user.id)
);

const createBooking = async (data) => {
  // ❌ 50+ lines of business logic here
};

const handleCalendarEvents = () => {
  // ❌ 100+ lines of calendar logic here
};

// ❌ 800+ more lines of business logic...
</script>
```

#### **AFTER (Target - CORRECT)**:
```vue
<!-- HomeOwner.vue - ~200 lines, thin orchestrator -->
<template>
  <div class="home-owner-container">
    <v-row no-gutters class="fill-height">
      <v-col cols="12" lg="3" xl="2">
        <OwnerSidebar
          :today-turns="ownerData.todayTurns"
          :upcoming-cleanings="ownerData.upcomingCleanings"
          :properties="ownerData.properties"
          @navigate-to-booking="ownerActions.navigateToBooking"
          @create-booking="ownerActions.createBooking"
        />
      </v-col>
      <v-col cols="12" lg="9" xl="10">
        <OwnerCalendar
          :events="ownerData.calendarEvents"
          :current-view="calendarState.currentView"
          @event-click="ownerActions.handleEventClick"
          @date-select="ownerActions.handleDateSelect"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
// ✅ GOOD: Thin orchestration layer
const { 
  ownerData, 
  ownerActions, 
  calendarState 
} = useOwnerDashboard();

// ✅ Minimal component-specific logic only (UI concerns)
const sidebarOpen = ref(false);
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value;

// ✅ Simple responsive behavior only
const { xs } = useDisplay();
watch(xs, (newValue) => {
  if (newValue) sidebarOpen.value = false;
});
</script>
```

### **Critical Transformation Metrics**:
- **Before**: ~900 lines with business logic
- **After**: ~200 lines, pure orchestration  
- **Business Logic**: 0 lines (moved to useOwnerDashboard)
- **Component Responsibility**: Pure UI orchestration only

### **Verification Checklist**:
- [ ] **🚨 CRITICAL**: HomeOwner.vue is ~200 lines or less
- [ ] **🚨 CRITICAL**: Uses useOwnerDashboard() for ALL business logic
- [ ] **🚨 CRITICAL**: NO business logic remains in component
- [ ] **🚨 CRITICAL**: All computed properties with business logic removed
- [ ] **🚨 CRITICAL**: All methods with business operations removed
- [ ] Owner interface shows only owner-scoped data
- [ ] Component communication works through composable actions
- [ ] Role-based data isolation maintained through composables
- [ ] UI store integration works through composables
- [ ] Responsive behavior maintained (minimal UI logic only)

### **Dependencies**:
- **CRITICAL**: TASK-060A (useOwnerDashboard) must be complete
- **Standard**: TASK-060 (OwnerSidebar), TASK-061 (OwnerCalendar)

---
## ---------------------------------------------------------------------------------------------------------------------------------
## 🔗 **TASK-066: Transform HomeAdmin.vue into Thin Orchestrator**
**Complexity Rating: 9/10** - CRITICAL architectural transformation

### **🚨 PRIMARY OBJECTIVE**
**Transform HomeAdmin.vue from 1020+ line business logic component into ~200 line thin orchestrator using useAdminDashboard composable**

### **Sequential Thinking Approach**
```
1. **Current State Analysis Phase**: Assess existing HomeAdmin.vue
   - Measure current component size (1020+ lines)
   - Identify all system-wide business logic to extract
   - Map current admin-specific workflows and operations
   - Document current architectural violations

2. **Refactoring Design Phase**: Plan admin orchestrator transformation
   - Design minimal component interface using useAdminDashboard
   - Plan removal of all business logic from component
   - Design admin-specific prop passing and event delegation
   - Plan component size reduction strategy for complex admin operations

3. **Implementation Phase**: Execute admin orchestrator transformation
   - Replace all business logic with useAdminDashboard calls
   - Integrate AdminSidebar and AdminCalendar components
   - Remove all computed properties with system calculations
   - Remove all methods with admin operations (cleaner assignment, etc.)
   - Keep only UI-specific logic (sidebar toggle, responsive behavior)

4. **Admin Integration Testing Phase**: Verify complex admin functionality
   - Test that all admin functionality still works
   - Verify system-wide data access through composables
   - Test admin-specific workflows (cleaner assignment, reporting)
   - Test role switching functionality
   - Ensure no regression in admin experience

5. **Architecture Validation Phase**: Confirm admin transformation success
   - Measure final component size (~200 lines target)
   - Verify no business logic remains in component
   - Confirm admin single source of truth established
   - Validate clean separation of admin concerns
```

### **Context7 Documentation**
```bash
# Complex component orchestration patterns
get-library-docs /vuejs/docs --topic="complex-orchestration admin-patterns enterprise-composition"

# Advanced admin interface patterns
get-library-docs /vuejs/docs --topic="admin-interfaces system-management dashboard-patterns"
```

### **Vuetify RAG Server Usage**
```bash
# Complex admin layouts and orchestration
# Focus on: admin dashboard layouts, complex component coordination
# Key components: v-app, v-navigation-drawer, v-main for admin orchestration
```

### **Implementation Requirements**

#### **BEFORE (Current - WRONG)**:
```vue
<!-- HomeAdmin.vue - 1020+ lines with complex business logic -->
<script setup>
// ❌ BAD: Complex system-wide business logic in component
const systemMetrics = computed(() => {
  // 100+ lines of complex business calculations
});

const assignCleaner = async (bookingId, cleanerId) => {
  // ❌ 150+ lines of cleaner assignment logic
};

const generateReports = async () => {
  // ❌ 200+ lines of reporting logic
};

// ❌ 570+ more lines of admin business logic...
</script>
```

#### **AFTER (Target - CORRECT)**:
```vue
<!-- HomeAdmin.vue - ~200 lines, thin orchestrator -->
<template>
  <div class="home-admin-container">
    <v-row no-gutters class="fill-height">
      <v-col cols="12" lg="3" xl="2">
        <AdminSidebar
          :system-metrics="adminData.systemMetrics"
          :urgent-turns="adminData.urgentTurns"
          :cleaner-queue="adminData.cleanerQueue"
          @assign-cleaner="adminActions.assignCleaner"
          @generate-report="adminActions.generateReport"
        />
      </v-col>
      <v-col cols="12" lg="9" xl="10">
        <AdminCalendar
          :events="adminData.allCalendarEvents"
          :cleaners="adminData.cleaners"
          @assign-cleaner="adminActions.assignCleaner"
          @update-booking-status="adminActions.updateStatus"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
// ✅ GOOD: Thin orchestration layer for complex admin operations
const { 
  adminData, 
  adminActions, 
  systemState 
} = useAdminDashboard();

// ✅ Minimal component-specific logic only (UI concerns)
const sidebarOpen = ref(false);
const toggleSidebar = () => sidebarOpen.value = !sidebarOpen.value;

// ✅ Simple responsive behavior only
const { xs } = useDisplay();
watch(xs, (newValue) => {
  if (newValue) sidebarOpen.value = false;
});
</script>
```

### **Critical Transformation Metrics**:
- **Before**: 1020+ lines with complex business logic
- **After**: ~200 lines, pure orchestration
- **Business Logic**: 0 lines (moved to useAdminDashboard)
- **Admin Operations**: All delegated to composables
- **Component Responsibility**: Pure UI orchestration only

### **Verification Checklist**:
- [ ] **🚨 CRITICAL**: HomeAdmin.vue is ~200 lines or less
- [ ] **🚨 CRITICAL**: Uses useAdminDashboard() for ALL business logic
- [ ] **🚨 CRITICAL**: NO business logic remains in component
- [ ] **🚨 CRITICAL**: All system calculations moved to composables
- [ ] **🚨 CRITICAL**: All admin operations delegated to composables
- [ ] Admin interface shows system-wide data through composables
- [ ] Role switching functionality works through composables
- [ ] All admin-specific features accessible through composable actions
- [ ] Complex admin workflows function through composables
- [ ] Cleaner assignment works through composable actions
- [ ] Business reporting accessible through composable actions
### **Dependencies**:
- **CRITICAL**: TASK-060B (useAdminDashboard) must be complete
- **Standard**: TASK-062 (AdminSidebar), TASK-064 (AdminCalendar)

---
## ---------------------------------------------------------------------------------------------------------------------------------

## 📁 **TASK-067: Move Demo Components to Development Folder**
**Complexity Rating: 3/10** - Low complexity file organization task

### **Sequential Thinking Approach**
```
1. **Inventory Phase**: Catalog all demo components
   - Identify all files in src/components/demos/
   - Find demo pages in src/pages/demos/
   - Locate demo-related files throughout codebase

2. **Planning Phase**: Design development folder structure
   - Create logical src/dev/ folder structure
   - Plan import path update strategy
   - Design build exclusion configuration

3. **Implementation Phase**: Execute file moves
   - Create src/dev/ folder structure
   - Move demo components systematically
   - Update import paths where necessary

4. **Build Configuration**: Configure development exclusion
   - Update Vite config to exclude src/dev/ from production
   - Test that demo components still work in development
   - Verify production build excludes demo code

5. **Documentation**: Create dev folder documentation
   - Create README.md explaining dev folder purpose
   - Document available demo components
```

### **Context7 Documentation**
```bash
# Vite configuration for conditional builds
resolve-library-id "vite"
get-library-docs /vitejs/vite --topic="config-conditional-builds exclude-patterns"
```

### **Vuetify RAG Server Usage**: Not needed for this task

### **Implementation Requirements**
- **Create**: `src/dev/` folder for development-only components
- **Move Files**: 
  - `src/components/demos/` → `src/dev/demos/`
  - `src/pages/demos/` → `src/dev/pages/`
  - `src/components/dumb/PropertyCardDemo.vue` → `src/dev/demos/`
- **Build Config**: Exclude `src/dev/` from production bundle

### **Verification**: Production build excludes demo components, dev server includes them

---
## ---------------------------------------------------------------------------------------------------------------------------------
## 🗑️ **TASK-068: Remove Generic Components + Eliminate Home.vue**
**Complexity Rating: 6/10** - Increased complexity due to Home.vue elimination

### **🚨 PRIMARY OBJECTIVE**
**Remove Home.vue completely to establish HomeOwner and HomeAdmin as true single sources of truth**

### **Sequential Thinking Approach**
```
1. **Pre-Removal Validation Phase**: Ensure prerequisites complete
   - Verify TASK-065 (HomeOwner) is stable as thin orchestrator
   - Verify TASK-066 (HomeAdmin) is stable as thin orchestrator  
   - Confirm both components work independently of Home.vue
   - Test all functionality works through new orchestrators

2. **Home.vue Elimination Planning**: Plan complete removal strategy
   - Identify all references to Home.vue throughout codebase
   - Plan routing updates to bypass Home.vue completely
   - Design direct role-based routing strategy
   - Plan rollback strategy in case of issues

3. **Critical Removal Phase**: Eliminate Home.vue completely
   - Remove Home.vue file (1020+ lines of duplicated logic)
   - Update routing to go directly to HomeOwner/HomeAdmin
   - Remove all imports and references to Home.vue
   - Update navigation patterns to use role-specific routes

4. **Generic Component Cleanup**: Remove redundant components
   - Remove generic Sidebar.vue (replaced by OwnerSidebar/AdminSidebar)
   - Remove generic FullCalendar.vue (replaced by role-specific versions)
   - Update any remaining references to removed components
   - Verify no broken imports remain

5. **Architecture Validation Phase**: Confirm single source of truth
   - Test that only HomeOwner and HomeAdmin serve as orchestrators
   - Verify no generic fallback components exist
   - Confirm true role-based architecture achieved
   - Test all functionality works without generic components
```

### **Context7 Documentation**
```bash
# Vue Router configuration for role-based routing
get-library-docs /vuejs/vue-router --topic="routing-configuration role-based-navigation"

# Component removal and dependency management
get-library-docs /vuejs/docs --topic="component-dependencies refactoring-patterns"
```

### **Vuetify RAG Server Usage**: Not needed for this cleanup task

### **Implementation Requirements**

#### **🚨 CRITICAL: Home.vue Removal (Priority #1)**
```typescript
// BEFORE (WRONG): Generic routing through Home.vue
{
  path: '/',
  name: 'Home', 
  component: () => import('@/components/smart/Home.vue') // ❌ REMOVE THIS
}

// AFTER (CORRECT): Direct role-based routing
{
  path: '/owner',
  name: 'Owner',
  component: () => import('@/components/smart/owner/HomeOwner.vue')
},
{
  path: '/admin', 
  name: 'Admin',
  component: () => import('@/components/smart/admin/HomeAdmin.vue')
},
{
  path: '/',
  redirect: '/owner' // or '/admin' based on auth
}
```

#### **Generic Component Removal Priority**:
1. **Home.vue** - CRITICAL (eliminates 1020+ lines of duplication)
2. **Sidebar.vue** - HIGH (replaced by OwnerSidebar/AdminSidebar)  
3. **FullCalendar.vue** - MEDIUM (replaced by role-specific calendars)

#### **Files to Remove**:
- ❌ `src/components/smart/Home.vue` (CRITICAL - most important)
- ❌ `src/components/smart/Sidebar.vue` 
- ❌ `src/components/smart/FullCalendar.vue` (if replaced)

### **Before/After Architecture Impact**:
- **Before**: 3 orchestrators (Home.vue, HomeOwner.vue, HomeAdmin.vue) = confusion
- **After**: 2 orchestrators (HomeOwner.vue, HomeAdmin.vue) = true single sources of truth
- **Code Reduction**: Eliminates 1020+ lines of duplicated business logic
- **Maintenance**: Changes only need to happen in role-specific orchestrators

### **Verification Checklist**:
- [ ] **🚨 CRITICAL**: Home.vue file completely removed
- [ ] **🚨 CRITICAL**: All routing bypasses Home.vue completely  
- [ ] **🚨 CRITICAL**: Only HomeOwner and HomeAdmin exist as orchestrators
- [ ] **🚨 CRITICAL**: No generic fallback components remain
- [ ] Application works without old generic components
- [ ] No broken imports or references remain
- [ ] Role-based routing works correctly
- [ ] Both owner and admin interfaces function independently

### **Dependencies**:
- **CRITICAL**: TASK-065 (HomeOwner thin orchestrator) must be stable
- **CRITICAL**: TASK-066 (HomeAdmin thin orchestrator) must be stable  
- **WARNING**: Do not proceed until both role-specific orchestrators work independently

### **Rollback Strategy**:
- Keep backup of Home.vue until verification complete
- Test thoroughly before permanent removal
- Ensure both role-specific interfaces work before removing generic components

---

## 📝 **TASK-069: Clean Up tasks.md File**
**Complexity Rating: 3/10** - Low complexity documentation organization

### **Sequential Thinking Approach**
```
1. **Analysis Phase**: Review current tasks.md state
   - Identify completed tasks that can be archived
   - Find obsolete or superseded tasks
   - Assess current organization and numbering

2. **Organization Design**: Plan improved structure
   - Design logical task grouping by phase/priority
   - Plan consistent numbering system
   - Design cross-reference system for related tasks

3. **Archival Phase**: Move completed tasks
   - Create docs/completed-tasks.md structure
   - Move completed tasks with their history
   - Preserve task completion information

4. **Reorganization Phase**: Restructure remaining tasks
   - Group tasks by phase and priority
   - Update task numbering for consistency
   - Add cross-references between related tasks

5. **Status Update**: Refresh task statuses
   - Update partially completed task statuses
   - Add current progress notes
   - Verify task assignments and dependencies
```

### **Context7 Documentation**: Not needed for this task

### **Vuetify RAG Server Usage**: Not needed for this task

### **Implementation Requirements**
- **Archive**: Completed tasks to `docs/completed-tasks.md`
- **Remove**: Obsolete or superseded tasks
- **Reorganize**: Remaining tasks by current priority
- **Update**: Task numbering for consistency
- **Add**: Cross-references between related tasks

### **Verification**: tasks.md is organized and current

---
## ---------------------------------------------------------------------------------------------------------------------------------
## ⚙️ **TASK-070: Optimize Build Configuration for Role-Based Architecture**
**Complexity Rating: 6/10** - Medium-high complexity build optimization

### **Sequential Thinking Approach**
```
1. **Current State Analysis**: Assess build performance
   - Analyze current Vite configuration
   - Measure current build times and bundle sizes
   - Identify role-based architecture impact on builds

2. **Optimization Planning**: Design build improvements
   - Plan role-based component bundling strategy
   - Design build-time feature flags for roles
   - Plan development vs production optimization differences

3. **Configuration Implementation**: Apply optimizations
   - Configure Vite for optimal role-based bundling
   - Implement build-time type checking
   - Add build performance monitoring
   - Configure source maps for debugging

4. **Feature Flag Implementation**: Add role-based flags
   - Implement build-time role-based feature flags
   - Configure conditional compilation for roles
   - Optimize bundle sizes for production

5. **Validation Phase**: Test build optimizations
   - Measure improvement in build times
   - Verify bundle size optimizations
   - Test development debugging capabilities
```

### **Context7 Documentation**
```bash
# Vite advanced configuration
resolve-library-id "vite"
get-library-docs /vitejs/vite --topic="advanced-config bundle-optimization build-performance"

# TypeScript build integration
get-library-docs /microsoft/typescript --topic="build-integration performance-optimization"

# Vue.js build optimization patterns
get-library-docs /vuejs/docs --topic="build-optimization production-builds"
```

### **Vuetify RAG Server Usage**
```bash
# Build optimization for Vuetify components
# Focus on: tree-shaking, component importing, theme optimization
```

### **Implementation Requirements**
- **File**: `vite.config.ts`, build scripts, optimization configs
- **Features**: 
  - Vite optimization for role-based bundling
  - Build-time role-based feature flags
  - Bundle size optimization for production
  - Build-time type checking
  - Source maps for development debugging
  - Build performance monitoring

### **Verification**: Optimized production builds with role-based features

---

## 🚨 **CRITICAL ARCHITECTURAL SUCCESS METRICS**

### **Before Architectural Improvements**:
- ❌ 3 orchestrator components (Home.vue, HomeOwner.vue, HomeAdmin.vue)
- ❌ 2940+ lines of duplicated business logic
- ❌ Business logic scattered across components
- ❌ Inconsistent single source of truth
- ❌ HomeOwner.vue: ~900 lines with business logic
- ❌ HomeAdmin.vue: 1020+ lines with business logic
- ❌ Home.vue: 1020+ lines of duplicated logic

### **After Architectural Improvements**:
- ✅ 2 thin orchestrator components (HomeOwner.vue, HomeAdmin.vue)
- ✅ Business logic centralized in dashboard composables
- ✅ True single sources of truth established
- ✅ HomeOwner.vue: ~200 lines, pure orchestration
- ✅ HomeAdmin.vue: ~200 lines, pure orchestration
- ✅ Home.vue: Eliminated completely
- ✅ 2740+ lines of business logic properly abstracted

### **Quality Improvements**:
- **Maintainability**: Business logic changes in composables, not components
- **Testability**: Pure composables easy to unit test in isolation
- **Performance**: Optimized reactivity through proper separation of concerns
- **Developer Experience**: Clear architectural patterns and component responsibilities
- **Type Safety**: Comprehensive TypeScript support for new dashboard patterns
- **Code Reuse**: Business logic reusable across different UI contexts

---

## ⚠️ **CRITICAL IMPLEMENTATION WARNINGS**

### **MANDATORY DEPENDENCIES**:
1. **TASK-060A (useOwnerDashboard) MUST be completed before TASK-065**
2. **TASK-060B (useAdminDashboard) MUST be completed before TASK-066**  
3. **TASK-065 and TASK-066 MUST be stable before TASK-068 (Home.vue removal)**
4. **All role-specific components MUST work independently before removing generic ones**

### **VALIDATION CHECKPOINTS**:
- **After TASK-060A**: Verify useOwnerDashboard composable works in isolation
- **After TASK-060B**: Verify useAdminDashboard composable works in isolation
- **After TASK-065**: Measure HomeOwner.vue line count (target: ~200 lines)
- **After TASK-066**: Measure HomeAdmin.vue line count (target: ~200 lines)
- **Before TASK-068**: Verify both orchestrators work independently of Home.vue

### **ROLLBACK STRATEGY**:
```
1. Keep Home.vue until TASK-065 and TASK-066 are verified stable
2. Maintain generic components until role-specific versions are proven
3. Test each transformation thoroughly before proceeding to next task
4. Have backup plan to restore previous architecture if issues arise
```

### **COMPONENT SIZE ENFORCEMENT**:
```typescript
// Build-time validation (implement in TASK-070)
const MAX_ORCHESTRATOR_LINES = 250; // Allow some buffer over 200
const validateComponentSize = (filePath: string) => {
  if (filePath.includes('HomeOwner.vue') || filePath.includes('HomeAdmin.vue')) {
    const lineCount = countLines(filePath);
    if (lineCount > MAX_ORCHESTRATOR_LINES) {
      throw new Error(`${filePath} has ${lineCount} lines, exceeds ${MAX_ORCHESTRATOR_LINES} limit`);
    }
  }
};
```

---

## 📋 **UPDATED TASK EXECUTION ORDER**

### **Phase 1: Foundation (Week 1)**
1. **TASK-060A**: Create useOwnerDashboard composable
2. **TASK-060B**: Create useAdminDashboard composable
3. **TASK-061**: Create OwnerCalendar.vue (enhanced with logic extraction)
4. **TASK-062**: Create AdminSidebar.vue (enhanced with logic extraction)
5. **TASK-063**: Fix TypeScript + add dashboard types
6. **TASK-064**: Fix AdminCalendar.vue (enhanced with logic extraction)

### **Phase 2: Orchestrator Transformation (Week 1-2)**
7. **TASK-065**: Transform HomeOwner.vue into thin orchestrator
8. **TASK-066**: Transform HomeAdmin.vue into thin orchestrator

### **Phase 3: Cleanup & Validation (Week 2)**
9. **TASK-067**: Move demo components to development folder
10. **TASK-068**: Remove generic components + eliminate Home.vue
11. **TASK-069**: Clean up tasks.md + add architecture documentation
12. **TASK-070**: Optimize build + add architecture validation

---

## 🎯 **PROJECT TRANSFORMATION IMPACT**

This enhanced task sequence will transform your codebase from:

**Current Architecture (Problematic)**:
- Multiple competing "single sources of truth"
- 2940+ lines of duplicated business logic
- Business logic scattered across UI components
- Maintenance nightmare for business rule changes

**Target Architecture (Clean)**:
- True single sources of truth (HomeOwner, HomeAdmin)
- Business logic centralized in testable composables
- Thin orchestrator components (~200 lines each)
- Clean separation of concerns and maintainable codebase

The architectural improvements integrated into these tasks will eliminate the fundamental issues identified in the codebase analysis and establish a truly maintainable, role-based architecture.