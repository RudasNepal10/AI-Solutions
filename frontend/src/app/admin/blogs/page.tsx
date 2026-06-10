"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, Search, Trash2, Eye, Plus, Check, X } from "lucide-react";
import { blogsApi, uploadApi, type BlogListDto } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export default function AdminBlogsPage() {
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newBlog, setNewBlog] = useState({
    title: "",
    content: "",
    thumbnailUrl: "",
    categoryId: 1,
  });

  const queryClient = useQueryClient();

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const res = await blogsApi.getAll({ includeUnpublished: true } as Parameters<typeof blogsApi.getAll>[0]);
      return res.data.data ?? [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => blogsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post deleted");
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete blog post"),
  });

  const createMutation = useMutation({
    mutationFn: (dto: any) => blogsApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      toast.success("Blog post created successfully");
      setIsCreateModalOpen(false);
      setNewBlog({ title: "", content: "", thumbnailUrl: "", categoryId: 1 });
    },
    onError: () => toast.error("Failed to create blog post"),
  });

  const filtered = (blogs ?? []).filter(
    (b) =>
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.authorName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Blog Posts</h1>
          <p className="text-slate-400 text-sm mt-1">Manage all published and draft articles</p>
        </div>
        <Button 
          variant="primary" 
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          New Post
        </Button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="search"
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/8 bg-white/40 dark:bg-white/4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          id="blogs-search"
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-foreground">
              {filtered.length} {filtered.length === 1 ? "Post" : "Posts"}
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
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No blog posts found</p>
            </div>
          ) : (
            <table className="w-full text-sm" aria-label="Blog posts table">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/6">
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden md:table-cell">Author</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide hidden lg:table-cell">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {filtered.map((b: BlogListDto, i) => (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-slate-50 dark:hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-slate-900 dark:text-white line-clamp-1">{b.title}</p>
                    </td>
                    <td className="px-6 py-3.5 hidden sm:table-cell">
                      <span className="text-slate-600 dark:text-slate-400 text-xs">{b.categoryName}</span>
                    </td>
                    <td className="px-6 py-3.5 hidden md:table-cell">
                      <span className="text-slate-600 dark:text-slate-400 text-xs">{b.authorName}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={b.isPublished ? "success" : "default"} dot>
                        {b.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-500 hidden lg:table-cell whitespace-nowrap">
                      {formatDate(b.createdAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                          title="View post"
                          aria-label={`View ${b.title}`}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(b.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete post"
                          aria-label={`Delete ${b.title}`}
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

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget !== null && deleteMutation.mutate(deleteTarget)}
        title="Delete Blog Post"
        message="Permanently delete this blog post? This cannot be undone."
        confirmLabel="Delete Post"
        variant="danger"
        loading={deleteMutation.isPending}
      />

      <Modal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Blog Post"
        className="max-w-2xl"
      >
        <div className="space-y-4 pt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Title</label>
              <Input
                placeholder="Enter blog title..."
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</label>
              <select
                className="w-full bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                value={newBlog.categoryId}
                onChange={(e) => setNewBlog({ ...newBlog, categoryId: parseInt(e.target.value) })}
              >
                <option value={1}>AI & Machine Learning</option>
                <option value={2}>Business Strategy</option>
                <option value={3}>Tech Trends</option>
                <option value={4}>Case Studies</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  const toastId = toast.loading("Uploading image...");
                  try {
                    const res = await uploadApi.uploadImage(e.target.files[0]);
                    const url = res.data.data?.url ? process.env.NEXT_PUBLIC_API_URL || "https://localhost:7178" + res.data.data.url : "";
                    setNewBlog({ ...newBlog, thumbnailUrl: "https://localhost:7178" + res.data.data?.url });
                    toast.success("Image uploaded successfully", { id: toastId });
                  } catch (err) {
                    toast.error("Failed to upload image", { id: toastId });
                  }
                }
              }}
            />
            {newBlog.thumbnailUrl && <img src={newBlog.thumbnailUrl} alt="Thumbnail preview" className="mt-2 h-32 w-full object-cover rounded-xl" />}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">Content</label>
            <textarea
              className="w-full bg-slate-100 dark:bg-white/4 border border-slate-200 dark:border-white/8 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[200px] resize-none"
              placeholder="Write your blog content here..."
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={createMutation.isPending}
              disabled={!newBlog.title || !newBlog.content}
              onClick={() => createMutation.mutate(newBlog)}
            >
              Create Post
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
