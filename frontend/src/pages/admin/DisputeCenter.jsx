import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Search as SearchIcon,
  Filter,
  Image as ImageIcon,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Scale,
  ArrowUpCircle,
  StickyNote,
} from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import Input from "@/components/common/Input";
import { useBookingStore } from "@/store/bookingStore";
import { findArtisan } from "@/lib/mockData";
import { formatCedi, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const STATUS_TABS = [
  { k: "open", label: "Open" },
  { k: "in_review", label: "In review" },
  { k: "resolved", label: "Resolved" },
  { k: "all", label: "All" },
];

const PRIORITY_TONE = {
  high: "destructive",
  medium: "warning",
  low: "secondary",
};

export default function DisputeCenter() {
  const allDisputes = useBookingStore((s) => s.items.filter((b) => b.status === "disputed" || b.status === "refunded"));
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const [tab, setTab] = useState("open");
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [busy, setBusy] = useState(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [notes, setNotes] = useState({});

  const enriched = useMemo(
    () =>
      allDisputes.map((b, i) => ({
        ...b,
        priority: i % 3 === 0 ? "high" : i % 3 === 1 ? "medium" : "low",
        evidence: [b.evidence || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400"],
        slaHours: 24 - i * 4,
      })),
    [allDisputes],
  );

  const filtered = enriched.filter((b) => {
    if (tab === "open" && b.status !== "disputed") return false;
    if (tab === "resolved" && b.status === "disputed") return false;
    if (tab === "in_review" && b.status !== "disputed") return false;
    if (priority !== "all" && b.priority !== priority) return false;
    if (q && !`${b.title} ${b.description}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const selected = filtered.find((b) => b.id === selectedId) || filtered[0];

  const action = (b, kind) => {
    setBusy(b.id);
    const tid = toast.loading("Processing…");
    setTimeout(() => {
      if (kind === "client") {
        updateStatus(b.id, "refunded");
        toast.success("Resolved in favor of client. Refund issued.", { id: tid });
      } else if (kind === "artisan") {
        updateStatus(b.id, "completed", { escrow: "released" });
        toast.success("Resolved in favor of artisan. Payment released.", { id: tid });
      } else if (kind === "split") {
        updateStatus(b.id, "completed", { escrow: "released" });
        toast.success("Split payment applied (50/50).", { id: tid });
      } else if (kind === "escalate") {
        toast.success("Escalated to senior ops.", { id: tid });
      }
      setBusy(null);
    }, 800);
  };

  const addNote = (id) => {
    if (!noteDraft.trim()) return;
    setNotes((n) => ({
      ...n,
      [id]: [{ id: Date.now(), text: noteDraft, by: "You", at: new Date().toLocaleString() }, ...(n[id] || [])],
    }));
    setNoteDraft("");
    toast.success("Internal note saved");
  };

  if (!enriched.length) {
    return (
      <PageWrapper title="Disputes">
        <EmptyState title="No open disputes" description="When clients flag a job, it lands here." />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Disputes" subtitle="Resolve conflicts between clients and artisans." wide>
      {/* KPIs */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KPI icon={AlertTriangle} label="Open" value={enriched.filter((b) => b.status === "disputed").length} tone="destructive" />
        <KPI icon={Clock} label="Avg. resolution" value="9h" />
        <KPI icon={ShieldCheck} label="Resolved this week" value={enriched.filter((b) => b.status !== "disputed").length} />
        <KPI icon={Scale} label="Split rulings" value="14%" />
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex gap-1 rounded-full border border-border p-1 bg-card">
          {STATUS_TABS.map((s) => (
            <button
              key={s.k}
              onClick={() => setTab(s.k)}
              className={cn(
                "px-3 py-1.5 text-xs font-semibold rounded-full",
                tab === s.k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search disputes" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {["all", "high", "medium", "low"].map((p) => (
            <button
              key={p}
              onClick={() => setPriority(p)}
              className={cn(
                "px-3 py-1.5 rounded-full font-semibold capitalize border",
                priority === p ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground",
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-5">
        {/* List */}
        <ul className="space-y-2 max-h-[80vh] overflow-y-auto pr-1">
          {filtered.map((b) => {
            const a = findArtisan(b.artisanId);
            const active = selected?.id === b.id;
            return (
              <li key={b.id}>
                <button
                  onClick={() => setSelectedId(b.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border p-4 transition",
                    active ? "border-foreground bg-card shadow-card" : "border-border bg-card hover:border-foreground/40",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm line-clamp-1">{b.title}</p>
                    <Badge tone={PRIORITY_TONE[b.priority]}>{b.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                    {a?.name} · {formatCedi(b.amount)}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-2 inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" /> SLA {b.slaHours}h
                  </p>
                </button>
              </li>
            );
          })}
          {!filtered.length && (
            <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No disputes match these filters.
            </li>
          )}
        </ul>

        {/* Detail */}
        {selected ? (
          <DetailPanel
            b={selected}
            busy={busy}
            notes={notes[selected.id] || []}
            noteDraft={noteDraft}
            setNoteDraft={setNoteDraft}
            addNote={() => addNote(selected.id)}
            action={action}
          />
        ) : null}
      </div>
    </PageWrapper>
  );
}

function KPI({ icon: Icon, label, value, tone = "default" }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center justify-between">
        <span className={cn(
          "h-9 w-9 rounded-xl inline-flex items-center justify-center",
          tone === "destructive" ? "bg-destructive/15 text-destructive" : "bg-primary-muted text-primary",
        )}>
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-3 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function DetailPanel({ b, busy, notes, noteDraft, setNoteDraft, addNote, action }) {
  const a = findArtisan(b.artisanId);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{b.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">Filed {formatDate(b.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={PRIORITY_TONE[b.priority]}>{b.priority} priority</Badge>
            <Badge tone={b.status === "disputed" ? "destructive" : "success"}>
              {b.status === "disputed" ? "Open" : "Resolved"}
            </Badge>
          </div>
        </div>

        {b.disputeReason && (
          <p className="mt-3 inline-block rounded-full bg-destructive/10 text-destructive text-xs px-2.5 py-1">
            Reason: {b.disputeReason}
          </p>
        )}
        <p className="mt-3 text-sm leading-relaxed">{b.disputeNote || b.description}</p>

        {/* Resolution actions */}
        <div className="mt-5 grid sm:grid-cols-2 gap-2">
          <Button size="sm" variant="destructive" onClick={() => action(b, "client")} loading={busy === b.id}>
            <ShieldCheck className="h-4 w-4" /> Resolve for client
          </Button>
          <Button size="sm" onClick={() => action(b, "artisan")} loading={busy === b.id}>
            <ShieldCheck className="h-4 w-4" /> Resolve for artisan
          </Button>
          <Button size="sm" variant="secondary" onClick={() => action(b, "split")} loading={busy === b.id}>
            <Scale className="h-4 w-4" /> Split payment
          </Button>
          <Button size="sm" variant="ghost" onClick={() => action(b, "escalate")}>
            <ArrowUpCircle className="h-4 w-4" /> Escalate
          </Button>
        </div>
      </div>

      {/* Job + parties */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-card border border-border p-5">
          <p className="text-sm font-semibold mb-3">Booking details</p>
          <dl className="text-sm space-y-2">
            <Row label="Job ID">{b.id}</Row>
            <Row label="Amount held">{formatCedi(b.amount)}</Row>
            <Row label="Escrow">{b.escrow}</Row>
            <Row label="Address">{b.address}</Row>
            <Row label="Scheduled">{b.scheduledFor ? formatDate(b.scheduledFor) : "—"}</Row>
          </dl>
        </div>
        <div className="rounded-2xl bg-card border border-border p-5">
          <p className="text-sm font-semibold mb-3">Parties</p>
          <div className="space-y-3">
            <Party name={b.clientName || "Client"} role="Client" avatar={null} />
            <Party name={a?.name} role={a?.tradeLabel} avatar={a?.avatar} />
          </div>
        </div>
      </div>

      {/* Evidence */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> Evidence
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {b.evidence.map((src, i) => (
            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-border bg-muted">
              <img src={src} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Internal notes */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <p className="text-sm font-semibold mb-3 flex items-center gap-2">
          <StickyNote className="h-4 w-4" /> Internal notes
        </p>
        <div className="flex gap-2">
          <input
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="Add a note for the ops team…"
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm"
          />
          <Button size="sm" onClick={addNote}>Add</Button>
        </div>
        <ul className="mt-3 space-y-2">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl bg-muted/40 p-3 text-sm">
              <p>{n.text}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.by} · {n.at}</p>
            </li>
          ))}
          {notes.length === 0 && <li className="text-xs text-muted-foreground">No internal notes yet.</li>}
        </ul>
      </div>

      {/* Timeline */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <p className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4" /> Timeline
        </p>
        <ol className="relative border-l border-border ml-2 space-y-4 pl-5">
          {[
            { t: "Booking created", at: formatDate(b.createdAt) },
            { t: "Job started", at: "+1 day" },
            { t: "Client filed dispute", at: "+2 days" },
            { t: "Evidence submitted", at: "+2 days" },
          ].map((e, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-card" />
              <p className="text-sm font-medium">{e.t}</p>
              <p className="text-xs text-muted-foreground">{e.at}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-right">{children}</dd>
    </div>
  );
}

function Party({ name, role, avatar }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar src={avatar} name={name} />
      <div>
        <p className="font-medium text-sm">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}
