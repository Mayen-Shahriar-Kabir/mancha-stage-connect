import { createFileRoute } from "@tanstack/react-router";
import {
  UserSquare2, Users, FileText, GraduationCap, Award, Bell,
  Plus, ArrowRight, Sparkles, Clapperboard, Briefcase,
} from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { StatCard, Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  artistProfile, currentGroup, applications, training,
  certificates, notifications, artistProductions,
} from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/")({
  head: () => ({ meta: [{ title: "Artist Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ArtistHome,
});

function ArtistHome() {
  const upcoming = artistProductions.filter((p) => p.status !== "closed").slice(0, 3);
  const recentApps = applications.slice(0, 4);

  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      searchPlaceholder="Search groups, auditions, workshops…"
      eyebrow="Artist Studio"
      title={`Welcome back, ${artistProfile.name.split(" ")[0]}`}
      description="Your craft, your community, your calendar — all in one stage."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Update portfolio
        </Button>
      }
    >
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-brand/8 via-background to-accent/10 p-6 md:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-accent/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="h-3.5 w-3.5" /> Currently with {currentGroup.name}
            </div>
            <h2 className="font-display mt-3 text-2xl leading-snug text-foreground md:text-3xl">
              Two shortlists this week and one show opening Friday.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your portfolio is {artistProfile.completion}% complete — a few tweaks unlock casting director visibility.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">Rehearsal calendar</Button>
            <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
              Browse auditions <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Profile Completion" value={`${artistProfile.completion}%`} icon={UserSquare2} hint="Add showreel to reach 95%" />
        <StatCard label="Applications" value={String(applications.length)} icon={FileText} delta={12.5} />
        <StatCard label="Certificates" value={String(certificates.length)} icon={Award} hint="1 issued this month" />
        <StatCard label="Notifications" value={String(notifications.length)} icon={Bell} hint="2 new invitations" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel
          title="Upcoming Productions"
          description="Shows you're rehearsing or booked for"
          className="lg:col-span-2"
          action={<Button variant="ghost" size="sm" className="rounded-full text-brand">View all</Button>}
        >
          <ul className="divide-y divide-border/60">
            {upcoming.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <img src={p.poster} alt="" className="h-14 w-10 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground">{p.title}</div>
                  <div className="text-xs text-muted-foreground">{p.role} · {p.group} · {p.year}</div>
                </div>
                <StatusPill status={p.status} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Current Group" description="Ensemble & residency">
          <div className="overflow-hidden rounded-xl border border-border/60">
            <img src={currentGroup.cover} alt="" className="h-28 w-full object-cover" />
            <div className="p-4">
              <div className="font-display text-lg text-foreground">{currentGroup.name}</div>
              <div className="text-xs text-muted-foreground">
                {currentGroup.role} · with the ensemble since {currentGroup.since}
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full">Visit</Button>
                <Button variant="ghost" size="sm" className="rounded-full text-muted-foreground">Message</Button>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Recent Applications" className="lg:col-span-2">
          <ul className="divide-y divide-border/60">
            {recentApps.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <div className="font-medium text-foreground">{a.role}</div>
                  <div className="text-xs text-muted-foreground">{a.organization} · {a.date}</div>
                </div>
                <StatusPill status={a.status === "shortlisted" ? "review" : a.status === "accepted" ? "approved" : a.status === "rejected" ? "rejected" : "pending"} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Training Progress">
          <div className="space-y-4">
            {training.map((t) => (
              <div key={t.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium text-foreground">{t.title}</span>
                  <span className="text-xs text-muted-foreground">{t.progress}%</span>
                </div>
                <Progress value={t.progress} className="mt-1.5 h-1.5" />
                <div className="mt-1 text-[11px] text-muted-foreground">{t.provider} · {t.hours}h</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Quick actions */}
      <Panel title="Quick Actions">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: UserSquare2, label: "Update Portfolio" },
            { icon: Users, label: "Apply to Theatre Group" },
            { icon: Briefcase, label: "Browse Opportunities" },
            { icon: Award, label: "View Certificates" },
          ].map((q) => (
            <button
              key={q.label}
              className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/8 text-brand group-hover:bg-brand/12">
                <q.icon className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">{q.label}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-brand" />
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Notifications">
        <ul className="divide-y divide-border/60">
          {notifications.map((n) => (
            <li key={n.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <span className={`h-2 w-2 rounded-full ${n.tone === "success" ? "bg-emerald-500" : n.tone === "warn" ? "bg-amber-500" : "bg-brand"}`} />
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
