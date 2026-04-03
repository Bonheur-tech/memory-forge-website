import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function StaffInbox() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch admin ID on mount
  useEffect(() => {
    const fetchAdminId = async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "super_admin")
        .limit(1)
        .single();

      if (!error && data) {
        setAdminId(data.user_id);
      }
    };

    if (user) {
      fetchAdminId();
    }
  }, [user]);

  // Fetch messages and unread count
  const fetchMessages = useCallback(async () => {
    if (!user || !adminId) return;

    const { data, error } = await supabase
      .from("staff_direct_messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},recipient_id.eq.${adminId}),and(sender_id.eq.${adminId},recipient_id.eq.${user.id})`)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setMessages(data);
      const unread = data.filter(msg => msg.recipient_id === user.id && !msg.is_read).length;
      setUnreadCount(unread);
    }
  }, [user, adminId]);

  useEffect(() => {
    if (adminId) {
      fetchMessages();
    }
  }, [adminId, fetchMessages]);

  // Mark messages as read when panel opens
  useEffect(() => {
    if (isOpen && user && adminId) {
      supabase
        .from("staff_direct_messages")
        .update({ is_read: true })
        .eq("recipient_id", user.id)
        .eq("sender_id", adminId)
        .eq("is_read", false)
        .then(() => {
          setUnreadCount(0);
          setMessages(prev => prev.map(msg =>
            msg.recipient_id === user.id && msg.sender_id === adminId ? { ...msg, is_read: true } : msg
          ));
        });
    }
  }, [isOpen, user, adminId]);

  // Realtime subscription
  useEffect(() => {
    if (!user || !adminId) return;

    const channel = supabase
      .channel("staff_messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "staff_direct_messages",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(msg => msg.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          if (!isOpen) {
            setUnreadCount(prev => prev + 1);
          } else {
            // Mark as read immediately
            supabase
              .from("staff_direct_messages")
              .update({ is_read: true })
              .eq("id", newMsg.id);
            // Update local state
            setMessages(prev => prev.map(msg =>
              msg.id === newMsg.id ? { ...msg, is_read: true } : msg
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, adminId, isOpen]);

  // Scroll to bottom when new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !adminId || loading) return;

    setLoading(true);
    const messageText = newMessage.trim();
    const { data, error } = await supabase
      .from("staff_direct_messages")
      .insert({
        sender_id: user.id,
        recipient_id: adminId,
        message: messageText,
        is_read: false,
      })
      .select()
      .single();

    if (!error && data) {
      setMessages(prev => [...prev, data]);
      setNewMessage("");
    }
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-12 w-12 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 max-h-[500px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">Messages from Admin</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-3 py-2 ${
                    msg.sender_id === user.id
                      ? "bg-purple-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender_id === user.id
                      ? "text-purple-200"
                      : "text-slate-500 dark:text-slate-400"
                  }`}>
                    {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                disabled={!newMessage.trim() || loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}