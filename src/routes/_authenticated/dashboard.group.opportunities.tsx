import { createFileRoute } from "@tanstack/react-router";
import { Plus, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { opportunities, type Opportunity, type OppKind } from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: OpportunitiesPage,
});

const TABS: { key: OppKind; label: string }[] = [
  { key: "hiring", label: "Hiring" },
  { key: "auditions", label: "Auditions" },
  { key: "internships", label: "Internships" },
  { key: "collaborations", label: "Collaborations" },
];

function OpportunitiesPage() {
  return (
    <GroupLayout
      eyebrow="Talent Pipeline"
      title="Opportunities"
      description="Post roles, calls, and collaborations — reach the Mancha network in a click."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create Opportunity
        </Button>
      }
    >
      <Tabs defaultValue="hiring" className="w-full">
        <TabsList className="h-11 rounded-full bg-muted/50 p-1">
          {TABS.map((t) => {
            const count = opportunities.filter((o) => o.kind === t.key).length;
            return (
              <TabsTrigger
                key={t.key}
                value={t.key}
                className="rounded-full px-4 text-xs data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {t.label}
                <span className="ml-1.5 rounded-full bg-brand/10 px-1.5 py-0.5 text-[10px] font-semibold text-brand">
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TABS.map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-6">
            <OpportunityGrid items={opportunities.filter((o) => o.kind === t.key)} />
          </TabsContent>
        ))}
      </Tabs>
    </GroupLayout>
  );
}

function OpportunityGrid({ items }: { items: Opportunity[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No opportunities in this category yet.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {items.map((o) => {
        const daysLeft = Math.max(0, Math.round((new Date(o.deadline).getTime() - Date.now()) / 86400000));
        return (
          <article key={o.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg leading-tight text-foreground">{o.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {o.location}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold text-brand">
                {daysLeft}d left
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {o.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-foreground">
                  {tag}
                </span>
              ))}
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <dt className="flex items-center gap-1 uppercase tracking-wider text-muted-foreground"><Users className="h-3 w-3" /> Applicants</dt>
                <dd className="mt-0.5 text-sm font-semibold text-foreground">{o.applicants}</dd>
              </div>
              <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
                <dt className="flex items-center gap-1 uppercase tracking-wider text-muted-foreground"><Calendar className="h-3 w-3" /> Deadline</dt>
                <dd className="mt-0.5 text-sm font-semibold text-foreground">
                  {new Date(o.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </dd>
              </div>
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
              <span>Posted {o.posted}</span>
              <button className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
                Review <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
