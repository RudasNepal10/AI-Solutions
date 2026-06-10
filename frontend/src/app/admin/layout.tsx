"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, MessageSquare, FileText,
  BarChart3, Menu, Zap, LogOut, ChevronRight,
  Settings, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/lib/store";
import { ConfirmDialog } from "@/components/ui/Modal";
import { getInitials } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationDropdown } from "@/components/layout/NotificationDropdown";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, exact: true },
  { href: "/admin/users", label: "User Management", icon: <Users className="w-4 h-4" /> },
  { href: "/admin/contacts", label: "Contact Inquiries", icon: <MessageSquare className="w-4 h-4" /> },
  { href: "/admin/blogs", label: "Blog Management", icon: <FileText className="w-4 h-4" /> },
  { href: "/admin/reviews", label: "Reviews", icon: <BarChart3 className="w-4 h-4" /> },
  { href: "/admin/settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
];

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return true;
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);
    const exp = payload.exp;
    if (!exp) return false;
    return Date.now() / 1000 >= exp - 10; // Expired or expiring within 10 seconds
  } catch {
    return true;
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, handleLogout } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const token = typeof window !== "undefined" ? sessionStorage.getItem("accessToken") : null;
      const isExpired = !token || isTokenExpired(token);

      if (isAuthenticated && isExpired) {
        // Stale or expired auth state in Zustand store. Clear store immediately.
        // The resulting state change will trigger a clean redirect in the next render cycle.
        useAuthStore.getState().logout();
      } else if (!isAuthenticated && !isLoginPage) {
        router.replace("/admin/login");
      }
    }
  }, [isAuthenticated, isMounted, isLoginPage, router]);

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await handleLogout();
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface-900">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    );
  }

  const Sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-glass-border">
        <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-base font-display text-foreground">
          AI<span className="text-brand-600 dark:text-brand-400">-Solutions</span>
        </span>
        <span className="ml-auto text-xs text-slate-600 dark:text-slate-500 border border-slate-200 dark:border-white/6 rounded px-1.5 py-0.5">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto" aria-label="Admin navigation">
        <p className="text-[10px] uppercase tracking-widest text-slate-600 px-2 mb-2 font-medium">
          Management
        </p>
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1",
                isActive
                  ? "bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/6"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      <div className="border-t border-glass-border p-3">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl bg-black/5 dark:bg-white/4 mb-2">
          <div className="w-8 h-8 rounded-full bg-brand-600/10 dark:bg-brand-600/30 border border-brand-500/30 flex items-center justify-center text-xs font-bold text-brand-600 dark:text-brand-300">
            {user ? getInitials(`${user.firstName} ${user.lastName}`) : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user ? `${user.firstName} ${user.lastName}` : "Admin"}
            </p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => setLogoutOpen(true)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-slate-500 dark:text-slate-400 hover:text-red-400 hover:bg-red-500/8 transition-all"
          id="admin-logout-btn"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-surface-900 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-surface-800 border-r border-glass-border">
        {Sidebar}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: "spring", stiffness: 400, damping: 35 }}
              className="fixed left-0 top-0 bottom-0 z-40 w-60 bg-surface-800 border-r border-glass-border lg:hidden"
            >
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-14 shrink-0 border-b border-glass-border bg-surface-800/80 backdrop-blur-sm flex items-center px-4 gap-4 relative z-30">
          <button
            className="lg:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb */}
          <div className="flex-1 hidden sm:block">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="text-slate-600 dark:text-slate-500">Admin</span>
              {" / "}
              <span className="text-slate-800 dark:text-slate-200">
                {NAV_ITEMS.find((n) =>
                  n.exact ? pathname === n.href : pathname.startsWith(n.href)
                )?.label ?? "Dashboard"}
              </span>
            </p>
          </div>

          {/* Topbar actions */}
          <div className="ml-auto flex items-center gap-2">
            <NotificationDropdown />
            <Link
              href="/admin/settings"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8 transition-colors mr-1"
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors ml-3"
            >
              ← Public Site
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto" id="admin-main-content">
          {children}
        </main>
      </div>

      {/* Logout confirmation */}
      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={onLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of the admin portal?"
        confirmLabel="Sign Out"
        variant="warning"
        loading={loggingOut}
      />
    </div>
  );
}
