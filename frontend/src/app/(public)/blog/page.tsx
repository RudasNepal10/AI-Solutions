"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, BookOpen, ArrowRight, TrendingUp, CheckCircle, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { blogsApi, type BlogListDto } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const CASE_STUDIES = [
  {
    title: "BioPharma Research: Accelerating Protein Synthesis",
    industry: "Healthcare & Biotech",
    description: "Integrated predictive AI modules to analyze biological sequences, reducing prototyping and synthesis cycles by over 70%.",
    metric: "70% Cycle Reduction",
    outcome: "Ready in 4 Days",
    image: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&q=80",
    challenge: "A leading UK biopharmaceutical company was struggling with lengthy protein synthesis timelines — each cycle taking up to 14 days — creating severe bottlenecks in their drug discovery pipeline. They needed a transformational approach to slash iteration time and accelerate their R&D output.",
    solution: "AI-Solutions embedded a predictive AI engine that analysed biological sequences in real-time, cross-referencing with a curated molecular database to predict optimal synthesis paths. Our rapid prototyping platform enabled researchers to simulate outcomes before committing to wet-lab processes.",
    results: [
      "Synthesis cycle time cut from 14 days to just 4 days",
      "70% reduction in experimental failure rates",
      "£3.8M saved in annual lab reagent costs",
      "12 new drug candidates brought to Phase 1 trials 8 months earlier",
    ]
  },
  {
    title: "Global Logistics Inc: Supply Chain Dynamic Routing",
    industry: "Transport & Logistics",
    description: "Deployed predictive analytics and system integrations to dynamically re-route shipments based on real-time port telemetry.",
    metric: "15% Fuel Saved",
    outcome: "$4.2M Saved Annually",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80",
    challenge: "Global Logistics Inc operated a fleet of 2,400 vehicles across 38 countries, losing millions annually to inefficient fixed routing that could not adapt to real-time disruptions — port closures, traffic, weather, and fuel price spikes.",
    solution: "We integrated our AI-powered dynamic routing system directly into their existing TMS (Transport Management System), providing real-time rerouting recommendations based on live telemetry feeds from port authorities, traffic APIs, and IoT sensors installed across their fleet.",
    results: [
      "15% fleet-wide fuel consumption reduction",
      "$4.2M saved in annual operational costs",
      "Average delivery time improved by 22%",
      "CO₂ emissions reduced by 18,000 tonnes per year",
    ]
  },
  {
    title: "Apex Retail Systems: Generative Customer Support Hub",
    industry: "E-Commerce & Retail",
    description: "Rolled out context-aware AI virtual assistants handling multi-lingual customer inquiries with 94% first-contact resolution.",
    metric: "94% Resolution Rate",
    outcome: "80% Workload Down",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80",
    challenge: "Apex Retail was processing over 50,000 customer inquiries per day during peak retail seasons, with their support team of 300 agents stretched beyond capacity. Customer satisfaction scores were declining and ticket backlogs were spiralling out of control.",
    solution: "We deployed a multi-lingual generative AI virtual assistant integrated directly into their Zendesk instance. The assistant was fine-tuned on 5 years of resolved support tickets, enabling it to handle returns, order tracking, and product queries contextually across 14 languages.",
    results: [
      "94% first-contact resolution rate — up from 47%",
      "80% reduction in human agent workload",
      "Average response time cut from 4 hours to under 90 seconds",
      "Customer satisfaction (CSAT) score improved from 3.2 to 4.7 / 5",
    ]
  },
  {
    title: "UK FinTech Corporation: Real-time Fraud Shield",
    industry: "Banking & Finance",
    description: "Embedded deep learning anomaly detection networks to flag fraudulent transaction sequences instantly under strict regulations.",
    metric: "99.9% Detection Accuracy",
    outcome: "Zero Compliance Fines",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
    challenge: "A rapidly growing UK FinTech was processing £2.4B in transactions monthly, facing rising fraud losses and increasing scrutiny from the FCA. Their legacy rule-based fraud system was generating too many false positives and missing sophisticated fraud patterns.",
    solution: "AI-Solutions embedded a deep learning anomaly detection network that analyses transaction sequences in real-time using graph neural networks. The system learns user behavioural fingerprints and flags deviations instantly, operating fully within FCA compliance frameworks.",
    results: [
      "99.9% fraud detection accuracy — from 87% previously",
      "False positives reduced by 94%, eliminating customer friction",
      "Zero FCA compliance fines since deployment",
      "£12M in prevented fraudulent transactions in Year 1",
    ]
  },
  {
    title: "Sunderland Energy Network: Smart Grid Balancer",
    industry: "Utilities & Energy",
    description: "Integrated AI agents predicting consumption spikes and automatically routing stored battery power back into the microgrid.",
    metric: "30% Grid Efficiency",
    outcome: "Stable Peak Telemetry",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&q=80",
    challenge: "Sunderland Energy Network's ageing grid infrastructure could not handle the unpredictable demand spikes from EV charging and industrial surges, resulting in load-shedding incidents, costly peak tariffs, and grid instability.",
    solution: "We deployed an AI grid balancing agent that ingests live telemetry from 12,000 smart meters, weather APIs, and battery storage units. The agent proactively predicts demand spikes 30 minutes ahead and automatically routes stored renewable energy back into the grid to maintain stability.",
    results: [
      "30% increase in overall grid efficiency",
      "Load-shedding incidents reduced by 96% in Year 1",
      "£1.9M saved in peak-rate energy purchase costs",
      "Carbon grid intensity reduced by 24% through smarter renewable dispatch",
    ]
  }
];

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<typeof CASE_STUDIES[number] | null>(null);

  // Esc key close handler for custom full-screen modal
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCaseStudy(null);
    },
    [setSelectedCaseStudy]
  );

  useEffect(() => {
    if (selectedCaseStudy) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedCaseStudy, handleKeyDown]);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["public-blogs", search],
    queryFn: async () => {
      const res = await blogsApi.getAll({ search: search || undefined, pageSize: 24 });
      return res.data.data ?? [];
    },
  });

  const published = (blogs ?? []).filter((b) => b.isPublished);

  return (
    <div>
      {/* Hero */}
      <section className="section-padding mesh-bg-subtle text-center">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 block">Insights</span>
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
              AI-Solutions <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto mb-8">
              Expert insights, industry news, and practical guides on AI, digital transformation, and the future of work.
            </p>
            <div className="relative max-w-md mx-auto">
              <input
                type="search"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/6 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-sm"
                id="blog-search"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none z-10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding pb-8">
        <div className="container-custom">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : published.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-4 opacity-30" />
              <p className="text-sm">No articles published yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {published.map((blog: BlogListDto, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/blog/${blog.slug}`}>
                    <Card hover className="h-full flex flex-col overflow-hidden group">
                      <div className="relative h-56 overflow-hidden">
                        {blog.thumbnailUrl ? (
                          <img
                            src={blog.thumbnailUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/20 flex items-center justify-center">
                            <BookOpen className="w-12 h-12 text-indigo-400/40" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                        <div className="absolute top-4 left-4">
                          <Badge variant="primary" className="bg-black/50 backdrop-blur-md border-white/10">
                            {blog.categoryName || "AI Insights"}
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-1">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {blog.title}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6 flex-1">
                          {blog.excerpt || "Dive into our latest research and insights on how AI is reshaping the digital landscape and empowering businesses globally."}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/6 mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                              {blog.authorName.charAt(0)}
                            </div>
                            <span className="text-xs font-medium text-slate-500">{blog.authorName}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-slate-600 font-medium uppercase tracking-wider">
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="section-padding border-t border-slate-200 dark:border-white/6 bg-slate-50/50 dark:bg-[#111118]/20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-600 dark:text-brand-400 mb-3 block">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
              AI-Solutions <span className="gradient-text">Case Studies</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Discover how AI-Solutions enables organizations to accelerate engineering, automate operations, and optimize customer experiences.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CASE_STUDIES.map((cs, i) => (
              <motion.div
                key={cs.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Card hover className="h-full flex flex-col overflow-hidden group p-0 cursor-pointer" onClick={() => setSelectedCaseStudy(cs)}>
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={cs.image}
                      alt={cs.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge variant="primary" className="bg-brand-600/90 text-white font-semibold border-none">
                        {cs.metric}
                      </Badge>
                    </div>
                    {/* Read overlay on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm font-semibold">
                        <BookOpen className="w-4 h-4" />
                        Read Case Study
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1.5 block">
                      {cs.industry}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {cs.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-1">
                      {cs.description}
                    </p>
                    <div className="border-t border-slate-100 dark:border-white/5 pt-4 mt-auto flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-700 dark:text-slate-400">
                        <span>Outcome:</span>
                        <span className="text-emerald-500 font-bold uppercase tracking-wider">{cs.outcome}</span>
                      </div>
                      <span className="flex items-center gap-1 text-[10px] text-brand-600 dark:text-brand-400 font-semibold group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Detail Modal (Full Screen Reader) */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-hidden bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-0 md:p-4 lg:p-6"
          >
            {/* Ambient background glow */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 15 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative w-full h-full md:h-[92vh] md:max-w-6xl bg-white dark:bg-[#0B0B10] md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-white/5 z-10"
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2.5 rounded-full bg-slate-900/60 dark:bg-black/60 border border-slate-200/20 dark:border-white/10 hover:bg-slate-800/80 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/20 text-white backdrop-blur-md transition-all shadow-lg hover:scale-105 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* LEFT COLUMN: Sticky Hero Visual (42%) */}
              <div className="relative w-full md:w-5/12 h-64 md:h-full shrink-0 overflow-hidden flex flex-col justify-end p-6 md:p-10 lg:p-12">
                {/* Background Image with sophisticated zoom effect */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={selectedCaseStudy.image}
                    alt={selectedCaseStudy.title}
                    className="w-full h-full object-cover opacity-85 scale-105"
                  />
                  {/* High contrast overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/20 to-slate-950/80 hidden md:block" />
                </div>

                {/* Left side content */}
                <div className="relative z-10 flex flex-col gap-4 max-w-md">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 w-fit">
                    {selectedCaseStudy.industry}
                  </span>
                  
                  <h2 className="text-2xl lg:text-3xl font-black font-display text-white leading-tight">
                    {selectedCaseStudy.title}
                  </h2>
                  
                  <p className="text-sm text-slate-300 leading-relaxed font-light mt-1 hidden md:block">
                    {selectedCaseStudy.description}
                  </p>

                  {/* Impact Stats Panel */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                    <div className="glass p-4 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
                      <div className="absolute -right-2 -bottom-2 opacity-5 text-indigo-400">
                        <TrendingUp className="w-16 h-16" />
                      </div>
                      <p className="text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                        {selectedCaseStudy.metric}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Impact Metric</p>
                    </div>

                    <div className="glass p-4 rounded-2xl border border-white/10 backdrop-blur-sm relative overflow-hidden group">
                      <div className="absolute -right-2 -bottom-2 opacity-5 text-emerald-400">
                        <CheckCircle className="w-16 h-16" />
                      </div>
                      <p className="text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                        {selectedCaseStudy.outcome}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">Direct Outcome</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Reading Experience (58%) */}
              <div className="flex-1 overflow-y-auto h-full bg-slate-50 dark:bg-[#0B0B10] flex flex-col">
                <div className="w-full max-w-2xl mx-auto px-6 py-8 md:px-12 md:py-16 flex-1 flex flex-col gap-10">
                  
                  {/* Intro header for mobile */}
                  <div className="md:hidden pb-4 border-b border-slate-200 dark:border-white/5">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                      {selectedCaseStudy.description}
                    </p>
                  </div>

                  {/* Challenge Section */}
                  <div className="group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 rounded-full bg-amber-500" />
                      <h4 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">
                        The Challenge
                      </h4>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 text-[16px] md:text-[17px] leading-relaxed font-sans font-light pl-3.5 border-l border-slate-200 dark:border-white/5 group-hover:border-amber-500/30 transition-colors duration-300">
                      {selectedCaseStudy.challenge}
                    </p>
                  </div>

                  {/* Solution Section */}
                  <div className="group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-6 rounded-full bg-indigo-500" />
                      <h4 className="text-xs font-extrabold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                        Our Solution
                      </h4>
                    </div>
                    <p className="text-slate-750 dark:text-slate-300 text-[16px] md:text-[17px] leading-relaxed font-sans font-light pl-3.5 border-l border-slate-200 dark:border-white/5 group-hover:border-indigo-500/30 transition-colors duration-300">
                      {selectedCaseStudy.solution}
                    </p>
                  </div>

                  {/* Results Section */}
                  <div className="group">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-1.5 h-6 rounded-full bg-emerald-500" />
                      <h4 className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                        Key Results & engineering impact
                      </h4>
                    </div>
                    <div className="flex flex-col gap-3 pl-3.5 border-l border-slate-200 dark:border-white/5 group-hover:border-emerald-500/30 transition-colors duration-300">
                      {selectedCaseStudy.results.map((r, i) => (
                        <div
                          key={i}
                          className="glass-card p-4 rounded-xl border border-slate-200 dark:border-white/5 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 hover:bg-emerald-500/5 dark:hover:bg-emerald-500/5 transition-all duration-300 flex items-start gap-3.5 group/item"
                        >
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 group-hover/item:bg-emerald-500 group-hover/item:text-black transition-colors duration-300">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                          <span className="text-[15px] text-slate-800 dark:text-slate-200 font-sans font-normal leading-relaxed">
                            {r}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Close Action Buttons */}
                  <div className="pt-8 border-t border-slate-200 dark:border-white/5 mt-auto flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => setSelectedCaseStudy(null)}
                      className="flex-1 py-4 text-center text-white font-bold bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg hover:shadow-indigo-600/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      Done Reading
                    </button>
                    <button
                      onClick={() => setSelectedCaseStudy(null)}
                      className="py-4 px-6 text-center text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white font-semibold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all border border-slate-200 dark:border-white/5 cursor-pointer"
                    >
                      Back to Insights
                    </button>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
