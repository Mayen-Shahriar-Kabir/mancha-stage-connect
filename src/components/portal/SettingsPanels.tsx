import type { ReactNode } from "react";
import { Panel } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ToggleRow {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}

export function ProfileSettingsPanel({ email }: { email?: string | null }) {
  return (
    <Panel title="Profile" description="Public information used across Mancha">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" defaultValue="" placeholder="Your display name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" defaultValue={email ?? ""} disabled />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" placeholder="+880 …" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" placeholder="Dhaka" />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Save changes</Button>
      </div>
    </Panel>
  );
}

export function PasswordSettingsPanel() {
  return (
    <Panel title="Password" description="Rotate your password periodically">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-1.5"><Label>Current</Label><Input type="password" /></div>
        <div className="space-y-1.5"><Label>New</Label><Input type="password" /></div>
        <div className="space-y-1.5"><Label>Confirm</Label><Input type="password" /></div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" className="rounded-full">Update password</Button>
      </div>
    </Panel>
  );
}

export function ToggleSettingsPanel({ title, description, rows, footer }: { title: string; description?: string; rows: ToggleRow[]; footer?: ReactNode }) {
  return (
    <Panel title={title} description={description}>
      <ul className="divide-y divide-border/60">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start justify-between gap-4 py-3">
            <div>
              <div className="text-sm font-medium text-foreground">{r.label}</div>
              {r.description ? (
                <div className="mt-0.5 text-xs text-muted-foreground">{r.description}</div>
              ) : null}
            </div>
            <Switch defaultChecked={r.defaultChecked} />
          </li>
        ))}
      </ul>
      {footer}
    </Panel>
  );
}
