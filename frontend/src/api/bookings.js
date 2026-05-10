import api from "@/lib/axios";

export const bookingsApi = {
  list: () => api.get("/bookings"),
  get: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post("/bookings", data),
  update: (id, data) => api.patch(`/bookings/${id}`, data),
  remove: (id) => api.delete(`/bookings/${id}`),
};
