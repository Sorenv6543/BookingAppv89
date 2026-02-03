# **Shared Components API Documentation**

> **API Reference for Reusable Components**  
> Used across both Owner and Admin interfaces with role-appropriate data scoping

---

## **📋 Overview**

Shared components are reusable UI elements that work consistently across both Owner and Admin interfaces. They follow a **data-agnostic** design pattern where the parent component determines the data scope (owner-filtered vs system-wide), and the shared component focuses purely on presentation and interaction.

### **Key Design Principles**
- ✅ **Role-agnostic**: Same component, different data scope
- ✅ **TypeScript interfaces**: Strongly typed props and events  
- ✅ **Map-based data**: Optimized for `Map<string, T>` structures
- ✅ **Event-driven**: Emit events for parent handling
- ✅ **Mobile-optimized**: Responsive design patterns

---

## **🏠 Property Components**

### **PropertyCard.vue**

**Purpose**: Display property information with role-appropriate actions

**Location**: `src/components/dumb/shared/PropertyCard.vue`

#### **Props Interface**
```typescript
interface Props {
  property: Property;           // Property data object
  displayActions?: boolean;     // Show edit/delete buttons (default: true)
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'edit', id: string): void;    // Edit property action
  (e: 'delete', id: string): void;  // Delete property action  
  (e: 'view', id: string): void;    // View property details
}
```

#### **Property Data Structure**
```typescript
interface Property {
  id: string;
  name: string;
  address: string;
  owner_id: string;
  active: boolean;
  cleaning_duration: number;     // In minutes
  pricing_tier: 'basic' | 'standard' | 'premium' | 'luxury';
  special_instructions?: string;
}
```

#### **Usage Examples**

**Owner Usage** (filtered data):
```vue
<PropertyCard 
  :property="userProperty"
  @edit="handleEditProperty"
  @delete="handleDeleteProperty"
  @view="handleViewProperty"
/>
```

**Admin Usage** (all data):
```vue
<PropertyCard 
  :property="anyProperty"
  @edit="handleAdminEditProperty"
  @delete="handleAdminDeleteProperty"  
  @view="handleAdminViewProperty"
/>
```

#### **Visual Features**
- ✅ Pricing tier color coding
- ✅ Active/inactive status indicators
- ✅ Cleaning duration formatting (minutes → hours/minutes)
- ✅ Special instructions tooltip
- ✅ Hover animations and mobile touch feedback

---

## **📅 Booking & Calendar Components**

### **TurnAlerts.vue**

**Purpose**: Display urgent turn bookings requiring immediate attention

**Location**: `src/components/dumb/shared/TurnAlerts.vue`

#### **Props Interface**
```typescript
interface Props {
  turns: Map<string, Booking>;    // Turn bookings (filtered by role)
  loading?: boolean;              // Loading state (default: false)
  compact?: boolean;              // Compact display mode (default: false)
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'navigate-to', bookingId: string): void;     // Navigate to booking
  (e: 'assign-cleaner', bookingId: string): void;  // Admin: assign cleaner
  (e: 'mark-urgent', bookingId: string): void;     // Mark as urgent priority
}
```

#### **Turn Data Structure**
```typescript
interface Booking {
  id: string;
  property_id: string;
  owner_id: string;
  checkout_date: string;    // ISO date string
  checkin_date: string;     // ISO date string
  booking_type: 'turn' | 'standard';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  priority?: 'normal' | 'high' | 'urgent';
  assigned_cleaner_id?: string;
}
```

#### **Usage Examples**

**Owner Usage** (personal turns only):
```vue
<TurnAlerts 
  :turns="ownerTodayTurns"
  @navigate-to="handleNavigateToBooking"
  @mark-urgent="handleMarkUrgent"
/>
```

**Admin Usage** (system-wide turns):
```vue
<TurnAlerts 
  :turns="systemTodayTurns"
  @navigate-to="handleAdminNavigateToBooking"
  @assign-cleaner="handleAssignCleaner"
  @mark-urgent="handleAdminMarkUrgent"
/>
```

#### **Visual Features**
- 🚨 **Urgent indicators**: Red alerts for same-day turns
- ⏰ **Time remaining**: Countdown to checkout/checkin
- 🏠 **Property context**: Property name and address
- 👤 **Owner information**: Owner name (admin view only)
- 🧹 **Cleaner status**: Assigned/unassigned indicators

---

### **TurnPriorityBadge.vue**

**Purpose**: Visual priority indicator for bookings

**Location**: `src/components/dumb/shared/TurnPriorityBadge.vue`

#### **Props Interface**
```typescript
interface Props {
  priority: 'normal' | 'high' | 'urgent';
  size?: 'x-small' | 'small' | 'default' | 'large';
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined';
}
```

#### **Usage Examples**
```vue
<TurnPriorityBadge :priority="booking.priority" size="small" />
```

#### **Visual Features**
- 🟢 **Normal**: Green badge
- 🟡 **High**: Yellow/orange badge  
- 🔴 **Urgent**: Red badge with pulse animation

