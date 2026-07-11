import { createFileRoute } from "@tanstack/react-router";
import {
  Users,
  UserCheck,
  Clapperboard,
  Wallet,
  Crown,
  GraduationCap,
  MapPin,
  Plus,
  Download,
  ArrowRight,
  Check,
  X,
  Eye,
  Sparkles,
  Star,
  HandCoins,
  UserPlus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  Legend,
} from "recharts";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { StatCard, Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  adminStats,
  usersByRole,
  monthlyGrowth,
  revenueTrend,
  productionTypes,
  pendingApprovalsList,
  recentActivity,
} from "@/data/admin/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/admin/")({
  head: () => ({
    meta: [
      { title: "Overview · Admin — Mancha" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminHome,
});

const BRAND = "hsl(var(--brand, 350 78% 25%))";
const GOLD = "#D4AF37";
const PIE_COLORS = ["#6B1022", "#D4AF37", "#8C6B3F", "#A63A50", "#4A6B7A"];

const fmtBDT = (n: number) =>
  n >= 1_00_00_000
    ? `৳${(n / 1_00_00_000).toFixed(1)} Cr`
    : n >= 1_00_000
    ? `৳${(n / 1_00_000).toFixed(1)}L`
    : `৳${n.toLocaleString()}`;

function AdminHome() {
  return (
    <AdminLayout
      eyebrow="Admin Console"
      title="Ecosystem Overview"
      description="Steward Bangladesh's theatre community — approvals, productions, funding, and audience growth at a glance."
      actions={
        <>
          <Button variant="outline" className="rounded-full">
            <Download className="mr-1.5 h-4 w-4" /> Export report
          </Button>
          <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-1.5 h-4 w-4" /> Quick action
          </Button>
        </>
      }
    >
      {/* ── Top statistics ────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={adminStats.totalUsers.toLocaleString()}
          delta={adminStats.totalUsersDelta}
          icon={Users}
        />
        <StatCard
          label="Pending Approvals"
          value={adminStats.pendingApprovals.toString()}
          delta={adminStats.pendingApprovalsDelta}
          icon={UserCheck}
          hint="Requires review"
        />
        <StatCard
          label="Active Productions"
          value={adminStats.activeProductions.toString()}
          delta={adminStats.activeProductionsDelta}
          icon={Clapperboard}
        />
        <StatCard
          label="Monthly Revenue"
          value={fmtBDT(adminStats.monthlyRevenueBDT)}
          delta={adminStats.monthlyRevenueDelta}
          icon={Wallet}
        />
        <StatCard
          label="Premium Subscribers"
          value={adminStats.premiumSubscribers.toLocaleString()}
          delta={adminStats.premiumSubscribersDelta}
          icon={Crown}
        />
        <StatCard
          label="Training Programs"
          value={adminStats.trainingPrograms.toString()}
          delta={adminStats.trainingProgramsDelta}
          icon={GraduationCap}
        />
        <StatCard
          label="Community Meetups"
          value={adminStats.communityMeetups.toString()}
          delta={adminStats.communityMeetupsDelta}
          icon={MapPin}
        />
        <StatCard
          label="Health Index"
          value="94.2"
          hint="Composite platform score"
          icon={Sparkles}
        />
      </div>

      {/* ── Charts ────────────────────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Monthly Growth" description="New users & productions per month" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={monthlyGrowth} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="g-users" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g-prods" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GOLD} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="users" stroke={BRAND} fill="url(#g-users)" strokeWidth={2} />
                <Area type="monotone" dataKey="productions" stroke={GOLD} fill="url(#g-prods)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Users by Role" description="Distribution across the ecosystem">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={usersByRole}
                  dataKey="value"
                  nameKey="role"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {usersByRole.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel title="Revenue Trend" description="Tickets · Subscriptions · Sponsorship (BDT '000)" className="lg:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={revenueTrend} margin={{ left: -10, right: 4, top: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="tickets" stroke={BRAND} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="subs" stroke={GOLD} strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="sponsor" stroke="#4A6B7A" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Production Types" description="Active productions by genre">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={productionTypes} layout="vertical" margin={{ left: 8, right: 12, top: 8, bottom: 0 }}>
                <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis type="category" dataKey="type" width={90} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill={BRAND} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      {/* ── Activity + approvals ─────────────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Panel
          title="Recent Activity"
          description="Live feed across the platform"
          className="lg:col-span-3"
          action={
            <Button variant="ghost" size="sm" className="text-xs">
              View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          }
        >
          <ul className="divide-y divide-border/60">
            {recentActivity.map((a) => {
              const Icon =
                a.kind === "registration"
                  ? UserPlus
                  : a.kind === "production"
                  ? Clapperboard
                  : a.kind === "funding"
                  ? HandCoins
                  : Star;
              const tone =
                a.kind === "registration"
                  ? "bg-sky-500/10 text-sky-700 dark:text-sky-400"
                  : a.kind === "production"
                  ? "bg-brand/10 text-brand"
                  : a.kind === "funding"
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-700 dark:text-amber-400";
              return (
                <li key={a.id} className="flex items-start gap-3 py-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${tone}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{a.title}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.meta}</p>
                  </div>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{a.time}</span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel
          title="Pending Approvals"
          description={`${pendingApprovalsList.length} awaiting review`}
          className="lg:col-span-2"
          action={
            <Button variant="ghost" size="sm" className="text-xs">
              Approvals <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          }
        >
          <ul className="space-y-3">
            {pendingApprovalsList.slice(0, 4).map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-border/60 bg-muted/30 p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-brand/10 text-xs text-brand">
                      {p.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.email}</p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <StatusPill status="pending" />
                      <span className="text-[11px] text-muted-foreground">{p.role}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5">
                  <Button size="sm" className="h-7 flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90">
                    <Check className="mr-1 h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 flex-1 rounded-full">
                    <X className="mr-1 h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 rounded-full px-2">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AdminLayout>
  );
}
