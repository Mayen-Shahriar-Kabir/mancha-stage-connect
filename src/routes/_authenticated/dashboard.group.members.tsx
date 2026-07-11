import { createFileRoute } from "@tanstack/react-router";
import { UserPlus, MessageSquare, Eye, Trash2, Calendar } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { members, type Availability } from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/members")({
  head: () => ({ meta: [{ title: "Members · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: MembersPage,
});

const AVAIL_STYLES: Record<Availability, string> = {
  available: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400 ring-emerald-500/20",
  rehearsing: "bg-brand/10 text-brand ring-brand/20",
  on_tour: "bg-sky-500/12 text-sky-700 dark:text-sky-400 ring-sky-500/20",
  on_leave: "bg-amber-500/12 text-amber-700 dark:text-amber-400 ring-amber-500/20",
};

function MembersPage() {
  return (
    <GroupLayout
      eyebrow="Ensemble"
      title="Members"
      description="Your artists, designers, and crew — the beating heart of every production."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <UserPlus className="mr-1.5 h-4 w-4" /> Invite member
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((m) => (
          <article
            key={m.id}
            className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={m.photo}
                alt={m.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span
                className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ring-1 backdrop-blur ${AVAIL_STYLES[m.availability]}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                {m.availability.replace("_", " ")}
              </span>
              <div className="absolute bottom-3 left-3 right-3 flex items-end gap-2">
                <Avatar className="h-11 w-11 border-2 border-white/80 shadow">
                  <AvatarImage src={m.photo} alt={m.name} />
                  <AvatarFallback>{m.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 pb-0.5">
                  <p className="truncate text-sm font-semibold text-white">{m.name}</p>
                  <p className="truncate text-[11px] text-white/80">{m.role}</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <dl className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <dt className="uppercase tracking-wider text-muted-foreground">Experience</dt>
                  <dd className="mt-0.5 font-medium text-foreground">{m.yearsExperience} yrs</dd>
                </div>
                <div>
                  <dt className="uppercase tracking-wider text-muted-foreground">Joined</dt>
                  <dd className="mt-0.5 flex items-center gap-1 font-medium text-foreground">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    {new Date(m.joined).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 flex gap-1.5">
                <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs">
                  <Eye className="mr-1 h-3.5 w-3.5" /> View
                </Button>
                <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs">
                  <MessageSquare className="mr-1 h-3.5 w-3.5" /> Message
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 rounded-full p-0 text-rose-600 hover:bg-rose-500/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </GroupLayout>
  );
}
