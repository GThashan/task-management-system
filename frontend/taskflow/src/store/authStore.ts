import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";
import { authApi, ApiError } from "../services/api";

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const data = await authApi.login(email, password);

          set({
            token: data.token,
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          toast.success(`Welcome back, ${data.user.name}!`);
          return true;
        } catch (err) {
          const message =
            err instanceof ApiError ? err.message : "Unable to connect to server";

          set({ isLoading: false, error: message });
          return false;
        }
      },

      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          error: null,
        });
        toast.success("Logged out successfully");
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "taskflow-auth",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
