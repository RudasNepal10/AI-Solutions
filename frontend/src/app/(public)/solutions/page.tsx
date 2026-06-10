"use client";

import { motion } from "framer-motion";
import {
  Bot, Zap, BarChart3, Layers, Shield, Cpu,
  ArrowRight, CheckCircle, Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const solutions = [
  {
    id: "ai-assistant",
    icon: <Bot className="w-7 h-7" />,
    title: "AI Virtual Assistant",
    tagline: "Always-on intelligent support",
    description:
      "Deploy a conversational AI assistant that understands your business context, handles employee queries instantly, and continuously learns from interactions. Reduce support tickets by up to 70% and free your team to focus on high-value work.",
    features: [
      "Natural language understanding",
      "Multi-channel deployment",
      "Context-aware responses",
      "Continuous learning & improvement",
      "Seamless escalation to human agents",
      "Analytics & insight dashboard",
    ],
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
    glow: "shadow-indigo-500/20",
  },
  {
    id: "prototyping",
    icon: <Zap className="w-7 h-7" />,
    title: "Rapid AI Prototyping",
    tagline: "From concept to demo in 48 hours",
    description:
      "Our AI-accelerated prototyping framework compresses months of development into days. Validate ideas quickly, gather early feedback, and iterate at the speed of thought — all with production-quality output.",
    features: [
      "AI-generated code scaffolding",
      "Design-to-prototype in hours",
      "Real user testing integration",
      "Iterative feedback loops",
      "Scalable to production",
      "Cost-effective validation",
    ],
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10 border-violet-500/20",
    glow: "shadow-violet-500/20",
  },
  {
    id: "analytics",
    icon: <BarChart3 className="w-7 h-7" />,
    title: "Predictive Analytics",
    tagline: "Foresight powered by machine learning",
    description:
      "Transform your raw data into actionable intelligence. Our predictive models identify trends, forecast demand, and surface risks before they become problems — keeping you one step ahead of the competition.",
    features: [
      "Real-time data processing",
      "Customisable ML models",
      "Trend & anomaly detection",
      "Interactive data visualisation",
      "Automated executive reports",
      "API-first data integration",
    ],
    color: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10 border-sky-500/20",
    glow: "shadow-sky-500/20",
  },
  {
    id: "integration",
    icon: <Layers className="w-7 h-7" />,
    title: "System Integration",
    tagline: "Unify your technology ecosystem",
    description:
      "Connect disparate enterprise tools into a coherent, AI-enhanced platform. Whether it's CRM, ERP, HRIS, or custom systems — we build the bridges that make your technology work together seamlessly.",
    features: [
      "REST & GraphQL API connectors",
      "Pre-built enterprise adapters",
      "Real-time data sync",
      "Event-driven architecture",
      "Zero-downtime migration",
      "Comprehensive audit trails",
    ],
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    glow: "shadow-emerald-500/20",
  },
  {
    id: "security",
    icon: <Shield className="w-7 h-7" />,
    title: "AI Security & Compliance",
    tagline: "Protect what matters most",
    description:
      "Our AI-driven security suite continuously monitors your digital environment, detects threats in real time, and automates compliance workflows — keeping you protected and audit-ready at all times.",
    features: [
      "AI-powered threat detection",
      "Automated compliance reporting",
      "GDPR & ISO 27001 alignment",
      "Zero-trust architecture",
      "Incident response automation",
      "Continuous vulnerability scanning",
    ],
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
    glow: "shadow-amber-500/20",
  },
  {
    id: "automation",
    icon: <Cpu className="w-7 h-7" />,
    title: "Process Automation",
    tagline: "Eliminate repetitive work at scale",
    description:
      "Intelligently automate high-volume, rule-based tasks across your organisation. From document processing to approval workflows — our AI learns your processes and executes them flawlessly, 24/7.",
    features: [
      "Intelligent document processing",
      "Workflow design studio",
      "Exception handling & alerts",
      "Human-in-the-loop controls",
      "Performance analytics",
      "No-code automation builder",
    ],
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    glow: "shadow-rose-500/20",
  },
];

export default function SolutionsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="section-padding mesh-bg-subtle text-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 block">
              Our Services
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mb-5">
              Software Solutions That
              <br />
              <span className="gradient-text">Drive Real Results</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
              Each solution is purpose-built to address the unique challenges
              faced by modern organisations — powered by the latest advances in
              artificial intelligence.
            </p>
            <Link href="/contact">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Schedule a Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Solutions detail */}
      <section className="section-padding">
        <div className="container-custom flex flex-col gap-20">
          {solutions.map((s, i) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${s.bg} ${s.color} mb-5`}
                >
                  {s.icon}
                </div>
                <p className={`text-sm font-medium mb-2 ${s.color}`}>
                  {s.tagline}
                </p>
                <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">
                  {s.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                  {s.description}
                </p>
                <ul className="grid sm:grid-cols-2 gap-2.5 mb-8">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle className={`w-4 h-4 shrink-0 ${s.color}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    size="md"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Visual card */}
              <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                <div
                  className={`rounded-3xl border ${s.bg} p-8 relative overflow-hidden shadow-2xl ${s.glow}`}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 blur-3xl opacity-30 rounded-full"
                    style={{ background: `var(--color-${s.color.replace("text-", "").replace(" dark:text-indigo-400", "").replace(" dark:text-violet-400", "").replace(" dark:text-sky-400", "").replace(" dark:text-emerald-400", "").replace(" dark:text-amber-400", "").replace(" dark:text-rose-400", "")})` }}
                    aria-hidden="true"
                  />
                  <div className={`text-6xl mb-6 ${s.color}`}>{s.icon}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{s.tagline}</p>

                  <div className="mt-6 flex items-center gap-2">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                      5.0 client rating
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-slate-200 dark:border-white/6 text-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Not Sure Which Solution Fits?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Our AI specialists will assess your needs and recommend the
              perfect combination of services for your organisation.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Talk to an AI Specialist
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
