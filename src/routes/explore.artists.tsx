import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { ARTISTS, ARTIST_SPECIALIZATIONS, type Availability, type SortValue } from "@/data/explore";
import { ArtistCard } from "@/components/explore/ArtistCard";
import { ExploreToolbar } from "@/components/explore/ExploreToolbar";
import { FiltersPanel, FiltersSheet, FilterGroup, ChipToggle } from "@/components/explore/FiltersPanel";
import { EmptyState } from "@/components/explore/EmptyState";
import { SkeletonGrid } from "@/components/explore/SkeletonGrid";
import { Pagination } from "@/components/explore/Pagination";
import { Slider } from "@/components/ui/slider";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  sort: fallback(z.string(), "newest").default("newest"),
  spec: fallback(z.string(), "").default(""),
  availability: fallback(z.string(), "").default(""),
  minExp: fallback(z.number(), 0).default(0),
  maxExp: fallback(z.number(), 50).default(50),
  page: fallback(z.number().int(), 1).default(1),
});

const PAGE_SIZE = 12;

export const Route = createFileRoute("/explore/artists")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Artists — Explore Mancha" },
      { name: "description", content: "Verified theatre artists across Bangladesh — directors, actors, designers, playwrights." },
    ],
  }),
  component: ArtistsTab,
});

function ArtistsTab() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/explore/artists" });
  const [sheet, setSheet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [search.spec, search.availability, search.minExp, search.maxExp, search.sort, search.q]);

  const set = (patch: Partial<typeof search>) =>
    navigate({ search: (prev) => ({ ...prev, ...patch, page: 1 }) });

  const clear = () =>
    navigate({ search: () => ({ q: "", sort: "newest", spec: "", availability: "", minExp: 0, maxExp: 50, page: 1 }) });

  const filtered = useMemo(() => {
    const q = search.q.trim().toLowerCase();
    let list = ARTISTS.filter((a) => {
      if (q && !(a.name.toLowerCase().includes(q) || a.specialization.toLowerCase().includes(q))) return false;
      if (search.spec && a.specialization !== search.spec) return false;
      if (search.availability && a.availability !== search.availability) return false;
      if (a.yearsExperience < search.minExp || a.yearsExperience > search.maxExp) return false;
      return true;
    });
    const sort = search.sort as SortValue;
    if (sort === "newest") list = list.sort((a, b) => a.yearsExperience - b.yearsExperience);
    if (sort === "popular") list = list.sort((a, b) => b.popularity - a.popularity);
    if (sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
    if (sort === "alpha") list = list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(search.page, totalPages);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const activeCount =
    (search.spec ? 1 : 0) + (search.availability ? 1 : 0) + (search.minExp > 0 || search.maxExp < 50 ? 1 : 0);

  const filters = (
    <>
      <FilterGroup label="Specialization">
        <div className="flex flex-wrap gap-2">
          {ARTIST_SPECIALIZATIONS.map((s) => (
            <ChipToggle key={s} active={search.spec === s} onClick={() => set({ spec: search.spec === s ? "" : s })}>
              {s}
            </ChipToggle>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label="Availability">
        <div className="flex flex-wrap gap-2">
          {(["available", "busy", "touring"] as Availability[]).map((a) => (
            <ChipToggle
              key={a}
              active={search.availability === a}
              onClick={() => set({ availability: search.availability === a ? "" : a })}
            >
              {a[0].toUpperCase() + a.slice(1)}
            </ChipToggle>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup label={`Experience · ${search.minExp} – ${search.maxExp} years`}>
        <Slider
          value={[search.minExp, search.maxExp]}
          min={0}
          max={50}
          step={1}
          onValueChange={(v) => set({ minExp: v[0], maxExp: v[1] })}
        />
      </FilterGroup>
    </>
  );

  return (
    <section className="container-page py-10 md:py-14">
      <ExploreToolbar
        sort={search.sort as SortValue}
        onSort={(v) => set({ sort: v })}
        onOpenFilters={() => setSheet(true)}
        activeFilterCount={activeCount}
      />

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <FiltersPanel onClear={clear}>{filters}</FiltersPanel>
        <FiltersSheet open={sheet} onOpenChange={setSheet} onClear={clear}>
          {filters}
        </FiltersSheet>

        <div>
          {loading ? (
            <SkeletonGrid count={8} variant="artist" />
          ) : filtered.length === 0 ? (
            <EmptyState
              title="No artists match those filters"
              message="Widen your specialization or clear the filters to see everyone."
              onAction={clear}
            />
          ) : (
            <>
              <p className="mb-5 text-xs uppercase tracking-widest text-muted-foreground">
                {filtered.length} artist{filtered.length === 1 ? "" : "s"}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {pageItems.map((a, i) => (
                  <ArtistCard key={a.slug} artist={a} index={i} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => navigate({ search: (prev) => ({ ...prev, page: p }) })}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
