import api from "@/lib/axios";

export const paymentsApi = {
  list: () => api.get("/payments"),
  get: (id) => api.get(`/payments/${id}`),
  create: (data) => api.post("/payments", data),
  update: (id, data) => api.patch(`/payments/${id}`, data),
  remove: (id) => api.delete(`/payments/${id}`),
};
