# **Role-Based Integration Patterns**

> **Integration Guide for Owner-Admin Component Architecture**  
> How to properly integrate and use components across different user roles

---

## **📋 Overview**

This guide explains how to properly integrate components across the **Owner** and **Admin** interfaces, ensuring proper data scoping, role-based access control, and seamless user experiences. The architecture follows a **three-tier pattern**: **Shared Components**, **Role-Specific Components**, and **Smart Orchestrators**.

### **Architecture Layers**
```
┌─────────────────────────────────────────────────────────────┐
│                    SMART ORCHESTRATORS                     │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │   HomeOwner     │              │   HomeAdmin     │      │
│  │   OwnerSidebar  │              │   AdminSidebar  │      │
│  │   OwnerCalendar │              │   AdminCalendar │      │
│  └─────────────────┘              └─────────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                  ROLE-SPECIFIC DUMB COMPONENTS             │
│  ┌─────────────────┐              ┌─────────────────┐      │
│  │ OwnerBookingForm│              │AdminBookingForm │      │
│  │ OwnerPropertyForm              │CleanerAssignment│      │
│  │ OwnerQuickActions              │TurnPriorityPanel│      │
│  └─────────────────┘              └─────────────────┘      │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                    SHARED COMPONENTS                       │
│  PropertyCard • TurnAlerts • LoadingSpinner • ErrorAlert  │
│  ConfirmationDialog • PWAComponents • ThemePicker         │
└─────────────────────────────────────────────────────────────┘
```

---

## **🔄 Data Flow Patterns**

### **Owner Data Flow**
```typescript
// 1. DATA FILTERING: Owner sees only their data
const ownerPropertiesMap = computed(() => {
  const map = new Map<string, Property>();
  propertyStore.properties.forEach((property, id) => {
    if (property.owner_id === currentOwnerId.value) {
      map.set(id, property);
    }
  });
  return map;
});

// 2. COMPONENT USAGE: Pass filtered data to shared components
<PropertyCard 
  :property="ownerProperty"          // Only owner's property
  @edit="handleOwnerEdit"            // Owner-specific handler
/>

// 3. EVENT HANDLING: Owner-scoped actions
const handleOwnerEdit = (propertyId: string) => {
  // Verify ownership before allowing edit
  if (ownerPropertiesMap.value.has(propertyId)) {
    openPropertyEditForm(propertyId);
  }
};
```

### **Admin Data Flow**
```typescript
// 1. NO FILTERING: Admin sees all data
const allPropertiesMap = computed(() => {
  // Admin has access to ALL properties across ALL owners
  return propertyStore.properties;
});

// 2. COMPONENT USAGE: Pass all data to shared components
<PropertyCard 
  :property="anyProperty"            // Any property in system
  @edit="handleAdminEdit"            // Admin-specific handler
/>

// 3. EVENT HANDLING: System-wide actions
const handleAdminEdit = (propertyId: string) => {
  // Admin can edit any property
  openAdminPropertyEditForm(propertyId);
};
```

---

## **🎯 Role-Based Component Selection**

### **Smart Component Selection Pattern**

```vue
<!-- pages/dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- Role-based component rendering -->
    <HomeOwner v-if="isOwner" />
    <HomeAdmin v-if="isAdmin" />
    
    <!-- ERROR: Never use conditional props on single component -->
    <!-- <Home :userRole="currentRole" :showAdminFeatures="isAdmin" /> -->
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import HomeOwner from '@/components/smart/owner/HomeOwner.vue';
import HomeAdmin from '@/components/smart/admin/HomeAdmin.vue';

const authStore = useAuthStore();

const isOwner = computed(() => authStore.user?.role === 'owner');
const isAdmin = computed(() => authStore.user?.role === 'admin');
</script>
```

### **Form Component Selection Pattern**

```vue
<!-- Smart Orchestrator -->
<template>
  <div>
    <!-- Role-specific booking forms -->
    <OwnerBookingForm 
      v-if="isOwner"
      v-model="bookingFormOpen"
      :properties="ownerProperties"     <!-- Filtered data -->
      @submit="handleOwnerBookingSubmit"
    />
    
    <AdminBookingForm 
      v-if="isAdmin"
      v-model="bookingFormOpen"
      :properties="allProperties"       <!-- All data -->
      :cleaners="allCleaners"           <!-- Admin-only feature -->
      @submit="handleAdminBookingSubmit"
      @assign-cleaner="handleAssignCleaner"  <!-- Admin-only event -->
    />
  </div>
</template>
```

