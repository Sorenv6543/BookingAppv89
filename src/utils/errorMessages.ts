/**
 * Error Message Mapping Utilities
 * Provides role-based error messages for different error scenarios
 */

import type { ErrorCategory, UserRole, BusinessImpact } from '@/types/ui';

/**
 * Error message templates for different roles
 */
export const ERROR_MESSAGES = {
  // Validation Errors
  validation: {
    owner: {
      required_field: "Please fill in all required fields.",
      invalid_date: "Please enter a valid date.",
      date_order: "Checkout date must be before checkin date.",
      invalid_email: "Please enter a valid email address.",
      password_weak: "Password must be at least 8 characters long.",
      phone_invalid: "Please enter a valid phone number."
    },
    admin: {
      required_field: "Validation failed: Required field missing ({field})",
      invalid_date: "Date validation error: Invalid date format ({value})",
      date_order: "Business rule violation: Checkout date after checkin date",
      invalid_email: "Email validation failed: Invalid format ({email})",
      password_weak: "Security policy violation: Password complexity insufficient",
      phone_invalid: "Contact validation error: Invalid phone format ({phone})"
    }
  },

  // Network Errors
  network: {
    owner: {
      connection_failed: "Unable to connect. Please check your internet connection and try again.",
      timeout: "The request is taking longer than expected. Please try again.",
      server_error: "Something went wrong on our end. Please try again in a few minutes.",
      not_found: "The requested information could not be found.",
      rate_limit: "Too many requests. Please wait a moment and try again."
    },
    admin: {
      connection_failed: "Network error: Connection failed (DNS/Firewall check required)",
      timeout: "Request timeout: Server response exceeded {timeout}ms threshold",
      server_error: "Server error {status}: {message} (Check server logs)",
      not_found: "Resource not found: {resource} at {endpoint}",
      rate_limit: "Rate limit exceeded: {limit} requests/minute (IP: {ip})"
    }
  },

  // Business Logic Errors
  business_logic: {
    owner: {
      booking_conflict: "This time slot conflicts with another booking. Please choose a different time.",
      property_unavailable: "This property is not available for the selected dates.",
      cleaner_unavailable: "No cleaners are available for this time slot.",
      invalid_turn: "Turn bookings must have checkout and checkin on the same day.",
      booking_too_late: "Bookings must be made at least 24 hours in advance."
    },
    admin: {
      booking_conflict: "Scheduling conflict: Booking overlaps with {conflicting_booking} (Property: {property})",
      property_unavailable: "Property constraint violation: {property} unavailable ({reason})",
      cleaner_unavailable: "Resource allocation error: No cleaners available (Capacity: {capacity})",
      invalid_turn: "Business rule violation: Turn booking date mismatch (CO: {checkout}, CI: {checkin})",
      booking_too_late: "Policy violation: Booking within {hours}h minimum notice period"
    }
  },

  // Authentication Errors
  authentication: {
    owner: {
      login_failed: "Invalid email or password. Please try again.",
      session_expired: "Your session has expired. Please log in again.",
      account_locked: "Your account has been temporarily locked. Please contact support.",
      password_reset_failed: "Unable to reset password. Please try again or contact support.",
      verification_failed: "Email verification failed. Please check your email and try again."
    },
    admin: {
      login_failed: "Authentication failed: Invalid credentials (User: {user}, IP: {ip})",
      session_expired: "Session timeout: Token expired after {duration} (Refresh required)",
      account_locked: "Security lockout: Account locked after {attempts} failed attempts",
      password_reset_failed: "Password reset error: {error} (User: {user})",
      verification_failed: "Email verification failed: Token invalid or expired ({token})"
    }
  },

  // Permission Errors
  permission: {
    owner: {
      access_denied: "You don't have permission to access this feature.",
      resource_forbidden: "You can only access your own properties and bookings.",
      action_not_allowed: "This action is not available for your account type.",
      feature_disabled: "This feature is not available in your current plan."
    },
    admin: {
      access_denied: "Permission denied: Insufficient privileges for {action} (Role: {role})",
      resource_forbidden: "Authorization failed: Access to {resource} denied (Policy: {policy})",
      action_not_allowed: "Action forbidden: {action} not permitted for role {role}",
      feature_disabled: "Feature access denied: {feature} disabled for tenant {tenant}"
    }
  },

  // System Errors
  system: {
    owner: {
      unexpected_error: "An unexpected error occurred. Please try again or contact support if the problem persists.",
      maintenance_mode: "The system is currently under maintenance. Please try again later.",
      service_unavailable: "The service is temporarily unavailable. Please try again in a few minutes.",
      data_corruption: "There was an issue with your data. Please contact support.",
      quota_exceeded: "You've reached your usage limit. Please upgrade your plan or contact support."
    },
    admin: {
      unexpected_error: "System error: Unhandled exception in {component} (Error ID: {errorId})",
      maintenance_mode: "Maintenance mode active: System unavailable until {endTime}",
      service_unavailable: "Service degradation: {service} unavailable (Health: {health}%)",
      data_corruption: "Data integrity error: Corruption detected in {table} (Backup required)",
      quota_exceeded: "Resource limit exceeded: {resource} at {usage}/{limit} (Scale required)"
    }
  }
} as const;

