import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Hammer, Home as HomeIcon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "client", title: "I need a guy", body: "Find and book trusted artisans.", icon: HomeIcon, color: "bg-primary-muted text-primary" },
  { id: "artisan", title: "I'm an artisan", body: "Get jobs and grow your business.", icon: Hammer, color: "bg-secondary/15 text-secondary" },
  { id: "admin", title: "Platform admin (demo)", body: "Disputes, transactions, verifications.", icon: ShieldCheck, color: "bg-accent/30 text-foreground" },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [picked, setPicked] = useState(null);

  const confirm = (role) => {
    setPicked(role);
    switchRole(role);
    toast.success("Great — let's set up your profile");
    setTimeout(() => navigate(role === "artisan" ? "/artisan" : role === "admin" ? "/admin" : "/home"), 400);
  };

  return (
    <AuthLayout title="How will you use GuyGuy?" subtitle="You can switch later.">
      <div className="grid gap-3">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            onClick={() => confirm(o.id)}
            className={cn(
              "flex items-center gap-4 p-4 rounded-2xl border bg-card transition text-left active:scale-[0.98]",
              picked === o.id ? "border-primary shadow-card" : "border-border hover:border-primary/50 hover:shadow-card",
            )}
          >
            <span className={cn("h-12 w-12 rounded-xl inline-flex items-center justify-center", o.color)}>
              <o.icon className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="font-semibold">{o.title}</p>
              <p className="text-sm text-muted-foreground">{o.body}</p>
            </div>
          </button>
        ))}
      </div>
    </AuthLayout>
  );
}
