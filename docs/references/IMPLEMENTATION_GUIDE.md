# Implementation Guide & Technical Specifications

## Overview

This guide provides comprehensive implementation instructions for the Property Cleaning Scheduler system architecture, covering authentication consolidation, component interfaces, database design, and performance optimization patterns.

## 1. Authentication System Implementation

### Phase 1: Consolidate Authentication Architecture

#### Step 1: Simplify Authentication Store
```typescript
// src/stores/auth.ts - Simplified unified implementation
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, UserRole } from '@/types'
import { useSupabaseAuth } from '@/composables/supabase/useSupabaseAuth'

export const useAuthStore = defineStore('auth', () => {
  // Single source of truth: delegate to composable in production
  const supabaseAuth = import.meta.env.MODE !== 'test' 
    ? useSupabaseAuth() 
    : null

  // Fallback state for testing (simplified)
  const fallbackUser = ref<User | null>(null)
  const fallbackSession = ref<any>(null) 
  const fallbackLoading = ref(false)
  const fallbackError = ref<string | null>(null)

  // Unified reactive state (single source)
  const session = computed(() => supabaseAuth?.session.value ?? fallbackSession.value)
  const user = computed(() => supabaseAuth?.user.value ?? fallbackUser.value)
  const loading = computed(() => supabaseAuth?.loading.value ?? fallbackLoading.value)
  const error = computed(() => supabaseAuth?.error.value ?? fallbackError.value)
  const initializing = computed(() => supabaseAuth?.initializing.value ?? false)
  
  // Computed role-based properties
  const isAuthenticated = computed(() => !!session.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isOwner = computed(() => user.value?.role === 'owner')
  const isCleaner = computed(() => user.value?.role === 'cleaner')

  // Unified methods (delegate to composable or fallback)
  const login = async (email: string, password: string): Promise<boolean> => {
    if (supabaseAuth) {
      return await supabaseAuth.signIn(email, password)
    }
    // Test mode fallback
    fallbackUser.value = { id: '1', email, name: 'Test User', role: 'owner' } as User
    fallbackSession.value = { user: { id: '1' } }
    return true
  }

  const logout = async (): Promise<boolean> => {
    if (supabaseAuth) {
      return await supabaseAuth.signOut()
    }
    // Test mode fallback
    fallbackUser.value = null
    fallbackSession.value = null
    return true
  }

  const register = async (
    email: string, 
    password: string, 
    userData: { name: string; role?: UserRole; company_name?: string }
  ): Promise<boolean> => {
    if (supabaseAuth) {
      return await supabaseAuth.signUp(email, password, userData)
    }
    // Test mode fallback
    fallbackUser.value = { 
      id: '1', 
      email, 
      name: userData.name, 
      role: userData.role || 'owner' 
    } as User
    return true
  }

  const checkAuth = async (): Promise<void> => {
    if (supabaseAuth) {
      await supabaseAuth.checkAuth()
    }
  }

  // Test utilities (only available in test mode)
  const testUtils = import.meta.env.MODE === 'test' ? {
    setTestUser: (testUser: User) => { fallbackUser.value = testUser },
    setTestSession: (testSession: any) => { fallbackSession.value = testSession },
    setTestLoading: (loading: boolean) => { fallbackLoading.value = loading },
    setTestError: (error: string | null) => { fallbackError.value = error }
  } : {}

  return {
    // State
    session,
    user,
    loading, 
    error,
    initializing,
    isAuthenticated,
    isAdmin,
    isOwner,
    isCleaner,
    
    // Actions
    login,
    logout,
    register,
    checkAuth,
    
    // Test utilities
    ...testUtils
  }
})
```

#### Step 2: Enhanced Supabase Composable
```typescript
// src/composables/supabase/useSupabaseAuth.ts - Enhanced with better error handling
import { ref, computed, onUnmounted } from 'vue'
import { supabase } from '@/plugins/supabase'
import type { Session } from '@supabase/supabase-js'
import type { User, UserRole } from '@/types'

export function useSupabaseAuth() {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initializing = ref(true)

  const isAuthenticated = computed(() => !!session.value && !!user.value)
  const currentUserId = computed(() => session.value?.user?.id || null)

  // Enhanced initialization with timeout protection
  let authSubscription: { unsubscribe?: () => void } | null = null
  let initTimeout: ReturnType<typeof setTimeout>

  const initializeAuth = async () => {
    try {
      // Set timeout for initialization (2 seconds max)
      initTimeout = setTimeout(() => {
        if (initializing.value) {
          console.warn('Auth initialization timeout - completing anyway')
          initializing.value = false
        }
      }, 2000)

      // Get current session immediately
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession) {
        session.value = currentSession
        await loadUserProfile(currentSession.user.id)
      }
      
      // Set up auth state listener
      authSubscription = supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('Auth state change:', event)
        
        try {
          if (event === 'SIGNED_IN' && newSession) {
            session.value = newSession
            await loadUserProfile(newSession.user.id) 
          } else if (event === 'SIGNED_OUT') {
            user.value = null
            session.value = null
            error.value = null
          }
        } catch (err) {
          console.error('Auth state change error:', err)
          error.value = err instanceof Error ? err.message : 'Authentication error'
        }
      })
      
    } catch (err) {
      console.error('Auth initialization error:', err)
      error.value = err instanceof Error ? err.message : 'Failed to initialize authentication'
    } finally {
      initializing.value = false
      clearTimeout(initTimeout)
    }
  }

  const loadUserProfile = async (userId: string): Promise<void> => {
    try {
      const { data, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        // Profile not found - create from session metadata
        console.log('Creating fallback profile from session data')
        user.value = createFallbackProfile(userId)
        return
      }

      if (data) {
        user.value = {
          id: data.id,
          email: session.value?.user?.email || data.email || '',
          name: data.name,
          role: data.role as UserRole,
          company_name: data.company_name,
          notifications_enabled: data.notifications_enabled ?? true,
          timezone: data.timezone || 'America/New_York',
          theme: data.theme || 'light',
          language: data.language || 'en',
          created_at: data.created_at,
          updated_at: data.updated_at
        }
      }
    } catch (err) {
      console.error('Profile loading error:', err)
      // Create fallback profile on error
      user.value = createFallbackProfile(userId)
    }
  }

  const createFallbackProfile = (userId: string): User => {
    return {
      id: userId,
      email: session.value?.user?.email || '',
      name: session.value?.user?.user_metadata?.name || 
            session.value?.user?.email?.split('@')[0] || 'User',
      role: (session.value?.user?.user_metadata?.role as UserRole) || 'owner',
      company_name: session.value?.user?.user_metadata?.company_name || '',
      notifications_enabled: true,
      timezone: 'America/New_York',
      theme: 'light',
      language: 'en',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }

  // Enhanced authentication methods with better error handling
  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError
      
      return !!data.user && !!data.session
    } catch (err) {
      console.error('Sign in error:', err)
      error.value = err instanceof Error ? err.message : 'Sign in failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const signUp = async (
    email: string,
    password: string,
    userData: { name: string; role?: UserRole; company_name?: string }
  ): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            role: userData.role || 'owner',
            company_name: userData.company_name
          }
        }
      })

      if (signUpError) throw signUpError
      
      return !!data.user
    } catch (err) {
      console.error('Sign up error:', err)
      error.value = err instanceof Error ? err.message : 'Sign up failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const signOut = async (): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      return true
    } catch (err) {
      console.error('Sign out error:', err)
      error.value = err instanceof Error ? err.message : 'Sign out failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    try {
      if (!currentUserId.value) {
        throw new Error('No authenticated user')
      }

      loading.value = true
      error.value = null

      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUserId.value)

      if (updateError) throw updateError

      // Reload user profile
      await loadUserProfile(currentUserId.value)
      return true
    } catch (err) {
      console.error('Update profile error:', err)
      error.value = err instanceof Error ? err.message : 'Profile update failed'
      return false
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async (): Promise<void> => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (currentSession && currentSession !== session.value) {
        session.value = currentSession
        if (!user.value) {
          await loadUserProfile(currentSession.user.id)
        }
      } else if (!currentSession) {
        user.value = null
        session.value = null
      }
    } catch (err) {
      console.error('Auth check error:', err)
      error.value = err instanceof Error ? err.message : 'Auth check failed'
    }
  }

  // Cleanup on unmount
  onUnmounted(() => {
    if (authSubscription?.unsubscribe) {
      authSubscription.unsubscribe()
    }
    if (initTimeout) {
      clearTimeout(initTimeout)
    }
  })

  // Initialize immediately
  initializeAuth()

  return {
    // State
    user,
    session,
    loading,
    error,
    initializing,
    
    // Computed
    isAuthenticated,
    currentUserId,
    
    // Methods
    signIn,
    signUp,
    signOut,
    updateProfile,
    checkAuth,
    loadUserProfile
  }
}
```

