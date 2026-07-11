import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/auditions")({
  head: () => ({ meta: [{ title: "Auditions — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: AuditionsPage,
});

export interface Audition {
  id: string;
  title: string;
  project: string;
  role: string;
  deadline: string;
  applications: number;
  status: "open" | "closed" | "draft";
  description?: string;
}

export const seedAuditions: Audition[] = [
  { id: "au1", title: "Lead — 'Rakter Onnesha'", project: "Rakter Onnesha (Feature)", role: "Female lead, 25-32", deadline: "Feb 20, 2026", applications: 148, status: "open" },
  { id: "au2", title: "Supporting cast — 'Purbo Bangla'", project: "Purbo Bangla (Web Series)", role: "5 supporting roles", deadline: "Feb 28, 2026", applications: 62, status: "open" },
  { id: "au3", title: "Ensemble — Season pilot", project: "Untitled OTT Pilot", role: "Ensemble (8-12)", deadline: "Jan 30, 2026", applications: 213, status: "closed" },
];

function AuditionsPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items, add, update, remove } = useDemoList<Audition>("org-auditions", seedAuditions, scope);
  const [open, setOpen] = useState(false);

  const fields: DemoField[] = [
    { name: "title", label: "Casting call title", type: "text", required: true },
    { name: "project", label: "Project", type: "text", required: true },
    { name: "role", label: "Role details", type: "text", required: true, placeholder: "Female lead, 25-32" },
    { name: "deadline", label: "Deadline", type: "date", required: true },
    { name: "description", label: "Description", type: "textarea" },
  ];

  return (
    <PortalLayout
      groupLabel="Film & OTT"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Auditions"
      title="Casting calls & discovery"
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create audition
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <div key={a.id} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{a.project}</div>
                <div className="font-display mt-1 text-lg leading-tight text-foreground">{a.title}</div>
              </div>
              <StatusPill status={a.status === "open" ? "active" : a.status === "draft" ? "review" : "rejected"} />
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>Role · {a.role}</div>
              <div>Deadline · {a.deadline}</div>
              <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> {a.applications} applications</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-full flex-1">
                <Link to="/dashboard/organization/applications" search={{ audition: a.id } as never}>Review</Link>
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => update(a.id, { status: a.status === "open" ? "closed" : "open" })}>
                {a.status === "open" ? "Close" : "Reopen"}
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { remove(a.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 ? <Panel title="No auditions yet"><p className="text-sm text-muted-foreground">Create your first casting call.</p></Panel> : null}

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Create audition"
        fields={fields}
        submitLabel="Publish audition"
        onSubmit={(v) => {
          add({
            title: v.title, project: v.project, role: v.role,
            deadline: v.deadline ? new Date(v.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "TBD",
            applications: 0, status: "open", description: v.description,
          });
          toast.success("Audition published");
        }}
      />
    </PortalLayout>
  );
}
