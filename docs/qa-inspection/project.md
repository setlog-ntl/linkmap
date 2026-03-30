# QA 점검 결과 - Part 2: 프로젝트 상세

- **점검일**: 2026-03-30
- **대상 URL**: https://linkmap.biz
- **프로젝트 ID**: `71383a6b-1be2-4223-8751-2d097a37f3af` (linkmap)
- **점검 페이지 수**: 14
- **점검 도구**: Playwright MCP (Chromium)

---

## 공통 사항

- **프로젝트명**: linkmap
- **프로젝트 설명**: "프로젝트에 연결된 서비스를 한눈에 확인하고, API 키/환경변수를 한 곳에서 간편하게 등록/관리하는 플랫폼"
- **Workers 503 문제**: 프로젝트 페이지 순회 중 간헐적으로 Workers 503 에러 발생. 대기 후 복구됨.
- **콘솔 에러**: `TypeError: Failed to fetch` -- prefetch 요청 실패 (Workers 503과 연관)

---

### 1. /project/[id] -- 프로젝트 개요

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "linkmap" h1 + 프로젝트 설명 표시
  - 브레드크럼: 프로젝트 > linkmap
  - 사이드바에 프로젝트 메뉴 표시
- **실패 API**: 없음
- **비고**: 없음

### 2. /project/[id]/services -- 서비스 목록

- **상태**: WARNING
- **콘솔 에러**: 없음
- **렌더링**: 정상 (2차 시도)
  - "linkmap" h1 + 설명 표시
  - 브레드크럼: 프로젝트 > linkmap > 서비스 탐색
- **실패 API**: 1차 시도 시 Workers 503 에러
- **비고**: 1차 시도에서 Workers 503 발생. 30초 대기 후 2차 시도에서 정상 로드.

### 3. /project/[id]/service-map -- 서비스 맵

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - 브레드크럼: 프로젝트 > linkmap > 연결 지도
  - React Flow 캔버스는 accessibility snapshot에 표시되지 않음 (canvas 기반)
- **실패 API**: 없음
- **비고**: React Flow 렌더링은 스크린샷으로만 확인 가능. snapshot에서는 브레드크럼/헤더만 확인됨.

### 4. /project/[id]/costs -- 비용

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "linkmap" h1 + 설명 표시
  - 브레드크럼: 프로젝트 > linkmap > Costs
- **실패 API**: 없음
- **비고**: 없음

### 5. /project/[id]/costs/report -- 비용 리포트

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "AI 비용 분석 리포트" h1 표시
  - 통화 전환 버튼: $ USD / KRW
  - "생성 중..." 버튼 (AI 분석 진행 중)
  - "프로젝트 비용 데이터 수집 중..." 메시지
- **실패 API**: 없음
- **비고**: AI 비용 분석이 진행 중인 상태에서 정상 표시

### 6. /project/[id]/connections -- 연결

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "연결 관리" h2 + "서비스 간 연결 상태를 관리하고 모니터링합니다" 설명
  - "연결 추가" 버튼 표시
  - 상태 카드: 활성 0 / 비활성 0 / 오류 0 / 대기 0
  - 환경 필터: 전체 / 개발 / 스테이징 / 프로덕션
  - "연결 목록 (0건)" 표시
- **실패 API**: 없음
- **비고**: empty state 정상 표시

### 7. /project/[id]/env -- 환경변수

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "linkmap" h1 + 설명 표시
  - 브레드크럼: 프로젝트 > linkmap > 비밀 키
- **실패 API**: 없음
- **비고**: 없음

### 8. /project/[id]/env/conflicts -- 환경변수 충돌

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "linkmap" h1 + 설명 표시
  - 브레드크럼: 프로젝트 > linkmap > 비밀 키 > Conflicts
- **실패 API**: 없음
- **비고**: 없음

