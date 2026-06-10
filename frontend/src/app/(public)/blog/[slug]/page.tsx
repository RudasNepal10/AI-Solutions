"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, ArrowLeft, ArrowRight, Tag } from "lucide-react";
import { blogsApi } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils";
import { use } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  const { data: blog, isLoading, error } = useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await blogsApi.getBySlug(slug);
      if (!res.data.success) throw new Error("Not found");
      return res.data.data!;
    },
  });

  if (isLoading) {
    return (
      <div className="container-custom section-padding max-w-3xl mx-auto">
        <Skeleton className="h-8 w-32 rounded-lg mb-8" />
        <Skeleton className="h-12 rounded-xl mb-4" />
        <Skeleton className="h-6 w-48 rounded-lg mb-8" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !blog) return notFound();

  return (
    <article className="section-padding min-h-screen">
      <div className="container-custom max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

          {/* Hero Section */}
          <div className="mb-10">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="primary" className="px-3 py-1">{blog.categoryName}</Badge>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-slate-500 text-xs flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateTime(blog.createdAt)}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-slate-900 dark:text-white mb-8 leading-[1.1] tracking-tight">
              {blog.title}
            </h1>

            <div className="flex items-center gap-4 py-6 border-y border-slate-200 dark:border-white/6 mb-10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm">
                {blog.authorName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{blog.authorName}</p>
                <p className="text-xs text-slate-500">Expert Consultant at AI-Solutions</p>
              </div>
            </div>

            {blog.thumbnailUrl && (
              <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-slate-200 dark:border-white/10 shadow-2xl shadow-indigo-500/10">
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-slate dark:prose-invert prose-indigo max-w-none">
              <div className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed space-y-6">
                {blog.content.split("\n").map((para, i) =>
                  para.trim() ? (
                    <p key={i}>{para}</p>
                  ) : (
                    <div key={i} className="h-4" />
                  )
                )}
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-slate-200 dark:border-white/6 flex flex-wrap gap-2">
                {blog.tags.map((tag) => (
                  <Badge key={tag.id} variant="default" className="bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-700 dark:text-slate-300">
                    <Tag className="w-3 h-3 mr-1.5 opacity-50" />
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/6 text-center">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 font-display">Enjoyed this article?</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">Explore more insights from our team of experts on AI and digital transformation.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium transition-colors"
            >
              View all articles
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </article>
  );
}
