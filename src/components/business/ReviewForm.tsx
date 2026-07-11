import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { upsertReview, listReviews, type Review } from "@/lib/business";
import { useAuth } from "@/hooks/use-auth";

export function ReviewSection({
  targetType, targetId,
}: {
  targetType: "production" | "group" | "training";
  targetId: string;
}) {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [busy, setBusy] = useState(false);

  const load = async () => setReviews(await listReviews(targetType, targetId));
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [targetType, targetId]);

  const submit = async () => {
    if (!user) { toast.error("Sign in to review"); return; }
    if (!comment.trim()) { toast.error("Add a short comment"); return; }
    setBusy(true);
    try {
      await upsertReview(targetType, targetId, user.id, rating, comment);
      toast.success("Review saved"); setComment(""); await load();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section className="space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl text-foreground">Reviews</h3>
          <p className="text-xs text-muted-foreground">
            {reviews.length ? `${avg.toFixed(1)} ★ · ${reviews.length} review${reviews.length > 1 ? "s" : ""}` : "Be the first to review"}
          </p>
        </div>
      </header>

      {user && (
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)}>
                <Star className={`h-6 w-6 ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
              </button>
            ))}
          </div>
          <Textarea className="mt-3" rows={3} placeholder="Share your experience…" value={comment} onChange={(e) => setComment(e.target.value)} />
          <div className="mt-3 flex justify-end">
            <Button onClick={submit} disabled={busy} className="bg-brand text-brand-foreground hover:bg-brand/90">
              {busy ? "Saving…" : "Post review"}
            </Button>
          </div>
        </div>
      )}

      <ul className="space-y-3">
        {reviews.map((r) => (
          <li key={r.id} className="rounded-xl border border-border/60 bg-card p-4">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
              ))}
              <span className="ml-2 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</span>
            </div>
            <p className="mt-2 text-sm text-foreground">{r.comment}</p>
          </li>
        ))}
        {!reviews.length && <li className="rounded-xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">No reviews yet.</li>}
      </ul>
    </section>
  );
}
