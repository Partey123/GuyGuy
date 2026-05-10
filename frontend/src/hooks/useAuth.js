import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const logout = useAuthStore((s) => s.logout);
  const switchRole = useAuthStore((s) => s.switchRole);
  return { user, isAuthed: !!user, login, signup, logout, switchRole };
}
