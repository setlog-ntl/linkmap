# Deployment Guide

## Prerequisites
- Node.js 20+
- Supabase project
- Cloudflare account

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
GITHUB_OAUTH_CLIENT_ID=...
GITHUB_OAUTH_CLIENT_SECRET=...
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

## Cloudflare Workers Deployment

### CLI 배포 (권장)
```bash
# 1. Cloudflare 로그인
npx wrangler login

# 2. Cloudflare Workers 빌드
npm run build:cf

# 3. 배포
npm run deploy:cf

# 4. 환경변수 설정
npx wrangler secret put NEXT_PUBLIC_SUPABASE_URL
npx wrangler secret put NEXT_PUBLIC_SUPABASE_ANON_KEY
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put ENCRYPTION_KEY
```

### CI/CD 자동 배포
- `.github/workflows/deploy-cloudflare.yml` — main 브랜치 push 시 자동 배포
- GitHub Secrets 필요: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`

### 참고
- Windows에서 `build:cf` 불가 (NTFS 콜론 파일명) → WSL 또는 CI 사용
- 상세 가이드: [docs/cloudflare-migration.md](./docs/cloudflare-migration.md)

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