---

### **UpcomingCleanings.vue**

**Purpose**: Display upcoming cleaning schedule

**Location**: `src/components/dumb/shared/UpcomingCleanings.vue`

#### **Props Interface**
```typescript
interface Props {
  cleanings: Map<string, Booking>;    // Upcoming bookings (role-filtered)
  properties: Map<string, Property>;  // Property data for context
  timeframe?: number;                 // Days ahead to show (default: 7)
  groupByDate?: boolean;              // Group cleanings by date (default: true)
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'navigate-to-booking', bookingId: string): void;
  (e: 'navigate-to-date', date: string): void;
  (e: 'quick-edit', bookingId: string): void;
}
```

#### **Usage Examples**

**Owner Usage**:
```vue
<UpcomingCleanings 
  :cleanings="ownerUpcomingCleanings"
  :properties="ownerPropertiesMap"
  :timeframe="14"
  @navigate-to-booking="handleNavigateToBooking"
  @navigate-to-date="handleNavigateToDate"
/>
```

**Admin Usage**:
```vue
<UpcomingCleanings 
  :cleanings="systemUpcomingCleanings"
  :properties="allPropertiesMap"
  :timeframe="7"
  @navigate-to-booking="handleAdminNavigateToBooking"
  @navigate-to-date="handleAdminNavigateToDate"
  @quick-edit="handleAdminQuickEdit"
/>
```

---

## **🔄 UI State Components**

### **LoadingSpinner.vue**

**Purpose**: Consistent loading state indicator

**Location**: `src/components/dumb/shared/LoadingSpinner.vue`

#### **Props Interface**
```typescript
interface Props {
  size?: number;              // Spinner size in pixels (default: 40)
  color?: string;             // Spinner color (default: 'primary')
  message?: string;           // Loading message text
  overlay?: boolean;          // Show overlay background (default: false)
}
```

#### **Usage Examples**
```vue
<LoadingSpinner 
  :size="60" 
  color="primary" 
  message="Loading your properties..." 
  :overlay="true" 
/>
```

---

### **ErrorAlert.vue**

**Purpose**: Role-appropriate error messaging

**Location**: `src/components/dumb/shared/ErrorAlert.vue`

#### **Props Interface**
```typescript
interface Props {
  title?: string;             // Error title
  message: string;            // Error message
  type?: 'error' | 'warning' | 'info';
  variant?: 'tonal' | 'outlined' | 'elevated';
  dismissible?: boolean;      // Show close button (default: true)
  actions?: ErrorAction[];    // Action buttons
}

interface ErrorAction {
  text: string;
  color?: string;
  action: () => void;
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'dismiss'): void;       // Error dismissed
  (e: 'retry'): void;         // Retry action triggered
}
```

#### **Usage Examples**

**Owner Error** (encouraging messaging):
```vue
<ErrorAlert 
  title="Oops! Something went wrong"
  message="We couldn't save your property. Please try again."
  type="error"
  :actions="[{ text: 'Try Again', color: 'primary', action: handleRetry }]"
  @dismiss="handleDismissError"
/>
```

**Admin Error** (technical messaging):
```vue
<ErrorAlert 
  title="System Error"
  message="Database connection failed. Check network status."
  type="error"
  :actions="[
    { text: 'Retry', color: 'primary', action: handleRetry },
    { text: 'Check Logs', color: 'secondary', action: handleCheckLogs }
  ]"
  @dismiss="handleDismissError"
/>
```

---

### **ConfirmationDialog.vue**

**Purpose**: Consistent confirmation modal for destructive actions

**Location**: `src/components/dumb/shared/ConfirmationDialog.vue`

#### **Props Interface**
```typescript
interface Props {
  open: boolean;              // Dialog visibility
  title: string;              // Dialog title
  message: string;            // Confirmation message
  confirmText?: string;       // Confirm button text (default: 'Confirm')
  cancelText?: string;        // Cancel button text (default: 'Cancel')
  dangerous?: boolean;        // Red confirm button for destructive actions
  loading?: boolean;          // Loading state for confirm button
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'confirm'): void;       // User confirmed action
  (e: 'cancel'): void;        // User cancelled action
  (e: 'close'): void;         // Dialog closed (ESC key, etc.)
}
```

#### **Usage Examples**

**Owner Confirmation**:
```vue
<ConfirmationDialog 
  :open="confirmDeleteOpen"
  title="Delete Property"
  message="Are you sure you want to delete this property? This action cannot be undone."
  confirm-text="Delete Property"
  cancel-text="Keep Property"
  :dangerous="true"
  @confirm="handleConfirmDelete"
  @cancel="handleCancelDelete"
/>
```

