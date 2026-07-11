import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ORG_NAV } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { collaborations } from "@/data/portal/organization";

export const Route = createFileRoute("/_authenticated/dashboard/organization/collaborations")({
  head: () => ({ meta: [{ title: "Collaborations — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: CollaborationsPage,
});

function CollaborationsPage() {
  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={ORG_NAV}
      eyebrow="Collaborations"
      title="Every partnership, at a glance"
      actions={<Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">New collaboration</Button>}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collaborations.map((c) => (
          <div key={c.id} className="rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.partner}</div>
                <div className="font-display mt-1 text-lg leading-tight text-foreground">{c.title}</div>
              </div>
              <StatusPill status={c.status === "active" ? "active" : c.status === "pending" ? "review" : c.status === "completed" ? "approved" : "rejected"} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div><div className="text-muted-foreground">Budget</div><div className="mt-0.5 font-semibold text-foreground">৳{(c.budgetBDT / 1_00_000).toFixed(1)}L</div></div>
              <div><div className="text-muted-foreground">Timeline</div><div className="mt-0.5 font-semibold text-foreground">{c.timeline}</div></div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs"><span className="text-muted-foreground">Progress</span><span className="font-medium text-foreground">{c.progress}%</span></div>
              <Progress value={c.progress} className="mt-1.5 h-1.5" />
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full flex-1">Open</Button>
              <Button size="sm" variant="ghost" className="rounded-full">Message</Button>
            </div>
          </div>
        ))}
      </div>
      {collaborations.length === 0 && <Panel title=""><p className="text-sm text-muted-foreground">No collaborations yet.</p></Panel>}
    </PortalLayout>
  );
}
