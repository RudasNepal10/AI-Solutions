"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { reviewsApi } from "@/lib/api";
import { toast } from "sonner";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function PublicReviewsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ authorName: "", companyName: "", content: "", rating: 5 });

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["public-reviews"],
    queryFn: async () => {
      const res = await reviewsApi.getApproved();
      return res.data.data ?? [];
    },
  });

  const createMutation = useMutation({
    mutationFn: () => reviewsApi.create(newReview),
    onSuccess: () => {
      toast.success("Review submitted! It will appear once approved by an admin.");
      setIsModalOpen(false);
      setNewReview({ authorName: "", companyName: "", content: "", rating: 5 });
    },
    onError: () => toast.error("Failed to submit review"),
  });

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <Badge variant="success" className="mb-4">Client Testimonials</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
          What Our Clients Say
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          Don&apos;t just take our word for it. Read how our digital experience consultancy has helped businesses transform and grow.
        </p>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Write a Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <p className="text-center col-span-full text-slate-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-center col-span-full text-slate-500">No reviews yet. Be the first to leave one!</p>
        ) : (
          reviews.map((review: any, i: number) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative p-8 rounded-3xl bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/10 shadow-xl"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-indigo-500/10" />
              <div className="flex gap-1 mb-6 text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className={`w-5 h-5 ${idx < review.rating ? "fill-current" : "text-slate-300 dark:text-slate-700"}`} />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed relative z-10">
                &quot;{review.content}&quot;
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg uppercase">
                  {review.authorName?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{review.authorName}</h4>
                  <p className="text-sm text-slate-500">{review.companyName || "Client"}</p>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Write a Review"
        className="max-w-xl"
      >
        <div className="space-y-4 pt-4 text-left">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-400 uppercase tracking-wider">Your Name</label>
              <Input
                placeholder="John Doe"
                value={newReview.authorName}
                onChange={(e) => setNewReview({ ...newReview, authorName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-400 uppercase tracking-wider">Company Name (Optional)</label>
              <Input
                placeholder="Acme Corp"
                value={newReview.companyName}
                onChange={(e) => setNewReview({ ...newReview, companyName: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-400 uppercase tracking-wider">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="focus:outline-none"
                >
                  <Star className={`w-8 h-8 ${star <= newReview.rating ? "text-amber-400 fill-current" : "text-slate-300 dark:text-slate-700"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 dark:text-slate-400 uppercase tracking-wider">Your Feedback</label>
            <textarea
              className="w-full bg-transparent border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[120px] resize-none"
              placeholder="Tell us about your experience..."
              value={newReview.content}
              onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              loading={createMutation.isPending}
              disabled={!newReview.authorName || !newReview.content}
              onClick={() => createMutation.mutate()}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
