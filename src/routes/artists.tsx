import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/artists")({
  head: () => ({
    meta: [
      { title: "Artists — Mancha" },
      { name: "description", content: "Discover verified theatre artists across Bangladesh." },
      { property: "og:title", content: "Artists — Mancha" },
      { property: "og:description", content: "Portfolios, reels and profiles from the country's stage talent." },
    ],
  }),
  component: ArtistsPage,
});

function ArtistsPage() {
  return (
    <PublicLayout>
      <PageHero eyebrow="The Ensemble" title="Artists" description="Portfolios, reels and profiles from the makers behind the country's stage." />
      <section className="container-page py-16">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <article key={i} className="rounded-2xl border border-border bg-card p-5 text-center shadow-soft hover-lift">
              <Skeleton className="mx-auto aspect-square w-full rounded-full shimmer" />
              <div className="mt-4 space-y-2">
                <Skeleton className="mx-auto h-4 w-2/3" />
                <Skeleton className="mx-auto h-3 w-1/2" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
