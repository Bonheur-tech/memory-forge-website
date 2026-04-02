/**
 * Admin Dashboard — Never Again AI Hackathon
 * ─────────────────────────────────────────────────────────────────────────────
 * Roles: admin, super_admin
 * Sections: Overview, Submissions, Messages, Competition, Rankings, Winners, Settings
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FileText, MessageSquare, Trophy, Clock, TrendingUp, BarChart3 } from "lucide-react";

import { AdminSidebar }   from "@/components/admin/AdminSidebar";
import { AdminHeader }    from "@/components/admin/AdminHeader";
import { SubmissionsTab } from "@/components/admin/SubmissionsTab";
import { MessagesTab }    from "@/components/admin/MessagesTab";
import { CompetitionTab } from "@/components/admin/CompetitionTab";
import { SettingsTab }    from "@/components/admin/SettingsTab";
import { RankingsTab }    from "@/components/admin/RankingsTab";
import { WinnersTab }     from "@/components/admin/WinnersTab";
import { Submission, Message, CompSetting, AdminSection } from "@/components/admin/types";

// ── Helpers ──────────────────────────────────────────────────────────────────

const normalizeSubmission = (row: Record<string, unknown>): Submission => ({
  id:             String(row.id             ?? ""),
  full_name:      String(row.full_name      ?? ""),
  school:         String(row.school         ?? ""),
  email:          String(row.email          ?? ""),
  project_title:  String(row.project_title  ?? ""),
  category:       String(row.category       ?? ""),
  description:    String(row.description    ?? ""),
  github_link:    row.github_link != null ? String(row.github_link) : null,
  file_url:       row.file_url    != null ? String(row.file_url)    : null,
  status:         String(row.status         ?? "pending"),
  score:          row.score       != null ? Number(row.score)       : null,
  admin_feedback: row.admin_feedback != null ? String(row.admin_feedback) : null,
  created_at:     String(row.created_at     ?? ""),
  updated_at:     String(row.updated_at     ?? ""),
});

const normalizeMessage = (row: Record<string, unknown>): Message => ({
  id:          String(row.id          ?? ""),
  name:        String(row.name        ?? ""),
  email:       String(row.email       ?? ""),
  subject:     String(row.subject     ?? ""),
  message:     String(row.message     ?? ""),
  is_read:     Boolean(row.is_read),
  admin_reply: row.admin_reply  != null ? String(row.admin_reply)  : null,
  replied_at:  row.replied_at   != null ? String(row.replied_at)   : null,
  created_at:  String(row.created_at  ?? ""),
});

// ── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({
  label, value, icon: Icon, color, trend,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  trend?: string;
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-md dark:hover:shadow-slate-800/50 transition-shadow">
    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{label}</p>
      {trend && (
        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 mt-0.5">
          <TrendingUp className="h-3 w-3" /> {trend}
        </p>
      )}
    </div>
  </div>
);

// ── Main component ────────────────────────────────────────────────────────────

const Admin = () => {
  const { user, role, loading: authLoading, signOut } = useAuth();
  const navigate  = useNavigate();
  const { toast } = useToast();

  const [access, setAccess]             = useState<"checking" | "granted" | "denied">("checking");
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("adminDarkMode") === "true");

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [messages,    setMessages]    = useState<Message[]>([]);
  const [settings,    setSettings]    = useState<CompSetting[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Dark mode
  useEffect(() => {
    const el = document.documentElement;
    if (darkMode) el.classList.add("dark"); else el.classList.remove("dark");
    return () => el.classList.remove("dark");
  }, [darkMode]);

  const toggleDark = () => setDarkMode((d) => {
    const next = !d;
    localStorage.setItem("adminDarkMode", String(next));
    return next;
  });

  // Auth check — accept admin or super_admin
  useEffect(() => {
    if (authLoading) return;
    if (!user) { setAccess("denied"); return; }
    if (role === null) return; // user authenticated but role still resolving — stay "checking"
    if (role === "admin" || role === "super_admin") {
      if (access !== "granted") { setAccess("granted"); fetchAll(); }
    } else {
      setAccess("denied");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, role]);

  useEffect(() => {
    if (access === "denied") navigate("/login", { replace: true });
  }, [access, navigate]);

  // Data fetching
  const fetchAll = useCallback(async () => {
    setDataLoading(true);
    try {
      const [subRes, msgRes, setRes] = await Promise.all([
        supabase.from("submissions").select("*").order("created_at", { ascending: false }),
        supabase.from("messages").select("*").order("created_at", { ascending: false }),
        supabase.from("competition_settings").select("*"),
      ]);
      if (subRes.data) setSubmissions(subRes.data.map((r) => normalizeSubmission(r as Record<string, unknown>)));
      if (msgRes.data) setMessages(msgRes.data.map((r) => normalizeMessage(r as Record<string, unknown>)));
      if (setRes.data) setSettings(setRes.data as CompSetting[]);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  // Submission actions
  const updateSubmission = useCallback(async (id: string, changes: Partial<Submission>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("submissions") as any).update(changes).eq("id", id);
    if (error) { toast({ title: "Failed to update submission.", variant: "destructive" }); return; }
    setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, ...changes } : s)));
  }, [toast]);

  const deleteSubmission = useCallback(async (id: string) => {
    const { error } = await supabase.from("submissions").delete().eq("id", id);
    if (!error) { setSubmissions((prev) => prev.filter((s) => s.id !== id)); toast({ title: "Submission deleted." }); }
  }, [toast]);

  // Message actions
  const toggleRead = useCallback(async (id: string, current: boolean) => {
    const { error } = await supabase.from("messages").update({ is_read: !current }).eq("id", id);
    if (!error) setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: !current } : m)));
  }, []);

  const deleteMessage = useCallback(async (id: string) => {
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) { setMessages((prev) => prev.filter((m) => m.id !== id)); toast({ title: "Message deleted." }); }
  }, [toast]);

  const updateMessage = useCallback(async (id: string, changes: Partial<Message>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("messages") as any).update(changes).eq("id", id);
    if (!error) setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...changes } : m)));
  }, []);

  // Settings
  const updateSetting = useCallback(async (key: string, value: string) => {
    const { error } = await supabase.from("competition_settings").update({ value }).eq("key", key);
    if (!error) setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, value } : s)));
  }, []);

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const pendingCount  = submissions.filter((s) => s.status === "pending").length;
  const unreadCount   = messages.filter((m) => !m.is_read).length;
  const winnerCount   = submissions.filter((s) => s.status === "winner").length;
  const notifications = pendingCount + unreadCount;

  if (access === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-purple-500" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p className="text-sm text-slate-500 dark:text-slate-400">Verifying access…</p>
        </div>
      </div>
    );
  }
  if (access === "denied") return null;

  return (
    <div className="flex bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">

      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        unreadMessages={unreadCount}
        pendingSubmissions={pendingCount}
        userEmail={user?.email ?? ""}
        onSignOut={handleSignOut}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex flex-col flex-1 min-w-0 min-h-screen overflow-hidden">
        <AdminHeader
          activeSection={activeSection}
          darkMode={darkMode}
          onToggleDark={toggleDark}
          notifications={notifications}
          userEmail={user?.email ?? ""}
          onMobileMenuOpen={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Overview */}
          {activeSection === "overview" && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Submissions" value={submissions.length} icon={FileText}      color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
                <StatCard label="Pending Review"    value={pendingCount}       icon={Clock}         color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" trend={pendingCount > 0 ? "Needs attention" : undefined} />
                <StatCard label="Unread Messages"   value={unreadCount}        icon={MessageSquare} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
                <StatCard label="Winners Selected"  value={winnerCount}        icon={Trophy}        color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {([
                  { id: "submissions" as AdminSection, label: "Review Submissions", sub: `${submissions.length} total · ${pendingCount} pending`, icon: FileText,  color: "text-purple-500" },
                  { id: "rankings"    as AdminSection, label: "Live Rankings",      sub: "See project leaderboard",                                icon: BarChart3, color: "text-blue-500"   },
                  { id: "winners"     as AdminSection, label: "Select Winners",     sub: "Pick 1st, 2nd, 3rd place",                               icon: Trophy,   color: "text-amber-500"  },
                ] as { id: AdminSection; label: string; sub: string; icon: React.ElementType; color: string }[]).map(
                  ({ id, label, sub, icon: Icon, color }) => (
                    <button
                      key={id}
                      onClick={() => setActiveSection(id)}
                      className="text-left p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-200 dark:hover:border-purple-700 hover:shadow-md transition-all group"
                    >
                      <Icon className={`h-5 w-5 ${color} mb-3 group-hover:scale-110 transition-transform`} />
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>
                    </button>
                  )
                )}
              </div>

              {/* Recent submissions */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
                  <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">Recent Submissions</h2>
                  <button onClick={() => setActiveSection("submissions")} className="text-xs text-purple-600 dark:text-purple-400 hover:underline">View all →</button>
                </div>
                {submissions.slice(0, 5).map((sub, i) => (
                  <div key={sub.id} className={`flex items-center gap-4 px-5 py-3.5 text-sm ${i < Math.min(submissions.length, 5) - 1 ? "border-b border-slate-50 dark:border-slate-800" : ""}`}>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {sub.full_name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate">{sub.project_title}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{sub.full_name} · {sub.school}</p>
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                      {new Date(sub.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                ))}
                {submissions.length === 0 && (
                  <div className="py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                    {dataLoading ? "Loading…" : "No submissions yet."}
                  </div>
                )}
              </div>
            </>
          )}

          {activeSection === "submissions" && (
            <SubmissionsTab submissions={submissions} loading={dataLoading} onUpdate={updateSubmission} onDelete={deleteSubmission} />
          )}

          {activeSection === "messages" && (
            <MessagesTab messages={messages} loading={dataLoading} onToggleRead={toggleRead} onDelete={deleteMessage} onUpdate={updateMessage} />
          )}

          {activeSection === "competition" && (
            <CompetitionTab settings={settings} onUpdateSetting={updateSetting} />
          )}

          {activeSection === "rankings" && <RankingsTab />}

          {activeSection === "winners" && <WinnersTab />}

          {activeSection === "settings" && <SettingsTab userEmail={user?.email ?? ""} />}

        </main>
      </div>
    </div>
  );
};

export default Admin;
