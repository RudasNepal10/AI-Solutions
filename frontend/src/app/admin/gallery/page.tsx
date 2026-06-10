"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Image as ImageIcon, Video, Plus, Search, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const MOCK_GALLERY = [
  { id: 1, title: "Enterprise AI Dashboard", type: "image", industry: "Finance", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Healthcare Diagnostic Tool", type: "image", industry: "Health", url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Retail Analytics Platform", type: "video", industry: "Retail", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Smart City Traffic AI", type: "image", industry: "Government", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Logistics Optimization", type: "image", industry: "Logistics", url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "AI Learning Management", type: "video", industry: "Education", url: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80" },
];

export default function GalleryManagementPage() {
  const [search, setSearch] = useState("");
  
  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Gallery Management</h1>
          <p className="text-slate-400 text-sm mt-1">Manage past projects, images, and video uploads</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>Add Project</Button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-white/8 bg-white/40 dark:bg-white/4 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_GALLERY.filter(item => item.title.toLowerCase().includes(search.toLowerCase())).map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="h-full flex flex-col overflow-hidden group">
              <div className="relative h-48 overflow-hidden bg-[#16161f]">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-3">
                  <button className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                  <button className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge variant="primary" className="bg-black/50 backdrop-blur-md border-white/10 text-white">
                    {item.type === "video" ? <Video className="w-3 h-3 mr-1" /> : <ImageIcon className="w-3 h-3 mr-1" />}
                    {item.type}
                  </Badge>
                </div>
              </div>
              <CardBody className="flex-1 flex flex-col p-4">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate">{item.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{item.industry}</p>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
