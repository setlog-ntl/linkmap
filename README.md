# Linkmap

프로젝트에 연결된 외부 서비스(API, DB, 결제 등)의 연결 정보를 시각화하고, API 키·환경변수·등록 ID를 안전하게 관리하는 설정 관리 플랫폼입니다.

## Stack

- **Framework**: Next.js 16 (App Router)
- **DB/Auth**: Supabase
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Deploy**: Cloudflare Workers (`@opennextjs/cloudflare`)

## Getting Started

```bash
# 의존성 설치
npm ci

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일에 Supabase URL, Key, ENCRYPTION_KEY 입력

# 개발 서버 시작
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Build & Deploy

```bash
# 로컬 빌드 (webpack 모드)
npm run build

# Cloudflare Workers 빌드
npm run build:cf

# Cloudflare Workers 배포
npm run deploy:cf
```

### 깃 배포 적용 (GitHub Actions)

`main` 브랜치에 푸시할 때마다 Cloudflare Workers로 자동 배포됩니다.

1. **GitHub Secrets 4개 설정** (Repository → Settings → Secrets and variables → Actions)
   - `CLOUDFLARE_API_TOKEN` — Cloudflare API 토큰 (Workers 편집 권한)
   - `CLOUDFLARE_ACCOUNT_ID` — Cloudflare 계정 ID
   - `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon 키
2. **배포:** `main`에 푸시하거나 Actions에서 "Deploy to Cloudflare Workers" 수동 실행
3. **런타임 시크릿:** 배포 후 Cloudflare에서 `ENCRYPTION_KEY` 등 `wrangler secret put` 설정

**상세:** [docs/setup/git-deploy.md](docs/setup/git-deploy.md)  
워크플로: [.github/workflows/deploy-cloudflare.yml](.github/workflows/deploy-cloudflare.yml)  
Cloudflare 가이드: [docs/cloudflare-migration.md](docs/cloudflare-migration.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [설정 가이드](./docs/setup/README.md)
- [Cloudflare 마이그레이션 가이드](./docs/cloudflare-migration.md)
