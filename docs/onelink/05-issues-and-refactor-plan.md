# OneLink 현재 문제점 & 리팩토링 방향

## 1. 현재 문제점 분석

### 1.1 아키텍처 이슈

#### A. 네이밍 혼란 — **[결정됨]** Sprint 1
- **코드**: `oneclick` (URL, 파일, 변수명)
- **UI**: "원클릭 배포" / "One-Click Deploy"
- **브랜딩**: OneLink? OneClick?
- `fork_status` 필드를 GitHub Pages 배포에서도 사용 (실제로 fork 아님)
- `forked_repo_*` 필드명이 "새 레포 생성" 동작과 불일치
- **결정**: 코드는 `oneclick` 유지, UI 브랜딩만 OneLink 표시

#### B. 레거시 코드 잔존 — **[해결됨]** Sprint 1에서 삭제
- ~~**3개의 미사용 API 라우트**: `fork/route.ts`, `deploy/route.ts` (Vercel 전용)~~
- ~~**2개의 미사용 TanStack Query 훅**: `useForkTemplate`, `useDeployToVercel`~~
- ~~**Zod 스키마**: `forkRequestSchema`, `deployRequestSchema` (Vercel 전용)~~
- DB 스키마에 Vercel 관련 컬럼 잔존: `vercel_project_id`, `vercel_project_url`, `deployment_id`
- `deploy_method` 컬럼 기본값이 `'vercel'`이지만 실제로는 `'github_pages'`만 사용

#### C. 상태 관리 중복 — **[해결됨]** store 미존재 확인
- ~~`oneclick-store.ts` (Zustand persist): `selectedTemplateId`, `siteName`, `currentStep`~~
- `wizard-client.tsx` (useState): `currentStep`, `deployId`, `projectId`, `isDeploying`, `pendingDeploy`
- **확인 결과**: `oneclick-store.ts` 파일은 존재하지 않음. wizard가 자체 useState로 모든 것을 관리.

#### D. 번들 파일 비대 — **[부분 해결]** getTemplateBySlug() Map 방식
- `homepage-template-content.ts`: 27,000+ 토큰 (하나의 TS 파일에 모든 HTML/CSS 인라인)
- `dev-showcase-template.ts`만 분리됨 (일관성 없음)
- 새 템플릿 추가 시 파일이 계속 비대해짐
- **해결**: `getTemplateBySlug()` Map 기반 O(1) 조회로 성능 문제 해결. 디렉토리 분리는 Phase 2 검토.

---

### 1.2 데이터 이슈

#### A. 시드 데이터 이원화 — **[해결됨]** migration 023
- ~~**DB 시드** (migration 016): `portfolio-static`, `landing-static`, `resume-static`, `blog-static`, `docs-static`~~
- ~~**TS 시드** (homepage-templates.ts): `homepage-minimal`, `homepage-links`, `link-in-bio-pro`, `digital-namecard`, `dev-showcase`~~
- ~~두 시드의 slug가 완전히 다름~~
- **해결**: migration 023에서 구 DB 시드 비활성화, TS 시드 기반으로 통합 정리

#### B. 쿼터 미설정 — **[확인됨]** Sprint 2
- `DEFAULT_QUOTA.max_homepage_deploys = 999999` → 사실상 무제한
- `plan_quotas` 테이블이 비어있으면 모든 사용자가 무제한 배포 가능
- Sprint 2에서 쿼터 실데이터 확인/설정 완료

#### C. 배포 삭제 시 레포 미삭제 — **[미변경]** 의도적 설계
- `DELETE /deployments/[id]`는 DB 레코드만 삭제
- GitHub 레포는 삭제하지 않음 → 사용자의 GitHub에 고아 레포 누적
- **의도적 설계**: 사용자 코드 소유권 원칙에 따라 레포 자동 삭제 미수행

---

### 1.3 UX 이슈

#### A. 프리뷰 이미지 없음 — **[미변경]** Phase 2 연기 (Sprint 12)
- 모든 템플릿의 `preview_image_url`이 `null`
- 사용자가 템플릿의 실제 모습을 볼 수 없음

#### B. 에러 복구 미흡 — **[해결됨]** Sprint 3
- ~~배포 실패 시 "처음으로 돌아가기"만 가능~~
- ~~동일 사이트명으로 재시도 시 레포 충돌 (409) 가능~~
- **해결**: 409/403/502 에러별 분기 처리 및 복구 UX 구현 (deploy-step.tsx)

#### C. OAuth 상태 보존 취약 — **[해결됨]** Sprint 3, localStorage+TTL
- ~~`sessionStorage` (같은 탭에서만 유효) 사용~~
- **해결**: `localStorage` 기반 10분 TTL로 탭 전환/리다이렉트 안전성 확보

#### D. 커스텀 도메인 미지원 — **[미변경]** Phase 2+
- GitHub Pages 기본 URL만 제공 (`user.github.io/site`)
- 커스텀 도메인 설정 기능 없음

---

### 1.4 보안 이슈

#### A. AI 채팅 Rate Limit 없음 — **[해결됨]** Cloudflare Rate Limiting Rules
- ~~`/api/oneclick/ai-chat`에 rate limiting 미적용~~
- **해결**: Cloudflare Rate Limiting Rules로 인프라 레벨 적용 (앱 코드 rate-limit.ts 삭제)

