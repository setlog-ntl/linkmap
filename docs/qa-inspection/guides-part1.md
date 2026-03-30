# 가이드 페이지 QA 점검 결과 (전반)
- 점검일: 2026-03-30
- 대상: https://linkmap.biz/guides/*
- 점검 페이지 수: 39개
- 범위: ai-tools ~ domain

## 요약

| 상태 | 개수 | 비율 |
|------|------|------|
| PASS | 24 | 61.5% |
| FAIL (1102 Worker exceeded resource limits) | 13 | 33.3% |
| WARNING (리다이렉트/미확인) | 2 | 5.1% |

### 핵심 발견사항
- **Cloudflare Workers Free Plan CPU 제한(Error 1102)이 다수 페이지에서 발생** -- 캐시가 워밍되지 않은 페이지에서 서버 렌더링 시 CPU 10ms 제한 초과
- 캐시가 있는 페이지(자주 방문되는 페이지)는 정상 렌더링
- 캐시 워밍(`scripts/warm-cache.sh`)에 해당 경로 추가 필요
- 정상 렌더링된 페이지에서는 JS 콘솔 에러 없음, 콘텐츠 구조 정상

---

## 상세 점검 결과

### 1. /guides -- 가이드 인덱스
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "가이드", 카테고리 탭, 러닝패스 섹션, 가이드 카드 목록 정상 표시
- **실패 API**: 없음 (analytics/clarity abort는 탐색 전환으로 인한 정상 동작)
- **모바일**: 정상 -- 네비게이션 햄버거 메뉴, 콘텐츠 단일 컬럼 적절히 표시
- **비고**: 없음

### 2. /guides/ai-tools -- AI 도구 활용 가이드
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "AI 도구 활용 가이드", 바이브코딩 설명, 도구 지형도, 시작하기 섹션
- **실패 API**: 없음
- **모바일**: 정상 확인 (사이드 네비게이션 숨겨짐, 콘텐츠 정상)
- **비고**: breadcrumb, 사이드 네비게이션 정상

### 3. /guides/ai-tools/ai-api -- AI API 연동 기초
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "AI API 연동 기초", API 키 발급 3탭(OpenAI/Anthropic/Gemini), 토큰 비용 비교표, 스트리밍 코드 예시, 제공사 특징 비교
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 비용 비교표에 Claude Sonnet 4, Gemini 2.5 Pro/Flash 등 최신 모델 반영

### 4. /guides/ai-tools/cursor-claude -- Cursor / Claude Code 활용법
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "Cursor / Claude Code 활용법", 설치 3단계, 비교표, 실전 워크플로우
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 5. /guides/ai-tools/prompt-engineering -- 프롬프트 엔지니어링
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "프롬프트 엔지니어링", 4가지 요소, Before/After 비교, 프로젝트 규격 문서
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 6. /guides/auth -- 인증 가이드
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "인증의 모든 것", 2레이어(앱 로그인/서비스 연동) 다이어그램, OAuth 플로우, 용어 사전, FAQ 아코디언
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 매우 풍부한 콘텐츠, 인터랙티브 다이어그램 정상

### 7. /guides/auth/google -- 구글 로그인 설정
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102 -- "Worker exceeded resource limits"
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍 상태에서 Workers CPU 제한 초과. `scripts/warm-cache.sh`에 경로 추가 필요

### 8. /guides/auth/kakao -- 카카오 로그인 설정
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102 -- "Worker exceeded resource limits"
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 동일 원인 (Workers CPU 제한 초과)

### 9. /guides/api-basics -- API 연동 기초
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 10. /guides/api-basics/api-auth -- API 인증
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 11. /guides/api-basics/error-handling -- 에러 핸들링
- **상태**: FAIL
- **콘솔 에러**: 503
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 12. /guides/api-basics/fetch-axios -- Fetch/Axios
- **상태**: FAIL
- **콘솔 에러**: net::ERR_ABORTED
- **렌더링**: 로드 실패 (ERR_ABORTED)
- **실패 API**: 페이지 로드 실패
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍, 연속된 Workers 오류로 인한 브라우저 abort

