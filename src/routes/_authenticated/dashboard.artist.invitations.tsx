import { createFileRoute } from "@tanstack/react-router";
import { Check, X, MailOpen } from "lucide-react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { invitations } from "@/data/portal/artist";

export const Route = createFileRoute("/_authenticated/dashboard/artist/invitations")({
  head: () => ({ meta: [{ title: "Invitations — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: InvitationsPage,
});

function InvitationsPage() {
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Invitations"
      title="You've been asked"
      description="Direct invitations from groups and organizations who want to work with you."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {invitations.map((i) => (
          <div key={i.id} className="rounded-2xl border border-border/60 bg-card p-6 transition hover:shadow-md">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand">
                <MailOpen className="h-5 w-5" />
              </span>
              <div>
                <div className="font-display text-lg text-foreground">{i.group}</div>
                <div className="text-xs text-muted-foreground">Received {i.received}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-semibold text-foreground">{i.role}</div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.message}</p>
            </div>
            <div className="mt-6 flex gap-2">
              <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                <Check className="mr-1.5 h-4 w-4" /> Accept
              </Button>
              <Button variant="outline" className="rounded-full">
                <X className="mr-1.5 h-4 w-4" /> Decline
              </Button>
              <Button variant="ghost" className="ml-auto rounded-full text-muted-foreground">Reply</Button>
            </div>
          </div>
        ))}
      </div>
      {invitations.length === 0 && (
        <Panel title="No invitations yet"><p className="text-sm text-muted-foreground">Keep your portfolio fresh — visibility drives invitations.</p></Panel>
      )}
    </PortalLayout>
  );
}
