"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar, MapPin, Clock, Users, ArrowRight,
  Camera, Sparkles, Globe2, X,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const upcomingEvents = [
  {
    id: 1,
    title: "AI-Solutions Global Summit 2026",
    date: "15 June 2026",
    time: "09:00 – 17:00 BST",
    location: "Sunderland Convention Centre, UK",
    type: "Conference",
    thumbnail: "/images/events/global-summit.png",
    description:
      "Join industry leaders and AI pioneers for a full day of keynotes, technical demos, and networking focused on the future of AI in the digital workplace.",
    seats: 350,
    isOnline: false,
    isFree: false,
  },
  {
    id: 2,
    title: "AI Virtual Assistant Live Demo",
    date: "22 May 2026",
    time: "14:00 – 15:30 BST",
    location: "Online — Zoom Webinar",
    type: "Webinar",
    thumbnail: "/images/events/virtual-assistant-demo.png",
    description:
      "See our AI Virtual Assistant in action. Watch real-world use cases, ask questions live, and learn how to deploy it within your organisation in under a week.",
    seats: 500,
    isOnline: true,
    isFree: true,
  },
  {
    id: 3,
    title: "Rapid Prototyping Workshop",
    date: "5 July 2026",
    time: "10:00 – 16:00 BST",
    location: "Newcastle upon Tyne, UK",
    type: "Workshop",
    thumbnail: "/images/events/prototyping-workshop.png",
    description:
      "Hands-on workshop where participants build and validate a working AI prototype from scratch. Limited seats for an immersive experience.",
    seats: 40,
    isOnline: false,
    isFree: false,
  },
  {
    id: 4,
    title: "Healthcare AI Innovation Panel",
    date: "18 August 2026",
    time: "15:00 – 17:00 BST",
    location: "Online — Microsoft Teams",
    type: "Webinar",
    thumbnail: "/images/events/healthcare-panel.png",
    description:
      "A panel discussion exploring how AI is transforming patient outcomes, administrative efficiency, and clinical decision support across the NHS and global health systems.",
    seats: 200,
    isOnline: true,
    isFree: true,
  },
];

const galleryItems = [
  { label: "AI-Solutions Launch Event 2021", url: "/images/events/launch-event.png" },
  { label: "Global Tech Summit 2023", url: "/images/events/global-summit.png" },
  { label: "Sunderland Innovation Awards", url: "/images/events/prototyping-workshop.png" },
  { label: "AI Hackathon Finals", url: "/images/events/hackathon-finals.png" },
  { label: "Product Demo Day 2024", url: "/images/events/virtual-assistant-demo.png" },
  { label: "Healthcare AI Conference 2025", url: "/images/events/healthcare-panel.png" },
];

const typeColors: Record<string, "primary" | "success" | "info" | "warning"> = {
  Conference: "primary",
  Webinar: "success",
  Workshop: "warning",
  Panel: "info",
};

interface EventImageProps {
  src: string;
  alt: string;
  type: string;
  className?: string;
}

