-- ============================================================
-- Enhance admin features: scoring, feedback, replies, new dates
-- ============================================================

-- Add score, admin_feedback, file_url columns to submissions
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS score INTEGER,
  ADD COLUMN IF NOT EXISTS admin_feedback TEXT,
  ADD COLUMN IF NOT EXISTS file_url TEXT;

-- Widen the status CHECK to include 'reviewed' and 'shortlisted'
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS submissions_status_check;
ALTER TABLE public.submissions
  ADD CONSTRAINT submissions_status_check
  CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'winner', 'approved', 'rejected'));

-- Add admin_reply and replied_at to messages
ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS admin_reply TEXT,
  ADD COLUMN IF NOT EXISTS replied_at TIMESTAMP WITH TIME ZONE;

-- Seed additional competition settings (no-op if already present)
INSERT INTO public.competition_settings (key, value) VALUES
  ('registration_close',   '2026-04-06T23:59:00+02:00'),
  ('judging_start',        '2026-04-09T18:00:00+02:00'),
  ('winner_announcement',  '2026-04-10T12:00:00+02:00'),
  ('hackathon_name',       'Never Again AI Hackathon 2026'),
  ('contact_email',        'info@neveragain-ai.rw')
ON CONFLICT (key) DO NOTHING;
