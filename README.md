# StudyBox AI

> Curated study kits marketplace with AI-powered StudyBox generation.

## Overview
- **What it is:** A full-stack app that helps students discover and assemble study kits (StudyBoxes). It includes a marketplace, cart/checkout flows, user dashboard, and an AI-driven generator that suggests products within a budget.
- **Tech stack:** Node.js (Express) backend, MongoDB, React + TypeScript frontend (Vite), TanStack Router, OpenAI integration for the generator.

## Repository Structure
- **backend/** — Express server, API routes, AI service, DB config, seed scripts.
- **src/** — Frontend React app (routes, components, lib helpers).

Key files:
- Backend server: [backend/src/server.js](backend/src/server.js)
- Backend AI service: [backend/src/services/aiService.js](backend/src/services/aiService.js)
- Backend seed (demo user): [backend/seed.js](backend/seed.js)
- Frontend generator hook: [src/lib/useAIGenerate.ts](src/lib/useAIGenerate.ts)
- Frontend auth/user helper: [src/lib/user.tsx](src/lib/user.tsx)
- Dashboard: [src/routes/dashboard.tsx](src/routes/dashboard.tsx)
- Orders page: [src/routes/orders.tsx](src/routes/orders.tsx)

## Prerequisites
- Node.js 18+ (LTS recommended)
- npm (or yarn)
- MongoDB (Atlas or local)
- OpenAI API key (if you want the AI generator to run against OpenAI)

## Environment Variables
Create a `.env` in `backend/` (copy from `.env.example`) and set at minimum:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing JWT tokens
- `OPENAI_API_KEY` — (optional) OpenAI API key for the generator
- `PORT` — backend port (default: `5001`)

On the frontend root (project root), you can set `VITE_API_URL` to point to the backend (defaults to `http://localhost:5001`). Example `.env` at project root:

```
VITE_API_URL=http://localhost:5001
```

## Install & Run (local development)

1. Start backend

```bash
cd backend
npm install
# copy .env.example to .env and configure values (Windows: copy .env.example .env)
node seed.js   # creates demo user (demo@example.com / Demo123)
npm run dev    # starts backend (dev mode)
```

2. Start frontend

```bash
cd ..                # project root
npm install
# ensure VITE_API_URL is set in project root .env (or frontend will default to http://localhost:5001)
npm run dev
```

Open `http://localhost:5173` (Vite dev) in your browser. The backend defaults to `http://localhost:5001`.

## Useful Commands
- Frontend dev: `npm run dev`
- Frontend build: `npm run build`
- Frontend preview (serve built assets): `npm run preview`
- Backend dev: `cd backend && npm run dev`
- Seed demo user: `cd backend && node seed.js`

## API Endpoints (main)
- `POST /api/auth/login` — login (body: `{ email, password }`)
- `POST /api/auth/register` — register
- `GET /api/auth/me` — get current user (requires `Authorization: Bearer <token>`)
- `POST /api/packs/generate` — generate AI StudyPack (protected; requires JWT)
- `GET /api/health` — health check

Authentication: after login the frontend stores the JWT in localStorage under key `studybox.token`. See [src/lib/user.tsx](src/lib/user.tsx) and [src/lib/useAIGenerate.ts](src/lib/useAIGenerate.ts) for usage.

## Demo Credentials
- Email: `demo@example.com`
- Password: `Demo123`

## Currency
- The UI has been migrated to use the `DT` currency label (project-wide). If you see `$` in the built files, run a clean build (`npm run build`) to regenerate `dist/` artifacts.

## Orders / Commands
- Orders are persisted locally (demo mode) under `localStorage` key `studybox.orders` and are displayed in the Dashboard -> "My Commands" section. See [src/routes/dashboard.tsx](src/routes/dashboard.tsx) and [src/routes/orders.tsx](src/routes/orders.tsx).

## AI Study Pack Generator
The AI generator creates **personalized, dynamic study kits** based on student profile (field, level, goal, study style, budget). It's not static—every generation is unique based on inputs.

### How It Works
1. **User inputs profile:** Field (CS, Medicine, Law, etc.), Academic Level, Goal (Exams, Projects, Internship), Study Style, Budget
2. **AI analyzes combination:** The system considers all factors together (e.g., Medicine + Undergraduate + Exams + Visual learning = specific recommendations)
3. **Generates personalized kit:** Returns 5-10 items with prices and specific reasons why each helps
4. **Validates & saves:** Budget is enforced, pack is saved to DB, user earns XP

### Supported Fields
- Computer Science
- Medicine
- Law
- Engineering
- Business
- Psychology
- Mathematics
- Physics
- Chemistry
- History

### Supported Goals
- Exams (high-stakes preparation)
- Projects (long-form work)
- Revision (steady learning)
- Internship (career prep)
- Mastery (deep expertise)
- Certification (professional cert)

### Supported Study Styles
- Organized (planners, structure)
- Last-minute (quick reference)
- Visual (diagrams, colors)
- Minimalistic (essentials only)
- Collaborative (group work)
- Hands-on (interactive)

### AI Model Details
- **Model:** OpenAI gpt-4o-mini
- **Context-aware prompts:** AI receives detailed context about each field and goal
- **Budget validation:** Ensures total cost ≤ budget
- **Retry logic:** Automatic retries with exponential backoff
- **Item-specific reasoning:** Each item has a reason tied to field+goal+level
- **Temperature:** 0.7 (balanced for consistency and creativity)

Example: A CS Undergraduate studying for exams gets different recommendations than a CS PhD doing research—even using the same field.

## Troubleshooting
- If the frontend reports connection refused, confirm the backend is running on the expected `PORT` and that `VITE_API_URL` points to it.
- Authentication 401: ensure JWT secret matches and the token is present in `localStorage` as `studybox.token`.
- Seed script errors: ensure MongoDB is reachable and `MONGO_URI` is correct.

## Notes & Next Steps
- Consider adding a `backend/package.json` script like `seed:demo` for convenience if you seed frequently.
- Rebuild frontend assets after UI string changes to update `dist/` (`npm run build`).

If you'd like, I can: run the dev servers, start a build, or add a `seed:demo` npm script in `backend/package.json`.

---
Generated on April 28, 2026 — StudyBox AI
