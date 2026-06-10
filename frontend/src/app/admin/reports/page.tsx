"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BarChart3, FileText, Clock } from "lucide-react";
import { reportsApi, type AIReportDto } from "@/lib/api";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";

export default function AdminReportsPage() {
  const { data: reports, isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const res = await reportsApi.getAll();
      return res.data.data ?? [];
    },
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">AI Reports</h1>
        <p className="text-slate-400 text-sm mt-1">
          View AI-generated analytical reports for your platform
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-2xl" />
          ))}
        </div>
      ) : !reports || reports.length === 0 ? (
        <div className="text-center py-24 text-slate-600">
          <BarChart3 className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="text-sm">No AI reports generated yet.</p>
          <p className="text-xs mt-1">Reports are generated via the platform dashboard.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(reports as AIReportDto[]).map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                     <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-500/12 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{report.reportTitle}</h3>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {formatDateTime(report.createdAt)}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 bg-slate-100 dark:bg-white/4 px-2 py-1 rounded-lg shrink-0">
                      #{report.id}
                    </span>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {report.reportContent}
                  </p>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
