import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  Bar,
  Legend,
  PolarRadiusAxis,
} from "recharts";
import { Download } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import {
  engagementTrend,
  audienceGeography,
  genrePopularity,
  monthlyGrowth,
} from "@/data/admin/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/admin/reports")({
  head: () => ({ meta: [{ title: "Reports · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ReportsPage,
});

const BRAND = "hsl(var(--brand, 350 78% 25%))";
const GOLD = "#D4AF37";

function ReportsPage() {
  return (
    <AdminLayout
      eyebrow="Analytics"
      title="Reports"
      description="Deep dive into audience behaviour, geography, and creative trends."
      actions={
        <Button variant="outline" className="rounded-full">
          <Download className="mr-1.5 h-4 w-4" /> Export PDF
        </Button>
      }
    >
      <Panel title="Engagement — 8 week rolling" description="Views · bookmarks · ticket conversions">
        <div className="h-80">
          <ResponsiveContainer>
            <AreaChart data={engagementTrend} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="g-views" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="g-book" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="views" stroke={BRAND} fill="url(#g-views)" strokeWidth={2} />
              <Area type="monotone" dataKey="bookmarks" stroke={GOLD} fill="url(#g-book)" strokeWidth={2} />
              <Area type="monotone" dataKey="tickets" stroke="#4A6B7A" fill="transparent" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Audience geography" description="Users by region (placeholder)">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={audienceGeography} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill={BRAND} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Genre popularity" description="Composite audience score">
          <div className="h-72">
            <ResponsiveContainer>
              <RadarChart data={genrePopularity} outerRadius={95}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis dataKey="genre" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                <Radar dataKey="value" stroke={BRAND} fill={BRAND} fillOpacity={0.35} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Growth cohorts" description="New users and productions (12mo)">
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={monthlyGrowth} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="users" fill={BRAND} radius={[6, 6, 0, 0]} />
              <Bar dataKey="productions" fill={GOLD} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
    </AdminLayout>
  );
}
