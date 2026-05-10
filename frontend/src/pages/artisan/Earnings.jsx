import { toast } from "sonner";
import PageWrapper from "@/components/layout/PageWrapper";
import EarningsChart from "@/components/artisan/EarningsChart";
import PayoutCard from "@/components/payment/PayoutCard";
import Button from "@/components/common/Button";
import { EARNINGS_SERIES } from "@/lib/mockData";
import { useBooking } from "@/hooks/useBooking";
import { formatCedi, formatDate } from "@/lib/formatters";

const HISTORY = [
  { id: "p1", date: "2026-05-04", amount: 220, ref: "PSK-9988", status: "paid" },
  { id: "p2", date: "2026-04-26", amount: 600, ref: "PSK-9871", status: "paid" },
  { id: "p3", date: "2026-04-18", amount: 150, ref: "PSK-9755", status: "paid" },
];

export default function Earnings() {
  const { bookings } = useBooking();
  const pending = bookings.filter((b) => b.status === "completed_by_artisan");

  return (
    <PageWrapper title="Earnings" subtitle="Track payouts and pending escrow.">
      <div className="grid lg:grid-cols-3 gap-4">
        <PayoutCard available={1840} pending={370} />
        <div className="lg:col-span-2">
          <EarningsChart data={EARNINGS_SERIES} />
        </div>
      </div>

      {pending.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mt-8 mb-3">Pending payout</h2>
          <ul className="space-y-2">
            {pending.map((b) => (
              <li key={b.id} className="rounded-2xl bg-card border border-border p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{b.title}</p>
                  <p className="text-xs text-muted-foreground">Awaiting client confirmation</p>
                </div>
                <p className="font-semibold">{formatCedi(b.artisanPayout || 0)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Early payout requests are reviewed within 24 hours")}
            >
              Request early payout
            </Button>
          </div>
        </>
      )}

      <h2 className="text-lg font-semibold mt-8 mb-3">Recent payouts</h2>
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface text-muted-foreground text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Reference</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-right px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {HISTORY.map((h) => (
              <tr key={h.id} className="border-t border-border">
                <td className="px-4 py-3">{formatDate(h.date)}</td>
                <td className="px-4 py-3 font-mono text-xs">{h.ref}</td>
                <td className="px-4 py-3 text-right">
                  <p className="font-semibold">{formatCedi(h.amount)}</p>
                  <p className="text-[10px] text-muted-foreground">After 10% fee</p>
                </td>
                <td className="px-4 py-3 text-right capitalize text-success">{h.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
