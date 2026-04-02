import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Save, AlertCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { CompSetting } from "./types";

interface Props {
  settings: CompSetting[];
  onUpdateSetting: (key: string, value: string) => Promise<void>;
}

/** Convert an ISO datetime string (e.g. '2026-04-09T18:00:00+02:00') to
 *  the value format expected by <input type="datetime-local"> ('YYYY-MM-DDTHH:mm')
 */
const toDatetimeLocal = (iso: string): string => {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    // Format as local datetime string without seconds
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return "";
  }
};

/** Keys that represent date/time values */
const DATE_KEYS: { key: string; label: string; description: string }[] = [
  { key: "event_start",          label: "Hackathon Start Date",     description: "When the hackathon officially begins"       },
  { key: "event_end",            label: "Hackathon End Date",       description: "When the hackathon closes"                  },
  { key: "submission_deadline",  label: "Submission Deadline",      description: "Last time for teams to submit projects"      },
  { key: "registration_close",   label: "Registration Close Date",  description: "When participant registration closes"       },
  { key: "judging_start",        label: "Judging Period Start",     description: "When judges begin evaluating submissions"    },
  { key: "winner_announcement",  label: "Winner Announcement Date", description: "When winners will be publicly announced"     },
];

export const CompetitionTab = ({ settings, onUpdateSetting }: Props) => {
  const { toast } = useToast();
  const [local, setLocal]   = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Sync props → local state
  useEffect(() => {
    const map: Record<string, string> = {};
    settings.forEach((s) => { map[s.key] = s.value; });
    setLocal(map);
  }, [settings]);

  const get = (key: string) => local[key] ?? "";
  const set = (key: string, val: string) => setLocal((p) => ({ ...p, [key]: val }));

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Persist every setting in parallel
      await Promise.all(
        Object.entries(local).map(([key, value]) => onUpdateSetting(key, value))
      );
      toast({
        title: "Competition settings saved!",
        description: "All dates and settings have been updated successfully.",
      });
    } catch {
      toast({ title: "Failed to save some settings. Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const registrationOpen = get("registration_open") === "true";
  const phase            = get("competition_phase") || "registration";

  return (
    <div className="space-y-6">
      {/* ── Status toggles ────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-5">
          Live Status
        </h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Registration open toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Registration</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {registrationOpen ? "Currently open" : "Currently closed"}
              </p>
            </div>
            <button
              onClick={() => set("registration_open", registrationOpen ? "false" : "true")}
              className="flex items-center transition-colors"
              title="Toggle registration"
            >
              {registrationOpen ? (
                <ToggleRight className="h-8 w-8 text-emerald-500" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-slate-400" />
              )}
            </button>
          </div>

          {/* Competition phase */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">Competition Phase</p>
            <Select value={phase} onValueChange={(v) => set("competition_phase", v)}>
              <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="registration">Registration</SelectItem>
                <SelectItem value="hackathon">Hackathon</SelectItem>
                <SelectItem value="judging">Judging</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ── Date/time pickers ─────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            Event Timeline
          </h3>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {DATE_KEYS.map(({ key, label, description }) => {
            const currentVal = get(key);
            const localVal   = toDatetimeLocal(currentVal);
            return (
              <div key={key}>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {label}
                </label>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">{description}</p>
                <input
                  type="datetime-local"
                  value={localVal}
                  onChange={(e) => {
                    // Store as ISO string
                    const iso = e.target.value ? new Date(e.target.value).toISOString() : "";
                    set(key, iso);
                  }}
                  className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 dark:focus:border-purple-600 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                />
              </div>
            );
          })}

          {/* Max team size */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Max Team Size
            </label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mb-2">Maximum members per team</p>
            <input
              type="number"
              min={1}
              max={20}
              value={get("max_team_size") || "5"}
              onChange={(e) => set("max_team_size", e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 dark:focus:border-purple-600 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* ── Info note ─────────────────────────────── */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50/60 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/40 text-sm">
        <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-blue-700 dark:text-blue-300 leading-relaxed">
          Saving will update the public-facing countdown timer and timeline page.
          Changes take effect immediately.
        </p>
      </div>

      {/* ── Save button ───────────────────────────── */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveAll}
          disabled={saving}
          className="gap-2 bg-purple-600 hover:bg-purple-700 text-white px-8"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving…" : "Save All Settings"}
        </Button>
      </div>
    </div>
  );
};
