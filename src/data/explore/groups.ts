import type { Group } from "./types";
import nagorikCover from "@/assets/group-nagorik.jpg";

const COVER_OVERRIDES: Record<string, string> = {
  "nagorik-natya-sampradaya": nagorikCover,
};

const covers = [
  "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&q=80",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600&q=80",
  "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1600&q=80",
  "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1600&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1600&q=80",
  "https://images.unsplash.com/photo-1547153760-18fc86324498?w=1600&q=80",
  "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1600&q=80",
  "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=1600&q=80",
];

const memberPhoto = (i: number) =>
  `https://i.pravatar.cc/240?img=${(i % 70) + 1}`;

const seed: Omit<Group, "cover" | "members" | "gallery">[] = [
  {
    slug: "prachyanat",
    name: "Prachyanat",
    logoInitials: "PN",
    city: "Dhaka",
    yearsActive: 28,
    foundedYear: 1997,
    memberCount: 42,
    description:
      "Pioneering physical theatre and folk fusion. Prachyanat has trained a generation of Bangla theatre-makers.",
    showsPerformed: 128,
    followers: 12400,
    history:
      "Founded in 1997 by a group of Dhaka University alumni, Prachyanat began with street performances and grew into a full repertory known for rigorous physical training and folk-modern fusion.",
    mission:
      "To rediscover indigenous performance forms and translate them for a contemporary audience without losing their soul.",
    featuredProductions: [
      { title: "Raktakarabi", year: 2024, poster: "" },
      { title: "Kinu Kaharer Thetar", year: 2022, poster: "" },
      { title: "Circus Circus", year: 2019, poster: "" },
    ],
    trainingPrograms: [
      { title: "Prachyanat School of Acting", description: "A six-month intensive covering movement, voice and Stanislavski." },
      { title: "Folk Forms Lab", description: "Weekend workshops in Jatra, Gambhira and Baul performance." },
    ],
    communityActivities: [
      { title: "Village Stage Project", description: "Touring productions to underserved districts every winter." },
      { title: "Youth Open Mic", description: "Free monthly platform for emerging playwrights." },
    ],
    sponsors: ["City Bank", "Grameenphone", "Bengal Foundation"],
    achievements: [
      { title: "Meril Prothom Alo Award — Best Production", year: 2023 },
      { title: "Bangla Academy Recognition", year: 2018 },
    ],
    videos: [
      { title: "Prachyanat at 25", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
      { title: "Raktakarabi Rehearsals", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    ],
    upcomingShows: ["raktakarabi"],
    pastShows: ["ekattor"],
    reviews: [
      { id: "r1", author: "The Daily Star", rating: 5, text: "A troupe that refuses to stand still.", date: "2024-03-12" },
    ],
    popularity: 98,
    rating: 4.9,
  },
  {
    slug: "theatre-art-unit",
    name: "Theatre Art Unit",
    logoInitials: "TAU",
    city: "Dhaka",
    yearsActive: 32,
    foundedYear: 1992,
    memberCount: 28,
    description:
      "Bold contemporary works exploring urban Bangladeshi life, migration and gender.",
    showsPerformed: 74,
    followers: 8200,
    history:
      "Formed in 1992 as a reaction to the traditional proscenium, TAU has staged over seventy original productions across Dhaka.",
    mission:
      "To make theatre that speaks directly to the questions of the modern Bangladeshi city.",
    featuredProductions: [
      { title: "Behula's Lantern", year: 2024, poster: "" },
      { title: "Kolkata to Karwan Bazar", year: 2021, poster: "" },
    ],
    trainingPrograms: [
      { title: "Playwright Incubator", description: "A one-year residency for new writers." },
    ],
    communityActivities: [
      { title: "School Outreach", description: "Devised pieces performed in fifteen Dhaka schools each year." },
    ],
    sponsors: ["BRAC", "Prothom Alo"],
    achievements: [
      { title: "Dhaka Theatre Festival — Grand Prize", year: 2022 },
    ],
    videos: [{ title: "TAU Documentary", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }],
    upcomingShows: ["behulas-lantern"],
    pastShows: [],
    reviews: [
      { id: "r1", author: "Bonik Barta", rating: 4.5, text: "Sharp, unafraid, alive.", date: "2024-01-20" },
    ],
    popularity: 82,
    rating: 4.6,
  },
  {
    slug: "bot-tala",
    name: "Bot-tala",
    logoInitials: "BT",
    city: "Dhaka",
    yearsActive: 18,
    foundedYear: 2006,
    memberCount: 35,
    description:
      "Experimental storytelling rooted in Bengali literary tradition — adaptations of Tagore, Nazrul and Ilias.",
    showsPerformed: 91,
    followers: 9600,
    history:
      "Bot-tala emerged from the studios of the Department of Theatre and Performance Studies, University of Dhaka.",
    mission: "To translate literature to living stage grammar.",
    featuredProductions: [{ title: "The Golden Mask", year: 2024, poster: "" }],
    trainingPrograms: [
      { title: "Bot-tala Workshop Series", description: "Monthly craft workshops open to the public." },
    ],
    communityActivities: [
      { title: "Reading Circle", description: "Free monthly public readings of new Bangla plays." },
    ],
    sponsors: ["Bengal Foundation"],
    achievements: [{ title: "Nandikar National Theatre Festival — Special Mention", year: 2020 }],
    videos: [{ title: "Bot-tala Reel", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }],
    upcomingShows: ["the-golden-mask"],
    pastShows: [],
    reviews: [
      { id: "r1", author: "New Age", rating: 4.7, text: "Literary and lively — a rare combination.", date: "2024-04-02" },
    ],
    popularity: 88,
    rating: 4.7,
  },
  {
    slug: "arshinagar-repertory",
    name: "Arshinagar Repertory",
    logoInitials: "AR",
    city: "Chattogram",
    yearsActive: 14,
    foundedYear: 2010,
    memberCount: 24,
    description:
      "Community-driven productions from Chittagong's coastal voices, in Chattogram dialect.",
    showsPerformed: 52,
    followers: 5100,
    history: "Started in a fisherman's warehouse in Anwara, now touring across the coast.",
    mission: "Coastal stories, coastal tongue.",
    featuredProductions: [{ title: "Salt on the Boards", year: 2023, poster: "" }],
    trainingPrograms: [
      { title: "Dialect Preservation Workshop", description: "Weekend sessions for young performers." },
    ],
    communityActivities: [
      { title: "Cyclone Response Theatre", description: "Post-disaster storytelling in shelters." },
    ],
    sponsors: ["Chattogram City Corporation"],
    achievements: [{ title: "Coastal Culture Prize", year: 2022 }],
    videos: [{ title: "Coastal Stage", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }],
    upcomingShows: [],
    pastShows: [],
    reviews: [
      { id: "r1", author: "Chattogram Times", rating: 4.4, text: "The sea speaks through them.", date: "2024-02-14" },
    ],
    popularity: 65,
    rating: 4.5,
  },
  {
    slug: "loko-natya-dal",
    name: "Loko Natya Dal",
    logoInitials: "LN",
    city: "Sylhet",
    yearsActive: 22,
    foundedYear: 2002,
    memberCount: 31,
    description: "Reviving Jatra and rural performance forms for new audiences.",
    showsPerformed: 66,
    followers: 6400,
    history: "Formed by Jatra veterans and folklorists to prevent the art form's disappearance.",
    mission: "Keep the palas alive.",
    featuredProductions: [{ title: "Nabin Sadhur Pala", year: 2023, poster: "" }],
    trainingPrograms: [{ title: "Jatra Gurukul", description: "Live-in six-month training." }],
    communityActivities: [{ title: "Village Tour", description: "Sixty villages every Aghran." }],
    sponsors: ["Sylhet Sadar UP"],
    achievements: [{ title: "UNESCO Intangible Heritage Support", year: 2021 }],
    videos: [{ title: "Jatra Nights", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }],
    upcomingShows: [],
    pastShows: [],
    reviews: [
      { id: "r1", author: "Kaler Kantho", rating: 4.8, text: "Heritage in motion.", date: "2023-11-11" },
    ],
    popularity: 72,
    rating: 4.7,
  },
  {
    slug: "nagorik-natya-sampradaya",
    name: "Nagorik Natya Sampradaya",
    logoInitials: "NNS",
    city: "Dhaka",
    yearsActive: 56,
    foundedYear: 1968,
    memberCount: 56,
    description: "One of Bangladesh's oldest and most decorated troupes.",
    showsPerformed: 210,
    followers: 21000,
    history: "Founded before independence, Nagorik shaped the vocabulary of modern Bangla theatre.",
    mission: "Legacy through renewal.",
    featuredProductions: [{ title: "Ekattor", year: 2024, poster: "" }],
    trainingPrograms: [{ title: "Nagorik Academy", description: "Year-long conservatory." }],
    communityActivities: [{ title: "Freedom Fighter Interviews", description: "Oral history theatre." }],
    sponsors: ["Ministry of Cultural Affairs"],
    achievements: [{ title: "Ekushey Padak", year: 2019 }],
    videos: [{ title: "Fifty Years On Stage", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }],
    upcomingShows: ["ekattor"],
    pastShows: [],
    reviews: [
      { id: "r1", author: "Ittefaq", rating: 4.9, text: "A national institution.", date: "2024-05-19" },
    ],
    popularity: 96,
    rating: 4.9,
  },
  {
    slug: "aranyak-natyadal",
    name: "Aranyak Natyadal",
    logoInitials: "AN",
    city: "Dhaka",
    yearsActive: 52,
    foundedYear: 1972,
    memberCount: 48,
    description: "Politically-engaged theatre with a legacy of protest and poetry.",
    showsPerformed: 180,
    followers: 15800,
    history: "Emerged in the aftermath of independence to give voice to the working class.",
    mission: "Theatre for the many.",
    featuredProductions: [{ title: "Ora Kadam Ali", year: 2023, poster: "" }],
    trainingPrograms: [{ title: "Political Theatre Reading Group", description: "Monthly seminars." }],
    communityActivities: [{ title: "Garment Worker Stage", description: "Performances in factory canteens." }],
    sponsors: ["Independent"],
    achievements: [{ title: "Bangla Academy Fellowship", year: 2020 }],
    videos: [{ title: "Aranyak at 50", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }],
    upcomingShows: [],
    pastShows: [],
    reviews: [
      { id: "r1", author: "Samakal", rating: 4.6, text: "Still angry, still lyrical.", date: "2024-03-30" },
    ],
    popularity: 84,
    rating: 4.7,
  },
  {
    slug: "dhaka-drama-collective",
    name: "Dhaka Drama Collective",
    logoInitials: "DDC",
    city: "Dhaka",
    yearsActive: 9,
    foundedYear: 2015,
    memberCount: 19,
    description: "A young ensemble merging devised theatre with digital storytelling.",
    showsPerformed: 34,
    followers: 4300,
    history: "Started by a group of NSU and IUB graduates in a Banani basement.",
    mission: "Screens, stages, streets — one story.",
    featuredProductions: [{ title: "Static", year: 2024, poster: "" }],
    trainingPrograms: [{ title: "Devising Bootcamp", description: "Two-week summer intensive." }],
    communityActivities: [{ title: "Insta Stage", description: "Weekly short-form pieces on Instagram." }],
    sponsors: ["Chorki", "Robi"],
    achievements: [{ title: "Emerging Company — Dhaka Fringe", year: 2023 }],
    videos: [{ title: "Static Trailer", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" }],
    upcomingShows: [],
    pastShows: [],
    reviews: [
      { id: "r1", author: "The Business Standard", rating: 4.3, text: "The internet finally has a stage.", date: "2024-06-01" },
    ],
    popularity: 70,
    rating: 4.4,
  },
];

export const GROUPS: Group[] = seed.map((g, i) => ({
  ...g,
  cover: COVER_OVERRIDES[g.slug] ?? covers[i % covers.length],
  gallery: covers.slice(0, 6),
  members: Array.from({ length: 6 }).map((_, j) => ({
    name: ["Ayesha Karim", "Rifat Chowdhury", "Sabina Yasmin", "Tanvir Alam", "Nusrat Jahan", "Imran Hossain"][j],
    role: ["Artistic Director", "Ensemble", "Ensemble", "Playwright", "Movement Director", "Producer"][j],
    photo: memberPhoto(i * 6 + j),
  })),
}));

export const GROUP_CITIES = Array.from(new Set(GROUPS.map((g) => g.city))).sort();
