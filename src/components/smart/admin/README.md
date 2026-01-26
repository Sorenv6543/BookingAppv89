# Admin Smart Components

This folder contains orchestrator components specifically designed for the business administrator.

## Purpose

Admin smart components provide comprehensive business management interfaces for the cleaning company administrator. They emphasize:

- **System-Wide View**: Access to all data across all 30-40 property owner clients
- **Business Operations**: Cleaner assignment, scheduling, and resource management
- **Advanced Features**: Reporting, analytics, and business intelligence
- **Desktop-Optimized**: Information-dense interfaces with advanced controls

## Key Components (Planned)

- `HomeAdmin.vue` - Main business dashboard with system-wide overview
- `AdminSidebar.vue` - Comprehensive navigation with business management tools
- `AdminCalendar.vue` - Master calendar showing all properties and cleaner assignments
- `CleanerManagement.vue` - Cleaner scheduling and assignment interface
- `TurnPriorityPanel.vue` - System-wide turn management and priority queue
- `BusinessAnalytics.vue` - Reporting and business intelligence dashboard

## Data Scoping

All admin components have access to the complete dataset:
- All properties across all property owners
- All bookings system-wide
- All turn alerts and priority management
- Complete business metrics and analytics
- Cleaner schedules and assignments

## Architecture

Admin components should:
- Use composables from `@/composables/admin/`
- Access unfiltered data (all clients)
- Provide comprehensive business management tools
- Support complex workflows and batch operations
- Be desktop-optimized with rich interactions

## Business Context

The business administrator is the single user who needs to:
- View and manage all properties across all clients
- Assign cleaners to bookings
- Monitor system-wide turn alerts and priorities
- Generate business reports and analytics
- Manage cleaner schedules and availability
- Oversee the entire operation across 30-40 property owner clients

## Security Considerations

Admin components handle sensitive business data and should:
- Implement proper access controls
- Log administrative actions
- Provide audit trails
- Ensure data privacy compliance
- Support role-based permissions for future expansion 