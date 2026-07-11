import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AuthShell } from "./AuthShell";

export function StatusScreen({
  icon,
  title,
  message,
  tone = "brand",
  primary,
  secondary,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  tone?: "brand" | "warning" | "danger";
  primary?: { label: string; onClick?: () => void; to?: string };
  secondary?: { label: string; onClick?: () => void; to?: string };
}) {
  const toneClass =
    tone === "danger"
      ? "bg-destructive/10 text-destructive"
      : tone === "warning"
      ? "bg-accent/15 text-accent-foreground"
      : "bg-brand/10 text-brand";

  return (
    <AuthShell title={title} subtitle={undefined} wide>
      <div className="flex flex-col items-center text-center">
        <div className={`mb-5 grid h-16 w-16 place-items-center rounded-full ${toneClass}`}>
          {icon}
        </div>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {primary ? (
            primary.to ? (
              <Button asChild size="lg" className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90">
                <Link to={primary.to}>{primary.label}</Link>
              </Button>
            ) : (
              <Button
                size="lg"
                onClick={primary.onClick}
                className="rounded-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                {primary.label}
              </Button>
            )
          ) : null}
          {secondary ? (
            secondary.to ? (
              <Button asChild variant="outline" size="lg" className="rounded-full">
                <Link to={secondary.to}>{secondary.label}</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="lg"
                onClick={secondary.onClick}
                className="rounded-full"
              >
                {secondary.label}
              </Button>
            )
          ) : null}
        </div>
      </div>
    </AuthShell>
  );
}
