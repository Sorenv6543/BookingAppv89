/**
 * Shared Loading State Composable
 * Provides centralized loading state management with role-based messaging
 */

import { ref, computed, onBeforeUnmount } from 'vue';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import type { 
  LoadingOperation, 
  LoadingStateOptions, 
  LoadingState, 
  LoadingType,
  UserRole 
} from '@/types/ui';
import { getLoadingMessage } from '@/utils/errorMessages';

/**
 * Default loading timeout (30 seconds)
 */
const DEFAULT_TIMEOUT = 30000;

/**
 * Shared loading state composable
 */
export function useLoadingState() {
  const uiStore = useUIStore();
  const authStore = useAuthStore();
  
  // State
  const operations = ref<Map<string, LoadingOperation>>(new Map());
  const timeouts = ref<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  
  // Computed
  const currentUserRole = computed((): UserRole => {
    return authStore.user?.role || 'owner';
  });
  
  const isLoading = computed(() => operations.value.size > 0);
  
  const globalLoading = computed(() => {
    return Array.from(operations.value.values()).some(op => op.type === 'global');
  });
  
  const pageLoading = computed(() => {
    return Array.from(operations.value.values()).some(op => op.type === 'page');
  });
  
  const componentLoading = computed(() => {
    return Array.from(operations.value.values()).some(op => op.type === 'component');
  });
  
  const actionLoading = computed(() => {
    return Array.from(operations.value.values()).some(op => op.type === 'action');
  });
  
  const loadingOperations = computed(() => Array.from(operations.value.values()));
  
  const loadingProgress = computed(() => {
    const ops = Array.from(operations.value.values());
    if (ops.length === 0) return 0;
    
    const totalProgress = ops.reduce((sum, op) => sum + (op.progress || 0), 0);
    return Math.round(totalProgress / ops.length);
  });
  
  /**
   * Start a loading operation
   */
  function startLoading(
    operationId: string,
    type: LoadingType = 'action',
    options: LoadingStateOptions = {}
  ): string {
    const operation: LoadingOperation = {
      id: operationId,
      type,
      message: options.message || getLoadingMessage(
        operationId,
        options.role || currentUserRole.value
      ),
      progress: 0,
      cancellable: options.cancellable || false,
      startTime: Date.now(),
      timeout: options.timeout || DEFAULT_TIMEOUT,
      role: options.role || currentUserRole.value
    };
    
    // Store operation
    operations.value.set(operationId, operation);
    
    // Update UI store loading state
    uiStore.setLoading(operationId, true);
    
    // Set timeout if specified
    if (operation.timeout && operation.timeout > 0) {
      const timeoutId = setTimeout(() => {
        handleTimeout(operationId);
      }, operation.timeout);
      
      timeouts.value.set(operationId, timeoutId);
    }
    
    return operationId;
  }
  
  /**
   * Update loading progress
   */
  function updateProgress(operationId: string, progress: number, message?: string): void {
    const operation = operations.value.get(operationId);
    if (!operation) return;
    
    const updatedOperation: LoadingOperation = {
      ...operation,
      progress: Math.max(0, Math.min(100, progress)),
      message: message || operation.message
    };
    
    operations.value.set(operationId, updatedOperation);
  }
  
  /**
   * Update loading message
   */
  function updateMessage(operationId: string, message: string): void {
    const operation = operations.value.get(operationId);
    if (!operation) return;
    
    const updatedOperation: LoadingOperation = {
      ...operation,
      message
    };
    
    operations.value.set(operationId, updatedOperation);
  }
  
  /**
   * Stop a loading operation
   */
  function stopLoading(operationId: string): void {
    // Remove operation
    operations.value.delete(operationId);
    
    // Update UI store
    uiStore.setLoading(operationId, false);
    
    // Clear timeout
    const timeoutId = timeouts.value.get(operationId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeouts.value.delete(operationId);
    }
  }
  
  /**
   * Cancel a loading operation
   */
  function cancelLoading(operationId: string, reason?: string): void {
    const operation = operations.value.get(operationId);
    if (!operation || !operation.cancellable) return;
    
    // Stop the operation
    stopLoading(operationId);
    
    // Show cancellation notification
    const message = reason || getRoleCancellationMessage(operation.role || currentUserRole.value);
    uiStore.addNotification('info', 'Operation Cancelled', message, true);
  }
  
  /**
   * Handle operation timeout
   */
  function handleTimeout(operationId: string): void {
    const operation = operations.value.get(operationId);
    if (!operation) return;
    
    // Stop the operation
    stopLoading(operationId);
    
    // Show timeout notification
    const message = getRoleTimeoutMessage(operation.role || currentUserRole.value, operation.id);
    uiStore.addNotification('warning', 'Operation Timeout', message, true);
  }
  
  /**
   * Get role-appropriate cancellation message
   */
  function getRoleCancellationMessage(role: UserRole): string {
    switch (role) {
      case 'owner':
        return "Operation was cancelled.";
      case 'admin':
        return "Operation cancelled by user request.";
      case 'cleaner':
        return "Task was cancelled.";
      default:
        return "Operation cancelled.";
    }
  }
  
  /**
   * Get role-appropriate timeout message
   */
  function getRoleTimeoutMessage(role: UserRole, operation: string): string {
    switch (role) {
      case 'owner':
        return "The operation is taking longer than expected. Please try again.";
      case 'admin':
        return `Operation timeout: ${operation} exceeded maximum duration. Check system status.`;
      case 'cleaner':
        return "Connection timeout. Please check your internet connection.";
      default:
        return "Operation timed out. Please try again.";
    }
  }
  
  /**
   * Stop all loading operations
   */
  function stopAllLoading(): void {
    // Clear all timeouts
    timeouts.value.forEach(timeoutId => clearTimeout(timeoutId));
    timeouts.value.clear();
    
    // Clear all operations
    const operationIds = Array.from(operations.value.keys());
    operations.value.clear();
    
    // Update UI store
    operationIds.forEach(id => uiStore.setLoading(id, false));
  }
  
  /**
   * Get loading state for a specific operation
   */
  function getLoadingState(operationId: string): LoadingState {
    const operation = operations.value.get(operationId);
    
    return {
      loading: !!operation,
      progress: operation?.progress,
      message: operation?.message,
      cancellable: operation?.cancellable || false,
      error: null // Error handling is managed by useErrorHandler
    };
  }
  
  /**
   * Check if a specific operation is loading
   */
  function isOperationLoading(operationId: string): boolean {
    return operations.value.has(operationId);
  }
  
  /**
   * Get operations by type
   */
  function getOperationsByType(type: LoadingType): LoadingOperation[] {
    return Array.from(operations.value.values()).filter(op => op.type === type);
  }
  
  /**
   * Get the longest running operation
   */
  function getLongestRunningOperation(): LoadingOperation | null {
    const ops = Array.from(operations.value.values());
    if (ops.length === 0) return null;
    
    return ops.reduce((longest, current) => {
      return current.startTime < longest.startTime ? current : longest;
    });
  }
  
  /**
   * Get loading duration for an operation
   */
  function getLoadingDuration(operationId: string): number {
    const operation = operations.value.get(operationId);
    if (!operation) return 0;
    
    return Date.now() - operation.startTime;
  }
  
  /**
   * Create a loading wrapper for async operations
   */
  async function withLoading<T>(
    operationId: string,
    asyncFn: () => Promise<T>,
    options: LoadingStateOptions = {}
  ): Promise<T> {
    try {
      // Start loading
      startLoading(operationId, options.role ? 'action' : 'component', options);
      
      // Execute async operation
      const result = await asyncFn();
      
      // Stop loading and resolve
      stopLoading(operationId);
      return result;
    } catch (error) {
      // Stop loading and reject
      stopLoading(operationId);
      throw error;
    }
  }
  
  /**
   * Create a loading wrapper for async operations with progress updates
   */
  async function withProgressLoading<T>(
    operationId: string,
    asyncFn: (updateProgress: (progress: number, message?: string) => void) => Promise<T>,
    options: LoadingStateOptions = {}
  ): Promise<T> {
    try {
      // Start loading
      startLoading(operationId, 'action', { ...options, showProgress: true });
      
      // Create progress updater
      const updateProgressFn = (progress: number, message?: string) => {
        updateProgress(operationId, progress, message);
      };
      
      // Execute async operation with progress updates
      const result = await asyncFn(updateProgressFn);
      
      // Complete progress and stop loading
      updateProgress(operationId, 100);
      setTimeout(() => stopLoading(operationId), 500); // Brief delay to show completion
      
      return result;
    } catch (error) {
      // Stop loading and reject
      stopLoading(operationId);
      throw error;
    }
  }
  
  /**
   * Cleanup on component unmount
   */
  onBeforeUnmount(() => {
    stopAllLoading();
  });
  
  return {
    // State
    isLoading,
    globalLoading,
    pageLoading,
    componentLoading,
    actionLoading,
    loadingOperations,
    loadingProgress,
    currentUserRole,
    
    // Methods
    startLoading,
    stopLoading,
    cancelLoading,
    updateProgress,
    updateMessage,
    stopAllLoading,
    getLoadingState,
    isOperationLoading,
    getOperationsByType,
    getLongestRunningOperation,
    getLoadingDuration,
    withLoading,
    withProgressLoading
  };
}

/**
 * Create a scoped loading state for a specific component
 */
export function useComponentLoadingState(componentName: string) {
  const loadingState = useLoadingState();
  
  const startComponentLoading = (operation: string, options: LoadingStateOptions = {}) => {
    const operationId = `${componentName}-${operation}`;
    return loadingState.startLoading(operationId, 'component', {
      ...options,
      message: options.message || getLoadingMessage(
        operation,
        options.role || loadingState.currentUserRole.value
      )
    });
  };
  
  const stopComponentLoading = (operation: string) => {
    const operationId = `${componentName}-${operation}`;
    loadingState.stopLoading(operationId);
  };
  
  const isComponentLoading = (operation: string) => {
    const operationId = `${componentName}-${operation}`;
    return loadingState.isOperationLoading(operationId);
  };
  
  const withComponentLoading = <T>(
    operation: string,
    asyncFn: () => Promise<T>,
    options: LoadingStateOptions = {}
  ) => {
    const operationId = `${componentName}-${operation}`;
    return loadingState.withLoading(operationId, asyncFn, options);
  };
  
  return {
    ...loadingState,
    startComponentLoading,
    stopComponentLoading,
    isComponentLoading,
    withComponentLoading
  };
} 