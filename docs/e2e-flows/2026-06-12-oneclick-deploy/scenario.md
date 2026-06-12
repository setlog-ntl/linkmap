# 원클릭 배포 전체 여정 — E2E 시나리오 정의서

> 작성일: 2026-06-12 | 작성 근거 코드 버전: `7aa74c05` (원클릭 배포 안정화 직후)
> 환경: 프로덕션 https://linkmap.biz | 실행 방식: Playwright MCP

## 1. 목적 / 범위

- **목적**: 원클릭 배포의 **전체 사용자 여정**(가입 → 템플릿 선택 → GitHub 연동 → 실배포 → 모듈 수정 → 라이브 반영)을 두 페르소나로 실증한다. 최근 안정화 작업(`docs/onelink/11-deploy-stabilization.md`, 커밋 503b5486·7aa74c05)의 실효성을 실사용 경로에서 확인하고, 1순위 타겟인 **바이브코더(코딩 경험 0)** 의 막힘 지점을 발굴한다.
- **범위**: linkmap.biz 가입부터 수정사항이 라이브 GitHub Pages에 반영되는 것까지. **포함하지 않음**: 커스텀 도메인, 쿼터 초과 에러 UX(아래 매트릭스에 미검증 사유 명시), 결제 업그레이드 경로.
- **선행 작업 맥락**: 빌드 재현성(lockfile 번들 + `npm ci`), 배포 엔드포인트 하드닝(이름충돌 8회 재시도), quota 원자화(migration 098), 타임아웃 의미론(updated_at 기준 15분).

## 2. 페르소나 · 케이스

| 케이스 | 페르소나 | 사전 상태 | 핵심 검증 관점 |
|--------|----------|-----------|----------------|
| **Case A** | 코딩 경험 0의 신규 가입자. GitHub가 뭔지 모름 | Linkmap 계정 없음, GitHub 미보유(보조 테스트 계정으로 대행) | GitHub 연결 게이트의 안내 품질, OAuth 왕복 후 상태 보존, 초급자가 막히는 지점 |
| **Case B** | 기존 사용자. GitHub 계정 연동·관리 중 | 관리자 계정(쿼터 무제한), GitHub 연동 완료 | 단축 경로(게이트 미발동), 다중 계정 선택 UI, 배포 파이프라인 건강 상태 |

**실행 순서: B → A.** ① 가입·OAuth 변수 없이 파이프라인부터 격리 검증 ② B 실측 빌드 시간으로 A 폴링 예산 캘리브레이션 ③ B 종료 후 로그아웃 → A 클린 시작이 자연스러움.

## 3. 사전 조건

- [ ] **Case B**: 관리자 계정 로그인 가능 (CP3에서 사용자가 직접 로그인)
- [ ] **Case A**: 신규 이메일 — Gmail +alias 사용 (`cdhrich+lmtest-a1@gmail.com`, Supabase는 별도 계정으로 취급, 메일은 기존 받은편지함 수신)
- [ ] **Case A**: 보조 GitHub 계정 준비 — **2FA 활성 여부 사전 확인** (활성 시 CP2에서 TOTP 입력 필요)
- [ ] **Case A 시작 전**: linkmap.biz + github.com **모두 로그아웃** (A0 스텝으로 강제 — github 세션 잔류 시 보조 계정 테스트 무효)
- [ ] 수정 마커 규칙: `E2E-A-{unix_ts}` / `E2E-B-{unix_ts}` (라이브 본문 검색용 유니크 문자열)

## 4. 사용자 개입 체크포인트 (CP)

| CP | 시점 | 사용자가 할 일 | 비고 |
|----|------|----------------|------|
| CP1 | A1 가입 직후 | Gmail에서 Supabase 확인 메일의 링크를 **테스트 브라우저 주소창에 직접 입력** (또는 링크 URL을 채팅에 전달 — 1회용 토큰이라 무방) | Gmail 자동화는 시도하지 않음 (봇 차단) |
| CP2 | A7~A8 GitHub 로그인 | 보조 GitHub 계정 자격증명을 **Playwright 브라우저 창에 직접 입력**. Device verification 메일 코드/2FA 발생 시 직접 처리 | 자격증명·코드는 채팅/문서/스크린샷에 기록 안 함 |
| CP3 | B1 시작 | 관리자 계정 로그인 (기존 세션 있으면 스킵) | 〃 |
| CP4 | 빌드 15분 초과 | 계속 대기 / 중단 판단 | deploy-status.ts 타임아웃 의미론 기준 |
| CP5 | 예상 외 에러 | 스크린샷 보고 받고 진행 방향 결정 | 결함은 기록만, 수정은 별도 작업 |

## 5. 스텝 정의

### Case B — 기존 GitHub 연동 사용자 (먼저 실행)

