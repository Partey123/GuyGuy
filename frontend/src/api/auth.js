import { api } from "@/lib/api";

export const authApi = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  verifyEmail: (data) => api.post("/auth/verify-email", data),
  profile: () => api.get("/auth/profile"),
  clientDashboard: () => api.get("/auth/client/dashboard"),
  artisanDashboard: () => api.get("/auth/artisan/dashboard"),
};
