import { createFileRoute } from "@tanstack/react-router";
import { Edit3, Star, Award, Video, Link2, Camera, Download, ImagePlus } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { artistProfile } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/portfolio")({
  head: () => ({ meta: [{ title: "My Portfolio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="My Portfolio"
      title="Your living stage résumé"
      description="A portfolio that's complete gets 3× more casting invitations. Keep it fresh."
      actions={
        <>
          <Button variant="outline" className="rounded-full"><Download className="mr-1.5 h-4 w-4" /> Export PDF</Button>
          <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"><Edit3 className="mr-1.5 h-4 w-4" /> Edit portfolio</Button>
        </>
      }
    >
      {/* Cover + photo */}
      <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
        <div className="relative h-56 bg-muted md:h-64">
          <img src={artistProfile.cover} alt="" className="h-full w-full object-cover" />
          <Button size="sm" variant="secondary" className="absolute right-4 top-4 rounded-full">
            <Camera className="mr-1.5 h-4 w-4" /> Change cover
          </Button>
        </div>
        <div className="flex flex-col items-start gap-4 p-6 md:flex-row md:items-end md:justify-between">
          <div className="flex items-end gap-4">
            <div className="-mt-16 h-28 w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-lg md:-mt-20 md:h-32 md:w-32">
              <img src={artistProfile.photo} alt={artistProfile.name} className="h-full w-full object-cover object-top" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-foreground">{artistProfile.name}</h2>
              <p className="text-sm text-muted-foreground">{artistProfile.headline}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="rounded-full bg-emerald-500/12 text-emerald-700 dark:text-emerald-400">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Available for bookings
            </Badge>
          </div>
        </div>
      </div>

      {/* Completion */}
      <Panel title="Portfolio Completion" description="Complete these to unlock premium visibility">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Progress value={artistProfile.completion} className="h-2" />
          </div>
          <span className="font-display text-2xl text-foreground">{artistProfile.completion}%</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Add showreel video", "Upload resume", "Verify identity"].map((t) => (
            <Badge key={t} variant="outline" className="rounded-full">{t}</Badge>
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Biography" className="lg:col-span-2">
          <p className="text-sm leading-relaxed text-muted-foreground">{artistProfile.bio}</p>
        </Panel>
        <Panel title="Availability">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="capitalize text-foreground">{artistProfile.availability}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Notice</span><span className="text-foreground">2 weeks</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Region</span><span className="text-foreground">Dhaka, Chittagong</span></div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Panel title="Specialization">
          <div className="flex flex-wrap gap-2">
            {artistProfile.specialization.map((s) => (
              <Badge key={s} className="rounded-full bg-brand/10 text-brand hover:bg-brand/15">{s}</Badge>
            ))}
          </div>
        </Panel>
        <Panel title="Skills">
          <div className="flex flex-wrap gap-2">
            {artistProfile.skills.map((s) => (
              <Badge key={s} variant="outline" className="rounded-full">{s}</Badge>
            ))}
          </div>
        </Panel>
        <Panel title="Languages">
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {artistProfile.languages.map((l) => <li key={l}>· {l}</li>)}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Experience">
          <ul className="space-y-3">
            {[
              { role: "Lead — Nakshi Kanthar Math", org: "Nagorik", period: "2024–Present" },
              { role: "Yaksha — Meghdoot", org: "Aranyak", period: "2023–2024" },
              { role: "Ensemble — Chairs", org: "Theatre Art Unit", period: "2022–2023" },
            ].map((e) => (
              <li key={e.role} className="rounded-lg border border-border/60 p-3">
                <div className="text-sm font-medium text-foreground">{e.role}</div>
                <div className="text-xs text-muted-foreground">{e.org} · {e.period}</div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Awards" action={<Award className="h-4 w-4 text-muted-foreground" />}>
          <ul className="space-y-3">
            {artistProfile.awards.map((a) => (
              <li key={a.title} className="flex items-start gap-3">
                <Star className="mt-0.5 h-4 w-4 text-accent" />
                <div>
                  <div className="text-sm font-medium text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground">{a.year}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Gallery" action={<Button variant="outline" size="sm" className="rounded-full"><ImagePlus className="mr-1.5 h-4 w-4" /> Add photos</Button>}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
            "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=400",
            "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400",
            "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400",
          ].map((src) => (
            <img key={src} src={src} alt="" className="aspect-square w-full rounded-xl object-cover" />
          ))}
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Videos" action={<Video className="h-4 w-4 text-muted-foreground" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { title: "Nakshi Kanthar Math — Trailer", duration: "2:14" },
              { title: "Showreel 2025", duration: "3:48" },
            ].map((v) => (
              <div key={v.title} className="aspect-video rounded-xl border border-border/60 bg-muted/60 p-3 text-sm">
                <div className="grid h-full w-full place-items-center rounded-lg bg-gradient-to-br from-brand/10 to-accent/10">
                  <Video className="h-8 w-8 text-brand/60" />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="font-medium text-foreground">{v.title}</span>
                  <span className="text-muted-foreground">{v.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel title="Social Links & Resume">
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Link2 className="h-4 w-4 text-muted-foreground" /> <span className="text-foreground">{artistProfile.socials.website}</span></li>
            <li className="flex items-center gap-2"><Link2 className="h-4 w-4 text-muted-foreground" /> <span className="text-foreground">Instagram — {artistProfile.socials.instagram}</span></li>
            <li className="flex items-center gap-2"><Link2 className="h-4 w-4 text-muted-foreground" /> <span className="text-foreground">YouTube — {artistProfile.socials.youtube}</span></li>
          </ul>
          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="rounded-full"><Download className="mr-1.5 h-4 w-4" /> Download resume</Button>
            <Button variant="ghost" className="rounded-full">Replace</Button>
          </div>
        </Panel>
      </div>
    </PortalLayout>
  );
}
