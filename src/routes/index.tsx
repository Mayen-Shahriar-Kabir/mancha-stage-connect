import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Users2, Ticket, Building2, Film, GraduationCap } from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const PILLARS = [
  { icon: Users2, title: "Artists", copy: "Craft your portfolio, showcase your reels, be discovered by casting directors." },
  { icon: Building2, title: "Groups", copy: "Manage your troupe, productions, rehearsals and ticketing — all in one stage." },
  { icon: Ticket, title: "Audiences", copy: "Find the next unmissable show. Book seats. Follow the artists you love." },
  { icon: GraduationCap, title: "Universities", copy: "Bring theatre to campus with residencies, workshops and student productions." },
  { icon: Film, title: "Film & OTT", copy: "Discover verified talent for streaming series, features and commercial work." },
  { icon: Sparkles, title: "Tourism", copy: "Curate cultural experiences that celebrate Bangladesh's living stage." },
];

function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container-page relative py-24 md:py-36">
          <div className="mx-auto max-w-4xl text-center animate-slide-up">
            <Badge variant="outline" className="mb-6 rounded-full border-brand/30 bg-background/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-brand">
              Bangladesh's Digital Theatre Ecosystem
            </Badge>
            <h1 className="font-display text-5xl leading-[1.02] text-foreground md:text-7xl lg:text-8xl">
              Where every stage
              <br />
              finds its <span className="text-gradient-gold italic">audience.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Mancha connects theatre artists, groups, audiences, universities and the film industry
              on one modern, elegant platform — built for the golden age of Bangla theatre.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-brand text-brand-foreground shadow-gold hover:bg-brand/90">
                <Link to="/register">
                  Join the ecosystem <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-border">
                <Link to="/shows">Explore shows</Link>
              </Button>
            </div>
          </div>

          {/* Curtain accent */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-1 h-24 bg-gradient-to-b from-transparent to-background" />
        </div>
      </section>

      {/* Pillars */}
      <section className="container-page py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-brand">One stage. Many voices.</p>
          <h2 className="font-display mt-3 text-4xl text-foreground md:text-5xl">
            Built for the whole theatre world
          </h2>
          <p className="mt-4 text-muted-foreground">
            From solo performers to the country's biggest productions — Mancha gives every part of
            the ecosystem a home.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => (
            <article
              key={p.title}
              className="hover-lift group rounded-2xl border border-border bg-card p-7 shadow-soft"
              style={{ animation: `slide-up 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 60}ms both` }}
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground">
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-5 text-xl text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="container-page pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-brand text-brand-foreground shadow-elevated">
          <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
          <div className="relative grid gap-8 p-10 md:grid-cols-[1.4fr_1fr] md:p-16">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-gold">Coming soon</p>
              <h2 className="font-display mt-3 text-3xl leading-tight md:text-5xl">
                A new curtain rises on Bangla theatre.
              </h2>
              <p className="mt-4 max-w-xl text-brand-foreground/80">
                We're building the tools artists deserve — profiles, discovery, ticketing, and
                collaboration. Reserve your name today.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 md:items-end">
              <Button asChild size="lg" className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90">
                <Link to="/register">Reserve your profile</Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="rounded-full text-brand-foreground hover:bg-white/10">
                <Link to="/about">Read our story <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
