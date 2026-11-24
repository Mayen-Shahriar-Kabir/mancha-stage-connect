# Mancha — Bangladesh's Digital Theatre Ecosystem 🎭

A modern, multi-sided cultural SaaS platform connecting theatre artists, troupes, audiences, academic institutions, corporate sponsors, tourism boards, and the film/OTT industry across Bangladesh.

---

## 🌟 Vision & Overview

Bangladeshi theatre has a rich history spanning classical folk tradition (*Jatra*, *Pala Gan*) and vibrant modern post-liberation stage drama. However, troupes and practitioners have historically operated in fragmented silos with manual ticketing, scarce archive documentation, disjointed audition calls, and limited access to corporate patronage or academic collaboration.

**Mancha** serves as the unified national digital infrastructure for the performing arts, offering:
- Dedicated, authenticated workspaces tailored for 8 distinct cultural and commercial stakeholders.
- Concurrency-safe, server-authoritative ticketing and seat reservations.
- Transparent production crowdfunding and milestone-based sponsorship.
- Collaborative ecosystems for venues, academic workshops, corporate engagements, and film/OTT casting.
- An AI-powered cultural concierge celebrating Bengali theatre heritage.

---

## 👥 Role-Based Functional Requirements

Mancha provides role-gated portals with purpose-built workflows tailored to each persona:

### 1. Theatre Groups / Troupes (`theatre_group`)
- **Production Lifecycle Management:** Create, publish, update, and archive stage productions; specify show schedules, hall venue details, seat capacities, and ticket tiers.
- **Seat & Capacity Oversight:** View real-time seat inventory, track ticket sales, inspect digital guest check-ins, and manage offline reservations.
- **Troupe Member Roster:** Maintain actor and crew registries, credit production roles (director, playwright, light, sound, costume, set design), and verify troupe affiliations.
- **Community Meetups & Fan Gatherings:** Schedule and announce behind-the-scenes meetups, cast talkbacks, play readings, and post-show discussions with audience members.
- **Training Programs & Workshops:** Organize acting workshops, stagecraft masterclasses, scriptwriting labs, and voice coaching; collect applicant portfolios and issue digital certificates.
- **Crowdfunding & Campaign Management:** Launch production funding campaigns with defined financial targets, track micro-contributions, and publish milestone updates.
- **Audition Calls & Casting Notices:** Publish casting calls for upcoming productions with character breakdowns, rehearsal dates, and applicant submission criteria.
- **Venue Discovery & Booking:** Browse university auditoriums and corporate cultural spaces; submit hall reservation requests directly to venue managers.

### 2. Theatre Artists (`theatre_artist`)
- **Digital Theatre Portfolio:** Verified acting and crew credit history linked directly to verified troupe productions.
- **Audition & Opportunity Hub:** Search and apply for active troupe casting calls, voiceover gigs, and film/OTT talent requests.
- **Skill Training & Certification:** Enroll in troupe-hosted training programs, masterclasses, and workshops; download verified completion credentials.
- **Community Meetups:** RSVP and participate in stagecraft seminars, play readings, and inter-troupe networking events.
- **Production Archive:** Document personal performance archives, video reel links, production stills, press reviews, and director recommendations.

### 3. General Audience (`audience`)
- **Show Discovery & Schedule:** Browse upcoming stage plays with filters by genre, troupe, venue (e.g., Shilpakala Academy, Mahila Samity), date, and pricing.
- **Seat Selection & Digital Ticketing:** Reserve seats with real-time seat locks; receive tamper-resistant digital tickets equipped with verification QR codes.
- **Ticket Wallet:** Manage active and past tickets; simulate entry validation and cancel bookings before cancellation deadlines.
- **Crowdfunding Contributions:** Back upcoming independent stage productions with transparent progress tracking.
- **Meetup & Event Participation:** RSVP for play readings, director Q&A sessions, and troupe community meetups.
- **Audience Reviews & Discussions:** Submit star ratings and long-form reviews for attended productions, and view verified troupe replies.
- **Personal Watchlist:** Bookmark shows, favorite theatre troupes, and follow featured artists.

