import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, MapPin } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import ArtisanCard from "@/components/artisan/ArtisanCard";
import EmptyState from "@/components/common/EmptyState";
import Badge from "@/components/common/Badge";
import { ARTISANS, TRADES } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const TIER_RANK = { gold: 0, silver: 1, bronze: 2, none: 3 };

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const trade = params.get("trade") || "";
  const sort = params.get("sort") || "rating";

  useEffect(() => {
    if (typeof window !== "undefined" && !sessionStorage.getItem("guyguy.search.toasted")) {
      toast.info("Showing results near Kumasi");
      sessionStorage.setItem("guyguy.search.toasted", "1");
    }
  }, []);

  const setTrade = (t) => {
    const next = new URLSearchParams(params);
    if (t) next.set("trade", t);
    else next.delete("trade");
    setParams(next);
  };

  const setSort = (s) => {
    const next = new URLSearchParams(params);
    next.set("sort", s);
    setParams(next);
  };

  const results = useMemo(() => {
    let r = ARTISANS;
    if (trade) r = r.filter((a) => a.trade === trade);
    if (q) {
      const ql = q.toLowerCase();
      r = r.filter(
        (a) =>
          a.name.toLowerCase().includes(ql) ||
          a.tradeLabel.toLowerCase().includes(ql) ||
          a.location.toLowerCase().includes(ql),
      );
    }
    const sorter = (a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "distance") return a.distanceKm - b.distanceKm;
      if (sort === "price") return a.rateFrom - b.rateFrom;
      return 0;
    };
    return [...r].sort((a, b) => {
      const tierDiff = (TIER_RANK[a.badgeTier] ?? 3) - (TIER_RANK[b.badgeTier] ?? 3);
      if (tierDiff !== 0) return tierDiff;
      return sorter(a, b);
    });
  }, [q, trade, sort]);

  return (
    <PageWrapper title="Find a guy" subtitle="Browse vetted artisans near you.">
      <div className="rounded-2xl bg-card border border-border p-3 flex items-center gap-2">
        <SearchIcon className="h-4 w-4 text-muted-foreground ml-2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, trade or area"
          className="flex-1 bg-transparent text-sm focus:outline-none py-2"
        />
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-muted text-primary px-3 py-1 text-xs font-medium">
          <MapPin className="h-3 w-3" /> Kumasi, Ghana
        </span>
        <button
          onClick={() => toast.info("Location selection coming soon")}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Change
        </button>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        <button
          onClick={() => setTrade("")}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
            !trade ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border",
          )}
        >
          All
        </button>
        {TRADES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTrade(t.id)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              trade === t.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card border-border hover:border-primary/40",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-3 mb-4">
        <p className="text-sm text-muted-foreground">{results.length} results</p>
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          {[
            ["rating", "Top rated"],
            ["distance", "Nearest"],
            ["price", "Cheapest"],
          ].map(([k, l]) => (
            <button key={k} onClick={() => setSort(k)}>
              <Badge tone={sort === k ? "primary" : "default"}>{l}</Badge>
            </button>
          ))}
        </div>
      </div>

      {results.length ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((a) => (
            <ArtisanCard key={a.id} artisan={a} />
          ))}
        </div>
      ) : (
        <EmptyState title="No artisans match" description="Try a different trade or search term." />
      )}
    </PageWrapper>
  );
}
