# 원클릭 "내 자료 배포" — 구현 장애 요소 정리 + 단계별 실행 계획

- 작성: 2026-08-01 · 상태: **Phase 0 진행 중** · 모체 기획: [`2026-08-01_oneclick-user-content-deploy.md`](./2026-08-01_oneclick-user-content-deploy.md)
- 목적: 구현에 문제가 되는 지점을 **실측 근거(파일:라인)와 함께** 전수 정리하고, Phase별로 해소 순서·검증 기준·진행 상태를 추적한다.

---

## 1. 구현 장애 요소 총정리 (실측)

| # | 장애 요소 | 근거 (실측) | 심각도 | 해소 Phase |
|---|---|---|---|---|
| B1 | **OAuth 콜백이 세션 검증 없이 state_token만으로 사용자 식별** — 공격자 state로 피해자 GitHub 인가를 유도하면 피해자 토큰이 공격자 계정에 바인딩(크로스 계정 CSRF). 주석으로 "쿠키 유실 대비 의도적 설계"라 명시돼 있어 단순 누락이 아님 | `src/app/api/oauth/[provider]/callback/route.ts:34-50` | **P0** | **0** |
| B2 | **RPC 최신 본문은 098이 아니라 100** — 099(enum 캐스트 `::subscription_plan`), 100(admin 무제한 바이패스)이 함수를 덮어씀. 109 재생성을 098 기반으로 하면 **배포 500(enum 오류)·admin 쿼터 차단이 회귀** | `supabase/migrations/099:53`, `100:44-60` | 높음 | **0** |
| B3 | `homepage_deploys.template_id NOT NULL` — 템플릿 없는 배포(upload/import) 불가 | `docs/db-schema.md:546` | 높음 | **0** |
| B4 | **RPC DEFAULT 인자 추가 시 오버로드 충돌** — 구 6-인자와 신 7-인자(DEFAULT) 공존 시 6-인자 호출이 모호성 오류. `DROP FUNCTION` 후 재생성 필수 + **M108 default privileges로 신규 함수는 기본 무권한 → `GRANT TO authenticated` 명시 필수** | `docs/db-schema.md:948` (M108 규칙) | 높음 | **0** |
| B5 | `pushFilesAtomically`가 인코딩 utf-8 하드코딩 + blob 생성 **전량 병렬** — 바이너리(이미지) 전송 불가 + 60파일 burst 시 GitHub secondary rate limit 위험 | `src/lib/github/git-data.ts:174-176` | 중간 | **0** |
| B6 | **사이트 삭제가 GitHub repo 자체를 삭제** — import 소스에 무가드 적용 시 사용자 원본 repo 삭제 사고. source_type(B3) 선행 필요 | `src/app/api/oneclick/deployments/[id]/route.ts:127` | **치명** | 1B |
| B7 | `fork_status` 어휘가 fork 시대 레거시('forked' 등) — 상태 판정에 미사용이므로 신규 소스도 기존 값 유지 (신규 CHECK 값 추가 금지) | `migrations/100:76`, `db-schema.md:549` | 낮음 (기록) | — |
| B8 | 아카이브(zip)·multipart 라이브러리 전무 — 클라 해제(fflate, 클라 번들 한정 dynamic import)로 설계 확정 | `package.json` 의존성 조사 | 중간 | 1A |
| B9 | `/api/github/repos`가 project_id 필수 + per_page 50 고정·페이지네이션 없음 — 프로젝트 없는 repo 선택 흐름 불가 → 신규 라우트 | `src/app/api/github/repos/route.ts`, `src/lib/github/repos.ts` | 중간 | 1B |
| B10 | 멀티 GitHub 계정 시 status/redeploy/files/batch-update가 '첫 active 계정' 토큰 사용 (기존 P1) — import private repo에서 실오류로 표면화 | 2026-07-12 감사 P1① | 중간 | 1B (부분) |
| B11 | 에러 카테고리 어휘가 3곳 중복 정의 (서버 logger / 클라 map / DB) — 신규 2종(`upload_validation`, `repo_not_deployable`) 추가 시 3곳 동기화 필수 | `deploy-error-logger.ts`, `deploy-error-map.ts` | 낮음 | 1A |
| B12 | template 정보를 무조건 렌더하는 UI — template null 시 뱃지·프리뷰 깨짐 | `src/components/my-sites/deploy-site-card.tsx` | 낮음 | 1A |
| B13 | **API 파이프라인 테스트 미커버** (oneclick 테스트는 생성기/라운드트립 2계열뿐) — 보안 수정은 재현 테스트 우선 원칙 적용 | 2026-07-12 감사 | 중간 | 각 Phase |
| B14 | **마이그레이션 파일 작성 ≠ 라이브 반영** (M102 1개월 방치 이력) — 109 적용은 Supabase MCP 필요(사용자 연결 확인 게이트) + 적용 후 `has_function_privilege`·CHECK 동작 검증 | `db-schema.md:952` | 높음 (프로세스) | 0 적용 시 |
| B15 | `updateRef` 기본 `force: true` — 동시/수동 커밋 무단 유실 (기존 P1③). 트랙 A는 Linkmap 생성 repo라 저위험, 트랙 B는 contents API라 비해당 | `src/lib/github/git-data.ts:112` | 낮음 (백로그) | 2 |
| B16 | **`oauth_states` RLS가 `user_id`만 강제** — 사용자가 PostgREST로 타인 `project_id`/외부 `redirect_url`을 담은 state를 직접 INSERT 가능. 콜백의 adminClient upsert는 RLS를 우회하므로 **타 사용자 프로젝트의 GitHub 연결 탈취** 가능 (Phase 0 리뷰에서 신규 발견) | `migrations/012_service_accounts.sql:76-80` + 콜백 upsert | 높음 | **0 (해소)** |
| B17 | **109를 M100 기준으로 작성하면 M101(trialing) 회귀** — trial 중인 Pro/Team이 free 한도 3으로 차단되는 이미 고쳐진 사고가 재발. 본문 최신 기준은 **M101** (107·108은 권한만 변경) | `migrations/101_quota_rpc_include_trialing.sql:52` | 높음 | **0 (해소)** |
| B19 | **테스트 중 로그인 세션이 반복 끊김**(3회) — 원인은 세션이 아니라 **잘린 Supabase anon 키**였다. 13:00Z 배포본 번들에 앞글자가 잘린 키(`b_publishable_…`)가 인라인돼 전 요청 401. 내 테스트 배포(`545c8243`·`ec6a006d`)가 그 오염된 Secret으로 빌드된 것이 재현 경로였다. 키는 빌드 타임 인라인이라 클라이언트 자가치유가 원천 불가 | 높음 | ✅ 별도 트랙에서 해소 — `bc41913b`가 배포 전 anon 키 검증 게이트 추가(형식+라이브 수용), 분석은 `docs/log/2026-08.md` 참조 |
| B18 | `NEXT_PUBLIC_APP_URL` 고정 redirect_uri + 호스트 한정 세션 쿠키 — www/프리뷰 등 **별칭 호스트에서 시작한 정상 OAuth가 세션 부재로 거부**될 수 있음 (세션 대조 도입으로 새로 생긴 파손 경로). 앱 코드가 아닌 Cloudflare 리다이렉트 설정 영역 | `oauth/[provider]/authorize/route.ts:81` | 중간 (배포 전 확인) | 배포 전 |

