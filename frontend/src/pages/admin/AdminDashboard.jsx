import { Users, ShieldAlert, Wallet, BadgeCheck } from "lucide-react";
import PageWrapper from "@/components/layout/PageWrapper";
import EarningsChart from "@/components/artisan/EarningsChart";
import { EARNINGS_SERIES, ARTISANS } from "@/lib/mockData";
import { formatCedi } from "@/lib/formatters";
import { useBookingStore } from "@/store/bookingStore";

const Stat = ({ label, value, icon: Icon, hint }) => (
  <div className="rounded-2xl bg-card border border-border p-5">
    <div className="flex items-center gap-2 text-muted-foreground text-xs">
      <Icon className="h-4 w-4" /> {label}
    </div>
    <p className="text-2xl font-bold mt-1">{value}</p>
    {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
  </div>
);

export default function AdminDashboard() {
  const items = useBookingStore((s) => s.items);
  const openDisputes = items.filter((b) => b.status === "disputed").length;
  const pendingVerifications = ARTISANS.filter((a) => !a.verified).length;
  const weekGMV = items.reduce((sum, b) => sum + (b.amount || 0), 0);

  return (
    <PageWrapper title="Admin overview" subtitle="Operational health for GuyGuy.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Active users" value="1,284" icon={Users} hint="+8% this week" />
        <Stat label="Pending verifications" value={pendingVerifications} icon={BadgeCheck} hint="Action needed" />
        <Stat label="Open disputes" value={openDisputes} icon={ShieldAlert} hint="Needs review" />
        <Stat label="GMV (week)" value={formatCedi(weekGMV)} icon={Wallet} hint="+12% vs last" />
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Platform earnings (commission)</h2>
        <EarningsChart data={EARNINGS_SERIES} />
      </div>
    </PageWrapper>
  );
}
