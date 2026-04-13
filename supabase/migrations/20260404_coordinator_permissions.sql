-- ============================================================================
-- MIGRATION: Coordinator Permissions and Features
-- ============================================================================
-- This migration adds permissions for coordinators:
-- 1. Allow coordinators to view all submissions
-- 2. Allow coordinators to update status and admin_feedback on submissions
-- 3. Add a tasks table for assigning tasks to users
-- 4. RLS policies for coordinators on tasks
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. ADD tasks TABLE
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  assigned_to uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  submission_id uuid REFERENCES public.submissions(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. RLS POLICIES ON submissions FOR coordinators
-- ────────────────────────────────────────────────────────────────────────────

-- Coordinators can view all submissions
DROP POLICY IF EXISTS "Coordinators can view all submissions" ON public.submissions;
CREATE POLICY "Coordinators can view all submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'coordinator'
    )
  );

-- Coordinators can update status and admin_feedback
DROP POLICY IF EXISTS "Coordinators can update submissions" ON public.submissions;
CREATE POLICY "Coordinators can update submissions" ON public.submissions
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'coordinator'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'coordinator'
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 3. RLS POLICIES ON tasks
-- ────────────────────────────────────────────────────────────────────────────

-- Coordinators can view all tasks
DROP POLICY IF EXISTS "Coordinators can view all tasks" ON public.tasks;
CREATE POLICY "Coordinators can view all tasks" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('coordinator', 'admin', 'super_admin')
    )
  );

-- Coordinators can insert tasks
DROP POLICY IF EXISTS "Coordinators can insert tasks" ON public.tasks;
CREATE POLICY "Coordinators can insert tasks" ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'coordinator'
    )
  );

-- Coordinators can update tasks
DROP POLICY IF EXISTS "Coordinators can update tasks" ON public.tasks;
CREATE POLICY "Coordinators can update tasks" ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'coordinator'
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'coordinator'
    )
  );

-- Users can view tasks assigned to them
DROP POLICY IF EXISTS "Users can view own tasks" ON public.tasks;
CREATE POLICY "Users can view own tasks" ON public.tasks
  FOR SELECT USING (auth.uid() = assigned_to);

-- Users can update their own tasks
DROP POLICY IF EXISTS "Users can update own tasks" ON public.tasks;
CREATE POLICY "Users can update own tasks" ON public.tasks
  FOR UPDATE USING (auth.uid() = assigned_to) WITH CHECK (auth.uid() = assigned_to);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. UPDATE TRIGGER FOR tasks
-- ────────────────────────────────────────────────────────────────────────────

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();