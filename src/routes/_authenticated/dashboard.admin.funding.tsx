import { createFileRoute } from "@tanstack/react-router";
import { Plus, HandCoins, Handshake, Target } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { fundingCampaigns } from "@/data/admin/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/admin/funding")({
  head: () => ({ meta: [{ title: "Funding · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: FundingPage,
});

const fmtBDT = (n: number) =>
  n >= 10_00_000 ? `৳${(n / 10_00_000).toFixed(2)} Cr` : n >= 1_00_000 ? `৳${(n / 1_00_000).toFixed(1)}L` : `৳${n.toLocaleString()}`;

function FundingPage() {
  const totalGoal = fundingCampaigns.reduce((s, c) => s + c.goalBDT, 0);
  const totalRaised = fundingCampaigns.reduce((s, c) => s + c.raisedBDT, 0);

  return (
    <AdminLayout
      eyebrow="Grants & Sponsorship"
      title="Funding"
      description="Campaigns, sponsors, and grant flow across the ecosystem."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> New campaign
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total raised" value={fmtBDT(totalRaised)} delta={18.2} icon={HandCoins} />
        <StatCard label="Total goal" value={fmtBDT(totalGoal)} icon={Target} />
        <StatCard label="Active campaigns" value={fundingCampaigns.filter((c) => c.status === "active").length.toString()} />
        <StatCard label="Sponsors engaged" value="18" delta={6.7} icon={Handshake} />
      </div>

      <Panel title="Campaigns" description="Placeholder data — connect to live funding pipeline">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fundingCampaigns.map((c) => {
            const pct = Math.min(100, Math.round((c.raisedBDT / c.goalBDT) * 100));
            return (
              <div
                key={c.id}
                className="rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.group}</p>
                    <h3 className="font-display mt-0.5 text-lg leading-tight">{c.title}</h3>
                  </div>
                  <StatusPill status={c.status} />
                </div>

                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-xl">{fmtBDT(c.raisedBDT)}</span>
                    <span className="text-xs text-muted-foreground">of {fmtBDT(c.goalBDT)}</span>
                  </div>
                  <Progress value={pct} className="mt-2 h-2" />
                  <p className="mt-1 text-[11px] text-muted-foreground">{pct}% funded · ends {new Date(c.endsAt).toLocaleDateString()}</p>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-muted/40 px-3 py-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Sponsor</p>
                    <p className="text-sm font-medium">{c.sponsor ?? "Open to sponsors"}</p>
                  </div>
                  <Button size="sm" variant="ghost" className="rounded-full text-xs">Manage</Button>
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </AdminLayout>
  );
}
