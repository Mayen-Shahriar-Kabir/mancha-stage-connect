// Placeholder data for the Mancha Admin Dashboard.
// Purely illustrative — replace with live queries in a later phase.

export type ApprovalRole = "Theatre Artist" | "Theatre Group" | "Organization";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface Approval {
  id: string;
  name: string;
  email: string;
  role: ApprovalRole;
  submittedAt: string; // ISO
  note?: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Artist" | "Group" | "Organization" | "Audience";
  status: "active" | "pending" | "suspended";
  joined: string;
  location?: string;
}

export interface Production {
  id: string;
  title: string;
  group: string;
  status: "running" | "upcoming" | "sold_out" | "closed";
  revenueBDT: number;
  ticketsSold: number;
  capacity: number;
  cover: string;
  type: "Drama" | "Musical" | "Experimental" | "Children" | "Classical";
}

export interface FundingCampaign {
  id: string;
  title: string;
  group: string;
  goalBDT: number;
  raisedBDT: number;
  sponsor?: string;
  status: "active" | "funded" | "review" | "closed";
  endsAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceBDT: number;
  interval: "month" | "year";
  subscribers: number;
  perks: string[];
  featured?: boolean;
}

export interface Review {
  id: string;
  author: string;
  target: string;
  rating: number; // 1-5
  excerpt: string;
  flagged?: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  kind: "registration" | "production" | "funding" | "review";
  title: string;
  meta: string;
  time: string;
}

// ─── Top-line stats ───────────────────────────────────────────────
export const adminStats = {
  totalUsers: 12480,
  totalUsersDelta: 8.4,
  pendingApprovals: 34,
  pendingApprovalsDelta: -12.1,
  activeProductions: 58,
  activeProductionsDelta: 4.2,
  monthlyRevenueBDT: 2_845_000,
  monthlyRevenueDelta: 15.7,
  premiumSubscribers: 1_284,
  premiumSubscribersDelta: 6.5,
  trainingPrograms: 22,
  trainingProgramsDelta: 3.1,
  communityMeetups: 41,
  communityMeetupsDelta: 11.2,
};

// ─── Charts ───────────────────────────────────────────────────────
export const usersByRole = [
  { role: "Audience", value: 9_820 },
  { role: "Artists", value: 1_640 },
  { role: "Groups", value: 512 },
  { role: "Organizations", value: 288 },
  { role: "Admins", value: 12 },
];

export const monthlyGrowth = [
  { month: "Jan", users: 640, productions: 8 },
  { month: "Feb", users: 780, productions: 11 },
  { month: "Mar", users: 910, productions: 14 },
  { month: "Apr", users: 1120, productions: 18 },
  { month: "May", users: 1340, productions: 21 },
  { month: "Jun", users: 1580, productions: 24 },
  { month: "Jul", users: 1720, productions: 28 },
  { month: "Aug", users: 1985, productions: 32 },
  { month: "Sep", users: 2210, productions: 36 },
  { month: "Oct", users: 2440, productions: 41 },
  { month: "Nov", users: 2680, productions: 47 },
  { month: "Dec", users: 2960, productions: 52 },
];

export const revenueTrend = [
  { month: "Jan", tickets: 480, subs: 210, sponsor: 120 },
  { month: "Feb", tickets: 520, subs: 240, sponsor: 140 },
  { month: "Mar", tickets: 610, subs: 260, sponsor: 180 },
  { month: "Apr", tickets: 720, subs: 300, sponsor: 210 },
  { month: "May", tickets: 810, subs: 340, sponsor: 260 },
  { month: "Jun", tickets: 940, subs: 380, sponsor: 300 },
  { month: "Jul", tickets: 1080, subs: 420, sponsor: 340 },
  { month: "Aug", tickets: 1210, subs: 460, sponsor: 380 },
  { month: "Sep", tickets: 1340, subs: 490, sponsor: 420 },
  { month: "Oct", tickets: 1490, subs: 520, sponsor: 460 },
  { month: "Nov", tickets: 1640, subs: 560, sponsor: 510 },
  { month: "Dec", tickets: 1820, subs: 610, sponsor: 570 },
];

