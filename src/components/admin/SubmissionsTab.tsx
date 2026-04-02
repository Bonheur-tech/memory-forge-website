import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search, Eye, Trash2, ArrowUpDown, ChevronUp, ChevronDown,
  Trophy, Star, FileText,
} from "lucide-react";
import { Submission, STATUS_META } from "./types";
import { SubmissionReviewModal } from "./SubmissionReviewModal";

interface Props {
  submissions: Submission[];
  loading: boolean;
  onUpdate: (id: string, changes: Partial<Submission>) => void;
  onDelete: (id: string) => void;
}

type SortKey = "created_at" | "project_title" | "full_name" | "status" | "score";
type SortDir = "asc" | "desc";

const CATEGORIES = [
  "All Categories",
  "AI & Machine Learning",
  "Web & Mobile Development",
  "Cybersecurity & Anti-Hate Tech",
];

export const SubmissionsTab = ({ submissions, loading, onUpdate, onDelete }: Props) => {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [sortKey, setSortKey]         = useState<SortKey>("created_at");
  const [sortDir, setSortDir]         = useState<SortDir>("desc");
  const [reviewing, setReviewing]     = useState<Submission | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    return submissions
      .filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          s.full_name.toLowerCase().includes(q) ||
          s.project_title.toLowerCase().includes(q) ||
          s.school.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q);
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        const matchCat    = categoryFilter === "All Categories" || s.category === categoryFilter;
        return matchSearch && matchStatus && matchCat;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        if (sortKey === "score") return dir * ((a.score ?? -1) - (b.score ?? -1));
        const av = a[sortKey as keyof Submission] ?? "";
        const bv = b[sortKey as keyof Submission] ?? "";
        return dir * String(av).localeCompare(String(bv));
      });
  }, [submissions, search, statusFilter, categoryFilter, sortKey, sortDir]);

  const SortBtn = ({ col, label }: { col: SortKey; label: string }) => (
    <button
      onClick={() => toggleSort(col)}
      className="flex items-center gap-1 text-left hover:text-slate-900 dark:hover:text-white transition-colors group"
    >
      {label}
      <span className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400">
        {sortKey === col ? (
          sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />
        ) : (
          <ArrowUpDown className="h-3 w-3" />
        )}
      </span>
    </button>
  );

  return (
    <div className="space-y-4">
      {/* ── Filters ──────────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Search by name, project, school…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="winner">Winner</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 px-1">
          {filtered.length} of {submissions.length} shown
        </div>
      </div>

      {/* ── Table ─────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-900">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_80px_80px] gap-4 px-5 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          <SortBtn col="project_title" label="Project / Student" />
          <SortBtn col="full_name"    label="School"   />
          <SortBtn col="status"       label="Status"   />
          <SortBtn col="score"        label="Score"    />
          <SortBtn col="created_at"   label="Date"     />
          <span>Actions</span>
        </div>

        {/* Rows */}
        {loading ? (
          <div className="flex items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-sm">
            <svg className="animate-spin h-5 w-5 mr-2 text-purple-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading submissions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-slate-500">
            <FileText className="h-8 w-8 opacity-40" />
            <p className="text-sm">No submissions match your filters.</p>
          </div>
        ) : (
          filtered.map((sub, i) => {
            const meta = STATUS_META[sub.status] ?? STATUS_META.pending;
            return (
              <div
                key={sub.id}
                className={`grid grid-cols-[2fr_1.5fr_1fr_1fr_80px_80px] gap-4 px-5 py-4 items-center text-sm transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40 ${
                  i < filtered.length - 1 ? "border-b border-slate-100 dark:border-slate-700/50" : ""
                }`}
              >
                {/* Project + student */}
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white truncate">
                    {sub.project_title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {sub.full_name} · {sub.email}
                  </p>
                </div>

                {/* School + category */}
                <div className="min-w-0">
                  <p className="text-slate-700 dark:text-slate-300 truncate">{sub.school}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{sub.category}</p>
                </div>

                {/* Status */}
                <div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-xs font-medium ${meta.color}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center gap-1.5">
                  {sub.score != null ? (
                    <>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{sub.score}</span>
                      <span className="text-slate-400 text-xs">/100</span>
                    </>
                  ) : (
                    <span className="text-slate-300 dark:text-slate-600 text-xs">—</span>
                  )}
                </div>

                {/* Date */}
                <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {new Date(sub.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setReviewing(sub)}
                    className="h-7 w-7 p-0 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    title="Review"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  {sub.status !== "winner" && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onUpdate(sub.id, { status: "winner" })}
                      className="h-7 w-7 p-0 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      title="Mark as winner"
                    >
                      <Trophy className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDelete(sub.id)}
                    className="h-7 w-7 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Review Modal ──────────────────────────────── */}
      {reviewing && (
        <SubmissionReviewModal
          submission={reviewing}
          onClose={() => setReviewing(null)}
          onUpdate={(id, changes) => {
            onUpdate(id, changes);
            setReviewing((prev) => (prev ? { ...prev, ...changes } : null));
          }}
        />
      )}

      {/* ── Delete Confirm ────────────────────────────── */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display font-bold text-slate-900 dark:text-white mb-2">Delete Submission?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              This action cannot be undone. The submission will be permanently removed.
            </p>
            <div className="flex gap-3">
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => { onDelete(confirmDelete); setConfirmDelete(null); }}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
