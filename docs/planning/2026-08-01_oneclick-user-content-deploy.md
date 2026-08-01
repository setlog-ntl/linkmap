# 원클릭 "내 자료 배포" — 파일 업로드·내 GitHub repo 자동 배포 (실행 설계)

- 작성: 2026-08-01 · 상태: **기획 확정 (구현 착수 전 설계)** · 트랙: 2026-07-31 Supabase 위젯 기획과 **독립 병행**
- 질문: ① 템플릿이 아닌 **사용자가 만든 자료**(AI 생성 HTML/ZIP)와 **사용자의 기존 GitHub 저장소**를 원클릭으로 배포할 수 있는가? ② 기존 파이프라인을 어디까지 재사용하고, 무엇을 새로 만들어야 하는가?

---

## 0. 제품 결정 (대화로 확정 — 변경 불가)

| # | 결정 | 내용 |
|---|---|---|
| 1 | 입력 방식 | **파일 업로드(트랙 A) + 내 GitHub repo 연결(트랙 B)** 둘 다 |
| 2 | 프로젝트 유형 | 정적 우선(Phase 1) → 빌드형 확장(Phase 2) |
| 3 | 타겟 | 바이브코더 1순위 — UX 극단적 단순화 (결정을 요구하지 않는다) |
| 4 | 쿼터 | 기존 '사이트 보유 수' 쿼터 합산 (Free 3 / Pro 10 / Team 50, `create_homepage_deploy_atomic` 재사용) |
| 5 | repo 개입 수준 | 동의 후 표준 워크플로우 **1파일만 커밋** — 기존 파일 무수정, 기존 repo 삭제 절대 금지 |
| 6 | UI 진입점 | `/sites/new` 템플릿 피커에 카드 2장 통합 (단일 퍼널) |
| 7 | 원본 보관 | **즉시 폐기** — 서버는 ZIP을 수신조차 하지 않음(클라이언트 해제), repo가 유일한 진실 원천 |

---

## 1. 결론 요약

| 질문 | 답 |
|---|---|
| 기술적으로 가능한가 | **가능** — 배포 엔진(repo 생성→원자 push→Pages(Actions) 활성화→상태 폴링→쿼터→에러 분류→showcase)을 **전면 재사용**. 신규는 업로드 검증·repo 분석·스키마 확장뿐 |
| 원클릭 컨셉과 충돌하는가 | **아니오, 오히려 확장** — 템플릿 앞단에 새 진입로가 생겨 바이브코더 최빈 시나리오("AI가 준 파일이 손에 있다")가 퍼널 안으로 들어옴 |
| 가장 큰 위험은 무엇인가 | **트랙 B의 사용자 원본 repo 파손** — 현재 사이트 삭제 API가 GitHub repo를 삭제하므로(`deployments/[id]/route.ts:127`) `source_type` 가드가 최우선 안전 요건 |
| 선결 조건은 | OAuth 콜백 크로스계정 CSRF **P0 수정**(2026-07-12 감사 미수정) — 신규 트랙이 GitHub 연결 노출면을 확대하므로 출시 게이트 |

**핵심 원칙: "서버는 원본을 만지지 않고(클라이언트 해제·즉시 폐기), 사용자 repo는 파일 1개 추가 외 절대 건드리지 않는다."**

---

## 2. 기술 구조 — 재사용 지도

### 2.1 현재 파이프라인 대비 재사용/신규 (2026-08-01 코드 조사)

| 단계 | 현재 구현 | 트랙 A (업로드) | 트랙 B (repo 연결) |
|---|---|---|---|
| 인증·쿼터 | `getUser()` + `checkHomepageDeployQuota` | 재사용 | 재사용 |
| 토큰 해석 | `service_accounts` + `safeDecryptToken` + workflow 스코프 검증 | 재사용 | 재사용 |
| 파일 소스 | 템플릿 정적 번들 (`getTemplateBySlug`) | **신규**: 클라 해제 → `files[]` JSON | **해당 없음** (repo가 이미 소스) |
| repo 생성 | `createRepo` 충돌 자동채번 (20s 예산) | 재사용 | **불사용** — 기존 repo |
| Pages 활성화 | `enableGitHubPagesWithActions` (build_type: workflow) | 재사용 | 재사용 (+legacy→workflow 전환 신규) |
| 파일 push | `pushFilesAtomically` (Git Data API 원자 커밋) | 재사용 (**인코딩 인자·청크 확장**) | **불사용** — `createOrUpdateFileContent` 1파일 |
| 배포 레코드 | `create_homepage_deploy_atomic` RPC (advisory lock) | 재사용 (**source_type 인자 추가**) | 재사용 (동일) |
| 상태 추적 | `resolveDeployStatus` + 15분 타임아웃 + 1회 자동 재시도 | 재사용 (무수정) | 재사용 (workflow 파일명만 config 참조) |
| 에러 분류 | 13종 카테고리 + fingerprint | 재사용 (+`upload_validation`) | 재사용 (+`repo_not_deployable`) |
| 실패 정리 | `cleanupResources` (신규 repo 삭제 시도) | 재사용 | **재설계** — repo 삭제 절대 금지 (§4.4) |
| 2층 브릿지 | projects + project_services + project_github_repos 자동 링크 | 재사용 (추가 작업 0) | 재사용 (추가 작업 0) |

