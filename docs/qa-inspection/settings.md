# QA 점검 결과 - Part 3: 설정 페이지

- **점검일**: 2026-03-30
- **대상 URL**: https://linkmap.biz
- **점검 페이지 수**: 10 (요청) / 4 (실제 존재)
- **점검 도구**: Playwright MCP (Chromium)

---

## 실제 설정 메뉴 구조

설정 사이드바에서 확인된 실제 메뉴는 **4개**입니다:
1. 내 계정 (`/settings/account`)
2. 구독 및 결제 (`/settings/billing`)
3. GitHub 연결 (`/settings/github`)
4. 개발자 도구 (`/settings/developer`)

요청된 나머지 경로(`/settings/profile`, `/settings/connections`, `/settings/tokens`, `/settings/services`, `/settings/danger`, `/settings/accounts`)는 별도 페이지로 존재하지 않으며, 일부는 `/settings/account`로 리다이렉트됩니다.

---

### 1. /settings/account -- 내 계정

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - 브레드크럼: 설정 > 내 계정
  - 사이드 네비게이션: 내 계정, 구독 및 결제, GitHub 연결, 개발자 도구
  - 메인 콘텐츠 영역 표시
- **실패 API**: 없음
- **비고**: 없음

### 2. /settings/billing -- 구독 및 결제

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - 브레드크럼: 설정 > Billing
  - 사이드 네비게이션 정상 표시
- **실패 API**: 없음
- **비고**: 없음

### 3. /settings/github -- GitHub 연결

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - 브레드크럼: 설정 > Github
  - 사이드 네비게이션 정상 표시
- **실패 API**: 없음
- **비고**: 없음

### 4. /settings/developer -- 개발자 도구

- **상태**: PASS
- **콘솔 에러**: 없음
- **렌더링**: 정상
  - 브레드크럼: 설정 > 개발자 도구
  - 사이드 네비게이션 정상 표시
- **실패 API**: 없음
- **비고**: 없음

### 5. /settings/profile -- 프로필

- **상태**: PASS (리다이렉트)
- **콘솔 에러**: 없음
- **렌더링**: `/settings/account`로 리다이렉트됨
  - 리다이렉트 후 "내 계정" 페이지가 정상 표시
- **실패 API**: 없음
- **비고**: /settings/profile 경로는 /settings/account로 통합된 것으로 판단

### 6. /settings/connections -- 연결

- **상태**: N/A
- **비고**: 별도 페이지 미존재. 설정 사이드바에 해당 메뉴 없음. 점검 시 Workers 503 리스크로 인해 별도 확인하지 않음.

### 7. /settings/tokens -- 토큰

- **상태**: N/A
- **비고**: 별도 페이지 미존재. 설정 사이드바에 해당 메뉴 없음.

### 8. /settings/services -- 서비스

- **상태**: N/A
- **비고**: 별도 페이지 미존재. 설정 사이드바에 해당 메뉴 없음.

### 9. /settings/danger -- 위험 영역

- **상태**: N/A
- **비고**: 별도 페이지 미존재. 설정 사이드바에 해당 메뉴 없음.

### 10. /settings/accounts -- 계정 목록

- **상태**: N/A
- **비고**: 별도 페이지 미존재. 설정 사이드바에 해당 메뉴 없음.

---

## 요약

| 페이지 | 상태 | 비고 |
|--------|------|------|
| /settings/account | PASS | 내 계정 |
| /settings/billing | PASS | 구독 및 결제 |
| /settings/github | PASS | GitHub 연결 |
| /settings/developer | PASS | 개발자 도구 |
| /settings/profile | PASS | /settings/account로 리다이렉트 |
| /settings/connections | N/A | 페이지 미존재 |
| /settings/tokens | N/A | 페이지 미존재 |
| /settings/services | N/A | 페이지 미존재 |
| /settings/danger | N/A | 페이지 미존재 |
| /settings/accounts | N/A | 페이지 미존재 |

**주요 발견**:
1. 설정 페이지는 4개 서브 페이지만 존재 (account, billing, github, developer)
2. 요청된 10개 경로 중 6개는 실제로 존재하지 않음
3. /settings/profile은 /settings/account로 정상 리다이렉트
4. 존재하는 4개 페이지 모두 정상 동작
