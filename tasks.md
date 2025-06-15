# 📋 TASK.md - Property Cleaning Scheduler

## **Project Setup & Foundation**

### **Environment Setup**
- [x] **TASK-001**: Set up Context7 MCP in Cursor
  - Status: Complete
  - Notes: Configured Context7 MCP for Vue 3, Vuetify, FullCalendar.io, and Supabase documentation access
  - Assigned to: Human + Cursor

- [x] **TASK-002**: Create project folder structure
  - Status: Complete
  - Notes: Created directory structure according to project architecture in /property-cleaning-scheduler
  - Assigned to: Cursor

- [x] **TASK-003**: Initialize Vite + Vue 3 + TypeScript project
  - Status: Complete
  - Notes: Created a Vue 3 project with TypeScript, Vite, Vue Router, and Pinia
  - Dependencies: npm create vue@latest property-cleaning-scheduler
  - Assigned to: Cursor

- [x] **TASK-004**: Install and configure dependencies
  - Status: Complete
  - Notes: Installed and configured Vuetify, Supabase, FullCalendar, and other required dependencies
  - Dependencies: vuetify, pinia, vue-router, @supabase/supabase-js, @fullcalendar/vue3
  - Assigned to: Cursor

- [x] **TASK-005**: Configure tsconfig.json with path aliases
  - Status: Complete
  - Notes: Updated tsconfig.json and vite.config.ts with path aliases for all project directories
  - Requirements: @/ alias, strict TypeScript settings
  - Assigned to: Cursor

### **Documentation Setup**
- [ ] **TASK-006**: Create docs/ folder and save essential references
  - Status: Not Started
  - Notes: 
  - Files: summary.md, vue-patterns.md, architecture-patterns.md, business-logic.md
  - Assigned to: Human

- [x] **TASK-007**: Test basic project setup with Hello World
  - Status: Complete
  - Notes: Created a HelloWorld component and verified that the application runs successfully with Vite
  - Verification: npm run dev works, TypeScript compiles
  - Assigned to: Cursor

---

## **Phase 1A: Core Types & Store Foundation**

### **TypeScript Interfaces**
- [x] **TASK-008**: Create core types in src/types/
  - Status: Complete
  - Notes: Created all core type files with comprehensive interfaces and type guards
  - Files: user.ts, property.ts, booking.ts, ui.ts, api.ts, index.ts
  - Assigned to: Cursor

- [x] **TASK-009**: Create User interface with role-based typing
  - Status: Complete
  - Notes: Implemented User interface with role-based typing and type guards for different roles
  - Requirements: 'owner' | 'admin' | 'cleaner' roles, settings object
  - Assigned to: Cursor

- [x] **TASK-010**: Create Property interface with business logic types
  - Status: Complete
  - Notes: Created Property interface with pricing tiers, cleaning duration, and business metrics
  - Requirements: pricing_tier, cleaning_duration, special_instructions
  - Assigned to: Cursor

- [x] **TASK-011**: Create Booking interface with turn/standard distinction
  - Status: Complete
  - Notes: Created Booking interface with turn/standard distinction, status workflow, and priority system
  - Requirements: booking_type ('standard' | 'turn'), status workflow
  - Assigned to: Cursor

### **Pinia Stores**
- [x] **TASK-012**: Create user store with Map collections
  - Status: Complete
  - Notes: Created user store with Map collections for houses and events, with computed getters and full CRUD operations
  - Requirements: houses Map, events Map, computed getters
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-013**: Create property store with Map collections
  - Status: Complete
  - Notes: Created property store with Map collections, comprehensive computed getters for filtering, and full CRUD operations
  - Requirements: properties Map, computed getters, filtering by active/owner/pricing tier
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-014**: Create booking store with Map collections
  - Status: Complete
  - Notes: Created booking store with Map collections, specialized getters for filtering by status/type/property/date range
  - Requirements: bookings Map, status management, cleaner assignment
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-015**: Create UI store for modal and sidebar management
  - Status: Complete
  - Notes: Created UI store with Map collections for modals, sidebars, loading states, notifications, and filtering
  - Requirements: modals Map, sidebars Map, loading states, error handling, filter management
  - Verification: Modal, sidebar, and notification systems working correctly
  - Assigned to: Cursor

---

## **Phase 1B: Core Composables & Business Logic**

### **Composables**
- [x] **TASK-016**: Create useBookings composable
  - Status: Complete
  - Notes: Implemented CRUD operations, validation, error handling, and business logic for calculating cleaning windows and priorities
  - Requirements: CRUD operations, error handling, store integration
  - Reference: docs/business-logic.md
  - Assigned to: Cursor

- [x] **TASK-017**: Create useProperties composable
  - Status: Complete
  - Notes: Created composable for property management with validation, metrics calculation, and store integration
  - Requirements: property management, validation
  - Assigned to: Cursor

- [x] **TASK-018**: Create useAuth composable (mock for now)
  - Status: Complete
  - Notes: Implemented mock authentication with login/logout, user registration, and settings management
  - Requirements: login/logout, user management
  - Assigned to: Cursor

- [x] **TASK-019**: Create useCalendarState composable
  - Status: Complete
  - Notes: Implemented calendar view state management with date range handling, navigation, filtering, and event formatting
  - Requirements: calendar view management, date handling
  - Assigned to: Cursor

### **Business Logic Utils**
- [x] **TASK-020**: Implement turn vs standard booking logic
  - Status: Complete
  - Notes: Implemented comprehensive business logic utilities in src/utils/businessLogic.ts including priority calculation (calculateBookingPriority), cleaning window calculation (getCleaningWindow), and scheduling validation (canScheduleCleaning). These functions handle the distinct requirements for turn vs standard bookings, with appropriate timing buffers and constraints.
  - Requirements: priority calculation, cleaning window calculation
  - Reference: docs/business-logic.md
  - Assigned to: Cursor

