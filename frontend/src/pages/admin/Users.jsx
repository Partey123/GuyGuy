import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search as SearchIcon, LayoutGrid, List, ShieldCheck, MapPin } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import Input from "@/components/common/Input";
import { ARTISANS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export const MOCK_CLIENTS = [
  { id: "u-client-001", name: "Adwoa Asare", role: "client", location: "Nhyiaeso, Kumasi", avatar: "https://i.pravatar.cc/200?img=32", verified: true, tradeLabel: "Client", joinedAt: "2026-01-12", bookings: 14, spend: 2840 },
  { id: "u-client-002", name: "Kojo Amponsah", role: "client", location: "Asokwa, Kumasi", avatar: "https://i.pravatar.cc/200?img=22", verified: true, tradeLabel: "Client", joinedAt: "2026-02-04", bookings: 7, spend: 1200 },
  { id: "u-client-003", name: "Ama Serwaa", role: "client", location: "Adum, Kumasi", avatar: "https://i.pravatar.cc/200?img=45", verified: false, tradeLabel: "Client", joinedAt: "2026-03-18", bookings: 2, spend: 320 },
];

export const ALL_USERS = [
  ...MOCK_CLIENTS,
  ...ARTISANS.map((a) => ({ ...a, role: "artisan", joinedAt: "2025-11-02", bookings: a.completedJobs, spend: 0 })),
];

export default function Users() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("cards");

  const list = useMemo(
    () =>
      ALL_USERS.filter((u) => {
        if (filter !== "all" && u.role !== filter) return false;
        return [u.name, u.tradeLabel, u.location].join(" ").toLowerCase().includes(q.toLowerCase());
      }),
    [q, filter],
  );

  const counts = {
    all: ALL_USERS.length,
    client: ALL_USERS.filter((u) => u.role === "client").length,
    artisan: ALL_USERS.filter((u) => u.role === "artisan").length,
    pending: ALL_USERS.filter((u) => !u.verified).length,
  };

  return (
    <PageWrapper title="Users" subtitle="Manage clients and artisans across the marketplace.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { k: "all", label: "Total users", value: counts.all },
          { k: "client", label: "Clients", value: counts.client },
          { k: "artisan", label: "Artisans", value: counts.artisan },
          { k: "pending", label: "Pending verification", value: counts.pending },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl bg-card border border-border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="max-w-sm flex-1 min-w-[220px] relative">
          <SearchIcon className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search users by name, trade, area" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1 rounded-full border border-border p-1 bg-card">
          {[["all", "All"], ["client", "Clients"], ["artisan", "Artisans"]].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-full transition",
                filter === k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1 rounded-full border border-border p-1 bg-card">
          <button
            onClick={() => setView("cards")}
            className={cn("inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full", view === "cards" ? "bg-foreground text-background" : "text-muted-foreground")}
            aria-label="Card view"
          >
            <LayoutGrid className="h-3.5 w-3.5" /> Cards
          </button>
          <button
            onClick={() => setView("table")}
            className={cn("inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full", view === "table" ? "bg-foreground text-background" : "text-muted-foreground")}
            aria-label="Table view"
          >
            <List className="h-3.5 w-3.5" /> List
          </button>
        </div>
      </div>

      {view === "cards" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {list.map((u) => (
            <Link
              key={u.id}
              to={`/admin/users/${u.id}`}
              className="rounded-2xl bg-card border border-border p-5 hover:shadow-card transition group"
            >
              <div className="flex items-center gap-3">
                <Avatar src={u.avatar} name={u.name} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate group-hover:text-primary">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.tradeLabel}</p>
                </div>
                {u.verified ? (
                  <ShieldCheck className="h-4 w-4 text-success" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-warning" />
                )}
              </div>
              <p className="mt-3 text-xs text-muted-foreground inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {u.location}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <Badge tone={u.role === "artisan" ? "primary" : "secondary"}>
                  {u.role === "artisan" ? "Artisan" : "Client"}
                </Badge>
                <p className="text-xs text-muted-foreground">{u.bookings} bookings</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Bookings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link to={`/admin/users/${u.id}`} className="flex items-center gap-3 hover:text-primary">
                      <Avatar src={u.avatar} name={u.name} size="sm" />
                      <span className="font-medium">{u.name}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={u.role === "artisan" ? "primary" : "secondary"}>
                      {u.role === "artisan" ? "Artisan" : "Client"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.location}</td>
                  <td className="px-4 py-3">
                    <Badge tone={u.verified ? "success" : "warning"}>
                      {u.verified ? "Verified" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{u.bookings}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageWrapper>
  );
}
