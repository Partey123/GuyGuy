import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function MarketingLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-2xl bg-foreground text-background inline-flex items-center justify-center font-bold">G</span>
            <span className="font-display font-bold text-lg">{APP_NAME}</span>
          </Link>
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[820px] px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl sm:text-5xl font-display font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
        <div className="prose prose-neutral mt-10 max-w-none text-foreground [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground [&_ul]:space-y-1.5 [&_a]:text-primary">
          {children}
        </div>
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 lg:px-8 py-8 text-sm text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {APP_NAME}.</p>
          <div className="flex gap-5">
            <Link to="/about" className="hover:text-foreground">About</Link>
            <Link to="/contact" className="hover:text-foreground">Contact</Link>
            <Link to="/terms" className="hover:text-foreground">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
