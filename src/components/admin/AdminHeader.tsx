import { Bell, Sun, Moon, Menu } from "lucide-react";
import { AdminSection } from "./types";

const SECTION_TITLES: Record<AdminSection, string> = {
  overview:    "Dashboard Overview",
  submissions: "Submissions",
  messages:    "Messages",
  competition: "Competition Settings",
  rankings:    "Live Rankings",
  winners:     "Winner Selection",
  settings:    "General Settings",
};

const SECTION_SUBTITLES: Record<AdminSection, string> = {
  overview:    "Welcome back — here's what's happening today.",
  submissions: "Review, score, and manage all project submissions.",
  messages:    "Read and reply to contact messages from the public.",
  competition: "Configure hackathon dates and competition phases.",
  rankings:    "Automatic leaderboard based on judge scores.",
  winners:     "Select 1st, 2nd, and 3rd place winners.",
  settings:    "Manage hackathon settings, admins, and notifications.",
};

interface HeaderProps {
  activeSection: AdminSection;
  darkMode: boolean;
  onToggleDark: () => void;
  notifications: number;
  userEmail: string;
  onMobileMenuOpen: () => void;
}

export const AdminHeader = ({
  activeSection,
  darkMode,
  onToggleDark,
  notifications,
  userEmail,
  onMobileMenuOpen,
}: HeaderProps) => {
  const userInitials = userEmail ? userEmail.slice(0, 2).toUpperCase() : "AD";

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center px-6 gap-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/50 backdrop-blur-lg shrink-0 shadow-sm dark:shadow-slate-900/50">
      {/* Mobile hamburger */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden h-9 w-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-bold text-slate-900 dark:text-white font-display truncate">
          {SECTION_TITLES[activeSection]}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
          {SECTION_SUBTITLES[activeSection]}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Dark mode toggle — clearly visible in both modes */}
        <button
          onClick={onToggleDark}
          className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all border ${
            darkMode
              ? "bg-slate-800 border-slate-600 text-amber-400 hover:bg-slate-700 hover:border-slate-500"
              : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 hover:border-slate-300"
          }`}
          aria-label="Toggle dark mode"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode
            ? <Sun style={{ height: "1.125rem", width: "1.125rem" }} />
            : <Moon style={{ height: "1.125rem", width: "1.125rem" }} />
          }
        </button>

        {/* Notification bell */}
        <button
          className="relative h-9 w-9 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
          aria-label="Notifications"
        >
          <Bell style={{ height: "1.125rem", width: "1.125rem" }} />
          {notifications > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-600 ring-2 ring-white dark:ring-slate-900" />
          )}
        </button>

        {/* Avatar */}
        <div
          className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 cursor-default ring-2 ring-white dark:ring-slate-800 shadow-sm"
          title={userEmail}
        >
          {userInitials}
        </div>
      </div>
    </header>
  );
};
