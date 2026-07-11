import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCampaign } from "@/lib/business";

export function CampaignFormDialog({
  open, onOpenChange, groupId, onSaved,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; groupId: string; onSaved?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", purpose: "", cover_url: "",
    goal_amount: 100000, deadline: "",
  });

  const submit = async () => {
    if (!form.title.trim()) return toast.error("Title is required");
    setBusy(true);
    try {
      await createCampaign({
        group_id: groupId,
        title: form.title,
        description: form.description || null,
        purpose: form.purpose || null,
        cover_url: form.cover_url || null,
        goal_amount: form.goal_amount,
        deadline: form.deadline || null,
        status: "active",
      });
      toast.success("Campaign launched");
      onOpenChange(false); onSaved?.();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-2xl">Launch funding campaign</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <F label="Title"><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></F>
          <F label="Purpose"><Input placeholder="e.g. National tour production costs" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></F>
          <F label="Description"><Textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></F>
          <div className="grid grid-cols-2 gap-3">
            <F label="Goal (৳)"><Input type="number" value={form.goal_amount} onChange={(e) => setForm({ ...form, goal_amount: +e.target.value })} /></F>
            <F label="Deadline"><Input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} /></F>
          </div>
          <F label="Cover URL"><Input placeholder="https://…" value={form.cover_url} onChange={(e) => setForm({ ...form, cover_url: e.target.value })} /></F>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {busy ? "Saving…" : "Launch campaign"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
