# OneLink 원클릭 배포 고도화 — 7-Sprint 상세 기획

> **PMO 문서**: [PMO.md](./PMO.md)
> **상위 문서**: [README.md](./README.md)
> **작성일**: 2026-02-18 → **최종 수정일**: 2026-02-22
> **상태**: ✅ Phase 1 완료 (Sprint 1-7) + 모듈 에디터 Phase 1~4 완료 + IA Redesign 완료

---

## 설계 원칙

```
1. 초보자 우선 (Beginner First)
   → 모든 UX 결정은 "처음 쓰는 사용자"가 기준
   → 3분 내 배포 완료가 목표

2. 점진적 강화 (Progressive Enhancement)
   → 기존 동작을 깨지 않으며 개선
   → 각 스프린트는 독립적으로 배포 가능

3. 정적 서비스 최적화 (Static-First)
   → GitHub Pages 정적 호스팅에 최적화
   → 서버 사이드 의존성 제거

4. 연결성 유지 (Stay Connected)
   → 배포된 사이트 → Linkmap 대시보드 연계
   → 서비스 맵, 환경변수, 감사 로그 연동
```

---

## Sprint 1: 기반 정리 (Foundation Cleanup)

> **목표**: 레거시 코드 제거, 코드베이스 정리, 안정적 기반 확보
> **상태**: ✅ 완료 (이전 세션에서 실행)

### 1.1 레거시 Vercel 코드 제거

**삭제 대상:**

| 카테고리 | 파일/코드 | 조치 |
|----------|----------|------|
| API 라우트 | `src/app/api/oneclick/fork/route.ts` | 파일 삭제 |
| API 라우트 | `src/app/api/oneclick/deploy/route.ts` | 파일 삭제 |
| TanStack Query | `useForkTemplate()` in `queries/oneclick.ts` | 함수 + 타입 삭제 |
| TanStack Query | `useDeployToVercel()` in `queries/oneclick.ts` | 함수 + 타입 삭제 |
| Zod 스키마 | `forkRequestSchema` in `validations/oneclick.ts` | 스키마 삭제 |
| Zod 스키마 | `deployRequestSchema` in `validations/oneclick.ts` | 스키마 삭제 |
| Status route | Vercel 상태 분기 코드 | 분기 제거 |

**확인 사항:**
- [ ] 삭제 후 `npm run build` 성공
- [ ] 삭제 후 `npm run typecheck` 성공
- [ ] 기존 GitHub Pages 배포 플로우 정상 동작

### 1.2 시드 데이터 정리

**현재 문제:**
- DB 시드 (migration 016): `portfolio-static`, `landing-static` 등 (구 슬러그)
- TS 시드 (`homepage-templates.ts`): `link-in-bio-pro`, `digital-namecard` 등 (신 슬러그)
- Migration 023에서 정리 수행되었으나, 구 DB 시드 INSERT문은 migration에 잔존

**조치:**
- migration 016의 구 시드는 이미 023에서 비활성화됨 → 추가 조치 불필요
- `homepage-template-content/index.ts` (구 정적 템플릿) 사용 여부 확인 후 정리
- TS 시드와 번들 콘텐츠 간 slug 일치 확인

### 1.3 네이밍 정리

**결정: 코드는 `oneclick` 유지, UI/브랜딩만 OneLink 표시**

| 영역 | 현재 | 유지/변경 | 근거 |
|------|------|----------|------|
| URL | `/oneclick` | 유지 | URL 변경 시 기존 링크 깨짐 |
| 파일명 | `oneclick-*` | 유지 | 대량 리네이밍 리스크 |
| 변수명 | `oneclick*` | 유지 | 코드 안정성 |
| UI 텍스트 | 혼재 | OneLink로 통일 | 브랜딩 일관성 |
| QueryKey | `['oneclick', ...]` | 유지 | 캐시 호환성 |

### 1.4 레거시 번들 정리

**대상:** `src/data/homepage-template-content/index.ts` (구 정적 HTML 템플릿)

