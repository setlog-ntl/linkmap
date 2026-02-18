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

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [설정 가이드](./docs/setup/README.md)
- [Cloudflare 마이그레이션 가이드](./docs/cloudflare-migration.md)
