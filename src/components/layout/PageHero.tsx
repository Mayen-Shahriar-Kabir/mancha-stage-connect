import type { ReactNode } from "react";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: Props) {
  return (
    <section className="hero-gradient border-b border-border/60">
      <div className="container-page py-20 md:py-28">
        <div className="mx-auto max-w-3xl text-center animate-slide-up">
          {eyebrow && (
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.24em] text-brand">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-4xl leading-[1.05] text-foreground md:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
          {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
        </div>
      </div>
    </section>
  );
}
