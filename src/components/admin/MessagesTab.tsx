import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Mail, MailOpen, Trash2, Send, Reply, ArrowLeft, MessageSquare,
} from "lucide-react";
import { Message } from "./types";

interface Props {
  messages: Message[];
  loading: boolean;
  onToggleRead: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, changes: Partial<Message>) => void;
}

export const MessagesTab = ({ messages, loading, onToggleRead, onDelete, onUpdate }: Props) => {
  const { toast } = useToast();
  const [selected, setSelected] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSelect = (msg: Message) => {
    setSelected(msg);
    setReplyText(msg.admin_reply ?? "");
    // Auto-mark as read on open
    if (!msg.is_read) onToggleRead(msg.id, msg.is_read);
  };

  /**
   * Simulates sending a reply email.
   * TODO: Replace with a real API call, e.g.:
   *   await fetch('/api/send-reply', { method: 'POST', body: JSON.stringify({ ... }) })
   */
  const handleSendReply = async () => {
    if (!selected || !replyText.trim()) return;
    setSending(true);

    const emailPayload = {
      to: selected.email,
      subject: `Re: ${selected.subject}`,
      body: `
Dear ${selected.name},

Thank you for reaching out to the Never Again AI Hackathon team.
Here is our response to your message:

─────────────────────────────────────────────
${replyText}
─────────────────────────────────────────────

Your original message:
"${selected.message}"

If you have further questions, please don't hesitate to contact us at info@neveragain-ai.rw.

With respect,
The Never Again AI Hackathon Organizing Team
      `.trim(),
    };

    console.log("[EMAIL SIMULATION] — Would send the following reply:", emailPayload);

    await new Promise((r) => setTimeout(r, 800));

    // Persist reply locally
    const now = new Date().toISOString();
    onUpdate(selected.id, { admin_reply: replyText, replied_at: now });
    setSelected((prev) => (prev ? { ...prev, admin_reply: replyText, replied_at: now } : null));

    toast({
      title: `✅ Reply sent to ${selected.email}! (Demo Mode)`,
      description: "Check the browser console for the full email content.",
    });

    setSending(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-slate-400 dark:text-slate-500 text-sm">
        <svg className="animate-spin h-5 w-5 mr-2 text-purple-500" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading messages…
      </div>
    );
  }

  return (
    <div className="flex gap-5 min-h-[500px]">
      {/* ── Message list ─────────────────────────────── */}
      <div
        className={`flex flex-col gap-0.5 w-full lg:w-80 xl:w-96 shrink-0 ${
          selected ? "hidden lg:flex" : "flex"
        }`}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400 dark:text-slate-500">
            <MessageSquare className="h-8 w-8 opacity-40" />
            <p className="text-sm">No messages yet.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => handleSelect(msg)}
              className={`w-full text-left rounded-xl p-4 border transition-all hover:shadow-sm ${
                selected?.id === msg.id
                  ? "border-purple-300 dark:border-purple-700 bg-purple-50/60 dark:bg-purple-900/20 shadow-sm"
                  : msg.is_read
                  ? "border-slate-100 dark:border-slate-700/50 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-600"
                  : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 hover:border-purple-200 dark:hover:border-purple-700"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`mt-0.5 shrink-0 ${msg.is_read ? "text-slate-300 dark:text-slate-600" : "text-purple-500"}`}>
                  {msg.is_read
                    ? <MailOpen className="h-4 w-4" />
                    : <Mail className="h-4 w-4" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <p className={`text-sm truncate ${!msg.is_read ? "font-semibold text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                      {msg.name}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                      {new Date(msg.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                  <p className={`text-xs truncate mb-1 ${!msg.is_read ? "text-slate-800 dark:text-slate-200" : "text-slate-500 dark:text-slate-400"}`}>
                    {msg.subject}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                    {msg.message}
                  </p>
                  {msg.admin_reply && (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded">
                      <Reply className="h-2.5 w-2.5" />
                      Replied
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* ── Detail panel ─────────────────────────────── */}
      {selected ? (
        <div className="flex-1 min-w-0 flex flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Detail header */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <button
              onClick={() => setSelected(null)}
              className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-slate-900 dark:text-white truncate">{selected.subject}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                From <span className="font-medium text-slate-700 dark:text-slate-300">{selected.name}</span>{" "}
                &lt;{selected.email}&gt; ·{" "}
                {new Date(selected.created_at).toLocaleDateString("en-GB", {
                  weekday: "short", year: "numeric", month: "short", day: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleRead(selected.id, selected.is_read)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                title={selected.is_read ? "Mark unread" : "Mark read"}
              >
                {selected.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => { onDelete(selected.id); setSelected(null); }}
                className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Message body */}
          <div className="flex-1 px-6 py-5 overflow-y-auto">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {selected.message}
              </p>
            </div>

            {/* Previous reply (if exists) */}
            {selected.admin_reply && (
              <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/40 dark:bg-emerald-900/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Reply className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    Previous reply
                    {selected.replied_at && (
                      <span className="font-normal text-emerald-600/70 dark:text-emerald-500/70 ml-2">
                        · {new Date(selected.replied_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    )}
                  </span>
                </div>
                <p className="text-sm text-emerald-800 dark:text-emerald-300 whitespace-pre-line leading-relaxed">
                  {selected.admin_reply}
                </p>
              </div>
            )}
          </div>

          {/* Reply box */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2">
              <Reply className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Reply to {selected.name}
              </span>
            </div>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Write your reply to ${selected.name}…`}
              rows={4}
              className="resize-none bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-sm"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSendReply}
                disabled={sending || !replyText.trim()}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Send className="h-4 w-4" />
                {sending ? "Sending…" : "Send Reply"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty state — detail pane */
        <div className="hidden lg:flex flex-1 items-center justify-center text-center">
          <div className="space-y-2">
            <MessageSquare className="h-10 w-10 text-slate-200 dark:text-slate-700 mx-auto" />
            <p className="text-sm text-slate-400 dark:text-slate-500">Select a message to read and reply</p>
          </div>
        </div>
      )}
    </div>
  );
};
