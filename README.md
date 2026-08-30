# Fusion Connect AI

> A premium, frontend-only educational platform prototype for physics, nuclear fusion, and scientific collaboration.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TanStack Start](https://img.shields.io/badge/TanStack%20Start-v1-FF4154?logo=tanstack)](https://tanstack.com/start)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)

![Fusion Connect AI Hero](./public/og-image.png)

---

## Overview

**Fusion Connect AI** is a polished prototype of a modern learning and collaboration platform focused on plasma physics, nuclear fusion, and scientific discovery. It demonstrates a cohesive, interactive UX without relying on a backend, authentication, real AI/ML models, or external APIs.

The design language is intentionally scientific and premium: a dark navy foundation, crisp light surfaces, electric blue/cyan accents, thin borders, and subtle plasma and magnetic-field visual motifs.

---

## Features

- **Home** — Hero with tokamak/plasma visuals, feature sections, scientific stats, and popular modules.
- **Learn** — Physics and Nuclear Fusion module cards with difficulty, duration, and progress. Detailed lesson pages with equations, SVG diagrams, knowledge checks, and prev/next navigation.
- **Onboarding** — Anonymous onboarding flow: identity, interest selection, education level, privacy/consent, and analytics opt-in.
- **Community** — X/Twitter-style science feed with posts, comments, upvotes, saves, shares, topic filters, and post detail views.
- **Collaborate** — Research and Classroom project proposals with search, filters, detail modals, and a create-proposal UI.
- **AI Mentor** — Mock personalized recommendations with confidence scores, "Why this was recommended" explanations, and a visual ML pipeline illustration.
- **Dashboard** — Learning progress, streak, study-time chart, topic-mastery radar, completed modules, and recent activity.
- **Analytics** — Anonymized/k-anonymous engagement dashboard with active learners, completion rates, popular topics, and privacy notices.
- **QR Generator** — Select modules, projects, posts, or resources and generate deterministic QR-code previews with copy/share actions.
- **Profile** — Anonymous identity, interests, progress, saved resources, and clear separation of public/private/anonymized data.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [TanStack Start v1](https://tanstack.com/start) (React 19 + Vite 8) |
| Routing | [TanStack Router](https://tanstack.com/router) (file-based) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) with custom scientific theme tokens |
| Components | [Radix UI](https://www.radix-ui.com) primitives + shadcn/ui patterns |
| Charts | [Recharts](https://recharts.org) |
| Icons | [Lucide React](https://lucide.dev) |
| Forms | React Hook Form + Zod |
| Toasts | Sonner |
| Type Safety | TypeScript 5.8 |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+ or [Bun](https://bun.sh)
- npm, pnpm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/fusion-connect-ai.git
cd fusion-connect-ai

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
npm run dev
# or
bun dev
```

The dev server starts at `http://localhost:8080` by default.

### Build

```bash
npm run build
# or
bun run build
```

### Preview Production Build

```bash
npm run preview
# or
bun run preview
```

---

## Project Structure

```text
src/
├── components/
│   ├── plasma-visuals.tsx      # Reusable SVG tokamak/field diagrams
│   ├── site-nav.tsx            # Responsive navigation + search
│   └── ui/                     # shadcn/ui component primitives
├── lib/
│   ├── app-state.tsx           # Frontend-only React context state
│   ├── mock-data.ts            # Realistic physics/fusion content
│   └── utils.ts                # Tailwind/class helpers
├── routes/                     # TanStack file-based routes
│   ├── __root.tsx              # Root layout, providers, metadata
│   ├── index.tsx               # Home
│   ├── learn.index.tsx         # Module listing
│   ├── learn.$slug.tsx         # Lesson detail
│   ├── onboarding.tsx          # Onboarding flow
│   ├── community.index.tsx     # Community feed
│   ├── community.$postId.tsx   # Post detail
│   ├── collaborate.tsx         # Collaboration hub
│   ├── mentor.tsx              # AI Mentor recommendations
│   ├── dashboard.tsx           # Personal dashboard
│   ├── analytics.tsx           # Aggregate analytics
│   ├── qr.tsx                  # QR generator
│   └── profile.tsx             # User profile
├── styles.css                  # Theme tokens, animations, utilities
├── router.tsx                  # Router configuration
└── start.ts                    # TanStack Start entry
```

---

## Design System

- **Foundation:** Dark navy/black surfaces (`#0B0F19`, `#0F172A`)
- **Surfaces:** Clean light panels (`#F8FAFC`, `#E2E8F0`)
- **Accents:** Electric cyan/blue (`#06B6D4`, `#3B82F6`, `#22D3EE`)
- **Typography:** Space Grotesk headings + IBM Plex Mono for scientific/code accents
- **Effects:** Subtle plasma glows, magnetic grid fields, pulse animations
- **Borders:** Thin, low-opacity borders for a precise technical feel

---

## Important Notes

- **Frontend-only prototype:** No backend server, database, authentication, real AI/ML, or analytics processing is implemented.
- **Mock data:** All modules, posts, projects, recommendations, and analytics are populated from `src/lib/mock-data.ts`.
- **Local state:** User actions like upvotes, saves, completed modules, and onboarding choices are stored in a React context (`src/lib/app-state.tsx`) and reset on page refresh.
- **Privacy-first messaging:** Onboarding, analytics, and profile screens include clear notices about anonymity, k-anonymity, and data separation.
- **QR codes:** QR previews are deterministic SVG patterns generated in the browser; no real backend QR service is used.

---

## Screenshots

> Add screenshots of key routes here: `/`, `/learn`, `/community`, `/dashboard`, `/mentor`, `/qr`.

---

## Roadmap Ideas

- [ ] Persist state to `localStorage` or migrate to a real backend
- [ ] Add user authentication and profile persistence
- [ ] Implement real recommendation engine with user feedback loop
- [ ] Add backend API for posts, projects, and analytics aggregation
- [ ] Generate actual QR codes from shareable URLs
- [ ] Add lesson video/embed support and interactive simulations

---

## License

[MIT](./LICENSE)

---

Built with curiosity about fusion, plasma physics, and the future of scientific learning.
