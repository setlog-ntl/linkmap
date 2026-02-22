# OneLink 원클릭 배포 고도화 — PMO 마스터 문서

> **프로젝트 코드**: ONELINK-ENH (OneLink Enhancement)
> **시작일**: 2026-02-18
> **상태**: ✅ Phase 1 완료 + 모듈 에디터 Phase 1~4 완료 + IA Redesign 완료
> **PMO 담당**: Claude Code AI Agent
> **최종 수정**: 2026-02-22

---

## 1. 프로젝트 차터 (Project Charter)

### 1.1 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **프로젝트명** | OneLink 원클릭 배포 고도화 |
| **코드명** | ONELINK-ENH |
| **성격** | 프로젝트 내 프로젝트 (Sub-Project) |
| **상위 프로젝트** | Linkmap 서비스 연결 & API 관리 플랫폼 |
| **목적** | 초보 사용자가 3분 만에 개인 홈페이지를 만들 수 있는 원클릭 배포 시스템을 GitHub Pages 정적 서비스 기반으로 고도화 |

### 1.2 핵심 가치 & 원칙

```
┌─────────────────────────────────────────────────────┐
│                    핵심 가치                          │
│                                                       │
│   ① 단순함 (Simplicity)                              │
│      → 초보자가 코드 없이 3분 만에 배포               │
│                                                       │
│   ② 코드 소유권 (Code Ownership)                     │
│      → 사용자 GitHub 레포에 코드 직접 생성            │
│                                                       │
│   ③ 무료 호스팅 (Free Hosting)                       │
│      → GitHub Pages 정적 호스팅 비용 제로             │
│                                                       │
│   ④ 연결성 (Connectivity)                            │
│      → 배포 후 Linkmap 대시보드와 서비스 연결 유지    │
│                                                       │
│   ⑤ AI 커스터마이징 (AI Customization)               │
│      → AI 채팅으로 사이트 코드 수정 가능              │
└─────────────────────────────────────────────────────┘
```

### 1.3 제약 조건

| 제약 | 설명 |
|------|------|
| **배포 타겟** | GitHub Pages 정적 사이트만 (서버 사이드 불가) |
| **프레임워크** | Next.js static export 또는 순수 HTML/CSS/JS |
| **비용** | 사용자에게 완전 무료 (GitHub Pages 무료 호스팅) |
| **기존 호환** | Phase 1 MVP 3개 템플릿 (link-in-bio-pro, digital-namecard, dev-showcase) 기존 동작 유지 |
| **기술 스택** | Next.js 16 App Router + Supabase + TanStack Query + Zustand |

### 1.4 성공 기준 (KPI)

| KPI | Post-Sprint 현재 | 목표 | 측정 방법 |
|-----|-------------------|------|----------|
| 배포 가능 템플릿 수 | 6/15 (콘텐츠 번들 생성) | 15/15 | homepage_template_content 번들 수 |
| 배포 소요 시간 | ~2분 | ~1분 | deploy-pages API 응답시간 |
| 레거시 코드 비율 | 0% (Sprint 1에서 제거) | 0% | 미사용 파일/코드 수 |
| Lighthouse 성능 점수 | 미측정 | 90+ | 템플릿별 Lighthouse 감사 |
| 사용자 에러 복구율 | 개선됨 (409/403/502 처리) | 90%+ | 에러 후 재배포 성공률 |

---

## 2. 현황 분석 (AS-IS)

### 2.1 시스템 현황

