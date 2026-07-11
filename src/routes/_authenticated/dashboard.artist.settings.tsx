import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { ARTIST_NAV } from "@/components/portal/artist-nav";
import { ProfileSettingsPanel, PasswordSettingsPanel, ToggleSettingsPanel } from "@/components/portal/SettingsPanels";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/artist/settings")({
  head: () => ({ meta: [{ title: "Settings — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useAuth();
  return (
    <PortalLayout
      groupLabel="Artist Studio"
      homeUrl="/dashboard/artist"
      nav={ARTIST_NAV}
      eyebrow="Settings"
      title="Your Mancha preferences"
    >
      <ProfileSettingsPanel email={profile?.email} />
      <ToggleSettingsPanel
        title="Availability"
        description="Signal to groups whether you're taking new roles"
        rows={[
          { label: "Open to auditions", description: "Show your profile in casting search", defaultChecked: true },
          { label: "Available for touring", description: "Willing to travel outside Dhaka" },
          { label: "Open to film / OTT", description: "Include film & OTT invitations", defaultChecked: true },
        ]}
      />
      <ToggleSettingsPanel
        title="Notifications"
        rows={[
          { label: "New invitations", defaultChecked: true },
          { label: "Application status changes", defaultChecked: true },
          { label: "Weekly opportunity digest" },
        ]}
      />
      <PasswordSettingsPanel />
    </PortalLayout>
  );
}
