# 🎯 TASK-SPECIFIC PROMPTS - Phase 1F Priority Tasks

## 📋 **TASK-060: Create OwnerSidebar.vue Component**

### **Context Research Phase**
```bash
# Get Vue 3 and Vuetify documentation for sidebar components
get-library-docs /vuejs/docs --topic="composition-api components props"
get-library-docs /vuetifyjs/vuetify --topic="navigation-drawer list-item theming"
```

### **Sequential Thinking Focus**
Break down these specific requirements:
- Owner-only navigation items (no cleaner management, no system reports)
- Integration with OwnerQuickActions component
- Owner-specific color scheme and styling
- Filter navigation to owner-specific features only
- Add owner-specific quick actions (Add Property, View My Bookings)

### **Implementation Specifics**
- **File Location**: `src/components/smart/owner/OwnerSidebar.vue`
- **Base Pattern**: Study existing `src/components/smart/Sidebar.vue` for structure
- **Key Integrations**: OwnerQuickActions component, auth store for owner data
- **Navigation Items**: Properties, My Bookings, Calendar, Settings (NO admin items)

### **Verification Checklist**
- [ ] Owner sees only relevant navigation (Properties, Bookings, Calendar)
- [ ] No admin features visible (Cleaner Management, System Reports)
- [ ] OwnerQuickActions properly integrated
- [ ] Owner-specific styling applied
- [ ] Navigation state syncs with current route

---

## 📋 **TASK-061: Create OwnerCalendar.vue Component**

### **Context Research Phase**
```bash
# Get FullCalendar and Vue documentation for calendar integration
get-library-docs /fullcalendar/fullcalendar --topic="vue-integration events drag-drop"
get-library-docs /vuejs/docs --topic="composition-api computed reactive"
get-library-docs /vuetifyjs/vuetify --topic="components theming"
```

### **Sequential Thinking Focus**
Break down these specific requirements:
- Filter calendar events to owner's properties only
- Implement OwnerCalendarControls integration
- Add owner-specific event creation workflows
- Remove admin-only features (cleaner assignment, system-wide view)
- Owner-specific calendar views and styling

### **Implementation Specifics**
- **File Location**: `src/components/smart/owner/OwnerCalendar.vue`
- **Base Pattern**: Study existing `src/components/smart/FullCalendar.vue`
- **Data Filtering**: Only show events for authenticated owner's properties
- **Dependencies**: OwnerCalendarControls.vue component (create if missing)

### **Verification Checklist**
- [ ] Owner sees only their property events and bookings
- [ ] OwnerCalendarControls properly integrated
- [ ] No admin-only features (cleaner assignment views)
- [ ] Owner-specific event styling and indicators work
- [ ] Event creation workflow is owner-optimized

---

## 📋 **TASK-062: Create AdminSidebar.vue Component**

### **Context Research Phase**
```bash
# Get Vuetify and Vue documentation for comprehensive admin navigation
get-library-docs /vuetifyjs/vuetify --topic="navigation-drawer expansion-panels badges"
get-library-docs /vuejs/docs --topic="composition-api computed dynamic-components"
```

### **Sequential Thinking Focus**
Break down these specific requirements:
- Full admin navigation (cleaners, reports, system management)
- Admin-specific quick actions and system controls
- System status indicators and alerts
- Business metrics in sidebar summary
- Role switcher component integration

### **Implementation Specifics**
- **File Location**: `src/components/smart/admin/AdminSidebar.vue`
- **Full Feature Set**: Cleaners, Properties, Bookings, Reports, System Settings
- **System Controls**: Status indicators, role switcher, business metrics
- **Admin Styling**: Professional admin-focused UI with comprehensive navigation

### **Verification Checklist**
- [ ] Admin sees full system navigation and controls
- [ ] System status indicators functional
- [ ] Business metrics displayed in sidebar
- [ ] Role switcher integration works
- [ ] All admin features accessible from navigation

---

## 📋 **TASK-063: Fix TypeScript Errors in Admin Components**

### **Context Research Phase**
```bash
# Get TypeScript documentation for error resolution
get-library-docs /microsoft/typescript --topic="interfaces type-guards error-handling"
get-library-docs /vuejs/docs --topic="typescript composition-api"
```

### **Sequential Thinking Focus**
Break down these specific requirements:
- Identify all TypeScript errors in admin components
- Fix type definitions and interfaces
- Ensure proper typing for admin-specific data
- Update import paths and type exports
- Verify compilation with strict mode

### **Implementation Specifics**
- **Scope**: All files in `src/components/smart/admin/` and `src/components/dumb/admin/`
- **Common Issues**: Missing type definitions, incorrect prop types, store typing
- **Tools**: Use `npm run type-check` to identify specific errors

### **Verification Checklist**
- [ ] `npm run type-check` passes without errors
- [ ] All admin components have proper TypeScript interfaces
- [ ] Props and emits are correctly typed
- [ ] Store integrations are properly typed
- [ ] Import/export statements are correct