### 4. University Culture Wings (`university`)
- **Campus Venue Publishing:** List campus auditoriums, open-air stages, and rehearsal rooms with seating capacity, technical specs, and availability calendars.
- **Inter-University & Troupe Festivals:** Host national drama festivals, invite professional troupes for campus performances, and coordinate student ticket subsidies.
- **Academic Workshops & Training:** Co-organize masterclasses and script workshops with veteran playwrights and theatre directors.
- **Internship Programs:** Publish internship openings in stage management, dramaturgy, lighting, and cultural journalism for university students.

### 5. Corporate Sponsors & CSR (`corporate`)
- **Production Sponsorship Marketplace:** Discover upcoming theatre campaigns aligned with corporate CSR objectives or brand demographics.
- **Cultural Program Commissioning:** Commission special corporate shows, employee appreciation theatre evenings, or corporate training sessions through stage improvisation.
- **Venue Sponsorship & Activation:** Rent university or municipal spaces for co-branded cultural galas.
- **Sponsorship Impact Tracking:** Receive contribution receipts, audience demographic metrics, and brand visibility reports.

### 6. Tourism & Cultural Boards (`tourism`)
- **Cultural Tourism Calendar:** Curate national and seasonal theatre schedules (e.g., Ekushey theatre festivals, winter drama fairs) for international and domestic tourists.
- **Curated Cultural Packages:** Partner with troupes to bundle stage play tickets with heritage walking tours and cultural dinners.
- **Special Heritage Programs:** Sponsor regional folk theatre revivals (*Jatra*, *Gambhira*, *Putul Nach*) and document traditional performance art.

### 7. Film & OTT Casting Directors (`film_ott`)
- **Actor & Crew Talent Scouting:** Access verified artist profiles filtered by stage experience, voice range, age demographic, and verified production credits.
- **Industry Casting Calls:** Post audition briefs specifically aimed at disciplined, stage-trained theatre actors for TV series, films, and streaming productions.
- **Audition Pipeline:** Review audition reel submissions, shortlist talent, and message troupe leadership for reference checks.

### 8. Platform Administrators (`admin`)
- **User & Troupe Verification:** Review and approve registered theatre troupes, corporate bodies, and educational institutions before they can publish public listings.
- **Content Moderation:** Monitor show listings, user reviews, crowdfunding campaigns, and public comments to maintain community standards.
- **Financial & Transaction Auditing:** Supervise platform-wide ticket sales, refund claims, and campaign disbursements.
- **Security & Audit Logs:** Review the immutable `security_audit_log` for role modifications, elevated privilege assignments, and status transitions.
- **System Metrics:** High-level analytics on active productions, user growth, ticket velocity, and ecosystem engagement.

---

