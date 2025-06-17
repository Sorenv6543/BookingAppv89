# Authentication Flow - File Responsibilities

## 🎯 **Quick Overview**

```
User clicks login → Router Guards → Auth Store → Component Selection → Data Filtering
```

## 📁 **File-by-File Breakdown**

### **🔐 AUTHENTICATION LAYER**

#### **`src/stores/auth.ts`** - 🏛️ **CENTRAL AUTH STATE**
```typescript
// THE BRAIN - Manages all auth state
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(null)
  const tempViewMode = ref<{ role: UserRole; ownerId?: string } | null>(null)
  
  // Role-based computed properties
  const isOwner = computed(() => user.value?.role === 'owner')
  const isAdmin = computed(() => user.value?.role === 'admin')
  
  // Auth actions
  async function login(email: string, password: string): Promise<boolean>
  async function logout(): Promise<boolean>
  function switchToOwnerView(ownerId?: string): boolean // Admin only
})
```

**What it does:**
- ✅ Stores current user & auth state
- ✅ Provides role-checking computed properties (`isOwner`, `isAdmin`)
- ✅ Handles login/logout/registration
- ✅ Manages admin view-switching
- ✅ Used by ALL other components to check auth status

---

#### **`src/composables/shared/useAuth.ts`** - 🔧 **AUTH OPERATIONS**
```typescript
// THE WORKER - Actual login/logout logic
export const useAuth = () => {
  async function login(email: string, password: string) {
    // Mock authentication logic
    // In Phase 2: Real Supabase calls
  }
  
  async function logout() {
    // Clear session logic
  }
  
  async function register(userData: RegisterData) {
    // Account creation logic
  }
}
```

**What it does:**
- ✅ Contains actual authentication logic
- ✅ Currently mock implementation
- ✅ Called by auth store
- ✅ Future: Will contain real Supabase calls

---

#### **`src/utils/authHelpers.ts`** - 🛠️ **AUTH UTILITIES**
```typescript
// THE HELPER - Utility functions for auth
export function getDefaultRouteForRole(userRole: UserRole): string {
  switch (userRole) {
    case 'owner': return '/owner/dashboard'
    case 'admin': return '/admin'
    case 'cleaner': return '/cleaner/dashboard'
  }
}

export function getRoleSpecificSuccessMessage(action: string, role: UserRole): string
export function clearAllRoleSpecificState(): void
export function validateRoleNavigation(userRole: UserRole, targetPath: string)
```

**What it does:**
- ✅ Route mapping for each role
- ✅ Role-specific UI messages
- ✅ Navigation validation helpers
- ✅ State cleanup utilities

---

### **🛣️ ROUTING & GUARDS LAYER**

#### **`src/router/index.ts`** - 🗺️ **ROUTE DEFINITIONS**
```typescript
// THE MAP - Defines all routes with auth requirements
const routes = [
  {
    path: '/admin',
    component: () => import('@/pages/admin/index.vue'),
    meta: {
      layout: 'admin',
      requiresAuth: true,  // ← Auth required
      role: 'admin'        // ← Role required
    }
  },
  {
    path: '/owner/dashboard',
    component: () => import('@/pages/owner/dashboard.vue'),
    meta: {
      layout: 'default',
      requiresAuth: true,  // ← Auth required
      role: 'owner'        // ← Role required
    }
  }
]

// Apply guards
router.beforeEach(authGuard)  // ← Main protection
```

**What it does:**
- ✅ Maps URLs to components
- ✅ Declares auth requirements via `meta.requiresAuth`
- ✅ Declares role requirements via `meta.role`
- ✅ Applies navigation guards

---

#### **`src/router/guards.ts`** - 🛡️ **ROUTE PROTECTION**
```typescript
// THE BOUNCER - Blocks unauthorized access
export async function authGuard(to, from, next) {
  const authStore = useAuthStore()
  
  // 1. Public routes (auth pages, demos) - allow
  if (isPublicRoute(to)) return next()
  
  // 2. Auth required but not logged in - redirect to login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/auth/login')
  }
  
  // 3. Role required but user lacks permission - redirect to dashboard
  if (to.meta.role && !hasRolePermission(authStore.user?.role, to.meta.role)) {
    return next(getDefaultRouteForRole(authStore.user?.role))
  }
  
  // 4. All checks passed - allow
  next()
}
```