#### Step 3: Route Protection Enhancement
```typescript
// src/router/guards.ts - Enhanced with consolidated auth
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export async function requireAuth(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const authStore = useAuthStore()
  
  // Wait for auth initialization with timeout
  const maxWaitTime = 3000 // 3 seconds max
  const startTime = Date.now()
  
  while (authStore.initializing && (Date.now() - startTime) < maxWaitTime) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  if (!authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  next()
}

export function requireRole(allowedRoles: UserRole[]) {
  return async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()
    
    // First check authentication
    await requireAuth(to, from, (nextRoute) => {
      if (typeof nextRoute === 'string' || (nextRoute && 'name' in nextRoute)) {
        next(nextRoute)
        return
      }
      
      // Check role authorization
      if (!authStore.user?.role || !allowedRoles.includes(authStore.user.role)) {
        next({ name: 'unauthorized' })
        return
      }
      
      next()
    })
  }
}

// Usage in router
const router = createRouter({
  routes: [
    {
      path: '/admin',
      component: AdminLayout,
      beforeEnter: requireRole(['admin']),
      children: [
        { path: 'users', component: AdminUsers },
        { path: 'reports', component: AdminReports }
      ]
    },
    {
      path: '/owner',
      component: OwnerLayout,
      beforeEnter: requireRole(['owner']),
      children: [
        { path: 'properties', component: OwnerProperties },
        { path: 'bookings', component: OwnerBookings }
      ]
    }
  ]
})
```

## 2. Component Implementation Guide

### Smart Component Implementation Pattern
```typescript
// src/components/smart/admin/AdminUsers.vue - Example implementation
<template>
  <div class="admin-users">
    <AdminUsersHeader 
      :loading="loading"
      :user-count="users.length"
      @create-user="handleCreateUser"
      @refresh="handleRefresh"
    />
    
    <AdminUsersTable
      :users="filteredUsers"
      :loading="loading"
      :selected-users="selectedUsers"
      @user-action="handleUserAction"
      @selection-change="handleSelectionChange"
    />
    
    <AdminUsersPagination
      :total="totalUsers"
      :per-page="perPage"
      :current-page="currentPage"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { User, UserRole } from '@/types'
import { useAuthStore } from '@/stores/auth'
import { useDataLayer } from '@/composables/shared/useDataLayer'
import { usePerformanceMonitor } from '@/composables/shared/usePerformanceMonitor'

// Component interface implementation
interface Props {
  userRole?: UserRole
  permissions?: RolePermissions
  config?: ComponentConfig
  enablePerformanceMonitoring?: boolean
}

interface Emits {
  (e: 'loading', state: boolean): void
  (e: 'error', error: Error | string | null): void
  (e: 'action', action: ComponentAction): void
  (e: 'performance-metric', metric: PerformanceMetric): void
}

const props = withDefaults(defineProps<Props>(), {
  enablePerformanceMonitoring: true,
  config: () => ({
    showHeader: true,
    allowEdit: true,
    enableRealtime: true,
    performanceProfile: 'standard'
  })
})

const emit = defineEmits<Emits>()

// Performance monitoring integration
const performance = usePerformanceMonitor()
const { trackSubscription } = performance.measureComponentPerformance('AdminUsers')

// Authentication and permissions
const authStore = trackSubscription(useAuthStore())
const userPermissions = computed(() => ({
  canManageUsers: authStore.isAdmin,
  canViewReports: authStore.isAdmin,
  canModifySystem: authStore.user?.access_level === 'full'
}))

// Data layer integration
const dataLayer = trackSubscription(useDataLayer<User>('user_profiles'))
const users = ref<User[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedUsers = ref<string[]>([])

// Pagination state
const currentPage = ref(1)
const perPage = ref(25)
const totalUsers = ref(0)

// Computed properties with caching
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // Apply role-based filtering
    if (props.userRole && user.role !== props.userRole) return false
    return true
  })
})

// Event handlers
const handleCreateUser = async (userData: Partial<User>) => {
  try {
    loading.value = true
    emit('loading', true)
    
    const newUser = await dataLayer.createRecord(userData)
    if (newUser) {
      users.value.push(newUser)
      emit('action', { type: 'user_created', payload: newUser })
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to create user'
    error.value = errorMsg
    emit('error', errorMsg)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const handleUserAction = async (action: UserManagementAction) => {
  try {
    switch (action.type) {
      case 'update_role':
        await updateUserRole(action.userId, action.newRole)
        break
      case 'delete_user':
        await deleteUser(action.userId)
        break
      case 'toggle_status':
        await toggleUserStatus(action.userId)
        break
    }
    
    emit('action', action)
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Action failed'
    error.value = errorMsg
    emit('error', errorMsg)
  }
}

const handleRefresh = async () => {
  await loadUsers()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadUsers()
}

const handleSelectionChange = (selection: string[]) => {
  selectedUsers.value = selection
}

// Data operations
const loadUsers = async () => {
  try {
    loading.value = true
    emit('loading', true)
    
    const filters = {
      limit: perPage.value,
      offset: (currentPage.value - 1) * perPage.value,
      sortBy: 'created_at',
      sortOrder: 'desc' as const
    }
    
    const result = await dataLayer.fetchData(filters)
    users.value = result
    
    // Update total count (would need separate query in real implementation)
    totalUsers.value = result.length
    
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to load users'
    error.value = errorMsg
    emit('error', errorMsg)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const updateUserRole = async (userId: string, newRole: UserRole) => {
  const updatedUser = await dataLayer.updateRecord(userId, { role: newRole })
  if (updatedUser) {
    const index = users.value.findIndex(u => u.id === userId)
    if (index >= 0) {
      users.value[index] = updatedUser
    }
  }
}

const deleteUser = async (userId: string) => {
  await dataLayer.deleteRecord(userId)
  users.value = users.value.filter(u => u.id !== userId)
}

const toggleUserStatus = async (userId: string) => {
  const user = users.value.find(u => u.id === userId)
  if (user) {
    const updatedUser = await dataLayer.updateRecord(userId, { 
      active: !user.active 
    })
    if (updatedUser) {
      const index = users.value.findIndex(u => u.id === userId)
      if (index >= 0) {
        users.value[index] = updatedUser
      }
    }
  }
}

// Lifecycle
onMounted(() => {
  loadUsers()
})

// Performance monitoring
if (props.enablePerformanceMonitoring) {
  watch(users, (newUsers) => {
    emit('performance-metric', {
      name: 'users_loaded',
      value: newUsers.length,
      timestamp: Date.now(),
      component: 'AdminUsers'
    })
  })
}

// Types for this component
interface UserManagementAction {
  type: 'update_role' | 'delete_user' | 'toggle_status'
  userId: string
  newRole?: UserRole
  payload?: any
}

interface ComponentConfig {
  showHeader?: boolean
  allowEdit?: boolean
  enableRealtime?: boolean
  performanceProfile?: 'high' | 'standard' | 'minimal'
}

interface ComponentAction {
  type: string
  payload?: any
  target?: string
  metadata?: Record<string, any>
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
  component: string
}

interface RolePermissions {
  canManageUsers?: boolean
  canViewReports?: boolean 
  canModifySystem?: boolean
}
</script>
```

