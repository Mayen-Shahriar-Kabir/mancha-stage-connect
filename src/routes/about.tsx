import { createFileRoute, Link } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mancha" },
      { name: "description", content: "The story behind Mancha, Bangladesh's digital theatre ecosystem." },
      { property: "og:title", content: "About — Mancha" },
      { property: "og:description", content: "Our mission: to give every stage its audience." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PublicLayout>
      <PageHero
        eyebrow="Our Story"
        title="A modern stage for a timeless art."
        description="Mancha exists to weave Bangladesh's theatre community into one connected, elegant, digital home — where artists, groups and audiences can find each other with ease."
      />
      <section className="container-page py-20">
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
          {[
            { h: "Our mission", p: "To make theatre in Bangladesh discoverable, sustainable, and celebrated — from Dhaka's proscenium halls to intimate campus black-boxes." },
            { h: "Our approach", p: "Cinematic design. Craftsmanship-first engineering. Tools shaped by working artists, not templates." },
            { h: "For artists", p: "A beautiful portfolio, verified profile, and access to the country's cultural network." },
            { h: "For audiences", p: "One place to discover what's on, book seats, and follow the makers you love." },
          ].map((b) => (
            <div key={b.h} className="rounded-2xl border border-border bg-card p-8 shadow-soft hover-lift">
              <h2 className="font-display text-2xl text-foreground">{b.h}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{b.p}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button asChild size="lg" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Link to="/contact">Get in touch</Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
