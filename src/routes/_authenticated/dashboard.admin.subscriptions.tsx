import { createFileRoute } from "@tanstack/react-router";
import { Plus, Crown, Users, TrendingUp, Sparkles } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { subscriptionPlans, subscriptionRevenueTrend } from "@/data/admin/placeholder";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/dashboard/admin/subscriptions")({
  head: () => ({ meta: [{ title: "Subscriptions · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: SubscriptionsPage,
});

const BRAND = "hsl(var(--brand, 350 78% 25%))";

function SubscriptionsPage() {
  const total = subscriptionPlans.reduce((s, p) => s + p.subscribers, 0);
  const paying = subscriptionPlans.filter((p) => p.priceBDT > 0).reduce((s, p) => s + p.subscribers, 0);
  const mrr = subscriptionPlans.reduce((s, p) => s + p.priceBDT * p.subscribers, 0);

  return (
    <AdminLayout
      eyebrow="Membership"
      title="Subscriptions"
      description="Manage tiers, pricing, and understand what audiences value."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> New plan
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Total members" value={total.toLocaleString()} icon={Users} delta={8.4} />
        <StatCard label="Paying members" value={paying.toLocaleString()} icon={Crown} delta={12.6} />
        <StatCard label="MRR" value={`৳${(mrr / 1000).toFixed(0)}K`} icon={TrendingUp} delta={14.9} />
        <StatCard label="Churn (30d)" value="2.1%" delta={-0.4} icon={Sparkles} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-3xl border p-6 transition-all",
              plan.featured
                ? "border-brand/40 bg-gradient-to-br from-brand/8 to-accent/8 shadow-lg"
                : "border-border/60 bg-card hover:-translate-y-0.5 hover:shadow-md",
            )}
          >
            {plan.featured && (
              <Badge className="absolute right-4 top-4 rounded-full bg-brand text-brand-foreground">
                Most popular
              </Badge>
            )}
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Plan</p>
            <h3 className="font-display mt-1 text-2xl">{plan.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="font-display text-4xl">
                {plan.priceBDT === 0 ? "Free" : `৳${plan.priceBDT}`}
              </span>
              {plan.priceBDT > 0 && (
                <span className="text-sm text-muted-foreground">/ {plan.interval}</span>
              )}
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {plan.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-2 text-foreground">
                  <span className="mt-1 grid h-4 w-4 place-items-center rounded-full bg-brand/10 text-[10px] text-brand">
                    ✓
                  </span>
                  <span>{perk}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Subscribers</p>
                <p className="font-display text-xl">{plan.subscribers.toLocaleString()}</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full">
                Manage
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Panel title="Subscription revenue" description="Last 12 months, in BDT '000">
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={subscriptionRevenueTrend} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="g-sub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              <Area type="monotone" dataKey="value" stroke={BRAND} strokeWidth={2.5} fill="url(#g-sub)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </AdminLayout>
  );
}
