-- ============================================================================
-- MIGRATION: Judge Scoring System Setup
-- ============================================================================
-- This migration creates the complete infrastructure for judge scoring:
-- 1. project_scores table with RLS policies
-- 2. get_user_role RPC function (SECURITY DEFINER)
-- 3. RLS policies on user_roles, submissions, and project_scores
-- ============================================================================

-- ────────────────────────────────────────────────────────────────────────────
-- 1. CREATE project_scores TABLE
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.project_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  innovation integer NOT NULL CHECK (innovation >= 1 AND innovation <= 10),
  impact integer NOT NULL CHECK (impact >= 1 AND impact <= 10),
  technical_quality integer NOT NULL CHECK (technical_quality >= 1 AND technical_quality <= 10),
  relevance integer NOT NULL CHECK (relevance >= 1 AND relevance <= 10),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(submission_id, judge_id)
);

-- Enable RLS on project_scores
ALTER TABLE public.project_scores ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. CREATE get_user_role RPC FUNCTION (SECURITY DEFINER)
-- ────────────────────────────────────────────────────────────────────────────
-- This function bypasses RLS to fetch the user's role from the user_roles table
-- SECURITY DEFINER: runs with the privileges of the function owner (postgres)

DROP FUNCTION IF EXISTS public.get_user_role(uuid) CASCADE;

CREATE FUNCTION public.get_user_role(_user_id uuid)
RETURNS public.app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1;
$$;

-- ────────────────────────────────────────────────────────────────────────────
-- 3. RLS POLICIES ON user_roles
-- ────────────────────────────────────────────────────────────────────────────
-- Allow authenticated users to read their own role

DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. RLS POLICIES ON project_scores
-- ────────────────────────────────────────────────────────────────────────────

-- Judges can SELECT their own scores
DROP POLICY IF EXISTS "Judges can view own scores" ON public.project_scores;
CREATE POLICY "Judges can view own scores" ON public.project_scores
  FOR SELECT USING (auth.uid() = judge_id);

-- Judges can INSERT scores
DROP POLICY IF EXISTS "Judges can insert scores" ON public.project_scores;
CREATE POLICY "Judges can insert scores" ON public.project_scores
  FOR INSERT WITH CHECK (auth.uid() = judge_id);

-- Judges can UPDATE their own scores
DROP POLICY IF EXISTS "Judges can update own scores" ON public.project_scores;
CREATE POLICY "Judges can update own scores" ON public.project_scores
  FOR UPDATE USING (auth.uid() = judge_id) WITH CHECK (auth.uid() = judge_id);

-- Admins and super_admins can SELECT all scores
DROP POLICY IF EXISTS "Admins can view all scores" ON public.project_scores;
CREATE POLICY "Admins can view all scores" ON public.project_scores
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- 5. RLS POLICY ON submissions (for judges to read submissions)
-- ────────────────────────────────────────────────────────────────────────────
-- Allow judges to SELECT all submissions (they need to see all projects to score)

DROP POLICY IF EXISTS "Judges can view all submissions" ON public.submissions;
CREATE POLICY "Judges can view all submissions" ON public.submissions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role IN ('judge', 'admin', 'super_admin')
    )
  );

-- ────────────────────────────────────────────────────────────────────────────
-- INDEXES: Improve query performance
-- ────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_project_scores_judge_id ON public.project_scores(judge_id);
CREATE INDEX IF NOT EXISTS idx_project_scores_submission_id ON public.project_scores(submission_id);

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