**Admin Confirmation**:
```vue
<ConfirmationDialog 
  :open="confirmBulkDeleteOpen"
  title="Bulk Delete Bookings"
  message="Delete 15 bookings? This will affect multiple property owners."
  confirm-text="Delete All"
  cancel-text="Cancel"
  :dangerous="true"
  :loading="bulkDeleteLoading"
  @confirm="handleConfirmBulkDelete"
  @cancel="handleCancelBulkDelete"
/>
```

---

## **📱 PWA Components**

### **PWAStatusCard.vue**

**Purpose**: PWA installation and status display

**Location**: `src/components/dumb/shared/PWAStatusCard.vue`

#### **Props Interface**
```typescript
interface Props {
  installable: boolean;       // PWA can be installed
  installed: boolean;         // PWA is already installed
  updateAvailable: boolean;   // Update is available
  compact?: boolean;          // Compact display mode
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'install'): void;       // Install PWA
  (e: 'update'): void;        // Update PWA
  (e: 'dismiss'): void;       // Dismiss notification
}
```

### **PWANotificationsEnhanced.vue**

**Purpose**: Enhanced PWA notification management

**Location**: `src/components/dumb/shared/PWANotificationsEnhanced.vue`

#### **Props Interface**
```typescript
interface Props {
  notificationsEnabled: boolean;
  pushSupported: boolean;
  userRole: 'owner' | 'admin';    // Role-specific notification settings
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'enable-notifications'): void;
  (e: 'disable-notifications'): void;
  (e: 'configure-preferences'): void;
}
```

---

## **🎨 Design System Components**

### **ThemePicker.vue**

**Purpose**: Theme and appearance customization

**Location**: `src/components/dumb/shared/ThemePicker.vue`

#### **Props Interface**
```typescript
interface Props {
  currentTheme: 'light' | 'dark' | 'auto';
  availableThemes: string[];
  compact?: boolean;
}
```

#### **Events Interface**
```typescript
interface Emits {
  (e: 'theme-change', theme: string): void;
}
```

### **SkeletonLoader.vue**

**Purpose**: Loading state skeleton screens

**Location**: `src/components/dumb/shared/SkeletonLoader.vue`

#### **Props Interface**
```typescript
interface Props {
  type: 'card' | 'list' | 'table' | 'calendar';
  count?: number;             // Number of skeleton items (default: 3)
  height?: string;            // Custom height
  animated?: boolean;         // Animated loading effect (default: true)
}
```

---

## **🔗 Integration Patterns**

### **Role-Based Usage Pattern**

The key pattern for using shared components is **role-based data scoping**:

```typescript
// Owner Interface: Filtered data
const ownerData = computed(() => 
  allData.filter(item => item.owner_id === currentUser.id)
);

// Admin Interface: All data
const adminData = computed(() => allData);

// Same component, different scope
<SharedComponent :data="ownerData" />     // Owner sees personal data
<SharedComponent :data="adminData" />     // Admin sees all data
```

### **Event Handling Pattern**

All shared components emit events that parent components handle appropriately:

```typescript
// Owner handler: Personal actions
const handleOwnerAction = (id: string) => {
  // Verify ownership before action
  if (isOwnerResource(id)) {
    performAction(id);
  }
};

// Admin handler: System-wide actions
const handleAdminAction = (id: string) => {
  // Admin can act on any resource
  performSystemAction(id);
};
```

### **Error Message Adaptation**

Shared components adapt error messaging based on context:

```typescript
// Owner context: Encouraging, simple
const ownerErrorProps = {
  title: "Oops! Something went wrong",
  message: "Please try again or contact support if the problem continues."
};

// Admin context: Technical, actionable
const adminErrorProps = {
  title: "System Error - Action Required",
  message: "Database connection failed. Check server status and retry operation."
};
```

---

## **🧪 Testing Patterns**

### **Component Testing Template**

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SharedComponent from '@/components/dumb/shared/SharedComponent.vue';

describe('SharedComponent', () => {
  it('should render with owner data scope', () => {
    const wrapper = mount(SharedComponent, {
      props: {
        data: ownerFilteredData
      }
    });
    
    expect(wrapper.find('[data-testid="owner-data"]').exists()).toBe(true);
  });
  
  it('should render with admin data scope', () => {
    const wrapper = mount(SharedComponent, {
      props: {
        data: allSystemData
      }
    });
    
    expect(wrapper.find('[data-testid="admin-data"]').exists()).toBe(true);
  });
  
  it('should emit role-appropriate events', async () => {
    const wrapper = mount(SharedComponent);
    
    await wrapper.find('[data-testid="action-button"]').trigger('click');
    
    expect(wrapper.emitted('action')).toBeTruthy();
  });
});
```

---

## **📚 Next Steps**

- **Owner Components**: See `docs/api/owner-components.md`
- **Admin Components**: See `docs/api/admin-components.md`  
- **Role-Based Integration**: See `docs/api/role-based-integration.md`
- **Business Logic Reference**: See `docs/references/business_logic_reference.md`

---

**🎯 Key Takeaway**: Shared components are **data-agnostic presentation layers** that rely on parent components to provide appropriately scoped data and handle role-specific business logic. 