## 🏗️ Technology Architecture

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | [TanStack Start](https://tanstack.com/start) | React 19, Vite 7, SSR/SSG-ready with full-stack server functions |
| **Routing & State** | TanStack Router & Query v5 | Type-safe URL routing, prefetching, and caching |
| **Styling & System** | Tailwind CSS v4, Lucide Icons | Deep Burgundy (`#6B1022`), Theatre Gold (`#D4AF37`), Warm Ivory (`#FAF8F3`) |
| **UI Components** | Radix UI & shadcn/ui | Accessible primitives with custom theatre-themed tokens |
| **Database & Auth** | Supabase (PostgreSQL 15+) | Row-Level Security (RLS), ACID-compliant stored procedures (RPCs), triggers |
| **AI Layer** | Google Gemini 2.5 Flash | Integrated cultural knowledge base for Bengali theatre history and navigation |
| **Validation** | Zod & React Hook Form | Strict client-side and server-side schema verification |

---

## 🛡️ Production Security Architecture

The platform operates on a **zero-trust client architecture**:

1. **Server-Authoritative Transactions (RPCs):**
   - Direct `INSERT` operations on tickets and funding contributions are strictly revoked.
   - `book_ticket(p_production_id, p_seat_number, p_price, ...)` executes inside an atomic PostgreSQL transaction using row locks (`SELECT FOR UPDATE`) on the production inventory to eliminate race conditions and double bookings.
   - `contribute_to_campaign(p_campaign_id, p_amount, ...)` atomically updates financial totals while recording individual contribution records.
2. **Role-Based Access Control (RBAC):**
   - User roles are stored in an isolated, non-editable `public.user_roles` table verified by `has_role(auth.uid(), '...')`.
   - The `guard_profile_update` trigger blocks unauthorized client modifications to role or approval status columns.
3. **Public Directory Segregation:**
   - Client applications never query private user profile data for public views.
   - An automatic synchronization trigger publishes sanitized, public troupe and artist details into `public.public_directory`.
4. **Input Hardening & Anti-Phishing:**
   - Password policies require 10+ characters with uppercase, lowercase, and numeric characters.
   - Redirection utilities enforce same-origin validation (`sanitizeRedirect`) to prevent open-redirect attacks.
5. **Immutable Audit Trail:**
   - Administrative role promotions, approvals, and status updates are automatically recorded in `public.security_audit_log`.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+) or [Bun](https://bun.sh/) (v1.1+)
- A [Supabase](https://supabase.com/) project (PostgreSQL 15+)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/mancha.git
cd mancha
```

### 2. Install Dependencies

```bash
bun install
# or
npm install
```

### 3. Database Migration

1. Open your Supabase project's **SQL Editor**.
2. Run the consolidated migration script located at `supabase/schema.sql`. This sets up:
   - All custom enums (`app_role`, `ticket_status`, `campaign_status`, etc.)
   - All 11 core domain tables with complete Row-Level Security (RLS) policies
   - Security-definer stored functions (`book_ticket`, `cancel_ticket`, `contribute_to_campaign`)
   - Auto-provisioning and profile sync triggers (`handle_new_user`, `sync_public_directory`)
3. In your Supabase dashboard under **Authentication → Providers → Email**:
   - Ensure the **Email** provider is enabled.
   - For demo/testing environments, you can disable email confirmation; keep it enabled in production.
   - Configure your site URL and allowed redirect URLs under **Authentication → URL Configuration**.

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL="https://<your-project-ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_..."
VITE_SUPABASE_PROJECT_ID="<your-project-ref>"
```

*(Note: Never expose the Supabase `service_role` secret in client-side applications).*

### 5. Launch the Development Server

```bash
bun run dev
# or
npm run dev
```

Visit `http://localhost:8080` in your browser.

---

## 👑 Bootstrapping Your First Administrator

To prevent privilege escalation, new accounts are created with standard non-privileged roles. To promote your account to Platform Administrator, execute the following in your Supabase SQL Editor:

```sql
-- 1. Activate profile and set primary role
UPDATE public.profiles
SET primary_role = 'admin', status = 'active'
WHERE email = 'your-admin-email@example.com';

-- 2. Grant administrative role in user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role FROM public.profiles WHERE email = 'your-admin-email@example.com'
ON CONFLICT DO NOTHING;
```

Once granted, the administrator can approve pending troupes, manage community listings, and configure system preferences through the `/admin` portal.

---

## 📁 Directory Structure

```text
├── src/
│   ├── assets/              # Curated cultural & stage production imagery
│   ├── components/          # Reusable UI component library
│   │   ├── ai/              # Mancha AI concierge modal & prompt chips
│   │   ├── auth/            # Hardened auth forms & password validation widgets
│   │   ├── portal/          # Role-adaptive sidebar navigation & layouts
│   │   └── ui/              # Radix/shadcn design primitives (cards, dialogs, buttons)
│   ├── data/explore/        # Catalog data for productions, troupes, and artists
│   ├── integrations/        # Auto-generated Supabase clients and types
│   ├── lib/                 # Utility functions, validation schemas, safe-redirects
│   ├── routes/              # TanStack Start file-based routing
│   │   ├── index.tsx        # Cinematic public landing page
│   │   ├── explore/         # Discovery hub for Shows, Artists, and Groups
│   │   ├── _authenticated/  # Protected role-specific portals:
│   │   │   ├── admin/       # Platform administration & approvals
│   │   │   ├── group/       # Troupe dashboard (shows, meetups, training)
│   │   │   ├── artist/      # Artist portfolio & opportunity hub
│   │   │   ├── audience/    # Ticket wallet & watchlist
│   │   │   └── org/         # Adaptive portal (University, Corporate, Tourism, Film)
│   │   └── (auth)/          # Authentication pages (login, register, reset)
│   └── styles.css           # Semantic tokens & custom typography (Playfair / Inter)
├── supabase/
│   └── schema.sql           # Full consolidated database schema & security functions
├── README.md                # Project documentation
└── package.json             # Scripts and dependencies
```

---

## 📄 License

This project is open-source software licensed under the [MIT License](LICENSE).
