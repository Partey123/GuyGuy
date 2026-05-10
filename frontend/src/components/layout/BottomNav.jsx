import { NavLink } from "react-router-dom";
import {
  Home,
  Search,
  ClipboardList,
  User,
  LayoutDashboard,
  Wallet,
  Briefcase,
  ShieldCheck,
  Users as UsersIcon,
  AlertTriangle,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const navByRole = {
  client: [
    { to: "/home", label: "Home", icon: Home },
    { to: "/search", label: "Find", icon: Search },
    { to: "/my-bookings", label: "Bookings", icon: ClipboardList },
    { to: "/me", label: "Me", icon: User, showRole: true },
  ],
  artisan: [
    { to: "/artisan", label: "Home", icon: LayoutDashboard },
    { to: "/artisan/requests", label: "Requests", icon: ClipboardList },
    { to: "/artisan/jobs", label: "Jobs", icon: Briefcase },
    { to: "/artisan/earnings", label: "Earn", icon: Wallet, showRole: true },
  ],
  admin: [
    { to: "/admin", label: "Overview", icon: LayoutDashboard },
    { to: "/admin/verifications", label: "Verify", icon: ShieldCheck },
    { to: "/admin/disputes", label: "Disputes", icon: AlertTriangle },
    { to: "/admin/users", label: "Users", icon: UsersIcon, showRole: true },
  ],
};

export default function BottomNav() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;
  const items = navByRole[user.role];
  if (!items) return null;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border">
      <div className="grid grid-cols-4 w-full">
        {items.map(({ to, label, icon: Icon, showRole }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin" || to === "/artisan" || to === "/home"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground",
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "h-9 w-9 rounded-full inline-flex items-center justify-center transition",
                    isActive ? "bg-accent text-accent-foreground" : "",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" />
                </span>
                <span>{label}</span>
                {showRole && (
                  <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wide">
                    {user.role}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
