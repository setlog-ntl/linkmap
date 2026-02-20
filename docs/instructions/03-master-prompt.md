# 마스터 프롬프트: Linkmap 모듈화 리팩토링

## 컨텍스트
Linkmap은 Next.js 16 + Supabase + TypeScript 기반 설정 관리 플랫폼이다.
- 55개+ API 라우트, 67+ lib 파일, 638줄 types, 20개 data 파일
- Cloudflare Workers 배포 (`@opennextjs/cloudflare`)
- 84개 vitest 테스트

## 목표
1. 대형 파일을 도메인별로 분할하여 모듈 경계를 명확히 한다
2. 중복 코드를 공유 모듈로 추출한다
3. 기존 import 호환성을 barrel re-export로 유지한다
4. 테스트, 타입체크, 빌드가 깨지지 않는다

## 제약조건 (CRITICAL)
- 인증/RLS/암호화 코드를 절대 제거하거나 약화시키지 마라
- API 입력은 Zod `safeParse`로 검증 (parse 금지)
- 기존 에러 헬퍼(src/lib/api/errors.ts) 사용 필수
- API 라우트 첫 단계: getUser() → if (!user) return unauthorizedError()
- 민감 작업은 logAudit() 호출 필수
- Rate Limiting은 Cloudflare Rules로 처리 — 앱 코드에 추가 금지

## 페이즈별 지시

### 1단계: 문서 생성
docs/instructions/ 폴더에 4개 문서 생성 (코드 변경 없음)
- 01-module-specification.md: 전체 모듈 아키텍처 명세
- 02-refactoring-criteria.md: 유지/제거/리팩토링 판단 기준
- 03-master-prompt.md: 이 문서 (자급자족형 프롬프트)
- 04-file-manifest.md: 변경 전후 파일 경로 매핑

### 2단계: Types 분할
src/types/index.ts (638줄) → 8개 도메인 파일 + barrel
- core.ts: ServiceCategory, Environment, TeamRole, Profile, enums
- service.ts: Service, EnvVarTemplate, guides, comparisons, cost tiers
- project.ts: Project, ProjectService, ProjectTemplate, ChecklistItem
- env.ts: EnvironmentVariable, HealthCheck
- ai.ts: AiAssistantConfig, AiPersona, AiProvider, AiGuardrails, AiPromptTemplate
- connection.ts: UserConnection, ConnectionStatus, UserConnectionType
- service-account.ts: ServiceAccount, LinkedAccount, LinkedResource, configs
- dashboard.ts: DashboardLayer, ServiceCardData, LayerData, Metrics, Response
- index.ts: barrel re-export (export * from './xxx')

### 3단계: GitHub API 분할
src/lib/github/api.ts (598줄) → 7개 서브모듈 + barrel
- client.ts: githubFetch, GitHubApiError, 공통 타입/상수
- repos.ts: listUserRepos, getRepo, createRepo, deleteRepo, updateRepoSettings
- secrets.ts: listRepoSecrets, getRepoPublicKey, createOrUpdateSecret, deleteSecret
- pages.ts: enableGitHubPages*, getGitHubPagesStatus, getLatestWorkflowRun, triggerWorkflowDispatch
- content.ts: listRepoContents, getFileContent, createOrUpdateFileContent
- git-data.ts: createBlob, createTree, createCommit, createRef, getRef, updateRef, pushFilesAtomically
- forks.ts: forkRepo, generateFromTemplate
- api.ts: barrel re-export

### 4단계: 중복 코드 추출
4-1. GitHub 토큰 해결 통합: resolveUserGitHubToken(supabase, userId) → src/lib/github/token.ts
4-2. Deploy 상태 머신 추출: resolveDeployStatus, buildDeploySteps → src/lib/oneclick/deploy-status.ts
4-3. AI 키 해결 일반화: resolveAIProviderKey(providerSlug) (선택적)

### 5단계: 데이터 파일 정리
src/data/ → seed/, oneclick/, ui/ 서브디렉토리 + barrel index.ts

## 검증 체크리스트 (각 단계 완료 후)
```bash
npm run typecheck   # tsc --noEmit
npm run test        # 84개 테스트 통과
npm run build       # 프로덕션 빌드
```
- 새로운 any 타입 미도입
- 인증/감사 코드 미삭제
- barrel re-export로 기존 import 경로 유지

## 변경하지 않는 것
- 55개 API 라우트 구조 (withAuth 래퍼 추출 DEFER)
- src/lib/api/errors.ts (24줄, 이미 깔끔)
- src/lib/audit.ts (79줄, 잘 구조화)
- src/lib/crypto/index.ts (63줄, AES-256-GCM)
- src/lib/queries/ (14개, keys.ts 팩토리 패턴)
- src/stores/ (5개, 도메인 특화)
- src/lib/health-check/ (10개, 어댑터 패턴)
- src/lib/validations/ (12개, Zod 스키마)
