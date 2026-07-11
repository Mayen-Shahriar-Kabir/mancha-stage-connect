import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search, Plus, Download, MoreHorizontal, Shield, Ban, Mail } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Panel, StatusPill } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { adminUsers, type AdminUser } from "@/data/admin/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/admin/users")({
  head: () => ({ meta: [{ title: "Users · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: UsersPage,
});

const ROLE_TONE: Record<AdminUser["role"], string> = {
  Admin: "bg-brand/10 text-brand ring-brand/20",
  Artist: "bg-amber-500/10 text-amber-700 dark:text-amber-400 ring-amber-500/20",
  Group: "bg-sky-500/10 text-sky-700 dark:text-sky-400 ring-sky-500/20",
  Organization: "bg-violet-500/10 text-violet-700 dark:text-violet-400 ring-violet-500/20",
  Audience: "bg-muted text-muted-foreground ring-border",
};

function UsersPage() {
  const [q, setQ] = useState("");
  const [role, setRole] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const filtered = useMemo(() => {
    return adminUsers.filter((u) => {
      const matchQ =
        !q ||
        u.name.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase());
      const matchRole = role === "all" || u.role === role;
      const matchStatus = status === "all" || u.status === status;
      return matchQ && matchRole && matchStatus;
    });
  }, [q, role, status]);

  return (
    <AdminLayout
      eyebrow="Community"
      title="Users"
      description="Every artist, group, organization, and audience member on Mancha."
      actions={
        <>
          <Button variant="outline" className="rounded-full">
            <Download className="mr-1.5 h-4 w-4" /> Export
          </Button>
          <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="mr-1.5 h-4 w-4" /> Invite user
          </Button>
        </>
      }
    >
      <Panel title="Directory" description={`${filtered.length} of ${adminUsers.length} users`}>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or email…"
              className="h-10 rounded-full pl-9"
            />
          </div>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-10 w-full rounded-full md:w-40"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Artist">Artist</SelectItem>
              <SelectItem value="Group">Group</SelectItem>
              <SelectItem value="Organization">Organization</SelectItem>
              <SelectItem value="Audience">Audience</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-full rounded-full md:w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Joined</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="cursor-pointer transition-colors hover:bg-muted/30"
                  onClick={() => setSelected(u)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-brand/10 text-xs text-brand">
                          {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={`rounded-full ring-1 ${ROLE_TONE[u.role]} border-transparent`}>
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3"><StatusPill status={u.status} /></td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {new Date(u.joined).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                    No users match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      <Drawer open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DrawerContent>
          <DrawerHeader className="mx-auto w-full max-w-2xl">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-brand text-brand-foreground">
                  {selected?.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DrawerTitle className="font-display text-2xl">{selected?.name}</DrawerTitle>
                <DrawerDescription>{selected?.email} · {selected?.location}</DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <div className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-3 px-6 pb-4">
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Role</p>
              <p className="mt-1 text-sm font-medium">{selected?.role}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
              <div className="mt-1">{selected && <StatusPill status={selected.status} />}</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Joined</p>
              <p className="mt-1 text-sm">{selected && new Date(selected.joined).toLocaleDateString()}</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Activity</p>
              <p className="mt-1 text-sm">12 bookings · 3 reviews</p>
            </div>
          </div>
          <DrawerFooter>
            <div className="mx-auto flex w-full max-w-2xl gap-2">
              <Button variant="outline" className="flex-1 rounded-full">
                <Mail className="mr-1.5 h-4 w-4" /> Message
              </Button>
              <Button variant="outline" className="flex-1 rounded-full">
                <Shield className="mr-1.5 h-4 w-4" /> Change role
              </Button>
              <Button variant="outline" className="flex-1 rounded-full text-rose-600 hover:text-rose-700">
                <Ban className="mr-1.5 h-4 w-4" /> Suspend
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </AdminLayout>
  );
}
