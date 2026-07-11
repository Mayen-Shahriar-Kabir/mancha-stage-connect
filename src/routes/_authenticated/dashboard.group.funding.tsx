import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Building2, Calendar, X } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { CampaignFormDialog } from "@/components/business/CampaignFormDialog";
import { useAuth } from "@/hooks/use-auth";
import { listMyCampaigns, fmtBDT, type Campaign } from "@/lib/business";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/group/funding")({
  head: () => ({ meta: [{ title: "Funding · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: FundingPage,
});

function ProgressCircle({ pct }: { pct: number }) {
  const size = 100, stroke = 9, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke} className="fill-none stroke-muted" />
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - (Math.min(100, pct) / 100) * c}
          strokeLinecap="round" className="fill-none stroke-brand transition-[stroke-dashoffset] duration-700" />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="font-display text-xl leading-none text-foreground">{Math.min(100, pct)}%</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground">funded</div>
        </div>
      </div>
    </div>
  );
}

function FundingPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    try { setItems(await listMyCampaigns(user.id)); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  const close = async (c: Campaign) => {
    await supabase.from("funding_campaigns").update({ status: "closed" }).eq("id", c.id);
    toast.success("Campaign closed"); load();
    void updateProduction; // keep import satisfied
  };

  const totalRaised = items.reduce((s, c) => s + Number(c.raised_amount), 0);
  const totalGoal   = items.reduce((s, c) => s + Number(c.goal_amount), 0);

  return (
    <GroupLayout
      eyebrow="Patronage"
      title="Funding"
      description="Sponsors, patrons, and community investors backing your stage."
      actions={<Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="mr-1.5 h-4 w-4" /> Create Campaign</Button>}
    >
      <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/60 bg-gradient-to-br from-brand/6 via-background to-accent/8 p-5 md:grid-cols-4">
        <Summary label="Total raised" value={fmtBDT(totalRaised)} />
        <Summary label="Across goals" value={fmtBDT(totalGoal)} />
        <Summary label="Active campaigns" value={items.filter((c) => c.status === "active").length.toString()} />
        <Summary label="Total campaigns" value={items.length.toString()} />
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2">{[0,1].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl border border-border/60 bg-muted/30" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 p-16 text-center">
          <div className="font-display text-xl text-foreground">No campaigns yet</div>
          <p className="mt-2 text-sm text-muted-foreground">Launch a campaign to invite patrons and sponsors.</p>
          <Button onClick={() => setOpen(true)} className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Plus className="mr-1.5 h-4 w-4" /> Create Campaign</Button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {items.map((c) => {
            const pct = Number(c.goal_amount) ? Math.round((Number(c.raised_amount) / Number(c.goal_amount)) * 100) : 0;
            const daysLeft = c.deadline ? Math.max(0, Math.round((new Date(c.deadline).getTime() - Date.now()) / 86400000)) : null;
            return (
              <article key={c.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-xl">
                <div className="flex flex-col sm:flex-row">
                  {c.cover_url && (
                    <div className="relative h-40 shrink-0 bg-cover bg-center sm:h-auto sm:w-40" style={{ backgroundImage: `url(${c.cover_url})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-4 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-lg leading-snug text-foreground">{c.title}</h3>
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${c.status === "active" ? "bg-emerald-500/10 text-emerald-700" : "bg-muted text-muted-foreground"}`}>{c.status}</span>
                        </div>
                        {c.purpose && <p className="mt-1 text-xs text-muted-foreground">{c.purpose}</p>}
                        {c.deadline && (
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            Deadline {new Date(c.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}{daysLeft !== null && ` · ${daysLeft} days left`}
                          </p>
                        )}
                      </div>
                      <ProgressCircle pct={pct} />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <StatLine label="Raised" value={fmtBDT(Number(c.raised_amount))} />
                      <StatLine label="Goal" value={fmtBDT(Number(c.goal_amount))} />
                    </div>
                    <div className="mt-auto flex gap-2 pt-1">
                      {c.status === "active" && (
                        <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs" onClick={() => close(c)}>
                          <X className="mr-1 h-3.5 w-3.5" /> Close campaign
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Panel title="Top Sponsors" description="Presenting and supporting partners of the season">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["Grameenphone", "BRAC Bank", "Robi Axiata", "ACI Foundation"].map((s) => (
            <div key={s} className="flex items-center gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-accent/20 text-brand"><Building2 className="h-5 w-5" /></span>
              <div><p className="text-sm font-medium text-foreground">{s}</p><p className="text-[11px] text-muted-foreground">Presenting sponsor</p></div>
            </div>
          ))}
        </div>
      </Panel>

      <CampaignFormDialog open={open} onOpenChange={setOpen} groupId={user?.id ?? ""} onSaved={load} />
    </GroupLayout>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (<div><div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div><div className="font-display mt-1 text-2xl text-foreground">{value}</div></div>);
}
function StatLine({ label, value }: { label: string; value: string }) {
  return (<div className="rounded-lg border border-border/60 bg-muted/30 p-2"><div className="uppercase tracking-wider text-muted-foreground">{label}</div><div className="mt-0.5 text-sm font-semibold text-foreground">{value}</div></div>);
}
