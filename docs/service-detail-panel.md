# 서비스 상세 패널 (Service Detail Panel)

## 현재 기능

`ServiceDetailSheet`는 프로젝트에 추가된 서비스의 상세 정보를 우측 슬라이드 패널로 보여주는 컴포넌트입니다.

### 표시 정보
- 서비스 이름, 설명, 상태 배지
- 카테고리 / 도메인 분류
- 연결 검증 (Health Check) 이력 + 실행 버튼
- 서비스 계정 연결 (토글)
- 환경변수 섹션 (필수 환경변수 대비 설정 현황)
- 난이도, 무료 티어, DX 점수, 비용 추정, 벤더 락인 배지
- 의존성 목록
- 웹사이트 / 문서 링크

### 핵심 파일
| 파일 | 역할 |
|------|------|
| `src/stores/service-detail-store.ts` | Zustand 글로벌 스토어 |
| `src/components/service-map/service-detail-sheet.tsx` | Sheet UI 컴포넌트 |
| `src/components/service-map/service-detail-sheet-global.tsx` | 글로벌 마운트 래퍼 |
| `src/components/service-map/service-detail-resolver.tsx` | 경량 ID → 풀 데이터 리졸버 |

---

## 접근 포인트 매트릭스

| 뷰 | 트리거 | 데이터 경로 |
|----|--------|-------------|
| 의존성 뷰 (Dependency) | 노드 클릭 / 우클릭 → "상세 보기" | `openSheet(fullData)` — 즉시 |
| 상태 뷰 (Status) | GroupSummaryCard 내 서비스 행 클릭 | `openSheet(fullData)` — 즉시 |
| 맵 뷰 (Map) | 방사형 서비스 노드 클릭 | `openSheet(fullData)` — 즉시 |
| 대시보드 개요 | FlowPill 클릭 / 서비스 아이콘 클릭 | `openSheetById(id)` → Resolver가 TanStack Query 캐시로 데이터 로드 |

---

## 아키텍처

### 글로벌 스토어 (`service-detail-store`)
```
openSheet(fullData)      — 서비스맵 뷰에서 사용 (풀 데이터 즉시 제공)
openSheetById({ids})     — 대시보드에서 사용 (경량 ID만 전달)
closeSheet()             — 패널 닫기
resolvePending(fullData) — Resolver가 데이터 로딩 완료 시 호출
```

### 데이터 플로우
```
[서비스맵 뷰] → openSheet(fullData) → Sheet 즉시 렌더링
[대시보드]    → openSheetById(id)   → loading 스켈레톤 → Resolver fetch → resolvePending → Sheet 렌더링
```

### Resolver (`ServiceDetailResolver`)
- `(dashboard)/layout.tsx`에 마운트
- `pendingIdentifier` 감시 → `useProjectServices()` + `useServiceDependencies()` + `useEnvVars()`로 풀 데이터 fetch
- TanStack Query 캐시 활용: 서비스맵 방문 이력이 있으면 네트워크 비용 0

---

## 고도화 로드맵

### P1 — 인라인 편집
- 패널 내에서 서비스 상태 변경 (연결됨 ↔ 미연결)
- 환경변수 직접 추가/수정
- 서비스 계정 빠른 연결

### P2 — 연결 그래프 미니뷰
- 패널 하단에 선택된 서비스 중심의 1-hop 관계 미니 그래프
- 관련 서비스 클릭 시 패널 전환

### P3 — 활동 타임라인
- 헬스체크 이력 + 환경변수 변경 + 감사 로그 통합 타임라인
- 시간순 정렬, 필터 지원

### P4 — AI 진단
- "이 서비스 진단" 버튼 → AI 환경변수 닥터 연동
- 권장 설정, 누락 환경변수, 보안 리스크 자동 분석
