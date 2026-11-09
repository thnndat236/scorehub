# ScoreHub

A score analytics platform for the high school graduation exam.

## Features

- Dashboard with overview metrics, average distribution, and Group A leaderboard
- Score lookup by registration number
- Reports with subject statistics, score distribution, and score histogram
- Light, dark, and system theme

## Stack

- **Backend:** NestJS 12 (CommonJS)
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4
- **Database:** PostgreSQL with Prisma ORM
- **Workspace:** pnpm workspaces

## Requirements

- Node.js `>= 24.9.0`
- pnpm `11.28.11`
- Docker (for PostgreSQL)

## Getting Started

Install dependencies from the repository root:

```
pnpm install
```

Copy the example environment files and fill in your own values:

```
backend/.env.example
frontend/.env.example
```

Start PostgreSQL, apply migrations, and seed subjects:

```
pnpm db:up
pnpm --filter @scorehub/backend exec prisma migrate deploy
pnpm --filter @scorehub/backend exec prisma db seed
```

Start both apps:

```
pnpm dev
```

Or run them separately:

```
pnpm dev:backend # http://localhost:4000
pnpm dev:frontend # http://localhost:3000
```

## Data import

The optional CSV import expects `backend/dataset/diem_thi_thpt_2024.csv`:

```
pnpm --filter @scorehub/backend db:import
```

## Checks

```
pnpm lint
pnpm typecheck
pnpm --filter @scorehub/backend test
pnpm build
```

## Project structure

```
backend/ NestJS API
frontend/ Next.js application
packages/ shared workspace packages (future)
```
