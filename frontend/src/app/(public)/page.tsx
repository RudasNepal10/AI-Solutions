"use client";

import { type Variants, motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Zap,
  Globe2,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles,
  Bot,
  Layers,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const stats = [
  { label: "Industries Served", value: "50+", icon: <Globe2 className="w-5 h-5" /> },
  { label: "AI Queries Handled", value: "2M+", icon: <Brain className="w-5 h-5" /> },
  { label: "Client Satisfaction", value: "98%", icon: <Star className="w-5 h-5" /> },
  { label: "Global Clients", value: "300+", icon: <Users className="w-5 h-5" /> },
];

const solutions = [
  {
    icon: <Bot className="w-6 h-6" />,
    title: "AI Virtual Assistant",
    description:
      "Deploy an intelligent AI-powered assistant that handles employee queries, automates workflows, and delivers instant, accurate responses around the clock.",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Rapid Prototyping",
    description:
      "Accelerate your product lifecycle with AI-driven prototyping tools that transform ideas into working solutions in hours, not months.",
    color: "text-violet-500",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Predictive Analytics",
    description:
      "Harness machine learning to predict trends, analyse workforce data, and make proactive decisions that drive business success.",
    color: "text-sky-500",
    bg: "bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: "System Integration",
    description:
      "Seamlessly connect disparate enterprise tools into a unified, AI-enhanced platform that boosts productivity and reduces friction.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "AI Security & Compliance",
    description:
      "Protect your digital workforce with AI-powered threat detection, compliance automation, and real-time security monitoring.",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Process Automation",
    description:
      "Eliminate repetitive tasks through intelligent automation that learns and adapts to your organisation&apos;s unique workflows.",
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
];

const industries = [
  "Healthcare", "Finance", "Manufacturing", "Retail",
  "Education", "Logistics", "Legal", "Energy",
];

const testimonials = [
  {
    quote:
      "AI-Solutions transformed how our team works. The virtual assistant alone saved us 20+ hours per week in manual processes.",
    author: "Sarah Mitchell",
    role: "CTO, NovaTech UK",
    rating: 5,
  },
  {
    quote:
      "The prototyping capabilities are incredible. We went from concept to working demo in under 48 hours. Truly remarkable.",
    author: "James Okonkwo",
    role: "Head of Innovation, PharmaCore",
    rating: 5,
  },
  {
    quote:
      "Our digital employee experience has never been better. AI-Solutions delivered beyond expectations on every metric.",
    author: "Priya Sharma",
    role: "VP Operations, GlobalEdge",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-bg">
        {/* Decorative orbs */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" />
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-sky-600/8 rounded-full blur-2xl animate-[float_12s_ease-in-out_infinite_4s]" />
        </div>

        <div className="container-custom relative z-10 py-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="max-w-4xl"
          >
            {/* Pill badge */}
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Solutions for the Digital Workplace
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight text-slate-900 dark:text-white mb-6"
            >
              Innovate the
              <br />
              <span className="gradient-text">Digital Employee</span>
              <br />
              Experience
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mb-10 leading-relaxed"
            >
              AI-Solutions leverages cutting-edge artificial intelligence to
              proactively address challenges impacting your workforce — speeding
              up design, engineering, and innovation across every industry.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-wrap gap-4"
            >
              <Link href="/solutions">
                <Button
                  variant="primary"
                  size="xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Solutions
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="xl">
                  Request Demo
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="flex flex-wrap items-center gap-6 mt-12"
            >
              {[
                "SOC 2 Certified",
                "GDPR Compliant",
                "99.9% Uptime SLA",
              ].map((badge) => (
                <div
                  key={badge}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  {badge}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-slate-200 dark:border-white/6 bg-slate-50 dark:bg-[#111118]/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-3">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTIONS */}
      <section className="section-padding" id="solutions">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 block">
              What We Offer
            </span>
            <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Software Solutions That Scale
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From AI virtual assistants to predictive analytics — our suite of
              tools is designed to transform every aspect of the digital
              workplace.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
              >
                <Card hover className="p-6 h-full">
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl border ${s.bg} ${s.color} mb-4`}
                  >
                    {s.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {s.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/solutions">
              <Button
                variant="outline"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                View All Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-16 bg-slate-50 dark:bg-[#111118]/40 border-y border-slate-200 dark:border-white/5">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white mb-2">
              Trusted Across Industries
            </h2>
            <p className="text-slate-600 dark:text-slate-500 text-sm">
              Our AI solutions adapt to the unique needs of your sector
            </p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-3">
            {industries.map((industry, i) => (
              <motion.span
                key={industry}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-5 py-2.5 rounded-full bg-white dark:bg-white/4 border border-slate-200 dark:border-white/8 text-sm text-slate-700 dark:text-slate-300 hover:border-indigo-500/40 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all cursor-default shadow-sm"
              >
                {industry}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 block">
              Client Feedback
            </span>
            <h2 className="text-4xl font-bold font-display text-slate-900 dark:text-white">
              Trusted by Leaders Worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.author}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed flex-1 mb-4">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="border-t border-slate-200 dark:border-white/6 pt-4">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {t.author}
                    </p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none"
          aria-hidden="true"
        />
        <div className="container-custom relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Ready to Transform Your
              <br />
              <span className="gradient-text">Digital Workplace?</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Schedule a personalised demo and discover how AI-Solutions can
              drive measurable impact for your organisation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/solutions">
                <Button
                  variant="primary"
                  size="xl"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Explore Solutions
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="secondary" size="xl">
                  Request Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