- [x] **TASK-021**: Create booking validation functions
  - Status: Complete
  - Notes: Added validation functions to src/utils/businessLogic.ts including time conflict detection (detectBookingConflicts), turn booking validation (validateTurnBooking), and general booking validation (validateBooking). Implemented comprehensive error message generation and warning system. Also added workflow status management functions (getAvailableStatusTransitions, canTransitionBookingStatus).
  - Requirements: time conflict detection, turn booking validation
  - Assigned to: Cursor

---

## **Phase 1C: Basic Component Structure**

### **Layout Components**
- [X] **TASK-022**: Create basic layout structure
  - Status: Not Started
  - Notes:  Complete
  - Files: layouts/default.vue, layouts/admin.vue
  - Assigned to: Cursor

- [x] **TASK-023**: Set up Vue Router with file-based structure
  - Status: Complete
  - Notes: Implemented file-based routing with layout switching for all required routes (/, /properties, /calendar, /admin) and auth routes. Created necessary page components and updated App.vue to support multiple layouts.
  - Routes: /, /properties, /calendar, /admin
  - Assigned to: Cursor

### **Dumb Components (Pure UI)**
- [x] **TASK-024**: Create PropertyCard component
  - Status: Complete
  - Notes: Created a reusable PropertyCard dumb component using Vuetify's v-card that displays property information (name, address, cleaning duration, pricing tier, active status, special instructions) and provides edit/delete actions through emitted events. Implemented proper TypeScript typing, color-coded property status indicators, truncation for long text with tooltips, and hover effects for better UX. Also created a demo component and route (/demos/property-card) to showcase the component with sample properties.
  - Requirements: display property info, edit/delete actions
  - Reference: docs/vue-patterns.md
  - Assigned to: Cursor

- [x] **TASK-025**: Create BookingForm/EventModal component
  - Status: Complete
  - Notes: Created a comprehensive BookingForm component using Vuetify's dialog, form, and validation components. Implemented dynamic form fields, proper validation, and special handling for turn vs standard bookings. The form includes auto-detection of booking type based on dates, alerts for inconsistent booking types, and proper TypeScript type safety. Created a demo component and route (/demos/booking-form) to showcase both create and edit functionality.
  - Requirements: create/edit bookings, validation, turn vs standard
  - Assigned to: Cursor

- [x] **TASK-026**: Create TurnAlerts component
  - Status: Complete
  - Notes: Created a reusable TurnAlerts dumb component that displays turn bookings (same-day checkout/checkin) with priority indicators. Implemented color-coded alerts with "urgent" (red) and "high" (orange) priority levels, expandable interface with booking details, and action buttons for viewing and assigning cleaners. Added demo component with sample data generation to showcase the component's functionality.
  - Requirements: urgent turn notifications, navigation
  - Assigned to: Cursor

- [x] **TASK-027**: Create UpcomingCleanings component
  - Status: Complete
  - Notes: Created a comprehensive UpcomingCleanings component that displays cleanings grouped by date (today, tomorrow, upcoming). Implemented time management features including cleaning windows, checkout/checkin times, and color-coded indicators for booking types and priorities. Added a demo component for testing. Component supports filtering by date range and shows "View all" options for each section when there are more cleanings than the configured limit.
  - Requirements: cleaning schedule display, time management
  - Assigned to: Cursor

### **Smart Components (Business Logic)**
- [x] **TASK-028**: Create Sidebar component (smart)
  - Status: Complete
  - Notes: Created a smart Sidebar component that integrates TurnAlerts and UpcomingCleanings, implements PropertyFilter functionality, and includes QuickActions. The component follows the Map collections pattern, connects to the UI store, and uses proper TypeScript typing with comprehensive error handling. Added a SidebarDemo component and demo page for testing.
  - Requirements: turn alerts, property filter, quick actions
  - Reference: docs/architecture-patterns.md
  - Assigned to: Cursor

- [x] **TASK-029**: Create FullCalendar component integration
  - Status: Complete
  - Notes: Implemented a comprehensive FullCalendar integration as a smart component that follows the project's Map collection pattern. Created a reusable FullCalendar.vue component that displays bookings with proper type distinction (turn vs standard), supports drag-and-drop for scheduling, provides date selection for new bookings, and integrates with the UI store for modal management. Turn bookings are visually highlighted with distinct colors and animations to indicate priority. Added custom event rendering to show property information and booking status. Created a FullCalendarDemo.vue component for testing and a demo page. Updated the calendar page to use the FullCalendar component with proper store integration.
  - Requirements: booking display, drag/drop, turn highlighting
  - Dependencies: @fullcalendar/vue3 setup
  - Assigned to: Cursor

### **Central Orchestrator**
- [x] **TASK-030**: Create Home.vue as central orchestrator
  - Status: Complete
  - Notes: Created Home.vue component that acts as a central orchestrator coordinating between Sidebar and FullCalendar components. Implemented proper data flow from stores to components, event handling between components, and modal management. Used Map collections for state and implemented responsive design.
  - Requirements: coordinate Sidebar ↔ Calendar, manage modal states
  - Reference: docs/architecture-patterns.md
  - Assigned to: Cursor

---

## **Phase 1D: Integration & Testing**

### **Component Integration**
- [x] **TASK-031**: Integrate all components in Home.vue
  - Status: Complete
  - Notes: Updated Home.vue to properly integrate all components following the central orchestrator pattern. Added proper event handling for all components, implemented Map collections for state management, and prepared placeholders for future PropertyModal and NotificationSystem components. Created a minimal auth.ts store to support authentication functionality.
  - Requirements: proper data flow, event handling, state management
  - Assigned to: Cursor

