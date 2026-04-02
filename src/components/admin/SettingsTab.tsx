import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Settings2, Users, Bell, Upload, Mail, User, Shield, Plus, Trash2, Save,
} from "lucide-react";

const MOCK_ADMINS = [
  { email: "admin@neveragain-ai.rw",   role: "Super Admin" },
  { email: "judge@neveragain-ai.rw",   role: "Judge"       },
  { email: "coord@neveragain-ai.rw",   role: "Coordinator" },
];

/** Reads a boolean from localStorage, defaults to `defaultVal`. */
const readBool = (key: string, defaultVal: boolean): boolean => {
  const v = localStorage.getItem(key);
  return v === null ? defaultVal : v === "true";
};

export const SettingsTab = ({ userEmail }: { userEmail: string }) => {
  const { toast } = useToast();

  // General
  const [hackathonName, setHackathonName] = useState(
    localStorage.getItem("admin_hackathon_name") ?? "Never Again AI Hackathon 2026"
  );
  const [contactEmail, setContactEmail] = useState(
    localStorage.getItem("admin_contact_email") ?? "info@neveragain-ai.rw"
  );

  // Invite
  const [inviteEmail, setInviteEmail] = useState("");

  // Notifications
  const [notifyNewSubmission, setNotifyNewSubmission] = useState(
    readBool("admin_notify_submissions", true)
  );
  const [notifyNewMessage, setNotifyNewMessage] = useState(
    readBool("admin_notify_messages", true)
  );

  const saveGeneral = () => {
    localStorage.setItem("admin_hackathon_name",  hackathonName);
    localStorage.setItem("admin_contact_email",   contactEmail);
    toast({ title: "General settings saved." });
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    toast({
      title: `Invite sent to ${inviteEmail} (Demo Mode)`,
      description: "In production this would send an invitation email.",
    });
    setInviteEmail("");
  };

  const saveNotifications = () => {
    localStorage.setItem("admin_notify_submissions", String(notifyNewSubmission));
    localStorage.setItem("admin_notify_messages",    String(notifyNewMessage));
    toast({ title: "Notification preferences saved." });
  };

  return (
    <div className="space-y-6">
      {/* ── General ──────────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Settings2 className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            General
          </h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          {/* Hackathon name */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Hackathon Name
            </Label>
            <Input
              value={hackathonName}
              onChange={(e) => setHackathonName(e.target.value)}
              className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* Contact email */}
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Contact Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <Input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>

          {/* Logo upload (placeholder) */}
          <div className="sm:col-span-2 space-y-1.5">
            <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Hackathon Logo
            </Label>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0">
                <Upload className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => toast({ title: "Logo upload coming soon (Demo Mode)" })}
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Upload new logo
                </button>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">PNG, SVG, or JPEG — max 2 MB</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={saveGeneral} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="h-4 w-4" />
            Save General Settings
          </Button>
        </div>
      </section>

      {/* ── Admin Users ──────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Users className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            Admin Users
          </h3>
        </div>

        {/* User list */}
        <div className="space-y-2 mb-5">
          {[...MOCK_ADMINS, ...(userEmail && !MOCK_ADMINS.find((a) => a.email === userEmail) ? [{ email: userEmail, role: "Admin" }] : [])].map(
            (admin) => (
              <div
                key={admin.email}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {admin.email.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{admin.email}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Shield className="h-3 w-3 text-purple-500" />
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{admin.role}</span>
                    </div>
                  </div>
                </div>
                {admin.email !== userEmail && (
                  <button
                    onClick={() => toast({ title: `Admin ${admin.email} removed (Demo Mode)` })}
                    className="text-slate-300 dark:text-slate-600 hover:text-red-500 transition-colors"
                    title="Remove admin"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            )
          )}
        </div>

        {/* Invite form */}
        <div className="flex gap-3 p-4 rounded-lg border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="relative flex-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <Input
              type="email"
              placeholder="Invite admin by email…"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleInvite()}
              className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
            />
          </div>
          <Button onClick={handleInvite} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shrink-0">
            <Plus className="h-4 w-4" />
            Invite
          </Button>
        </div>
      </section>

      {/* ── Notifications ────────────────────────── */}
      <section className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-4 w-4 text-purple-500" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest">
            Notifications
          </h3>
        </div>

        <div className="space-y-4">
          {[
            {
              id: "notify-submissions",
              label: "New Submission Alerts",
              description: "Receive an email notification when a new project is submitted.",
              value: notifyNewSubmission,
              onChange: setNotifyNewSubmission,
            },
            {
              id: "notify-messages",
              label: "New Message Alerts",
              description: "Receive an email notification when a contact message is received.",
              value: notifyNewMessage,
              onChange: setNotifyNewMessage,
            },
          ].map(({ id, label, description, value, onChange }) => (
            <div key={id} className="flex items-center justify-between gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
              </div>
              <Switch
                id={id}
                checked={value}
                onCheckedChange={onChange}
                className="data-[state=checked]:bg-purple-600 shrink-0"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end">
          <Button onClick={saveNotifications} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="h-4 w-4" />
            Save Preferences
          </Button>
        </div>
      </section>
    </div>
  );
};