| 슬러그 | 파일 | 상태 |
|--------|------|------|
| portfolio-static | HTML + CSS 번들 | 미사용 → 삭제 후보 |
| landing-static | HTML + CSS 번들 | 미사용 → 삭제 후보 |
| resume-static | HTML + CSS 번들 | 미사용 → 삭제 후보 |
| blog-static | HTML + CSS 번들 | 미사용 → 삭제 후보 |
| docs-static | HTML + CSS 번들 | 미사용 → 삭제 후보 |

**조치:** 사용 참조가 없으면 전체 삭제. 배포 API에서 import하는 곳 확인 필요.

### Sprint 1 완료 기준

- [x] 레거시 API 라우트 2개 삭제 (fork, deploy)
- [x] 레거시 TanStack Query 훅 2개 + 타입 삭제 (useForkTemplate, useDeployToVercel)
- [x] 레거시 Zod 스키마 2개 삭제 (forkRequestSchema, deployRequestSchema)
- [x] 구 번들 파일 정리 (미사용 확인 후)
- [x] 빌드/타입체크 통과
- [x] 기존 배포 플로우 정상 동작

---

## Sprint 2: 보안/안정성 강화

> **목표**: 보안 취약점 해결, 시스템 안정성 강화
> **상태**: ✅ 완료 (이전 세션에서 실행)
> **선행**: Sprint 1 완료

### 2.1 AI 채팅 Rate Limiting

**현재:** `/api/oneclick/ai-chat`에 rate limiting 미적용
**목표:** 사용자별 분당 10회, IP별 분당 20회 제한

```typescript
// 적용 위치: src/app/api/oneclick/ai-chat/route.ts
const aiChatLimiter = createRateLimiter({
  windowMs: 60_000,
  max: 10,
  keyPrefix: 'ai-chat',
});
```

> **Implementation Note**: Rate limiting은 Cloudflare Workers 마이그레이션 시 앱 코드에서 제거됨.
> `createRateLimiter`와 `lib/rate-limit.ts`는 삭제되었으며, Cloudflare Rate Limiting Rules로 인프라 레벨에서 처리.

### 2.2 파일 경로 보안 강화

**현재:** `!val.includes('..')` 만 체크
**추가 보안:**

```typescript
// validations/oneclick.ts - fileUpdateSchema 강화
const BLOCKED_PATHS = [
  '.github/',     // GitHub Actions 보호
  '.git/',        // Git 내부 파일 보호
  'node_modules/', // 의존성 보호
  '.env',         // 환경변수 파일 보호
];

const ALLOWED_EXTENSIONS = [
  '.html', '.css', '.js', '.ts', '.tsx', '.jsx',
  '.json', '.md', '.txt', '.svg', '.png', '.jpg',
  '.ico', '.webp', '.woff', '.woff2',
];
```

### 2.3 배포 쿼터 현실화

**현재:** free 플랜 3개, pro 무제한
**확인:** `plan_quotas` 테이블에 실제 데이터 존재하는지 확인
**조치:** 필요 시 migration으로 쿼터 삽입

### Sprint 2 완료 기준

- [x] AI 채팅 rate limiting 적용 (20/분)
- [x] 파일 경로 보안 규칙 강화 (FORBIDDEN_PATH_PATTERNS)
- [x] 배포 쿼터 실데이터 확인/설정
- [x] 보안 테스트 통과

---

## Sprint 3: UX 강화

> **목표**: 초보 사용자 경험 개선
> **상태**: ✅ 완료
> **선행**: Sprint 2 완료

### 3.1 템플릿 프리뷰 이미지

**현재:** 모든 `preview_image_url`이 null
**목표:** 각 템플릿에 프리뷰 이미지 URL 추가

**구현 방안 (GitHub Pages 정적 서비스 감안):**
1. 프리뷰 이미지를 `public/previews/` 디렉토리에 저장
2. 빌드 시 자동 포함
3. `preview_image_url`을 상대 경로로 설정: `/previews/{slug}.png`

