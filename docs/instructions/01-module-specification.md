# 01 - 모듈 아키텍처 명세

> Linkmap 모듈 경계 참조 (기여자용)
> 최종 수정: 2026-02-20

---

## 1. 모듈 개요

Linkmap은 `src/lib/` 하위 7개 도메인 모듈로 구성되며, 공용 인프라(API 에러, 암호화, 감사, Supabase 클라이언트, i18n, 쿼리, 스토어)로 지원됩니다.

### 1.1 모듈 요약 표

| 모듈 | 디렉터리 | 파일 수 | 공개 API | 주요 사용처 |
|------|----------|---------|----------|-------------|
| **core** | `src/lib/api/`, `src/lib/crypto/`, `src/lib/audit.ts`, `src/lib/admin.ts`, `src/lib/quota.ts`, `src/lib/supabase/`, `src/lib/queries/keys.ts`, `src/lib/i18n/`, `src/lib/utils.ts`, `src/lib/validations/` | ~25 | 에러 헬퍼, encrypt/decrypt, logAudit, isAdmin, getUserQuota, Supabase 클라이언트(3종), queryKeys, t(), cn() | 모든 API 라우트, 모든 모듈 |
| **github** | `src/lib/github/` | 5 | GitHub API 래퍼(20+ 메서드), safeDecryptToken, encryptSecretForGitHub, autoMapEnvVars, triggerAutoSync | API: github/*, oneclick/*, env/ |
| **env** | `src/lib/env/` | 1 | detectConflicts() | API: env/conflicts/ |
| **ai** | `src/lib/ai/` | 4 | callOpenAIStructured, callOpenAIWithTools, callOpenAIStream, callAiProvider, resolveOpenAIKey, checkGuardrails | API: ai/*, admin/ai-* |
| **oneclick** | `src/lib/queries/oneclick.ts` | 1 | useHomepageTemplates, useDeployToGitHubPages, useDeployStatus, useMyDeployments, useDeployFiles, useUpdateFile, useBatchApplyFiles, useDeleteDeployment | 원클릭 페이지 컴포넌트 |
| **health-check** | `src/lib/health-check/` | 12 | runHealthCheck(), getAdapter(), listAdapters() | API: health-check/ |
| **connections** | `src/lib/connections/` | 1 | suggestAutoConnections() | API: connections/auto/ |

### 1.2 모듈 상세

#### core (기반 레이어)

core 모듈은 다른 모든 모듈이 의존하는 공용 인프라를 제공합니다. 단일 디렉터리가 아니라 기반 파일들의 묶음입니다.

| 파일 | 내보내기 | 용도 |
|------|----------|------|
| `src/lib/api/errors.ts` | `apiError`, `unauthorizedError`, `notFoundError`, `validationError`, `serverError` | 표준 HTTP 에러 응답. 모든 API 라우트는 직접 에러 객체를 만들지 말고 이것만 사용해야 함. |
| `src/lib/crypto/index.ts` | `encrypt`, `decrypt`, `maskValue` | 환경 변수·OAuth 토큰용 AES-256-GCM 암호화. 서버 전용. 키: `ENCRYPTION_KEY` 64자 hex. |
| `src/lib/audit.ts` | `logAudit`, `AuditAction`(54종) | Admin Supabase 클라이언트로 감사 로깅. 비차단, 메인 플로우를 깨지 않음. |
| `src/lib/admin.ts` | `isAdmin` | service_role 클라이언트로 관리자 여부 확인(RLS 우회). |
| `src/lib/quota.ts` | `getUserQuota`, `checkHomepageDeployQuota`, `checkProjectQuota` | 플랜 기반 할당량 적용(무료/유료). |
| `src/lib/supabase/server.ts` | `createClient`(async) | 쿠키 기반 인증의 서버 Supabase 클라이언트. API 라우트·서버 컴포넌트용. |
| `src/lib/supabase/client.ts` | `createClient`(sync) | 브라우저 Supabase 클라이언트. 클라이언트 컴포넌트용. |
| `src/lib/supabase/admin.ts` | `createAdminClient` | service_role 클라이언트. **감사 로그·관리자 작업 전용.** |
| `src/lib/supabase/session.ts` | `updateSession` | 미들웨어 세션 갱신 및 라우트 보호. |
| `src/lib/supabase/types.ts` | DB용 타입 별칭 | Supabase 쿼리 결과 타입. |
| `src/lib/queries/keys.ts` | `queryKeys` | TanStack Query 키 팩토리(13 도메인, 40+ 키). 캐시 무효화 단일 소스. |
| `src/lib/i18n/index.ts` | `t`, `getMessages`, `localeNames`, `Locale` | i18n: 한국어 우선, 영어 지원. Zustand `locale-store`가 UI 언어 결정. |
| `src/lib/utils.ts` | `cn` | Tailwind CSS 클래스 병합(clsx + tailwind-merge). |
| `src/lib/hooks/use-streaming.ts` | `useStreaming` | 클라이언트 SSE 스트림 훅(abort, 점진적 텍스트). |
| `src/lib/validations/*.ts` | 17개 Zod 스키마 파일 | API 라우트 입력 검증. 항상 `safeParse` 사용(`parse` 금지). |

#### github (GitHub 연동)

OAuth 토큰 관리와 함께 하는 GitHub REST API 래퍼:

| 파일 | 내보내기 | 용도 |
|------|----------|------|
| `api.ts` | `listUserRepos`, `getRepo`, `listRepoSecrets`, `getRepoPublicKey`, `createOrUpdateSecret`, `deleteSecret`, `forkRepo`, `generateFromTemplate`, `enableGitHubPages`, `enableGitHubPagesWithActions`, `getGitHubPagesStatus`, `createRepo`, `createOrUpdateFileContent`, `listRepoContents`, `getFileContent`, `updateRepoSettings`, `pushFilesAtomically`, `triggerWorkflowDispatch`, `getLatestWorkflowRun`, `deleteRepo`, `GitHubApiError` | 모든 GitHub REST 호출은 `githubFetch()` 경유. 에러는 `GitHubApiError` 클래스로 처리. |
| `token.ts` | `safeDecryptToken` | OAuth 토큰 복호화. 실패 시 폴백으로 계정을 'expired'로 표시(키 로테이션 시나리오). |
| `nacl-encrypt.ts` | `encryptSecretForGitHub` | GitHub Secrets API용 NaCl sealed-box 암호화(tweetnacl). |
| `auto-map.ts` | `mapEnvVarToSecretName`, `autoMapEnvVars` | Linkmap env 이름을 GitHub Secrets 유효 이름으로 매핑, 충돌 감지. |
| `auto-sync.ts` | `triggerAutoSync` | auto_sync_enabled 저장소가 있을 때 env 변수를 GitHub Secrets로 비차단 푸시. 의존: crypto, api, nacl-encrypt, auto-map, audit. |

#### env (환경 변수 인텔리전스)

| 파일 | 내보내기 | 용도 |
|------|----------|------|
| `conflict-detector.ts` | `detectConflicts`, `ConflictType`, `ConflictSeverity`, `EnvConflict`, `EnvConflictEntry` | 환경 간 충돌 감지: 누락 값, 중요 불일치, 설정 불일치. 심각도순 정렬. |

#### ai (AI 기능)

서로 다른 OpenAI API 기법을 쓰는 5가지 기능:

| 파일 | 내보내기 | 용도 |
|------|----------|------|
| `openai.ts` | `callOpenAIStructured<T>`, `callOpenAIWithTools`, `callOpenAIStream`, `ToolDefinition` | (1) JSON 스키마 구조 출력, (2) 툴 루프 함수 호출, (3) SSE 스트리밍. |
| `resolve-key.ts` | `resolveOpenAIKey` | `OPENAI_API_KEY` env 또는 DB `ai_providers`(암호화)에서 API 키 해석. |
| `providers.ts` | `callAiProvider`, `AiChatRequest`, `AiChatResponse` | OpenAI, Anthropic, Google Gemini 멀티 프로바이더 디스패처. 관리자 AI 플레이그라운드용. |
| `guardrails.ts` | `checkGuardrails`, `GuardrailResult` | 입력 안전: 대화 턴 제한, 토큰 제한, 차단어, 금지 주제. |

#### health-check (서비스 헬스 모니터링)

외부 서비스 API로 헬스를 확인하는 어댑터 패턴:

| 파일 | 내보내기 | 용도 |
|------|----------|------|
| `index.ts` | `runHealthCheck` | 진입점: env 복호화 → 어댑터 실행 → 민감 데이터 메모리에서 제거. |
| `types.ts` | `HealthCheckAdapter`, `HealthCheckResult`, `HealthCheckStatus` | 어댑터 패턴 인터페이스. |
| `registry.ts` | `getAdapter`, `getOrCreateAdapter`, `listAdapters` | 내장 8개 + generic 폴백 어댑터 레지스트리. |
| `adapters/*.ts` | 9개 어댑터 | openai, anthropic, stripe, supabase, clerk, resend, vercel, sentry, generic. |

#### connections (서비스 연결 인텔리전스)

| 파일 | 내보내기 | 용도 |
|------|----------|------|
| `auto-connect.ts` | `suggestAutoConnections` | 프로젝트 서비스와 전역 의존 그래프를 기준으로, 아직 없는 연결을 제안. 의존 타입별 우선순위. |

---

## 2. API 라우트 매핑

모든 API 라우트는 **인증 → Zod safeParse → 소유권 확인 → 비즈니스 로직 → 감사 로그** 5단계 패턴을 따릅니다.

### 2.1 환경 변수 (`/api/env/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/env` | POST | User | `createEnvVarSchema` | `env_var.create` |
| `/api/env` | PUT | User | `updateEnvVarSchema` | `env_var.update` |
| `/api/env` | DELETE | User | id(query) | `env_var.delete` |
| `/api/env/bulk` | POST | User | `bulkEnvVarSchema` | `env_var.bulk_create` |
| `/api/env/decrypt` | POST | User | id(body) | `env_var.decrypt` |
| `/api/env/download` | POST | User | project_id, environment | `env_var.download` |
| `/api/env/conflicts` | GET | User | project_id(query) | `env_var.conflict_scan` |
| `/api/env/conflicts/resolve` | POST | User | `resolveConflictSchema` | `env_var.conflict_resolve` |

### 2.2 프로젝트 (`/api/projects/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/projects` | GET | User | - | - |
| `/api/projects` | POST | User | `createProjectSchema` | `project.create` |
| `/api/projects/[id]` | GET | User | - | - |
| `/api/projects/[id]` | PUT | User | `updateProjectSchema` | `project.update` |
| `/api/projects/[id]` | DELETE | User | - | `project.delete` |
| `/api/projects/[id]/dashboard` | GET | User | - | - |
| `/api/projects/[id]/linked-accounts` | GET | User | - | - |
| `/api/projects/[id]/layer-override` | PUT | User | body 검증 | `layer_override.upsert` |

### 2.3 연결 (`/api/connections/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/connections` | GET | User | project_id(query) | - |
| `/api/connections` | POST | User | `createConnectionSchema` | `connection.create` |
| `/api/connections/[id]` | PUT | User | `updateConnectionSchema` | `connection.update` |
| `/api/connections/[id]` | DELETE | User | - | `connection.delete` |
| `/api/connections/auto` | POST | User | project_id(body) | `connection.auto_create` |

### 2.4 GitHub (`/api/github/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/github/repos` | GET | User | project_id(query) | - |
| `/api/github/repos/link` | POST | User | `linkRepoSchema` | `github.repo_link` |
| `/api/github/repos/link` | DELETE | User | - | `github.repo_unlink` |
| `/api/github/secrets` | GET | User | project_id, owner, repo(query) | - |
| `/api/github/secrets` | POST | User | `pushSecretsSchema` | `github.secrets_push` |

### 2.5 서비스 계정 (`/api/service-accounts/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/service-accounts` | POST | User | `connectApiKeySchema` | `service_account.connect_api_key` |
| `/api/service-accounts/[id]` | DELETE | User | - | `service_account.disconnect` |
| `/api/service-accounts/verify` | POST | User | `verifyAccountSchema` | `service_account.verify` |

### 2.6 OAuth (`/api/oauth/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/oauth/[provider]/authorize` | GET | User | project_id, service_id, service_slug(query) | - |
| `/api/oauth/[provider]/callback` | GET | - (state 토큰) | - | `service_account.connect_oauth` |
| `/api/account/connected-accounts` | GET | User | - | - |

### 2.7 헬스 체크 (`/api/health-check/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/health-check` | POST | User | `runHealthCheckSchema` | `service.health_check` |

### 2.8 원클릭 배포 (`/api/oneclick/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/oneclick/templates` | GET | User | deploy_target(query) | - |
| `/api/oneclick/deploy-pages` | POST | User | `deployPagesRequestSchema` | `oneclick.deploy_pages` |
| `/api/oneclick/status` | GET | User | `statusQuerySchema` | - |
| `/api/oneclick/github-check` | GET | User | - | - |
| `/api/oneclick/oauth/authorize` | GET | User | - | - |
| `/api/oneclick/deployments` | GET | User | - | - |
| `/api/oneclick/deployments/[id]` | DELETE | User | - | `oneclick.deploy_delete` |
| `/api/oneclick/deployments/[id]/files` | GET | User | path(query) | - |
| `/api/oneclick/deployments/[id]/files` | PUT | User | `fileUpdateSchema` | `oneclick.file_edit` |
| `/api/oneclick/deployments/[id]/batch-update` | POST | User | files 배열 | `oneclick.batch_update` |
| `/api/oneclick/ai-chat` | POST | User | messages(body) | - |

### 2.9 AI 기능 (`/api/ai/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 | OpenAI 기법 |
|------|--------|------|------------|-----------|-------------|
| `/api/ai/stack-recommend` | POST | User | `stackRecommendSchema` | `ai.stack_recommend` | Structured Output |
| `/api/ai/env-doctor` | POST | User | `envDoctorSchema` | `ai.env_doctor` | Function Calling |
| `/api/ai/map-narrate` | POST | User | body 검증 | `ai.map_narrate` | SSE Streaming |
| `/api/ai/compare-services` | POST | User | `compareServicesSchema` | `ai.compare_services` | Rich Context Chat |
| `/api/ai/command` | POST | User | `aiCommandSchema` | `ai.command` | Function Calling |

### 2.10 관리자 (`/api/admin/`)

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/admin/ai-config` | GET/PUT | Admin | `updateGlobalConfigSchema` | `admin.ai_config_update` |
| `/api/admin/ai-personas` | GET/POST | Admin | `createPersonaSchema` | `admin.ai_persona_create` |
| `/api/admin/ai-personas/[id]` | PUT/DELETE | Admin | `updatePersonaSchema` | `admin.ai_persona_update`, `admin.ai_persona_delete` |
| `/api/admin/ai-providers` | GET/PUT | Admin | `updateProviderSchema` | `admin.ai_provider_update` |
| `/api/admin/ai-guardrails` | GET/PUT | Admin | `updateGuardrailsSchema` | `admin.ai_guardrails_update` |
| `/api/admin/ai-templates` | GET/POST | Admin | `createTemplateSchema` | `admin.ai_template_create` |
| `/api/admin/ai-templates/[id]` | PUT/DELETE | Admin | `updateTemplateSchema` | `admin.ai_template_update`, `admin.ai_template_delete` |
| `/api/admin/ai-usage` | GET | Admin | period(query) | - |
| `/api/admin/ai-playground` | POST | Admin | `playgroundSchema` | `admin.ai_playground_test` |
| `/api/admin/setup-templates` | POST | Admin | - | `admin.setup_templates` |

### 2.11 기타 라우트

| 경로 | Method | 인증 | Zod 스키마 | 감사 액션 |
|------|--------|------|------------|-----------|
| `/api/teams` | POST | User | body 검증 | - |
| `/api/teams/[id]/members` | POST/DELETE | User | body 검증 | `team_member.add`, `team_member.remove` |
| `/api/tokens` | GET/POST/DELETE | User | body 검증 | - |
| `/api/stripe/checkout` | POST | User | body 검증 | - |
| `/api/stripe/webhook` | POST | Stripe 서명 | - | - |
| `/api/seed` | POST | Admin | - | - |

---

## 3. 의존성 다이어그램

```mermaid
graph TD
    subgraph "Core (기반)"
        ERRORS["api/errors.ts"]
        CRYPTO["crypto/index.ts"]
        AUDIT["audit.ts"]
        ADMIN["admin.ts"]
        QUOTA["quota.ts"]
        SB_SERVER["supabase/server.ts"]
        SB_CLIENT["supabase/client.ts"]
        SB_ADMIN["supabase/admin.ts"]
        KEYS["queries/keys.ts"]
        I18N["i18n/index.ts"]
        UTILS["utils.ts"]
        VALIDATIONS["validations/*.ts"]
    end

    subgraph "github"
        GH_API["github/api.ts"]
        GH_TOKEN["github/token.ts"]
        GH_NACL["github/nacl-encrypt.ts"]
        GH_MAP["github/auto-map.ts"]
        GH_SYNC["github/auto-sync.ts"]
    end

    subgraph "env"
        CONFLICT["env/conflict-detector.ts"]
    end

    subgraph "ai"
        AI_OPENAI["ai/openai.ts"]
        AI_RESOLVE["ai/resolve-key.ts"]
        AI_PROV["ai/providers.ts"]
        AI_GUARD["ai/guardrails.ts"]
    end

    subgraph "health-check"
        HC_INDEX["health-check/index.ts"]
        HC_REG["health-check/registry.ts"]
        HC_ADAPT["health-check/adapters/*"]
    end

    subgraph "connections"
        CONN_AUTO["connections/auto-connect.ts"]
    end

    subgraph "Hooks & Queries (클라이언트)"
        STREAMING["hooks/use-streaming.ts"]
        Q_ONECLICK["queries/oneclick.ts"]
        Q_PROJECTS["queries/projects.ts"]
        Q_ENV["queries/env-vars.ts"]
        Q_GITHUB["queries/github.ts"]
        Q_HEALTH["queries/health-checks.ts"]
        Q_CONN["queries/connections.ts"]
    end

    subgraph "Stores (Zustand)"
        S_UI["stores/ui-store.ts"]
        S_PROJECT["stores/project-store.ts"]
        S_LOCALE["stores/locale-store.ts"]
        S_DASH["stores/dashboard-store.ts"]
        S_MAP["stores/service-map-store.ts"]
    end

    %% Core 의존
    AUDIT --> SB_ADMIN
    ADMIN --> SB_ADMIN
    QUOTA --> SB_SERVER

    %% GitHub 의존
    GH_TOKEN --> CRYPTO
    GH_SYNC --> SB_ADMIN
    GH_SYNC --> CRYPTO
    GH_SYNC --> GH_API
    GH_SYNC --> GH_NACL
    GH_SYNC --> GH_MAP
    GH_SYNC --> AUDIT

    %% AI 의존
    AI_RESOLVE --> SB_ADMIN
    AI_RESOLVE --> CRYPTO

    %% Health-check 의존
    HC_INDEX --> CRYPTO
    HC_INDEX --> HC_REG
    HC_REG --> HC_ADAPT

    %% Query 의존
    Q_ONECLICK --> KEYS
    Q_PROJECTS --> KEYS
    Q_ENV --> KEYS
    Q_GITHUB --> KEYS
    Q_HEALTH --> KEYS
    Q_CONN --> KEYS

    %% Store 의존
    S_LOCALE --> I18N
```

### 텍스트 기반 의존 요약

```
API 라우트 (임의)
  |-- core/errors       (에러 응답)
  |-- core/supabase     (인증·쿼리용 서버 클라이언트)
  |-- core/validations  (Zod safeParse)
  |-- core/audit        (logAudit)
  |-- core/crypto       (encrypt/decrypt)
  |
  |-- github/*          (GitHub API 라우트)
  |     |-- github/api          (REST 래퍼)
  |     |-- github/token        (OAuth 토큰 복호화)
  |     |-- github/nacl-encrypt (GitHub Secrets 암호화)
  |     |-- github/auto-map     (env 이름 매핑)
  |     |-- github/auto-sync    (env 변경 시 GitHub 푸시)
  |           |-- core/crypto, core/audit, github/api, github/nacl, github/auto-map
  |
  |-- env/*             (충돌 감지 라우트)
  |     |-- env/conflict-detector (환경 간 분석)
  |
  |-- ai/*              (AI 기능 라우트)
  |     |-- ai/openai       (3가지 호출 방식)
  |     |-- ai/resolve-key  (env 또는 DB에서 키)
  |     |-- ai/providers    (멀티 프로바이더 디스패치)
  |     |-- ai/guardrails   (안전 검사)
  |
  |-- health-check/*    (헬스 모니터링 라우트)
  |     |-- health-check/index    (진입점)
  |     |-- health-check/registry (어댑터 조회)
  |     |-- health-check/adapters (내장 8개 + generic)
  |
  |-- connections/*    (연결 라우트)
        |-- connections/auto-connect (제안 엔진)
```

---

## 4. 타입 도메인 분류

모든 타입은 현재 `src/types/index.ts`(638줄)에 있으며, 8개 도메인으로 나뉩니다.

### 4.1 타입 도메인

| 도메인 | 타입 | 줄 범위 | 설명 |
|--------|------|---------|------|
| **core** | `ServiceCategory`, `ServiceDomain`, `DifficultyLevel`, `FreeTierQuality`, `VendorLockInRisk`, `DependencyType`, `ChangeType`, `ServiceStatus`, `Environment`, `HealthCheckStatus`, `TeamRole`, `EasyCategory`, `Profile` | L1-90 | 공용 enum·기반 타입 |
| **service** | `Service`, `EnvVarTemplate`, `ServiceDomainRecord`, `ServiceSubcategory`, `ServiceDependency`, `ServiceGuide`, `SetupStep`, `CommonPitfall`, `IntegrationTip`, `LocalizedText`, `ServiceComparison`, `ComparisonCriterion`, `ServiceCostTier`, `CostFeature`, `ServiceChangelog` | L235-454 | 서비스 카탈로그·메타데이터 |
| **project** | `Project`, `ProjectService`, `ProjectTemplate`, `ProjectWithServices`, `ChecklistItem`, `UserChecklistProgress` | L224-301 | 프로젝트 관리 타입 |
| **env** | `EnvironmentVariable`, `ConflictType`, `ConflictSeverity`, `EnvConflict`, `EnvConflictEntry` | L303-314, L634-638 | 환경 변수 타입(`lib/env` 재내보내기 포함) |
| **ai** | `AiAssistantConfig`, `AiProviderSlug`, `ContentFilterLevel`, `TemplateCategory`, `AiPersona`, `AiProviderModel`, `AiProvider`, `AiGuardrails`, `AiPromptTemplate`, `AiUsageLog`, `AiUsageSummary` | L92-222 | AI 설정, 페르소나, 프로바이더, 가드레일 |
| **connection** | `UserConnectionType`, `ConnectionStatus`, `UserConnection` | L63-80 | 사용자 정의 서비스 연결 |
| **service-account** | `ServiceAccountConnectionType`, `ServiceAccountStatus`, `ServiceAccount`, `LinkedAccount`, `LinkedResource`, `ServiceOAuthConfig`, `ApiKeyFieldConfig`, `ServiceConnectionConfig` | L467-574 | OAuth/API 키 계정·연결 리소스 |
| **dashboard** | `DashboardLayer`, `DashboardSubcategory`, `ServiceCardData`, `LayerData`, `DashboardMetrics`, `DashboardResponse`, `HealthCheck` | L456-632 | 대시보드 뷰 타입 |

---

## 5. Zustand 스토어

클라이언트 UI·세션 상태를 다루는 스토어 5개:

| 스토어 | 파일 | 상태 | 지속성 |
|--------|------|------|--------|
| `useUIStore` | `src/stores/ui-store.ts` | `sidebarOpen`, `commandOpen`, `aiCommandMode` | 없음(페이지 로드 시 초기화) |
| `useProjectStore` | `src/stores/project-store.ts` | `activeProjectId` | 없음 |
| `useLocaleStore` | `src/stores/locale-store.ts` | `locale` (`'ko'` / `'en'`) | `zustand/persist`로 `localStorage` |
| `useDashboardStore` | `src/stores/dashboard-store.ts` | `activeTab`, `expandedCardId`, `showConnections`, `selectedConnectionId` | 없음 |
| `useServiceMapStore` | `src/stores/service-map-store.ts` | `catalogSidebarOpen`, `viewMode`, `focusedNodeId`, `collapsedGroups`, `contextMenu`, `expandedNodeId`, `bottomPanelOpen` | 없음 |

---

## 6. TanStack Query 키 도메인

`src/lib/queries/keys.ts`의 `queryKeys` 팩토리가 13개 데이터 도메인용 캐시 키를 정의합니다.

| 도메인 | 키 패턴 | 사용처 |
|--------|---------|--------|
| `projects` | `['projects']`, `['projects', id]` | 대시보드, 프로젝트 페이지 |
| `services` | `['services', 'project', projectId]` | 프로젝트 서비스 목록 |
| `envVars` | `['env-vars', 'project', projectId]`, `['env-vars', 'stats', ...]`, `['env-vars', 'conflicts', ...]` | env 테이블, 충돌 페이지 |
| `catalog` | `['catalog']` | 서비스 카탈로그 브라우저 |
| `connections` | `['connections', 'project', projectId]` | 연결 관리 |
| `dependencies` | `['dependencies']` | 전역 의존 그래프 |
| `auditLogs` | `['audit-logs', 'project', projectId]` | 감사 로그 뷰어 |
| `healthChecks` | `['health-checks', serviceId]`, `['health-checks', 'latest', projectId]` | 헬스 대시보드 |
| `serviceAccounts` | `['service-accounts', 'project', projectId]` | 계정 관리 |
| `github` | `['github', 'repos', ...]`, `['github', 'linked-repos', ...]`, `['github', 'secrets', ...]` | GitHub 연동 패널 |
| `linkedAccounts` | `['linked-accounts', 'project', projectId, ...]` | 연결 계정 목록 |
| `oneclick` | `['oneclick', 'templates']`, `['oneclick', 'status', deployId]`, `['oneclick', 'deployments']`, `['oneclick', 'files', ...]` | 원클릭 배포 플로우 |
| `ai` / `aiConfig` | `['ai', 'stack-recommend']`, `['ai', 'env-doctor', ...]`, `['ai-config', 'global']`, `['ai-config', 'personas']`, ... | AI 기능, 관리자 AI 설정 |

---

## 7. 검증 스키마

모든 Zod 스키마는 `src/lib/validations/`(17개 파일)에 있습니다.

| 파일 | 스키마 | 사용처 |
|------|--------|--------|
| `env.ts` | `createEnvVarSchema`, `updateEnvVarSchema` | `/api/env` |
| `env-bulk.ts` | `bulkEnvVarSchema` | `/api/env/bulk` |
| `env-conflicts.ts` | `resolveConflictSchema` | `/api/env/conflicts/resolve` |
| `project.ts` | `createProjectSchema`, `updateProjectSchema` | `/api/projects` |
| `connection.ts` | `createConnectionSchema`, `updateConnectionSchema` | `/api/connections` |
| `github.ts` | `linkRepoSchema`, `pushSecretsSchema`, `syncConfigSchema` | `/api/github/*` |
| `health-check.ts` | `runHealthCheckSchema` | `/api/health-check` |
| `service-account.ts` | `connectApiKeySchema`, `initiateOAuthSchema`, `verifyAccountSchema` | `/api/service-accounts/*` |
| `oneclick.ts` | `statusQuerySchema`, `deployPagesRequestSchema`, `fileUpdateSchema` | `/api/oneclick/*` |
| `ai-config.ts` | `createPersonaSchema`, `updatePersonaSchema`, `updateProviderSchema`, `updateGuardrailsSchema`, `createTemplateSchema`, `updateTemplateSchema`, `updateGlobalConfigSchema`, `playgroundSchema` | `/api/admin/ai-*` |
| `ai-stack.ts` | `stackRecommendSchema` | `/api/ai/stack-recommend` |
| `ai-env.ts` | `envDoctorSchema` | `/api/ai/env-doctor` |
| `ai-compare.ts` | `compareServicesSchema` | `/api/ai/compare-services` |
| `ai-command.ts` | `aiCommandSchema` | `/api/ai/command` |

---

## 8. 데이터 파일

`src/data/`의 정적 시드·템플릿(20개 파일):

| 파일 | 용도 |
|------|------|
| `services.ts`, `services-v2.ts` | 서비스 카탈로그 시드 |
| `dependencies.ts` | 서비스 의존 그래프 |
| `domains.ts` | 서비스 도메인 정의 |
| `subcategories.ts` | 서비스 서브카테고리 정의 |
| `comparisons.ts` | 서비스 비교 매트릭스 |
| `cost-tiers.ts` | 서비스 가격 티어 |
| `service-connections.ts` | 사전 정의 서비스 연결 패턴 |
| `service-guides.ts` | 설정 가이드·코드 예시 |
| `templates.ts` | 프로젝트 템플릿 정의 |
| `presets.ts` | 서비스 프리셋 조합 |
| `flow-presets.ts` | React Flow 레이아웃 프리셋 |
| `mock-connections.ts` | 데모용 목 연결 데이터 |
| `homepage-templates.ts` | 원클릭 홈페이지 템플릿 레지스트리 |
| `homepage-template-content.ts` | 템플릿 HTML/CSS 내용 |
| `template-sample-content.ts` | 템플릿 샘플 내용 |
| `dev-showcase-template.ts` | 개발자 포트폴리오 템플릿 |
| `personal-brand-template.ts` | 퍼스널 브랜드 템플릿 |
| `freelancer-page-template.ts` | 프리랜서 페이지 템플릿 |
| `small-biz-template.ts` | 소규모 비즈니스 템플릿 |

---

## 9. 모듈 경계 규칙

새 코드를 어디에 둘지 판단하는 규칙입니다.

1. **새 API 엔드포인트?** `src/app/api/` 하위에 라우트 파일 생성. core 에러 헬퍼, `src/lib/validations/`의 Zod 검증, 감사 로깅 사용.

2. **새 외부 서비스 연동?** GitHub 관련이면 `src/lib/github/`에 추가, 아니면 `src/lib/` 하위에 새 모듈 디렉터리 생성. 적용 가능하면 health-check 어댑터 등록.

3. **새 AI 기능?** `src/app/api/ai/`에 API 라우트, `src/lib/validations/ai-*.ts`에 Zod 스키마 추가. `resolveOpenAIKey()`와 `callOpenAI*` 헬퍼 중 하나 사용.

4. **새 클라이언트 데이터 페칭?** `src/lib/queries/`의 적절한 파일에 TanStack Query 훅 추가, `src/lib/queries/keys.ts`에 키 등록.

5. **새 UI 상태?** 기존 Zustand 스토어를 먼저 사용. 상태 도메인이 기존 스토어와 명확히 분리될 때만 새 스토어 생성.

6. **새 Supabase 쿼리?** `src/lib/supabase/server.ts`의 `createClient()` 사용. 일반 CRUD에 `createAdminClient()` 사용 금지(감사 로그 전용).

7. **새 타입?** 해당 도메인 섹션에 `src/types/index.ts`에 추가. 기존 네이밍 규칙 따르기.
