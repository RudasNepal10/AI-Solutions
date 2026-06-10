"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Users, MessageSquare, BarChart3, DollarSign,
  Activity, FileText, TrendingUp, Eye,
} from "lucide-react";
import { dashboardApi, type DashboardStats } from "@/lib/api";
import { StatCard, Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Badge";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

function StatsGrid({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      title: "Platform Users",
      value: stats.totalUsers,
      icon: <Users className="w-5 h-5" />,
      change: `${stats.activeUsers} active / ${stats.removedUsers} deleted`,
      changeType: "neutral" as const,
    },
    {
      title: "Contact Inquiries",
      value: stats.totalContacts,
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Total submissions received",
    },
    {
      title: "Total Chats",
      value: stats.totalChats,
      icon: <Activity className="w-5 h-5" />,
      change: `${stats.activeSessions} active sessions`,
      changeType: "neutral" as const,
    },
    {
      title: "Blog Posts",
      value: stats.totalBlogs,
      icon: <FileText className="w-5 h-5" />,
    },
    {
      title: "API Requests",
      value: stats.totalApiRequests.toLocaleString(),
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      title: "Est. Monthly Revenue",
      value: formatCurrency(stats.estimatedMonthlyRevenue),
      icon: <DollarSign className="w-5 h-5" />,
      change: "Current billing cycle",
      changeType: "up" as const,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-28 rounded-2xl" />
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data.data!;
    },
    refetchInterval: 60_000,
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Real-time overview of your AI-Solutions platform
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          Failed to load dashboard stats. Please refresh the page.
        </div>
      )}

      {/* Stats */}
      {isLoading ? <LoadingGrid /> : data && <StatsGrid stats={data} />}

      {/* Charts + Tables row */}
      {data && (
        <div className="grid lg:grid-cols-5 gap-6 mt-6">
          {/* Monthly chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <h2 className="text-sm font-semibold text-foreground">Monthly Growth</h2>
              </div>
            </CardHeader>
            <CardBody>
              {data.monthlyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.monthlyData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                    <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "#16161f",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: "10px",
                        color: "#e2e2e8",
                        fontSize: "12px",
                      }}
                    />
                    <Bar dataKey="chats" fill="#6366f1" radius={[4, 4, 0, 0]} name="Chats" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm">
                  No monthly data yet
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Recent data tables */}
      {data && (
        <div className="grid grid-cols-1 mt-6">
          {/* Recent contacts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <h2 className="text-sm font-semibold text-foreground">Recent Inquiries</h2>
                </div>
                <a href="/admin/contacts" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">View all</a>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {data.recentContacts.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm text-center py-8">No inquiries yet</p>
              ) : (
                <div className="divide-y divide-white/5">
                  {data.recentContacts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between px-6 py-3 hover:bg-white/2 transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{c.companyName}</p>
                      </div>
                      <div className="ml-4 flex items-center gap-3 shrink-0">
                        <Badge variant={c.isResolved ? "success" : "warning"} dot>
                          {c.isResolved ? "Resolved" : "Pending"}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(c.createdAt)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
