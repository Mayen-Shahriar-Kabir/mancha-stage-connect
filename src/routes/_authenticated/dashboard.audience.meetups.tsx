import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Award } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { meetups } from "@/data/portal/audience";

export const Route = createFileRoute("/_authenticated/dashboard/audience/meetups")({
  head: () => ({ meta: [{ title: "Meetups — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: MeetupsPage,
});

function MeetupsPage() {
  const upcoming = meetups.filter((m) => m.status !== "past");
  const past = meetups.filter((m) => m.status === "past");
  const groups: Array<[string, typeof meetups]> = [["upcoming", upcoming], ["past", past]];
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Meetups"
      title="Circle up with the community"
    >
      <Tabs defaultValue="upcoming">
        <TabsList className="rounded-full bg-muted/60 p-1">
          <TabsTrigger value="upcoming" className="rounded-full text-xs data-[state=active]:bg-background">Upcoming <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{upcoming.length}</span></TabsTrigger>
          <TabsTrigger value="past" className="rounded-full text-xs data-[state=active]:bg-background">Past <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{past.length}</span></TabsTrigger>
        </TabsList>
        {groups.map(([key, arr]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {arr.map((m) => (
                <div key={m.id} className="rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-display text-lg leading-tight text-foreground">{m.title}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Hosted by {m.host}</div>
                    </div>
                    <StatusPill status={m.status === "registered" ? "approved" : m.status === "upcoming" ? "upcoming" : "closed"} />
                  </div>
                  <div className="mt-4 space-y-1 text-xs text-muted-foreground">
                    <div>{m.date}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {m.location}</div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    {m.status === "upcoming" && <Button size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Register</Button>}
                    {m.status === "registered" && <Button size="sm" variant="outline" className="rounded-full">View pass</Button>}
                    {m.certificate && <Button size="sm" variant="outline" className="rounded-full"><Award className="mr-1.5 h-3.5 w-3.5" /> Certificate</Button>}
                  </div>
                </div>
              ))}
              {arr.length === 0 && <Panel title=""><p className="text-sm text-muted-foreground">Nothing here yet.</p></Panel>}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PortalLayout>
  );
}
