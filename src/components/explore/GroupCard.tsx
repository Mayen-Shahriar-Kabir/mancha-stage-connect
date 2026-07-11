import { Link } from "@tanstack/react-router";
import { ArrowRight, MapPin, Users2, Calendar, Heart } from "lucide-react";
import type { Group } from "@/data/explore";
import { Button } from "@/components/ui/button";

export function GroupCard({ group, index = 0 }: { group: Group; index?: number }) {
  return (
    <article
      className="hover-lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
      style={{ animation: `fade-in 0.5s ease-out ${Math.min(index, 8) * 50}ms both` }}
    >
      <Link to="/explore/groups/$slug" params={{ slug: group.slug }} className="relative block aspect-[16/9] overflow-hidden bg-muted">
        <img
          src={group.cover}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute inset-x-5 bottom-4 flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand text-brand-foreground shadow-gold"
          >
            <span className="font-display text-base">{group.logoInitials}</span>
          </span>
          <div className="min-w-0 text-ivory">
            <h3 className="font-display truncate text-xl">{group.name}</h3>
            <p className="flex items-center gap-1 text-xs text-ivory/70">
              <MapPin className="h-3 w-3" /> {group.city}
            </p>
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {group.description}
        </p>
        <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-border/60 pt-4 text-center text-sm">
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Years</dt>
            <dd className="font-display mt-0.5 text-lg text-foreground">{group.yearsActive}</dd>
          </div>
          <div className="border-x border-border/60">
            <dt className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              <Users2 className="h-3 w-3" /> Members
            </dt>
            <dd className="font-display mt-0.5 text-lg text-foreground">{group.memberCount}</dd>
          </div>
          <div>
            <dt className="flex items-center justify-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              <Calendar className="h-3 w-3" /> Shows
            </dt>
            <dd className="font-display mt-0.5 text-lg text-foreground">{group.showsPerformed}</dd>
          </div>
        </dl>

        <div className="mt-5 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Heart className="h-3.5 w-3.5 text-brand" />
            {group.followers.toLocaleString("en-US")} followers
          </span>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="px-2 text-brand hover:bg-transparent hover:text-brand/80"
          >
            <Link to="/explore/groups/$slug" params={{ slug: group.slug }}>
              Visit Profile <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
