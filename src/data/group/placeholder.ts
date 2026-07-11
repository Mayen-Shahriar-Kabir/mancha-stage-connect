// Realistic placeholder data for the Theatre Group Dashboard (Mancha).
// All figures are illustrative — replace with backend queries in a later phase.

export interface GroupStats {
  activeMembers: number;
  activeMembersDelta: number;
  activeProductions: number;
  activeProductionsDelta: number;
  monthlyRevenueBDT: number;
  monthlyRevenueDelta: number;
  ticketsSold: number;
  ticketsSoldDelta: number;
  fundsRaisedBDT: number;
  fundsRaisedDelta: number;
  communityFollowers: number;
  communityFollowersDelta: number;
}

export const groupStats: GroupStats = {
  activeMembers: 42,
  activeMembersDelta: 6.2,
  activeProductions: 4,
  activeProductionsDelta: 33.3,
  monthlyRevenueBDT: 1_240_000,
  monthlyRevenueDelta: 12.7,
  ticketsSold: 2_318,
  ticketsSoldDelta: 8.4,
  fundsRaisedBDT: 3_450_000,
  fundsRaisedDelta: 22.1,
  communityFollowers: 18_420,
  communityFollowersDelta: 4.9,
};

// ── Members ────────────────────────────────────────────────
export type MemberRole =
  | "Director"
  | "Lead Actor"
  | "Actor"
  | "Playwright"
  | "Set Designer"
  | "Sound Designer"
  | "Light Designer"
  | "Stage Manager"
  | "Costume Designer"
  | "Producer";

export type Availability = "available" | "rehearsing" | "on_tour" | "on_leave";

export interface Member {
  id: string;
  name: string;
  role: MemberRole;
  yearsExperience: number;
  joined: string; // ISO date
  availability: Availability;
  photo: string;
  email: string;
}

const MEMBER_PHOTOS_M = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&auto=format&fit=crop",
];
const MEMBER_PHOTOS_F = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop",
];

export const members: Member[] = [
  ["Ferdous Alam", "Director", 18, "2019-03-11", "rehearsing", "m"],
  ["Rukhsana Kabir", "Lead Actor", 12, "2020-06-22", "rehearsing", "f"],
  ["Imtiaz Hossain", "Playwright", 9, "2021-01-14", "available", "m"],
  ["Sabina Yasmin", "Costume Designer", 7, "2020-11-02", "available", "f"],
  ["Tanvir Ahmed", "Set Designer", 11, "2019-08-30", "on_tour", "m"],
  ["Nabila Rahman", "Actor", 5, "2022-02-19", "available", "f"],
  ["Rashed Chowdhury", "Sound Designer", 8, "2021-05-05", "rehearsing", "m"],
  ["Farah Deeba", "Stage Manager", 6, "2022-09-17", "available", "f"],
  ["Mahmud Hasan", "Actor", 4, "2023-01-08", "on_leave", "m"],
  ["Tahmina Anis", "Light Designer", 10, "2020-04-12", "rehearsing", "f"],
  ["Sadman Zaman", "Producer", 14, "2018-10-01", "available", "m"],
  ["Anika Tabassum", "Lead Actor", 8, "2021-07-23", "on_tour", "f"],
].map(([name, role, yrs, joined, avail, g], i) => {
  const pool = g === "m" ? MEMBER_PHOTOS_M : MEMBER_PHOTOS_F;
  return {
    id: `m-${i + 1}`,
    name: name as string,
    role: role as MemberRole,
    yearsExperience: yrs as number,
    joined: joined as string,
    availability: avail as Availability,
    photo: pool[i % pool.length],
    email: `${(name as string).toLowerCase().replace(/\s+/g, ".")}@mancha.example`,
  };
});

// ── Productions ─────────────────────────────────────────────
export type ProductionStatus = "running" | "upcoming" | "sold_out" | "closed";
export type LivestreamStatus = "scheduled" | "live" | "off" | "recorded";
export type FundingStatus = "funded" | "in_progress" | "not_started";

