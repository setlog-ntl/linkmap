# 원클릭 배포 전체 여정 — 실행 리포트 (Case A: 신규 초급 사용자)

## 실행 메타

| 항목 | 값 |
|------|---|
| 실행 일시 | 2026-06-12 11:45 ~ 12:13 (KST) |
| 환경 | https://linkmap.biz (프로덕션, 코드 7aa74c05 + migration 099·100 핫픽스 적용 후) |
| 시나리오 | [scenario.md](./scenario.md) Case A |
| 실행 계정 | Linkmap: cdh***+lmtest-a1@gmail.com (이메일 가입, free 플랜) / GitHub 보조: `cdhnayajeil-code` |
| 총 소요 시간 | 약 28분 (CP 개입 대기 포함; 순수 플로우 약 12분) |
| 종합 판정 | **PASS** — 신규 가입부터 모듈 수정 라이브 반영까지 전체 완주. UX 발견 5건 |

> **요약**: GitHub 없는 신규 사용자가 이메일 가입 → GitHub 연결 게이트 → OAuth → 배포 → 모듈 수정 → 라이브 반영까지 완주 가능함을 검증. Case B에서 적용한 핫픽스(099·100)가 **일반 free 사용자 경로**에서도 정상 동작함을 확인 (쿼터 1/3 통과). 단, "GitHub 계정이 아예 없는" 사용자를 위한 가입 안내 부재가 가장 큰 마찰 지점.

## 스텝별 결과

| # | 행동 | 결과 | 실측 타이밍 / 비고 | 스크린샷 |
|---|------|:----:|---------------------|----------|
| A0 | 세션 클린 (linkmap 로그아웃 + github 전체 로그아웃) | PASS | "Sign out from all accounts" 사용 | 01-clean-session |
| A1 | `/signup` 이메일 가입 (`+lmtest-a1` alias) | PASS | "이메일을 확인해주세요" 카드 + 재발송 버튼. **스팸함 안내 없음** → A-1 | 02-signup-form, 03-confirm-email-card |
| A2 | **[CP1]** 확인 메일 인증 | PASS(우회) | 사용자가 본인 브라우저에서 링크를 먼저 클릭 → 테스트 브라우저에서 재사용 시 **otp_expired** (1회용 토큰). 인증 자체는 완료된 상태라 직접 로그인으로 진행. **만료 링크 진입 시 로그인 페이지에 안내·재발송 CTA 없음** → A-2 | — |
| A3 | 첫 대시보드에서 배포 진입점 탐색 | PASS | 환영 카드 + 시작 가이드 + "원클릭 배포" 진입점 2곳(사이드바·메인) — **1클릭 도달** | 04-first-dashboard |
| A4 | "배포가 처음이신가요?" 가이드 | PASS | "배포란?" 개념 + 3단계 + "무료 호스팅·서버 비용 없음" 명시. GitHub 자체가 뭔지는 설명 없음 → A-3 | 05-beginner-guide |
| A5 | link-card + `e2e-a-linkcard` | PASS | amber "GitHub 미연결 — 배포 시 자동으로 연결됩니다" + `username` placeholder | — |
| A6 | 배포 클릭 → **GitHubConnectModal 발동** | PASS | "코드를 내 GitHub 계정에 저장합니다. 완전한 소유권" — 좋음. **GitHub 계정 없는 사용자용 가입 안내 없음** + 랜딩 "Google 계정 하나면 GitHub 가입까지 자동" 문구와 불일치 → **A-4 (WARNING)** | 06-github-gate-modal |
| A7 | "GitHub 연결하기" → github.com 로그인 페이지 | PASS | OAuth scope `repo+read:org+read:user+workflow` URL 확인 | — |
| A8 | **[CP2]** 보조 계정 로그인 | PASS(사용자) | Device verification 발생 (메일 코드) — 사용자가 직접 처리. 예상된 마찰 지점 | — |
| A9 | OAuth 권한 화면 | SKIP | 사용자가 수동으로 사전 승인 → authorize 화면 미캡처 (UX 평가 불가) | — |
| A10 | OAuth 복귀 → 상태 보존 | **PASS** | `?oauth_success=github` 복귀 → 모달이 `cdhnayajeil-code` 연결됨 + **"배포 진행"** 버튼으로 갱신 — **템플릿·사이트명 보존 + 이어서 진행 가능 (핵심 검증)** | 07-connected-resume-deploy |
| A11 | "배포 진행" (12:07:08) | PASS | POST **201**, deploy_id `553ed509…`. **일반 free 사용자 쿼터 경로(1/3) 정상** — 099 수정의 비관리자 검증 | 08-deploying |
| A12 | 빌드 대기 | PASS | **약 100초** (Case B 95초와 일치) | — |
| A13 | 성공 화면 | PASS | `cdhnayajeil-code.github.io/e2e-a-linkcard/` — suffix 없이 원래 이름 | 09-deploy-success |
| A14 | 라이브 200 | PASS | HTTP 200, `<title>민지 (Minji)</title>` (기본 콘텐츠) | — |
| A15 | repo + Actions | PASS | deploy.yml 200, workflow success | — |
| A16 | 에디터 + 모듈 패널 | PASS | link-card 모듈 (프로필: 이름/영문/소개/이미지 등) 로드 | — |
| A17 | 마커 `E2E-A-1781233807` 입력 → "실제 사이트에 배포" (12:10:38) | PASS | batch-update **200** | 10-module-edit-marker, 11-module-deploying |
| A18 | 재빌드 + 마커 반영 | PASS | **약 3분** — 마커가 본문+`<title>`에 반영, CDN 지연 없음 | 12-live-updated-marker |
| A19 | repo 새 커밋 | PASS | "Linkmap AI: 3개 파일 일괄 수정" success | — |