---

## 2. 단계별 실행 계획

### Phase 0 — 보안 선결 + 공통 기반 (선행 조건: 없음)

| 항목 | 해소 블로커 | 내용 | 검증 기준 | 상태 |
|---|---|---|---|---|
| 0-1 | B1, B16 | 콜백에 세션 대조 추가: `getUser()` 후 `user.id !== oauthState.user_id`면 state 소각 + 거부. **토큰 교환 이전에 차단.** 리뷰 후 보강 4종: ① state의 `project_id` 소유권 재검증(B16) ② 원자적 state 단일 사용 클레임 ③ 인증 장애(`auth_check_failed`)를 공격과 구분 + state 보존 ④ `safeInternalPath` 재사용으로 redirect_url 정규화 | 세션 없음/타 사용자 세션/타인 project_id/재사용 state → 각각 거부 + 토큰 교환 fetch 미호출 + service_accounts 미기록. 소유자 세션 → 정상 저장 + audit | ✅ 2026-08-01 (재현 2건 실패 확인 → 수정 → **10/10 통과**) |
| 0-2 | B5 | `pushFilesAtomically` files에 `encoding?: 'utf-8'\|'base64'` + blob 생성 8개 청크 순차. 기존 호출부 무변경(기본값) | 단위 테스트: 파일별 인코딩 전달·동시성 ≤8·tree 순서 보존·빈/기존 repo 분기 | ✅ 2026-08-01 (5/5 통과) |
| 0-3 | B2, B3, B4, B17 | `109_user_source_deploys.sql`: template_id nullable + source_type + 정합성 CHECK + **M101 본문 기반** RPC DROP·재생성(p_source_type, 검증 포함) + GRANT 명시. `src/types/core.ts`·`docs/db-schema.md` 동기화 | typecheck 통과. (라이브 적용 후) 구 시그니처 부재·CHECK 위반 INSERT 실패·admin 바이패스·trialing 인정 확인 | ✅ 파일 작성 완료 (라이브 적용은 0-G 대기) |
| 0-V | B13 | typecheck + 전체 vitest + 변경분 적대적 리뷰(3렌즈) | 전체 통과 | ✅ typecheck 클린 · **413/413 통과** · lint 에러 0 · 리뷰 지적 2건(B16·B17) 수정 완료 |
| 0-G | B14 | Supabase MCP로 109 라이브 적용 + advisor/실쿼리 검증 | `has_function_privilege` 확인, CHECK 동작 확인 | ✅ 2026-08-01 적용 완료 — 7-인자 단일 시그니처(구 6-인자 소멸), trialing·admin·enum 캐스트 유지, 6-인자 레거시 호출 해석 OK, CHECK 4종 프로브 통과, 기존 128행 정합, advisor에서 `anon` 실행 목록 제외 확인 |

### Phase 1A — 트랙 A: 파일 업로드 MVP (선행: Phase 0, 0-G) — ✅ 구현 완료 (2026-08-01)

