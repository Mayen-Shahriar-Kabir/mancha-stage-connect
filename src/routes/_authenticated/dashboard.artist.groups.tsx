import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, LogOut, Send } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currentGroup, pastGroups, joinRequests, recommendedGroups } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/groups")({
  head: () => ({ meta: [{ title: "Theatre Groups — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: GroupsPage,
});

function GroupsPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Theatre Groups"
      title="Your ensemble history"
      description="Manage current membership, apply to new groups, and browse a curated match list."
    >
      <Panel title="Current Group">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src={currentGroup.cover} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div>
              <div className="font-display text-xl text-foreground">{currentGroup.name}</div>
              <div className="text-sm text-muted-foreground">
                {currentGroup.role} · with the ensemble since {currentGroup.since}
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge className="rounded-full bg-emerald-500/12 text-emerald-700 dark:text-emerald-400">Active</Badge>
                <Badge variant="outline" className="rounded-full">Season 24</Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full"><ExternalLink className="mr-1.5 h-4 w-4" /> Visit group</Button>
            <Button variant="ghost" className="rounded-full text-rose-600 hover:text-rose-700"><LogOut className="mr-1.5 h-4 w-4" /> Leave group</Button>
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Past Groups">
          <ul className="divide-y divide-border/60">
            {pastGroups.map((g) => (
              <li key={g.slug} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium text-foreground">{g.name}</div>
                  <div className="text-xs text-muted-foreground">{g.role} · {g.years}</div>
                </div>
                <Button variant="ghost" size="sm" className="rounded-full">View</Button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Join Requests">
          {joinRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          ) : (
            <ul className="divide-y divide-border/60">
              {joinRequests.map((r) => (
                <li key={r.slug} className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-medium text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">Submitted {r.submitted}</div>
                  </div>
                  <StatusPill status={r.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel title="Recommended for you" description="Ranked by role fit, city, and recent auditions">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedGroups.map((g) => (
            <div key={g.slug} className="rounded-2xl border border-border/60 bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-lg text-foreground">{g.name}</div>
                  <div className="text-xs text-muted-foreground">{g.city} · {g.members} members</div>
                </div>
                <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-semibold text-brand">
                  {g.match}% match
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Send className="mr-1.5 h-3.5 w-3.5" /> Apply</Button>
                <Button size="sm" variant="outline" className="rounded-full">Visit</Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </PortalLayout>
  );
}
