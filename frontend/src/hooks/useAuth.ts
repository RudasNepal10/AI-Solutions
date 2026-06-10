"use client";

import { useAuthStore } from "@/lib/store";
import { authApi } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useAuth() {
  const { user, isAuthenticated, login, logout, updateUser } = useAuthStore();
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Always clear local state even if API fails
    } finally {
      logout();
      toast.success("Logged out successfully");
      router.push("/");
    }
  }, [logout, router]);

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await authApi.login({ email, password });
        if (res.data.success && res.data.data) {
          login(res.data.data);
          return res.data.data;
        }
        throw new Error(res.data.message || res.data.error || "Login failed");
      } catch (err: unknown) {
        const apiError = err as { response?: { data?: { message?: string; error?: string }; status?: number }; message?: string };
        // Extract server-side error message if available
        const serverMessage = apiError.response?.data?.message || apiError.response?.data?.error;
        if (serverMessage) {
          throw new Error(serverMessage);
        }
        if (apiError.response?.status === 401) {
          throw new Error("Invalid email or password. Please try again.");
        }
        throw new Error(apiError.message || "An unexpected error occurred during sign-in.");
      }
    },
    [login]
  );

  return {
    user,
    isAuthenticated,
    handleLogin,
    handleLogout,
    updateUser,
  };
}
