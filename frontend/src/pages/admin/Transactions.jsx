import PageWrapper from "@/components/layout/PageWrapper";
import Badge from "@/components/common/Badge";
import { formatCedi, formatDate } from "@/lib/formatters";

const TX = [
  { id: "t1", date: "2026-05-08", ref: "PSK-9988", from: "Adwoa Asare", to: "Kwame Asante", amount: 220, status: "released" },
  { id: "t2", date: "2026-05-07", ref: "PSK-9971", from: "Yaa Mensa", to: "Yaw Boateng", amount: 150, status: "held" },
  { id: "t3", date: "2026-05-06", ref: "PSK-9963", from: "Kojo Otieno", to: "Ama Mensah", amount: 600, status: "released" },
  { id: "t4", date: "2026-05-05", ref: "PSK-9941", from: "Akua Manu", to: "Akosua Darko", amount: 90, status: "refunded" },
];

const tone = (s) =>
  s === "released" ? "success" : s === "held" ? "primary" : s === "refunded" ? "warning" : "default";

export default function Transactions() {
  return (
    <PageWrapper title="Transactions" subtitle="All escrow movements and payouts.">
      <div className="rounded-2xl bg-card border border-border overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-surface text-muted-foreground text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Date</th>
              <th className="text-left px-4 py-3">Reference</th>
              <th className="text-left px-4 py-3">From</th>
              <th className="text-left px-4 py-3">To</th>
              <th className="text-right px-4 py-3">Amount</th>
              <th className="text-right px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {TX.map((t) => (
              <tr key={t.id} className="border-t border-border">
                <td className="px-4 py-3">{formatDate(t.date)}</td>
                <td className="px-4 py-3 font-mono text-xs">{t.ref}</td>
                <td className="px-4 py-3">{t.from}</td>
                <td className="px-4 py-3">{t.to}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatCedi(t.amount)}</td>
                <td className="px-4 py-3 text-right">
                  <Badge tone={tone(t.status)}>{t.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
