import StarRating from "@/components/common/StarRating";
import Avatar from "@/components/common/Avatar";
import EmptyState from "@/components/common/EmptyState";
import { MessageSquare } from "lucide-react";

export default function ReviewList({ reviews = [] }) {
  if (!reviews.length) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No reviews yet"
        description="Reviews will appear here after completed jobs."
      />
    );
  }
  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <li key={r.id} className="rounded-2xl bg-card border border-border p-4">
          <div className="flex items-center gap-3">
            <Avatar name={r.author} size="sm" />
            <div className="flex-1">
              <p className="font-medium text-sm">{r.author}</p>
              <p className="text-xs text-muted-foreground">{r.at}</p>
            </div>
            <StarRating value={r.rating} showNumber={false} size={14} />
          </div>
          <p className="text-sm mt-2">{r.text}</p>
        </li>
      ))}
    </ul>
  );
}
