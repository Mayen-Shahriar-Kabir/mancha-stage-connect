export * from "./types";
export { SHOWS, SHOW_GENRES, SHOW_CITIES } from "./shows";
export { ARTISTS, ARTIST_SPECIALIZATIONS } from "./artists";
export { GROUPS, GROUP_CITIES } from "./groups";

import { SHOWS } from "./shows";
import { ARTISTS } from "./artists";
import { GROUPS } from "./groups";

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "alpha", label: "Alphabetical" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function findShow(slug: string) {
  return SHOWS.find((s) => s.slug === slug);
}
export function findArtist(slug: string) {
  return ARTISTS.find((a) => a.slug === slug);
}
export function findGroup(slug: string) {
  return GROUPS.find((g) => g.slug === slug);
}
