import type { Show } from "./types";
import show1 from "@/assets/show-1.jpg";
import show2 from "@/assets/show-2.jpg";
import show3 from "@/assets/show-3.jpg";
import show4 from "@/assets/show-4.jpg";
import heroStage from "@/assets/hero-stage.jpg";

const posters = [show1, show2, show3, show4];

const gallery = [
  "https://images.unsplash.com/photo-1503095396549-807759245b35?w=1200&q=80",
  "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=1200&q=80",
  "https://images.unsplash.com/photo-1516307365426-bea591f05011?w=1200&q=80",
  "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=1200&q=80",
  "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&q=80",
  "https://images.unsplash.com/photo-1519683384663-1c317b0e08f9?w=1200&q=80",
];

const castPhoto = (i: number) => `https://i.pravatar.cc/240?img=${((i * 7) % 70) + 1}`;

interface Seed {
  slug: string;
  title: string;
  genre: string;
  duration: number;
  venue: string;
  city: string;
  date: string;
  price: number;
  status: Show["status"];
  groupSlug: string;
  groupName: string;
  description: string;
  synopsis: string;
  directorName: string;
  popularity: number;
  rating: number;
}

const seed: Seed[] = [
  {
    slug: "raktakarabi",
    title: "Raktakarabi",
    genre: "Drama",
    duration: 135,
    venue: "Shilpakala Academy",
    city: "Dhaka",
    date: "2026-07-24T19:30:00",
    price: 500,
    status: "upcoming",
    groupSlug: "prachyanat",
    groupName: "Prachyanat",
    description: "Tagore's poetic critique of industrial greed, reimagined for the 21st century.",
    synopsis:
      "In the walled city of Yaksha Puri, gold rules everything. When a mysterious woman in red appears, the invisible king must confront what his empire has cost. A visually striking production blending shadow, movement and live music.",
    directorName: "Azad Abul Kalam",
    popularity: 98,
    rating: 4.8,
  },
  {
    slug: "behulas-lantern",
    title: "Behula's Lantern",
    genre: "Musical",
    duration: 110,
    venue: "Chittagong Theatre Institute",
    city: "Chattogram",
    date: "2026-08-08T18:00:00",
    price: 350,
    status: "upcoming",
    groupSlug: "theatre-art-unit",
    groupName: "Theatre Art Unit",
    description: "A folk-musical reimagining of the Manasamangal for contemporary Bangladesh.",
    synopsis:
      "Behula floats her dead husband down the river, refusing to accept his fate. Along the way she meets migrant women whose stories mirror her own. A hybrid of Jatra, cinema and live folk score.",
    directorName: "Rokeya Rafique",
    popularity: 84,
    rating: 4.6,
  },
  {
    slug: "the-golden-mask",
    title: "The Golden Mask",
    genre: "Contemporary",
    duration: 90,
    venue: "Mahila Samity Mancha",
    city: "Dhaka",
    date: "2026-08-16T20:00:00",
    price: 800,
    status: "live",
    groupSlug: "bot-tala",
    groupName: "Bot-tala",
    description: "A near-future thriller about identity, surveillance and the price of anonymity.",
    synopsis:
      "In a Dhaka where every face is scanned, a young woman finds a golden mask that erases her from every database. Freedom quickly becomes a burden.",
    directorName: "Mohammad Ali Haider",
    popularity: 92,
    rating: 4.7,
  },
  {
    slug: "ekattor",
    title: "Ekattor",
    genre: "Historical",
    duration: 165,
    venue: "National Theatre Hall",
    city: "Dhaka",
    date: "2025-12-16T19:00:00",
    price: 600,
    status: "archived",
    groupSlug: "nagorik-natya-sampradaya",
    groupName: "Nagorik Natya Sampradaya",
    description: "An epic three-act tribute to the Liberation War's forgotten women.",
    synopsis:
      "Told through the eyes of three sisters in Kushtia, Ekattor recovers the interior life of 1971 — the letters, the silences, the songs sung in whispers.",
    directorName: "Ataur Rahman",
    popularity: 96,
    rating: 4.9,
  },
  {
    slug: "static",
    title: "Static",
    genre: "Devised",
    duration: 75,
    venue: "Loft Studio, Banani",
    city: "Dhaka",
    date: "2026-09-05T21:00:00",
    price: 450,
    status: "upcoming",
    groupSlug: "dhaka-drama-collective",
    groupName: "Dhaka Drama Collective",
    description: "A devised piece performed simultaneously on stage and Instagram Live.",
    synopsis: "Six performers, six phones, one collapsing WiFi network. Reality flickers.",
    directorName: "Shamim Ara",
    popularity: 78,
    rating: 4.3,
  },
  {
    slug: "nabin-sadhur-pala",
    title: "Nabin Sadhur Pala",
    genre: "Folk",
    duration: 180,
    venue: "Sylhet Sadar Ground",
    city: "Sylhet",
    date: "2026-11-14T20:00:00",
    price: 200,
    status: "upcoming",
    groupSlug: "loko-natya-dal",
    groupName: "Loko Natya Dal",
    description: "A traditional Jatra performance under the open sky.",
    synopsis: "The rise and fall of a wandering saint, told in classical Jatra form with live dhol.",
    directorName: "Kamruzzaman Runu",
    popularity: 71,
    rating: 4.7,
  },
  {
    slug: "salt-on-the-boards",
    title: "Salt on the Boards",
    genre: "Drama",
    duration: 100,
    venue: "Anwara Community Hall",
    city: "Chattogram",
    date: "2025-10-02T19:00:00",
    price: 300,
    status: "archived",
    groupSlug: "arshinagar-repertory",
    groupName: "Arshinagar Repertory",
    description: "Three generations of a fishing family confront a rising sea.",
    synopsis: "Told in Chattogram dialect, this quiet play measures loss in tides.",
    directorName: "Muhammad Salim",
    popularity: 62,
    rating: 4.5,
  },
  {
    slug: "ora-kadam-ali",
    title: "Ora Kadam Ali",
    genre: "Political",
    duration: 120,
    venue: "Aranyak Studio, Dhaka",
    city: "Dhaka",
    date: "2026-06-01T19:30:00",
    price: 400,
    status: "live",
    groupSlug: "aranyak-natyadal",
    groupName: "Aranyak Natyadal",
    description: "A classic of political theatre, restaged with a new generation of workers.",
    synopsis: "Kadam Ali disappears from the factory. His absence organizes everyone else.",
    directorName: "Mamunur Rashid",
    popularity: 88,
    rating: 4.7,
  },
  {
    slug: "kinu-kaharer-thetar",
    title: "Kinu Kaharer Thetar",
    genre: "Drama",
    duration: 140,
    venue: "Shilpakala Academy",
    city: "Dhaka",
    date: "2026-10-19T19:30:00",
    price: 550,
    status: "upcoming",
    groupSlug: "prachyanat",
    groupName: "Prachyanat",
    description: "Manik Bandyopadhyay's novella brought to the stage with startling physicality.",
    synopsis: "A theatre troupe travels the delta; the delta is not kind.",
    directorName: "Azad Abul Kalam",
    popularity: 80,
    rating: 4.6,
  },
  {
    slug: "circus-circus",
    title: "Circus Circus",
    genre: "Comedy",
    duration: 95,
    venue: "Shishu Academy",
    city: "Dhaka",
    date: "2025-08-22T18:00:00",
    price: 250,
    status: "archived",
    groupSlug: "prachyanat",
    groupName: "Prachyanat",
    description: "A slapstick homage to the vanishing tent-circuses of Bengal.",
    synopsis: "Three clowns inherit a bankrupt circus and try, badly, to keep it standing.",
    directorName: "Azad Abul Kalam",
    popularity: 74,
    rating: 4.4,
  },
  {
    slug: "kolkata-to-karwan-bazar",
    title: "Kolkata to Karwan Bazar",
    genre: "Drama",
    duration: 105,
    venue: "TAU Blackbox",
    city: "Dhaka",
    date: "2026-07-30T20:00:00",
    price: 500,
    status: "upcoming",
    groupSlug: "theatre-art-unit",
    groupName: "Theatre Art Unit",
    description: "A vegetable trader's journey across the border, in her own words.",
    synopsis: "A monologue built from three years of interviews with women in the wholesale market.",
    directorName: "Rokeya Rafique",
    popularity: 76,
    rating: 4.6,
  },
  {
    slug: "night-of-the-tabla",
    title: "Night of the Tabla",
    genre: "Musical",
    duration: 80,
    venue: "Chhayanaut Auditorium",
    city: "Dhaka",
    date: "2026-05-12T19:00:00",
    price: 700,
    status: "live",
    groupSlug: "nagorik-natya-sampradaya",
    groupName: "Nagorik Natya Sampradaya",
    description: "Live-streamed concert-theatre with a rotating cast of six tabla masters.",
    synopsis: "One instrument, six hands, ninety minutes of pulse.",
    directorName: "Ataur Rahman",
    popularity: 90,
    rating: 4.8,
  },
];

