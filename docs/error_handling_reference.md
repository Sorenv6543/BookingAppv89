# Error Handling Best Practices Reference

## **Error Handling Strategy Overview**

### **Error Categories in Your App:**
1. **Network/API Errors** - Supabase calls, network timeouts
2. **Validation Errors** - Form validation, business rule violations  
3. **User Errors** - Invalid actions, permission issues
4. **System Errors** - Unexpected failures, bugs
5. **Business Logic Errors** - Turn booking conflicts, scheduling issues

## **Global Error Handling System**

### **Error Store (Pinia)**
```typescript
// stores/error.ts
interface AppError {
  id: string;
  type: 'validation' | 'network' | 'business' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: string;
  timestamp: string;
  source?: string; // component or function that threw
  retryable?: boolean;
}

export const useErrorStore = defineStore('error', () => {
  const errors = reactive(new Map<string, AppError>());
  const notifications = ref<Array<{
    id: string;
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
    persistent?: boolean;
  }>>([]);

  const addError = (error: Omit<AppError, 'id' | 'timestamp'>): string => {
    const id = crypto.randomUUID();
    const appError: AppError = {
      ...error,
      id,
      timestamp: new Date().toISOString()
    };
    
    errors.set(id, appError);
    
    // Add user notification based on severity
    if (error.severity === 'high' || error.severity === 'critical') {
      showNotification({
        id,
        message: error.message,
        type: 'error',
        persistent: error.severity === 'critical'
      });
    }
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('App Error:', appError);
    }
    
    return id;
  };

  const clearError = (id: string): void => {
    errors.delete(id);
    notifications.value = notifications.value.filter(n => n.id !== id);
  };

  const showNotification = (notification: typeof notifications.value[0]): void => {
    notifications.value.push(notification);
    
    // Auto-dismiss non-persistent notifications
    if (!notification.persistent) {
      setTimeout(() => {
        notifications.value = notifications.value.filter(n => n.id !== notification.id);
      }, 5000);
    }
  };

  return {
    errors,
    notifications,
    addError,
    clearError,
    showNotification
  };
});
```

### **Error Handling Composable**
```typescript
// composables/useErrorHandler.ts
export const useErrorHandler = () => {
  const errorStore = useErrorStore();

  const handleError = (
    error: unknown,
    context: string,
    options: {
      severity?: AppError['severity'];
      retryable?: boolean;
      userMessage?: string;
    } = {}
  ): string => {
    let message = 'An unexpected error occurred';
    let details = '';
    let type: AppError['type'] = 'system';

    // Parse different error types
    if (error instanceof Error) {
      message = error.message;
      details = error.stack || '';
      
      // Classify error types
      if (error.name === 'ValidationError') {
        type = 'validation';
        message = options.userMessage || error.message;
      } else if (error.name === 'NetworkError' || error.message.includes('fetch')) {
        type = 'network';
        message = options.userMessage || 'Connection problem. Please try again.';
      }
    } else if (typeof error === 'string') {
      message = error;
    }

    return errorStore.addError({
      type,
      severity: options.severity || 'medium',
      message,
      details,
      source: context,
      retryable: options.retryable
    });
  };

  const handleValidationError = (
    field: string,
    message: string,
    context: string
  ): string => {
    return handleError(
      new Error(`${field}: ${message}`),
      context,
      {
        severity: 'low',
        userMessage: message,
        retryable: false
      }
    );
  };

  const handleNetworkError = (
    error: unknown,
    context: string,
    retryCallback?: () => Promise<void>
  ): string => {
    return handleError(error, context, {
      severity: 'high',
      retryable: !!retryCallback,
      userMessage: 'Network error. Please check your connection and try again.'
    });
  };

  const handleBusinessLogicError = (
    message: string,
    context: string
  ): string => {
    return handleError(message, context, {
      severity: 'medium',
      userMessage: message,
      retryable: false
    });
  };

  return {
    handleError,
    handleValidationError,
    handleNetworkError,
    handleBusinessLogicError
  };
};
```

## **API Error Handling Patterns**

