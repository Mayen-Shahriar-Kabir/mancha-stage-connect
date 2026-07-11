import { createFileRoute } from "@tanstack/react-router";
import { Plus, Users, Building2, Calendar } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { campaigns } from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/funding")({
  head: () => ({ meta: [{ title: "Funding · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: FundingPage,
});

const fmtBDT = (n: number) =>
  n >= 1_00_000 ? `৳${(n / 1_00_000).toFixed(1)}L` : `৳${n.toLocaleString()}`;

function ProgressCircle({ pct }: { pct: number }) {
  const size = 100;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={stroke}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="fill-none stroke-brand transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-xl leading-none text-foreground">{pct}%</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">funded</div>
        </div>
      </div>
    </div>
  );
}

function FundingPage() {
  const totalRaised = campaigns.reduce((s, c) => s + c.raisedBDT, 0);
  const totalGoal = campaigns.reduce((s, c) => s + c.goalBDT, 0);
  const totalSponsors = campaigns.reduce((s, c) => s + c.sponsors, 0);
  const totalCommunity = campaigns.reduce((s, c) => s + c.communityInvestors, 0);

  return (
    <GroupLayout
      eyebrow="Patronage"
      title="Funding"
      description="Sponsors, patrons, and community investors backing your stage."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create Campaign
        </Button>
      }
    >
      {/* Summary strip */}
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-brand/6 via-background to-accent/8 p-5 md:grid-cols-4">
        <Summary label="Total raised" value={fmtBDT(totalRaised)} />
        <Summary label="Across goals" value={fmtBDT(totalGoal)} />
        <Summary label="Sponsors" value={totalSponsors.toString()} />
        <Summary label="Community investors" value={totalCommunity.toString()} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-2">
        {campaigns.map((c) => {
          const pct = Math.min(100, Math.round((c.raisedBDT / c.goalBDT) * 100));
          const daysLeft = Math.max(0, Math.round((new Date(c.deadline).getTime() - Date.now()) / 86400000));
          return (
            <article
              key={c.id}
              className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex flex-col sm:flex-row">
                <div
                  className="relative h-40 shrink-0 bg-cover bg-center sm:h-auto sm:w-40"
                  style={{ backgroundImage: `url(${c.cover})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r" />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg leading-snug text-foreground">{c.title}</h3>
                      <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Deadline {new Date(c.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })} · {daysLeft} days left
                      </p>
                    </div>
                    <ProgressCircle pct={pct} />
                  </div>

                  <dl className="grid grid-cols-2 gap-2 text-[11px]">
                    <StatLine label="Raised" value={fmtBDT(c.raisedBDT)} />
                    <StatLine label="Goal" value={fmtBDT(c.goalBDT)} />
                    <StatLine icon={Building2} label="Sponsors" value={c.sponsors.toString()} />
                    <StatLine icon={Users} label="Community" value={c.communityInvestors.toString()} />
                  </dl>

                  <div className="mt-auto flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs">Manage</Button>
                    <Button size="sm" className="h-8 flex-1 rounded-full bg-brand text-xs text-brand-foreground hover:bg-brand/90">Boost</Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <Panel title="Top Sponsors" description="Presenting and supporting partners of the season">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Grameenphone", "BRAC Bank", "Robi Axiata", "ACI Foundation"].map((s) => (
            <div key={s} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-brand">
                <Building2 className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{s}</p>
                <p className="text-[11px] text-muted-foreground">Presenting sponsor</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </GroupLayout>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-display mt-1 text-2xl text-foreground">{value}</div>
    </div>
  );
}

function StatLine({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Users }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-2">
      <div className="flex items-center gap-1 uppercase tracking-wider text-muted-foreground">
        {Icon ? <Icon className="h-3 w-3" /> : null}
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}
