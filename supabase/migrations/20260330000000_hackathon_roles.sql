-- ============================================================
-- Hackathon Role-Based Management System
-- Adds: judge, coordinator, super_admin roles
--       project_scores table (judge evaluations)
--       winner_selections table (admin picks)
--       get_user_role(), get_rankings(), list_staff() functions
-- ============================================================

-- 1. Extend the role enum with new values
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'judge';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'coordinator';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- 2. Function: return the highest-priority role for a user
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY
    CASE role::text
      WHEN 'super_admin' THEN 1
      WHEN 'admin'       THEN 2
      WHEN 'judge'       THEN 3
      WHEN 'coordinator' THEN 4
      ELSE 5
    END
  LIMIT 1;
$$;

-- 3. Project scores table (judges evaluate each submission)
CREATE TABLE IF NOT EXISTS public.project_scores (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id     UUID        NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  judge_id          UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  innovation        INTEGER     NOT NULL CHECK (innovation BETWEEN 1 AND 10),
  impact            INTEGER     NOT NULL CHECK (impact BETWEEN 1 AND 10),
  technical_quality INTEGER     NOT NULL CHECK (technical_quality BETWEEN 1 AND 10),
  relevance         INTEGER     NOT NULL CHECK (relevance BETWEEN 1 AND 10),
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(submission_id, judge_id)
);

ALTER TABLE public.project_scores ENABLE ROW LEVEL SECURITY;

-- Judges can insert their own scores (once per project — enforced by UNIQUE)
DROP POLICY IF EXISTS "Judges can insert scores" ON public.project_scores;
CREATE POLICY "Judges can insert scores" ON public.project_scores
  FOR INSERT WITH CHECK (
    auth.uid() = judge_id AND
    public.has_role(auth.uid(), 'judge')
  );

-- Judges can update only their own scores
DROP POLICY IF EXISTS "Judges can update own scores" ON public.project_scores;
CREATE POLICY "Judges can update own scores" ON public.project_scores
  FOR UPDATE USING (auth.uid() = judge_id);

-- All staff roles can view scores
DROP POLICY IF EXISTS "Staff can view scores" ON public.project_scores;
CREATE POLICY "Staff can view scores" ON public.project_scores
  FOR SELECT USING (
    public.has_role(auth.uid(), 'judge')       OR
    public.has_role(auth.uid(), 'admin')       OR
    public.has_role(auth.uid(), 'super_admin') OR
    public.has_role(auth.uid(), 'coordinator')
  );

-- Admins can delete any score
DROP POLICY IF EXISTS "Admins can delete scores" ON public.project_scores;
CREATE POLICY "Admins can delete scores" ON public.project_scores
  FOR DELETE USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

-- Trigger: keep updated_at fresh
CREATE TRIGGER update_project_scores_updated_at
  BEFORE UPDATE ON public.project_scores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Winner selections table
CREATE TABLE IF NOT EXISTS public.winner_selections (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID        NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
  placement     INTEGER     NOT NULL CHECK (placement IN (1, 2, 3)),
  scope         TEXT        NOT NULL DEFAULT 'overall',
  selected_by   UUID        REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(placement, scope)   -- one winner per placement per scope
);

ALTER TABLE public.winner_selections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage winners" ON public.winner_selections;
CREATE POLICY "Admins can manage winners" ON public.winner_selections
  FOR ALL USING (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  );

DROP POLICY IF EXISTS "Anyone can view winners" ON public.winner_selections;
CREATE POLICY "Anyone can view winners" ON public.winner_selections
  FOR SELECT USING (true);

-- 5. Allow judges and coordinators to read submissions (for scoring/monitoring)
DROP POLICY IF EXISTS "Judges can view submissions" ON public.submissions;
CREATE POLICY "Judges can view submissions" ON public.submissions
  FOR SELECT USING (public.has_role(auth.uid(), 'judge'));

DROP POLICY IF EXISTS "Coordinators can view submissions" ON public.submissions;
CREATE POLICY "Coordinators can view submissions" ON public.submissions
  FOR SELECT USING (public.has_role(auth.uid(), 'coordinator'));

-- 6. Rankings function: aggregates judge scores and ranks submissions
CREATE OR REPLACE FUNCTION public.get_rankings(p_category TEXT DEFAULT NULL)
RETURNS TABLE(
  submission_id UUID,
  project_title TEXT,
  team_name     TEXT,
  category      TEXT,
  status        TEXT,
  avg_score     NUMERIC,
  score_count   BIGINT,
  overall_rank  BIGINT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.id                                                             AS submission_id,
    s.project_title,
    s.full_name                                                      AS team_name,
    s.category,
    s.status,
    COALESCE(
      ROUND(AVG(
        (ps.innovation + ps.impact + ps.technical_quality + ps.relevance)::NUMERIC / 4
      ), 2),
      0
    )                                                                AS avg_score,
    COUNT(ps.id)::BIGINT                                             AS score_count,
    RANK() OVER (
      ORDER BY AVG(
        (ps.innovation + ps.impact + ps.technical_quality + ps.relevance)::NUMERIC / 4
      ) DESC NULLS LAST
    )                                                                AS overall_rank
  FROM public.submissions s
  LEFT JOIN public.project_scores ps ON ps.submission_id = s.id
  WHERE p_category IS NULL OR s.category = p_category
  GROUP BY s.id, s.project_title, s.full_name, s.category, s.status
  ORDER BY avg_score DESC;
$$;

-- 7. List staff function (reads auth.users — needs SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.list_staff()
RETURNS TABLE(
  user_id    UUID,
  email      TEXT,
  role       TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only admins/super_admins can list staff
  IF NOT (
    public.has_role(auth.uid(), 'admin') OR
    public.has_role(auth.uid(), 'super_admin')
  ) THEN
    RAISE EXCEPTION 'Access denied: admin role required';
  END IF;

  RETURN QUERY
  SELECT
    ur.user_id,
    u.email,
    ur.role::TEXT,
    ur.created_at
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  WHERE ur.role::TEXT IN ('admin', 'judge', 'coordinator', 'super_admin')
  ORDER BY ur.created_at DESC;
END;
$$;
