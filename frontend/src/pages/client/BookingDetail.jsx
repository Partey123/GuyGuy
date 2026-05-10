import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Flag, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import BookingTimeline from "@/components/booking/BookingTimeline";
import BookingStatus from "@/components/booking/BookingStatus";
import EscrowStatus from "@/components/payment/EscrowStatus";
import ChatWindow from "@/components/chat/ChatWindow";
import ReviewForm from "@/components/review/ReviewForm";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { useBookingStore } from "@/store/bookingStore";
import { useNotificationStore } from "@/store/notificationStore";
import { findArtisan, DISPUTE_REASONS } from "@/lib/mockData";
import { formatCedi, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

function Countdown({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  const ms = new Date(target).getTime() - now;
  if (ms <= 0) return <span>Auto-released</span>;
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return <span>Auto-releases in {h}h {m}m</span>;
}

export default function BookingDetail() {
  const { id } = useParams();
  const booking = useBookingStore((s) => s.items.find((b) => b.id === id));
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const updateEscrow = useBookingStore((s) => s.updateEscrow);
  const pushNotification = useNotificationStore((s) => s.push);

  const [pulse, setPulse] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showDispute, setShowDispute] = useState(false);
  const [disputeReason, setDisputeReason] = useState(DISPUTE_REASONS[0]);
  const [disputeNote, setDisputeNote] = useState("");

  if (!booking) {
    return (
      <PageWrapper>
        <EmptyState title="Booking not found" />
      </PageWrapper>
    );
  }

  const artisan = findArtisan(booking.artisanId);
  const fee = booking.commissionAmount ?? Math.round((booking.labourAmount || 0) * 0.1);
  const artisanGets = booking.artisanPayout ?? booking.amount - fee;

  const triggerPulse = () => {
    setPulse(true);
    setTimeout(() => setPulse(false), 2000);
  };

  const onConfirm = () => {
    setConfirming(true);
    const tid = toast.loading("Processing…");
    setTimeout(() => {
      updateStatus(booking.id, "completed", { escrow: "released" });
      pushNotification({
        title: "Payment released",
        body: `${formatCedi(artisanGets)} sent to ${artisan?.name}'s MoMo.`,
        link: `/bookings/${booking.id}`,
      });
      toast.success(`Done! Payment released to ${artisan?.name}`, { id: tid });
      triggerPulse();
      setConfirming(false);
    }, 1200);
  };

  const onPay = () => {
    setPaying(true);
    const tid = toast.loading("Opening payment…");
    setTimeout(() => {
      updateEscrow(booking.id, "held");
      updateStatus(booking.id, "in_progress");
      pushNotification({
        title: "Payment held",
        body: `${formatCedi(booking.amount)} secured. ${artisan?.name} has been notified.`,
        link: `/bookings/${booking.id}`,
      });
      toast.success("Payment secured in escrow", { id: tid });
      triggerPulse();
      setPaying(false);
    }, 800);
  };

  const submitDispute = () => {
    updateStatus(booking.id, "disputed", { disputeReason, disputeNote });
    pushNotification({
      title: "Dispute opened",
      body: `We've paused payment on: ${booking.title}`,
      link: `/bookings/${booking.id}`,
    });
    toast.warning("Dispute raised. Our team will review within 24 hours.");
    setShowDispute(false);
  };

  return (
    <PageWrapper>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-bold">{booking.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Created {formatDate(booking.createdAt)} · {booking.address}
                </p>
              </div>
              <BookingStatus status={booking.status} />
            </div>
            <p className="text-sm mt-4">{booking.description}</p>
            {artisan && (
              <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-surface">
                <Avatar src={artisan.avatar} name={artisan.name} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{artisan.name}</p>
                  <p className="text-xs text-muted-foreground">{artisan.tradeLabel}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCedi(booking.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">incl. {formatCedi(fee)} fee</p>
                </div>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-card border border-border p-5">
            <h2 className="font-semibold mb-4">Progress</h2>
            <BookingTimeline status={booking.status} />
          </section>

          <ChatWindow bookingId={booking.id} bookingStatus={booking.status} />

          {booking.status === "completed" && (
            <section>
              <h2 className="text-lg font-semibold mb-2">Leave a review</h2>
              <ReviewForm onSubmit={() => toast.success("Review submitted — thank you!")} />
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className={cn("rounded-2xl transition-shadow", pulse && "ring-2 ring-success ring-offset-2 ring-offset-background")}>
            <EscrowStatus status={booking.escrow} amount={booking.amount} />
          </div>

          {booking.escrow === "pending" && booking.status === "requested" && (
            <section className="rounded-2xl bg-card border border-border p-4 space-y-3">
              <div className="rounded-xl bg-primary-muted p-3 text-sm space-y-1 text-primary">
                <div className="flex justify-between"><span>Labour</span><span>{formatCedi(booking.labourAmount || 0)}</span></div>
                {booking.materialsAmount > 0 && (
                  <div className="flex justify-between"><span>Materials</span><span>{formatCedi(booking.materialsAmount)}</span></div>
                )}
                <div className="flex justify-between"><span>GuyGuy fee (10%)</span><span>{formatCedi(fee)}</span></div>
                <div className="flex justify-between font-semibold border-t border-primary/20 pt-1 mt-1">
                  <span>Artisan receives</span><span>{formatCedi(artisanGets)}</span>
                </div>
              </div>
              <Button onClick={onPay} loading={paying} className="w-full active:scale-95 transition-transform">
                <ShieldCheck className="h-4 w-4" /> Pay {formatCedi(booking.amount)} into escrow
              </Button>
            </section>
          )}

          {booking.status === "completed_by_artisan" && (
            <section className="rounded-2xl bg-card border border-border p-4 space-y-3">
              {booking.autoReleaseAt && (
                <div className="rounded-xl bg-warning/10 border border-warning/30 px-3 py-2 text-sm text-foreground">
                  <Countdown target={booking.autoReleaseAt} />
                </div>
              )}
              <Button onClick={onConfirm} loading={confirming} className="w-full active:scale-95 transition-transform">
                <CheckCircle2 className="h-4 w-4" /> Confirm job is done ✓
              </Button>
              <Button
                variant="outline"
                className="w-full text-destructive border-destructive/30 active:scale-95 transition-transform"
                onClick={() => setShowDispute((v) => !v)}
              >
                <Flag className="h-4 w-4" /> Raise a dispute
              </Button>
              {showDispute && (
                <div className="rounded-xl border border-border p-3 space-y-2 bg-surface">
                  <label className="text-xs font-medium">Reason</label>
                  <select
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    className="w-full h-10 rounded-lg border border-input bg-card px-2 text-sm"
                  >
                    {DISPUTE_REASONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <label className="text-xs font-medium">Tell us more</label>
                  <textarea
                    value={disputeNote}
                    onChange={(e) => setDisputeNote(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button variant="ghost" size="sm" onClick={() => setShowDispute(false)}>Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={submitDispute}>Submit dispute</Button>
                  </div>
                </div>
              )}
            </section>
          )}
        </aside>
      </div>
    </PageWrapper>
  );
}