/**
 * Business impact messages for admin interface
 */
export const BUSINESS_IMPACT_MESSAGES = {
  low: "Minimal business impact. Individual user affected.",
  medium: "Moderate business impact. Multiple users or single property affected.",
  high: "Significant business impact. Multiple properties or cleaners affected.",
  critical: "Critical business impact. System-wide outage or data loss risk."
} as const;

// Removed duplicate getErrorMessage function - using the one below

/**
 * Get generic error message for role
 */
export function getGenericErrorMessage(role: UserRole): string {
  switch (role) {
    case 'owner':
      return "Something went wrong. Please try again.";
    case 'admin':
      return "System error: Unknown error occurred (Check logs for details)";
    case 'cleaner':
      return "Unable to complete action. Please contact your supervisor.";
    default:
      return "An error occurred. Please try again.";
  }
}

/**
 * Get business impact message
 */
export function getBusinessImpactMessage(impact: BusinessImpact): string {
  return BUSINESS_IMPACT_MESSAGES[impact];
}

/**
 * Replace placeholders in message template
 */
function replacePlaceholders(message: string, context: Record<string, any>): string {
  return message.replace(/\{(\w+)\}/g, (match, key) => {
    return context[key]?.toString() || match;
  });
}

/**
 * Get retry message based on role and error type
 */
export function getRetryMessage(role: UserRole, attempt: number, maxAttempts: number): string {
  switch (role) {
    case 'owner':
      return attempt < maxAttempts 
        ? "Retrying automatically..." 
        : "Please try again manually.";
    case 'admin':
      return `Retry attempt ${attempt}/${maxAttempts} (Auto-retry enabled)`;
    case 'cleaner':
      return "Retrying connection...";
    default:
      return "Retrying...";
  }
}

// Removed duplicate getLoadingMessage function - using the one below

// Removed duplicate getSuccessMessage function - using the one below

/**
 * Error code to category mapping
 */
export const ERROR_CODE_MAPPING: Record<string, ErrorCategory> = {
  // Validation codes
  'VALIDATION_ERROR': 'validation',
  'REQUIRED_FIELD': 'validation',
  'INVALID_FORMAT': 'validation',
  'CONSTRAINT_VIOLATION': 'validation',

  // Network codes
  'NETWORK_ERROR': 'network',
  'CONNECTION_TIMEOUT': 'network',
  'DNS_ERROR': 'network',
  'SSL_ERROR': 'network',

  // Business logic codes
  'BOOKING_CONFLICT': 'business_logic',
  'RESOURCE_UNAVAILABLE': 'business_logic',
  'BUSINESS_RULE_VIOLATION': 'business_logic',
  'SCHEDULING_ERROR': 'business_logic',

  // Authentication codes
  'AUTH_FAILED': 'authentication',
  'TOKEN_EXPIRED': 'authentication',
  'INVALID_CREDENTIALS': 'authentication',
  'SESSION_INVALID': 'authentication',

  // Permission codes
  'ACCESS_DENIED': 'permission',
  'INSUFFICIENT_PRIVILEGES': 'permission',
  'RESOURCE_FORBIDDEN': 'permission',
  'FEATURE_DISABLED': 'permission',

  // System codes
  'INTERNAL_ERROR': 'system',
  'SERVICE_UNAVAILABLE': 'system',
  'DATABASE_ERROR': 'system',
  'MAINTENANCE_MODE': 'system'
};

