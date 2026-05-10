import { cn } from "@/lib/utils";

export default function LoadingSpinner({ size = 24, className, label }) {
  return (
    <div className={cn("inline-flex items-center gap-2 text-muted-foreground", className)}>
      <span
        className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
        style={{ width: size, height: size }}
        role="status"
        aria-label={label || "Loading"}
      />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