### **Supabase Error Handling**
```typescript
// composables/useSupabaseError.ts
export const useSupabaseError = () => {
  const { handleError, handleNetworkError } = useErrorHandler();

  const handleSupabaseError = (error: any, context: string): string => {
    if (!error) return '';

    // Network/connection errors
    if (error.message?.includes('Failed to fetch') || error.code === 'NETWORK_ERROR') {
      return handleNetworkError(error, context);
    }

    // Authentication errors
    if (error.message?.includes('JWT') || error.status === 401) {
      return handleError(error, context, {
        severity: 'high',
        userMessage: 'Your session has expired. Please log in again.',
        retryable: false
      });
    }

    // Permission errors
    if (error.status === 403 || error.message?.includes('permission')) {
      return handleError(error, context, {
        severity: 'medium',
        userMessage: 'You do not have permission to perform this action.',
        retryable: false
      });
    }

    // Validation errors (database constraints)
    if (error.code === '23505') { // Unique constraint violation
      return handleError(error, context, {
        severity: 'low',
        userMessage: 'This item already exists.',
        retryable: false
      });
    }

    // Generic database error
    return handleError(error, context, {
      severity: 'medium',
      userMessage: 'Database error. Please try again.',
      retryable: true
    });
  };

  return { handleSupabaseError };
};
```

### **Safe API Call Wrapper**
```typescript
// utils/safeApiCall.ts
export const safeApiCall = async <T>(
  apiFunction: () => Promise<T>,
  context: string,
  options: {
    retries?: number;
    retryDelay?: number;
    fallback?: T;
  } = {}
): Promise<{ data: T | null; error: string | null }> => {
  const { handleSupabaseError } = useSupabaseError();
  const { retries = 2, retryDelay = 1000, fallback = null } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const data = await apiFunction();
      return { data, error: null };
    } catch (error) {
      // Don't retry on validation or permission errors
      if (error?.status === 400 || error?.status === 403) {
        const errorId = handleSupabaseError(error, context);
        return { data: fallback, error: errorId };
      }

      // Retry on network/server errors
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }

      // Final attempt failed
      const errorId = handleSupabaseError(error, context);
      return { data: fallback, error: errorId };
    }
  }

  return { data: fallback, error: null };
};
```

## **Form Validation Error Handling**

### **Validation Composable**
```typescript
// composables/useValidation.ts
export const useValidation = () => {
  const { handleValidationError } = useErrorHandler();

  interface ValidationRule<T> {
    validator: (value: T) => boolean;
    message: string;
  }

  const createValidator = <T>(
    field: string,
    rules: ValidationRule<T>[]
  ) => {
    return (value: T): string[] => {
      const errors: string[] = [];
      
      for (const rule of rules) {
        if (!rule.validator(value)) {
          const errorId = handleValidationError(field, rule.message, 'form-validation');
          errors.push(rule.message);
        }
      }
      
      return errors;
    };
  };

  // Common validation rules
  const required = <T>(message = 'This field is required'): ValidationRule<T> => ({
    validator: (value: T) => value !== null && value !== undefined && value !== '',
    message
  });

  const minLength = (min: number, message?: string): ValidationRule<string> => ({
    validator: (value: string) => !value || value.length >= min,
    message: message || `Minimum ${min} characters required`
  });

  const futureDate = (message = 'Date must be in the future'): ValidationRule<string> => ({
    validator: (value: string) => {
      if (!value) return true;
      return new Date(value) > new Date();
    },
    message
  });

  return {
    createValidator,
    required,
    minLength,
    futureDate
  };
};
```

### **Form Error Display Component**
```vue
<!-- components/dumb/FormErrors.vue -->
<template>
  <v-alert
    v-if="errors.length > 0"
    type="error"
    variant="tonal"
    class="mb-4"
  >
    <div v-if="errors.length === 1">
      {{ errors[0] }}
    </div>
    <ul v-else class="mb-0">
      <li v-for="error in errors" :key="error">
        {{ error }}
      </li>
    </ul>
  </v-alert>
</template>

<script setup lang="ts">
interface Props {
  errors: string[];
}

defineProps<Props>();
</script>
```

## **Business Logic Error Handling**

