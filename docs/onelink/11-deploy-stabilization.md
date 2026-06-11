# 11. 배포 안정화 & 범용성 보강

> **작업일**: 2026-06-11
> **목적**: 임의의 로그인 유저가 자신의 GitHub Pages로 배포하는 범용 시나리오에서
> "오늘 되던 배포가 내일 깨지는" 재현 불가능·관측 곤란 문제를 구조적으로 제거.
> **관련 커밋**: `503b5486` / **작업 로그**: `docs/log/2026-06.md`

---

## 0. 한눈에 보기

| 영역 | 문제 | 조치 |
|------|------|------|
| 빌드 재현성 | 템플릿에 lockfile 없음 + `npm install` → transitive 부유로 비결정적 빌드 | 의존성 세트별 lockfile 번들 + `npm ci` 전환 |
| 배포 엔드포인트 | DB row를 GitHub 작업보다 먼저 생성 → 중도 실패 시 고아 DB row | 생성 순서 재배치(GitHub → DB) + cleanup 일원화 |
| 이름 충돌 재시도 | 최대 31회 무지연 재시도 → 게이트웨이 타임아웃·2차 rate-limit | 8회 + 지터 백오프 + 20초 예산 |
| 에러 분류 | 클라가 한글 substring 매칭 → 문구 변화에 취약 | 응답에 안정적 `code` 부여, code 우선 매핑 |
| 타임아웃 | created_at 절대상한 버그 + 성공한 느린 빌드 오판 | GitHub 실제 상태 우선 + updated_at 기준 단일 윈도우 |
| 배포 quota | 비원자 count → 동시 배포 시 한도 초과 | advisory lock 하 count+insert RPC (migration 098) |
| 스코프 | workflow 스코프 부족 계정이 레포 생성 후 403 | 배포 전 사전 검증 |

핵심 파일: `src/app/api/oneclick/deploy/route.ts`, `src/lib/oneclick/deploy-status.ts`,
`src/data/oneclick/shared-template-files.ts`, `supabase/migrations/098_atomic_homepage_deploy_quota.sql`

---

## 1. 빌드 재현성 — lockfile 번들 + `npm ci`

