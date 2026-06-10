import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-white/7 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-sm",
        hover &&
          "transition-all duration-300 hover:border-indigo-500/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer",
        glow && "shadow-lg shadow-indigo-500/10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-6 py-5 border-b border-slate-200 dark:border-white/6", className)}>
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "px-6 py-4 border-t border-slate-200 dark:border-white/6 bg-slate-50 dark:bg-white/2 rounded-b-2xl",
        className
      )}
    >
      {children}
    </div>
  );
}

// Stat card for dashboard
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  change,
  changeType = "neutral",
  description,
  className,
}: StatCardProps) {
  const changeColors = {
    up: "text-emerald-600 dark:text-emerald-400",
    down: "text-red-600 dark:text-red-400",
    neutral: "text-slate-500 dark:text-slate-400",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 dark:border-white/7 bg-white/80 dark:bg-[#111118]/80 backdrop-blur-sm p-5",
        "transition-all duration-300 hover:border-slate-300 dark:hover:border-white/12 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 font-display">
            {value}
          </p>
          {change && (
            <p className={cn("text-xs mt-1", changeColors[changeType])}>
              {change}
            </p>
          )}
          {description && (
            <p className="text-xs text-slate-500 mt-1">{description}</p>
          )}
        </div>
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
          {icon}
        </div>
      </div>
    </div>
  );
}
