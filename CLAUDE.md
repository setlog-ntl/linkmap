# Linkmap Project Instructions

## CRITICAL RULES (절대 위반 금지)
- 기존 인증/RLS/암호화 코드를 제거하거나 약화시키지 마라
- `SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY`를 클라이언트에 노출하지 마라
- API 입력은 반드시 Zod `safeParse`로 검증 (`parse` 금지 — throw하면 500)
- 기존 에러 헬퍼(`src/lib/api/errors.ts`) 사용 필수 — 직접 에러 객체 만들지 마라
- API 라우트 첫 번째 단계: 반드시 `getUser()` → `if (!user) return unauthorizedError()`
- 민감 작업은 `logAudit()` 호출 필수 (`src/lib/audit.ts`)
- 기존 유틸리티가 있으면 새로 만들지 마라 — `src/lib/` 먼저 확인
- Rate Limiting은 Cloudflare Rules로 처리됨 — 앱 코드에 추가 금지

## Project Overview
- **Linkmap**: 프로젝트에 연결된 외부 서비스의 연결 정보를 시각화하고, API 키·환경변수를 안전하게 관리하는 설정 관리 플랫폼
- **Stack**: Next.js 16 (App Router) + Supabase + TypeScript + Tailwind CSS + shadcn/ui
- **Deploy**: Cloudflare Workers (`@opennextjs/cloudflare`)

## Key Decisions
- Korean-first UI, global expansion later
- AES-256-GCM encryption for env vars (key: 64 hex chars)
- React Flow (@xyflow/react) for service map visualization
- Supabase Auth with Google/GitHub OAuth
- TanStack Query (server state) + Zustand (client state)
- Zod v4 for API input validation
- next-themes for dark mode
- sonner for toast notifications (react-hot-toast 금지)
- lucide-react for icons (다른 아이콘 라이브러리 금지)

## Important Patterns
- **API 라우트 5단계**: Auth → Zod safeParse → 소유권 확인 → 비즈니스 로직 → 감사 로그
- Server components: `export const dynamic = 'force-dynamic'` (Supabase 서버 클라이언트 사용 시)
- Supabase 클라이언트 3종: Server(API/서버), Browser(클라이언트), Admin(감사 로그 전용)
- RLS + API 레벨 `user_id` 확인 (이중 방어)
- QueryKey factory: `src/lib/queries/keys.ts`
- Standardized errors: `src/lib/api/errors.ts`
- Audit logging: `src/lib/audit.ts` — `logAudit(userId, entry)`
- React Flow: `next/dynamic` + `ssr: false`
- i18n: Zustand locale-store + `t(locale, key)` 함수 (2인자 — useTranslation 훅 없음)
- 서비스 노드 export: `export default memo()` 패턴 (named export 아님)

