import api from "@/lib/axios";

export const chatApi = {
  listMessages: (bookingId, params) =>
    api.get(`/chat/bookings/${bookingId}/messages`, { params }),
  sendMessage: (bookingId, data) =>
    api.post(`/chat/bookings/${bookingId}/messages`, data),
  markAsRead: (messageId) =>
    api.put(`/chat/messages/${messageId}/read`),
};
