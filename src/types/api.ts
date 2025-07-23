/**
 * API Type Definitions
 * Types for API interactions and responses
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
  message?: string;
}

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Paginated response from API
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Supabase table names
 */
export type TableName = 'users' | 'properties' | 'bookings' | 'cleaners';

/**
 * Error response from Supabase
 */
export interface SupabaseErrorResponse {
  code: string;
  details: string;
  hint: string;
  message: string;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
  } | null;
  session: Record<string, unknown> | null;
  error: string | null;
}
