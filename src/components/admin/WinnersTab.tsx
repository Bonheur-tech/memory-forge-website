import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { RankingRow, WinnerSelection, CATEGORIES } from "./types";
import { Trophy, Save, RefreshCw, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

const SCOPES = ["overall", ...CATEGORIES] as const;

const PLACEMENT_LABELS: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: "1st Place", emoji: "🥇", color: "border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20" },
  2: { label: "2nd Place", emoji: "🥈", color: "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/40" },
  3: { label: "3rd Place", emoji: "🥉", color: "border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/20" },
};

export const WinnersTab = () => {
  const { user }  = useAuth();
  const { toast } = useToast();

  const [rankings,  setRankings]  = useState<RankingRow[]>([]);
  const [winners,   setWinners]   = useState<WinnerSelection[]>([]);
  const [scope,     setScope]     = useState<string>("overall");
  const [loading,   setLoading]   = useState(false);
  const [saving,    setSaving]    = useState<number | null>(null);

  // Selections per placement for current scope
  const [selections, setSelections] = useState<Record<number, string>>({ 1: "", 2: "", 3: "" });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rankRes, winRes] = await Promise.all([
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (supabase as any).rpc("get_rankings", { p_category: scope === "overall" ? null : scope }),
        supabase.from("winner_selections").select("*"),
      ]);
      if (rankRes.data) setRankings(rankRes.data as RankingRow[]);
      if (winRes.data) setWinners(winRes.data as WinnerSelection[]);
    } catch {
      toast({ title: "Failed to load data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [scope, toast]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Sync form selections from DB for current scope
  useEffect(() => {
    const scopeWinners = winners.filter((w) => w.scope === scope);
    const map: Record<number, string> = { 1: "", 2: "", 3: "" };
    for (const w of scopeWinners) map[w.placement] = w.submission_id;
    setSelections(map);
  }, [winners, scope]);

  const handleSave = async (placement: 1 | 2 | 3) => {
    const submissionId = selections[placement];
    if (!submissionId) {
      toast({ title: "Select a project first.", variant: "destructive" });
      return;
    }
    setSaving(placement);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("winner_selections") as any).upsert(
        {
          submission_id: submissionId,
          placement,
          scope,
          selected_by: user?.id ?? null,
        },
        { onConflict: "placement,scope" }
      );
      if (error) throw error;
      toast({ title: `${PLACEMENT_LABELS[placement].label} saved!` });
      // Also mark the submission as winner
      await supabase.from("submissions").update({ status: "winner" }).eq("id", submissionId);
      await fetchData();
    } catch {
      toast({ title: "Failed to save winner.", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const handleRemove = async (placement: 1 | 2 | 3) => {
    setSaving(placement);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase.from("winner_selections") as any)
        .delete()
        .eq("placement", placement)
        .eq("scope", scope);
      if (error) throw error;
      toast({ title: "Winner removed." });
      await fetchData();
    } catch {
      toast({ title: "Failed to remove winner.", variant: "destructive" });
    } finally {
      setSaving(null);
    }
  };

  const currentWinners = winners.filter((w) => w.scope === scope);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Winner Selection
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Select 1st, 2nd, and 3rd place winners
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading} className="gap-1.5">
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Scope selector */}
      <div className="flex flex-wrap gap-2">
        {SCOPES.map((s) => (
          <button
            key={s}
            onClick={() => setScope(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              scope === s
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600"
            }`}
          >
            {s === "overall" ? "Overall" : s}
          </button>
        ))}
      </div>

      {/* Current winners display */}
      {currentWinners.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-5">
          <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-3">
            Current Winners — {scope === "overall" ? "Overall" : scope}
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            {([1, 2, 3] as const).map((p) => {
              const w = currentWinners.find((x) => x.placement === p);
              const r = w ? rankings.find((rk) => rk.submission_id === w.submission_id) : null;
              const meta = PLACEMENT_LABELS[p];
              return (
                <div key={p} className={`rounded-lg border p-3 ${meta.color}`}>
                  <div className="text-xl mb-1">{meta.emoji}</div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{meta.label}</p>
                  {r ? (
                    <>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1 truncate">{r.project_title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{r.team_name}</p>
                      <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1">
                        Score: {Number(r.avg_score).toFixed(2)}
                      </p>
                    </>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1">Not selected</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Placement selection forms */}
      <div className="grid gap-4">
        {([1, 2, 3] as const).map((placement) => {
          const meta = PLACEMENT_LABELS[placement];
          const current = selections[placement];
          return (
            <div key={placement} className={`rounded-xl border-2 p-5 ${meta.color}`}>
              <div className="flex items-center gap-2 mb-4">
                <Medal className="h-5 w-5 text-amber-500" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  {meta.emoji} {meta.label}
                </h3>
              </div>

              <div className="flex gap-3">
                <select
                  value={current}
                  onChange={(e) => setSelections((s) => ({ ...s, [placement]: e.target.value }))}
                  className="flex-1 h-10 px-3 text-sm border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-purple-400 dark:focus:border-purple-500"
                >
                  <option value="">— Select a project —</option>
                  {rankings.map((r) => (
                    <option key={r.submission_id} value={r.submission_id}>
                      #{r.overall_rank} · {r.project_title} ({r.team_name}) — {Number(r.avg_score).toFixed(2)} avg
                    </option>
                  ))}
                </select>

                <Button
                  onClick={() => handleSave(placement)}
                  disabled={saving === placement || !current}
                  className="gap-1.5 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Save className="h-3.5 w-3.5" />
                  {saving === placement ? "Saving…" : "Save"}
                </Button>

                {winners.find((w) => w.placement === placement && w.scope === scope) && (
                  <Button
                    variant="outline"
                    onClick={() => handleRemove(placement)}
                    disabled={saving === placement}
                    className="text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Remove
                  </Button>
                )}
              </div>

              {/* Ranked list hint */}
              {rankings.length > 0 && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Top ranked: {rankings.slice(0, 3).map((r, i) =>
                    `#${i + 1} ${r.project_title} (${Number(r.avg_score).toFixed(1)})`
                  ).join(" · ")}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
