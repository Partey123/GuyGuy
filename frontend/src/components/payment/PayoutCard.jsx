import { Wallet } from "lucide-react";
import { formatCedi } from "@/lib/formatters";
import Button from "@/components/common/Button";

export default function PayoutCard({ available = 0, pending = 0, onWithdraw }) {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-primary to-secondary text-primary-foreground p-5">
      <div className="flex items-center gap-2 opacity-90">
        <Wallet className="h-4 w-4" /> <span className="text-sm">Available to withdraw</span>
      </div>
      <p className="mt-1 text-3xl font-bold">{formatCedi(available)}</p>
      <p className="text-xs opacity-80 mt-1">{formatCedi(pending)} pending in escrow</p>
      <Button
        variant="secondary"
        className="mt-4 bg-card/20 text-primary-foreground border-0 hover:bg-card/30"
        onClick={onWithdraw}
      >
        Withdraw to MoMo
      </Button>
    </div>
  );
}
