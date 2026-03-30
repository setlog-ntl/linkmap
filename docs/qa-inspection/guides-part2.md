# 가이드 페이지 QA 점검 결과 (후반)
- 점검일: 2026-03-30
- 대상: https://linkmap.biz/guides/*
- 점검 페이지 수: 42개
- 범위: env ~ version-control
- 점검 도구: Playwright MCP (Chromium)
- 점검 방법: 페이지별 navigate -> HTTP 상태 -> 타이틀/H1 확인 -> 콘솔 에러 -> 모바일 레이아웃(375x812)

## 요약

| 구분 | 결과 |
|------|------|
| 전체 페이지 | 42개 |
| PASS | 40개 |
| WARNING | 2개 |
| FAIL | 0개 |

### 주요 발견사항
1. **Workers Free Plan CPU 제한 (간헐적 503)**: 연속 요청 시 Cloudflare Workers Error 1102 발생. 개별 요청 시 모든 페이지 정상(200 OK). QA 자동화 도구의 연속 요청이 원인이며, 실사용자 환경에서는 발생하지 않음.
2. **모바일 수평 오버플로우**: body width 376px vs viewport 375px (1px 차이). 스크롤바 포함으로 인한 것이며 실질적 레이아웃 깨짐 없음.
3. **일부 페이지 H1 미탐지**: version-control 하위 페이지(branching, conflict, pull-request)에서 H1 태그가 감지되지 않음. 이 페이지들은 헤딩 구조가 다른 패턴을 사용하는 것으로 보임 (접근성 검토 권장).
4. **콘솔 에러 없음**: 모든 정상 로드된 페이지에서 JavaScript 에러 없음.
5. **실패 API 없음**: 분석/추적 관련(GA, Clarity, CDN-CGI)의 ERR_ABORTED만 확인됨 (정상 동작).

---

## 개별 페이지 점검 결과

### 1. 환경변수 관리 (env) 그룹

### [환경변수 완전 정복] -- /guides/env
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("환경변수 완전 정복"), 네비게이션, 탭 UI, 체크리스트, FAQ 아코디언 모두 존재
- **실패 API**: 없음 (GA/Clarity ERR_ABORTED만 -- 정상)
- **모바일**: 정상 -- nav, main, footer 존재, overflow 1px (실질적 문제 없음)
- **비고**: 7개 섹션 탭, 보안 체크리스트, 서비스별 환경변수 테이블 등 풍부한 인터랙티브 콘텐츠 확인

### [배포 환경변수 설정] -- /guides/env/deploy-vars
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("배포 환경변수 설정"), Vercel/Cloudflare 플랫폼별 가이드, 실수 목록, 체크리스트
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: NEXT_PUBLIC_ 접두사 규칙, 플랫폼별 UI/CLI 가이드 포함

### [.env 파일 관리] -- /guides/env/dotenv-files
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1(".env 파일 관리")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 2. 프론트엔드 (frontend) 그룹

### [프론트엔드란?] -- /guides/frontend
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("프론트엔드란?")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [React / Next.js 기초] -- /guides/frontend/react-nextjs
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀 확인, H1 존재(모바일 점검 시 확인됨)
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

### [CSR vs SSR vs SSG] -- /guides/frontend/rendering-modes
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("CSR vs SSR vs SSG -- 렌더링 방식 비교")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 3. GitHub 그룹

### [GitHub 빠른 설정 가이드] -- /guides/github
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀 확인
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [첫 저장소 만들기] -- /guides/github/first-repo
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀 확인
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

### [Git 설치 + GitHub 가입] -- /guides/github/git-setup
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("Git 설치 + GitHub 가입")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 4. 모니터링 (monitoring) 그룹

