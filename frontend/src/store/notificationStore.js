import { create } from "zustand";
import { NOTIFICATIONS } from "@/lib/mockData";

export const useNotificationStore = create((set) => ({
  items: NOTIFICATIONS,
  markAllRead: () =>
    set((s) => ({ items: s.items.map((n) => ({ ...n, unread: false })) })),
  push: (n) =>
    set((s) => ({
      items: [{ id: "n" + Date.now(), unread: true, at: new Date().toISOString(), ...n }, ...s.items],
    })),
}));
