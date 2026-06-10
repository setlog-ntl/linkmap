# 가이드 초보자 고도화 패턴

> 모든 가이드를 초보자(바이브코더) 친화적으로 만드는 표준 패턴과 공통 컴포넌트 사용법.
> 신규 가이드 추가·기존 가이드 개선 시 이 문서를 기준으로 작업한다.

## 공통 컴포넌트 키트 (`src/components/guides/common/`)

| 컴포넌트 | 용도 | 핵심 props |
|----------|------|-----------|
| `GuideTLDR` | 상단 30초 요약 박스 | `points: string[]`, `youCanDo?`, `level?`, `readingTime?` |
| `GuideCallout` | 통합 콜아웃 | `variant: 'tip'\|'warning'\|'info'\|'success'\|'analogy'\|'mistake'\|'note'`, `title?` |
| `AnalogyBox` | 비유로 이해하기 | `concept`, `analogy`, `children?` |
| `CommonMistakes` | 흔한 실수 & 해결 | `items: { mistake, fix, code? }[]`, `title?` |
| `FaqSection` | FAQ 아코디언 | `items: { q, a }[]`, `description?`, `footer?` |
| `GlossarySection` | 용어사전(비유 배지) | `items: { term, icon, metaphor?, description }[]`, `accent?` |

import 예: `import { GuideTLDR, AnalogyBox, CommonMistakes } from '@/components/guides/common';`

## 표준 고도화 템플릿

### 메인 가이드 (`*-guide.tsx`)
`<HeroSection />` **바로 아래**, sticky nav **앞**에 `GuideTLDR`을 단일 지점 삽입한다.

```tsx
<HeroSection />

<div className="max-w-2xl mx-auto mb-6 px-1">
  <GuideTLDR
    level="입문"            // 왕초보 | 입문 | 초급 | 중급
    readingTime="10분"
    points={[
      '핵심 1 — 한 문장으로, 비개발자도 이해되게',
      '핵심 2 — 가장 중요한 주의점',
      '핵심 3 — 실전에서 자주 쓰는 포인트',
    ]}
    youCanDo="이걸 배우면 무엇을 할 수 있는지 한 줄"
  />
</div>

{/* Sticky section nav */}
```

- 인라인 hero(서비스 가이드)는 hero `</section>` 다음, 위저드형은 hero `</ScrollReveal>`와 stepper 사이에 삽입.

### 본문 섹션 심화 (선택, 권장)
- **어려운 개념** → `AnalogyBox`로 실생활 비유 (예: API=레스토랑 주문, 환경변수=금고).
- **자주 틀리는 부분** → `CommonMistakes`로 ❌실수 → ✅해결 대비.
- **주의/팁** → `GuideCallout variant="warning|tip"`.

### 하단 마무리
- 어려운 용어가 많으면 `GlossarySection`(하단), 자주 묻는 질문은 `FaqSection`.
- 다음 단계 링크(관련 가이드)를 `bg-muted/50` 박스로 안내.

## 작성 원칙 (바이브코더 1순위)
- **쉬운 한국어**: 전문용어는 처음 등장 시 괄호로 풀이. "~예요/~해요" 친근한 어투.
- **비유 우선**: 추상 개념은 반드시 실생활 비유를 곁들인다.
- **실수 선제 안내**: "이렇게 하면 안 돼요"를 미리 알려 트러블슈팅 시간 단축.
- **객관성**: 모델/가격/버전은 공식 소스 + `lastUpdated` 표기. 자사·특정 LLM 우대 금지. (CLAUDE.md 콘텐츠 객관성)
- **i18n 동결**: 한글 직접 사용 (ko.json/en.json 수정 금지).

## 신규 가이드 추가 체크리스트
- [ ] 컴포넌트 작성 (`src/components/guides/...`) — TL;DR 포함, 공통 키트 활용
- [ ] page.tsx — `metadata` + `generateGuideJsonLd`(서브는 `parentSlug` + `faqs`)
- [ ] (서브 없는 최상위) layout.tsx — `GuideLayoutClient parentSlug=...`
- [ ] `src/data/ui/guide-meta.ts` — `GUIDE_LIST`/`SUB_GUIDE_LIST` + 필요 시 `LEARNING_STAGES`/`LEARNING_PATHS`
- [ ] `src/data/ui/guide-data.ts` — `GUIDE_DATA`/`SUB_GUIDE_DATA` (아이콘 없는 서버용)
- [ ] 공개 경로면 `scripts/warm-cache.sh`에 추가
- [ ] `<Link prefetch={false}>` 필수, `revalidate = false`
- [ ] `npm run typecheck && npm run lint` 통과
