import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "@/api/auth";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async ({ email, password }) => {
        const response = await authApi.login({ email, password });
        const token = response.access_token;
        const user = response.user || {};
        localStorage.setItem("guyguy.token", token);
        set({ user, token });
        return response;
      },
      signup: async ({ full_name, email, password, role = "client", phone }) => {
        const response = await authApi.signup({ full_name, email, password, role, phone });
        return response;
      },
      switchRole: (role) => {
        set((s) => ({ user: s.user ? { ...s.user, role } : null }));
      },
      logout: () => {
        localStorage.removeItem("guyguy.token");
        set({ user: null, token: null });
      },
      updateProfile: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : s.user })),
    }),
    { name: "guyguy.auth" }
  )
);
