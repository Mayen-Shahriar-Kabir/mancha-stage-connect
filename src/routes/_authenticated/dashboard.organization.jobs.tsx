import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/jobs")({
  head: () => ({ meta: [{ title: "Jobs — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: JobsPage,
});

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  employment: string;
  compensation: string;
  applications: number;
  status: "open" | "closed" | "draft";
}

export const seedJobs: Job[] = [
  { id: "j1", title: "Assistant Director", department: "Production", location: "Dhaka", employment: "Full-time · 6 months", compensation: "৳45,000/mo", applications: 32, status: "open" },
  { id: "j2", title: "Sound Designer", department: "Post-production", location: "Remote / Dhaka", employment: "Contract", compensation: "৳120,000 project", applications: 18, status: "open" },
  { id: "j3", title: "Season 24 Stage Manager", department: "Operations", location: "Dhaka", employment: "Seasonal", compensation: "Negotiable", applications: 41, status: "closed" },
];

function JobsPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items, add, update, remove } = useDemoList<Job>("org-jobs", seedJobs, scope);
  const [open, setOpen] = useState(false);

  const fields: DemoField[] = [
    { name: "title", label: "Job title", type: "text", required: true },
    { name: "department", label: "Department", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "employment", label: "Employment type", type: "text", placeholder: "Full-time / Contract" },
    { name: "compensation", label: "Compensation", type: "text" },
  ];

  return (
    <PortalLayout
      groupLabel="Film & OTT"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Jobs"
      title="Crew, staff & production hiring"
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create job
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((j) => (
          <div key={j.id} className="rounded-2xl border border-border/60 bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground"><Briefcase className="h-3 w-3" /> {j.department}</div>
                <div className="font-display mt-1 text-lg leading-tight text-foreground">{j.title}</div>
              </div>
              <StatusPill status={j.status === "open" ? "active" : j.status === "draft" ? "review" : "rejected"} />
            </div>
            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <div>{j.location} · {j.employment}</div>
              <div>Compensation · {j.compensation}</div>
              <div>{j.applications} applications</div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline" className="rounded-full flex-1">
                <Link to="/dashboard/organization/applications" search={{ job: j.id } as never}>View applicants</Link>
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full" onClick={() => update(j.id, { status: j.status === "open" ? "closed" : "open" })}>
                {j.status === "open" ? "Close" : "Reopen"}
              </Button>
              <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { remove(j.id); toast.success("Removed"); }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {items.length === 0 ? <Panel title="No jobs yet"><p className="text-sm text-muted-foreground">Post your first role.</p></Panel> : null}

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Create job posting"
        fields={fields}
        submitLabel="Publish job"
        onSubmit={(v) => {
          add({ title: v.title, department: v.department, location: v.location, employment: v.employment || "Full-time", compensation: v.compensation || "Negotiable", applications: 0, status: "open" });
          toast.success("Job published");
        }}
      />
    </PortalLayout>
  );
}
