import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { HandCoins, Calendar, Sparkles } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ContributeDialog } from "@/components/business/ContributeDialog";
import { useAuth } from "@/hooks/use-auth";
import { listCampaigns, listMyContributions, fmtBDT, type Campaign, type Contribution } from "@/lib/business";

export const Route = createFileRoute("/_authenticated/dashboard/audience/funding")({
  head: () => ({ meta: [{ title: "Fund Campaigns — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: FundingBrowse,
});

function FundingBrowse() {
  const { user } = useAuth();
  const [items, setItems] = useState<Campaign[]>([]);
  const [mine, setMine] = useState<(Contribution & { campaign: Campaign | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<Campaign | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [cs, ms] = await Promise.all([
        listCampaigns(),
        user ? listMyContributions(user.id) : Promise.resolve([]),
      ]);
      setItems(cs.filter((c) => c.status === "active"));
      setMine(ms);
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const totalGiven = mine.reduce((s, c) => s + Number(c.amount), 0);

  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Patron"
      title="Fund the future of theatre"
      description="Back campaigns from Mancha's theatre groups. Every contribution appears here (simulated payment)."
    >
      <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-brand/8 via-background to-accent/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Your total support</div>
            <div className="font-display mt-1 text-3xl text-foreground">{fmtBDT(totalGiven)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Across {mine.length} contribution{mine.length === 1 ? "" : "s"}</div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1.5 text-xs font-semibold text-brand">
            <Sparkles className="h-3.5 w-3.5" /> {totalGiven >= 5000 ? "Gold patron" : totalGiven >= 1000 ? "Silver patron" : "Bronze patron"}
          </div>
        </div>
      </div>

      <section>
        <h3 className="font-display mb-4 text-xl text-foreground">Active campaigns</h3>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">{[0,1].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />)}</div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/60 p-16 text-center">
            <HandCoins className="mx-auto h-10 w-10 text-muted-foreground" />
            <div className="font-display mt-3 text-xl text-foreground">No active campaigns</div>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon — groups launch new campaigns often.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((c) => {
              const pct = Number(c.goal_amount) ? Math.round((Number(c.raised_amount) / Number(c.goal_amount)) * 100) : 0;
              return (
                <article key={c.id} className="overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-display text-lg text-foreground">{c.title}</div>
                      {c.purpose && <div className="mt-0.5 text-xs text-muted-foreground">{c.purpose}</div>}
                    </div>
                    {c.deadline && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />{new Date(c.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                      </span>
                    )}
                  </div>
                  {c.description && <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{fmtBDT(Number(c.raised_amount))} raised</span>
                      <span className="font-medium text-foreground">{Math.min(100, pct)}%</span>
                    </div>
                    <Progress value={Math.min(100, pct)} className="mt-1.5 h-2" />
                    <div className="mt-1 text-[11px] text-muted-foreground">Goal {fmtBDT(Number(c.goal_amount))}</div>
                  </div>
                  <Button className="mt-4 w-full rounded-full bg-brand text-brand-foreground hover:bg-brand/90" onClick={() => { setPicked(c); setOpen(true); }}>
                    Contribute
                  </Button>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {mine.length > 0 && (
        <section>
          <h3 className="font-display mb-4 text-xl text-foreground">Your contribution history</h3>
          <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
            {mine.map((m) => (
              <li key={m.id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{m.campaign?.title ?? "Campaign"}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</div>
                </div>
                <div className="font-display text-lg text-brand">{fmtBDT(Number(m.amount))}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <ContributeDialog open={open} onOpenChange={setOpen} campaign={picked} onDone={load} />
    </PortalLayout>
  );
}
