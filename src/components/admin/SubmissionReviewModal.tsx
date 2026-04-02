import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ExternalLink, Star, Send, Save, User, School, Mail,
  Tag, Calendar, FileText, Github,
} from "lucide-react";
import { Submission, STATUS_META } from "./types";

interface Props {
  submission: Submission;
  onClose: () => void;
  onUpdate: (id: string, changes: Partial<Submission>) => void;
}

/**
 * Star rating component (1–5 stars, maps to 20/40/60/80/100).
 */
const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star * 20)}
          className="transition-transform hover:scale-110 focus:outline-none"
          title={`${star * 20}/100`}
        >
          <Star
            className={`h-6 w-6 transition-colors ${
              star <= (hovered || Math.ceil(value / 20))
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300 dark:text-slate-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export const SubmissionReviewModal = ({ submission, onClose, onUpdate }: Props) => {
  const { toast } = useToast();
  const [score, setScore] = useState<number>(submission.score ?? 0);
  const [status, setStatus] = useState(submission.status);
  const [feedback, setFeedback] = useState(submission.admin_feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const meta = STATUS_META[status] ?? STATUS_META.pending;

  const handleSave = async () => {
    setSaving(true);
    await onUpdate(submission.id, {
      score: score || null,
      status,
      admin_feedback: feedback || null,
    });
    setSaving(false);
    toast({ title: "Changes saved successfully." });
  };

  /**
   * Simulates sending an email to the student.
   * TODO: Replace the console.log with a real API call, e.g.:
   *   await fetch('/api/send-email', { method: 'POST', body: JSON.stringify({ ... }) })
   */
  const handleSendEmail = async () => {
    setSending(true);

    const emailPayload = {
      to: submission.email,
      subject: `Update on Your Never Again AI Hackathon Submission — ${submission.project_title}`,
      body: `
Dear ${submission.full_name},

We have reviewed your project submission for the Never Again AI Hackathon 2026.

Project: ${submission.project_title}
Category: ${submission.category}
Status: ${STATUS_META[status]?.label ?? status}
${score ? `Score: ${score}/100` : ""}

${feedback ? `Feedback from our review team:\n\n${feedback}\n` : ""}
You may view your submission on our platform at any time.

Thank you for your participation and dedication to this important cause.

With respect,
The Never Again AI Hackathon Organizing Team
info@neveragain-ai.rw
      `.trim(),
    };

    console.log("[EMAIL SIMULATION] — Would send the following email:", emailPayload);

    await new Promise((r) => setTimeout(r, 800)); // simulate network delay

    toast({
      title: `✅ Email sent to ${submission.email}! (Demo Mode)`,
      description: "Check the browser console for the full email content.",
    });

    setSending(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
          <DialogTitle className="text-lg font-display font-bold text-slate-900 dark:text-white">
            Review Submission
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-5 space-y-6">
          {/* ── Project info ─────────────────────────── */}
          <div className="rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 p-5">
            <div className="flex flex-wrap items-start gap-3 mb-4">
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white flex-1">
                {submission.project_title}
              </h2>
              <Badge className={`${meta.color} border text-xs`}>{meta.label}</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {[
                { icon: User,     label: "Student",   value: submission.full_name   },
                { icon: School,   label: "School",    value: submission.school       },
                { icon: Mail,     label: "Email",     value: submission.email        },
                { icon: Tag,      label: "Category",  value: submission.category     },
                { icon: Calendar, label: "Submitted", value: new Date(submission.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" }) },
                ...(submission.score != null
                  ? [{ icon: Star, label: "Current Score", value: `${submission.score}/100` }]
                  : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-500 dark:text-slate-400">{label}:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Description ──────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                Project Description
              </h3>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line bg-slate-50/60 dark:bg-slate-800/30 rounded-lg p-4 border border-slate-100 dark:border-slate-700">
              {submission.description}
            </p>
          </div>

          {/* ── Resources ────────────────────────────── */}
          {(submission.github_link || submission.file_url) && (
            <div className="flex flex-wrap gap-3">
              {submission.github_link && (
                <a
                  href={submission.github_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-800 dark:bg-slate-700 text-slate-100 hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                >
                  <Github className="h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              )}
              {submission.file_url && (
                <a
                  href={submission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Download Submission File
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              )}
            </div>
          )}

          {/* ── Marking Area ─────────────────────────── */}
          <div className="rounded-xl border-2 border-purple-200/60 dark:border-purple-800/40 bg-purple-50/30 dark:bg-purple-900/10 p-5 space-y-5">
            <h3 className="text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-widest">
              Admin Marking Area
            </h3>

            {/* Score */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Score ({score || "—"} / 100)
              </label>
              <div className="flex items-center gap-4">
                <StarRating value={score} onChange={setScore} />
                <span className="text-slate-400 text-xs">or</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full accent-purple-600 cursor-pointer"
                />
                <span className="w-10 text-right text-sm font-bold text-slate-800 dark:text-slate-200">
                  {score}
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Submission Status
              </label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full sm:w-48 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="winner">Winner</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Admin Feedback / Notes
              </label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write detailed feedback, notes, or comments for the student..."
                rows={5}
                className="resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-1">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving…" : "Save Changes"}
              </Button>
              <Button
                onClick={handleSendEmail}
                disabled={sending}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending…" : "Send Feedback Email"}
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
