-- 011_implement_best_practices_model.sql
-- Implement industry best practices for vacation rental management
-- Reference: VRMA, Operto, SuiteOp, TouchStay standards
-- User Research: https://www.perplexity.ai/search/i-m-writing-an-app-for-a-house-iFc4Sg53S3eSSQ60hwMmqA#3

-- ============================================================================
-- PART 1: Fix Booking Date Model (Critical)
-- ============================================================================
-- Change from "cleaning window" model to standard hotel model
-- BEFORE: checkout_date < checkin_date (guests depart, then next guests arrive)
-- AFTER:  checkin_date < checkout_date (guests arrive, stay, then depart)

-- Drop the existing incorrect constraint
ALTER TABLE public.bookings 
DROP CONSTRAINT IF EXISTS booking_dates_valid;

-- Update existing data: swap checkout_date and checkin_date
-- Current data has the dates backwards (checkout < checkin)
-- We need to swap them to match industry standard (checkin < checkout)
UPDATE public.bookings 
SET 
  checkout_date = checkin_date,
  checkin_date = checkout_date
WHERE checkout_date < checkin_date;

-- Add the correct constraint with industry standard logic
-- checkin_date should be BEFORE checkout_date for guest stays
ALTER TABLE public.bookings 
ADD CONSTRAINT booking_dates_valid 
CHECK (checkin_date < checkout_date);

-- Update comments to reflect the correct model
COMMENT ON COLUMN public.bookings.checkin_date IS 'Date when guests CHECK IN (arrive) - start of guest stay';
COMMENT ON COLUMN public.bookings.checkout_date IS 'Date when guests CHECK OUT (depart) - end of guest stay';
COMMENT ON COLUMN public.bookings.checkin_time IS 'Time when guests arrive (HH:MM format)';
COMMENT ON COLUMN public.bookings.checkout_time IS 'Time when guests depart (HH:MM format)';
COMMENT ON CONSTRAINT booking_dates_valid ON public.bookings IS 'Ensures checkin date is before checkout date for guest stays (industry standard)';

-- Mark assigned_cleaner_id as deprecated in favor of cleaning_tasks
COMMENT ON COLUMN public.bookings.assigned_cleaner_id IS 'DEPRECATED: Use cleaning_tasks table instead. Legacy field for backward compatibility.';

-- ============================================================================
-- PART 2: Create Cleaning Tasks Table
-- ============================================================================
-- New table to represent operational cleaning and maintenance work
-- Follows industry best practice of separating guest stays from operational tasks

CREATE TABLE IF NOT EXISTS public.cleaning_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  assigned_cleaner_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  
  -- Task scheduling
  scheduled_start TIMESTAMPTZ NOT NULL,
  scheduled_end TIMESTAMPTZ NOT NULL,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  
  -- Task type and status
  task_type VARCHAR(50) NOT NULL DEFAULT 'turnover',
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled',
  priority VARCHAR(20) NOT NULL DEFAULT 'normal',
  
  -- Task details
  checklist JSONB,
  notes TEXT,
  completion_notes TEXT,
  photos TEXT[],
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Constraints
  CONSTRAINT valid_scheduled_times CHECK (scheduled_start < scheduled_end),
  CONSTRAINT valid_actual_times CHECK (actual_start IS NULL OR actual_end IS NULL OR actual_start < actual_end),
  CONSTRAINT valid_task_type CHECK (task_type IN ('turnover', 'deep_clean', 'inspection', 'maintenance')),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  CONSTRAINT assigned_cleaner_is_cleaner CHECK (
    assigned_cleaner_id IS NULL OR 
    EXISTS (SELECT 1 FROM user_profiles WHERE id = assigned_cleaner_id AND role = 'cleaner')
  )
);