| # | 행동 | 예상 결과 (코드 근거) | 검증 포인트 | 스크린샷 |
|---|------|----------------------|------------|----------|
| B1 | **[CP3]** linkmap.biz 관리자 로그인 | 대시보드 진입 | 세션 성립 | 01-dashboard |
| B2 | `/sites/new` 직행 | 위저드 Step1. GitHub 연동 상태로 **green 배너 + 계정 Select** 표시 (`template-picker-step.tsx`) | 게이트 배너가 amber(미연동)가 아닌 green인지. 다중 계정이면 전체 나열 + "다른 계정 추가"(`__add__` → `/api/oauth/github/authorize?flow_context=oneclick`) 항목 | 02-wizard-connected |
| B3 | 계정 Select 드롭다운 열기 → (계정 2개 이상 시) 전환 | URL 미리보기 `{username}.github.io/...`가 선택 계정으로 즉시 변경 | 상태 동기화 | 03-account-select |
| B4 | **digital-namecard** 템플릿 선택 + 사이트명 입력 (예: `e2e-b-namecard`) | 선택 하이라이트 + URL 미리보기 갱신. 사이트명 검증(a-z0-9-) 동작 | namecard lockfile 세트(qrcode.react) 빌드 검증 겸. 기존 배포명과 중복 시 클라이언트 검증 에러 | 04-template-selected |
| B5 | 배포 클릭 | **GitHubConnectModal 없이 즉시** DeployStep 진입 (`wizard-client.tsx` phase 분기) — deploying → polling | **단축 경로 핵심 검증**: 게이트 미발동 | 05-deploying |
| B6 | 빌드 대기 — 1→2→4→8분 백오프 snapshot, 상한 15분(CP4) | DeploySuccess 전환: live URL + iframe 미리보기(자동 재시도 3회 `?_r=`) | **실측 빌드 시간 기록** (A 캘리브레이션). 진행 단계 라벨(저장소 준비/Pages 설정/빌드) 표시 | 06-success |
| B7a | 새 탭에서 live URL 직접 확인 + `browser_network_request`로 HTTP 200 | 명함 템플릿 기본 콘텐츠 렌더 | HTTP 200 + 본문에 템플릿 기본 텍스트 | 07-live |
| B7b | GitHub repo + Actions 탭 확인 | repo public, `.github/workflows/deploy.yml` 존재, 워크플로 green | 초기 커밋·빌드 성공 | 08-repo, 09-actions |
| B7c | `/sites/manage` → 해당 카드 → 에디터 진입 (`/sites/{deployId}/edit`) | 에디터 + **모듈 패널** 로드 (`site-editor-client.tsx` — getModuleSchema('digital-namecard')) | 카드 표시, 에디터 정상 로드 | 10-manage, 11-editor |
| B7d | 모듈 값 수정 — 이름/타이틀에 마커 `E2E-B-{ts}` 입력 → **"코드 적용 후 배포"** | generateFiles → batch-update 커밋 → 재빌드 다이얼로그 (`module-deploy-dialog.tsx`) | 변경 파일 수/단계 표시 정확성 | 12-module-edit, 13-redeploying |
| B7e | 재빌드+CDN 대기 — `{liveUrl}?_t={ts}` 본문에서 마커 검색 (1→2→4→8분) | 마커 등장 | **수정→라이브 반영 실측 시간** | — |
| B7f | repo 커밋 히스토리 확인 | batch-update 커밋 존재 | 원자 커밋 (단일 커밋) | 14-new-commit, 15-live-updated |
| B8 | (INFO) `/sites/new` 재진입 | 기존 배포 존재 상태의 위저드 표시 | 차이점 기록만 | 16-revisit |

### Case A — GitHub 없는 신규 초급 사용자

