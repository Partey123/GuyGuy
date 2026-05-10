import Button from "@/components/common/Button";
import { usePaystack } from "@/hooks/usePaystack";

export default function PaystackButton({ amount, onSuccess, label = "Pay & hold in escrow" }) {
  const { pay } = usePaystack();
  const handle = () => pay({ amount, onSuccess });
  return (
    <Button onClick={handle} className="w-full">
      {label} · GHS {amount}
    </Button>
  );
}