### UI Component Implementation Pattern
```typescript
// src/components/ui/forms/FormInput.vue - Example UI component
<template>
  <div 
    class="form-input"
    :class="inputClasses"
  >
    <label 
      v-if="label"
      :for="inputId"
      class="form-input__label"
    >
      {{ label }}
      <span v-if="required" class="form-input__required">*</span>
    </label>
    
    <div class="form-input__wrapper">
      <input
        :id="inputId"
        ref="inputRef"
        :type="inputType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-label="ariaLabel || label"
        :aria-describedby="ariaDescribedBy"
        :tabindex="tabIndex"
        :maxlength="maxLength"
        class="form-input__field"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />
      
      <button
        v-if="clearable && modelValue"
        type="button"
        class="form-input__clear"
        @click="handleClear"
        :aria-label="clearButtonLabel"
      >
        <Icon name="x" />
      </button>
      
      <button
        v-if="type === 'password' && showPassword !== undefined"
        type="button"
        class="form-input__toggle-password"
        @click="togglePasswordVisibility"
        :aria-label="passwordToggleLabel"
      >
        <Icon :name="showPassword ? 'eye-off' : 'eye'" />
      </button>
    </div>
    
    <div
      v-if="errorMessage || helpText"
      class="form-input__help"
      :class="{ 'form-input__help--error': !!errorMessage }"
    >
      {{ errorMessage || helpText }}
    </div>
    
    <div
      v-if="counter && maxLength"
      class="form-input__counter"
    >
      {{ characterCount }} / {{ maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, useAttrs, useSlots } from 'vue'
import Icon from '@/components/ui/Icon.vue'

// Implement UIComponentProps interface
interface Props {
  // Input-specific props
  modelValue?: string | number
  type?: InputType
  label?: string
  placeholder?: string
  required?: boolean
  readonly?: boolean
  helpText?: string
  
  // Validation
  rules?: ValidationRule[]
  errorMessage?: string
  valid?: boolean
  
  // Input formatting and behavior
  mask?: string
  format?: InputFormat
  clearable?: boolean
  showPassword?: boolean
  counter?: boolean
  maxLength?: number
  
  // UI component standard props
  variant?: UIVariant
  size?: ComponentSize
  disabled?: boolean
  loading?: boolean
  
  // Accessibility
  ariaLabel?: string
  ariaDescribedBy?: string
  tabIndex?: number
  
  // Layout
  fullWidth?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'focus', event: FocusEvent): void
  (e: 'blur', event: FocusEvent): void
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'clear'): void
  (e: 'validate', valid: boolean, message?: string): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  required: false,
  readonly: false,
  clearable: false,
  counter: false,
  fullWidth: false
})

const emit = defineEmits<Emits>()
const attrs = useAttrs()
const slots = useSlots()

// Component state
const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const isPasswordVisible = ref(false)

// Computed properties
const inputId = computed(() => 
  attrs.id as string || `input-${Math.random().toString(36).substr(2, 9)}`
)

const inputType = computed(() => {
  if (props.type === 'password') {
    return isPasswordVisible.value ? 'text' : 'password'
  }
  return props.type
})

const characterCount = computed(() => {
  return String(props.modelValue || '').length
})

const inputClasses = computed(() => ({
  [`form-input--${props.variant}`]: props.variant,
  [`form-input--${props.size}`]: props.size,
  'form-input--disabled': props.disabled,
  'form-input--loading': props.loading,
  'form-input--focused': isFocused.value,
  'form-input--error': !!props.errorMessage,
  'form-input--full-width': props.fullWidth,
  'form-input--readonly': props.readonly
}))

const clearButtonLabel = computed(() => `Clear ${props.label || 'input'}`)

const passwordToggleLabel = computed(() => 
  isPasswordVisible.value ? 'Hide password' : 'Show password'
)

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  let value: string | number = target.value
  
  // Apply formatting if specified
  if (props.format) {
    value = applyFormat(value, props.format)
  }
  
  // Apply mask if specified
  if (props.mask) {
    value = applyMask(value, props.mask)
  }
  
  emit('update:modelValue', value)
  
  // Validate if rules provided
  if (props.rules) {
    validateInput(value)
  }
}

const handleFocus = (event: FocusEvent) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
  
  // Final validation on blur
  if (props.rules) {
    validateInput(props.modelValue)
  }
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

const handleClear = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value
}

// Validation logic
const validateInput = (value: string | number | undefined) => {
  if (!props.rules) return
  
  const stringValue = String(value || '')
  
  for (const rule of props.rules) {
    const result = rule.test(stringValue)
    if (result !== true) {
      const message = typeof result === 'string' ? result : rule.message || 'Validation failed'
      emit('validate', false, message)
      return
    }
  }
  
  emit('validate', true)
}

// Formatting utilities
const applyFormat = (value: string, format: InputFormat): string => {
  switch (format) {
    case 'currency':
      return formatCurrency(value)
    case 'percentage':
      return formatPercentage(value)
    case 'date':
      return formatDate(value)
    default:
      return value
  }
}

const applyMask = (value: string, mask: string): string => {
  // Simple mask implementation
  // For production, use a proper masking library
  return value
}

const formatCurrency = (value: string): string => {
  const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''))
  if (isNaN(numValue)) return value
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(numValue)
}

const formatPercentage = (value: string): string => {
  const numValue = parseFloat(value.replace(/[^0-9.-]/g, ''))
  if (isNaN(numValue)) return value
  return `${numValue}%`
}

const formatDate = (value: string): string => {
  // Basic date formatting - use a proper date library in production
  return value
}

// Public methods (expose via defineExpose if needed)
const focus = () => {
  inputRef.value?.focus()
}

const blur = () => {
  inputRef.value?.blur()
}

const select = () => {
  inputRef.value?.select()
}

defineExpose({
  focus,
  blur,
  select,
  inputRef
})

// Types
type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
type InputFormat = 'currency' | 'percentage' | 'date' | 'time' | 'datetime'
type UIVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ValidationRule {
  test: (value: string) => boolean | string
  message?: string
}
</script>

<style scoped>
.form-input {
  @apply w-full;
}

.form-input--full-width {
  @apply w-full;
}

.form-input__label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-input__required {
  @apply text-red-500 ml-1;
}

.form-input__wrapper {
  @apply relative;
}

.form-input__field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm
         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
         disabled:bg-gray-100 disabled:cursor-not-allowed
         transition-colors duration-200;
}

/* Size variants */
.form-input--xs .form-input__field {
  @apply px-2 py-1 text-xs;
}

.form-input--sm .form-input__field {
  @apply px-2.5 py-1.5 text-sm;
}

.form-input--lg .form-input__field {
  @apply px-4 py-3 text-lg;
}

.form-input--xl .form-input__field {
  @apply px-5 py-4 text-xl;
}

/* Variant styles */
.form-input--error .form-input__field {
  @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

.form-input--success .form-input__field {
  @apply border-green-500 focus:ring-green-500 focus:border-green-500;
}

/* Action buttons */
.form-input__clear,
.form-input__toggle-password {
  @apply absolute right-2 top-1/2 transform -translate-y-1/2
         text-gray-400 hover:text-gray-600 p-1;
}

.form-input__toggle-password {
  @apply right-8;
}

/* Help text and counter */
.form-input__help {
  @apply mt-1 text-sm text-gray-600;
}

.form-input__help--error {
  @apply text-red-600;
}

.form-input__counter {
  @apply mt-1 text-xs text-gray-500 text-right;
}
</style>
```

