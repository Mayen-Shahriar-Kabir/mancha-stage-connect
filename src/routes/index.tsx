import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  MapPin,
  Calendar,
  Ticket,
  Users2,
  Star,
  Briefcase,
  Mic2,
  GraduationCap,
  Coins,
  Building2,
  Landmark,
  Palmtree,
  Quote,
  Mail,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CountUp } from "@/components/home/CountUp";

import heroStage from "@/assets/hero-stage.jpg";
import show1 from "@/assets/show-1.jpg";
import show2 from "@/assets/show-2.jpg";
import show3 from "@/assets/show-3.jpg";
import show4 from "@/assets/show-4.jpg";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

/* ————————————————— Data ————————————————— */

const SHOWS = [
  {
    poster: show1,
    title: "Raktakarabi",
    genre: "Drama · Tagore",
    date: "Fri, 24 Jul · 7:30 PM",
    location: "Shilpakala Academy, Dhaka",
    price: "৳ 500",
    status: "On Sale",
    tone: "brand",
  },
  {
    poster: show2,
    title: "Behula's Lantern",
    genre: "Folk · Musical",
    date: "Sat, 08 Aug · 6:00 PM",
    location: "Chittagong Theatre Institute",
    price: "৳ 350",
    status: "Few Left",
    tone: "gold",
  },
  {
    poster: show3,
    title: "The Golden Mask",
    genre: "Contemporary",
    date: "Sun, 16 Aug · 8:00 PM",
    location: "Mahila Samity Mancha",
    price: "৳ 800",
    status: "Premiere",
    tone: "brand",
  },
  {
    poster: show4,
    title: "Ekattor",
    genre: "Historical Epic",
    date: "Sat, 29 Aug · 7:00 PM",
    location: "National Theatre Hall",
    price: "৳ 600",
    status: "Sold Out",
    tone: "muted",
  },
] as const;

const GROUPS = [
  {
    name: "Prachyanat",
    initials: "PN",
    desc: "Pioneering physical theatre and folk fusion since 1997.",
    location: "Dhaka",
    members: 42,
    shows: 128,
  },
  {
    name: "Theatre Art Unit",
    initials: "TAU",
    desc: "Bold contemporary works exploring urban Bangladeshi life.",
    location: "Dhaka",
    members: 28,
    shows: 74,
  },
  {
    name: "Bot-tala",
    initials: "BT",
    desc: "Experimental storytelling rooted in Bengali literary tradition.",
    location: "Dhaka",
    members: 35,
    shows: 91,
  },
  {
    name: "Arshinagar Repertory",
    initials: "AR",
    desc: "Community-driven productions from Chittagong's coastal voices.",
    location: "Chattogram",
    members: 24,
    shows: 52,
  },
  {
    name: "Loko Natya Dal",
    initials: "LN",
    desc: "Reviving Jatra and rural performance forms for new audiences.",
    location: "Sylhet",
    members: 31,
    shows: 66,
  },
  {
    name: "Nagorik Natya Sampradaya",
    initials: "NNS",
    desc: "One of Bangladesh's oldest and most decorated troupes.",
    location: "Dhaka",
    members: 56,
    shows: 210,
  },
] as const;

const ARTISTS = [
  { name: "Anisul Haque", photo: artist1, spec: "Method Actor · Director", exp: "18 years", group: "Prachyanat" },
  { name: "Meherun Nisa", photo: artist2, spec: "Lead Actress · Vocalist", exp: "12 years", group: "Bot-tala" },
  { name: "Rafid Rahman", photo: artist3, spec: "Playwright · Director", exp: "6 years", group: "Theatre Art Unit" },
  { name: "Sultana Begum", photo: artist4, spec: "Veteran Actress · Mentor", exp: "34 years", group: "Nagorik Natya" },
] as const;

const OPPORTUNITIES = [
  { icon: Briefcase, title: "Jobs", copy: "Full-time roles across production, design, and management." },
  { icon: Mic2, title: "Auditions", copy: "Open calls from leading troupes and film houses." },
  { icon: GraduationCap, title: "Internships", copy: "Learn on real productions with mentorship." },
  { icon: Coins, title: "Funding", copy: "Grants and micro-funding for independent works." },
  { icon: Building2, title: "Corporate Partnerships", copy: "CSR-driven sponsorship for cultural programs." },
  { icon: Landmark, title: "University Collaboration", copy: "Residencies, festivals and student productions." },
  { icon: Palmtree, title: "Tourism Collaboration", copy: "Cultural experiences that showcase Bangladesh." },
  { icon: Sparkles, title: "Residencies", copy: "Time, space and stipend to create new work." },
] as const;

