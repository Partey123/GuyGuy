import { useState } from "react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import BookingCard from "@/components/booking/BookingCard";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { useBooking } from "@/hooks/useBooking";
import { useNotificationStore } from "@/store/notificationStore";
import { formatCedi } from "@/lib/formatters";

export default function Requests() {
  const { bookings, updateStatus } = useBooking();
  const requests = bookings.filter((b) => b.status === "requested");
  const push = useNotificationStore((s) => s.push);
  const [busy, setBusy] = useState(null);
  const [decliningId, setDecliningId] = useState(null);
  const [reason, setReason] = useState("");

  const accept = (b) => {
    setBusy(b.id);
    const tid = toast.loading("Accepting…");
    setTimeout(() => {
      updateStatus(b.id, "accepted");
      push({ title: "Booking accepted", body: "You accepted: " + b.title });
      toast.success("Accepted! The client has been notified.", { id: tid });
      setBusy(null);
    }, 800);
  };

  const decline = (b) => {
    updateStatus(b.id, "cancelled", { declineReason: reason });
    toast.info("Booking declined.");
    setDecliningId(null);
    setReason("");
  };

  return (
    <PageWrapper title="New requests" subtitle="Review and respond quickly to win jobs.">
      {requests.length ? (
        <div className="space-y-3">
          {requests.map((b) => (
            <div key={b.id} className="space-y-2">
              <BookingCard booking={b} />
              <p className="text-xs text-muted-foreground px-2">
                You'll receive {formatCedi(b.artisanPayout || 0)} after the 10% fee
              </p>
              {decliningId === b.id ? (
                <div className="rounded-xl border border-border bg-surface p-3 space-y-2">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    placeholder="Reason (optional)"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setDecliningId(null)}>Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={() => decline(b)}>Confirm decline</Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setDecliningId(b.id)} className="active:scale-95 transition-transform">
                    Decline
                  </Button>
                  <Button onClick={() => accept(b)} loading={busy === b.id} className="active:scale-95 transition-transform">
                    Accept
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="All caught up" description="No pending requests right now." />
      )}
    </PageWrapper>
  );
}
