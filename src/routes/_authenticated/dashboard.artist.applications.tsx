import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { applications, type ApplicationStatus } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/applications")({
  head: () => ({ meta: [{ title: "Applications — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ApplicationsPage,
});

const TABS: { value: ApplicationStatus | "all"; label: string }[] = [
  { value: "submitted", label: "Submitted" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

function ApplicationsPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Applications"
      title="Every audition, in one place"
      description="Track where you've applied, what's moving forward, and where to follow up."
    >
      <Tabs defaultValue="submitted">
        <TabsList className="rounded-full bg-muted/60 p-1">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value as string} className="rounded-full text-xs data-[state=active]:bg-background">
              {t.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                {applications.filter((a) => a.status === t.value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => {
          const items = applications.filter((a) => a.status === t.value);
          return (
            <TabsContent key={t.value} value={t.value as string} className="mt-6">
              {items.length === 0 ? (
                <Panel title=""><p className="text-sm text-muted-foreground">Nothing here yet.</p></Panel>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((a) => (
                    <div key={a.id} className="rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-display text-lg text-foreground">{a.role}</div>
                          <div className="mt-0.5 text-xs text-muted-foreground">{a.organization}</div>
                        </div>
                        <StatusPill status={a.status === "shortlisted" ? "review" : a.status === "accepted" ? "approved" : a.status === "rejected" ? "rejected" : "pending"} />
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span>Submitted {a.date}</span>
                        <Button size="sm" variant="ghost" className="rounded-full text-brand">View</Button>
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
