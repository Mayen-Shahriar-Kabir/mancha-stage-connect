import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Stat card ────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  delta?: number; // percent
  icon?: LucideIcon;
  hint?: string;
}

export function StatCard({ label, value, delta, icon: Icon, hint }: StatCardProps) {
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="font-display mt-2 text-2xl leading-none text-foreground md:text-3xl">
            {value}
          </p>
          {hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/8 text-brand transition-colors group-hover:bg-brand/12">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
      {typeof delta === "number" ? (
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
              positive
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-700 dark:text-rose-400",
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(delta).toFixed(1)}%
          </span>
          <span className="text-[11px] text-muted-foreground">vs. last month</span>
        </div>
      ) : null}
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────
interface PanelProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Panel({ title, description, action, children, className }: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 md:p-6",
        className,
      )}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg text-foreground">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      {children}
    </section>
  );
}

// ─── Status pill ──────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20",
  running: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20",
  approved: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20",
  funded: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20",
  pending: "bg-amber-500/12 text-amber-700 dark:text-amber-400 ring-amber-500/20",
  review: "bg-amber-500/12 text-amber-700 dark:text-amber-400 ring-amber-500/20",
  upcoming: "bg-sky-500/12 text-sky-700 dark:text-sky-400 ring-sky-500/20",
  sold_out: "bg-brand/10 text-brand ring-brand/20",
  suspended: "bg-rose-500/12 text-rose-700 dark:text-rose-400 ring-rose-500/20",
  rejected: "bg-rose-500/12 text-rose-700 dark:text-rose-400 ring-rose-500/20",
  closed: "bg-muted text-muted-foreground ring-border",
};

export function StatusPill({ status }: { status: string }) {
  const label = status.replace(/_/g, " ");
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1",
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}
