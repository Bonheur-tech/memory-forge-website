/**
 * Coordinator Dashboard — Never Again AI Hackathon
 * Coordinators can monitor submissions, view scoring progress, and see rankings.
 * Read-only — cannot score or edit.
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut, Cpu, Search, Filter, FileText, CheckCircle2, Clock, BarChart3, Trophy } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Submission {
  id: string;
  project_title: string;
  full_name: string;
  school: string;
  category: string;
  description: string;
  status: string;
  score_count?: number;
  created_at: string;
}

interface RankingRow {
  submission_id: string;
  project_title: string;
  team_name: string;
  category: string;
  avg_score: number;
  score_count: number;
  overall_rank: number;
}

const CATEGORIES = ["All", "AI & Machine Learning", "Web & Mobile Development", "Cybersecurity"];

// ── Category stats card ───────────────────────────────────────────────────────

const CategoryCard = ({
  category, submissions, scoredCount,
}: { category: string; submissions: Submission[]; scoredCount: number }) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
    <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2 truncate">{category}</p>
    <p className="text-2xl font-black text-slate-900 dark:text-white">{submissions.length}</p>
    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">submissions</p>
    <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
        style={{ width: `${submissions.length > 0 ? (scoredCount / submissions.length) * 100 : 0}%` }}
      />
    </div>
    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{scoredCount}/{submissions.length} scored</p>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────

const CoordinatorDashboard = () => {
  const { user, role, loading: authLoading, signOut } = useAuth();
  const navigate  = useNavigate();
  const { toast } = useToast();

  const [access, setAccess]           = useState<"checking" | "granted" | "denied">("checking");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [rankings, setRankings]       = useState<RankingRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab]     = useState<"submissions" | "rankings">("submissions");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch]           = useState("");
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
    if (role === "coordinator") { if (access !== "granted") { setAccess("granted"); fetchData(); } }
    else { setAccess("denied"); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, role]);

  useEffect(() => {
    if (access === "denied") navigate("/login", { replace: true });
  }, [access, navigate]);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [subRes, rankRes] = await Promise.all([
        supabase.from("submissions")
          .select("id,project_title,full_name,school,category,description,status,created_at")
          .order("created_at", { ascending: false }),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).rpc("get_rankings", { p_category: null }),
      ]);
      if (subRes.data) setSubmissions(subRes.data as Submission[]);
      if (rankRes.data) setRankings(rankRes.data as RankingRow[]);
    } catch {
      toast({ title: "Failed to load data.", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  }, [toast]);

  const scoredByCategory = (cat: string) =>
    rankings.filter((r) => r.category === cat && r.score_count > 0).length;

  const filtered = submissions.filter((s) => {
    const matchCat = categoryFilter === "All" || s.category === categoryFilter;
    const matchSearch = !search.trim() ||
      s.project_title.toLowerCase().includes(search.toLowerCase()) ||
      s.full_name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
          <div className="h-7 w-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 flex items-center justify-center">
            <Cpu className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white">Coordinator Dashboard</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">{user?.email}</span>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-xs"
          >
            {darkMode ? "☀" : "🌙"}
          </button>
          <Button variant="outline" size="sm" onClick={() => { signOut(); navigate("/"); }} className="gap-1.5 text-red-500 border-red-200 hover:bg-red-50">
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Submissions", value: submissions.length, icon: FileText,    color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
            { label: "Scored",            value: rankings.filter((r) => r.score_count > 0).length, icon: CheckCircle2, color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
            { label: "Not Yet Scored",    value: rankings.filter((r) => r.score_count === 0).length, icon: Clock, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
            { label: "Categories",        value: CATEGORIES.length - 1, icon: BarChart3, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="h-4.5 w-4.5" style={{ height: "1.125rem", width: "1.125rem" }} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.slice(1).map((cat) => (
            <CategoryCard
              key={cat}
              category={cat}
              submissions={submissions.filter((s) => s.category === cat)}
              scoredCount={scoredByCategory(cat)}
            />
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 w-fit">
          {(["submissions", "rankings"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              {tab === "submissions" ? <><FileText className="h-3.5 w-3.5 inline mr-1.5" />Submissions</> : <><Trophy className="h-3.5 w-3.5 inline mr-1.5" />Rankings</>}
            </button>
          ))}
        </div>

        {activeTab === "submissions" && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700" />
              </div>
              <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-10">
                <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="text-sm text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none cursor-pointer">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Submissions table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {dataLoading ? (
                <div className="py-16 flex justify-center">
                  <svg className="animate-spin h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-700/50">
                        {["Project", "Team / School", "Category", "Status", "Submitted"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((sub, i) => {
                        const ranked = rankings.find((r) => r.submission_id === sub.id);
                        return (
                          <tr key={sub.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${i < filtered.length - 1 ? "border-b border-slate-50 dark:border-slate-800" : ""}`}>
                            <td className="px-5 py-3.5">
                              <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">{sub.project_title}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[160px]">{sub.full_name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[160px]">{sub.school}</p>
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                                {sub.category}
                              </span>
                            </td>
                            <td className="px-5 py-3.5">
                              {ranked && ranked.score_count > 0 ? (
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                  ✓ Scored ({ranked.score_count})
                                </span>
                              ) : (
                                <span className="text-xs text-amber-600 dark:text-amber-400">Pending</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className="text-xs text-slate-400 dark:text-slate-500">
                                {new Date(sub.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {filtered.length === 0 && (
                    <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">No projects found.</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "rankings" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Live Leaderboard</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    {["Rank", "Project", "Team", "Category", "Avg Score", "Judges"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rankings.map((row, i) => (
                    <tr key={row.submission_id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${i < rankings.length - 1 ? "border-b border-slate-50 dark:border-slate-800" : ""}`}>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${
                          row.overall_rank === 1 ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200" :
                          row.overall_rank === 2 ? "text-slate-500 bg-slate-50 dark:bg-slate-700 border-slate-200" :
                          row.overall_rank === 3 ? "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200" :
                          "text-slate-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                        }`}>{row.overall_rank}</span>
                      </td>
                      <td className="px-5 py-3.5"><p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{row.project_title}</p></td>
                      <td className="px-5 py-3.5"><p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">{row.team_name}</p></td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">{row.category}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-bold ${Number(row.avg_score) >= 8 ? "text-emerald-600" : Number(row.avg_score) >= 5 ? "text-amber-600" : "text-slate-400"}`}>
                          {row.score_count > 0 ? Number(row.avg_score).toFixed(2) : "—"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">{row.score_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rankings.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">No rankings yet.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoordinatorDashboard;