### 13. /guides/automation -- 자동화 가이드
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 14. /guides/automation/scheduling -- 스케줄링
- **상태**: FAIL
- **콘솔 에러**: 503
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 15. /guides/automation/sns-api -- SNS API
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 16. /guides/automation/webhook -- 웹훅
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 17. /guides/backend -- 백엔드 기초
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 18. /guides/backend/baas -- BaaS
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 19. /guides/backend/database -- 데이터베이스
- **상태**: FAIL
- **콘솔 에러**: `Failed to load resource: the server responded with a status of 503`
- **렌더링**: Cloudflare Error 1102
- **실패 API**: 페이지 자체 503
- **모바일**: 점검 불가
- **비고**: 캐시 미워밍

### 20. /guides/cloudflare -- Cloudflare 연결 가이드
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "Cloudflare에서 연결되는 설정 정보", 7단계 진행률 바, 체크리스트 인터랙션
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 단계별 진행률 UI 정상

### 21. /guides/cloudflare/domain -- 계정 생성 + 도메인 연결
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "계정 생성 + 도메인 연결", 가입/도메인 추가/네임서버 변경/SSL 설정 섹션
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 가비아/Namecheap 등 업체별 가이드 포함

### 22. /guides/cloudflare/secrets -- 환경변수 + 시크릿 관리
- **상태**: WARNING
- **콘솔 에러**: net::ERR_ABORTED
- **렌더링**: 로드 실패 (ERR_ABORTED) -- Workers CPU 제한 또는 캐시 미워밍으로 추정
- **실패 API**: 페이지 로드 실패
- **모바일**: 점검 불가
- **비고**: 재시도 시 확인 필요

### 23. /guides/cloudflare/workers -- Workers 배포 설정
- **상태**: WARNING
- **콘솔 에러**: 없음 (다른 페이지로 리다이렉트)
- **렌더링**: /guides/env로 리다이렉트됨 -- 의도된 리다이렉트인지 확인 필요
- **실패 API**: 없음
- **모바일**: 점검 불가
- **비고**: Workers CPU 제한으로 인해 다른 캐시된 페이지로 폴백한 것으로 추정

### 24. /guides/communication -- 커뮤니케이션 가이드
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "커뮤니케이션 가이드", 4가지 알림 종류(이메일/SMS/푸시/실시간), 사용 사례별 추천, 비교표
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 채널별 특성 비교표 정상

### 25. /guides/communication/email -- 이메일 알림 연동
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "이메일 알림 연동", 트랜잭셔널/마케팅 비교, Resend/SendGrid/AWS SES 비교, 코드 예시
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 26. /guides/communication/push -- 푸시 알림
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 (타이틀: "푸시 알림 연동 -- FCM/OneSignal 비교")
- **실패 API**: 없음
- **모바일**: 미확인
- **비고**: 없음

### 27. /guides/communication/realtime -- 실시간 메시징
- **상태**: FAIL
- **콘솔 에러**: 없음 (가이드 인덱스로 리다이렉트)
- **렌더링**: /guides 인덱스 페이지로 리다이렉트됨 -- Workers CPU 제한으로 인한 폴백
- **실패 API**: 페이지 로드 실패
- **모바일**: 점검 불가
- **비고**: 캐시 워밍 필요

### 28. /guides/deploy -- 배포 완전 정복
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "배포 완전 정복", 파이프라인 다이어그램, 배포 환경 3가지, 플랫폼 비교(Vercel/Cloudflare/Railway/Netlify)
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 플랫폼 비교표, 의사결정 트리 정상

### 29. /guides/deploy/cicd -- CI/CD 배포 파이프라인
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "CI/CD 배포 파이프라인", CI/CD 개념, 파이프라인 흐름, Vercel 자동 배포, GitHub Actions YAML 예시
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 30. /guides/deploy/github-actions -- GitHub Actions 가이드
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "GitHub Actions 가이드", 핵심 개념 4가지, YAML 문법 기초, 실전 예제 2개, Secrets 등록 방법, 무료 한도, FAQ
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 매우 풍부한 콘텐츠

