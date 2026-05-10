import { useNotificationStore } from "@/store/notificationStore";

export function useNotifications() {
  const items = useNotificationStore((s) => s.items);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const push = useNotificationStore((s) => s.push);
  const unread = items.filter((n) => n.unread).length;
  return { items, unread, markAllRead, push };
}
