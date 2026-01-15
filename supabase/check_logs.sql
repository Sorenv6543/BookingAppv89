-- Query to check Supabase logs for the exact error
-- This will show recent PostgreSQL errors

-- Check if there are any recent errors in pg_stat_statements
SELECT
  calls,
  mean_exec_time,
  query
FROM pg_stat_statements
WHERE query LIKE '%user_profiles%'
ORDER BY calls DESC
LIMIT 10;

-- Alternative: Check PostgreSQL logs (if available)
-- Note: This might not work depending on your Supabase plan
SELECT * FROM pg_stat_activity
WHERE state = 'active'
AND query LIKE '%user_profiles%';
