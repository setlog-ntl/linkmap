# OneLink 아키텍처 & 파일 구조

> **최종 수정일**: 2026-02-22 (IA Redesign + 모듈 에디터 Phase 4 반영)

## 1. 전체 파일 맵

```
src/
├── app/
│   ├── (dashboard)/sites/
│   │   ├── page.tsx                              # 통합 Sites 페이지 (탭: new/manage)
│   │   └── [deployId]/edit/
│   │       └── page.tsx                          # 사이트 에디터
│   ├── oneclick/
│   │   └── page.tsx                              # 레거시 리다이렉트 → /sites
│   ├── my-sites/
│   │   └── page.tsx                              # 레거시 리다이렉트 → /sites?tab=manage
│   └── api/oneclick/
│       ├── templates/route.ts                    # GET: 템플릿 목록
│       ├── github-check/route.ts                 # GET: GitHub 연결 상태 확인
│       ├── preflight/route.ts                    # GET: 배포 사전 검사 (계정+쿼터+중복)
│       ├── deploy/route.ts                       # POST: GitHub Pages 배포 (핵심)
│       ├── deploy-pages/route.ts                 # POST: 하위 호환 리다이렉트 → /deploy
│       ├── status/route.ts                       # GET: 배포 상태 폴링
│       ├── deployments/route.ts                  # GET: 내 배포 목록
│       ├── deployments/[id]/route.ts             # DELETE: 배포 삭제
│       ├── deployments/[id]/files/route.ts       # GET: 파일 조회
│       ├── deployments/[id]/batch-update/route.ts # POST: 배치 파일 적용
│       ├── deployments/[id]/upload/route.ts      # POST: 이미지 업로드
│       ├── ai-chat/route.ts                      # POST: AI 채팅 (SSE 스트리밍)
│       └── oauth/authorize/route.ts              # GET: GitHub OAuth 시작
│
├── components/
│   ├── oneclick/                                 # 위저드 컴포넌트 (11개)
│   │   ├── oneclick-page-client.tsx              # 동적 로딩 래퍼 (ssr: false)
│   │   ├── wizard-client.tsx                     # 위저드 메인 로직
│   │   ├── template-picker-step.tsx              # Step: 템플릿 선택 + 사이트명
│   │   ├── template-card.tsx                     # 템플릿 카드 UI
│   │   ├── auth-gate-step.tsx                    # Step: 비로그인 → 로그인 유도
│   │   ├── auth-modal.tsx                        # 인증 모달 (로그인/회원가입)
│   │   ├── github-connect-step.tsx               # Step: GitHub 미연결 → OAuth
│   │   ├── github-connect-modal.tsx              # GitHub 연결 모달
│   │   ├── deploy-step.tsx                       # Step: 배포 입력 양식
│   │   ├── deploy-progress.tsx                   # 배포 진행 다이얼로그 (단계별 모달)
│   │   └── deploy-success.tsx                    # 배포 성공 화면
│   └── my-sites/                                 # 사이트 관리 컴포넌트 (7개)
│       ├── my-sites-client.tsx                   # 배포된 사이트 목록 대시보드
│       ├── deploy-site-card.tsx                  # 개별 사이트 카드
│       ├── site-editor-client.tsx                # 웹 코드 에디터 + 모듈 패널 통합
│       ├── module-panel.tsx                      # 모듈 편집 패널 (DnD + 프리셋 + AI 추천)
│       ├── module-form.tsx                       # 스키마 기반 동적 폼 렌더러
│       ├── module-deploy-dialog.tsx              # 모듈 적용 배포 진행 모달
│       └── chat-terminal.tsx                     # AI 채팅 터미널
│
├── lib/
│   ├── queries/
│   │   ├── oneclick.ts                           # TanStack Query 훅 (9개)
│   │   └── keys.ts                               # QueryKey 팩토리
│   ├── validations/
│   │   └── oneclick.ts                           # Zod 스키마 (3개)
│   ├── oneclick/
│   │   ├── code-generator.ts                     # 모듈 → 코드 생성 엔진
│   │   └── deploy-status.ts                      # 배포 상태 폴링 로직 + 단계 빌더
│   └── module-schema.ts                          # 모듈 스키마 타입 정의
│
├── data/oneclick/
│   ├── index.ts                                  # 배럴 export
│   ├── homepage-templates.ts                     # 템플릿 시드 데이터
│   ├── homepage-template-content.ts              # 번들 템플릿 파일 (HTML/CSS)
│   ├── template-sample-content.ts                # 프리뷰용 샘플
│   ├── dev-showcase-template.ts                  # Dev Showcase 번들
│   ├── personal-brand-template.ts                # Personal Brand 번들
│   ├── freelancer-page-template.ts               # Freelancer Page 번들
│   ├── small-biz-template.ts                     # Small Biz 번들
│   ├── module-schemas/                           # 모듈 스키마 (6개 템플릿)
│   │   ├── index.ts                              # getModuleSchema() 함수
│   │   ├── personal-brand.ts
│   │   ├── dev-showcase.ts
│   │   ├── link-in-bio-pro.ts
│   │   ├── digital-namecard.ts
│   │   ├── freelancer-page.ts
│   │   └── small-biz.ts
│   └── module-presets/                           # 모듈 프리셋 (6개 템플릿)
│       ├── index.ts                              # getModulePresets() 함수
│       ├── personal-brand.ts                     # 3개 프리셋 (미니멀/크리에이터/풀)
│       ├── dev-showcase.ts
│       ├── link-in-bio-pro.ts
│       ├── digital-namecard.ts
│       ├── freelancer-page.ts
│       └── small-biz.ts
│
supabase/migrations/
├── 014_homepage_deploys.sql                      # 초기: homepage_templates, homepage_deploys
├── 016_oneclick_github_pages.sql                 # GitHub Pages 지원 추가
└── 022_oneclick_cleanup.sql                      # 레거시 정리, 쿼터 합리화
```

