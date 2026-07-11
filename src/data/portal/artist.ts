// Placeholder data for the Theatre Artist Dashboard (Mancha).

export const artistProfile = {
  name: "Anika Rahman",
  headline: "Actor · Director · Voice Artist · Dhaka",
  bio:
    "A stage-forward performer with a decade in Bangladeshi theatre. Recent lead in 'Nakshi Kanthar Math' and voice principal for Radio Bangladesh's cultural hour.",
  photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
  cover:
    "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1400",
  specialization: ["Method Acting", "Voice Direction", "Movement"],
  skills: ["Bengali dialect coaching", "Improv", "Combat choreography", "Puppetry"],
  languages: ["Bengali (Native)", "English (Fluent)", "Hindi (Conversational)"],
  awards: [
    { title: "Meril Prothom Alo — Best Stage Actor", year: 2024 },
    { title: "Bangla Academy Young Artist Fellowship", year: 2022 },
  ],
  socials: {
    website: "anika-stage.bd",
    instagram: "@anika.onstage",
    youtube: "AnikaRahmanStage",
  },
  availability: "available" as "available" | "busy" | "on_tour",
  resumeUrl: "#",
  completion: 82,
} as const;

export const currentGroup = {
  slug: "nagorik-natya-sampradaya",
  name: "Nagorik Natya Sampradaya",
  since: "Feb 2022",
  role: "Lead Actor",
  cover:
    "https://images.unsplash.com/photo-1503095396549-807759245b35?w=800",
};

export const pastGroups = [
  { slug: "prangone-mor", name: "Prangone Mor", years: "2018–2021", role: "Ensemble" },
  { slug: "theatre-art-unit", name: "Theatre Art Unit", years: "2015–2018", role: "Trainee" },
];

export const recommendedGroups = [
  { slug: "loko-natya-dol", name: "Loko Natya Dol", city: "Dhaka", members: 34, match: 92 },
  { slug: "aranyak-natyadal", name: "Aranyak Natyadal", city: "Dhaka", members: 51, match: 87 },
  { slug: "theatre-cantonment", name: "Theatre (Cantonment)", city: "Dhaka", members: 22, match: 81 },
];

export const joinRequests = [
  { slug: "dhaka-theatre", name: "Dhaka Theatre", status: "review" as const, submitted: "3 days ago" },
];

// ── Applications ────────────────────────────────────
export type ApplicationStatus = "submitted" | "shortlisted" | "accepted" | "rejected";
export interface Application {
  id: string;
  role: string;
  organization: string;
  date: string;
  status: ApplicationStatus;
}
export const applications: Application[] = [
  { id: "a1", role: "Lead — 'Meghdoot'", organization: "Aranyak Natyadal", date: "2 days ago", status: "shortlisted" },
  { id: "a2", role: "Voice Director", organization: "Chorki Originals", date: "5 days ago", status: "submitted" },
  { id: "a3", role: "Supporting Cast", organization: "Loko Natya Dol", date: "1 week ago", status: "accepted" },
  { id: "a4", role: "Movement Coach", organization: "IUB Drama Society", date: "2 weeks ago", status: "submitted" },
  { id: "a5", role: "Ensemble", organization: "Theatre Art Unit", date: "3 weeks ago", status: "rejected" },
  { id: "a6", role: "Narrator", organization: "Bengal Foundation", date: "1 month ago", status: "accepted" },
];

// ── Invitations ─────────────────────────────────────
export interface Invitation {
  id: string;
  group: string;
  role: string;
  message: string;
  received: string;
}
export const invitations: Invitation[] = [
  {
    id: "i1",
    group: "Prachyanat",
    role: "Guest Director — Winter workshop",
    message: "We'd love your voice-work module for our January cohort. Two weekends, honorarium confirmed.",
    received: "Yesterday",
  },
  {
    id: "i2",
    group: "Theatre Factory",
    role: "Lead — 'Rakter Onnesha'",
    message: "Auditioned for the mother-role and the room lit up. Rehearsals begin March 4.",
    received: "3 days ago",
  },
];

