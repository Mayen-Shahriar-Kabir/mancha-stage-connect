import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, MapPin } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ORG_NAV } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { orgEvents } from "@/data/portal/organization";

export const Route = createFileRoute("/_authenticated/dashboard/organization/events")({
  head: () => ({ meta: [{ title: "Events — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: EventsPage,
});

function EventsPage() {
  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={ORG_NAV}
      eyebrow="Events"
      title="Programming your calendar"
      actions={<Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><CalendarDays className="mr-1.5 h-4 w-4" />New event</Button>}
    >
      <Panel title="Upcoming programming">
        <ul className="divide-y divide-border/60">
          {orgEvents.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-xl bg-brand/8 text-brand">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-wider">{e.date.slice(5, 7)}</div>
                    <div className="font-display text-lg leading-none">{e.date.slice(8, 10)}</div>
                  </div>
                </div>
                <div>
                  <div className="font-medium text-foreground">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.partner} · {e.time}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {e.venue}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={e.status === "confirmed" ? "approved" : e.status === "planning" ? "review" : "rejected"} />
                <Button size="sm" variant="ghost" className="rounded-full">Edit</Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </PortalLayout>
  );
}
