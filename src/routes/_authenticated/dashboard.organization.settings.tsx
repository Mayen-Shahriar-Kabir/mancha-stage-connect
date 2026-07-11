import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { getOrgNav } from "@/components/portal/org-nav";
import { ProfileSettingsPanel, PasswordSettingsPanel, ToggleSettingsPanel } from "@/components/portal/SettingsPanels";
import { Panel } from "@/components/admin/primitives";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth, ORG_TYPE_LABELS } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/organization/settings")({
  head: () => ({ meta: [{ title: "Settings — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useAuth();
  const orgType = profile?.organization_type;
  return (
    <PortalLayout
      groupLabel="Partner Portal"
      homeUrl="/dashboard/organization"
      nav={getOrgNav(orgType)}
      eyebrow="Settings"
      title="Organization preferences"
    >
      <Panel title="Organization" description="Displayed on your public partner page">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5"><Label>Organization name</Label><Input defaultValue={profile?.organization_name ?? ""} /></div>
          <div className="space-y-1.5"><Label>Type</Label><Input defaultValue={orgType ? ORG_TYPE_LABELS[orgType] : ""} disabled /></div>
          <div className="space-y-1.5"><Label>Website</Label><Input placeholder="https://…" /></div>
          <div className="space-y-1.5"><Label>Contact email</Label><Input defaultValue={profile?.email ?? ""} disabled /></div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Save</Button>
        </div>
      </Panel>

      <ProfileSettingsPanel email={profile?.email} />
      <ToggleSettingsPanel
        title="Partnership preferences"
        rows={[
          { label: "Accept collaboration requests from verified groups", defaultChecked: true },
          { label: "Open to sponsorship inquiries", defaultChecked: true },
          { label: "Show us in the public Partners marquee" },
        ]}
      />
      <ToggleSettingsPanel
        title="Notifications"
        rows={[
          { label: "New requests", defaultChecked: true },
          { label: "Booking confirmations", defaultChecked: true },
          { label: "Weekly analytics digest" },
        ]}
      />
      <PasswordSettingsPanel />
    </PortalLayout>
  );
}