## 검증 매트릭스 결과

| 검증 항목 | 판정 | 근거 |
|-----------|:----:|------|
| 이메일 가입 + confirm 세션 성립 | PASS | 가입→인증→로그인→대시보드 (링크 1회용 이슈는 A-2) |
| GitHub 게이트 모달 발동 (미연동) | PASS | 배포 클릭 시 모달 |
| OAuth 왕복 후 위저드 상태 보존 | **PASS** | "배포 진행" 버튼으로 이어서 완주 |
| repo 생성 + public + deploy.yml | PASS | GitHub API |
| GitHub Actions 빌드 성공 | PASS | 초기+재빌드 success |
| 라이브 URL HTTP 200 + 기본 콘텐츠 | PASS | curl + title |
| 에디터 + 모듈 패널 로드 | PASS | link-card 모듈 폼 |
| batch-update 원자 커밋 | PASS | 단일 커밋 (3파일) |
| 재빌드 + CDN 마커 반영 | PASS | `E2E-A-1781233807` (~3분) |
| 주요 화면 콘솔 에러 0 | PASS(주요 화면) | 라이브 페이지 favicon 404만 (B-8 동일) |
| 초급 UX 정성 평가 | 완료 | 아래 발견사항 |
| OAuth 권한 화면 위협감 평가 | 미검증 | 사용자 사전 승인으로 화면 미노출 |

## 실측 타이밍

| 구간 | 소요 | Case B 대비 |
|------|------|------------|
| 배포 진행 → 성공 화면 | ~100초 | 동일 수준 (95초) |
| 모듈 배포 → 라이브 마커 반영 | ~3분 | 유사 (2분) |
| 가입 → 라이브 사이트 (CP 대기 제외) | **~12분** | — |

## 발견사항 (UX — 초급 사용자 관점)

| ID | 심각도 | 위치 | 내용 | 권고 |
|----|--------|------|------|------|
| A-4 | 🟡 WARNING | GitHubConnectModal | **GitHub 계정이 없는 사용자를 위한 가입 안내/링크 부재**. 랜딩 문구("Google 계정 하나면 GitHub 가입부터 배포까지 자동")와 실제 기능 불일치 — 1순위 타겟(바이브코더)이 정확히 막히는 지점 | 모달에 "GitHub 계정이 없으신가요? → 가입 가이드(/guides/github)" 링크 추가, 또는 랜딩 문구 현실화 |
| A-2 | 🟡 WARNING | 인증 링크 재사용 / `/login` | 만료·사용된 인증 링크로 진입 시 URL 파라미터로만 에러 전달 — 화면 안내·재발송 CTA 없음. 메일 링크를 다른 기기에서 열거나 두 번 클릭하는 초급 사용자가 흔함 | `/login?error=` 시 명시적 배너 + "인증 메일 재발송" 버튼 |
| A-5 | 🟡 WARNING | GitHub Device Verification | 신규 환경 OAuth 시 GitHub이 이메일 코드를 요구 — 서비스가 제어할 수 없지만 초급 사용자에게 사전 안내 없음 | 게이트 모달/가이드에 "GitHub이 보안 코드를 요구할 수 있어요" 안내 한 줄 |
| A-1 | ⚪ INFO | 가입 확인 카드 | 스팸함 확인 안내 없음 | 안내 문구 추가 |
| A-3 | ⚪ INFO | 초보자 가이드 | "배포란?" 설명은 좋으나 GitHub 자체(계정 필요)는 설명 없음 | 가이드에 GitHub 한 줄 설명 + 링크 |

## 산출 자원 (정리용 목록)

| 자원 | URL / 식별자 | 정리 방법 |
|------|--------------|-----------|
| 배포 사이트 | https://cdhnayajeil-code.github.io/e2e-a-linkcard/ (repo: `cdhnayajeil-code/e2e-a-linkcard`) | repo Settings → Delete |
| Linkmap 배포 레코드 | deploy_id `553ed509-82b2-4269-8298-634e7eb79714` | /sites/manage에서 삭제 |
| Linkmap 테스트 계정 | cdh***+lmtest-a1@gmail.com ("테스트 초보", free) | 설정 → 계정 삭제 (비밀번호 분실 시 reset-password) |
| GitHub OAuth 앱 승인 | `cdhnayajeil-code` 계정의 Linkmap 앱 권한 | GitHub Settings → Applications에서 revoke |

## 후속 조치

- [ ] A-4 (GitHub 가입 안내) — **1순위 타겟 직결**, 기획 검토 권장
- [ ] A-2 (만료 링크 UX) — 코드 수정 별도 작업
- [ ] 산출 자원 정리 (사용자)
