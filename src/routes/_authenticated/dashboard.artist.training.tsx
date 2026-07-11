import { createFileRoute } from "@tanstack/react-router";
import { Download, Award, GraduationCap } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { training, certificates } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/training")({
  head: () => ({ meta: [{ title: "Training & Certificates — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: TrainingPage,
});

function TrainingPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Training & Certificates"
      title="Craft, sharpened"
      description="Workshops in progress and credentials you can show casting directors."
    >
      <Panel title="Training in progress">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {training.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/8 text-brand">
                  <GraduationCap className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.provider} · {t.hours}h</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium text-foreground">{t.progress}%</span>
                </div>
                <Progress value={t.progress} className="mt-1.5 h-1.5" />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Issued certificates" action={<Button variant="outline" size="sm" className="rounded-full">Export all</Button>}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((c) => (
            <div key={c.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-background to-accent/5 p-5">
              <div className="flex items-start justify-between">
                <Award className="h-6 w-6 text-accent" />
                <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand">
                  Verified
                </span>
              </div>
              <div className="mt-4 font-display text-base text-foreground">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.issuer} · Issued {c.issued}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">ID: {c.credentialId}</div>
              <Button variant="outline" size="sm" className="mt-4 rounded-full">
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download
              </Button>
            </div>
          ))}
        </div>
      </Panel>
    </PortalLayout>
  );
}