**What it does:**
- ✅ Runs before EVERY route change
- ✅ Checks if user is authenticated
- ✅ Checks if user has required role
- ✅ Redirects unauthorized users
- ✅ Shows error messages

---

### **🎭 COMPONENT SELECTION LAYER**

#### **`src/pages/index.vue`** - 🎬 **ROLE-BASED COMPONENT DIRECTOR**
```typescript
// THE DIRECTOR - Chooses which component to show
const homeComponent = computed(() => {
  // Not logged in → Show login prompt
  if (!authStore.isAuthenticated) {
    return AuthPrompt
  }
  
  // Admin user → Show admin interface (system-wide data)
  if (authStore.isAdmin) {
    // Admin in temp owner view?
    if (authStore.tempViewMode?.role === 'owner') {
      return HomeOwner  // Admin sees owner interface
    }
    return HomeAdmin    // Admin sees admin interface
  }
  
  // Owner user → Show owner interface (filtered data)
  if (authStore.isOwner) {
    return HomeOwner
  }
  
  // Fallback
  return AuthPrompt
})
```

**What it does:**
- ✅ **ROOT DECISION MAKER** - chooses which UI to show
- ✅ Renders different components based on role
- ✅ Handles admin view-switching
- ✅ Shows auth prompt for unauthenticated users

---

### **🏠 ROLE-SPECIFIC INTERFACES**

#### **`src/components/smart/owner/HomeOwner.vue`** - 👤 **OWNER INTERFACE**
```typescript
// THE OWNER VIEW - Shows only owner's data
const currentOwnerId = computed(() => authStore.user?.id)

// Filter properties to show only this owner's
const ownerPropertiesMap = computed(() => {
  return propertyStore.propertiesArray
    .filter(property => property.owner_id === currentOwnerId.value)
})

// Filter bookings to show only this owner's  
const ownerBookingsMap = computed(() => {
  return bookingStore.bookingsArray
    .filter(booking => booking.owner_id === currentOwnerId.value)
})
```

**What it does:**
- ✅ **FILTERED VIEW** - Owner sees only their data
- ✅ Filters properties by `owner_id`
- ✅ Filters bookings by `owner_id`
- ✅ Prevents access to other owners' data

---

#### **`src/components/smart/admin/HomeAdmin.vue`** - 👑 **ADMIN INTERFACE**
```typescript
// THE ADMIN VIEW - Shows ALL data across ALL owners
const allPropertiesMap = computed(() => {
  // Admin sees ALL properties (no filtering!)
  return propertyStore.properties
})

const allBookingsMap = computed(() => {
  // Admin sees ALL bookings (no filtering!)
  return bookingStore.bookingsArray
})

// System-wide metrics
const systemMetricsText = computed(() => {
  const totalProperties = allPropertiesMap.value.size
  const totalBookings = allBookingsMap.value.size
  return `${totalProperties} properties • ${totalBookings} bookings`
})
```

**What it does:**
- ✅ **UNFILTERED VIEW** - Admin sees all data
- ✅ Access to all properties across all owners
- ✅ System-wide metrics and controls
- ✅ Can manage any owner's data

---

### **🎨 LAYOUT LAYER**

#### **`src/layouts/default.vue`** - 📱 **OWNER LAYOUT**
```typescript
// THE OWNER WRAPPER - Standard app layout
<template>
  <v-app>
    <v-navigation-drawer>
      <!-- Owner-focused navigation -->
      <v-list-item to="/owner/dashboard">Dashboard</v-list-item>
      <v-list-item to="/owner/properties">My Properties</v-list-item>
    </v-navigation-drawer>
    
    <v-app-bar>
      <v-app-bar-title>Property Cleaning Scheduler</v-app-bar-title>
      <!-- Theme picker, user menu -->
    </v-app-bar>
    
    <v-main>
      <router-view />  <!-- Owner components render here -->
    </v-main>
  </v-app>
</template>
```

