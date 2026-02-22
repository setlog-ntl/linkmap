# 랜딩 페이지 다크모드 + 디자인 임팩트 개선 — 진행 상황

> **작성일**: 2026-02-22
> **목적**: 작업 중단 후 재개 시 컨텍스트 복원용

---

## 전체 계획 (3 Phase)

| Phase | 설명 | 상태 |
|-------|------|------|
| **Phase 1** | 다크모드 완전 지원 (10개 파일) | ✅ 완료 |
| **Phase 2** | 서비스 그리드 브랜드 색상 틴트 | ✅ 완료 |
| **Phase 3** | 시각적 임팩트 (글로우 + 타이프라이터) | ✅ 완료 |

---

## Phase 1: 다크모드 — ✅ 완료

### 변경된 파일 (10개)

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/globals.css` | `:root`/`.dark`에 랜딩 전용 CSS 변수 7개 추가, `edge-glow-pulse` 키프레임 추가 |
| `src/app/page.tsx` | 루트 컨테이너에 `dark:bg-[#0b1120] dark:text-[#e2e8f0]` 추가 |
| `src/components/landing/hero-section.tsx` | 배경, 도트 그리드(CSS 변수화), 배지, 헤드라인, 버튼, 시각화 카드, macOS 헤더, URL바, 다이어그램, 플로팅 배지 — 16곳 다크모드 적용. 인라인 `<style>` 제거 |
| `src/components/landing/social-proof-section.tsx` | 섹션 배경, 통계 아이콘/라벨, 후기 카드/텍스트 — 9곳 다크모드 적용 |
| `src/components/landing/features-bento.tsx` | `featureColors` 다크 변형, 5개 카드 컨테이너/제목/설명, SVG `fill`을 CSS 변수로 전환, EnvVarVisual 구문색상, ChecklistVisual, TemplateVisual, AI 서브아이템 — 20+곳 |
| `src/components/landing/how-it-works.tsx` | 섹션 배경, 연결선, 스텝 박스/제목/설명 — 6곳 |
| `src/components/landing/services-grid.tsx` | 섹션 배경, 제목, 필터 버튼, 서비스 카드, 서비스 이름 — 5곳 |
| `src/components/landing/cta-section.tsx` | PricingSection 전체 (배경, 카드, 텍스트, 버튼) — 11곳. FinalCtaSection은 이미 다크 배경이라 변경 없음 |
| `src/components/landing/flow-layer-node.tsx` | 노드 배경, 보더, 핸들, 라벨, 보조텍스트 — 7곳 |
| `src/components/landing/flow-service-node.tsx` | 노드 배경, 보더, 핸들, 라벨, env vars — 6곳 |

### 다크모드 색상 매핑 (globals.css에 반영됨)

| CSS 변수 | 라이트 값 | 다크 값 | 용도 |
|----------|-----------|---------|------|
| `--landing-card-bg` | `#ffffff` | `#111827` | 카드/노드 배경 |
| `--landing-muted` | `#63738a` | `#94a3b8` | 보조 텍스트 |
| `--landing-border` | `#dde0e7` | `rgba(255,255,255,0.1)` | 테두리 |
| `--landing-surface` | `#fafbfc` | `#0f172a` | 코드 블록/보조 배경 |
| `--dot-color` | `#dde0e7` | `#334155` | 도트 그리드 |
| `--flow-label-bg` | `#f4f5f8` | `#1e293b` | React Flow 라벨 배경 |
| `--flow-edge-color` | `#c8cdd6` | `#475569` | React Flow 엣지 |

### Tailwind dark: 클래스 매핑 (반복 사용)

| 라이트 | 다크 | 용도 |
|--------|------|------|
| `bg-[#f4f5f8]` | `dark:bg-[#0b1120]` | 페이지/섹션 배경(alt) |
| `bg-white` | `dark:bg-[#111827]` | 카드/섹션 배경 |
| `bg-[#fafbfc]` | `dark:bg-[#0f172a]` | 코드 블록/보조 배경 |
| `text-[#1a2740]` | `dark:text-[#e2e8f0]` | 주 텍스트 |
| `text-[#63738a]` | `dark:text-[#94a3b8]` | 보조 텍스트 |
| `border-[#dde0e7]` | `dark:border-white/10` | 테두리 |
| `bg-[#c8cdd6]` / handle | `dark:bg-[#475569]` | 핸들/엣지 |

---

## Phase 2: 서비스 그리드 브랜드 색상 틴트 — ✅ 완료

### 작업 내용
- `src/components/landing/services-grid.tsx` 수정
- `SERVICE_BRANDS` import (`src/lib/constants/service-brands.ts`)
- `useTheme` (next-themes) 훅으로 현재 테마 감지
- 각 서비스 카드에 인라인 `style={{ backgroundColor }}` 적용
  - 라이트: `${brand.color}08` (3% 투명도)
  - 다크: `${brand.darkColor}15` (8% 투명도)
- hydration mismatch 방지: `mounted` 상태 체크 필요

### 참조 파일
- `src/lib/constants/service-brands.ts` — `SERVICE_BRANDS` 맵, `color`/`darkColor` 필드 존재
- `src/data/seed/services.ts` — `services` 배열 (slug 기준으로 매칭)

---

## Phase 3: 시각적 임팩트 & 차별화 — ✅ 완료

### 3-1. React Flow 엣지 글로우 펄스 효과
- `src/components/landing/flow-architecture-diagram.tsx` 수정
- 하이라이트된 엣지의 `style`에 `filter: drop-shadow(0 0 6px ...) drop-shadow(0 0 12px ...)` 추가
- `globals.css`에 `@keyframes edge-glow-pulse` 이미 추가됨 ✅
- 다크모드에서 글로우가 더 선명

### 3-2. 타이프라이터 헤드라인 (새 파일 생성 필요)
- **새 컴포넌트**: `src/components/landing/typewriter-headline.tsx`
- Framer Motion `AnimatePresence` + `mode="wait"`으로 텍스트 순환 (3.5초 간격)
- 4개 핵심 가치 순환: 시각화/보안관리/즉시배포/팀운영
- `prefers-reduced-motion` 시 첫 번째 문구 고정
- `hero-section.tsx`에서 기존 `heroHeadlineHighlight` 대신 `<TypewriterHeadline />` 삽입

### 3-3. i18n 키 추가
- `src/lib/i18n/locales/ko.json`의 `landing` 블록에 추가:
```json
"heroPrefix": "서비스 인프라를",
"heroRotate1": "시각화하세요",
"heroRotate2": "안전하게 관리하세요",
"heroRotate3": "즉시 배포하세요",
"heroRotate4": "팀과 공유하세요"
```
- `src/lib/i18n/locales/en.json`의 `landing` 블록에 추가:
```json
"heroPrefix": "Your Infrastructure,",
"heroRotate1": "Visualized",
"heroRotate2": "Secured",
"heroRotate3": "Deployed Instantly",
"heroRotate4": "Shared with Team"
```

---

## 검증 체크리스트
- [x] `npm run typecheck` — 타입 에러 없음 ✅
- [ ] 브라우저 라이트/다크 모드 토글 → 7개 섹션 확인
- [ ] 서비스 그리드 브랜드 틴트 색상 확인 (Phase 2)
- [ ] 히어로 타이프라이터 문구 순환 확인 (Phase 3)
- [ ] React Flow 엣지 글로우 확인 (Phase 3)
- [ ] 모바일 뷰포트(375px) 레이아웃 확인

---

## 재개 시 명령

```
Phase 1은 이미 완료됨. Phase 2 (서비스 그리드 브랜드 색상 틴트)와 Phase 3 (글로우 효과 + 타이프라이터 헤드라인)을 구현하고 typecheck로 검증해줘. 상세 계획은 docs/landing-darkmode-progress.md 참조.
```
