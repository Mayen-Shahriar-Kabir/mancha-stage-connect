import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { listMyNotifications, markAllRead, markNotificationRead, type Notification } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/dashboard/audience/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try { setItems(await listMyNotifications(user.id)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const clearAll = async () => { if (user) { await markAllRead(user.id); load(); } };
  const onClick = async (n: Notification) => { if (!n.read) { await markNotificationRead(n.id); load(); } };

  const unread = items.filter((n) => !n.read).length;

  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Inbox"
      title="Notifications"
      description={unread ? `${unread} unread` : "All caught up"}
      actions={unread ? <Button variant="outline" className="rounded-full" onClick={clearAll}><CheckCheck className="mr-1.5 h-4 w-4" /> Mark all read</Button> : undefined}
    >
      {loading ? (
        <div className="space-y-2">{[0,1,2].map((i) => <div key={i} className="h-16 animate-pulse rounded-xl border border-border/60 bg-muted/30" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 p-16 text-center">
          <Bell className="mx-auto h-10 w-10 text-muted-foreground" />
          <div className="font-display mt-3 text-xl text-foreground">No notifications</div>
          <p className="mt-2 text-sm text-muted-foreground">Bookings, contributions, and updates will land here.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
          {items.map((n) => (
            <li key={n.id} onClick={() => onClick(n)} className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition hover:bg-muted/40 ${!n.read ? "bg-brand/[0.03]" : ""}`}>
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-brand"}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="truncate text-sm font-medium text-foreground">{n.title}</div>
                  <div className="shrink-0 text-[11px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                {n.body && <div className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</div>}
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{n.type}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalLayout>
  );
}
