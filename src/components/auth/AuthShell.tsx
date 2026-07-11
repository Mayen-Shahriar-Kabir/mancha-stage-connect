import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="hero-gradient min-h-screen">
      <div className="container-page flex min-h-screen items-center justify-center py-14">
        <div className={`w-full ${wide ? "max-w-xl" : "max-w-md"} animate-fade-in`}>
          <Link to="/" className="mx-auto mb-8 flex w-fit items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-brand text-brand-foreground shadow-gold">
              <span className="font-display text-lg leading-none">M</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-2xl">Mancha</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Digital Theatre
              </span>
            </span>
          </Link>
          <div className="rounded-3xl border border-border bg-card/95 p-8 shadow-elevated backdrop-blur md:p-10">
            <h1 className="font-display text-3xl text-foreground">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
            <div className="mt-8">{children}</div>
          </div>
          {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}