---

## **🔗 Shared Component Integration**

### **Data Scoping Pattern**

The key to shared component integration is **proper data scoping**:

```typescript
// composables/useDataForRole.ts
export const useRoleBasedData = () => {
  const authStore = useAuthStore();
  const propertyStore = usePropertyStore();
  const bookingStore = useBookingStore();

  const isOwner = computed(() => authStore.user?.role === 'owner');
  const isAdmin = computed(() => authStore.user?.role === 'admin');
  const currentOwnerId = computed(() => authStore.user?.id);

  // Properties scoped by role
  const propertiesForRole = computed(() => {
    if (isAdmin.value) {
      // Admin: All properties
      return propertyStore.properties;
    } else if (isOwner.value) {
      // Owner: Only their properties
      const map = new Map<string, Property>();
      propertyStore.properties.forEach((property, id) => {
        if (property.owner_id === currentOwnerId.value) {
          map.set(id, property);
        }
      });
      return map;
    }
    return new Map<string, Property>();
  });

  // Bookings scoped by role
  const bookingsForRole = computed(() => {
    if (isAdmin.value) {
      // Admin: All bookings
      return bookingStore.bookings;
    } else if (isOwner.value) {
      // Owner: Only their bookings
      const map = new Map<string, Booking>();
      bookingStore.bookings.forEach((booking, id) => {
        if (booking.owner_id === currentOwnerId.value) {
          map.set(id, booking);
        }
      });
      return map;
    }
    return new Map<string, Booking>();
  });

  return {
    propertiesForRole,
    bookingsForRole,
    isOwner,
    isAdmin
  };
};
```

### **Event Handler Pattern**

```typescript
// Smart orchestrator using role-based event handling
export default {
  setup() {
    const { isOwner, isAdmin, propertiesForRole } = useRoleBasedData();

    // Role-specific event handlers
    const handlePropertyEdit = (propertyId: string) => {
      if (isOwner.value) {
        // Owner: Verify ownership
        if (propertiesForRole.value.has(propertyId)) {
          openOwnerPropertyForm(propertyId);
        } else {
          showErrorMessage("You can only edit your own properties");
        }
      } else if (isAdmin.value) {
        // Admin: Can edit any property
        openAdminPropertyForm(propertyId);
      }
    };

    const handlePropertyDelete = (propertyId: string) => {
      if (isOwner.value) {
        // Owner: Simple confirmation
        showConfirmation({
          title: "Delete Property",
          message: "Are you sure you want to delete this property?",
          onConfirm: () => deleteProperty(propertyId)
        });
      } else if (isAdmin.value) {
        // Admin: Business impact warning
        showConfirmation({
          title: "Delete Property - Admin Action",
          message: "This will delete the property and affect the owner's account. Are you sure?",
          dangerous: true,
          onConfirm: () => adminDeleteProperty(propertyId)
        });
      }
    };

    return {
      handlePropertyEdit,
      handlePropertyDelete,
      propertiesForRole
    };
  }
};
```

---

## **🎨 UI Adaptation Patterns**

### **Role-Adaptive Error Messages**

```typescript
// utils/roleAdaptiveMessages.ts
export const getErrorMessage = (error: string, userRole: 'owner' | 'admin') => {
  const messages = {
    CONNECTION_ERROR: {
      owner: {
        title: "Connection Issue",
        message: "We're having trouble connecting. Please try again in a moment.",
        action: "Try Again"
      },
      admin: {
        title: "Database Connection Failed",
        message: "Database connection timeout. Check server status and network connectivity.",
        action: "Retry Connection"
      }
    },
    BOOKING_CREATE_ERROR: {
      owner: {
        title: "Booking Not Created",
        message: "We couldn't schedule your cleaning. Please check your information and try again.",
        action: "Try Again"
      },
      admin: {
        title: "Booking Creation Failed",
        message: "Booking creation failed. This may affect revenue targets. Check logs for details.",
        action: "Retry & Check Logs"
      }
    }
  };

  return messages[error]?.[userRole] || messages[error]?.owner;
};

// Usage in components
const showError = (error: string) => {
  const errorMessage = getErrorMessage(error, authStore.user.role);
  
  uiStore.showAlert({
    type: 'error',
    title: errorMessage.title,
    message: errorMessage.message,
    actions: [{ text: errorMessage.action, action: handleRetry }]
  });
};
```