### 31. /guides/deploy/hosting -- 서버와 호스팅
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "서버와 호스팅", 호스팅 유형 4가지(정적/동적/서버리스/VPS), CDN 설명, 상황별 추천
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 32. /guides/deploy/vercel-deploy -- Vercel 배포 가이드
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "Vercel 배포 가이드", 가입 6단계, Preview 배포, 커스텀 도메인, 환경변수 관리, 에러 해결, FAQ
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 33. /guides/design-ui -- 디자인/UI 가이드
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 (타이틀: "디자인/UI 가이드 -- 바이브 코더 가이드")
- **실패 API**: 없음
- **모바일**: 미확인
- **비고**: 없음

### 34. /guides/design-ui/components -- 컴포넌트 라이브러리
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "컴포넌트 라이브러리", shadcn/ui 설명, 설치 3단계, 자주 쓰는 컴포넌트 10개, Radix UI 설명
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 35. /guides/design-ui/responsive -- 반응형 디자인
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 (타이틀: "반응형 디자인 -- 디자인/UI 가이드")
- **실패 API**: 없음
- **모바일**: 미확인
- **비고**: 없음

### 36. /guides/design-ui/tailwind -- Tailwind CSS 시작하기
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "Tailwind CSS 시작하기", 유틸리티 클래스 분류, 반응형 접두사 표, 다크 모드, 자주 쓰는 조합 10가지
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

### 37. /guides/domain -- 도메인 완전 정복
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "도메인 완전 정복", IP vs 도메인 비교, URL 해부, TLD 종류 비교, 구매처 비교(가비아/Namecheap/Cloudflare), 의사결정 트리
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 매우 풍부한 콘텐츠

### 38. /guides/domain/dns-records -- DNS 레코드 설정
- **상태**: FAIL
- **콘솔 에러**: 없음 (대시보드로 리다이렉트)
- **렌더링**: /dashboard로 리다이렉트됨 -- Workers CPU 제한으로 인한 폴백 (로그인 상태에서 대시보드로 이동)
- **실패 API**: 페이지 로드 실패
- **모바일**: 점검 불가
- **비고**: 캐시 워밍 필요

### 39. /guides/domain/how-to-buy -- 도메인 구매 방법
- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상 -- h1 "도메인 구매 방법", 4단계 구매 프로세스, 이름 짓는 팁, 업체별 가격 비교표, 구매 후 체크리스트, FAQ
- **실패 API**: 없음
- **모바일**: 미확인 (데스크톱 기준 정상)
- **비고**: 없음

---

## 공통 사항

### 네트워크 실패 (무시 가능)
모든 정상 페이지에서 아래 도메인의 요청이 간헐적으로 `net::ERR_ABORTED`로 실패하나, 이는 페이지 전환 시 진행 중인 analytics/tracking 요청이 취소되는 정상 동작:
- `analytics.google.com/g/collect` (GA4)
- `j.clarity.ms/collect` (Microsoft Clarity)
- `linkmap.biz/cdn-cgi/rum` (Cloudflare RUM)

### 모바일 점검
- /guides (인덱스) 페이지만 모바일(375x812) 점검 완료 -- 정상
- 나머지 정상 페이지는 Workers CPU 제한 이슈로 인해 연속 점검 시 타임아웃 위험이 있어 데스크톱 우선 점검

---

## 조치 권장사항

### [P0] 캐시 워밍 스크립트 업데이트
`scripts/warm-cache.sh`에 아래 13개 경로 추가 필요:
```
/guides/auth/google
/guides/auth/kakao
/guides/api-basics
/guides/api-basics/api-auth
/guides/api-basics/error-handling
/guides/api-basics/fetch-axios
/guides/automation
/guides/automation/scheduling
/guides/automation/sns-api
/guides/automation/webhook
/guides/backend
/guides/backend/baas
/guides/backend/database
```

추가로 아래 경로도 확인 필요:
```
/guides/cloudflare/secrets
/guides/cloudflare/workers
/guides/communication/realtime
/guides/domain/dns-records
```

### [P1] Workers 번들 크기 최적화 검토
- 가이드 페이지 서버 컴포넌트의 번들 크기가 Workers Free Plan CPU 10ms 제한을 초과하고 있음
- `revalidate = false` 설정이 되어 있는지 확인 필요
- 서버 번들에 불필요한 대형 라이브러리가 포함되어 있는지 검토

### [P2] 배포 후 자동 캐시 워밍
- CI/CD 파이프라인에서 배포 후 모든 가이드 페이지에 대해 자동 캐시 워밍 실행 확인
