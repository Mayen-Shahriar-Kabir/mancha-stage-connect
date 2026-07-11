import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus, Edit3, Trash2, Radio, Ticket as TicketIcon, TrendingUp, Calendar, Eye, EyeOff,
} from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProductionFormDialog } from "@/components/business/ProductionFormDialog";
import { useAuth } from "@/hooks/use-auth";
import {
  listMyProductions, deleteProduction, updateProduction, fmtBDT, type Production,
} from "@/lib/business";

export const Route = createFileRoute("/_authenticated/dashboard/group/productions")({
  head: () => ({ meta: [{ title: "Productions · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ProductionsPage,
});

function ProductionsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Production | null>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try { setItems(await listMyProductions(user.id)); }
    catch (e: any) { toast.error(e?.message ?? "Failed to load"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this production?")) return;
    try { await deleteProduction(id); toast.success("Deleted"); load(); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  const togglePublish = async (p: Production) => {
    try {
      await updateProduction(p.id, { is_published: !p.is_published });
      toast.success(p.is_published ? "Unpublished" : "Published");
      load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  const archive = async (p: Production) => {
    try { await updateProduction(p.id, { status: "archived" }); toast.success("Archived"); load(); }
    catch (e: any) { toast.error(e?.message ?? "Failed"); }
  };

  return (
    <GroupLayout
      eyebrow="Repertoire"
      title="Productions"
      description="Every show your ensemble has staged, is staging, or is about to unveil."
      actions={
        <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create Production
        </Button>
      }
    >
      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-80 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 p-16 text-center">
          <div className="font-display text-xl text-foreground">No productions yet</div>
          <p className="mt-2 text-sm text-muted-foreground">Announce your first show to open ticket booking and funding.</p>
          <Button onClick={() => setDialogOpen(true)} className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-1.5 h-4 w-4" /> Create Production
          </Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => {
            const cap = p.max_seats ?? 0;
            const soldPct = cap ? Math.round((p.seats_sold / cap) * 100) : 0;
            const revenue = Number(p.ticket_price ?? 0) * p.seats_sold;
            return (
              <article key={p.id} className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-xl">
                <div className="relative h-52 overflow-hidden bg-muted">
                  {p.poster_url ? (
                    <img src={p.poster_url} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="grid h-full place-items-center text-muted-foreground"><Radio className="h-10 w-10" /></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5"><StatusPill status={p.status} /></div>
                  <div className="absolute right-3 top-3">
                    {p.is_published ? (
                      <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white">Published</span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">Draft</span>
                    )}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-display text-xl leading-tight text-white">{p.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/80">
                      <Calendar className="h-3 w-3" />
                      {p.show_date ? new Date(p.show_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "TBA"} · {p.venue ?? "TBA"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="grid grid-cols-2 gap-3">
                    <Metric icon={TrendingUp} label="Revenue" value={fmtBDT(revenue)} />
                    <Metric icon={TicketIcon} label="Tickets" value={`${p.seats_sold} / ${cap}`} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Capacity filled</span><span>{soldPct}%</span>
                    </div>
                    <Progress value={soldPct} className="mt-1 h-1.5" />
                  </div>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => { setEditing(p); setDialogOpen(true); }}>
                      <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => togglePublish(p)}>
                      {p.is_published ? <EyeOff className="mr-1 h-3.5 w-3.5" /> : <Eye className="mr-1 h-3.5 w-3.5" />}
                      {p.is_published ? "Unpublish" : "Publish"}
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 rounded-full text-xs" onClick={() => archive(p)}>Archive</Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0 text-rose-600 hover:bg-rose-500/10" onClick={() => onDelete(p.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <ProductionFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        groupId={user?.id ?? ""}
        existing={editing}
        onSaved={load}
      />
    </GroupLayout>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground"><Icon className="h-3 w-3" /> {label}</div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