### 2.2 확장 아키텍처

```
[트랙 A: 파일 업로드]
  브라우저: 단일 HTML / ZIP / 폴더
      │  fflate 해제 · 정규화 · index.html 판정 · 상한 검사   ← 전부 클라이언트 (원본 서버 미전송)
      ▼
  POST /api/oneclick/deploy-upload  { files[]: {path, content, encoding} }
      │  upload-sanitizer 재검증 → 표준 정적 deploy.yml 주입
      ▼
  createRepo → enablePagesWithActions → pushFilesAtomically → RPC(source_type='upload')
      ▼
  기존 폴링·my-sites·showcase 그대로

[트랙 B: 내 repo 연결]
  GET /api/oneclick/repos (목록) → POST /api/oneclick/repo-analyze (판정)
      │  동의 화면: 커밋될 YAML 전문 + 불변 보증
      ▼
  POST /api/oneclick/deploy-repo
      │  .github/workflows/linkmap-pages.yml 1파일 커밋 (기존 파일 무수정)
      ▼
  Pages 활성화/전환 → RPC(source_type='import') → project_github_repos(sync_branch/sync_directory)
```

---

## 3. 트랙 A — 파일 업로드 설계

### 3.1 ZIP 해제 위치: **클라이언트(브라우저) 확정**

