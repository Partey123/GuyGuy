import Badge from "@/components/common/Badge";

const map = {
  pending: { label: "Pending", tone: "default" },
  requested: { label: "Requested", tone: "warning" },
  accepted: { label: "Accepted", tone: "secondary" },
  in_progress: { label: "In progress", tone: "primary" },
  completed_by_artisan: { label: "Awaiting confirmation", tone: "warning" },
  completed: { label: "Completed", tone: "success" },
  disputed: { label: "Disputed", tone: "destructive" },
  cancelled: { label: "Cancelled", tone: "default" },
  refunded: { label: "Refunded", tone: "default" },
};

export default function BookingStatus({ status }) {
  const v = map[status] || map.requested;
  return <Badge tone={v.tone}>{v.label}</Badge>;
}
