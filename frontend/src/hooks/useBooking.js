import { useBookingStore } from "@/store/bookingStore";

export function useBooking(id) {
  const items = useBookingStore((s) => s.items);
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const add = useBookingStore((s) => s.add);
  return {
    bookings: items,
    booking: id ? items.find((b) => b.id === id) : null,
    updateStatus,
    add,
  };
}
