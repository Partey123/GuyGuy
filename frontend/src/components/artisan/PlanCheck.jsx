import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const TIER_COLORS = {
  bronze: "text-amber-600",
  silver: "text-slate-400",
  gold: "text-yellow-400",
};

export default function PlanCheck({ verified, tier, size = "sm", className }) {
  const hasTier = tier && tier !== "none" && TIER_COLORS[tier];
  if (!hasTier && !verified) return null;
  const color = hasTier ? TIER_COLORS[tier] : "text-sky-400";
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return <BadgeCheck className={cn(sizeClass, "shrink-0", color, className)} aria-label="Verified" />;
}