| 항목 | 산출물 | 상태 |
|---|---|---|
| 서버 검증 | `src/lib/oneclick/upload-sanitizer.ts` — 경로 무결성·확장자·크기·이미지 매직바이트·`.github/` 전량 드랍 | ✅ 테스트 19건 |
| 워크플로우 주입 | `src/lib/oneclick/static-workflow.ts` — 빌드 없는 정적 Pages 워크플로우 상수. 파일명 `deploy.yml` 유지로 redeploy·상태추적 무수정 호환 | ✅ |
| 배포 API | `src/app/api/oneclick/deploy-upload/route.ts` — 기존 deploy 골격 복제 + `p_source_type:'upload'` | ✅ |
| 스키마 | `deployUploadRequestSchema` (validations/oneclick.ts) | ✅ |
| 클라 해제 | `src/lib/oneclick/client-upload.ts` — fflate dynamic import, 단일HTML/ZIP/폴더 → `files[]` 수렴, 래퍼 폴더 unwrap, index 판정 | ✅ 테스트 11건 |
| 위저드 | `upload-source-step.tsx` 신규 + `wizard-client.tsx` 진입 카드 + `use-deploy-machine.ts` `handleUploadDeploy` | ✅ |
| my-sites | 소스 라벨(`deploy-site-card.tsx`) + deployments select에 `source_type`. 모듈 패널은 기존 `moduleSchema` 게이트로 자동 차단 확인 | ✅ |
| 에러 어휘 | `upload_validation` 카테고리 추가(B11) | ✅ |
| 의존성 | `fflate@0.8.3` 직접 의존성 추가 (npm 정식 릴리스 확인) | ✅ |

- 검증 결과: **typecheck 클린 · vitest 459/459 · lint 에러 0**
- 잔여: `.github/evil.yml` 차단·61개 파일 거부 등은 sanitizer 단위 테스트로 커버. **실제 배포 e2e(단일 HTML → pages_url 200)는 라이브 GitHub 계정이 필요해 수동 확인 대상**

#### Phase 1A 적대적 리뷰(3렌즈) 반영 — 수정 완료 8건

| # | 결함 | 심각도 | 조치 |
|---|---|---|---|
| R-1 | **퍼센트 인코딩 워크플로우 인젝션** — 편집기 PUT의 금지 패턴이 리터럴만 검사해 `%2Egithub/workflows/x.yml`이 통과하고, Contents API URL에 보간되면 GitHub이 디코딩해 `.github/`로 복원. 트랙 A가 선언한 "서버 상수 워크플로우만 존재" 불변식이 배포 직후 깨짐 (기존 결함, 템플릿 트랙도 해당) | **높음** | `fileUpdateSchema`에서 이중 인코딩까지 디코딩 후 검사 + 회귀 테스트 7건 |
| R-2 | `Index.html` 대소문자 — sanitizer의 index 검사가 소문자 집합을 봐서 통과시키나 GitHub Pages는 대소문자 구분 → **배포는 성공하고 사이트만 404** | 높음 | 중복 판정(대소문자 무시)과 index 판정(대소문자 구분) 분리 + 테스트 |
| R-3 | **zip bomb 방어가 실효 없음** — `unzipSync`는 동기 전량 해제라 결과를 받은 뒤 크기를 재면 이미 메모리에 다 올라온 뒤. 주석이 사실과 반대였음 | 중간 | `unzipSync(buf, {filter})`로 해제 **이전** `originalSize` 누적 차단 + 해제 후 재확인(헤더 위조 대비) |
| R-4 | RETRY 무한 루프 — 업로드 실패 후 센티넬 `'upload'`가 템플릿 피커의 defaultTemplate으로 흘러가 "선택 없는데 배포 버튼 활성" → 400 → 재시도 반복 | 높음 | 위저드에서 센티넬을 null로 정규화 |
| R-5 | 다중 래퍼 폴더 — `out/my-site/...` 이중 래핑에서 한 겹만 벗겨져 상대경로 깨진 index 복제본 생성 (배포는 성공, 사이트만 깨짐) | 중간 | 더 벗길 게 없을 때까지 반복(깊이 상한 16) + 테스트 |
| R-6 | HTML 0개 신호 오독 — `htmlCandidates: []`가 "정상"과 "html 없음" 양쪽을 뜻해 배포 버튼이 활성화되고 서버에서야 거절 | 중간 | `hasIndex` 플래그 신설로 UI 게이팅 + 테스트 |
| R-7 | 폴더 드롭 미구현 — UI가 폴더를 권하는데 `dataTransfer.files`만 읽어 원인 불명 실패 | 중간 | `webkitGetAsEntry` 재귀 순회 구현 |
| R-8 | 인증 유실·클라 상한 불일치 — 파일 전송 후 401로 준비 파일 전량 소실 / 서버 개별 상한(2MB·5MB)이 클라에 없어 업로드 후 거절 | 중간 | 전송 전 인증·연결 확인, 클라 상한을 서버와 동기화, `upload_validation` 클라 에러 매핑 추가 |

리뷰가 "문제 없음"으로 확인한 것: 리소스 정리 6개 분기 정합 · M109 CHECK 정합 · 감사 로그 어휘 · redeploy/상태추적 호환(워크플로우 파일명 `deploy.yml` 유지가 전제) · `HomepageDeploy` 타입 변경 무회귀 · 편집기 모듈 패널 자동 차단.

**미조치(보고만)**: sanitizer의 `hasControlChar`가 C1(0x80~0x9F) 미검사 — 확장자 allowlist·도트 규칙이 남아 악용 불가한 미관 문제. `config_data` 업데이트 실패 은닉(Promise.all) — 배포 자체엔 영향 없음. 대용량 base64 메모리 증폭.

### Phase 1B — 트랙 B: repo 연결 (선행: 1A) — ✅ 구현 완료 (2026-08-01)