> **참고**: `oneclick-store.ts`는 존재하지 않음. wizard-client.tsx가 React useState로 위저드 상태를 관리.
> 레거시 API (`fork/route.ts`, `deploy/route.ts`(Vercel))는 Sprint 1에서 삭제됨.
> `/oneclick`, `/my-sites` 경로는 IA Redesign(2026-02-22)에서 `/sites`로 통합, 레거시 리다이렉트 유지.

---

## 2. 컴포넌트 아키텍처

### 2.1 Sites 통합 페이지 (IA Redesign)
```
/sites (page.tsx - Server Component, dashboard 레이아웃)
  ├─ tab=new: OneclickPageClient (ssr: false 동적 import)
  │    └─ OneclickWizardClient (wizard-client.tsx)
  │         ├─ TemplatePickerStep + TemplateCard (× N)
  │         ├─ AuthModal (인증 필요 시 모달)
  │         ├─ GitHubConnectModal (GitHub 미연결 시 모달)
  │         ├─ DeployStep (사이트명 입력)
  │         ├─ DeployProgress (배포 진행 다이얼로그)
  │         └─ DeploySuccess (배포 완료 화면)
  └─ tab=manage: MySitesClient
       ├─ DeploySiteCard (× N)
       └─ [링크] /sites/{deployId}/edit
            └─ SiteEditorClient
                 ├─ ModulePanel + ModuleForm (모듈 스키마 있을 때)
                 ├─ ModuleDeployDialog (배포 진행 모달)
                 └─ ChatTerminal
```

### 2.2 레거시 리다이렉트
```
/oneclick → redirect('/sites')         (tab 'new' 기본)
/my-sites → redirect('/sites?tab=manage')
/my-sites/[id]/edit → redirect('/sites/[id]/edit')
```

### 2.3 동적 로딩 패턴
- `OneclickPageClient`는 `next/dynamic`으로 `ssr: false` 로딩
- Next.js 16에서 `dynamic({ ssr: false })`는 반드시 `'use client'` 컴포넌트 내부에서 사용

---

## 3. 상태 관리

### 3.1 위저드 상태 (wizard-client.tsx)

위저드 상태는 `wizard-client.tsx` 내부의 React `useState`로 관리:
- `currentStep`, `deployId`, `projectId`, `isDeploying`, `pendingDeploy`

### 3.2 TanStack Query Hooks (queries/oneclick.ts)

| Hook | QueryKey | 용도 |
|------|----------|------|
| `useHomepageTemplates` | `['oneclick', 'templates', target]` | 템플릿 목록 (5분 캐시) |
| `useDeployToGitHubPages` | mutation | 배포 실행 |
| `useDeployStatus` | `['oneclick', 'status', id]` | 폴링 (3초) |
| `useMyDeployments` | `['oneclick', 'deployments']` | 내 사이트 목록 |
| `useDeleteDeployment` | mutation | 배포 삭제 |
| `useDeployFiles` | `['oneclick', 'files', id]` | 파일 목록 |
| `useFileContent` | `['oneclick', 'files', id, path]` | 파일 내용 |
| `useUpdateFile` | mutation | 파일 수정 |
| `useBatchApplyFiles` | mutation | 배치 파일 적용 (batch-update API 사용) |

