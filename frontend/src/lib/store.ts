import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthResponse } from "@/lib/api";

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
  updateUser: (userData: Partial<AuthResponse>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (data: AuthResponse) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("accessToken", data.accessToken);
          sessionStorage.setItem("refreshToken", data.refreshToken);
        }
        set({
          user: data,
          isAuthenticated: true,
        });
      },

      logout: () => {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("accessToken");
          sessionStorage.removeItem("refreshToken");
        }
        set({ user: null, isAuthenticated: false });
      },

      updateTokens: (accessToken: string, refreshToken: string) => {
        if (typeof window !== "undefined") {
          sessionStorage.setItem("accessToken", accessToken);
          sessionStorage.setItem("refreshToken", refreshToken);
        }
        const user = get().user;
        if (user) {
          set({ user: { ...user, accessToken, refreshToken } });
        }
      },

      updateUser: (userData: Partial<AuthResponse>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: "ai-solutions-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