## 3. Database Implementation Guide

### Migration Script Implementation
```sql
-- migrations/001_create_user_system.sql
-- Create user management system with RLS

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'cleaner');
CREATE TYPE theme_type AS ENUM ('light', 'dark', 'system');
CREATE TYPE access_level AS ENUM ('full', 'limited', 'read_only');

-- Create user_profiles table
CREATE TABLE user_profiles (
  -- Core identity
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'owner',
  
  -- Contact information
  company_name TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  
  -- User preferences (flattened for performance)
  notifications_enabled BOOLEAN DEFAULT TRUE,
  timezone TEXT DEFAULT 'America/New_York',
  theme theme_type DEFAULT 'light',
  language TEXT DEFAULT 'en',
  
  -- Role-specific fields
  access_level access_level, -- Admin only
  skills TEXT[], -- Cleaner only
  max_daily_bookings INTEGER, -- Cleaner only
  location_lat DECIMAL(10,8), -- Cleaner only
  location_lng DECIMAL(11,8), -- Cleaner only
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sign_in_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_role_fields CHECK (
    (role = 'admin' AND access_level IS NOT NULL) OR
    (role = 'cleaner' AND skills IS NOT NULL AND max_daily_bookings IS NOT NULL) OR
    (role = 'owner')
  )
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_active ON user_profiles(last_sign_in_at) 
  WHERE last_sign_in_at > NOW() - INTERVAL '30 days';

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = OLD.role);

CREATE POLICY "Admins can manage all profiles" ON user_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    email,
    name,
    role,
    company_name
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'owner'::user_role),
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Data Layer Composable Implementation
```typescript
// src/composables/shared/useDataLayer.ts - Complete implementation
import { ref, computed } from 'vue'
import { supabase } from '@/plugins/supabase'
import { useAuthStore } from '@/stores/auth'
import { useCache } from '@/composables/shared/useCache'
import { usePerformanceMonitor } from '@/composables/shared/usePerformanceMonitor'
import type { User, UserRole } from '@/types'

