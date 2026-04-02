// ── Shared TypeScript interfaces for the Admin dashboard ──────────────────────

export interface Submission {
  id: string;
  full_name: string;
  school: string;
  email: string;
  project_title: string;
  category: string;
  description: string;
  github_link: string | null;
  file_url: string | null;
  status: string;
  score: number | null;
  admin_feedback: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

export interface CompSetting {
  id: string;
  key: string;
  value: string;
}

export interface ProjectScore {
  id: string;
  submission_id: string;
  judge_id: string;
  innovation: number;
  impact: number;
  technical_quality: number;
  relevance: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface RankingRow {
  submission_id: string;
  project_title: string;
  team_name: string;
  category: string;
  status: string;
  avg_score: number;
  score_count: number;
  overall_rank: number;
}

export interface WinnerSelection {
  id: string;
  submission_id: string;
  placement: 1 | 2 | 3;
  scope: string;
  selected_by: string | null;
  created_at: string;
}

export type AdminSection =
  | "overview"
  | "submissions"
  | "messages"
  | "competition"
  | "rankings"
  | "winners"
  | "settings";

export const CATEGORIES = [
  "AI & Machine Learning",
  "Web & Mobile Development",
  "Cybersecurity",
] as const;

export type Category = typeof CATEGORIES[number];

// Status metadata used across tabs
export const STATUS_META: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  pending:     { label: "Pending",     color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",     dot: "bg-amber-500"  },
  reviewed:    { label: "Reviewed",    color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",          dot: "bg-blue-500"   },
  shortlisted: { label: "Shortlisted", color: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800", dot: "bg-purple-500" },
  winner:      { label: "Winner",      color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800", dot: "bg-emerald-500" },
  approved:    { label: "Approved",    color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",    dot: "bg-green-500"  },
  rejected:    { label: "Rejected",    color: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800",                dot: "bg-red-500"    },
};