export interface GroupProduction {
  id: string;
  title: string;
  poster: string;
  status: ProductionStatus;
  revenueBDT: number;
  ticketsSold: number;
  capacity: number;
  livestream: LivestreamStatus;
  funding: FundingStatus;
  opensOn: string;
  venue: string;
}

const POSTERS = [
  "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&auto=format&fit=crop",
];

export const productions: GroupProduction[] = [
  {
    id: "p1", title: "Nakshi Kanthar Math", poster: POSTERS[0],
    status: "running", revenueBDT: 820_000, ticketsSold: 1_240, capacity: 1_400,
    livestream: "live", funding: "funded", opensOn: "2026-07-18", venue: "Shilpakala Academy · Hall 1",
  },
  {
    id: "p2", title: "Raktakarabi", poster: POSTERS[1],
    status: "sold_out", revenueBDT: 1_050_000, ticketsSold: 900, capacity: 900,
    livestream: "recorded", funding: "funded", opensOn: "2026-06-04", venue: "Mahila Samity",
  },
  {
    id: "p3", title: "Ekattorer Jishu", poster: POSTERS[2],
    status: "upcoming", revenueBDT: 210_000, ticketsSold: 320, capacity: 1_200,
    livestream: "scheduled", funding: "in_progress", opensOn: "2026-08-22", venue: "TSC Auditorium, DU",
  },
  {
    id: "p4", title: "Kobor", poster: POSTERS[3],
    status: "upcoming", revenueBDT: 0, ticketsSold: 0, capacity: 800,
    livestream: "off", funding: "not_started", opensOn: "2026-10-11", venue: "Chittagong Theatre Institute",
  },
  {
    id: "p5", title: "Chithi", poster: POSTERS[4],
    status: "running", revenueBDT: 460_000, ticketsSold: 720, capacity: 1_100,
    livestream: "scheduled", funding: "funded", opensOn: "2026-07-02", venue: "Shilpakala Academy · Hall 2",
  },
  {
    id: "p6", title: "Meghnad Badh Kabya", poster: POSTERS[5],
    status: "closed", revenueBDT: 1_320_000, ticketsSold: 2_100, capacity: 2_100,
    livestream: "recorded", funding: "funded", opensOn: "2026-03-15", venue: "National Theatre Hall",
  },
];

// ── Funding ─────────────────────────────────────────────────
export interface Campaign {
  id: string;
  title: string;
  goalBDT: number;
  raisedBDT: number;
  deadline: string;
  sponsors: number;
  communityInvestors: number;
  cover: string;
}

export const campaigns: Campaign[] = [
  { id: "c1", title: "Nakshi Kanthar Math · National Tour", goalBDT: 2_500_000, raisedBDT: 1_890_000, deadline: "2026-09-30", sponsors: 5, communityInvestors: 148, cover: POSTERS[0] },
  { id: "c2", title: "Ekattorer Jishu · Costume & Set", goalBDT: 800_000, raisedBDT: 320_000, deadline: "2026-08-10", sponsors: 2, communityInvestors: 61, cover: POSTERS[2] },
  { id: "c3", title: "Youth Ensemble Scholarship", goalBDT: 500_000, raisedBDT: 470_000, deadline: "2026-07-25", sponsors: 3, communityInvestors: 92, cover: POSTERS[1] },
  { id: "c4", title: "Rural Theatre Outreach 2026", goalBDT: 1_200_000, raisedBDT: 210_000, deadline: "2026-11-20", sponsors: 1, communityInvestors: 24, cover: POSTERS[3] },
];

// ── Community ───────────────────────────────────────────────
export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  venue: string;
  registrations: number;
  capacity: number;
  cover: string;
}

