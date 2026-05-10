import { create } from "zustand";
import { BOOKINGS } from "@/lib/mockData";

export const useBookingStore = create((set, get) => ({
  items: BOOKINGS,
  add: (b) => {
    const labour = Number(b.labourAmount || 0);
    const materials = Number(b.materialsAmount || 0);
    const amount = labour + materials;
    const commissionAmount = Math.round(labour * 0.1);
    set((s) => ({
      items: [
        {
          ...b,
          id: "b" + Date.now(),
          createdAt: new Date().toISOString(),
          escrow: "pending",
          amount,
          commissionAmount,
          artisanPayout: amount - commissionAmount,
        },
        ...s.items,
      ],
    }));
  },
  updateStatus: (id, status, extra = {}) =>
    set((s) => ({
      items: s.items.map((b) => (b.id === id ? { ...b, status, ...extra } : b)),
    })),
  updateEscrow: (id, escrow) =>
    set((s) => ({
      items: s.items.map((b) => (b.id === id ? { ...b, escrow } : b)),
    })),
  remove: (id) =>
    set((s) => ({ items: s.items.filter((b) => b.id !== id) })),
  get: (id) => get().items.find((b) => b.id === id),
  clientBookings: () => get().items,
  artisanBookings: () => get().items,
}));
