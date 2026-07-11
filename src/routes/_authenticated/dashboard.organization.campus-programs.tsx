import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/campus-programs")({
  head: () => ({ meta: [{ title: "Campus Programs — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: CampusProgramsPage,
});

interface CampusProgram {
  id: string;
  title: string;
  kind: "performance" | "workshop" | "festival" | "booking";
  partner: string;
  date: string;
  status: "planning" | "confirmed" | "completed";
  notes?: string;
}

const seed: CampusProgram[] = [
  { id: "cp1", title: "Interfaculty Theatre Cup", kind: "festival", partner: "8 clubs", date: "Mar 12, 2026", status: "planning" },
  { id: "cp2", title: "Voice Workshop with Aly Zaker Fellows", kind: "workshop", partner: "Nagorik Natya Sampradaya", date: "Feb 22, 2026", status: "confirmed" },
  { id: "cp3", title: "Nakshi Kanthar Math on campus", kind: "performance", partner: "Aranyak Natyadal", date: "Feb 28, 2026", status: "confirmed" },
];

function CampusProgramsPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items, add, update, remove } = useDemoList<CampusProgram>("univ-campus", seed, scope);
  const [open, setOpen] = useState(false);

  const fields: DemoField[] = [
    { name: "title", label: "Program title", type: "text", required: true },
    { name: "kind", label: "Program type", type: "select", required: true, options: [
      { value: "performance", label: "Request Theatre Performance" },
      { value: "workshop", label: "Request Workshop" },
      { value: "festival", label: "Organize Festival" },
      { value: "booking", label: "Book Theatre Group" },
    ]},
    { name: "partner", label: "Partner (group / artist)", type: "text", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "notes", label: "Notes", type: "textarea" },
  ];

  return (
    <PortalLayout
      groupLabel="University Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Campus programs"
      title="Bring theatre to campus"
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> New program
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.kind}</div>
                <div className="font-display mt-1 text-lg leading-tight text-foreground">{p.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{p.partner}</div>
              </div>
              <StatusPill status={p.status === "confirmed" ? "active" : p.status === "planning" ? "review" : "approved"} />
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> {p.date}
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
      {items.length === 0 ? <Panel title="No campus programs"><p className="text-sm text-muted-foreground">Request a performance or workshop.</p></Panel> : null}

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="New campus program"
        fields={fields}
        submitLabel="Create program"
        onSubmit={(v) => {
          add({
            title: v.title,
            kind: (v.kind as CampusProgram["kind"]) || "performance",
            partner: v.partner,
            date: v.date ? new Date(v.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
            status: "planning",
            notes: v.notes,
          });
          toast.success("Program created");
        }}
      />
    </PortalLayout>
  );
}
