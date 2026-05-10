import { Lock, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCedi } from "@/lib/formatters";

const states = {
  pending: { label: "Awaiting payment", icon: Clock, tone: "bg-warning/15 text-warning-foreground" },
  held: { label: "Held in escrow", icon: Lock, tone: "bg-primary-muted text-primary" },
  released: { label: "Released to artisan", icon: CheckCircle2, tone: "bg-success/15 text-success" },
};

export default function EscrowStatus({ status = "pending", amount }) {
  const v = states[status] || states.pending;
  const Icon = v.icon;
  return (
    <div className={cn("flex items-center gap-3 rounded-xl p-3", v.tone)}>
      <Icon className="h-5 w-5 shrink-0" />
      <div className="flex-1">
        <p className="text-sm font-semibold">{v.label}</p>
        <p className="text-xs opacity-80">
          {amount != null && `${formatCedi(amount)} · `}Funds release on completion.
        </p>
      </div>
    </div>
  );
}
