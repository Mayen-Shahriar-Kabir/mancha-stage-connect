import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ORG_NAV } from "@/components/portal/org-nav";
import { Panel } from "@/components/admin/primitives";
import { engagementSeries, spendMix, partnerMix } from "@/data/portal/organization";

const CHART_COLORS = ["#6B1022", "#D4AF37", "#8E2A3F", "#B58A2B"];

export const Route = createFileRoute("/_authenticated/dashboard/organization/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={ORG_NAV}
      eyebrow="Analytics"
      title="How your presence performs"
    >
      <Panel title="Engagement reach (last 6 months)">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={engagementSeries}>
              <defs>
                <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6B1022" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#6B1022" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="m" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="reach" stroke="#6B1022" strokeWidth={2} fill="url(#reach)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Spend mix">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={spendMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {spendMix.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Partner mix">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={partnerMix}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} style={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#6B1022" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </PortalLayout>
  );
}
