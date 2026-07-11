import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Users, Clapperboard, HandCoins, Ticket, TrendingUp, Heart,
  ArrowRight, Calendar, Bell, Plus, Sparkles, Radio,
} from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { StatCard, Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  groupStats, productions, campaigns, notifications, rehearsals, recentApplications,
} from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/")({
  head: () => ({ meta: [{ title: "Studio Overview — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: GroupHome,
});

const fmtBDT = (n: number) =>
  n >= 1_00_00_000 ? `৳${(n / 1_00_00_000).toFixed(1)} Cr`
  : n >= 1_00_000 ? `৳${(n / 1_00_000).toFixed(1)}L`
  : `৳${n.toLocaleString()}`;

function GroupHome() {
  const upcoming = productions.filter((p) => p.status !== "closed").slice(0, 3);
  const fundingActive = campaigns.slice(0, 3);

  return (
    <GroupLayout
      eyebrow="Group Studio"
      title="Welcome back, Nagorik Natya Sampradaya"
      description="Your ensemble, productions, and community — all in one stage."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> New production
        </Button>
      }
    >
      {/* Welcome / hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-brand/8 via-background to-accent/10 p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="h-3.5 w-3.5" /> Season 24 · Monsoon Stage
            </div>
            <h2 className="font-display mt-3 text-2xl leading-snug text-foreground md:text-3xl">
              Two productions running, one opening in six weeks.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You're 76% to your monthly ticket target and ৳1.89L away from the National Tour goal. Keep the momentum.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">Season plan</Button>
            <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              Announce show <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active Members" value={groupStats.activeMembers.toString()} delta={groupStats.activeMembersDelta} icon={Users} />
        <StatCard label="Active Productions" value={groupStats.activeProductions.toString()} delta={groupStats.activeProductionsDelta} icon={Clapperboard} />
        <StatCard label="Monthly Revenue" value={fmtBDT(groupStats.monthlyRevenueBDT)} delta={groupStats.monthlyRevenueDelta} icon={TrendingUp} />
        <StatCard label="Tickets Sold" value={groupStats.ticketsSold.toLocaleString()} delta={groupStats.ticketsSoldDelta} icon={Ticket} />
        <StatCard label="Funds Raised" value={fmtBDT(groupStats.fundsRaisedBDT)} delta={groupStats.fundsRaisedDelta} icon={HandCoins} />
        <StatCard label="Followers" value={groupStats.communityFollowers.toLocaleString()} delta={groupStats.communityFollowersDelta} icon={Heart} />
      </div>

      {/* Upcoming productions + Funding overview */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel
          title="Upcoming Productions"
          description="Next on your stage"
          className="lg:col-span-3"
          action={<Button asChild variant="ghost" size="sm" className="text-xs"><Link to="/dashboard/group/productions">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>}
        >
          <ul className="grid gap-3 sm:grid-cols-3">
            {upcoming.map((p) => (
              <li key={p.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-background transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div
                  className="relative h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url(${p.poster})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                    <span className="text-xs font-medium text-white line-clamp-2">{p.title}</span>
                    <StatusPill status={p.status} />
                  </div>
                </div>
                <div className="p-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {new Date(p.opensOn).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}</div>
                  <div className="mt-1 truncate">{p.venue}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title="Funding Overview"
          description="Active campaigns"
          className="lg:col-span-2"
          action={<Button asChild variant="ghost" size="sm" className="text-xs"><Link to="/dashboard/group/funding">All <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>}
        >
          <ul className="space-y-4">
            {fundingActive.map((c) => {
              const pct = Math.round((c.raisedBDT / c.goalBDT) * 100);
              return (
                <li key={c.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="truncate font-medium text-foreground">{c.title}</span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-1.5 h-2" />
                  <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                    <span>{fmtBDT(c.raisedBDT)} raised</span>
                    <span>Goal {fmtBDT(c.goalBDT)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>

      {/* Quick actions */}
      <Panel title="Quick Actions" description="Jump to the most common studio flows">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Create Production", to: "/dashboard/group/productions", icon: Clapperboard },
            { label: "Launch Campaign", to: "/dashboard/group/funding", icon: HandCoins },
            { label: "Post Opportunity", to: "/dashboard/group/opportunities", icon: Radio },
            { label: "Schedule Meetup", to: "/dashboard/group/community", icon: Heart },
          ].map((qa) => (
            <Link
              key={qa.label}
              to={qa.to}
              className="group flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4 transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:bg-background"
            >
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                  <qa.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-medium text-foreground">{qa.label}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </Panel>

      {/* Notifications + rehearsals + applications */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Recent Notifications" description="Studio activity feed">
          <ul className="divide-y divide-border/60">
            {notifications.map((n) => {
              const tone =
                n.tone === "success" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : n.tone === "warn" ? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
                : "bg-sky-500/10 text-sky-700 dark:text-sky-400";
              return (
                <li key={n.id} className="flex items-start gap-3 py-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone}`}>
                    <Bell className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground">{n.time}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Upcoming Rehearsals" description="Next 72 hours">
          <ul className="space-y-3">
            {rehearsals.map((r) => (
              <li key={r.id} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{r.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{r.venue} · Lead {r.lead}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-brand/10 px-2 py-0.5 text-[11px] font-medium text-brand">{r.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Recent Applications" description="Auditions & hiring">
          <ul className="space-y-3">
            {recentApplications.map((a) => (
              <li key={a.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand/10 text-xs font-semibold text-brand">
                  {a.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{a.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{a.role} · {a.opp}</p>
                </div>
                <span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </GroupLayout>
  );
}
