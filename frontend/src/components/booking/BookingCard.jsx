import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import BookingStatus from "./BookingStatus";
import { formatCedi, formatDate } from "@/lib/formatters";
import { findArtisan } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const STATUS_BORDER = {
  in_progress: "border-l-green-500",
  requested: "border-l-amber-400",
  accepted: "border-l-amber-400",
  completed: "border-l-slate-300",
  completed_by_artisan: "border-l-green-500",
  cancelled: "border-l-slate-300",
  disputed: "border-l-red-500",
};

export default function BookingCard({ booking }) {
  const artisan = findArtisan(booking.artisanId);
  const accent = STATUS_BORDER[booking.status] || "border-l-border";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Link
        to={`/bookings/${booking.id}`}
        className={cn(
          "block rounded-2xl bg-card border border-border border-l-4 hover:shadow-card hover:-translate-y-0.5 transition p-4",
          accent,
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex gap-3 min-w-0">
            <Avatar src={artisan?.avatar} name={artisan?.name} />
            <div className="min-w-0">
              <p className="font-semibold truncate">{booking.title}</p>
              <p className="text-sm text-muted-foreground truncate">
                with {artisan?.name} · {artisan?.tradeLabel}
              </p>
              <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                {booking.scheduledFor && (
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(booking.scheduledFor)}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {booking.address}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <BookingStatus status={booking.status} />
            <p className="text-sm font-semibold mt-2">{formatCedi(booking.amount)}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