/**
 * Get error category from error code
 */
export function getErrorCategory(errorCode?: string): ErrorCategory {
  if (!errorCode) return 'system';
  return ERROR_CODE_MAPPING[errorCode] || 'system';
}

/**
 * Role-specific error message templates
 * Property owners get simple, encouraging messages
 * Admins get technical details with business impact
 */

// Owner error messages - Simple, user-friendly
const OWNER_MESSAGES = {
  validation: {
    required: 'Please fill in all required fields',
    invalid_email: 'Please enter a valid email address',
    invalid_date: 'Please select a valid date',
    date_conflict: 'These dates conflict with an existing booking',
    invalid_time: 'Please select a valid time',
    future_date: 'Please select a future date',
    date_range: 'Check-out date must be before check-in date'
  },
  network: {
    connection: 'Unable to connect. Please check your internet connection and try again.',
    timeout: 'Request timed out. Please try again.',
    server_error: 'Server is temporarily unavailable. Please try again in a few minutes.',
    not_found: 'The requested information could not be found.',
    rate_limit: 'Too many requests. Please wait a moment and try again.'
  },
  business_logic: {
    booking_conflict: 'This booking conflicts with an existing cleaning. Please choose different dates.',
    property_unavailable: 'This property is not available for the selected dates.',
    invalid_turn: 'Same-day bookings require special handling. Please contact support.',
    cleaner_unavailable: 'No cleaners are available for the selected time.',
    pricing_error: 'Unable to calculate pricing. Please try again.'
  },
  authentication: {
    login_failed: 'Invalid email or password. Please try again.',
    session_expired: 'Your session has expired. Please log in again.',
    unauthorized: 'You are not authorized to perform this action.',
    account_locked: 'Your account has been temporarily locked. Please contact support.'
  },
  permission: {
    access_denied: 'You do not have permission to access this feature.',
    read_only: 'You can only view this information.',
    owner_only: 'This feature is only available to property owners.'
  },
  system: {
    general: 'Something went wrong. Our team has been notified. Please try again later.',
    maintenance: 'The system is currently under maintenance. Please try again later.',
    data_error: 'There was an issue with your data. Please refresh and try again.'
  }
};

