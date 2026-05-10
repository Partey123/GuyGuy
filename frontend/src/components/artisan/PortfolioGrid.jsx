import EmptyState from "@/components/common/EmptyState";
import { Image as ImageIcon } from "lucide-react";

export default function PortfolioGrid({ items = [] }) {
  if (!items.length) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No portfolio yet"
        description="Past work will show up here."
      />
    );
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {items.map((src, i) => (
        <div
          key={i}
          className="aspect-square rounded-xl overflow-hidden bg-muted group cursor-pointer"
        >
          <img
            src={src}
            alt={`Portfolio ${i + 1}`}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform"
          />
        </div>
      ))}
    </div>
  );
}
