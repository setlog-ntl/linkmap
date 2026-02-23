# Linkmap Design System — Circuit Blue-Green

> Single Source of Truth for design decisions.
> 모든 UI 변경은 이 문서와 일관성을 유지해야 합니다.

---

## 1. Brand Identity

### Design Philosophy

Linkmap은 **개발자와 1인 창업자**를 위한 설정 관리 플랫폼입니다.

**핵심 가치 3가지:**
- **신뢰 (Trust)**: 민감한 API 키와 환경변수를 다루는 만큼, 차분하고 안정적인 톤
- **명확 (Clarity)**: 복잡한 서비스 연결 관계를 직관적으로 표현
- **효율 (Efficiency)**: 불필요한 장식 없이, 정보 전달에 집중하는 유틸리티 우선 디자인

### Brand Personality

| 속성 | Linkmap 스타일 | 피해야 할 스타일 |
|------|---------------|----------------|
| 톤 | 전문적이면서 접근 가능 | 차갑고 사무적이기만 한 |
| 복잡도 | 기능적 미니멀리즘 | 과도한 장식, 과도한 단순화 |
| 색상 | Circuit Blue-Green + 청색 틴트 중성톤 | 무채색 회색, 화려한 그래디언트 남용 |
| 서피스 | 클린 서피스 + 청색 그림자 | 글래스모피즘 남용, 과도한 투명도 |
| 애니메이션 | 목적 있는 마이크로 인터랙션 | 주의를 분산시키는 장식적 모션 |

---

## 2. Color System — Circuit Blue-Green

### 2.1 Design Language

**Before (v1)**: neutral(무채색) 기반 shadcn 기본 테마
**After (v2 / 현재)**: Circuit Blue-Green — 딥 블루 Primary + 민트 그린 Accent + 청색 틴트 서피스

| 항목 | Before | After |
|------|--------|-------|
| Primary | `oklch(0.205 0 0)` 검정 | `oklch(0.42 0.12 255)` 딥 블루 |
| Background | 순수 무채색 | 청색 틴트 `oklch(0.97 0.005 250)` |
| Text | 순수 흑/백 | 청흑색 `oklch(0.20 0.03 250)` |
| Shadow | 검정 기반 | 청색 틴트 `oklch(0.20 0.03 250 / ...)` |
| Font | Geist Sans | Pretendard Variable |
| Dark BG | `oklch(0.145 0 0)` 무채 | `oklch(0.16 0.025 250)` Circuit 네이비 |
| Dark Card | 무채 회색 | Circuit 다크 블루 `oklch(0.20 0.025 250)` |
| 카드 질감 | 글래스모피즘 (backdrop-blur) | 클린 서피스 + 청색 그림자 |
| Radius | 10px | 12px |

### 2.2 Semantic Tokens (oklch 기반)

모든 시맨틱 색상은 `globals.css`의 CSS 변수로 정의됩니다. **Tailwind 토큰(`bg-background`, `text-foreground` 등)을 통해서만 참조**하세요.

#### Light Mode

| Token | oklch 값 | 용도 |
|-------|----------|------|
| `--background` | `oklch(0.97 0.005 250)` | 청회색 페이지 배경 |
| `--foreground` | `oklch(0.20 0.03 250)` | 청흑색 본문 텍스트 |
| `--card` | `oklch(1.0 0 0)` | 순백 카드 배경 |
| `--primary` | `oklch(0.42 0.12 255)` | 딥 블루 — 주요 버튼, CTA |
| `--primary-foreground` | `oklch(0.98 0 0)` | Primary 위 흰 텍스트 |
| `--secondary` | `oklch(0.96 0.005 250)` | 연한 청회 보조 배경 |
| `--muted` | `oklch(0.96 0.005 250)` | 비활성/보조 영역 |
| `--muted-foreground` | `oklch(0.55 0.02 250)` | 보조 텍스트 |
| `--accent` | `oklch(0.96 0.005 250)` | 호버 배경 (중성 유지) |
| `--destructive` | `oklch(0.577 0.245 27.325)` | 삭제/위험 액션 |
| `--border` | `oklch(0.92 0.005 250)` | 청회 테두리 |
| `--ring` | `oklch(0.42 0.12 255)` | 포커스 링 (primary와 동일) |

#### Dark Mode