```
┌─────────────────────────── OneLink 시스템 현황 ───────────────────────────┐
│                                                                           │
│  [완료] ✅ GitHub Pages 배포 플로우 (3단계 위저드)                        │
│  [완료] ✅ Phase 1 MVP 템플릿 3개 (번들 콘텐츠 포함)                     │
│  [완료] ✅ 배포 상태 폴링 & 추적                                         │
│  [완료] ✅ 파일 편집기 & AI 채팅                                         │
│  [완료] ✅ OAuth 플로우 & 토큰 암호화                                    │
│  [완료] ✅ Rate Limiting (Cloudflare Rules) & 감사 로그                   │
│  [완료] ✅ My Sites 대시보드                                             │
│  [완료] ✅ 레거시 Vercel 코드 정리 (Sprint 1)                            │
│  [완료] ✅ AI 채팅 Rate Limiting (Cloudflare Rules)                      │
│  [완료] ✅ 파일 경로 보안 강화 (Sprint 2)                                │
│  [완료] ✅ 배치 파일 적용 최적화 (Sprint 6 batch-update)                 │
│  [완료] ✅ OAuth localStorage 전환 (Sprint 3)                            │
│                                                                           │
│  [완료] ✅ 모듈 에디터 Phase 1~4 완료 (6개 템플릿 지원)                  │
│    - 스키마 기반 동적 폼, 코드 제너레이터                                  │
│    - DnD 순서 변경, 프리셋, AI 추천                                       │
│    - 이미지 업로드, 폰트 선택기                                           │
│  [완료] ✅ IA Redesign — /oneclick+/my-sites → /sites 통합               │
│  [완료] ✅ 배포 가능 템플릿 3→6개 확장                                   │
│    - personal-brand, freelancer-page, small-biz 추가                      │
│  [완료] ✅ 배포 진행 모달 UX (토스트→단계별 모달)                         │
│  [완료] ✅ 인증/GitHub 연결 모달 UX                                      │
│  [완료] ✅ preflight API (배포 사전 검사)                                 │
│                                                                           │
│  [미완] ⬜ 나머지 9개 템플릿 콘텐츠 번들                                 │
│  [미완] ⬜ 프리뷰 이미지 시스템                                          │
│  [미완] ⬜ 커스텀 도메인 지원                                            │
│                                                                           │
│  [이슈] ⚠️ DB 시드 / TS 시드 슬러그 불일치 → ✅ migration 023 해결     │
│  [이슈] ⚠️ 번들 파일 비대 → ✅ getTemplateBySlug() Map 방식 해결       │
│  [이슈] ⚠️ Zustand store 중복 → ✅ N/A (파일 미존재 확인)              │
│  [이슈] ⚠️ sessionStorage OAuth 취약 → ✅ localStorage+TTL 해결        │
│  [이슈] ⚠️ 레거시 Vercel API 잔존 → ✅ Sprint 1 삭제                   │
└───────────────────────────────────────────────────────────────────────────┘
```

### 2.2 코드 현황 수치

| 카테고리 | 파일 수 | 비고 |
|----------|---------|------|
| 페이지 | 3 | /sites (탭: new/manage), /sites/[id]/edit, 레거시 리다이렉트 2개 |
| 컴포넌트 | 18 | oneclick(11) + my-sites(7) |
| API 라우트 | 13 활성 | deploy, preflight, status, templates, upload, batch-update 등 |
| TanStack Query 훅 | 9 | 레거시 2개 삭제 완료 |
| Zod 스키마 | 3 | 레거시 2개 삭제 완료 |
| 번들 템플릿 | 6개 배포 가능 | link-in-bio-pro, digital-namecard, dev-showcase, personal-brand, freelancer-page, small-biz |
| 모듈 스키마/프리셋 | 6개 + 6개 | 각 배포 가능 템플릿별 |
| DB 마이그레이션 | 3 관련 | 014, 016, 022 |

---

## 3. 고도화 스프린트 계획

### Phase 1 개요 (Sprint 1-7, 완료)

