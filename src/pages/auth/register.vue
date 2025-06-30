<template>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          autocomplete="name"
          required
        >
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          required
        >
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="new-password"
          required
        >
      </div>
      <div class="form-group">
        <label for="role">Role</label>
        <select
          id="role"
          v-model="role"
          required
        >
          <option value="owner">
            Property Owner
          </option>
          <option value="admin">
            Administrator
          </option>
          <option value="cleaner">
            Cleaner
          </option>
        </select>
      </div>
      <button type="submit">
        Register
      </button>
    </form>
    <p>
      Already have an account?
      <router-link to="/auth/login">
        Login
      </router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/shared/useAuth'

const router = useRouter()
const { register: authRegister } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const role = ref('owner')

const register = async () => {
  try {
    await authRegister({
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value as 'owner' | 'admin' | 'cleaner'
    })
    router.push('/')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>

<style scoped>
.register-page {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}
</style> 