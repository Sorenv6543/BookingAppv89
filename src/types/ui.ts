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
