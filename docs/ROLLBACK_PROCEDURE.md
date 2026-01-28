# Rollback Procedure for Migration 011

## Overview

This document provides step-by-step instructions for rolling back Migration 011 (booking date model changes) if critical issues are discovered in production.

**Migration 011 Changes:**
- Changed booking date constraint from `checkout_date < checkin_date` to `checkin_date < checkout_date`
- Swapped all existing booking dates to match the new model
- Created new `cleaning_tasks` table for operational work
- Added RLS policies for multi-tenant access control

**Rollback Impact:**
- All booking dates will be swapped back to the old "cleaning window" model
- The `cleaning_tasks` table and all its data will be permanently deleted
- Frontend code must be redeployed to use the old booking model

---

## When to Rollback

Execute this rollback **only** if you encounter:

1. **Data Corruption**
   - Booking dates showing incorrectly in the UI
   - Validation errors preventing booking creation
   - Incorrect calculation of cleaning windows or priorities

2. **Critical Production Bugs**
   - Users unable to create new bookings
   - Existing bookings displaying wrong check-in/check-out dates
   - Calendar view showing incorrect date ranges

3. **Failed Integration Tests**
   - Post-deployment smoke tests failing
   - API endpoints returning 500 errors
   - Database constraint violations

4. **User-Facing Errors**
   - Customer reports of incorrect booking dates
   - Cleaners unable to view their tasks
   - Admins unable to manage properties

**DO NOT rollback for:**
- Minor UI display issues that can be fixed with frontend patches
- Feature requests or enhancements
- Non-critical bugs that don't affect core booking functionality

---

## Pre-Rollback Checklist

Complete **all** of these steps before executing the rollback:

- [ ] **Stop All Booking Creation**: Enable maintenance mode or disable booking creation in production
- [ ] **Full Database Backup**: Create a complete database backup
  ```bash
  pg_dump -Fc -h <host> -U <user> -d <database> > backup_before_rollback_$(date +%Y%m%d_%H%M%S).dump
  ```
- [ ] **Export Critical Data**: Export affected tables to CSV for analysis
  ```sql
  COPY (SELECT * FROM bookings) TO '/tmp/bookings_before_rollback.csv' CSV HEADER;
  COPY (SELECT * FROM cleaning_tasks) TO '/tmp/cleaning_tasks_before_rollback.csv' CSV HEADER;
  ```
- [ ] **Document Affected Records**: Count and document affected bookings
  ```sql
  SELECT COUNT(*) FROM bookings;
  SELECT COUNT(*) FROM cleaning_tasks;
  ```
- [ ] **Notify Stakeholders**: Inform all stakeholders of the rollback plan
  - Product owner
  - Development team
  - Customer support team
  - End users (if customer-facing)
- [ ] **Verify Backup**: Test that backup file is valid and restorable
  ```bash
  pg_restore -l backup_before_rollback_*.dump | head -20
  ```
- [ ] **Prepare Frontend Rollback**: Have the previous frontend version ready to deploy
  ```bash
  git log --oneline --grep="011" | head -5
  # Identify the commit before migration 011 changes
  ```

---

## Rollback Steps

### Step 1: Apply Rollback Migration

Navigate to your Supabase project directory and run the rollback migration:

```bash
# Option A: Using Supabase CLI (recommended)
cd /path/to/project
supabase db push

# This will apply migration 012 if not already applied
```

**Alternative - Manual SQL Execution:**

If Supabase CLI is not available, manually execute the rollback:

```bash
# Connect to your database
psql -h <host> -U <user> -d <database>

# Execute the rollback migration
\i supabase/migrations/012_rollback_booking_date_model.sql
```

**Expected output:**
```
BEGIN
ALTER TABLE
UPDATE <n>  -- where n is the number of bookings updated
ALTER TABLE
ALTER TABLE
DROP TABLE
COMMENT
COMMENT
...
COMMIT
```

---

### Step 2: Verify Data Integrity

Run the verification queries included at the end of the rollback migration:

```sql
-- Check 1: Booking Date Order
SELECT 
  'Booking Date Order Check' AS check_name,
  COUNT(*) AS total_bookings,
  SUM(CASE WHEN checkout_date < checkin_date THEN 1 ELSE 0 END) AS valid_bookings,
  SUM(CASE WHEN checkout_date >= checkin_date THEN 1 ELSE 0 END) AS invalid_bookings
FROM public.bookings;
```

**Expected result:** `invalid_bookings` should be **0**

```sql
-- Check 2: Cleaning Tasks Table Removed
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'cleaning_tasks'
    ) THEN '✗ FAILED - Table still exists'
    ELSE '✓ PASSED - Table removed'
  END AS status;
```

**Expected result:** `✓ PASSED - Table removed`

```sql
-- Check 3: Constraint Validation
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'booking_dates_valid';
```

**Expected result:** 
```
booking_dates_valid | (checkout_date < checkin_date)
```

```sql
-- Check 4: Sample Data
SELECT 
  id, 
  property_id,
  checkout_date,
  checkin_date,
  CASE 
    WHEN checkout_date < checkin_date THEN '✓ Valid'
    ELSE '✗ INVALID'
  END AS validation_status
FROM public.bookings
ORDER BY checkout_date DESC
LIMIT 10;
```

**Expected result:** All rows should show `✓ Valid`

---

### Step 3: Fix Any Invalid Data

If verification checks show invalid bookings:

```sql
-- Find invalid bookings
SELECT id, property_id, checkout_date, checkin_date
FROM public.bookings
WHERE checkout_date >= checkin_date;

-- Manually swap dates for invalid bookings
UPDATE public.bookings
SET 
  checkin_date = checkout_date,
  checkout_date = checkin_date
WHERE checkout_date >= checkin_date;
```

