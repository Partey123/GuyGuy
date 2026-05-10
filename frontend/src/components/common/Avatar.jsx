import { cn } from "@/lib/utils";

const sizes = { xs: "h-6 w-6 text-xs", sm: "h-8 w-8 text-sm", md: "h-10 w-10 text-base", lg: "h-14 w-14 text-lg", xl: "h-20 w-20 text-2xl" };

export default function Avatar({ src, name = "", size = "md", className }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-primary-muted text-primary font-semibold overflow-hidden ring-1 ring-border",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </span>
  );
}
