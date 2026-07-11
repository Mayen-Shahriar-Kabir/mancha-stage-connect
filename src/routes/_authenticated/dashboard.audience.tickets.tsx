import { createFileRoute } from "@tanstack/react-router";
import { QrCode, Download } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { StatusPill } from "@/components/admin/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { tickets, type TicketStatus } from "@/data/portal/audience";

export const Route = createFileRoute("/_authenticated/dashboard/audience/tickets")({
  head: () => ({ meta: [{ title: "My Tickets — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: TicketsPage,
});

const TABS: { value: TicketStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "past", label: "Past" },
  { value: "cancelled", label: "Cancelled" },
];

function TicketsPage() {
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Tickets"
      title="Every seat you've booked"
    >
      <Tabs defaultValue="upcoming">
        <TabsList className="rounded-full bg-muted/60 p-1">
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value} className="rounded-full text-xs data-[state=active]:bg-background">
              {t.label}
              <span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                {tickets.filter((tk) => tk.status === t.value).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => {
          const items = tickets.filter((tk) => tk.status === t.value);
          return (
            <TabsContent key={t.value} value={t.value} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {items.map((tk) => (
                  <div key={tk.id} className="flex overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:shadow-md">
                    <img src={tk.poster} alt="" className="h-full w-32 object-cover" />
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-display text-lg leading-tight text-foreground">{tk.show}</div>
                          <div className="text-xs text-muted-foreground">{tk.group}</div>
                        </div>
                        <StatusPill status={tk.status} />
                      </div>
                      <div className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                        <div>{tk.venue}</div>
                        <div>{tk.date} · {tk.time}</div>
                        <div>Seat: <span className="font-medium text-foreground">{tk.seat}</span></div>
                        <div>ID: {tk.id} · ৳{tk.price}</div>
                      </div>
                      <div className="mt-auto flex gap-2 pt-4">
                        <Button size="sm" variant="outline" className="rounded-full"><QrCode className="mr-1.5 h-3.5 w-3.5" /> QR</Button>
                        <Button size="sm" variant="ghost" className="rounded-full"><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </PortalLayout>
  );
}