```
┌──────────────────────────────────────────────────────────┐
│           OneLink 고도화 Phase 1 — 7-Sprint (✅ 완료)     │
│                                                          │
│  Sprint 1 ─── 기반 정리 (레거시 제거, 네이밍)     ✅     │
│      │                                                    │
│  Sprint 2 ─── 보안/안정성 (Rate Limit, 파일 보안)  ✅     │
│      │                                                    │
│  Sprint 3 ─── UX 강화 (프리뷰, 에러복구, OAuth)   ✅     │
│      │                                                    │
│  Sprint 4 ─── 위저드 단순화 (초보자 핵심 경험)     ✅     │
│      │                                                    │
│  Sprint 5 ─── 템플릿 구조 고도화 (번들 분리)       ✅     │
│      │                                                    │
│  Sprint 6 ─── 편집기/AI 강화 (배치 최적화)         ✅     │
│      │                                                    │
│  Sprint 7 ─── 플랫폼 연결성 (대시보드 연계)        ✅     │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Phase 1 스프린트별 상세

| Sprint | 이름 | 범위 | 상태 | 산출물 |
|--------|------|------|------|--------|
| 1 | 기반 정리 | 레거시 코드 제거, 네이밍 통일, 시드 데이터 정리 | ✅ 완료 | 이전 세션에서 정리 완료 |
| 2 | 보안/안정성 | AI 채팅 rate limit, 파일 경로 보안, 토큰 갱신 | ✅ 완료 | 이전 세션에서 구현 완료 |
| 3 | UX 강화 | OAuth localStorage 전환, GitHub 인라인 상태, 프리뷰 | ✅ 완료 | wizard + template-picker 개선 |
| 4 | 위저드 단순화 | GitHub 상태 인라인 표시, URL 미리보기 | ✅ 완료 | Sprint 3에 통합 구현 |
| 5 | 템플릿 구조 | 동적 로더 함수, getTemplateBySlug() 추가 | ✅ 완료 | deploy-pages API 최적화 |
| 6 | 편집기/AI | 배치 커밋 API, AI 프롬프트 확장, 반응형 미리보기 | ✅ 완료 | batch-update API, 뷰포트 토글, 9개 프롬프트 |
| 7 | 플랫폼 연결 | My Sites ↔ Linkmap 프로젝트 연결, 배포 현황 위젯 | ✅ 완료 | 관리 버튼, 4-stat 대시보드 |

### Phase 2 로드맵 (Sprint 8-12, 계획)

```
┌──────────────────────────────────────────────────────────┐
│           OneLink 고도화 Phase 2 — 5-Sprint (계획)        │
│                                                          │
│  Sprint 8  ─── Connections 완성 (테스트, i18n, auth)     │
│      │                                                    │
│  Sprint 9  ─── 템플릿 Phase 2 (4개 콘텐츠 번들)         │
│      │                                                    │
│  Sprint 10 ─── 템플릿 Phase 3 (4개 콘텐츠 번들)         │
│      │                                                    │
│  Sprint 11 ─── 템플릿 Phase 4 (4개 콘텐츠 번들)         │
│      │                                                    │
│  Sprint 12 ─── 프리뷰 & 품질 (이미지, 감사, E2E)  ←─┐   │
│                                         (9-11 완료 후)    │
└──────────────────────────────────────────────────────────┘
```

| Sprint | 이름 | 범위 | 상태 | 의존성 |
|--------|------|------|------|--------|
| 8 | Connections 완성 | 테스트 커버리지, i18n 완성, 서버 auth 적용, API 문서화 | 계획 | — |
| 9 | 템플릿 Phase 2 | 4개 콘텐츠 번들 (small-biz, product-landing, qr-menu-pro, resume-site) | 계획 | — |
| 10 | 템플릿 Phase 3 | 4개 콘텐츠 번들 (personal-brand, freelancer-page, saas-landing, newsletter-landing) | 계획 | Sprint 9 |
| 11 | 템플릿 Phase 4 | 4개 콘텐츠 번들 (event-page, community-hub, study-recruit, nonprofit-page) | 계획 | Sprint 10 |
| 12 | 프리뷰 & 품질 | 프리뷰 이미지 생성, Lighthouse 감사, E2E 테스트 | 계획 | Sprint 9-11 |

---

## 4. 리스크 레지스터

| ID | 리스크 | 영향도 | 발생 가능성 | 대응 전략 |
|----|--------|--------|-------------|-----------|
| R1 | 레거시 제거 시 기존 배포 데이터 깨짐 | 높음 | 낮음 | DB 마이그레이션 시 기존 데이터 보존 보장 |
| R2 | 번들 파일 분리 시 배포 플로우 장애 | 높음 | 중간 | 분리 전 테스트 환경에서 E2E 검증 |
| R3 | GitHub Pages API 변경 | 중간 | 낮음 | GitHub API 버전 모니터링, 폴백 처리 |
| R4 | AI 채팅 API 비용 폭증 | 높음 | 중간 | Rate limiting + 일일 쿼터 설정 |
| R5 | 템플릿 빌드 실패 (GitHub Actions) | 중간 | 중간 | 빌드 실패 감지 + 사용자 안내 개선 |
| R6 | Connections 테스트 미비 상태 출시 위험 | 높음 | 높음 | Sprint 8에서 테스트 커버리지 확보 후 출시 |
| R7 | SVG 오버레이 다수 연결 시 성능 이슈 | 중간 | 중간 | 가상화/뷰포트 컬링 적용, 연결 수 상한 설정 |
| R8 | Connections 페이지 서버 auth 미적용 | 높음 | 높음 | Sprint 8에서 서버 컴포넌트 인증 체크 추가 |
| R9 | 12개 템플릿 콘텐츠 부재로 사용자 배포 실패 | 중간 | 높음 | Sprint 9-11에서 순차 콘텐츠 번들 생성 |

---

## 5. 의사결정 로그

| 날짜 | 결정 | 근거 | 영향 |
|------|------|------|------|
| 2026-02-18 | GitHub Pages 정적 서비스 전용으로 확정 | 무료 + 단순함, 초보자 타겟 | 서버 사이드 기능 제외 |
| 2026-02-18 | 7-Sprint 점진적 고도화 채택 | 기존 동작 유지하며 개선, 리스크 최소화 | 단계적 배포 |
| 2026-02-18 | 레거시 Vercel 코드 완전 제거 결정 | 현재 미사용, 코드 복잡도 증가 원인 | API 3개, 훅 2개, 스키마 2개 삭제 |
| 2026-02-18 | 네이밍은 `oneclick` 유지 | URL/파일/변수명 대량 변경 리스크, 브랜딩은 UI에서만 OneLink 표시 | 코드 안정성 우선 |
| 2026-02-18 | 번들 파일 개별 분리 (1파일→템플릿별 파일) | 27,000+ 토큰 단일 파일 유지보수 불가 | 템플릿 추가 용이 |
| 2026-02-18 | 배치 커밋에 pushFilesAtomically 재활용 | Git Data API 기반 원자적 커밋, 기존 코드 재사용 | N개 파일 = 1 커밋 |
| 2026-02-18 | GitHub Pages 별도 서비스 미등록 | GitHub 서비스가 이미 Pages 포함, 중복 회피 | project_services에 github만 연결 |
| 2026-02-18 | Rate limiting → Cloudflare Rules로 대체 | Cloudflare Workers 마이그레이션으로 인메모리 rate limit 불필요 | `lib/rate-limit.ts` 삭제, 인프라 레벨 처리 |
| 2026-02-18 | Sentry 제거 (번들 최적화) | 번들 17MB → 8.5MB 감소, Cloudflare Workers 배포 사이즈 최적화 | `@sentry/nextjs` 의존성 제거 |
| 2026-02-18 | 템플릿 디렉토리 분리 → getTemplateBySlug() Map 방식 | 디렉토리 분리 미구현, Map 기반 O(1) 조회로 성능 문제 해결 | Phase 2 재검토 |
| 2026-02-18 | Connections SVG 오버레이 방식 채택 | DOM 기반 측정 + Bezier 곡선, React Flow 대비 경량 | 서비스 간 연결을 시각적으로 표현 |

---

## 6. 세션 로그 (Session Log)

> 이 섹션은 각 작업 세션의 진행 상황을 기록하여 컨텍스트 연속성을 보장합니다.

### Session #1 — 2026-02-18 (프로젝트 킥오프)

**수행 작업:**
1. OneLink 문서 6개 전체 분석 (`docs/onelink/README.md` ~ `06-template-reselection-plan.md`)
2. 기존 ONECLICK_DEPLOY.md (레거시) 분석
3. 코드베이스 탐색 (28개 파일, API 11개, 컴포넌트 10개)
4. 현황 진단 완료:
   - Phase 1 MVP 3개 템플릿 완전 동작 확인
   - Phase 2-4 템플릿 12개 DB seed만 완료, 콘텐츠 미생성
   - 레거시 Vercel 코드 잔존 확인
5. PMO 마스터 문서 생성 (`docs/onelink/PMO.md`)
6. 7-Sprint 고도화 기획문서 생성 (`docs/onelink/07-enhancement-plan.md`)

**다음 세션 진행 사항:**
- Session #2에서 Sprint 1-7 전체 완료

**컨텍스트 유지 정보:**
- 기존 3개 템플릿 동작 확인됨: `link-in-bio-pro`, `digital-namecard`, `dev-showcase`
- `homepage-template-content.ts`에 3개 템플릿 번들 (19파일씩)
- `dev-showcase-template.ts`는 별도 파일로 분리됨
- oneclick-store.ts는 존재하지 않음 (wizard-client.tsx 로컬 state 사용)
- Migration 016 = Pages 지원, 022 = cleanup, 023 = template rebuild

### Session #2 — 2026-02-18 (고도화 실행 완료)

**수행 작업:**
1. Session #1 컨텍스트 이어받기 (PMO.md 기반)
2. Sprint 1-2 사전 완료 확인 (이전 세션에서 레거시 제거, 보안 강화 완료)
3. Sprint 3-5 코드 구현 확인 & 문서 반영
4. **Sprint 6 구현:**
   - `POST /api/oneclick/deployments/[id]/batch-update` API 신규 생성
   - `pushFilesAtomically()` 재활용 → N파일 = 1 원자적 커밋
   - `useBatchApplyFiles` 훅 리팩토링 (순차 PUT → 배치 API)
   - 미리보기 반응형 뷰포트 토글 (375px/768px/Full)
   - AI 프롬프트 템플릿 6→9개 확장 (다크모드, 애니메이션, SEO)
   - 대화 초기화 버튼 추가
5. **Sprint 7 구현:**
   - My Sites 카드에 "관리" 버튼 → `/project/{id}` 연결
   - 배포 현황 요약 위젯 (전체/활성/오류/마지막배포 4-stat)
6. **문서 보완:**
   - `02-api-reference.md` — 레거시 엔드포인트 삭제 반영, AI 채팅 rate limit 수정
   - `03-data-models.md` — 레거시 Zod 스키마 제거, getTemplateBySlug() 문서화
   - `04-user-flows.md` — localStorage 전환 반영, OAuth 상태 보존 해결됨 표시
   - `07-enhancement-plan.md` — 전 스프린트 상태 ✅ 완료로 업데이트
7. TypeScript 타입 체크 통과 확인

**산출물:**
- 신규 파일 1개: `batch-update/route.ts`
- 수정 파일 8개: `oneclick.ts`, `site-editor-client.tsx`, `chat-terminal.tsx`, `deploy-site-card.tsx`, `my-sites-client.tsx`, `audit.ts`, `02-api-reference.md`, `03-data-models.md`, `04-user-flows.md`, `07-enhancement-plan.md`, `PMO.md`

**프로젝트 상태: Phase 1 (7-Sprint) 전체 완료**

### Session #3 — 2026-02-18 (Connections 기능 개발 & 문서 현행화)

**수행 작업:**
1. **Connections 시각화 기능 개발** (미커밋 상태):
   - SVG 오버레이 기반 서비스 간 연결 시각화 (Bezier 곡선, 상태별 색상)
   - 연결 CRUD API (POST/PATCH/DELETE `/api/connections`)
   - 자동 연결 추천 API (`/api/connections/auto`)
   - 프로젝트별 레이어 오버라이드 (`/api/projects/[id]/layer-override`)
   - 대시보드 연결 토글 & 편집 팝오버
   - TanStack Query 훅 6개 (optimistic update 포함)
   - 카드 위치 측정 훅 (`useCardPositions`)
   - 온보딩 빈 화면 UX
   - i18n 47개 키 추가 (ko/en)
2. **DB Migration 준비:**
   - `028_connections_enhancement.sql` — user_connections 확장 (status, description, metadata)
   - `029_service_layer_overrides.sql` — project_service_overrides 테이블 신규
3. **PMO 문서 전체 현행화** (8건 불일치 해결)
4. **Phase 2 로드맵 수립** (Sprint 8-12)

**수정 파일 (7개):**
- `src/app/api/connections/[id]/route.ts`
- `src/app/api/connections/route.ts`
- `src/app/api/projects/[id]/dashboard/route.ts`
- `src/components/dashboard/compact-card.tsx`
- `src/components/dashboard/dashboard-layout.tsx`
- `src/stores/dashboard-store.ts`
- `src/lib/queries/connections.ts`

**신규 파일 (7개):**
- `src/app/api/connections/auto/route.ts`
- `src/app/api/projects/[id]/layer-override/route.ts`
- `src/components/dashboard/connection-overlay.tsx`
- `src/components/dashboard/connection-popover.tsx`
- `src/components/dashboard/hooks/use-card-positions.ts`
- `src/lib/connections/auto-connect.ts`
- `supabase/migrations/029_service_layer_overrides.sql`

**잔여 작업 (Sprint 8 대상):**
- Connections 테스트 커버리지 확보
- Connections i18n 완성 검증
- Connections 페이지 서버 auth 적용
- Connections API 문서화

### Session #4 — 2026-02-20 (모듈 에디터 Phase 1~4 구현)

**수행 작업:**
1. **모듈 에디터 Phase 1**: 스키마 타입, Personal Brand 모듈 스키마, config.ts/page.tsx 코드 제너레이터, 동적 폼 렌더러, 모듈 패널, 에디터 통합
2. **모듈 에디터 Phase 2**: 컴포넌트 수준 편집 (그래디언트 색상, 컬럼 수, globals.css 테마)
3. **모듈 에디터 Phase 3**: DnD Kit 통합, 3개 프리셋 (미니멀/크리에이터/풀), dev-showcase + link-in-bio-pro 스키마 추가
4. **모듈 에디터 Phase 4**: 이미지 업로드 API, 폰트 선택기, AI 모듈 추천
5. **문서**: `08-modular-template-editor.md` 생성 및 Phase별 구현 결과 기록

### Session #5 — 2026-02-22 (IA Redesign + 추가 템플릿)

**수행 작업:**
1. **IA Redesign**: `/oneclick` + `/my-sites` → `/sites` 통합 (탭: new/manage)
2. **모달 UX**: 인증/GitHub 연결/배포 진행을 모달 방식으로 변경
3. **추가 템플릿**: personal-brand, freelancer-page, small-biz 번들 + 모듈 스키마 + 프리셋 추가
4. **preflight API**: 배포 사전 검사 (계정+쿼터+사이트명 중복) 신규 엔드포인트
5. **deploy API 통합**: `deploy-pages` → `deploy`로 통합 (하위 호환 리다이렉트)

### Session #6 — 2026-02-22 (문서 현행화)

**수행 작업:**
1. `docs/onelink/` 전체 문서 9개 현행화
2. IA Redesign 반영 (/sites 통합, 레거시 리다이렉트)
3. 모듈 에디터 Phase 1~4 완료 반영
4. API 라우트 13개, 컴포넌트 18개, 템플릿 6개 수치 갱신
5. 모달 UX (auth-modal, github-connect-modal, deploy-progress) 반영
6. deploy → deploy-pages 하위 호환, preflight/upload API 추가 반영

---

## 7. 문서 인덱스

| 문서 | 경로 | 설명 | 상태 |
|------|------|------|------|
| PMO 마스터 | `docs/onelink/PMO.md` | 이 문서. 프로젝트 관리 허브 | 활성 |
| 고도화 기획 | `docs/onelink/07-enhancement-plan.md` | Phase 1 (7-Sprint) + Phase 2 (5-Sprint) 상세 기획 | 활성 |
| 현황 분석 | `docs/onelink/README.md` | 기존 시스템 분석 | 현행화 완료 |
| 아키텍처 | `docs/onelink/01-architecture.md` | 파일 구조 & 아키텍처 | 현행화 완료 |
| API 레퍼런스 | `docs/onelink/02-api-reference.md` | API 엔드포인트 상세 | 현행화 완료 |
| 데이터 모델 | `docs/onelink/03-data-models.md` | DB 스키마 | 현행화 완료 |
| 사용자 플로우 | `docs/onelink/04-user-flows.md` | 위저드 & 상태 머신 | 현행화 완료 |
| 이슈/리팩토링 | `docs/onelink/05-issues-and-refactor-plan.md` | 문제점 & 해결 상태 추적 | 현행화 완료 |
| 템플릿 재정비 | `docs/onelink/06-template-reselection-plan.md` | 템플릿 계획 | 현행화 완료 |
| 템플릿 마스터 | `docs/템플릿기획/템플릿기획.md` | 15개 템플릿 마스터 기획 | 완료 |
| 모듈형 에디터 | `docs/onelink/08-modular-template-editor.md` | 모듈 단위 비주얼 편집 기능 기획 | 기획 검토 중 |

---

## 8. 변경 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|----------|
| 2026-02-18 | v1.0 | PMO 문서 초기 생성. 프로젝트 차터, 현황 분석, 7-Sprint 계획, 리스크 레지스터 |
| 2026-02-18 | v2.0 | 7-Sprint 전체 완료. Sprint 6(편집기/AI) + Sprint 7(플랫폼 연결) 구현. 문서 전체 보완 완료 |
| 2026-02-18 | v3.0 | 문서 전체 현행화. 8건 불일치 해결, AS-IS 갱신, KPI 현행화, Phase 2 로드맵(Sprint 8-12), Connections 기능 Session #3, 리스크 R6-R9 추가, 의사결정 4건 추가 |
| 2026-02-20 | v3.1 | 모듈형 템플릿 에디터 기획 문서 추가 (08-modular-template-editor.md). Personal Brand 파일럿 기준 6개 콘텐츠 모듈 + 2개 레이아웃 모듈 정의, 4-Phase 구현 로드맵 |
| 2026-02-20 | v4.0 | 모듈 에디터 Phase 1~4 전체 구현 완료. 6개 템플릿 모듈 스키마/프리셋, DnD, 이미지 업로드, AI 추천, 폰트 선택기 |
| 2026-02-22 | v5.0 | IA Redesign 반영. /oneclick+/my-sites→/sites 통합, 모달 UX(인증/GitHub/배포 진행), preflight/upload API, deploy API 통합, 템플릿 3→6개. 문서 전체 현행화 |
