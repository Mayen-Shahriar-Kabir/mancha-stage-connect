# Mancha — Final Refinement Pass

Scope is intentionally focused on polish and role-specific completeness. No redesign, no new visual language — every new page reuses `PortalLayout`, `Panel`, `StatCard`, `StatusPill`, and existing dialog primitives.

## 1. Small visual fixes

- **Artist portfolio avatar**: change the `-mt-16 h-24 w-24 … object-cover` treatment so the full headshot is visible. Use `object-cover object-top` on a taller frame OR switch to a circular avatar with `object-cover` + `object-position: center 20%`. Also lift the cover overlap.
- **Meghdoot poster**: the Unsplash photo `1571266028243-d220bc568cbf` is dead. Replace with a working stage image (`photo-1503095396549-807759245b35`) everywhere it appears (`artist.ts`, `audience.ts`).
- **Broken thumbs fallback**: add a shared `<PosterImg />` component that swaps to a branded fallback on `onError` and use it in `ShowCard`, watchlist, ticket wallet, artist productions.

## 2. Organization dashboards — split by type

Replace the single ORG_NAV with a per-type nav selected from `profile.organization_type`.

```
Corporate:    Dashboard · Bookings · Sponsorships · History · Settings
Tourism:      Dashboard · Bookings · Cultural Programs · History · Settings
Film & OTT:   Dashboard · Auditions · Jobs · Applications · Settings
University:   Dashboard · Venue Booking · Internships · Campus Programs · Settings
```

- New `org-nav.ts` exports `getOrgNav(type)`.
- Delete/repurpose: `opportunities.tsx`, `collaborations.tsx`, `events.tsx`, `analytics.tsx`, `notifications.tsx` (keep notifications only if referenced from index; otherwise remove links).
- New routes (each is a `PortalLayout` + `Panel` grid, no new design language):
  - `dashboard.organization.sponsorships.tsx` (corporate)
  - `dashboard.organization.history.tsx` (corporate + tourism)
  - `dashboard.organization.cultural-programs.tsx` (tourism)
  - `dashboard.organization.auditions.tsx` (film)
  - `dashboard.organization.jobs.tsx` (film)
  - `dashboard.organization.applications.tsx` (film)
  - `dashboard.organization.venues.tsx` (university)
  - `dashboard.organization.internships.tsx` (university)
  - `dashboard.organization.campus-programs.tsx` (university)
- `dashboard.organization.bookings.tsx` becomes a booking hub with a **Create Booking** dialog (target = Group or Artist, event name, purpose, date, venue, budget, notes, status pill).

## 3. Demo persistence layer

New `src/lib/demo-store.ts`: tiny typed wrapper around `localStorage` keyed per feature (`mancha.demo.<feature>.<userId>`). Exports `useDemoList<T>(key, seed)` returning `{ items, add, update, remove }`. All new workflow dialogs write through this so create/edit/delete/status changes persist across a session and feel real.

Applied to: org bookings, sponsorships, cultural programs, auditions, jobs, applications (shortlist/reject), venues, internships, campus programs.

## 4. Reusable dialogs

- `BookingFormDialog` — reused by Corporate, Tourism, University (fields config-driven).
- `AuditionFormDialog`, `JobFormDialog` — Film.
- `VenueFormDialog` — University publishes venues (auditorium, capacity, dates, facilities, description). Read by Groups/Corporate/Tourism via a new **Available Venues** panel on their existing bookings/collab pages.
- `SimpleFormDialog` — generic wrapper for cultural programs, internships, campus programs.

Each dialog reuses shadcn `Dialog`, `Input`, `Textarea`, `Select`, `Button` — no new component library.

## 5. Cross-role venue visibility

- Venues published by Universities are stored in a shared `mancha.demo.venues` key.
- New `AvailableVenuesPanel` component surfaced on:
  - Group → Community (existing page, add panel).
  - Corporate → Bookings (side panel).
  - Tourism → Bookings (side panel).

## 6. Quality sweep

- Fix org root component to read `organization_type` and route the sidebar/actions accordingly.
- Remove stale nav entries after per-type split (no dead links).
- Add `onError` fallback to any `<img>` in card grids.
- Verify build + walk through each dashboard as each role via Playwright screenshots.

## Out of scope (kept honest)

Real backend for the new workflows — everything above uses localStorage demo persistence. The existing Supabase-backed modules (productions, tickets, funding, reviews, notifications) stay as-is. A follow-up phase is required to promote these demo workflows (bookings, sponsorships, venues, auditions, jobs, applications, internships, campus programs, cultural programs) to real tables + RLS.

## Deliverable at end

Short summary listing: fixed inconsistencies, updated org dashboards, completed placeholder workflows, and modules still requiring a production backend.
