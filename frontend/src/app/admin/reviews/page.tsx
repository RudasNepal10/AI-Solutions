"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Search, CheckCircle, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewsApi } from "@/lib/api";

export default function ReviewManagementPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const res = await reviewsApi.getAll();
      return res.data.data ?? [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => reviewsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review approved");
    },
    onError: () => toast.error("Failed to approve review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => reviewsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reviews"] });
      toast.success("Review deleted");
    },
    onError: () => toast.error("Failed to delete review"),
  });
  
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Review Management</h1>
          <p className="text-slate-400 text-sm mt-1">Approve and manage client testimonials</p>
        </div>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/8 bg-white/40 dark:bg-white/4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <Card>
        <CardBody className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/6 text-slate-500 uppercase tracking-wide text-xs">
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Rating</th>
                <th className="px-6 py-4 font-medium hidden md:table-cell">Review</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.filter((r: any) => r.authorName?.toLowerCase().includes(search.toLowerCase()) || r.content?.toLowerCase().includes(search.toLowerCase())).map((review: any, i: number) => (
                <motion.tr key={review.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900 dark:text-white">{review.authorName}</p>
                    <p className="text-xs text-slate-500">{review.companyName || "N/A"}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-700"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400 hidden md:table-cell max-w-xs truncate">
                    {review.content}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={review.isApproved ? "success" : "warning"} dot>
                      {review.isApproved ? "approved" : "pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {!review.isApproved && (
                        <button onClick={() => approveMutation.mutate(review.id)} className="p-1.5 text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => deleteMutation.mutate(review.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
