import { createFileRoute } from "@tanstack/react-router";
import { Plus, Calendar, MapPin, Users, Megaphone } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { communityEvents, announcements, gallery } from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/community")({
  head: () => ({ meta: [{ title: "Community · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: CommunityPage,
});

function CommunityPage() {
  return (
    <GroupLayout
      eyebrow="Community"
      title="Meetups & Announcements"
      description="Cultivate your following — from backstage tours to open-mic nights."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create Meetup
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {communityEvents.map((e) => {
          const pct = Math.round((e.registrations / e.capacity) * 100);
          return (
            <article key={e.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative h-40 overflow-hidden">
                <img src={e.cover} alt={e.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-brand backdrop-blur">
                  {new Date(e.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}
                </span>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display text-lg leading-tight text-white">{e.title}</h3>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.venue}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(e.date).toLocaleDateString("en-GB", { weekday: "short" })}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3 w-3" /> {e.registrations} / {e.capacity} registered</span>
                    <span className="font-medium text-brand">{pct}%</span>
                  </div>
                  <Progress value={pct} className="mt-1 h-1.5" />
                </div>
                <Button size="sm" variant="outline" className="w-full rounded-full text-xs">Manage event</Button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Panel title="Announcements" description="Broadcast to followers & members" className="lg:col-span-2"
          action={<Button size="sm" variant="ghost" className="text-xs"><Megaphone className="mr-1 h-3.5 w-3.5" /> New</Button>}
        >
          <ul className="space-y-3">
            {announcements.map((a) => (
              <li key={a.id} className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <span className="shrink-0 text-[11px] text-muted-foreground">{a.posted}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{a.body}</p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Gallery" description="Photos from recent meetups" className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((src, i) => (
              <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted">
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </GroupLayout>
  );
}
