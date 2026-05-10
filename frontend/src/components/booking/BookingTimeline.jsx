import { Check, Circle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in_progress", label: "In progress" },
  { key: "completed_by_artisan", label: "Awaiting confirmation" },
  { key: "completed", label: "Completed" },
];

export default function BookingTimeline({ status }) {
  const isDisputed = status === "disputed";
  const idx = isDisputed
    ? STEPS.findIndex((s) => s.key === "in_progress")
    : STEPS.findIndex((s) => s.key === status);

  return (
    <ol className="space-y-3">
      {STEPS.map((s, i) => {
        const done = i <= idx;
        const active = i === idx && !isDisputed;
        return (
          <li key={s.key} className="flex items-center gap-3">
            <span
              className={cn(
                "h-8 w-8 rounded-full inline-flex items-center justify-center border",
                done
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted text-muted-foreground border-border",
              )}
            >
              {done ? <Check className="h-4 w-4" /> : <Circle className="h-3 w-3" />}
            </span>
            <span
              className={cn(
                "text-sm",
                active ? "font-semibold" : done ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {s.label}
            </span>
          </li>
        );
      })}
      {isDisputed && (
        <li className="flex items-center gap-3">
          <span className="h-8 w-8 rounded-full inline-flex items-center justify-center bg-destructive text-destructive-foreground border border-destructive">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-destructive">Disputed — under review</span>
        </li>
      )}
    </ol>
  );
}
