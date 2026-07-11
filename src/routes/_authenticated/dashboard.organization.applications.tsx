import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/applications")({
  head: () => ({ meta: [{ title: "Applications — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ApplicationsPage,
});

interface Applicant {
  id: string;
  name: string;
  role: string;
  target: string;
  submittedAt: string;
  status: "new" | "shortlisted" | "rejected";
  reel?: string;
}

const seed: Applicant[] = [
  { id: "ap1", name: "Nusrat Jahan", role: "Actor · Lead", target: "Rakter Onnesha", submittedAt: "2h ago", status: "new" },
  { id: "ap2", name: "Rifat Chowdhury", role: "Actor · Supporting", target: "Rakter Onnesha", submittedAt: "5h ago", status: "shortlisted" },
  { id: "ap3", name: "Sabina Yasmin", role: "Actor · Ensemble", target: "Purbo Bangla", submittedAt: "Yesterday", status: "new" },
  { id: "ap4", name: "Tanvir Alam", role: "Assistant Director", target: "Assistant Director role", submittedAt: "2 days", status: "rejected" },
  { id: "ap5", name: "Farhana Mithila", role: "Actor · Lead", target: "Rakter Onnesha", submittedAt: "3 days", status: "shortlisted" },
];

function ApplicationsPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items, update } = useDemoList<Applicant>("org-applications", seed, scope);

  const setStatus = (id: string, status: Applicant["status"]) => {
    update(id, { status });
    toast.success(status === "shortlisted" ? "Shortlisted" : status === "rejected" ? "Rejected" : "Reset");
  };

  const groups = [
    { key: "new" as const, label: "New" },
    { key: "shortlisted" as const, label: "Shortlisted" },
    { key: "rejected" as const, label: "Rejected" },
  ];

  return (
    <PortalLayout
      groupLabel="Film & OTT"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Applications"
      title="Review casting & job applications"
      description={`${items.length} applications across your open calls`}
    >
      {groups.map((g) => {
        const rows = items.filter((a) => a.status === g.key);
        return (
          <Panel key={g.key} title={`${g.label} (${rows.length})`}>
            {rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing here yet.</p>
            ) : (
              <ul className="divide-y divide-border/60">
                {rows.map((a) => (
                  <li key={a.id} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-brand/10 text-brand text-xs">{a.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-foreground">{a.name}</div>
                        <div className="text-xs text-muted-foreground">{a.role} · {a.target}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{a.submittedAt}</span>
                      <StatusPill status={a.status === "new" ? "pending" : a.status === "shortlisted" ? "active" : "rejected"} />
                      {a.status !== "shortlisted" ? <Button size="sm" variant="outline" className="rounded-full" onClick={() => setStatus(a.id, "shortlisted")}>Shortlist</Button> : null}
                      {a.status !== "rejected" ? <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => setStatus(a.id, "rejected")}>Reject</Button> : null}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        );
      })}
    </PortalLayout>
  );
}
