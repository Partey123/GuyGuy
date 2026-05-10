import { useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Pause,
  Play,
  Mail,
  Phone,
  MapPin,
  Wallet,
  ClipboardList,
  AlertTriangle,
  CheckCircle2,
  StickyNote,
  History,
} from "lucide-react";
import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ALL_USERS } from "./Users";
import { BOOKINGS } from "@/lib/mockData";
import { formatCedi, formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const TABS = [
  { k: "overview", label: "Overview" },
  { k: "bookings", label: "Bookings" },
  { k: "payments", label: "Payments" },
  { k: "reports", label: "Reports" },
  { k: "notes", label: "Notes" },
  { k: "activity", label: "Activity" },
];

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseUser = useMemo(() => ALL_USERS.find((u) => u.id === id), [id]);
  const [user, setUser] = useState(baseUser);
  const [tab, setTab] = useState("overview");
  const [notes, setNotes] = useState([
    { id: 1, by: "Akua (Ops)", at: "2026-04-22", text: "Verified ID document. Looks legitimate." },
  ]);
  const [draft, setDraft] = useState("");

  if (!baseUser) {
    return (
      <PageWrapper title="User not found">
        <div className="rounded-2xl bg-card border border-border p-8 text-center">
          <p className="text-muted-foreground">We couldn't find this user.</p>
          <Link to="/admin/users" className="text-primary text-sm font-medium mt-3 inline-block">
            ← Back to users
          </Link>
        </div>
      </PageWrapper>
    );
  }

  const userBookings = BOOKINGS.slice(0, 4);
  const totalSpend = userBookings.reduce((s, b) => s + (b.amount || 0), 0);
  const completed = userBookings.filter((b) => b.status === "completed").length;

  const toggleSuspend = () => {
    setUser((u) => ({ ...u, suspended: !u.suspended }));
    toast.success(user.suspended ? "User reactivated" : "User suspended");
  };

  const toggleVerify = () => {
    setUser((u) => ({ ...u, verified: !u.verified }));
    toast.success(user.verified ? "Verification revoked" : "User verified");
  };

  const removeUser = () => {
    if (!confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return;
    toast.success("User deleted");
    navigate("/admin/users");
  };

  const addNote = () => {
    if (!draft.trim()) return;
    setNotes((n) => [{ id: Date.now(), by: "You", at: new Date().toISOString().slice(0, 10), text: draft }, ...n]);
    setDraft("");
    toast.success("Note added");
  };

  return (
    <PageWrapper
      title={
        <span className="inline-flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-full hover:bg-muted">
            <ArrowLeft className="h-4 w-4" />
          </button>
          {user.name}
        </span>
      }
      subtitle="Full user profile and operational controls."
    >
      <div className="grid lg:grid-cols-[320px_1fr] gap-6">
        {/* LEFT — profile card */}
        <aside className="space-y-4">
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex flex-col items-center text-center">
              <Avatar src={user.avatar} name={user.name} size="xl" />
              <p className="mt-3 font-semibold text-lg">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.tradeLabel}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone={user.role === "artisan" ? "primary" : "secondary"}>
                  {user.role === "artisan" ? "Artisan" : "Client"}
                </Badge>
                <Badge tone={user.verified ? "success" : "warning"}>
                  {user.verified ? "Verified" : "Unverified"}
                </Badge>
                {user.suspended && <Badge tone="destructive">Suspended</Badge>}
              </div>
            </div>

            <div className="mt-5 space-y-2.5 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" /> {user.id.slice(0, 8)}@guyguy.app
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" /> +233 24 {Math.floor(1000000 + Math.random() * 8999999)}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" /> {user.location}
              </p>
              <p className="text-xs text-muted-foreground">Joined {user.joinedAt}</p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button size="sm" variant={user.verified ? "ghost" : "primary"} onClick={toggleVerify}>
                {user.verified ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                {user.verified ? "Revoke" : "Verify"}
              </Button>
              <Button size="sm" variant="ghost" onClick={toggleSuspend}>
                {user.suspended ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                {user.suspended ? "Activate" : "Suspend"}
              </Button>
              <Button size="sm" variant="destructive" className="col-span-2" onClick={removeUser}>
                <Trash2 className="h-4 w-4" /> Delete user
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">At a glance</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Bookings</span>
              <span className="font-semibold">{userBookings.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-semibold">{completed}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Lifetime spend</span>
              <span className="font-semibold">{formatCedi(totalSpend)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Reports</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </aside>

        {/* RIGHT — tabs */}
        <section>
          <div className="flex gap-1 overflow-x-auto rounded-full border border-border p-1 bg-card mb-5">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                className={cn(
                  "shrink-0 px-4 py-2 text-xs font-semibold rounded-full transition",
                  tab === t.k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "overview" && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-3">
                <KPI icon={ClipboardList} label="Bookings" value={userBookings.length} />
                <KPI icon={CheckCircle2} label="Completion rate" value={`${Math.round((completed / Math.max(1, userBookings.length)) * 100)}%`} />
                <KPI icon={Wallet} label="Lifetime spend" value={formatCedi(totalSpend)} />
              </div>
              <div className="rounded-2xl bg-card border border-border p-5">
                <p className="text-sm font-semibold mb-3">Recent bookings</p>
                <ul className="divide-y divide-border">
                  {userBookings.slice(0, 3).map((b) => (
                    <li key={b.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{b.title}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(b.createdAt)} · {b.status}</p>
                      </div>
                      <Badge tone="secondary">{formatCedi(b.amount)}</Badge>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "bookings" && (
            <div className="rounded-2xl bg-card border border-border divide-y divide-border">
              {userBookings.map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(b.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone="secondary">{b.status}</Badge>
                    <span className="text-sm font-semibold">{formatCedi(b.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "payments" && (
            <div className="rounded-2xl bg-card border border-border p-5">
              <p className="text-sm font-semibold mb-3">Payment activity</p>
              <ul className="divide-y divide-border text-sm">
                {userBookings.map((b) => (
                  <li key={b.id} className="py-3 flex items-center justify-between">
                    <span className="text-muted-foreground">{formatDate(b.createdAt)} — escrow {b.escrow}</span>
                    <span className="font-semibold">{formatCedi(b.amount)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "reports" && (
            <div className="rounded-2xl bg-card border border-dashed border-border p-10 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium">No reports or disputes filed</p>
              <p className="text-xs text-muted-foreground mt-1">This user has a clean record.</p>
            </div>
          )}

          {tab === "notes" && (
            <div className="space-y-3">
              <div className="rounded-2xl bg-card border border-border p-4">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  placeholder="Internal note about this user…"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
                <div className="flex justify-end mt-2">
                  <Button size="sm" onClick={addNote}><StickyNote className="h-4 w-4" /> Add note</Button>
                </div>
              </div>
              <ul className="space-y-2">
                {notes.map((n) => (
                  <li key={n.id} className="rounded-2xl bg-card border border-border p-4">
                    <p className="text-sm">{n.text}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{n.by} · {n.at}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {tab === "activity" && (
            <ol className="relative border-l border-border ml-2 space-y-5 pl-5">
              {[
                { t: "Account created", at: user.joinedAt },
                { t: "Verification submitted", at: "2026-02-08" },
                { t: "First booking placed", at: "2026-02-12" },
                { t: "Profile updated", at: "2026-04-01" },
              ].map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                  <p className="text-sm font-medium">{e.t}</p>
                  <p className="text-xs text-muted-foreground inline-flex items-center gap-1">
                    <History className="h-3 w-3" /> {e.at}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </PageWrapper>
  );
}

function KPI({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <p className="text-xs uppercase tracking-wide">{label}</p>
      </div>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
}
