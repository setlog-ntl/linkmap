# OneLink 아키텍처 & 파일 구조

## 1. 전체 파일 맵

```
src/
├── app/
│   ├── oneclick/
│   │   └── page.tsx                          # 서버 컴포넌트 (인증 체크 후 클라이언트 위임)
│   └── api/oneclick/
│       ├── templates/route.ts                # GET: 템플릿 목록
│       ├── github-check/route.ts             # GET: GitHub 연결 상태 확인
│       ├── deploy-pages/route.ts             # POST: GitHub Pages 배포 (핵심)
│       ├── status/route.ts                   # GET: 배포 상태 폴링
│       ├── deployments/route.ts              # GET: 내 배포 목록
│       ├── deployments/[id]/route.ts         # DELETE: 배포 삭제
│       ├── deployments/[id]/files/route.ts   # GET/PUT: 파일 조회/수정
│       ├── ai-chat/route.ts                  # POST: AI 채팅 (사이트 수정)
│       ├── oauth/authorize/route.ts          # GET: GitHub OAuth 시작
│       ├── fork/route.ts                     # POST: [레거시] 템플릿 Fork
│       └── deploy/route.ts                   # POST: [레거시] Vercel 배포
│
├── components/
│   ├── oneclick/
│   │   ├── oneclick-page-client.tsx           # 동적 로딩 래퍼 (ssr: false)
│   │   ├── wizard-client.tsx                  # 3단계 마법사 메인 로직
│   │   ├── template-picker-step.tsx           # Step 0: 템플릿 선택 + 사이트명
│   │   ├── auth-gate-step.tsx                 # Step 1-a: 비로그인 → 로그인 유도
│   │   ├── github-connect-step.tsx            # Step 1-b: GitHub 미연결 → OAuth
│   │   └── deploy-step.tsx                    # Step 2: 배포 진행 & 결과
│   └── my-sites/
│       ├── my-sites-client.tsx                # 배포된 사이트 목록 대시보드
│       ├── deploy-site-card.tsx               # 개별 사이트 카드
│       ├── site-editor-client.tsx             # 웹 코드 에디터
│       └── chat-terminal.tsx                  # AI 채팅 터미널
│
├── stores/
│   └── oneclick-store.ts                      # Zustand (persist)
│
├── lib/
│   ├── queries/
│   │   ├── oneclick.ts                        # TanStack Query 훅 (12개)
│   │   └── keys.ts                            # QueryKey 팩토리
│   └── validations/
│       └── oneclick.ts                        # Zod 스키마 (5개)
│
├── data/
│   ├── homepage-templates.ts                  # 템플릿 시드 데이터 (5개)
│   ├── homepage-template-content.ts           # 번들 템플릿 파일 (HTML/CSS)
│   └── dev-showcase-template.ts               # Dev Showcase 템플릿 (분리)
│
supabase/migrations/
└── 016_oneclick_github_pages.sql              # DB 스키마 (Pages 지원)
```

---

## 2. 컴포넌트 아키텍처

### 2.1 페이지 레이어
```
/oneclick (page.tsx - Server Component)
  └─ OneclickPageClient (oneclick-page-client.tsx - Client, dynamic import)
       └─ OneclickWizardClient (wizard-client.tsx - Client)
            ├─ TemplatePickerStep   (Step 0)
            ├─ AuthGateStep         (Step 1 - 비로그인)
            ├─ GitHubConnectStep    (Step 1 - 로그인)
            └─ DeployStep           (Step 2)
```

### 2.2 My Sites 레이어
```
/my-sites (page - Server Component)
  └─ MySitesClient
       ├─ DeploySiteCard (× N)
       └─ [링크] /my-sites/[id]/edit
            └─ SiteEditorClient
                 └─ ChatTerminal
```

### 2.3 동적 로딩 패턴
- `OneclickPageClient`는 `next/dynamic`으로 `ssr: false` 로딩
- Next.js 16에서 `dynamic({ ssr: false })`는 반드시 `'use client'` 컴포넌트 내부에서 사용

---

## 3. 상태 관리

### 3.1 Zustand Store (oneclick-store.ts)
```typescript
interface OneclickState {
  selectedTemplateId: string | null;
  siteName: string;
  currentStep: number;
  // actions
  setSelectedTemplateId, setSiteName, setCurrentStep, reset
}
```
- `persist` 미들웨어로 `localStorage`에 저장 (키: `linkmap-oneclick`)
- **문제**: wizard-client.tsx는 자체 `useState`로 step을 관리 → **store와 중복**

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
| `useBatchApplyFiles` | mutation | 배치 파일 적용 |
| `useForkTemplate` | mutation | [레거시] Fork |
| `useDeployToVercel` | mutation | [레거시] Vercel 배포 |

### 3.3 세션 스토리지
- `sessionStorage` 키: `linkmap-pending-deploy`
- OAuth 리다이렉트 시 `{ templateId, siteName }` 보존

---

## 4. 데이터 흐름

### 4.1 배포 요청 흐름
```
[클라이언트]                          [서버]                         [외부]
    │                                   │                              │
    ├─ POST /deploy-pages ──────────────►                              │
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
    ├─ GET /status (3초 폴링) ──────────►                              │
    │                                   ├─ getGitHubPagesStatus ──────►│ GitHub API
    │◄──────────── { steps, status } ───┤                              │
```

### 4.2 AI 채팅 흐름
```
[에디터]                              [서버]                         [외부]
    │                                   │                              │
    ├─ POST /ai-chat ──────────────────►│                              │
    │  { messages, fileContent, ... }   │                              │
    │                                   ├─ load ai_assistant_config ──►│ Supabase
    │                                   ├─ load ai_personas ──────────►│ Supabase
    │                                   ├─ check guardrails ──────────►│ Supabase
    │                                   ├─ resolve API key             │
    │                                   ├─ callAiProvider ────────────►│ OpenAI/etc
    │                                   ├─ log usage ─────────────────►│ Supabase
    │◄──────────── { reply } ───────────┤                              │
    │                                   │                              │
    ├─ 코드 블록 파싱 (클라이언트)       │                              │
    ├─ PUT /deployments/[id]/files ────►│                              │
    │                                   ├─ GitHub API (파일 업데이트) ─►│ GitHub API
```

---

## 5. 보안 레이어

```
[요청] → Rate Limit → Auth Check → Zod Validation → Business Logic → Audit Log
         (in-memory)   (Supabase)   (스키마 검증)      (RLS 적용)     (fire & forget)
```

| 레이어 | 구현 | 파일 |
|--------|------|------|
| Rate Limit | 인메모리 IP/User 기반 | `lib/rate-limit.ts` |
| 인증 | `supabase.auth.getUser()` | 각 route.ts |
| 입력 검증 | Zod `safeParse` | `lib/validations/oneclick.ts` |
| 토큰 보안 | AES-256-GCM 암호화 | `lib/crypto/index.ts` |
| 데이터 접근 | Supabase RLS | `016_oneclick_github_pages.sql` |
| 감사 로그 | `logAudit()` | `lib/audit.ts` |
