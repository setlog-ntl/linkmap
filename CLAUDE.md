# Linkmap Project Instructions

## CRITICAL RULES (절대 위반 금지)
- 인증/RLS/암호화 코드 제거·약화 금지
- `SUPABASE_SERVICE_ROLE_KEY`, `ENCRYPTION_KEY` 클라이언트 노출 금지
- `NEXT_PUBLIC_` 접두사로 서버 전용 키 노출 금지
- API 입력: Zod `safeParse` 필수 (`parse` 금지 — throw→500)
- API 라우트 5단계: `getUser()` → Zod safeParse → 소유권 확인 → 비즈니스 로직 → `logAudit()`
- 에러: `src/lib/api/errors.ts` 헬퍼 사용 (직접 생성 금지)
- 감사 로그: 민감 작업 시 `logAudit()` 필수 (`src/lib/audit.ts`)
- `createAdminClient()` = 감사 로그 전용 (일반 CRUD 금지)
- 기존 유틸 있으면 재사용 — `src/lib/` 먼저 확인
- Rate Limiting: Cloudflare Rules (앱 코드 추가 금지)
- 인증 로직 반전 주의: `if (!user)` return error (NOT `if (user)`)
- 복호화된 값 로깅·API 응답 포함 금지
- `catch` 블록 silent catch 금지

## Project Overview
- **Linkmap**: 외부 서비스 연결 시각화 + API 키·환경변수 관리 플랫폼
- **Stack**: Next.js 16 (App Router) + Supabase + TypeScript + Tailwind + shadcn/ui
- **Deploy**: Cloudflare Workers (`@opennextjs/cloudflare`)

## Key Decisions
- Korean-first UI (i18n 동결: 한글 직접 사용, ko.json/en.json 업데이트 금지)
- AES-256-GCM encryption (key: 64 hex chars)
- React Flow (`@xyflow/react`) — `next/dynamic` + `ssr: false`
- Supabase Auth (Google/GitHub OAuth)
- TanStack Query + Zustand | Zod v4 | next-themes | sonner (react-hot-toast 금지) | lucide-react (타 아이콘 금지)
- 디자인: Circuit Blue-Green v2, `brand-blue/green` 토큰, `bg-card shadow-sm` (글래스모피즘 금지, 헤더만 예외)
- 폰트: Pretendard Variable (CDN) + Geist Mono
- 결제: 3종 — Stripe(해외 카드) / Polar(MoR) / Toss(국내). API: `src/app/api/{stripe,polar,toss}`
- MFA: TOTP 2FA 지원 (migration 096, `src/components/mfa/`)

## Content Objectivity (블로그/비교 콘텐츠 객관성)
- 비교분석 콘텐츠는 편향 없이 객관적 데이터 기반으로 작성
- 자사 서비스(Linkmap)도 장단점을 공정하게 기술 — 자사 우대 금지
- 특정 LLM/AI 도구 편향 금지 — GPT, Claude, Gemini 등 모든 주요 모델을 동등하게 다룸
- 가격·기능·성능 데이터는 공식 소스 기준, `lastUpdated` 일자 표기 필수
- verdict(결론)는 "상황별 추천" 형태로 작성 (단일 추천 금지)
- 비교 데이터: `src/data/blog/service-comparisons.ts` — 신규 도구 출시 시 업데이트 필수

## Patterns
- Supabase 클라이언트 3종: Server(API) / Browser(클라) / Admin(감사 로그 전용)
- RLS + API 레벨 `user_id` 이중 방어
- Server components: `export const dynamic = 'force-dynamic'`
- 서비스 노드: `export default memo()` (named export 아님)
- QueryKey factory: `src/lib/queries/keys.ts`
- i18n: Zustand locale-store + `t(locale, key)` 2인자

### Workers-Safe Page Checklist (새 페이지 추가 시)
1. `revalidate = false` 기본 (동적 데이터 필요 시만 ISR)
2. `force-dynamic` → 인증 필수 페이지만
3. `<Link prefetch={false}>` 필수 (ESLint 자동 검출)
4. 서버 컴포넌트에서 대형 라이브러리 import 금지
5. 공개 페이지 → `scripts/warm-cache.sh`에 경로 추가

## Build Commands
```bash
npm run dev / build / typecheck / lint / test / test:coverage
```

## Known Gotchas
- `next build --webpack` 필수 (turbopack → 콜론 파일명 → Windows NTFS 불가)
- `build:cf`는 WSL/Linux에서만 가능
- lucide-react `Map` → `Map as MapIcon` (전역 Map 섀도잉)
- Sentry/Logger 제거됨 (Workers 호환 문제)
- **Link prefetch={false} 필수**: 모든 `<Link>` 컴포넌트에 `prefetch={false}` 적용 — Workers Free Plan에서 자동 prefetch가 RSC 동시 요청 폭발→503 유발 (`docs/workers-503-prefetch-resolution.md` 참조). ESLint `linkmap/no-link-prefetch` 규칙으로 자동 검출
- **원클릭 템플릿 패키지 버전**: `shared-template-files.ts`와 하드코딩 package.json의 버전은 반드시 npm 레지스트리에 실제 존재하는 정식 릴리스여야 함 (캐럿`^` 금지, `-dev`/`-rc` 금지). 변경 시 `npm view <pkg>@<ver> version`으로 검증 필수
- **Workers CPU limits 필수 설정**: `wrangler.jsonc`에 `"limits": { "cpu_ms": 30000 }` 명시 필수. 미설정 시 Paid Plan에서도 Free 수준(10ms)이 적용되어 1102 에러 발생. 공개 페이지는 `revalidate = false` 기본, 동적 데이터 필수인 경우만 ISR, `force-dynamic`은 인증 페이지만 허용
- **배포 후 캐시 워밍업 필수**: CI 자동 실행. 수동 배포 시 `npm run deploy:workers` (wrangler deploy + warm-cache 원샷 실행)
- **서버 번들 대형 라이브러리 금지**: dynamic import + ssr:false 또는 optimizePackageImports

