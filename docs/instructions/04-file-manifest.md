# File Manifest: 변경 전후 파일 경로 매핑

## Phase 1: 문서 생성 (코드 변경 없음)

| Action | Path |
|--------|------|
| CREATE | `docs/instructions/01-module-specification.md` |
| CREATE | `docs/instructions/02-refactoring-criteria.md` |
| CREATE | `docs/instructions/03-master-prompt.md` |
| CREATE | `docs/instructions/04-file-manifest.md` |

---

## Phase 2: Types 분할

### 생성 파일

| Before | After | 내용 |
|--------|-------|------|
| `src/types/index.ts` (line 1-65) | `src/types/core.ts` | ServiceCategory, ServiceDomain, enums, Profile, EasyCategory |
| `src/types/index.ts` (line 235-454) | `src/types/service.ts` | Service, EnvVarTemplate, ServiceDomain*, Subcategory, Guide, Comparison, CostTier, Changelog |
| `src/types/index.ts` (line 224-332) | `src/types/project.ts` | Project, ProjectService, ProjectTemplate, ProjectWithServices, ChecklistItem |
| `src/types/index.ts` (line 303-314, 456-465, 636-638) | `src/types/env.ts` | EnvironmentVariable, HealthCheck, ConflictType re-export |
| `src/types/index.ts` (line 92-222) | `src/types/ai.ts` | AiAssistantConfig, AiPersona, AiProvider, AiGuardrails, AiPromptTemplate, AiUsage* |
| `src/types/index.ts` (line 63-80) | `src/types/connection.ts` | UserConnection, ConnectionStatus, UserConnectionType |
| `src/types/index.ts` (line 467-574) | `src/types/service-account.ts` | ServiceAccount, LinkedAccount, LinkedResource, OAuth/APIKey configs |
| `src/types/index.ts` (line 576-632) | `src/types/dashboard.ts` | DashboardLayer, ServiceCardData, LayerData, DashboardMetrics, DashboardResponse |

### 수정 파일

| File | Change |
|------|--------|
| `src/types/index.ts` | 638줄 → barrel re-export (~15줄) |

---

## Phase 3: GitHub API 분할

### 생성 파일

| Before | After | 내용 |
|--------|-------|------|
| `src/lib/github/api.ts` (line 1-52) | `src/lib/github/client.ts` | githubFetch, GitHubApiError, GITHUB_API_BASE, USER_AGENT, GitHubRequestOptions |
| `src/lib/github/api.ts` (line 56-91, 237-343) | `src/lib/github/repos.ts` | GitHubRepo, listUserRepos, getRepo, createRepo, deleteRepo, updateRepoSettings |
| `src/lib/github/api.ts` (line 93-127, 225-235) | `src/lib/github/secrets.ts` | GitHubSecret, GitHubPublicKey, listRepoSecrets, getRepoPublicKey, createOrUpdateSecret, deleteSecret |
| `src/lib/github/api.ts` (line 189-223, 518-597) | `src/lib/github/pages.ts` | GitHubPagesResult, enableGitHubPages*, getGitHubPagesStatus, WorkflowRun, getLatestWorkflowRun, triggerWorkflowDispatch |
| `src/lib/github/api.ts` (line 259-330) | `src/lib/github/content.ts` | GitHubContentItem, GitHubFileContentResponse, GitHubFileContentResult, listRepoContents, getFileContent, createOrUpdateFileContent |
| `src/lib/github/api.ts` (line 345-516) | `src/lib/github/git-data.ts` | GitBlob, GitTree, GitCommit, GitRef, createBlob, createTree, createCommit, createRef, getRef, updateRef, pushFilesAtomically |
| `src/lib/github/api.ts` (line 131-187) | `src/lib/github/forks.ts` | GitHubForkResult, GitHubGenerateResult, forkRepo, generateFromTemplate |

### 수정 파일

| File | Change |
|------|--------|
| `src/lib/github/api.ts` | 598줄 → barrel re-export (~20줄) |

---

## Phase 4: 중복 코드 추출

### 생성 파일

| File | 내용 |
|------|------|
| `src/lib/oneclick/deploy-status.ts` | resolveDeployStatus(), buildDeploySteps(), DeployStep/StepStatus 타입 |

### 수정 파일

| File | Change |
|------|--------|
| `src/lib/github/token.ts` | resolveUserGitHubToken(supabase, userId) 함수 추가 |
| `src/app/api/oneclick/status/route.ts` | 인라인 토큰 해결 → resolveUserGitHubToken 사용, buildSteps → import from deploy-status.ts |
| `src/app/api/oneclick/deployments/route.ts` | 인라인 토큰 해결 → resolveUserGitHubToken 사용, refreshDeployStatus → resolveDeployStatus 사용 |