export const communityEvents: CommunityEvent[] = [
  { id: "e1", title: "Monthly Actors' Meetup", date: "2026-07-21", venue: "Bailey Road Studio", registrations: 62, capacity: 80, cover: POSTERS[4] },
  { id: "e2", title: "Open Mic: New Playwrights", date: "2026-08-04", venue: "Aloki Café, Dhanmondi", registrations: 41, capacity: 60, cover: POSTERS[5] },
  { id: "e3", title: "Backstage Tour: Nakshi Kanthar Math", date: "2026-07-30", venue: "Shilpakala Academy", registrations: 118, capacity: 150, cover: POSTERS[0] },
];

export const announcements = [
  { id: "a1", title: "Auditions open for Ekattorer Jishu", posted: "2 days ago", body: "Casting call for 4 supporting roles. Deadline: July 25." },
  { id: "a2", title: "Rehearsal schedule updated", posted: "5 days ago", body: "Weekend rehearsals moved to Studio 2 from July 20." },
  { id: "a3", title: "Sponsor spotlight: Grameenphone", posted: "1 week ago", body: "Grameenphone joins our National Tour as presenting sponsor." },
];

export const gallery = POSTERS.slice(0, 6);

// ── Learning ────────────────────────────────────────────────
export interface Program {
  id: string;
  title: string;
  instructor: string;
  enrolled: number;
  seats: number;
  duration: string;
  certificates: number;
  cover: string;
  format: "Workshop" | "Program" | "Masterclass";
}

export const programs: Program[] = [
  { id: "l1", title: "Method Acting Foundations", instructor: "Ferdous Alam", enrolled: 34, seats: 40, duration: "8 weeks", certificates: 128, cover: POSTERS[1], format: "Program" },
  { id: "l2", title: "Voice for the Stage", instructor: "Rukhsana Kabir", enrolled: 22, seats: 25, duration: "4 weeks", certificates: 76, cover: POSTERS[3], format: "Workshop" },
  { id: "l3", title: "Playwriting Masterclass", instructor: "Imtiaz Hossain", enrolled: 18, seats: 30, duration: "6 weeks", certificates: 44, cover: POSTERS[2], format: "Masterclass" },
  { id: "l4", title: "Stage Combat 101", instructor: "Tanvir Ahmed", enrolled: 26, seats: 30, duration: "3 weeks", certificates: 91, cover: POSTERS[4], format: "Workshop" },
];

// ── Opportunities ───────────────────────────────────────────
export type OppKind = "hiring" | "auditions" | "internships" | "collaborations";

export interface Opportunity {
  id: string;
  kind: OppKind;
  title: string;
  location: string;
  posted: string;
  applicants: number;
  deadline: string;
  tags: string[];
}

export const opportunities: Opportunity[] = [
  { id: "o1", kind: "hiring", title: "Full-time Sound Designer", location: "Dhaka · On-site", posted: "3 days ago", applicants: 24, deadline: "2026-08-15", tags: ["Full-time", "Senior"] },
  { id: "o2", kind: "hiring", title: "Lighting Technician", location: "Dhaka · Hybrid", posted: "1 week ago", applicants: 12, deadline: "2026-08-20", tags: ["Contract"] },
  { id: "o3", kind: "auditions", title: "Ekattorer Jishu · Supporting Cast", location: "Studio 2, Dhaka", posted: "2 days ago", applicants: 87, deadline: "2026-07-25", tags: ["Ages 20-35", "Bangla"] },
  { id: "o4", kind: "auditions", title: "Chithi · Ensemble Recall", location: "Rehearsal Hall B", posted: "5 days ago", applicants: 41, deadline: "2026-07-30", tags: ["Recall"] },
  { id: "o5", kind: "internships", title: "Production Assistant Intern", location: "Dhaka · 3 months", posted: "1 week ago", applicants: 58, deadline: "2026-08-01", tags: ["Paid", "Students"] },
  { id: "o6", kind: "internships", title: "Costume Design Apprentice", location: "Dhaka · 6 months", posted: "4 days ago", applicants: 19, deadline: "2026-08-10", tags: ["Stipend"] },
  { id: "o7", kind: "collaborations", title: "Co-produce with Prachyanat", location: "Dhaka", posted: "2 weeks ago", applicants: 3, deadline: "2026-09-01", tags: ["Co-production"] },
  { id: "o8", kind: "collaborations", title: "University Tour Partnership", location: "Nationwide", posted: "1 week ago", applicants: 7, deadline: "2026-09-15", tags: ["Tour", "Universities"] },
];