| 기준 | 클라이언트 해제 (채택) | 서버(Workers) 해제 (기각) |
|---|---|---|
| Workers CPU (cpu_ms 30000) | 영향 없음 — 해제·검증·인코딩 전부 브라우저 | 대형 ZIP 해제가 CPU 예산 잠식, 배포 파이프라인과 경합 |
| 라이브러리 | `fflate` 1개 (unzip 코어 ~8KB gz, **클라 번들 한정 dynamic import**) | 서버 의존성 신규 + Workers 호환성 검증 필요 |
| zip bomb | 폭발이 사용자 본인 브라우저에 국한, 누적 상한 초과 시 즉시 중단 | 서버 메모리·CPU에서 직접 방어 필요 |
| 원본 즉시 폐기 (결정 #7) | 서버가 ZIP을 **수신조차 하지 않음** — 구조적 보장 | 수신 후 폐기 — 구현 규율 의존 |
| UX | 해제 직후 파일 트리·index 판정을 서버 왕복 없이 즉시 표시 | 분석 왕복 1회 추가 |

서버 API는 트랙 A에서 **항상 "파일 배열 JSON"만 받는다** — 단일 HTML이든 ZIP이든 폴더든 서버 입력 형태가 하나로 수렴해 검증 코드가 단일화된다.

**3가지 입력 흐름 (모두 같은 `files[]`로 수렴):**

1. **단일 HTML (바이브코더 최빈 케이스)** — 드래그&드롭 → 파일명이 `index.html` 아니면 자동 처리(§3.4) → `[{path:'index.html', content, encoding:'utf-8'}]`. 해제 라이브러리 로드 불필요.
2. **ZIP** — `fflate` dynamic import → 해제 → 정규화: `__MACOSX/`·`.DS_Store`·`Thumbs.db`·`.git/` 폐기 → 단일 최상위 폴더 래퍼 unwrap (AI 도구가 폴더째 압축하는 관행) → 확장자·경로 필터 → 텍스트/바이너리 판별·base64.
3. **폴더** — `<input webkitdirectory>`, ZIP과 동일 정규화 파이프라인.

클라 유틸: `src/lib/oneclick/client-zip.ts` (신규, 'use client' 경계 내 dynamic import — 서버 번들 오염 금지 규칙 준수).

### 3.2 상한

| 항목 | 상한 | 근거 |
|---|---|---|
| 파일 개수 | **60개** | batch-update 50개 선례 + 주입분 여유. 핵심 근거: GitHub 콘텐츠 생성 secondary rate limit ≈ 80 req/min — `createBlob`이 파일당 1회이므로 60개면 단일 배포가 안전 수렴 |
| blob 동시성 | **8개 청크** | 현재 `Promise.all` 전량 병렬은 burst 위험 → 청크 순차. 8×~300ms ≈ 3초 내외 |
| 텍스트 개별 | 2MB | 기존 이미지 업로드 2MB 선례와 통일 |
| 바이너리 개별 | 5MB (base64 후 ~6.8MB) | 히어로 이미지·폰트 커버, GitHub blob 한계 대비 보수적 |
| 요청 총량 | **25MB** (JSON, base64 후) | Workers 바디 한계 대비 1/4, JSON.parse 메모리 고려. 원본 약 18MB |
| 서버 재검증 | Zod `superRefine` 3중 (개수·개별·총량) | 클라 상한은 UX용 — 서버가 전량 재검증 |

**텍스트/바이너리 혼재**: 파일 항목에 `encoding: 'utf-8' | 'base64'` 추가, `pushFilesAtomically` 시그니처를 `files: {path; content; encoding?}[]`로 확장 (현재 `git-data.ts` utf-8 하드코딩 — 기존 호출부는 기본값으로 무변경).

### 3.3 보안 게이트 — `src/lib/oneclick/upload-sanitizer.ts` (서버, 클라 필터와 무관하게 전량 재검증)

1. **경로 무결성**: POSIX 상대경로 강제 — `..`·선행 `/`·백슬래시·NUL/제어문자·256자 초과·빈 세그먼트 거부. dot 파일·디렉토리는 조용히 드랍 + 응답 `skipped_files[]` 보고.
2. **심볼릭 링크 구조적 무해화**: tree 항목을 전부 `100644`(일반 파일)로 생성 — `120000`(symlink)·`100755`(실행) 모드는 코드 경로상 생성 불가. "모드 고정" 원칙 명문화.
3. **`.github/` 완전 차단 + 표준 워크플로우 주입**: 사용자 `.github/` 하위 전량 드랍(보고) 후 Linkmap 표준 **정적 deploy.yml** 1개만 주입. 기존 `sharedDeployYml`은 npm ci+next build 전제라 부적합 → `src/lib/oneclick/static-workflow.ts` 신규 (checkout → upload-pages-artifact(path:.) → deploy-pages, npm 없음). Actions artifact 방식은 Jekyll을 거치지 않아 `.nojekyll` 불필요. 파일명 `deploy.yml` 유지 → **기존 redeploy(`triggerWorkflowDispatch` 기본값)·상태 추적 무수정 동작**. **사용자 입력이 YAML에 보간되는 지점 0** (site_name도 YAML 미포함).
4. **확장자 허용 목록** (업로드 전용, EDITABLE_EXTENSIONS보다 넓게): html/htm, css, js/mjs, json, txt, md, xml, webmanifest, map, svg, ico, png/jpg/jpeg/webp/gif, woff/woff2/ttf/otf/eot, mp4/webm/mp3/wav, pdf. 불허(드랍+보고): exe/dll/sh/bat/php/py 등 — Pages에서 실행 불가라 실질 위험은 낮지만 남용 인상·스캐너 오탐 감소 목적.
5. **매직바이트는 이미지만** 기존 패턴 재사용. HTML/JS/SVG 콘텐츠 검사는 하지 않는다.

**책임 분계 원칙**: 이 기능의 본질이 "사용자가 만든 임의 HTML/JS를 사용자 본인 GitHub 계정·`username.github.io` 도메인에 게시"다. index.html 자체가 임의 스크립트인데 SVG만 막는 것은 무의미 (site-editor의 SVG 차단은 **Linkmap 관리 템플릿 사이트**에 대한 주입 방지라 전제가 다름). 경계선은 "Linkmap 인프라·타 사용자에게 해가 되는가"이며 ① 워크플로우 인젝션 차단 ② 경로 무결성 ③ Linkmap 도메인 비렌더링(§3.5)으로 지킨다. 콘텐츠 적법성은 ToS + GitHub AUP로 사용자 책임 (리스크 R1).

### 3.4 index.html 판정 6단계 (클라이언트 — 서버는 존재만 최종 검증)

1. 루트에 `index.html` 있음 → 통과.
2. 단일 최상위 폴더 안에 있음 → 자동 unwrap (안내 없이 — 사용자 관점 무의미한 정보).
3. 단일 HTML인데 이름이 다름(`about.html` 등) → **자동 rename + 고지** ("`about.html`이 첫 화면으로 게시됩니다"). 확인 대화상자 없음 — 바이브코더 원칙.
4. ZIP 루트에 HTML 1개인데 index 아님 → rename이 아니라 **index.html 복제 추가** (다른 파일이 상대경로로 참조 가능 → 링크 깨짐 0 보장).
5. HTML 여러 개 + index 없음 → 인라인 선택 UI ("첫 화면으로 보여줄 파일을 골라주세요") → 선택 파일 복제 추가.
6. HTML 0개 → 차단: "웹페이지 파일(html)이 없습니다. AI에게 'HTML 파일로 저장해줘'라고 요청해보세요."

### 3.5 미리보기: Phase 1 제외 — "파일 요약 카드"로 대체

- 근거: ① Linkmap 도메인에서 임의 사용자 HTML 렌더링 = 유일한 자사 도메인 XSS 벡터 (site-editor iframe P1 선례). ② 다중 파일 사이트는 상대경로 자산이 srcdoc에서 깨져 **깨진 미리보기 = 신뢰 하락**. ③ 사용자는 그 파일을 로컬에서 이미 봤고, 배포는 무료·수 분·재시도 가능 — 한계 효용 낮음.
- 대체 UX: 업로드 직후 요약 카드 (파일 수·총 용량·트리 상위 항목·"첫 화면: index.html"·드랍된 파일 목록) → 곧장 배포 버튼.
- Phase 2 옵션: 단일 HTML 한정 `iframe sandbox="allow-scripts"` + srcdoc — 별도 보안 리뷰 전제.

---

## 4. 트랙 B — 내 GitHub repo 연결 설계

### 4.1 repo 선택: 신규 `GET /api/oneclick/repos`

- 기존 `/api/github/repos`는 project_id 필수 + 페이지네이션 없음 → **신설이 깔끔** (기존 라우트 무수정 유지, 회귀 위험 0).
- `listUserRepos` 확장: `(token, opts?: {page?, per_page?, affiliation?})`, 기본 per_page 30, **affiliation=owner** (Pages 활성화는 admin 권한 필수 — collaborator repo는 Phase 1 제외로 엣지 케이스 대량 제거). 응답에 `has_next`.
- 검색: Phase 1은 로드된 페이지 클라 필터 + "더 보기" (바이브코더 repo 수 대부분 <60 — GitHub Search API는 별도 rate limit 30/min 대비 이득 없음, Phase 2 백로그).

### 4.2 repo 분석: 신규 `POST /api/oneclick/repo-analyze` {owner, repo}

단일 응답으로 동의 화면에 필요한 전부 반환:

1. `getRepo` — 존재·**`permissions.admin`** 확인 (아니면 즉시 거부), fork·private·size·default_branch.
2. `getGitTreeRecursive` — **빈 repo**(ref 없음) 차단 + 트랙 A 안내 CTA / **truncated**(거대 repo)면 정밀 분석 생략 + 루트 고정 + 경고 (`getGitTreeRecursive`가 truncated 플래그를 반환하도록 확장) / size > 1GB면 Pages 소프트 리밋 경고.
3. **정적 판별**: `index.html`을 `/` → `docs/` → `dist/` → `build/` → `public/` → `out/` 순 탐색 → 발견 위치 = `publish_dir` 기본값 (복수 발견 시 우선순위 첫 항목 + 변경 셀렉트). 미발견 + package.json 있음 → **빌드형 판정**: Phase 1 차단 + "빌드가 필요한 프로젝트예요. 곧 지원됩니다" (Phase 2 훅). 둘 다 없음 → 차단 + 트랙 A 안내.
4. **Pages 기존 상태**: 활성 + 자체 workflow → **"연결만 하기(link-only)" 모드** (커밋 0·Pages 변경 0·DB 등록만 — 가장 안전, Phase 1B 포함). 활성 + legacy(브랜치 빌드) → workflow 방식 전환 필요를 동의 화면에 명시 (`updatePagesBuildType` 신규, pages.ts).
5. **워크플로우 파일명: 항상 `.github/workflows/linkmap-pages.yml`** — 기존 deploy.yml 충돌 원천 차단, "Linkmap이 넣은 파일" 소유권이 파일명으로 자명 → 롤백·해제 시 삭제 대상 명확. `config_data.workflow_file`에 기록, redeploy 라우트가 이를 읽음 (트랙 A·템플릿은 기본값 'deploy.yml' 무변경).
6. **fork**: GitHub이 워크플로우 기본 비활성화 → `is_fork` 플래그 + 배포 시 `PUT /repos/{o}/{r}/actions/permissions {enabled:true}` 선행 + 동의 화면 고지.
7. **private**: GitHub Free는 private Pages 불가 → 경고 표시 + 활성화 403/422 시 전용 에러 매핑 ("public 전환 또는 GitHub Pro 필요").
8. 브랜치: default_branch 고정 노출, "다른 브랜치"는 접힌 고급 옵션.

### 4.3 동의 화면 — "무엇이 일어나는지" 전문(全文) 공개

`repo-consent-dialog.tsx` 신규. 추가 1개·수정 0이므로 **diff = 파일 전문**이 정답:

1. 헤더: "`owner/repo`에 딱 1개의 파일을 추가합니다" + 경로 `.github/workflows/linkmap-pages.yml`.
2. 접이식 코드 블록: 커밋될 YAML **전문** (publish_dir·브랜치 치환된 실제 내용).
3. 불변 보증 체크리스트: "기존 파일은 수정하지 않습니다 / 저장소를 삭제하지 않습니다 / 커밋 메시지: `Linkmap: add GitHub Pages deploy workflow`".
4. 조건부 고지: legacy 전환 / fork Actions 활성화 / link-only("아무것도 커밋하지 않습니다").
5. CTA: **"1개 파일 커밋하고 배포"** — 행동 서술형 ('동의' 같은 추상 버튼 금지).

### 4.4 실패 롤백: "우리가 만든 것만, 우리가 지운다"

| 실패 지점 | 조치 | 근거 |
|---|---|---|
| 워크플로우 커밋 실패 | 조치 없음 (repo 무변경) — 에러 반환 | — |
| 커밋 성공 → Pages 활성화 실패 | **linkmap-pages.yml만 삭제 커밋** (`deleteFileContent` 신규, content.ts). 삭제 실패 시 잔존 안내 ("삭제해도 무방합니다") | revert가 아닌 파일 삭제 — 사용자의 다른 커밋과 간섭 불가한 최소 연산 |
| 빌드 실패 | 리소스 유지 + deploy_status='error' + Actions 탭 안내 (기존 자동 재시도 1회 그대로) | Pages 활성 상태는 무해 |
| DB 단계 실패 | GitHub 조치 없음(파일 잔존 안내) + projects/SA만 정리 — **cleanupResources의 repo 삭제 분기를 source별 게이트** | 기존 repo 삭제 금지 |
| 사이트 삭제 (사용자) | 기본 = **DB 연결 해제만**. 선택 체크박스 "Linkmap이 추가한 워크플로우 파일도 제거" (기본 해제). Pages 비활성화 안 함 | ⚠️ **`deployments/[id]/route.ts:127`의 `deleteRepo`를 `source_type !== 'import'` 가드로 감싸는 것이 이 기능 전체에서 가장 중요한 한 줄** |

---

## 5. 공통 설계

### 5.1 DB — 마이그레이션 `109_user_source_deploys.sql`

**채택: template_id nullable + `source_type` 컬럼. sentinel 템플릿 기각** (가짜 row가 카탈로그·showcase 조인·통계 오염 + UI 분기 이중화).

```sql
ALTER TABLE homepage_deploys ALTER COLUMN template_id DROP NOT NULL;
ALTER TABLE homepage_deploys ADD COLUMN source_type TEXT NOT NULL DEFAULT 'template'
  CHECK (source_type IN ('template','upload','import'));
ALTER TABLE homepage_deploys ADD CONSTRAINT homepage_deploys_source_template_consistency
  CHECK ((source_type = 'template') = (template_id IS NOT NULL));
```

- **`deploy_method='github_pages'` 유지** — 의미는 "호스팅 방식"이고 세 소스 모두 참. `buildDeploySteps`·`resolveDeployStatus`·queries 리터럴 전부 무수정. 소스 구분은 `source_type` 전담.
- `config_data` 활용: 트랙 A `{file_count, total_bytes, skipped_files}` / 트랙 B `{workflow_file, publish_dir, source_branch, pages_was_enabled, prior_build_type, link_only}`. 트랙 B 브랜치·디렉토리는 `project_github_repos.sync_branch/sync_directory`(유휴 컬럼) 이중 기록 — 진실 원천은 config_data.
- **RPC 교체 주의**: `p_source_type TEXT DEFAULT 'template'` 추가 시 구 6-인자 함수와 **오버로드 충돌** → `DROP FUNCTION` 후 재생성 + 내부에 source_type↔template_id 정합 검증 + M108 default privileges 정책대로 `REVOKE FROM PUBLIC` + `GRANT EXECUTE TO authenticated` 재적용, `has_function_privilege`로 검증.
- 기존 코드 영향: `HomepageDeploy.homepage_templates`는 이미 `| null` — 조인 무해. `useHomepageTemplates`는 번들 소스라 무관. showcase union은 template null 동작 (썸네일 fallback만). 깨지는 곳은 template를 무조건 렌더하는 deploy-site-card 뱃지·프리뷰 → §5.4.
- 마이그레이션 후 3-step 준수: `src/types/` 동기화 → `src/lib/queries/` 반영 → `docs/db-schema.md` 갱신.

### 5.2 API 4종 (5단계 패턴: getUser → safeParse → 소유권/권한 → 로직 → logAudit)

| 라우트 | Zod 스키마 (validations/oneclick.ts) | 핵심 |
|---|---|---|
| `POST /api/oneclick/deploy-upload` | `deployUploadRequestSchema`: site_name(기존 regex), `files[1..60]` + superRefine(개별·총량·index.html 존재), `github_service_account_id?` | 기존 deploy 골격 복제: 쿼터→토큰→**sanitizeUploadFiles()**→static deploy.yml 주입→createRepo→Pages→pushFilesAtomically(인코딩·청크)→RPC(source_type='upload')→링크·audit. 실패 정리는 기존 cleanupResources (신규 repo라 삭제 허용) |
| `POST /api/oneclick/deploy-repo` | `deployRepoRequestSchema`: owner/repo(GitHub 명명 regex), branch?, publish_dir?, link_only?, `github_service_account_id?` | 서버에서 **분석 재실행** (클라 결과 신뢰 금지) → link_only 아니면 `createOrUpdateFileContent`로 1파일 커밋(브랜치 지정) → fork Actions enable → Pages 활성화/전환 → RPC(source_type='import') → project_github_repos → audit. **실패 시 repo 삭제 절대 금지** (§4.4) |
| `GET /api/oneclick/repos` | `reposQuerySchema`: page?, service_account_id? | §4.1 |
| `POST /api/oneclick/repo-analyze` | `repoAnalyzeRequestSchema`: owner, repo, `github_service_account_id?` | §4.2. 읽기 전용이나 남용 관찰 위해 logAudit 기록 |

에러: `apiErrorWithCode` + `classifyErrorCategory` 재사용. 신규 카테고리 2종 `upload_validation`·`repo_not_deployable` — 서버(deploy-error-logger)·클라(deploy-error-map)·DB CHECK 3곳 동기화.

### 5.3 위저드 — phase 무변경, payload 일반화

```ts
type DeploySource =
  | { kind: 'template'; templateId: string }
  | { kind: 'upload' }                              // 파일은 머신 밖 ref
  | { kind: 'import'; owner: string; repo: string; publishDir?: string };
```

- phase(selecting→authenticating→connecting_github→deploying→polling→success|error) 그대로. deploying에서 kind별 mutation 3종 분기 (`useDeployUpload`/`useDeployRepo` 신규, queries/oneclick.ts).
- **OAuth 리다이렉트 제약**: 파일 payload는 localStorage pending-deploy(TTL 10분)에 못 넣음(용량·민감성) → **업로드/임포트 트랙은 인증·GitHub 연결 완료 후 입력 진입** (템플릿 트랙의 선입력·후인증 순서를 이 두 트랙만 역전). pending에는 `{track:'upload'}` 또는 `{track:'import', owner, repo}`만 저장 — 복귀 시 upload는 파일 재선택, import는 분석부터 자동 재개. `oauth_states.flow_context`는 기존 'oneclick' 재사용 (마이그레이션 불필요).
- 클라 전처리(해제·정규화·index 판정)는 머신 phase가 아닌 selecting 내부 컴포넌트 로컬 상태 (`upload-source-step.tsx`) — 머신 단순성 유지.

### 5.4 my-sites 통합

| 항목 | 설계 |
|---|---|
| 소스 뱃지 | deployments select에 source_type·config_data 추가 → 뱃지 3종 (템플릿명/내 파일/내 repo). template null 시 프리뷰 generic 아이콘 fallback |
| 파일 에디터 | **upload**: 허용 (files/batch-update 라우트가 forked_repo_full_name 기준 — 무수정 동작). **모듈 패널은 `source_type==='template'`만 렌더** (모듈 마커 없는 repo에서 패널 = 혼란+오동작). **import**: Phase 1 에디터 비활성 — "GitHub에서 편집" 외부 링크 (사용자 실자산을 Linkmap 에디터로 건드리는 블라스트 반경 + 편집 가드가 템플릿 전제. Phase 2 재검토) |
| 재배포 | upload: 무수정 (workflow 파일명 deploy.yml 동일). import: redeploy가 `config_data.workflow_file`·`sync_branch`를 `triggerWorkflowDispatch`에 전달하도록 확장 |
| 삭제 | **DELETE의 `deleteRepo`를 `source_type==='import'`면 스킵** (최우선 안전 요건). import 삭제 다이얼로그: "연결만 해제됩니다. 저장소는 그대로 남습니다" + 선택: 워크플로우 파일 제거 커밋 |
| 폴링 | status 라우트 무수정 (deploy_method 공통). 단 멀티계정 P1(첫 active 계정 토큰 오참조)이 import private repo에서 실오류로 표면화 → 1B에서 `project_github_repos.service_account_id` 우선 해석으로 부분 수정 |

### 5.5 2층 퍼널 브릿지 — 추가 작업 0으로 획득

기존 파이프라인 재사용으로 projects + project_services(GitHub) + project_github_repos가 자동 생성 — 트랙 A/B 사이트도 **서비스맵에 GitHub 노드가 달린 프로젝트로 즉시 존재**한다 (재사용 설계의 최대 배당). Phase 3 확장: 업로드 HTML의 `<script src>`·SDK 시그니처 스캔(신규 detector)으로 Supabase/GA/Kakao 등 사용 서비스를 서비스맵 후보로 자동 제안 — "내가 만든 사이트가 뭘 쓰는지 보인다"는 바이브코더→관리자 전환 이벤트.

---

## 6. 고려사항 / 리스크

| # | 리스크 | 심각도 | 대응 |
|---|---|---|---|
| R1 | 악성 콘텐츠(피싱/멀웨어) 업로드 호스팅 — 사용자 GitHub 계정 정지 + **Linkmap OAuth 앱 플래그** 가능성 | 높음 | 책임 분계: 커밋은 사용자 본인 토큰·본인 계정(호스팅 주체=사용자) — ToS 명문화 + 업로드 시 1줄 고지. logAudit 전체 추적. abuse 신고 대응 창구 + 계정별 업로드 감사 쿼리 준비. 남용 감지 시 계정 단위 기능 차단(운영 정책) |
| R2 | 워크플로우 인젝션 (`.github/` 경유 임의 Actions 실행) | 높음 | 사용자 `.github/` 전량 드랍 + 서버 재검증. 워크플로우는 서버 상수만 커밋 — 사용자 입력이 YAML에 보간되는 지점 0 |
| R3 | **트랙 B에서 기존 repo 파손/삭제** | **치명** | 삭제 가드(§5.4) + 파일 삭제형 롤백만(§4.4) + contents API 단일 파일 커밋(트리 재작성 없음) + 1B 검증에 "트리 diff=1 추가" 기계 검증 |
| R4 | zip bomb / 대용량 업로드 부하 | 중간 | 클라 해제(서버 무접촉) + 해제 중 누적 상한 즉시 중단 + 서버 25MB/60파일 재검증 |
| R5 | GitHub secondary rate limit (blob 대량 생성) | 중간 | 60개 상한 + blob 동시성 8청크 + 기존 rate_limit 카테고리 매핑 |
| R6 | Pages 소프트 리밋 (1GB/대역폭 100GB월/빌드 10회시) | 낮음~중 | 총량 상한이 1GB 대비 여유. 트랙 B 분석서 1GB 초과 경고. FAQ 문서화 |
| R7 | 쿼터 우회 (직접 API 동시 호출) | 중간 | 기존 advisory lock RPC를 신규 라우트도 통과 — count 기반이라 source 무관 자동 합산. RPC 교체 회귀 테스트 |
| R8 | 업로드 남용 (봇 반복 배포) | 중간 | **Cloudflare Rate Limiting Rules** (앱 코드 금지 원칙 준수): deploy-upload·deploy-repo POST IP당 예 10회/10분. 앱 레벨은 보유 수 쿼터가 총량 상한 |
| R9 | OAuth 콜백 크로스계정 CSRF P0가 신규 트랙으로 노출면 확대 | 높음 | **Phase 0 선결 — 출시 게이트로 강제** |
| R10 | 멀티 GitHub 계정 시 status/redeploy 토큰 오참조 (기존 P1) | 중간 | import private repo에서 실오류 표면화 → 1B에서 project_github_repos.service_account_id 우선 해석 |
| R11 | Linkmap 도메인 XSS (미리보기) | 중간 | Phase 1 미리보기 제외로 벡터 원천 제거. Phase 2 도입 시 별도 보안 리뷰 |
| R12 | fork repo 워크플로우 미실행 → "영원히 building" | 낮음 | fork 감지 + Actions enable 선행 + 기존 15분 타임아웃 안전망 |

---

## 7. 단계별 로드맵 (기계 검증 기준 포함)

| 단계 | 내용 | 검증 기준 |
|---|---|---|
| **Phase 0** (선결) | ① OAuth 콜백 세션 바인딩 수정 (state_token 단독 식별 제거 — 콜백 세션 사용자 ↔ `oauth_state.user_id` 대조) ② `pushFilesAtomically` 인코딩 인자 + blob 청크 동시성 ③ 마이그레이션 109 + RPC 교체 | 타 세션 state 콜백 → 403 + service_accounts 미변경 / 구 RPC 시그니처 제거 확인 + source_type CHECK 위반 INSERT 실패 / base64 파일 push 후 blob 내용 일치 |
| **Phase 1A** (MVP 1차 — **트랙 A 먼저**) | deploy-upload API + upload-sanitizer + static-workflow + 클라 해제·정규화 + 위저드 카드/스텝 + my-sites 뱃지·모듈패널 게이트 | 단일 HTML 업로드 → pages_url HTTP 200 (15분 내, 기존 폴링 harness) / `.github/evil.yml` 포함 zip → 커밋 트리에 부재 + deploy.yml만 존재 / `../` 경로 → 400 / 쿼터 초과 업로드 → 403 / 61개 파일 → 400 |
| **Phase 1B** (MVP 2차 — 트랙 B) | repos/repo-analyze/deploy-repo API + 동의 다이얼로그 + **삭제 가드** + redeploy workflow_file 확장 + 멀티계정 P1 부분 수정 | fixture repo 배포 후 트리 diff = linkmap-pages.yml 1개 추가뿐 / Pages 활성화 강제 실패 → 해당 파일 삭제 커밋 발생 / import 사이트 DELETE → GitHub repo 존재 유지 + DB row 부재 / 빈 repo 분석 → 배포 불가 응답 |
| **Phase 2** | 빌드형: repo-analyze 프레임워크 감지(package.json·vite.config 등) → 빌드 워크플로우 변형 주입(npm ci+build+publish_dir) + 필요 시 GitHub Secrets(기존 nacl-encrypt) + import 에디터 재검토 + 단일 HTML 미리보기 | Vite fixture repo → 빌드 성공 → 200 / 감지 매트릭스(vite/next/cra/plain) 스냅샷 |
| **Phase 3** | 퍼널 브릿지 확장: 업로드 HTML 서비스 시그니처 스캔 → 서비스맵 자동 제안, showcase 소스 뱃지 노출 | Supabase SDK 포함 fixture → 서비스 후보에 supabase / 업로드 사이트가 showcase 쿼리에 등장 |

**A 선행 근거**: ① A는 신규 격리 repo — 실패 정리 semantics가 기존과 동일해 리스크 낮음, B는 사용자 실자산을 만지므로 동의·롤백·삭제 가드가 성숙한 뒤가 안전. ② 타겟 1순위 바이브코더의 최빈 시나리오가 A. ③ B는 A의 공통 인프라(스키마·에러맵·뱃지)를 증분으로 받음. 각 Phase 독립 출시 가능 — **Phase 1A만으로 "AI가 준 파일을 3분 만에 사이트로"라는 사용자 가치 완성**.

---

## 8. 비목표 (이번 범위에서 하지 않는 것)

- 서버사이드 배포 타겟 (PMO 제약 "GitHub Pages 정적만" 유지)
- Linkmap 도메인에서 사용자 콘텐츠 미리보기 렌더링 (Phase 1 — XSS 벡터 원천 제거)
- 업로드 원본(ZIP) 보관 — 서버는 수신조차 하지 않음
- 콘텐츠 사전 심의/검열 — 책임 분계는 ToS + GitHub AUP (§3.3)
- 호스팅형 `/s/[slug]` 발행 모델 전환 — 별도 트랙(2026-06-18) 유지
- collaborator repo 배포 (Phase 1은 owner만 — admin 권한 필요)
- 커밋 메시지/README에 Linkmap 워터마크 주입 — 사용자 자산 존중

---

## 부록

### A. 구현 시 수정 파일 목록

**신규 (10)**: `supabase/migrations/109_user_source_deploys.sql` · `src/app/api/oneclick/{deploy-upload,deploy-repo,repos,repo-analyze}/route.ts` · `src/lib/oneclick/{upload-sanitizer,static-workflow,client-zip}.ts` · `src/components/oneclick/{upload-source-step,repo-import-step,repo-consent-dialog}.tsx`

**수정 (15)**: `src/lib/github/git-data.ts`(인코딩·청크) · `repos.ts`(페이지네이션) · `pages.ts`(updatePagesBuildType) · `content.ts`(deleteFileContent) · `src/lib/validations/oneclick.ts`(스키마 4종) · `src/lib/oneclick/deploy-error-logger.ts` + `src/lib/deploy-error-map.ts`(카테고리 2종) · `src/hooks/use-deploy-machine.ts`(DeploySource) · `src/components/oneclick/{wizard-client,template-picker-step}.tsx`(카드 2장) · `src/lib/queries/oneclick.ts`(mutation·타입) · `src/app/api/oneclick/deployments/route.ts`(select 확장) · `deployments/[id]/route.ts`(**deleteRepo 가드**) · `deployments/[id]/redeploy/route.ts`(workflow_file) · `src/components/my-sites/{deploy-site-card,my-sites-client,site-editor-client}.tsx`(뱃지·게이트) · `src/app/api/oauth/[provider]/callback/route.ts`(Phase 0) · (선택) `status/route.ts`(멀티계정 P1)

`src/lib/quota.ts`는 **무수정** — count 기반이라 자동 합산 확인 완료.

### B. 2026-07-31 Supabase 위젯 기획과의 관계

**독립 트랙 — 충돌 없음, 병행 가능.** 07-31은 "템플릿 사이트에 동적 데이터"(배포 후 편집기 진입점), 본 기획은 "템플릿이 아닌 소스의 배포"(배포 위저드 진입점). 접점은 Phase 3 서비스맵 브릿지에서 자연 합류 (업로드 사이트가 Supabase를 쓰면 노드 제안). 두 기획 모두 OAuth 콜백 P0 수정을 Phase 0으로 공유 — **한 번 수정하면 두 트랙 모두 게이트 통과**.

### C. 기능 명칭 후보 (UI 카피 — 구현 시 확정)

| 후보 | 트랙 A 카드 | 트랙 B 카드 |
|---|---|---|
| 1 (권장) | "내 파일 올리기" | "내 GitHub 가져오기" |
| 2 | "AI가 만든 파일 배포" | "내 저장소 연결" |
| 3 | "직접 만든 사이트" | "기존 프로젝트 배포" |

권장 근거: 바이브코더에게 'repo'·'배포' 같은 용어보다 "올리기/가져오기"가 행동 그대로의 언어. 카드 부제로 보완 (예: "ChatGPT·Claude가 만들어준 HTML도 OK").

---

*근거: 2026-08-01 코드베이스 조사 3건(배포 파이프라인 end-to-end · 재사용 인프라 지도 · 제품 맥락) + 상세 설계 검토 1건(트랙별 16개 설계 항목), 2026-07-12 원클릭 감사 메모리(P0/P1), GitHub REST API 공식 문서(Git Data blob 한계·secondary rate limit·Pages build_type·Actions permissions), `docs/onelink/PMO.md` 제약("GitHub Pages 정적만").*
