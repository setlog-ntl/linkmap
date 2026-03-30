# Linkmap 전체 QA 점검 결과 요약

- **점검일**: 2026-03-30
- **대상**: https://linkmap.biz
- **총 점검 페이지**: 149개
- **점검 도구**: Playwright MCP (Chromium)

## 영역별 결과

| 영역 | 총 페이지 | PASS | WARNING | FAIL | N/A |
|------|----------|------|---------|------|-----|
| 공개 핵심 | 28 | 11 | 1 | 16 | 0 |
| 가이드 전반 | 39 | 24 | 2 | 13 | 0 |
| 가이드 후반 | 42 | 40 | 2 | 0 | 0 |
| 대시보드 | 5 | 5 | 0 | 0 | 0 |
| 프로젝트 | 14 | 10 | 3 | 1 | 0 |
| 설정 | 10 | 5 | 0 | 0 | 5 |
| 관리자 | 6 | 6 | 0 | 0 | 0 |
| **합계** | **144** | **101** | **8** | **30** | **5** |

- **PASS율**: 70.1% (101/144)
- **FAIL율**: 20.8% (30/144, 대부분 503 에러)
- **WARNING율**: 5.6% (8/144)

## 심각도별 이슈 분류

### CRITICAL (즉시 조치 필요)

#### C1. Cloudflare Workers Error 1102 — 503 에러 대량 발생
- **영향**: 30개 페이지 접근 불가 (전체의 20.8%)
- **원인**: Workers Free Plan CPU 10ms 제한 초과 (캐시 미워밍 페이지)
- **영향받는 페이지**:
  - /login, /signup, /reset-password — **신규 사용자 유입 완전 차단**
  - /demo, /demo/project/* — 데모 체험 불가
  - /terms, /privacy — 법적 준수 위반 가능
  - /faq, /glossary, /feedback, /showcase — 공개 콘텐츠 접근 불가
  - /guides/auth/*, /guides/api-basics/*, /guides/automation/*, /guides/backend/* 등 13개 가이드
- **조치**: `bash scripts/warm-cache.sh` 실행 + 누락 경로 추가

#### C2. /project/[id]/integrations — 가이드 페이지로 리다이렉트 + 인증 세션 유실
- **영향**: 통합 페이지 접근 불가, 로그인 상태 풀림
- **원인**: Workers 503 에러 후 캐시된 가이드 페이지로 잘못된 리다이렉트
- **조치**: 에러 핸들링 개선 + 503 시 적절한 fallback 표시

### WARNING (개선 권장)

#### W1. /services/compare — 비교표 데이터 "-" 표시
- **영향**: 서비스 비교 기능이 의미 없음 (타입, 무료 티어, DX 점수 모두 "-")
- **조치**: 비교 데이터 소스 확인 및 누락 데이터 보완

#### W2. /project/[id]/audit — /settings로 리다이렉트
- **영향**: 감사 로그 페이지 접근 불가
- **조치**: audit 경로가 의도적 리다이렉트인지 확인, 아니라면 라우팅 수정

#### W3. /project/[id]/health — 빈 콘텐츠 렌더링
- **영향**: 헬스 체크 기능 사용 불가 (Workers 503 후)
- **조치**: 503 에러 시 적절한 에러 UI 표시

#### W4. /admin/users — "전체 사용자 (0명)" 표시
- **영향**: 관리자 사용자 데이터 미로딩 가능
- **조치**: RLS 정책 또는 API 응답 확인

#### W5. /admin/showcase — 사이드바 메뉴 미표시
- **영향**: 관리자가 쇼케이스 관리 페이지를 사이드바에서 찾을 수 없음
- **조치**: 사이드바 관리 메뉴에 추가 검토

#### W6. 가이드 H1 태그 미감지 (2건)
- **영향**: /guides/version-control/branching, /guides/version-control/pull-request
- **조치**: 접근성/SEO 관점에서 H1 태그 추가 검토

#### W7. 설정 페이지 6개 경로 미존재
- **영향**: /settings/connections, /settings/tokens, /settings/services, /settings/danger, /settings/accounts, /settings/profile (→account 리다이렉트)
- **조치**: 코드에는 page.tsx 존재하나 프로덕션에서 미노출 — 의도적 비활성화인지 확인

### INFO (참고사항)

- 모바일 body width 376px (1px overflow) — 실질적 문제 없음
- Google Analytics, Clarity, Cloudflare RUM의 ERR_ABORTED — 페이지 전환 시 정상 동작
- Supabase API 호출 모두 200 정상 응답
- React Flow(서비스 맵) canvas는 accessibility snapshot에서 확인 불가 (정상)
- 연속 요청 시 간헐적 503 발생 — 실사용자 환경에서는 드물게 발생

## 공통 패턴

### 정상 페이지 공통점
- `revalidate = false` 또는 ISR 캐시된 페이지
- `scripts/warm-cache.sh`에 등록된 페이지
- 자주 방문되어 CDN 캐시 유지 중인 페이지

### 실패 페이지 공통점
- 캐시가 만료되었거나 워밍되지 않은 페이지
- `force-dynamic` 설정된 인증 관련 페이지
- warm-cache.sh에 등록되지 않은 페이지
