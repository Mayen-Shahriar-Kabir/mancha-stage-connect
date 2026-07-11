import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DEMO_ACCOUNTS,
  getDemoAccountStatuses,
  seedDemoAccounts,
} from "@/lib/demo.functions";

export const Route = createFileRoute("/_authenticated/dashboard/admin/demo-accounts")({
  head: () => ({ meta: [{ title: "Demo Accounts · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: DemoAccountsPage,
});

function DemoAccountsPage() {
  const getStatuses = useServerFn(getDemoAccountStatuses);
  const seed = useServerFn(seedDemoAccounts);
  const qc = useQueryClient();

  const { data: statuses = [], isLoading } = useQuery({
    queryKey: ["demo-account-statuses"],
    queryFn: () => getStatuses(),
  });

  const mutate = useMutation({
    mutationFn: () => seed(),
    onSuccess: (results) => {
      const created = results.filter((r) => r.status === "created").length;
      const updated = results.filter((r) => r.status === "updated").length;
      const errors = results.filter((r) => r.status === "error");
      toast.success(`Seeded demo accounts — ${created} created, ${updated} refreshed`);
      if (errors.length) toast.error(`${errors.length} failed: ${errors.map((e) => e.email).join(", ")}`);
      qc.invalidateQueries({ queryKey: ["demo-account-statuses"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Failed to seed demo accounts"),
  });

  const statusFor = (email: string) =>
    statuses.find((s) => s.email.toLowerCase() === email.toLowerCase())?.status ?? "not created";

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <AdminLayout
      eyebrow="Demo Mode"
      title="Demo Accounts"
      description="Pre-seeded credentials for every role. Use these to demonstrate any dashboard instantly."
      actions={
        <Button
          onClick={() => mutate.mutate()}
          disabled={mutate.isPending}
          className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {mutate.isPending ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Sparkles className="mr-1.5 h-4 w-4" />}
          {statuses.length === DEMO_ACCOUNTS.length ? "Re-seed / refresh" : "Seed demo accounts"}
        </Button>
      }
    >
      <Panel
        title="Credentials"
        description="All passwords are 1234. Audience is active on signup; all seeded accounts are pre-approved."
      >
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Password</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {DEMO_ACCOUNTS.map((a) => {
                const st = statusFor(a.email);
                return (
                  <tr key={a.email} className="hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{a.label}</div>
                      {a.organization_name && (
                        <div className="text-xs text-muted-foreground">{a.organization_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copy(a.email)}
                        className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-xs hover:bg-muted"
                      >
                        {a.email} <Copy className="h-3 w-3 opacity-60" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => copy(a.password)}
                        className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-xs hover:bg-muted"
                      >
                        {a.password} <Copy className="h-3 w-3 opacity-60" />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      {isLoading ? (
                        <Badge variant="outline" className="rounded-full">Checking…</Badge>
                      ) : st === "active" || st === "pending" || st === "suspended" ? (
                        <StatusPill status={st as "active" | "pending" | "suspended"} />
                      ) : (
                        <Badge variant="outline" className="rounded-full text-muted-foreground">Not created</Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-xs text-muted-foreground">
          <strong className="text-foreground">Demo Mode is active.</strong> Email verification is off,
          passwords may be as short as 4 characters, and admin approval is bypassed for these seeded
          accounts. Restore production settings before going live.
        </div>
      </Panel>
    </AdminLayout>
  );
}
