# GuyGuy

Monorepo for the GuyGuy web app.

## Repo structure

- `frontend/`: React (Vite) web app
- `backend/`: Go (Gin) API server
- `supabase/`: Supabase local config, seeds, and Edge Functions (scaffold)

## Prerequisites

- Node.js 20+
- Go 1.22+

## Frontend (local)

```bash
cd frontend
npm install
npm run dev
```

## Backend (local)

```bash
cd backend
copy .env.example .env
go run .\cmd\server
```

Endpoints:

- `GET /health` → `http://localhost:8080/health`
- `GET /api/v1/ping` → `http://localhost:8080/api/v1/ping`

## Local dev with Docker Compose

```bash
docker compose up --build
```

This starts:

- `backend` on `http://localhost:8080`
- `postgres` on `localhost:5432` (for local DB testing)

## Database schema (Supabase)

The schema is defined as SQL migrations under `supabase/migrations/` and mirrors the Tech Bible:

- tables (users, artisan_profiles, bookings, payments, etc.)
- PostGIS extension + indexes for proximity search
- `updated_at` trigger function
- RLS enabled on all tables + policies
- auth trigger to auto-create `public.users` on signup

### Apply to a hosted Supabase project (quick)

In the Supabase Dashboard:

- Go to **SQL Editor**
- Run the migrations in filename order from `supabase/migrations/`

### Apply locally (later, via Supabase CLI)

If/when you set up Supabase CLI, you can run the migrations against a local stack.

