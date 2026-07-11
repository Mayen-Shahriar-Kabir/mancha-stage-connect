import type { Artist } from "./types";
import artist1 from "@/assets/artist-1.jpg";
import artist2 from "@/assets/artist-2.jpg";
import artist3 from "@/assets/artist-3.jpg";
import artist4 from "@/assets/artist-4.jpg";

const localPhotos = [artist1, artist2, artist3, artist4];
const photoFor = (i: number) => localPhotos[i % localPhotos.length];

const covers = [
  "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1600&q=80",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1600&q=80",
  "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1600&q=80",
  "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1600&q=80",
];

const galleryPool = [
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
  "https://images.unsplash.com/photo-1519683384663-1c317b0e08f9?w=1200&q=80",
  "https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=1200&q=80",
  "https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=1200&q=80",
  "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&q=80",
];

interface Seed {
  slug: string;
  name: string;
  stageName: string;
  specialization: string;
  years: number;
  group: [string, string];
  availability: Artist["availability"];
  bio: string;
  skills: string[];
  popularity: number;
  rating: number;
}

const seed: Seed[] = [
  {
    slug: "anisul-haque",
    name: "Anisul Haque",
    stageName: "Ani",
    specialization: "Method Actor · Director",
    years: 18,
    group: ["prachyanat", "Prachyanat"],
    availability: "busy",
    bio: "Anisul has spent two decades on the Dhaka stage, moving fluidly between Tagore adaptations and contemporary devised work.",
    skills: ["Stanislavski", "Movement", "Bangla verse", "Direction"],
    popularity: 96,
    rating: 4.8,
  },
  {
    slug: "meherun-nisa",
    name: "Meherun Nisa",
    stageName: "Mim",
    specialization: "Lead Actress · Vocalist",
    years: 12,
    group: ["bot-tala", "Bot-tala"],
    availability: "available",
    bio: "Trained in both classical Nazrul-geeti and physical theatre, Mim is one of the most in-demand leads in Dhaka.",
    skills: ["Singing", "Kathak", "Voice", "Improvisation"],
    popularity: 92,
    rating: 4.7,
  },
  {
    slug: "rafid-rahman",
    name: "Rafid Rahman",
    stageName: "Rafid",
    specialization: "Playwright · Director",
    years: 6,
    group: ["theatre-art-unit", "Theatre Art Unit"],
    availability: "available",
    bio: "A new voice writing about urban migration, gender and the internet.",
    skills: ["Playwriting", "Devising", "Dramaturgy"],
    popularity: 78,
    rating: 4.5,
  },
  {
    slug: "sultana-begum",
    name: "Sultana Begum",
    stageName: "Sultana",
    specialization: "Veteran Actress · Mentor",
    years: 34,
    group: ["nagorik-natya-sampradaya", "Nagorik Natya Sampradaya"],
    availability: "busy",
    bio: "One of the most decorated stage actresses of her generation and a pillar of Nagorik's ensemble.",
    skills: ["Classical", "Acting", "Coaching"],
    popularity: 97,
    rating: 4.9,
  },
  {
    slug: "farhana-mithila",
    name: "Farhana Mithila",
    stageName: "Mithi",
    specialization: "Movement Director",
    years: 9,
    group: ["prachyanat", "Prachyanat"],
    availability: "touring",
    bio: "Choreographer and movement director specialising in fusion of Manipuri and modern dance vocabularies.",
    skills: ["Choreography", "Manipuri", "Body work"],
    popularity: 82,
    rating: 4.6,
  },
  {
    slug: "tanvir-chowdhury",
    name: "Tanvir Chowdhury",
    stageName: "Tanvir",
    specialization: "Sound Designer",
    years: 8,
    group: ["dhaka-drama-collective", "Dhaka Drama Collective"],
    availability: "available",
    bio: "Sound designer and composer bridging live theatre with electronic music.",
    skills: ["Sound design", "Live mixing", "Ableton"],
    popularity: 70,
    rating: 4.4,
  },
  {
    slug: "nusrat-jahan",
    name: "Nusrat Jahan",
    stageName: "Nusrat",
    specialization: "Character Actress",
    years: 15,
    group: ["aranyak-natyadal", "Aranyak Natyadal"],
    availability: "available",
    bio: "Known for sharp comic timing and searing dramatic monologues.",
    skills: ["Comedy", "Monologue", "Dialects"],
    popularity: 86,
    rating: 4.7,
  },
  {
    slug: "kamruzzaman-runu",
    name: "Kamruzzaman Runu",
    stageName: "Runu Da",
    specialization: "Jatra Director",
    years: 40,
    group: ["loko-natya-dal", "Loko Natya Dal"],
    availability: "busy",
    bio: "Fourth-generation Jatra practitioner and one of the last living gurus of the palagan tradition.",
    skills: ["Jatra", "Direction", "Palagan"],
    popularity: 88,
    rating: 4.8,
  },
  {
    slug: "shamim-ara",
    name: "Shamim Ara",
    stageName: "Shamim",
    specialization: "Devised Theatre Director",
    years: 7,
    group: ["dhaka-drama-collective", "Dhaka Drama Collective"],
    availability: "touring",
    bio: "Trained at LISPA, Shamim builds work at the boundary between installation, performance and code.",
    skills: ["Devising", "Lecoq", "Direction"],
    popularity: 74,
    rating: 4.5,
  },
  {
    slug: "muhammad-salim",
    name: "Muhammad Salim",
    stageName: "Salim Bhai",
    specialization: "Actor · Community Organizer",
    years: 22,
    group: ["arshinagar-repertory", "Arshinagar Repertory"],
    availability: "available",
    bio: "Founding member of Arshinagar, Salim anchors the troupe's touring work.",
    skills: ["Acting", "Chattogram dialect", "Community theatre"],
    popularity: 68,
    rating: 4.5,
  },
  {
    slug: "ayesha-karim",
    name: "Ayesha Karim",
    stageName: "Ayesha",
    specialization: "Costume Designer",
    years: 11,
    group: ["nagorik-natya-sampradaya", "Nagorik Natya Sampradaya"],
    availability: "available",
    bio: "Weaves period accuracy with contemporary silhouette.",
    skills: ["Costume", "Textiles", "Period research"],
    popularity: 72,
    rating: 4.6,
  },
  {
    slug: "imran-hossain",
    name: "Imran Hossain",
    stageName: "Imran",
    specialization: "Lighting Designer",
    years: 13,
    group: ["bot-tala", "Bot-tala"],
    availability: "busy",
    bio: "A painter with light, Imran has shaped the visual identity of Bot-tala's last decade.",
    skills: ["Lighting", "Projection", "Programming"],
    popularity: 80,
    rating: 4.7,
  },
  {
    slug: "sabina-yasmin-arif",
    name: "Sabina Yasmin",
    stageName: "Sabina",
    specialization: "Musical Director",
    years: 17,
    group: ["theatre-art-unit", "Theatre Art Unit"],
    availability: "touring",
    bio: "Composes original scores drawing on Baul, folk and contemporary classical traditions.",
    skills: ["Composition", "Vocals", "Harmonium"],
    popularity: 84,
    rating: 4.7,
  },
  {
    slug: "rifat-chowdhury",
    name: "Rifat Chowdhury",
    stageName: "Rifat",
    specialization: "Actor",
    years: 5,
    group: ["dhaka-drama-collective", "Dhaka Drama Collective"],
    availability: "available",
    bio: "Emerging actor with a striking on-screen and on-stage presence.",
    skills: ["Acting", "Camera work"],
    popularity: 62,
    rating: 4.3,
  },
  {
    slug: "faisal-ahmed",
    name: "Faisal Ahmed",
    stageName: "Faisal",
    specialization: "Playwright",
    years: 10,
    group: ["aranyak-natyadal", "Aranyak Natyadal"],
    availability: "available",
    bio: "Playwright of six full-length works staged nationally.",
    skills: ["Playwriting", "Translation"],
    popularity: 76,
    rating: 4.5,
  },
  {
    slug: "nazia-kabir",
    name: "Nazia Kabir",
    stageName: "Dr. Nazia",
    specialization: "Dramaturge · Scholar",
    years: 20,
    group: ["prachyanat", "Prachyanat"],
    availability: "busy",
    bio: "Faculty of Fine Arts, DU. Dramaturge for over thirty productions.",
    skills: ["Dramaturgy", "Research", "Text analysis"],
    popularity: 88,
    rating: 4.8,
  },
];