- [x] **TASK-032**: Implement modal management system
  - Status: Complete
  - Notes: Implemented a comprehensive modal management system with event modal, property modal, and confirmation dialogs. Added UI store support for confirmation dialogs with a Map collection pattern. Created PropertyModal and ConfirmationDialog components and integrated them with Home.vue. Updated event deletion to use confirmation dialogs for better UX.
  - Requirements: event modal, property modal, confirmation dialogs
  - Assigned to: Cursor

- [x] **TASK-033**: Test component communication
  - Status: Complete
  - Notes: Implemented a comprehensive component communication testing system with event logging. Created a debug panel (DebugPanel.vue) that displays all component communication events in real-time. Added event logging to Sidebar, Home, and FullCalendar components to track data flow. Created documentation (component-communication-testing.md) with detailed testing procedures for all communication paths.
  - Verification: Sidebar → Home → Calendar data flow works, visually verified through debug panel
  - Assigned to: Cursor

### **Basic Functionality Testing**
- [x] **TASK-034**: Test property CRUD operations
  - Status: Complete
  - Notes: Created comprehensive testing page at /testing/crud with UI for all property CRUD operations. Implemented individual test functions for each operation with proper error handling and status reporting. Tests include property creation, reading properties from store, updating properties, and deleting properties with validation for associated bookings.
  - Verification: create, edit, delete properties work
  - Assigned to: Cursor

- [x] **TASK-035**: Test booking CRUD operations
  - Status: Complete
  - Notes: Implemented booking CRUD testing in the /testing/crud page with comprehensive test cases. Created test functions for creating, reading, updating and deleting bookings with proper store integration. Implemented tests for both turn and standard booking types with appropriate validation.
  - Verification: create, edit, delete bookings work, turn vs standard
  - Assigned to: Cursor

- [x] **TASK-036**: Test calendar integration
  - Status: Complete
  - Notes: Implemented calendar integration testing in the /testing/crud page with a live FullCalendar instance. Created tests for event display, turn booking highlighting, and drag-and-drop functionality. Test cases verify that bookings appear correctly on the calendar with appropriate styling for turn vs standard bookings.
  - Verification: events display, drag/drop works, turn highlighting
  - Assigned to: Cursor

### **UI/UX Polish**
- [x] **TASK-037**: Style components with Vuetify theme
  - Status: Complete
  - Notes: Implemented comprehensive styling with consistent theme, improved responsiveness, and better visual hierarchy. Updated color palette for clearer turn vs standard booking distinction, added theme toggle, and enhanced component styling for better user experience.
  - Requirements: consistent styling, responsive design
  - Assigned to: Cursor

- [x] **TASK-037b**: Implement multiple themes with theme picker
  - Status: Complete
  - Notes: Created 8 distinct themes (light, dark, green, purple, orange, teal, red, brown) with both light and dark variants. Implemented a ThemePicker component in the app-bar that displays a grid of theme options. Added theme persistence using localStorage and smooth transition animations between themes. All components properly apply the selected theme.
  - Requirements: multiple themes, theme picker in app-bar, theme persistence
  - Assigned to: Cursor

- [x] **TASK-037c**: Create a project_summaryV2.md that is updated with the current codebase
  - Status: Complete
  - Notes: Created comprehensive project_summaryV2.md that reflects the current state of the MVP implementation. Documented all implemented features, architectural patterns, component communication system, testing setup, and development guidelines. The document serves as both a status update and developer reference for the fully functional Property Cleaning Scheduler application.
  - Requirements: Updated project summary reflecting current implementation status
  - Assigned to: Cursor
## **Phase 1D.5: Role-Based Architecture Split** 
**(NEW - Insert Before Current Phase 1E)**

### **Folder Structure & Organization**
- [x] **TASK-039A**: Create role-based folder structure
  - Status: Complete
  - Requirements:
    - ✅ Create `components/smart/owner/` folder
    - ✅ Create `components/smart/admin/` folder
    - ✅ Create `components/smart/shared/` folder
    - ✅ Create `composables/owner/` folder  
    - ✅ Create `composables/admin/` folder
    - ✅ Create `composables/shared/` folder
    - ✅ Move existing composables to `shared/` as base implementations
  - Notes: Successfully reorganized code into role-based folder structure. All existing composables moved to shared/ folder and import paths updated throughout the application. Created comprehensive README files for each new folder documenting purpose, architecture patterns, and future development guidelines. Folder structure now supports multi-tenant role-based development.
  - Implementation Details:
    - Created role-based folder structure for components/smart/ (owner/, admin/, shared/)
    - Created role-based folder structure for composables/ (owner/, admin/, shared/)  
    - Moved all existing composables (useAuth, useBookings, useProperties, useCalendarState, useComponentEventLogger) to shared/ folder
    - Updated import paths in all consuming components (Home.vue, Home2.vue, Sidebar.vue, FullCalendar.vue, auth pages, admin layout, calendar pages, crud-testing page)
    - Added comprehensive README documentation for each new folder explaining role-based architecture patterns
    - Verified dev server starts successfully with new folder structure
  - Verification: ✅ Existing app still works after folder reorganization (dev server runs successfully)
  - Assigned to: Cursor