| 항목 | 산출물 | 상태 |
|---|---|---|
| **삭제 가드(B6)** | `deployments/[id]/route.ts` — `source_type==='import'`면 `deleteRepo` 스킵, 응답에 `repo_kept` | ✅ **재현 테스트로 위험 실증 후 수정** (3건) |
| repo 목록 | `GET /api/oneclick/repos` — 페이지네이션, `affiliation=owner`(admin 권한 필요하므로 collaborator 제외) | ✅ |
| repo 분석 | `src/lib/oneclick/repo-analyzer.ts` + `POST /api/oneclick/repo-analyze` — admin 권한·정적 판별(`/`→`docs`→`dist`→`build`→`public`→`out`)·빈/fork/private/legacy Pages·link-only 판정 | ✅ |
| 배포 | `POST /api/oneclick/deploy-repo` — 서버에서 **분석 재실행**(클라 결과 불신) → 워크플로우 1파일 커밋 → Pages 활성화/전환 → `p_source_type:'import'` | ✅ |
| 워크플로우 | `linkmap-pages.yml` (템플릿·업로드의 `deploy.yml`과 분리해 충돌 원천 차단). `buildImportWorkflowYml`은 `isSafeWorkflowValue` 통과 값만 보간 — 실패 시 이스케이프가 아니라 **거부** | ✅ 테스트 24건 |
| 롤백 | "우리가 만든 것만 지운다" — Pages 실패 시 `deleteFileContent`로 워크플로우 파일만 삭제, 실패 시 잔존 안내. **저장소·기존 파일 무수정** | ✅ |
| 재배포 | `redeploy`가 `config_data.workflow_file`·`source_branch` 사용. **import는 레거시 package.json 자동 패치 스킵**(사용자 저장소 수정 금지) | ✅ |
| UI | `repo-import-step.tsx` — 저장소 목록·검색 + 동의 화면(커밋될 YAML **전문** + 불변 보증 체크리스트 + "1개 파일 커밋하고 배포") | ✅ |
| 공용 헬퍼 | `github-account.ts` — 5개 라우트가 쓰던 계정·토큰 해석을 단일화(중복 제거) | ✅ |

- 검증 결과: **typecheck 클린 · vitest 491/491 · lint 에러 0**
- 잔여: 실제 repo 대상 e2e(트리 diff=1 확인)는 라이브 GitHub 계정 필요 — 수동 확인 대상

#### Phase 1B 적대적 리뷰(3렌즈) 반영 — 수정 완료 7건

리뷰의 핵심 지적: **트랙 B가 "브랜치=main / 워크플로우=deploy.yml / 저장소=Linkmap 소유"라는 기존 3대 암묵 전제를 모두 깼는데, 공용 경로들은 여전히 그 전제 위에서 동작한다.** 개별 패치가 아니라 `source_type`을 모르는 공용 라우트 전수 점검으로 대응했다.

| # | 결함 | 심각도 | 조치 |
|---|---|---|---|
| R-9 | **자동 재시도가 사용자의 `deploy.yml`을 실행** — `resolveDeployStatus`가 `triggerWorkflowDispatch`를 기본 인자로 호출. `deploy.yml`은 실사용 저장소에서 가장 흔한 이름이라 프로덕션 배포·npm publish 등이 무단 발사될 수 있었다. 게다가 `getLatestWorkflowRun`이 `branch=main` 고정·워크플로우 무필터라 **남의 CI 실패를 우리 배포 실패로 오독**해 트리거 조건까지 헐거웠다 | **치명** | `workflowOptionsFromDeploy` 헬퍼 신설 — 워크플로우 파일·브랜치를 배포별로 전달하고 **import는 자동 재시도 자체를 금지**(수동 재배포만). `getLatestWorkflowRun`에 워크플로우·브랜치 한정 추가 |
| R-10 | **편집기가 사용자 저장소의 기존 파일을 덮어씀** — files PUT·batch-update·upload가 `source_type` 미확인. `pushFilesAtomically`는 `heads/main` 고정이라 기본 브랜치가 다르면 **고아 main 브랜치까지 생성** | 높음 | 세 라우트 모두 import면 403 + 카드에서 편집 버튼 숨김 |
| R-11 | 동명 파일 무단 덮어쓰기 — 사용자가 직접 만든 `linkmap-pages.yml`을 소유 확인 없이 대체하고, 롤백에서 그 파일을 삭제 | 높음 | `IMPORT_WORKFLOW_MARKER`로 소유 확인 → 남의 파일이면 409로 안내. 롤백은 **이번에 새로 만든 파일만** 삭제(sha 없으면 거짓 성공 대신 실패 보고) |
| R-12 | 동의 화면과 실제 동작 불일치 — 폴더를 바꿔도 미리보기 YAML은 기본값 고정, link_only인데 fork 항목 표시, 폴더 선택이 무의미한데 노출 | 중간 | 미리보기를 선택값으로 갱신, link_only 분기 정리 |
| R-13 | **가장 결과가 큰 행위가 동의 목록에 없음** — GitHub Pages 활성화(=저장소 내용의 전 세계 공개)와 최종 URL 미표시 | 중간 | 공개 사실·URL을 동의 목록 최상단에 명시 |
| R-14 | 삭제 다이얼로그가 실제 동작과 반대 — 템플릿·업로드는 저장소가 삭제되는데 "유지됩니다"로 승인받음 | 중간 | `source_type`별 문구 분기(import는 "연결만 해제, 사이트는 계속 공개") |
| R-15 | 분석 경쟁 조건 — A→뒤로→B 시 A의 분석이 B 화면에 붙어 **승인 화면과 다른 저장소에 커밋** 가능 | 중간 | 요청 시퀀스 가드로 마지막 응답만 반영 |