### **Turn Booking Validation with Errors**
```typescript
// utils/bookingValidation.ts
export const validateTurnBooking = (
  booking: Partial<Booking>,
  property: Property,
  existingBookings: Booking[]
): { valid: boolean; errors: string[]; warnings: string[] } => {
  const { handleBusinessLogicError } = useErrorHandler();
  const errors: string[] = [];
  const warnings: string[] = [];

  if (booking.booking_type !== 'turn') {
    return { valid: true, errors, warnings };
  }

  const checkoutDate = new Date(booking.checkout_date!);
  const checkinDate = new Date(booking.checkin_date!);

  // Same day validation
  if (checkoutDate.toDateString() !== checkinDate.toDateString()) {
    const error = 'Turn bookings must have checkout and checkin on the same day';
    errors.push(error);
    handleBusinessLogicError(error, 'turn-booking-validation');
  }

  // Time gap validation
  const timeDiff = (checkinDate.getTime() - checkoutDate.getTime()) / (1000 * 60);
  const minTime = (property.cleaning_duration || 120) + 30;

  if (timeDiff < minTime) {
    const error = `Insufficient time for turn cleaning. Need ${minTime} minutes, have ${Math.floor(timeDiff)} minutes.`;
    errors.push(error);
    handleBusinessLogicError(error, 'turn-booking-validation');
  }

  // Conflict detection
  const conflicts = existingBookings.filter(existing => {
    const existingCheckout = new Date(existing.checkout_date);
    const existingCheckin = new Date(existing.checkin_date);
    
    return (existingCheckout < checkinDate && existingCheckin > checkoutDate);
  });

  if (conflicts.length > 0) {
    warnings.push(`${conflicts.length} potential scheduling conflicts detected`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};
```

## **User Notification System**

### **Notification Component**
```vue
<!-- components/dumb/NotificationSystem.vue -->
<template>
  <div class="notification-container">
    <v-snackbar
      v-for="notification in notifications"
      :key="notification.id"
      v-model="notification.show"
      :color="getColor(notification.type)"
      :timeout="notification.persistent ? -1 : 5000"
      location="top right"
      class="notification-snackbar"
    >
      {{ notification.message }}
      
      <template #actions>
        <v-btn
          variant="text"
          @click="closeNotification(notification.id)"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useErrorStore } from '@/stores/error';

const errorStore = useErrorStore();

const notifications = computed(() => {
  return errorStore.notifications.map(n => ({
    ...n,
    show: true
  }));
});

const getColor = (type: string): string => {
  const colors = {
    error: 'error',
    warning: 'warning',
    info: 'info',
    success: 'success'
  };
  return colors[type] || 'info';
};

const closeNotification = (id: string): void => {
  errorStore.clearError(id);
};
</script>
```

## **Integration with Components**

### **Using Error Handling in Composables**
```typescript
// composables/useBookings.ts
export const useBookings = () => {
  const { handleSupabaseError } = useSupabaseError();
  const { showNotification } = useErrorStore();

  const createBooking = async (bookingData: BookingFormData): Promise<Booking | null> => {
    const { data, error } = await safeApiCall(
      () => supabase.from('bookings').insert(bookingData).select().single(),
      'create-booking',
      { retries: 2 }
    );

    if (error) {
      return null; // Error already handled by safeApiCall
    }

    if (data) {
      showNotification({
        id: crypto.randomUUID(),
        message: 'Booking created successfully',
        type: 'success'
      });
      
      userStore.addEvent(data);
      return data;
    }

    return null;
  };

  return { createBooking };
};
```

## **Error Boundary Pattern**

### **Error Boundary Component**
```vue
<!-- components/smart/ErrorBoundary.vue -->
<template>
  <div>
    <slot v-if="!hasError" />
    
    <v-alert
      v-else
      type="error"
      variant="tonal"
      class="ma-4"
    >
      <v-alert-title>Something went wrong</v-alert-title>
      
      <div class="mb-4">
        {{ errorMessage }}
      </div>
      
      <v-btn
        variant="outlined"
        @click="retry"
      >
        Try Again
      </v-btn>
    </v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

interface Props {
  fallbackMessage?: string;
}

const props = withDefaults(defineProps<Props>(), {
  fallbackMessage: 'An unexpected error occurred. Please try again.'
});

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((error) => {
  hasError.value = true;
  errorMessage.value = props.fallbackMessage;
  
  // Log error for debugging
  console.error('Error caught by boundary:', error);
  
  return false; // Prevent error from propagating
});

const retry = (): void => {
  hasError.value = false;
  errorMessage.value = '';
};
</script>
```

This error handling system provides comprehensive coverage for all error scenarios in your property cleaning scheduler while maintaining good user experience and debugging capabilities.