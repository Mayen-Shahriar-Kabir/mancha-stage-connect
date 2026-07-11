import { createFileRoute } from "@tanstack/react-router";
import { Heart, Play } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { savedShows, watchHistory } from "@/data/portal/audience";

export const Route = createFileRoute("/_authenticated/dashboard/audience/watchlist")({
  head: () => ({ meta: [{ title: "Watchlist — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: WatchlistPage,
});

function WatchlistPage() {
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Watchlist"
      title="Shows you're following"
    >
      <Panel title="Saved shows">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {savedShows.map((s) => (
            <div key={s.slug} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="aspect-[3/4] overflow-hidden"><img src={s.poster} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
              <div className="p-4">
                <div className="font-display text-base text-foreground">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.group} · Opens {s.opens}</div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-full flex-1">Book</Button>
                  <Button size="icon" variant="ghost" className="rounded-full"><Heart className="h-4 w-4 fill-brand text-brand" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Continue watching">
        <div className="grid gap-4 md:grid-cols-3">
          {watchHistory.map((w) => (
            <div key={w.id} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:shadow-md">
              <div className="relative aspect-video overflow-hidden">
                <img src={w.thumb} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                  <Play className="h-10 w-10 fill-white text-white" />
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20">
                  <div className="h-full bg-brand" style={{ width: w.watched }} />
                </div>
              </div>
              <div className="p-4">
                <div className="font-medium text-foreground">{w.title}</div>
                <div className="text-xs text-muted-foreground">{w.group} · {w.kind} · {w.watched} watched</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </PortalLayout>
  );
}
