import { cn } from "@/lib/utils";

export default function AvailabilityToggle({ value, onChange }) {
  const on = !!value;
  const toggle = () => onChange?.(!on);
  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center gap-3 rounded-full p-1.5 pr-4 border transition active:scale-95",
        on
          ? "bg-success/15 border-success/30 text-success"
          : "bg-muted border-border text-muted-foreground",
      )}
    >
      <span className={cn("relative inline-block h-6 w-11 rounded-full transition", on ? "bg-success" : "bg-muted-foreground/40")}>
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow transition-all",
            on ? "left-[calc(100%-1.25rem-2px)]" : "left-0.5",
          )}
        />
      </span>
      <span className="text-sm font-medium">{on ? "Available for work" : "Not available"}</span>
    </button>
  );
}