---

## 📋 **TASK-064: Fix AdminCalendar.vue Component**

### **Context Research Phase**
```bash
# Get FullCalendar and TypeScript documentation for admin calendar
get-library-docs /fullcalendar/fullcalendar --topic="vue-integration drag-drop resources"
get-library-docs /microsoft/typescript --topic="interfaces generics"
get-library-docs /vuejs/docs --topic="composition-api reactive"
```

### **Sequential Thinking Focus**
Break down these specific requirements:
- Fix existing TypeScript errors in AdminCalendar.vue
- Ensure admin-specific features work (cleaner assignment, system-wide view)
- Fix integration with admin stores and composables
- Verify all calendar functionality for admin role

### **Implementation Specifics**
- **File Location**: `src/components/smart/admin/AdminCalendar.vue`
- **Admin Features**: System-wide calendar view, cleaner assignment, drag-drop
- **Data Scope**: All properties and bookings across all owners
- **Integration**: Admin stores, cleaner management, booking assignment

### **Verification Checklist**
- [ ] TypeScript compilation passes for AdminCalendar
- [ ] Admin sees all properties and bookings on calendar
- [ ] Cleaner assignment functionality works
- [ ] Drag-drop operations function correctly
- [ ] System-wide calendar view displays properly

---

## 📋 **TASK-065: Integrate Owner Components in HomeOwner.vue**

### **Context Research Phase**
```bash
# Get Vue documentation for component integration and orchestration
get-library-docs /vuejs/docs --topic="composition-api components props-emit"
get-library-docs /vuetifyjs/vuetify --topic="layout grid responsive"
```

### **Sequential Thinking Focus**
Break down these specific requirements:
- Integrate OwnerSidebar and OwnerCalendar into HomeOwner.vue
- Ensure proper data flow between owner components
- Maintain existing HomeOwner orchestrator pattern
- Test role-based data filtering works end-to-end

### **Implementation Specifics**
- **File Location**: `src/components/smart/owner/HomeOwner.vue`
- **Dependencies**: TASK-060 (OwnerSidebar), TASK-061 (OwnerCalendar)
- **Integration Pattern**: Central orchestrator with role-specific components
- **Data Flow**: Auth store → HomeOwner → child components

### **Verification Checklist**
- [ ] OwnerSidebar and OwnerCalendar properly integrated
- [ ] Owner interface shows only owner-scoped data
- [ ] Component communication works correctly
- [ ] Role-based data isolation maintained
- [ ] UI store integration for modals/sidebars works

---

## 📋 **TASK-066: Integrate Admin Components in HomeAdmin.vue**

### **Context Research Phase**
```bash
# Get Vue documentation for complex admin interface orchestration
get-library-docs /vuejs/docs --topic="composition-api dynamic-components provide-inject"
get-library-docs /vuetifyjs/vuetify --topic="layout complex-ui admin-panels"
```

### **Sequential Thinking Focus**
Break down these specific requirements:
- Integrate AdminSidebar and AdminCalendar into HomeAdmin.vue
- Ensure admin interface uses all role-specific components
- Maintain comprehensive admin functionality
- Test system-wide data access and role switching

### **Implementation Specifics**
- **File Location**: `src/components/smart/admin/HomeAdmin.vue`
- **Dependencies**: TASK-062 (AdminSidebar), TASK-064 (AdminCalendar)
- **Full Admin Features**: System management, cleaner assignment, all-owner data
- **Role Switching**: Support admin viewing as owner mode

### **Verification Checklist**
- [ ] AdminSidebar and AdminCalendar properly integrated
- [ ] Admin interface shows system-wide data
- [ ] Role switching functionality works (admin can view as owner)
- [ ] All admin-specific features accessible
- [ ] Complex admin workflows function correctly

---

## 🔄 **TASK DEPENDENCY EXECUTION ORDER**

### **Parallel Track A: Owner Components**
1. **TASK-060** (OwnerSidebar) → 
2. **TASK-061** (OwnerCalendar) → 
3. **TASK-065** (HomeOwner Integration)

### **Parallel Track B: Admin Components**  
1. **TASK-062** (AdminSidebar) + **TASK-063** (TypeScript fixes) →
2. **TASK-064** (AdminCalendar fixes) →
3. **TASK-066** (HomeAdmin Integration)

### **Critical Success Path**
- Complete both tracks before moving to Phase 1G cleanup
- Test role switching after TASK-065 and TASK-066 completion
- Verify data isolation after each integration task

## ⚠️ **SHARED CRITICAL NOTES FOR ALL TASKS**

1. **Role-Based Data Filtering**: Always implement at component level first, document need for backend RLS
2. **Existing Pattern Preservation**: Don't break current demo functionality during development
3. **TypeScript Strict Mode**: All new components must compile without errors
4. **Component Naming**: Follow `Role + ComponentType.vue` convention
5. **Testing Strategy**: Test each component individually before integration tasks