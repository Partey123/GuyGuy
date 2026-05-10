import { Link, useParams } from "react-router-dom";
import PageWrapper from "@/components/layout/PageWrapper";
import ArtisanProfile from "@/components/artisan/ArtisanProfile";
import PortfolioGrid from "@/components/artisan/PortfolioGrid";
import ReviewList from "@/components/review/ReviewList";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { findArtisan, REVIEWS } from "@/lib/mockData";

const NETWORK_LABEL = { mtn: "MTN MoMo", vodafone: "Vodafone Cash", airteltigo: "AirtelTigo Money" };

export default function PublicProfile() {
  const { slug } = useParams();
  const artisan = findArtisan(slug) || findArtisan("kwame-asante");
  if (!artisan)
    return (
      <PageWrapper>
        <EmptyState title="Profile not found" />
      </PageWrapper>
    );

  return (
    <PageWrapper hideChrome>
      <div className="mx-auto max-w-3xl">
        <ArtisanProfile artisan={artisan} />
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-xs text-muted-foreground">
            Payouts via {NETWORK_LABEL[artisan.momo_network] || "MoMo"}
          </p>
          <Link to="/register">
            <Button className="active:scale-95 transition-transform">Book {artisan.name.split(" ")[0]}</Button>
          </Link>
        </div>
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Portfolio</h2>
          <PortfolioGrid items={artisan.portfolio} />
        </section>
        <section className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Reviews</h2>
          <ReviewList reviews={REVIEWS.filter((r) => r.artisanId === artisan.id)} />
        </section>
        <p className="text-center text-xs text-muted-foreground py-8">
          Powered by GuyGuy — The right guy. Every time.
        </p>
      </div>
    </PageWrapper>
  );
}
