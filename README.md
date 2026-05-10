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