**미조치(보고만)**: `redeploy`의 레거시 package.json 패치가 `createOrUpdateFileContent` 인자 순서를 잘못 넘김(sha↔message) — 기존 결함이고 try/catch로 삼켜져 무해, import는 이미 스킵. 조직 저장소의 admin 협업자가 "본인 소유 저장소" 안내와 달리 통과하는 문구 불일치.

### Phase 2 — 빌드형 확장 — ✅ 구현 완료 (2026-08-01)

Phase 1B는 "완성된 index.html이 저장소에 있어야" 배포할 수 있었다. 실제 프로젝트는 빌드
산출물을 저장소에 넣지 않는 것이 정상이므로, 이 제약은 대부분의 진짜 저장소를 막는다.

| 항목 | 산출물 |
|---|---|
| 프레임워크 감지 | `src/lib/oneclick/framework-detect.ts` — 설정 파일 우선, 없으면 의존성으로 추정. Vite·Next·Astro·SvelteKit·Nuxt·Gatsby·CRA + generic 폴백 |
| 산출물 위치 | 프레임워크별 기본값 + **후보 목록**(확신이 낮으면 사용자가 고르게) |
| 설치 명령 | `package-lock.json` 있으면 `npm ci`, 없으면 `npm install` |
| 빌드 워크플로우 | `buildBuildWorkflowYml` — setup-node + install + build + artifact 업로드 |
| 차단 해제 | `block_reason: 'needs_build'` 제거 → 빌드형도 배포 가능. 여전히 차단하는 것은 빈 저장소·권한 없음·HTML도 빌드 표식도 없는 경우 |
| 동의 화면 | "**Vite** 프로젝트로 보여요 — GitHub에서 빌드한 뒤 게시합니다" + `npm ci → npm run build → dist` 표시 |

**핵심 설계 판단 — basePath 문제를 숨기지 않는다.** GitHub Pages는 `/<저장소이름>/` 하위
경로로 서비스하는데 대부분의 번들러는 자산 경로를 `/`부터 쓴다. 그대로 빌드하면 화면은
뜨지만 CSS·JS가 404가 된다. 우리에겐 "사용자 설정 파일을 고치지 않는다"는 불변식이 있으므로
고칠 수 없는 경우가 있고, 그때는 **배포 전에 경고한다**:

- `certain`(Next·Gatsby·Nuxt): 설정 파일에만 지정 가능 → 명시 경고
- `likely`(Vite·Astro·SvelteKit): 설정에 따라 다름 → 경고. 단 Vite는 빌드 스크립트가
  **순수 `vite build`일 때만** `--base=/repo/`를 붙인다. 사용자가 조립한 스크립트에
  플래그를 끼워 넣으면 의도를 바꾸므로 하지 않는다
- `none`(CRA): `PUBLIC_URL` 환경변수를 존중 → 우리가 넘겨주면 해결

**명령 주입 방어**: 빌드 명령에도 `isSafeWorkflowCommand` 화이트리스트를 적용한다. 셸
메타문자(`&&`, `;`, `$()`, `|`)를 배제해 이스케이프가 아니라 **거부**한다.

- 검증: typecheck 클린 · **vitest 521/521** · lint 에러 0

#### 빌드형 라이브 검증 (2026-08-02)

실제 Vite 저장소(`vite-test-0802` — 검증 후 삭제)로 끝까지 배포했다.

| 검증 항목 | 결과 |
|---|---|
| 프레임워크 감지 | `vite.config`가 없어도 **의존성으로 Vite 감지** ✅ |
| 동의 화면 | "Vite 프로젝트로 보여요" + `npm install → npx vite build --base=/vite-test-0802/ → dist` ✅ |
| 저장소 변경 | `linkmap-pages.yml` 1개만 추가, 기존 4개 파일 **전부 무수정**(각 커밋 1개) ✅ |
| GitHub Actions | 빌드 성공 ✅ |
| **자산 경로** | `/vite-test-0802/assets/…` — JS·CSS 모두 **HTTP 200** ✅ |
| 화면 | 그라데이션·색상·여백 정상 = CSS 번들이 실제로 로드됨 ✅ |
| DB | `deploy_mode: build` · `framework: vite` · `publish_dir: dist` ✅ |

**테스트 저장소를 만들다가 결함 1건 발견·수정(R-19)**: Vite·CRA는 저장소 루트에
`index.html`을 두는데 그건 완성된 페이지가 아니라 `/src/main.js`를 참조하는 **빌드 입력
템플릿**이다. 그런데 분석기가 "루트에 index.html이 있으면 정적"으로 판정해 빌드를 건너뛰고
원본을 그대로 올렸다 — 배포는 성공하고 화면만 비는, 진단이 가장 어려운 실패다.
판정을 순수 함수(`decideDeployMode`)로 분리하고 규칙을 정리했다:

| 상황 | 판정 | 근거 |
|---|---|---|
| `docs/`·`dist/`에 index.html | 정적 | 사용자가 커밋해 둔 결과물 — 프레임워크가 있어도 재빌드하지 않는다 |
| 루트에만 index.html + 프레임워크 확실 | **빌드** | 그건 템플릿이다 |
| 루트에만 index.html + 프레임워크 불확실 | 정적 | 린터용 `package.json`만 있는 순수 정적 사이트 |