// ── Productions ─────────────────────────────────────
export interface ArtistProduction {
  id: string;
  title: string;
  role: string;
  group: string;
  year: number;
  status: "running" | "closed" | "upcoming";
  poster: string;
}
export const artistProductions: ArtistProduction[] = [
  { id: "p1", title: "Nakshi Kanthar Math", role: "Rupai (Lead)", group: "Nagorik", year: 2025, status: "running", poster: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=600" },
  { id: "p2", title: "Meghdoot", role: "Yaksha", group: "Aranyak", year: 2024, status: "closed", poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
  { id: "p3", title: "Chairs", role: "Old Woman", group: "Theatre Art Unit", year: 2023, status: "closed", poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
  { id: "p4", title: "The Mountaintop", role: "Camae", group: "Prachyanat", year: 2026, status: "upcoming", poster: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600" },
];

// ── Training & Certificates ─────────────────────────
export interface TrainingCourse {
  id: string;
  title: string;
  provider: string;
  progress: number;
  hours: number;
}
export const training: TrainingCourse[] = [
  { id: "t1", title: "Advanced Movement for Actors", provider: "Prachyanat School", progress: 68, hours: 24 },
  { id: "t2", title: "Voice for the Stage — Level II", provider: "Mancha Academy", progress: 100, hours: 32 },
  { id: "t3", title: "Directing Devised Work", provider: "BSA Workshop", progress: 42, hours: 40 },
];
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  credentialId: string;
}
export const certificates: Certificate[] = [
  { id: "c1", title: "Voice for the Stage — Level II", issuer: "Mancha Academy", issued: "May 2025", credentialId: "MA-V2-0421" },
  { id: "c2", title: "Combat & Movement Safety", issuer: "Aranyak Training", issued: "Feb 2024", credentialId: "AR-CM-118" },
  { id: "c3", title: "Youth Theatre Facilitator", issuer: "British Council", issued: "Aug 2023", credentialId: "BC-YTF-2306" },
];

// ── Opportunities (shared shape) ────────────────────
export type OpportunityKind = "jobs" | "auditions" | "internships" | "collaborations";
export interface Opportunity {
  id: string;
  kind: OpportunityKind;
  title: string;
  org: string;
  location: string;
  deadline: string;
  compensation?: string;
  tags: string[];
}
export const opportunities: Opportunity[] = [
  { id: "o1", kind: "jobs", title: "Resident Director", org: "Loko Natya Dol", location: "Dhaka", deadline: "Feb 15", compensation: "৳55K/mo", tags: ["Full-time", "3-yr contract"] },
  { id: "o2", kind: "jobs", title: "Head of Voice Department", org: "Mancha Academy", location: "Dhaka", deadline: "Feb 28", compensation: "৳70K/mo", tags: ["Faculty"] },
  { id: "o3", kind: "auditions", title: "Lead — 'Anna Karenina Reimagined'", org: "Aranyak Natyadal", location: "Dhaka", deadline: "Feb 10", tags: ["Female, 30-40"] },
  { id: "o4", kind: "auditions", title: "Ensemble — Winter Show", org: "Theatre Factory", location: "Chittagong", deadline: "Feb 22", tags: ["All genders"] },
  { id: "o5", kind: "internships", title: "Assistant Director Fellowship", org: "Bengal Foundation", location: "Dhaka", deadline: "Mar 05", compensation: "Stipend", tags: ["6 months"] },
  { id: "o6", kind: "collaborations", title: "Bilingual Devised Piece", org: "Prangone Mor", location: "Remote/Hybrid", deadline: "Rolling", tags: ["Co-create", "Royalty"] },
];

// ── Notifications ───────────────────────────────────
export const notifications = [
  { id: "n1", title: "Aranyak shortlisted you for 'Meghdoot'", when: "2h", tone: "success" as const },
  { id: "n2", title: "Prachyanat sent you an invitation", when: "Yesterday", tone: "info" as const },
  { id: "n3", title: "Voice Level II certificate issued", when: "3d", tone: "info" as const },
  { id: "n4", title: "Rehearsal moved to 6 PM on Thursday", when: "5d", tone: "warn" as const },
];
