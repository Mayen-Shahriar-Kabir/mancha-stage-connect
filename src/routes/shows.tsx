import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/shows")({
  head: () => ({
    meta: [
      { title: "Shows — Mancha" },
      { name: "description", content: "Discover theatre productions across Bangladesh on Mancha." },
      { property: "og:title", content: "Shows — Mancha" },
      { property: "og:description", content: "Browse upcoming productions and book seats." },
    ],
  }),
  component: ShowsPage,
});

function ShowsPage() {
  return (
    <PublicLayout>
      <PageHero eyebrow="Now on Stage" title="Shows" description="The country's productions, all in one place. Discovery, booking and reviews are on their way." />
      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft hover-lift">
              <Skeleton className="aspect-[4/5] w-full rounded-none shimmer" />
              <div className="space-y-3 p-5">
                <Badge variant="secondary" className="rounded-full bg-gold/15 text-gold-foreground">Coming soon</Badge>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-14 text-center text-sm text-muted-foreground">
          Show listings arrive with the next act. Watch this space.
        </p>
      </section>
    </PublicLayout>
  );
}
