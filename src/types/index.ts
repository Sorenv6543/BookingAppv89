/**
 * Central type exports for the Property Cleaning Scheduler
 */

// User types
export * from './user';

// Property types 
export * from './property';

// Booking types
export * from './booking';

// UI types - export everything except UserRole
export type {
  ModalData,
  FilterValue,
  ModalState,
  ConfirmDialogState,
  NotificationType,
  Notification,
  CalendarView,
  FilterState,
  CalendarEvent,
  // Skip UserRole since it's already exported from './user'
  ErrorCategory,
  BusinessImpact,
  ErrorContext,
  ErrorHandlingOptions,
  ErrorInfo,
  ErrorRecoveryAction,
  LoadingType,
  LoadingOperation,
  LoadingStateOptions,
  LoadingState,
  NotificationAction,
  RoleBasedNotification,
  NotificationQueueConfig,
  ValidationError,
  FormValidationState,
  ApiError,
  RetryConfig,
  AccessibilityOptions
} from './ui';

// API types
export * from './api';

// Router types
export * from './router';
