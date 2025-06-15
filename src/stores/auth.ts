import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types';

/**
 * Auth store for the Property Cleaning Scheduler
 * Manages user authentication state
 */
export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);
  
  // For development, set isAuthenticated to true by default
  const isAuthenticated = computed(() => true);
  
  // Actions
  function login(email: string, _password: string) {
    loading.value = true;
    error.value = null;
    
    // Note: password parameter is intentionally unused in mock implementation
    void _password;
    
    // Simulate login success for now
    setTimeout(() => {
      // Mock successful login
      token.value = 'mock-jwt-token';
      user.value = {
        id: '1',
        email,
        name: 'Demo User',
        role: 'admin',
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'light',
          language: 'en'
        }
      };
      loading.value = false;
    }, 500);
    
    return Promise.resolve(true);
  }
  
  function logout() {
    user.value = null;
    token.value = null;
    
    return Promise.resolve(true);
  }
  
  function register(userData: Partial<User>) {
    loading.value = true;
    error.value = null;
    
    // Simulate registration success
    setTimeout(() => {
      // Mock successful registration
      token.value = 'mock-jwt-token';
      user.value = {
        id: '1',
        email: userData.email || 'demo@example.com',
        name: userData.name || 'Demo User',
        role: userData.role || 'owner',
        settings: {
          notifications: true,
          timezone: 'America/New_York',
          theme: 'light',
          language: 'en'
        }
      };
      loading.value = false;
    }, 500);
    
    return Promise.resolve(true);
  }
  
  function checkAuth() {
    // In a real app, this would validate the token
    return Promise.resolve(isAuthenticated.value);
  }
  
  return {
    // State
    user,
    token,
    loading,
    error,
    isAuthenticated,
    
    // Actions
    login,
    logout,
    register,
    checkAuth
  };
}); 