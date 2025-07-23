import { ref } from 'vue'
import type { Ref } from 'vue'
import type { User, UserRole } from '@/types/user'
import { supabase } from '@/plugins/supabase' // adjust import if needed
// import { useAdminErrorHandler } from '@/composables/admin/useAdminErrorHandler'

// State
const users: Ref<User[]> = ref([])
const loading = ref(false)
const error = ref<string | null>(null)

// Core Methods (stubs)
async function fetchAllUsers(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const { data, error: supabaseError } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (supabaseError) {
      throw supabaseError
    }
    users.value = (data as User[]) || []
  } catch (err: any) {
    error.value = err?.message || 'Failed to fetch users'
    users.value = []
  } finally {
    loading.value = false
  }
}

async function createUser(userData: Partial<User> & { password: string }): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    // 1. Create user in auth.users (Supabase admin API)
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email!,
      password: userData.password,
      email_confirm: true,
      user_metadata: {
        name: userData.name,
        role: userData.role,
      }
    })
    if (authError || !authData?.user) {
      throw authError || new Error('Failed to create auth user')
    }
    // 2. Insert into user_profiles
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        company_name: userData.company_name || null,
        access_level: userData.access_level || null,
        skills: userData.skills || null,
        max_daily_bookings: userData.max_daily_bookings || null,
        location: userData.location || null,
        timezone: userData.timezone || null,
        language: userData.language || null,
        notifications_enabled: userData.notifications_enabled ?? true
      })
    if (profileError) {
      // Clean up auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id)
      throw profileError
    }
    await fetchAllUsers()
    return true
  } catch (err: any) {
    error.value = err?.message || 'Failed to create user'
    return false
  } finally {
    loading.value = false
  }
}

async function updateUser(userId: string, updateData: Partial<User>): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    if (updateError) {
      throw updateError
    }
    await fetchAllUsers()
    return true
  } catch (err: any) {
    error.value = err?.message || 'Failed to update user'
    return false
  } finally {
    loading.value = false
  }
}

async function deleteUser(userId: string): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    // Delete from user_profiles first
    const { error: profileError } = await supabase
      .from('user_profiles')
      .delete()
      .eq('id', userId)
    if (profileError) {
      throw profileError
    }
    // Delete from auth.users using admin API
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) {
      // Warn but do not throw, since profile deletion succeeded
      console.warn('Auth user deletion failed:', authError)
    }
    await fetchAllUsers()
    return true
  } catch (err: any) {
    error.value = err?.message || 'Failed to delete user'
    return false
  } finally {
    loading.value = false
  }
}

async function bulkChangeRoles(userIds: string[], newRole: UserRole): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    const updatePromises = userIds.map(userId =>
      supabase
        .from('user_profiles')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId)
    )
    const results = await Promise.all(updatePromises)
    const anyError = results.some(r => r.error)
    if (anyError) {
      const errors = results.filter(r => r.error).map(r => r.error?.message).join('; ')
      throw new Error(errors)
    }
    await fetchAllUsers()
    return true
  } catch (err: any) {
    error.value = err?.message || 'Failed to change user roles'
    return false
  } finally {
    loading.value = false
  }
}

async function resetUserPassword(userId: string, newPassword: string): Promise<boolean> {
  loading.value = true
  error.value = null
  try {
    // Supabase admin API does not send password reset emails directly; must use client API
    const { error: resetError } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword
    })
    if (resetError) {
      throw resetError
    }
    return true
  } catch (err: any) {
    error.value = err?.message || 'Failed to send password reset email'
    return false
  } finally {
    loading.value = false
  }
}

export function useAdminUserManagement() {
  return {
    users,
    loading,
    error,
    fetchAllUsers,
    createUser,
    updateUser,
    deleteUser,
    bulkChangeRoles,
    resetUserPassword
  }
} 