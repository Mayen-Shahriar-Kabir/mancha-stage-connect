import { createFileRoute } from "@tanstack/react-router";
import { Plus, TrendingUp, Ticket } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { productions } from "@/data/admin/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/admin/productions")({
  head: () => ({ meta: [{ title: "Productions · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ProductionsPage,
});

const fmtBDT = (n: number) =>
  n >= 100000 ? `৳${(n / 100000).toFixed(1)}L` : `৳${n.toLocaleString()}`;

function ProductionsPage() {
  return (
    <AdminLayout
      eyebrow="Programming"
      title="Productions"
      description="Every show currently on stage or in the pipeline across Mancha."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> New production
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Active" value="58" delta={4.2} />
        <StatCard label="Sold Out" value="12" delta={9.1} icon={TrendingUp} />
        <StatCard label="Tickets Sold (mo)" value="18,420" delta={11.4} icon={Ticket} />
        <StatCard label="Avg. occupancy" value="82%" delta={3.6} />
      </div>

      <Panel title="All productions" description={`${productions.length} listed`}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productions.map((p) => {
            const pct = Math.round((p.ticketsSold / p.capacity) * 100);
            return (
              <div
                key={p.id}
                className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div
                  className="relative aspect-[4/3] w-full bg-muted"
                  style={{
                    backgroundImage: `url(${p.cover})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-3 top-3"><StatusPill status={p.status} /></div>
                  <div className="absolute inset-x-3 bottom-3 text-white">
                    <p className="text-[10px] uppercase tracking-wider opacity-80">{p.type}</p>
                    <p className="font-display text-lg leading-tight">{p.title}</p>
                    <p className="mt-0.5 truncate text-xs opacity-90">{p.group}</p>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Revenue</p>
                      <p className="font-display text-lg">{fmtBDT(p.revenueBDT)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Tickets</p>
                      <p className="text-sm font-medium">
                        {p.ticketsSold}/{p.capacity}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Progress value={pct} className="h-1.5" />
                    <p className="mt-1 text-[11px] text-muted-foreground">{pct}% capacity</p>
                  </div>
                  <div className="flex gap-1.5 pt-1">
                    <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs">
                      Edit
                    </Button>
                    <Button size="sm" className="h-8 flex-1 rounded-full bg-brand text-brand-foreground text-xs hover:bg-brand/90">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </AdminLayout>
  );
}
