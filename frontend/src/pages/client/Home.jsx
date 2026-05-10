import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, ArrowRight, Briefcase } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import ArtisanCard from "@/components/artisan/ArtisanCard";
import BookingCard from "@/components/booking/BookingCard";
import TradeCarousel from "@/components/marketing/TradeCarousel";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useBooking } from "@/hooks/useBooking";
import { ARTISANS } from "@/lib/mockData";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const QUICK_TRADES = [
  { id: "electrician", label: "Electrician" },
  { id: "plumber", label: "Plumber" },
  { id: "painter", label: "Painter" },
  { id: "ac-tech", label: "AC Technician" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function Home() {
  const { user } = useAuth();
  const { bookings } = useBooking();
  const active = bookings.filter((b) =>
    ["requested", "accepted", "in_progress", "completed_by_artisan"].includes(b.status),
  );
  const [loadingArtisans, setLoadingArtisans] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoadingArtisans(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <PageWrapper>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-foreground p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-accent/30 blur-3xl" />
        <p className="text-sm opacity-90 relative">{greeting()}, {user?.name?.split(" ")[0] || "there"} 👋</p>
        <h1 className="text-2xl sm:text-3xl font-bold mt-1 relative">What do you need fixed today?</h1>
        <Link
          to="/search"
          className="mt-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-card/15 hover:bg-card/25 transition relative"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="text-sm">Search electrician, plumber, makeup…</span>
        </Link>
      </motion.section>

      {/* Quick trade pills */}
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
        className="mt-5 flex flex-wrap gap-2"
      >
        {QUICK_TRADES.map((t) => (
          <motion.div key={t.id} variants={fadeUp}>
            <Link
              to={`/search?trade=${t.id}`}
              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border border-border bg-muted/50 hover:bg-muted hover:border-foreground transition active:scale-95"
            >
              {t.label}
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Your bookings */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your bookings</h2>
          {active.length > 0 && (
            <Link to="/my-bookings" className="text-sm text-primary inline-flex items-center gap-1">
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
        {active.length > 0 ? (
          <div className="space-y-3">
            {active.slice(0, 2).map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-muted inline-flex items-center justify-center mb-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="font-semibold">No active jobs yet</p>
            <p className="text-sm text-muted-foreground mt-1">Book a verified pro and your jobs land here.</p>
            <Link
              to="/search"
              className="inline-flex items-center gap-1.5 mt-4 px-5 py-2.5 rounded-full bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition active:scale-95"
            >
              Find an artisan <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Top rated near you</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {loadingArtisans
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-3xl border border-border overflow-hidden">
                  <Skeleton className="aspect-[4/5] w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))
            : ARTISANS.slice(0, 6).map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <ArtisanCard artisan={a} />
                </motion.div>
              ))}
        </div>
      </section>
    </PageWrapper>
  );
}
