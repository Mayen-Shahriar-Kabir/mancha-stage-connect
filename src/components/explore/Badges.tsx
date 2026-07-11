import type { ShowStatus, Availability } from "@/data/explore";

export function ShowStatusBadge({ status }: { status: ShowStatus }) {
  const map: Record<ShowStatus, { label: string; cls: string; dot: string }> = {
    upcoming: {
      label: "Upcoming",
      cls: "bg-brand/10 text-brand border border-brand/20",
      dot: "bg-brand",
    },
    live: {
      label: "Live Now",
      cls: "bg-destructive/10 text-destructive border border-destructive/20",
      dot: "bg-destructive animate-pulse",
    },
    archived: {
      label: "Archived",
      cls: "bg-muted text-muted-foreground border border-border",
      dot: "bg-muted-foreground/60",
    },
  };
  const s = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export function AvailabilityBadge({ availability }: { availability: Availability }) {
  const map: Record<Availability, { label: string; cls: string; dot: string }> = {
    available: {
      label: "Available",
      cls: "bg-emerald-500/10 text-emerald-700 border border-emerald-500/20",
      dot: "bg-emerald-500",
    },
    busy: {
      label: "Busy",
      cls: "bg-amber-500/10 text-amber-700 border border-amber-500/20",
      dot: "bg-amber-500",
    },
    touring: {
      label: "Touring",
      cls: "bg-brand/10 text-brand border border-brand/20",
      dot: "bg-brand",
    },
  };
  const s = map[availability];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}