> **삭제됨** (Sprint 1): `useForkTemplate`, `useDeployToVercel`

### 3.3 OAuth 상태 보존
- `localStorage` 키: `linkmap-pending-deploy` (10분 TTL)
- OAuth 리다이렉트 시 `{ templateId, siteName, savedAt }` 보존

---

## 4. 데이터 흐름

### 4.1 배포 요청 흐름
```
[클라이언트]                          [서버]                         [외부]
    │                                   │                              │
    ├─ GET /preflight ─────────────────►│                              │
    │  (계정+쿼터+사이트명 중복 확인)    │                              │
    │◄──────────── { ok, account } ─────┤                              │
    │                                   │                              │
    ├─ POST /deploy ───────────────────►│                              │
    │  { template_id, site_name }       │                              │
    │                                   ├─ checkHomepageDeployQuota ──►│ Supabase
    │                                   ├─ get template ──────────────►│ Supabase
    │                                   ├─ get GitHub account ────────►│ Supabase
    │                                   ├─ decrypt token               │
    │                                   ├─ create project ────────────►│ Supabase
    │                                   ├─ copy service account ──────►│ Supabase
    │                                   ├─ createRepo ────────────────►│ GitHub API
    │                                   ├─ enableGitHubPages ─────────►│ GitHub API
    │                                   ├─ pushFilesAtomically ───────►│ GitHub API
    │                                   ├─ link repo to project ──────►│ Supabase
    │                                   ├─ create homepage_deploys ───►│ Supabase
    │                                   ├─ add project_services ──────►│ Supabase
    │                                   ├─ logAudit ──────────────────►│ Supabase
    │◄──────────── { deploy_id } ───────┤                              │
    │                                   │                              │
    ├─ GET /status (3초 폴링) ──────────►│                              │
    │                                   ├─ getGitHubPagesStatus ──────►│ GitHub API
    │◄──────────── { steps, status } ───┤                              │
```

### 4.2 AI 채팅 흐름
```
[에디터]                              [서버]                         [외부]
    │                                   │                              │
    ├─ POST /ai-chat (SSE) ───────────►│                              │
    │  { messages, fileContent, ... }   │                              │
    │                                   ├─ load ai_assistant_config ──►│ Supabase
    │                                   ├─ resolve API key             │
    │                                   ├─ callAiProvider (SSE) ──────►│ OpenAI/etc
    │◄──────────── SSE stream ─────────┤                              │
    │                                   │                              │
    ├─ 코드 블록 파싱 (클라이언트)       │                              │
    ├─ POST /batch-update ─────────────►│                              │
    │  { files: [{path, content}] }    │                              │
    │                                   ├─ pushFilesAtomically ───────►│ GitHub API
    │◄──────────── { sha } ────────────┤                              │
```

### 4.3 모듈 에디터 흐름
```
[모듈 패널]                           [코드 제너레이터]              [서버]
    │                                   │                              │
    ├─ 폼 값 변경 ──────────────────────►│                              │
    │                                   │                              │
    ├─ [코드에 적용] 클릭                │                              │
    │  ─────────────────────────────────►│                              │
    │                                   ├─ generateConfigTs()          │
    │                                   ├─ generatePageTsx()           │
    │                                   ├─ generateHeroSection()       │
    │                                   ├─ generateGlobalsCss()        │
    │◄──────── GeneratedFile[] ─────────┤                              │
    │                                   │                              │
    ├─ POST /batch-update ─────────────────────────────────────────────►│
    │                                   │                              │
    │◄──────────── { sha } ────────────────────────────────────────────┤
```

---

## 5. 보안 레이어

```
[요청] → Rate Limit → Auth Check → Zod Validation → Business Logic → Audit Log
      (Cloudflare Rules)  (Supabase)   (스키마 검증)      (RLS 적용)     (fire & forget)
```

| 레이어 | 구현 | 파일 |
|--------|------|------|
| Rate Limit | Cloudflare Rate Limiting Rules | (Cloudflare 대시보드, 외부 인프라) |
| 인증 | `supabase.auth.getUser()` | 각 route.ts |
| 입력 검증 | Zod `safeParse` + 금지 경로 차단 | `lib/validations/oneclick.ts` |
| 토큰 보안 | AES-256-GCM 암호화 | `lib/crypto/index.ts` |
| 데이터 접근 | Supabase RLS | `014_homepage_deploys.sql` |
| 감사 로그 | `logAudit()` | `lib/audit.ts` |
