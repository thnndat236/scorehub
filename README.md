# ScoreHub

An score analytics platform for high school graduation exam.

## Stack

- **Backend:** NestJS 12 (CommonJS)
- **Frontend:** Next.js 16 (App Router) + Tailwind CSS v4
- **Database:** PostgreSQL with Prisma ORM
- **Workspace:** pnpm workspaces

## Requirements

- Node.js `>= 24.9.0`
- pnpm `11.28.11`

## Getting Started

Install dependencies from the repository root:

```
pnpm install
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

## Checks

```
pnpm lint
pnpm typecheck
pnpm build
```

## Project structure

```
backend/ NestJS API
frontend/ Next.js application
packages/ shared workspace packages (future)
```

## Environment variables

Copy the example files and fill in your own values.

```
backend/.env.example
frontend/.env.example
```