| Token | oklch 값 | 변화 |
|-------|----------|------|
| `--background` | `oklch(0.16 0.025 250)` | Circuit 네이비 배경 |
| `--foreground` | `oklch(0.93 0.005 250)` | 밝은 청백 텍스트 |
| `--card` | `oklch(0.20 0.025 250)` | Circuit 다크 블루 카드 |
| `--primary` | `oklch(0.70 0.12 255)` | 밝은 블루 |
| `--primary-foreground` | `oklch(0.15 0.03 250)` | Primary 위 어두운 텍스트 |
| `--border` | `oklch(0.30 0.02 250)` | 청색 틴트 테두리 |
| `--muted-foreground` | `oklch(0.65 0.015 250)` | 밝은 보조 텍스트 |

### 2.3 Brand Tokens

브랜드 컬러는 `--brand-*` 토큰으로 별도 관리합니다. Tailwind에서 `brand-blue`, `brand-green` 등으로 사용합니다.

| Token | Light | Dark | 용도 |
|-------|-------|------|------|
| `--brand-blue` | `oklch(0.42 0.12 255)` | `oklch(0.70 0.12 255)` | 브랜드 딥 블루 |
| `--brand-green` | `oklch(0.80 0.19 160)` | `oklch(0.75 0.17 160)` | 브랜드 민트 그린 |
| `--brand-blue-light` | `oklch(0.95 0.02 255)` | `oklch(0.25 0.05 255)` | 블루 연한 배경 |
| `--brand-green-light` | `oklch(0.95 0.04 160)` | `oklch(0.25 0.05 160)` | 그린 연한 배경 |

#### Circuit 네이비 (Raw HEX)

| Token | HEX | 용도 |
|-------|-----|------|
| `--circuit-950` | `#0f1d2f` | Footer 배경, 최어두운 서피스 |
| `--circuit-900` | `#162436` | 다크 카드 대안 |
| `--circuit-800` | `#1e3048` | 다크 보조 서피스 |

### 2.4 Landing Page 전용 변수

랜딩 페이지 전용 표면 색상 (글로벌 시맨틱 토큰과 자동 동기화됨):

| Token | Light | Dark | 용도 |
|-------|-------|------|------|
| `--landing-card-bg` | `#ffffff` | `oklch(0.20 0.025 250)` | 랜딩 카드 배경 |
| `--landing-muted` | muted-foreground 동기 | muted-foreground 동기 | 랜딩 보조 텍스트 |
| `--landing-border` | border 동기 | border 동기 | 랜딩 테두리 |
| `--landing-surface` | `oklch(0.98 0.003 250)` | `oklch(0.14 0.025 250)` | 랜딩 섹션 배경 |
| `--dot-color` | border 동기 | `oklch(0.35 0.02 250)` | 배경 도트 패턴 |
| `--flow-label-bg` | muted 동기 | `oklch(0.22 0.025 250)` | 엣지 라벨 배경 |
| `--flow-edge-color` | `oklch(0.82 0.01 250)` | `oklch(0.45 0.02 250)` | 엣지 기본 색상 |

> 랜딩 컴포넌트는 가능한 시맨틱 토큰(`bg-card`, `text-muted-foreground`, `border-border`)을 우선 사용하세요.
> `brand-blue`, `brand-green` 등 브랜드 토큰은 랜딩 + 강조 요소에만 사용합니다.

### 2.5 Shadow System (청색 틴트)

`@theme inline`에서 Tailwind shadow 변수를 오버라이드합니다:

```css
--shadow-xs:  0 1px 2px 0 oklch(0.20 0.03 250 / 0.04);
--shadow-sm:  0 1px 2px 0 oklch(0.20 0.03 250 / 0.05);
--shadow:     0 1px 3px 0 oklch(0.20 0.03 250 / 0.08), ...;
--shadow-md:  0 4px 6px -1px oklch(0.20 0.03 250 / 0.08), ...;
--shadow-lg:  0 10px 15px -3px oklch(0.20 0.03 250 / 0.08), ...;
--shadow-xl:  0 20px 25px -5px oklch(0.20 0.03 250 / 0.10), ...;
```

기존 `shadow-sm`, `shadow-md` 등 Tailwind 클래스가 자동으로 청색 틴트를 적용합니다.

### 2.6 Chart Colors

