import api from "@/lib/axios";

export const adminApi = {
  list: () => api.get("/admin"),
  get: (id) => api.get(`/admin/${id}`),
  create: (data) => api.post("/admin", data),
  update: (id, data) => api.patch(`/admin/${id}`, data),
  remove: (id) => api.delete(`/admin/${id}`),
};