---

### Step 4: Redeploy Frontend

Revert the frontend code to use the old booking model:

```bash
# Option A: Revert the PR (if not yet merged to main)
git revert <migration-011-commit-sha>

# Option B: Checkout the previous working version
git checkout <commit-before-migration-011>

# Rebuild and deploy
npm run build
# Deploy to your hosting service (Vercel, Netlify, etc.)
```

**Key frontend changes to verify:**
- Booking forms use `checkout_date < checkin_date` validation
- Calendar displays cleaning windows (not guest stays)
- Priority calculation based on checkout date (not checkin date)
- UI text reflects "cleaning window" terminology

---

### Step 5: Test in Staging

Before enabling production access, test in staging:

1. **Create a test booking:**
   - Checkout date: 2026-01-20
   - Checkin date: 2026-01-22
   - Verify it saves successfully

2. **View booking in UI:**
   - Verify dates display correctly
   - Verify calendar shows the correct range

3. **Update a booking:**
   - Change dates and verify validation works
   - Verify priority calculation is correct

4. **API tests:**
   ```bash
   # Test booking creation endpoint
   curl -X POST https://your-api/bookings \
     -H "Content-Type: application/json" \
     -d '{
       "checkout_date": "2026-01-20",
       "checkin_date": "2026-01-22",
       "property_id": "..."
     }'
   ```

---

### Step 6: Re-enable Production

Once all tests pass:

1. **Disable maintenance mode**
2. **Monitor for errors:**
   ```bash
   # Watch application logs
   tail -f /var/log/app.log
   
   # Monitor database logs
   tail -f /var/log/postgresql/postgresql.log
   ```
3. **Check error tracking:** Review Sentry, Datadog, or your error tracking service
4. **User communication:** Notify users that the system is back online

---

## Post-Rollback Monitoring

Monitor these metrics for 24-48 hours after rollback:

1. **Booking Creation Rate**
   ```sql
   SELECT DATE(created_at), COUNT(*)
   FROM bookings
   WHERE created_at > NOW() - INTERVAL '7 days'
   GROUP BY DATE(created_at)
   ORDER BY DATE(created_at);
   ```

2. **Error Rates**
   - Check application error logs
   - Monitor HTTP 500 error rate
   - Review database error logs

3. **User Feedback**
   - Customer support tickets
   - User complaints or confusion
   - Feature functionality

4. **Data Consistency**
   ```sql
   -- Verify no new invalid bookings were created
   SELECT COUNT(*) FROM bookings
   WHERE checkout_date >= checkin_date;
   ```

---

## Troubleshooting

### Problem: Rollback migration fails midway

**Solution:**
1. Check the error message for details
2. Manually fix the issue in the database
3. Re-run the rollback migration
4. If still failing, restore from backup:
   ```bash
   pg_restore -d <database> backup_before_rollback_*.dump
   ```

### Problem: Some bookings still have invalid dates after rollback

**Solution:**
```sql
-- Manually swap dates for affected bookings
UPDATE public.bookings
SET 
  checkin_date = checkout_date,
  checkout_date = checkin_date
WHERE id IN ('booking-id-1', 'booking-id-2', ...);
```

### Problem: Frontend still showing new model behavior

**Solution:**
1. Clear browser cache
2. Verify correct frontend version is deployed:
   ```bash
   curl https://your-app.com | grep "version"
   ```
3. Check CDN cache if using one
4. Redeploy frontend with cache-busting query params

### Problem: RLS policies causing permission errors

**Solution:**
Check RLS policies are still valid after rollback:
```sql
-- List all policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename = 'bookings';

-- Test as specific user
SET ROLE authenticated;
SELECT * FROM bookings LIMIT 1;
RESET ROLE;
```

---

## Recovery from Rollback Failure

If the rollback itself fails catastrophically:

### Emergency Database Restoration

```bash
# Stop application
systemctl stop app-service

# Restore from pre-rollback backup
pg_restore -d <database> -c backup_before_rollback_*.dump

# Verify restoration
psql -d <database> -c "SELECT COUNT(*) FROM bookings;"

# Restart application
systemctl start app-service
```

### Emergency Contact List

Maintain a list of contacts for emergency situations:
- Database Administrator: [contact info]
- DevOps Lead: [contact info]
- CTO/Technical Lead: [contact info]
- Supabase Support: support@supabase.io

---

## Preventing Future Rollbacks

To minimize the need for future rollbacks:

1. **More thorough testing:**
   - Comprehensive integration tests
   - Load testing with production-like data
   - User acceptance testing (UAT)

2. **Staged rollouts:**
   - Deploy to internal users first
   - Gradual rollout to production users
   - Feature flags for easy rollback

3. **Better monitoring:**
   - Real-time error alerts
   - Data validation checks
   - User behavior analytics

4. **Database migration best practices:**
   - Always include rollback migrations
   - Test migrations on production-like data
   - Document all changes thoroughly

---

## Related Documents

- [Migration 011: Implement Best Practices Model](../supabase/migrations/011_implement_best_practices_model.sql)
- [Migration 012: Rollback Script](../supabase/migrations/012_rollback_booking_date_model.sql)
- [Project README](../README.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)

---

## Rollback History

| Date | Executed By | Reason | Outcome |
|------|-------------|--------|---------|
| YYYY-MM-DD | [Name] | [Reason] | [Success/Failed] |

---

**Last Updated:** 2026-01-26  
**Document Version:** 1.0  
**Migration Version:** 011 → 012 (rollback)
