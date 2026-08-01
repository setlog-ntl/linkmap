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

### Phase 1B — 트랙 B: repo 연결 (선행: 1A)

- repos/repo-analyze/deploy-repo API(B9) + 동의 다이얼로그 + **deleteRepo 가드(B6)** + redeploy workflow_file 확장 + 멀티계정 P1 부분 수정(B10)
- 검증: 배포 후 트리 diff=linkmap-pages.yml 1개뿐 / Pages 실패 주입→파일 삭제 커밋 / import DELETE→repo 존재 유지 / 빈 repo→배포 불가

### Phase 2 — 빌드형 확장 · Phase 3 — 퍼널 브릿지

- 모체 기획 문서 §7 로드맵 참조 (프레임워크 감지·빌드 워크플로우 변형 / 서비스 시그니처 스캔·showcase)

---

## 3. 진행 로그

- 2026-08-01: 문서 작성. Phase 0 착수 — B2(RPC 최신 본문) 실측 확인으로 109 설계 보정.
- 2026-08-01: **Phase 0 코드 작업 완료.** 0-1(P0 CSRF, 재현 테스트 선행) · 0-2(git-data 인코딩·8청크) · 0-3(마이그레이션 109 + 타입·문서 동기화). typecheck 클린, vitest 413/413, lint 에러 0.
- 2026-08-01: **적대적 리뷰 3렌즈 결과 반영.** 신규 발견 2건 수정 — ① B17: 109 본문 기준이 M100이 아니라 **M101**(trialing 회귀 방지) ② B16: `oauth_states` RLS가 user_id만 강제 → 콜백에서 project_id 소유권 재검증 추가(크로스테넌트 GitHub 연결 탈취 차단). 부가 하드닝 3종(원자적 state 클레임·인증 장애 구분·redirect 정규화) 포함, 콜백 테스트 6→10건. B18(별칭 호스트)은 Cloudflare 설정 영역이라 **배포 전 확인 항목**으로 등록.
- 2026-08-01: **마이그레이션 109 라이브 적용 완료** (Supabase MCP). 적용 전 실측으로 M101이 이미 라이브임을 확인해 109 본문 기준이 옳았음을 검증. 적용 후 7-인자 단일 시그니처·CHECK 프로브 4종·6-인자 레거시 호출 해석·advisor `anon` 제외까지 확인.
- 2026-08-01: **Phase 1A 구현 완료** — sanitizer·정적 워크플로우·deploy-upload API·클라 해제(fflate 0.8.3)·위저드 업로드 스텝·my-sites 소스 표시.
- 2026-08-01: **Phase 1A 적대적 리뷰(3렌즈) 반영** — 결함 8건 수정(위 표). 특히 R-1은 트랙 A의 보안 경계를 무너뜨리는 기존 결함이라 함께 처리. 최종 typecheck 클린 · **vitest 459/459** · lint 에러 0.
- **다음**: Phase 1B(트랙 B — 내 GitHub repo 연결). 착수 전 선결: `deployments/[id]/route.ts`의 `deleteRepo`를 `source_type==='import'` 가드로 감싸는 것(B6/R3 — 사용자 원본 repo 삭제 방지).
