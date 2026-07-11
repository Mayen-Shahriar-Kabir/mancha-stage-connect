import { createFileRoute } from "@tanstack/react-router";
import { Star, Flag, Trash2, Check } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { recentReviews } from "@/data/admin/placeholder";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/admin/reviews")({
  head: () => ({ meta: [{ title: "Reviews · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ReviewsPage,
});

function ReviewsPage() {
  const flagged = recentReviews.filter((r) => r.flagged).length;
  const avg = (recentReviews.reduce((s, r) => s + r.rating, 0) / recentReviews.length).toFixed(1);

  return (
    <AdminLayout
      eyebrow="Community Voice"
      title="Reviews"
      description="Moderate audience reviews and celebrate outstanding productions."
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total reviews" value="4,218" delta={7.9} icon={Star} />
        <StatCard label="Avg. rating" value={`${avg} ★`} delta={0.3} />
        <StatCard label="Flagged" value={flagged.toString()} delta={-14.2} icon={Flag} hint="Needs moderation" />
        <StatCard label="Response rate" value="92%" delta={4.1} />
      </div>

      <Panel title="Latest reviews" description="Newest first · placeholder feed">
        <ul className="space-y-3">
          {recentReviews.map((r) => (
            <li
              key={r.id}
              className={cn(
                "rounded-2xl border p-4 transition-colors",
                r.flagged
                  ? "border-rose-500/30 bg-rose-500/5"
                  : "border-border/60 bg-card hover:bg-muted/30",
              )}
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-brand/10 text-brand">
                    {r.author.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.author}</span>
                    <span className="text-xs text-muted-foreground">on</span>
                    <span className="text-sm font-medium text-brand">{r.target}</span>
                    <span className="ml-auto flex items-center gap-0.5 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn("h-3.5 w-3.5", i < r.rating ? "fill-current" : "opacity-30")}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground">{r.excerpt}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                    </span>
                    {r.flagged && (
                      <Badge className="rounded-full bg-rose-500/15 text-rose-700 dark:text-rose-400">
                        <Flag className="mr-1 h-3 w-3" /> Flagged
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {r.flagged && (
                <div className="mt-3 flex gap-1.5">
                  <Button size="sm" variant="outline" className="h-8 rounded-full">
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 rounded-full text-rose-600 hover:text-rose-700">
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </AdminLayout>
  );
}
