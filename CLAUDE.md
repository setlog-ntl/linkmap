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
- i18n: Zustand locale-store + `t()` function

## Build & Test Commands
```bash
npm run dev          # 개발 서버
npm run build        # 프로덕션 빌드 (--webpack 플래그 포함)
npm run typecheck    # tsc --noEmit
npm run lint         # ESLint
npm run test         # Vitest 전체 실행
npm run test:watch   # Vitest 워치 모드
npm run test:coverage # 커버리지 리포트
```

## Known Gotchas
- `next build --webpack` 필수 — turbopack은 콜론 파일명 생성 → Windows NTFS 미지원
- Windows에서 `build:cf` 불가 — WSL 또는 GitHub Actions(Linux)에서만 빌드
- Next.js 16.1.6 "middleware deprecated" 경고 — 향후 "proxy" 컨벤션 마이그레이션 필요
- Sentry 제거됨 — 번들 사이즈 최적화 완료 (17MB → 8.5MB)

## Anti-Patterns — NEVER Do These
- `createAdminClient()`를 일반 CRUD에 사용 (감사 로그 전용)
- `NEXT_PUBLIC_` 접두사로 서버 전용 키 노출
- `catch` 블록에서 에러 삼키기 (silent catch)
- `any` 타입 사용 (`unknown` + 타입 가드로 대체)
- 인증 로직 반전: `if (user) return unauthorizedError()` ← 치명적 버그
- 복호화된 값 로깅 또는 API 응답에 포함
- `mockResolvedValueOnce` 사용 (React 리렌더링으로 실패 — `mockResolvedValue` 사용)

## How to Find Info
| 찾는 것 | 위치 |
|---------|------|
| 아키텍처 개요 | `ARCHITECTURE.md` |
| 보안 정책 | `SECURITY.md` |
| 기여 가이드 | `CONTRIBUTING.md` |
| DB 스키마/마이그레이션 | `supabase/migrations/` |
| Cursor AI 규칙 | `.cursor/rules/*.mdc` |
| Cloudflare 배포 가이드 | `docs/cloudflare-migration.md` |

## Testing Notes
- Mock chaining with Supabase: use `mockResolvedValue` (not `Once`) due to React re-renders
- Re-establish mock chains in `beforeEach` after `clearAllMocks`
- Cast mock: `vi.mocked(createClient).mockResolvedValue(mock as never)`
- Test order: 401 → 400 → 404 → 200 → audit

## File Structure
```
src/
├── app/              # Next.js App Router pages
│   ├── (auth)/       # Login, signup, reset-password
│   ├── (dashboard)/  # Protected dashboard
│   ├── project/[id]/ # Project pages (overview, services, env, map, settings)
│   ├── services/     # Service catalog
│   ├── pricing/      # Pricing page
│   ├── settings/     # User settings (tokens)
│   └── api/          # API routes (env, projects, teams, tokens, stripe, github)
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # Header, Footer
│   ├── project/      # Project-related components
│   ├── service/      # Service catalog components
│   ├── service-map/  # React Flow nodes and map
│   └── github/       # GitHub repo selector, secrets sync panel
├── lib/
│   ├── api/          # API error helpers
│   ├── crypto/       # AES-256-GCM encryption
│   ├── github/       # GitHub API helper, NaCl encrypt, auto-map, auto-sync
│   ├── i18n/         # Internationalization (ko, en)
│   ├── queries/      # TanStack Query hooks
│   ├── supabase/     # Supabase client/server/middleware
│   └── validations/  # Zod schemas
├── stores/           # Zustand stores (ui-store, project-store, locale-store)
├── types/            # TypeScript interfaces
└── data/             # Seed data, homepage templates x6

packages/
├── mcp-server/       # MCP server for Claude Code/Cursor
└── cli/              # CLI tool for env management
```

---

## Completion Summary (Task Report)

Every task completion MUST end with the following summary format:

---
### Task Summary

**Request:** (what the user asked for - 1~2 sentences)

**Completed:**
- (list of completed items as bullet points)

**Changed Files:**
- (list of modified/created/deleted files, if any)
---
