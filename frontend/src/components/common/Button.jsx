import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-card",
  accent:
    "bg-accent text-accent-foreground hover:brightness-95 shadow-card",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/90",
  outline:
    "border border-border bg-transparent hover:bg-muted text-foreground",
  ghost: "hover:bg-muted text-foreground",
  destructive:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
  icon: "h-10 w-10",
};

export default function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  loading = false,
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
