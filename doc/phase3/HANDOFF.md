# Phase 3 → Phase 4 인수인계

## Phase 4에서 사용할 항목

### 컴포넌트
- `HealthSummaryCard` → `src/components/project/health-summary-card.tsx`
  - 마법사 완료 화면에서 검증 결과 표시에 재활용
- `HealthTimeline` → `src/components/project/health-timeline.tsx`
  - 마법사 검증 단계에서 이력 표시에 재활용

### 훅
- `useRunHealthCheck()` → `src/lib/queries/health-checks.ts`
  - 마법사 4단계 "연결 검증"에서 사용
  - `mutateAsync({ project_service_id, environment })` → HealthCheck 반환

### 패턴
- 개요 페이지의 "전체 검증" → `handleRunAll()` 패턴
  - 순차 실행 + 프로그레스 표시 패턴 참조

## Phase 4 시작 전 체크리스트
- [ ] `useRunHealthCheck()` 훅 정상 동작 확인
- [ ] `src/data/services.ts`의 `required_env_vars` 데이터 확인
- [ ] `HealthSummaryCard` 컴포넌트 import 가능 확인
- [ ] `POST /api/env` (env var 생성) API 정상 동작 확인

## 파일 경로 요약
```
신규:
  src/components/project/health-summary-card.tsx
  src/components/project/health-timeline.tsx
  src/components/project/health-sparkline.tsx
  src/app/project/[id]/health/page.tsx

수정:
  src/app/project/[id]/page.tsx
  src/components/service-map/service-detail-sheet.tsx
  src/components/project/project-tabs.tsx
```