### **Role-Adaptive Navigation**

```typescript
// composables/useRoleBasedNavigation.ts
export const useRoleBasedNavigation = () => {
  const authStore = useAuthStore();
  const router = useRouter();

  const navigateToBooking = (bookingId: string) => {
    if (authStore.user?.role === 'owner') {
      // Owner: Navigate to simple booking view
      router.push(`/owner/bookings/${bookingId}`);
    } else if (authStore.user?.role === 'admin') {
      // Admin: Navigate to full booking management
      router.push(`/admin/bookings/${bookingId}/manage`);
    }
  };

  const navigateToProperty = (propertyId: string) => {
    if (authStore.user?.role === 'owner') {
      router.push(`/owner/properties/${propertyId}`);
    } else if (authStore.user?.role === 'admin') {
      router.push(`/admin/properties/${propertyId}/overview`);
    }
  };

  return {
    navigateToBooking,
    navigateToProperty
  };
};
```

---

## **🔄 Cross-Role Data Updates**

### **Real-Time Synchronization Pattern**

```typescript
// composables/useCrossRoleUpdates.ts
export const useCrossRoleUpdates = () => {
  const propertyStore = usePropertyStore();
  const bookingStore = useBookingStore();
  const authStore = useAuthStore();

  // Handle cross-role data updates
  const handleBookingUpdate = (updatedBooking: Booking) => {
    // Update affects both owner and admin views
    bookingStore.updateBooking(updatedBooking);

    // Notify relevant users
    if (authStore.user?.role === 'admin') {
      // Admin updated booking - notify property owner
      notifyPropertyOwner(updatedBooking.owner_id, {
        type: 'booking_updated',
        message: 'Your booking has been updated by the cleaning service',
        bookingId: updatedBooking.id
      });
    } else if (authStore.user?.role === 'owner') {
      // Owner updated booking - notify admin for business tracking
      notifyAdmin({
        type: 'owner_booking_update',
        message: `Owner ${authStore.user.name} updated booking ${updatedBooking.id}`,
        bookingId: updatedBooking.id,
        ownerId: authStore.user.id
      });
    }
  };

  return {
    handleBookingUpdate
  };
};
```

### **Data Consistency Pattern**

```typescript
// stores/shared/dataSync.ts
export const useDataSync = () => {
  const propertyStore = usePropertyStore();
  const bookingStore = useBookingStore();

  // Ensure data consistency across role-based views
  const syncPropertyUpdate = (property: Property) => {
    // Update in store
    propertyStore.updateProperty(property);

    // Invalidate related cached data
    bookingStore.invalidatePropertyBookings(property.id);

    // Update UI state for all affected components
    const affectedBookings = bookingStore.getBookingsByProperty(property.id);
    affectedBookings.forEach(booking => {
      // Trigger reactivity for all components showing this booking
      bookingStore.triggerBookingUpdate(booking.id);
    });
  };

  return {
    syncPropertyUpdate
  };
};
```

---

## **🧪 Testing Cross-Role Integration**

### **Integration Testing Pattern**