export function useDataLayer<T extends BaseEntity>(
  entityType: EntityType,
  options: DataLayerOptions = {}
) {
  const { user, isAuthenticated } = useAuthStore()
  const cache = useCache()
  const performance = usePerformanceMonitor()
  
  const data = ref<T[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // Role-based query building
  const buildRoleBasedQuery = (baseQuery: any) => {
    if (!user.value) return baseQuery.limit(0)
    
    switch (user.value.role) {
      case 'owner':
        return baseQuery
          .eq('owner_id', user.value.id)
          .eq('active', true)
          .order('created_at', { ascending: false })
          
      case 'cleaner':
        if (entityType === 'bookings') {
          return baseQuery
            .eq('assigned_cleaner_id', user.value.id)
            .in('status', ['scheduled', 'in_progress', 'pending'])
            .order('cleaning_start_time', { ascending: true })
        }
        break
        
      case 'admin':
        return baseQuery.order('updated_at', { ascending: false })
    }
    
    return baseQuery.limit(0)
  }
  
  // Fetch data with caching and performance tracking
  const fetchData = async (filters: DataFilters = {}): Promise<T[]> => {
    if (!isAuthenticated.value) {
      throw new Error('Authentication required')
    }
    
    return performance.measureRolePerformance(
      user.value!.role,
      `fetch_${entityType}`,
      async () => {
        try {
          loading.value = true
          error.value = null
          
          // Generate cache key
          const cacheKey = generateCacheKey(
            entityType,
            user.value!.id,
            user.value!.role,
            filters
          )
          
          // Check cache
          if (!options.skipCache) {
            const cached = cache.get<T[]>(cacheKey)
            if (cached) {
              performance.trackCachePerformance('data_fetch', true)
              data.value = cached
              return cached
            }
          }
          
          // Build query
          let query = buildRoleBasedQuery(
            supabase.from(entityType).select('*')
          )
          
          // Apply filters
          query = applyFilters(query, filters)
          
          // Execute query
          const { data: result, error: queryError } = await query
          
          if (queryError) {
            throw new Error(`Query failed: ${queryError.message}`)
          }
          
          const finalResult = result || []
          
          // Cache results
          const cacheTimeout = getCacheTimeout(entityType, user.value!.role)
          cache.set(cacheKey, finalResult, cacheTimeout)
          performance.trackCachePerformance('data_fetch', false)
          
          data.value = finalResult
          return finalResult
          
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data'
          error.value = errorMessage
          console.error(`Error fetching ${entityType}:`, err)
          throw new Error(errorMessage)
        } finally {
          loading.value = false
        }
      }
    )
  }
  
  // Create record with validation
  const createRecord = async (recordData: Partial<T>): Promise<T | null> => {
    if (!canCreateRecord(user.value?.role, entityType)) {
      throw new Error(`Insufficient permissions to create ${entityType}`)
    }
    
    try {
      loading.value = true
      error.value = null
      
      const dataToInsert = {
        ...recordData,
        ...(user.value?.role === 'owner' && { owner_id: user.value.id }),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      const { data: result, error: insertError } = await supabase
        .from(entityType)
        .insert(dataToInsert)
        .select()
        .single()
      
      if (insertError) {
        throw new Error(`Create failed: ${insertError.message}`)
      }
      
      // Update local state
      if (result) {
        data.value.push(result)
        await invalidateCache(entityType, user.value!.id, user.value!.role)
      }
      
      return result
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create record'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }
  
  // Update record with ownership validation
  const updateRecord = async (id: string, updates: Partial<T>): Promise<T | null> => {
    try {
      loading.value = true
      error.value = null
      
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }
      
      let query = supabase
        .from(entityType)
        .update(updateData)
        .eq('id', id)
        .select()
        .single()
      
      // Apply role-based restrictions
      query = buildRoleBasedQuery(query)
      
      const { data: result, error: updateError } = await query
      
      if (updateError) {
        throw new Error(`Update failed: ${updateError.message}`)
      }
      
      // Update local state
      if (result) {
        const index = data.value.findIndex(item => item.id === id)
        if (index >= 0) {
          data.value[index] = result
        }
        await invalidateCache(entityType, user.value!.id, user.value!.role)
      }
      
      return result
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update record'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }
  
  // Delete record with ownership validation
  const deleteRecord = async (id: string): Promise<boolean> => {
    try {
      loading.value = true
      error.value = null
      
      let query = supabase
        .from(entityType)
        .delete()
        .eq('id', id)
      
      // Apply role-based restrictions
      query = buildRoleBasedQuery(query)
      
      const { error: deleteError } = await query
      
      if (deleteError) {
        throw new Error(`Delete failed: ${deleteError.message}`)
      }
      
      // Update local state
      data.value = data.value.filter(item => item.id !== id)
      await invalidateCache(entityType, user.value!.id, user.value!.role)
      
      return true
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete record'
      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }
  
  // Helper functions
  const applyFilters = (query: any, filters: DataFilters) => {
    if (filters.dateRange) {
      query = query
        .gte('created_at', filters.dateRange.start)
        .lte('created_at', filters.dateRange.end)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    if (filters.search) {
      query = query.textSearch('search_vector', filters.search)
    }
    
    if (filters.sortBy) {
      query = query.order(filters.sortBy, { 
        ascending: filters.sortOrder === 'asc' 
      })
    }
    
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }
    
    return query
  }
  
  const generateCacheKey = (
    entity: string,
    userId: string,
    role: UserRole,
    filters: DataFilters
  ): string => {
    const filterHash = btoa(JSON.stringify(filters)).substring(0, 8)
    return `${entity}_${role}_${userId}_${filterHash}`
  }
  
  const getCacheTimeout = (entity: string, role: UserRole): number => {
    // Different cache timeouts based on role and entity type
    const baseTimeout = {
      owner: 300000,    // 5 minutes
      admin: 180000,    // 3 minutes  
      cleaner: 600000   // 10 minutes
    }
    
    return baseTimeout[role] || 300000
  }
  
  const invalidateCache = async (entity: string, userId: string, role: UserRole) => {
    const pattern = `${entity}_${role}_${userId}_`
    cache.invalidatePattern(pattern)
  }
  
  const canCreateRecord = (role: UserRole | undefined, entity: string): boolean => {
    if (!role) return false
    
    const permissions = {
      admin: ['user_profiles', 'properties', 'bookings'],
      owner: ['properties', 'bookings'],
      cleaner: []
    }
    
    return permissions[role]?.includes(entity) || false
  }
  
  return {
    // State
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    
    // Actions
    fetchData,
    createRecord,
    updateRecord,
    deleteRecord,
    
    // Utilities
    refresh: () => fetchData(),
    clearError: () => { error.value = null }
  }
}

// Types
interface DataLayerOptions {
  skipCache?: boolean
  cacheTimeout?: number
  enableRealtime?: boolean
}

interface DataFilters {
  dateRange?: { start: string; end: string }
  status?: string
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

type EntityType = 'user_profiles' | 'properties' | 'bookings' | 'notifications'

interface BaseEntity {
  id: string
  created_at?: string
  updated_at?: string
}
```

## 4. Performance Implementation Guide

### Performance Monitor Integration
```typescript
// src/composables/shared/usePerformanceMonitor.ts - Enhanced implementation
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function usePerformanceMonitor() {
  const isEnabled = ref(false)
  const metrics = ref<Map<string, PerformanceMetric>>(new Map())
  const thresholds = ref(PERFORMANCE_THRESHOLDS)
  
  // Component performance tracking
  const measureComponentPerformance = (componentName: string) => {
    let startTime = 0
    let subscriptionCount = 0
    
    return {
      startMeasurement: () => {
        if (!isEnabled.value) return
        startTime = performance.now()
      },
      
      endMeasurement: () => {
        if (!isEnabled.value || !startTime) return
        
        const renderTime = performance.now() - startTime
        updateMetric(`${componentName}_render_time`, renderTime, thresholds.value.maxRenderTime)
      },
      
      recordSubscription: () => {
        if (!isEnabled.value) return
        subscriptionCount++
        updateMetric(`${componentName}_subscriptions`, subscriptionCount, 5)
      },
      
      recordMemoryUsage: (bytes: number) => {
        if (!isEnabled.value) return
        const mb = bytes / (1024 * 1024)
        updateMetric(`${componentName}_memory`, mb, 10)
      }
    }
  }
  
  // Role-based performance measurement
  const measureRolePerformance = async <T>(
    role: UserRole,
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> => {
    if (!isEnabled.value) return fn()
    
    const start = performance.now()
    const memoryBefore = getMemoryUsage()
    
    try {
      const result = await fn()
      const duration = performance.now() - start
      const memoryAfter = getMemoryUsage()
      
      // Record performance metrics
      updateMetric(`${role}_${operation}_time`, duration, 1000)
      updateMetric(`${role}_${operation}_memory`, memoryAfter - memoryBefore, 5)
      
      return result
    } catch (error) {
      // Record error metrics
      updateMetric(`${role}_${operation}_errors`, 1, 0, 'counter')
      throw error
    }
  }
  
  // Cache performance tracking
  const trackCachePerformance = (operation: string, wasHit: boolean) => {
    const metricName = `cache_${operation}_hit_rate`
    const existing = metrics.value.get(metricName)
    
    if (existing) {
      const currentRate = existing.value
      const newRate = wasHit 
        ? Math.min(100, currentRate + 1)
        : Math.max(0, currentRate - 1)
      updateMetric(metricName, newRate, 80)
    } else {
      updateMetric(metricName, wasHit ? 100 : 0, 80)
    }
  }
  
  // Network performance tracking
  const trackNetworkPerformance = (endpoint: string, duration: number, success: boolean) => {
    updateMetric(`network_${endpoint}_time`, duration, thresholds.value.maxNetworkLatency)
    updateMetric(`network_${endpoint}_success_rate`, success ? 100 : 0, 95)
  }
  
  // Update metric with intelligent thresholding
  const updateMetric = (
    name: string,
    value: number,
    threshold: number,
    type: 'gauge' | 'counter' = 'gauge'
  ) => {
    const existing = metrics.value.get(name)
    const finalValue = type === 'counter' && existing 
      ? existing.value + value 
      : value
    
    const status = getMetricStatus(finalValue, threshold, name)
    const trend = existing ? getTrend(existing.value, finalValue) : 'stable'
    
    metrics.value.set(name, {
      name,
      value: finalValue,
      threshold,
      status,
      timestamp: Date.now(),
      trend,
      type
    })
    
    // Emit critical alerts
    if (status === 'critical') {
      emitPerformanceAlert(name, finalValue, threshold)
    }
  }
  
  // Performance status calculation
  const getMetricStatus = (
    value: number,
    threshold: number,
    metricName: string
  ): MetricStatus => {
    const isLowerBetter = metricName.includes('time') || 
                         metricName.includes('latency') ||
                         metricName.includes('memory')
    
    if (isLowerBetter) {
      if (value <= threshold * 0.5) return 'excellent'
      if (value <= threshold * 0.75) return 'good'
      if (value <= threshold) return 'warning'
      return 'critical'
    } else {
      if (value >= threshold * 1.2) return 'excellent'
      if (value >= threshold) return 'good'
      if (value >= threshold * 0.8) return 'warning'
      return 'critical'
    }
  }
  
  const getTrend = (oldValue: number, newValue: number): Trend => {
    const changePercent = Math.abs(newValue - oldValue) / oldValue
    if (changePercent < 0.05) return 'stable'
    return newValue > oldValue ? 'improving' : 'degrading'
  }
  
  // Performance summary
  const performanceSummary = computed(() => {
    const allMetrics = Array.from(metrics.value.values())
    
    const summary = {
      total: allMetrics.length,
      excellent: allMetrics.filter(m => m.status === 'excellent').length,
      good: allMetrics.filter(m => m.status === 'good').length,
      warning: allMetrics.filter(m => m.status === 'warning').length,
      critical: allMetrics.filter(m => m.status === 'critical').length
    }
    
    const score = Math.round(
      (summary.excellent * 100 + summary.good * 80 + 
       summary.warning * 60 + summary.critical * 20) / summary.total
    )
    
    return { ...summary, score }
  })
  
  // Critical metrics that need attention
  const criticalMetrics = computed(() => 
    Array.from(metrics.value.values()).filter(m => m.status === 'critical')
  )
  
  // Enable/disable monitoring
  const enableMonitoring = () => {
    isEnabled.value = true
    startPeriodicMeasurement()
  }
  
  const disableMonitoring = () => {
    isEnabled.value = false
    stopPeriodicMeasurement()
  }
  
  // Periodic measurement
  let measurementInterval: number | null = null
  
  const startPeriodicMeasurement = () => {
    measurementInterval = window.setInterval(() => {
      measureSystemPerformance()
    }, 10000) // Every 10 seconds
  }
  
  const stopPeriodicMeasurement = () => {
    if (measurementInterval) {
      clearInterval(measurementInterval)
      measurementInterval = null
    }
  }
  
  const measureSystemPerformance = () => {
    // Measure overall subscription count
    const subscriptionCount = estimateSubscriptionCount()
    updateMetric('total_subscriptions', subscriptionCount, thresholds.value.maxSubscriptions)
    
    // Measure memory usage
    const memoryUsage = getMemoryUsage()
    updateMetric('total_memory_usage', memoryUsage, thresholds.value.maxMemoryUsage)
    
    // Measure DOM complexity
    const domComplexity = document.querySelectorAll('*').length
    updateMetric('dom_complexity', domComplexity, 1000)
  }
  
  // Utility functions
  const getMemoryUsage = (): number => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize / (1024 * 1024)
    }
    return 0
  }
  
  const estimateSubscriptionCount = (): number => {
    // Rough estimation based on reactive elements
    return document.querySelectorAll('[data-reactive]').length
  }
  
  const emitPerformanceAlert = (name: string, value: number, threshold: number) => {
    console.warn(`🚨 Performance Alert: ${name} = ${value} (threshold: ${threshold})`)
    
    // Could emit to external monitoring service here
    if (window.analytics) {
      window.analytics.track('Performance Alert', {
        metric: name,
        value,
        threshold,
        timestamp: Date.now()
      })
    }
  }
  
  // Lifecycle
  onMounted(() => {
    if (import.meta.env.DEV || import.meta.env.VITE_PERFORMANCE_MONITORING === 'true') {
      enableMonitoring()
    }
  })
  
  onUnmounted(() => {
    disableMonitoring()
  })
  
  return {
    // State
    isEnabled,
    metrics,
    performanceSummary,
    criticalMetrics,
    
    // Measurement functions
    measureComponentPerformance,
    measureRolePerformance,
    trackCachePerformance,
    trackNetworkPerformance,
    updateMetric,
    
    // Control functions
    enableMonitoring,
    disableMonitoring,
    
    // Constants
    thresholds: computed(() => thresholds.value)
  }
}

// Performance thresholds based on current achievements
const PERFORMANCE_THRESHOLDS = {
  maxSubscriptions: 40,        // Target: maintain ≤40 subscriptions
  maxMemoryUsage: 100,         // 100MB threshold
  maxRenderTime: 16,           // 60fps target (16ms per frame)
  maxNetworkLatency: 200,      // 200ms max API response
  maxBundleLoadTime: 3000,     // 3s max bundle load
  minCacheHitRate: 80          // 80% cache hit rate
}

// Types
interface PerformanceMetric {
  name: string
  value: number
  threshold: number
  status: MetricStatus
  timestamp: number
  trend: Trend
  type: 'gauge' | 'counter'
}

type MetricStatus = 'excellent' | 'good' | 'warning' | 'critical'
type Trend = 'improving' | 'stable' | 'degrading'
type UserRole = 'owner' | 'admin' | 'cleaner'
```

## 5. Testing Implementation Guide

### Component Testing with Performance
```typescript
// tests/components/AdminUsers.test.ts - Example component test
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import AdminUsers from '@/components/smart/admin/AdminUsers.vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types'

const createWrapper = (options: TestOptions = {}) => {
  const wrapper = mount(AdminUsers, {
    props: {
      userRole: 'admin',
      enablePerformanceMonitoring: false, // Disable in tests
      ...options.props
    },
    global: {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          initialState: {
            auth: {
              user: options.user || mockAdminUser,
              isAuthenticated: true,
              isAdmin: true
            }
          }
        })
      ],
      stubs: {
        AdminUsersHeader: true,
        AdminUsersTable: true,
        AdminUsersPagination: true
      }
    }
  })
  
  return wrapper
}

const mockAdminUser: User = {
  id: '1',
  email: 'admin@test.com',
  name: 'Test Admin',
  role: 'admin',
  access_level: 'full',
  notifications_enabled: true,
  timezone: 'America/New_York',
  theme: 'light',
  language: 'en'
}

describe('AdminUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  describe('Rendering', () => {
    it('should render all main components', () => {
      const wrapper = createWrapper()
      
      expect(wrapper.findComponent({ name: 'AdminUsersHeader' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'AdminUsersTable' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'AdminUsersPagination' }).exists()).toBe(true)
    })
    
    it('should render with correct admin role permissions', () => {
      const wrapper = createWrapper()
      const vm = wrapper.vm as any
      
      expect(vm.userPermissions.canManageUsers).toBe(true)
      expect(vm.userPermissions.canViewReports).toBe(true)
    })
  })
  
  describe('Performance Integration', () => {
    it('should track component performance when enabled', async () => {
      const mockPerformanceMonitor = {
        measureComponentPerformance: vi.fn(() => ({
          startMeasurement: vi.fn(),
          endMeasurement: vi.fn(),
          recordSubscription: vi.fn()
        }))
      }
      
      vi.doMock('@/composables/shared/usePerformanceMonitor', () => ({
        usePerformanceMonitor: () => mockPerformanceMonitor
      }))
      
      const wrapper = createWrapper({ 
        props: { enablePerformanceMonitoring: true } 
      })
      
      expect(mockPerformanceMonitor.measureComponentPerformance)
        .toHaveBeenCalledWith('AdminUsers')
    })
    
    it('should emit performance metrics for user loading', async () => {
      const wrapper = createWrapper()
      const emittedEvents = wrapper.emitted('performance-metric')
      
      // Simulate loading users
      await wrapper.vm.loadUsers()
      
      expect(emittedEvents).toBeDefined()
      expect(emittedEvents![0][0]).toMatchObject({
        name: 'users_loaded',
        component: 'AdminUsers'
      })
    })
  })
  
  describe('User Management', () => {
    it('should handle user creation', async () => {
      const wrapper = createWrapper()
      const mockUserData = {
        email: 'newuser@test.com',
        name: 'New User',
        role: 'owner'
      }
      
      await wrapper.vm.handleCreateUser(mockUserData)
      
      const actionEvents = wrapper.emitted('action')
      expect(actionEvents).toBeDefined()
      expect(actionEvents![0][0]).toMatchObject({
        type: 'user_created',
        payload: expect.objectContaining(mockUserData)
      })
    })
    
    it('should handle user role updates', async () => {
      const wrapper = createWrapper()
      const action = {
        type: 'update_role',
        userId: '123',
        newRole: 'admin'
      }
      
      await wrapper.vm.handleUserAction(action)
      
      const actionEvents = wrapper.emitted('action')
      expect(actionEvents).toBeDefined()
      expect(actionEvents![0][0]).toEqual(action)
    })
  })
  
  describe('Error Handling', () => {
    it('should emit error events on failures', async () => {
      const wrapper = createWrapper()
      
      // Mock data layer to throw error
      vi.spyOn(wrapper.vm.dataLayer, 'createRecord')
        .mockRejectedValue(new Error('Creation failed'))
      
      await wrapper.vm.handleCreateUser({ name: 'Test' })
      
      const errorEvents = wrapper.emitted('error')
      expect(errorEvents).toBeDefined()
      expect(errorEvents![0][0]).toBe('Creation failed')
    })
  })
})

