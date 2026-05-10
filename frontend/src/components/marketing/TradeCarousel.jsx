import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TRADES } from "@/lib/mockData";

// Continuously scrolling carousel of trade categories with real images.
export default function TradeCarousel() {
  // Duplicate the list so the marquee loops seamlessly.
  const items = [...TRADES, ...TRADES];

  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <motion.div
        className="flex gap-4 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {items.map((t, i) => (
          <Link
            key={`${t.id}-${i}`}
            to={`/search?trade=${t.id}`}
            className="group shrink-0 w-40 sm:w-44 rounded-3xl overflow-hidden bg-card border border-border hover:border-foreground hover:shadow-elevated transition"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <img
                src={t.image}
                alt={t.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <p className="absolute bottom-2 left-3 right-3 text-white text-sm font-semibold drop-shadow">
                {t.label}
              </p>
            </div>
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
