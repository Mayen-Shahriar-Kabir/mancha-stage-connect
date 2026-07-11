import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { useAuth } from "@/hooks/use-auth";
import { listMyReviews, type Review } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/dashboard/audience/reviews")({
  head: () => ({ meta: [{ title: "My Reviews — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: MyReviewsPage,
});

function MyReviewsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    listMyReviews(user.id).then(setItems).finally(() => setLoading(false));
  }, [user?.id]);

  const avg = items.length ? (items.reduce((s, r) => s + r.rating, 0) / items.length).toFixed(1) : "—";

  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Voice"
      title="My reviews"
      description={items.length ? `Average ${avg} ★ · ${items.length} review${items.length === 1 ? "" : "s"}` : "You haven't reviewed anything yet."}
    >
      {loading ? (
        <div className="space-y-3">{[0,1].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl border border-border/60 bg-muted/30" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 p-16 text-center">
          <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />
          <div className="font-display mt-3 text-xl text-foreground">Nothing yet</div>
          <p className="mt-2 text-sm text-muted-foreground">Reviews you post from a show or group page appear here.</p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((r) => (
            <li key={r.id} className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((n) => (
                    <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
                  ))}
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">{r.target_type}</span>
              </div>
              {r.comment && <p className="mt-2 text-sm text-foreground">{r.comment}</p>}
              <div className="mt-2 text-[11px] text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</div>
            </li>
          ))}
        </ul>
      )}
    </PortalLayout>
  );
}
