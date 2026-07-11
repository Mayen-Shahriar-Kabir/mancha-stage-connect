import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { findGroup, findShow, SHOWS } from "@/data/explore";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Award,
  Calendar,
  GraduationCap,
  HandHeart,
  Heart,
  MapPin,
  Star,
  Users2,
} from "lucide-react";
import { ShowCard } from "@/components/explore/ShowCard";

export const Route = createFileRoute("/explore/groups/$slug")({
  loader: ({ params }) => {
    const group = findGroup(params.slug);
    if (!group) throw notFound();
    return { group };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Group not found — Mancha" }, { name: "robots", content: "noindex" }] };
    }
    const g = loaderData.group;
    return {
      meta: [
        { title: `${g.name} — Mancha` },
        { name: "description", content: g.description },
        { property: "og:title", content: `${g.name} — Mancha` },
        { property: "og:description", content: g.description },
        { property: "og:image", content: g.cover },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <PublicLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-4xl">Group not found</h1>
        <Button asChild className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Link to="/explore/groups">Back to Groups</Link>
        </Button>
      </div>
    </PublicLayout>
  ),
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <PublicLayout>
        <div className="container-page py-24 text-center">
          <h1 className="font-display text-3xl">Something went wrong</h1>
          <Button
            className="mt-6 rounded-full"
            onClick={() => {
              reset();
              router.invalidate();
            }}
          >
            Try again
          </Button>
        </div>
      </PublicLayout>
    );
  },
  component: GroupDetail,
});

function GroupDetail() {
  const { group } = Route.useLoaderData();
  const upcoming = group.upcomingShows.map(findShow).filter(Boolean).slice(0, 3);
  const past = group.pastShows.map(findShow).filter(Boolean).slice(0, 3);
  const fallbackUpcoming = SHOWS.filter((s) => s.groupSlug === group.slug && s.status !== "archived").slice(0, 3);
  const fallbackPast = SHOWS.filter((s) => s.groupSlug === group.slug && s.status === "archived").slice(0, 3);
  const upcomingShows = upcoming.length ? upcoming : fallbackUpcoming;
  const pastShows = past.length ? past : fallbackPast;

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <img src={group.cover} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-background" />

        <div className="container-page relative py-16 md:py-24">
          <Link to="/explore/groups" className="mb-8 inline-flex items-center gap-1.5 text-sm text-ivory/80 hover:text-gold">
            <ArrowLeft className="h-4 w-4" /> Back to Groups
          </Link>

          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <span
              aria-hidden
              className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-brand text-brand-foreground shadow-gold md:h-24 md:w-24"
            >
              <span className="font-display text-2xl md:text-3xl">{group.logoInitials}</span>
            </span>
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-3 text-sm text-ivory/70">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {group.city}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Est. {group.foundedYear}
                </span>
                <span className="inline-flex items-center gap-1 text-gold">
                  <Star className="h-3.5 w-3.5 fill-current" /> {group.rating.toFixed(1)}
                </span>
              </p>
              <h1 className="font-display text-4xl leading-[1.05] text-ivory md:text-6xl">{group.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ivory/85 md:text-lg">
                {group.description}
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Years" value={group.yearsActive} />
                <Stat label="Members" value={group.memberCount} />
                <Stat label="Shows" value={group.showsPerformed} />
                <Stat label="Followers" value={group.followers.toLocaleString("en-US")} />
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="rounded-full bg-gold text-gold-foreground shadow-gold hover:bg-gold/90">
                  <Heart className="mr-2 h-4 w-4" /> Follow
                </Button>
                <Button variant="outline" className="rounded-full border-ivory/30 bg-white/5 text-ivory hover:bg-white/10 hover:text-ivory">
                  Share Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-14">
          <Section title="History">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{group.history}</p>
          </Section>
          <Section title="Mission">
            <blockquote className="rounded-2xl border-l-4 border-brand bg-card p-6 text-lg italic text-foreground shadow-soft">
              “{group.mission}”
            </blockquote>
          </Section>

          <Section title="Current Members">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {group.members.map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover-lift">
                  <img src={m.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{m.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Featured Productions">
            <ul className="grid gap-3 md:grid-cols-2">
              {group.featuredProductions.map((p) => (
                <li key={p.title} className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 hover-lift">
                  <span className="font-medium">{p.title}</span>
                  <span className="text-xs text-muted-foreground">{p.year}</span>
                </li>
              ))}
            </ul>
          </Section>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-display mb-3 text-xl">Training Programs</h3>
              <ul className="space-y-3">
                {group.trainingPrograms.map((t) => (
                  <li key={t.title} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <GraduationCap className="mt-0.5 h-4 w-4 text-brand" />
                      <div>
                        <p className="font-medium">{t.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display mb-3 text-xl">Community Activities</h3>
              <ul className="space-y-3">
                {group.communityActivities.map((c) => (
                  <li key={c.title} className="rounded-2xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <HandHeart className="mt-0.5 h-4 w-4 text-brand" />
                      <div>
                        <p className="font-medium">{c.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Section title="Achievements">
            <ul className="space-y-3">
              {group.achievements.map((a) => (
                <li key={a.title} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gold/15 text-gold">
                    <Award className="h-4 w-4" />
                  </span>
                  <p className="flex-1 font-medium">{a.title}</p>
                  <span className="text-xs text-muted-foreground">{a.year}</span>
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Gallery">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {group.gallery.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Videos">
            <div className="grid gap-4 md:grid-cols-2">
              {group.videos.map((v) => (
                <div key={v.title} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="aspect-video bg-black">
                    <iframe className="h-full w-full" src={v.url} title={v.title} allowFullScreen />
                  </div>
                  <p className="p-3 text-sm font-medium">{v.title}</p>
                </div>
              ))}
            </div>
          </Section>

          {upcomingShows.length > 0 && (
            <Section title="Upcoming Shows">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingShows.map((s, i) => s && <ShowCard key={s.slug} show={s} index={i} />)}
              </div>
            </Section>
          )}
          {pastShows.length > 0 && (
            <Section title="Past Shows">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pastShows.map((s, i) => s && <ShowCard key={s.slug} show={s} index={i} />)}
              </div>
            </Section>
          )}

          <Section title="Reviews">
            <div className="space-y-3">
              {group.reviews.map((r) => (
                <article key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{r.author}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-gold">
                      <Star className="h-3.5 w-3.5 fill-current" /> {r.rating.toFixed(1)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
                </article>
              ))}
            </div>
          </Section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg">Sponsors</h3>
            <ul className="mt-4 space-y-2">
              {group.sponsors.map((s) => (
                <li key={s} className="rounded-xl border border-border/60 bg-background px-4 py-3 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg">At a glance</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex justify-between"><span>Founded</span><span className="text-foreground">{group.foundedYear}</span></li>
              <li className="flex justify-between"><span>City</span><span className="text-foreground">{group.city}</span></li>
              <li className="flex justify-between"><span>Members</span><span className="text-foreground">{group.memberCount}</span></li>
              <li className="flex justify-between"><span>Shows</span><span className="text-foreground">{group.showsPerformed}</span></li>
            </ul>
          </div>
        </aside>
      </div>
    </PublicLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display mb-5 flex items-center gap-3 text-2xl">
        <span className="h-px flex-1 bg-border" aria-hidden />
        <span>{title}</span>
        <span className="h-px flex-1 bg-border" aria-hidden />
      </h2>
      {children}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur">
      <p className="text-[10px] uppercase tracking-widest text-ivory/60">{label}</p>
      <p className="font-display mt-1 text-xl text-ivory">{value}</p>
    </div>
  );
}
