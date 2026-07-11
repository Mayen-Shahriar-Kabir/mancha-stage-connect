import { Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  title = "Nothing on this stage yet",
  message = "Try clearing filters or searching for something else.",
  actionLabel = "Clear filters",
  onAction,
}: {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-14 text-center animate-fade-in">
      <div className="mb-6 grid h-20 w-20 place-items-center rounded-full bg-brand/10 text-brand animate-float-slow">
        <Ghost className="h-9 w-9" />
      </div>
      <h3 className="font-display text-2xl text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      {onAction && (
        <Button
          onClick={onAction}
          className="mt-6 rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
