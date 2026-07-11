import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { QrCode, Download, Ticket as TicketIcon, X } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { StatusPill } from "@/components/admin/primitives";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { listMyTickets, cancelTicket, fmtBDT, type Ticket, type Production } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/dashboard/audience/tickets")({
  head: () => ({ meta: [{ title: "My Tickets — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: TicketsPage,
});

type Row = Ticket & { production: Production | null };

function TicketsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try { setItems(await listMyTickets(user.id)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const cancel = async (id: string) => {
    if (!confirm("Cancel this booking?")) return;
    try { await cancelTicket(id); toast.success("Cancelled"); load(); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  const downloadTicket = (t: Row) => {
    const text = `MANCHA TICKET
Booking: ${t.booking_code}
Show: ${t.production?.title ?? "—"}
Venue: ${t.production?.venue ?? "—"}
Date: ${t.production?.show_date ?? "—"} ${t.production?.show_time?.slice(0,5) ?? ""}
Seats: ${t.seat_count}
Total: ${fmtBDT(Number(t.total_price))}
Status: ${t.status}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `mancha-ticket-${t.booking_code}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const upcoming = items.filter((t) => t.status === "confirmed");
  const cancelled = items.filter((t) => t.status === "cancelled");
  const used = items.filter((t) => t.status === "used");

  const groups = [
    { value: "upcoming" as const, label: "Upcoming", rows: upcoming },
    { value: "past"     as const, label: "Past",     rows: used },
    { value: "cancelled" as const, label: "Cancelled", rows: cancelled },
  ];

  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Tickets"
      title="Every seat you've booked"
      actions={<Button asChild variant="outline" className="rounded-full"><Link to="/dashboard/audience/book">Book more</Link></Button>}
    >
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">{[0,1].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 p-16 text-center">
          <TicketIcon className="mx-auto h-10 w-10 text-muted-foreground" />
          <div className="font-display mt-3 text-xl text-foreground">No tickets yet</div>
          <p className="mt-2 text-sm text-muted-foreground">Browse live shows to book your first seat.</p>
          <Button asChild className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Link to="/dashboard/audience/book">Browse shows</Link></Button>
        </div>
      ) : (
        <Tabs defaultValue="upcoming">
          <TabsList className="rounded-full bg-muted/60 p-1">
            {groups.map((g) => (
              <TabsTrigger key={g.value} value={g.value} className="rounded-full text-xs data-[state=active]:bg-background">
                {g.label}<span className="ml-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px]">{g.rows.length}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {groups.map((g) => (
            <TabsContent key={g.value} value={g.value} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2">
                {g.rows.map((t) => (
                  <div key={t.id} className="flex overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:shadow-md">
                    {t.production?.poster_url && <img src={t.production.poster_url} alt="" className="h-full w-32 object-cover" />}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-display text-lg leading-tight text-foreground">{t.production?.title ?? "Untitled"}</div>
                          <div className="text-xs text-muted-foreground">Booking {t.booking_code}</div>
                        </div>
                        <StatusPill status={t.status === "confirmed" ? "upcoming" : t.status} />
                      </div>
                      <div className="mt-3 space-y-0.5 text-xs text-muted-foreground">
                        <div>{t.production?.venue ?? "—"}</div>
                        <div>{t.production?.show_date ?? "—"} · {t.production?.show_time?.slice(0,5) ?? "—"}</div>
                        <div>{t.seat_count} seat{t.seat_count > 1 ? "s" : ""} · {fmtBDT(Number(t.total_price))}</div>
                      </div>
                      <div className="mt-auto flex gap-2 pt-4">
                        <Button size="sm" variant="outline" className="rounded-full"><QrCode className="mr-1.5 h-3.5 w-3.5" /> QR</Button>
                        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => downloadTicket(t)}><Download className="mr-1.5 h-3.5 w-3.5" /> Download</Button>
                        {t.status === "confirmed" && (
                          <Button size="sm" variant="ghost" className="rounded-full text-rose-600 hover:bg-rose-500/10" onClick={() => cancel(t.id)}>
                            <X className="mr-1.5 h-3.5 w-3.5" /> Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {g.rows.length === 0 && <div className="col-span-full rounded-xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">Nothing here.</div>}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </PortalLayout>
  );
}
