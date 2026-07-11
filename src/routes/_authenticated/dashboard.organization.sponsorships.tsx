import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { Panel, StatusPill, StatCard } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DemoFormDialog, type DemoField } from "@/components/business/DemoFormDialog";
import { useDemoList } from "@/lib/demo-store";
import { useAuth } from "@/hooks/use-auth";
import { Handshake, TrendingUp, Target } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/organization/sponsorships")({
  head: () => ({ meta: [{ title: "Sponsorships — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: SponsorshipsPage,
});

interface Sponsorship {
  id: string;
  production: string;
  group: string;
  amountBDT: number;
  pledgedBDT: number;
  status: "active" | "pending" | "completed";
  season: string;
}

const seed: Sponsorship[] = [
  { id: "s1", production: "Rakter Onnesha", group: "Nagorik Natya Sampradaya", amountBDT: 1_500_000, pledgedBDT: 800_000, status: "active", season: "Winter 2026" },
  { id: "s2", production: "Nakshi Kanthar Math", group: "Aranyak Natyadal", amountBDT: 900_000, pledgedBDT: 900_000, status: "completed", season: "2025" },
  { id: "s3", production: "Meghdoot Revival", group: "Prachyanat", amountBDT: 600_000, pledgedBDT: 200_000, status: "pending", season: "Spring 2026" },
];

function SponsorshipsPage() {
  const { profile } = useAuth();
  const scope = profile?.id ?? "demo";
  const { items, add, update, remove } = useDemoList<Sponsorship>("org-sponsorships", seed, scope);
  const [open, setOpen] = useState(false);

  const total = items.reduce((s, x) => s + x.amountBDT, 0);
  const pledged = items.reduce((s, x) => s + x.pledgedBDT, 0);

  const fields: DemoField[] = [
    { name: "production", label: "Production", type: "text", required: true },
    { name: "group", label: "Theatre group", type: "text", required: true },
    { name: "season", label: "Season", type: "text", placeholder: "e.g. Winter 2026" },
    { name: "amountBDT", label: "Sponsorship amount (BDT)", type: "number", required: true },
    { name: "pledgedBDT", label: "Already pledged (BDT)", type: "number" },
  ];

  return (
    <PortalLayout
      groupLabel="Corporate Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(profile?.organization_type)}
      eyebrow="Sponsorships"
      title="Cultural sponsorship portfolio"
      description="CSR-eligible investments in Bangladesh's performing arts."
      actions={
        <Button onClick={() => setOpen(true)} className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> New sponsorship
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total committed" value={`৳${(total / 1_00_000).toFixed(1)}L`} icon={Handshake} />
        <StatCard label="Pledged so far" value={`৳${(pledged / 1_00_000).toFixed(1)}L`} icon={TrendingUp} />
        <StatCard label="Active sponsorships" value={String(items.filter((i) => i.status === "active").length)} icon={Target} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((s) => {
          const pct = Math.min(100, Math.round((s.pledgedBDT / (s.amountBDT || 1)) * 100));
          return (
            <div key={s.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.group}</div>
                  <div className="font-display mt-1 text-lg leading-tight text-foreground">{s.production}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.season}</div>
                </div>
                <StatusPill status={s.status === "active" ? "active" : s.status === "pending" ? "review" : "approved"} />
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">৳{s.pledgedBDT.toLocaleString()} of ৳{s.amountBDT.toLocaleString()}</span>
                  <span className="font-medium text-foreground">{pct}%</span>
                </div>
                <Progress value={pct} className="mt-1.5 h-1.5" />
              </div>
              <div className="mt-4 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full flex-1" onClick={() => update(s.id, { status: "completed", pledgedBDT: s.amountBDT })}>
                  Mark completed
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => { remove(s.id); toast.success("Removed"); }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      {items.length === 0 ? <Panel title="No sponsorships yet"><p className="text-sm text-muted-foreground">Sponsor a production to appear here.</p></Panel> : null}

      <DemoFormDialog
        open={open}
        onOpenChange={setOpen}
        title="New sponsorship"
        fields={fields}
        submitLabel="Add sponsorship"
        onSubmit={(v) => {
          add({
            production: v.production,
            group: v.group,
            season: v.season || "—",
            amountBDT: Number(v.amountBDT) || 0,
            pledgedBDT: Number(v.pledgedBDT) || 0,
            status: "pending",
          });
          toast.success("Sponsorship added");
        }}
      />
    </PortalLayout>
  );
}
