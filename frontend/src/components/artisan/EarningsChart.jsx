import { formatCedi } from "@/lib/formatters";

export default function EarningsChart({ data = [] }) {
  const max = Math.max(1, ...data.map((d) => d.amount));
  return (
    <div className="rounded-2xl bg-card border border-border p-5">
      <div className="flex items-end justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Last 7 weeks</p>
          <p className="text-2xl font-bold">
            {formatCedi(data.reduce((s, d) => s + d.amount, 0))}
          </p>
        </div>
      </div>
      <div className="flex items-end gap-2 h-40">
        {data.map((d) => {
          const h = Math.max(6, (d.amount / max) * 100);
          return (
            <div key={d.week} className="flex-1 flex flex-col items-center gap-1.5">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-primary/70 to-primary"
                style={{ height: `${h}%` }}
                title={formatCedi(d.amount)}
              />
              <span className="text-[10px] text-muted-foreground">{d.week}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
