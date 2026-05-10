import { useState } from "react";
import { Link } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import BookingCard from "@/components/booking/BookingCard";
import EmptyState from "@/components/common/EmptyState";
import { useBooking } from "@/hooks/useBooking";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All", filter: () => true, empty: "No bookings yet" },
  {
    id: "active",
    label: "Active",
    filter: (b) => ["requested", "accepted", "in_progress", "completed_by_artisan"].includes(b.status),
    empty: "No active bookings",
  },
  { id: "completed", label: "Completed", filter: (b) => b.status === "completed", empty: "No completed bookings yet" },
  { id: "disputed", label: "Disputed", filter: (b) => b.status === "disputed", empty: "No disputes — that's a good thing." },
];

export default function MyBookings() {
  const [tab, setTab] = useState("all");
  const { bookings } = useBooking();
  const active = TABS.find((t) => t.id === tab);
  const list = bookings.filter(active.filter);

  return (
    <PageWrapper title="My bookings" subtitle="Track every job in one place.">
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-sm border transition-all active:scale-95",
              tab === t.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary/40",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="space-y-3">
          {list.map((b) => (
            <BookingCard key={b.id} booking={b} />
          ))}
        </div>
      ) : (
        <EmptyState
          title={active.empty}
          description="When you book an artisan, it shows up here."
          action={
            <Link
              to="/search"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
            >
              Find a guy
            </Link>
          }
        />
      )}
    </PageWrapper>
  );
}