export const ARTISTS: Artist[] = seed.map((a, i) => ({
  slug: a.slug,
  name: a.name,
  stageName: a.stageName,
  photo: photoFor(i),
  cover: covers[i % covers.length],
  specialization: a.specialization,
  yearsExperience: a.years,
  currentGroupSlug: a.group[0],
  currentGroupName: a.group[1],
  availability: a.availability,
  bio: a.bio,
  skills: a.skills,
  awards: [
    { title: "Meril Prothom Alo Award", year: 2023, org: "Prothom Alo" },
    { title: "Bangla Academy Recognition", year: 2019, org: "Bangla Academy" },
  ],
  certificates: [
    { title: "Advanced Acting", issuer: "Prachyanat School", year: 2015 },
    { title: "Directing Fellowship", issuer: "Bengal Foundation", year: 2020 },
  ],
  gallery: galleryPool,
  videos: [
    { title: "Showreel", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
    { title: "Workshop", url: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ],
  pastProductions: [
    { title: "Raktakarabi", year: 2024, role: "Nandini" },
    { title: "Ekattor", year: 2023, role: "Nazma" },
    { title: "Circus Circus", year: 2019, role: "Ringmaster" },
  ],
  reviews: [
    { id: "r1", author: "The Daily Star", rating: 5, text: "A commanding presence.", date: "2024-03-11" },
    { id: "r2", author: "New Age", rating: 4.5, text: "Nuanced and controlled.", date: "2024-04-22" },
  ],
  socials: [
    { label: "Instagram", url: "https://instagram.com" },
    { label: "Facebook", url: "https://facebook.com" },
    { label: "YouTube", url: "https://youtube.com" },
  ],
  popularity: a.popularity,
  rating: a.rating,
}));

export const ARTIST_SPECIALIZATIONS = Array.from(
  new Set(ARTISTS.map((a) => a.specialization)),
).sort();
