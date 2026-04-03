/**
 * Judge Dashboard — Never Again AI Hackathon
 * Judges score projects on: Innovation, Impact, Technical Quality, Relevance (1–10)
 * Prevents duplicate scoring (UNIQUE constraint on submission_id + judge_id)
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Star, LogOut, Trophy, CheckCircle2, Clock, Filter, Search,
  ChevronDown, ChevronUp, Cpu, X, Github, Download, Users, Mail,
  Building2, Award,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Submission {
  id: string;
  project_title: string;
  full_name: string;
  school: string;
  category: string;
  description: string;
  github_link: string | null;
  file_url: string | null;
  status: string;
  created_at: string;
  email: string;
}

interface JudgeScore {
  id: string;
  submission_id: string;
  innovation: number;
  impact: number;
  technical_quality: number;
  relevance: number;
  notes: string | null;
}

const CRITERIA: { key: keyof Omit<JudgeScore, "id" | "submission_id" | "notes">; label: string; desc: string }[] = [
  { key: "innovation",        label: "Innovation",         desc: "How original and creative is the idea?" },
  { key: "impact",            label: "Impact",             desc: "What is the potential social/technical impact?" },
  { key: "technical_quality", label: "Technical Quality",  desc: "How well-built and functional is the project?" },
  { key: "relevance",         label: "Relevance to Theme", desc: "How well does it align with the hackathon theme?" },
];

const CATEGORIES = ["All", "AI & Machine Learning", "Web & Mobile Development", "Cybersecurity"];

// ── Description Parser ────────────────────────────────────────────────────────

interface ParsedDescription {
  sector: string | null;
  teamMembers: Array<{ name: string; email: string; isLeader: boolean }>;
  projectDescription: string;
}

const parseDescription = (raw: string): ParsedDescription => {
  const result: ParsedDescription = {
    sector: null,
    teamMembers: [],
    projectDescription: raw,
  };

  // Check if this is the new packed format
  if (!raw.includes("TEAM MEMBERS:") || !raw.includes("PROJECT DESCRIPTION:")) {
    return result; // Old format - return as-is
  }

  // Extract SECTOR
  const sectorMatch = raw.match(/SECTOR:\s*(.+?)\n/);
  if (sectorMatch) {
    result.sector = sectorMatch[1].trim();
  }

  // Extract TEAM MEMBERS
  const teamMatch = raw.match(/TEAM MEMBERS:\n([\s\S]+?)\n\nPROJECT DESCRIPTION:/);
  if (teamMatch) {
    const teamSection = teamMatch[1];
    const memberLines = teamSection.split('\n').filter(line => line.trim());

    memberLines.forEach(line => {
      // Format: "1. Name — email (Team Leader)" or "2. Name — email"
      const match = line.match(/^\d+\.\s+(.+?)\s+—\s+(.+?)(?:\s+\(Team Leader\))?$/);
      if (match) {
        const name = match[1].trim();
        const email = match[2].trim();
        const isLeader = line.includes("(Team Leader)");
        result.teamMembers.push({ name, email, isLeader });
      }
    });
  }

  // Extract PROJECT DESCRIPTION
  const descMatch = raw.match(/PROJECT DESCRIPTION:\n([\s\S]+)$/);
  if (descMatch) {
    result.projectDescription = descMatch[1].trim();
  }

  return result;
};

// ── Score Slider ──────────────────────────────────────────────────────────────

const ScoreSlider = ({
  label, desc, value, onChange,
}: { label: string; desc: string; value: number; onChange: (v: number) => void }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <span className={`text-xl font-black w-10 text-right ${
        value >= 8 ? "text-emerald-600" : value >= 5 ? "text-amber-600" : "text-red-500"
      }`}>{value}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-400 w-3">1</span>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="flex-1 h-2 accent-purple-600"
      />
      <span className="text-xs text-slate-400 w-4">10</span>
    </div>
    <div className="flex justify-between text-[10px] text-slate-300 dark:text-slate-600 px-3">
      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
        <span key={n} className={value === n ? "text-purple-600 font-bold" : ""}>{n}</span>
      ))}
    </div>
  </div>
);

// ── Scoring Modal ─────────────────────────────────────────────────────────────

const ScoringModal = ({
  submission,
  existing,
  onClose,
  onSaved,
  judgeId,
}: {
  submission: Submission;
  existing: JudgeScore | null;
  onClose: () => void;
  onSaved: (score: JudgeScore) => void;
  judgeId: string;
}) => {
  const { toast } = useToast();
  const [scores, setScores] = useState({
    innovation:        existing?.innovation        ?? 5,
    impact:            existing?.impact            ?? 5,
    technical_quality: existing?.technical_quality ?? 5,
    relevance:         existing?.relevance         ?? 5,
  });
  const [notes, setNotes]   = useState(existing?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const avg = (Object.values(scores).reduce((a, b) => a + b, 0) / 4).toFixed(2);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (existing) {
        // Update existing score
        const { data, error } = await supabase.from("project_scores")
          .update({ ...scores, notes: notes || null })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) throw error;
        toast({ title: "Score updated!" });
        onSaved(data as JudgeScore);
      } else {
        // Insert new score
        const { data, error } = await supabase.from("project_scores")
          .insert({ submission_id: submission.id, judge_id: judgeId, ...scores, notes: notes || null })
          .select()
          .single();
        if (error) throw error;
        toast({ title: "Score submitted!" });
        onSaved(data as JudgeScore);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save score.";
      toast({ title: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-700/50">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">{submission.project_title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{submission.full_name} · {submission.category}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {CRITERIA.map(({ key, label, desc }) => (
            <ScoreSlider
              key={key}
              label={label}
              desc={desc}
              value={scores[key]}
              onChange={(v) => setScores((s) => ({ ...s, [key]: v }))}
            />
          ))}

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
            <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold">Average Score</p>
            <p className="text-3xl font-black text-purple-600 dark:text-purple-400">{avg}<span className="text-sm font-normal">/10</span></p>
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Notes (optional)</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any observations about this project…"
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-400 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 pb-5">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving} className="bg-purple-600 hover:bg-purple-700 text-white gap-1.5">
            <Star className="h-4 w-4" />
            {saving ? "Saving…" : existing ? "Update Score" : "Submit Score"}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const JudgeDashboard = () => {
  const { user, role, loading: authLoading, signOut } = useAuth();
  const navigate  = useNavigate();
  const { toast } = useToast();

  const [access, setAccess]           = useState<"checking" | "granted" | "denied">("checking");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [myScores, setMyScores]       = useState<JudgeScore[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch]           = useState("");
  const [scoringModal, setScoringModal] = useState<Submission | null>(null);
  const [expandedId, setExpandedId]   = useState<string | null>(null);
  const [darkMode, setDarkMode]       = useState(() => localStorage.getItem("adminDarkMode") === "true");

  useEffect(() => {
    const el = document.documentElement;
    if (darkMode) el.classList.add("dark"); else el.classList.remove("dark");
    return () => el.classList.remove("dark");
  }, [darkMode]);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setAccess("denied"); return; }
    if (role === null) return; // user authenticated but role still resolving — stay "checking"
    if (role === "judge") { if (access !== "granted") { setAccess("granted"); fetchData(); } }
    else { setAccess("denied"); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, role]);

  useEffect(() => {
    if (access === "denied") navigate("/login", { replace: true });
  }, [access, navigate]);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setDataLoading(true);
    try {
      const [subRes, scoreRes] = await Promise.all([
        supabase.from("submissions").select("id,project_title,full_name,school,category,description,github_link,file_url,status,created_at,email").order("created_at", { ascending: false }),
        supabase.from("project_scores").select("*").eq("judge_id", user.id),
      ]);
      
      if (subRes.error) {
        toast({ 
          title: "Failed to load submissions.", 
          description: subRes.error.message,
          variant: "destructive" 
        });
      } else if (subRes.data) {
        setSubmissions(subRes.data as Submission[]);
      }
      
      if (scoreRes.error) {
        toast({ 
          title: "Failed to load your scores.", 
          description: scoreRes.error.message,
          variant: "destructive" 
        });
      } else if (scoreRes.data) {
        setMyScores(scoreRes.data as JudgeScore[]);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      toast({ 
        title: "Failed to load data.", 
        description: errorMsg,
        variant: "destructive" 
      });
    } finally {
      setDataLoading(false);
    }
  }, [user, toast]);

  const getScore = (submissionId: string) => myScores.find((s) => s.submission_id === submissionId) ?? null;

  const handleScoreSaved = (score: JudgeScore) => {
    setMyScores((prev) => {
      const existing = prev.find((s) => s.id === score.id);
      return existing ? prev.map((s) => (s.id === score.id ? score : s)) : [...prev, score];
    });
    setScoringModal(null);
  };

  const filtered = submissions.filter((s) => {
    const matchCat = categoryFilter === "All" || s.category === categoryFilter;
    const matchSearch = !search.trim() || s.project_title.toLowerCase().includes(search.toLowerCase()) || s.full_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const scoredCount = myScores.length;
  const progressPct = submissions.length > 0 ? Math.round((scoredCount / submissions.length) * 100) : 0;

  if (access === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      </div>
    );
  }
  if (access === "denied") return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 h-14 flex items-center px-5 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 flex items-center justify-center">
            <Cpu className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white">Judge Dashboard</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{user?.email}</span>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs"
          >
            {darkMode ? "☀" : "🌙"}
          </button>
          <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Progress overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
              <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{submissions.length}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total Projects</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{scoredCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Scored by You</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-white">{submissions.length - scoredCount}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Remaining</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Evaluation Progress</p>
            <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{progressPct}%</p>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{scoredCount} of {submissions.length} projects evaluated</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Search by project or team name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-10">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none cursor-pointer"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Projects list */}
        {dataLoading ? (
          <div className="py-16 flex items-center justify-center">
            <svg className="animate-spin h-7 w-7 text-purple-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-slate-400 dark:text-slate-500">No projects found.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((sub) => {
              const score = getScore(sub.id);
              const isExpanded = expandedId === sub.id;
              const avgScore = score
                ? ((score.innovation + score.impact + score.technical_quality + score.relevance) / 4).toFixed(2)
                : null;

              return (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-purple-200 dark:hover:border-purple-700 transition-colors"
                >
                  <div className="flex items-start gap-4 p-4">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
                      {sub.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200">{sub.project_title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub.full_name} · {sub.school}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                            {sub.category}
                          </span>
                          {score ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
                              ✓ {avgScore}/10
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex items-center gap-3 border-t border-slate-50 dark:border-slate-800 pt-3">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                      {isExpanded ? "Hide details" : "View details"}
                    </button>
                    <div className="ml-auto flex gap-2">
                      {sub.github_link && (
                        <a href={sub.github_link} target="_blank" rel="noopener noreferrer"
                          className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                          GitHub
                        </a>
                      )}
                      <Button
                        size="sm"
                        onClick={() => setScoringModal(sub)}
                        className={score ? "bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5" : "bg-purple-600 hover:bg-purple-700 text-white gap-1.5"}
                      >
                        <Star className="h-3.5 w-3.5" />
                        {score ? "Edit Score" : "Score Project"}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-50 dark:border-slate-800 pt-4 space-y-4">
                      {/* Team Members Section */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                          <Users className="inline h-3.5 w-3.5 mr-1" />
                          Team Members
                        </p>
                        <div className="space-y-2">
                          {(() => {
                            const parsed = parseDescription(sub.description);
                            if (parsed.teamMembers.length > 0) {
                              return parsed.teamMembers.map((member, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-sm">
                                  <div className={`mt-0.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${member.isLeader ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                                  <div className="flex-1">
                                    <p className="text-slate-700 dark:text-slate-300">
                                      {member.name}
                                      {member.isLeader && <Award className="inline h-3.5 w-3.5 ml-1 text-amber-500" />}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                      <Mail className="h-3 w-3" />
                                      {member.email}
                                    </p>
                                  </div>
                                </div>
                              ));
                            } else {
                              // Fallback: split full_name by " | "
                              const names = sub.full_name.split(" | ");
                              return (
                                <>
                                  {names.map((name, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm">
                                      <div className={`mt-0.5 h-1.5 w-1.5 rounded-full flex-shrink-0 ${idx === 0 ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                                      <p className="text-slate-700 dark:text-slate-300">
                                        {name}
                                        {idx === 0 && <Award className="inline h-3.5 w-3.5 ml-1 text-amber-500" />}
                                      </p>
                                    </div>
                                  ))}
                                </>
                              );
                            }
                          })()}
                        </div>
                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                          <p className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5" />
                            {sub.school}
                          </p>
                          {(() => {
                            const parsed = parseDescription(sub.description);
                            return parsed.sector && (
                              <p className="mt-1">Sector: {parsed.sector}</p>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Project Description Section */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                          Project Description
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {parseDescription(sub.description).projectDescription}
                        </p>
                      </div>

                      {/* Links & Files Section */}
                      {(sub.github_link || sub.file_url) && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Links & Files
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sub.github_link && (
                              <a
                                href={sub.github_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 text-xs font-medium transition-colors"
                              >
                                <Github className="h-3.5 w-3.5" />
                                GitHub
                              </a>
                            )}
                            {sub.file_url && (
                              <a
                                href={sub.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 text-xs font-medium transition-colors"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download File
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Scores Breakdown */}
                      {score && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            Scores
                          </p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {CRITERIA.map(({ key, label }) => (
                              <div key={key} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
                                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                                <p className="text-xl font-black text-purple-600 dark:text-purple-400 mt-0.5">{score[key]}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Judge Notes */}
                      {score?.notes && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                            Your Notes
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 italic">{score.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Scoring modal */}
      {scoringModal && (
        <ScoringModal
          submission={scoringModal}
          existing={getScore(scoringModal.id)}
          onClose={() => setScoringModal(null)}
          onSaved={handleScoreSaved}
          judgeId={user!.id}
        />
      )}
    </div>
  );
};

export default JudgeDashboard;
