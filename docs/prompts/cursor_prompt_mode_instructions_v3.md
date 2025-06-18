# Cursor Rules - Property Cleaning Scheduler

> **Project Context**: Multi-tenant Vue 3 app for cleaning business with 30+ property owner clients. Role-based architecture with Owner vs Admin interfaces.

## 🎯 Core Mission
Build features that **eliminate missed cleanings** by providing role-optimized interfaces:
- **Property Owners** (30-40 clients): Simple property/booking management  
- **Business Admin** (1 user): System-wide operations, cleaner management, analytics

## 🏗️ Architecture Patterns

### **Tech Stack**
- Vue 3 + TypeScript + Composition API
- Vuetify 3 (Material Design)
- Pinia stores with `Map<string, T>` collections  
- FullCalendar.io for scheduling
- Vite build + Vitest testing

### **Role-Based Structure**
```
components/smart/
├── owner/           # HomeOwner, OwnerSidebar, OwnerCalendar
├── admin/           # HomeAdmin, AdminSidebar, AdminCalendar  
└── shared/          # Cross-role components (rare)

composables/
├── owner/           # useOwnerBookings (filtered data)
├── admin/           # useAdminBookings (all data)
└── shared/          # useAuth, base business logic

components/dumb/
├── owner/           # OwnerBookingForm (simple)
├── admin/           # AdminBookingForm (with cleaner assignment)
└── shared/          # PropertyCard, TurnAlerts (reused)
```

### **Data Access Pattern**
```typescript
// ✅ Owner - filtered data
const { myBookings } = useOwnerBookings()  // Only user's data

// ✅ Admin - all data  
const { allBookings } = useAdminBookings() // System-wide data

// ✅ Shared UI with different data
<TurnAlerts :turns="ownerTurns" />    // Owner: only their turns
<TurnAlerts :turns="systemTurns" />   // Admin: all system turns
```

## 🔄 Development Workflow

### **For Each Task:**
1. **Understand Role Scope**: Owner-only, admin-only, or shared?
2. **Choose Component Type**: Reuse shared component or create role-specific?
3. **Follow Data Pattern**: Use appropriate composable for data scoping
4. **Test Both Roles**: Verify correct data filtering/access
5. **Update Task Status**: Mark complete in `tasks.md`

### **Key Business Logic**
- **Turn Bookings**: Same-day urgent cleaning (checkout → checkin)
- **Standard Bookings**: Regular maintenance cleaning  
- **Priority System**: Owner sees personal alerts, Admin sees system-wide
- **Map Collections**: All stores use `Map<string, T>` for O(1) lookups

## 📝 Implementation Guidelines

### **Naming Conventions**
- Owner: `Owner` prefix (`OwnerSidebar.vue`, `useOwnerProperties.ts`)
- Admin: `Admin` prefix (`AdminCalendar.vue`, `useAdminBookings.ts`)  
- Shared: No prefix (`PropertyCard.vue`, `useAuth.ts`)

### **Security Model**
- Frontend filtering for UX optimization
- Document need for backend RLS in production
- Owner components MUST filter to user's data only
- Admin components access all data without filtering

### **Component Communication**
```
Owner: OwnerSidebar → HomeOwner → OwnerCalendar
Admin: AdminSidebar → HomeAdmin → AdminCalendar
```

## ⚡ Quick Reference

### **Common Patterns**
```typescript
// Store integration
const { bookings, addBooking } = useBookingStore()

// Role-based filtering  
const userBookings = computed(() => 
  Array.from(bookings.value.values())
    .filter(b => b.owner_id === userId)
)

// Event handling
const handleEventClick = (event: CalendarEvent) => {
  // Emit to parent for modal management
  emit('event-click', event)
}
```

### **File References**
- `@project_summary.md` - Current architecture overview
- `@tasks.md` - Task list and implementation status  
- `@repomix-output.md` - Complete codebase snapshot
- `src/types/` - TypeScript interfaces
- `src/utils/businessLogic.ts` - Turn vs standard logic

## 🎯 Success Criteria
Before marking tasks complete:
- [ ] TypeScript compiles without errors
- [ ] Role-based data filtering works correctly
- [ ] Component follows established patterns
- [ ] Tests pass for both user roles
- [ ] Task marked complete in `tasks.md`

---

**Remember**: This is a **role-based multi-tenant** system. Always consider which role the feature serves and implement appropriate data scoping.