import { createFileRoute } from "@tanstack/react-router";
import { Plus, Users, Award, Clock } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { StatCard } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { programs } from "@/data/group/placeholder";

export const Route = createFileRoute("/_authenticated/dashboard/group/learning")({
  head: () => ({ meta: [{ title: "Learning · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: LearningPage,
});

function LearningPage() {
  const totalEnrolled = programs.reduce((s, p) => s + p.enrolled, 0);
  const totalCerts = programs.reduce((s, p) => s + p.certificates, 0);

  return (
    <GroupLayout
      eyebrow="Academy"
      title="Learning & Training"
      description="Workshops, masterclasses, and certification tracks run by your ensemble."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="mr-1.5 h-4 w-4" /> Create Training
        </Button>
      }
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Active Programs" value={programs.length.toString()} icon={Award} />
        <StatCard label="Students Enrolled" value={totalEnrolled.toString()} delta={9.4} icon={Users} />
        <StatCard label="Certificates Issued" value={totalCerts.toString()} delta={14.2} icon={Award} />
        <StatCard label="Avg. Duration" value="5.2 wks" icon={Clock} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-2">
        {programs.map((p) => {
          const pct = Math.round((p.enrolled / p.seats) * 100);
          return (
            <article key={p.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex flex-col sm:flex-row">
                <div className="relative h-44 shrink-0 sm:h-auto sm:w-44">
                  <img src={p.cover} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:bg-gradient-to-r" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                    {p.format}
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div>
                    <h3 className="font-display text-lg leading-tight text-foreground">{p.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Led by <span className="font-medium text-foreground">{p.instructor}</span> · {p.duration}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{p.enrolled} / {p.seats} seats</span>
                      <span className="font-medium text-brand">{pct}%</span>
                    </div>
                    <Progress value={pct} className="mt-1 h-1.5" />
                  </div>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent/15 px-2 py-0.5 font-medium text-brand">
                      <Award className="h-3 w-3" /> {p.certificates} certificates
                    </span>
                  </div>

                  <div className="mt-auto flex gap-2 pt-1">
                    <Button size="sm" variant="outline" className="h-8 flex-1 rounded-full text-xs">Cohort details</Button>
                    <Button size="sm" className="h-8 flex-1 rounded-full bg-brand text-xs text-brand-foreground hover:bg-brand/90">Enroll students</Button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </GroupLayout>
  );
}
