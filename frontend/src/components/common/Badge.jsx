import { cn } from "@/lib/utils";

const tones = {
  default: "bg-muted text-foreground",
  primary: "bg-primary-muted text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
  destructive: "bg-destructive/15 text-destructive",
  outline: "border border-border text-foreground",
};

export default function Badge({ tone = "default", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