function EventImage({ src, alt, type, className }: EventImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const themeGradients: Record<string, string> = {
    Conference: "from-indigo-600 via-purple-600 to-pink-500",
    Webinar: "from-emerald-500 via-teal-600 to-indigo-600",
    Workshop: "from-purple-600 via-indigo-600 to-cyan-500",
    Panel: "from-cyan-500 via-blue-600 to-indigo-600",
    Default: "from-slate-700 via-slate-800 to-slate-900",
  };

  const gradient = themeGradients[type] || themeGradients.Default;

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Dynamic tech gradient fallback */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr ${gradient} flex flex-col items-center justify-center p-6 text-center transition-opacity duration-500 ${loaded && !error ? 'opacity-0' : 'opacity-100'}`}
      >
        <div 
          className="absolute inset-0 opacity-15" 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "20px 20px"
          }} 
        />
        <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/20 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-black/30 rounded-full blur-2xl animate-pulse" />
        
        <div className="relative z-10 w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white mb-2 shadow-lg">
          {type === "Conference" && <Sparkles className="w-5 h-5 animate-pulse" />}
          {type === "Webinar" && <Globe2 className="w-5 h-5" />}
          {type === "Workshop" && <Camera className="w-5 h-5" />}
          {type === "Panel" && <Users className="w-5 h-5" />}
          {!["Conference", "Webinar", "Workshop", "Panel"].includes(type) && <Sparkles className="w-5 h-5" />}
        </div>
        
        <span className="relative z-10 text-[9px] font-bold uppercase tracking-widest text-white/80">
          {type}
        </span>
        <span className="relative z-10 text-xs font-semibold text-white mt-0.5 line-clamp-1">
          {alt}
        </span>
      </div>

      {!error && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

interface GalleryImageProps {
  src: string;
  alt: string;
  className?: string;
}

function GalleryImage({ src, alt, className }: GalleryImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const getGradientForLabel = (label: string) => {
    const gradients = [
      "from-indigo-600 via-indigo-700 to-purple-800",
      "from-purple-600 via-pink-600 to-red-500",
      "from-cyan-500 via-blue-600 to-indigo-700",
      "from-emerald-500 via-teal-600 to-indigo-700",
      "from-orange-500 via-red-500 to-pink-600",
      "from-violet-600 via-indigo-600 to-cyan-500"
    ];
    let sum = 0;
    for (let i = 0; i < label.length; i++) sum += label.charCodeAt(i);
    return gradients[sum % gradients.length];
  };

  const gradient = getGradientForLabel(alt);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center p-4 text-center transition-opacity duration-500 ${loaded && !error ? 'opacity-0' : 'opacity-100'}`}>
        <div 
          className="absolute inset-0 opacity-10" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "15px 15px"
          }} 
        />
        <Camera className="w-6 h-6 text-white/60 mb-1 relative z-10" />
        <span className="text-[9px] text-white/80 font-medium uppercase tracking-widest relative z-10 px-2 line-clamp-2">
          {alt}
        </span>
      </div>

      {!error && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export default function EventsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="section-padding mesh-bg-subtle text-center">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-3 block">
              Events & Gallery
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Join Our <span className="gradient-text">Community</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Connect with AI innovators, see our solutions in action, and be
              part of the conversation shaping the future of digital work.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-2">
              Upcoming Events
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              Register now to secure your place at our upcoming events
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="h-full flex flex-col overflow-hidden group">
                  <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-[#16161f]">
                    <EventImage
                      src={event.thumbnail}
                      alt={event.title}
                      type={event.type}
                    />
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                    <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap z-20">
                      <Badge variant={typeColors[event.type] ?? "default"}>
                        {event.type}
                      </Badge>
                      {event.isFree && (
                        <Badge variant="success">Free</Badge>
                      )}
                    </div>
                    {event.isOnline && (
                      <div className="absolute top-3 right-3 z-20">
                        <Badge variant="info">
                          <Globe2 className="w-3 h-3" />
                          Online
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="p-6 flex flex-1 flex-col">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-1 line-clamp-2">
                      {event.description}
                    </p>

                    <div className="flex flex-col gap-2 text-xs text-slate-600 dark:text-slate-400 mb-5">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        {event.location}
                      </div>
                    </div>

                    <Link href="/contact">
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                        className="w-full"
                      >
                        Register Interest
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-16 border-y border-slate-200 dark:border-white/6 bg-slate-100/50 dark:bg-[#111118]/40">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-10"
          >
            <Camera className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
              Event Gallery
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 dark:border-white/6 group cursor-pointer"
                onClick={() => setSelectedImage(item.url)}
              >
                <GalleryImage
                  src={item.url}
                  alt={item.label}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-8 h-8 text-white mb-2" />
                  <p className="text-xs text-white text-center font-medium">
                    {item.label}
                  </p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 group-hover:hidden transition-all">
                  <p className="text-[10px] text-white/70 font-medium truncate uppercase tracking-widest">
                    {item.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out backdrop-blur-sm"
              >
                <button
                  className="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-50"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="w-6 h-6" />
                </button>
                <motion.img
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.9 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={selectedImage}
                  alt="Gallery full view"
                  className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-slate-500 dark:text-slate-600 mt-6">
            Showing highlights from our latest brand and community engagements. © {new Date().getFullYear()} AI-Solutions Ltd.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Want to Host or Sponsor an Event?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              Partner with AI-Solutions to showcase your brand to a global
              audience of tech leaders and innovators.
            </p>
            <Link href="/contact">
              <Button variant="primary" size="lg">
                Get In Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
