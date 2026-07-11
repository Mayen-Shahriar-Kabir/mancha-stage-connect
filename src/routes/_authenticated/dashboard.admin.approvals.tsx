import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, X, Eye, Filter, Inbox } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Panel, StatCard, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { pendingApprovalsList, type Approval } from "@/data/admin/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/admin/approvals")({
  head: () => ({ meta: [{ title: "Approvals · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: ApprovalsPage,
});

function ApprovalsPage() {
  const [selected, setSelected] = useState<Approval | null>(null);

  return (
    <AdminLayout
      eyebrow="Moderation"
      title="Approvals"
      description="Review artists, groups, and organizations before they join the ecosystem."
      actions={
        <Button variant="outline" className="rounded-full">
          <Filter className="mr-1.5 h-4 w-4" /> Filter
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Pending" value="34" icon={Inbox} hint="Across all roles" />
        <StatCard label="Approved (7d)" value="82" delta={12.4} />
        <StatCard label="Rejected (7d)" value="9" delta={-4.1} />
        <StatCard label="Avg. review time" value="6h 12m" />
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-muted/40">
          <TabsTrigger value="all">All ({pendingApprovalsList.length})</TabsTrigger>
          <TabsTrigger value="artists">Artists</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="orgs">Organizations</TabsTrigger>
        </TabsList>

        {[
          { key: "all", filter: (_: Approval) => true },
          { key: "artists", filter: (a: Approval) => a.role === "Theatre Artist" },
          { key: "groups", filter: (a: Approval) => a.role === "Theatre Group" },
          { key: "orgs", filter: (a: Approval) => a.role === "Organization" },
        ].map((tab) => (
          <TabsContent key={tab.key} value={tab.key} className="mt-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {pendingApprovalsList.filter(tab.filter).map((a) => (
                <ApprovalCard key={a.id} approval={a} onView={() => setSelected(a)} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="font-display text-2xl">{selected?.name}</DrawerTitle>
            <DrawerDescription>
              {selected?.role} · Submitted {selected && new Date(selected.submittedAt).toLocaleString()}
            </DrawerDescription>
          </DrawerHeader>
          <div className="mx-auto w-full max-w-2xl space-y-4 px-6 pb-4">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Contact</p>
              <p className="mt-1 text-sm text-foreground">{selected?.email}</p>
            </div>
            {selected?.note ? (
              <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Submission note</p>
                <p className="mt-1 text-sm text-foreground">{selected.note}</p>
              </div>
            ) : null}
            <div className="rounded-xl border border-dashed border-border/60 p-4 text-xs text-muted-foreground">
              Full profile review will appear here — bio, portfolio links, verification documents.
            </div>
          </div>
          <DrawerFooter>
            <div className="mx-auto flex w-full max-w-2xl gap-2">
              <Button className="flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90">
                <Check className="mr-1.5 h-4 w-4" /> Approve
              </Button>
              <Button variant="outline" className="flex-1 rounded-full">
                <X className="mr-1.5 h-4 w-4" /> Reject
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AdminLayout>
  );
}

function ApprovalCard({ approval, onView }: { approval: Approval; onView: () => void }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar className="h-11 w-11">
          <AvatarFallback className="bg-brand/10 text-brand">
            {approval.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{approval.name}</p>
          <p className="truncate text-xs text-muted-foreground">{approval.email}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <StatusPill status="pending" />
            <span className="text-[11px] text-muted-foreground">{approval.role}</span>
          </div>
        </div>
      </div>
      {approval.note ? (
        <p className="mt-3 line-clamp-2 text-xs text-muted-foreground">{approval.note}</p>
      ) : null}
      <div className="mt-4 flex gap-1.5">
        <Button size="sm" className="h-8 flex-1 rounded-full bg-emerald-600 text-white hover:bg-emerald-600/90">
          <Check className="mr-1 h-3.5 w-3.5" /> Approve
        </Button>
        <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full">
          <X className="mr-1 h-3.5 w-3.5" /> Reject
        </Button>
        <Button size="sm" variant="ghost" className="h-8 rounded-full px-2.5" onClick={onView}>
          <Eye className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
