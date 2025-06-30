import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUIStore } from '@/stores/ui';

describe('UI Store', () => {
  beforeEach(() => {
    // Create a fresh pinia instance and set it as active for testing
    setActivePinia(createPinia());
    
    // Mock crypto.randomUUID with a proper mock
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
      },
      writable: true,
      configurable: true
    });
    
    // Mock setTimeout
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should start with default state', () => {
    const store = useUIStore();
    
    // Default sidebars state
    expect(store.sidebars.get('main')).toBe(true);
    expect(store.sidebars.get('filters')).toBe(false);
    expect(store.sidebars.get('details')).toBe(false);
    
    // Default loading state
    expect(store.loading.get('properties')).toBe(false);
    expect(store.loading.get('bookings')).toBe(false);
    expect(store.loading.get('auth')).toBe(false);
    expect(store.loading.get('calendar')).toBe(false);
    
    // Default filter state
    expect(store.filterState.bookingType).toBe('all');
    expect(store.filterState.status).toBe('all');
    expect(store.filterState.dateRange).toBeUndefined();
    expect(store.filterState.propertyId).toBeUndefined();
    expect(store.filterState.searchTerm).toBeUndefined();
    
    // Default calendar view
    expect(store.currentCalendarView).toBe('timeGridWeek');
    
    // Empty notifications
    expect(store.notifications).toEqual([]);
    
    // No error
    expect(store.error).toBeNull();
  });

  it('should manage modal states', () => {
    const store = useUIStore();
    
    // Initially no modals
    expect(store.isModalOpen('eventModal')).toBe(false);
    
    // Open modal
    store.openModal('eventModal', 'create', { id: '123' });
    expect(store.isModalOpen('eventModal')).toBe(true);
    
    // Get modal state
    const modalState = store.getModalState('eventModal');
    expect(modalState?.open).toBe(true);
    expect(modalState?.mode).toBe('create');
    expect(modalState?.data).toEqual({ id: '123' });
    
    // Close modal
    store.closeModal('eventModal');
    expect(store.isModalOpen('eventModal')).toBe(false);
    
    // Open multiple modals and close all
    store.openModal('eventModal', 'edit');
    store.openModal('propertyModal', 'view');
    expect(store.isModalOpen('eventModal')).toBe(true);
    expect(store.isModalOpen('propertyModal')).toBe(true);
    
    store.closeAllModals();
    expect(store.isModalOpen('eventModal')).toBe(false);
    expect(store.isModalOpen('propertyModal')).toBe(false);
  });
  
  it('should manage sidebar states', () => {
    const store = useUIStore();
    
    // Initial states
    expect(store.isSidebarOpen('main')).toBe(true);
    expect(store.isSidebarOpen('filters')).toBe(false);
    
    // Toggle sidebar
    store.toggleSidebar('main');
    expect(store.isSidebarOpen('main')).toBe(false);
    
    store.toggleSidebar('filters');
    expect(store.isSidebarOpen('filters')).toBe(true);
    
    // Set specific state
    store.setSidebarState('main', true);
    expect(store.isSidebarOpen('main')).toBe(true);
  });
  
  it('should manage loading states', () => {
    const store = useUIStore();
    
    // Initial states
    expect(store.isLoading('properties')).toBe(false);
    expect(store.anyLoading).toBe(false);
    
    // Set loading state
    store.setLoading('properties', true);
    expect(store.isLoading('properties')).toBe(true);
    expect(store.anyLoading).toBe(true);
    
    // Multiple loading states
    store.setLoading('bookings', true);
    expect(store.anyLoading).toBe(true);
    
    // Reset all loading states
    store.setLoading('properties', false);
    store.setLoading('bookings', false);
    expect(store.anyLoading).toBe(false);
  });
  
  it('should manage notifications', () => {
    const store = useUIStore();
    
    // Add notification
    const notificationId = store.addNotification('success', 'Test', 'Test message', false);
    expect(store.notifications.length).toBe(1);
    expect(store.notifications[0].id).toBe(notificationId);
    expect(store.notifications[0].type).toBe('success');
    expect(store.notifications[0].title).toBe('Test');
    expect(store.notifications[0].message).toBe('Test message');
    expect(store.notifications[0].autoClose).toBe(false);
    
    // Remove notification
    store.removeNotification(notificationId);
    expect(store.notifications.length).toBe(0);
    
    // Add multiple notifications
    store.addNotification('info', 'Info', 'Info message');
    store.addNotification('warning', 'Warning', 'Warning message');
    store.addNotification('error', 'Error', 'Error message');
    expect(store.notifications.length).toBe(3);
    
    // Clear all notifications
    store.clearNotifications();
    expect(store.notifications.length).toBe(0);
  });
  
  it('should auto-remove notifications with autoClose', () => {
    const store = useUIStore();
    
    // Add auto-close notification
    store.addNotification('success', 'Auto', 'Auto close', true);
    expect(store.notifications.length).toBe(1);
    
    // Advance timers to trigger auto-close
    vi.advanceTimersByTime(5000);
    expect(store.notifications.length).toBe(0);
  });
  
  it('should handle errors with notifications', () => {
    const store = useUIStore();
    
    // Set error
    store.setError('Test error');
    expect(store.error).toBe('Test error');
    expect(store.notifications.length).toBe(1);
    expect(store.notifications[0].type).toBe('error');
    expect(store.notifications[0].message).toBe('Test error');
    
    // Clear error
    store.setError(null);
    expect(store.error).toBeNull();
  });
  
  it('should manage filter state', () => {
    const store = useUIStore();
    
    // Initial filter state
    expect(store.filterState.bookingType).toBe('all');
    
    // Update filter
    store.updateFilter({
      bookingType: 'standard',
      propertyId: 'prop1'
    });
    
    expect(store.filterState.bookingType).toBe('standard');
    expect(store.filterState.propertyId).toBe('prop1');
    expect(store.filterState.status).toBe('all');
    
    // Update only part of the filter
    store.updateFilter({
      status: 'pending'
    });
    
    expect(store.filterState.bookingType).toBe('standard');
    expect(store.filterState.propertyId).toBe('prop1');
    expect(store.filterState.status).toBe('pending');
    
    // Reset filters
    store.resetFilters();
    expect(store.filterState.bookingType).toBe('all');
    expect(store.filterState.propertyId).toBeUndefined();
    expect(store.filterState.status).toBe('all');
  });
  
  it('should manage calendar view', () => {
    const store = useUIStore();
    
    // Default view
    expect(store.currentCalendarView).toBe('timeGridWeek');
    
    // Change view
    store.setCalendarView('dayGridMonth');
    expect(store.currentCalendarView).toBe('dayGridMonth');
  });
  
  it('should limit active notifications to 5', () => {
    const store = useUIStore();
    
    // Add more than 5 notifications
    for (let i = 0; i < 10; i++) {
      store.addNotification('info', `Title ${i}`, `Message ${i}`);
    }
    
    expect(store.notifications.length).toBe(10);
    expect(store.activeNotifications.length).toBe(5);
    expect(store.activeNotifications[0].message).toBe('Message 9');
    expect(store.activeNotifications[4].message).toBe('Message 5');
  });
}); 