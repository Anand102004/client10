# Study Hall CRM

## Overview

Study Hall is a full-stack CRM/management application for a co-study space (like a library or coworking space for students). It handles student admissions, seat booking with a 10x10 grid layout, attendance tracking, invoice/payment management, a community discussion board, and enquiry management. The app has two roles: **admin** (manages everything) and **student** (views their own dashboard, invoices, attendance, and community). Authentication is currently mock-based using localStorage — no real auth system is in place.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: `wouter` (lightweight client-side router)
- **State Management**: React Context for auth (`useAuth` hook), `@tanstack/react-query` for server state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Charts**: Recharts for dashboard analytics (attendance, revenue)
- **Icons**: Lucide React
- **Date Utilities**: date-fns
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via `tsx`
- **API Pattern**: RESTful JSON API under `/api/*` prefix. Routes are defined declaratively in `shared/routes.ts` and registered in `server/routes.ts`
- **Dev Server**: Vite dev middleware is used in development mode for HMR; in production, static files are served from `dist/public`

### Database
- **Database**: PostgreSQL (required — `DATABASE_URL` environment variable must be set)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` — shared between client and server
- **Migrations**: Managed via `drizzle-kit push` (push-based, no migration files needed for dev)
- **Connection**: `pg` Pool in `server/db.ts`

### Key Database Tables
- `users` — Students and admins with plan type and course info
- `seats` — 100 seats in a 10x10 grid; rows 1-2 restricted to `15_hours` plan
- `seatBookings` — Links users to seats with time slots and dates
- `posts` / `comments` — Community discussion board
- `enquiries` — Incoming student interest forms
- `invoices` — Payment tracking with status (pending/paid)
- `attendance` — Check-in/check-out records

### Authentication
- **Current Implementation**: Mock auth only. Role (`admin` or `student`) is stored in `localStorage`. The `useAuth` hook provides login/logout/role context. There is no real session, password hashing, or token-based auth.
- **Route Protection**: `ProtectedRoute` component in `App.tsx` checks role and redirects accordingly.

### Shared Code (`shared/` directory)
- `schema.ts` — Drizzle table definitions and Zod insert schemas (used by both client and server)
- `routes.ts` — API route definitions with paths, methods, and validation schemas. Client hooks in `use-crm.ts` consume these definitions.

### Build System
- **Development**: `tsx server/index.ts` with Vite middleware for HMR
- **Production Build**: Custom `script/build.ts` — runs Vite build for client, esbuild for server. Output goes to `dist/` (server as `dist/index.cjs`, client as `dist/public/`)
- **Key Scripts**: `npm run dev`, `npm run build`, `npm start`, `npm run db:push`

### Project Structure
```
client/           — React frontend
  src/
    components/   — UI components (shadcn/ui in ui/, layout components)
    pages/        — Route pages (home, admin-*, student-*, auth, community)
    hooks/        — Custom hooks (use-auth, use-crm, use-toast, use-mobile)
    lib/          — Utilities (queryClient, utils)
server/           — Express backend
  index.ts        — Server entry point
  routes.ts       — API route handlers
  storage.ts      — Data access layer (IStorage interface + DB implementation)
  db.ts           — Database connection
  seed.ts         — Database seeding script
  vite.ts         — Vite dev server integration
  static.ts       — Production static file serving
shared/           — Shared between client and server
  schema.ts       — Drizzle schema + Zod validators
  routes.ts       — API route definitions
migrations/       — Drizzle migration output
```

## External Dependencies

- **PostgreSQL** — Primary database, connected via `DATABASE_URL` environment variable. Uses `pg` driver with `connect-pg-simple` for potential session storage.
- **Google Fonts** — Architects Daughter, DM Sans, Fira Code, Geist Mono (loaded in `index.html`); Outfit and Plus Jakarta Sans (loaded in `index.css`)
- **Replit Plugins** — `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` (dev-only, Replit-specific)
- **No external auth provider** — Auth is mocked client-side
- **No external payment provider** — Payment verification is manual (QR code + screenshot upload flow)