-- ============================================================================
-- PART 3: Add Indexes for Performance
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_property ON public.cleaning_tasks(property_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_booking ON public.cleaning_tasks(booking_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_cleaner ON public.cleaning_tasks(assigned_cleaner_id);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_scheduled_start ON public.cleaning_tasks(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_status ON public.cleaning_tasks(status);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_type ON public.cleaning_tasks(task_type);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_property_status ON public.cleaning_tasks(property_id, status);

-- ============================================================================
-- PART 4: Add Trigger for Updated Timestamp
-- ============================================================================

CREATE TRIGGER update_cleaning_tasks_updated_at
  BEFORE UPDATE ON public.cleaning_tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PART 5: Create Auto-Generation Trigger for Turnover Tasks
-- ============================================================================

CREATE OR REPLACE FUNCTION public.generate_turnover_task()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-create a turnover cleaning task for new bookings
  -- Cleaning happens AFTER guest checks out and BEFORE next guest checks in
  INSERT INTO public.cleaning_tasks (
    property_id,
    booking_id,
    scheduled_start,
    scheduled_end,
    task_type,
    status,
    priority
  ) VALUES (
    NEW.property_id,
    NEW.id,
    NEW.checkout_date, -- Cleaning starts after guest checks out
    NEW.checkin_date,  -- Cleaning must complete before next guest checks in (wait, this doesn't work with new model!)
    'turnover',
    'scheduled',
    -- Set priority based on urgency
    CASE 
      WHEN NEW.checkout_date::date = NEW.checkin_date::date THEN 'high' -- Same-day turnover
      WHEN NEW.checkin_date - NEW.checkout_date < INTERVAL '24 hours' THEN 'high' -- Less than 24 hours
      ELSE 'normal'
    END
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- NOTE: Trigger is disabled for now since the booking model has changed
-- We need to rethink how turnover tasks are generated with the new model
-- where checkin_date < checkout_date (guest stays, not cleaning windows)
-- TODO: Implement logic to generate turnover tasks between consecutive bookings

-- CREATE TRIGGER trg_generate_turnover_task
-- AFTER INSERT ON public.bookings
-- FOR EACH ROW
-- EXECUTE FUNCTION public.generate_turnover_task();

COMMENT ON FUNCTION public.generate_turnover_task() IS 'Auto-generates a turnover cleaning task when a new booking is created (DISABLED - needs refactoring for new booking model)';

-- ============================================================================
-- PART 6: Enable RLS on Cleaning Tasks Table
-- ============================================================================

ALTER TABLE public.cleaning_tasks ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PART 7: Create RLS Policies for Cleaning Tasks
-- ============================================================================

-- Owners can view cleaning tasks for their properties
CREATE POLICY "Owners can view own property cleaning tasks" ON public.cleaning_tasks
  FOR SELECT TO authenticated
  USING (
    (private.is_owner() AND EXISTS (
      SELECT 1 FROM properties WHERE id = cleaning_tasks.property_id AND owner_id = auth.uid()
    )) OR
    private.is_admin()
  );

-- Owners can create cleaning tasks for their properties
CREATE POLICY "Owners can create cleaning tasks for own properties" ON public.cleaning_tasks
  FOR INSERT TO authenticated
  WITH CHECK (
    (private.is_owner() AND EXISTS (
      SELECT 1 FROM properties WHERE id = cleaning_tasks.property_id AND owner_id = auth.uid()
    )) OR
    private.is_admin()
  );

-- Owners can update cleaning tasks for their properties (except cleaner updates)
CREATE POLICY "Owners can update own property cleaning tasks" ON public.cleaning_tasks
  FOR UPDATE TO authenticated
  USING (
    (private.is_owner() AND EXISTS (
      SELECT 1 FROM properties WHERE id = cleaning_tasks.property_id AND owner_id = auth.uid()
    )) OR
    private.is_admin()
  )
  WITH CHECK (
    (private.is_owner() AND EXISTS (
      SELECT 1 FROM properties WHERE id = cleaning_tasks.property_id AND owner_id = auth.uid()
    )) OR
    private.is_admin()
  );

-- Owners can delete cleaning tasks for their properties
CREATE POLICY "Owners can delete own property cleaning tasks" ON public.cleaning_tasks
  FOR DELETE TO authenticated
  USING (
    (private.is_owner() AND EXISTS (
      SELECT 1 FROM properties WHERE id = cleaning_tasks.property_id AND owner_id = auth.uid()
    )) OR
    private.is_admin()
  );

-- Cleaners can view their assigned tasks
CREATE POLICY "Cleaners can view assigned tasks" ON public.cleaning_tasks
  FOR SELECT TO authenticated
  USING (
    private.is_cleaner() AND assigned_cleaner_id = auth.uid()
  );

-- Cleaners can update their assigned tasks (status, checklist, photos, completion_notes)
CREATE POLICY "Cleaners can update assigned tasks" ON public.cleaning_tasks
  FOR UPDATE TO authenticated
  USING (private.is_cleaner() AND assigned_cleaner_id = auth.uid())
  WITH CHECK (private.is_cleaner() AND assigned_cleaner_id = auth.uid());

-- Admins have full access to all cleaning tasks
CREATE POLICY "Admins have full access to cleaning tasks" ON public.cleaning_tasks
  FOR ALL TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ============================================================================
-- PART 8: Add Table and Column Comments
-- ============================================================================

COMMENT ON TABLE public.cleaning_tasks IS 'Operational cleaning and maintenance tasks, auto-generated from bookings or manually created. Follows industry best practice of separating guest stays (bookings) from operational work (cleaning tasks).';
COMMENT ON COLUMN public.cleaning_tasks.task_type IS 'Type of cleaning: turnover (between bookings), deep_clean (periodic), inspection, maintenance';
COMMENT ON COLUMN public.cleaning_tasks.booking_id IS 'Optional link to booking that triggered this task (for turnovers). NULL for standalone cleaning tasks.';
COMMENT ON COLUMN public.cleaning_tasks.checklist IS 'JSON array of checklist items with completion status: [{"id": "1", "task": "Make beds", "completed": true, "notes": ""}]';
COMMENT ON COLUMN public.cleaning_tasks.photos IS 'Array of photo URLs documenting task completion (before/after photos, issue documentation)';
COMMENT ON COLUMN public.cleaning_tasks.scheduled_start IS 'When cleaning is scheduled to start (typically after guest checkout)';
COMMENT ON COLUMN public.cleaning_tasks.scheduled_end IS 'When cleaning must be completed by (typically before next guest checkin)';
COMMENT ON COLUMN public.cleaning_tasks.actual_start IS 'When cleaner actually started work (recorded in mobile app)';
COMMENT ON COLUMN public.cleaning_tasks.actual_end IS 'When cleaner actually completed work (recorded in mobile app)';

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Summary of changes:
-- 1. Fixed booking date model: checkin_date < checkout_date (industry standard)
-- 2. Created cleaning_tasks table for operational work
-- 3. Added comprehensive RLS policies for multi-tenant access control
-- 4. Added indexes for query performance
-- 5. Prepared trigger function (disabled pending refactoring)
--
-- Next steps (future PRs):
-- - Refactor trigger to generate cleaning tasks between consecutive bookings
-- - Build UI components for cleaning task management
-- - Implement cleaner mobile interface
-- - Add photo upload functionality
-- - Build cleaning checklist library