### 문제
배포 워크플로(`.github/workflows/deploy.yml`)가 `npm install`을 lockfile 없이 실행했다.
직접 의존성은 정확히 핀(`next@15.1.0` 등)돼 있어도 **transitive 의존성이 자유 부유**하여,
동일 템플릿 코드가 시점에 따라 빌드 실패할 수 있었다(CLAUDE.md가 #1 빌드 실패 원인으로 명시).

### 조치
- 각 의존성 세트의 정규 `package-lock.json`을 생성해 **번들에 포함**하고, deploy.yml을 **`npm ci`** 로 전환.
- 의존성 세트는 2종:

| 세트 | 템플릿 | 추가 의존성 |
|------|--------|-------------|
| `standard` | link-card, personal-brand, dev-showcase, freelancer-page, small-biz, small-biz-cafe, invitation | — |
| `namecard` | digital-namecard | `qrcode.react@4.2.0` |

> `npm ci`는 lockfile↔package.json **정확 일치**를 요구하므로, 의존성이 다른 namecard는
> 별도 lockfile이 필요하다. 단일 공유 lockfile은 `npm ci` 실패를 유발한다.

### 구성 요소
| 파일 | 역할 |
|------|------|
| `scripts/lib/template-deps.mjs` | 의존성 세트 단일 진실 소스(gen/verify 공유) |
| `scripts/gen-template-lockfiles.mjs` | 세트별 lockfile 생성 → `src/data/oneclick/locks/{standard,namecard}.lock.json` |
| `scripts/verify-template-lockfiles.mjs` | 커밋된 lockfile로 실제 `npm ci` 통과를 증명(CI) |
| `makePackageLock(name, variant)` | `shared-template-files.ts` — 저장된 lockfile에 템플릿명만 주입 |
| `src/lib/oneclick/__tests__/template-deps.test.ts` | 번들 package.json ↔ lockfile 정합 오프라인 검증(드리프트 가드) |

### 런북 — 의존성 버전 변경 시
1. `shared-template-files.ts`의 `makePackageJson`(또는 namecard package.json) 버전 수정
2. `scripts/lib/template-deps.mjs`의 동일 버전 수정 (두 곳이 일치해야 함 — 테스트가 강제)
3. `npm run gen:template-locks` → lockfile 재생성
4. `npm run verify:template-locks` → `npm ci` 통과 확인
5. `npm run test`(template-deps.test.ts 드리프트 가드 통과 확인)

> **하위호환**: 기존 배포 레포의 deploy.yml은 동결되어 영향 없음(여전히 `npm install`).
> 신규 배포만 `npm ci`+lockfile 경로를 탄다. 무중단 전환.

---

## 2. 배포 엔드포인트 하드닝 — `deploy/route.ts`

### 2.1 리소스 생성 순서 재배치 (고아 row 방지)
외부(되돌리기 어려운) GitHub 리소스를 먼저, DB row를 마지막에 생성한다.

```
토큰 조회(읽기) → 스코프 검증 → 템플릿 번들 조회
  → [GitHub] 레포 생성 → Pages 활성화 → 파일 푸시
  → [DB] projects insert → service_account 복사 → homepage_deploys insert(원자 RPC)
  → project_github_repos / project_services / logAudit (병렬)
```

효과: 중도 실패·요청 중단 시 **고아 DB 프로젝트가 생기지 않는다**. GitHub 단계 실패는
생성된 레포만 정리(`cleanupResources(supabase, null, null, token, owner, repo)`), DB 단계 실패는
레포+프로젝트+SA를 함께 정리. `cleanupResources`의 `projectId`는 nullable.

### 2.2 이름 충돌 자동 채번
후보를 `[원본, 2자리×5, 3자리×2]` = **최대 8회**로 축소(2자리 접미사 조합 1296개라 5회면 충분).
각 시도 사이 **150~400ms 지터 백오프**(GitHub 2차 rate-limit 회피), 누적 **20초 예산** 초과 시 조기
중단(`429`)하여 게이트웨이 타임아웃으로 응답이 유실되는 것을 방지. 최종 이름(`finalSiteName`)은
pages_url·프로젝트명·배포레코드·응답에 일관 적용.

---

## 3. 타임아웃 & 폴링 의미론 — `deploy-status.ts`

### 핵심 원칙: GitHub 실제 상태 우선
`resolveDeployStatus`는 **GitHub Pages/Actions 상태를 먼저 확정한 뒤**, 여전히 `building`인
경우에만 타임아웃을 적용한다.

```ts
// 상태 확정 후
if (timedOut && newDeployStatus !== 'ready' && newDeployStatus !== 'error') {
  return timeoutResult();  // 여전히 building일 때만 타임아웃 에러
}
```

→ 혼잡한 GitHub 러너로 15분을 넘겨 **성공한 빌드를 잘못 실패 처리하지 않는다**.

### 타임아웃 기준
- `DEPLOY_TIMEOUT_MS = 15분`, 기준은 **`updated_at`**(마지막 활동: 배포 시작/재배포/편집).
- redeploy/batch-update가 `updated_at`을 갱신하므로 오래된 배포의 재배포도 그 시점부터 새 윈도우를 받음.
- ⚠️ **`created_at` 기준 절대 상한을 두지 않는다** — "60분 이상 된 배포를 재배포하면 즉시 타임아웃"
  되는 버그가 되기 때문. (초기 검토에서 잘못 추가했다가 제거함.)

### 클라 폴 캡 — `useDeployStatus` (`src/lib/queries/oneclick.ts`)
- 백오프: 2s → 3s → 5s → 8s → 10s
- 터미널 상태(`ready`/`error`/`canceled`) 도달 시 중단
- 안전망: `MAX_POLLS=240`(≈40분), `MAX_CONSECUTIVE_FAILURES=8`(오프라인/서버다운 무한 재시도 방지)
- 정상 배포(3-8분, 24-72회 폴링)는 캡에 도달하지 않음 — 조기 중단 없음

---

## 4. 구조화된 에러 코드

서버 실패 응답에 안정적 `code`(= `classifyErrorCategory`의 13개 카테고리)를 부여하고,
클라(`src/lib/deploy-error-map.ts`)가 **code 우선** 매핑, substring은 폴백으로만 사용.

- 서버: `apiErrorWithCode(message, status, code)` (`src/lib/api/errors.ts`)
- 카테고리: `repo_conflict / template_not_found / file_upload / permission / token / rate_limit /
  timeout / retry_exhausted / workflow_build / pages_error / network / quota / unknown`
- quota 초과는 `code: 'QUOTA_EXCEEDED'`로 별도 처리(Pro 업그레이드 UI 분기)
- 클라 mutation은 응답 `data.code`를 Error에 첨부 → `ErrorCard`가 `getErrorDetails(..., code)`로 매핑

> 서버 카테고리 어휘와 클라 `DeployErrorCategory` union은 **완전히 동일**해야 한다(둘 다 13종).

---

## 5. 배포 Quota 원자화 — migration 098

### 문제
배포 quota 체크가 비원자(JS-side `SELECT count` 후 비교)였다. 052의
`check_homepage_deploy_quota`는 **count-only**라, 앱 흐름이 `check → (GitHub 작업) → INSERT`로
check와 INSERT가 별도 트랜잭션이면 `pg_advisory_xact_lock`이 INSERT 전에 해제된다. 두 동시
요청(멀티탭/직접 API)이 모두 통과 후 INSERT하면 **한도를 초과**할 수 있었다.

### 조치 — `create_homepage_deploy_atomic` RPC
advisory lock을 잡은 **단일 트랜잭션 안에서 count와 INSERT를 함께** 수행 → 진짜 check-and-insert
원자성. (052의 deploy quota와 동일 advisory key `hashtext(user)::int, 1`로 직렬화.)

```sql
PERFORM pg_advisory_xact_lock(hashtext(v_user_id::text), 1);
SELECT COUNT(*) INTO v_current FROM homepage_deploys WHERE user_id = v_user_id;
IF v_current >= v_max THEN RETURN jsonb_build_object('allowed', false, ...); END IF;
INSERT INTO homepage_deploys (...) RETURNING id INTO v_id;  -- 같은 락·트랜잭션
```

보안: `SECURITY DEFINER` + `auth.uid()`(호출자 위조 방지) + 프로젝트 소유권 검증 +
`search_path=public`. EXECUTE는 `authenticated`에만 부여(PUBLIC/anon 회수).

### 흐름에서의 위치
1. 시작: `checkHomepageDeployQuota`(plain count) — 명백한 초과면 GitHub 작업 전 빠른 차단(UX)
2. 최종: `create_homepage_deploy_atomic` RPC — **실제 원자적 한도 강제**. 초과 시(드문 경쟁)
   생성된 GitHub 레포·프로젝트·SA 정리 후 `quotaExceededError`.

> deploy route의 최종 insert는 `supabase.from('homepage_deploys').insert(...)` 대신
> `supabase.rpc('create_homepage_deploy_atomic', {...})`를 호출하고 `deploy_id`를 반환받는다.

---

## 6. 범용성 — 임의 로그인 유저 관점

### 확인된 안전 항목
- **무료 계정**: `createRepo`는 `private:false`(**public 레포**) → 무료 계정도 Pages 사용 가능
- **계정 유형**: `POST /user/repos`로 **항상 개인 계정**에 생성(org 오염 없음). 모든 참조가
  `repoResult.owner.login`에서 파생되어 일관됨
- **OAuth 스코프**: `repo`, `workflow`(Pages-with-Actions + dispatch), `read:org`, `read:user`
- **Actions 워크플로**: `build_type:'workflow'`로 Pages source를 Actions로 설정,
  permissions(`contents:read, pages:write, id-token:write`)·environment(`github-pages`) 충족.
  파일 푸시(`on: push: branches: [main]`)가 첫 워크플로를 자동 트리거

### 배포 전 스코프 사전 검증
좁은 스코프(레거시) 계정이 레포 생성 **후** Pages 단계에서 403 나던 것을, 레포 생성 **전**
`oauth_scopes`에 `workflow` 부재 시 차단(고아 레포·늦은 혼란 방지). `oauth_scopes`가 비어있는
경우는 검증 생략(false-block 방지).

---

## 7. 빌드 검증 절차 ⚠️ (Windows 불가 · WSL/Linux 필수)

### 게터차
템플릿의 `src/app/api/og/route.tsx`(`next/og` ImageResponse)는 **Windows 로컬에서
`next build`(static export) 시 `@vercel/og`의 `fileURLToPath` "Invalid URL"** 에러로 프리렌더
실패한다. 이는 **Windows 한정** 이슈이며 실제 배포 환경(GitHub Actions `ubuntu-latest`)에서는
정상 빌드된다. 빌드 검증은 반드시 **WSL/Linux**에서 수행.

### 절차
1. `npx tsx scripts/materialize-template.ts <slug> <dir>` — 번들을 디스크로 추출
   (tsx는 Windows에서 동작 — 번들 데이터 모듈은 상대 import만 사용, `@/`는 전부 생성 코드 문자열)
2. WSL/Linux에서 `npm ci && NEXT_PUBLIC_REPO_NAME=<slug> npm run build` → `out/index.html` 확인
   (참고 하네스: `scripts/test-template-builds.sh`)

### 2026-06-11 실측
8개 템플릿 전부 Linux 빌드 PASS. 7개는 `out/api/og`(OG 이미지) 생성, **invitation**은 OG 라우트
의도적 부재(static export 호환 위해 제거됨, 빌드 정상).

---

## 8. 운영 체크리스트

배포 파이프라인 관련 변경 시:

- [ ] 의존성 버전 변경 → `gen:template-locks` 재생성 + `verify:template-locks` + `test` 통과
- [ ] 템플릿 번들 변경 → WSL/Linux에서 빌드 검증(Windows OG 빌드 실패는 무시)
- [ ] deploy.yml 변경 → 신규 레포에만 적용됨(기존 레포는 동결) 인지
- [ ] 에러 메시지 추가 → 서버 `classifyErrorCategory`와 클라 `DeployErrorCategory` 카테고리 일치
- [ ] homepage_deploys 스키마 변경 → `create_homepage_deploy_atomic` RPC의 INSERT 컬럼 동기화
- [ ] 새 SECURITY DEFINER 함수 → `search_path` 설정 + PUBLIC/anon EXECUTE 회수 + advisor 확인

---

## 9. 알려진 한계 & 후속

| 항목 | 현재 영향 | 후속 |
|------|-----------|------|
| GitHub 토큰 refresh 미구현 | 현 OAuth App 토큰은 만료 없어 **무영향** | GitHub App(8h 만료) 전환 시 refresh 로직 필요 |
| preflight 가용성이 `oauth_metadata.login` 추정 | 사용자명 변경 계정에서 표시만 부정확(배포는 자동 채번으로 복구) | 토큰 주체 기준 조회로 개선 가능 |
| `cleanupResources` DB 삭제 실패 무시 | best-effort, 드물게 고아 row | 필요 시 로깅/재시도 |

---

## 부록 — 디버깅된 오탐 (수정 대상 아님)
초기 분석에서 P0로 제기됐으나 코드 직접 검증 결과 **오탐**으로 판명된 항목(계획에서 제외):
- ❌ "projectError 시 고아 프로젝트" — insert 실패 시 `project=null`, 정리 대상 없음
- ❌ "'timeout' 미포함으로 무한 폴링" — 서버가 timeout을 `'error'`로 변환, 클라 종료조건에 포함
