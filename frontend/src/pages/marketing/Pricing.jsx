import { useEffect } from "react";
import MarketingLayout from "@/components/layout/MarketingLayout";
import { BOOST_PLANS } from "@/lib/constants";
import { formatCedi } from "@/lib/formatters";

export default function Pricing() {
  useEffect(() => { document.title = "Pricing — GuyGuy"; }, []);
  return (
    <MarketingLayout title="Pricing" subtitle="Free to join. 10% commission on completed jobs. Optional boost plans for visibility.">
      <h2>For clients</h2>
      <p>Free. Always. You only pay the artisan's quote — no booking fee, no markup.</p>

      <h2>For artisans</h2>
      <ul>
        <li>10% commission on labour only (materials are passed through 1:1)</li>
        <li>Free profile, free verification, free chat with clients</li>
        <li>Instant MoMo payouts on job completion</li>
      </ul>

      <h2>Boost plans (optional)</h2>
      <div className="not-prose mt-6 grid sm:grid-cols-2 gap-4">
        {BOOST_PLANS.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-display font-semibold text-lg">{p.label}</p>
            <p className="text-2xl font-bold mt-1">{formatCedi(p.price)} <span className="text-sm font-normal text-muted-foreground">/ {p.duration}</span></p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              {p.perks.map((perk) => <li key={perk}>• {perk}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </MarketingLayout>
  );
}