interface TestOptions {
  props?: Record<string, any>
  user?: User
}
```

### Performance Testing
```typescript
// tests/performance/performance.test.ts - Performance regression tests
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { usePerformanceMonitor } from '@/composables/shared/usePerformanceMonitor'

describe('Performance Tests', () => {
  let performanceMonitor: ReturnType<typeof usePerformanceMonitor>
  
  beforeEach(() => {
    performanceMonitor = usePerformanceMonitor()
    performanceMonitor.enableMonitoring()
  })
  
  afterEach(() => {
    performanceMonitor.disableMonitoring()
  })
  
  describe('Subscription Count Limits', () => {
    it('should maintain subscription count under 40', async () => {
      // Simulate typical app usage
      const wrapper = createCompleteApp()
      await wrapper.vm.$nextTick()
      
      // Wait for metrics to be collected
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const subscriptionMetric = performanceMonitor.metrics.value.get('total_subscriptions')
      expect(subscriptionMetric?.value).toBeLessThanOrEqual(40)
    })
    
    it('should respect role-based subscription limits', async () => {
      const roles = ['owner', 'admin', 'cleaner'] as const
      const limits = { owner: 15, admin: 25, cleaner: 10 }
      
      for (const role of roles) {
        const wrapper = createAppWithRole(role)
        await wrapper.vm.$nextTick()
        
        const subscriptionCount = estimateRoleSubscriptions(wrapper, role)
        expect(subscriptionCount).toBeLessThanOrEqual(limits[role])
      }
    })
  })
  
  describe('Memory Usage Limits', () => {
    it('should maintain memory usage under 100MB', async () => {
      const wrapper = createCompleteApp()
      
      // Simulate heavy usage
      await simulateHeavyUsage(wrapper)
      
      const memoryMetric = performanceMonitor.metrics.value.get('total_memory_usage')
      expect(memoryMetric?.value).toBeLessThanOrEqual(100)
    })
    
    it('should efficiently manage Map collections', () => {
      const { OptimizedCollectionManager } = require('@/utils/performance')
      const collection = new OptimizedCollectionManager()
      
      // Add 1000 items
      for (let i = 0; i < 1000; i++) {
        collection.add({ id: `item-${i}`, data: `test-${i}` })
      }
      
      const memoryUsage = collection.getMemoryUsage()
      expect(memoryUsage.estimatedBytes).toBeLessThanOrEqual(1024 * 1024) // 1MB
      expect(memoryUsage.itemCount).toBe(1000)
    })
  })
  
  describe('Render Performance', () => {
    it('should render components within 16ms (60fps)', async () => {
      const renderTimes: number[] = []
      
      for (let i = 0; i < 10; i++) {
        const start = performance.now()
        const wrapper = createCompleteApp()
        await wrapper.vm.$nextTick()
        const end = performance.now()
        
        renderTimes.push(end - start)
        wrapper.unmount()
      }
      
      const averageRenderTime = renderTimes.reduce((a, b) => a + b) / renderTimes.length
      expect(averageRenderTime).toBeLessThanOrEqual(16)
    })
    
    it('should handle large data sets efficiently', async () => {
      const largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        name: `Item ${i}`,
        status: 'active'
      }))
      
      const start = performance.now()
      const wrapper = createAppWithData(largeDataSet)
      await wrapper.vm.$nextTick()
      const end = performance.now()
      
      expect(end - start).toBeLessThanOrEqual(100) // 100ms max for 1000 items
    })
  })
  
  describe('Network Performance', () => {
    it('should batch similar requests', async () => {
      const { BatteryOptimizedNetworking } = require('@/utils/performance')
      const networking = new BatteryOptimizedNetworking()
      
      // Simulate multiple similar requests
      const requests = Array.from({ length: 5 }, (_, i) => 
        networking.request(`/api/users?page=${i}`, { priority: 'normal' })
      )
      
      const results = await Promise.all(requests)
      expect(results).toHaveLength(5)
      
      // Should have batched requests (implementation detail test)
      expect(networking.requestQueue.length).toBeLessThanOrEqual(1)
    })
    
    it('should respect battery optimization', async () => {
      const { BatteryOptimizedSync } = require('@/utils/performance')
      const sync = new BatteryOptimizedSync()
      
      // Mock low battery
      Object.defineProperty(sync, 'batteryLevel', { value: 0.2 })
      Object.defineProperty(sync, 'isCharging', { value: false })
      
      const baseInterval = 60000 // 1 minute
      const optimizedInterval = sync.calculateOptimalInterval(baseInterval)
      
      // Should increase interval in low power mode
      expect(optimizedInterval).toBeGreaterThan(baseInterval * 2)
    })
  })
})

