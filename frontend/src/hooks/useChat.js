import { useEffect, useState } from "react";
import { chatApi } from "@/api/chat";

export function useChat(bookingId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId) {
      setMessages([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    chatApi
      .listMessages(bookingId)
      .then((response) => {
        if (cancelled) return;
        const payload = response.data?.data ?? [];
        setMessages(payload.map(normalizeMessage));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
        console.error("Failed to load chat messages", err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  const send = async (text) => {
    if (!bookingId || !text) return;

    const response = await chatApi.sendMessage(bookingId, { content: text });
    const message = normalizeMessage(response.data?.data ?? response.data);
    setMessages((prev) => [...prev, message]);
    return message;
  };

  return { messages, loading, error, send };
}

function normalizeMessage(message) {
  return {
    id: message.id,
    text: message.content,
    senderId: message.sender_id ?? message.senderId,
    at: message.created_at ?? message.createdAt ?? new Date().toISOString(),
    raw: message,
  };
}
