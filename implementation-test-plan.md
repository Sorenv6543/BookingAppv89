# TASK-081 & TASK-082 Testing Plan
## **Multi-Tenant Authentication & Real-Time Sync Verification**

## 🎯 **Overview**

This comprehensive testing plan verifies that your multi-tenant authentication and real-time synchronization system is working correctly with database-level security.

---

## ✅ **Phase 1: Database & RLS Verification**

### **1.1 Test Database Schema**
```bash
# Check that all tables exist with RLS enabled
npm run dev
# Open browser console and run:
```

```javascript
// Test 1: Verify tables exist
const { data, error } = await supabase.from('user_profiles').select('count', { count: 'exact', head: true });
console.log('User profiles table:', data, error);

const { data: props } = await supabase.from('properties').select('count', { count: 'exact', head: true });
console.log('Properties table:', props);

const { data: bookings } = await supabase.from('bookings').select('count', { count: 'exact', head: true });
console.log('Bookings table:', bookings);
```

### **1.2 Test RLS Policies**
```javascript
// Test 2: Verify RLS is enabled (should fail without auth)
try {
  const { data, error } = await supabase.from('user_profiles').select('*');
  console.log('RLS Test - Should fail:', error); // Should get RLS error
} catch (err) {
  console.log('✅ RLS is working - unauthorized access blocked');
}
```

---

## 🔐 **Phase 2: Authentication Testing**

### **2.1 User Registration Test**

**Test Case 1: Owner Registration**
1. Navigate to `/auth/register`
2. Fill out form:
   - Email: `owner1@test.com`
   - Password: `TestPass123!`
   - Name: `John Owner`
   - Role: `Owner`
   - Company: `Test Properties LLC`
3. Submit form
4. **Expected**: Success message, email verification required

**Test Case 2: Admin Registration**
1. Use same form with:
   - Email: `admin@test.com`
   - Role: `Admin`
3. **Expected**: Success message

### **2.2 User Login Test**

**Test Case 3: Owner Login**
1. Navigate to `/auth/login`
2. Use `owner1@test.com` / `TestPass123!`
3. **Expected**: 
   - Successful login
   - Redirect to `/owner/dashboard`
   - Owner sidebar visible
   - Only owner-specific data shown

**Test Case 4: Admin Login**
1. Use `admin@test.com` credentials
2. **Expected**:
   - Redirect to `/admin`
   - Admin sidebar visible
   - System-wide data visible

### **2.3 Role-Based Route Protection**

**Test Case 5: Route Guards**
```javascript
// While logged in as owner, try to access admin routes
window.location.href = '/admin';
// Expected: Redirect back to /owner/dashboard

// While logged in as admin, try owner routes
window.location.href = '/owner/dashboard';
// Expected: Can access (admin has system-wide access)
```

---

## 🏠 **Phase 3: Data Isolation Testing**

### **3.1 Create Test Data**

**As Owner1:**
1. Create property: "Beach House" at "123 Ocean Ave"
2. Create booking: Standard booking for next week
3. **Expected**: Data appears in owner interface

**As Admin:**
1. Create property for Owner1: "Mountain Cabin"
2. Create booking assigned to cleaner
3. **Expected**: Admin can see all data, Owner1 sees only their data

### **3.2 Multi-Tenant Isolation Test**

**Register Second Owner:**
1. Register `owner2@test.com`
2. Login as Owner2
3. Create property: "City Apartment"
4. **Expected**: Owner2 sees only their property, not Owner1's

**Verify Isolation:**
```javascript
// In browser console as Owner1:
const { data } = await supabase.from('properties').select('*');
console.log('Owner1 properties:', data); // Should only see Owner1's properties

// Switch to Owner2 and check:
// Should only see Owner2's properties
```

---

## 🔄 **Phase 4: Real-Time Sync Testing**

### **4.1 Real-Time Connection Test**

```javascript
// Check real-time status in browser console
// (assuming you're using the useRealtimeSync composable)
const realtimeStatus = useRealtimeSync();
console.log('Connection status:', realtimeStatus.connectionStatus.value);
// Expected: 'connected'
```

### **4.2 Cross-User Real-Time Updates**

**Test Setup:**
1. Open two browser windows/tabs
2. Login as Owner1 in first tab
3. Login as Admin in second tab

