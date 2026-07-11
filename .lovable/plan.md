
# Public Explore Section — Build Plan

Rebuild public discovery around a single **Explore** hub with three tabs (Shows, Artists, Theatre Groups), plus rich detail pages. No backend, no auth, no dashboards — realistic placeholder data only, styled with the existing Mancha design system (Deep Burgundy, Theatre Gold, Warm Ivory, Playfair + Inter).

## 1. Navigation change

- `src/components/layout/Navbar.tsx`: collapse Shows / Artists / Groups links into a single **Explore** link pointing to `/explore`. Keep About, Contact, auth actions untouched.
- `src/components/layout/Footer.tsx`: same collapse.
- Delete legacy routes `src/routes/shows.tsx`, `artists.tsx`, `groups.tsx` (their content moves into Explore tabs and detail routes).

## 2. Placeholder data layer

New `src/data/explore/` module (pure TypeScript, no network):
- `shows.ts` — ~12 shows: title, slug, poster, genre, duration, venue, city, date, price, status (`upcoming | live | archived`), groupSlug, description, synopsis, cast[], director, gallery[], schedule[], pricing tiers, reviews[], trailerUrl (YouTube), livestreamUrl.
- `artists.ts` — ~16 artists: name, stageName, slug, photo, cover, specialization, yearsExperience, currentGroupSlug, availability (`available | busy | touring`), bio, skills[], awards[], certificates[], gallery[], videos[], pastProductions[], reviews[], socials.
- `groups.ts` — ~8 groups: name, slug, logo, cover, city, yearsActive, memberCount, description, showsPerformed, followers, history, mission, members[], featuredProductions[], trainingPrograms[], communityActivities[], sponsors[], achievements[], gallery[], videos[], upcomingShows[], pastShows[], reviews[].
- `types.ts` — shared TS types.
- Reuse existing generated poster/artist images in `src/assets/` where available; fill the rest with themed Unsplash URLs.

## 3. Explore hub

`src/routes/explore.tsx` — layout route with `<Outlet />` and shared UI:
- `PageHero` intro ("Explore Mancha").
- Sticky sub-nav using shadcn Tabs bound to child routes (`/explore/shows`, `/explore/artists`, `/explore/groups`) via `<Link>`; animated underline with Framer Motion `layoutId` for smooth switching.
- Global search bar (`ExploreSearch`) with instant client-side suggestions across shows/artists/groups; keyboard nav; grouped results; navigates to detail pages.
- Sort dropdown (Newest / Most Popular / Highest Rated / Alphabetical) shared across tabs via URL search params (`?sort=`, `?q=`, filter keys) validated with `zodValidator` + `fallback`.

`src/routes/explore.index.tsx` — redirects to `/explore/shows`.

## 4. Tab pages

Each tab lives in its own route file and shares components in `src/components/explore/`:

- `src/routes/explore.shows.tsx`
  - Filters (slide-in Sheet on mobile, sidebar on desktop): Genre, City, Date range, Price range, Status.
  - `ShowCard` grid: poster, title, genre chip, duration, venue, date, price, status badge, group name, short description, "View Details" + bookmark toggle (local state only).
  - Pagination (12/page).
- `src/routes/explore.artists.tsx`
  - Filters: Specialization, Experience range, Availability.
  - `ArtistCard`: photo, name, stage name, specialization, years, current group, availability badge, "View Portfolio".
- `src/routes/explore.groups.tsx`
  - Filters: City, Years Active range.
  - `GroupCard`: logo, name, city, years active, member count, description, shows count, followers, "Visit Profile".

Shared UI:
- `ExploreToolbar` (search + sort + filter trigger).
- `FiltersPanel` (Sheet + inline).
- `EmptyState` (illustrated SVG, message, "Clear filters" button).
- `SkeletonGrid` for loading (shown briefly via a mock async delay to demo skeletons).
- `Pagination` component (elegant, prev/next + numbered).

## 5. Detail pages

- `src/routes/explore.shows.$slug.tsx`
  - Cinematic hero banner (backdrop gradient over poster), title, status badge.
  - Poster + synopsis, cast list, director card, gallery masonry, venue + schedule, ticket pricing table, reviews (placeholder cards with star ratings), recommended shows (same genre).
  - If `status === 'archived'` → "Watch Trailer" (YouTube link, opens in dialog).
  - If `status === 'live'` → "Watch Live" (YouTube live placeholder).
  - Related productions strip.
- `src/routes/explore.artists.$slug.tsx`
  - Large cover + overlapping profile photo, bio, skills chips, awards timeline, certificates, gallery, videos (YouTube embeds), current group card, past productions list, reviews, social links, availability badge, "Contact" button (placeholder toast).
- `src/routes/explore.groups.$slug.tsx`
  - Hero, history + mission, members grid, featured productions, training programs, community activities, sponsors marquee, achievements timeline, gallery, videos, upcoming shows, past shows, reviews.

All detail routes: proper `head()` meta (title, description, og:title/description, og:image = hero image), `notFoundComponent`, `errorComponent`.

## 6. Interactions & polish

- Framer Motion (already available via shadcn deps or add `motion` package if missing) for tab underline, filter sheet, card hover lift, page fade-in.
- Bookmarks and search history persist to `localStorage` (read inside `useEffect` to avoid SSR mismatch).
- All colors via semantic tokens; no hardcoded hex in components.
- Responsive: single-column on mobile, 2-col md, 3-col lg for cards; filter sheet on mobile.
- Accessibility: aria labels on filter toggles, keyboard-navigable search suggestions.

## Technical notes

- URL state (`q`, `sort`, filter fields) via TanStack Router `validateSearch` with `zodValidator(fallback(...))` per `tanstack-search-params` rules.
- File-based routes: `explore.tsx` layout renders `<Outlet />`; `explore.shows.$slug.tsx` etc. use `createFileRoute("/explore/shows/$slug")` matching filenames.
- Data fetched via a tiny `useExploreData()` hook that returns the static arrays; wrap in `useMemo` for filter/sort. No server functions.
- Add `framer-motion` if not already installed.
- Delete `shows.tsx`, `artists.tsx`, `groups.tsx` from `src/routes/` and update `Navbar`/`Footer` links in the same batch to avoid dead links.
- Keep bundle lean: lazy-load detail route heavy sections (gallery, videos) with `React.lazy` only if needed.

## Deliverable checklist (will be reported at end of build)

- [ ] Navbar/Footer collapsed to single Explore link
- [ ] Explore layout with animated tabs
- [ ] Shows / Artists / Groups tab pages with cards, filters, sort, pagination, empty & loading states
- [ ] Global search with suggestions
- [ ] Show detail page + trailer/live dialog
- [ ] Artist profile page
- [ ] Theatre group profile page
- [ ] Realistic placeholder data for all three entities
- [ ] Responsive + hover animations + design-system compliant
- [ ] Old shows/artists/groups routes removed