const STATS = [
  { label: "Artists", to: 2450, suffix: "+" },
  { label: "Theatre Groups", to: 180, suffix: "+" },
  { label: "Shows Staged", to: 3200, suffix: "+" },
  { label: "Audience Reached", to: 480000, suffix: "+" },
  { label: "Training Hours", to: 12500, suffix: "+" },
  { label: "Funding Raised (BDT)", to: 42, suffix: "M+" },
] as const;

const TESTIMONIALS = [
  {
    quote:
      "Mancha is the stage behind the stage — the infrastructure Bangla theatre has waited a generation for.",
    name: "Ferdousi Majumdar",
    role: "Veteran Actress",
  },
  {
    quote:
      "In one season we found three collaborators, two venues and an audience we did not know we had.",
    name: "Tareque Mahmud",
    role: "Artistic Director, Prachyanat",
  },
  {
    quote:
      "For our university festival, Mancha turned six weeks of coordination into six days.",
    name: "Dr. Nazia Kabir",
    role: "Faculty of Fine Arts, DU",
  },
] as const;

const PARTNERS = [
  { label: "University of Dhaka", tag: "Universities" },
  { label: "Grameenphone", tag: "Corporate" },
  { label: "Chorki Originals", tag: "Film & OTT" },
  { label: "Bangladesh Parjatan", tag: "Tourism" },
  { label: "Shilpakala Academy", tag: "Government" },
  { label: "BRAC University", tag: "Universities" },
  { label: "City Bank", tag: "Corporate" },
  { label: "Hoichoi", tag: "Film & OTT" },
] as const;

/* ————————————————— Page ————————————————— */

function HomePage() {
  return (
    <PublicLayout>
      <Hero />
      <FeaturedShows />
      <FeaturedGroups />
      <FeaturedArtists />
      <OpportunityHub />
      <Impact />
      <Testimonials />
      <Partners />
      <Newsletter />
    </PublicLayout>
  );
}

/* ————————————————— Sections ————————————————— */

function Hero() {
  return (
    <section
      aria-label="Mancha — Bangladesh's digital theatre ecosystem"
      className="relative isolate overflow-hidden bg-charcoal text-ivory"
    >
      <img
        src={heroStage}
        alt=""
        width={1920}
        height={1280}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_20%,transparent_0%,oklch(0.14_0.01_30/0.55)_45%,oklch(0.1_0.01_30/0.92)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-background"
      />

      <div className="container-page relative flex min-h-[92vh] flex-col justify-center py-28 md:min-h-[100vh] md:py-40">
        <div className="max-w-3xl animate-slide-up">
          <Badge
            variant="outline"
            className="mb-6 rounded-full border-gold/40 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold backdrop-blur"
          >
            Bangladesh's Digital Theatre Ecosystem
          </Badge>
          <h1 className="font-display text-[2.75rem] leading-[1.02] text-ivory sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Where every stage
            <br />
            finds its <span className="text-gradient-gold italic">audience.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-ivory/75 md:text-lg">
            Connecting Bangladesh's theatre artists, audiences, organizations and opportunities
            through one digital ecosystem — built for the golden age of Bangla theatre.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-gold text-gold-foreground shadow-gold hover:bg-gold/90"
            >
              <Link to="/explore/shows">
                Explore Shows <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-ivory/30 bg-white/5 text-ivory backdrop-blur hover:bg-white/10 hover:text-ivory"
            >
              <Link to="/explore/artists">Discover Artists</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="rounded-full text-ivory/90 hover:bg-white/10 hover:text-ivory"
            >
              <Link to="/contact">
                Become a Partner <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <a
          href="#featured-shows"
          className="absolute inset-x-0 bottom-8 mx-auto flex w-fit flex-col items-center gap-2 text-ivory/70 transition-colors hover:text-gold"
          aria-label="Scroll to featured shows"
        >
          <span className="text-[10px] uppercase tracking-[0.28em]">Enter the stage</span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-ivory/30">
            <ChevronDown className="h-4 w-4 animate-scroll-hint" />
          </span>
        </a>
      </div>
    </section>
  );
}