```typescript
// tests/integration/role-based-integration.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createTestUser, createTestProperty, createTestBooking } from '../helpers/testData';

describe('Role-Based Component Integration', () => {
  let ownerUser, adminUser, testProperty, testBooking;

  beforeEach(() => {
    ownerUser = createTestUser('owner');
    adminUser = createTestUser('admin');
    testProperty = createTestProperty(ownerUser.id);
    testBooking = createTestBooking(testProperty.id, ownerUser.id);
  });

  it('should show role-appropriate data scoping', async () => {
    // Test owner view
    const ownerWrapper = mount(HomeOwner, {
      global: {
        provide: {
          authStore: { user: ownerUser }
        }
      }
    });

    // Owner should only see their properties
    const ownerProperties = ownerWrapper.vm.ownerPropertiesMap;
    expect(ownerProperties.size).toBe(1);
    expect(ownerProperties.has(testProperty.id)).toBe(true);

    // Test admin view
    const adminWrapper = mount(HomeAdmin, {
      global: {
        provide: {
          authStore: { user: adminUser }
        }
      }
    });

    // Admin should see all properties
    const adminProperties = adminWrapper.vm.allPropertiesMap;
    expect(adminProperties.size).toBeGreaterThanOrEqual(1);
    expect(adminProperties.has(testProperty.id)).toBe(true);
  });

  it('should handle cross-role data updates correctly', async () => {
    // Admin updates booking
    const updatedBooking = { ...testBooking, status: 'completed' };
    
    await bookingStore.updateBooking(updatedBooking);

    // Owner should see the update
    const ownerBookings = useOwnerBookings();
    expect(ownerBookings.myBookings.value.get(testBooking.id).status).toBe('completed');

    // Admin should see the update
    const adminBookings = useAdminBookings();
    expect(adminBookings.allBookings.value.get(testBooking.id).status).toBe('completed');
  });

  it('should use role-appropriate error messaging', async () => {
    const connectionError = 'CONNECTION_ERROR';

    // Owner error
    const ownerMessage = getErrorMessage(connectionError, 'owner');
    expect(ownerMessage.title).toBe('Connection Issue');
    expect(ownerMessage.message).toContain('try again');

    // Admin error
    const adminMessage = getErrorMessage(connectionError, 'admin');
    expect(adminMessage.title).toBe('Database Connection Failed');
    expect(adminMessage.message).toContain('server status');
  });
});
```

---

## **📚 Best Practices**

### **✅ DO: Role-Based Component Design**

```typescript
// ✅ CORRECT: Separate components for different roles
<OwnerBookingForm v-if="isOwner" />
<AdminBookingForm v-if="isAdmin" />

// ✅ CORRECT: Role-specific data scoping
const dataForCurrentRole = computed(() => {
  return isAdmin.value ? allData.value : ownerFilteredData.value;
});

// ✅ CORRECT: Role-appropriate event handling
const handleAction = (id: string) => {
  if (isOwner.value) {
    handleOwnerAction(id);
  } else if (isAdmin.value) {
    handleAdminAction(id);
  }
};
```

### **❌ DON'T: Generic Components with Role Props**

```typescript
// ❌ WRONG: Single component with role switching
<BookingForm :userRole="currentRole" :showAdminFeatures="isAdmin" />

// ❌ WRONG: Role checking inside shared components
// (This should be handled by parent orchestrators)
<template>
  <div>
    <AdminFeatures v-if="userRole === 'admin'" />
    <OwnerFeatures v-if="userRole === 'owner'" />
  </div>
</template>

// ❌ WRONG: Data filtering inside shared components
const filteredData = computed(() => {
  if (props.userRole === 'owner') {
    return data.filter(item => item.owner_id === currentUserId);
  }
  return data;
});
```

### **✅ DO: Proper Data Scoping**

```typescript
// ✅ CORRECT: Data scoping in smart components
// HomeOwner.vue
const ownerBookings = computed(() => 
  allBookings.value.filter(b => b.owner_id === currentUserId.value)
);

// HomeAdmin.vue  
const adminBookings = computed(() => allBookings.value);

// Pass appropriately scoped data to shared components
<TurnAlerts :turns="ownerBookings" />     // Owner sees only their turns
<TurnAlerts :turns="adminBookings" />     // Admin sees all turns
```

---

## **🎯 Key Integration Principles**

1. **Separation of Concerns**: Role logic in smart components, presentation logic in dumb components
2. **Data Scoping**: Filter data before passing to shared components, not within them
3. **Event Handling**: Role-specific business logic in parent orchestrators
4. **UI Adaptation**: Role-appropriate messaging and navigation patterns
5. **Testing**: Comprehensive integration testing across roles

**Integration Goal**: *"Same components, different data scope and business logic, seamless user experience."* 