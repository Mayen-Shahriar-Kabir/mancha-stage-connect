import { createFileRoute } from "@tanstack/react-router";
import { Handshake, CalendarDays, Megaphone, Users, Plus } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { StatCard, Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { useAuth, type OrganizationType } from "@/hooks/use-auth";
import {
  orgSummary,
  recentRequests,
  orgEvents,
  highlightsByType,
  quickActionsByType,
  orgTypeLabels,
  notifications,
} from "@/data/portal/organization";

export const Route = createFileRoute("/_authenticated/dashboard/organization/")({
  head: () => ({ meta: [{ title: "Dashboard — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: OrgHome,
});

function OrgHome() {
  const { profile } = useAuth();
  const type: OrganizationType = profile?.organization_type ?? "corporate";
  const highlights = highlightsByType[type];
  const actions = quickActionsByType[type];
  return (
    <PortalLayout
      groupLabel={orgTypeLabels[type]}
      homeUrl="/dashboard/organization"
      nav={getOrgNav(type)}
      eyebrow={orgTypeLabels[type]}
      title={profile?.organization_name ?? "Your organization portal"}
      description="Sponsor, host, cast, and measure — everything you do with Bangladesh's theatre ecosystem, in one place."
      actions={
        <>
          {actions.map((a) => (
            <Button key={a.label} variant="outline" className="rounded-full"><Plus className="mr-1.5 h-4 w-4" />{a.label}</Button>
          ))}
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Collaborations" value={String(orgSummary.activeCollaborations)} delta={orgSummary.activeCollaborationsDelta} icon={Handshake} />
        <StatCard label="Upcoming Events" value={String(orgSummary.upcomingEvents)} delta={orgSummary.upcomingEventsDelta} icon={CalendarDays} />
        <StatCard label="Open Opportunities" value={String(orgSummary.openOpportunities)} delta={orgSummary.openOpportunitiesDelta} icon={Megaphone} />
        <StatCard label="People Reached" value={orgSummary.peopleReached.toLocaleString()} delta={orgSummary.peopleReachedDelta} icon={Users} />
      </div>

      <Panel title={`${orgTypeLabels[type]} highlights`} description="Tuned to your organization type">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-2xl border border-border/60 bg-gradient-to-br from-background to-brand/[0.03] p-5">
              <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{h.title}</div>
              <div className="font-display mt-2 text-2xl text-foreground">{h.value}</div>
              <div className="mt-1 text-xs text-muted-foreground">{h.hint}</div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Recent requests" className="lg:col-span-2">
          <ul className="divide-y divide-border/60">
            {recentRequests.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{r.from}</div>
                  <div className="text-xs text-muted-foreground">{r.purpose} · {r.when}</div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={r.status === "new" ? "pending" : r.status === "review" ? "review" : r.status === "approved" ? "approved" : "rejected"} />
                  <Button size="sm" variant="ghost" className="rounded-full">Open</Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Notifications">
          <ul className="divide-y divide-border/60">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${n.tone === "success" ? "bg-emerald-500" : n.tone === "warn" ? "bg-amber-500" : "bg-brand"}`} />
                  <span className="text-sm text-foreground">{n.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{n.when}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Upcoming events">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orgEvents.slice(0, 6).map((e) => (
            <div key={e.id} className="rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-lg leading-tight text-foreground">{e.title}</div>
                  <div className="text-xs text-muted-foreground">{e.partner}</div>
                </div>
                <StatusPill status={e.status === "confirmed" ? "approved" : e.status === "planning" ? "review" : "rejected"} />
              </div>
              <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                <div>{e.date} · {e.time}</div>
                <div>{e.venue}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </PortalLayout>
  );
}