// Admin error messages - Technical with business impact
const ADMIN_MESSAGES = {
  validation: {
    required: 'Validation failed: Required field missing ({field}). Form submission blocked.',
    invalid_email: 'Email validation failed: Invalid format ({email}). User registration blocked.',
    invalid_date: 'Date validation failed: Invalid format ({date}). Booking creation blocked.',
    date_conflict: 'Booking conflict detected: Property {property} has overlapping cleaning window. Affected cleaner: {cleaner}.',
    invalid_time: 'Time validation failed: Invalid format ({time}). Schedule update blocked.',
    future_date: 'Date validation failed: Past date selected ({date}). Business rule violation.',
    date_range: 'Date range validation failed: Check-out after check-in ({checkout} > {checkin}). Logic error.'
  },
  network: {
    connection: 'Network connection failed. API endpoint: {endpoint}. Retry attempt {attempt}/{maxAttempts}. System status: Degraded.',
    timeout: 'Network timeout ({timeout}s). API endpoint: {endpoint}. Retry attempt {attempt}/{maxAttempts}. System status: Degraded.',
    server_error: 'Server error ({status}): {message}. Endpoint: {endpoint}. Incident logged. Escalation: Level {level}.',
    not_found: 'Resource not found ({endpoint}). Possible data integrity issue. Investigation required.',
    rate_limit: 'Rate limit exceeded ({limit} req/min). API endpoint: {endpoint}. Client throttling active.'
  },
  business_logic: {
    booking_conflict: 'Booking conflict detected: Property {property} has overlapping cleaning window. Affected cleaner: {cleaner}. Business impact: {impact}.',
    property_unavailable: 'Property availability conflict: {property} blocked for {dates}. Affected bookings: {count}. Revenue impact: ${amount}.',
    invalid_turn: 'Turn booking validation failed: Same-day checkout/checkin requires 4-hour window. Property: {property}. Business rule violation.',
    cleaner_unavailable: 'Cleaner assignment failed: No available cleaners for {date} {time}. Affected properties: {count}. Service delivery at risk.',
    pricing_error: 'Pricing calculation failed: Missing rate data for property {property}. Revenue calculation blocked. Data integrity issue.'
  },
  authentication: {
    login_failed: 'Authentication failed: Invalid credentials for user {user}. Login attempt {attempt}. Security audit logged.',
    session_expired: 'Session expired (JWT_EXPIRED). User role: {role}. Last activity: {lastActivity}. Security audit logged.',
    unauthorized: 'Authorization failed: User {user} attempted {action}. Permission level: {level}. Security violation logged.',
    account_locked: 'Account locked: User {user} exceeded login attempts. Security protocol activated. Admin intervention required.'
  },
  permission: {
    access_denied: 'Access denied: User {user} attempted {action}. Required role: {requiredRole}. Current role: {currentRole}. Security audit logged.',
    read_only: 'Write operation blocked: User {user} has read-only access to {resource}. Permission escalation required.',
    owner_only: 'Owner-only operation attempted: User {user} tried {action}. Role restriction enforced. Security audit logged.'
  },
  system: {
    general: 'System error ({code}): {message}. Component: {component}. Incident ID: {incidentId}. Escalation: Level {level}.',
    maintenance: 'Maintenance mode active: {service} unavailable. Estimated restoration: {eta}. Business impact: {impact}.',
    data_error: 'Data integrity error: {table} inconsistency detected. Affected records: {count}. Data recovery initiated.'
  }
};

// Loading messages
const LOADING_MESSAGES = {
  owner: {
    global: 'Loading your dashboard...',
    properties: 'Loading your properties...',
    bookings: 'Loading your bookings...',
    calendar: 'Loading your calendar...',
    saving: 'Saving your changes...',
    deleting: 'Removing item...',
    uploading: 'Uploading file...'
  },
  admin: {
    global: 'Loading system dashboard...',
    properties: 'Loading all properties...',
    bookings: 'Loading all bookings...',
    calendar: 'Loading master calendar...',
    cleaners: 'Loading cleaner assignments...',
    reports: 'Generating business reports...',
    saving: 'Updating system data...',
    deleting: 'Removing system record...',
    uploading: 'Processing system upload...'
  }
};

// Success messages
const SUCCESS_MESSAGES = {
  owner: {
    property_created: 'Property added successfully!',
    property_updated: 'Property updated successfully!',
    property_deleted: 'Property removed successfully!',
    booking_created: 'Booking created successfully!',
    booking_updated: 'Booking updated successfully!',
    booking_deleted: 'Booking cancelled successfully!',
    profile_updated: 'Profile updated successfully!'
  },
  admin: {
    property_created: 'Property added to system. Total properties: {total}.',
    property_updated: 'Property updated. Affected bookings: {bookings}. Cleaners notified: {cleaners}.',
    property_deleted: 'Property removed from system. Bookings archived: {bookings}. Revenue impact: ${revenue}.',
    booking_created: 'Booking created. Cleaner assigned: {cleaner}. Revenue: ${revenue}.',
    booking_updated: 'Booking updated. Status: {status}. Cleaner: {cleaner}. Next action: {nextAction}.',
    booking_deleted: 'Booking cancelled. Cleaner freed: {cleaner}. Revenue impact: ${revenue}.',
    cleaner_assigned: 'Cleaner {cleaner} assigned to {property}. Schedule updated. Client notified.',
    system_updated: 'System configuration updated. Affected users: {users}. Changes effective immediately.'
  }
};

/**
 * Get role-specific error message
 */
