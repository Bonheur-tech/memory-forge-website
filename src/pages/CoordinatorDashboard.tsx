/**
 * Coordinator Dashboard — Never Again AI Hackathon
 * Coordinators can monitor submissions, update statuses, assign tasks, and generate reports.
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, Cpu, Search, Filter, FileText, CheckCircle2, Clock, BarChart3, Trophy, UserPlus, Edit, FileBarChart, Plus } from "lucide-react";
import StaffInbox from "@/components/StaffInbox";

// ── Types ─────────────────────────────────────────────────────────────────────

interface Submission {
  id: string;
  project_title: string;
  full_name: string;
  school: string;
  category: string;
  description: string;
  status: string;
  admin_feedback?: string;
  score_count?: number;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  description?: string;
  assigned_to: string | null;
  assigned_by?: string | null;
  submission_id?: string | null;
  status: string;
  priority: string;
  due_date?: string | null;
  created_at: string;
}

interface User {
  user_id: string;
  role: string;
  email?: string | null;
}

interface ScoreRow {
  created_at: string;
  submission_id: string;
  innovation: number;
  impact: number;
  technical_quality: number;
  relevance: number;
}

interface Report {
  total_submissions: number;
  submissions_by_status: Record<string, number>;
  submissions_by_category: Record<string, number>;
  total_tasks: number;
  tasks_by_status: Record<string, number>;
  tasks_by_priority: Record<string, number>;
  total_scores: number;
  recent_activity: {
    submissions_last_7_days: number;
    tasks_last_7_days: number;
    scores_last_7_days: number;
  };
}

interface FetchState {
  tasksAvailable: boolean;
  userDirectoryAvailable: boolean;
}

const CATEGORIES = ["All", "AI & Machine Learning", "Web & Mobile Development", "Cybersecurity"];
const STATUSES = ["pending", "approved", "rejected", "winner"];
const PRIORITIES = ["low", "medium", "high"];
const TASK_STATUSES = ["pending", "in_progress", "completed"];

const REPORT_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

const isMissingDbObjectError = (error: unknown) => {
  if (!error || typeof error !== "object") return false;

  const code = "code" in error ? String(error.code ?? "") : "";
  const message = "message" in error ? String(error.message ?? "").toLowerCase() : "";

  return (
    code === "42P01" ||
    code === "42703" ||
    code === "PGRST204" ||
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("column") ||
    message.includes("relation")
  );
};

const buildReport = (submissions: Submission[], tasks: Task[], scores: { created_at: string }[]): Report => {
  const recentThreshold = new Date(Date.now() - REPORT_WINDOW_MS);

  return {
    total_submissions: submissions.length,
    submissions_by_status: submissions.reduce((acc, sub) => {
      acc[sub.status] = (acc[sub.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    submissions_by_category: submissions.reduce((acc, sub) => {
      acc[sub.category] = (acc[sub.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    total_tasks: tasks.length,
    tasks_by_status: tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    tasks_by_priority: tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    total_scores: scores.length,
    recent_activity: {
      submissions_last_7_days: submissions.filter((sub) => new Date(sub.created_at) > recentThreshold).length,
      tasks_last_7_days: tasks.filter((task) => new Date(task.created_at) > recentThreshold).length,
      scores_last_7_days: scores.filter((score) => new Date(score.created_at) > recentThreshold).length,
    },
  };
};

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
  const [tasks, setTasks]             = useState<Task[]>([]);
  const [users, setUsers]             = useState<User[]>([]);
  const [scores, setScores]           = useState<ScoreRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [fetchState, setFetchState]   = useState<FetchState>({ tasksAvailable: true, userDirectoryAvailable: true });
  const [activeTab, setActiveTab]     = useState<"overview" | "submissions" | "tasks" | "assign" | "report">("overview");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [search, setSearch]           = useState("");
  const [darkMode, setDarkMode]       = useState(() => localStorage.getItem("adminDarkMode") === "true");

  // Dialog states
  const [editSubmission, setEditSubmission] = useState<Submission | null>(null);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    submission_id: "",
    priority: "medium",
    due_date: ""
  });

  const report = useMemo(() => buildReport(submissions, tasks, scores), [submissions, tasks, scores]);

  useEffect(() => {
    const el = document.documentElement;
    if (darkMode) el.classList.add("dark"); else el.classList.remove("dark");
    return () => el.classList.remove("dark");
  }, [darkMode]);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setAccess("denied"); return; }
    if (role === null) return;
    if (role === "coordinator") { if (access !== "granted") { setAccess("granted"); fetchData(); } }
    else { setAccess("denied"); }
  }, [authLoading, user, role, access]);

  useEffect(() => {
    if (access === "denied") navigate("/login", { replace: true });
  }, [access, navigate]);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [subRes, taskRes, userRes, scoreRes] = await Promise.all([
        supabase.from("submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("tasks").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role, email").in("role", ["user", "super_admin"]),
        supabase.from("project_scores").select("created_at, submission_id, innovation, impact, technical_quality, relevance"),
      ]);

      if (subRes.error) throw subRes.error;
      setSubmissions(subRes.data as Submission[]);

      const nextFetchState: FetchState = {
        tasksAvailable: true,
        userDirectoryAvailable: true,
      };

      if (taskRes.error) {
        if (!isMissingDbObjectError(taskRes.error)) throw taskRes.error;
        nextFetchState.tasksAvailable = false;
        setTasks([]);
      } else {
        setTasks(taskRes.data as Task[]);
      }

      if (userRes.error) {
        if (isMissingDbObjectError(userRes.error)) {
          const fallbackUserRes = await supabase
            .from("user_roles")
            .select("user_id, role")
            .in("role", ["user", "super_admin"]);

          if (fallbackUserRes.error) {
            nextFetchState.userDirectoryAvailable = false;
            setUsers([]);
          } else {
            setUsers(fallbackUserRes.data as User[]);
          }
        } else {
          nextFetchState.userDirectoryAvailable = false;
          setUsers([]);
        }
      } else {
        setUsers(userRes.data as User[]);
      }

      if (scoreRes.error) {
        setScores([]);
      } else {
        setScores(scoreRes.data as ScoreRow[]);
      }

      setFetchState(nextFetchState);

      if (!nextFetchState.tasksAvailable || !nextFetchState.userDirectoryAvailable) {
        toast({
          title: "Coordinator dashboard loaded with limited data.",
          description: !nextFetchState.tasksAvailable
            ? "The tasks table is not available in Supabase yet."
            : "The staff directory is missing some columns, so user assignment options are limited.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
      toast({ title: "Failed to load data.", variant: "destructive" });
    } finally {
      setDataLoading(false);
    }
  }, [toast]);

  const updateSubmission = async (id: string, updates: Partial<Submission>) => {
    const allowedFields = ["status", "admin_feedback"] as const;
    const filteredUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (allowedFields.includes(key as typeof allowedFields[number])) {
        acc[key as keyof Submission] = value;
      }
      return acc;
    }, {} as Partial<Submission>);

    try {
      const { data, error } = await supabase
        .from("submissions")
        .update(filteredUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      toast({ title: "Submission updated successfully." });
      fetchData();
      setEditSubmission(null);
    } catch (err) {
      console.error("Submission update failed:", err);
      toast({ title: "Failed to update submission.", variant: "destructive" });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const allowedFields = ["status", "priority", "due_date"] as const;
    const filteredUpdates = Object.entries(updates).reduce((acc, [key, value]) => {
      if (allowedFields.includes(key as typeof allowedFields[number])) {
        acc[key as keyof Task] = value;
      }
      return acc;
    }, {} as Partial<Task>);

    try {
      const { data, error } = await supabase
        .from("tasks")
        .update(filteredUpdates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      toast({ title: "Task updated successfully." });
      fetchData();
      setEditTask(null);
    } catch (err) {
      console.error("Task update failed:", err);
      toast({ title: "Failed to update task.", variant: "destructive" });
    }
  };

  const assignTask = async () => {
    if (!fetchState.tasksAvailable) {
      toast({
        title: "Tasks are not available in the database yet.",
        description: "Run the coordinator Supabase migration before assigning tasks.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: newTask.title,
          description: newTask.description,
          assigned_to: newTask.assigned_to || null,
          assigned_by: user?.id || null,
          submission_id: newTask.submission_id || null,
          priority: newTask.priority,
          due_date: newTask.due_date || null,
        })
        .select();

      if (error) throw error;
      toast({ title: "Task assigned successfully." });
      fetchData();
      setNewTask({ title: "", description: "", assigned_to: "", submission_id: "", priority: "medium", due_date: "" });
    } catch (err) {
      console.error("Task assignment failed:", err);
      toast({ title: "Failed to assign task.", variant: "destructive" });
    }
  };

  const scoreMap = useMemo(() => {
    return scores.reduce((map, score) => {
      const total = score.innovation + score.impact + score.technical_quality + score.relevance;
      const current = map[score.submission_id] ?? { score_count: 0, total_score: 0 };
      return {
        ...map,
        [score.submission_id]: {
          score_count: current.score_count + 1,
          total_score: current.total_score + total,
        },
      };
    }, {} as Record<string, { score_count: number; total_score: number }>);
  }, [scores]);

  const assigneeLabelMap = useMemo(
    () =>
      users.reduce<Record<string, string>>((acc, currentUser) => {
        acc[currentUser.user_id] = currentUser.email || currentUser.user_id;
        return acc;
      }, {}),
    [users]
  );

  const scoredByCategory = (cat: string) =>
    submissions.filter((s) => s.category === cat && (scoreMap[s.id]?.score_count ?? 0) > 0).length;

  const filteredSubmissions = submissions.filter((s) => {
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
          <Button variant="outline" size="sm" onClick={() => { fetchData(); }} disabled={dataLoading}>
            {dataLoading ? "Loading..." : "Refresh"}
          </Button>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 w-fit overflow-x-auto">
          {[
            { key: "overview", label: "Overview", icon: BarChart3 },
            { key: "submissions", label: "Submissions", icon: FileText },
            { key: "tasks", label: "Tasks", icon: CheckCircle2 },
            { key: "assign", label: "Assign Task", icon: UserPlus },
            { key: "report", label: "Report", icon: FileBarChart }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key as any); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === key
                  ? "bg-purple-600 text-white"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Submissions", value: submissions.length, icon: FileText, color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
                { label: "Active Tasks", value: tasks.filter(t => t.status !== 'completed').length, icon: CheckCircle2, color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
                { label: "Pending Tasks", value: tasks.filter(t => t.status === 'pending').length, icon: Clock, color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
                { label: "Users", value: users.length, icon: Trophy, color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="h-4.5 w-4.5" />
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Submissions</h3>
                <div className="space-y-3">
                  {submissions.slice(0, 5).map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{sub.project_title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{sub.full_name} • {new Date(sub.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        sub.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                        sub.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  ))}
                  {submissions.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No submissions yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Tasks</h3>
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Assigned to: {task.assigned_to} • {new Date(task.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                        task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                  {tasks.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">No tasks yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

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
                        {["Project", "Team / School", "Category", "Status", "Feedback", "Actions"].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub, i) => (
                        <tr key={sub.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${i < filteredSubmissions.length - 1 ? "border-b border-slate-50 dark:border-slate-800" : ""}`}>
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
                            <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                              sub.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                              sub.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                              sub.status === 'winner' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-slate-50 text-slate-700 border-slate-200'
                            }`}>
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{sub.admin_feedback || "—"}</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <Button variant="outline" size="sm" onClick={() => setEditSubmission(sub)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredSubmissions.length === 0 && (
                    <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">No projects found.</div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "tasks" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {!fetchState.tasksAvailable && (
              <div className="border-b border-amber-200 bg-amber-50 px-5 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                The `tasks` table is not available in Supabase yet. Apply the coordinator migration to enable task management.
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-700/50">
                    {["Title", "Assigned To", "Status", "Priority", "Due Date", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task, i) => (
                    <tr key={task.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${i < tasks.length - 1 ? "border-b border-slate-50 dark:border-slate-800" : ""}`}>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{task.title}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{task.description}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">{task.assigned_to ? assigneeLabelMap[task.assigned_to] ?? task.assigned_to : "Unassigned"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          task.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          task.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          task.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
                          task.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {task.due_date ? new Date(task.due_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <Button variant="outline" size="sm" onClick={() => setEditTask(task)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tasks.length === 0 && (
                <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">No tasks found.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "assign" && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Assign New Task</h3>
            {!fetchState.tasksAvailable && (
              <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                Task assignment is disabled until the `tasks` table exists in Supabase.
              </div>
            )}
            {!fetchState.userDirectoryAvailable && (
              <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                The staff directory is partially available. User IDs will be shown where email addresses are missing.
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Task Title" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} />
              <Select value={newTask.assigned_to} onValueChange={(value) => setNewTask({...newTask, assigned_to: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to User" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === 'user').map(u => (
                    <SelectItem key={u.user_id} value={u.user_id}>{u.email ?? u.user_id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newTask.submission_id} onValueChange={(value) => setNewTask({...newTask, submission_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Related Submission (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {submissions.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.project_title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} className="md:col-span-2" />
              <Input type="date" placeholder="Due Date" value={newTask.due_date} onChange={(e) => setNewTask({...newTask, due_date: e.target.value})} />
            </div>
            <Button onClick={assignTask} className="mt-4" disabled={!fetchState.tasksAvailable || !newTask.title || !newTask.assigned_to}>
              <Plus className="h-4 w-4 mr-2" /> Assign Task
            </Button>
          </div>
        )}

        {activeTab === "report" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Activity Summary Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">Submissions</h4>
                  <p>Total: {report.total_submissions}</p>
                  <p>By Status: {JSON.stringify(report.submissions_by_status)}</p>
                  <p>By Category: {JSON.stringify(report.submissions_by_category)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">Tasks</h4>
                  <p>Total: {report.total_tasks}</p>
                  <p>By Status: {JSON.stringify(report.tasks_by_status)}</p>
                  <p>By Priority: {JSON.stringify(report.tasks_by_priority)}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300">Recent Activity (7 days)</h4>
                  <p>Submissions: {report.recent_activity.submissions_last_7_days}</p>
                  <p>Tasks: {report.recent_activity.tasks_last_7_days}</p>
                  <p>Scores: {report.recent_activity.scores_last_7_days}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Submission Dialog */}
      <Dialog open={!!editSubmission} onOpenChange={() => setEditSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
          </DialogHeader>
          {editSubmission && (
            <div className="space-y-4">
              <Select value={editSubmission.status} onValueChange={(value) => setEditSubmission({...editSubmission, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Textarea placeholder="Admin Feedback" value={editSubmission.admin_feedback || ""} onChange={(e) => setEditSubmission({...editSubmission, admin_feedback: e.target.value})} />
              <Button onClick={() => updateSubmission(editSubmission.id, { status: editSubmission.status, admin_feedback: editSubmission.admin_feedback })}>
                Update
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={!!editTask} onOpenChange={() => setEditTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editTask && (
            <div className="space-y-4">
              <Select value={editTask.status} onValueChange={(value) => setEditTask({...editTask, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={editTask.priority} onValueChange={(value) => setEditTask({...editTask, priority: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              <Input type="date" value={editTask.due_date || ""} onChange={(e) => setEditTask({...editTask, due_date: e.target.value})} />
              <Button onClick={() => updateTask(editTask.id, { status: editTask.status, priority: editTask.priority, due_date: editTask.due_date })}>
                Update
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <StaffInbox />
    </div>
  );
};

export default CoordinatorDashboard;
