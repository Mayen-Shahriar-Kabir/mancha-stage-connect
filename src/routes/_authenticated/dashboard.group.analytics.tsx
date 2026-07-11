import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import { GroupLayout } from "@/components/group/GroupLayout";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  revenueSeries, audienceGrowth, membershipGrowth, productionPopularity,
} from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: AnalyticsPage,
});

const BRAND = "#6B1022";
const GOLD = "#D4AF37";
const SLATE = "#4A6B7A";

function AnalyticsPage() {
  return (
    <GroupLayout
      eyebrow="Insights"
      title="Analytics"
      description="Understand how your ensemble grows, sells, and resonates."
      actions={
        <Button variant="outline" className="rounded-full">
          <Download className="mr-1.5 h-4 w-4" /> Export
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Revenue" description="Tickets · Sponsors · Subscriptions (BDT '000)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueSeries} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="ga-t" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ga-s" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="tickets" stroke={BRAND} fill="url(#ga-t)" strokeWidth={2} />
                <Area type="monotone" dataKey="sponsors" stroke={GOLD} fill="url(#ga-s)" strokeWidth={2} />
                <Area type="monotone" dataKey="subs" stroke={SLATE} fillOpacity={0} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Membership Growth" description="Ensemble size">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={membershipGrowth} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Line type="monotone" dataKey="members" stroke={BRAND} strokeWidth={2.5} dot={{ r: 3, fill: BRAND }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Audience Growth" description="Followers & newsletter subscribers" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={audienceGrowth} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="ga-f" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="followers" stroke={BRAND} fill="url(#ga-f)" strokeWidth={2} />
                <Line type="monotone" dataKey="newsletter" stroke={GOLD} strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Production Popularity" description="Audience resonance score">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={productionPopularity} layout="vertical" margin={{ left: 8, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="title" width={130} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="score" radius={[0, 8, 8, 0]} fill={BRAND} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </GroupLayout>
  );
}
