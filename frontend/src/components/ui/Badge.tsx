import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variants: Record<BadgeVariant, string> = {
  default:
    "bg-slate-100 dark:bg-slate-400/10 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-400/20",
  primary:
    "bg-indigo-50 dark:bg-indigo-400/10 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-400/20",
  success:
    "bg-emerald-50 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-400/20",
  warning:
    "bg-amber-50 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-400/20",
  danger:
    "bg-red-50 dark:bg-red-400/10 text-red-700 dark:text-red-400 border-red-100 dark:border-red-400/20",
  info:
    "bg-sky-50 dark:bg-sky-400/10 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-400/20",
  purple:
    "bg-violet-50 dark:bg-violet-400/10 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-400/20",
};

export function Badge({ children, variant = "default", className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            variant === "success" && "bg-emerald-400",
            variant === "danger" && "bg-red-400",
            variant === "warning" && "bg-amber-400",
            variant === "primary" && "bg-indigo-400",
            variant === "info" && "bg-sky-400",
            variant === "purple" && "bg-violet-400",
            variant === "default" && "bg-slate-400"
          )}
        />
      )}
      {children}
    </span>
  );
}

// Connection status indicator
interface StatusDotProps {
  status: "connected" | "disconnected" | "connecting" | "reconnecting";
}
export function StatusDot({ status }: StatusDotProps) {
  const config = {
    connected: { color: "bg-emerald-400", label: "Connected" },
    disconnected: { color: "bg-red-400", label: "Disconnected" },
    connecting: { color: "bg-amber-400 animate-pulse", label: "Connecting…" },
    reconnecting: { color: "bg-amber-400 animate-pulse", label: "Reconnecting…" },
  };

  const { color, label } = config[status];

  return (
    <div className="flex items-center gap-2">
      <div className={cn("w-2 h-2 rounded-full", color)} />
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
    </div>
  );
}

// Loading skeleton
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-lg bg-black/5 dark:bg-white/5 overflow-hidden relative",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-black/5 dark:via-white/5 to-transparent" />
    </div>
  );
}
