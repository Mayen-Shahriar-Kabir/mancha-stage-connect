import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createProduction, updateProduction, type Production } from "@/lib/business";

export function ProductionFormDialog({
  open, onOpenChange, groupId, existing, onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  groupId: string;
  existing?: Production | null;
  onSaved?: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", genre: "Drama", language: "Bangla",
    duration_min: 90, venue: "", show_date: "", show_time: "19:00",
    poster_url: "", youtube_url: "",
    ticket_price: 500, livestream_price: 200, archive_price: 100,
    max_seats: 200, status: "upcoming" as Production["status"], is_published: true,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title ?? "",
        description: existing.description ?? "",
        genre: existing.genre ?? "Drama",
        language: existing.language ?? "Bangla",
        duration_min: existing.duration_min ?? 90,
        venue: existing.venue ?? "",
        show_date: existing.show_date ?? "",
        show_time: existing.show_time ?? "19:00",
        poster_url: existing.poster_url ?? "",
        youtube_url: existing.youtube_url ?? "",
        ticket_price: Number(existing.ticket_price ?? 0),
        livestream_price: Number(existing.livestream_price ?? 0),
        archive_price: Number(existing.archive_price ?? 0),
        max_seats: existing.max_seats ?? 200,
        status: existing.status,
        is_published: existing.is_published,
      });
    }
  }, [existing]);

  const submit = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        show_date: form.show_date || null,
        show_time: form.show_time || null,
        poster_url: form.poster_url || null,
        youtube_url: form.youtube_url || null,
        venue: form.venue || null,
        description: form.description || null,
      };
      if (existing) {
        await updateProduction(existing.id, payload);
        toast.success("Production updated");
      } else {
        await createProduction({ group_id: groupId, ...payload });
        toast.success("Production created");
      }
      onOpenChange(false);
      onSaved?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to save");
    } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {existing ? "Edit production" : "Create production"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Field label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Description"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Genre"><Input value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} /></Field>
            <Field label="Language"><Input value={form.language} onChange={(e) => setForm({ ...form, language: e.target.value })} /></Field>
            <Field label="Duration (min)"><Input type="number" value={form.duration_min} onChange={(e) => setForm({ ...form, duration_min: +e.target.value })} /></Field>
            <Field label="Max seats"><Input type="number" value={form.max_seats} onChange={(e) => setForm({ ...form, max_seats: +e.target.value })} /></Field>
            <Field label="Venue"><Input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} /></Field>
            <Field label="Show date"><Input type="date" value={form.show_date} onChange={(e) => setForm({ ...form, show_date: e.target.value })} /></Field>
            <Field label="Show time"><Input type="time" value={form.show_time} onChange={(e) => setForm({ ...form, show_time: e.target.value })} /></Field>
            <Field label="Status">
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Production["status"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["draft","upcoming","live","completed","archived","cancelled"] as const).map((s) =>
                    <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Ticket price (৳)"><Input type="number" value={form.ticket_price} onChange={(e) => setForm({ ...form, ticket_price: +e.target.value })} /></Field>
            <Field label="Livestream (৳)"><Input type="number" value={form.livestream_price} onChange={(e) => setForm({ ...form, livestream_price: +e.target.value })} /></Field>
            <Field label="Archive (৳)"><Input type="number" value={form.archive_price} onChange={(e) => setForm({ ...form, archive_price: +e.target.value })} /></Field>
          </div>

          <Field label="Poster URL"><Input placeholder="https://…" value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} /></Field>
          <Field label="YouTube URL (trailer/livestream)"><Input placeholder="https://youtube.com/…" value={form.youtube_url} onChange={(e) => setForm({ ...form, youtube_url: e.target.value })} /></Field>

          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-3">
            <div>
              <div className="text-sm font-medium text-foreground">Publish publicly</div>
              <div className="text-xs text-muted-foreground">Visible in Explore and bookable by audiences.</div>
            </div>
            <Switch checked={form.is_published} onCheckedChange={(v) => setForm({ ...form, is_published: v })} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={saving} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {saving ? "Saving…" : existing ? "Save changes" : "Create production"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
