import Navbar from "./Navbar";
import BottomNav from "./BottomNav";
import { cn } from "@/lib/utils";

export default function PageWrapper({
  children,
  title,
  subtitle,
  action,
  hideChrome = false,
  className,
  wide = false,
}) {
  return (
    <div className="min-h-[100dvh] w-full bg-background flex flex-col">
      {!hideChrome && <Navbar />}
      <main
        className={cn(
          "flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-12",
          wide ? "max-w-[1600px]" : "max-w-[1440px]",
          className,
        )}
      >
        {(title || action) && (
          <div className="mb-8 flex items-start justify-between gap-4 flex-wrap">
            <div>
              {title && (
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl">
                  {subtitle}
                </p>
              )}
            </div>
            {action}
          </div>
        )}
        {children}
      </main>
      {!hideChrome && <BottomNav />}
    </div>
  );
}
