import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import BookingForm from "@/components/booking/BookingForm";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import { useBookingStore } from "@/store/bookingStore";
import { findArtisan } from "@/lib/mockData";

export default function BookingRequest() {
  const { artisanId } = useParams();
  const artisan = findArtisan(artisanId);
  const add = useBookingStore((s) => s.add);
  const navigate = useNavigate();

  if (!artisan) {
    return (
      <PageWrapper>
        <EmptyState title="Artisan not found" />
      </PageWrapper>
    );
  }

  const submit = async (data) => {
    const tid = toast.loading("Sending your request…");
    await new Promise((r) => setTimeout(r, 1000));
    add({
      ...data,
      artisanId: artisan.id,
      status: "requested",
    });
    toast.success(`Booking sent! Waiting for ${artisan.name} to accept.`, { id: tid });
    navigate("/my-bookings");
  };

  return (
    <PageWrapper title="Request a booking" subtitle={`Tell ${artisan.name} what you need.`}>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingForm onSubmit={submit} />
        </div>
        <aside className="rounded-2xl bg-card border border-border p-5 h-fit">
          <div className="flex items-center gap-3">
            <Avatar src={artisan.avatar} name={artisan.name} />
            <div>
              <p className="font-semibold">{artisan.name}</p>
              <p className="text-sm text-muted-foreground">{artisan.tradeLabel}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">{artisan.bio}</p>
          <div className="mt-4 rounded-xl bg-primary-muted p-3 text-sm text-primary">
            Funds held in escrow until you mark the job complete.
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}
