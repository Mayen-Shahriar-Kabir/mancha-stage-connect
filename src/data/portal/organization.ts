// Placeholder data for the Organization Dashboard (Mancha).
// The single dashboard adapts UI to organization_type.

import type { OrganizationType } from "@/hooks/use-auth";

export const orgSummary = {
  activeCollaborations: 6,
  activeCollaborationsDelta: 12.5,
  upcomingEvents: 4,
  upcomingEventsDelta: 33.0,
  openOpportunities: 9,
  openOpportunitiesDelta: 8.0,
  peopleReached: 24_500,
  peopleReachedDelta: 17.4,
};

// ── Recent requests ────────────────────────────────
export interface OrgRequest {
  id: string;
  from: string;
  purpose: string;
  status: "new" | "review" | "approved" | "declined";
  when: string;
}
export const recentRequests: OrgRequest[] = [
  { id: "r1", from: "Nagorik Natya Sampradaya", purpose: "Campus tour — 3 shows", status: "new", when: "1h" },
  { id: "r2", from: "Aranyak Natyadal", purpose: "CSR sponsorship pitch", status: "review", when: "5h" },
  { id: "r3", from: "Theatre Factory", purpose: "Casting collaboration", status: "approved", when: "Yesterday" },
  { id: "r4", from: "Loko Natya Dol", purpose: "Cultural festival slot", status: "review", when: "2 days" },
];

// ── Upcoming events ────────────────────────────────
export interface OrgEvent {
  id: string;
  title: string;
  date: string; // ISO
  time: string;
  venue: string;
  partner: string;
  status: "confirmed" | "planning" | "cancelled";
}
export const orgEvents: OrgEvent[] = [
  { id: "e1", title: "Winter Theatre Festival — Opening", date: "2026-02-14", time: "6:00 PM", venue: "Central Auditorium", partner: "Nagorik", status: "confirmed" },
  { id: "e2", title: "Playwright Roundtable", date: "2026-02-19", time: "4:00 PM", venue: "Faculty Lounge", partner: "Prachyanat", status: "confirmed" },
  { id: "e3", title: "Casting Workshop — Female leads", date: "2026-02-27", time: "10:00 AM", venue: "Studio 3", partner: "Aranyak", status: "planning" },
  { id: "e4", title: "Rural Tour Launch", date: "2026-03-05", time: "5:30 PM", venue: "Riverside Stage", partner: "Loko Natya Dol", status: "planning" },
  { id: "e5", title: "Youth Drama Showcase", date: "2026-03-12", time: "3:00 PM", venue: "Open Air Theatre", partner: "IUB Drama Soc.", status: "confirmed" },
];

// ── Collaborations ─────────────────────────────────
export interface Collaboration {
  id: string;
  partner: string;
  title: string;
  status: "active" | "pending" | "completed" | "declined";
  budgetBDT: number;
  timeline: string;
  progress: number;
}
export const collaborations: Collaboration[] = [
  { id: "col1", partner: "Nagorik Natya Sampradaya", title: "12-district National Tour", status: "active", budgetBDT: 3_500_000, timeline: "Feb–May 2026", progress: 42 },
  { id: "col2", partner: "Prachyanat", title: "Youth Actors Fellowship", status: "active", budgetBDT: 850_000, timeline: "Jan–Dec 2026", progress: 18 },
  { id: "col3", partner: "Aranyak", title: "Campus Playwriting Residency", status: "pending", budgetBDT: 500_000, timeline: "Mar–Jun 2026", progress: 0 },
  { id: "col4", partner: "Theatre Factory", title: "Original web series pilot", status: "completed", budgetBDT: 1_200_000, timeline: "Aug–Dec 2025", progress: 100 },
  { id: "col5", partner: "Dhaka Theatre", title: "CSR Cultural Grant 2025", status: "completed", budgetBDT: 750_000, timeline: "2025", progress: 100 },
  { id: "col6", partner: "Loko Natya Dol", title: "Folk Revival Series", status: "declined", budgetBDT: 300_000, timeline: "—", progress: 0 },
];

// ── Bookings ───────────────────────────────────────
export interface OrgBooking {
  id: string;
  what: string;
  who: string;
  when: string;
  amountBDT: number;
  status: "upcoming" | "completed" | "cancelled";
}
export const orgBookings: OrgBooking[] = [
  { id: "b1", what: "Private show — Foundation Day", who: "Nagorik Natya Sampradaya", when: "Feb 14, 2026", amountBDT: 250_000, status: "upcoming" },
  { id: "b2", what: "Workshop — Voice for Presenters", who: "Mancha Academy", when: "Feb 22, 2026", amountBDT: 120_000, status: "upcoming" },
  { id: "b3", what: "Festival slot — Winter Edition", who: "Aranyak", when: "Feb 28, 2026", amountBDT: 180_000, status: "upcoming" },
  { id: "b4", what: "Cultural evening", who: "Prangone Mor", when: "Dec 10, 2025", amountBDT: 150_000, status: "completed" },
  { id: "b5", what: "Charity gala performance", who: "Dhaka Theatre", when: "Nov 22, 2025", amountBDT: 400_000, status: "completed" },
  { id: "b6", what: "Rain-out reschedule", who: "Loko Natya Dol", when: "Oct 05, 2025", amountBDT: 0, status: "cancelled" },
];

