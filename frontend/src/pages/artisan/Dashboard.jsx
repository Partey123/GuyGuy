import { Link } from "react-router-dom";
import { Briefcase, Star, Wallet, Users, ArrowRight, Share2 } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import AvailabilityToggle from "@/components/artisan/AvailabilityToggle";
import EarningsChart from "@/components/artisan/EarningsChart";
import BookingCard from "@/components/booking/BookingCard";

import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { useBooking } from "@/hooks/useBooking";
import { EARNINGS_SERIES, findArtisan } from "@/lib/mockData";
import { formatCedi } from "@/lib/formatters";

const Stat = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl bg-card border border-border p-4">
    <div className="flex items-center gap-2 text-muted-foreground text-xs">
      <Icon className="h-4 w-4" /> {label}
    </div>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const { bookings } = useBooking();
  const requests = bookings.filter((b) => b.status === "requested");
  const active = bookings.filter((b) => ["accepted", "in_progress"].includes(b.status));
  const artisan = findArtisan(user?.artisanId);
  const slug = user?.artisanSlug || artisan?.slug || "kwame-asante";

  const share = () => {
    navigator.clipboard?.writeText(`https://guyguy.com.gh/a/${slug}`);
    toast.success("Profile link copied!");
  };

  const toggleAvail = (next) => {
    updateProfile({ available: next });
    toast.success(`You are now ${next ? "available" : "unavailable"}`);
  };

  return (
    <PageWrapper
      title={`Akwaaba, ${user?.name?.split(" ")[0] || "guy"}`}
      subtitle="Here's how business is going."
      action={
        <div className="flex items-center gap-2 flex-wrap">
          <AvailabilityToggle value={user?.available ?? true} onChange={toggleAvail} />
          <Button variant="outline" size="sm" onClick={share} className="active:scale-95 transition-transform">
            <Share2 className="h-4 w-4" /> Share profile
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="New requests" value={requests.length} icon={Users} />
        <Stat label="Active jobs" value={active.length} icon={Briefcase} />
        <Stat label="Rating" value="4.9" icon={Star} />
        <Stat label="This month" value={formatCedi(5840)} icon={Wallet} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Earnings trend</h2>
          <EarningsChart data={EARNINGS_SERIES} />
        </div>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">New requests</h2>
            <Link to="/artisan/requests" className="text-sm text-primary inline-flex items-center gap-1">
              All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {requests.length ? (
              requests.slice(0, 3).map((b) => <BookingCard key={b.id} booking={b} />)
            ) : (
              <EmptyState title="No new requests" description="They'll appear here as soon as a client books you." />
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