> 로컬 사전 검증에서 한 번 오판할 뻔했다 — Git Bash가 `--base=/vite-test-0802/`를 Windows
> 경로(`/Program Files/Git/…`)로 변환해 잘못된 결과를 냈다. Ubuntu 러너에선 발생하지 않는
> 로컬 셸 아티팩트라 경로 변환을 끄고 재확인했다.

### Phase 3 — 퍼널 브릿지 — ✅ 구현 완료 (2026-08-02)

배포로 끝나면 1층에서 멈춘다. 코어 컨셉의 "배우다 보니 관리가 되어 있는" 경험은 배포한
사이트가 **자기가 쓰는 서비스를 스스로 드러낼 때** 시작된다.

| 항목 | 산출물 |
|---|---|
| 감지 모듈 | `src/lib/oneclick/service-signatures.ts` — 배포 콘텐츠(HTML/JS)의 CDN 흔적 + `package.json` 의존성 |
| 대상 서비스 | Supabase · GA4 · Firebase · Stripe · 토스페이먼츠 · Kakao(로그인/AdFit) · Google Maps · Mapbox · AdSense · Clarity · Sentry · PostHog · Plausible · Mixpanel · OpenAI · Anthropic (카탈로그에 실제 존재하는 slug만) |
| 감지 시점 | **배포 시점**에 끝낸다 — 트랙 A는 파일이 이미 메모리에 있어 추가 비용 0, 트랙 B는 이미 읽은 `package.json` + 진입 `index.html` 하나만 더 |
| 기록 | `config_data.detected_services` (근거 경로 포함) |
| 연결 | `POST /api/oneclick/deployments/[id]/services` — 사용자가 고른 것만 `project_services`에 추가 |
| UI | my-sites 카드의 "이 사이트가 쓰는 서비스" — 칩 토글 + "서비스맵에 담기" |

**왜 별도 감지가 필요했나**: 기존 `/api/mcp/detect`는 npm 패키지명·환경변수 키를 매핑한다.
그런데 바이브코더가 AI에게 받아 올리는 페이지는 빌드 도구 없이
`<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js">` 같은 CDN 태그를 쓴다.
**배포된 콘텐츠 자체**를 보지 않으면 이런 사이트를 전혀 알아보지 못한다.

**자동 등록하지 않는다.** 서비스맵은 사용자가 자기 서비스 구조를 스스로 그리는 곳이라
추측으로 채우면 신뢰를 잃는다. 감지는 "이런 걸 쓰고 계시네요"까지만 하고 선택은 맡긴다.
서버도 **감지 목록에 있는 slug만** 받아들여, 이 엔드포인트가 임의 서비스를 프로젝트에
끼워 넣는 통로가 되지 않게 막았다.

#### Phase 3 적대적 리뷰(2렌즈) 반영 — 수정 5건

리뷰가 확인해 준 것: 크로스테넌트 쓰기 없음 · 민감정보 유출 없음(감지 결과는 slug와 경로만,
파일 내용·시크릿은 어디에도 담기지 않음) · ReDoS 없음(최악 입력 실측 188~242ms, 한도 30초).

| # | 결함 | 조치 |
|---|---|---|
| R-20 | **오탐 시그니처** — `supabase\.co`가 **`supabase.com`에도 매치**되고, `initializeApp(`은 사용자 정의 동명 함수에, `G-[A-Z0-9]{8,}`는 주문번호에 걸렸다. 전부 바이브코더 페이지에서 흔한 형태라 실사용 즉시 발현한다 | 단어 경계로 `.com` 배제 · Firebase는 import/CDN 문맥만 · GA4는 gtag 문맥 필수. **오탐 방지 테스트 4건 신설** |
| R-21 | **템플릿 트랙 감지 없음** — 템플릿 5종이 실제로 GA4 스니펫을 담고 있는데, 정작 **가장 큰 유입 트랙**에서 퍼널 브릿지가 작동하지 않았다 | `deploy/route.ts`에도 감지 추가 (번들이 메모리에 있어 비용 0) |
| R-22 | **허용목록이 신뢰 경계가 아님** — `config_data`는 RLS(`FOR ALL USING`에 `WITH CHECK` 없음)로 사용자가 자기 row를 직접 수정할 수 있다. 즉 "감지된 것만"은 권한 경계가 아니라 UX 가드다 | 서버 상수 `DETECTABLE_SLUGS`로 교차검증해 실제 상한을 고정 + 주석에 경계를 정확히 명시 |
| R-23 | **프로젝트 소유권 미검증** — 배포 row의 `user_id`만 보고 `project_id`는 확인하지 않았다. RLS가 막아 실제 쓰기는 불가했지만 DB 한 겹뿐이었고, 실패 시 RLS 원문이 500으로 노출됐다 | 프로젝트 소유권 명시 확인 + DB 오류 원문 대신 일반 메시지 |
| R-24 | 새로고침하면 이미 담은 서비스를 다시 제안 | `config_data.linked_services`에 기록해 재제안하지 않음 |

- 검증: typecheck 클린 · **vitest 542/542** · lint 에러 0

#### Phase 3 라이브 검증 (2026-08-02)

**진짜 서비스 2개 + 오탐 유발 3개**를 한 페이지에 넣어 감지와 오탐 방지를 동시에 확인했다.

