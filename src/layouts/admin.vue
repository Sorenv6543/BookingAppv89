<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="logo">
        <h1>Property Scheduler</h1>
        <span class="admin-badge">Admin</span>
      </div>
      <nav class="admin-nav">
        <router-link to="/">
          Home
        </router-link>
        <router-link to="/properties">
          Properties
        </router-link>
        <router-link to="/calendar">
          Calendar
        </router-link>
        <router-link to="/admin">
          Admin
        </router-link>
        <a
          href="#"
          @click.prevent="logout"
        >Logout</a>
      </nav>
    </header>
    
    <div class="admin-container">
      <aside class="admin-sidebar">
        <h3>Admin Controls</h3>
        <ul>
          <li>
            <router-link to="/admin">
              Dashboard
            </router-link>
          </li>
          <li>
            <router-link to="/admin/users">
              User Management
            </router-link>
          </li>
          <li>
            <router-link to="/admin/settings">
              System Settings
            </router-link>
          </li>
          <li>
            <router-link to="/admin/reports">
              Reports
            </router-link>
          </li>
        </ul>
      </aside>
      
      <main class="admin-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/shared/useAuth'
import { useRouter } from 'vue-router'

const { logout: authLogout } = useAuth()
const router = useRouter()

const logout = async () => {
  await authLogout()
  router.push('/auth/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #333;
  color: white;
}

.logo {
  display: flex;
  align-items: center;
}

.logo h1 {
  font-size: 1.5rem;
  margin: 0;
}

.admin-badge {
  background-color: #ff9800;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-left: 1rem;
}

.admin-nav {
  display: flex;
  gap: 1rem;
}

.admin-nav a {
  color: white;
  text-decoration: none;
}

.admin-nav a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}

.admin-container {
  display: flex;
  flex: 1;
}

.admin-sidebar {
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem;
}

.admin-sidebar h3 {
  margin-top: 0;
}

.admin-sidebar ul {
  list-style: none;
  padding: 0;
}

.admin-sidebar li {
  margin-bottom: 0.5rem;
}

.admin-sidebar a {
  display: block;
  padding: 0.5rem;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
}

.admin-sidebar a:hover {
  background-color: #e0e0e0;
}

.admin-sidebar a.router-link-active {
  background-color: #4CAF50;
  color: white;
}

.admin-content {
  flex: 1;
  padding: 1rem 2rem;
}
</style> 