// Helper functions
const createCompleteApp = () => {
  return mount(App, {
    global: {
      plugins: [createTestingPinia()]
    }
  })
}

const createAppWithRole = (role: UserRole) => {
  return mount(App, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            auth: {
              user: { role },
              isAuthenticated: true
            }
          }
        })
      ]
    }
  })
}

const createAppWithData = (data: any[]) => {
  return mount(DataTable, {
    props: { items: data },
    global: {
      plugins: [createTestingPinia()]
    }
  })
}

const estimateRoleSubscriptions = (wrapper: any, role: UserRole): number => {
  // Count reactive elements for role-specific components
  const roleComponents = wrapper.findAll(`[data-role="${role}"]`)
  return roleComponents.length * 2 // Estimate 2 subscriptions per component
}

const simulateHeavyUsage = async (wrapper: any) => {
  // Simulate heavy data loading
  await wrapper.vm.loadLargeDataSet()
  
  // Simulate multiple page navigations
  for (let i = 0; i < 5; i++) {
    await wrapper.vm.$router.push(`/page-${i}`)
    await wrapper.vm.$nextTick()
  }
  
  // Simulate form interactions
  const forms = wrapper.findAll('form')
  for (const form of forms) {
    await form.trigger('submit')
    await wrapper.vm.$nextTick()
  }
}
```

## 6. Deployment Implementation

### Environment Configuration
```bash
# .env.production - Production environment
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_PERFORMANCE_MONITORING=true
VITE_CACHE_TIMEOUT=300000
VITE_MAX_SUBSCRIPTIONS=40
VITE_BATTERY_OPTIMIZATION=true

