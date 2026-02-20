# Refactoring Criteria

## KEEP 기준 (유지)
- 인증(getUser) + Zod 검증(safeParse) + 비즈니스 로직 + 감사 로그(logAudit)를 갖춘 API 라우트
- 2곳 이상에서 import되는 공유 함수
- 테스트가 존재하는 모듈 (84개 테스트)
- 인증/RLS/암호화 관련 코드 (절대 제거 금지)
- 에러 핸들링 체인 (src/lib/api/errors.ts)
- 감사 로그 시스템 (src/lib/audit.ts, 54개 액션 타입)

## REFACTOR 기준 (리팩토링)
- 100줄+ 함수 with 다중 책임 → 단일 책임으로 분리
- 2곳+ 중복 로직 → 공유 모듈로 추출
- 400줄+ 파일 with 10개+ exports → 도메인별 서브파일 분할 + barrel
- 200줄+ 단일 타입 파일 → 도메인별 타입 파일 분할
- 인라인 비즈니스 로직이 다른 라우트와 중복될 때

## REMOVE 기준 (제거)
- import 0회 코드 (dead code)
- deprecated 마킹 + 대체 완료된 코드
- 프로덕션에 유출된 테스트 전용 유틸리티

## NEVER REMOVE (절대 제거 금지)
- 인증/RLS/암호화 코드
- 감사 로그 호출
- 에러 핸들링 패턴
- 레거시 호환 코멘트가 있는 코드 (e.g., "LEGACY: Vercel deploy steps")
- Zod 검증 스키마

## 리팩토링 패턴

### Barrel Re-export 패턴
대형 파일 분할 시 기존 import 호환을 위해 barrel index.ts 유지:
```typescript
// src/types/index.ts (after split)
export * from './core';
export * from './service';
// ...
```

### 공유 함수 추출 패턴
중복 코드 발견 시:
1. 공통 함수를 해당 도메인의 lib/ 디렉토리에 생성
2. 원본 파일에서 공통 함수 import로 교체
3. 기존 테스트가 통과하는지 확인

### 디렉토리 재구성 패턴
많은 파일이 있는 플랫 디렉토리:
1. 논리적 그룹(seed, ui, oneclick)으로 서브디렉토리 생성
2. 각 서브디렉토리에 barrel index.ts 추가
3. 기존 import 경로 업데이트

## 검증 체크리스트
- [ ] `npm run typecheck` 통과
- [ ] `npm run test` 84개 테스트 통과
- [ ] `npm run build` 빌드 성공
- [ ] 새로운 `any` 타입 미도입
- [ ] 인증/감사 코드 미삭제
- [ ] barrel re-export로 기존 import 경로 유지