```
public/previews/
├── link-in-bio-pro.png      (1200x630, OG 이미지 겸용)
├── digital-namecard.png
├── dev-showcase.png
└── ... (Phase 2-4 템플릿)
```

### 3.2 에러 복구 개선

**현재 문제:**
- 배포 실패 시 "처음으로 돌아가기"만 가능
- 동일 사이트명 재시도 시 409 충돌
- 실패한 레포가 GitHub에 남아있을 수 있음

**개선:**

```
[배포 실패 시]
    │
    ├─ 409 (레포 존재) → "기존 레포 사용" 또는 "다른 이름으로 재시도" 옵션
    │
    ├─ 403 (권한) → "GitHub 재연결" 버튼 + 구체적 안내
    │
    ├─ 502 (GitHub API) → "잠시 후 재시도" + 자동 재시도 옵션
    │
    └─ 기타 → 에러 코드 + 해결 방법 안내 패널
```

### 3.3 OAuth 상태 보존 개선

**현재:** `sessionStorage` (같은 탭에서만 유효)
**개선:** `localStorage` 통일 (Zustand persist 활용 또는 직접)

```typescript
// 개선: localStorage 기반 pending deploy
const PENDING_KEY = 'linkmap-pending-deploy';
const PENDING_TTL = 10 * 60 * 1000; // 10분 TTL

function savePendingDeploy(data: PendingDeploy) {
  localStorage.setItem(PENDING_KEY, JSON.stringify({
    ...data,
    savedAt: Date.now(),
  }));
}

function loadPendingDeploy(): PendingDeploy | null {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (Date.now() - parsed.savedAt > PENDING_TTL) {
    localStorage.removeItem(PENDING_KEY);
    return null;
  }
  return parsed;
}
```

### Sprint 3 완료 기준

- [ ] 프리뷰 이미지 시스템 구축 (Phase 1 3개 — 후속 작업으로 연기)
- [x] 에러 복구 UX 개선 (409, 403, 502 분기 처리 — deploy-step.tsx)
- [x] OAuth 상태 보존 localStorage 전환 (10분 TTL)
- [x] 에러 시나리오 테스트

---

## Sprint 4: 위저드 단순화

> **목표**: 초보자 핵심 경험 — 최소 클릭으로 배포
> **상태**: ✅ 완료 (Sprint 3에 통합 구현)
> **선행**: Sprint 3 완료

### 4.1 위저드 스텝 최적화

**현재 3단계:**
```
Step 0: 템플릿 선택 + 사이트명 입력
Step 1: GitHub 연결 (비로그인/미연결 시)
Step 2: 배포 진행 & 결과
```

**개선 2단계 (로그인+GitHub 연결된 사용자):**
```
Step 1: 템플릿 선택 + 사이트명 → "배포하기" 클릭
Step 2: 자동 배포 → 완료 → 사이트 링크 + 편집 버튼
```

**핵심 변경:**
- GitHub 연결 상태를 배포 버튼 클릭 시점에 자동 감지
- 미연결 시 인라인 안내 (별도 스텝 X)
- 비로그인 시 로그인 모달 (별도 스텝 X)

### 4.2 자동 감지 & 인라인 안내

```
┌─────────────────────────────────────────────────┐
│  템플릿을 선택하세요                               │
│                                                   │
│  ┌───────┐  ┌───────┐  ┌───────┐                │
│  │Preview│  │Preview│  │Preview│                 │
│  │  img  │  │  img  │  │  img  │                │
│  │ 링크인 │  │디지털  │  │개발자  │                │
│  │ 바이오 │  │ 명함  │  │쇼케이스│                │
│  └───┬───┘  └───────┘  └───────┘                │
│      │ 선택됨                                     │
│                                                   │
│  사이트 이름: [my-portfolio        ]              │
│  URL 미리보기: https://user.github.io/my-portfolio│
│                                                   │
│  ⚠️ GitHub 연결 필요  [GitHub 연결하기]            │  ← 인라인 안내
│     (또는: ✅ GitHub 연결됨 @username)             │
│                                                   │
│                      [🚀 배포하기]                 │
└─────────────────────────────────────────────────┘
```

