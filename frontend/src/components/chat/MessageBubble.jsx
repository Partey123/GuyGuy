import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/formatters";

export default function MessageBubble({ message, mine, justSent }) {
  return (
    <div className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-3.5 py-2 text-sm",
          mine
            ? "bg-primary text-primary-foreground rounded-br-sm"
            : "bg-muted text-foreground rounded-bl-sm",
        )}
      >
        <p>{message.text}</p>
      </div>
      <p className="text-[10px] text-muted-foreground mt-1 px-1">
        {formatDate(message.at)}
        {justSent && mine && <span className="ml-2 text-success animate-pulse">✓ Sent</span>}
      </p>
    </div>
  );
}
