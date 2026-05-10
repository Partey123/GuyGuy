import api from "@/lib/axios";

export const reviewsApi = {
  list: () => api.get("/reviews"),
  get: (id) => api.get(`/reviews/${id}`),
  create: (data) => api.post("/reviews", data),
  update: (id, data) => api.patch(`/reviews/${id}`, data),
  remove: (id) => api.delete(`/reviews/${id}`),
};
