import type { ReactNode } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function FiltersPanel({
  title = "Filters",
  children,
  onClear,
}: {
  title?: string;
  children: ReactNode;
  onClear: () => void;
}) {
  return (
    <div className="sticky top-24 hidden h-fit rounded-2xl border border-border bg-card p-6 shadow-soft lg:block">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg">{title}</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-brand hover:underline"
        >
          Clear all
        </button>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

export function FiltersSheet({
  open,
  onOpenChange,
  onClear,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onClear: () => void;
  children: ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">{children}</div>
        <div className="mt-8 flex gap-3">
          <Button variant="outline" className="flex-1 rounded-full" onClick={onClear}>
            Clear
          </Button>
          <Button
            className="flex-1 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
            onClick={() => onOpenChange(false)}
          >
            Apply
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function ChipToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-brand bg-brand text-brand-foreground shadow-soft"
          : "border-border bg-background text-foreground hover:border-brand/40 hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