---

## Phase 5: 데이터 파일 정리

### 이동 파일

| Before | After |
|--------|-------|
| `src/data/services.ts` | `src/data/seed/services.ts` |
| `src/data/services-v2.ts` | `src/data/seed/services-v2.ts` |
| `src/data/templates.ts` | `src/data/seed/templates.ts` |
| `src/data/domains.ts` | `src/data/seed/domains.ts` |
| `src/data/subcategories.ts` | `src/data/seed/subcategories.ts` |
| `src/data/service-guides.ts` | `src/data/seed/service-guides.ts` |
| `src/data/cost-tiers.ts` | `src/data/seed/cost-tiers.ts` |
| `src/data/dependencies.ts` | `src/data/seed/dependencies.ts` |
| `src/data/comparisons.ts` | `src/data/seed/comparisons.ts` |
| `src/data/homepage-template-content.ts` | `src/data/oneclick/homepage-template-content.ts` |
| `src/data/homepage-templates.ts` (if exists) | `src/data/oneclick/homepage-templates.ts` |
| `src/data/template-sample-content.ts` | `src/data/oneclick/template-sample-content.ts` |
| `src/data/dev-showcase-template.ts` | `src/data/oneclick/dev-showcase-template.ts` |
| `src/data/personal-brand-template.ts` | `src/data/oneclick/personal-brand-template.ts` |
| `src/data/freelancer-page-template.ts` | `src/data/oneclick/freelancer-page-template.ts` |
| `src/data/small-biz-template.ts` | `src/data/oneclick/small-biz-template.ts` |
| `src/data/flow-presets.ts` | `src/data/ui/flow-presets.ts` |
| `src/data/mock-connections.ts` | `src/data/ui/mock-connections.ts` |
| `src/data/presets.ts` | `src/data/ui/presets.ts` |

### 생성 파일

| File | 내용 |
|------|------|
| `src/data/seed/index.ts` | barrel re-export |
| `src/data/oneclick/index.ts` | barrel re-export |
| `src/data/ui/index.ts` | barrel re-export |

### 유지 파일

| File | 이유 |
|------|------|
| `src/data/service-connections.ts` | 컴포넌트에서 직접 참조, 단독 도메인 |

### 수정 파일 (import 경로 업데이트)

| File | Change |
|------|--------|
| `src/app/api/seed/route.ts` | `@/data/xxx` → `@/data/seed/xxx` (or `@/data/seed`) |
| `src/app/api/oneclick/templates/route.ts` | `@/data/homepage-template-content` → `@/data/oneclick/homepage-template-content` |
| `src/app/api/oneclick/deploy-pages/route.ts` | `@/data/homepage-template-content` → `@/data/oneclick/homepage-template-content` |
| `src/app/api/admin/setup-templates/route.ts` | `@/data/homepage-template-content` → `@/data/oneclick/homepage-template-content` |
| `src/app/api/ai/stack-recommend/route.ts` | `@/data/services` → `@/data/seed/services` |
| `src/app/api/ai/env-doctor/route.ts` | `@/data/services` → `@/data/seed/services` |
| `src/app/api/ai/compare-services/route.ts` | `@/data/services` → `@/data/seed/services` |
| `src/app/api/ai/command/route.ts` | `@/data/services` → `@/data/seed/services` |
| `src/components/landing/services-grid.tsx` | `@/data/services` → `@/data/seed/services` |
| `src/components/landing/flow-architecture-diagram.tsx` | `@/data/flow-presets` → `@/data/ui/flow-presets` |
| `src/components/landing/flow-comparison.tsx` | `@/data/flow-presets` → `@/data/ui/flow-presets` |
| `src/components/landing/connection-dashboard.tsx` | `@/data/mock-connections` → `@/data/ui/mock-connections` |

---

## Summary

| Phase | 생성 | 수정 | 삭제 |
|-------|------|------|------|
| Phase 1 (Docs) | 4 | 0 | 0 |
| Phase 2 (Types) | 8 | 1 | 0 |
| Phase 3 (GitHub) | 7 | 1 | 0 |
| Phase 4 (Dedup) | 1 | 3 | 0 |
| Phase 5 (Data) | 3 barrels | ~12 imports | 0 (move) |
| **Total** | **~23** | **~17** | **0** |
