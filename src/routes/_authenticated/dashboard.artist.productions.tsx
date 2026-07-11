import { PosterImg } from "@/components/business/PosterImg";
import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { artistProductions } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/productions")({
  head: () => ({ meta: [{ title: "Productions — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ProductionsPage,
});

function ProductionsPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Productions"
      title="Every stage you've walked"
      description="A curated timeline of the shows you've performed in — for casting and press."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {artistProductions.map((p) => (
          <div key={p.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="relative aspect-[3/4] overflow-hidden">
              <PosterImg src={p.poster} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute left-3 top-3">
                <StatusPill status={p.status} />
              </div>
            </div>
            <div className="p-4">
              <div className="font-display text-lg text-foreground">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.group} · {p.year}</div>
              <div className="mt-2 text-sm text-foreground">Role: <span className="font-medium">{p.role}</span></div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full flex-1">View</Button>
                <Button size="sm" variant="ghost" className="rounded-full">Share</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