export const productionTypes = [
  { type: "Drama", value: 38 },
  { type: "Musical", value: 22 },
  { type: "Experimental", value: 14 },
  { type: "Children", value: 12 },
  { type: "Classical", value: 8 },
];

// ─── Approvals ────────────────────────────────────────────────────
export const pendingApprovalsList: Approval[] = [
  { id: "a1", name: "Nusrat Rahman", email: "nusrat@dhaka-arts.bd", role: "Theatre Artist", submittedAt: "2026-07-08T09:12:00Z", note: "Solo performer, 7 years experience" },
  { id: "a2", name: "Prottoy Theatre", email: "hello@prottoy.bd", role: "Theatre Group", submittedAt: "2026-07-08T14:40:00Z", note: "Chittagong-based, 14 members" },
  { id: "a3", name: "BRAC University", email: "arts@bracu.ac.bd", role: "Organization", submittedAt: "2026-07-09T11:05:00Z" },
  { id: "a4", name: "Sadia Chowdhury", email: "sadia.c@gmail.com", role: "Theatre Artist", submittedAt: "2026-07-09T16:22:00Z" },
  { id: "a5", name: "Loko Natya Dol", email: "loko@natya.bd", role: "Theatre Group", submittedAt: "2026-07-10T08:00:00Z", note: "Folk theatre from Sylhet" },
  { id: "a6", name: "Grameenphone CSR", email: "csr@grameenphone.com", role: "Organization", submittedAt: "2026-07-10T10:31:00Z" },
];

// ─── Users ────────────────────────────────────────────────────────
export const adminUsers: AdminUser[] = [
  { id: "u1", name: "Anika Tabassum", email: "anika@mancha.bd", role: "Artist", status: "active", joined: "2025-11-02", location: "Dhaka" },
  { id: "u2", name: "Rafiq Ahmed", email: "rafiq@theatrebd.com", role: "Group", status: "active", joined: "2025-09-14", location: "Chittagong" },
  { id: "u3", name: "Dhaka University", email: "arts@du.ac.bd", role: "Organization", status: "active", joined: "2025-06-30", location: "Dhaka" },
  { id: "u4", name: "Tanveer Hossain", email: "tanveer@gmail.com", role: "Audience", status: "active", joined: "2026-01-11", location: "Sylhet" },
  { id: "u5", name: "Nusrat Rahman", email: "nusrat@dhaka-arts.bd", role: "Artist", status: "pending", joined: "2026-07-08", location: "Dhaka" },
  { id: "u6", name: "Prottoy Theatre", email: "hello@prottoy.bd", role: "Group", status: "pending", joined: "2026-07-08", location: "Chittagong" },
  { id: "u7", name: "Rana Mia", email: "rana@old.bd", role: "Audience", status: "suspended", joined: "2024-03-19", location: "Khulna" },
  { id: "u8", name: "Selim Al-Deen Foundation", email: "hello@saldn.org", role: "Organization", status: "active", joined: "2025-02-04", location: "Dhaka" },
  { id: "u9", name: "Marufa Islam", email: "marufa@artist.bd", role: "Artist", status: "active", joined: "2025-10-22", location: "Rajshahi" },
  { id: "u10", name: "Zubair Rahman", email: "zubair@mancha.bd", role: "Admin", status: "active", joined: "2025-01-01", location: "Dhaka" },
  { id: "u11", name: "Faria Kabir", email: "faria@aud.bd", role: "Audience", status: "active", joined: "2026-04-17", location: "Dhaka" },
  { id: "u12", name: "Loko Natya Dol", email: "loko@natya.bd", role: "Group", status: "pending", joined: "2026-07-10", location: "Sylhet" },
];