### 4.3 배포 진행 UX 강화

```
┌─────────────────────────────────────────────────┐
│                                                   │
│         🚀 사이트 배포 중...                       │
│                                                   │
│  ✅ 레포지토리 생성 완료                           │
│  ✅ GitHub Pages 활성화                            │
│  ⏳ 사이트 빌드 중... (약 30초)                    │
│                                                   │
│  ━━━━━━━━━━━━━━━━━━━━░░░░░░░░  70%               │
│                                                   │
│  💡 GitHub가 사이트를 빌드하고 있습니다.           │
│     처음 배포는 1~2분 정도 걸립니다.               │
│                                                   │
└─────────────────────────────────────────────────┘

         ↓ 배포 완료 시 ↓

┌─────────────────────────────────────────────────┐
│                                                   │
│         🎉 사이트가 배포되었습니다!                 │
│                                                   │
│  🌐 https://user.github.io/my-portfolio           │
│                                                   │
│  ┌──────────────┐  ┌──────────────┐              │
│  │ 🔗 사이트 보기 │  │ ✏️ 편집하기  │              │
│  └──────────────┘  └──────────────┘              │
│                                                   │
│  📋 GitHub 레포: user/my-portfolio                 │
│  📊 Linkmap에서 관리하기                           │
│                                                   │
└─────────────────────────────────────────────────┘
```

### Sprint 4 완료 기준

- [x] 위저드 2단계로 축소 (로그인+연결 사용자 기준 — Step 0 → Step 2 직행)
- [x] GitHub 연결 상태 인라인 표시 (template-picker-step.tsx)
- [x] 배포 진행률 UX 강화 (프로그레스 바 — deploy-step.tsx)
- [x] 배포 완료 화면 개선 (사이트 보기, 편집, GitHub 레포 링크)

---

## Sprint 5: 템플릿 구조 고도화

> **목표**: 번들 파일 구조 개선, 새 템플릿 추가 용이성 확보
> **상태**: ✅ 완료
> **선행**: Sprint 4 완료

### 5.1 번들 파일 분리

**현재:** 모든 템플릿이 `homepage-template-content.ts` 단일 파일 (27,000+ 토큰)
**목표:** 템플릿별 개별 파일

```
src/data/templates/
├── index.ts                    # 모든 템플릿 re-export
├── link-in-bio-pro.ts          # link-in-bio-pro 번들
├── digital-namecard.ts         # digital-namecard 번들
├── dev-showcase.ts             # dev-showcase 번들 (기존 분리됨)
├── small-biz.ts                # Phase 2 (신규 생성 필요)
├── product-landing.ts
├── qr-menu-pro.ts
├── resume-site.ts
├── personal-brand.ts
├── freelancer-page.ts          # Phase 3
├── saas-landing.ts
├── newsletter-landing.ts
├── event-page.ts
├── community-hub.ts            # Phase 4
├── study-recruit.ts
└── nonprofit-page.ts
```

> **Implementation Note**: 디렉토리 분리(`src/data/templates/`)는 미구현.
> `getTemplateBySlug()` Map 기반 O(1) 조회로 성능 문제 해결.
> 디렉토리 분리는 Phase 2 템플릿 콘텐츠 생성 시(Sprint 9-11) 재검토.

### 5.2 번들 로딩 최적화

**현재:** 배포 시 모든 템플릿 번들을 한 번에 import
**개선:** 동적 import로 필요한 템플릿만 로딩

