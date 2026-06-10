"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, MessageSquare, Star, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { contactApi, reviewsApi } from "@/lib/api";
import { cn, formatDateTime } from "@/lib/utils";

interface NotificationItem {
  id: string; // e.g. "contact-1", "review-5", "user-3"
  type: "contact" | "review";
  title: string;
  description: string;
  date: string;
  link: string;
  isRead: boolean;
  rawId: number;
}

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<string[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = localStorage.getItem("read_notification_ids");
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse read notification IDs", e);
      return [];
    }
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Save read notification IDs to localStorage
  const saveReadIds = (ids: string[]) => {
    setReadIds(ids);
    if (typeof window !== "undefined") {
      localStorage.setItem("read_notification_ids", JSON.stringify(ids));
    }
  };

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Query contact inquiries with 15-second polling interval
  const { data: contactsResponse } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await contactApi.getAll();
      return res.data.data ?? [];
    },
    refetchInterval: 15000,
  });

  // Query reviews with 15-second polling interval
  const { data: reviewsResponse } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await reviewsApi.getAll();
      return res.data.data ?? [];
    },
    refetchInterval: 15000,
  });

  const contacts = contactsResponse ?? [];
  const reviews = reviewsResponse ?? [];

  // Map pending contacts and reviews to common NotificationItem format
  const notifications: NotificationItem[] = [
    ...contacts
      .filter((c) => !c.isResolved)
      .map((c) => ({
        id: `contact-${c.id}`,
        type: "contact" as const,
        title: "New Contact Inquiry",
        description: `${c.name} from ${c.companyName || "N/A"} sent a message.`,
        date: c.createdAt,
        link: "/admin/contacts",
        isRead: readIds.includes(`contact-${c.id}`),
        rawId: c.id,
      })),
    ...reviews
      .filter((r: any) => !r.isApproved)
      .map((r: any) => ({
        id: `review-${r.id}`,
        type: "review" as const,
        title: "New Review Pending",
        description: `${r.authorName} rated the service ${r.rating} stars.`,
        date: r.createdAt || new Date().toISOString(),
        link: "/admin/reviews",
        isRead: readIds.includes(`review-${r.id}`),
        rawId: r.id,
      })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    if (!readIds.includes(id)) {
      saveReadIds([...readIds, id]);
    }
  };

  const handleMarkAllAsRead = () => {
    const allIds = notifications.map((n) => n.id);
    const uniqueIds = Array.from(new Set([...readIds, ...allIds]));
    saveReadIds(uniqueIds);
  };

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    handleMarkAsRead(id);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/8 transition-all relative",
          isOpen && "bg-black/5 dark:bg-white/8 text-foreground"
        )}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-[#111118] shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.01]">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 dark:text-indigo-400">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5">
              {notifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/4 flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">All caught up!</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">No pending notifications at this time.</p>
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      handleMarkAsRead(item.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex gap-3.5 p-4 hover:bg-slate-50 dark:hover:bg-white/2 transition-colors cursor-pointer relative group",
                      !item.isRead && "bg-indigo-50/20 dark:bg-indigo-500/[0.02]"
                    )}
                  >
                    {/* Icon */}
                    <div className="shrink-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center border",
                          item.type === "contact"
                            ? "bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border-indigo-500/10"
                            : "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/10"
                        )}
                      >
                        {item.type === "contact" ? (
                          <MessageSquare className="w-4 h-4" />
                        ) : (
                          <Star className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1.5">
                        <p className={cn("text-xs font-semibold truncate", item.isRead ? "text-slate-700 dark:text-slate-350" : "text-slate-900 dark:text-white")}>
                          {item.title}
                        </p>
                        {!item.isRead && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-1.5">
                        {formatDateTime(item.date)}
                      </p>
                    </div>

                    {/* Quick actions on hover */}
                    <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 bg-white dark:bg-[#111118] pl-2 shadow-sm rounded-lg py-0.5 border border-slate-100 dark:border-white/5">
                      <Link
                        href={item.link}
                        onClick={() => setIsOpen(false)}
                        className="p-1 rounded text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/6 transition-all"
                        title="View details"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                      {!item.isRead && (
                        <button
                          onClick={(e) => handleDismiss(e, item.id)}
                          className="p-1 rounded text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-white/6 transition-all"
                          title="Mark as read"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="flex divide-x divide-slate-100 dark:divide-white/5 border-t border-slate-100 dark:border-white/5 bg-slate-550/[0.01] dark:bg-white/[0.01]">
                <Link
                  href="/admin/users"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Users
                </Link>
                <Link
                  href="/admin/contacts"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Inquiries
                </Link>
                <Link
                  href="/admin/reviews"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  Reviews
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
