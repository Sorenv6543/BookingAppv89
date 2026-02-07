# **BookingApp v89 - Testing Procedures**

> **Role-Based Testing & Quality Assurance**  
> Multi-Tenant Architecture Testing Guide

---

## **🎯 Testing Overview**

This document outlines testing procedures for our role-based booking system, ensuring proper data isolation, feature separation, and multi-tenant functionality.

### **Testing Scope**
- **Role-Based Data Isolation**: Owner vs Admin access control
- **Component Integration**: Shared and role-specific components
- **Business Logic**: Turn prioritization and booking workflows
- **Security Testing**: Frontend filtering and access controls
- **Performance Testing**: Role-specific load optimization

---

## **🧪 Pre-Deployment Testing**

### **1. Build Verification Testing**

#### **All Build Modes**
```bash
# Test all deployment modes
pnpm run build:production     # Full multi-tenant build
pnpm run build:owner-only     # Owner interface only
pnpm run build:admin-only     # Admin interface only
pnpm run build:fast           # Development build
```

#### **Build Validation Checklist**
- [ ] All builds complete without errors
- [ ] No TypeScript compilation errors in production code
- [ ] Bundle sizes within expected ranges:
  - Production: ~1.5MB total
  - Owner-only: ~800KB total  
  - Admin-only: ~1.1MB total
- [ ] Role-based chunks properly generated
- [ ] Source maps generated correctly for development

#### **Bundle Analysis**
```bash
# Analyze bundle composition
pnpm run analyze:bundle

# Expected chunks verification:
# ✅ admin-components.js (169KB)
# ✅ owner-components.js (59KB)  
# ✅ shared-ui.js (84KB)
# ✅ admin-logic.js (54KB)
# ✅ owner-logic.js (19KB)
# ✅ shared-logic.js (33KB)
```

---

### **2. Unit Testing**

#### **Run Test Suite**
```bash
# Run all tests
pnpm run test

# Run with coverage
pnpm run test:coverage

# Watch mode for development
pnpm run test:watch
```

#### **Test Coverage Requirements**
- **Overall Coverage**: 80%+ for production code
- **Role-Specific Logic**: 90%+ for owner/admin composables
- **Business Logic**: 95%+ for utils/businessLogic.ts
- **Shared Components**: 85%+ for dumb/shared components

#### **Critical Test Categories**
```bash
# Store tests (data management)
src/__tests__/stores/
├── booking.spec.ts      # Booking CRUD operations
├── property.spec.ts     # Property management
├── user.spec.ts         # User authentication  
└── ui.spec.ts           # UI state management

# Business logic tests (role-specific)
src/__tests__/utils/
└── businessLogic.spec.ts # Turn prioritization, conflicts
```

---

### **3. Role-Based Data Isolation Testing**

#### **Owner Interface Testing**

**Data Filtering Verification**
```typescript
// Test owner data isolation
describe('Owner Data Access', () => {
  test('useOwnerBookings returns only current user bookings', () => {
    const { myBookings } = useOwnerBookings()
    expect(myBookings.value.every(b => b.owner_id === currentUser.id)).toBe(true)
  })
  
  test('useOwnerProperties returns only user properties', () => {
    const { myProperties } = useOwnerProperties()
    expect(myProperties.value.every(p => p.owner_id === currentUser.id)).toBe(true)
  })
})
```

**Owner Interface Components**
- [ ] HomeOwner.vue displays only user's data
- [ ] OwnerSidebar.vue shows personal navigation
- [ ] OwnerCalendar.vue filters to user's bookings
- [ ] OwnerBookingForm.vue restricts property selection
- [ ] TurnAlerts.vue shows only user's urgent turns

#### **Admin Interface Testing**

**System-Wide Data Access**
```typescript
// Test admin data access
describe('Admin Data Access', () => {
  test('useAdminBookings returns all system bookings', () => {
    const { allBookings } = useAdminBookings()
    expect(allBookings.value.length).toBeGreaterThan(userBookings.length)
  })
  
  test('useAdminProperties returns all properties', () => {
    const { allProperties } = useAdminProperties()
    expect(allProperties.value.length).toBe(totalSystemProperties)
  })
})
```

**Admin Interface Components**
- [ ] HomeAdmin.vue displays system-wide dashboard
- [ ] AdminSidebar.vue shows business management nav
- [ ] AdminCalendar.vue displays all bookings
- [ ] AdminBookingForm.vue allows cleaner assignment
- [ ] CleanerAssignmentModal.vue functions correctly
- [ ] TurnPriorityPanel.vue shows all system turns

---

### **4. Cross-Role Integration Testing**

