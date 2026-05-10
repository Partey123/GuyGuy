import api from "@/lib/axios";

export const chatApi = {
  list: () => api.get("/chat"),
  get: (id) => api.get(`/chat/${id}`),
  create: (data) => api.post("/chat", data),
  update: (id, data) => api.patch(`/chat/${id}`, data),
  remove: (id) => api.delete(`/chat/${id}`),
};
