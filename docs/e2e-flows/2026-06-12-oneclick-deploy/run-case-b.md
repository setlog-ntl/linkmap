# 원클릭 배포 전체 여정 — 실행 리포트 (Case B: 기존 GitHub 사용자)

## 실행 메타

| 항목 | 값 |
|------|---|
| 실행 일시 | 2026-06-12 11:12 ~ 11:45 (KST) |
| 환경 | https://linkmap.biz (프로덕션, 코드 7aa74c05) |
| 시나리오 | [scenario.md](./scenario.md) Case B |
| 실행 계정 | cdh***2@gmail.com (관리자, GitHub `@setlog-ntl` 연동) |
| 총 소요 시간 | 약 33분 (핫픽스 2건 포함; 순수 플로우 약 12분) |
| 종합 판정 | **PASS (핫픽스 2건 적용 후)** — CRITICAL 1건·HIGH 2건 포함 결함 8건 발견 |

> **요약**: 테스트 시작 시점에 프로덕션 배포가 **전면 차단 상태**였다 (B-2). DB 핫픽스 2건(migration 099·100)을 테스트 중 적용해 복구했고, 이후 전체 플로우(배포→모듈 수정→라이브 반영)가 정상 동작함을 검증했다.

## 스텝별 결과

| # | 행동 | 결과 | 실측 타이밍 / 비고 | 스크린샷 |
|---|------|:----:|---------------------|----------|
| B1 | 관리자 로그인 (CP3) | PASS | 사용자 직접 로그인 (linkmap + github) | 01-dashboard |
| B2 | `/sites/new` 직행 — green 배너 + 계정 Select | PASS | `@setlog-ntl` "연결됨" + combobox 표시 | 02-wizard-connected |
| B3 | 계정 Select 드롭다운 | PASS(부분) | `@setlog-ntl`(선택됨) + "다른 계정 추가" 구조 확인. **연동 계정 1개라 전환은 미검증** | 03-account-select |
| B4 | digital-namecard + 사이트명 `e2e-b-0612` | PASS | 단, 미존재 이름에도 "이미 존재" 거짓 경고 → **B-1** | 04-template-selected-false-positive-warning |
| B5-1차 | 배포 클릭 (11:16:17) | **FAIL** | `/api/oneclick/deploy` **500** — `operator does not exist: subscription_plan = text` → **B-2 (CRITICAL)** | 05-deploying, 06-deploy-500-error |
| — | 에러 UX 확인 | PASS(부분) | 원인/해결방법/재시도 제공. 단, 제목 "템플릿 업데이트 중" 혼란 카피 → **B-4**. "다시 시도" 시 폼 초기화 → **B-5** | 07-error-ux-display |
| — | **핫픽스: migration 099** (enum 캐스트) | 적용 | 버그 프로덕션 재현 → 캐스트 검증 → 적용 → 함수 동작 확인 | — |
| B5-2차 | 배포 재시도 (11:31:47) | **FAIL** | **403 QUOTA_EXCEEDED (43/3)** — RPC에 관리자 바이패스 누락 → **B-6 (HIGH)**. B-2가 가리고 있던 버그 | 08-quota-error-ux |
| — | **핫픽스: migration 100** (admin bypass) | 적용 | profiles.is_admin 확인 로직 추가 | — |
| B5-3차 | 배포 재시도 (11:35:33) | **PASS** | POST **201**, deploy_id `b7b19928…`. 이름 충돌 자동 suffix `-vg` 적용 확인 | 09-deploying-success-path |
| B6 | 빌드 대기 | PASS | **POST 11:35:50 → Actions 시작 02:35:56Z → 성공 화면 11:37:25 이전 = 약 95초** | 10-deploy-success |
| B7a | 라이브 URL 직접 검증 | PASS | HTTP 200, 388ms, `<title>홍길동 - 디지털 명함</title>` | — |
| B7b | repo + Actions | PASS | public, `deploy.yml` 존재(200), workflow `success` | — |
| B7c | manage → 에디터 + 모듈 패널 | PASS | 모듈 4/4 (프로필·연락처·소셜·테마) + 색상테마 5종. manage 페이지 콘솔 404 다수 → **B-7** | 11-sites-manage |
| B7d | 모듈 수정 — 이름=`E2E-B-1781232050` + 미드나잇 인디고 → "실제 사이트에 배포" (11:42:12) | PASS | draft 자동저장 200, **batch-update 200** | 12-module-edit-marker, 13-module-deploying |
| B7e | 재빌드 + 라이브 마커 검색 (`?_t=` 캐시버스팅) | PASS | **커밋 "Linkmap AI: 3개 파일 일괄 수정" → Actions 02:42:20Z success → 마커 라이브 확인 11:44 = 약 2분**. CDN 지연 없음 | 14-live-updated-marker |
| B7f | 원자 커밋 확인 | PASS | 3개 파일 단일 커밋 | — |
| B8 | (INFO) 위저드 재진입 차이 | SKIP | 우선순위 낮음 — 발견사항 다수로 생략 | — |

