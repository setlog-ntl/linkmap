# OneLink 현재 문제점 & 리팩토링 방향

## 1. 현재 문제점 분석

### 1.1 아키텍처 이슈

#### A. 네이밍 혼란
- **코드**: `oneclick` (URL, 파일, 변수명)
- **UI**: "원클릭 배포" / "One-Click Deploy"
- **브랜딩**: OneLink? OneClick?
- `fork_status` 필드를 GitHub Pages 배포에서도 사용 (실제로 fork 아님)
- `forked_repo_*` 필드명이 "새 레포 생성" 동작과 불일치

#### B. 레거시 코드 잔존
- **3개의 미사용 API 라우트**: `fork/route.ts`, `deploy/route.ts` (Vercel 전용)
- **2개의 미사용 TanStack Query 훅**: `useForkTemplate`, `useDeployToVercel`
- **Zod 스키마**: `forkRequestSchema`, `deployRequestSchema` (Vercel 전용)
- DB 스키마에 Vercel 관련 컬럼 잔존: `vercel_project_id`, `vercel_project_url`, `deployment_id`
- `deploy_method` 컬럼 기본값이 `'vercel'`이지만 실제로는 `'github_pages'`만 사용

#### C. 상태 관리 중복
- `oneclick-store.ts` (Zustand persist): `selectedTemplateId`, `siteName`, `currentStep`
- `wizard-client.tsx` (useState): `currentStep`, `deployId`, `projectId`, `isDeploying`, `pendingDeploy`
- **Zustand store가 사실상 미사용** — wizard가 자체 state로 모든 것을 관리

#### D. 번들 파일 비대
- `homepage-template-content.ts`: 27,000+ 토큰 (하나의 TS 파일에 모든 HTML/CSS 인라인)
- `dev-showcase-template.ts`만 분리됨 (일관성 없음)
- 새 템플릿 추가 시 파일이 계속 비대해짐

---

### 1.2 데이터 이슈

#### A. 시드 데이터 이원화
- **DB 시드** (migration 016): `portfolio-static`, `landing-static`, `resume-static`, `blog-static`, `docs-static`
- **TS 시드** (homepage-templates.ts): `homepage-minimal`, `homepage-links`, `link-in-bio-pro`, `digital-namecard`, `dev-showcase`
- 두 시드의 slug가 완전히 다름 → 어떤 게 실제 사용되는지 혼란
- 실제 배포 시 `homepage-template-content.ts`의 번들이 필요하므로, DB에만 있고 번들이 없는 템플릿은 배포 불가

#### B. 쿼터 미설정
- `DEFAULT_QUOTA.max_homepage_deploys = 999999` → 사실상 무제한
- `plan_quotas` 테이블이 비어있으면 모든 사용자가 무제한 배포 가능
- 비즈니스 모델과 괴리

#### C. 배포 삭제 시 레포 미삭제
- `DELETE /deployments/[id]`는 DB 레코드만 삭제
- GitHub 레포는 삭제하지 않음 → 사용자의 GitHub에 고아 레포 누적

---

### 1.3 UX 이슈

#### A. 프리뷰 이미지 없음
- 모든 템플릿의 `preview_image_url`이 `null`
- 사용자가 템플릿의 실제 모습을 볼 수 없음

#### B. 에러 복구 미흡
- 배포 실패 시 "처음으로 돌아가기"만 가능
- 동일 사이트명으로 재시도 시 레포 충돌 (409) 가능
- 실패한 레포는 이미 GitHub에 생성되었을 수 있음

#### C. OAuth 상태 보존 취약
- `sessionStorage` (같은 탭에서만 유효) 사용
- 새 탭에서 OAuth 콜백 오면 pending deploy 데이터 소실

#### D. 커스텀 도메인 미지원
- GitHub Pages 기본 URL만 제공 (`user.github.io/site`)
- 커스텀 도메인 설정 기능 없음

---

### 1.4 보안 이슈

#### A. AI 채팅 Rate Limit 없음
- `/api/oneclick/ai-chat`에 rate limiting 미적용
- AI API 남용 가능

#### B. 파일 경로 검증 불충분
- `fileUpdateSchema`의 path 검증: `!val.includes('..')` 만 체크
- 숨김 파일(`.github/*`), 시스템 파일 등에 대한 보호 없음

#### C. 토큰 갱신 메커니즘 없음
- GitHub OAuth 토큰 만료 시 사용자에게 "다시 연결해주세요" 에러만 표시
- 자동 refresh token 갱신 미구현

---

