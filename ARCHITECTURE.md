# SetLog Architecture

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **UI**: Tailwind CSS v4 + shadcn/ui v4
- **State Management**: TanStack Query (server state) + Zustand (client state)
- **Visualization**: React Flow (@xyflow/react)
- **Validation**: Zod
- **Encryption**: AES-256-GCM (Node.js crypto)

## Directory Structure
```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Login, signup, reset-password
│   ├── (dashboard)/  # Protected dashboard
│   ├── project/[id]/ # Project pages (overview, services, env, map, settings)
│   ├── services/     # Service catalog
│   ├── pricing/      # Pricing page
│   └── api/          # API routes
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Header, Footer
│   ├── project/      # Project-related components
│   ├── service/      # Service catalog components
│   └── service-map/  # React Flow nodes and map
├── hooks/            # Legacy custom hooks
├── lib/
│   ├── api/          # API error helpers
│   ├── crypto/       # AES-256-GCM encryption
│   ├── i18n/         # Internationalization
│   ├── queries/      # TanStack Query hooks
│   ├── supabase/     # Supabase client/server/middleware
│   └── validations/  # Zod schemas
├── stores/           # Zustand stores
├── types/            # TypeScript interfaces
└── data/             # Seed data (services, templates)

packages/
├── mcp-server/       # MCP server for Claude Code/Cursor
└── cli/              # CLI tool for env management
```

## Key Patterns
1. **Server Components**: Default for data fetching, with `force-dynamic`
2. **Client Components**: For interactive UI, prefixed with `'use client'`
3. **TanStack Query**: All client-side data fetching via query hooks
4. **Zod Validation**: All API inputs validated before processing
5. **Row-Level Security**: Supabase RLS ensures data isolation
6. **Audit Logging**: Sensitive operations logged to audit_logs table
7. **Rate Limiting**: In-memory rate limiter on API routes