## 검증 매트릭스 결과

| 검증 항목 | 판정 | 근거 |
|-----------|:----:|------|
| 게이트 미발동 단축 경로 (연동됨) | PASS | 클릭 즉시 deploying (모달 없음) |
| 다중 계정 Select + 전환 반영 | 부분 | 드롭다운 구조 확인. 전환은 계정 1개라 미검증 |
| repo 생성 + public + deploy.yml | PASS | GitHub API 검증 |
| GitHub Actions 빌드 성공 | PASS | 초기 + 재빌드 모두 success |
| 라이브 URL HTTP 200 + 기본 콘텐츠 | PASS | curl 200 + title 확인 |
| /sites/manage 카드 표시 | PASS | 사이드바 + 카드 확인 |
| 에디터 + 모듈 패널 로드 | PASS | 모듈 4/4 + 색상테마 5종 |
| batch-update 원자 커밋 | PASS | 단일 커밋 (3파일) |
| 재빌드 + CDN 마커 반영 | PASS | `E2E-B-1781232050` 본문+타이틀 반영 (~2분) |
| 주요 화면 콘솔 에러 0 | **FAIL** | manage 페이지 29건(死사이트 iframe 404), 라이브 favicon 404 |
| 무료 3개 쿼터 에러 UX | **검증됨(의도외)** | B-6 덕분에 quota 403 UX 실제 관찰 — 에러 화면은 표시되나 업그레이드 유도 없음 |

## 실측 타이밍 요약 (Case A 캘리브레이션용)

| 구간 | 소요 |
|------|------|
| 배포 클릭 → API 201 | ~17초 (repo 생성+파일 푸시+Pages 활성화) |
| API 201 → Actions 빌드 완료 + 성공 화면 | **약 95초** |
| 모듈 배포 클릭 → batch-update 커밋 | ~10초 |
| 커밋 → 재빌드 완료 → 라이브 마커 반영 | **약 2분** (CDN 지연 없음) |
| **전체 (배포→수정→반영, 정상 경로)** | **약 8~10분** |

## 발견사항 (UX / 결함)