- [x] **TASK-039B**: Move existing composables to shared folder
  - Status: Complete
  - Requirements:
    - ✅ Move `useBookings.ts` → `composables/shared/useBookings.ts`
    - ✅ Move `useProperties.ts` → `composables/shared/useProperties.ts`
    - ✅ Move `useCalendarState.ts` → `composables/shared/useCalendarState.ts`
    - ✅ Move `useAuth.ts` → `composables/shared/useAuth.ts`
    - ✅ Update all import paths in existing components
  - Notes: Completed as part of TASK-039A implementation. All existing composables (useAuth, useBookings, useProperties, useCalendarState, useComponentEventLogger) have been successfully moved to the shared/ folder and import paths updated throughout the application.
  - Implementation Details:
    - All 5 composables successfully moved to `src/composables/shared/` folder
    - Import paths updated in all consuming components including: Home.vue, Sidebar.vue, FullCalendar.vue, auth pages, admin layout, calendar pages, and crud-testing page
    - Verified correct import pattern: `from '@/composables/shared/useXxx'`
    - No old import paths remaining (verified via grep search)
    - Dev server runs successfully with new import structure
  - Verification: ✅ All existing components import correctly from shared folder, dev server starts successfully
  - Assigned to: Cursor

### **Owner-Specific Smart Components**
- [x] **TASK-039C**: Create HomeOwner.vue component
  - Status: Complete
  - Requirements:
    - ✅ Copy existing `Home.vue` as starting point
    - ✅ Filter data to show only current user's properties and bookings
    - ✅ Use `OwnerSidebar.vue` and `OwnerCalendar.vue` (to be created) - prepared with TODO comments
    - ✅ Add role-specific quick actions (Add Property, Add Booking)
    - ✅ Remove admin-only features (cleaner assignment, system-wide reporting)
    - ✅ Implement owner-specific error handling
  - Data Scope: `bookings.filter(b => b.owner_id === currentUser.id)` ✅
  - Navigation: Simple property filter, basic calendar views ✅
  - Implementation Details:
    - Created `src/components/smart/owner/HomeOwner.vue` with role-based data filtering
    - All computed properties filter by `owner_id === currentUser.id`
    - Added owner-specific quick actions in calendar header
    - Implemented owner-friendly error messages
    - Prepared for future OwnerSidebar and OwnerCalendar integration
    - Uses existing Sidebar and FullCalendar components with filtered data
    - Added owner-specific styling and animations
  - Notes: Component implements core role-based filtering functionality. Some TypeScript type issues remain that need resolution in follow-up tasks. Component is ready for integration with future owner-specific child components.
  - Assigned to: Cursor

- [x] **TASK-039D**: Create OwnerSidebar.vue component
  - Status: Complete
  - Requirements:
    - ✅ Show only owner's properties in property filter
    - ✅ Display turn alerts for owner's properties only
    - ✅ Display upcoming cleanings for owner's properties only
    - ✅ Add "Add Property" and "Add Booking" quick action buttons
    - ✅ Remove admin-only sections (cleaner management, system reports)
    - ✅ Show owner-specific metrics (their properties count, their bookings)
  - Features:
    - ✅ Property filter dropdown (owner's properties only)
    - ✅ Today's turns section (owner's turns only)
    - ✅ Upcoming cleanings (next 7 days, owner only)
    - ✅ Quick actions: "Add Property", "Add Booking", "View Calendar"
  - Implementation Details:
    - Created OwnerSidebar.vue component with role-based data filtering
    - All data filtered by `owner_id === currentUser.id`
    - Added owner-specific metrics display (property count, booking count)
    - Replaced "Assign" buttons with "View" buttons (no cleaner assignment for owners)
    - Added "View My Calendar" quick action button
    - Integrated with existing TurnAlerts and UpcomingCleanings dumb components
    - Updated HomeOwner.vue to use OwnerSidebar instead of generic Sidebar
    - Created OwnerSidebarDemo.vue and demo page for testing
    - Follows established Map collection patterns and event logging
  - Notes: Component successfully filters all data to show only current owner's properties and bookings. Removes admin-only features while maintaining the same UI structure and event communication patterns. Ready for integration with future owner-specific composables.
  - Assigned to: Cursor

