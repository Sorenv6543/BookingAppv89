# Admin Composables

This folder contains business logic composables specifically designed for business administrator operations.

## Purpose

Admin composables provide comprehensive data access and business logic for system-wide operations. They build upon shared composables but add admin-specific functionality for managing the entire business across all property owner clients.

## Key Composables (Planned)

- `useAdminBookings.ts` - System-wide booking management and analytics
- `useAdminProperties.ts` - All-properties management across all clients
- `useAdminCalendarState.ts` - Master calendar with cleaner assignments
- `useCleanerManagement.ts` - Cleaner scheduling and assignment logic
- `useAdminDashboard.ts` - Business intelligence and reporting
- `useSystemAlerts.ts` - System-wide alerts and priority management
- `useReporting.ts` - Business analytics and report generation

## Data Access Pattern

Admin composables access unfiltered, system-wide data:

```typescript
// Example: useAdminBookings.ts
export function useAdminBookings() {
  const { bookingsArray } = useBookingStore();
  
  // Access ALL bookings across ALL clients
  const allBookings = computed(() => bookingsArray.value);
  
  const systemTurnBookings = computed(() =>
    allBookings.value.filter(booking => 
      booking.booking_type === 'turn'
    )
  );
  
  const urgentSystemTurns = computed(() =>
    systemTurnBookings.value.filter(booking => {
      const today = new Date().toISOString().split('T')[0];
      return booking.checkout_date.startsWith(today);
    })
  );
  
  return {
    allBookings,
    systemTurnBookings,
    urgentSystemTurns,
    // ... other admin operations
  };
}
```

## Architecture

Admin composables should:
- Import and extend shared composables from `@/composables/shared/`
- Access complete datasets without filtering
- Provide comprehensive business management APIs
- Handle complex workflows and batch operations
- Support advanced analytics and reporting

## Key Features

### Cleaner Management
- Cleaner scheduling and availability
- Booking assignment and optimization
- Workload balancing and scheduling conflicts

### System-Wide Analytics
- Cross-client performance metrics
- Revenue and utilization analytics  
- Turn frequency and priority analysis
- Business intelligence dashboards

### Priority Management
- System-wide turn alerting
- Resource allocation optimization
- Capacity planning and forecasting

## Integration

Admin composables integrate with:
- All shared stores for complete data access
- Admin smart components for complex UI logic
- Cleaner management systems
- Business reporting tools
- System monitoring and alerting

## Security Considerations

Admin composables handle sensitive business data and should:
- Implement proper access logging
- Support audit trail requirements
- Handle multi-tenant data access patterns
- Prepare for future role-based permission expansion 