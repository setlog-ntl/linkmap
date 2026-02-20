# Service Map v2: 3-Level View Architecture

## Overview
서비스맵 페이지(`/project/[id]/service-map`)를 3단계 계층형 뷰로 재설계.

## 3 View Levels

### Level 1: Status View (상태 보기)
- React Flow 없이 순수 HTML/CSS 렌더링
- Health Score Ring (0-100점, 가중 평균)
- 5개 ViewGroup 카드 (Core, Runtime, Growth, Intelligence, Infra)
- 경고/알림 목록
- Quick Action 패널

### Level 2: Map View (맵 보기)
- React Flow 방사형 레이아웃
- 중앙 프로젝트 노드 + 서비스 노드 (hub-and-spoke)
- 5개 ViewGroup을 72도 섹터로 분할
- 간소화된 툴바: 검색, 전체 보기, PNG 내보내기

### Level 3: Dependency View (의존성 보기)
- 기존 3-zone 레이아웃 그대로 유지
- 편집 모드, 컨텍스트 메뉴, 상세 시트 등 모든 기능 보존
- 서비스 간 의존성 + 사용자 연결 엣지 표시

## ViewGroup Mapping

| ViewGroup | ServiceCategory |
|-----------|----------------|
| core | database, auth, social_login, cache, search |
| runtime | deploy, serverless, cdn |
| growth | email, sms, push, payment, analytics, ecommerce, chat, cms |
| intelligence | ai |
| infra | storage, monitoring, logging, cicd, testing, code_quality, media, queue, feature_flags, scheduling, automation, other |

## Health Score Calculation

| Factor | Weight | Source |
|--------|--------|--------|
| Connected services ratio | 40% | `project_services.status === 'connected'` |
| Healthy services ratio | 30% | `health_checks.status === 'healthy'` |
| Env completeness ratio | 30% | `env_vars.encrypted_value` filled |

Grade: Good (70+), Warning (40-69), Critical (0-39)

## Data Flow
```
useServiceMapData (1회 호출)
    ↓
┌──────────┬──────────┬──────────────┐
│ StatusView│ MapView  │DependencyView│
│ (HTML)    │(Radial)  │(Zone layout) │
└──────────┴──────────┴──────────────┘
```

## File Structure
```
src/components/service-map/
├── service-map-client.tsx     # View orchestrator
├── view-level-switcher.tsx    # 3-segment toggle
├── project-node.tsx           # Central project node (Level 2)
├── radial-edge.tsx           # Radial edge (Level 2)
├── views/
│   ├── status-view.tsx       # Level 1
│   ├── health-score-ring.tsx # Health ring
│   ├── group-summary-card.tsx# Group card
│   ├── alerts-list.tsx       # Alerts
│   ├── map-view.tsx          # Level 2
│   └── dependency-view.tsx   # Level 3
└── hooks/
    ├── useServiceMapData.ts  # Shared data
    ├── useRadialMapNodes.ts  # Level 2 nodes/edges
    ├── useServiceMapNodes.ts # Level 3 nodes/edges
    ├── useServiceMapLayout.ts# Level 3 layout
    └── useServiceMapInteractions.ts # Level 3 interactions

src/lib/layout/
├── view-group.ts            # 5-group mapping
├── radial-layout.ts         # Radial layout engine
└── zone-layout.ts           # Zone layout (Level 3)

src/lib/utils/
└── health-score.ts          # Health score calculator
```
