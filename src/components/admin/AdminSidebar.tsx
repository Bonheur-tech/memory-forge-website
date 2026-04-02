import { Link } from "react-router-dom";
import {
  LayoutDashboard, FileText, MessageSquare, Calendar,
  Settings2, ExternalLink, LogOut, Cpu, X, Trophy, BarChart3,
} from "lucide-react";
import { AdminSection } from "./types";

interface SidebarProps {
  activeSection: AdminSection;
  setActiveSection: (s: AdminSection) => void;
  unreadMessages: number;
  pendingSubmissions: number;
  userEmail: string;
  onSignOut: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "overview",     label: "Overview",    icon: LayoutDashboard },
  { id: "submissions",  label: "Submissions", icon: FileText        },
  { id: "messages",     label: "Messages",    icon: MessageSquare   },
  { id: "competition",  label: "Competition", icon: Calendar        },
  { id: "rankings",     label: "Rankings",    icon: BarChart3       },
  { id: "winners",      label: "Winners",     icon: Trophy          },
  { id: "settings",     label: "Settings",    icon: Settings2       },
];

export const AdminSidebar = ({
  activeSection,
  setActiveSection,
  unreadMessages,
  pendingSubmissions,
  userEmail,
  onSignOut,
  mobileOpen,
  onMobileClose,
}: SidebarProps) => {
  const handleNav = (id: AdminSection) => {
    setActiveSection(id);
    onMobileClose();
  };

  const userInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "AD";

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 dark:border-slate-700/50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-600/30 border border-purple-300 dark:border-purple-500/40 flex items-center justify-center shrink-0">
            <Cpu className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-900 dark:text-white font-display">Never Again AI</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-widest">Admin</p>
          </div>
        </div>
        <button
          onClick={onMobileClose}
          className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeSection === id;
          const badge =
            id === "messages"    ? unreadMessages    :
            id === "submissions" ? pendingSubmissions : 0;

          return (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-purple-100 dark:bg-purple-600/25 text-purple-700 dark:text-purple-300 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50"
              }`}
            >
              <Icon
                className={`shrink-0 transition-colors ${
                  isActive
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }`}
                style={{ height: "1.125rem", width: "1.125rem" }}
              />
              <span className="flex-1 text-left">{label}</span>
              {badge > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-purple-600 text-white text-[10px] font-semibold">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 border-t border-slate-200 dark:border-slate-700/50 pt-3 space-y-1 shrink-0">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all group"
          onClick={onMobileClose}
        >
          <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
          <span>View Public Site</span>
        </Link>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
        >
          <LogOut className="h-4 w-4 text-slate-400 dark:text-slate-500 group-hover:text-red-500 dark:group-hover:text-red-400 shrink-0" />
          <span>Sign Out</span>
        </button>
        <div className="mt-3 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-700/40">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-700 dark:text-slate-200 truncate font-medium">{userEmail}</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700/50 h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 flex flex-col overflow-hidden shadow-2xl border-r border-slate-200 dark:border-slate-700/50">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};