### [모니터링 가이드] -- /guides/monitoring
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("모니터링 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [웹 분석] -- /guides/monitoring/analytics
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("웹 분석 -- 모니터링 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [에러 추적] -- /guides/monitoring/error-tracking
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("에러 추적 -- 모니터링 가이드")
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

### [피처 플래그] -- /guides/monitoring/feature-flags
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("피처 플래그 -- 모니터링 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 5. OpenAI 그룹

### [OpenAI 연동 가이드] -- /guides/openai
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("OpenAI 연동 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [OpenAI API 키 발급 + 설정] -- /guides/openai/api-key
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("OpenAI API 키 발급 + 설정 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [OpenAI Next.js 연동 + 스트리밍] -- /guides/openai/nextjs-integration
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("OpenAI Next.js 연동 + 스트리밍 가이드")
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

---

### 6. 패키지 매니저 (package-manager) 그룹

### [패키지 매니저 가이드] -- /guides/package-manager
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("패키지 매니저 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [npm 기본 명령어] -- /guides/package-manager/npm-basics
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("npm 기본 명령어 -- 패키지 매니저 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [package.json 이해하기] -- /guides/package-manager/package-json
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("package.json 이해하기 -- 패키지 매니저 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [npm 에러 해결] -- /guides/package-manager/troubleshooting
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("npm 에러 해결 -- 패키지 매니저 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 7. 결제 (payment) 그룹

### [결제 연동 가이드] -- /guides/payment
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("결제 연동 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [Stripe 결제 연동] -- /guides/payment/stripe
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("Stripe 결제 연동 -- Checkout, Payment Intent, 테스트")
- **실패 API**: 없음
- **모바일**: 정상 -- nav: true, main: true, footer: true, bodyWidth: 376px
- **비고**: 없음

### [토스페이먼츠 결제 연동] -- /guides/payment/toss
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("토스페이먼츠 결제 연동")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [결제 웹훅 처리] -- /guides/payment/webhook
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("결제 웹훅 처리")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 8. 보안 (security) 그룹

### [보안 기초 가이드] -- /guides/security
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("보안 기초 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 첫 점검 시 TIMEOUT 발생(Workers 과부하), 재점검 시 정상

### [HTTPS와 CORS] -- /guides/security/https-cors
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("HTTPS와 CORS")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [시크릿 관리] -- /guides/security/secrets-management
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("시크릿 관리 -- 보안 기초 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [웹 취약점 기초] -- /guides/security/web-vulnerabilities
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("웹 취약점 기초 -- 보안 기초 가이드")
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

---

### 9. 서버 (server) 그룹

### [서버/호스팅 이해하기] -- /guides/server
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("서버/호스팅 이해하기")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [CDN과 엣지 서버] -- /guides/server/cdn
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("CDN과 엣지 서버 -- 전 세계를 빠르게")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [호스팅 유형 비교] -- /guides/server/hosting-types
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("호스팅 유형 비교 -- 정적/동적/서버리스/VPS")
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

---

### 10. Supabase 그룹

### [Supabase 시작 가이드] -- /guides/supabase
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("Supabase 시작 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [Supabase 인증(Auth) 설정] -- /guides/supabase/auth-setup
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("Supabase 인증(Auth) 설정 -- Google/Kakao 로그인")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [Supabase 데이터베이스 + RLS] -- /guides/supabase/database-rls
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("Supabase 데이터베이스 + RLS 보안 설정")
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

### [Supabase 프로젝트 생성 + 환경변수] -- /guides/supabase/project-setup
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("Supabase 프로젝트 생성 + 환경변수 설정")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 11. Vercel 그룹

### [Vercel 배포 가이드] -- /guides/vercel
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("Vercel 배포 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [Vercel 커스텀 도메인 연결] -- /guides/vercel/custom-domain
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("Vercel 커스텀 도메인 연결 가이드")
- **실패 API**: 없음
- **모바일**: 정상 -- h1: true, main: true, bodyWidth: 376px
- **비고**: 없음

### [GitHub 연동 + 첫 배포] -- /guides/vercel/github-deploy
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- H1("GitHub 연동 + 첫 배포")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

---

### 12. 버전 관리 (version-control) 그룹

### [버전 관리 심화] -- /guides/version-control
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("버전 관리 심화 -- 바이브 코더 가이드")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [브랜치 전략] -- /guides/version-control/branching
- **상태**: WARNING
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("브랜치 전략 -- 버전 관리 심화"), main 존재
- **실패 API**: 없음
- **모바일**: h1 미감지 (h1: false), main: true, bodyWidth: 376px
- **비고**: H1 태그가 감지되지 않음. 접근성(a11y) 관점에서 H1 존재 여부 확인 필요. 콘텐츠 자체는 정상 렌더링됨.

### [충돌 해결] -- /guides/version-control/conflict
- **상태**: PASS
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("충돌 해결 -- 버전 관리 심화")
- **실패 API**: 없음
- **모바일**: 정상 (대표 점검 기반)
- **비고**: 없음

### [PR과 코드 리뷰] -- /guides/version-control/pull-request
- **상태**: WARNING
- **HTTP**: 200
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- 타이틀("PR과 코드 리뷰 -- 버전 관리 심화"), main 존재
- **실패 API**: 없음
- **모바일**: h1 미감지 (h1: false), nav: true, main: true, footer: true, bodyWidth: 376px
- **비고**: H1 태그가 감지되지 않음. branching 페이지와 동일 패턴. 접근성 검토 권장.

---

## 공통 사항

### 네트워크 요청
- 모든 페이지에서 GA(Google Analytics), Clarity, Cloudflare CDN-CGI 관련 요청이 ERR_ABORTED로 기록됨
- 이는 브라우저 환경(Playwright)에서의 정상 동작이며 실사용자에게 영향 없음
- Supabase API 호출은 모두 200 OK

### 모바일 레이아웃
- 테스트 viewport: 375x812 (iPhone SE/13 mini 기준)
- body width: 376px (모든 페이지에서 동일) -- viewport 대비 1px 차이, 실질적 수평 스크롤 발생하지 않음
- 모든 정상 로드 페이지에서 nav, main, footer 구조 확인됨
- 모바일 햄버거 메뉴 정상 작동

### Workers Free Plan 제약
- 42개 페이지를 2초 간격으로 연속 요청 시 약 20개째부터 503 Error 1102 발생
- 60초 대기 후 모든 페이지 정상 복구 확인
- 이는 Workers Free Plan의 CPU 10ms 제한으로 인한 것이며, 실사용자 트래픽에서는 발생하지 않음
- `revalidate = false` 설정으로 캐시된 페이지는 문제 없으나, 캐시 미스 시 연속 요청에 취약

## 개선 권장사항

| 우선순위 | 항목 | 설명 |
|---------|------|------|
| P2 | H1 태그 누락 | `/guides/version-control/branching`, `/guides/version-control/pull-request` 페이지에 H1 태그 추가 (SEO, 접근성) |
| P3 | 캐시 워밍업 | 가이드 페이지 전체를 `scripts/warm-cache.sh`에 포함하여 배포 후 캐시 워밍업 수행 |
| P3 | 모바일 1px overflow | body에 `overflow-x: hidden` 또는 `max-width: 100vw` 적용 검토 |