**Test Case 6: Property Updates**
1. **Owner1 tab**: Create new property "Test Property"
2. **Admin tab**: Check if property appears in admin property list
3. **Expected**: Property appears immediately in admin view

**Test Case 7: Booking Updates**
1. **Admin tab**: Create booking for Owner1's property
2. **Owner1 tab**: Check if booking appears in owner bookings
3. **Expected**: Booking appears immediately in owner view

### **4.3 Role-Based Real-Time Filtering**

**Test Case 8: Data Isolation in Real-Time**
1. **Admin tab**: Create property for Owner1
2. **Owner2 tab**: Check properties list
3. **Expected**: Owner2 does NOT see Owner1's new property

---

## 📱 **Phase 5: Optimistic Updates Testing**

### **5.1 Optimistic Update Behavior**

**Test Case 9: Fast Updates**
1. Create booking as Owner1
2. Immediately edit the booking
3. **Expected**: 
   - UI updates instantly (optimistic)
   - No double-updates when server confirms
   - Real-time sync doesn't duplicate changes

### **5.2 Offline/Online Sync**

**Test Case 10: Network Resilience**
1. Disconnect network (dev tools → Network → Offline)
2. Try to create booking
3. Reconnect network
4. **Expected**: 
   - Operation queued while offline
   - Sync occurs when online
   - Data consistency maintained

---

## 🔧 **Phase 6: Performance Testing**

### **6.1 Load Testing**

**Test Case 11: Multiple Concurrent Users**
```javascript
// Simulate multiple users (run in different browser profiles)
// Create 5+ owners, each with 3-5 properties and 10+ bookings
// Monitor performance and memory usage
```

### **6.2 Real-Time Performance**

**Test Case 12: High-Frequency Updates**
1. Rapidly create/update bookings as admin
2. Monitor real-time updates in owner tabs
3. **Expected**: No performance degradation, updates remain responsive

---

## 🛡️ **Phase 7: Security Verification**

### **7.1 RLS Policy Testing**

```sql
-- Run these tests in Supabase SQL editor
-- Test 1: Verify owner isolation
SET ROLE authenticated;
SET request.jwt.claims TO '{"sub": "owner1-uuid", "role": "authenticated"}';
SELECT * FROM properties; -- Should only see owner1's properties

-- Test 2: Verify admin access
SET request.jwt.claims TO '{"sub": "admin-uuid", "role": "authenticated"}';
SELECT * FROM properties; -- Should see all properties
```

### **7.2 Client-Side Security**

**Test Case 13: Frontend Security**
```javascript
// Try to access unauthorized data via dev tools
const { data } = await supabase.from('user_profiles').select('*');
// Expected: Only returns current user's profile or all profiles if admin
```

---

## 📊 **Success Criteria**

### **TASK-081 Success Criteria:**
- ✅ Users can register with role assignment
- ✅ Email verification flow works
- ✅ Role-based routing protects routes
- ✅ Owners see only their data (RLS enforced)
- ✅ Admins see all data system-wide
- ✅ Profile management works correctly
- ✅ Route guards prevent unauthorized access

### **TASK-082 Success Criteria:**
- ✅ Real-time updates work across interfaces
- ✅ Role-based filtering applies to real-time events
- ✅ Optimistic updates prevent double-applying
- ✅ Network resilience handles offline/online transitions
- ✅ Performance remains optimal with multiple users
- ✅ No data leakage between tenants in real-time

---

## 🚨 **Troubleshooting Guide**

### **Common Issues:**

**1. RLS Policies Not Working**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

**2. Real-Time Not Connecting**
```javascript
// Check browser console for connection errors
// Verify Supabase URL and keys in .env.local
```

**3. Authentication Redirect Loop**
```javascript
// Clear browser local storage and cookies
localStorage.clear();
// Try login again
```

**4. Data Not Syncing**
```javascript
// Check real-time subscription status
console.log(realtimeSync.connectionStatus.value);
// Should be 'connected'
```

---

## 🎉 **Final Verification**

After completing all tests, you should have:

1. **✅ Production-ready multi-tenant authentication**
2. **✅ Database-level security with RLS**
3. **✅ Real-time data synchronization**
4. **✅ Role-based data access (Owner/Admin/Cleaner)**
5. **✅ Optimistic updates for better UX**
6. **✅ Network resilience and offline support**

**Your platform is now ready for production deployment with 30-40 property owners!** 🚀