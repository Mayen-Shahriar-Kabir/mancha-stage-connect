import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Clock, Coins } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { Panel } from "@/components/admin/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { opportunities, type OpportunityKind } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/opportunities")({
  head: () => ({ meta: [{ title: "Opportunities — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: OpportunitiesPage,
});

const TABS: { value: OpportunityKind; label: string }[] = [
  { value: "jobs", label: "Jobs" },
  { value: "auditions", label: "Auditions" },
  { value: "internships", label: "Internships" },
  { value: "collaborations", label: "Collaborations" },
];

function OpportunitiesPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Opportunity Hub"
      title="Where your next role could come from"
      description="Curated openings across theatre, film, OTT, and campus programs."
    >
      <Tabs defaultValue="jobs">
        <TabsList className="rounded-full bg-muted/60 p-1">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="rounded-full text-xs data-[state=active]:bg-background">
              {t.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                {opportunities.filter((o) => o.kind === t.value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => {
          const items = opportunities.filter((o) => o.kind === t.value);
          return (
            <TabsContent key={t.value} value={t.value} className="mt-6">
              {items.length === 0 ? (
                <Panel title=""><p className="text-sm text-muted-foreground">Nothing open right now — check back soon.</p></Panel>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((o) => (
                    <div key={o.id} className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div>
                        <div className="font-display text-lg leading-snug text-foreground">{o.title}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{o.org}</div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {o.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="rounded-full text-[10px]">{tag}</Badge>
                        ))}
                      </div>
                      <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {o.location}</div>
                        <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Deadline {o.deadline}</div>
                        {o.compensation ? (
                          <div className="flex items-center gap-1.5"><Coins className="h-3.5 w-3.5" /> {o.compensation}</div>
                        ) : null}
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="flex-1 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Apply</Button>
                        <Button size="sm" variant="ghost" className="rounded-full">Save</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </PortalLayout>
  );
}
