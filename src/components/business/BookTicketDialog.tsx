import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookTicket, pushNotification, fmtBDT, type Production } from "@/lib/business";
import { useAuth } from "@/hooks/use-auth";

export function BookTicketDialog({
  open, onOpenChange, production, onBooked,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  production: Production | null;
  onBooked?: () => void;
}) {
  const { user } = useAuth();
  const [seats, setSeats] = useState(1);
  const [busy, setBusy] = useState(false);

  if (!production) return null;
  const available = Math.max(0, (production.max_seats ?? 0) - production.seats_sold);
  const unit = Number(production.ticket_price ?? 0);
  const total = unit * seats;

  const submit = async () => {
    if (!user) { toast.error("Sign in to book"); return; }
    if (seats < 1 || seats > available) { toast.error("Invalid seat count"); return; }
    setBusy(true);
    try {
      const ticket = await bookTicket(production.id, user.id, seats, unit);
      await pushNotification(user.id, "booking",
        `Booking confirmed · ${production.title}`,
        `${seats} seat${seats > 1 ? "s" : ""} · ${fmtBDT(total)} · ${ticket.booking_code}`,
        "/dashboard/audience/tickets");
      // Notify the group
      await pushNotification(production.group_id, "booking",
        `New booking · ${production.title}`,
        `${seats} seat${seats > 1 ? "s" : ""} · ${fmtBDT(total)}`,
        "/dashboard/group/productions");
      toast.success(`Booked! Code ${ticket.booking_code}`);
      onOpenChange(false);
      onBooked?.();
    } catch (e: any) {
      toast.error(e?.message ?? "Booking failed");
    } finally { setBusy(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Book seats</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
            <div className="font-medium text-foreground">{production.title}</div>
            <div className="text-xs text-muted-foreground">
              {production.venue} · {production.show_date} {production.show_time}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {available} of {production.max_seats} seats available
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">Seats</Label>
            <Input type="number" min={1} max={available} value={seats} onChange={(e) => setSeats(+e.target.value)} />
          </div>
          <div className="flex justify-between rounded-lg bg-brand/5 p-3 text-sm">
            <span className="text-muted-foreground">Total (simulated payment)</span>
            <span className="font-display text-lg text-brand">{fmtBDT(total)}</span>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={busy || available < 1} className="bg-brand text-brand-foreground hover:bg-brand/90">
            {busy ? "Processing…" : "Confirm booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