// ── Analytics ───────────────────────────────────────────────
export const revenueSeries = [
  { month: "Jan", tickets: 420, sponsors: 180, subs: 60 },
  { month: "Feb", tickets: 510, sponsors: 220, subs: 78 },
  { month: "Mar", tickets: 680, sponsors: 250, subs: 92 },
  { month: "Apr", tickets: 590, sponsors: 300, subs: 110 },
  { month: "May", tickets: 720, sponsors: 340, subs: 128 },
  { month: "Jun", tickets: 890, sponsors: 410, subs: 145 },
  { month: "Jul", tickets: 1_040, sponsors: 480, subs: 168 },
];

export const audienceGrowth = [
  { month: "Jan", followers: 9_800, newsletter: 1_200 },
  { month: "Feb", followers: 10_400, newsletter: 1_360 },
  { month: "Mar", followers: 11_900, newsletter: 1_620 },
  { month: "Apr", followers: 13_100, newsletter: 1_810 },
  { month: "May", followers: 14_900, newsletter: 2_040 },
  { month: "Jun", followers: 16_700, newsletter: 2_310 },
  { month: "Jul", followers: 18_420, newsletter: 2_580 },
];

export const membershipGrowth = [
  { month: "Jan", members: 28 },
  { month: "Feb", members: 30 },
  { month: "Mar", members: 33 },
  { month: "Apr", members: 35 },
  { month: "May", members: 38 },
  { month: "Jun", members: 40 },
  { month: "Jul", members: 42 },
];

export const productionPopularity = [
  { title: "Nakshi Kanthar Math", score: 92 },
  { title: "Raktakarabi", score: 88 },
  { title: "Meghnad Badh Kabya", score: 84 },
  { title: "Chithi", score: 71 },
  { title: "Ekattorer Jishu", score: 58 },
];

// ── Notifications / applications / rehearsals ─────────────
export const notifications = [
  { id: "n1", title: "New sponsor pledge: BRAC Bank · ৳500,000", time: "12m ago", tone: "success" as const },
  { id: "n2", title: "Rukhsana Kabir accepted lead role in Chithi", time: "1h ago", tone: "info" as const },
  { id: "n3", title: "Livestream test scheduled for Ekattorer Jishu", time: "3h ago", tone: "info" as const },
  { id: "n4", title: "Costume budget exceeded by 8%", time: "yesterday", tone: "warn" as const },
];

export const rehearsals = [
  { id: "r1", title: "Nakshi Kanthar Math · Act II Blocking", date: "Today · 6:30 PM", venue: "Studio 1", lead: "Ferdous Alam" },
  { id: "r2", title: "Chithi · Full Run", date: "Tomorrow · 5:00 PM", venue: "Studio 2", lead: "Anika Tabassum" },
  { id: "r3", title: "Ekattorer Jishu · Read-through", date: "Sat · 4:00 PM", venue: "Studio 1", lead: "Imtiaz Hossain" },
];

export const recentApplications = [
  { id: "ra1", name: "Farhan Kabir", role: "Sound Designer", opp: "Full-time Sound Designer", time: "2h ago" },
  { id: "ra2", name: "Sumaiya Islam", role: "Ensemble Actor", opp: "Ekattorer Jishu Audition", time: "5h ago" },
  { id: "ra3", name: "Rafat Zaman", role: "Intern", opp: "Production Assistant", time: "8h ago" },
  { id: "ra4", name: "Nazia Chowdhury", role: "Costume Apprentice", opp: "Costume Design Apprentice", time: "1d ago" },
];