const cast = (i: number) =>
  ["Rehana", "Kabir", "Shanto", "Mira", "Faisal", "Nusrat"].map((n, j) => ({
    name: n,
    role: ["Lead", "Antagonist", "Chorus", "Narrator", "Support", "Support"][j],
    photo: castPhoto(i + j),
  }));

const pricing = (base: number) => [
  { tier: "Balcony", price: Math.round(base * 0.6), perks: "Reserved seating in the upper tier." },
  { tier: "Mezzanine", price: base, perks: "Central sight-lines with clear acoustics." },
  { tier: "Premiere", price: Math.round(base * 1.8), perks: "Front rows, post-show meet & greet, printed programme." },
];

const scheduleFor = (venue: string, city: string, date: string) => {
  const d = new Date(date);
  return [0, 7, 14].map((offset) => {
    const nd = new Date(d);
    nd.setDate(d.getDate() + offset);
    return { date: nd.toISOString(), venue, city };
  });
};

export const SHOWS: Show[] = seed.map((s, i) => ({
  slug: s.slug,
  title: s.title,
  poster: posters[i % posters.length],
  banner: heroStage,
  genre: s.genre,
  durationMinutes: s.duration,
  venue: s.venue,
  city: s.city,
  date: s.date,
  price: s.price,
  status: s.status,
  groupSlug: s.groupSlug,
  groupName: s.groupName,
  description: s.description,
  synopsis: s.synopsis,
  cast: cast(i),
  director: {
    name: s.directorName,
    photo: castPhoto(i + 20),
    bio: `${s.directorName} has directed over two dozen productions across Bangladesh and South Asia.`,
  },
  gallery,
  schedule: scheduleFor(s.venue, s.city, s.date),
  pricing: pricing(s.price),
  reviews: [
    { id: "r1", author: "The Daily Star", rating: 5, text: "Alive, urgent, unforgettable.", date: "2024-05-01" },
    { id: "r2", author: "New Age", rating: 4.5, text: "A production of rare craft.", date: "2024-05-04" },
    { id: "r3", author: "Prothom Alo", rating: 4, text: "Ambitious and largely successful.", date: "2024-05-09" },
  ],
  trailerUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  livestreamUrl: s.status === "live" ? "https://www.youtube.com/embed/jfKfPfyJRdk" : undefined,
  popularity: s.popularity,
  rating: s.rating,
}));

export const SHOW_GENRES = Array.from(new Set(SHOWS.map((s) => s.genre))).sort();
export const SHOW_CITIES = Array.from(new Set(SHOWS.map((s) => s.city))).sort();
