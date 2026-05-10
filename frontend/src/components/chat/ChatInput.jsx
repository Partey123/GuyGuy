import { useState } from "react";
import { Send } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSend?.(t);
    setText("");
  };
  return (
    <form onSubmit={submit} className="flex items-center gap-2 border-t border-border p-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message"
        disabled={disabled}
        className="flex-1 h-10 rounded-full border border-input bg-background px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      />
      <button
        type="submit"
        className="h-10 w-10 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
        disabled={!text.trim() || disabled}
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}