- [x] **TASK-039E**: Create OwnerCalendar.vue component
  - Status: Complete
  - Requirements:
    - Filter calendar events to show only owner's bookings
    - Simpler calendar controls (basic views: month, week, day)
    - Remove admin features (cleaner assignment, drag-to-assign)
    - Keep basic booking editing (click to edit owner's bookings)
    - Highlight turn bookings with owner-focused messaging
    - Add owner-specific context menu items
  - Features:
    - Basic FullCalendar integration with owner data filter
    - Event click → open booking modal for editing
    - Date click → create new booking modal
    - Turn booking highlighting (owner's turns only)
    - No cleaner assignment interface
  - Notes: Successfully implemented OwnerCalendar.vue component with role-based data filtering, simplified UI optimized for property owners, owner-specific color scheme and messaging, demo component with sample data, and proper integration with existing Map collection patterns. Component removes admin features while maintaining core calendar functionality for owner use cases.
  - Assigned to: Cursor

### **Admin-Specific Smart Components**
- [x] **TASK-039F**: Create HomeAdmin.vue component  
  - Status: Complete
  - Requirements:
    - ✅ Copy existing `Home.vue` as starting point
    - ✅ Show ALL properties and bookings (no filtering)
    - ✅ Use `AdminSidebar.vue` and `AdminCalendar.vue` (using generic components with TODO comments)
    - ✅ Add admin-specific quick actions (Assign Cleaners, Generate Reports, Manage System)
    - ✅ Add system-wide turn management
    - ✅ Implement admin-specific error handling and notifications
  - Data Scope: All bookings, all properties (no filtering) ✅
  - Navigation: Advanced filters, multiple calendar views, cleaner management ✅
  - Implementation Notes:
    - Created comprehensive HomeAdmin.vue component (1020 lines) with full admin functionality
    - Shows ALL data across ALL property owners (no owner filtering)
    - Implements system-wide metrics display: properties, bookings, urgent turns, upcoming cleanings
    - Admin-specific quick actions: "Assign Cleaners", "Reports", "Manage System"
    - Uses generic Sidebar and FullCalendar components with TODO comments for future AdminSidebar/AdminCalendar
    - Admin-specific error handling with business impact warnings
    - Created HomeAdminDemo.vue with comprehensive testing data across multiple owners
    - Added demo route: `/demos/home-admin` for testing
    - Component follows role-based architecture: admin sees ALL data, owner sees only their data
  - Files Created:
    - `src/components/smart/admin/HomeAdmin.vue` - Main admin interface component
    - `src/components/smart/admin/HomeAdminDemo.vue` - Demo component with sample data
    - `src/components/smart/admin/README.md` - Documentation
  - Demo Route: `/demos/home-admin`
  - Assigned to: Cursor

- [ ] **TASK-039G**: Create AdminSidebar.vue component
  - Status: Not Started  
  - Requirements:
    - Show ALL properties in advanced property filter
    - Display system-wide turn alerts (all urgent turns)
    - Display system-wide cleaning metrics
    - Add admin quick actions (Assign Cleaners, View Reports, Manage Cleaners)
    - Add business analytics section (total properties, active cleanings)
    - Include cleaner availability section
  - Features:
    - Advanced property filter (all properties, by owner, by status)
    - System-wide urgent turns (all properties)
    - Cleaner assignment queue
    - Quick actions: "Assign Cleaners", "Generate Report", "Manage Schedule"
    - Business metrics dashboard
  - Assigned to: Cursor

- [ ] **TASK-039H**: Create AdminCalendar.vue component
  - Status: Not Started
  - Requirements:
    - Show ALL bookings across all properties
    - Advanced calendar controls (multiple views, advanced filters)
    - Cleaner assignment interface (drag-to-assign, right-click assign)
    - Booking status management (pending → scheduled → completed)
    - Advanced context menus with admin actions
    - Color coding by cleaner assignment status
  - Features:
    - FullCalendar with all bookings data
    - Cleaner assignment drag-and-drop
    - Advanced filtering (by status, by cleaner, by property owner)
    - Booking status workflow management
    - System-wide turn prioritization view
  - Assigned to: Cursor

### **Owner-Specific Composables**
- [ ] **TASK-039I**: Create useOwnerBookings.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useBookings.ts` functionality
    - Filter all operations to current owner's bookings only
    - Implement owner-specific validation rules
    - Add owner-specific error messages
    - Remove admin-only functions (cleaner assignment)
  - Functions:
    - `fetchMyBookings()` - get current user's bookings only
    - `createMyBooking(data)` - create booking with current user as owner
    - `updateMyBooking(id, data)` - update only if user owns the booking
    - `deleteMyBooking(id)` - delete only if user owns the booking
    - `getMyTodayTurns()` - today's turns for current user only
    - `getMyUpcomingCleanings()` - upcoming cleanings for current user
  - Assigned to: Cursor

- [ ] **TASK-039J**: Create useOwnerProperties.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useProperties.ts` functionality
    - Filter all operations to current owner's properties only
    - Implement owner-specific property validation
    - Add owner-specific metrics calculation
    - Remove admin-only property management functions
  - Functions:
    - `fetchMyProperties()` - get current user's properties only
    - `createMyProperty(data)` - create property with current user as owner
    - `updateMyProperty(id, data)` - update only if user owns the property
    - `deleteMyProperty(id)` - delete only if user owns (check for bookings)
    - `getMyPropertyMetrics()` - metrics for current user's properties
  - Assigned to: Cursor

- [ ] **TASK-039K**: Create useOwnerCalendarState.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useCalendarState.ts` functionality
    - Filter calendar data to current owner's events only
    - Implement owner-specific calendar views and navigation
    - Add owner-specific date/time utilities
    - Remove admin calendar features
  - Functions:
    - `getOwnerCalendarEvents()` - format owner's bookings for calendar
    - `handleOwnerDateSelect()` - create booking for owner's property
    - `handleOwnerEventClick()` - edit owner's booking
    - `getOwnerTurnAlerts()` - owner's urgent turns only
    - `filterByOwnerProperty(propertyId)` - filter owner's calendar
  - Assigned to: Cursor

### **Admin-Specific Composables**
- [ ] **TASK-039L**: Create useAdminBookings.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useBookings.ts` functionality
    - No filtering - access ALL bookings across all owners
    - Add admin-specific functions (cleaner assignment, status management)
    - Implement system-wide analytics and reporting
    - Add bulk operations for managing multiple bookings
  - Functions:
    - `fetchAllBookings()` - get ALL bookings (no owner filter)
    - `assignCleaner(bookingId, cleanerId)` - assign cleaner to booking
    - `updateBookingStatus(bookingId, status)` - manage booking workflow
    - `getSystemTurns()` - all urgent turns across all properties
    - `getUnassignedBookings()` - bookings without assigned cleaners
    - `bulkAssignCleaner(bookingIds, cleanerId)` - bulk cleaner assignment
  - Assigned to: Cursor

- [ ] **TASK-039M**: Create useAdminProperties.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useProperties.ts` functionality  
    - No filtering - access ALL properties across all owners
    - Add admin analytics and reporting functions
    - Implement system-wide property management
    - Add bulk operations and advanced filtering
  - Functions:
    - `fetchAllProperties()` - get ALL properties (no owner filter)
    - `getPropertyAnalytics()` - system-wide property metrics
    - `getPropertiesByOwner(ownerId)` - filter properties by specific owner
    - `getPropertyUtilization()` - booking frequency per property
    - `bulkUpdateProperties(propertyIds, updates)` - bulk property updates
  - Assigned to: Cursor

- [ ] **TASK-039N**: Create useAdminCalendarState.ts composable
  - Status: Not Started
  - Requirements:
    - Extend base `useCalendarState.ts` functionality
    - No filtering - access ALL calendar events across all owners
    - Add admin-specific calendar features (cleaner views, advanced filters)
    - Implement system-wide calendar management
    - Add cleaner assignment calendar logic
  - Functions:
    - `getAdminCalendarEvents()` - format ALL bookings for calendar
    - `handleAdminEventClick()` - admin booking management interface
    - `getCleanerSchedule(cleanerId)` - view specific cleaner's schedule
    - `getSystemTurnAlerts()` - all urgent turns across all properties
    - `filterByMultipleCriteria()` - advanced admin filtering
  - Assigned to: Cursor

- [ ] **TASK-039O**: Create useCleanerManagement.ts composable (Admin-only)
  - Status: Not Started
  - Requirements:
    - New admin-only composable for cleaner operations
    - Manage cleaner profiles, availability, and assignments
    - Implement cleaner scheduling logic
    - Add cleaner performance tracking
  - Functions:
    - `fetchCleaners()` - get all cleaner profiles
    - `createCleaner(data)` - add new cleaner
    - `updateCleaner(id, data)` - update cleaner profile
    - `assignCleanerToBooking(cleanerId, bookingId)` - make assignment
    - `getCleanerAvailability(cleanerId, date)` - check availability
    - `getCleanerPerformance(cleanerId)` - performance metrics
  - Assigned to: Cursor

### **Dumb Component Updates**
- [ ] **TASK-039P**: Create owner-specific dumb components
  - Status: Not Started
  - Requirements:
    - Create `components/dumb/owner/OwnerBookingForm.vue` - simplified booking form
    - Create `components/dumb/owner/OwnerPropertyForm.vue` - simplified property form
    - Create `components/dumb/owner/OwnerQuickActions.vue` - owner action buttons
    - Create `components/dumb/owner/OwnerCalendarControls.vue` - basic calendar controls
  - Notes: Simplified versions focused on owner needs, no admin features
  - Assigned to: Cursor

- [ ] **TASK-039Q**: Create admin-specific dumb components
  - Status: Not Started
  - Requirements:
    - Create `components/dumb/admin/AdminBookingForm.vue` - advanced booking form with cleaner assignment
    - Create `components/dumb/admin/CleanerAssignmentModal.vue` - cleaner selection interface
    - Create `components/dumb/admin/AdminCalendarControls.vue` - advanced calendar controls
    - Create `components/dumb/admin/TurnPriorityPanel.vue` - system-wide turn management
    - Create `components/dumb/admin/AdminQuickActions.vue` - admin action buttons
  - Notes: Advanced versions with admin-specific features
  - Assigned to: Cursor

### **Page Structure Updates**
- [ ] **TASK-039R**: Implement role-based routing in pages/index.vue
  - Status: Not Started
  - Requirements:
    - Check user role in `setup()` function
    - Route to `HomeOwner.vue` if user role is 'owner'
    - Route to `HomeAdmin.vue` if user role is 'admin' 
    - Add fallback routing for unauthenticated users
    - Implement proper loading state during role check
  - Code Pattern:
    ```vue
    <template>
      <component :is="homeComponent" />
    </template>
    <script setup>
    const homeComponent = computed(() => {
      if (authStore.isAdmin) return HomeAdmin;
      if (authStore.isOwner) return HomeOwner;
      return AuthLogin; // fallback
    });
    </script>
    ```
  - Assigned to: Cursor

- [ ] **TASK-039S**: Create owner-specific pages structure
  - Status: Not Started
  - Requirements:
    - Create `pages/owner/` folder
    - Move `pages/properties/index.vue` → `pages/owner/properties/index.vue`
    - Move `pages/calendar/index.vue` → `pages/owner/calendar.vue`
    - Create `pages/owner/dashboard.vue` (using HomeOwner.vue)
    - Create `pages/owner/bookings/index.vue` - owner's booking list
    - Update all routing in router config
  - Notes: Owner-focused page structure with simplified navigation
  - Assigned to: Cursor

- [ ] **TASK-039T**: Expand admin-specific pages structure  
  - Status: Not Started
  - Requirements:
    - Expand existing `pages/admin/` folder
    - Create `pages/admin/schedule/index.vue` - master calendar (using HomeAdmin.vue)
    - Create `pages/admin/cleaners/index.vue` - cleaner management
    - Create `pages/admin/properties/index.vue` - all properties view
    - Create `pages/admin/bookings/index.vue` - all bookings view  
    - Create `pages/admin/reports/index.vue` - business analytics
    - Update router config with admin routes
  - Notes: Comprehensive admin interface with full business management
  - Assigned to: Cursor

### **Authentication & Route Guards**
- [ ] **TASK-039U**: Implement role-based route guards
  - Status: Not Started
  - Requirements:
    - Create route guards that check user roles
    - Redirect owners trying to access admin pages
    - Redirect admins to admin interface by default
    - Add proper error messages for unauthorized access
    - Implement loading states during authentication check
  - Route Protection:
    - `/owner/*` - requires 'owner' role
    - `/admin/*` - requires 'admin' role
    - `/` - routes based on role
  - Assigned to: Cursor

- [ ] **TASK-039V**: Update authentication flow for role-based routing
  - Status: Not Started
  - Requirements:
    - Update login success to route based on user role
    - Update logout to clear role-specific state
    - Add role selection during user registration
    - Implement role switching for admin users (if needed)
    - Update auth composable to handle role-based navigation
  - Assigned to: Cursor

---
- [ ] **TASK-038**: Implement loading states and error handling
  - Status: Not Started
  - Notes: 
  - Requirements: loading spinners, error messages, user feedback
  - Assigned to: Cursor
- [ ] **TASK-038**: Implement loading states and error handling
  - Status: Not Started
  - Notes: 
  - Requirements: loading spinners, error messages, user feedback
  - Assigned to: Cursor

- [ ] **TASK-039**: Add turn booking visual indicators
  - Status: Not Started
  - Notes: 
  - Requirements: urgent styling, priority colors, alerts
  - Assigned to: Cursor

---

## **Phase 1E: MVP Completion** 
**(UPDATED - Now Role-Aware)**

### **Error Handling Implementation**
- [ ] **TASK-040**: Create global error handling system with role-specific messaging
  - Status: Not Started
  - Requirements:
    - Role-specific error messages (owner vs admin language)
    - Different error escalation paths for each role
    - Owner errors: focus on booking/property issues
    - Admin errors: include system-wide impact messaging
  - Notes: Build on existing error foundations, add role context
  - Reference: docs/error-handling-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-041**: Implement form validation with role-specific error display
  - Status: Not Started
  - Requirements:
    - Owner forms: simple validation messages
    - Admin forms: advanced validation with business impact warnings
    - Role-specific field requirements (admin sees more fields)
    - Different validation rules based on user role
  - Notes: Real-time validation, error states, user feedback per role
  - Assigned to: Cursor

- [ ] **TASK-042**: Add API error handling and retry logic with role-specific strategies
  - Status: Not Started
  - Requirements:
    - Owner API errors: focus on user-friendly messaging
    - Admin API errors: include technical details and system impact
    - Different retry strategies (owners = simple, admins = advanced)
    - Role-specific fallback behaviors
  - Notes: Network errors, timeout handling, retry strategies per role
  - Assigned to: Cursor

- [ ] **TASK-043**: Implement user notification system with role-specific notifications
  - Status: Not Started
  - Requirements:
    - Owner notifications: personal booking updates, cleaning schedules
    - Admin notifications: system alerts, cleaner updates, business metrics
    - Different notification channels per role
    - Role-specific notification preferences
  - Notes: Success/error toasts, action confirmations per role
  - Assigned to: Cursor

### **Unit Testing Setup**
- [ ] **TASK-044**: Set up Vitest testing environment for role-based components
  - Status: Complete (needs expansion for role-based)
  - Requirements:
    - Add test utilities for role-based component mounting
    - Add mock factories for owner vs admin data
    - Create role-specific test helpers
    - Update existing test setup for role compatibility
  - Notes: Expand existing Vitest setup for role-based testing
  - Assigned to: Cursor

- [x] **TASK-045**: Create testing utilities and helpers
  - Status: Complete
  - Notes: Existing test utilities work for both roles
  - Requirements: mock factories, testing pinia, component wrappers
  - Reference: docs/testing-patterns.md
  - Assigned to: Cursor

- [ ] **TASK-046**: Write unit tests for business logic utils (role-aware)
  - Status: Not Started
  - Requirements:
    - Test priority calculation with role context
    - Test booking validation for both owner and admin cases
    - Test cleaning window calculation for different user types
    - Verify role-specific business rules
  - Notes: Test priority calculation, booking validation, cleaning windows per role
  - Files: businessLogic.test.ts
  - Assigned to: Cursor

- [ ] **TASK-047**: Write unit tests for role-specific composables
  - Status: Not Started
  - Requirements:
    - Test `useOwnerBookings.ts` - owner data filtering, owner operations
    - Test `useAdminBookings.ts` - all data access, admin operations
    - Test role-specific calendar state composables
    - Test cleaner management composable (admin-only)
  - Notes: Test role-specific business logic and data filtering
  - Files: useOwnerBookings.test.ts, useAdminBookings.test.ts, etc.
  - Assigned to: Cursor

- [x] **TASK-048**: Write unit tests for Pinia stores
  - Status: Complete
  - Notes: Existing store tests work for both roles
  - Requirements: test store actions, getters, Map operations
  - Files: user.spec.ts, property.spec.ts, booking.spec.ts, ui.spec.ts
  - Assigned to: Cursor

- [ ] **TASK-049**: Write component tests for role-specific smart components
  - Status: Not Started
  - Requirements:
    - Test `HomeOwner.vue` - owner data filtering, owner interactions
    - Test `HomeAdmin.vue` - all data access, admin interactions  
    - Test `OwnerSidebar.vue` vs `AdminSidebar.vue` functionality
    - Test `OwnerCalendar.vue` vs `AdminCalendar.vue` features
  - Notes: Test component communication, data flow per role
  - Focus: Role-specific props, emits, user interactions
  - Assigned to: Cursor

- [ ] **TASK-050**: Write integration tests for role-based workflows
  - Status: Not Started
  - Requirements:
    - Test complete owner workflow: login → add property → create booking → view calendar
    - Test complete admin workflow: login → view all data → assign cleaner → update status
    - Test role-based data isolation (owners can't see other owners' data)
    - Test role-based permission enforcement
  - Notes: End-to-end workflow testing per role
  - Focus: User journeys, cross-component communication per role
  - Assigned to: Cursor

### **Final Integration & Testing**
- [ ] **TASK-051**: End-to-end testing of role-based booking workflows
  - Status: Not Started
  - Requirements:
    - Test owner booking workflow: create → edit → view on calendar
    - Test admin booking workflow: view all → assign cleaner → update status
    - Test cross-role data updates (owner creates, admin sees)
    - Verify role-based data filtering throughout
  - Verification: Complete booking workflows for both roles
  - Assigned to: Human + Cursor

- [ ] **TASK-052**: Test role-based turn booking priority system
  - Status: Not Started
  - Requirements:
    - Test owner turn alerts (only their properties)
    - Test admin turn alerts (all properties, system-wide)
    - Test role-specific turn booking creation and management
    - Verify proper priority indicators for each role
  - Verification: Turn priority system works correctly for both roles
  - Assigned to: Human + Cursor

- [ ] **TASK-053**: Test role-based error handling scenarios
  - Status: Not Started
  - Requirements:
    - Test role-specific error messages and handling
    - Test permission denied scenarios (owner accessing admin features)
    - Test role-based fallback behaviors
    - Verify role-specific user feedback systems
  - Verification: Error handling appropriate for each role
  - Assigned to: Human + Cursor

- [ ] **TASK-054**: Responsive design testing for role-based interfaces
  - Status: Not Started
  - Requirements:
    - Test owner interface on desktop, tablet, mobile
    - Test admin interface on desktop, tablet, mobile
    - Verify role-specific mobile optimizations
    - Test role-based navigation on different screen sizes
  - Verification: Both interfaces work across all device sizes
  - Assigned to: Human + Cursor

- [ ] **TASK-055**: Run full test suite and achieve 80%+ coverage for role-based system
  - Status: Not Started
  - Requirements:
    - Run tests for both owner and admin code paths
    - Achieve 80%+ coverage on role-specific business logic
    - Verify critical role-based workflows are tested
    - Test role-based security and data isolation
  - Verification: npm run test:coverage passes for both roles
  - Assigned to: Human + Cursor

### **Documentation & Cleanup**
- [x] **TASK-055A**: Create UML diagrams to visualize codebase architecture
  - Status: Complete (needs update for role-based)
  - Requirements:
    - Update existing UML diagrams for role-based architecture
    - Add role-specific component interaction diagrams
    - Document role-based data flow patterns
    - Add role-based security/permission diagrams
  - Notes: Update existing comprehensive UML diagrams for role-based system
  - Assigned to: Cursor

- [ ] **TASK-056**: Document component APIs and usage for role-based system
  - Status: Not Started
  - Requirements:
    - Document owner-specific component APIs
    - Document admin-specific component APIs  
    - Document shared component usage patterns
    - Document role-based prop interfaces and emit patterns
  - Notes: Role-specific component documentation
  - Files: component documentation, prop interfaces per role
  - Assigned to: Cursor

- [ ] **TASK-057**: Code cleanup and optimization for role-based architecture
  - Status: Not Started
  - Requirements:
    - Remove unused generic components (old Home.vue, Sidebar.vue, etc.)
    - Optimize role-specific data filtering
    - Clean up import paths for new folder structure
    - Remove duplicate code between role-specific components
  - Notes: Clean up after role-based refactoring
  - Assigned to: Cursor

- [ ] **TASK-058**: Update documentation with role-based testing and error handling
  - Status: Not Started
  - Requirements:
    - Update README.md with role-based architecture explanation
    - Document role-based testing strategies
    - Document role-based error handling patterns
    - Add role-based deployment instructions
  - Notes: Complete documentation update for role-based system
  - Files: README.md, testing guide, error handling guide per role
  - Assigned to: Cursor

- [ ] **TASK-059**: MVP deployment preparation for role-based system
  - Status: Not Started
  - Requirements:
    - Build optimization for role-based components
    - Environment setup for role-based authentication
    - Deployment config for role-based routing
    - Performance optimization for role-specific data loading
  - Notes: Deployment preparation with role-based considerations
  - Assigned to: Cursor

---

## **Updated Notes Section**

### **General Notes:**
- **Role-Based Architecture**: Property owners see only their data, admins see all data
- **Data Filtering**: Implement at composable level, not component level
- **Shared Components**: Maximize reuse of dumb components across roles
- **Business Logic**: Maintain shared business rules, customize per role
- Reference docs/summary.md for overall architecture
- Use "use context7" in Cursor for up-to-date library documentation
- Follow Map collection patterns throughout the project
- Focus on turn vs standard booking distinction as core business logic
- **Error Handling**: Implement role-specific graceful failures and user feedback
- **Testing**: Aim for 80%+ test coverage on role-specific business logic and critical paths
- **Security**: Ensure owners cannot access other owners' data

### **Current Priority Order:**
1. **Phase 1D.5**: Complete role-based architecture split (TASK-039A through TASK-039V)
2. **Phase 1E**: Implement role-aware error handling and testing (TASK-040 through TASK-059)  
3. **Future Phases**: Supabase integration with RLS for multi-tenant security

### **Technical Decisions Made:**
- Vue 3 + Vite + TypeScript stack confirmed
- Map collections for state management (shared across roles)
- Role-based component architecture (Owner vs Admin interfaces)
- Composable-level data filtering for role separation
- Vuetify 3 for UI components (shared across roles)
- Folder structure: `owner/`, `admin/`, `shared/` pattern

### **Success Criteria for Role-Based MVP:**
- **Property Owner Experience**: Can manage their properties and bookings with simple, focused interface
- **Admin Experience**: Can manage all properties, bookings, and cleaners with advanced features
- **Data Isolation**: Owners see only their data, admins see all data
- **Role Security**: Proper authentication and authorization for each role
- **Shared Business Logic**: Turn vs standard booking logic works for both roles
- **Mobile Responsive**: Both interfaces work on all device sizes