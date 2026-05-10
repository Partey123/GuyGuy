import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Wallet,
  Search,
  Star,
  ArrowRight,
  BadgeCheck,
  Clock,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import {
  ARTISANS,
  PLATFORM_STATS,
  TESTIMONIALS,
} from "@/lib/mockData";
import ArtisanCard from "@/components/artisan/ArtisanCard";
import TradeCarousel from "@/components/marketing/TradeCarousel";

export default function Landing() {
  useEffect(() => {
    document.title = "GuyGuy — The right guy. Every time.";
    const desc = "GuyGuy connects Kumasi homeowners with vetted local artisans — electricians, plumbers, makeup artists & more. Escrow-protected payments and verified reviews.";
    let m = document.querySelector('meta[name="description"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "description";
      document.head.appendChild(m);
    }
    m.content = desc;
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-background text-foreground">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="h-9 w-9 rounded-2xl bg-foreground text-background inline-flex items-center justify-center font-bold">
              G
            </span>
            <span className="font-display font-bold text-lg">{APP_NAME}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <a href="#trades" className="px-4 py-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
              Categories
            </a>
            <a href="#how" className="px-4 py-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
              How it works
            </a>
            <a href="#artisans" className="px-4 py-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
              Browse pros
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-full hover:bg-muted">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-card inline-flex items-center gap-1.5"
            >
              Get started <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-20 h-[480px] w-[480px] rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute top-40 -left-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 pt-2 sm:pt-4 lg:pt-6 pb-16 lg:pb-24 grid lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display tracking-tight leading-[0.98]">
              Find <span className="relative inline-block">
                <span className="relative z-10">a guy</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute inset-x-0 bottom-1 h-3 bg-accent rounded-full -z-0 origin-left"
                />
              </span>{" "}
              for that.
            </h1>
            <p className="mt-3 text-base text-muted-foreground font-medium">The right guy. Every time.</p>
            <p className="mt-5 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              From a wobbly ceiling fan to bridal makeup, {APP_NAME} connects you to
              vetted local pros — with reviews, fair pricing, and money held safely
              until the job is done right.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-foreground text-background font-semibold hover:bg-foreground/90 shadow-elevated transition active:scale-95 hover:scale-[1.02]"
              >
                Book an artisan <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/register?role=artisan"
                className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:brightness-95 shadow-card transition active:scale-95 hover:scale-[1.02]"
              >
                Become an artisan
              </Link>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.08, delayChildren: 0.5 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4 max-w-xl"
            >
              {PLATFORM_STATS.map((s) => (
                <motion.div
                  key={s.label}
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <p className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                    {s.value}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <div className="lg:col-span-5 relative">
            <div className="relative rounded-[2rem] bg-card border border-border shadow-elevated p-5 lg:p-6">
              <div className="flex items-center gap-2 px-4 py-3 rounded-full bg-muted text-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  "Electrician near Suame, today"
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {ARTISANS.slice(0, 4).map((a) => (
                  <ArtisanCard key={a.id} artisan={a} />
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Escrow protected
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-accent" />
                  Avg. response 8 min
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="trades" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Categories
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold tracking-tight">
                Every trade. One app.
              </h2>
            </div>
            <Link
              to="/search"
              className="text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              Browse all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <TradeCarousel />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              How it works
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold tracking-tight">
              Booked in three taps. Done in a day.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                icon: Search,
                title: "Search and request",
                body: "Tell us what you need. Set your budget. We surface verified pros nearby.",
              },
              {
                n: "02",
                icon: Wallet,
                title: "Pay into escrow",
                body: "Your money is held safely. The artisan starts the job with confidence.",
              },
              {
                n: "03",
                icon: CheckCircle2,
                title: "Approve and release",
                body: "Happy with the work? Tap release. Your artisan gets paid instantly.",
              },
            ].map(({ n, icon: Icon, title, body }) => (
              <div
                key={n}
                className="relative rounded-3xl bg-card border border-border p-7 hover:shadow-card transition"
              >
                <div className="flex items-center justify-between">
                  <span className="h-12 w-12 rounded-2xl bg-accent text-accent-foreground inline-flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-5xl font-display font-bold text-muted/50 leading-none">
                    {n}
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED ARTISANS */}
      <section id="artisans" className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Featured pros
              </p>
              <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold tracking-tight">
                The best in your area, right now.
              </h2>
            </div>
            <Link
              to="/search"
              className="text-sm font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              See all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ARTISANS.slice(0, 4).map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, title: "Verified IDs", body: "Every artisan passes ID + skill checks before going live." },
            { icon: Wallet, title: "Escrow always on", body: "We hold the cash until you're satisfied. Disputes mediated in 24h." },
            { icon: MessageSquare, title: "Built-in chat", body: "Talk, share photos, and confirm details — all inside one booking." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-border p-7">
              <span className="h-11 w-11 rounded-2xl bg-foreground text-background inline-flex items-center justify-center">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 text-lg font-display font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Loved across Ghana
            </p>
            <h2 className="mt-2 text-3xl sm:text-4xl font-display font-bold tracking-tight">
              Real jobs. Real people.
            </h2>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.id}
                className="rounded-3xl bg-card border border-border p-7 flex flex-col"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                  ))}
                </div>
                <blockquote className="text-base leading-relaxed flex-1">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-20">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-foreground text-background p-10 sm:p-16">
            <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium">
                <BadgeCheck className="h-3.5 w-3.5 text-accent" />
                Ready in seconds
              </span>
              <h2 className="mt-5 text-4xl sm:text-5xl font-display font-bold tracking-tight">
                Your next job is one tap away.
              </h2>
              <p className="mt-4 text-base sm:text-lg opacity-80 max-w-lg">
                Join thousands of clients and artisans who get things done — properly,
                safely, and on time.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent text-accent-foreground font-semibold hover:brightness-95 transition"
                >
                  Find an artisan <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/register?role=artisan"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-white/10 text-background font-semibold hover:bg-white/15 transition"
                >
                  Sign up as artisan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1020] text-slate-300">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5">
                <span className="h-9 w-9 rounded-2xl bg-accent text-accent-foreground inline-flex items-center justify-center font-bold">G</span>
                <span className="font-display font-bold text-lg text-white">{APP_NAME}</span>
              </div>
              <p className="mt-3 text-sm text-slate-400 max-w-xs">
                The right guy. Every time. Vetted artisans across Kumasi, with escrow-protected payments.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Product</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/how-it-works" className="hover:text-white text-slate-400">How it works</Link></li>
                <li><Link to="/pricing" className="hover:text-white text-slate-400">Pricing</Link></li>
                <li><a href="#trades" className="hover:text-white text-slate-400">Categories</a></li>
                <li><Link to="/register?role=artisan" className="hover:text-white text-slate-400">Become an artisan</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Company</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-white text-slate-400">About</Link></li>
                <li><Link to="/contact" className="hover:text-white text-slate-400">Contact</Link></li>
                <li><Link to="/login" className="hover:text-white text-slate-400">Login</Link></li>
                <li><Link to="/register" className="hover:text-white text-slate-400">Register</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Legal</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="hover:text-white text-slate-400">Terms of service</Link></li>
                <li><Link to="/privacy" className="hover:text-white text-slate-400">Privacy policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} {APP_NAME}. Made in Kumasi 🇬🇭</p>
            <p>Built with care for Ghanaian artisans.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
