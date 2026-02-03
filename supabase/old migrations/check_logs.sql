-- Query to check execution statistics for user_profiles queries
-- NOTE: pg_stat_statements is an optional PostgreSQL extension that must be
-- enabled via "CREATE EXTENSION pg_stat_statements" before this view is available.
-- This query returns execution statistics (calls: execution count, 
-- mean_exec_time: average execution time in ms, query: the SQL statement)
-- for statements matching 'user_profiles'.

SELECT
  calls,
  mean_exec_time,
  query
FROM pg_stat_statements
WHERE query LIKE '%user_profiles%'
ORDER BY calls DESC
LIMIT 10;

-- Alternative: Check current active sessions (NOT historical logs)
-- WARNING: pg_stat_activity shows only currently active sessions, not historical errors.
-- For historical logging, use the Supabase Dashboard logging UI or check postgres_logs
-- if available in your instance (requires postgres_logs extension).
SELECT 
  pid, 
  usename, 
  application_name, 
  state, 
  query
FROM pg_stat_activity
WHERE state = 'active'
AND query LIKE '%user_profiles%';
