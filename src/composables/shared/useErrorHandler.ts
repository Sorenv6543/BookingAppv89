/**
 * Shared Error Handler Composable
 * Provides centralized error handling with role-based messaging
 */

import { ref, computed } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useUserStore } from '@/stores/user';
import type { 
  ErrorInfo, 
  ErrorContext, 
  ErrorHandlingOptions, 
  ErrorCategory, 
  UserRole,
  ErrorRecoveryAction,
  ApiError,
  RetryConfig,
  ErrorLike
} from '@/types/ui';
import { 
  getErrorMessage, 
  getBusinessImpactMessage,
  getRetryMessage,
  inferErrorCategory,
  assessBusinessImpact,
  extractErrorCode
} from '@/utils/errorMessages';

// Add NodeJS types reference
/// <reference types="node" />

interface ExtendedRetryConfig extends RetryConfig {
  retryableStatuses: number[];
  exponentialBackoff: boolean;
}

const defaultRetryConfig: ExtendedRetryConfig = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
  exponentialBackoff: true
};

interface ApiErrorResponse {
  status?: number;
  statusText?: string;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
}

type ApiErrorLike = ErrorLike & {
  response?: ApiErrorResponse;
  status?: number;
  statusText?: string;
  message?: string;
};

/**
 * Shared error handler composable
 */