```typescript
// src/data/templates/index.ts
const templateLoaders: Record<string, () => Promise<HomepageTemplateContent>> = {
  'link-in-bio-pro': () => import('./link-in-bio-pro').then(m => m.default),
  'digital-namecard': () => import('./digital-namecard').then(m => m.default),
  'dev-showcase': () => import('./dev-showcase').then(m => m.default),
  // ... Phase 2-4
};

export async function loadTemplateContent(slug: string): Promise<HomepageTemplateContent | null> {
  const loader = templateLoaders[slug];
  if (!loader) return null;
  return loader();
}
```

### 5.3 정적 HTML 템플릿 옵션

Phase 2-4 일부 템플릿은 Next.js 대신 순수 HTML/CSS/JS로 구현 가능:

| 유형 | 장점 | 단점 | 적합 템플릿 |
|------|------|------|------------|
| Next.js static | 컴포넌트 재사용, TypeScript | 빌드 필요 (GitHub Actions), 파일 多 | 복잡한 인터랙션 |
| 순수 HTML | 즉시 배포 (빌드 불필요), 파일 少 | 코드 중복, 유지보수 어려움 | 단순 랜딩 |

**결정:** Phase 1 MVP는 Next.js 유지. Phase 2+ 신규 템플릿은 복잡도에 따라 선택.

### Sprint 5 완료 기준

- [x] `getTemplateBySlug()` Map 기반 O(1) 조회 구현
- [x] `getDeployWorkflow()` 공유 워크플로우 함수 추가
- [x] 기존 3개 템플릿 정상 동작 확인
- [x] deploy-pages API에서 `getTemplateBySlug()` 적용

---

## Sprint 6: 편집기/AI 강화

> **목표**: 배포 후 편집 경험 개선
> **상태**: ✅ 완료
> **선행**: Sprint 5 완료

### 6.1 배치 파일 적용 최적화

**현재:** 파일 하나씩 순차 PUT → N개 파일 = N번 GitHub API 호출
**개선:** 단일 Git tree commit으로 원자적 적용

```typescript
// 새 API: POST /api/oneclick/deployments/[id]/batch-update
// 여러 파일을 한 번의 Git commit으로 적용
async function batchUpdateFiles(
  token: string,
  owner: string,
  repo: string,
  files: Array<{ path: string; content: string }>
): Promise<void> {
  // 1. 현재 HEAD SHA 조회
  // 2. Git tree 생성 (모든 파일 포함)
  // 3. Git commit 생성
  // 4. ref 업데이트
  // → 1번의 API 호출로 모든 파일 업데이트
}
```

### 6.2 AI 채팅 UX 개선

**현재:** 텍스트 기반 채팅
**개선:**
- 제안된 코드 변경사항 diff 뷰
- "적용" 버튼으로 원클릭 적용
- 적용 전/후 미리보기 비교
- 자주 쓰는 프롬프트 템플릿 (예: "배경색 변경", "폰트 변경")

### 6.3 미리보기 개선

**현재:** iframe srcdoc 기반 미리보기
**개선:**
- 반응형 미리보기 (모바일/태블릿/데스크톱 토글)
- 실시간 미리보기 갱신
- 다크모드 미리보기

### Sprint 6 완료 기준

- [x] 배치 파일 적용 API 구현 — `POST /deployments/[id]/batch-update` (pushFilesAtomically)
- [x] AI 채팅 UX 개선 — 프롬프트 9개 확장 (다크모드, 애니메이션, SEO), 대화 초기화 버튼
- [x] 미리보기 반응형 토글 — 모바일(375px)/태블릿(768px)/데스크톱 뷰포트 전환

---

## Sprint 7: 플랫폼 연결성

> **목표**: OneLink 배포 → Linkmap 대시보드 자연스러운 연계
> **상태**: ✅ 완료
> **선행**: Sprint 6 완료

### 7.1 My Sites ↔ Linkmap 대시보드 통합

**현재:** My Sites와 Linkmap 대시보드가 별도 경험
**목표:** My Sites에서 배포된 사이트의 Linkmap 프로젝트로 원클릭 이동

