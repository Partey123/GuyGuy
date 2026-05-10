import api from "@/lib/axios";

export const authApi = {
  list: () => api.get("/auth"),
  get: (id) => api.get(`/auth/${id}`),
  create: (data) => api.post("/auth", data),
  update: (id, data) => api.patch(`/auth/${id}`, data),
  remove: (id) => api.delete(`/auth/${id}`),
};
