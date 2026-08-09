import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contribute, pushNotification, fmtBDT, type Campaign } from "@/lib/business";
import { useAuth } from "@/hooks/use-auth";

const PRESETS = [500, 1000, 2500, 5000];

export function ContributeDialog({
  open, onOpenChange, campaign, onDone,
}: {
  open: boolean; onOpenChange: (v: boolean) => void; campaign: Campaign | null; onDone?: () => void;
}) {
  const { user, profile } = useAuth();
  const [amount, setAmount] = useState(1000);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [thanked, setThanked] = useState(false);

  if (!campaign) return null;

  const submit = async () => {
    if (!user) { toast.error("Sign in to contribute"); return; }
    const parsed = contributionAmountSchema.safeParse(amount);
    if (!parsed.success) { toast.error(parsed.error.issues[0]?.message ?? "Invalid amount"); return; }
    setBusy(true);
    try {
      // Contributor identity, campaign state and the running total are all
      // resolved server-side inside a single transaction.
      await contribute(campaign.id, parsed.data, message.trim().slice(0, 500));
      setThanked(true);
      toast.success("Contribution recorded (simulated payment)");
      onDone?.();
    } catch (e: any) { toast.error(e?.message ?? "Failed"); }
    finally { setBusy(false); }
  };

  const close = () => { setThanked(false); setMessage(""); setAmount(1000); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-md">
        {thanked ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-full bg-accent/20 text-brand">
              <Sparkles className="h-7 w-7" />
            </div>
            <div className="font-display text-2xl text-foreground">Patron badge unlocked</div>
            <p className="mt-2 text-sm text-muted-foreground">Your name joins the wall of supporters of <span className="text-foreground">{campaign.title}</span>.</p>
            <Button onClick={close} className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90">Done</Button>
          </div>
        ) : (
          <>
            <DialogHeader><DialogTitle className="font-display text-2xl">Back this campaign</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
                <div className="font-medium text-foreground">{campaign.title}</div>
                <div className="text-xs text-muted-foreground">
                  {fmtBDT(Number(campaign.raised_amount))} raised of {fmtBDT(Number(campaign.goal_amount))} goal
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Choose amount</Label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button key={p} type="button" onClick={() => setAmount(p)}
                      className={`rounded-full border px-3 py-1 text-xs ${amount === p ? "border-brand bg-brand text-brand-foreground" : "border-border hover:border-brand"}`}>
                      ৳{p.toLocaleString()}
                    </button>
                  ))}
                </div>
                <Input type="number" min={100} value={amount} onChange={(e) => setAmount(+e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Message (optional)</Label>
                <Textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A note of encouragement…" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={close}>Cancel</Button>
              <Button onClick={submit} disabled={busy} className="bg-brand text-brand-foreground hover:bg-brand/90">
                {busy ? "Processing…" : `Contribute ${fmtBDT(amount)}`}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
