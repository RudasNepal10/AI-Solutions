"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MessageSquare, Search, CheckCircle, Trash2,
  Mail, Calendar, User, FileText, Eye,
} from "lucide-react";
import { contactApi, type ContactMessage } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal, ConfirmDialog } from "@/components/ui/Modal";
import { formatNepaliDateTime } from "@/lib/utils";

export default function AdminContactsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [showReplyForm, setShowReplyForm] = useState(false);

  const queryClient = useQueryClient();

  const { data: contacts, isLoading } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => {
      const res = await contactApi.getAll();
      return res.data.data ?? [];
    },
  });

  const resolveMutation = useMutation({
    mutationFn: (id: number) => contactApi.resolve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Inquiry marked as resolved");
    },
    onError: () => toast.error("Failed to resolve inquiry"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contacts"] });
      toast.success("Inquiry deleted");
      setDeleteTarget(null);
      if (selected?.id === deleteTarget) setSelected(null);
    },
    onError: () => toast.error("Failed to delete inquiry"),
  });

  const handleSendReply = () => {
    if (!selected || !replyMessage.trim()) return;

    const email = encodeURIComponent(selected.email);
    const subject = encodeURIComponent(`Re: Inquiry about ${selected.jobTitle || "AI Solutions"}`);
    const body = encodeURIComponent(
      `Dear ${selected.name},\n\n` +
      `${replyMessage}\n\n` +
      `Best regards,\n` +
      `AI Solutions Team`
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

    if (!selected.isResolved) {
      resolveMutation.mutate(selected.id);
    }

    toast.success("Opening local mail client to send reply…");
    
    setReplyMessage("");
    setShowReplyForm(false);
    setSelected(null);
  };

  const filtered = (contacts ?? []).filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "resolved" && c.isResolved) ||
      (filter === "pending" && !c.isResolved);
    return matchSearch && matchFilter;
  });

  const totalContacts = contacts?.length ?? 0;
  const pendingCount = contacts?.filter((c) => !c.isResolved).length ?? 0;
  const resolvedCount = contacts?.filter((c) => c.isResolved).length ?? 0;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-foreground">
          Contact Inquiries
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage and respond to customer inquiries
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total", value: totalContacts, color: "text-slate-900 dark:text-white" },
          { label: "Pending", value: pendingCount, color: "text-amber-400" },
          { label: "Resolved", value: resolvedCount, color: "text-emerald-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-slate-200 dark:border-white/7 bg-white dark:bg-[#111118]/80 p-4 text-center shadow-sm"
          >
            <p className={`text-2xl font-bold font-display ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="search"
            placeholder="Search inquiries…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/8 bg-white/40 dark:bg-white/4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            id="contacts-search"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "resolved"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                filter === f
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "text-slate-550 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/6 hover:border-slate-300 dark:hover:border-white/12"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-foreground">
              {filtered.length} {filtered.length === 1 ? "Inquiry" : "Inquiries"}
            </h2>
          </div>
        </CardHeader>
        <CardBody className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-600">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No inquiries found</p>
            </div>
          ) : (
            <table className="w-full text-sm" aria-label="Contact inquiries table">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/6">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                        <p className="text-xs text-slate-500">{c.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 hidden sm:table-cell max-w-xs truncate">
                      {c.companyName}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500 text-xs hidden md:table-cell whitespace-nowrap">
                      {formatNepaliDateTime(c.createdAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={c.isResolved ? "success" : "warning"} dot>
                        {c.isResolved ? "Resolved" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setSelected(c)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                          title="View details"
                          aria-label={`View ${c.name}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {!c.isResolved && (
                          <button
                            onClick={() => resolveMutation.mutate(c.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
                            title="Mark as resolved"
                            aria-label={`Resolve ${c.name}`}
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(c.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                          aria-label={`Delete inquiry from ${c.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!selected}
        onClose={() => {
          setSelected(null);
          setShowReplyForm(false);
          setReplyMessage("");
        }}
        title="Inquiry Details"
        size="lg"
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Name</p>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">{selected.name}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm text-slate-900 dark:text-white">{selected.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Phone</p>
                  <p className="text-sm text-slate-900 dark:text-white">{selected.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Company</p>
                  <p className="text-sm text-slate-900 dark:text-white">{selected.companyName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Job Title</p>
                  <p className="text-sm text-slate-900 dark:text-white">{selected.jobTitle}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Country</p>
                  <p className="text-sm text-slate-900 dark:text-white">{selected.country}</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-2">Job Details / Requirements</p>
                <div className="bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selected.jobDetails}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/6">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                {formatNepaliDateTime(selected.createdAt)}
              </div>
              <Badge variant={selected.isResolved ? "success" : "warning"} dot>
                {selected.isResolved ? "Resolved" : "Pending"}
              </Badge>
            </div>
            {/* Reply Section */}
            <div className="border-t border-slate-200 dark:border-white/6 pt-4 mt-1">
              {!showReplyForm ? (
                <div className="flex justify-between items-center gap-3">
                  <p className="text-xs text-slate-500">
                    Want to reply to {selected.name}?
                  </p>
                  <div className="flex gap-2">
                    {!selected.isResolved && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          resolveMutation.mutate(selected.id);
                          setSelected(null);
                        }}
                        loading={resolveMutation.isPending}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                      >
                        Mark Resolved
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setReplyMessage(
                          `Thank you for reaching out to AI Solutions. We received your inquiry regarding our services for ${selected.companyName || 'your company'}.\n\n` +
                          `One of our senior AI specialists will review your request and get in touch with you shortly to schedule a demo.\n\n` +
                          `In the meantime, feel free to check out our case studies or reply directly to this email if you have any urgent updates.`
                        );
                        setShowReplyForm(true);
                      }}
                    >
                      Compose Reply
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500">
                      Compose Email Response
                    </label>
                    <button
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyMessage("");
                      }}
                      className="text-xs text-indigo-400 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    placeholder="Type your response here…"
                    rows={6}
                    className="w-full rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/3 p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowReplyForm(false);
                        setReplyMessage("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleSendReply}
                      disabled={!replyMessage.trim()}
                    >
                      Send Reply via Email
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget !== null && deleteMutation.mutate(deleteTarget)}
        title="Delete Inquiry"
        message="Are you sure you want to permanently delete this inquiry? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