#### **Data Synchronization**
```typescript
// Test cross-role updates
describe('Cross-Role Data Sync', () => {
  test('Owner booking creation visible to admin', async () => {
    // Owner creates booking
    const booking = await createBookingAsOwner(ownerData)
    
    // Admin should see the booking
    const adminBookings = await getAdminBookings()
    expect(adminBookings).toContainEqual(booking)
  })
  
  test('Admin cleaner assignment visible to owner', async () => {
    // Admin assigns cleaner
    await assignCleanerAsAdmin(bookingId, cleanerId)
    
    // Owner should see assigned cleaner
    const ownerBooking = await getOwnerBooking(bookingId)
    expect(ownerBooking.assigned_cleaner_id).toBe(cleanerId)
  })
})
```

#### **Real-Time Updates Testing**
- [ ] Owner booking changes reflect in admin interface
- [ ] Admin cleaner assignments update owner view
- [ ] Turn alerts update across both interfaces
- [ ] Property status changes sync correctly

---

### **5. Business Logic Testing**

#### **Turn Prioritization**
```typescript
// Test turn vs standard booking logic
describe('Turn Business Logic', () => {
  test('Same-day bookings marked as turns', () => {
    const booking = createSameDayBooking()
    expect(booking.booking_type).toBe('turn')
    expect(booking.priority).toBe('urgent')
  })
  
  test('Owner turn alerts show only user turns', () => {
    const alerts = getOwnerTurnAlerts(userId)
    expect(alerts.every(t => t.owner_id === userId)).toBe(true)
  })
  
  test('Admin turn alerts show all system turns', () => {
    const alerts = getSystemTurnAlerts()
    expect(alerts.length).toBeGreaterThanOrEqual(userTurnAlerts.length)
  })
})
```

#### **Conflict Detection**
- [ ] Booking conflicts detected correctly
- [ ] Turn scheduling validates availability
- [ ] Cleaner assignment prevents double-booking
- [ ] Property availability calculated properly

---

### **6. Security Testing**

#### **Frontend Access Control**
```typescript
// Test role-based access restrictions
describe('Security & Access Control', () => {
  test('Owner cannot access admin routes', () => {
    // Navigate to admin route as owner
    expect(() => navigateToAdmin()).toThrow('Access denied')
  })
  
  test('Admin can access all system features', () => {
    const features = getAvailableFeatures('admin')
    expect(features).toContain('cleaner_management')
    expect(features).toContain('system_reports')
  })
})
```

#### **Data Boundary Testing**
- [ ] Owner cannot see other users' data
- [ ] Admin access to all data verified
- [ ] Route guards function correctly
- [ ] Component props properly scoped
- [ ] API calls include proper filtering

---

## **🚀 Deployment Testing**

### **1. Local Deployment Testing**

#### **Production Build Testing**
```bash
# Build and test production locally
pnpm run build:production
pnpm run preview

# Test at: http://localhost:4173
```

**Production Build Checklist**
- [ ] Application loads without console errors
- [ ] Both owner and admin interfaces accessible
- [ ] Role-based routing works correctly
- [ ] Production optimizations active (minification, etc.)
- [ ] No development tools or demos accessible

#### **Role-Specific Build Testing**
```bash
# Test owner-only build
pnpm run build:owner-only
pnpm run preview

# Verify:
# ✅ Owner interface loads correctly
# ❌ Admin routes return 404
# ❌ Admin components not included in bundle
```

```bash
# Test admin-only build  
pnpm run build:admin-only
pnpm run preview

# Verify:
# ✅ Admin interface loads correctly
# ❌ Owner routes return 404  
# ❌ Owner components not included in bundle
```

---

### **2. Environment Testing**

#### **Development Environment**
```bash
# Test development environment
pnpm run dev

# Verify development features:
# ✅ Hot module replacement works
# ✅ Demo components accessible at /dev/demos
# ✅ Source maps available for debugging
# ✅ Development error overlays functional
```

#### **Staging Environment**
```bash
# Test staging build
NODE_ENV=staging pnpm run build
pnpm run preview

# Verify staging features:
# ✅ Production-like optimization
# ✅ Demo components available for testing
# ✅ Source maps available for debugging
# ❌ Development-specific tools disabled
```

---

### **3. Performance Testing**

#### **Lighthouse Testing**
```bash
# Run Lighthouse against production build
pnpm run build:production
pnpm run preview

# Test URLs:
# - http://localhost:4173/ (landing page)
# - http://localhost:4173/owner/dashboard (owner interface)
# - http://localhost:4173/admin/ (admin interface)
```

