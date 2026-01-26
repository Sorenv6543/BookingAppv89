/**
 * Cleaning Task Store
 * Manages cleaning and maintenance tasks (Pinia store)
 * 
 * Following industry best practices: cleaning tasks are separate from bookings
 * This store handles operational cleaning work, auto-generated from bookings or manually created
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { CleaningTask, CleaningTaskStatus, CleaningTaskType, CleaningTaskPriority } from '@/types';
import supabase from '@/plugins/supabase';

export const useCleaningTaskStore = defineStore('cleaningTask', () => {
  // State
  const tasks = ref<Map<string, CleaningTask>>(new Map());
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const tasksArray = computed(() => Array.from(tasks.value.values()));
  
  const tasksByStatus = computed(() => (status: CleaningTaskStatus) => {
    return tasksArray.value.filter(task => task.status === status);
  });
  
  const tasksByType = computed(() => (type: CleaningTaskType) => {
    return tasksArray.value.filter(task => task.task_type === type);
  });
  
  const tasksByProperty = computed(() => (propertyId: string) => {
    return tasksArray.value.filter(task => task.property_id === propertyId);
  });
  
  const tasksByCleaner = computed(() => (cleanerId: string) => {
    return tasksArray.value.filter(task => task.assigned_cleaner_id === cleanerId);
  });
  
  const tasksByBooking = computed(() => (bookingId: string) => {
    return tasksArray.value.filter(task => task.booking_id === bookingId);
  });
  
  const upcomingTasks = computed(() => {
    const now = new Date().toISOString();
    return tasksArray.value
      .filter(task => task.scheduled_start > now && task.status === 'scheduled')
      .sort((a, b) => a.scheduled_start.localeCompare(b.scheduled_start));
  });
  
  const overdueTasks = computed(() => {
    const now = new Date().toISOString();
    return tasksArray.value
      .filter(task => 
        task.scheduled_end < now && 
        task.status !== 'completed' && 
        task.status !== 'cancelled'
      )
      .sort((a, b) => a.scheduled_end.localeCompare(b.scheduled_end));
  });
  
  const urgentTasks = computed(() => {
    const twoHoursFromNow = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    return tasksArray.value
      .filter(task => 
        task.scheduled_end < twoHoursFromNow && 
        task.status === 'scheduled'
      )
      .sort((a, b) => a.scheduled_end.localeCompare(b.scheduled_end));
  });
  
  const activeTasks = computed(() => {
    return tasksArray.value.filter(task => task.status === 'in_progress');
  });

  // Actions
  
  /**
   * Fetch all cleaning tasks from Supabase
   * Respects RLS policies (owners see their properties, cleaners see assigned tasks, admins see all)
   */
  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from('cleaning_tasks')
        .select('*')
        .order('scheduled_start', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      tasks.value.clear();
      data?.forEach(task => tasks.value.set(task.id, task));
      
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch cleaning tasks';
      console.error('Error fetching cleaning tasks:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Fetch cleaning tasks for a specific property
   */
  async function fetchTasksByProperty(propertyId: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from('cleaning_tasks')
        .select('*')
        .eq('property_id', propertyId)
        .order('scheduled_start', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      // Update existing tasks or add new ones
      data?.forEach(task => tasks.value.set(task.id, task));
      
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch property cleaning tasks';
      console.error('Error fetching property cleaning tasks:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Fetch cleaning tasks assigned to a specific cleaner
   */
  async function fetchTasksByCleaner(cleanerId: string) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: fetchError } = await supabase
        .from('cleaning_tasks')
        .select('*')
        .eq('assigned_cleaner_id', cleanerId)
        .order('scheduled_start', { ascending: true });
      
      if (fetchError) throw fetchError;
      
      // Update existing tasks or add new ones
      data?.forEach(task => tasks.value.set(task.id, task));
      
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to fetch cleaner tasks';
      console.error('Error fetching cleaner tasks:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Create a new cleaning task
   */
  async function createTask(taskData: Partial<CleaningTask>) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: createError } = await supabase
        .from('cleaning_tasks')
        .insert(taskData)
        .select()
        .single();
      
      if (createError) throw createError;
      if (data) {
        tasks.value.set(data.id, data);
      }
      
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to create cleaning task';
      console.error('Error creating cleaning task:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Update an existing cleaning task
   */
  async function updateTask(taskId: string, updates: Partial<CleaningTask>) {
    loading.value = true;
    error.value = null;
    try {
      const { data, error: updateError } = await supabase
        .from('cleaning_tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();
      
      if (updateError) throw updateError;
      if (data) {
        tasks.value.set(data.id, data);
      }
      
      return data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to update cleaning task';
      console.error('Error updating cleaning task:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Delete a cleaning task
   */
  async function deleteTask(taskId: string) {
    loading.value = true;
    error.value = null;
    try {
      const { error: deleteError } = await supabase
        .from('cleaning_tasks')
        .delete()
        .eq('id', taskId);
      
      if (deleteError) throw deleteError;
      
      tasks.value.delete(taskId);
      
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to delete cleaning task';
      console.error('Error deleting cleaning task:', e);
      throw e;
    } finally {
      loading.value = false;
    }
  }
  
  /**
   * Assign a cleaner to a task
   */
  async function assignCleaner(taskId: string, cleanerId: string) {
    return updateTask(taskId, { assigned_cleaner_id: cleanerId });
  }
  
  /**
   * Update task status
   */
  async function updateStatus(taskId: string, status: CleaningTaskStatus) {
    const updates: Partial<CleaningTask> = { status };
    
    // Set completion timestamp when marking as completed
    if (status === 'completed') {
      updates.completed_at = new Date().toISOString();
      if (!tasks.value.get(taskId)?.actual_end) {
        updates.actual_end = new Date().toISOString();
      }
    }
    
    // Set actual_start when marking as in_progress
    if (status === 'in_progress' && !tasks.value.get(taskId)?.actual_start) {
      updates.actual_start = new Date().toISOString();
    }
    
    return updateTask(taskId, updates);
  }
  
  /**
   * Update task priority
   */
  async function updatePriority(taskId: string, priority: CleaningTaskPriority) {
    return updateTask(taskId, { priority });
  }
  
  /**
   * Clear all tasks from store (useful for logout)
   */
  function clearTasks() {
    tasks.value.clear();
    error.value = null;
  }

  return {
    // State
    tasks,
    tasksArray,
    loading,
    error,
    
    // Computed getters
    tasksByStatus,
    tasksByType,
    tasksByProperty,
    tasksByCleaner,
    tasksByBooking,
    upcomingTasks,
    overdueTasks,
    urgentTasks,
    activeTasks,
    
    // Actions
    fetchTasks,
    fetchTasksByProperty,
    fetchTasksByCleaner,
    createTask,
    updateTask,
    deleteTask,
    assignCleaner,
    updateStatus,
    updatePriority,
    clearTasks
  };
});
