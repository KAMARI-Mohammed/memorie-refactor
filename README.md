# Memorie — Social Storytelling Platform (Starter)

This is a **full‑stack starter** for your project: React (Vite) + Node.js (Express) + PostgreSQL (Prisma) + Socket.IO.

## Features
- JWT auth (signup, login, protected routes)
- Posts (create, list, view)
- Comments & likes
- Real‑time chat (rooms & DMs skeleton)
- TailwindCSS UI with a clean, modern layout
- Ready for future features

## Quick Start

### 1) Prereqs
- Node 18+
- PostgreSQL 14+ (running locally or on a service)
- pnpm (recommended) or npm/yarn

### 2) Backend
```bash
cd server
cp .env.example .env
# Edit DATABASE_URL in .env to your Postgres connection string
pnpm install
pnpm prisma migrate dev --name init
pnpm dev
```

### 3) Frontend
```bash
cd ../client
pnpm install
pnpm dev
```

### 4) Default URLs
- API: http://localhost:4000/api
- Web: http://localhost:5173

> After you upload your current UI as a **.zip**, we will merge your colors/assets and migrate your HTML into React components.
