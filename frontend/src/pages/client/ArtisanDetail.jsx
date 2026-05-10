import { Link, useParams } from "react-router-dom";
import { CalendarPlus, MessageCircle, Circle } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import ArtisanProfile from "@/components/artisan/ArtisanProfile";
import PortfolioGrid from "@/components/artisan/PortfolioGrid";
import ReviewList from "@/components/review/ReviewList";
import EmptyState from "@/components/common/EmptyState";
import { findArtisan, REVIEWS } from "@/lib/mockData";

export default function ArtisanDetail() {
  const { slug } = useParams();
  const artisan = findArtisan(slug);

  if (!artisan) {
    return (
      <PageWrapper>
        <EmptyState title="Artisan not found" description="This profile may have been removed." />
      </PageWrapper>
    );
  }

  const reviews = REVIEWS.filter((r) => r.artisanId === artisan.id);

  return (
    <PageWrapper title={artisan.name} subtitle={artisan.tradeLabel}>
      <ArtisanProfile artisan={artisan} />

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <section>
            <h2 className="text-lg font-semibold mb-3">Portfolio</h2>
            <PortfolioGrid items={artisan.portfolio} />
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-3">Reviews ({reviews.length})</h2>
            <ReviewList reviews={reviews} />
          </section>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-20 self-start">
          <Link
            to={`/book/${artisan.id}`}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-95 transition-transform"
          >
            <CalendarPlus className="h-4 w-4" /> Request a booking
          </Link>
          <button
            onClick={() => toast.info("Start a booking first to unlock chat")}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-input font-medium hover:bg-muted active:scale-95 transition-transform"
          >
            <MessageCircle className="h-4 w-4" /> Message
          </button>
          <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-2 text-sm">
            <Circle className={`h-2.5 w-2.5 ${artisan.available ? "fill-success text-success" : "fill-muted-foreground text-muted-foreground"}`} />
            <span>{artisan.available ? "Available now" : "Currently unavailable"}</span>
          </div>
          <p className="text-xs text-muted-foreground text-center px-3">
            Your payment is held safely in escrow until you confirm the job is done.
          </p>
        </aside>
      </div>
    </PageWrapper>
  );
}
