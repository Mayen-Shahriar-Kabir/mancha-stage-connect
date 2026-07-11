import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";
import { orgBookings as seedBookings, type OrgBooking } from "@/data/portal/organization";
import { GROUPS as allGroups } from "@/data/explore/groups";
import { ARTISTS as allArtists } from "@/data/explore/artists";

export const Route = createFileRoute("/_authenticated/dashboard/organization/bookings")({
  head: () => ({ meta: [{ title: "Bookings — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: BookingsPage,
});

type DemoBooking = OrgBooking & {
  purpose?: string;
  venue?: string;
  notes?: string;
  targetKind?: "group" | "artist";
};

function BookingsPage() {
  const { profile } = useAuth();
  const orgType = profile?.organization_type ?? "corporate";
  const scope = profile?.id ?? "demo";
  const { items, add, update, remove } = useDemoList<DemoBooking>(
    "org-bookings",
    seedBookings as DemoBooking[],
    scope,
  );

  const [open, setOpen] = useState(false);

  const targets = useMemo(
    () => [
      ...allGroups.map((g) => ({ value: `group:${g.name}`, label: `Group · ${g.name}` })),
      ...allArtists.map((a) => ({ value: `artist:${a.name}`, label: `Artist · ${a.name}` })),
    ],
    [],
  );

  const fields: DemoField[] = [
    { name: "what", label: "Event name", type: "text", required: true, placeholder: "Foundation Day performance" },
    { name: "purpose", label: "Purpose", type: "textarea", placeholder: "Brief description of the event" },
    { name: "target", label: "Book a group or artist", type: "select", required: true, options: targets, placeholder: "Select talent…" },
    { name: "when", label: "Preferred date", type: "date", required: true },
    { name: "venue", label: "Venue", type: "text", placeholder: "e.g. Bashundhara Convention Hall" },
    { name: "amountBDT", label: "Budget (BDT)", type: "number", placeholder: "250000" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "Anything specific?" },
  ];

  const handleCreate = (v: Record<string, string>) => {
    const [kind, name] = (v.target ?? "").split(":");
    add({
      what: v.what,
      who: name || "Unassigned",
      when: v.when ? new Date(v.when).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
      amountBDT: Number(v.amountBDT) || 0,
      status: "upcoming",
      purpose: v.purpose,
      venue: v.venue,
      notes: v.notes,
      targetKind: (kind as "group" | "artist") ?? "group",
    } as Omit<DemoBooking, "id">);
    toast.success("Booking created");
  };

  const setStatus = (id: string, status: DemoBooking["status"]) => {
    update(id, { status });
    toast.success(`Marked ${status}`);
  };

  const total = items.reduce((s, b) => s + (b.amountBDT ?? 0), 0);

  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(orgType)}
      eyebrow="Bookings"
      title="Booking ledger"
      description={`Total booked value: ৳${(total / 1_00_000).toFixed(1)}L · ${items.length} bookings`}
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create Booking
        </Button>
      }
    >
      {items.length === 0 ? (
        <Panel title="No bookings yet">
          <p className="text-sm text-muted-foreground">Create your first booking to invite a group or artist.</p>
        </Panel>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div key={b.id} className="flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-display text-base leading-snug text-foreground">{b.what}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{b.targetKind === "artist" ? "Artist" : "Group"} · {b.who}</div>
                </div>
                <StatusPill status={b.status === "upcoming" ? "upcoming" : b.status === "completed" ? "approved" : "rejected"} />
              </div>
              {b.purpose ? <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{b.purpose}</p> : null}
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                <div><div className="text-muted-foreground">Date</div><div className="mt-0.5 font-medium text-foreground">{b.when}</div></div>
                <div><div className="text-muted-foreground">Budget</div><div className="mt-0.5 font-medium text-foreground">৳{(b.amountBDT ?? 0).toLocaleString()}</div></div>
                {b.venue ? <div className="col-span-2"><div className="text-muted-foreground">Venue</div><div className="mt-0.5 font-medium text-foreground">{b.venue}</div></div> : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="rounded-full">Status</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setStatus(b.id, "upcoming")}>Pending / Upcoming</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatus(b.id, "completed")}>Accepted / Completed</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setStatus(b.id, "cancelled")}>Cancelled</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { remove(b.id); toast.success("Removed"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Create booking"
        description="Book a theatre group or individual artist for your event."
        fields={fields}
        submitLabel="Create booking"
        onSubmit={handleCreate}
      />
    </PortalLayout>
  );
}
