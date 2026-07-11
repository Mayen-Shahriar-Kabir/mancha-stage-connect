import { createFileRoute } from "@tanstack/react-router";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { AUDIENCE_NAV } from "@/components/portal/audience-nav";
import { ProfileSettingsPanel, PasswordSettingsPanel, ToggleSettingsPanel } from "@/components/portal/SettingsPanels";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated/dashboard/audience/settings")({
  head: () => ({ meta: [{ title: "Settings — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile } = useAuth();
  return (
    <PortalLayout
      groupLabel="Audience Lounge"
      homeUrl="/dashboard/audience"
      nav={AUDIENCE_NAV}
      eyebrow="Settings"
      title="Your Mancha preferences"
    >
      <ProfileSettingsPanel email={profile?.email} />
      <ToggleSettingsPanel
        title="Preferences"
        rows={[
          { label: "Personalized recommendations", defaultChecked: true },
          { label: "Show me livestream premieres" },
          { label: "Include film & OTT suggestions", defaultChecked: true },
        ]}
      />
      <ToggleSettingsPanel
        title="Notifications"
        rows={[
          { label: "Ticket confirmations", defaultChecked: true },
          { label: "New shows from groups I follow", defaultChecked: true },
          { label: "Weekly digest" },
        ]}
      />
      <PasswordSettingsPanel />
    </PortalLayout>
  );
}
