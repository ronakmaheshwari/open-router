# Open Router

Over-engineering a “simple” AI routing layer into a full-blown distributed system.

What started as:

> “Let’s just call one model”

Quickly turned into:

> “What if we route across multiple models, normalize responses, add fallbacks, split services, introduce a monorepo, and accidentally build infrastructure?”

This project is a **multi-service AI routing platform** designed to explore system design, microservices, and DevOps patterns — while pretending it's still just an API wrapper.

---

## What This Does

Open Router acts as a **central orchestration layer for AI requests**, sitting between your frontend and multiple model providers.

It:

* Routes requests to different models
* Handles fallbacks when things inevitably fail
* Normalizes responses into a consistent format
* Separates concerns across services (because one backend wasn’t enough)
* Lets you experiment with routing strategies without breaking your app (too much)

---

## Why This Exists

Because:

* Different models are good at different things
* Reliability matters (especially when APIs randomly fail)
* Cost vs performance is a constant trade-off
* And most importantly — this was a good excuse to over-engineer something

---

## Architecture

This is not a “single backend” project. It’s a **monorepo with multiple services** that pretend to cooperate.

```
apps/
  frontend/           → React app (the only thing users see)
  primary-backend/    → Main orchestration layer (Elysia)
  api-backend/        → Supporting API service (Express)

packages/
  db/                 → Prisma + PostgreSQL
  ui/                 → Shared UI components
  validation/         → Shared schemas (Zod)
```

### Flow (Simplified)

```
Frontend (React)
        |
        v
Primary Backend (Elysia)
        |
        |---- API Backend (Express)
        |---- AI Providers
        |
        v
Normalized Response
```

---

## Tech Stack

Here’s everything you’ve thrown into this (intentionally or not):

| Layer             | Technology        |
| ----------------- | ----------------- |
| Monorepo          | Turborepo         |
| Runtime           | Bun               |
| Language          | TypeScript        |
| Frontend          | React 19          |
| Routing (FE)      | React Router 7    |
| Data Fetching     | TanStack Query    |
| UI Components     | Radix UI          |
| Styling           | Tailwind CSS v4   |
| Primary Backend   | Elysia            |
| Secondary Backend | Express 5         |
| Database          | PostgreSQL        |
| ORM               | Prisma            |
| Validation        | Zod               |
| Logging           | pino, morgan      |
| API Docs          | OpenAPI           |
| AI Integration    | Google Gen AI SDK |
| Environment       | dotenv            |
| Middleware        | cors              |

---

## Features

* Multi-service architecture (because one service is too mainstream)
* AI request routing layer
* Fallback handling for model failures
* Shared validation across services
* Centralized database layer with Prisma
* Clean UI component reuse via packages
* API abstraction layer between frontend and models
* Logging (so you can at least see things breaking)

---

## Getting Started

Clone the repo:

```bash
git clone https://github.com/ronakmaheshwari/open-router
cd open-router
```

Install dependencies (Bun expected):

```bash
bun install
```

Run all apps:

```bash
bun run dev
```

---

## Environment Setup

Create a `.env` file in relevant apps:

```
DATABASE_URL=your_postgres_url
GOOGLE_AI_KEY=your_api_key
PORT=3000
```

---

## Folder Breakdown

### `apps/frontend`

* React 19 app
* Uses TanStack Query for data fetching
* Styled with Tailwind + Radix UI

### `apps/primary-backend`

* Built with Elysia
* Handles core routing logic
* Acts as the main orchestrator

### `apps/api-backend`

* Express-based service
* Handles supporting APIs and integrations

### `packages/db`

* Prisma schema + database client
* Centralized DB access

### `packages/ui`

* Shared UI components
* Prevents copy-paste chaos

### `packages/validation`

* Zod schemas
* Shared request/response validation

---

## Design Decisions (a.k.a. Overthinking in Action)

* **Monorepo** → because managing multiple repos is too easy
* **Two backends** → because one didn’t feel “scalable enough”
* **Shared packages** → because duplication is offensive
* **Typed validation everywhere** → because runtime errors are embarrassing
* **AI routing layer** → because calling one API directly felt illegal

---

## Lessons Learned

* Microservices add complexity faster than they add value (initially)
* Routing AI models is harder than it sounds
* Shared types across services are both a blessing and a curse
* Logging becomes your best friend very quickly
* “Just one more abstraction” is never just one

---

## Future Improvements

* Smarter routing (cost + latency aware)
* Model performance tracking
* Caching layer
* Rate limiting
* Streaming responses
* Observability (so you stop guessing what's happening)

---

## Contributing

If you:

* enjoy system design
* like debugging distributed systems
* or just want to add another layer of abstraction

You’re welcome here.

---

## Final Thought

This project answers a very important question:

**“How far can you stretch a simple idea before it becomes infrastructure?”**

Turns out — pretty far.