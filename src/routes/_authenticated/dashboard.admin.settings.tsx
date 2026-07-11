import { createFileRoute } from "@tanstack/react-router";
import { Save, Upload, AlertTriangle } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_authenticated/dashboard/admin/settings")({
  head: () => ({ meta: [{ title: "Settings · Admin — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AdminLayout
      eyebrow="Configuration"
      title="Settings"
      description="Platform, brand, and operational controls — placeholder only."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Save className="mr-1.5 h-4 w-4" /> Save changes
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Platform" description="Public-facing metadata and defaults">
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label htmlFor="platform-name">Platform name</Label>
              <Input id="platform-name" defaultValue="Mancha" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="platform-tag">Tagline</Label>
              <Input id="platform-tag" defaultValue="Bangladesh's Digital Theatre Ecosystem" />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="platform-desc">Description</Label>
              <Textarea
                id="platform-desc"
                rows={3}
                defaultValue="A modern platform connecting artists, groups, audiences, and institutions."
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="platform-contact">Contact email</Label>
              <Input id="platform-contact" type="email" defaultValue="hello@mancha.bd" />
            </div>
          </div>
        </Panel>

        <Panel title="Brand" description="Colors, typography, and identity">
          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label>Logo</Label>
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-border p-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold">
                  <span className="font-display text-xl">M</span>
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">mancha-logo.svg</p>
                  <p className="text-xs text-muted-foreground">1.2 KB · SVG</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-full">
                  <Upload className="mr-1.5 h-4 w-4" /> Replace
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="brand-primary">Primary color</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-lg border border-border" style={{ background: "#6B1022" }} />
                  <Input id="brand-primary" defaultValue="#6B1022" />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="brand-accent">Accent color</Label>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-lg border border-border" style={{ background: "#D4AF37" }} />
                  <Input id="brand-accent" defaultValue="#D4AF37" />
                </div>
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="brand-font">Display font</Label>
              <Input id="brand-font" defaultValue="Playfair Display" />
            </div>
          </div>
        </Panel>

        <Panel title="Notifications" description="Ecosystem-wide communication defaults">
          <div className="space-y-1">
            <SettingRow title="Email notifications" hint="Send system emails on approvals and status changes" defaultChecked />
            <Separator />
            <SettingRow title="Weekly digest" hint="Curated highlights for audience members" defaultChecked />
            <Separator />
            <SettingRow title="SMS alerts" hint="Critical alerts to admin phone numbers" />
            <Separator />
            <SettingRow title="Public review notifications" hint="Notify groups of new reviews" defaultChecked />
          </div>
        </Panel>

        <Panel title="Operational" description="Access, safety, and downtime controls">
          <div className="space-y-1">
            <SettingRow title="Allow new registrations" hint="Turn off to pause the public sign-up form" defaultChecked />
            <Separator />
            <SettingRow title="Require admin approval" hint="Artists, groups and orgs must be approved" defaultChecked />
            <Separator />
            <SettingRow title="Beta features" hint="Enable in-progress product experiments" />
          </div>

          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Maintenance mode</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Temporarily take the public site offline. Only admins remain able to sign in.
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </Panel>
      </div>
    </AdminLayout>
  );
}

function SettingRow({
  title,
  hint,
  defaultChecked,
}: {
  title: string;
  hint: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="min-w-0 pr-4">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