// ─── Productions ──────────────────────────────────────────────────
const cover = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=800&q=60`;

export const productions: Production[] = [
  { id: "p1", title: "Nagorik Andolon", group: "Nagorik Natya Sampradaya", status: "running", revenueBDT: 480_000, ticketsSold: 620, capacity: 800, type: "Drama", cover: cover("1503095396549-807759245b35") },
  { id: "p2", title: "Rakter Aksharey", group: "Theatre Art Unit", status: "sold_out", revenueBDT: 720_000, ticketsSold: 900, capacity: 900, type: "Drama", cover: cover("1519741497674-611481863552") },
  { id: "p3", title: "Meghdoot", group: "Prachyanat", status: "upcoming", revenueBDT: 120_000, ticketsSold: 180, capacity: 700, type: "Classical", cover: cover("1516280440614-37939bbacd81") },
  { id: "p4", title: "Chad Sultana", group: "Aranyak Natya Dal", status: "running", revenueBDT: 360_000, ticketsSold: 540, capacity: 750, type: "Musical", cover: cover("1470229722913-7c0e2dbbafd3") },
  { id: "p5", title: "Chhotoder Rangamancha", group: "Little Stars", status: "running", revenueBDT: 210_000, ticketsSold: 420, capacity: 500, type: "Children", cover: cover("1533107862482-0e6974b06ec4") },
  { id: "p6", title: "Ekattor'er Golpo", group: "Muktadhara", status: "closed", revenueBDT: 940_000, ticketsSold: 1200, capacity: 1200, type: "Drama", cover: cover("1514306191717-452ec28c7814") },
  { id: "p7", title: "Neel Akasher Niche", group: "Palakar", status: "upcoming", revenueBDT: 90_000, ticketsSold: 130, capacity: 600, type: "Experimental", cover: cover("1493225457124-a3eb161ffa5f") },
  { id: "p8", title: "Rabindra Sondhya", group: "Chhayanaut", status: "running", revenueBDT: 540_000, ticketsSold: 680, capacity: 900, type: "Classical", cover: cover("1524178232363-1fb2b075b655") },
];

// ─── Funding ──────────────────────────────────────────────────────
export const fundingCampaigns: FundingCampaign[] = [
  { id: "f1", title: "Restage Padma Nadir Majhi", group: "Aranyak Natya Dal", goalBDT: 1_500_000, raisedBDT: 1_120_000, sponsor: "Grameenphone CSR", status: "active", endsAt: "2026-08-30" },
  { id: "f2", title: "Rural Theatre Circuit", group: "Loko Natya Dol", goalBDT: 800_000, raisedBDT: 800_000, sponsor: "BRAC", status: "funded", endsAt: "2026-06-15" },
  { id: "f3", title: "Youth Playwright Grants", group: "Mancha Foundation", goalBDT: 500_000, raisedBDT: 240_000, sponsor: "Dhaka University", status: "active", endsAt: "2026-09-20" },
  { id: "f4", title: "Heritage Costume Archive", group: "Nagorik Natya Sampradaya", goalBDT: 1_200_000, raisedBDT: 340_000, status: "review", endsAt: "2026-10-01" },
  { id: "f5", title: "Chittagong Studio Renovation", group: "Prottoy Theatre", goalBDT: 2_000_000, raisedBDT: 1_640_000, sponsor: "Corporate Circle", status: "active", endsAt: "2026-11-12" },
  { id: "f6", title: "OTT Adaptation Fund", group: "Palakar", goalBDT: 3_000_000, raisedBDT: 950_000, status: "active", endsAt: "2026-12-31" },
];

// ─── Subscriptions ────────────────────────────────────────────────
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free", name: "Rasik (Free)", priceBDT: 0, interval: "month", subscribers: 10_930,
    perks: ["Browse shows & artists", "Community feed", "Newsletter"],
  },
  {
    id: "premium", name: "Premium Rasik", priceBDT: 299, interval: "month", subscribers: 1_120, featured: true,
    perks: ["Early ticket access", "10% off tickets", "Exclusive backstage stories", "HD show archives"],
  },
  {
    id: "patron", name: "Patron Circle", priceBDT: 2_499, interval: "month", subscribers: 164,
    perks: ["All Premium perks", "Named credit in playbill", "Private meet-and-greets", "Quarterly gift box"],
  },
];

export const subscriptionRevenueTrend = [
  { month: "Jan", value: 210 },
  { month: "Feb", value: 240 },
  { month: "Mar", value: 260 },
  { month: "Apr", value: 300 },
  { month: "May", value: 340 },
  { month: "Jun", value: 380 },
  { month: "Jul", value: 420 },
  { month: "Aug", value: 460 },
  { month: "Sep", value: 490 },
  { month: "Oct", value: 520 },
  { month: "Nov", value: 560 },
  { month: "Dec", value: 610 },
];

// ─── Reviews ──────────────────────────────────────────────────────
export const recentReviews: Review[] = [
  { id: "r1", author: "Tanveer H.", target: "Rakter Aksharey", rating: 5, excerpt: "A gut-punch of a production. The lighting design alone deserves a national award.", createdAt: "2026-07-09T18:20:00Z" },
  { id: "r2", author: "Faria K.", target: "Meghdoot", rating: 4, excerpt: "Elegant staging of Kalidasa. Some pacing issues in the second act.", createdAt: "2026-07-09T21:05:00Z" },
  { id: "r3", author: "Ashik R.", target: "Nagorik Andolon", rating: 2, excerpt: "Felt dated. Expected sharper direction.", flagged: true, createdAt: "2026-07-10T09:41:00Z" },
  { id: "r4", author: "Munira S.", target: "Chhotoder Rangamancha", rating: 5, excerpt: "My daughter has not stopped talking about the puppets. Wonderful evening.", createdAt: "2026-07-10T20:15:00Z" },
  { id: "r5", author: "Nadim I.", target: "Ekattor'er Golpo", rating: 5, excerpt: "History, love, and a live tanpura. Deserves a national tour.", createdAt: "2026-07-11T07:30:00Z" },
];

// ─── Activity feed ────────────────────────────────────────────────
export const recentActivity: ActivityItem[] = [
  { id: "act1", kind: "registration", title: "New artist registration", meta: "Nusrat Rahman · Theatre Artist", time: "12m ago" },
  { id: "act2", kind: "production", title: "New production submitted", meta: "Rabindra Sondhya · Chhayanaut", time: "38m ago" },
  { id: "act3", kind: "funding", title: "Funding request created", meta: "OTT Adaptation Fund · Palakar", time: "1h ago" },
  { id: "act4", kind: "review", title: "Review flagged for moderation", meta: "Nagorik Andolon · ★2", time: "2h ago" },
  { id: "act5", kind: "registration", title: "New group registration", meta: "Loko Natya Dol · Sylhet", time: "3h ago" },
  { id: "act6", kind: "production", title: "Show marked as sold out", meta: "Rakter Aksharey · Theatre Art Unit", time: "5h ago" },
  { id: "act7", kind: "funding", title: "Campaign fully funded", meta: "Rural Theatre Circuit · BRAC", time: "6h ago" },
];

// ─── Reports (analytics-only) ─────────────────────────────────────
export const engagementTrend = [
  { week: "W1", views: 12_400, bookmarks: 640, tickets: 320 },
  { week: "W2", views: 13_820, bookmarks: 720, tickets: 380 },
  { week: "W3", views: 14_910, bookmarks: 810, tickets: 410 },
  { week: "W4", views: 16_040, bookmarks: 870, tickets: 460 },
  { week: "W5", views: 17_580, bookmarks: 940, tickets: 510 },
  { week: "W6", views: 18_910, bookmarks: 1_020, tickets: 590 },
  { week: "W7", views: 20_120, bookmarks: 1_140, tickets: 640 },
  { week: "W8", views: 21_680, bookmarks: 1_220, tickets: 710 },
];

export const audienceGeography = [
  { region: "Dhaka", value: 6_240 },
  { region: "Chittagong", value: 2_130 },
  { region: "Sylhet", value: 1_260 },
  { region: "Rajshahi", value: 980 },
  { region: "Khulna", value: 820 },
  { region: "Diaspora", value: 1_050 },
];

export const genrePopularity = [
  { genre: "Drama", value: 92 },
  { genre: "Musical", value: 74 },
  { genre: "Classical", value: 61 },
  { genre: "Experimental", value: 48 },
  { genre: "Children", value: 55 },
  { genre: "Folk", value: 43 },
];