### 1.5 성능 이슈

#### A. 배포 API가 동기식 장시간 작업
- `deploy-pages` route가 GitHub API를 순차 호출 (레포생성 → Pages → 파일푸시)
- 총 실행 시간: 3~10초+ (네트워크 지연 포함)
- 이 동안 클라이언트는 응답 대기 (spinning)

#### B. 배치 파일 적용이 순차 처리
- `useBatchApplyFiles`가 파일을 하나씩 `PUT` 호출
- 10개 파일 수정 시 10번의 API 호출 + 10번의 GitHub API 호출

#### C. Status 폴링이 매번 GitHub API 호출
- 매 3초마다 Supabase 조회 + GitHub Pages API 호출
- Rate limit 내이지만, 다수 사용자 동시 배포 시 GitHub API 한도 소진 가능

---

## 2. 리팩토링 방향 제안

### Phase 1: 정리 & 안정화

| 작업 | 우선순위 | 예상 범위 |
|------|----------|----------|
| 레거시 코드 제거 (Vercel fork/deploy) | 높음 | API 3개, 훅 2개, 스키마 2개 |
| 네이밍 통일 (onelink or oneclick 확정) | 높음 | 전체 리네이밍 |
| 상태 관리 정리 (Zustand store 활용 or 제거) | 중간 | store + wizard |
| DB 시드/TS 시드 통합 | 높음 | migration + data 파일 |
| DB 컬럼 정리 (fork_status → repo_status 등) | 중간 | migration |
| AI 채팅 rate limit 추가 | 높음 | 1줄 |

### Phase 2: 구조 개선

| 작업 | 우선순위 | 예상 범위 |
|------|----------|----------|
| 번들 템플릿을 개별 파일로 분리 | 중간 | data 폴더 구조화 |
| 배포 API를 백그라운드 잡으로 전환 | 높음 | 큐/폴링 아키텍처 |
| 배치 파일 적용을 atomic Git commit으로 | 중간 | API 1개, GitHub lib |
| 템플릿 프리뷰 이미지 추가 | 중간 | 이미지 + DB |
| 쿼터 실제 설정 | 높음 | plan_quotas 시드 |

### Phase 3: 기능 확장

| 작업 | 우선순위 | 예상 범위 |
|------|----------|----------|
| 커스텀 도메인 지원 | 중간 | GitHub Pages CNAME |
| 레포 삭제 옵션 추가 | 낮음 | API + UI |
| OAuth 토큰 자동 갱신 | 중간 | refresh token 로직 |
| 템플릿 마켓플레이스 (사용자 제출) | 낮음 | 신규 기능 |
| 실시간 공동 편집 | 낮음 | WebSocket |

---

## 3. 삭제 가능한 코드 목록

### API Routes (3개)
- `src/app/api/oneclick/fork/route.ts`
- `src/app/api/oneclick/deploy/route.ts`
- (주의: status route의 Vercel 분기도 정리 필요)

### TanStack Query Hooks (2개 + 관련 타입)
- `useForkTemplate()` → `queries/oneclick.ts`
- `useDeployToVercel()` → `queries/oneclick.ts`
- `ForkResult`, `DeployResult` 타입

### Zod 스키마 (2개)
- `forkRequestSchema` → `validations/oneclick.ts`
- `deployRequestSchema` → `validations/oneclick.ts`

### Zustand Store (검토 필요)
- `oneclick-store.ts` → wizard-client.tsx와 중복, 어느 쪽으로 통합할지 결정 필요

### DB 컬럼 (마이그레이션 필요)
- `homepage_deploys.vercel_project_id`
- `homepage_deploys.vercel_project_url`
- `homepage_deploys.deployment_id` (Vercel용)
- `homepage_deploys.deploy_method` 기본값 변경 (`'vercel'` → `'github_pages'`)

---

## 4. 핵심 수치 요약

| 메트릭 | 현재 값 | 비고 |
|--------|---------|------|
| 총 파일 수 | 28개 | |
| 활성 API 라우트 | 8개 | + 레거시 3개 |
| TanStack Query 훅 | 12개 | 활성 9 + 레거시 2 + status 1 |
| Zod 스키마 | 5개 | 활성 3 + 레거시 2 |
| 템플릿 수 (DB 시드) | 5개 | static HTML |
| 템플릿 수 (TS 시드) | 5개 | nextjs + github_pages |
| 번들 템플릿 (실제 배포 가능) | ? | content 파일 확인 필요 |
| 레거시 코드 비율 | ~20% | 삭제 가능 |
