# Owner Composables

This folder contains **owner-specific composables** that implement role-based data filtering and business logic for property owners in the multi-tenant Property Cleaning Scheduler application.

## Architecture Overview

### **Role-Based Data Scoping**
Owner composables filter all data to show only the current property owner's information:
- **Bookings**: Only bookings where `booking.owner_id === currentUser.id`
- **Properties**: Only properties where `property.owner_id === currentUser.id`
- **Turn Alerts**: Only urgent turns for the owner's properties
- **Analytics**: Statistics scoped to the owner's data only

### **Composition Pattern**
Owner composables extend shared composables using the composition pattern:
```typescript
export function useOwnerBookings() {
  const baseBookings = useBookings(); // Get shared functionality
  const authStore = useAuthStore();
  
  // Add owner-specific filtering and functions
  const myBookings = computed(() => 
    Array.from(bookingStore.bookings.values())
      .filter(booking => booking.owner_id === currentUserId.value)
  );
  
  return {
    ...baseBookings, // Inherit base functionality
    // Override with owner-specific versions
    myBookings,
    fetchMyBookings,
    createMyBooking,
    // etc.
  };
}
```

## Implemented Composables

### **useOwnerBookings.ts** ✅
**Purpose**: Owner-scoped booking management with data filtering and validation

**Key Features**:
- **Data Filtering**: All operations filtered to current owner's bookings only
- **Ownership Validation**: Prevents owners from accessing other owners' bookings
- **Owner-Friendly Errors**: User-friendly error messages focused on personal experience
- **Automatic Owner Assignment**: Sets `owner_id` automatically on create operations
- **Removes Admin Functions**: No cleaner assignment or system-wide operations

**Functions**:
- `fetchMyBookings()` - Get current user's bookings only
- `createMyBooking(data)` - Create booking with automatic owner assignment
- `updateMyBooking(id, data)` - Update only if user owns the booking
- `deleteMyBooking(id)` - Delete only if user owns the booking
- `changeMyBookingStatus(id, status)` - Change status with ownership validation
- `getMyTurnAlerts()` - Today's urgent turns for owner's properties only
- `calculateMyBookingPriority(booking)` - Priority calculation for owner's bookings
- `getMyBookingCleaningWindow(booking)` - Cleaning window for owner's bookings

**Computed Properties**:
- `myBookings` - All bookings for current owner
- `myProperties` - All properties for current owner
- `myTodayTurns` - Today's turn bookings for owner
- `myUpcomingCleanings` - Upcoming cleanings (next 7 days) for owner
- `myBookingsByStatus` - Bookings grouped by status for owner
- `myBookingStats` - Statistics for owner's bookings

**Demo Component**: `UseOwnerBookingsDemo.vue` at `/demos/use-owner-bookings`

## Planned Composables

### **useOwnerProperties.ts** (Not Started)
**Purpose**: Owner-scoped property management
- Filter properties to current owner only
- Owner-specific property validation
- Owner-specific metrics calculation
- Remove admin property management functions

### **useOwnerCalendarState.ts** (Not Started)
**Purpose**: Owner-scoped calendar state management
- Filter calendar events to current owner's bookings
- Owner-specific calendar views and navigation
- Owner-specific date/time utilities
- Remove admin calendar features

## Usage Patterns

### **In Owner Components**
```vue
<script setup lang="ts">
import { useOwnerBookings } from '@/composables/owner/useOwnerBookings';

const {
  myBookings,
  myTodayTurns,
  createMyBooking,
  updateMyBooking,
  deleteMyBooking
} = useOwnerBookings();
</script>
```

### **Data Filtering Example**
```typescript
// ✅ GOOD: Owner sees only their data
const myBookings = computed(() => 
  Array.from(bookings.value.values())
    .filter(b => b.owner_id === currentUser.id)
);

// ❌ AVOID: Admin pattern (no filtering)
const allBookings = computed(() => 
  Array.from(bookings.value.values()) // All data
);
```

### **Error Handling Example**
```typescript
// ✅ Owner-friendly error messages
if (booking.owner_id !== currentUserId.value) {
  throw new Error('You can only edit your own bookings');
}

// ❌ Admin-style error messages
if (booking.owner_id !== currentUserId.value) {
  throw new Error('Access denied to booking resource');
}
```

## Security Considerations

### **Frontend Filtering (UX Only)**
⚠️ **Important**: Owner composables provide **frontend filtering for user experience only**, not security.

```typescript
// Frontend filtering = UX optimization
const ownerBookings = allBookings.filter(b => b.owner_id === user.id);
// An owner could still access other data via dev tools!
```

### **Future Database Security (Phase 2)**
Real security will be implemented with Supabase Row Level Security (RLS):
```sql
-- Supabase RLS will provide real security
CREATE POLICY "owners_see_own_bookings" ON bookings 
FOR SELECT USING (auth.uid() = owner_id);
```

## Development Guidelines

### **Role-Based Patterns**
1. **Filter at Composable Level**: Never filter in components, always in composables
2. **Ownership Validation**: Always check ownership before update/delete operations
3. **Automatic Owner Assignment**: Set `owner_id` automatically on create operations
4. **Owner-Friendly Messages**: Use personal, user-friendly error messages
5. **Remove Admin Features**: No system-wide operations or cleaner assignment

### **Testing Strategy**
- Test ownership validation on all CRUD operations
- Test data filtering (owners see only their data)
- Test owner-specific error messages
- Test automatic owner assignment on create operations
- Use demo components for manual testing

### **Integration with Components**
- **HomeOwner.vue**: Uses owner composables for dashboard data
- **OwnerSidebar.vue**: Uses owner composables for sidebar data
- **OwnerCalendar.vue**: Uses owner composables for calendar events
- **Owner Forms**: Use owner composables for CRUD operations

## Multi-Tenant Architecture

### **Data Scope Comparison**
| Aspect | Owner Composables | Admin Composables |
|--------|------------------|-------------------|
| **Data Access** | Only owner's data | All data across all owners |
| **Bookings** | `booking.owner_id === user.id` | No filtering |
| **Properties** | `property.owner_id === user.id` | No filtering |
| **Turn Alerts** | Owner's urgent turns only | System-wide urgent turns |
| **Error Messages** | Personal, user-friendly | Technical, business impact |
| **Features** | Simple CRUD operations | Advanced features + cleaner assignment |

### **Shared Foundation**
- **Types & Interfaces**: All shared (Property, Booking, User)
- **Stores**: Shared Maps with role-based access patterns
- **Business Logic**: Shared algorithms with role-specific scoping
- **Dumb Components**: Reused with different data per role

This architecture ensures that property owners have a simple, focused interface while admins have comprehensive business management tools, all built on the same shared foundation. 