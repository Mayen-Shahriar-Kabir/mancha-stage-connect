import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/internships")({
  head: () => ({ meta: [{ title: "Internships — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: InternshipsPage,
});

interface InternshipProgram {
  id: string;
  title: string;
  host: string;
  duration: string;
  seats: number;
  registered: number;
  status: "open" | "closed";
}

const seed: InternshipProgram[] = [
  { id: "in1", title: "Stage Craft Apprenticeship", host: "Nagorik Natya Sampradaya", duration: "Feb–Jun 2026", seats: 12, registered: 7, status: "open" },
  { id: "in2", title: "Sound Design Internship", host: "Prachyanat", duration: "Mar–Aug 2026", seats: 6, registered: 6, status: "closed" },
  { id: "in3", title: "Playwriting Residency", host: "Aranyak Natyadal", duration: "Apr–Sep 2026", seats: 4, registered: 2, status: "open" },
  { id: "in4", title: "Production Management Track", host: "Theatre Factory", duration: "Feb–May 2026", seats: 8, registered: 5, status: "open" },
];

interface Recommendation {
  id: string;
  student: string;
  program: string;
  status: "pending" | "accepted" | "rejected";
}

const seedRecs: Recommendation[] = [
  { id: "rc1", student: "Ayesha Karim", program: "Stage Craft Apprenticeship", status: "pending" },
  { id: "rc2", student: "Rifat Chowdhury", program: "Playwriting Residency", status: "accepted" },
];

function InternshipsPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items, add, update, remove } = useDemoList<Recommendation>("univ-recommendations", seedRecs, scope);
  const [open, setOpen] = useState(false);

  const fields: DemoField[] = [
    { name: "student", label: "Student name", type: "text", required: true },
    { name: "program", label: "Internship program", type: "select", required: true, options: seed.map((p) => ({ value: p.title, label: p.title })) },
  ];

  return (
    <PortalLayout
      groupLabel="University Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Internships"
      title="Theatre group internship programs"
      description="Register and recommend students for internships published by theatre groups."
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Recommend student
        </Button>
      }
    >
      <Panel title="Available programs" description={`${seed.length} programs from ecosystem groups`}>
        <div className="grid gap-4 md:grid-cols-2">
          {seed.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{p.host}</div>
                  <div className="font-display mt-1 text-base leading-tight text-foreground">{p.title}</div>
                </div>
                <StatusPill status={p.status === "open" ? "active" : "rejected"} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{p.duration} · {p.registered}/{p.seats} filled</div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Your recommendations" description="Students you've recommended for internships">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven't recommended any students yet.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-4 w-4 text-brand" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{r.student}</div>
                    <div className="text-xs text-muted-foreground">{r.program}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusPill status={r.status === "pending" ? "pending" : r.status === "accepted" ? "approved" : "rejected"} />
                  {r.status === "pending" ? (
                    <>
                      <Button size="sm" variant="outline" className="rounded-full" onClick={() => { update(r.id, { status: "accepted" }); toast.success("Marked accepted"); }}>Accept</Button>
                      <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => update(r.id, { status: "rejected" })}>Reject</Button>
                    </>
                  ) : null}
                  <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { remove(r.id); toast.success("Removed"); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="Recommend a student"
        fields={fields}
        submitLabel="Submit recommendation"
        onSubmit={(v) => {
          add({ student: v.student, program: v.program, status: "pending" });
          toast.success("Recommendation submitted");
        }}
      />
    </PortalLayout>
  );
}
