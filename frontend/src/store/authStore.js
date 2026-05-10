import { create } from "zustand";
import { persist } from "zustand/middleware";

const MOCK_USERS = {
  client: {
    id: "u-client-001",
    phone: "0244000001",
    role: "client",
    name: "Adwoa Asare",
    avatar: "https://i.pravatar.cc/200?img=32",
    email: "adwoa@example.com",
  },
  artisan: {
    id: "u-artisan-001",
    phone: "0244000002",
    role: "artisan",
    name: "Kwame Asante",
    avatar: "https://i.pravatar.cc/200?img=12",
    email: "kwame@example.com",
    artisanId: "a1",
    artisanSlug: "kwame-asante",
    badgeTier: "gold",
    verified: true,
    available: true,
    momoNumber: "0244123456",
    momoNetwork: "mtn",
  },
  admin: {
    id: "u-admin-001",
    phone: "0244000003",
    role: "admin",
    name: "Admin User",
    avatar: "https://i.pravatar.cc/200?img=8",
    email: "admin@guyguy.com.gh",
  },
};

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ({ phone, role = "client", name }) => {
        const base = MOCK_USERS[role] || MOCK_USERS.client;
        set({
          user: { ...base, phone, name: name || base.name },
          token: "mock-token-" + Date.now(),
        });
      },
      switchRole: (role) =>
        set(() => ({ user: MOCK_USERS[role], token: "mock-token-" + Date.now() })),
      logout: () => set({ user: null, token: null }),
      updateProfile: (updates) =>
        set((s) => ({ user: s.user ? { ...s.user, ...updates } : s.user })),
    }),
    { name: "guyguy.auth" }
  )
);
