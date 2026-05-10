import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { useTheme } from "@/contexts/ThemeContext";
import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import { APP_NAME } from "@/lib/constants";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";

const navByRole = {
  client: [
    { to: "/home", label: "Home" },
    { to: "/search", label: "Find a guy" },
    { to: "/my-bookings", label: "Bookings" },
  ],
  artisan: [
    { to: "/artisan", label: "Dashboard" },
    { to: "/artisan/requests", label: "Requests" },
    { to: "/artisan/jobs", label: "Jobs" },
    { to: "/artisan/earnings", label: "Earnings" },
  ],
  admin: [
    { to: "/admin", label: "Overview" },
    { to: "/admin/verifications", label: "Verifications" },
    { to: "/admin/disputes", label: "Disputes" },
    { to: "/admin/transactions", label: "Transactions" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/analytics", label: "Analytics" },
  ],
};

const ROLES = [
  { id: "client", label: "Client", path: "/home" },
  { id: "artisan", label: "Artisan", path: "/artisan" },
  { id: "admin", label: "Admin", path: "/admin" },
];

function RoleSegmented({ role, onSwitch, className }) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full border border-border bg-muted/40 p-1",
        className,
      )}
      role="tablist"
      aria-label="Switch role"
    >
      {ROLES.map((r) => {
        const active = r.id === role;
        return (
          <button
            key={r.id}
            onClick={() => onSwitch(r)}
            role="tab"
            aria-selected={active}
            className={cn(
              "relative flex-1 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors text-center",
              active ? "text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="role-pill"
                className="absolute inset-0 rounded-full bg-foreground"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative">{r.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="p-2.5 rounded-full hover:bg-muted text-foreground"
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="inline-flex"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export default function Navbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const notifications = useNotificationStore((s) => s.items);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unread = notifications.filter((n) => n.unread).length;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const bellRef = useRef(null);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const onClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const items = user ? navByRole[user.role] || [] : [];

  const onNotifClick = (n) => {
    setBellOpen(false);
    if (n.link) navigate(n.link);
  };

  const switchRole = (r) => {
    useAuthStore.getState().switchRole(r.id);
    toast.info(`Switched to ${r.label} view`);
    navigate(r.path);
  };

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-xl border-b border-border">
      <div className="w-full mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link
          to={user ? (user.role === "admin" ? "/admin" : user.role === "artisan" ? "/artisan" : "/home") : "/"}
          className="flex items-center gap-2.5 shrink-0"
        >
          <span className="h-9 w-9 rounded-2xl bg-primary text-primary-foreground inline-flex items-center justify-center font-bold shadow-card">
            G
          </span>
          <span className="font-bold text-lg tracking-tight font-display">{APP_NAME}</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.to === "/admin" || it.to === "/artisan" || it.to === "/home"}
              className={({ isActive }) =>
                cn(
                  "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                  isActive ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )
              }
            >
              {it.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user && (
            <RoleSegmented role={user.role} onSwitch={switchRole} className="hidden md:flex" />
          )}
          <ThemeToggleButton />
          {user ? (
            <>
              <Link to="/search" className="lg:hidden p-2.5 rounded-full hover:bg-muted text-foreground">
                <Search className="h-5 w-5" />
              </Link>
              <div className="relative" ref={bellRef}>
                <button
                  onClick={() => setBellOpen((v) => !v)}
                  className="relative p-2.5 rounded-full hover:bg-muted text-foreground active:scale-95 transition-transform"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  {unread > 0 && (
                    <Badge
                      tone="primary"
                      className="absolute -top-0.5 -right-0.5 h-5 min-w-5 justify-center px-1 bg-accent text-accent-foreground"
                    >
                      {unread}
                    </Badge>
                  )}
                </button>
                <AnimatePresence>
                  {bellOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18 }}
                      className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-2xl bg-card border border-border shadow-elevated overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <p className="font-semibold text-sm">Notifications</p>
                        <span className="text-xs text-muted-foreground">{unread} unread</span>
                      </div>
                      <ul className="max-h-80 overflow-y-auto divide-y divide-border">
                        {notifications.slice(0, 5).map((n) => (
                          <li key={n.id}>
                            <button
                              onClick={() => onNotifClick(n)}
                              className={cn(
                                "w-full text-left px-4 py-3 hover:bg-muted/60 transition",
                                n.unread && "bg-primary-muted/30",
                              )}
                            >
                              <p className="text-sm font-semibold">{n.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{formatDate(n.at)}</p>
                            </button>
                          </li>
                        ))}
                        {notifications.length === 0 && (
                          <li className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet</li>
                        )}
                      </ul>
                      <button
                        onClick={() => {
                          markAllRead();
                          toast.info("All notifications marked as read");
                        }}
                        className="w-full px-4 py-3 text-sm font-medium border-t border-border hover:bg-muted text-primary"
                      >
                        Mark all read
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link to={user.role === "artisan" ? "/artisan/profile/edit" : "/me"} className="ml-1">
                <Avatar src={user.avatar} name={user.name} size="sm" />
              </Link>
              <button
                onClick={() => {
                  logout();
                  toast.info("Signed out");
                  navigate("/");
                }}
                className="hidden md:inline-flex p-2.5 rounded-full hover:bg-muted text-muted-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
              <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2.5 rounded-full hover:bg-muted">
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold px-4 py-2 rounded-full hover:bg-muted">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-5 py-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-card"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && user && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-3">
              <RoleSegmented
                role={user.role}
                onSwitch={(r) => {
                  switchRole(r);
                  setOpen(false);
                }}
                className="w-full"
              />
              <div className="space-y-0.5">
                {items.map((it) => (
                  <NavLink
                    key={it.to}
                    to={it.to}
                    end={it.to === "/admin" || it.to === "/artisan" || it.to === "/home"}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "block px-4 py-2.5 rounded-full text-sm font-medium",
                        isActive ? "bg-foreground text-background" : "hover:bg-muted",
                      )
                    }
                  >
                    {it.label}
                  </NavLink>
                ))}
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-muted/40">
                <span className="text-sm font-medium">Dark mode</span>
                <button
                  onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full hover:bg-muted text-foreground"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              </div>
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                  navigate("/");
                }}
                className="w-full text-left px-4 py-2.5 rounded-full text-sm font-medium hover:bg-muted text-muted-foreground"
              >
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