function SectionHeader({
  eyebrow,
  title,
  desc,
  cta,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  cta?: { to: string; label: string };
}) {
  return (
    <div className="mb-12 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand">
          {eyebrow}
        </p>
        <h2 className="font-display mt-3 text-3xl leading-tight text-foreground md:text-5xl">
          {title}
        </h2>
        {desc && <p className="mt-4 text-muted-foreground md:text-lg">{desc}</p>}
      </div>
      {cta && (
        <Link
          to={cta.to}
          className="story-link inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-brand"
        >
          {cta.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function statusStyle(tone: "brand" | "gold" | "muted") {
  if (tone === "gold") return "bg-gold text-gold-foreground";
  if (tone === "muted") return "bg-charcoal/80 text-ivory";
  return "bg-brand text-brand-foreground";
}

function FeaturedShows() {
  return (
    <section id="featured-shows" className="container-page py-24 md:py-32">
      <SectionHeader
        eyebrow="Now on stage"
        title="Featured shows this season"
        desc="Handpicked productions from across the country — from folk revivals to bold new writing."
        cta={{ to: "/shows", label: "See all shows" }}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {SHOWS.map((s, i) => (
          <article
            key={s.title}
            className="hover-lift group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            style={{ animation: `slide-up 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
              <img
                src={s.poster}
                alt={`${s.title} poster`}
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
              <span
                className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${statusStyle(
                  s.tone,
                )}`}
              >
                {s.status}
              </span>
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent"
              />
            </div>

            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                <span>{s.genre}</span>
                <span className="font-medium text-brand">{s.price}</span>
              </div>
              <h3 className="font-display text-xl leading-tight text-foreground">{s.title}</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-brand/70" />
                  <span className="truncate">{s.date}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brand/70" />
                  <span className="truncate">{s.location}</span>
                </li>
              </ul>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="mt-2 rounded-full border-border hover:border-brand hover:bg-brand hover:text-brand-foreground"
              >
                <Link to="/explore/shows">
                  <Ticket className="mr-1 h-3.5 w-3.5" /> View Details
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FeaturedGroups() {
  return (
    <section className="border-y border-border/60 bg-[oklch(0.96_0.012_70)]">
      <div className="container-page py-24 md:py-32">
        <SectionHeader
          eyebrow="The troupes"
          title="Featured theatre groups"
          desc="From heritage institutions to bold new collectives shaping the next chapter of Bangla theatre."
          cta={{ to: "/groups", label: "Browse all groups" }}
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {GROUPS.map((g, i) => (
            <article
              key={g.name}
              className="hover-lift group flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft"
              style={{ animation: `fade-in 0.6s ease-out ${i * 60}ms both` }}
            >
              <div className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-gold"
                >
                  <span className="font-display text-lg">{g.initials}</span>
                </span>
                <div className="min-w-0">
                  <h3 className="font-display truncate text-xl text-foreground">{g.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {g.location}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{g.desc}</p>

              <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border/60 pt-5 text-sm">
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Members
                  </dt>
                  <dd className="font-display mt-0.5 text-lg text-foreground">{g.members}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Shows
                  </dt>
                  <dd className="font-display mt-0.5 text-lg text-foreground">{g.shows}</dd>
                </div>
              </dl>

              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-5 justify-start px-0 text-brand hover:bg-transparent hover:text-brand/80"
              >
                <Link to="/explore/groups">
                  Visit Profile <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedArtists() {
  return (
    <section className="container-page py-24 md:py-32">
      <SectionHeader
        eyebrow="The talent"
        title="Featured artists"
        desc="Verified performers, directors and playwrights building tomorrow's canon."
        cta={{ to: "/artists", label: "Discover all artists" }}
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ARTISTS.map((a, i) => (
          <article
            key={a.name}
            className="hover-lift group relative overflow-hidden rounded-2xl bg-charcoal text-ivory shadow-elevated"
            style={{ animation: `slide-up 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 80}ms both` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={a.photo}
                alt={`Portrait of ${a.name}`}
                loading="lazy"
                width={800}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent"
              />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{a.spec}</p>
                <h3 className="font-display mt-1.5 text-2xl leading-tight text-ivory">{a.name}</h3>
                <dl className="mt-3 flex items-center justify-between text-xs text-ivory/75">
                  <div>
                    <dt className="uppercase tracking-widest text-ivory/50">Experience</dt>
                    <dd className="mt-0.5">{a.exp}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="uppercase tracking-widest text-ivory/50">Currently</dt>
                    <dd className="mt-0.5">{a.group}</dd>
                  </div>
                </dl>
                <Button
                  asChild
                  size="sm"
                  className="mt-5 w-full rounded-full bg-ivory text-charcoal hover:bg-gold hover:text-gold-foreground"
                >
                  <Link to="/explore/artists">View Portfolio</Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function OpportunityHub() {
  return (
    <section className="border-y border-border/60 bg-[oklch(0.96_0.012_70)]">
      <div className="container-page py-24 md:py-32">
        <SectionHeader
          eyebrow="Opportunity hub"
          title="Where careers in theatre take root"
          desc="Jobs, auditions, funding and partnerships — all in one place, updated in real time."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OPPORTUNITIES.map((o, i) => (
            <article
              key={o.title}
              className="hover-lift group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft"
              style={{ animation: `fade-in 0.6s ease-out ${i * 50}ms both` }}
            >
              <span
                aria-hidden
                className="grid h-11 w-11 place-items-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand group-hover:text-brand-foreground"
              >
                <o.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display mt-5 text-lg text-foreground">{o.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{o.copy}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-medium text-brand opacity-0 transition-opacity group-hover:opacity-100">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section className="relative overflow-hidden bg-charcoal text-ivory">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 [background:radial-gradient(60%_60%_at_20%_20%,oklch(0.34_0.13_15/0.6),transparent_60%),radial-gradient(60%_60%_at_90%_80%,oklch(0.78_0.13_85/0.35),transparent_60%)]"
      />
      <div className="container-page relative py-24 md:py-32">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
            Community impact
          </p>
          <h2 className="font-display mt-3 text-3xl leading-tight text-ivory md:text-5xl">
            A movement, measured.
          </h2>
          <p className="mt-4 text-ivory/70 md:text-lg">
            One year in, Mancha is already shaping the scale and reach of Bangladeshi theatre.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-4xl leading-none text-gold md:text-5xl">
                <CountUp to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ivory/70">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="container-page py-24 md:py-32">
      <SectionHeader
        eyebrow="In their words"
        title="Voices from the ecosystem"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <figure
            key={t.name}
            className="hover-lift relative flex flex-col rounded-2xl border border-border bg-card p-8 shadow-soft"
            style={{ animation: `slide-up 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 100}ms both` }}
          >
            <Quote className="h-8 w-8 text-gold" aria-hidden />
            <blockquote className="mt-5 font-display text-lg leading-relaxed text-foreground">
              "{t.quote}"
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border/60 pt-5">
              <span
                aria-hidden
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-brand-foreground"
              >
                <Star className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{t.name}</p>
                <p className="truncate text-xs text-muted-foreground">{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function Partners() {
  const doubled = [...PARTNERS, ...PARTNERS];
  return (
    <section className="border-y border-border/60 bg-[oklch(0.96_0.012_70)]">
      <div className="container-page py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-brand">
            In partnership with
          </p>
          <h2 className="font-display mt-3 text-2xl text-foreground md:text-3xl">
            Universities, corporates, film, tourism &amp; government
          </h2>
        </div>

        <div className="mask-fade-x mt-12 overflow-hidden">
          <ul className="animate-marquee flex w-max items-stretch gap-4">
            {doubled.map((p, i) => (
              <li
                key={`${p.label}-${i}`}
                className="flex min-w-[220px] flex-col items-start gap-1 rounded-xl border border-border bg-card px-6 py-5 shadow-soft"
              >
                <span className="text-[9px] uppercase tracking-[0.24em] text-brand">{p.tag}</span>
                <span className="font-display text-base text-foreground">{p.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  return (
    <section className="container-page py-24 md:py-32">
      <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-brand text-brand-foreground shadow-elevated">
        <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div aria-hidden className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative grid gap-10 p-10 md:grid-cols-[1.3fr_1fr] md:items-center md:p-16">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-gold">
              The Curtain Call
            </p>
            <h2 className="font-display mt-3 text-3xl leading-tight md:text-5xl">
              A weekly letter from Bangladesh's theatre world.
            </h2>
            <p className="mt-4 max-w-lg text-brand-foreground/80">
              New shows, auditions, essays and opportunities — delivered every Friday. No spam,
              only stagecraft.
            </p>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full flex-col gap-3 sm:flex-row"
            aria-label="Subscribe to the Mancha newsletter"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand" aria-hidden />
              <Input
                id="newsletter-email"
                type="email"
                required
                placeholder="you@theatre.bd"
                className="h-12 rounded-full border-0 bg-ivory pl-10 pr-4 text-charcoal placeholder:text-charcoal/50 focus-visible:ring-gold"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="h-12 rounded-full bg-gold text-gold-foreground hover:bg-gold/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
