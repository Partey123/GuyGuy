import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Button from "@/components/common/Button";
import { BOOST_PLANS } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const BADGE_LABEL = { gold: "🥇 Gold", silver: "🥈 Silver", bronze: "🥉 Bronze" };
const BADGE_CLASS = {
  gold: "bg-amber-100 text-amber-800 border-amber-300",
  silver: "bg-slate-100 text-slate-700 border-slate-300",
  bronze: "bg-orange-100 text-orange-800 border-orange-300",
};

export default function Boost() {
  const { user } = useAuth();
  const updateProfile = useAuthStore((s) => s.updateProfile);
  const currentTier = user?.badgeTier || "none";
  const currentPlanId = BOOST_PLANS.find((p) => p.badge === currentTier)?.id;
  const [picked, setPicked] = useState(currentPlanId || "monthly");
  const [loading, setLoading] = useState(false);

  const pay = () => {
    const plan = BOOST_PLANS.find((p) => p.id === picked);
    setLoading(true);
    const tid = toast.loading("Processing payment…");
    setTimeout(() => {
      updateProfile({ badgeTier: plan.badge || "none" });
      toast.success(`Boost activated! Your ${plan.label} is now live.`, { id: tid });
      setLoading(false);
    }, 1200);
  };

  return (
    <PageWrapper title="Boost your profile" subtitle="Appear at the top of search results and get more jobs.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {BOOST_PLANS.map((p) => {
          const isCurrent = p.id === currentPlanId;
          return (
            <button
              key={p.id}
              onClick={() => setPicked(p.id)}
              className={cn(
                "relative text-left rounded-2xl border-2 p-5 bg-card transition active:scale-[0.98]",
                picked === p.id ? "border-primary shadow-card" : "border-border hover:border-primary/40",
              )}
            >
              {isCurrent && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-semibold rounded-full bg-accent text-accent-foreground px-2 py-0.5">
                  <Check className="h-3 w-3" /> Current plan
                </span>
              )}
              <p className="text-sm font-semibold">{p.label}</p>
              <p className="text-xs text-muted-foreground">{p.duration}</p>
              <p className="mt-3 text-3xl font-bold">GHS {p.price}</p>
              <div className="mt-3">
                {p.badge ? (
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", BADGE_CLASS[p.badge])}>
                    {BADGE_LABEL[p.badge]}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">No badge</span>
                )}
              </div>
              <ul className="mt-3 space-y-1 text-sm">
                {p.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" /> <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        <Button onClick={pay} loading={loading} className="active:scale-95 transition-transform">
          Pay & activate boost
        </Button>
      </div>
    </PageWrapper>
  );
}