| 넣은 것 | 기대 | 결과 |
|---|---|---|
| GA4 gtag 스니펫 | 감지 | ✅ 감지 |
| Stripe (`js.stripe.com`) | 감지 | ✅ 감지 |
| 사용자 정의 `initializeApp()` 함수 | **감지 안 됨** | ✅ 걸러짐 |
| `supabase.com` 문서 링크 | **감지 안 됨** | ✅ 걸러짐 |
| 주문번호 `G-20240115ABC` | **감지 안 됨** | ✅ 걸러짐 |

이어서 퍼널이 끝까지 연결되는지 확인했다:

1. my-sites 카드에 "이 사이트가 쓰는 서비스" — **GA4·Stripe 칩만** 표시 ✅
2. "서비스맵에 담기" → `project_services`에 **실제로 추가** ✅
3. 새로고침 후 **"서비스맵에 담았어요"**로 바뀌어 재제안하지 않음 (R-24 확인) ✅
4. 서비스맵 화면에 **GA4·Stripe = BACKEND 노드, GitHub = DEVTOOLS 노드**로 렌더 ✅
5. "환경변수 설정 필요 3개" + Health Check가 **자동으로 활성화** ✅

5번이 이 기획의 목표였다 — 배포 한 번으로 관리 인프라가 채워지는 것. 코어 컨셉의
"배우다 보니 관리가 되어 있는" 경험이 실제 화면에서 성립함을 확인했다.

- 잔여(보고만): `project_services`의 UNIQUE 제약이 M094에서 제거돼 동시 요청 시 중복 행 가능(영향은 서비스맵 노드 중복). `homepage_deploys` RLS에 `WITH CHECK` 부재는 별도 마이그레이션 사안

---

## 2-1. 라이브 검증 결과 (2026-08-01, 브라우저 실측)

실제 linkmap.biz에서 두 트랙을 끝까지 배포해 검증했다. 테스트 자원은 검증 후 전부 삭제했다.

| 검증 항목 | 트랙 A (내 파일 올리기) | 트랙 B (내 GitHub 가져오기) |
|---|---|---|
| 첫 화면 처리 | `my-portfolio.html` → `index.html` 자동 변환 ✅ | 루트에 index.html 없음 → **`docs/` 자동 감지** ✅ |
| 저장소에 들어간 것 | `deploy.yml` + `index.html`만 (+GitHub 자동 README) ✅ | **`linkmap-pages.yml` 1개만 추가** ✅ |
| 기존 파일 무수정 | 업로드 원본과 배포본 **바이트 일치** ✅ | `docs/index.html`·`README.md` 각각 최초 커밋 1개뿐 = **무수정 실증** ✅ |
| 파일 모드 | 전부 `100644` (symlink·실행파일 불가) ✅ | 동일 ✅ |
| 워크플로우 내용 | 빌드 없는 정적 배포(`npm` 없음) ✅ | `path: docs` 정확 반영, 빌드 없음 ✅ |
| 실제 사이트 | HTTP 200, 렌더링 정상 ✅ | HTTP 200, `docs/` 내용 게시 ✅ |
| DB 정합성 | `source_type='upload'` + `template_id=NULL` (M109 CHECK) ✅ | `source_type='import'` ✅ |
| my-sites 표시 | "내가 올린 파일" + 편집 버튼 **있음** ✅ | "내 GitHub 저장소" + 편집 버튼 **없음**(사용자 자산 보호) ✅ |
| 삭제 안내 | "저장소가 함께 삭제됩니다" ✅ | 동일 플래그(`isImported`) 기반 — 편집 숨김·라벨로 간접 검증 (직접 관찰은 세션 만료로 미수행) |

**엣지 케이스 (ZIP)**: 래퍼 폴더(`my-site/`) 자동 벗기기 ✅ · `__MACOSX` 제거 ✅ · index 없이 HTML 여러 개 → 선택 UI + **선택 전 배포 잠김** ✅ · 선택 시 원본 유지한 채 `index.html` **복제 추가**(링크 보존) ✅ · `.github/workflows/evil.yml`·`.env`·`run.sh` **제외 + 사유 표시** ✅

### 라이브 테스트로 발견해 수정한 것 (R-16~R-18)

| # | 결함 | 조치 |
|---|---|---|
| R-16 | 배포 진행 화면이 **다른 탭으로 옮기면 멈춤** — "페이지를 닫지 마세요"라고 안내하는 화면인데 폴링이 중단됐다. 6분간 "설정 중"에 머무는 동안 사이트는 이미 HTTP 200이었다 | `refetchIntervalInBackground: true` |
| R-17 | **미리보기가 실제 배포와 불일치** — 차단 규칙이 서버에만 있어 요약 카드에 `.github/workflows/evil.yml`·`.env`·`run.sh`가 그대로 표시됐다. 보안 경계는 무사했지만 사용자에겐 본 파일이 조용히 사라지는 경험 | 클라이언트에도 동일 규칙 적용 + 제외 파일·사유를 배포 전 표시 |
| R-18 | **세션 만료를 "예기치 않은 오류"로 안내** — 실제로 이 함정에 걸려 원인 파악이 지연됐다. 사용자는 로그인이 풀린 줄 모르고 재시도만 반복하게 된다 | 세션 만료를 GitHub 토큰 문제와 구분해 "새로고침 후 재로그인" 안내 |

