import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { findArtist, ARTISTS } from "@/data/explore";
import { AvailabilityBadge } from "@/components/explore/Badges";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Award,
  ArrowLeft,
  BadgeCheck,
  Briefcase,
  ExternalLink,
  Mail,
  Star,
} from "lucide-react";
import { ArtistCard } from "@/components/explore/ArtistCard";

export const Route = createFileRoute("/explore/artists/$slug")({
  loader: ({ params }) => {
    const artist = findArtist(params.slug);
    if (!artist) throw notFound();
    return { artist };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Artist not found — Mancha" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.artist;
    return {
      meta: [
        { title: `${a.name} — Mancha` },
        { name: "description", content: `${a.specialization} · ${a.yearsExperience} years on the Bangla stage.` },
        { property: "og:title", content: `${a.name} — Mancha` },
        { property: "og:description", content: a.bio.slice(0, 155) },
        { property: "og:image", content: a.cover },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <PublicLayout>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-4xl">Artist not found</h1>
        <Button asChild className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Link to="/explore/artists">Back to Artists</Link>
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
  component: ArtistDetail,
});

function ArtistDetail() {
  const { artist } = Route.useLoaderData() as { artist: import("@/data/explore").Artist };
  const related = ARTISTS.filter(
    (a) => a.slug !== artist.slug && a.specialization === artist.specialization,
  ).slice(0, 4);

  return (
    <PublicLayout>
      {/* Cover */}
      <section className="relative">
        <div className="relative h-64 w-full overflow-hidden md:h-80">
          <img src={artist.cover} alt="" className="h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        <div className="container-page">
          <Link
            to="/explore/artists"
            className="absolute left-8 top-8 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-ivory backdrop-blur hover:bg-black/60"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Artists
          </Link>

          <div className="-mt-24 grid gap-6 pb-8 md:grid-cols-[220px_1fr] md:items-end">
            <div className="mx-auto md:mx-0">
              <img
                src={artist.photo}
                alt={artist.name}
                className="h-40 w-40 rounded-full border-4 border-background object-cover shadow-elevated md:h-52 md:w-52"
              />
            </div>
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <AvailabilityBadge availability={artist.availability} />
                <span className="inline-flex items-center gap-1 rounded-full bg-brand/10 px-2.5 py-1 text-[10px] uppercase tracking-widest text-brand">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-gold text-gold" /> {artist.rating.toFixed(1)}
                </span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl">{artist.name}</h1>
              <p className="mt-1 text-sm italic text-muted-foreground">“{artist.stageName}”</p>
              <p className="mt-3 text-brand">
                {artist.specialization} · {artist.yearsExperience} years
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Currently with{" "}
                <Link
                  to="/explore/groups/$slug"
                  params={{ slug: artist.currentGroupSlug }}
                  className="story-link text-foreground"
                >
                  {artist.currentGroupName}
                </Link>
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  onClick={() =>
                    toast.success("Contact request sent", {
                      description: `We'll notify ${artist.name.split(" ")[0]} on your behalf.`,
                    })
                  }
                  className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
                >
                  <Mail className="mr-2 h-4 w-4" /> Contact {artist.name.split(" ")[0]}
                </Button>
                {artist.socials.map((s) => (
                  <Button asChild key={s.label} variant="outline" size="sm" className="rounded-full">
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.label} <ExternalLink className="ml-1.5 h-3 w-3" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container-page grid gap-14 py-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-14">
          <Section title="Biography">
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{artist.bio}</p>
          </Section>

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {artist.skills.map((s) => (
                <span key={s} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm">
                  {s}
                </span>
              ))}
            </div>
          </Section>

          <Section title="Awards & Certificates">
            <div className="grid gap-4 md:grid-cols-2">
              {artist.awards.map((a) => (
                <div key={a.title} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-gold">
                    <Award className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium">{a.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.org} · {a.year}
                    </p>
                  </div>
                </div>
              ))}
              {artist.certificates.map((c) => (
                <div key={c.title} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand/10 text-brand">
                    <BadgeCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.issuer} · {c.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Gallery">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {artist.gallery.map((src, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-2xl bg-muted">
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Videos">
            <div className="grid gap-4 md:grid-cols-2">
              {artist.videos.map((v) => (
                <div key={v.title} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="aspect-video bg-black">
                    <iframe className="h-full w-full" src={v.url} title={v.title} allowFullScreen />
                  </div>
                  <p className="p-3 text-sm font-medium">{v.title}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Reviews">
            <div className="space-y-3">
              {artist.reviews.map((r) => (
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
            <h3 className="font-display text-lg">Past Productions</h3>
            <ul className="mt-4 space-y-3">
              {artist.pastProductions.map((p) => (
                <li key={p.title} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-brand">
                    <Briefcase className="h-3.5 w-3.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.role} · {p.year}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h3 className="font-display text-lg">Current group</h3>
            <Link
              to="/explore/groups/$slug"
              params={{ slug: artist.currentGroupSlug }}
              className="mt-3 block rounded-xl border border-border/60 bg-background p-4 hover-lift"
            >
              <p className="font-medium">{artist.currentGroupName}</p>
              <p className="mt-1 text-xs text-muted-foreground">Visit troupe profile →</p>
            </Link>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-border/60 bg-[oklch(0.96_0.012_70)]">
          <div className="container-page py-16">
            <h2 className="font-display mb-8 text-3xl">Similar artists</h2>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {related.map((a, i) => (
                <ArtistCard key={a.slug} artist={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
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
