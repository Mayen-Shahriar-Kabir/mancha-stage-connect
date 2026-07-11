import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { notifications } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Notifications"
      title="What's new for you"
      actions={<Button variant="outline" className="rounded-full">Mark all read</Button>}
    >
      <Panel title="Recent activity">
        <ul className="divide-y divide-border/60">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${n.tone === "success" ? "bg-emerald-500" : n.tone === "warn" ? "bg-amber-500" : "bg-brand"}`} />
                <span className="text-sm text-foreground">{n.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{n.when}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </PortalLayout>
  );
}