| Token | Light | Dark |
|-------|-------|------|
| `--chart-1` | 블루 `oklch(0.42 0.12 255)` | 밝은 블루 |
| `--chart-2` | 그린 `oklch(0.80 0.19 160)` | 민트 그린 |
| `--chart-3` | 보라 `oklch(0.55 0.15 280)` | 밝은 보라 |
| `--chart-4` | 골드 `oklch(0.75 0.15 80)` | 연한 골드 |
| `--chart-5` | 오렌지 `oklch(0.65 0.20 25)` | 연한 오렌지 |

### 2.7 Category Color System

서비스 카테고리별 색상은 `src/lib/constants/category-styles.ts`에서 단일 관리합니다.

**28개 카테고리 x 4가지 스타일** (nodeClasses, gridBorderClasses, accentGradient, hexColor)

> 카테고리 색상 변경 시 반드시 `category-styles.ts` 한 곳에서만 수정하세요.

---

## 3. Typography

### Font Stack

```css
--font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', sans-serif;
--font-mono: var(--font-geist-mono);  /* Geist Mono (next/font/google) */
```

- **Pretendard Variable**: CDN (jsdelivr)으로 로드, 한국어 최적화 가변 폰트
- **Geist Mono**: 코드 블록 및 기술 정보 표시용, `--font-geist-mono` CSS 변수
- **Dynamic Subset**: `pretendardvariable-dynamic-subset.min.css` 사용으로 초기 로드 최소화

### Type Scale

| 용도 | 크기 | 기준 |
|------|------|------|
| 페이지 제목 (h1) | `text-3xl` ~ `text-4xl` | 랜딩 히어로 |
| 섹션 제목 (h2) | `text-2xl` ~ `text-3xl` | 랜딩 섹션, 대시보드 페이지 제목 |
| 카드 제목 (h3) | `text-lg` ~ `text-xl` | 카드 헤더, 모달 제목 |
| 본문 | `text-sm` (0.875rem) | 대시보드 기본 본문 |
| 보조 텍스트 | `text-xs` (0.75rem) | 캡션, 메타 정보, 뱃지 |
| AI 메시지 본문 | `0.8125rem` (커스텀) | `.ai-message-content` |

---

## 4. Spacing & Border Radius

### Radius Scale

기본값 `--radius: 0.75rem` (12px)을 기준으로 7단계 스케일:

| Token | 계산식 | 결과 | 용도 |
|-------|--------|------|------|
| `--radius-sm` | `--radius - 4px` | 8px | 작은 뱃지, 인라인 코드 |
| `--radius-md` | `--radius - 2px` | 10px | 입력 필드, 드롭다운 |
| `--radius-lg` | `--radius` | 12px | 카드, 다이얼로그 |
| `--radius-xl` | `--radius + 4px` | 16px | 큰 카드, 섹션 |
| `--radius-2xl` | `--radius + 8px` | 20px | 피쳐 카드 |
| `--radius-3xl` | `--radius + 12px` | 24px | 히어로 요소 |
| `--radius-4xl` | `--radius + 16px` | 28px | 풀 라운드 요소 |

---

## 5. Surface Design: Clean Surface

### v2에서의 변화

**Before**: 대시보드 카드에 `bg-card/80 backdrop-blur-md` 글래스모피즘 사용
**After**: `bg-card shadow-sm` 클린 서피스 — 청색 틴트 그림자로 깊이감 표현

### 규칙

- 대시보드 카드: `bg-card shadow-sm` (투명도/blur 없음)
- 헤더: `bg-background/95 backdrop-blur` 유지 (스크롤 시 반투명은 표준 UX)
- 상태 색상(emerald, red, amber): 의미적 색상이므로 변경 없음
- 오버레이: 모달/시트는 기존 shadcn 패턴 유지

---

## 6. Animation

### Custom Keyframes (11개)

| 이름 | 용도 | 컨텍스트 |
|------|------|---------|
| `pulse-ring` | 상태 표시 펄스 | 랜딩 히어로, 서비스맵 노드 |
| `float` | 부유 효과 | 랜딩 히어로 아이콘 |
| `dash-flow` | 연결선 흐름 | 랜딩 다이어그램 |
| `stagger-fade-in` | 순차 등장 | 리스트 아이템 |
| `gradient-x` | 그래디언트 이동 | 랜딩 CTA 배경 |
| `status-pulse` | 상태 점 깜빡임 | 서비스맵 상태 표시 |
| `edge-march` | 엣지 marching ants | 서비스맵 호버 |
| `flow-pulse` | 연결 흐름 펄스 | 대시보드 연결 표시 |
| `hub-glow` | 허브 글로우 | 대시보드 중앙 노드 |
| `ai-fade-in` / `ai-reveal` | AI 메시지 등장 | AI 채팅 |
| `edge-glow-pulse` | 엣지 글로우 | 서비스맵 선택된 엣지 |

