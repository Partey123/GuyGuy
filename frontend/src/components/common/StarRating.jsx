import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  value = 0,
  count,
  size = 16,
  showNumber = true,
  interactive = false,
  onChange,
  className,
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex">
        {stars.map((s) => {
          const filled = s <= Math.round(value);
          const Icon = (
            <Star
              size={size}
              className={cn(filled ? "fill-warning text-warning" : "text-muted-foreground")}
            />
          );
          return interactive ? (
            <button
              key={s}
              type="button"
              onClick={() => onChange?.(s)}
              className="p-0.5 hover:scale-110 transition-transform"
            >
              {Icon}
            </button>
          ) : (
            <span key={s}>{Icon}</span>
          );
        })}
      </div>
      {showNumber && (
        <span className="text-xs text-muted-foreground">
          {Number(value).toFixed(1)}
          {count != null && ` (${count})`}
        </span>
      )}
    </div>
  );
}
