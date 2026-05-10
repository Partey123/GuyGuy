import api from "@/lib/axios";

export const artisansApi = {
  list: () => api.get("/artisans"),
  get: (id) => api.get(`/artisans/${id}`),
  create: (data) => api.post("/artisans", data),
  update: (id, data) => api.patch(`/artisans/${id}`, data),
  remove: (id) => api.delete(`/artisans/${id}`),
};
