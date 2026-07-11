import { createFileRoute } from "@tanstack/react-router";
import { Save, Upload, Shield, FileText, Instagram, Facebook, Youtube, Globe, Check } from "lucide-react";
import { GroupLayout } from "@/components/group/GroupLayout";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/dashboard/group/settings")({
  head: () => ({ meta: [{ title: "Settings · Studio — Mancha" }, { name: "robots", content: "noindex" }] }),
  component: SettingsPage,
});

const BRAND_COLORS = ["#6B1022", "#D4AF37", "#4A6B7A", "#8C6B3F", "#A63A50"];

function SettingsPage() {
  return (
    <GroupLayout
      eyebrow="Configuration"
      title="Settings"
      description="Group profile, branding, contact, and verification."
      actions={
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
          <Save className="mr-1.5 h-4 w-4" /> Save changes
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Group Profile" description="Public identity of your ensemble">
          <div className="space-y-4">
            <div>
              <Label>Group name</Label>
              <Input defaultValue="Nagorik Natya Sampradaya" className="mt-1.5 rounded-lg" />
            </div>
            <div>
              <Label>Tagline</Label>
              <Input defaultValue="A heritage ensemble reviving Bengali classics." className="mt-1.5 rounded-lg" />
            </div>
            <div>
              <Label>About</Label>
              <Textarea rows={4} defaultValue="Founded in 1968, Nagorik has staged over 240 productions across Bangladesh and beyond." className="mt-1.5 rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Founded</Label>
                <Input defaultValue="1968" className="mt-1.5 rounded-lg" />
              </div>
              <div>
                <Label>Base city</Label>
                <Input defaultValue="Dhaka" className="mt-1.5 rounded-lg" />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Branding" description="Logo, cover and palette">
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-gold">
                <span className="font-display text-2xl">NNS</span>
              </div>
              <Button variant="outline" className="rounded-full">
                <Upload className="mr-1.5 h-4 w-4" /> Upload logo
              </Button>
            </div>
            <div>
              <Label>Cover image</Label>
              <div className="mt-1.5 flex h-28 items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
                Drag & drop or click to upload (16:9 recommended)
              </div>
            </div>
            <div>
              <Label>Primary color</Label>
              <div className="mt-1.5 flex gap-2">
                {BRAND_COLORS.map((c, i) => (
                  <button
                    key={c}
                    className="relative h-8 w-8 rounded-full ring-1 ring-border transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                    aria-label={`Color ${c}`}
                  >
                    {i === 0 ? <Check className="absolute inset-0 m-auto h-4 w-4 text-white" /> : null}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Contact & Social" description="Where audiences reach you">
          <div className="space-y-4">
            <div>
              <Label>Public email</Label>
              <Input defaultValue="hello@nagorik.example" className="mt-1.5 rounded-lg" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input defaultValue="+880 1712 345 678" className="mt-1.5 rounded-lg" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SocialInput icon={Globe} placeholder="nagorik.example" />
              <SocialInput icon={Facebook} placeholder="facebook.com/nagorik" />
              <SocialInput icon={Instagram} placeholder="@nagorik.dhaka" />
              <SocialInput icon={Youtube} placeholder="youtube.com/@nagorik" />
            </div>
          </div>
        </Panel>

        <Panel title="Verification & Documents" description="Trust badge & legal paperwork">
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <Shield className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">Verified Theatre Group</p>
                  <p className="text-[11px] text-muted-foreground">Verified by Mancha on 12 March 2025</p>
                </div>
              </div>
            </div>

            <ul className="space-y-2">
              {[
                { name: "Registration certificate.pdf", size: "182 KB" },
                { name: "Tax clearance 2024.pdf", size: "94 KB" },
                { name: "Ensemble roster.xlsx", size: "36 KB" },
              ].map((doc) => (
                <li key={doc.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{doc.name}</p>
                      <p className="text-[11px] text-muted-foreground">{doc.size}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="rounded-full text-xs">Replace</Button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">Publicly listed profile</p>
                <p className="text-[11px] text-muted-foreground">Appear in Explore / Theatre Groups</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Panel>
      </div>
    </GroupLayout>
  );
}

function SocialInput({ icon: Icon, placeholder }: { icon: typeof Globe; placeholder: string }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input placeholder={placeholder} className="rounded-lg pl-9" />
    </div>
  );
}
