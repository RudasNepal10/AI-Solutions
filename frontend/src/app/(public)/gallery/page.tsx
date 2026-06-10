"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Play, ImageOff } from "lucide-react";


const PROJECTS = [
  { id: 1, title: "Fintech Dashboard", category: "Finance", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", type: "image" },
  { id: 2, title: "Healthcare AI Assistant", category: "HealthTech", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80", type: "image" },
  { id: 3, title: "Retail Analytics Platform", category: "E-Commerce", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", type: "video" },
  { id: 4, title: "Automated Supply Chain", category: "Logistics", image: "/images/automated_supply_chain.png", type: "image" },
  { id: 5, title: "Smart City Infrastructure", category: "Public Sector", image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80", type: "image" },
  { id: 6, title: "EdTech Learning System", category: "Education", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80", type: "video" },
];

function ProjectImage({ project }: { project: typeof PROJECTS[number] }) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex flex-col items-center justify-center gap-2">
        <ImageOff className="w-8 h-8 text-slate-400 dark:text-slate-600" />
      </div>
    );
  }

  return (
    <img
      src={project.image}
      alt={project.title}
      onError={() => setError(true)}
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}

export default function PublicGalleryPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Badge variant="primary" className="mb-4">Our Portfolio</Badge>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
          Past Projects &amp; Gallery
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Explore our successful digital transformation initiatives and software solutions delivered to enterprise clients worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {PROJECTS.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#111118] border border-slate-200 dark:border-white/10 shadow-xl"
          >
            <div className="aspect-[4/3] overflow-hidden relative bg-slate-100 dark:bg-slate-900/50">
              <ProjectImage project={project} />
              {project.type === "video" && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>
              )}
            </div>
            {/* Overlay label — always on top of image so white text is fine */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
              <Badge variant="warning" className="mb-2 bg-black/50 backdrop-blur-md border-white/20 text-white">{project.category}</Badge>
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
