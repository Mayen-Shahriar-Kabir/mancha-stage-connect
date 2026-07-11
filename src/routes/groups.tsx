import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { PageHero } from "@/components/layout/PageHero";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/groups")({
  head: () => ({
    meta: [
      { title: "Groups — Mancha" },
      { name: "description", content: "Theatre groups and troupes across Bangladesh." },
      { property: "og:title", content: "Groups — Mancha" },
      { property: "og:description", content: "Meet the country's theatre groups and their productions." },
    ],
  }),
  component: GroupsPage,
});

function GroupsPage() {
  return (
    <PublicLayout>
      <PageHero eyebrow="Troupes & Companies" title="Groups" description="From heritage repertories to bold new collectives — Bangladesh's theatre groups, on one stage." />
      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <article key={i} className="rounded-2xl border border-border bg-card p-6 shadow-soft hover-lift">
              <div className="flex items-center gap-4">
                <Skeleton className="h-14 w-14 rounded-full shimmer" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="mt-5 h-16 w-full" />
            </article>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
