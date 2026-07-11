import { createFileRoute } from "@tanstack/react-router";
import { Check, Crown } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { premiumPlan, plans } from "@/data/portal/audience";

export const Route = createFileRoute("/_authenticated/dashboard/audience/premium")({
  head: () => ({ meta: [{ title: "Premium — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: PremiumPage,
});

function PremiumPage() {
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Premium"
      title="Front-row access, always"
      description="Priority tickets, livestreams, backstage, and members-only meets."
    >
      <Panel title="Your subscription">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent/15 text-brand"><Crown className="h-6 w-6" /></span>
            <div>
              <div className="font-display text-2xl text-foreground">{premiumPlan.name}</div>
              <div className="text-xs text-muted-foreground">৳{premiumPlan.price}/mo · Renews {premiumPlan.renewal}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full">Manage billing</Button>
            <Button variant="ghost" className="rounded-full text-rose-600">Cancel</Button>
          </div>
        </div>
        <ul className="mt-6 grid gap-2 md:grid-cols-2">
          {premiumPlan.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground">
              <Check className="mt-0.5 h-4 w-4 text-emerald-600" /> {b}
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid gap-5 md:grid-cols-3">
        {plans.map((p) => (
          <div key={p.id} className={`relative rounded-2xl border p-6 transition ${p.recommended ? "border-brand bg-gradient-to-b from-brand/5 to-transparent shadow-md" : "border-border/60 bg-card"}`}>
            {p.recommended && <span className="absolute -top-3 left-6 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-foreground">Popular</span>}
            <div className="font-display text-xl text-foreground">{p.name}</div>
            <div className="mt-1 text-xs text-muted-foreground">{p.tagline}</div>
            <div className="mt-4 font-display text-3xl text-foreground">৳{p.price}<span className="ml-1 text-sm font-normal text-muted-foreground">/mo</span></div>
            <ul className="mt-5 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /> {f}</li>
              ))}
            </ul>
            <Button className={`mt-6 w-full rounded-full ${p.recommended ? "bg-brand text-brand-foreground hover:bg-brand/90" : ""}`} variant={p.recommended ? "default" : "outline"}>
              {p.name === premiumPlan.name ? "Current plan" : "Upgrade"}
            </Button>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
