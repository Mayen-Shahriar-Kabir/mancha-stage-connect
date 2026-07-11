import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Clapperboard, Calendar, MapPin } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Button } from "@/components/ui/button";
import { BookTicketDialog } from "@/components/business/BookTicketDialog";
import { listPublishedProductions, fmtBDT, type Production } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/dashboard/audience/book")({
  head: () => ({ meta: [{ title: "Book Shows — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: BookPage,
});

function BookPage() {
  const [items, setItems] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<Production | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setItems(await listPublishedProductions()); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Book"
      title="Live productions"
      description="Every published show across Mancha, in one place."
    >
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0,1,2].map((i) => <div key={i} className="h-80 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 p-16 text-center">
          <div className="font-display text-xl text-foreground">No live shows right now</div>
          <p className="mt-2 text-sm text-muted-foreground">New productions appear here as soon as groups publish them.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => {
            const available = Math.max(0, (p.max_seats ?? 0) - p.seats_sold);
            const soldOut = available === 0;
            return (
              <article key={p.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:shadow-xl">
                <div className="relative aspect-[16/10] bg-muted">
                  {p.poster_url ? (
                    <img src={p.poster_url} alt={p.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground"><Clapperboard className="h-10 w-10" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {soldOut && <span className="absolute right-3 top-3 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-semibold text-white">Sold out</span>}
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-accent">{p.genre ?? "Theatre"}</div>
                    <div className="font-display text-lg leading-tight text-white">{p.title}</div>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" />{p.show_date ?? "TBA"} · {p.show_time?.slice(0,5) ?? "—"}</div>
                    <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{p.venue ?? "Venue TBA"}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-display text-xl text-brand">{fmtBDT(Number(p.ticket_price))}</div>
                    <Button size="sm" disabled={soldOut} onClick={() => { setPicked(p); setOpen(true); }} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                      {soldOut ? "Sold out" : "Book"}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <BookTicketDialog open={open} onOpenChange={setOpen} production={picked} onBooked={load} />
    </PortalLayout>
  );
}
