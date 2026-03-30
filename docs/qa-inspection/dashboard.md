# QA 점검 결과 - Part 1: 대시보드 & 사이트 관리

- **점검일**: 2026-03-30
- **대상 URL**: https://linkmap.biz
- **점검 페이지 수**: 5
- **점검 도구**: Playwright MCP (Chromium)

---

## 공통 사항

- **Workers 503 에러 (Error 1102)**: 점검 중 Cloudflare Workers Free Plan의 CPU 10ms 제한으로 인해 간헐적으로 `Worker exceeded resource limits` (503) 에러 발생. 페이지 간 빠른 이동 시 prefetch 요청 폭발로 Worker 리소스가 소진됨. 약 30~60초 대기 후 복구됨.
- **ERR_ABORTED 요청**: GA (analytics.google.com), Clarity (j.clarity.ms), Cloudflare RUM (cdn-cgi/rum) 등 트래커 요청이 페이지 이동 시 ERR_ABORTED 됨 -- 이는 정상 동작(페이지 이동 시 진행 중인 네트워크 요청이 취소됨).
- **Supabase API**: auth/v1/user, rest/v1/services, rest/v1/profiles 등 모두 200 응답으로 정상.

---

### 1. /dashboard -- 내 프로젝트

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "내 프로젝트" h1 헤딩 표시
  - 사이드바: 원클릭 배포(사이트 목록), 내 프로젝트(linkmap, readtree, snsmk 등) 표시
  - 메인: "템플릿에서 시작", "새 프로젝트" 버튼, 퀵링크(원클릭 배포, 서비스 카탈로그, 환경변수 가이드) 표시
  - 사용자 정보: donghyuck choi / cdhrich2@gmail.com 표시
- **실패 API**: 없음 (Supabase API 모두 200)
- **비고**: 프로젝트 목록에서 추출한 ID: `71383a6b-1be2-4223-8751-2d097a37f3af` (linkmap)

### 2. /sites/manage -- 내 사이트 관리

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "원클릭 배포" h1 + "내 사이트" h1 표시
  - 탭 네비게이션: "원클릭 배포" / "내 사이트"
  - "원클릭 배포" 버튼 표시
  - API: /api/oneclick/deployments (200), projects 쿼리 (200)
- **실패 API**: setlog-ntl.github.io 프리뷰 iframe 요청들이 ERR_ABORTED (페이지 이동 시 취소 -- 정상)
- **비고**: 배포된 사이트 프리뷰 iframe들이 정상적으로 로드 시도됨

### 3. /sites/new -- 원클릭 배포 (새 사이트)

- **상태**: PASS (2차 시도)
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "원클릭 배포" h1 표시
  - 탭 네비게이션: "원클릭 배포" / "내 사이트"
  - 사이드바, 헤더, 브레드크럼 정상
- **실패 API**: 없음
- **비고**: 1차 시도 시 Workers 503 에러로 가이드 페이지로 리다이렉트. 30초 대기 후 2차 시도에서 정상 로드.

### 4. /sites/showcase -- 내 쇼케이스

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "내 쇼케이스 관리" h1 표시
  - "쇼케이스에 등록한 사이트의 정보를 수정하거나 해제할 수 있습니다" 설명 텍스트
  - "갤러리 보기" 링크 표시
- **실패 API**: 없음
- **비고**: empty state 표시 (등록된 쇼케이스 없음)

### 5. /trash -- 휴지통

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "휴지통" h1 표시
  - 탭 구조: 전체 / 프로젝트 / 환경변수 / 연결
  - "불러오는 중..." 로딩 상태 표시 (정상)
- **실패 API**: 없음
- **비고**: 없음

---

## 요약

| 페이지 | 상태 | 비고 |
|--------|------|------|
| /dashboard | PASS | 프로젝트 목록 정상 표시 |
| /sites/manage | PASS | 배포 사이트 목록 정상 |
| /sites/new | PASS | 2차 시도에서 정상 (1차: Workers 503) |
| /sites/showcase | PASS | empty state 정상 |
| /trash | PASS | 탭 구조 정상 |

**주요 발견**: Workers Free Plan CPU 제한으로 인한 간헐적 503 에러가 가장 큰 문제. 페이지 간 빠른 이동 시 prefetch 요청이 Worker 리소스를 소진시킴.
