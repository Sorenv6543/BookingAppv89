/**
 * Owner Error Handler Composable
 * Provides simple, user-friendly error handling for property owners
 */

import { useErrorHandler } from '@/composables/shared/useErrorHandler';
import { useLoadingState } from '@/composables/shared/useLoadingState';
import { useUIStore } from '@/stores/ui';
import type { ErrorContext } from '@/types';

/**
 * Owner-specific error handler
 * Provides simple, encouraging error messages for property owners
 */
export function useOwnerErrorHandler() {
  const { handleError, handleApiError, handleValidationError, handleBusinessError } = useErrorHandler();
  const { stopLoading } = useLoadingState();
  const uiStore = useUIStore();
  
  /**
   * Handle property-related errors for owners
   */
  async function handlePropertyError(
    error: Error | unknown,
    operation: 'create' | 'update' | 'delete' | 'fetch',
    propertyId?: string
  ): Promise<string> {
    const context: Partial<ErrorContext> = {
      operation: `property_${operation}`,
      component: 'property',
      affectedResources: propertyId ? [propertyId] : undefined
    };
    
    // Stop any loading states
    stopLoading(`property-${operation}`);
    
    // Handle specific property errors with owner-friendly messages
    if ((error as any)?.code === 'PROPERTY_NOT_FOUND') {
      return handleError(
        { message: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        context,
        { 
          showToUser: true, 
          autoRetry: false,
          maxRetries: 0
        }
      );
    }
    
    if ((error as any)?.code === 'PROPERTY_LIMIT_EXCEEDED') {
      return handleError(
        { message: 'Property limit exceeded', code: 'PROPERTY_LIMIT_EXCEEDED' },
        context,
        { 
          showToUser: true, 
          autoRetry: false,
          maxRetries: 0
        }
      );
    }
    
    // Default property error handling
    return handleError(error, context, {
      showToUser: true,
      autoRetry: operation === 'fetch', // Only retry fetch operations
      maxRetries: operation === 'fetch' ? 2 : 0
    });
  }
  
  /**
   * Handle booking-related errors for owners
   */
  async function handleBookingError(
    error: Error | unknown,
    operation: 'create' | 'update' | 'delete' | 'fetch',
    bookingId?: string
  ): Promise<string> {
    const context: Partial<ErrorContext> = {
      operation: `booking_${operation}`,
      component: 'booking',
      affectedResources: bookingId ? [bookingId] : undefined
    };
    
    // Stop any loading states
    stopLoading(`booking-${operation}`);
    
    // Handle specific booking errors
    if ((error as any)?.code === 'BOOKING_CONFLICT') {
      uiStore.addNotification(
        'warning',
        'Booking Conflict',
        'This time slot conflicts with another booking. Please choose different dates.',
        false
      );
      
      return handleError(error, context, {
        showToUser: false, // We already showed a custom notification
        autoRetry: false
      });
    }
    
    if ((error as any)?.code === 'TURN_BOOKING_INVALID') {
      uiStore.addNotification(
        'info',
        'Turn Booking Help',
        'Turn bookings require checkout and checkin on the same day. Need help? Contact support.',
        false
      );
      
      return handleError(error, context, {
        showToUser: false,
        autoRetry: false
      });
    }
    
    // Default booking error handling
    return handleError(error, context, {
      showToUser: true,
      autoRetry: operation === 'fetch',
      maxRetries: operation === 'fetch' ? 2 : 0
    });
  }
  
  /**
   * Handle form validation errors for owners
   */
  async function handleFormError(
    validationErrors: Record<string, unknown>[],
    formType: 'property' | 'booking' | 'profile'
  ): Promise<string> {
    const context: Partial<ErrorContext> = {
      operation: `form_validation`,
      component: formType
    };
    
    // Show encouraging message for validation errors
    const errorCount = validationErrors.length;
    const title = errorCount === 1 ? 'Please Check Your Input' : 'Please Check Your Inputs';
    const message = errorCount === 1 
      ? 'There\'s one field that needs your attention.'
      : `There are ${errorCount} fields that need your attention.`;
    
    uiStore.addNotification('warning', title, message, true);
    
    return handleValidationError(validationErrors, context);
  }
  
  /**
   * Handle authentication errors for owners
   */
  async function handleAuthError(
    error: Error | unknown,
    operation: 'login' | 'logout' | 'register' | 'reset_password'
  ): Promise<string> {
    const context: Partial<ErrorContext> = {
      operation: `auth_${operation}`,
      component: 'auth'
    };
    
    // Stop auth loading
    stopLoading('auth');
    
    // Handle specific auth errors with helpful messages
    if ((error as any)?.code === 'INVALID_CREDENTIALS') {
      uiStore.addNotification(
        'error',
        'Login Failed',
        'Invalid email or password. Please double-check and try again.',
        false
      );
      
      return handleError(error, context, {
        showToUser: false,
        autoRetry: false
      });
    }
    
    if ((error as any)?.code === 'ACCOUNT_LOCKED') {
      uiStore.addNotification(
        'warning',
        'Account Locked',
        'Your account has been temporarily locked for security. Please contact support.',
        false
      );
      
      return handleError(error, context, {
        showToUser: false,
        autoRetry: false
      });
    }
    
    if ((error as any)?.code === 'EMAIL_NOT_VERIFIED') {
      uiStore.addNotification(
        'info',
        'Email Verification Required',
        'Please check your email and click the verification link before logging in.',
        false
      );
      
      return handleError(error, context, {
        showToUser: false,
        autoRetry: false
      });
    }
    
    // Default auth error handling
    return handleError(error, context, {
      showToUser: true,
      autoRetry: false
    });
  }
  
  /**
   * Handle calendar-related errors for owners
   */
  async function handleCalendarError(
    error: Error | unknown,
    operation: 'load' | 'navigate' | 'filter'
  ): Promise<string> {
    const context: Partial<ErrorContext> = {
      operation: `calendar_${operation}`,
      component: 'calendar'
    };
    
    // Stop calendar loading
    stopLoading('calendar');
    
    // Calendar errors are usually not critical for owners
    if (operation === 'load') {
      uiStore.addNotification(
        'warning',
        'Calendar Loading Issue',
        'Having trouble loading your calendar. Please refresh the page.',
        true
      );
    }
    
    return handleError(error, context, {
      showToUser: operation !== 'load', // Don't double-notify for load errors
      autoRetry: true,
      maxRetries: 2
    });
  }
  
  /**
   * Handle network errors with owner-friendly messages
   */
  async function handleNetworkError(
    error: Error | unknown,
    operation: string
  ): Promise<string> {
    const context: Partial<ErrorContext> = {
      operation: `network_${operation}`,
      component: 'network'
    };
    
    // Show helpful network error message
    uiStore.addNotification(
      'error',
      'Connection Issue',
      'Unable to connect. Please check your internet connection and try again.',
      false
    );
    
    return handleError(error, context, {
      showToUser: false, // We already showed a custom notification
      autoRetry: true,
      maxRetries: 3,
      retryDelay: 2000
    });
  }
  
  /**
   * Show success message for owners
   */
  function showSuccessMessage(
    operation: string,
    details?: string
  ): void {
    const messages = {
      property_created: 'Property added successfully!',
      property_updated: 'Property updated successfully!',
      property_deleted: 'Property removed successfully!',
      booking_created: 'Booking created successfully!',
      booking_updated: 'Booking updated successfully!',
      booking_deleted: 'Booking cancelled successfully!',
      profile_updated: 'Profile updated successfully!',
      password_changed: 'Password changed successfully!'
    };
    
    const message = messages[operation as keyof typeof messages] || 'Operation completed successfully!';
    const fullMessage = details ? `${message} ${details}` : message;
    
    uiStore.addNotification('success', 'Success', fullMessage, true);
  }
  
  /**
   * Show helpful tip for owners
   */
  function showHelpfulTip(
    category: 'booking' | 'property' | 'calendar' | 'general',
    tip: string
  ): void {
    const titles = {
      booking: 'Booking Tip',
      property: 'Property Tip',
      calendar: 'Calendar Tip',
      general: 'Helpful Tip'
    };
    
    uiStore.addNotification('info', titles[category], tip, true);
  }
  
  /**
   * Clear all owner-specific errors
   */
  function clearOwnerErrors(): void {
    // Clear loading states for owner operations
    stopLoading('property-create');
    stopLoading('property-update');
    stopLoading('property-delete');
    stopLoading('booking-create');
    stopLoading('booking-update');
    stopLoading('booking-delete');
    stopLoading('calendar');
    stopLoading('auth');
    
    // Clear notifications
    uiStore.clearNotifications();
  }
  
  return {
    // Error handlers
    handlePropertyError,
    handleBookingError,
    handleFormError,
    handleAuthError,
    handleCalendarError,
    handleNetworkError,
    
    // Success and help
    showSuccessMessage,
    showHelpfulTip,
    clearOwnerErrors,
    
    // Re-export shared handlers for convenience
    handleError,
    handleApiError,
    handleValidationError,
    handleBusinessError
  };
} 