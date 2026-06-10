import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

export function formatNepaliDateTime(date: string | Date): string {
  try {
    let d: Date;
    if (typeof date === "string") {
      // If the string has 'T' but lacks 'Z' or offset (+/-) at the end, append 'Z' to treat as UTC
      if (date.includes("T") && !date.endsWith("Z") && !date.includes("+") && !date.slice(10).includes("-")) {
        d = new Date(date + "Z");
      } else {
        d = new Date(date);
      }
    } else {
      d = date;
    }
    const dateStr = d.toLocaleDateString("en-US", {
      timeZone: "Asia/Kathmandu",
      month: "short",
      day: "numeric",
      year: "numeric"
    });
    const timeStr = d.toLocaleTimeString("en-US", {
      timeZone: "Asia/Kathmandu",
      hour: "numeric",
      minute: "numeric",
      hour12: true
    });
    return `${dateStr} at ${timeStr}`;
  } catch {
    return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
  }
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    inactive: "text-red-400 bg-red-400/10 border-red-400/20",
    resolved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    pending: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    published: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    draft: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  };
  return map[status.toLowerCase()] ?? "text-slate-400 bg-slate-400/10 border-slate-400/20";
}