**Performance Targets**
- **Performance Score**: 90+
- **Accessibility Score**: 95+
- **Best Practices Score**: 95+
- **SEO Score**: 90+

#### **Bundle Size Testing**
```bash
# Analyze bundle sizes
pnpm run analyze:bundle

# Verify size targets:
# Production (full): < 1.5MB uncompressed
# Owner-only: < 800KB uncompressed
# Admin-only: < 1.1MB uncompressed
# Gzip compression: ~70% reduction
```

#### **Load Time Testing**
- [ ] Initial page load < 3 seconds
- [ ] Role-specific interface loads < 2 seconds
- [ ] Shared components lazy-load correctly
- [ ] Calendar components render < 1 second

---

## **🧪 Manual Testing Scenarios**

### **Owner User Journey**
1. **Login as Property Owner**
   - [ ] Login form works correctly
   - [ ] Redirects to owner dashboard
   - [ ] Personal data loads correctly

2. **Property Management**
   - [ ] View personal properties only
   - [ ] Add new property successfully
   - [ ] Edit property details
   - [ ] Cannot see other owners' properties

3. **Booking Management**
   - [ ] Create new booking for owned property
   - [ ] View personal bookings in calendar
   - [ ] Edit booking details
   - [ ] See turn alerts for urgent bookings
   - [ ] Cannot access cleaner assignment

4. **Turn Scenarios**
   - [ ] Same-day booking automatically marked as turn
   - [ ] Turn alerts appear for urgent bookings
   - [ ] Priority calculation works correctly

### **Admin User Journey**
1. **Login as Business Admin**
   - [ ] Login form works correctly
   - [ ] Redirects to admin dashboard
   - [ ] System-wide data loads correctly

2. **System Management**
   - [ ] View all properties across all owners
   - [ ] View all bookings system-wide
   - [ ] Access cleaner management features
   - [ ] System turn alerts show all urgent bookings

3. **Cleaner Assignment**
   - [ ] Open cleaner assignment modal
   - [ ] View available cleaners
   - [ ] Filter cleaners by availability/skills
   - [ ] Assign cleaner to booking
   - [ ] Auto-assign functionality works

4. **Business Operations**
   - [ ] Master calendar shows all bookings
   - [ ] Turn priority panel displays correctly
   - [ ] Admin quick actions functional
   - [ ] Business analytics accessible

---

## **📊 Testing Metrics & KPIs**

### **Code Quality Metrics**
- **Test Coverage**: 80%+ overall, 90%+ for critical paths
- **TypeScript Compliance**: 0 errors in production code
- **Linter Compliance**: 0 warnings in production code
- **Bundle Size**: Within defined targets per deployment mode

### **Performance Metrics**
- **Build Time**: < 30 seconds for production build
- **Test Execution Time**: < 2 minutes for full suite
- **Page Load Speed**: < 3 seconds initial load
- **Memory Usage**: < 100MB for typical user session

### **Functional Metrics**
- **Role Isolation**: 100% data properly scoped
- **Cross-Role Sync**: Real-time updates < 1 second
- **Error Rate**: < 1% in production scenarios
- **Feature Coverage**: 100% of documented features tested

---

## **🚨 Testing Alerts & Monitoring**

### **Automated Testing Alerts**
- [ ] Test failures in CI/CD pipeline
- [ ] Coverage drops below thresholds
- [ ] Performance regression detected
- [ ] Bundle size exceeds limits

### **Production Monitoring**
- [ ] Error tracking for role-specific features
- [ ] Performance monitoring for different user types
- [ ] User behavior analytics (owner vs admin usage)
- [ ] Real-time error alerts and notifications

---

## **📋 Testing Checklist**

### **Pre-Deployment Checklist**
- [ ] All unit tests pass
- [ ] Role-based data isolation verified
- [ ] Cross-role integration tested
- [ ] Security access controls validated
- [ ] Performance targets met
- [ ] All deployment modes tested
- [ ] Manual user journeys completed
- [ ] Production build deployed and verified

### **Post-Deployment Verification**
- [ ] Production application loads correctly
- [ ] Role-based routing functional
- [ ] Data persistence working
- [ ] Real-time updates functioning
- [ ] Error monitoring active
- [ ] Performance within acceptable ranges

---

**Last Updated**: December 2024  
**Testing Framework**: Vitest + Vue Test Utils + TypeScript 

## **📊 Testing Commands**

```bash
# Run all tests
pnpm run test

# Run with coverage
pnpm run test:coverage

# Test specific areas
pnpm run test stores/        # Store tests
pnpm run test components/    # Component tests
pnpm run test utils/         # Business logic tests
``` 