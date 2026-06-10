"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Globe2, Lightbulb, Award, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

const values = [
  { icon: <Lightbulb className="w-6 h-6" />, title: "Innovation First", description: "We push the boundaries of AI, constantly exploring new ways to solve challenges that matter most to businesses." },
  { icon: <Globe2 className="w-6 h-6" />, title: "People-Centred", description: "Every solution we build is designed with the end user experience at the forefront — supporting people at work." },
  { icon: <Target className="w-6 h-6" />, title: "Global Impact", description: "From Sunderland to the world — our commitment to innovation drives a mission to create meaningful impact everywhere." },
  { icon: <Award className="w-6 h-6" />, title: "Uncompromising Quality", description: "We maintain the highest standards in AI engineering, security, and customer service. Our reputation is built on trust." },
];

const milestones = [
  { year: "2021", event: "AI-Solutions founded in Sunderland, UK" },
  { year: "2022", event: "First enterprise AI Virtual Assistant deployed" },
  { year: "2023", event: "Expanded to 12 countries, 100+ clients" },
  { year: "2024", event: "Launched Rapid Prototyping platform" },
  { year: "2025", event: "Reached 2M+ AI queries processed monthly" },
  { year: "2026", event: "Global expansion — 50 industries, 300+ clients" },
];

const team = [
  {
    name: "Dr. Eleanor Hartley",
    role: "CEO & Co-founder",
    initials: "EH",
    bio: "Dr. Eleanor Hartley is a pioneer in AI research, with a PhD in Machine Learning from the University of Oxford. She spent over a decade designing intelligent autonomous agents for industrial automation before co-founding AI-Solutions. Under her leadership, the company has grown from a local Sunderland startup into a global provider of digital workplace solutions."
  },
  {
    name: "Marcus Chen",
    role: "CTO & Co-founder",
    initials: "MC",
    bio: "Marcus Chen oversees the core system architecture and engineering at AI-Solutions. With a background in distributed systems and high-frequency infrastructure, he has led key innovations in real-time streaming, natural language processing pipelines, and rapid prototyping tools that form the bedrock of our platform."
  },
  {
    name: "Anil Pande",
    role: "Head of Product",
    initials: "AP",
    bio: "Anil Pande leads the product strategy and roadmap at AI-Solutions. With over 8 years of experience in product management at top SaaS startups, Anil bridges the gap between complex AI capabilities and intuitive, high-value user interfaces that deliver exceptional business value."
  },
  {
    name: "Roodles Nepal",
    role: "Lead AI Engineer",
    initials: "RN",
    bio: "Roodles Nepal is the core architect of our modern AI capabilities. Based in Kathmandu, Roodles is an elite AI engineer specialized in large language model fine-tuning, retrieval-augmented generation (RAG), and agentic workflows, steering the technical implementation of our premium services."
  },
];

export default function AboutPage() {
  const [selectedMember, setSelectedMember] = useState<typeof team[number] | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="section-padding mesh-bg-subtle">
        <div className="container-custom max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 block">Our Story</span>
            <h1 className="text-5xl font-bold font-display text-slate-900 dark:text-white mb-5">
              Built in Sunderland.<br /><span className="gradient-text">Trusted Worldwide.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
              AI-Solutions was founded with a singular purpose: to make artificial intelligence accessible, practical, and transformative for organisations of every size. Our mission is to innovate, promote, and deliver the future of the digital employee experience.
            </p>
            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
              <MapPin className="w-4 h-4 text-indigo-500" />
              <span>Sunderland, United Kingdom — with global reach</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission / Vision / USP */}
      <section className="py-16 border-y border-slate-200 dark:border-white/6 bg-slate-50 dark:bg-[#111118]/40">
        <div className="container-custom grid md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="w-6 h-6" />, label: "Mission", text: "To innovate, promote, and deliver the future of the digital employee experience — supporting people at work with transformative AI." },
            { icon: <Globe2 className="w-6 h-6" />, label: "Vision", text: "A world where every organisation can harness the power of AI to unlock human potential and drive sustainable growth." },
            { icon: <Lightbulb className="w-6 h-6" />, label: "Our USP", text: "The only AI platform combining an integrated virtual assistant with rapid prototyping — making advanced AI affordable and accessible." },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{item.label}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white text-center mb-10">Core Values</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="p-6 flex gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">{v.icon}</div>
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">{v.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{v.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Timeline */}
      <section className="py-16 border-y border-slate-200 dark:border-white/6 bg-slate-50 dark:bg-[#111118]/40">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white text-center mb-12">Our Journey</h2>
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-indigo-500/20" aria-hidden="true" />
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-6 mb-8 pl-12 relative">
                <div className="absolute left-0 w-8 h-8 rounded-full bg-indigo-600 border-2 border-indigo-400/30 flex items-center justify-center top-0">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{m.year}</span>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-10">Leadership Team</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto -mt-6 mb-10">
            Click on any team member to view their professional biography and background.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card
                  hover
                  onClick={() => setSelectedMember(member)}
                  className="p-5 text-center cursor-pointer hover:border-brand-500/50 hover:shadow-lg transition-all"
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/25 flex items-center justify-center text-lg font-bold text-indigo-600 dark:text-indigo-300 mx-auto mb-3 transition-transform group-hover:scale-105">{member.initials}</div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{member.role}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Biography Modal */}
      <Modal
        open={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        title={selectedMember?.name ?? ""}
        description={selectedMember?.role ?? ""}
        size="md"
      >
        {selectedMember && (
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 py-2">
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-brand-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-brand-500/25">
              {selectedMember.initials}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-2">Professional Biography</h4>
              <p className="text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                {selectedMember.bio}
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* CTA */}
      <section className="py-20 border-t border-slate-200 dark:border-white/6 text-center">
        <div className="container-custom">
          <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">Become Part of Our Story</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">Whether you are a potential client, partner, or future team member — we would love to hear from you.</p>
          <Link href="/contact"><Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>Get In Touch</Button></Link>
        </div>
      </section>
    </div>
  );
}
