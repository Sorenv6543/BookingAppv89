/**
 * Cleaning Task Type Definitions
 * Types for operational cleaning and maintenance tasks
 * 
 * Following industry best practices: Bookings represent guest stays,
 * cleaning tasks represent operational work that happens between bookings.
 * 
 * References:
 * - VRMA Standards
 * - Operto: https://operto.com/blog/vacation-rental-cleaning/
 * - SuiteOp: https://suiteop.com/blog/optimizing-housekeeping-and-maintenance-operations-in-the-vacation-rental-industry
 */

/**
 * Type of cleaning task
 * - turnover: Cleaning between guest bookings (auto-generated)
 * - deep_clean: Periodic deep cleaning (manual or scheduled)
 * - inspection: Property inspection and quality check
 * - maintenance: Maintenance and repair work
 */
export type CleaningTaskType = 'turnover' | 'deep_clean' | 'inspection' | 'maintenance';

/**
 * Status of cleaning task workflow
 * - scheduled: Task created and scheduled
 * - in_progress: Cleaner has started work
 * - completed: Task finished and verified
 * - cancelled: Task cancelled (booking cancelled or not needed)
 */
export type CleaningTaskStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

/**
 * Priority level for task scheduling
 * - low: Can be scheduled flexibly
 * - normal: Standard priority
 * - high: Same-day turnover or urgent need
 * - urgent: Critical (less than 2 hours until next checkin)
 */
export type CleaningTaskPriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * Checklist item for cleaning task
 * Used in the checklist JSONB field
 */
export interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  notes?: string;
}

/**
 * Core cleaning task interface
 * Represents operational cleaning and maintenance work
 */
export interface CleaningTask {
  id: string;
  property_id: string;
  booking_id?: string; // Optional - links to booking for turnovers
  assigned_cleaner_id?: string;
  
  // Scheduling
  scheduled_start: string; // ISO timestamp
  scheduled_end: string;   // ISO timestamp
  actual_start?: string;   // ISO timestamp (when cleaner started)
  actual_end?: string;     // ISO timestamp (when cleaner finished)
  
  // Task details
  task_type: CleaningTaskType;
  status: CleaningTaskStatus;
  priority: CleaningTaskPriority;
  
  checklist?: ChecklistItem[];
  notes?: string;              // General notes and instructions
  completion_notes?: string;   // Notes added by cleaner upon completion
  photos?: string[];           // Array of photo URLs
  
  // Metadata
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

/**
 * Extended cleaning task with relational data
 * Used for display purposes with joined data
 */
export interface CleaningTaskWithDetails extends CleaningTask {
  property_name?: string;
  property_address?: string;
  cleaner_name?: string;
  booking_guest_name?: string;
  owner_id?: string;
  owner_name?: string;
}

/**
 * Form data for creating/editing cleaning tasks
 * Excludes auto-generated fields
 */
export type CleaningTaskFormData = Omit<CleaningTask, 'id' | 'created_at' | 'updated_at'>;

/**
 * Map type for cleaning task collections
 */
export type CleaningTaskMap = Map<string, CleaningTask>;

/**
 * Type guard for CleaningTask objects
 */
export function isCleaningTask(obj: unknown): obj is CleaningTask {
  if (typeof obj !== 'object' || obj === null) return false;
  const t = obj as Partial<CleaningTask>;
  return (
    typeof t.id === 'string' &&
    typeof t.property_id === 'string' &&
    typeof t.scheduled_start === 'string' &&
    typeof t.scheduled_end === 'string' &&
    typeof t.task_type === 'string' &&
    typeof t.status === 'string'
  );
}

/**
 * Helper function to calculate task duration in minutes
 */
export function getTaskDuration(task: CleaningTask): number {
  const start = task.actual_start || task.scheduled_start;
  const end = task.actual_end || task.scheduled_end;
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / (1000 * 60));
}

/**
 * Helper function to check if task is overdue
 */
export function isTaskOverdue(task: CleaningTask): boolean {
  if (task.status === 'completed' || task.status === 'cancelled') {
    return false;
  }
  return new Date(task.scheduled_end) < new Date();
}

/**
 * Helper function to check if task is urgent (less than 2 hours until scheduled_end)
 */
export function isTaskUrgent(task: CleaningTask): boolean {
  if (task.status === 'completed' || task.status === 'cancelled') {
    return false;
  }
  const hoursUntilEnd = (new Date(task.scheduled_end).getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilEnd < 2;
}