### Glass Panel

```css
.glass-panel {
  background: oklch(0.18 0.025 250 / 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid oklch(0.30 0.02 250 / 0.3);
}
```
- Circuit 다크 블루 기반으로 업데이트됨
- 다크 모드 전용, 한 화면에 1~2개 이하로 제한

---

## 7. Dark Mode Rules

### 색상 대응

| 라이트 | 다크 | 특징 |
|--------|------|------|
| `bg-background` (청회색) | `bg-background` (네이비) | Circuit 네이비, 무채색 아님 |
| `bg-card` (순백) | `bg-card` (다크 블루) | 배경보다 한 단계 밝게 |
| `border-border` (청회) | `border-border` (짙은 청회) | 미묘한 구분선 |
| `text-primary` (딥 블루) | `text-primary` (밝은 블루) | 자동 밝기 전환 |

### 하드코딩 허용 예외

- **MacOS 크롬**: `#FF5F56`, `#FFBD2E`, `#27C93F` (시스템 색상)
- **카테고리 색상**: `category-styles.ts`에서 관리
- **AI 링크 색상**: `oklch(0.55 0.15 270)` / `oklch(0.7 0.15 270)`
- **상태 색상**: `bg-green-500`, `bg-red-500`, `bg-yellow-500` 등 의미적 색상
- **Google 브랜드 색상**: `#4285F4`, `#34A853`, `#FBBC05`, `#EA4335`
- **Footer 배경**: `var(--circuit-950)` — 항상 다크

---

## 8. Do / Don't

### DO

- Tailwind 시맨틱 토큰 사용: `bg-background`, `text-foreground`, `border-border`
- 브랜드 컬러는 `brand-blue`, `brand-green` 토큰 사용
- `globals.css` CSS 변수를 통한 색상 정의
- shadcn/ui 컴포넌트 재사용
- 청색 틴트 그림자 (`shadow-sm` ~ `shadow-xl` 자동 적용)
- `prefers-reduced-motion` 미디어 쿼리로 애니메이션 비활성화 대응

### DON'T

- ~~`bg-zinc-*`~~, ~~`bg-slate-*`~~ 직접 사용 (시맨틱 토큰으로 대체)
- ~~`backdrop-blur`~~ 남용 (헤더 + 모달만 허용)
- ~~`bg-white`~~, ~~`text-black`~~ 직접 사용 (`bg-card`, `text-foreground` 사용)
- 인라인 `style={{ color: '#xxx' }}` 사용 (CSS 변수 fallback으로 대체)
- ~~`hsl(220,60%,35%)`~~, ~~`#2bee79`~~ 등 hex/hsl 하드코딩 (brand 토큰 사용)
- 아이콘 라이브러리 혼용: lucide-react만 사용
- 토스트 라이브러리 혼용: sonner만 사용
- 카테고리 색상을 컴포넌트 파일에 직접 정의

---

## 9. Accessibility (WCAG AA)

### 대비율

| 요소 | 요구 대비율 | 현재 상태 |
|------|-----------|----------|
| Primary on white | 4.5:1 이상 | `oklch(0.42 0.12 255)` → ~7:1 (안전) |
| 본문 텍스트 | 4.5:1 이상 | `oklch(0.20 0.03 250)` → ~14:1 (안전) |
| 보조 텍스트 | 4.5:1 이상 | `oklch(0.55 0.02 250)` → ~5:1 (통과) |
| 포커스 링 | 3:1 이상 | ring = primary (안전) |

### 주요 규칙

- `outline-ring/50`으로 포커스 링 표시 (base layer에 설정됨)
- 색상만으로 정보를 전달하지 않기 (아이콘, 텍스트 라벨 병행)
- 인터랙티브 요소는 최소 44x44px 터치 타겟
- `prefers-reduced-motion: reduce` 시 모든 커스텀 애니메이션 비활성화 처리 완료

---

## Appendix: 마이그레이션 히스토리

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v1 | 2025-02 | shadcn neutral 기본 테마 |
| v2 | 2026-02-23 | Circuit Blue-Green 전면 개편 — 딥 블루 Primary, Pretendard 폰트, 클린 서피스, 청색 틴트 그림자 |