## MCP Supabase 사용 규칙
- DB 마이그레이션(`apply_migration`), SQL 실행(`execute_sql`), 스키마 조회 등 **Supabase MCP 툴이 필요한 시점**에는 즉시 실행하지 말고 먼저 아래 메시지로 확인을 요청할 것:
  > "Supabase MCP 연결이 필요합니다. `/mcp` 명령으로 연결 후 진행해주세요."
- 사용자가 연결을 확인한 뒤에만 MCP 툴 호출
- 단, 사용자가 대화 중 명시적으로 "MCP 연결됨" 또는 직접 MCP 관련 작업을 요청한 경우에는 바로 실행해도 됨

## Database Rules
- 스키마: `docs/db-schema.md` | 마이그레이션: `supabase/migrations/NNN_*.sql` (현재 108)
- **마이그레이션 작성 ≠ 라이브 반영**: 보안 마이그레이션은 적용 후 `get_advisors(security)`로 실제 반영을 검증할 것 (M102가 1개월간 미적용 방치된 이력)
- **함수 권한은 `FROM PUBLIC` 회수 필수**: 함수는 생성 시 EXECUTE가 PUBLIC에 기본 부여되므로 `REVOKE ... FROM anon, authenticated`만으로는 회수되지 않는다. 검증은 `has_function_privilege('anon', oid, 'EXECUTE')`로. 신규 RPC는 `GRANT EXECUTE ... TO` 명시 필요 (M108의 default privileges 설정)
- **마이그레이션 후 3-step**: ① `src/types/` 동기화 → ② `src/lib/queries/` 반영 → ③ `docs/db-schema.md` 업데이트
- 새 테이블: RLS + 정책 + created_at 필수
- 타입 매핑: core(profiles/subscriptions/tokens), service(services/catalog), project(projects/bindings), env(env_vars/health), connection(user_connections), service-account, credential, feedback, team, ai(ai_*), dashboard(view models)
- DB CHECK 변경 → TS union type 동기화 필수
- 기존 마이그레이션 수정 금지 (새 파일로 ALTER) — 번호 중복 주의: 042/043/072/073 (×2)

## Testing
- `mockResolvedValue` 필수 (`Once` 금지 — 리렌더링 실패)
- `beforeEach`: `clearAllMocks` 후 mock chain 재구성
- Cast: `vi.mocked(createClient).mockResolvedValue(mock as never)`
- 순서: 401 → 400 → 404 → 200 → audit

## File Structure (축약)
```
src/app/          — (auth), (dashboard), project/[id]/, services/, pricing/, settings/, admin/, blog/, demo/,
                    guides/, glossary/, faq/, feedback/, my-sites/, oneclick/, shared/, showcase/ + SEO(sitemap/robots/feed/llms.txt)
src/app/api/      — 31 groups: account, admin, ai, auth, bot-log, connections, credentials, demo, env, exchange-rate,
                    feedback, github, health-check, indexnow, mcp, oauth, oneclick, polar, projects, seed,
                    service-accounts, services, shared, showcase, stripe, teams, tokens, toss, track, trash
src/components/   — ui/, layout/, project/, service/, service-map/, ai/, dashboard/, oneclick/, github/, settings/,
                    landing/, env/, icons/, guides/, admin/, my-sites/, blog/, credentials/, demo/, feedback/,
                    mfa/, seo/, showcase/, tracking/ + command-palette/error-boundary/theme-toggle/providers
src/lib/          — api/, ai/, openai/, crypto/, email/, github/(13files), hooks/, i18n/, oneclick/, queries/(29hooks),
                    supabase/, validations/, connections/, constants/, env/, health-check/, layout/, mappers/, seo/, utils/
                    root: audit.ts, admin.ts, quota.ts, module-schema.ts, utils.ts, env.ts, deploy-error-map.ts
src/stores/       — ui-store, project-store, locale-store, service-map-store, ai-chat-store, dashboard-store, service-detail-store
src/types/        — 11 domain files (ai, connection, core, credential, dashboard, env, feedback, project, service, service-account, team) + barrel
src/data/         — seed/, oneclick/, templates/, blog/, demo/, landing/, seo/, ui/ + service-connections.ts, hero-flow-config.ts
packages/         — mcp-server/, cli/
```

## Prompt Log (작업 로그)
- P0/P1 작업 완료 시 `docs/log/YYYY-MM.md`에 엔트리 추가 (포맷: `docs/log/README.md` 참조)
- P2(단순 버그/타이포), 커밋 메시지로 충분한 작업은 기록 불필요
- 월별 파일 없으면 새로 생성 (예: `2026-05.md`)
- 전략적 전환점은 `docs/log/milestone.md`에도 추가

## Reference Docs
| 찾는 것 | 위치 |
|---------|------|
| 아키텍처 | `ARCHITECTURE.md` |
| 보안 정책 | `SECURITY.md` |
| DB 스키마 | `docs/db-schema.md` |
| 서비스맵 V2 | `docs/service-map-v2.md` |
| AI 모듈 맵 | `docs/ai-module-map.md` |
| 모듈 에디터 | `docs/onelink/08-modular-template-editor.md` |
| 용어사전(추가법·모바일 규칙) | `docs/glossary-system.md` |