```
My Sites 카드
┌─────────────────────────────────────────┐
│  🌐 my-portfolio                        │
│  ✅ 배포됨 • 링크인바이오 프로           │
│                                          │
│  [사이트 보기] [편집하기] [Linkmap 관리]  │
│                                    ↑      │
│              프로젝트 대시보드로 이동     │
└─────────────────────────────────────────┘
```

### 7.2 서비스 자동 연결

배포 시 생성되는 Linkmap 프로젝트에 서비스 자동 연결:
- GitHub (레포 연결 — 이미 구현)
- GitHub Pages (호스팅 서비스 — 신규)
- 사용된 템플릿 기반 서비스 추천

### 7.3 배포 분석 (기본)

```
My Sites 대시보드 상단:
┌─────────────────────────────────────────┐
│  📊 내 사이트 현황                       │
│                                          │
│  총 3개 사이트 | 배포 성공률 100%        │
│  이번 달 배포: 2회                       │
│  마지막 배포: 2시간 전                   │
└─────────────────────────────────────────┘
```

### Sprint 7 완료 기준

- [x] My Sites → Linkmap 프로젝트 연결 버튼 ("관리" 버튼 → `/project/{id}`)
- [x] GitHub 서비스 자동 연결 (deploy-pages에서 이미 구현됨)
- [x] 배포 현황 요약 위젯 (전체/활성/오류/마지막 배포 4-stat 대시보드)

---

## 구현 우선순위 매트릭스

| Sprint | 영향도 | 긴급도 | 복잡도 | 우선순위 |
|--------|--------|--------|--------|----------|
| 1. 기반 정리 | 높음 | 높음 | 낮음 | ★★★★★ |
| 2. 보안/안정 | 높음 | 높음 | 낮음 | ★★★★★ |
| 3. UX 강화 | 높음 | 중간 | 중간 | ★★★★☆ |
| 4. 위저드 단순화 | 높음 | 중간 | 중간 | ★★★★☆ |
| 5. 템플릿 구조 | 중간 | 낮음 | 높음 | ★★★☆☆ |
| 6. 편집기/AI | 중간 | 낮음 | 높음 | ★★★☆☆ |
| 7. 플랫폼 연결 | 중간 | 낮음 | 중간 | ★★☆☆☆ |

---

## 변경 추적

이 문서는 각 스프린트 실행 시 해당 섹션의 **상태**와 **완료 기준 체크리스트**가 업데이트됩니다.

| 날짜 | 스프린트 | 변경 |
|------|----------|------|
| 2026-02-18 | 전체 | 초기 기획 문서 작성 |
| 2026-02-18 | Sprint 1 | ✅ 완료 — 레거시 Vercel 코드 완전 제거 (이전 세션) |
| 2026-02-18 | Sprint 2 | ✅ 완료 — AI 채팅 rate limit, 파일 경로 보안 (이전 세션) |
| 2026-02-18 | Sprint 3 | ✅ 완료 — OAuth localStorage 전환, GitHub 인라인 상태 |
| 2026-02-18 | Sprint 4 | ✅ 완료 — Sprint 3에 통합 구현 (위저드 단순화) |
| 2026-02-18 | Sprint 5 | ✅ 완료 — getTemplateBySlug() 추가, deploy-pages 최적화 |
| 2026-02-18 | Sprint 6 | ✅ 완료 — 배치 커밋 API, AI 프롬프트 확장, 반응형 미리보기 |
| 2026-02-18 | Sprint 7 | ✅ 완료 — Linkmap 프로젝트 연결 버튼, 배포 현황 대시보드 |
| 2026-02-18 | Phase 2 | 계획 수립 — Sprint 8-12 로드맵 추가, Phase 1 불일치 정정 |
| 2026-02-20 | 모듈 에디터 | ✅ Phase 1~4 전체 완료 — 6개 템플릿 모듈 스키마/프리셋, DnD, 이미지 업로드, AI 추천 |
| 2026-02-22 | IA Redesign | ✅ /oneclick+/my-sites → /sites 통합, 모달 UX, 템플릿 3→6개 확장 |