| ID | 심각도 | 위치 | 내용 | 권고 |
|----|--------|------|------|------|
| B-2 | 🔴 CRITICAL | `create_homepage_deploy_atomic` RPC (migration 098) | `plan_quotas.plan`(enum) = TEXT 비교 → `42883` → **모든 배포 500**. 06-11 안정화 배포 이후 전면 차단 상태였음 (`mypage-bm`, `mypage-4l` 고아 repo가 증거) | ✅ **수정 완료** — migration 099 (`::subscription_plan` 캐스트, 052 함수 2개 포함) |
| B-6 | 🟠 HIGH | 같은 RPC | `profiles.is_admin` 바이패스 누락 — 앱 레벨 `quota.ts:53`과 정책 불일치 → 관리자 403 (43/3) | ✅ **수정 완료** — migration 100 (admin bypass 추가) |
| B-3 | 🟠 HIGH | `deploy/route.ts:34` cleanupResources | RPC 실패 시 `deleteRepo` 403 (OAuth scope에 `delete_repo` 없음) → silent catch → **고아 repo 누적** | 코드 수정 필요: ① scope 추가(권한 위협 ↑) 또는 ② 삭제 대신 고아 repo 목록 기록+안내 ③ 최소한 cleanup 실패 로깅 |
| B-1 | 🟡 WARNING | `preflight/route.ts:69` | 미존재 repo 이름에 "이미 존재" 거짓 경고 — raw fetch에 **User-Agent 헤더 누락** 추정 (GitHub API 403 → `!==404` → false). 정상 동작하는 `client.ts:20`은 UA 설정함 | raw fetch → `githubFetch` 사용 또는 UA 추가 + 404/200 외 상태는 `null`(unknown) 처리 |
| B-4 | 🟡 WARNING | 위저드 에러 화면 | 배포 실패 상태인데 제목 "템플릿 업데이트 중" + "더 나은 경험을 위해 준비 중입니다" — 실패를 진행 중으로 오인 가능 | 에러 상태 전용 카피로 교체 |
| B-5 | 🟡 WARNING | 위저드 "다시 시도" | 재시도 클릭 시 사이트명·템플릿 선택 초기화 (입력값 유실) | 폼 상태 보존 후 재시도 |
| B-7 | ⚪ INFO | `/sites/manage` | 삭제된 배포들의 미리보기 iframe이 404 다수 발생 (콘솔 에러 29건) | 死사이트 placeholder 처리 |
| B-8 | ⚪ INFO | 배포된 템플릿 | `favicon.ico`를 루트 도메인에서 찾아 404 (`/{repo}/` basePath 미적용) | 템플릿 favicon 경로 수정 |

## 산출 자원 (정리용 목록)

| 자원 | URL / 식별자 | 상태 | 정리 방법 |
|------|--------------|------|-----------|
| **정상 배포 사이트** | https://setlog-ntl.github.io/e2e-b-0612-vg/ (repo: `setlog-ntl/e2e-b-0612-vg`) | 검증용 유지 | repo Settings → Delete + /sites/manage에서 삭제 |
| Linkmap 배포 레코드 | deploy_id `b7b19928-e6cd-4390-9048-c0685533b12f`, 사이트명 `e2e-b-0612-vg` | 〃 | /sites/manage |
| **고아 repo (이번 테스트)** | `setlog-ntl/e2e-b-0612` (1차 500), `setlog-ntl/e2e-b-0612-dw` (2차 403) | 잔존 | GitHub에서 직접 삭제 (B-3 원인) |
| **고아 repo (기존 추정)** | `setlog-ntl/mypage-bm` (06-11), `setlog-ntl/mypage-4l` (06-10) | 잔존 | 〃 — B-2가 06-11부터 존재했다는 증거 |
| DB 핫픽스 | migration 099 `fix_quota_enum_cast`, 100 `admin_quota_bypass_rpc` | **프로덕션 적용 완료** | 로컬 파일 git 커밋 필요 |

## 후속 조치

- [x] B-2, B-6 핫픽스 (migration 099·100 프로덕션 적용 + 로컬 파일 생성)
- [ ] B-3 (고아 repo cleanup), B-1 (preflight UA) — 코드 수정 별도 작업
- [ ] B-4, B-5 (에러 UX) — 코드 수정 별도 작업
- [ ] 고아 repo 4개 정리 (사용자)
- [ ] `docs/db-schema.md`에 099·100 함수 변경 반영
- [ ] README 실행 이력 테이블 갱신 + `docs/log/2026-06.md` 기록 (Phase 4)