## Build & Test Commands
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드 (--webpack 플래그 포함)
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run test         # Vitest 전체 실행
npm run test:coverage # 커버리지 리포트
```

## Known Gotchas
- `next build --webpack` 필수 — turbopack은 콜론 파일명 생성 → Windows NTFS 미지원
- Windows에서 `build:cf` 불가 — WSL 또는 GitHub Actions(Linux)에서만 빌드
- Next.js 16.1.6 "middleware deprecated" 경고 — 향후 "proxy" 컨벤션 마이그레이션 필요
- Sentry 제거됨 — 번들 사이즈 최적화 완료 (17MB → 8.5MB)
- lucide-react `Map` import 시 전역 `Map` 섀도잉 → `Map as MapIcon` 필수

## Anti-Patterns — NEVER Do These
- `createAdminClient()`를 일반 CRUD에 사용 (감사 로그 전용)
- `NEXT_PUBLIC_` 접두사로 서버 전용 키 노출
- `catch` 블록에서 에러 삼키기 (silent catch)
- `any` 타입 사용 (`unknown` + 타입 가드로 대체)
- 인증 로직 반전: `if (user) return unauthorizedError()` ← 치명적 버그
- 복호화된 값 로깅 또는 API 응답에 포함

## Testing Notes
- `mockResolvedValue` 사용 필수 (`Once` 금지 — React 리렌더링으로 실패)
- `beforeEach`에서 `clearAllMocks` 후 mock chain 재구성
- Cast mock: `vi.mocked(createClient).mockResolvedValue(mock as never)`
- Test order: 401 → 400 → 404 → 200 → audit

## File Structure
```
src/
├── app/
│   ├── (auth)/            # Login, signup, reset-password
│   ├── (dashboard)/       # Protected dashboard
│   ├── project/[id]/      # Project pages (overview, integrations, env, map, monitoring, settings)
│   ├── services/          # Service catalog
│   ├── pricing/           # Pricing page
│   ├── settings/          # User settings (tokens, connections)
│   └── api/               # 15 route groups:
│       ├── account/       #   GitHub connections (GET/PATCH/DELETE)
│       ├── admin/         #   Setup templates
│       ├── ai/            #   stack-recommend, env-doctor, map-narrate, compare-services, command
│       ├── connections/   #   User connections CRUD
│       ├── env/           #   Environment variables
│       ├── github/        #   OAuth, repos, secrets sync
│       ├── health-check/  #   Service health checks
│       ├── oauth/         #   OAuth callback
│       ├── oneclick/      #   One-click deploy
│       ├── projects/      #   Projects CRUD + layer-overrides, main-service
│       ├── seed/          #   DB seeding (admin only)
│       ├── service-accounts/ # Service account management
│       ├── stripe/        #   Billing
│       ├── teams/         #   Team members + invitations
│       └── tokens/        #   API tokens
├── components/
│   ├── ui/                # shadcn/ui (empty-state, confirm-dialog 포함)
│   ├── layout/            # Header, Footer
│   ├── project/           # Project tabs, cards
│   ├── service/           # Service catalog
│   ├── service-map/       # React Flow — 3-level view (Status/Map/Dependency)
│   ├── ai/                # AI feature panels
│   ├── dashboard/         # Onboarding checklist, action-needed
│   ├── oneclick/          # One-click deploy wizard + module editor
│   ├── github/            # Repo selector, secrets sync, connection info
│   ├── settings/          # Settings pages
│   ├── landing/           # Landing page sections
│   ├── env/               # Env data table
│   ├── icons/             # Custom icons
│   ├── guides/            # Guide components
│   ├── admin/             # Admin panels
│   └── my-sites/          # Deployed sites management
├── lib/
│   ├── api/               # Error helpers (errors.ts)
│   ├── ai/                # openai.ts, resolve-key.ts, guardrails.ts, providers.ts
│   ├── crypto/            # AES-256-GCM encryption
│   ├── github/            # 13 files: client, repos, secrets, pages, content, git-data, forks, token, permissions, auto-map, auto-sync, nacl-encrypt, api(barrel)
│   ├── hooks/             # use-streaming.ts
│   ├── i18n/              # ko.json, en.json, t() function
│   ├── oneclick/          # code-generator.ts, deploy-status.ts
│   ├── queries/           # 16 TanStack Query hooks (keys.ts = QueryKey factory)
│   ├── supabase/          # Client/Server/Admin/Middleware
│   ├── validations/       # Zod schemas
│   ├── connections/       # Connection helpers
│   ├── constants/         # App constants
│   ├── env/               # Env helpers
│   ├── health-check/      # Health check logic
│   ├── layout/            # Layout helpers
│   ├── mappers/           # Data mappers
│   └── utils/             # General utilities
│   # Root files: audit.ts, admin.ts, quota.ts, module-schema.ts, utils.ts, deploy-error-map.ts
├── stores/                # Zustand: ui-store, project-store, locale-store, service-map-store
├── types/                 # 8 domain files + barrel: core, service, project, env, ai, connection, service-account, dashboard
└── data/
    ├── seed/              # DB seed data
    ├── oneclick/          # One-click templates
    ├── templates/         # Site templates
    └── ui/                # UI constants

packages/
├── mcp-server/            # MCP server for Claude Code/Cursor
└── cli/                   # CLI tool for env management
```

## How to Find Info
| 찾는 것 | 위치 |
|---------|------|
| 아키텍처 개요 | `ARCHITECTURE.md` |
| 보안 정책 | `SECURITY.md` |
| DB 스키마/마이그레이션 | `supabase/migrations/` |
| Cloudflare 배포 가이드 | `docs/cloudflare-migration.md` |
| 서비스맵 V2 설계 | `docs/service-map-v2.md` |
| 대시보드 PMO | `docs/dashboard-pmo.md` |
| 모듈 에디터 기획 | `docs/onelink/08-modular-template-editor.md` |
| 모듈화 가이드 | `docs/instructions/` |
