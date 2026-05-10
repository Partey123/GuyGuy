import { useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users as UsersIcon,
  Wallet,
  ClipboardList,
  ShieldCheck,
  AlertTriangle,
  Activity,
  Star,
  MapPin,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import PageWrapper from "@/components/layout/PageWrapper";
import { EARNINGS_SERIES, TRADES, ARTISANS } from "@/lib/mockData";
import { formatCedi } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const TABS = [
  "Overview",
  "Users",
  "Revenue",
  "Bookings",
  "Artisans",
  "Boost",
  "Disputes",
  "Transactions",
  "Growth",
  "Engagement",
];

const RANGES = [
  { k: "7d", label: "7d" },
  { k: "30d", label: "30d" },
  { k: "90d", label: "90d" },
  { k: "12m", label: "12m" },
];

const COLORS = ["hsl(var(--primary))", "hsl(var(--accent))", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Analytics() {
  const [tab, setTab] = useState("Overview");
  const [range, setRange] = useState("30d");

  const data = useMemo(
    () =>
      EARNINGS_SERIES.map((e, i) => ({
        ...e,
        bookings: Math.round(e.amount / 18),
        revenue: e.amount,
        users: 100 + i * 12 + Math.floor(Math.random() * 20),
        completion: 80 + Math.floor(Math.random() * 18),
      })),
    [],
  );

  const tradeData = TRADES.slice(0, 6).map((t, i) => ({
    name: t.label,
    value: 120 - i * 12,
  }));

  const geoData = [
    { city: "Kumasi", value: 612 },
    { city: "Accra", value: 284 },
    { city: "Takoradi", value: 134 },
    { city: "Tamale", value: 78 },
  ];

  const escrowData = [
    { name: "Held", value: 42 },
    { name: "Released", value: 88 },
    { name: "Refunded", value: 6 },
  ];

  return (
    <PageWrapper title="Analytics" subtitle="Marketplace health, growth and operational signals." wide>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex gap-1 overflow-x-auto rounded-full border border-border p-1 bg-card">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-full transition",
                tab === t ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-1 rounded-full border border-border p-1 bg-card">
          {RANGES.map((r) => (
            <button
              key={r.k}
              onClick={() => setRange(r.k)}
              className={cn(
                "px-3 py-1 text-xs font-semibold rounded-full",
                range === r.k ? "bg-foreground text-background" : "text-muted-foreground",
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KPI icon={Wallet} label="GMV" value={formatCedi(48230)} delta="+18.2%" up />
        <KPI icon={ClipboardList} label="Bookings" value="1,284" delta="+9.4%" up />
        <KPI icon={UsersIcon} label="Active users" value="3,120" delta="+12.1%" up />
        <KPI icon={ShieldCheck} label="Verifications" value="92%" delta="-1.4%" />
      </div>

      {tab === "Overview" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card title="Revenue trend" className="lg:col-span-2">
            <ChartArea data={data} dataKey="revenue" />
          </Card>
          <Card title="Escrow status">
            <ChartPie data={escrowData} />
          </Card>
          <Card title="Bookings per week" className="lg:col-span-2">
            <ChartBars data={data} dataKey="bookings" />
          </Card>
          <Card title="Top categories">
            <ul className="space-y-2.5">
              {tradeData.map((t, i) => (
                <li key={t.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-5 text-muted-foreground">{i + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{t.name}</span>
                      <span className="text-muted-foreground">{t.value}</span>
                    </div>
                    <div className="h-1.5 mt-1 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(t.value / 120) * 100}%` }} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "Users" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card title="User growth" className="lg:col-span-2">
            <ChartArea data={data} dataKey="users" color="hsl(var(--accent))" />
          </Card>
          <Card title="By role">
            <ChartPie data={[
              { name: "Clients", value: 720 },
              { name: "Artisans", value: 312 },
              { name: "Admins", value: 4 },
            ]} />
          </Card>
        </div>
      )}

      {tab === "Revenue" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <Card title="Revenue breakdown" className="lg:col-span-2">
            <ChartBars data={data} dataKey="revenue" />
          </Card>
          <Card title="By payment method">
            <ChartPie data={[
              { name: "Mobile money", value: 78 },
              { name: "Card", value: 18 },
              { name: "Bank", value: 4 },
            ]} />
          </Card>
        </div>
      )}

      {tab === "Bookings" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Bookings over time">
            <ChartLine data={data} dataKey="bookings" />
          </Card>
          <Card title="Completion rate">
            <ChartLine data={data} dataKey="completion" color="#22c55e" />
          </Card>
        </div>
      )}

      {tab === "Artisans" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Top performing artisans">
            <ul className="divide-y divide-border">
              {ARTISANS.slice(0, 6).map((a, i) => (
                <li key={a.id} className="py-2.5 flex items-center justify-between">
                  <span className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}</span>
                    <span className="font-medium text-sm">{a.name}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-sm">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" /> {a.rating}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Category performance">
            <ChartBars data={tradeData.map((d) => ({ ...d, value: d.value }))} dataKey="value" xKey="name" />
          </Card>
        </div>
      )}

      {tab === "Boost" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <KPI icon={Sparkles} label="Active boosts" value="48" delta="+5" up />
          <KPI icon={Wallet} label="Boost MRR" value={formatCedi(3840)} delta="+22%" up />
          <KPI icon={TrendingUp} label="Conversion" value="14.2%" delta="+1.1%" up />
          <Card title="Boost subscriptions" className="lg:col-span-3">
            <ChartArea data={data} dataKey="users" color="hsl(var(--primary))" />
          </Card>
        </div>
      )}

      {tab === "Disputes" && (
        <div className="grid lg:grid-cols-3 gap-4">
          <KPI icon={AlertTriangle} label="Open disputes" value="3" delta="-2" up />
          <KPI icon={ShieldCheck} label="Resolved < 24h" value="86%" delta="+4%" up />
          <KPI icon={Activity} label="Avg. resolution" value="9h" delta="-1h" up />
          <Card title="Resolution outcomes" className="lg:col-span-3">
            <ChartPie data={[
              { name: "Client favored", value: 32 },
              { name: "Artisan favored", value: 28 },
              { name: "Split", value: 14 },
              { name: "Escalated", value: 4 },
            ]} />
          </Card>
        </div>
      )}

      {tab === "Transactions" && (
        <Card title="Transaction trends">
          <ChartLine data={data} dataKey="revenue" />
        </Card>
      )}

      {tab === "Growth" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="Geographic activity">
            <ul className="space-y-3">
              {geoData.map((g) => (
                <li key={g.city} className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm w-24">{g.city}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(g.value / geoData[0].value) * 100}%` }} />
                  </div>
                  <span className="text-sm tabular-nums">{g.value}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="New signups">
            <ChartArea data={data} dataKey="users" />
          </Card>
        </div>
      )}

      {tab === "Engagement" && (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card title="DAU / MAU">
            <ChartLine data={data} dataKey="users" />
          </Card>
          <Card title="Session activity">
            <ChartBars data={data} dataKey="bookings" />
          </Card>
        </div>
      )}
    </PageWrapper>
  );
}

function KPI({ icon: Icon, label, value, delta, up }) {
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-center justify-between">
        <span className="h-9 w-9 rounded-xl bg-primary-muted text-primary inline-flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </span>
        {delta && (
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-semibold rounded-full px-2 py-0.5",
            up ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive",
          )}>
            {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {delta}
          </span>
        )}
      </div>
      <p className="mt-4 text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function Card({ title, children, className }) {
  return (
    <div className={cn("rounded-2xl bg-card border border-border p-5", className)}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold">{title}</p>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
}

function ChartArea({ data, dataKey, color = "hsl(var(--primary))" }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <defs>
            <linearGradient id={`g-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.4} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="week" stroke="currentColor" opacity={0.5} fontSize={12} />
          <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
          <Tooltip />
          <Area type="monotone" dataKey={dataKey} stroke={color} fill={`url(#g-${dataKey})`} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartBars({ data, dataKey, xKey = "week" }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey={xKey} stroke="currentColor" opacity={0.5} fontSize={12} />
          <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
          <Tooltip />
          <Bar dataKey={dataKey} fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartLine({ data, dataKey, color = "hsl(var(--primary))" }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="week" stroke="currentColor" opacity={0.5} fontSize={12} />
          <YAxis stroke="currentColor" opacity={0.5} fontSize={12} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChartPie({ data }) {
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