**What it does:**
- ✅ Owner-focused navigation menu
- ✅ Standard app bar and sidebar
- ✅ Used by owner routes

---

#### **`src/layouts/admin.vue`** - 🛡️ **ADMIN LAYOUT**
```typescript
// THE ADMIN WRAPPER - Admin-focused layout
<template>
  <v-app>
    <v-app-bar color="surface" class="admin-app-bar">
      <v-avatar color="primary">
        <v-icon>mdi-shield-crown</v-icon>  <!-- Admin crown icon -->
      </v-avatar>
      <div>Property Scheduler</div>
      <div class="admin-badge">Admin Dashboard</div>
      
      <!-- Admin navigation -->
      <v-btn to="/admin">Dashboard</v-btn>
      <v-btn to="/admin/cleaners">Cleaners</v-btn>
      <v-btn to="/admin/reports">Reports</v-btn>
    </v-app-bar>
    
    <v-main>
      <router-view />  <!-- Admin components render here -->
    </v-main>
  </v-app>
</template>
```

**What it does:**
- ✅ Admin-focused navigation
- ✅ Different styling (crown icon, admin badge)
- ✅ System management links
- ✅ Used by admin routes

---

#### **`src/layouts/auth.vue`** - 🔑 **AUTH LAYOUT**
```typescript
// THE AUTH WRAPPER - Login/register pages
<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Property Cleaning Scheduler</v-toolbar-title>
    </v-app-bar>
    
    <v-main class="auth-main">
      <!-- Centered login/register forms -->
      <v-container fill-height>
        <router-view />  <!-- Login/register components -->
      </v-container>
    </v-main>
  </v-app>
</template>
```

**What it does:**
- ✅ Minimal layout for auth pages
- ✅ Centered form layout
- ✅ Used by `/auth/login`, `/auth/signup`

---

### **📄 AUTH PAGES**

#### **`src/pages/auth/login.vue`** - 🚪 **LOGIN FORM**
```typescript
// THE LOGIN FORM - User credentials entry
async function handleLogin() {
  const success = await authStore.login(email.value, password.value)
  
  if (success) {
    // Navigate to role-appropriate dashboard
    const defaultRoute = getDefaultRouteForRole(authStore.user?.role)
    await router.push(defaultRoute)
  }
}

// Demo buttons for development
async function loginAsOwner() {
  email.value = 'owner@example.com'
  password.value = 'password'
  await handleLogin()
}
```

**What it does:**
- ✅ Login form with email/password
- ✅ Calls `authStore.login()`
- ✅ Demo buttons for development
- ✅ Redirects to role-based dashboard

---

## 🔄 **EXECUTION FLOW**

### **1. User visits `/admin`**
```
router/index.ts → Matches admin route → Applies guards
```

### **2. Auth guard runs**
```
router/guards.ts → Checks auth → Checks role → Allows/blocks
```

### **3. Component selection (if allowed)**
```
pages/index.vue → Checks authStore.isAdmin → Renders HomeAdmin
```

### **4. Data access**
```
HomeAdmin.vue → Gets ALL data (no filtering)
HomeOwner.vue → Gets filtered data (owner_id only)
```

### **5. Layout wrapping**
```
App.vue → Reads route.meta.layout → Wraps in admin/default layout
```

## 🎯 **KEY TAKEAWAYS**

| **File** | **Role** | **When It Runs** |
|----------|----------|-------------------|
| `auth.ts` | Auth state management | Always available |
| `guards.ts` | Route protection | Before every navigation |
| `index.vue` | Component selection | On root route `/` |
| `HomeOwner.vue` | Owner interface | When owner logged in |
| `HomeAdmin.vue` | Admin interface | When admin logged in |
| `login.vue` | Authentication form | When user needs to login |

**The magic happens in `pages/index.vue`** - it's the **central dispatcher** that chooses owner vs admin interface based on `authStore` state!