#### B. 파일 경로 검증 불충분 — **[해결됨]** Sprint 2
- ~~`fileUpdateSchema`의 path 검증: `!val.includes('..')` 만 체크~~
- **해결**: FORBIDDEN_PATH_PATTERNS + 허용 확장자 화이트리스트 적용

#### C. 토큰 갱신 메커니즘 없음 — **[미변경]**
- GitHub OAuth 토큰 만료 시 사용자에게 "다시 연결해주세요" 에러만 표시
- 자동 refresh token 갱신 미구현

---

### 1.5 성능 이슈

#### A. 배포 API가 동기식 장시간 작업 — **[미변경]** 허용 범위
- `deploy-pages` route가 GitHub API를 순차 호출 (레포생성 → Pages → 파일푸시)
- 총 실행 시간: 3~10초+ (네트워크 지연 포함)
- 이 동안 클라이언트는 응답 대기 (spinning)

#### B. 배치 파일 적용이 순차 처리 — **[해결됨]** Sprint 6, batch-update API
- ~~`useBatchApplyFiles`가 파일을 하나씩 `PUT` 호출~~
- **해결**: `POST /deployments/[id]/batch-update` 단일 Git tree commit으로 원자적 적용

#### C. Status 폴링이 매번 GitHub API 호출 — **[미변경]** 허용 범위
- 매 3초마다 Supabase 조회 + GitHub Pages API 호출
- Rate limit 내이지만, 다수 사용자 동시 배포 시 GitHub API 한도 소진 가능

---

## 2. 리팩토링 방향 제안

### Phase 1: 정리 & 안정화 — ✅ 완료 (Sprint 1-7)

| 작업 | 우선순위 | 상태 |
|------|----------|------|
| 레거시 코드 제거 (Vercel fork/deploy) | 높음 | ✅ Sprint 1 |
| 네이밍 통일 (oneclick 유지 결정) | 높음 | ✅ Sprint 1 |
| 상태 관리 정리 (store 미존재 확인) | 중간 | ✅ N/A |
| DB 시드/TS 시드 통합 | 높음 | ✅ migration 023 |
| AI 채팅 rate limit 추가 | 높음 | ✅ Cloudflare Rules |
| 배치 파일 적용 최적화 | 중간 | ✅ Sprint 6 |

### Phase 2: 구조 개선 — Sprint 8-12 계획

| 작업 | 우선순위 | 상태 |
|------|----------|------|
| 번들 템플릿을 개별 파일로 분리 | 중간 | Sprint 9-11 |
| 템플릿 프리뷰 이미지 추가 | 중간 | Sprint 12 |
| Connections 기능 완성 | 높음 | Sprint 8 |

### Phase 3: 기능 확장 — 미정

| 작업 | 우선순위 | 예상 범위 |
|------|----------|----------|
| 커스텀 도메인 지원 | 중간 | GitHub Pages CNAME |
| 레포 삭제 옵션 추가 | 낮음 | API + UI |
| OAuth 토큰 자동 갱신 | 중간 | refresh token 로직 |
| 템플릿 마켓플레이스 (사용자 제출) | 낮음 | 신규 기능 |
| 실시간 공동 편집 | 낮음 | WebSocket |

---

## 3. 삭제 가능한 코드 목록

### API Routes (3개) — **삭제 완료** (Sprint 1)
- ~~`src/app/api/oneclick/fork/route.ts`~~ ✅
- ~~`src/app/api/oneclick/deploy/route.ts`~~ ✅
- ~~(주의: status route의 Vercel 분기도 정리 필요)~~ ✅

### TanStack Query Hooks (2개 + 관련 타입) — **삭제 완료** (Sprint 1)
- ~~`useForkTemplate()` → `queries/oneclick.ts`~~ ✅
- ~~`useDeployToVercel()` → `queries/oneclick.ts`~~ ✅
- ~~`ForkResult`, `DeployResult` 타입~~ ✅

### Zod 스키마 (2개) — **삭제 완료** (Sprint 1)
- ~~`forkRequestSchema` → `validations/oneclick.ts`~~ ✅
- ~~`deployRequestSchema` → `validations/oneclick.ts`~~ ✅

### Zustand Store (검토 필요) — **N/A** (파일 미존재)
- ~~`oneclick-store.ts`~~ — 파일이 존재하지 않음. wizard-client.tsx가 React useState로 관리.

### DB 컬럼 (마이그레이션 필요) — **미변경**
- `homepage_deploys.vercel_project_id`
- `homepage_deploys.vercel_project_url`
- `homepage_deploys.deployment_id` (Vercel용)
- `homepage_deploys.deploy_method` 기본값 변경 (`'vercel'` → `'github_pages'`)

---

## 4. 핵심 수치 요약

| 메트릭 | 현재 값 | 비고 |
|--------|---------|------|
| 총 파일 수 | 28개 | oneclick 관련 |
| 활성 API 라우트 | 10개 | 레거시 제거, batch-update 추가 |
| TanStack Query 훅 | 9개 | 레거시 2개 삭제 완료 |
| Zod 스키마 | 3개 | 레거시 2개 삭제 완료 |
| 템플릿 수 (DB) | 15개 | migration 023 기준 |
| 번들 템플릿 (실제 배포 가능) | 3개 | Phase 1 MVP (link-in-bio-pro, digital-namecard, dev-showcase) |
| 레거시 코드 비율 | 0% | Sprint 1 완료 |
