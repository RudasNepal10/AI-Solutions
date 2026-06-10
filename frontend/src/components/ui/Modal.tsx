"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle, Info, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  size = "md",
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 30 }}
            className={cn(
              "relative w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111118] shadow-2xl shadow-black/10 dark:shadow-black/60",
              sizes[size],
              className
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-slate-200 dark:border-white/6">
              <div>
                <h2 id="modal-title" className="text-lg font-semibold text-slate-900 dark:text-white">
                  {title}
                </h2>
                {description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            {children && (
              <div className="p-6">{children}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Confirm / Delete dialog
interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: "danger" | "warning" | "info" | "success";
  loading?: boolean;
}

const variantConfig = {
  danger: {
    icon: <Trash2 className="w-6 h-6" />,
    iconBg: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400",
    confirmVariant: "danger" as const,
  },
  warning: {
    icon: <AlertTriangle className="w-6 h-6" />,
    iconBg: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
    confirmVariant: "primary" as const,
  },
  info: {
    icon: <Info className="w-6 h-6" />,
    iconBg: "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
    confirmVariant: "primary" as const,
  },
  success: {
    icon: <CheckCircle className="w-6 h-6" />,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    confirmVariant: "primary" as const,
  },
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  const { icon, iconBg, confirmVariant } = variantConfig[variant];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="alertdialog">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-sm rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111118] p-6 shadow-2xl shadow-black/10 dark:shadow-black/60"
          >
            <div className="flex flex-col items-center text-center gap-4">
              <div className={cn("p-3 rounded-2xl", iconBg)}>{icon}</div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{message}</p>
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant={confirmVariant}
                  className="flex-1"
                  onClick={onConfirm}
                  loading={loading}
                >
                  {confirmLabel}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
