# Owner Composables

This folder contains business logic composables specifically designed for property owner operations.

## Purpose

Owner composables provide data access and business logic that filters and scopes operations to the current property owner's data only. They build upon shared composables but add owner-specific filtering and workflows.

## Key Composables (Planned)

- `useOwnerBookings.ts` - Owner-scoped booking operations and CRUD
- `useOwnerProperties.ts` - Owner-scoped property management  
- `useOwnerCalendarState.ts` - Calendar state filtered to owner's properties
- `useOwnerDashboard.ts` - Dashboard data aggregation for owners
- `useOwnerNotifications.ts` - Owner-specific notification handling

## Data Scoping Pattern

All owner composables follow the data scoping pattern:

```typescript
// Example: useOwnerBookings.ts
export function useOwnerBookings() {
  const { userBookings } = useUserStore();
  const { user } = useAuthStore();
  
  // Filter to current owner's bookings only
  const myBookings = computed(() => 
    userBookings.value.filter(booking => 
      booking.owner_id === user.value?.id
    )
  );
  
  const myTurnBookings = computed(() =>
    myBookings.value.filter(booking => 
      booking.booking_type === 'turn'
    )
  );
  
  return {
    myBookings,
    myTurnBookings,
    // ... other owner-scoped operations
  };
}
```

## Architecture

Owner composables should:
- Import and extend shared composables from `@/composables/shared/`
- Filter all data to current user's scope
- Provide simplified APIs focused on owner needs
- Handle owner-specific business rules
- Emit owner-specific events

## Integration

Owner composables integrate with:
- Shared stores for data access
- Owner smart components for UI logic
- Shared business logic utilities
- Owner-specific validation rules

## Security Note

Owner composables provide **frontend filtering only**. Backend Row Level Security (RLS) will be required in the future for true data security. Current filtering is for UX purposes to show relevant data to each owner. 