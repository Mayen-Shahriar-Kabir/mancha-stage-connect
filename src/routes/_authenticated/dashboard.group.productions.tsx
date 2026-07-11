import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit3, Archive, Trash2, Radio, Ticket, TrendingUp, HandCoins, Calendar } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { productions, type LivestreamStatus, type FundingStatus } from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/productions")({
  head: () => ({ meta: [{ title: "Productions · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ProductionsPage,
});

const LIVE_STYLES: Record<LivestreamStatus, string> = {
  live: "bg-rose-500/12 text-rose-700 dark:text-rose-400 ring-rose-500/20",
  scheduled: "bg-sky-500/12 text-sky-700 dark:text-sky-400 ring-sky-500/20",
  recorded: "bg-muted text-muted-foreground ring-border",
  off: "bg-muted text-muted-foreground ring-border",
};

const FUND_STYLES: Record<FundingStatus, string> = {
  funded: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20",
  in_progress: "bg-amber-500/12 text-amber-700 dark:text-amber-400 ring-amber-500/20",
  not_started: "bg-muted text-muted-foreground ring-border",
};

const fmtBDT = (n: number) =>
  n >= 1_00_000 ? `৳${(n / 1_00_000).toFixed(1)}L` : `৳${n.toLocaleString()}`;

function ProductionsPage() {
  return (
    <GroupLayout
      eyebrow="Repertoire"
      title="Productions"
      description="Every show your ensemble has staged, is staging, or is about to unveil."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create Production
        </Button>
      }
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {productions.map((p) => {
          const soldPct = Math.round((p.ticketsSold / p.capacity) * 100);
          return (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.poster}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                  <StatusPill status={p.status} />
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-xl leading-tight text-white">{p.title}</h3>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/80">
                    <Calendar className="h-3 w-3" />
                    {new Date(p.opensOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · {p.venue}
                  </p>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="grid grid-cols-2 gap-3">
                  <Metric icon={TrendingUp} label="Revenue" value={fmtBDT(p.revenueBDT)} />
                  <Metric icon={Ticket} label="Tickets Sold" value={`${p.ticketsSold.toLocaleString()} / ${p.capacity.toLocaleString()}`} />
                </div>

                <div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>Capacity filled</span>
                    <span>{soldPct}%</span>
                  </div>
                  <Progress value={soldPct} className="mt-1 h-1.5" />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium capitalize ring-1 ${LIVE_STYLES[p.livestream]}`}>
                    <Radio className="h-3 w-3" /> Live · {p.livestream.replace("_", " ")}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium capitalize ring-1 ${FUND_STYLES[p.funding]}`}>
                    <HandCoins className="h-3 w-3" /> {p.funding.replace("_", " ")}
                  </span>
                </div>

                <div className="mt-auto flex gap-1.5 pt-2">
                  <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs">
                    <Edit3 className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs">
                    <Archive className="mr-1 h-3.5 w-3.5" /> Archive
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0 text-rose-600 hover:bg-rose-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </GroupLayout>
  );
}

function Metric({ icon: Icon, label, value }: { icon: typeof TrendingUp; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
