# Deployment Guide

## Prerequisites
- Node.js 20+
- Supabase project
- Vercel account (recommended)

## Environment Variables

### Required
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ENCRYPTION_KEY=<64 hex characters>
```

### Optional (for features)
```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Database Setup
1. Create a Supabase project
2. Run migrations in order:
   ```
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/003_audit_log.sql
   supabase/migrations/004_subscriptions.sql
   supabase/migrations/005_teams.sql
   supabase/migrations/006_api_tokens.sql
   ```
3. Seed data: POST `/api/seed` (development only)

## Vercel Deployment
1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy - CI/CD runs automatically via `.github/workflows/ci.yml`

## Local Development
```bash
npm install
npm run dev
```

## Testing
```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run typecheck     # TypeScript check
npm run lint          # ESLint
```
