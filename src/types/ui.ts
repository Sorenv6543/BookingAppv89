/**
 * UI Type Definitions
 * Types for UI state management
 */

/**
 * Generic data type for modal and dialog payloads
 */
export type ModalData = Record<string, unknown> | null | undefined;

/**
 * Filter value type for arbitrary filter values
 */
export type FilterValue = string | number | boolean | Date | string[] | null | undefined;

/**
 * Modal state interface
 * Used for tracking modal dialogs
 */
export interface ModalState {
  open: boolean;
  mode: 'create' | 'edit' | 'view' | 'delete';
  data?: ModalData;
}

/**
 * Confirmation dialog state interface
 * Used for tracking confirmation dialogs
 */
export interface ConfirmDialogState {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  dangerous?: boolean;
  data?: ModalData; // For passing data to the confirmation callback
}

/**
 * Notification types
 */
export type NotificationType = 'success' | 'info' | 'warning' | 'error';

/**
 * Notification interface
 * Used for user notifications/alerts
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  autoClose?: boolean;
  duration?: number;
}

/**
 * Calendar view types
 */
export type CalendarView = 'month' | 'week' | 'day' | 'list';

/**
 * Filter state interface
 * Used for calendar and list filtering
 */
export interface FilterState {
  propertyId?: string;
  bookingType?: 'all' | 'standard' | 'turn';
  status?: 'all' | 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  dateRange?: {
    start: string;
    end: string;
  };
  searchTerm?: string;
}

/**
 * Calendar event type
 * For use with FullCalendar
 */
export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  classNames: string[];
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps: {
    booking: Record<string, unknown>;
    type: 'standard' | 'turn';
    status: string;
  };
}

// ===== ERROR HANDLING TYPES =====

/**
 * User roles for role-based error handling
 */
export type UserRole = 'owner' | 'admin' | 'cleaner';

/**
 * Error categories for different types of errors
 */
export type ErrorCategory = 
  | 'validation' 
  | 'network' 
  | 'business_logic' 
  | 'authentication' 
  | 'permission' 
  | 'system';

/**
 * Business impact levels for admin error handling
 */
export type BusinessImpact = 'low' | 'medium' | 'high' | 'critical';

/**
 * Error context for comprehensive error tracking
 */
export interface ErrorContext {
  userId?: string;
  userRole?: UserRole;
  operation?: string;
  component?: string;
  timestamp: string;
  sessionId?: string;
  requestId?: string;
}

/**
 * Error handling options
 */
export interface ErrorHandlingOptions {
  showToUser?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
  logToConsole?: boolean;
  reportToService?: boolean;
  escalate?: boolean;
}

/**
 * Structured error information
 */
export interface ErrorInfo {
  code?: string;
  category: ErrorCategory;
  message: string;
  userMessage?: string;
  technicalDetails?: string;
  businessImpact?: BusinessImpact;
  affectedResources?: string[];
  suggestedActions?: string[];
  context: ErrorContext;
  options: ErrorHandlingOptions;
}

/**
 * Error recovery action
 */
export interface ErrorRecoveryAction {
  label: string;
  action: () => void | Promise<void>;
  primary?: boolean;
  dangerous?: boolean;
}

// ===== LOADING STATE TYPES =====

/**
 * Loading operation types
 */
export type LoadingType = 'global' | 'page' | 'component' | 'action';

/**
 * Loading operation state
 */
export interface LoadingOperation {
  id: string;
  type: LoadingType;
  message?: string;
  progress?: number;
  cancellable?: boolean;
  startTime: number;
  timeout?: number;
  role?: UserRole;
}

/**
 * Loading state options
 */
export interface LoadingStateOptions {
  timeout?: number;
  showProgress?: boolean;
  overlay?: boolean;
  role?: UserRole;
  message?: string;
  cancellable?: boolean;
  onCancel?: () => void;
}

/**
 * Loading state for components
 */
export interface LoadingState {
  loading: boolean;
  progress?: number;
  message?: string;
  cancellable?: boolean;
  error?: ErrorInfo | null;
}

// ===== ROLE-BASED NOTIFICATION TYPES =====

/**
 * Notification action button
 */
export interface NotificationAction {
  label: string;
  action: string;
  color?: string;
  icon?: string;
}

/**
 * Enhanced notification with role-based features
 */
export interface RoleBasedNotification extends Notification {
  userRole?: UserRole;
  businessImpact?: BusinessImpact;
  category?: ErrorCategory;
  actions?: NotificationAction[];
  escalationLevel?: number;
}

/**
 * Notification queue configuration
 */
export interface NotificationQueueConfig {
  maxSize: number;
  defaultDuration: number;
  roleBasedStyling: boolean;
  groupSimilar: boolean;
}

// ===== FORM VALIDATION TYPES =====

/**
 * Validation error for forms
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
  value?: unknown;
}

/**
 * Form validation state
 */
export interface FormValidationState {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  touched: Set<string>;
  dirty: Set<string>;
}

// ===== API ERROR TYPES =====

/**
 * API error response structure
 */
export interface ApiError {
  status?: number;
  statusText?: string;
  code?: string;
  message: string;
  details?: unknown;
  endpoint?: string;
  method?: string;
  timestamp: string;
}

/**
 * Retry configuration for API calls
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  exponentialBackoff: boolean;
  retryCondition?: (error: unknown) => boolean;
}

// ===== ACCESSIBILITY TYPES =====

/**
 * Accessibility options for error and loading states
 */
export interface AccessibilityOptions {
  announceToScreenReader?: boolean;
  focusManagement?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
}
