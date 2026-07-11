export type ShowStatus = "upcoming" | "live" | "archived";
export type Availability = "available" | "busy" | "touring";

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Show {
  slug: string;
  title: string;
  poster: string;
  banner: string;
  genre: string;
  durationMinutes: number;
  venue: string;
  city: string;
  date: string; // ISO
  price: number;
  status: ShowStatus;
  groupSlug: string;
  groupName: string;
  description: string;
  synopsis: string;
  cast: { name: string; role: string; photo: string }[];
  director: { name: string; photo: string; bio: string };
  gallery: string[];
  schedule: { date: string; venue: string; city: string }[];
  pricing: { tier: string; price: number; perks: string }[];
  reviews: Review[];
  trailerUrl: string;
  livestreamUrl?: string;
  popularity: number;
  rating: number;
}

export interface Artist {
  slug: string;
  name: string;
  stageName: string;
  photo: string;
  cover: string;
  specialization: string;
  yearsExperience: number;
  currentGroupSlug: string;
  currentGroupName: string;
  availability: Availability;
  bio: string;
  skills: string[];
  awards: { title: string; year: number; org: string }[];
  certificates: { title: string; issuer: string; year: number }[];
  gallery: string[];
  videos: { title: string; url: string }[];
  pastProductions: { title: string; year: number; role: string }[];
  reviews: Review[];
  socials: { label: string; url: string }[];
  popularity: number;
  rating: number;
}

export interface Group {
  slug: string;
  name: string;
  logoInitials: string;
  cover: string;
  city: string;
  yearsActive: number;
  foundedYear: number;
  memberCount: number;
  description: string;
  showsPerformed: number;
  followers: number;
  history: string;
  mission: string;
  members: { name: string; role: string; photo: string }[];
  featuredProductions: { title: string; year: number; poster: string }[];
  trainingPrograms: { title: string; description: string }[];
  communityActivities: { title: string; description: string }[];
  sponsors: string[];
  achievements: { title: string; year: number }[];
  gallery: string[];
  videos: { title: string; url: string }[];
  upcomingShows: string[]; // show slugs
  pastShows: string[];
  reviews: Review[];
  popularity: number;
  rating: number;
}
