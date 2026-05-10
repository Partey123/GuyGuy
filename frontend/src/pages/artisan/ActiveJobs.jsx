import { useState } from "react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import BookingCard from "@/components/booking/BookingCard";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { useBooking } from "@/hooks/useBooking";
import { useNotificationStore } from "@/store/notificationStore";

export default function ActiveJobs() {
  const { bookings, updateStatus } = useBooking();
  const active = bookings.filter((b) => ["accepted", "in_progress"].includes(b.status));
  const push = useNotificationStore((s) => s.push);
  const [busy, setBusy] = useState(null);

  const markComplete = (b) => {
    setBusy(b.id);
    const tid = toast.loading("Marking job as done…");
    setTimeout(() => {
      updateStatus(b.id, "completed_by_artisan", {
        artisanCompletedAt: new Date().toISOString(),
        autoReleaseAt: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
      });
      push({ title: "Job marked complete", body: "Client has 72 hours to confirm or raise a dispute." });
      toast.success("Job marked complete! Auto-releases in 72h if client doesn't confirm.", { id: tid });
      setBusy(null);
    }, 1000);
  };

  return (
    <PageWrapper title="Active jobs" subtitle="Stay on top of every commitment.">
      {active.length ? (
        <div className="space-y-3">
          {active.map((b) => (
            <div key={b.id} className="space-y-2">
              <BookingCard booking={b} />
              {b.status === "in_progress" && (
                <div className="flex justify-end">
                  <Button onClick={() => markComplete(b)} loading={busy === b.id} className="active:scale-95 transition-transform">
                    Mark job complete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="No active jobs" description="Accepted jobs will appear here." />
      )}
    </PageWrapper>
  );
}
