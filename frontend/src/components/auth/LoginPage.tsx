"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, Shield, Brain, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const features = [
  { icon: <Brain className="w-5 h-5" />, text: "AI-powered analytics dashboard" },
  { icon: <Shield className="w-5 h-5" />, text: "Secure JWT-authenticated access" },
  { icon: <Zap className="w-5 h-5" />, text: "Real-time inquiry management" },
];

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { handleLogin } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const user = await handleLogin(data.email, data.password);
      toast.success(`Welcome back, ${user.firstName}!`);
      
      router.replace("/admin");
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex mesh-bg w-full">
      {/* Left panel - form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 lg:max-w-xl">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center glow-brand-sm">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl font-display text-foreground">
              AI<span className="text-brand-600 dark:text-brand-400">-Solutions</span>
            </span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold font-display text-foreground mb-2">
              Admin Portal
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Sign in to access your management dashboard
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="flex flex-col gap-4"
            id="login-form"
          >
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="anil@aisolution.com"
              autoComplete="email"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.email?.message}
              {...register("email")}
            />

            <Input
              id="login-password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              leftIcon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-500 hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              }
              {...register("password")}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full mt-2"
              id="login-submit"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500 dark:text-slate-600 mt-8">
            This portal is restricted to authorised administrators only.
            <br />
            <a href="/contact" className="text-brand-600 dark:text-brand-400 hover:underline mt-1 inline-block">
              Need access? Contact us
            </a>
          </p>
        </motion.div>
      </div>

      {/* Right panel - branding */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="hidden lg:flex flex-1 relative overflow-hidden bg-surface-800 items-center justify-center p-12 border-l border-glass-border"
      >
        {/* Decorative blobs */}
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]" aria-hidden="true" />
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite_2s]" aria-hidden="true" />

        <div className="relative z-10 max-w-md">
          {/* Floating cards */}
          <div className="grid grid-cols-1 gap-4 mb-12">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                className="glass rounded-2xl p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  {f.icon}
                </div>
                <span className="text-sm text-slate-700 dark:text-slate-300">{f.text}</span>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold font-display text-foreground mb-3">
              Manage Your
              <br />
              <span className="gradient-text">AI Platform</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Monitor inquiries, track analytics, manage users, and oversee your
              AI solutions from a single, powerful dashboard.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
