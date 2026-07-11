import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/cultural-programs")({
  head: () => ({ meta: [{ title: "Cultural Programs — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: CulturalProgramsPage,
});

interface Program {
  id: string;
  title: string;
  region: string;
  date: string;
  audience: string;
  status: "planning" | "confirmed" | "completed";
  notes?: string;
}

const seed: Program[] = [
  { id: "cp1", title: "Sonargaon Heritage Nights", region: "Narayanganj", date: "Feb 22, 2026", audience: "Tourists · 400", status: "confirmed" },
  { id: "cp2", title: "Rangamati Folk Festival", region: "Chattogram Hill Tracts", date: "Mar 08, 2026", audience: "Mixed · 800", status: "planning" },
  { id: "cp3", title: "Cox's Bazar Beach Theatre", region: "Cox's Bazar", date: "Jan 12, 2026", audience: "Tourists · 250", status: "completed" },
];

function CulturalProgramsPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items, add, update, remove } = useDemoList<Program>("org-cultural", seed, scope);
  const [open, setOpen] = useState(false);

  const fields: DemoField[] = [
    { name: "title", label: "Program title", type: "text", required: true },
    { name: "region", label: "Tourism zone / region", type: "text", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "audience", label: "Target audience", type: "text", placeholder: "Tourists · 400" },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <PortalLayout
      groupLabel="Tourism Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Cultural programs"
      title="Living culture across Bangladesh"
      description="Curate performances and festivals that showcase Bangladeshi theatre to travellers."
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Request cultural show
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.region}</div>
                <div className="font-display mt-1 text-lg leading-tight text-foreground">{p.title}</div>
              </div>
              <StatusPill status={p.status === "confirmed" ? "active" : p.status === "planning" ? "review" : "approved"} />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5" /> {p.date} · {p.audience}
            </div>
            <div className="mt-4 flex gap-2">
              <Button size="sm" variant="outline" className="rounded-full flex-1" onClick={() => update(p.id, { status: p.status === "planning" ? "confirmed" : "completed" })}>
                {p.status === "planning" ? "Confirm" : p.status === "confirmed" ? "Mark completed" : "Reopen"}
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { remove(p.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 ? <Panel title="No programs yet"><p className="text-sm text-muted-foreground">Request your first cultural show.</p></Panel> : null}

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Request cultural program"
        fields={fields}
        submitLabel="Request program"
        onSubmit={(v) => {
          add({
            title: v.title,
            region: v.region,
            date: v.date ? new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
            audience: v.audience || "Open",
            status: "planning",
            notes: v.notes,
          });
          toast.success("Cultural program requested");
        }}
      />
    </PortalLayout>
  );
}
