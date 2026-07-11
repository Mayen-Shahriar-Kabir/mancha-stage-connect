import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Artist } from "@/data/explore";
import { Button } from "@/components/ui/button";
import { AvailabilityBadge } from "./Badges";

export function ArtistCard({ artist, index = 0 }: { artist: Artist; index?: number }) {
  return (
    <article
      className="hover-lift group flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft"
      style={{ animation: `fade-in 0.5s ease-out ${Math.min(index, 8) * 50}ms both` }}
    >
      <Link to="/explore/artists/$slug" params={{ slug: artist.slug }} className="mx-auto block">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted">
          <img
            src={artist.photo}
            alt={artist.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-105"
          />
          <div className="absolute right-3 top-3">
            <AvailabilityBadge availability={artist.availability} />
          </div>
        </div>
      </Link>
      <div className="mt-4 flex flex-1 flex-col text-center">
        <h3 className="font-display text-lg text-foreground">{artist.name}</h3>
        <p className="mt-0.5 text-xs italic text-muted-foreground">“{artist.stageName}”</p>
        <p className="mt-2 text-sm text-brand">{artist.specialization}</p>
        <dl className="mt-3 grid grid-cols-2 gap-2 border-t border-border/60 pt-3 text-xs">
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Experience</dt>
            <dd className="mt-0.5 font-medium text-foreground">{artist.yearsExperience} yrs</dd>
          </div>
          <div>
            <dt className="text-[10px] uppercase tracking-widest text-muted-foreground">Group</dt>
            <dd className="mt-0.5 truncate font-medium text-foreground">{artist.currentGroupName}</dd>
          </div>
        </dl>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="mt-4 rounded-full hover:border-brand hover:bg-brand hover:text-brand-foreground"
        >
          <Link to="/explore/artists/$slug" params={{ slug: artist.slug }}>
            View Portfolio <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
