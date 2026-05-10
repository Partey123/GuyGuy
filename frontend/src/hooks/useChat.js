import { useEffect, useState } from "react";
import { MESSAGES } from "@/lib/mockData";

export function useChat(bookingId) {
  const [messages, setMessages] = useState(() =>
    MESSAGES.filter((m) => m.bookingId === bookingId),
  );

  useEffect(() => {
    setMessages(MESSAGES.filter((m) => m.bookingId === bookingId));
  }, [bookingId]);

  const send = (text, from = "client") => {
    setMessages((prev) => [
      ...prev,
      { id: "m" + Date.now(), bookingId, text, from, at: new Date().toISOString() },
    ]);
  };

  return { messages, send };
}
