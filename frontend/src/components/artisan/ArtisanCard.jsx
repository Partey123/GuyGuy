import { Link } from "react-router-dom";
import { MapPin, Zap, Star } from "lucide-react";
import { formatCedi } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import PlanCheck from "./PlanCheck";

export default function ArtisanCard({ artisan, className }) {
  const cover =
    artisan.coverImage ||
    artisan.portfolio?.[0] ||
    `https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800`;

  return (
    <Link
      to={`/artisans/${artisan.slug}`}
      className={cn(
        "group flex flex-col rounded-3xl bg-card border border-border overflow-hidden hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 active:scale-95",
        artisan.available === false && "opacity-75",
        className,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={cover}
          alt={artisan.name}
          loading="lazy"
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 top-0 p-3 flex items-start justify-between gap-2">
          {artisan.boosted && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent text-accent-foreground px-2.5 py-1 text-[11px] font-semibold shadow-card">
              <Zap className="h-3 w-3" /> Boosted
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-background/95 backdrop-blur px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-card">
            <Star className="h-3 w-3 fill-accent text-accent" />
            {artisan.rating.toFixed(1)}
          </span>
        </div>
        {artisan.available === false && (
          <div className="absolute inset-0 flex items-end justify-center p-3">
            <span className="rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold text-muted-foreground border border-border">
              Currently unavailable
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-white text-xs font-medium opacity-90">
            {artisan.tradeLabel}
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-4 gap-2">
        <div className="flex items-center gap-1 min-w-0">
          <h3 className="font-display font-semibold text-base truncate">
            {artisan.name}
          </h3>
          <PlanCheck verified={artisan.verified} tier={artisan.badgeTier} size="sm" />
        </div>
        <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span className="truncate">{artisan.location}</span>
          <span>· {artisan.distanceKm} km away</span>
        </p>
        <div className="mt-auto pt-3 flex items-end justify-between border-t border-border">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">from</p>
            <p className="text-base font-bold font-display">{formatCedi(artisan.rateFrom)}</p>
          </div>
          <span className="text-[11px] text-muted-foreground">{artisan.reviewCount} reviews</span>
        </div>
      </div>
    </Link>
  );
}
