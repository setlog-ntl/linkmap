# 용어사전(Glossary) 시스템 가이드

`/glossary` — 바이브 코딩·개발 용어를 **비유·예시**로 찾아보는 사전형 시스템. 2층 퍼널의 "성장" 단계에서 가이드·블로그 독해 중 모르는 용어를 즉시 참조하게 해 초보자(코딩 경험 0 바이브코더) 진입장벽을 낮춘다.

> 모바일 토대 컨벤션은 `memory/mobile-foundation.md`를 따른다. 이 문서는 **용어사전 한정 규칙**과 **모바일 체크리스트**를 정리한다.

---

## 1. 구성 파일

| 역할 | 경로 |
|---|---|
| 데이터(단일 소스) | `src/data/seo/glossary-terms.ts` |
| 목록 페이지(서버) | `src/app/glossary/page.tsx` |
| 검색·필터 UI(클라이언트) | `src/components/glossary/glossary-browser.tsx` |
| 상세 페이지(SSG) | `src/app/glossary/[slug]/page.tsx` |
| 상세 렌더(서버) | `src/components/glossary/glossary-detail.tsx` |
| 레이아웃(Header/Footer) | `src/app/glossary/layout.tsx` |
| SEO JSON-LD | `src/lib/seo/json-ld.ts` (`generateGlossaryTermJsonLd` / `generateGlossaryJsonLd`) |
| 사이트맵 등록 | `src/app/sitemap.ts` |

---

## 2. 용어 추가/수정 방법

`GLOSSARY_ENTRIES`(배열)에 `GlossaryEntry` 형식으로 추가하면 **상세 페이지·검색·사이트맵이 자동 반영**된다(별도 라우트 추가 불필요).

```ts
{
  slug: 'unique-slug',          // URL: /glossary/unique-slug — 영문 약어 우선(oauth/api/jwt)
  term: '한글 용어',
  termEn: 'English Term',
  category: 'core',             // core|auth|security|infra|ai|frontend|backend|devops
  difficulty: 'beginner',       // beginner|intermediate|advanced
  emoji: '🔑',                  // 선택 — 없으면 카테고리 이모지
  oneLiner: '한 줄 핵심 정의(카드·검색·상세 리드)',
  analogy: { title: '일상 비유 제목', body: '초보자가 이미지로 떠올릴 비유' }, // ★ 핵심
  definition: '자세한 설명(선택, oneLiner보다 길게)',
  definitionEn: 'Short English definition',
  example: '실제 사용 예시',
  aliases: ['약어', 'alias', '오타'],   // 검색 보조
  related: ['other-slug'],              // 반드시 실재하는 slug
  sources: [{ label: '가이드: ...', href: '/guides/...' }], // 반드시 실재하는 가이드 경로
}
```

**규칙**
- `related`는 다른 entry의 `slug`를 정확히 참조. `sources.href`는 `src/data/ui/guide-data.ts`에 실재하는 경로만.
- "완전 고도화"(gold-standard) = `analogy` 작성. `비유` 뱃지가 자동 노출됨(`isEnrichedEntry`).
- 객관성: 특정 LLM/AI 도구(GPT/Claude/Gemini) 편향 금지 — 동등·중립 기술.
- 신규 카테고리 추가 시 `GlossaryCategory` union + `GLOSSARY_CATEGORIES` + `glossary-browser.tsx`의 `CATEGORY_ORDER` 3곳 동기화.

**무결성 자동 검증**(중복 slug·관련어·가이드 href): 임시 스크립트로 점검 가능
```bash
# 프로젝트 루트에서 tsx로 GLOSSARY_ENTRIES를 import해
# 1) 중복 slug 2) related slug 해소 3) sources.href ∈ guide-data 를 검사
```

---

## 3. 모바일 대응 (★ 향후 업데이트 시 필수 유지)

용어사전은 **데스크톱·모바일 동일 컴포넌트**로 반응형 처리한다. 컴포넌트를 수정할 때 아래를 깨뜨리지 말 것. (각 컴포넌트 상단 주석에도 요약돼 있음)

### 적용된 규칙
| 영역 | 규칙 | 위치 |
|---|---|---|
| 카드 그리드 | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` (모바일 1열) | `glossary-browser.tsx` `TermGrid` |
| 필터 칩 행 | 숨기지 말고 `scrollbar-none` + 페이드 마스크로 가로 스크롤 어포던스 노출 | `glossary-browser.tsx` |
| 터치 타깃 | 필터 칩·관련어 칩 = `min-h-[44px] sm:min-h-0`, 검색 X버튼 = `h-11 w-11` | browser/detail |
| 본문 폭/여백 | 상세 `max-w-3xl` + 레이아웃 `container px-4 sm:px-6` | `[slug]` layout |
| 예시(mono) | `break-words` 로 긴 토큰(URL·코드) 가로 오버플로우 방지 | `glossary-detail.tsx` |
| 헤더 배지 | `flex-wrap`, 제목 `text-2xl md:text-3xl` | `glossary-detail.tsx` |
| 반응형 줄바꿈 | `<br className="hidden sm:block" />` 앞에는 반드시 `{' '}` (모바일에서 br 숨김 시 단어 붙음 방지) | `page.tsx` hero |
| 가로 오버플로우 가드 | 전역 `body { overflow-x: clip }` (memory: mobile-foundation) | globals.css |

### 헤더 진입점(중요)
- 데스크톱: 상단 nav의 **가이드 드롭다운 옆**(`header.tsx` navLinks).
- 모바일: 햄버거 시트에서 **블로그 바로 다음 = 가이드 트리 위**에 배치. 가이드 트리(전체보기+기본개념 5단계+서비스 5개) **뒤에 두면 스크롤에 묻혀 "안 보임"** 신고가 발생하므로, 반드시 가이드 섹션 위(상위 항목)에 둘 것.

### 데이터 작성 시 모바일 주의
- `example`에 공백 없는 매우 긴 토큰을 넣어도 `break-words`로 래핑되지만, 가독성을 위해 가능하면 의미 단위로 공백을 둘 것.
- `oneLiner`·`analogy.body`는 길어도 됨(자동 래핑). 단, 카드의 `oneLiner`는 `line-clamp-3`로 잘리므로 핵심을 앞에 둘 것.

### 모바일 회귀 검증 (수정 후 권장)
Playwright MCP로 360~375px 뷰포트에서 확인 ([[guide-playwright-workflow]] 워크플로우):
1. `browser_resize(375, 812)` → `/glossary`, `/glossary/<slug>` 이동
2. `browser_evaluate`로 점검:
   - `document.documentElement.scrollWidth - clientWidth === 0` (가로 오버플로우 없음)
   - 필터 칩·관련어 칩 `getBoundingClientRect().height >= 44`
   - 히어로 부제에 `있도록 비유` (공백) 존재 / `있도록비유`(붙음) 없음

---

## 4. Workers 배포 주의
- 상세 라우트는 `generateStaticParams` + `revalidate = false`로 **완전 정적**(blog/services와 동일 패턴).
- **`dynamicParams = false` 사용 금지** — `@opennextjs/cloudflare`에서 프리렌더 라우트가 404를 반환하는 위험이 있음(2026-06-16 실제 발생, 제거로 해소). 잘못된 slug는 `notFound()`가 처리.
- 공개 페이지이므로 헤더 `Link`는 `prefetch={false}` 유지(Workers Free Plan 503 방지).
