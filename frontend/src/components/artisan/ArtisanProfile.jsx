import { MapPin, Briefcase, Clock } from "lucide-react";
import Avatar from "@/components/common/Avatar";
import StarRating from "@/components/common/StarRating";
import Badge from "@/components/common/Badge";
import PlanCheck from "./PlanCheck";

export default function ArtisanProfile({ artisan }) {
  return (
    <section className="rounded-3xl bg-card border border-border p-6 shadow-card">
      <div className="flex flex-col sm:flex-row gap-5">
        <Avatar src={artisan.avatar} name={artisan.name} size="xl" />
        <div className="flex-1">
          <div className="flex items-center gap-1 flex-wrap">
            <h1 className="text-2xl font-bold">{artisan.name}</h1>
            <PlanCheck verified={artisan.verified} tier={artisan.badgeTier} size="lg" />
          </div>
          <p className="text-muted-foreground">{artisan.tradeLabel}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {artisan.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Briefcase className="h-4 w-4" /> {artisan.completedJobs} jobs
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {artisan.available ? "Available now" : "Currently busy"}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-3">
            <StarRating value={artisan.rating} count={artisan.reviewCount} />
            <Badge tone={artisan.available ? "success" : "warning"}>
              {artisan.available ? "Available" : "Busy"}
            </Badge>
          </div>
          <p className="mt-4 text-sm">{artisan.bio}</p>
        </div>
      </div>
    </section>
  );
}
