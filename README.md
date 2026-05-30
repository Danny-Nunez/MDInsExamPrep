# Maryland Insurance Exam

AI-powered licensing exam prep for Maryland Life, Accident, Health, and Sickness Producer practice.

## Tech stack

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- OpenAI API (server-side `/api/generate-quiz`)
- MongoDB for users, exam attempts, category performance, and generated quizzes
- localStorage fallback for guests (not signed in)

## Getting started

```bash
npm install
cp .env.example .env.local
```

Add to `.env.local`:

- `OPENAI_API_KEY` — for AI quiz generation
- `MONGO_URI` — MongoDB Atlas connection string
- `AUTH_SECRET` — random string (32+ chars) for session cookies

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the landing page, then sign in or register to access the dashboard at `/dashboard`.

## Features

- **Dashboard** — Latest score, goal (75%), exams taken, weak areas, category progress, AI quiz generator
- **Practice exam** — Seed questions or AI-generated quiz; one-at-a-time or full exam mode
- **Results** — Score %, pass/fail, category breakdown, answer review with explanations
- **Weak area tracking** — Categories below 75% highlighted after each attempt

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/dashboard` | Practice exam dashboard |
| `/practice` | Practice exam |
| `/results` | Latest results & history |
| `/api/generate-quiz` | POST — AI question generation |
| `/api/auth/login` | POST — sign in |
| `/api/auth/register` | POST — create account |
| `/api/auth/logout` | POST — sign out |
| `/api/auth/me` | GET — current user |
| `/api/exams` | GET/POST — exam history (auth required) |
| `/api/performance` | GET — category stats (auth required) |
| `/api/quizzes` | GET/POST — generated quizzes (auth required) |
| `/login` | Sign in page |
| `/register` | Create account page |

## Environment

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Server-only OpenAI key for quiz generation |
| `MONGO_URI` | MongoDB Atlas connection string |
| `AUTH_SECRET` | Secret for signing session JWT cookies |

Without an API key, seed practice exams still work. Without MongoDB/auth, guests use browser localStorage only.
