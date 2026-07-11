import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { contributions, impact } from "@/data/portal/audience";

export const Route = createFileRoute("/_authenticated/dashboard/audience/community")({
  head: () => ({ meta: [{ title: "Community — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Community Support"
      title="Where your ticket becomes a movement"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { l: "Contributed", v: `৳${impact.contributed.toLocaleString()}` },
          { l: "Productions backed", v: impact.productionsBacked },
          { l: "Artists supported", v: impact.artistsSupported },
          { l: "Cities reached", v: impact.citiesReached },
        ].map((s) => (
          <div key={s.l} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="font-display mt-2 text-2xl text-foreground">{s.v}</div>
          </div>
        ))}
      </div>

      <Panel title="Contribution history">
        <ul className="divide-y divide-border/60">
          {contributions.map((c) => (
            <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <div>
                <div className="text-sm font-medium text-foreground">{c.campaign}</div>
                <div className="text-xs text-muted-foreground">{c.group} · {c.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={c.status === "confirmed" ? "approved" : "pending"} />
                <span className="font-semibold text-foreground">৳{c.amount.toLocaleString()}</span>
                <Button variant="ghost" size="sm" className="rounded-full">Receipt</Button>
              </div>
            </li>
          ))}
        </ul>
      </Panel>
    </PortalLayout>
  );
}