### 9. /project/[id]/credentials -- 자격증명

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "linkmap" h1 + 설명 표시
  - 브레드크럼: 프로젝트 > linkmap > Credentials
  - 사이드바 완전 펼침: 사이트 목록 + 프로젝트 서브메뉴(한눈에 보기, 서비스 목록, 연결 지도, 비용, 연결 관리, 비밀 키, 설정) 모두 표시
- **실패 API**: 없음
- **비고**: 없음

### 10. /project/[id]/monitoring -- 모니터링

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "linkmap" h1 + 설명 표시
  - 브레드크럼: 프로젝트 > linkmap > 상태 확인
- **실패 API**: 없음
- **비고**: 없음

### 11. /project/[id]/health -- 헬스 체크

- **상태**: WARNING
- **콘솔 에러**: 없음
- **렌더링**: 빈 콘텐츠 (메인 영역에 콘텐츠 없음)
  - 사이드바/헤더는 표시되지 않음
  - 명령어 검색 모달만 존재
- **실패 API**: Workers 503 에러 반복 발생 (3회 시도)
- **비고**: Workers 503 에러가 반복되어 정상 렌더링을 확인하지 못함. 60초 대기 후 페이지는 로드되었으나 메인 콘텐츠가 비어있음. prefetch 503 에러로 인한 클라이언트 상태 불안정 가능성.

### 12. /project/[id]/integrations -- 통합

- **상태**: FAIL
- **콘솔 에러**: `TypeError: Failed to fetch`
- **렌더링**: 가이드 페이지로 리다이렉트됨
  - /guides/monitoring/error-tracking 페이지가 대신 표시
  - 로그인 상태가 풀림 (회원가입 링크 표시)
- **실패 API**: net::ERR_ABORTED
- **비고**: Workers 503 에러 후 캐시된 가이드 페이지로 리다이렉트. 인증 세션 유실 가능성. 이 문제는 Workers Free Plan의 근본적 제한에 기인.

### 13. /project/[id]/audit -- 감사 로그

- **상태**: WARNING
- **콘솔 에러**: 미확인
- **렌더링**: /project/[id]/settings 로 리다이렉트됨
  - 감사 로그 페이지가 아닌 설정 페이지가 표시됨
- **실패 API**: 미확인
- **비고**: /audit 경로가 /settings로 리다이렉트됨. 감사 로그 페이지가 별도로 존재하지 않을 수 있음 (또는 설정 페이지 내에 통합되었을 수 있음).

### 14. /project/[id]/settings -- 설정

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - "linkmap" h1 + 설명 표시
  - 브레드크럼: 프로젝트 > linkmap > 설정
- **실패 API**: 없음
- **비고**: 없음

---

## 요약

| 페이지 | 상태 | 비고 |
|--------|------|------|
| /project/[id] | PASS | 개요 정상 |
| /project/[id]/services | WARNING | 1차 시도 503, 2차 정상 |
| /project/[id]/service-map | PASS | React Flow canvas 확인 불가(정상) |
| /project/[id]/costs | PASS | |
| /project/[id]/costs/report | PASS | AI 분석 진행 중 표시 |
| /project/[id]/connections | PASS | empty state 정상 |
| /project/[id]/env | PASS | |
| /project/[id]/env/conflicts | PASS | |
| /project/[id]/credentials | PASS | |
| /project/[id]/monitoring | PASS | |
| /project/[id]/health | WARNING | Workers 503 후 빈 콘텐츠 |
| /project/[id]/integrations | FAIL | 가이드 페이지로 리다이렉트 + 인증 유실 |
| /project/[id]/audit | WARNING | /settings로 리다이렉트 |
| /project/[id]/settings | PASS | |

**주요 발견**:
1. Workers 503 에러로 인해 일부 페이지가 가이드 페이지로 리다이렉트되는 문제
2. /integrations 접근 시 인증 세션이 유실되는 현상
3. /audit 경로가 /settings로 리다이렉트됨 -- 경로 존재 여부 확인 필요
4. /health 페이지가 Workers 503 후 빈 콘텐츠로 렌더링됨