> 테스트 중 401이 반복된 진짜 원인은 세션이 아니라 **잘린 anon 키가 인라인된 배포본**이었다(B19).
> R-18 수정은 그래도 유효하다 — 사용자에게 보이는 증상이 "로그인 풀림"이라 안내가 정확해야 하고,
> 이번엔 그 개선된 안내 덕분에 오히려 원인 추적이 빨라졌다.

---

## 3. 진행 로그

- 2026-08-01: 문서 작성. Phase 0 착수 — B2(RPC 최신 본문) 실측 확인으로 109 설계 보정.
- 2026-08-01: **Phase 0 코드 작업 완료.** 0-1(P0 CSRF, 재현 테스트 선행) · 0-2(git-data 인코딩·8청크) · 0-3(마이그레이션 109 + 타입·문서 동기화). typecheck 클린, vitest 413/413, lint 에러 0.
- 2026-08-01: **적대적 리뷰 3렌즈 결과 반영.** 신규 발견 2건 수정 — ① B17: 109 본문 기준이 M100이 아니라 **M101**(trialing 회귀 방지) ② B16: `oauth_states` RLS가 user_id만 강제 → 콜백에서 project_id 소유권 재검증 추가(크로스테넌트 GitHub 연결 탈취 차단). 부가 하드닝 3종(원자적 state 클레임·인증 장애 구분·redirect 정규화) 포함, 콜백 테스트 6→10건. B18(별칭 호스트)은 Cloudflare 설정 영역이라 **배포 전 확인 항목**으로 등록.
- 2026-08-01: **마이그레이션 109 라이브 적용 완료** (Supabase MCP). 적용 전 실측으로 M101이 이미 라이브임을 확인해 109 본문 기준이 옳았음을 검증. 적용 후 7-인자 단일 시그니처·CHECK 프로브 4종·6-인자 레거시 호출 해석·advisor `anon` 제외까지 확인.
- 2026-08-01: **Phase 1A 구현 완료** — sanitizer·정적 워크플로우·deploy-upload API·클라 해제(fflate 0.8.3)·위저드 업로드 스텝·my-sites 소스 표시.
- 2026-08-01: **Phase 1A 적대적 리뷰(3렌즈) 반영** — 결함 8건 수정(위 표). 특히 R-1은 트랙 A의 보안 경계를 무너뜨리는 기존 결함이라 함께 처리. 최종 typecheck 클린 · **vitest 459/459** · lint 에러 0.
- 2026-08-01: **Phase 0 + 1A 라이브 배포 완료** (`1f59ec4c` → CI 통과 → Cloudflare Workers 성공).
- 2026-08-01: **Phase 1B 구현 + 적대적 리뷰 반영 완료.** 삭제 가드는 재현 테스트로 위험을 실증한 뒤 수정. 리뷰가 찾은 치명 결함(자동 재시도가 사용자 워크플로우 실행)을 포함해 7건 수정. 최종 typecheck 클린 · **vitest 491/491** · lint 에러 0.
- 2026-08-01: **Phase 1B 배포 완료**(`cb9f7f54`).
- 2026-08-01: **라이브 브라우저 검증 완료** — 두 트랙 모두 실제 배포까지 성공, 핵심 불변식("기존 파일 무수정 / 워크플로우 1개만 추가") 실증. 테스트 자원 전량 정리. 발견 결함 3건(R-16~R-18) 수정·배포(`545c8243`, `ec6a006d`).
- 2026-08-01: **B19 원인 확정·해소** — 세션이 아니라 잘린 anon 키가 배포 번들에 인라인된 문제였고, 별도 트랙(`bc41913b`)에서 배포 전 검증 게이트로 봉인됐다.
- 2026-08-01: **Phase 2(빌드형 확장) 구현 완료.** 프레임워크 감지 + 빌드 워크플로우 주입으로 `needs_build` 차단을 해제. basePath 한계는 숨기지 않고 위험도별로 경고. typecheck 클린 · **vitest 512/512** · lint 에러 0.
- 2026-08-02: **빌드형 라이브 e2e 완료.** 실제 Vite 저장소로 배포해 `--base` 주입까지 검증 — 자산 경로 `/vite-test-0802/assets/…`, JS·CSS 모두 200, 화면 정상. 테스트 중 발견한 R-19(루트 index.html 오판) 수정·배포(`9b4aabc1`). 테스트 자원 전량 정리.
- 2026-08-02: **Phase 3(퍼널 브릿지) 구현 완료.** 배포한 사이트가 쓰는 서비스를 감지해 서비스맵에 담을 수 있게 했다. 자동 등록하지 않고 제안만 한다. 적대적 리뷰 반영 5건(R-20~R-24) — 특히 `supabase.co`가 `supabase.com`에 오탐하던 문제와, 템플릿 트랙에 감지가 없어 가장 큰 유입 경로에서 브릿지가 작동하지 않던 문제를 고쳤다. typecheck 클린 · **vitest 542/542** · lint 에러 0.
- 2026-08-02: **Phase 3 라이브 검증 완료.** 오탐 유발 요소를 일부러 섞은 페이지로 감지 정확도까지 확인했고, 서비스맵 노드 렌더·환경변수 안내·Health Check 활성화까지 퍼널이 끝까지 이어지는 것을 확인했다. 테스트 자원 전량 정리.
- **상태: 원클릭 "내 자료 배포" Phase 0~3 전 구간 구현·배포·라이브 검증 완료.**
