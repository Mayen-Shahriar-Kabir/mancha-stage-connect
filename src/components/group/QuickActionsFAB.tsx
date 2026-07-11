import { Plus, Clapperboard, HandCoins, Heart, GraduationCap, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ITEMS = [
  { label: "Create Production", icon: Clapperboard },
  { label: "Create Funding Campaign", icon: HandCoins },
  { label: "Create Meetup", icon: Heart },
  { label: "Create Training", icon: GraduationCap },
  { label: "Create Opportunity", icon: Briefcase },
];

export function QuickActionsFAB() {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            className="pointer-events-auto h-14 w-14 rounded-full bg-brand text-brand-foreground shadow-gold transition-transform hover:scale-105 hover:bg-brand/90"
            aria-label="Quick actions"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="end" className="w-60 rounded-2xl p-2">
          <DropdownMenuLabel className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Quick actions
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ITEMS.map((it) => (
            <DropdownMenuItem
              key={it.label}
              className="cursor-pointer gap-2 rounded-lg py-2"
              onClick={() => toast.success(it.label, { description: "Placeholder — backend not wired yet." })}
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand/10 text-brand">
                <it.icon className="h-4 w-4" />
              </span>
              <span className="text-sm">{it.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