// ── Opportunities (posted by this org) ─────────────
export interface OrgOpportunity {
  id: string;
  title: string;
  kind: "audition" | "internship" | "job" | "sponsorship" | "workshop";
  applications: number;
  deadline: string;
  status: "open" | "closed" | "draft";
}
export const orgOpportunities: OrgOpportunity[] = [
  { id: "op1", title: "Casting call — 'Rakter Onnesha' lead", kind: "audition", applications: 148, deadline: "Feb 20", status: "open" },
  { id: "op2", title: "Assistant Director Internship (6 mo)", kind: "internship", applications: 62, deadline: "Feb 28", status: "open" },
  { id: "op3", title: "CSR sponsorship — Winter Festival", kind: "sponsorship", applications: 24, deadline: "Mar 10", status: "open" },
  { id: "op4", title: "Voice Workshop facilitator", kind: "workshop", applications: 18, deadline: "Feb 15", status: "open" },
  { id: "op5", title: "Season 24 Stage Manager", kind: "job", applications: 41, deadline: "Jan 30", status: "closed" },
  { id: "op6", title: "Ensemble callback (draft)", kind: "audition", applications: 0, deadline: "—", status: "draft" },
];

// ── Type-specific highlight blocks ─────────────────
export interface OrgHighlight {
  title: string;
  value: string;
  hint: string;
}

export const highlightsByType: Record<OrganizationType, OrgHighlight[]> = {
  university: [
    { title: "Internship Programs", value: "8 active", hint: "144 student placements this semester" },
    { title: "Campus Performances", value: "12 shows", hint: "Winter season, 4 halls" },
    { title: "Student Workshops", value: "22 sessions", hint: "Voice, movement, directing" },
    { title: "Theatre Festivals", value: "2 hosted", hint: "Winter Fest + Interfaculty Cup" },
  ],
  corporate: [
    { title: "CSR Sponsorships", value: "৳48L", hint: "6 productions backed FY25" },
    { title: "Private Events", value: "9 booked", hint: "Foundation Day, Town Halls" },
    { title: "Brand Partnerships", value: "4 active", hint: "Season activations" },
    { title: "Employee Engagement", value: "2,340", hint: "Attended cultural nights" },
  ],
  tourism_board: [
    { title: "Cultural Programs", value: "14 running", hint: "Across 8 tourism zones" },
    { title: "Tourism Events", value: "6 upcoming", hint: "Rangamati, Cox's, Sonargaon" },
    { title: "Festival Bookings", value: "18 groups", hint: "Winter Festival lineup" },
    { title: "Heritage Reach", value: "62K", hint: "Visitors engaged FY25" },
  ],
  film_ott: [
    { title: "Open Auditions", value: "12 casts", hint: "Series, films, ads" },
    { title: "Casting Calls", value: "148 apps", hint: "For 'Rakter Onnesha' lead" },
    { title: "Talent Discovery", value: "84 profiles", hint: "Shortlisted this month" },
    { title: "Content Slate", value: "5 titles", hint: "In active pre-production" },
  ],
};

export const quickActionsByType: Record<OrganizationType, { label: string }[]> = {
  university: [
    { label: "Host Performance" },
    { label: "Open Internship" },
    { label: "Create Workshop" },
  ],
  corporate: [
    { label: "Sponsor Production" },
    { label: "Book Theatre Group" },
    { label: "Post Brand Brief" },
  ],
  tourism_board: [
    { label: "Organize Cultural Show" },
    { label: "Invite Theatre Group" },
    { label: "Schedule Festival Slot" },
  ],
  film_ott: [
    { label: "Publish Audition" },
    { label: "Invite Artist" },
    { label: "Post Casting Brief" },
  ],
};

export const orgTypeLabels: Record<OrganizationType, string> = {
  university: "University",
  corporate: "Corporate Partner",
  tourism_board: "Tourism Board",
  film_ott: "Film & OTT Studio",
};

// ── Analytics series ───────────────────────────────
export const engagementSeries = [
  { m: "Aug", reach: 12_400, events: 3 },
  { m: "Sep", reach: 14_800, events: 4 },
  { m: "Oct", reach: 15_900, events: 4 },
  { m: "Nov", reach: 18_600, events: 5 },
  { m: "Dec", reach: 22_100, events: 6 },
  { m: "Jan", reach: 24_500, events: 7 },
];

export const spendMix = [
  { name: "Productions", value: 42 },
  { name: "Sponsorships", value: 28 },
  { name: "Workshops", value: 18 },
  { name: "Marketing", value: 12 },
];

export const partnerMix = [
  { name: "Groups", value: 12 },
  { name: "Artists", value: 34 },
  { name: "Venues", value: 6 },
  { name: "Media", value: 4 },
];

export const notifications = [
  { id: "on1", title: "Nagorik accepted your Foundation Day booking", when: "1h", tone: "success" as const },
  { id: "on2", title: "3 new casting applications on 'Rakter Onnesha'", when: "4h", tone: "info" as const },
  { id: "on3", title: "Sponsorship invoice ready for Winter Festival", when: "Yesterday", tone: "warn" as const },
];