| # | 행동 | 예상 결과 (코드 근거) | 검증 포인트 | 스크린샷 |
|---|------|----------------------|------------|----------|
| A0 | linkmap.biz 로그아웃 + **github.com 로그아웃** 확인 | 양쪽 비로그인 | 세션 클린 (필수 — 잔류 시 테스트 무효) | 01-clean |
| A1 | `/signup` → 이메일 `cdhrich+lmtest-a1@gmail.com` + 비밀번호(6자+) 가입 | "이메일을 확인해주세요" 안내 (`signup/page.tsx`) | 안내 문구의 초급 친화도, 스팸함 안내 유무 | 02-signup, 03-confirm-card |
| A2 | **[CP1]** 확인 메일 링크를 테스트 브라우저에서 열기 | `/auth/callback?next=...` → 세션 성립 | 리다이렉트 목적지가 자연스러운가(대시보드/온보딩) | 04-after-confirm |
| A3 | 로그인 직후 화면에서 **사용자처럼** 배포 진입점 탐색 (직접 URL 입력 금지) | 메뉴/CTA 경유 `/sites/new` 도달 | **UX: 발견 가능성 — 클릭 수 기록** | 05-wizard-step1 |
| A4 | "배포가 처음이신가요?" Collapsible 펼침 | 초보자 가이드 노출 | GitHub 개념 설명 포함 여부 | 06-beginner-guide |
| A5 | **link-card** 템플릿 선택 + 사이트명 (예: `e2e-a-linkcard`) | GitHub 미연동 **amber 배너**, URL 미리보기에 username placeholder | 미연동 상태 안내의 명확성 | 07-template-selected |
| A6 | 배포 클릭 | **GitHubConnectModal** 등장 (`wizard-client.tsx` phase=connecting_github) | **UX 핵심: GitHub가 뭔지/왜 필요한지/무료인지 설명 충분한가** | 08-github-gate-modal |
| A7 | 모달 연결 버튼 → `/api/oneclick/oauth/authorize` → github.com | GitHub 로그인 폼 | — | 09-github-login |
| A8 | **[CP2]** 보조 계정 로그인 (verification/2FA 시 사용자 처리) | 로그인 성공 | — | (자격증명 화면 캡처 금지) |
| A9 | OAuth 권한 화면 | scope: repo, read:org, read:user, workflow | UX: 초급자에게 권한 화면(전체 repo 권한)이 위협적인가 | 10-oauth-scope |
| A10 | Authorize → 위저드 복귀 | green 배너 + `@보조계정`. **템플릿/사이트명 상태 보존** | **OAuth 왕복 후 상태 보존 — 핵심 검증** | 11-connected |
| A11 | 배포 클릭 | DeployStep 진입 | 진행 라벨·예상 소요시간 안내 유무 | 12-deploying |
| A12 | 빌드 대기 (B6 실측으로 캘리브레이션한 백오프) | DeploySuccess | 실측 시간 (B와 비교) | — |
| A13 | 성공 화면 | live URL `https://{보조계정}.github.io/{site}/` + iframe | iframe 로드 성공 여부 | 13-success |
| A14 | live URL 직접 + `browser_network_request` 200 확인 | link-card 기본 콘텐츠 | HTTP 200 + 본문 | 14-live |
| A15 | repo + Actions 확인 | public repo, deploy.yml, green check | — | 15-repo, 16-actions |
| A16 | **사용자처럼** 수정 진입점 탐색 → `/sites/{deployId}/edit` | 에디터 + 모듈 패널 | **UX: "수정하려면 어디로?" 발견 가능성** | 17-manage, 18-editor |
| A17 | 모듈 수정 — 타이틀에 마커 `E2E-A-{ts}` → "코드 적용 후 배포" | batch-update → 재빌드 | 다이얼로그 진행 표시 | 19-module-edit, 20-redeploying |
| A18 | `?_t={ts}` 마커 검색 (1→2→4→8분) | 마커 등장 | CDN 캐시 지연(최대 10분)에 대한 **서비스 내 안내 문구 존재 여부** (UX) | — |
| A19 | 라이브 반영 + repo 새 커밋 확인 | 수정값 반영 | before/after 비교 | 21-live-updated, 22-new-commit |

## 6. 검증 매트릭스

| 검증 항목 | Case A | Case B | 판정 방법 |
|-----------|:------:|:------:|-----------|
| 이메일 가입 + confirm 세션 성립 | O | – | 대시보드 접근 |
| GitHub 게이트 모달 발동 (미연동) | O | – | 모달 표시 |
| 게이트 미발동 단축 경로 (연동됨) | – | O | 클릭 즉시 deploying |
| 다중 계정 Select + 전환 반영 | – | O | URL 미리보기 변경 |
| OAuth 왕복 후 위저드 상태 보존 | O | – | 템플릿/사이트명 유지 |
| repo 생성 + public + deploy.yml | O | O | repo 페이지 |
| GitHub Actions 빌드 성공 | O | O | Actions 탭 green |
| 라이브 URL HTTP 200 + 기본 콘텐츠 | O | O | browser_network_request |
| /sites/manage 카드 표시 | O | O | 카드 존재 |
| 에디터 + 모듈 패널 로드 | O | O | snapshot |
| batch-update 원자 커밋 | O | O | repo 커밋 히스토리 |
| 재빌드 + CDN 마커 반영 | O | O | `?_t=` 본문 마커 검색 |
| 주요 화면 콘솔 에러 0 | O | O | browser_console_messages |
| 초급 UX 정성 평가 | **중점** | 참고 | CRITICAL/WARNING/INFO |
| 무료 3개 쿼터 에러 UX | 미검증(배포 1개만) | 미검증(관리자 무제한) | — |

## 7. UX 평가 기준

| 심각도 | 기준 |
|--------|------|
| CRITICAL | 초급 사용자가 흐름을 완료할 수 없는 지점 (막힘·데이터 손실·보안) |
| WARNING | 완료는 가능하나 혼란·이탈 가능성 높음 (불명확한 안내, 예측 불가한 대기) |
| INFO | 개선하면 좋을 마찰 |

## 8. 대기 전략 / 타임아웃

- **첫 배포 빌드**: UI가 자체 폴링(2s→10s 백오프, `deploy-status.ts`)하므로 자동화는 1→2→4→8분 백오프로 snapshot만. 상한 15분 → CP4.
- **모듈 수정 반영**: 화면 의존 대신 `browser_network_request`로 `{liveUrl}?_t={unix_ts}` 본문에서 마커 검색. 1→2→4→8분 백오프, 상한 15분(Actions 재빌드 ~2-5분 + CDN 최대 10분 고려).
- 각 확인 시점에 경과 시간·상태를 리포트에 기록.
