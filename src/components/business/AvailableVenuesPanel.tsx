import { Building2, Users } from "lucide-react";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { useDemoList } from "@/lib/demo-store";
import { seedVenues, type Venue } from "@/routes/_authenticated/dashboard.organization.venues";

/**
 * Read-only browse of university-published venues.
 * Reads the shared `venues` demo store so any role can discover open venues.
 */
export function AvailableVenuesPanel({ compact = false }: { compact?: boolean }) {
  const { items } = useDemoList<Venue>("venues", seedVenues, "shared");
  const open = items.filter((v) => v.status === "available");
  return (
    <Panel title="Available university venues" description="Published by universities across the network">
      {open.length === 0 ? (
        <p className="text-sm text-muted-foreground">No venues currently open. Check back soon.</p>
      ) : (
        <ul className="divide-y divide-border/60">
          {open.slice(0, compact ? 3 : open.length).map((v) => (
            <li key={v.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <Building2 className="h-3 w-3" /> {v.university}
                </div>
                <div className="text-sm font-medium text-foreground">{v.name}</div>
                <div className="text-xs text-muted-foreground">{v.availableFrom} — {v.availableTo}</div>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {v.capacity}</span>
                <StatusPill status="active" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
