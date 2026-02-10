# Phase 3 CHANGELOG

## 신규 파일

### 컴포넌트
- `src/components/project/health-summary-card.tsx` - 상태 dot, 서비스명, 응답시간, 검증 버튼
- `src/components/project/health-timeline.tsx` - 검증 이력 타임라인 (아이콘, 상태, 시간)
- `src/components/project/health-sparkline.tsx` - SVG 기반 응답시간 추이 차트

### 페이지
- `src/app/project/[id]/health/page.tsx` - 상태 모니터링 전용 페이지
  - 요약 카드 (정상/오류/미확인)
  - 서비스별 health card + 클릭 시 타임라인 펼침
  - 전체 검증 버튼 + 프로그레스

## 수정 파일
- `src/app/project/[id]/page.tsx` - 서비스 건강 상태 카드 그리드 추가, 전체 검증 버튼
- `src/components/service-map/service-detail-sheet.tsx` - "검증 실행" 버튼, 최근 5건 이력, 필수 env var 개수
- `src/components/project/project-tabs.tsx` - "상태 모니터링" 탭 추가 (Activity 아이콘)
