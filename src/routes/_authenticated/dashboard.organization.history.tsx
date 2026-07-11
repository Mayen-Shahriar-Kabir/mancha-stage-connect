import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";
import { orgBookings as seedBookings, type OrgBooking } from "@/data/portal/organization";

export const Route = createFileRoute("/_authenticated/dashboard/organization/history")({
  head: () => ({ meta: [{ title: "History — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items } = useDemoList<OrgBooking>("org-bookings", seedBookings, scope);
  const past = items.filter((b) => b.status !== "upcoming");

  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="History"
      title="Past bookings & partnerships"
      description={`${past.length} completed and archived engagements`}
    >
      <Panel title="Archive" description="Everything you've booked with the ecosystem">
        {past.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing archived yet — completed bookings will land here.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {past.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{b.what}</div>
                  <div className="text-xs text-muted-foreground">{b.who} · {b.when}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">৳{b.amountBDT.toLocaleString()}</span>
                  <StatusPill status={b.status === "completed" ? "approved" : "rejected"} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </PortalLayout>
  );
}
