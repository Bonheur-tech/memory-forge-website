import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RankingRow, CATEGORIES } from "./types";
import { BarChart3, Trophy, RefreshCw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_OPTIONS = ["All Categories", ...CATEGORIES] as const;

const medalColor = (rank: number) => {
  if (rank === 1) return "text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700";
  if (rank === 2) return "text-slate-500 bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-600";
  if (rank === 3) return "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700";
  return "text-slate-500 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700";
};

const ScoreBar = ({ score }: { score: number }) => (
  <div className="flex items-center gap-2">
    <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
      <div
        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
        style={{ width: `${(score / 10) * 100}%` }}
      />
    </div>
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right">
      {score.toFixed(1)}
    </span>
  </div>
);

export const RankingsTab = () => {
  const { toast } = useToast();
  const [rankings, setRankings]       = useState<RankingRow[]>([]);
  const [loading, setLoading]         = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All Categories");

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any).rpc("get_rankings", {
        p_category: categoryFilter === "All Categories" ? null : categoryFilter,
      });
      if (error) throw error;
      setRankings((data as RankingRow[]) ?? []);
    } catch {
      toast({ title: "Failed to load rankings.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, toast]);

  useEffect(() => { fetchRankings(); }, [fetchRankings]);

  const totalScored = rankings.filter((r) => r.score_count > 0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-purple-500" />
            Live Rankings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {rankings.length} projects · {totalScored} scored
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Category filter */}
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 h-9">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm text-slate-700 dark:text-slate-300 bg-transparent border-none outline-none cursor-pointer"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRankings}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Top 3 podium */}
      {rankings.length >= 3 && rankings[0].score_count > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[rankings[1], rankings[0], rankings[2]].map((r, podiumIdx) => {
            const places = [2, 1, 3];
            const place = places[podiumIdx];
            const heights = ["h-28", "h-36", "h-24"];
            return (
              <div
                key={r.submission_id}
                className={`${heights[podiumIdx]} rounded-xl border p-4 flex flex-col justify-end ${medalColor(place)}`}
              >
                <div className="text-2xl font-bold mb-1">
                  {place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉"}
                </div>
                <p className="text-xs font-bold truncate">{r.project_title}</p>
                <p className="text-[10px] opacity-70 truncate">{r.team_name}</p>
                <p className="text-lg font-black mt-1">{r.avg_score.toFixed(2)}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Full leaderboard table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            Full Leaderboard
          </h3>
        </div>

        {loading ? (
          <div className="py-16 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-purple-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : rankings.length === 0 ? (
          <div className="py-16 text-center">
            <Trophy className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400 dark:text-slate-500">No projects to rank yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700/50">
                  {["Rank", "Project", "Team", "Category", "Avg Score", "Judges"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rankings.map((row, i) => (
                  <tr
                    key={row.submission_id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      i < rankings.length - 1 ? "border-b border-slate-50 dark:border-slate-800" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border ${medalColor(Number(row.overall_rank))}`}>
                        {row.overall_rank}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                        {row.project_title}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-slate-500 dark:text-slate-400 truncate max-w-[120px] text-xs">
                        {row.team_name}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 w-40">
                      {row.score_count > 0 ? (
                        <ScoreBar score={Number(row.avg_score)} />
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500">Not scored</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {row.score_count} judge{row.score_count !== 1 ? "s" : ""}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
