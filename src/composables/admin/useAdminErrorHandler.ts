/**
 * Admin Error Handler Composable
 * Provides technical error handling with business impact assessment for administrators
 */

import { computed } from 'vue';
import { useErrorHandler } from '@/composables/shared/useErrorHandler';
import { useAuthStore } from '@/stores/auth';
import type { BusinessImpact } from '@/types/ui';
import { useLoadingState } from '@/composables/shared/useLoadingState';
import { useUIStore } from '@/stores/ui';
import type { ErrorContext } from '@/types';

/**
 * Admin-specific error handler
 * Provides technical error details with business impact assessment
 */
export function useAdminErrorHandler() {
  const { handleError, handleApiError, handleValidationError, handleBusinessError } = useErrorHandler();
  const { stopLoading } = useLoadingState();
  const authStore = useAuthStore();
  const uiStore = useUIStore();
  
  // Computed
  const isAdmin = computed(() => authStore.user?.role === 'admin');
  
  /**
   * Handle system-wide property errors for admins
   */
  async function handleSystemPropertyError(
    error: unknown,
    operation: 'create' | 'update' | 'delete' | 'fetch' | 'bulk_update',
    context: { propertyIds?: string[], affectedBookings?: number, affectedCleaners?: number } = {}
  ): Promise<string> {
    const businessImpact = assessPropertyBusinessImpact(context);
    
    const errorContext: Partial<ErrorContext> = {
      operation: `system_property_${operation}`,
      component: 'admin_property_management',
      affectedResources: context.propertyIds || [],
      businessImpact
    };
    
    // Stop loading states
    stopLoading(`admin-property-${operation}`);
    
    // Show business impact notification
    if (businessImpact === 'high' || businessImpact === 'critical') {
      uiStore.addNotification(
        'error',
        'Critical Property Error',
        `Property operation failed. ${context.affectedBookings || 0} bookings affected. ${context.affectedCleaners || 0} cleaners impacted.`,
        false
      );
    }
    
    return handleError(error, errorContext, {
      showToUser: true,
      autoRetry: operation === 'fetch',
      maxRetries: operation === 'fetch' ? 3 : 1,
      reportToService: true,
      escalate: businessImpact === 'critical'
    });
  }
  
  /**
   * Handle booking management errors for admins
   */
  async function handleBookingManagementError(
    error: unknown,
    operation: 'create' | 'update' | 'delete' | 'assign_cleaner' | 'bulk_update',
    context: { 
      bookingIds?: string[], 
      cleanerIds?: string[], 
      revenueImpact?: number,
      clientsAffected?: number 
    } = {}
  ): Promise<string> {
    const businessImpact = assessBookingBusinessImpact(context);
    
    const errorContext: Partial<ErrorContext> = {
      operation: `booking_management_${operation}`,
      component: 'admin_booking_management',
      affectedResources: [...(context.bookingIds || []), ...(context.cleanerIds || [])],
      businessImpact
    };
    
    // Stop loading states
    stopLoading(`admin-booking-${operation}`);
    
    // Show detailed business impact
    if (context.revenueImpact && context.revenueImpact > 0) {
      uiStore.addNotification(
        'warning',
        'Revenue Impact Alert',
        `Booking operation failed. Potential revenue impact: $${context.revenueImpact}. Clients affected: ${context.clientsAffected || 0}.`,
        false
      );
    }
    
    return handleError(error, errorContext, {
      showToUser: true,
      autoRetry: false,
      reportToService: true,
      escalate: businessImpact === 'high' || businessImpact === 'critical'
    });
  }
  
  /**
   * Handle cleaner management errors for admins
   */
  async function handleCleanerManagementError(
    error: unknown,
    operation: 'assign' | 'unassign' | 'schedule' | 'update_availability',
    context: { 
      cleanerIds?: string[], 
      affectedBookings?: string[],
      scheduleConflicts?: number 
    } = {}
  ): Promise<string> {
    const businessImpact = assessCleanerBusinessImpact(context);
    
    const errorContext: Partial<ErrorContext> = {
      operation: `cleaner_management_${operation}`,
      component: 'admin_cleaner_management',
      affectedResources: [...(context.cleanerIds || []), ...(context.affectedBookings || [])],
      businessImpact
    };
    
    // Stop loading states
    stopLoading(`admin-cleaner-${operation}`);
    
    // Show service delivery impact
    if (context.scheduleConflicts && context.scheduleConflicts > 0) {
      uiStore.addNotification(
        'error',
        'Service Delivery Risk',
        `Cleaner assignment failed. ${context.scheduleConflicts} schedule conflicts detected. Service delivery at risk.`,
        false
      );
    }
    
    return handleError(error, errorContext, {
      showToUser: true,
      autoRetry: operation === 'assign',
      maxRetries: 2,
      reportToService: true,
      escalate: businessImpact === 'critical'
    });
  }
  
  /**
   * Handle data integrity errors for admins
   */
  async function handleDataIntegrityError(
    error: unknown,
    operation: 'validation' | 'sync' | 'backup' | 'restore',
    context: { 
      affectedTables?: string[], 
      recordCount?: number,
      dataLoss?: boolean 
    } = {}
  ): Promise<string> {
    const businessImpact: BusinessImpact = context.dataLoss ? 'critical' : 'high';
    
    const errorContext: Partial<ErrorContext> = {
      operation: `data_integrity_${operation}`,
      component: 'admin_data_management',
      affectedResources: context.affectedTables || [],
      businessImpact
    };
    
    // Data integrity errors are always critical
    uiStore.addNotification(
      'error',
      'Data Integrity Alert',
      `Data integrity issue detected. ${context.recordCount || 0} records affected. ${context.dataLoss ? 'Data loss risk!' : 'Investigation required.'}`,
      false
    );
    
    return handleError(error, errorContext, {
      showToUser: false, // Already showed custom notification
      autoRetry: false,
      reportToService: true,
      escalate: true
    });
  }
  
  /**
   * Handle integration errors (external APIs, services)
   */
  async function handleIntegrationError(
    error: unknown,
    service: string,
    operation: string,
    context: { 
      endpoint?: string,
      affectedFeatures?: string[],
      fallbackAvailable?: boolean 
    } = {}
  ): Promise<string> {
    const businessImpact = context.fallbackAvailable ? 'medium' : 'high';
    
    const errorContext: Partial<ErrorContext> = {
      operation: `integration_${service}_${operation}`,
      component: 'admin_integrations',
      affectedResources: context.affectedFeatures || [],
      businessImpact
    };
    
    // Show integration status
    uiStore.addNotification(
      'warning',
      'Integration Issue',
      `${service} integration failed. ${context.fallbackAvailable ? 'Fallback active.' : 'Service degraded.'} Features affected: ${context.affectedFeatures?.join(', ') || 'Unknown'}.`,
      false
    );
    
    return handleError(error, errorContext, {
      showToUser: false,
      autoRetry: true,
      maxRetries: 5,
      retryDelay: 5000,
      reportToService: true,
      escalate: !context.fallbackAvailable
    });
  }
  
  /**
   * Handle security-related errors for admins
   */
  async function handleSecurityError(
    error: unknown,
    operation: 'authentication' | 'authorization' | 'audit' | 'breach_detection',
    context: { 
      userId?: string,
      ipAddress?: string,
      severity?: 'low' | 'medium' | 'high' | 'critical',
      attemptCount?: number 
    } = {}
  ): Promise<string> {
    const businessImpact: BusinessImpact = context.severity || 'high';
    
    const errorContext: Partial<ErrorContext> = {
      operation: `security_${operation}`,
      component: 'admin_security',
      affectedResources: context.userId ? [context.userId] : [],
      businessImpact
    };
    
    // Security errors require immediate attention
    uiStore.addNotification(
      'error',
      'Security Alert',
      `Security incident detected: ${operation}. User: ${context.userId || 'Unknown'}. IP: ${context.ipAddress || 'Unknown'}. Severity: ${context.severity || 'High'}.`,
      false
    );
    
    return handleError(error, errorContext, {
      showToUser: false,
      autoRetry: false,
      reportToService: true,
      escalate: true
    });
  }
  
  /**
   * Handle performance-related errors for admins
   */
  async function handlePerformanceError(
    error: unknown,
    operation: string,
    context: { 
      responseTime?: number,
      threshold?: number,
      affectedUsers?: number,
      systemLoad?: number 
    } = {}
  ): Promise<string> {
    const businessImpact = assessPerformanceBusinessImpact(context);
    
    const errorContext: Partial<ErrorContext> = {
      operation: `performance_${operation}`,
      component: 'admin_performance',
      businessImpact
    };
    
    // Show performance metrics
    if (context.responseTime && context.threshold) {
      uiStore.addNotification(
        'warning',
        'Performance Degradation',
        `Slow response detected: ${context.responseTime}ms (threshold: ${context.threshold}ms). Users affected: ${context.affectedUsers || 0}. System load: ${context.systemLoad || 0}%.`,
        true
      );
    }
    
    return handleError(error, errorContext, {
      showToUser: false,
      autoRetry: true,
      maxRetries: 2,
      reportToService: true,
      escalate: businessImpact === 'critical'
    });
  }
  
  /**
   * Show admin success message with business metrics
   */
  function showAdminSuccessMessage(
    operation: string,
    context: { 
      recordsAffected?: number,
      revenueImpact?: number,
      usersNotified?: number,
      systemHealth?: number 
    } = {}
  ): void {
    const messages = {
      property_created: `Property added to system. Total properties: ${context.recordsAffected || 1}.`,
      property_updated: `Property updated. Affected bookings: ${context.recordsAffected || 0}. Users notified: ${context.usersNotified || 0}.`,
      booking_assigned: `Cleaner assigned successfully. Revenue: $${context.revenueImpact || 0}. System health: ${context.systemHealth || 100}%.`,
      system_backup: `System backup completed. Records: ${context.recordsAffected || 0}. Health: ${context.systemHealth || 100}%.`,
      integration_restored: `Integration restored. Users affected: ${context.usersNotified || 0}. System health: ${context.systemHealth || 100}%.`
    };
    
    const message = messages[operation as keyof typeof messages] || 
      `Operation completed. Records: ${context.recordsAffected || 0}. System health: ${context.systemHealth || 100}%.`;
    
    uiStore.addNotification('success', 'System Update', message, true);
  }
  
  /**
   * Show system health report
   */
  function showSystemHealthReport(
    metrics: {
      uptime?: number,
      errorRate?: number,
      responseTime?: number,
      activeUsers?: number,
      systemLoad?: number
    }
  ): void {
    const health = calculateSystemHealth(metrics);
    const status = health >= 95 ? 'Excellent' : health >= 85 ? 'Good' : health >= 70 ? 'Fair' : 'Poor';
    
    uiStore.addNotification(
      health >= 85 ? 'success' : health >= 70 ? 'warning' : 'error',
      'System Health Report',
      `Status: ${status} (${health}%). Uptime: ${metrics.uptime || 0}%. Error rate: ${metrics.errorRate || 0}%. Response time: ${metrics.responseTime || 0}ms.`,
      false
    );
  }
  
  /**
   * Assess property business impact
   */
  function assessPropertyBusinessImpact(context: { 
    propertyIds?: string[], 
    affectedBookings?: number, 
    affectedCleaners?: number 
  }): BusinessImpact {
    const propertyCount = context.propertyIds?.length || 0;
    const bookingCount = context.affectedBookings || 0;
    const cleanerCount = context.affectedCleaners || 0;
    
    if (propertyCount > 10 || bookingCount > 20 || cleanerCount > 5) return 'critical';
    if (propertyCount > 5 || bookingCount > 10 || cleanerCount > 2) return 'high';
    if (propertyCount > 1 || bookingCount > 3) return 'medium';
    return 'low';
  }
  
  /**
   * Assess booking business impact
   */
  function assessBookingBusinessImpact(context: { 
    revenueImpact?: number, 
    clientsAffected?: number 
  }): BusinessImpact {
    const revenue = context.revenueImpact || 0;
    const clients = context.clientsAffected || 0;
    
    if (revenue > 5000 || clients > 10) return 'critical';
    if (revenue > 1000 || clients > 5) return 'high';
    if (revenue > 200 || clients > 1) return 'medium';
    return 'low';
  }
  
  /**
   * Assess cleaner business impact
   */
  function assessCleanerBusinessImpact(context: { 
    cleanerIds?: string[], 
    affectedBookings?: string[], 
    scheduleConflicts?: number 
  }): BusinessImpact {
    const cleaners = context.cleanerIds?.length || 0;
    const bookings = context.affectedBookings?.length || 0;
    const conflicts = context.scheduleConflicts || 0;
    
    if (cleaners > 5 || bookings > 15 || conflicts > 10) return 'critical';
    if (cleaners > 2 || bookings > 8 || conflicts > 5) return 'high';
    if (cleaners > 1 || bookings > 3 || conflicts > 2) return 'medium';
    return 'low';
  }
  
  /**
   * Assess performance business impact
   */
  function assessPerformanceBusinessImpact(context: { 
    responseTime?: number, 
    threshold?: number, 
    affectedUsers?: number, 
    systemLoad?: number 
  }): BusinessImpact {
    const responseRatio = context.responseTime && context.threshold ? 
      context.responseTime / context.threshold : 1;
    const users = context.affectedUsers || 0;
    const load = context.systemLoad || 0;
    
    if (responseRatio > 5 || users > 50 || load > 90) return 'critical';
    if (responseRatio > 3 || users > 20 || load > 75) return 'high';
    if (responseRatio > 2 || users > 5 || load > 60) return 'medium';
    return 'low';
  }
  
  /**
   * Calculate overall system health
   */
  function calculateSystemHealth(metrics: {
    uptime?: number,
    errorRate?: number,
    responseTime?: number,
    systemLoad?: number
  }): number {
    const uptime = Math.min(metrics.uptime || 100, 100);
    const errorPenalty = (metrics.errorRate || 0) * 10;
    const responsePenalty = Math.max(0, (metrics.responseTime || 0) - 1000) / 100;
    const loadPenalty = Math.max(0, (metrics.systemLoad || 0) - 70) / 3;
    
    return Math.max(0, Math.min(100, uptime - errorPenalty - responsePenalty - loadPenalty));
  }
  
  /**
   * Clear all admin-specific errors and reset system state
   */
  function clearAdminErrors(): void {
    // Clear admin loading states
    stopLoading('admin-property-create');
    stopLoading('admin-property-update');
    stopLoading('admin-property-delete');
    stopLoading('admin-booking-create');
    stopLoading('admin-booking-update');
    stopLoading('admin-booking-assign');
    stopLoading('admin-cleaner-assign');
    stopLoading('admin-system-backup');
    
    // Clear notifications
    uiStore.clearNotifications();
  }
  
  return {
    // State from shared error handler
    hasErrors: useErrorHandler().hasErrors,
    criticalErrors: useErrorHandler().criticalErrors,
    currentUserRole: useAuthStore().user?.role,
    isAdmin,
    
    // Admin-specific error handlers
    handleSystemPropertyError,
    handleBookingManagementError,
    handleCleanerManagementError,
    handleDataIntegrityError,
    handleIntegrationError,
    handleSecurityError,
    handlePerformanceError,
    
    // Admin success and reporting
    showAdminSuccessMessage,
    showSystemHealthReport,
    
    // Business impact assessment
    assessPropertyBusinessImpact,
    assessBookingBusinessImpact,
    assessCleanerBusinessImpact,
    assessPerformanceBusinessImpact,
    calculateSystemHealth,
    
    // Management
    clearAdminErrors,
    
    // Re-export shared handlers for convenience
    handleError,
    handleApiError,
    handleValidationError,
    handleBusinessError
  };
} 