---

## Phase 2: 확장 & 완성 (Sprint 8-12)

> **상태**: 계획 수립 완료
> **선행**: Phase 1 (Sprint 1-7) 완료

### Sprint 8: Connections 완성

> **목표**: 개발 중인 Connections 기능의 품질 보증 및 출시 준비
> **상태**: 계획

**범위:**
- Connections 관련 API/컴포넌트 테스트 커버리지 확보
- i18n 키 누락 검증 (47개 키 ko/en 일치 확인)
- Connections 페이지 서버 컴포넌트 인증 체크 추가
- `02-api-reference.md`에 Connections API 문서 추가
- 연결 오버레이 성능 최적화 (다수 연결 시)

**완료 기준:**
- [ ] Connections API 테스트 (CRUD + auto-connect)
- [ ] 서버 auth 적용 (`/project/[id]/connections`)
- [ ] i18n 키 일치 검증
- [ ] API 문서화 완료
- [ ] 성능 테스트 (20+ 연결 시나리오)

### Sprint 9: 템플릿 Phase 2

> **목표**: 4개 실용 템플릿 콘텐츠 번들 생성
> **상태**: 계획

| 템플릿 | 슬러그 | 카테고리 | 복잡도 |
|--------|--------|----------|--------|
| 소상공인 홈페이지 | small-biz | 비즈니스 | 중간 |
| 제품 랜딩 페이지 | product-landing | 마케팅 | 중간 |
| QR 메뉴 프로 | qr-menu-pro | 요식업 | 높음 |
| 이력서 사이트 | resume-site | 개인 | 낮음 |

### Sprint 10: 템플릿 Phase 3

> **목표**: 4개 크리에이터/비즈니스 템플릿
> **의존성**: Sprint 9 완료

| 템플릿 | 슬러그 | 카테고리 | 복잡도 |
|--------|--------|----------|--------|
| 퍼스널 브랜드 | personal-brand | 개인 | 중간 |
| 프리랜서 페이지 | freelancer-page | 개인 | 중간 |
| SaaS 랜딩 | saas-landing | 비즈니스 | 높음 |
| 뉴스레터 랜딩 | newsletter-landing | 마케팅 | 낮음 |

### Sprint 11: 템플릿 Phase 4

> **목표**: 4개 커뮤니티/이벤트 템플릿
> **의존성**: Sprint 10 완료

| 템플릿 | 슬러그 | 카테고리 | 복잡도 |
|--------|--------|----------|--------|
| 이벤트 페이지 | event-page | 이벤트 | 중간 |
| 커뮤니티 허브 | community-hub | 커뮤니티 | 높음 |
| 스터디 모집 | study-recruit | 교육 | 중간 |
| 비영리 페이지 | nonprofit-page | 비영리 | 낮음 |

### Sprint 12: 프리뷰 & 품질

> **목표**: 사용자 경험 완성도 확보
> **의존성**: Sprint 9-11 완료 (모든 템플릿 필요)

**범위:**
- 15개 템플릿 프리뷰 이미지 생성 (1200x630, OG 이미지 겸용)
- Lighthouse 성능 감사 (목표 90+)
- E2E 테스트 (배포 → 편집 → 확인 시나리오)
- 전체 통합 테스트

### Phase 2 우선순위 매트릭스

| Sprint | 영향도 | 긴급도 | 복잡도 | 우선순위 |
|--------|--------|--------|--------|----------|
| 8. Connections 완성 | 높음 | 높음 | 중간 | ★★★★★ |
| 9. 템플릿 Phase 2 | 높음 | 중간 | 중간 | ★★★★☆ |
| 10. 템플릿 Phase 3 | 중간 | 중간 | 중간 | ★★★☆☆ |
| 11. 템플릿 Phase 4 | 중간 | 낮음 | 중간 | ★★★☆☆ |
| 12. 프리뷰 & 품질 | 높음 | 낮음 | 높음 | ★★★☆☆ |
