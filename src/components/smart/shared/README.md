# Shared Smart Components

This folder contains orchestrator components that can be reused across both owner and admin roles.

## Purpose

Shared smart components provide common functionality that works for both property owners and business administrators. They typically:

- Handle cross-role business logic
- Manage shared UI state
- Coordinate between multiple dumb components
- Provide consistent behavior across roles

## Examples

Examples of shared smart components include:

- `GlobalNotificationHandler.vue` - Notification system that works for all roles
- `ErrorBoundary.vue` - Error handling component for all interfaces
- `LoadingOverlay.vue` - Loading states for all components

## Architecture

Shared smart components should:
- Be role-agnostic
- Use shared composables from `@/composables/shared/`
- Emit events for role-specific handling
- Accept role-specific data through props

## Migration

During the role-based refactoring, generic components that work for all roles will be moved here while role-specific components will go to `owner/` or `admin/` folders. 