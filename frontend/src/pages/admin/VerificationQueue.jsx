import { useState } from "react";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Avatar from "@/components/common/Avatar";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import { ARTISANS } from "@/lib/mockData";

const SEED = ARTISANS.filter((a) => !a.verified).concat(ARTISANS.slice(0, 2));

export default function VerificationQueue() {
  const [items, setItems] = useState(SEED);
  const [busy, setBusy] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const [verifiedToday, setVerifiedToday] = useState(0);

  const approve = (a) => {
    setBusy(a.id);
    const tid = toast.loading("Approving…");
    setTimeout(() => {
      toast.success(`${a.name} is now verified and live on GuyGuy`, { id: tid });
      setItems((xs) => xs.filter((x) => x.id !== a.id));
      setVerifiedToday((n) => n + 1);
      setBusy(null);
    }, 800);
  };

  const reject = (a) => {
    toast.warning(`${a.name}'s application rejected — reason sent.`);
    setItems((xs) => xs.filter((x) => x.id !== a.id));
    setRejecting(null);
    setReason("");
  };

  return (
    <PageWrapper title="Verification queue" subtitle="Review artisan IDs and credentials.">
      <p className="text-sm text-muted-foreground mb-4">Verified today: <span className="font-semibold text-foreground">{verifiedToday}</span></p>
      {items.length === 0 ? (
        <EmptyState title="Queue is clear" description="New verification requests will appear here." />
      ) : (
        <ul className="space-y-3">
          {items.map((a) => (
            <li key={a.id} className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Avatar src={a.avatar} name={a.name} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.tradeLabel} · {a.location}</p>
                </div>
                <button
                  onClick={() => toast.info("Document viewer coming soon")}
                  className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs hover:bg-muted"
                >
                  <FileText className="h-4 w-4" /> Ghana Card
                </button>
                <Badge tone="warning">Pending</Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setRejecting(a.id)}>Reject</Button>
                  <Button size="sm" onClick={() => approve(a)} loading={busy === a.id} className="active:scale-95 transition-transform">
                    Approve
                  </Button>
                </div>
              </div>
              {rejecting === a.id && (
                <div className="mt-3 rounded-xl border border-border bg-surface p-3 space-y-2">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={2}
                    placeholder="Reason for rejection"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm"
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setRejecting(null)}>Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={() => reject(a)}>Confirm reject</Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </PageWrapper>
  );
}
