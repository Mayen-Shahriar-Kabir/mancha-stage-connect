// Placeholder data for the Audience Dashboard (Mancha).

export type TicketStatus = "upcoming" | "past" | "cancelled";
export interface AudienceTicket {
  id: string;
  show: string;
  group: string;
  venue: string;
  date: string;
  time: string;
  seat: string;
  price: number;
  status: TicketStatus;
  poster: string;
}
export const tickets: AudienceTicket[] = [
  { id: "TX-8821", show: "Nakshi Kanthar Math", group: "Nagorik", venue: "Shilpakala Academy, Hall A", date: "Feb 12, 2026", time: "7:30 PM", seat: "Balcony · C-14", price: 800, status: "upcoming", poster: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=600" },
  { id: "TX-8797", show: "The Mountaintop", group: "Prachyanat", venue: "Mahila Samiti Auditorium", date: "Feb 27, 2026", time: "8:00 PM", seat: "Stalls · F-08", price: 600, status: "upcoming", poster: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600" },
  { id: "TX-8541", show: "Meghdoot", group: "Aranyak", venue: "TSC, DU", date: "Nov 30, 2025", time: "6:30 PM", seat: "Stalls · B-12", price: 500, status: "past", poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
  { id: "TX-8399", show: "Chairs", group: "Theatre Art Unit", venue: "Bengal Shilpalay", date: "Sep 04, 2025", time: "7:00 PM", seat: "Stalls · A-07", price: 700, status: "past", poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
  { id: "TX-8210", show: "Barnaparichay", group: "Dhaka Theatre", venue: "Shilpakala Hall B", date: "Aug 21, 2025", time: "7:30 PM", seat: "Balcony · D-04", price: 450, status: "cancelled", poster: "https://images.unsplash.com/photo-1518929458113-3b5a4a1a1e91?w=600" },
];

// ── Premium ────────────────────────────────────────
export const premiumPlan = {
  name: "Front Row",
  price: 499,
  renewal: "Mar 04, 2026",
  benefits: [
    "Priority booking 48h before general release",
    "Two free livestreams every month",
    "Backstage documentaries library",
    "10% off all ticket purchases",
    "Members-only meet & greets",
  ],
};
export const plans = [
  { id: "curtain", name: "Curtain Call", price: 199, tagline: "For the occasional theatre-goer", features: ["Livestream credits", "5% ticket discount", "Weekly digest"] },
  { id: "frontrow", name: "Front Row", price: 499, tagline: "Our most popular plan", features: ["Priority booking", "Free livestreams (2)", "Backstage library"], recommended: true },
  { id: "director", name: "Director's Circle", price: 1499, tagline: "For patrons & collectors", features: ["Unlimited livestreams", "Reserved balcony seat", "Named in playbill"] },
];

// ── Saved / Watch ──────────────────────────────────
export const savedShows = [
  { slug: "nakshi-kanthar-math", title: "Nakshi Kanthar Math", group: "Nagorik", opens: "Feb 12", poster: "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=600" },
  { slug: "mountaintop", title: "The Mountaintop", group: "Prachyanat", opens: "Feb 27", poster: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600" },
  { slug: "meghdoot-return", title: "Meghdoot (Return Season)", group: "Aranyak", opens: "Mar 14", poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
  { slug: "puppet-cycle", title: "The Puppet Cycle", group: "Loko Natya Dol", opens: "Apr 02", poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
];

export const watchHistory = [
  { id: "w1", title: "Meghdoot — Opening Night", group: "Aranyak", watched: "80%", kind: "archive" as const, thumb: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
  { id: "w2", title: "Chairs — Livestream", group: "Theatre Art Unit", watched: "100%", kind: "livestream" as const, thumb: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
  { id: "w3", title: "Rakter Onnesha (Ep. 2)", group: "Theatre Factory", watched: "34%", kind: "archive" as const, thumb: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=600" },
];

export const recommended = [
  { slug: "anna-karenina", title: "Anna Karenina Reimagined", group: "Aranyak", tag: "Because you watched Meghdoot", poster: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600" },
  { slug: "hamlet-boy", title: "Hamlet, the Boy", group: "Prangone Mor", tag: "Trending in Dhaka", poster: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600" },
  { slug: "silent-city", title: "The Silent City", group: "Nagorik", tag: "New from a group you follow", poster: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=600" },
];

// ── Community Support ──────────────────────────────
export interface Contribution {
  id: string;
  campaign: string;
  group: string;
  amount: number;
  date: string;
  status: "confirmed" | "pending";
}
export const contributions: Contribution[] = [
  { id: "cn1", campaign: "National Tour — 12 Districts", group: "Nagorik", amount: 2500, date: "Jan 08, 2026", status: "confirmed" },
  { id: "cn2", campaign: "Restoring Bailey Road Stage", group: "Dhaka Theatre", amount: 1000, date: "Dec 21, 2025", status: "confirmed" },
  { id: "cn3", campaign: "Youth Actors Fellowship", group: "Prachyanat", amount: 500, date: "Nov 15, 2025", status: "confirmed" },
  { id: "cn4", campaign: "Winter Show Livestream", group: "Theatre Factory", amount: 750, date: "This week", status: "pending" },
];

export const impact = {
  contributed: 4750,
  productionsBacked: 4,
  artistsSupported: 27,
  citiesReached: 6,
};

// ── Meetups ────────────────────────────────────────
export interface Meetup {
  id: string;
  title: string;
  host: string;
  date: string;
  location: string;
  status: "upcoming" | "past" | "registered";
  certificate?: boolean;
}
export const meetups: Meetup[] = [
  { id: "m1", title: "Playwrights & Chai — Winter Edition", host: "Prangone Mor", date: "Feb 18, 2026", location: "Kalabagan, Dhaka", status: "registered" },
  { id: "m2", title: "Behind the Scenes — 'Nakshi Kanthar Math'", host: "Nagorik", date: "Feb 25, 2026", location: "Shilpakala Green Room", status: "upcoming" },
  { id: "m3", title: "Voice for the Stage — Open Class", host: "Mancha Academy", date: "Dec 10, 2025", location: "Zoom", status: "past", certificate: true },
  { id: "m4", title: "Theatre in Translation", host: "Bengal Foundation", date: "Nov 02, 2025", location: "Dhanmondi Studio", status: "past", certificate: true },
];

export const notifications = [
  { id: "an1", title: "Your seat for 'Nakshi Kanthar Math' is confirmed", when: "1h", tone: "success" as const },
  { id: "an2", title: "New show from Nagorik — save your seat", when: "6h", tone: "info" as const },
  { id: "an3", title: "'Winter Show' funding goal 82% reached", when: "Yesterday", tone: "info" as const },
];