export function useErrorHandler() {
  const uiStore = useUIStore();
  const userStore = useUserStore();
  
  // State
  const errors = ref<Map<string, ErrorInfo>>(new Map());
  const retryAttempts = ref<Map<string, number>>(new Map());
  const retryTimers = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const isRetrying = ref<Map<string, boolean>>(new Map());
  
  // Computed
  const currentUserRole = computed((): UserRole => {
    return userStore.currentUser?.role || 'owner';
  });
  
  const hasErrors = computed((): boolean => {
    return errors.value.size > 0;
  });
  
  const criticalErrors = computed((): ErrorInfo[] => {
    return Array.from(errors.value.values())
      .filter(error => error.businessImpact === 'critical');
  });
  
  /**
   * Handle an error with role-based messaging
   */
  async function handleError(
    error: ErrorLike,
    context: Partial<ErrorContext> = {},
    options: Partial<ErrorHandlingOptions> = {}
  ): Promise<string> {
    const errorInfo = parseError(error, context, options);
    const errorId = crypto.randomUUID();
    
    // Store error
    errors.value.set(errorId, errorInfo);
    
    // Log error
    if (errorInfo.options.logToConsole) {
      logError(errorInfo);
    }
    
    // Show notification
    if (errorInfo.options.showToUser) {
      showErrorNotification(errorInfo);
    }
    
    // Auto-retry if enabled
    if (errorInfo.options.autoRetry && errorInfo.options.maxRetries! > 0) {
      await attemptRetry(errorId, errorInfo);
    }
    
    // Report to service if enabled (admin only)
    if (errorInfo.options.reportToService && currentUserRole.value === 'admin') {
      await reportError(errorInfo);
    }
    
    // Escalate if required
    if (errorInfo.options.escalate || errorInfo.businessImpact === 'critical') {
      await escalateError(errorInfo);
    }
    
    return errorId;
  }
  
  /**
   * Parse error into structured ErrorInfo
   */
  function parseError(
    error: ErrorLike,
    context: Partial<ErrorContext> = {},
    options: Partial<ErrorHandlingOptions> = {}
  ): ErrorInfo {
    const errorCode = extractErrorCode(error);
    const errorMessage = error instanceof Error ? error.message : 
      typeof error === 'string' ? error :
      typeof error === 'object' && error && 'message' in error ? String(error.message) :
      'Unknown error';
    const category = inferErrorCategory(errorCode, String(errorMessage));
    
    const fullContext: ErrorContext = {
      userId: userStore.currentUser?.id,
      userRole: currentUserRole.value,
      timestamp: new Date().toISOString(),
      sessionId: userStore.sessionId,
      requestId: crypto.randomUUID(),
      ...context
    };
    
    const fullOptions: ErrorHandlingOptions = {
      showToUser: true,
      autoRetry: false,
      maxRetries: 0,
      retryDelay: 1000,
      logToConsole: true,
      reportToService: false,
      escalate: false,
      ...options
    };
    
    const businessImpact = assessBusinessImpact(category, {
      userRole: currentUserRole.value,
      ...context
    });
    
    const userMessage = getErrorMessage(
      category,
      errorCode || 'general',
      currentUserRole.value,
      context
    );
    
    return {
      code: errorCode,
      category,
      message: errorMessage,
      userMessage,
      technicalDetails: currentUserRole.value === 'admin' ? JSON.stringify(error, null, 2) : undefined,
      businessImpact,
      affectedResources: context.affectedResources || [],
      suggestedActions: getSuggestedActions(category, currentUserRole.value),
      context: fullContext,
      options: fullOptions
    };
  }
  
  /**
   * Log error to console with appropriate detail level
   */
  function logError(errorInfo: ErrorInfo): void {
    const { context, options } = errorInfo;
    
    if (context.userRole === 'admin' || process.env.NODE_ENV === 'development') {
      // Detailed logging for admins and development
      console.group(`🚨 Error in ${context.component || 'Unknown Component'}`);
      console.error('Message:', errorInfo.message);
      console.error('Technical:', errorInfo.technicalDetails);
      console.error('Category:', errorInfo.category);
      console.error('Code:', errorInfo.code);
      console.error('Context:', context);
      console.error('Options:', options);
      if (errorInfo.technicalDetails) {
        console.error('Technical Details:', errorInfo.technicalDetails);
      }
      console.groupEnd();
    } else {
      // Simple logging for owners
      console.error(`Error in ${context.operation}:`, errorInfo.userMessage);
    }
  }
  
  /**
   * Show error notification with role-appropriate styling
   */
  function showErrorNotification(errorInfo: ErrorInfo): void {
    const { context, options } = errorInfo;
    const isAdmin = context.userRole === 'admin';
    
    // Determine notification content
    const title = isAdmin ? 'System Error' : 'Error';
    const message = isAdmin ? errorInfo.technicalDetails || errorInfo.message : errorInfo.userMessage;
    
    // Create recovery actions
    const actions: ErrorRecoveryAction[] = [];
    
    if (options.retryable) {
      actions.push({
        label: 'Retry',
        action: () => retryOperation(errorInfo),
        primary: true
      });
    }
    
    if (isAdmin && options.businessImpact && options.businessImpact !== 'low') {
      actions.push({
        label: 'View Details',
        action: () => showErrorDetails(errorInfo)
      });
    }
    
    // Add notification to UI store with null coalescing for message
    const notificationId = uiStore.addNotification('error', title, message ?? 'Unknown error', !isAdmin);
    
    // Store notification ID for potential cleanup
    errorInfo.context.notificationId = notificationId;
  }
  
  /**
   * Show detailed error information (admin only)
   */
  function showErrorDetails(errorInfo: ErrorInfo): void {
    uiStore.openModal('error-details', 'view', {
      error: errorInfo,
      businessImpact: getBusinessImpactMessage(errorInfo.businessImpact || 'low')
    });
  }
  
  /**
   * Attempt automatic retry with exponential backoff
   */
  async function attemptRetry(
    errorId: string,
    errorInfo: ErrorInfo,
    retryConfig: Partial<ExtendedRetryConfig> = {}
  ): Promise<boolean> {
    const config = { ...defaultRetryConfig, ...retryConfig };
    const currentAttempts = retryAttempts.value.get(errorId) || 0;
    
    if (currentAttempts >= config.maxAttempts) {
      return false;
    }
    
    // Check retry condition
    if (config.retryCondition && !config.retryCondition(errorInfo)) {
      return false;
    }
    
    isRetrying.value.set(errorId, true);
    retryAttempts.value.set(errorId, currentAttempts + 1);
    
    // Calculate delay with exponential backoff
    let delay = config.baseDelay;
    if (config.exponentialBackoff) {
      delay = Math.min(config.baseDelay * Math.pow(2, currentAttempts), config.maxDelay);
    }
    
    // Add jitter to prevent thundering herd
    delay += Math.random() * 1000;
    
    // Show retry notification
    if (currentUserRole.value === 'admin') {
      uiStore.addNotification(
        'info',
        'Retrying Operation',
        `Retry attempt ${currentAttempts + 1}/${config.maxAttempts} in ${Math.round(delay/1000)}s`,
        true
      );
    }
    
    await new Promise(resolve => setTimeout(resolve, delay));
    isRetrying.value.set(errorId, false);
    
    return true;
  }
  
  /**
   * Get suggested actions based on error category and user role
   */
  function getSuggestedActions(category: ErrorCategory, role: UserRole): string[] {
    const actions = {
      owner: {
        validation: ['Check your input', 'Try again'],
        network: ['Check internet connection', 'Refresh page', 'Try again later'],
        business_logic: ['Choose different dates', 'Contact support'],
        authentication: ['Log in again', 'Reset password'],
        permission: ['Contact support'],
        system: ['Try again later', 'Contact support']
      },
      admin: {
        validation: ['Review form data', 'Check business rules', 'Update validation'],
        network: ['Check API status', 'Review network logs', 'Contact IT'],
        business_logic: ['Review business rules', 'Check data integrity', 'Update logic'],
        authentication: ['Check user permissions', 'Review auth logs', 'Reset user session'],
        permission: ['Update user roles', 'Review access controls', 'Check security logs'],
        system: ['Check system status', 'Review error logs', 'Escalate to engineering']
      }
    };
    
    return actions[role === 'admin' ? 'admin' : 'owner'][category] || [];
  }
  
  /**
   * Report error to external service (admin only)
   */
  async function reportError(errorInfo: ErrorInfo): Promise<void> {
    try {
      // Simulate error reporting service
      console.log('Reporting error to service:', errorInfo);
      
      // In real implementation, send to error tracking service
      // await errorTrackingService.report(errorInfo);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }
  
  /**
   * Escalate critical errors
   */
  async function escalateError(errorInfo: ErrorInfo): Promise<void> {
    try {
      // Simulate escalation
      console.log('Escalating error:', errorInfo);
      
      // In real implementation, notify on-call team, create incident ticket, etc.
      if (currentUserRole.value === 'admin') {
        uiStore.addNotification(
          'warning',
          'Error Escalated',
          `Critical error escalated. Incident ID: ${errorInfo.context.requestId}`,
          false
        );
      }
    } catch (escalationError) {
      console.error('Failed to escalate error:', escalationError);
    }
  }
  
  /**
   * Retry an operation
   */
  async function retryOperation(errorInfo: ErrorInfo): Promise<void> {
    const errorId = Array.from(errors.value.entries())
      .find(([, info]) => info === errorInfo)?.[0];
    
    if (!errorId) return;
    
    const currentAttempts = retryAttempts.value.get(errorId) || 0;
    const maxAttempts = errorInfo.options.maxRetries || 3;
    
    if (currentAttempts >= maxAttempts) {
      uiStore.addNotification(
        'warning', 
        'Retry Limit Reached', 
        getRetryMessageSafe(errorInfo.context.userRole, currentAttempts, maxAttempts)
      );
      return;
    }
    
    retryAttempts.value.set(errorId, currentAttempts + 1);
    
    // Show retry notification
    uiStore.addNotification(
      'info',
      'Retrying',
      getRetryMessageSafe(errorInfo.context.userRole, currentAttempts + 1, maxAttempts)
    );
    
    // TODO: Implement actual retry logic based on operation
    // This would typically involve calling the original operation again
  }
  
  /**
   * Clear an error
   */
  function clearError(errorId: string): void {
    errors.value.delete(errorId);
    retryAttempts.value.delete(errorId);
    
    const timer = retryTimers.value.get(errorId);
    if (timer) {
      clearTimeout(timer);
      retryTimers.value.delete(errorId);
    }
  }
  
  /**
   * Clear all errors
   */
  function clearAllErrors(): void {
    errors.value.clear();
    retryAttempts.value.clear();
    
    retryTimers.value.forEach(timer => clearTimeout(timer));
    retryTimers.value.clear();
  }
  
  /**
   * Get error by ID
   */
  function getError(errorId: string): ErrorInfo | undefined {
    return errors.value.get(errorId);
  }
  
  /**
   * Get all errors
   */
  function getAllErrors(): ErrorInfo[] {
    return Array.from(errors.value.values());
  }
  
  /**
   * Get retry message with type guard for user role
   */
  function getRetryMessageSafe(role: UserRole | undefined, attempt: number, max: number): string {
    return getRetryMessage(role ?? 'owner', attempt, max);
  }
  
  /**
   * Handle API errors specifically
   */
  async function handleApiError(
    error: ApiErrorLike,
    endpoint?: string,
    method?: string,
    context: Partial<ErrorContext> = {}
  ): Promise<string> {
    const apiError: ApiError = {
      status: error?.response?.status || error?.status,
      statusText: error?.response?.statusText || error?.statusText,
      code: extractErrorCode(error),
      message: error?.response?.data?.message || error?.message || 'API request failed',
      details: error?.response?.data,
      endpoint,
      method,
      timestamp: new Date().toISOString()
    };
    
    return handleError(apiError, {
      ...context,
      operation: `API ${method} ${endpoint}`,
      component: 'api'
    }, {
      autoRetry: true,
      maxRetries: 3,
      reportToService: currentUserRole.value === 'admin'
    });
  }
  
  /**
   * Handle validation errors
   */
  async function handleValidationError(
    validationErrors: ErrorLike[],
    context: Partial<ErrorContext> = {}
  ): Promise<string> {
    const errorMessage = validationErrors
      .map(err => {
        if (err instanceof Error) return err.message;
        if (typeof err === 'string') return err;
        if (typeof err === 'object' && err && 'message' in err) return err.message;
        return String(err);
      })
      .join(', ');
    
    return handleError(
      { message: errorMessage, code: 'VALIDATION_FAILED' },
      { ...context, operation: 'validation' },
      { autoRetry: false, showToUser: true }
    );
  }
  
  /**
   * Handle business logic errors
   */
  async function handleBusinessError(
    message: string,
    code: string,
    context: Partial<ErrorContext> = {}
  ): Promise<string> {
    return handleError(
      { message, code },
      { ...context, operation: 'business_logic' },
      { 
        autoRetry: false, 
        showToUser: true,
        escalate: currentUserRole.value === 'admin' && context.businessImpact === 'high'
      }
    );
  }
  
  /**
   * Check if operation is being retried
   */
  function isOperationRetrying(errorId: string): boolean {
    return isRetrying.value.get(errorId) || false;
  }
  
  /**
   * Get retry attempt count
   */
  function getRetryCount(errorId: string): number {
    return retryAttempts.value.get(errorId) || 0;
  }
  
  return {
    // State
    errors: computed(() => errors.value),
    hasErrors,
    criticalErrors,
    currentUserRole,
    
    // Methods
    handleError,
    handleApiError,
    handleValidationError,
    handleBusinessError,
    parseError,
    attemptRetry,
    clearError,
    clearAllErrors,
    getError,
    getAllErrors,
    isOperationRetrying,
    getRetryCount
  };
} 