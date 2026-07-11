import { createFileRoute, Link } from "@tanstack/react-router";
import { Ticket, Heart, Sparkles, Crown, ArrowRight } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { StatCard, Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { tickets, recommended, notifications, premiumPlan, impact } from "@/data/portal/audience";

export const Route = createFileRoute("/_authenticated/dashboard/audience/")({
  head: () => ({ meta: [{ title: "Dashboard — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: AudienceHome,
});

function AudienceHome() {
  const upcoming = tickets.filter((t) => t.status === "upcoming");
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Welcome back"
      title="Where the curtain rises next"
      description="Your upcoming shows, recommendations, and the impact your support has made."
      actions={
        <Button asChild className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Link to="/explore/shows">Explore shows <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming Tickets" value={String(upcoming.length)} icon={Ticket} />
        <StatCard label="Watchlist" value="12" icon={Heart} />
        <StatCard label="Recommended" value={String(recommended.length)} icon={Sparkles} />
        <StatCard label="Premium" value={premiumPlan.name} icon={Crown} hint={`Renews ${premiumPlan.renewal}`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Next up" className="lg:col-span-2" action={<Button asChild variant="ghost" size="sm" className="rounded-full"><Link to="/dashboard/audience/tickets">All tickets</Link></Button>}>
          <div className="space-y-3">
            {upcoming.map((t) => (
              <div key={t.id} className="flex items-center gap-4 rounded-xl border border-border/60 p-3">
                <img src={t.poster} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground">{t.show}</div>
                  <div className="text-xs text-muted-foreground">{t.venue} · {t.date} · {t.time}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">{t.seat}</div>
                <StatusPill status={t.status} />
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Your impact">
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Contributed</span><span className="font-semibold text-foreground">৳{impact.contributed.toLocaleString()}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Productions backed</span><span className="font-semibold text-foreground">{impact.productionsBacked}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Artists supported</span><span className="font-semibold text-foreground">{impact.artistsSupported}</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Cities reached</span><span className="font-semibold text-foreground">{impact.citiesReached}</span></li>
          </ul>
        </Panel>
      </div>

      <Panel title="Recommended for you">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((r) => (
            <div key={r.slug} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="aspect-[16/10] overflow-hidden"><img src={r.poster} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div>
              <div className="p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand">{r.tag}</div>
                <div className="mt-1 font-display text-lg text-foreground">{r.title}</div>
                <div className="text-xs text-muted-foreground">{r.group}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Recent activity">
        <ul className="divide-y divide-border/60">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${n.tone === "success" ? "bg-emerald-500" : "bg-brand"}`} />
                <span className="text-sm text-foreground">{n.title}</span>
              </div>
              <span className="text-xs text-muted-foreground">{n.when}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </PortalLayout>
  );
}
