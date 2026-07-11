import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ORG_NAV } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { orgOpportunities } from "@/data/portal/organization";

export const Route = createFileRoute("/_authenticated/dashboard/organization/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: OppsPage,
});

function OppsPage() {
  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={ORG_NAV}
      eyebrow="Opportunities"
      title="Posts you've published"
      actions={<Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="mr-1.5 h-4 w-4" />New post</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orgOpportunities.map((o) => (
          <div key={o.id} className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-display text-lg leading-snug text-foreground">{o.title}</div>
                <div className="mt-0.5 text-xs uppercase tracking-wider text-muted-foreground">{o.kind}</div>
              </div>
              <StatusPill status={o.status === "open" ? "active" : o.status === "closed" ? "closed" : "review"} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs">
              <Badge variant="outline" className="rounded-full">{o.applications} apps</Badge>
              <Badge variant="outline" className="rounded-full">Deadline {o.deadline}</Badge>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-full">Applicants</Button>
              <Button size="sm" variant="ghost" className="rounded-full">Edit</Button>
            </div>
          </div>
        ))}
      </div>
      {orgOpportunities.length === 0 && <Panel title=""><p className="text-sm text-muted-foreground">No opportunities yet.</p></Panel>}
    </PortalLayout>
  );
}