# Performance monitoring
VITE_PERFORMANCE_ENDPOINT=https://analytics.your-domain.com
VITE_ERROR_REPORTING=https://errors.your-domain.com
```

### Build Optimization
```typescript
// vite.config.ts - Production build optimization
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  
  build: {
    // Role-based code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework
          'vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['vuetify'],
          'supabase': ['@supabase/supabase-js'],
          
          // Role-based chunks
          'admin': [
            './src/components/smart/admin/AdminDashboard.vue',
            './src/components/smart/admin/AdminUsers.vue',
            './src/components/smart/admin/AdminReports.vue'
          ],
          
          'owner': [
            './src/components/smart/owner/OwnerDashboard.vue',
            './src/components/smart/owner/OwnerProperties.vue',
            './src/components/smart/owner/OwnerBookings.vue'
          ],
          
          'shared': [
            './src/components/smart/shared/Calendar.vue',
            './src/components/smart/shared/UserProfile.vue'
          ]
        }
      }
    },
    
    // Bundle size optimization
    chunkSizeWarningLimit: 500, // 500KB warning limit
    
    // Source maps for production debugging
    sourcemap: process.env.NODE_ENV === 'production' ? 'hidden' : true
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      '@supabase/supabase-js'
    ]
  },
  
  // PWA configuration for battery optimization
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/your-project\.supabase\.co\/rest\/v1\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 300 // 5 minutes
              }
            }
          }
        ]
      }
    })
  ]
})
```

This comprehensive implementation guide provides the foundation for implementing the Property Cleaning Scheduler's advanced architecture with optimal performance, maintainability, and scalability.