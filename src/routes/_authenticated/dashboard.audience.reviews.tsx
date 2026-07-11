import { createFileRoute } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { tickets } from "@/data/portal/audience";

export const Route = createFileRoute("/_authenticated/dashboard/audience/reviews")({
  head: () => ({ meta: [{ title: "Reviews — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ReviewsPage,
});

const REVIEWS = [
  { id: "rv1", show: "Meghdoot", rating: 5, text: "Aranyak's staging was breathtaking. The Yaksha's monologue held the room silent." },
  { id: "rv2", show: "Chairs", rating: 4, text: "A brave choice of text — the leads landed the absurdity with heart." },
];

function ReviewsPage() {
  const toReview = tickets.filter((t) => t.status === "past").slice(0, 3);
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Reviews"
      title="What did you think?"
    >
      <Panel title="Shows to review">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {toReview.map((t) => (
            <div key={t.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
              <img src={t.poster} alt="" className="h-14 w-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-foreground">{t.show}</div>
                <div className="text-xs text-muted-foreground">{t.date}</div>
              </div>
              <Button size="sm" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Write</Button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Your published reviews">
        <ul className="space-y-4">
          {REVIEWS.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg text-foreground">{r.show}</div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{r.text}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </PortalLayout>
  );
}
