import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { findShow, SHOWS } from "@/data/explore";
import { ShowStatusBadge } from "@/components/explore/Badges";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatBDT, formatDateTime, formatDuration } from "@/lib/format";
import { ShowCard } from "@/components/explore/ShowCard";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Play,
  Radio,
  Star,
  Ticket,
  Users2,
} from "lucide-react";

export const Route = createFileRoute("/explore/shows/$slug")({
  loader: ({ params }) => {
    const show = findShow(params.slug);
    if (!show) throw notFound();
    return { show };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Show not found — Mancha" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.show;
    return {
      meta: [
        { title: `${s.title} — Mancha` },
        { name: "description", content: s.description },
        { property: "og:title", content: `${s.title} — Mancha` },
        { property: "og:description", content: s.description },
        { property: "og:image", content: s.banner },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: NotFound,
  errorComponent: ErrorView,
  component: ShowDetail,
});

function NotFound() {
  return (
    <PublicLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-4xl">This show has left the stage</h1>
        <p className="mt-3 text-muted-foreground">We couldn't find the production you were looking for.</p>
        <Button asChild className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Link to="/explore/shows">Back to Shows</Link>
        </Button>
      </div>
    </PublicLayout>
  );
}

function ErrorView({ reset }: { reset: () => void }) {
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
}

function ShowDetail() {
  const { show } = Route.useLoaderData() as { show: import("@/data/explore").Show };
  const [videoOpen, setVideoOpen] = useState(false);
  const related = SHOWS.filter((s) => s.slug !== show.slug && s.genre === show.genre).slice(0, 3);
  const recommended = SHOWS.filter((s) => s.slug !== show.slug).slice(0, 4);

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-charcoal text-ivory">
        <img src={show.banner} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/70 via-black/60 to-background" />

        <div className="container-page relative py-16 md:py-24">
          <Link
            to="/explore/shows"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-ivory/80 hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Shows
          </Link>

          <div className="grid gap-10 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
            <div className="mx-auto w-full max-w-xs md:mx-0">
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-elevated">
                <img src={show.poster} alt={`${show.title} poster`} className="w-full" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <ShowStatusBadge status={show.status} />
                <span className="rounded-full bg-gold/15 px-2.5 py-1 text-[10px] uppercase tracking-widest text-gold">
                  {show.genre}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-ivory/70">
                  <Star className="h-3 w-3 fill-gold text-gold" /> {show.rating.toFixed(1)}
                </span>
              </div>
              <h1 className="font-display text-4xl leading-[1.05] text-ivory md:text-6xl">{show.title}</h1>
              <p className="mt-3 text-sm text-ivory/70">
                A production by{" "}
                <Link
                  to="/explore/groups/$slug"
                  params={{ slug: show.groupSlug }}
                  className="story-link text-gold"
                >
                  {show.groupName}
                </Link>
              </p>

              <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory/85 md:text-lg">
                {show.description}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-4 text-sm text-ivory/85 sm:grid-cols-4">
                <Meta icon={Calendar} label="Opening" value={formatDateTime(show.date)} />
                <Meta icon={Clock} label="Runtime" value={formatDuration(show.durationMinutes)} />
                <Meta icon={MapPin} label="Venue" value={`${show.venue}, ${show.city}`} />
                <Meta icon={Ticket} label="From" value={formatBDT(show.price)} />
              </dl>

              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="rounded-full bg-gold text-gold-foreground shadow-gold hover:bg-gold/90"
                >
                  <Ticket className="mr-2 h-4 w-4" /> Book Tickets
                </Button>
                {show.status === "archived" && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setVideoOpen(true)}
                    className="rounded-full border-ivory/30 bg-white/5 text-ivory hover:bg-white/10 hover:text-ivory"
                  >
                    <Play className="mr-2 h-4 w-4" /> Watch Trailer
                  </Button>
                )}
                {show.status === "live" && (
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setVideoOpen(true)}
                    className="rounded-full border-destructive/40 bg-destructive/10 text-ivory hover:bg-destructive/20 hover:text-ivory"
                  >
                    <Radio className="mr-2 h-4 w-4" /> Watch Live
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="container-page grid gap-14 py-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-16">
          <Section title="Synopsis">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{show.synopsis}</p>
          </Section>

          <Section title="Cast">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {show.cast.map((c) => (
                <div key={c.name} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover-lift">
                  <img src={c.photo} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{c.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Director">
            <div className="flex items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-soft">
              <img src={show.director.photo} alt="" className="h-20 w-20 rounded-full object-cover" />
              <div>
                <p className="font-display text-xl">{show.director.name}</p>
                <p className="mt-2 text-sm text-muted-foreground">{show.director.bio}</p>
              </div>
            </div>
          </Section>

          <Section title="Gallery">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {show.gallery.map((src, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-2xl bg-muted ${i % 3 === 0 ? "row-span-2 aspect-[4/6]" : "aspect-square"}`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Reviews">
            <div className="space-y-3">
              {show.reviews.map((r) => (
                <article key={r.id} className="rounded-2xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{r.author}</p>
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

        <aside className="space-y-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg">Venue & Schedule</h3>
            <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
              {show.venue}, {show.city}
            </p>
            <ul className="mt-4 space-y-2 border-t border-border/60 pt-4 text-sm">
              {show.schedule.map((s, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span className="text-foreground">{formatDateTime(s.date)}</span>
                  <span className="text-xs text-muted-foreground">{s.city}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg">Ticket Pricing</h3>
            <ul className="mt-4 space-y-3">
              {show.pricing.map((p) => (
                <li key={p.tier} className="rounded-xl border border-border/60 bg-background p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{p.tier}</span>
                    <span className="font-display text-lg text-brand">{formatBDT(p.price)}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.perks}</p>
                </li>
              ))}
            </ul>
          </div>

          {related.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h3 className="font-display text-lg">Related productions</h3>
              <ul className="mt-4 space-y-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/explore/shows/$slug"
                      params={{ slug: r.slug }}
                      className="group flex items-center gap-3"
                    >
                      <img src={r.poster} alt="" className="h-14 w-11 rounded-md object-cover" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-brand">{r.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{r.groupName}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      {/* Recommended */}
      <section className="border-t border-border/60 bg-[oklch(0.96_0.012_70)]">
        <div className="container-page py-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand">You may also like</p>
              <h2 className="font-display mt-2 text-3xl">Recommended shows</h2>
            </div>
            <Link to="/explore/shows" className="story-link inline-flex items-center gap-1 text-sm text-brand">
              See all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((s, i) => (
              <ShowCard key={s.slug} show={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          <DialogHeader className="p-4">
            <DialogTitle className="font-display text-lg">
              {show.status === "live" ? "Watch Live" : "Trailer"} · {show.title}
            </DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full bg-black">
            <iframe
              className="h-full w-full"
              src={show.livestreamUrl ?? show.trailerUrl}
              title={show.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          </div>
        </DialogContent>
      </Dialog>
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

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-ivory/60">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-1 truncate text-sm text-ivory">{value}</p>
    </div>
  );
}
