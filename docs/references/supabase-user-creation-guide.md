# **User Creation Guide - Supabase Authentication**

## 🎯 **Quick Test: Create New Users**

Your authentication system now uses **real Supabase authentication** instead of mock data. You can create unlimited new users!

### **1. Access Registration Forms**

Go to any of these pages to create new users:
- **Register**: `http://localhost:5173/auth/register`
- **Signup**: `http://localhost:5173/auth/signup`

### **2. User Creation Process**

```typescript
// What happens when you register:
1. Supabase creates user in auth.users table
2. Database trigger automatically creates user_profiles record  
3. User gets logged in and redirected based on their role
```

### **3. Test Different User Roles**

Create users with different roles to test the multi-tenant system:

**Property Owner (Default)**:
```
Email: owner1@test.com
Password: password123
Name: Test Owner 1
Role: Owner
Company: Test Properties Inc.
```

**Admin User**:
```
Email: admin@test.com  
Password: password123
Name: Test Admin
Role: Admin
```

**Cleaner**:
```
Email: cleaner1@test.com
Password: password123
Name: Test Cleaner
Role: Cleaner
```

## 🔧 **Environment Setup** (If Needed)

If you see Supabase connection errors, create a `.env` file:

```env
# Supabase Configuration
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=your-local-anon-key

# Or use your production Supabase instance:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

## 🧪 **Testing Checklist**

### **User Registration**
- [ ] Can create new owner users
- [ ] Can create new admin users  
- [ ] Can create new cleaner users
- [ ] Users get appropriate role-based interfaces
- [ ] Email validation works

### **Authentication Flow**
- [ ] New users can log in after registration
- [ ] Users see role-appropriate dashboard (Owner vs Admin)
- [ ] Logout works correctly
- [ ] Sessions persist on page refresh

### **Data Isolation** 
- [ ] Owners see only their own properties/bookings
- [ ] Admins see all system data
- [ ] Users can't access other owners' data

## 🚨 **Troubleshooting**

### **"Can't connect to Supabase"**
1. Check if `.env` file exists with correct Supabase URL
2. Verify Supabase instance is running (if using local)
3. Check browser console for specific connection errors

### **"User created but can't log in"**
1. Check if email confirmation is required (production instances)
2. Verify the database trigger created user_profiles record
3. Check Supabase auth dashboard for user status

### **"Can't see user data after login"**
1. Verify user_profiles record exists
2. Check RLS policies are allowing access
3. Ensure role is properly set in user_profiles

## 📊 **Database Verification**

To verify users are being created properly, check your Supabase dashboard:

1. **auth.users table**: Should show new users
2. **public.user_profiles table**: Should auto-create profiles via trigger  
3. **Real-time logs**: Should show successful authentication events

## 🎉 **Success Indicators**

You'll know it's working when:
- ✅ Registration forms accept new users without errors
- ✅ New users can immediately log in
- ✅ Users are redirected to role-appropriate interfaces
- ✅ Owner users see empty property/booking lists (ready to add data)
- ✅ Admin users see system-wide dashboard

---

**🚀 You now have real multi-tenant authentication with unlimited user creation!** 