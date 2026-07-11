import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ORG_NAV } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { orgBookings } from "@/data/portal/organization";

export const Route = createFileRoute("/_authenticated/dashboard/organization/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: BookingsPage,
});

function BookingsPage() {
  const total = orgBookings.reduce((s, b) => s + b.amountBDT, 0);
  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={ORG_NAV}
      eyebrow="Bookings"
      title="Booking ledger"
      description={`Total booked value: ৳${(total / 1_00_000).toFixed(1)}L`}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {orgBookings.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-base leading-snug text-foreground">{b.what}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{b.who}</div>
              </div>
              <StatusPill status={b.status === "upcoming" ? "upcoming" : b.status === "completed" ? "approved" : "rejected"} />
            </div>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{b.when}</span>
              <span className="font-semibold text-foreground">৳{b.amountBDT.toLocaleString()}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full flex-1">Invoice</Button>
              <Button size="sm" variant="ghost" className="rounded-full">View</Button>
            </div>
          </div>
        ))}
      </div>
      {orgBookings.length === 0 && <Panel title=""><p className="text-sm text-muted-foreground">No bookings yet.</p></Panel>}
    </PortalLayout>
  );
}
