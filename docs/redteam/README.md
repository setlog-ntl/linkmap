# Red Team Agent

## Overview
지정된 기능/메뉴/모듈을 **완전히 적대적 관점**에서 검토하여 문제점을 도출하고 개선안을 제시하는 에이전트.

## Philosophy
- **Devil's Advocate**: 모든 것이 잘못될 수 있다고 가정
- **Zero Trust**: 어떤 코드도 신뢰하지 않음
- **Worst-Case Thinking**: 최악의 시나리오를 항상 상정
- **User Hostility**: 악의적 사용자가 시스템을 공격한다고 가정

## Review Categories

### 1. Security (보안)
- 인증/인가 우회 가능성
- 입력 검증 미흡 (XSS, SQL Injection, SSRF 등)
- 민감 데이터 노출 (API 키, 토큰, PII)
- RLS 정책 누락/우회
- CSRF, CORS 설정 문제
- 암호화/해싱 취약점

### 2. Reliability (안정성)
- 에러 핸들링 누락/부실
- Race condition
- 메모리 누수, 무한 루프 가능성
- 외부 의존성 장애 시 동작
- 타임아웃 미설정
- 재시도 로직 부재

### 3. Data Integrity (데이터 무결성)
- 데이터 손실 시나리오
- 일관성 깨짐 가능성
- 트랜잭션 미사용
- 동시성 문제
- 고아 레코드 발생

### 4. UX Anti-Patterns (사용자 경험 문제)
- 로딩/에러 상태 미처리
- 접근성(a11y) 위반
- 반응형 깨짐
- 비직관적 플로우
- 되돌릴 수 없는 작업 경고 부재

### 5. Performance (성능)
- N+1 쿼리
- 불필요한 리렌더링
- 번들 사이즈 비대
- 캐싱 미활용
- 인덱스 미사용 쿼리

### 6. Maintainability (유지보수성)
- 하드코딩된 값
- 중복 코드
- 과도한 결합도
- 테스트 부재/부실
- 문서화 미흡

## Severity Levels

| Level | Label | Description |
|-------|-------|-------------|
| P0 | CRITICAL | 즉시 수정 필요. 보안 취약점, 데이터 손실 위험 |
| P1 | HIGH | 빠른 수정 필요. 기능 장애, 심각한 UX 문제 |
| P2 | MEDIUM | 계획적 수정. 성능 저하, 유지보수 어려움 |
| P3 | LOW | 개선 권장. 코드 품질, 사소한 UX 개선 |

## Output Structure
각 리뷰는 `docs/redteam/YYYY-MM-DD-{target}.md` 형식으로 생성됩니다.

## Reports Index
<!-- 리포트가 생성되면 여기에 자동 추가 -->

| Date | Target | P0 | P1 | P2 | P3 | Status |
|------|--------|----|----|----|----|--------|
| 2026-02-25 | [원클릭 배포 모듈](./2026-02-25-oneclick-module.md) | 3 | 6 | 6 | 4 | CRITICAL |
