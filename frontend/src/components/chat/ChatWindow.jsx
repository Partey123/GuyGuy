import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import EmptyState from "@/components/common/EmptyState";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";

export default function ChatWindow({ bookingId, bookingStatus }) {
  const { messages, send } = useChat(bookingId);
  const { user } = useAuth();
  const ref = useRef(null);
  const [lastSentId, setLastSentId] = useState(null);
  const locked = bookingStatus && !["accepted", "in_progress", "completed_by_artisan", "completed"].includes(bookingStatus);

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }, [messages.length]);

  useEffect(() => {
    if (!lastSentId) return;
    const t = setTimeout(() => setLastSentId(null), 1500);
    return () => clearTimeout(t);
  }, [lastSentId]);

  const handleSend = async (t) => {
    const id = "m" + Date.now();
    await send(t);
    setLastSentId(id);
  };

  return (
    <div className="relative rounded-2xl bg-card border border-border flex flex-col h-[480px]">
      <div className="px-4 py-3 border-b border-border">
        <p className="font-semibold">Chat</p>
        <p className="text-xs text-muted-foreground">
          Keep all conversations here for your protection.
        </p>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length ? (
          messages.map((m, i) => (
            <MessageBubble
              key={m.id}
              message={m}
              mine={m.senderId === user?.id}
              justSent={i === messages.length - 1 && lastSentId !== null}
            />
          ))
        ) : (
          <EmptyState title="No messages yet" description="Say hello to start." />
        )}
      </div>
      <ChatInput onSend={handleSend} disabled={locked} />
      {locked && (
        <div className="absolute inset-0 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center max-w-xs px-6">
            <Lock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Chat unlocks once the booking is accepted.</p>
          </div>
        </div>
      )}
    </div>
  );
}
