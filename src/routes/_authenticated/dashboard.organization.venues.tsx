import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Building2, Users } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/venues")({
  head: () => ({ meta: [{ title: "Venue Booking — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: VenuesPage,
});

export interface Venue {
  id: string;
  name: string;
  university: string;
  capacity: number;
  availableFrom: string;
  availableTo: string;
  facilities: string;
  description?: string;
  status: "available" | "booked";
}

export const seedVenues: Venue[] = [
  { id: "v1", name: "TSC Auditorium", university: "University of Dhaka", capacity: 700, availableFrom: "Feb 15, 2026", availableTo: "Mar 30, 2026", facilities: "Full lighting rig, green room, stage sound", status: "available" },
  { id: "v2", name: "IUB Cultural Hall", university: "Independent University Bangladesh", capacity: 350, availableFrom: "Mar 01, 2026", availableTo: "Apr 15, 2026", facilities: "Projector, mic, tiered seating", status: "available" },
  { id: "v3", name: "NSU Open Air Theatre", university: "North South University", capacity: 500, availableFrom: "Feb 20, 2026", availableTo: "Mar 10, 2026", facilities: "Outdoor, weather-dependent", status: "booked" },
];

function VenuesPage() {
  const { profile } = useAuth();
  // Shared scope so groups/corporate/tourism can see university-published venues.
  const { items, add, update, remove } = useDemoList<Venue>("venues", seedVenues, "shared");
  const [open, setOpen] = useState(false);

  const fields: DemoField[] = [
    { name: "name", label: "Auditorium / venue name", type: "text", required: true },
    { name: "university", label: "University", type: "text", required: true },
    { name: "capacity", label: "Capacity", type: "number", required: true },
    { name: "availableFrom", label: "Available from", type: "date", required: true },
    { name: "availableTo", label: "Available to", type: "date", required: true },
    { name: "facilities", label: "Facilities", type: "text", placeholder: "Lighting, sound, green room" },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <PortalLayout
      groupLabel="University Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Venue Booking"
      title="Publish your venues"
      description="Groups, corporate partners, and tourism boards can see venues you list here."
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Publish venue
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((v) => (
          <div key={v.id} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground"><Building2 className="h-3 w-3" /> {v.university}</div>
                <div className="font-display mt-1 text-lg leading-tight text-foreground">{v.name}</div>
              </div>
              <StatusPill status={v.status === "available" ? "active" : "review"} />
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {v.capacity.toLocaleString()} seats</div>
              <div>Available · {v.availableFrom} — {v.availableTo}</div>
              <div>{v.facilities}</div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full flex-1" onClick={() => update(v.id, { status: v.status === "available" ? "booked" : "available" })}>
                {v.status === "available" ? "Mark booked" : "Mark available"}
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { remove(v.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 ? <Panel title="No venues published"><p className="text-sm text-muted-foreground">Publish an auditorium so others can book it.</p></Panel> : null}

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Publish venue"
        description="Share an auditorium with groups, corporate partners, and tourism boards."
        fields={fields}
        submitLabel="Publish venue"
        onSubmit={(v) => {
          const fmt = (d: string) => d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD";
          add({
            name: v.name, university: v.university || profile?.organization_name || "University",
            capacity: Number(v.capacity) || 0,
            availableFrom: fmt(v.availableFrom), availableTo: fmt(v.availableTo),
            facilities: v.facilities || "—",
            description: v.description,
            status: "available",
          });
          toast.success("Venue published — visible to all partners");
        }}
      />
    </PortalLayout>
  );
}
