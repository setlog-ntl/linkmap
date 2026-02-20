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

`main` 브랜치에 푸시할 때마다 Cloudflare Workers로 자동 배포하려면, GitHub 저장소에 아래 4개 **Secrets**를 설정하세요.

| Secret | 설명 |
|--------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 토큰 (Workers 편집 권한) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 계정 ID (대시보드 URL 또는 Overview에서 확인) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon(public) 키 |

**설정 위치:** Repository → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

워크플로: [.github/workflows/deploy-cloudflare.yml](.github/workflows/deploy-cloudflare.yml)  
상세 단계: [Cloudflare 연결 가이드](/guides/cloudflare) 또는 [docs/cloudflare-migration.md](./docs/cloudflare-migration.md)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [설정 가이드](./docs/setup/README.md)
- [Cloudflare 마이그레이션 가이드](./docs/cloudflare-migration.md)