export function getErrorMessage(
  category: ErrorCategory,
  code: string,
  role: UserRole = 'owner',
  context: Record<string, any> = {}
): string {
  const messages = role === 'admin' ? ADMIN_MESSAGES : OWNER_MESSAGES;
  const categoryMessages = messages[category];
  
  if (!categoryMessages || !categoryMessages[code]) {
    return role === 'admin' 
      ? `Unknown error (${category}:${code}). Context: ${JSON.stringify(context)}. Investigation required.`
      : 'An unexpected error occurred. Please try again.';
  }
  
  let message = categoryMessages[code];
  
  // Replace placeholders with context values
  Object.entries(context).forEach(([key, value]) => {
    message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  });
  
  return message;
}

/**
 * Get role-specific loading message
 */
export function getLoadingMessage(
  operation: string,
  role: UserRole = 'owner'
): string {
  const messages = LOADING_MESSAGES[role === 'admin' ? 'admin' : 'owner'];
  return messages[operation] || (role === 'admin' ? 'Processing system operation...' : 'Loading...');
}

/**
 * Get role-specific success message
 */
export function getSuccessMessage(
  action: string,
  role: UserRole = 'owner',
  context: Record<string, any> = {}
): string {
  const messages = SUCCESS_MESSAGES[role === 'admin' ? 'admin' : 'owner'];
  let message = messages[action];
  
  if (!message) {
    return role === 'admin' 
      ? `Operation completed successfully. Context: ${JSON.stringify(context)}.`
      : 'Operation completed successfully!';
  }
  
  // Replace placeholders with context values
  Object.entries(context).forEach(([key, value]) => {
    message = message.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value));
  });
  
  return message;
}

/**
 * Infer error category from error code or message
 */
export function inferErrorCategory(code?: string, message?: string): ErrorCategory {
  if (!code && !message) return 'system';
  
  const text = (code + ' ' + message).toLowerCase();
  
  if (text.includes('validation') || text.includes('required') || text.includes('invalid')) {
    return 'validation';
  }
  if (text.includes('network') || text.includes('timeout') || text.includes('connection')) {
    return 'network';
  }
  if (text.includes('auth') || text.includes('login') || text.includes('token')) {
    return 'authentication';
  }
  if (text.includes('permission') || text.includes('unauthorized') || text.includes('forbidden')) {
    return 'permission';
  }
  if (text.includes('conflict') || text.includes('business') || text.includes('rule')) {
    return 'business_logic';
  }
  
  return 'system';
}

/**
 * Determine business impact based on error context
 */
export function assessBusinessImpact(
  category: ErrorCategory,
  context: Record<string, any> = {}
): BusinessImpact {
  // Critical: System-wide outages, data loss
  if (category === 'system' && context.systemWide) return 'critical';
  if (context.dataLoss || context.securityBreach) return 'critical';
  
  // High: Multiple users/properties affected
  if (context.affectedUsers > 10 || context.affectedProperties > 5) return 'high';
  if (category === 'authentication' && context.multipleUsers) return 'high';
  
  // Medium: Single property or multiple bookings affected
  if (context.affectedBookings > 3 || context.revenueImpact > 500) return 'medium';
  if (category === 'business_logic') return 'medium';
  
  // Low: Individual user affected
  return 'low';
}

/**
 * Get error code from various error types
 */
export function extractErrorCode(error: any): string | undefined {
  if (typeof error === 'string') return undefined;
  if (error?.code) return error.code;
  if (error?.response?.data?.code) return error.response.data.code;
  if (error?.status) return `HTTP_${error.status}`;
  return undefined;
}

/**
 * Get user-friendly error title based on category and role
 */
export function getErrorTitle(category: ErrorCategory, role: UserRole = 'owner'): string {
  const titles = {
    owner: {
      validation: 'Please Check Your Input',
      network: 'Connection Issue',
      business_logic: 'Booking Issue',
      authentication: 'Login Required',
      permission: 'Access Restricted',
      system: 'Temporary Issue'
    },
    admin: {
      validation: 'Validation Error',
      network: 'Network Error',
      business_logic: 'Business Logic Error',
      authentication: 'Authentication Error',
      permission: 'Permission Error',
      system: 'System Error'
    }
  };
  
  return titles[role === 'admin' ? 'admin' : 'owner'][category];
} 