# 08. 모듈형 템플릿 에디터 고도화 기획

> **문서 코드**: ONELINK-MOD
> **상위 문서**: [PMO.md](./PMO.md) | [07-enhancement-plan.md](./07-enhancement-plan.md)
> **작성일**: 2026-02-20
> **상태**: Phase 1~4 구현 완료
> **대상 템플릿**: Personal Brand (나만의 홈페이지) — 1차 파일럿

---

## 1. 개요

### 1.1 문제 정의

현재 사이트 에디터는 **코드 직접 편집** 방식:
- 사용자가 `.tsx`, `.ts` 파일을 직접 수정해야 함
- 초보 사용자에게 코드 수정은 높은 진입 장벽
- 템플릿 섹션 간 관계(page.tsx → 개별 컴포넌트 → config.ts)를 이해해야 수정 가능
- AI 채팅으로 우회 가능하지만, 구조적 편집 UX 부재

### 1.2 목표

```
사용자가 코드를 몰라도 템플릿의 각 섹션을
모듈 단위로 선택·편집·재배치할 수 있는 비주얼 에디터
```

**핵심 원칙:**
1. **모듈 = 섹션**: 템플릿의 각 섹션(Hero, About, Values 등)이 하나의 독립 모듈
2. **하단 모듈 패널 → 상단 코드 반영**: 모듈 설정 변경 → 실제 파일 코드 자동 생성
3. **점진적 공개**: 초보자는 폼만, 고급 사용자는 코드 직접 편집도 가능
4. **템플릿별 확장**: Personal Brand 파일럿 → 전체 템플릿 확대

### 1.3 용어 정의

| 용어 | 설명 |
|------|------|
| **모듈 (Module)** | 템플릿의 독립적 섹션 단위 (예: HeroSection, AboutSection) |
| **모듈 스키마 (Module Schema)** | 모듈의 설정 가능한 속성 정의 (JSON Schema 기반) |
| **모듈 패널 (Module Panel)** | 에디터 하단의 모듈 선택/설정 UI |
| **코드 제너레이터 (Code Generator)** | 모듈 설정 → 실제 코드 변환 엔진 |
| **모듈 프리셋 (Module Preset)** | 모듈의 사전 정의된 설정 조합 (예: "미니멀", "컬러풀") |

---

## 2. Personal Brand 템플릿 모듈 분석

### 2.1 현재 파일 구조

```
personal-brand/
├── src/app/page.tsx              ← 메인 페이지 (모듈 조합)
├── src/lib/config.ts             ← 전체 설정 (env var 기반)
├── src/lib/i18n.tsx              ← 다국어 번역 키
├── src/components/
│   ├── hero-section.tsx          ← 모듈 1: 히어로
│   ├── about-section.tsx         ← 모듈 2: 소개
│   ├── values-section.tsx        ← 모듈 3: 가치관
│   ├── highlights-section.tsx    ← 모듈 4: 하이라이트
│   ├── gallery-section.tsx       ← 모듈 5: 갤러리
│   ├── contact-section.tsx       ← 모듈 6: 연락처
│   ├── nav-header.tsx            ← 레이아웃: 상단 내비게이션
│   ├── footer.tsx                ← 레이아웃: 푸터
│   ├── theme-toggle.tsx          ← 유틸: 다크모드 토글
│   └── language-toggle.tsx       ← 유틸: 언어 토글
└── src/app/layout.tsx            ← 루트 레이아웃
```

### 2.2 모듈 정의 (6개 콘텐츠 모듈 + 2개 레이아웃 모듈)

#### 모듈 1: Hero (히어로)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `name` | string | 이름 | "이지원" |
| `nameEn` | string | 영문 이름 | "Jiwon Lee" |
| `tagline` | string | 한줄 소개 | "콘텐츠로 세상을 연결하는 크리에이터" |
| `taglineEn` | string | 영문 소개 | "Creator who connects..." |
| `heroImageUrl` | string? | 배경 이미지 URL | null (그래디언트 폴백) |
| `ctaText` | string | CTA 버튼 텍스트 | "더 알아보기" |
| `ctaTarget` | string | CTA 스크롤 타겟 | "#about" |
| `gradientFrom` | color | 그래디언트 시작색 | "#ee5b2b" |
| `gradientTo` | color | 그래디언트 끝색 | "#f59e0b" |
| `parallaxEnabled` | boolean | 패럴렉스 효과 | true |

**영향 파일**: `hero-section.tsx`, `config.ts`, `i18n.tsx`

#### 모듈 2: About (소개)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `story` | text | 자기소개 (한국어) | "안녕하세요..." |
| `storyEn` | text | 자기소개 (영문) | "Hi, I'm..." |
| `showBilingualToggle` | boolean | 이중언어 토글 표시 | true |

**영향 파일**: `about-section.tsx`, `config.ts`

#### 모듈 3: Values (가치관)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `items` | ValueItem[] | 가치관 목록 (최대 6개) | 3개 기본값 |
| `columns` | 2\|3 | 컬럼 수 | 3 |

```typescript
interface ValueItem {
  emoji: string;       // 이모지 아이콘
  title: string;       // 제목 (한국어)
  titleEn?: string;    // 제목 (영문)
  desc: string;        // 설명 (한국어)
  descEn?: string;     // 설명 (영문)
}
```

**영향 파일**: `values-section.tsx`, `config.ts`

#### 모듈 4: Highlights (하이라이트/숫자 통계)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `items` | HighlightItem[] | 통계 목록 (최대 4개) | 3개 기본값 |

```typescript
interface HighlightItem {
  value: string;       // 숫자값 (예: "10K+")
  valueEn?: string;
  label: string;       // 레이블 (예: "구독자")
  labelEn?: string;
}
```

**영향 파일**: `highlights-section.tsx`, `config.ts`

#### 모듈 5: Gallery (갤러리)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `images` | string[] | 이미지 URL 목록 | [] (빈 배열 = 섹션 숨김) |
| `columns` | 2\|3\|4 | 컬럼 수 | 3 |
| `aspectRatio` | "square"\|"landscape"\|"portrait" | 이미지 비율 | "landscape" |

**영향 파일**: `gallery-section.tsx`, `config.ts`

#### 모듈 6: Contact (연락처)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `email` | string | 이메일 주소 | "hello@jiwonlee.kr" |
| `socials` | SocialItem[] | 소셜 링크 목록 | YouTube, Instagram |
| `ctaText` | string | CTA 텍스트 | "함께 일해요" |

```typescript
interface SocialItem {
  platform: string;    // "youtube" | "instagram" | "twitter" | "github" | "linkedin" | "tiktok"
  url: string;
}
```

**영향 파일**: `contact-section.tsx`, `config.ts`

#### 레이아웃 모듈 A: NavHeader (내비게이션)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `style` | "fixed"\|"static" | 상단 고정 여부 | "fixed" |
| `showLanguageToggle` | boolean | 언어 토글 표시 | true |
| `logo` | string? | 로고 이미지 URL | null (이름 텍스트) |

**영향 파일**: `nav-header.tsx`

#### 레이아웃 모듈 B: Footer (푸터)
| 속성 | 타입 | 설명 | 기본값 |
|------|------|------|--------|
| `showPoweredBy` | boolean | Linkmap 배지 표시 | true |
| `showThemeToggle` | boolean | 다크모드 토글 표시 | true |
| `customText` | string? | 커스텀 푸터 텍스트 | null |

**영향 파일**: `footer.tsx`

---

## 3. 아키텍처 설계

### 3.1 전체 흐름

```
┌─────────────────────────────────────────────────────────────┐
│                    사이트 에디터 (Site Editor)                 │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              상단: 코드 에디터 + 미리보기              │     │
│  │                                                       │     │
│  │  ┌──────────────────┐  ┌────────────────────────┐   │     │
│  │  │   파일 트리        │  │   코드/미리보기          │   │     │
│  │  │   ─────────       │  │   (현재와 동일)          │   │     │
│  │  │   📁 src/         │  │                          │   │     │
│  │  │     📁 components/│  │   코드가 모듈 설정에     │   │     │
│  │  │     📁 lib/       │  │   따라 자동 업데이트됨    │   │     │
│  │  │     📁 app/       │  │                          │   │     │
│  │  └──────────────────┘  └────────────────────────┘   │     │
│  └─────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐     │
│  │              하단: 모듈 패널 (Module Panel)            │     │
│  │                                                       │     │
│  │  [📐 모듈 편집] [🎨 스타일] [⚙️ 설정]                 │     │
│  │                                                       │     │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐       │     │
│  │  │✅ Hero │ │✅About │ │✅Values│ │☐Gallery│       │     │
│  │  │  ────  │ │  ────  │ │  ────  │ │  ────  │       │     │
│  │  │패럴렉스│ │소개글  │ │3컬럼   │ │비활성화│       │     │
│  │  │배경+CTA│ │바이오  │ │이모지  │ │        │       │     │
│  │  └────────┘ └────────┘ └────────┘ └────────┘       │     │
│  │                                                       │     │
│  │  ┌──── 선택된 모듈: Hero 편집 ────────────────────┐  │     │
│  │  │                                                 │  │     │
│  │  │  이름:     [이지원              ]               │  │     │
│  │  │  영문 이름: [Jiwon Lee           ]               │  │     │
│  │  │  한줄 소개: [콘텐츠로 세상을...    ]               │  │     │
│  │  │  배경 이미지: [URL 입력 또는 업로드]               │  │     │
│  │  │  그래디언트: [🟠#ee5b2b] → [🟡#f59e0b]          │  │     │
│  │  │  패럴렉스: [✅ 사용]                              │  │     │
│  │  │                                                 │  │     │
│  │  │           [미리보기 업데이트]  [코드 적용]        │  │     │
│  │  └─────────────────────────────────────────────┘  │     │
│  └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 데이터 흐름

```
사용자가 모듈 폼에서 값 변경
        │
        ▼
┌─────────────────────┐
│  ModuleConfigStore   │  ← Zustand 또는 React state
│  (클라이언트 상태)     │
│                       │
│  {                    │
│    hero: { name: ... }│
│    about: { story: ..}│
│    enabled: [hero,    │
│      about, values,   │
│      contact]         │
│    order: [0,1,2,5]   │
│  }                    │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  Code Generator      │  ← 순수 함수 (클라이언트 사이드)
│                       │
│  generateConfig(      │  → config.ts 코드 문자열
│    moduleConfig)      │
│  generatePage(        │  → page.tsx 코드 문자열
│    enabledModules,    │
│    order)             │
│  generateComponent(   │  → 개별 컴포넌트 코드
│    moduleId, config)  │
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  코드 에디터에 반영    │  ← 에디터 상단에 생성된 코드 표시
│  + 라이브 미리보기     │
└─────────┬───────────┘
          │ [적용 버튼 클릭]
          ▼
┌─────────────────────┐
│  Batch Update API    │  ← POST /api/.../batch-update
│  (GitHub 원자적 커밋)  │
│                       │
│  변경된 파일들:        │
│  - src/lib/config.ts  │
│  - src/app/page.tsx   │
│  - src/components/*.tsx│ (구조 변경 시)
└─────────────────────┘
```

### 3.3 모듈 스키마 정의 구조

```typescript
// src/lib/module-schema.ts (새 파일)

export interface ModuleFieldDef {
  key: string;
  type: 'text' | 'textarea' | 'color' | 'number' | 'boolean' | 'select' | 'url' | 'array';
  label: string;
  labelEn?: string;
  placeholder?: string;
  defaultValue: unknown;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  // array 타입 전용
  itemSchema?: ModuleFieldDef[];
  maxItems?: number;
  // select 타입 전용
  options?: Array<{ value: string; label: string }>;
}

export interface ModuleDef {
  id: string;                     // "hero" | "about" | "values" 등
  name: string;                   // "히어로"
  nameEn?: string;                // "Hero"
  icon: string;                   // Lucide 아이콘 이름
  description: string;            // "메인 배경과 이름, 한줄 소개"
  descriptionEn?: string;
  category: 'content' | 'layout'; // 콘텐츠 vs 레이아웃 모듈
  required: boolean;              // true = 비활성화 불가 (Hero, Footer)
  defaultEnabled: boolean;
  fields: ModuleFieldDef[];
  affectedFiles: string[];        // 변경 시 영향받는 파일 경로
}

export interface TemplateModuleSchema {
  templateSlug: string;
  modules: ModuleDef[];
  defaultOrder: string[];         // 모듈 ID 순서
}
```

### 3.4 Personal Brand 모듈 스키마 (구체적 예시)

```typescript
// src/data/oneclick/module-schemas/personal-brand.ts (새 파일)

export const personalBrandSchema: TemplateModuleSchema = {
  templateSlug: 'personal-brand',
  modules: [
    {
      id: 'hero',
      name: '히어로',
      nameEn: 'Hero',
      icon: 'Sparkles',
      description: '메인 배경과 이름, 한줄 소개를 표시합니다',
      category: 'content',
      required: true,
      defaultEnabled: true,
      fields: [
        { key: 'name', type: 'text', label: '이름', defaultValue: '이지원', validation: { required: true, maxLength: 50 } },
        { key: 'nameEn', type: 'text', label: '영문 이름', defaultValue: 'Jiwon Lee' },
        { key: 'tagline', type: 'text', label: '한줄 소개', defaultValue: '콘텐츠로 세상을 연결하는 크리에이터', validation: { required: true, maxLength: 100 } },
        { key: 'taglineEn', type: 'text', label: '영문 한줄 소개', defaultValue: 'Creator who connects the world through content' },
        { key: 'heroImageUrl', type: 'url', label: '배경 이미지 URL', defaultValue: null, placeholder: 'https://example.com/hero.jpg' },
        { key: 'gradientFrom', type: 'color', label: '그래디언트 시작색', defaultValue: '#ee5b2b' },
        { key: 'gradientTo', type: 'color', label: '그래디언트 끝색', defaultValue: '#f59e0b' },
        { key: 'parallaxEnabled', type: 'boolean', label: '패럴렉스 효과', defaultValue: true },
      ],
      affectedFiles: ['src/components/hero-section.tsx', 'src/lib/config.ts'],
    },
    {
      id: 'about',
      name: '소개',
      nameEn: 'About',
      icon: 'User',
      description: '자기소개 글을 표시합니다',
      category: 'content',
      required: false,
      defaultEnabled: true,
      fields: [
        { key: 'story', type: 'textarea', label: '자기소개 (한국어)', defaultValue: '안녕하세요...', validation: { required: true, maxLength: 2000 } },
        { key: 'storyEn', type: 'textarea', label: '자기소개 (영문)', defaultValue: "Hi, I'm..." },
      ],
      affectedFiles: ['src/components/about-section.tsx', 'src/lib/config.ts'],
    },
    {
      id: 'values',
      name: '가치관',
      nameEn: 'Values',
      icon: 'Heart',
      description: '핵심 가치관을 이모지와 함께 카드로 표시합니다',
      category: 'content',
      required: false,
      defaultEnabled: true,
      fields: [
        {
          key: 'items', type: 'array', label: '가치관 목록', defaultValue: [],
          maxItems: 6,
          itemSchema: [
            { key: 'emoji', type: 'text', label: '이모지', defaultValue: '🎯', validation: { maxLength: 2 } },
            { key: 'title', type: 'text', label: '제목', defaultValue: '', validation: { required: true } },
            { key: 'titleEn', type: 'text', label: '영문 제목', defaultValue: '' },
            { key: 'desc', type: 'text', label: '설명', defaultValue: '', validation: { required: true } },
            { key: 'descEn', type: 'text', label: '영문 설명', defaultValue: '' },
          ],
        },
        {
          key: 'columns', type: 'select', label: '컬럼 수', defaultValue: '3',
          options: [{ value: '2', label: '2열' }, { value: '3', label: '3열' }],
        },
      ],
      affectedFiles: ['src/components/values-section.tsx', 'src/lib/config.ts'],
    },
    {
      id: 'highlights',
      name: '하이라이트',
      nameEn: 'Highlights',
      icon: 'TrendingUp',
      description: '숫자로 된 핵심 성과/통계를 표시합니다',
      category: 'content',
      required: false,
      defaultEnabled: true,
      fields: [
        {
          key: 'items', type: 'array', label: '통계 목록', defaultValue: [],
          maxItems: 4,
          itemSchema: [
            { key: 'value', type: 'text', label: '숫자값', defaultValue: '10K+', validation: { required: true } },
            { key: 'valueEn', type: 'text', label: '영문 숫자값', defaultValue: '' },
            { key: 'label', type: 'text', label: '레이블', defaultValue: '', validation: { required: true } },
            { key: 'labelEn', type: 'text', label: '영문 레이블', defaultValue: '' },
          ],
        },
      ],
      affectedFiles: ['src/components/highlights-section.tsx', 'src/lib/config.ts'],
    },
    {
      id: 'gallery',
      name: '갤러리',
      nameEn: 'Gallery',
      icon: 'Image',
      description: '이미지 갤러리를 그리드로 표시합니다',
      category: 'content',
      required: false,
      defaultEnabled: false,
      fields: [
        { key: 'images', type: 'array', label: '이미지 URL 목록', defaultValue: [], maxItems: 12,
          itemSchema: [
            { key: 'url', type: 'url', label: '이미지 URL', defaultValue: '', validation: { required: true } },
            { key: 'alt', type: 'text', label: '대체 텍스트', defaultValue: '' },
          ],
        },
        {
          key: 'columns', type: 'select', label: '컬럼 수', defaultValue: '3',
          options: [{ value: '2', label: '2열' }, { value: '3', label: '3열' }, { value: '4', label: '4열' }],
        },
      ],
      affectedFiles: ['src/components/gallery-section.tsx', 'config.ts'],
    },
    {
      id: 'contact',
      name: '연락처',
      nameEn: 'Contact',
      icon: 'Mail',
      description: '이메일 CTA와 소셜 미디어 링크를 표시합니다',
      category: 'content',
      required: false,
      defaultEnabled: true,
      fields: [
        { key: 'email', type: 'text', label: '이메일', defaultValue: 'hello@example.com', validation: { required: true } },
        { key: 'ctaText', type: 'text', label: 'CTA 버튼 텍스트', defaultValue: '함께 일해요' },
        {
          key: 'socials', type: 'array', label: '소셜 미디어', defaultValue: [], maxItems: 8,
          itemSchema: [
            {
              key: 'platform', type: 'select', label: '플랫폼', defaultValue: 'instagram',
              options: [
                { value: 'youtube', label: 'YouTube' },
                { value: 'instagram', label: 'Instagram' },
                { value: 'twitter', label: 'X (Twitter)' },
                { value: 'github', label: 'GitHub' },
                { value: 'linkedin', label: 'LinkedIn' },
                { value: 'tiktok', label: 'TikTok' },
              ],
            },
            { key: 'url', type: 'url', label: 'URL', defaultValue: '', validation: { required: true } },
          ],
        },
      ],
      affectedFiles: ['src/components/contact-section.tsx', 'src/lib/config.ts'],
    },
  ],
  defaultOrder: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
};
```

---

## 4. 코드 제너레이터 설계

### 4.1 핵심: config.ts 생성기

모듈 설정 → `src/lib/config.ts` 파일 코드를 생성하는 순수 함수.

**전략**: 현재 config.ts는 `NEXT_PUBLIC_*` 환경변수 기반이지만, 모듈 에디터는 **값을 직접 하드코딩**하여 코드에 반영. 환경변수 폴백은 유지.

```typescript
// 생성 예시 (사용자가 Hero 모듈에서 이름을 "김철수"로 변경한 경우)

// src/lib/config.ts (생성됨)
const p = (key: string) => process.env[key] ?? '';

export const siteConfig = {
  name: p('NEXT_PUBLIC_SITE_NAME') || '김철수',       // ← 사용자 입력
  nameEn: p('NEXT_PUBLIC_SITE_NAME_EN') || 'Cheolsu Kim',
  tagline: p('NEXT_PUBLIC_TAGLINE') || '풀스택 개발자',
  // ...
};
```

**핵심 원칙**: env var 우선 → 하드코딩 폴백. 사용자가 나중에 env var로 오버라이드 가능.

### 4.2 page.tsx 생성기

활성화된 모듈 + 순서에 따라 `src/app/page.tsx`를 재생성.

```typescript
// generatePage(enabledModules: string[], order: string[]) → string

// 예시: Gallery를 비활성화하고 Values/Highlights 순서를 바꾼 경우
/*
생성되는 page.tsx:

import { HeroSection } from '@/components/hero-section';
import { AboutSection } from '@/components/about-section';
import { HighlightsSection } from '@/components/highlights-section';  // 순서 변경
import { ValuesSection } from '@/components/values-section';          // 순서 변경
// GallerySection import 제거됨
import { ContactSection } from '@/components/contact-section';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <HighlightsSection />    // 순서 변경
      <ValuesSection />        // 순서 변경
      // GallerySection 제거됨
      <ContactSection />
    </main>
  );
}
*/
```

### 4.3 개별 컴포넌트 생성기 (Phase 2)

> Phase 1에서는 `config.ts`와 `page.tsx`만 생성.
> Phase 2에서 컴포넌트 코드 자체 변경 (그래디언트 색상, 컬럼 수 등)도 지원.

컴포넌트 코드 내 특정 값을 치환하는 방식:

```typescript
// 그래디언트 색상 변경 예시
// hero-section.tsx 내:
//   from-[#ee5b2b] → from-[${config.gradientFrom}]
//   to-[#f59e0b]   → to-[${config.gradientTo}]

function generateHeroSection(config: HeroModuleConfig): string {
  return baseHeroCode
    .replace(/from-\[#[a-fA-F0-9]{6}\]/g, `from-[${config.gradientFrom}]`)
    .replace(/to-\[#[a-fA-F0-9]{6}\]/g, `to-[${config.gradientTo}]`);
}
```

---

## 5. UI/UX 설계

### 5.1 에디터 레이아웃 변경

현재: `코드 에디터 + 미리보기` (2분할)
변경: `코드 에디터 + 미리보기` (상단) + `모듈 패널` (하단, 토글)

```
┌──────────────────────────────────────────────────┐
│  [파일] [모듈 ▼]  [미리보기]        [저장] [배포] │  ← 탭 전환
├──────────────────────────────────────────────────┤
│                                                    │
│          코드 에디터 또는 미리보기                  │
│          (현재와 동일)                              │
│                                                    │
├──────────────────────────────────────────────────┤
│  ▲ 모듈 패널 (접기/펴기)                           │
│                                                    │
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌────┐│
│  │ ✅  │ │ ✅  │ │ ✅  │ │ ✅  │ │ ☐  │ │ ✅ ││
│  │Hero │ │About│ │Value│ │High │ │Gall │ │Cont││
│  └──┬──┘ └─────┘ └─────┘ └─────┘ └─────┘ └────┘│
│     │ 선택됨                                       │
│  ┌──▼────────────────────────────────────────────┐│
│  │ 히어로 섹션 편집                                ││
│  │                                                ││
│  │ 이름         [이지원                ]           ││
│  │ 영문 이름    [Jiwon Lee             ]           ││
│  │ 한줄 소개    [콘텐츠로 세상을...      ]           ││
│  │ 그래디언트   [🎨 #ee5b2b] → [🎨 #f59e0b]      ││
│  │                                                ││
│  │              [코드에 적용]                       ││
│  └────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
```

### 5.2 모듈 카드 UI

각 모듈은 카드로 표현:

```
┌────────────────┐
│  ✅ [드래그핸들]│  ← 체크박스 = 활성화/비활성화
│                 │
│   ✨ 히어로     │  ← 아이콘 + 이름
│                 │
│  패럴렉스 배경   │  ← 간략 설명
│  이름 + 소개    │
│                 │
│  [편집]         │  ← 클릭 → 설정 폼 열기
└────────────────┘
```

**드래그 앤 드롭**: 모듈 순서 변경 (DnD Kit 또는 기본 HTML DnD)

### 5.3 모듈 편집 폼

선택된 모듈의 설정을 폼으로 표시:

- `text` → Input 컴포넌트
- `textarea` → Textarea 컴포넌트
- `color` → ColorPicker (shadcn Popover + 색상 팔레트)
- `boolean` → Switch 컴포넌트
- `select` → Select 컴포넌트
- `url` → Input + URL 유효성 표시
- `array` → 반복 가능한 폼 그룹 + 추가/삭제/순서 변경

### 5.4 모바일 UX

모바일에서는 모듈 패널이 바텀시트로 동작:

```
[코드] [미리보기] [모듈]   ← 3탭
                   ↑
              활성화 시 전체 화면 모듈 편집
```

### 5.5 "코드에 적용" 플로우

```
1. 사용자가 모듈 폼에서 값 변경
2. [코드에 적용] 클릭
3. Code Generator가 변경된 파일들 생성
4. 에디터 상단에서 변경된 코드 diff 하이라이트 (선택)
5. 미리보기 자동 갱신
6. 사용자가 [저장] 클릭 → Batch Update API로 GitHub 커밋
7. GitHub Actions → GitHub Pages 자동 배포
```

---

## 6. 구현 단계 (스프린트 계획)

### Phase 1: 기본 모듈 에디터 (Sprint 8-A)

**범위**: Personal Brand 템플릿의 `config.ts` 폼 편집

| 작업 | 상세 | 복잡도 |
|------|------|--------|
| 모듈 스키마 정의 | `ModuleDef`, `ModuleFieldDef` 타입 + Personal Brand 스키마 | 중간 |
| 모듈 패널 UI | 모듈 카드 리스트 + 활성화 토글 | 중간 |
| 설정 폼 렌더러 | 스키마 기반 동적 폼 생성 (`renderField()`) | 높음 |
| config.ts 생성기 | 모듈 설정 → config.ts 코드 문자열 생성 | 중간 |
| page.tsx 생성기 | 활성 모듈 + 순서 → page.tsx 코드 생성 | 낮음 |
| 에디터 통합 | 사이트 에디터에 모듈 패널 탭 추가 | 중간 |
| Batch 적용 | 생성된 파일들을 Batch Update API로 커밋 | 낮음 (기존 API 활용) |

**산출물:**
- `src/lib/module-schema.ts` — 스키마 타입 정의
- `src/data/oneclick/module-schemas/personal-brand.ts` — Personal Brand 스키마
- `src/lib/oneclick/code-generator.ts` — config.ts + page.tsx 생성기
- `src/components/my-sites/module-panel.tsx` — 모듈 패널 컴포넌트
- `src/components/my-sites/module-form.tsx` — 동적 폼 렌더러
- `site-editor-client.tsx` 수정 — 모듈 패널 통합

### Phase 2: 컴포넌트 수준 편집 (Sprint 8-B)

**범위**: 개별 컴포넌트 파일 코드 변경 (색상, 컬럼, 애니메이션 등)

| 작업 | 상세 | 복잡도 |
|------|------|--------|
| 컴포넌트 생성기 | 각 섹션 컴포넌트의 템플릿 리터럴 기반 코드 생성 | 높음 |
| 색상 피커 통합 | Tailwind 클래스 내 색상 코드 치환 | 중간 |
| 컬럼/레이아웃 옵션 | 그리드 클래스 치환 (`grid-cols-2` ↔ `grid-cols-3`) | 낮음 |
| 미리보기 실시간 반영 | 생성된 코드로 iframe 즉시 업데이트 | 높음 |

### Phase 3: 드래그 앤 드롭 + 프리셋 (Sprint 9+)

| 작업 | 상세 | 복잡도 |
|------|------|--------|
| 모듈 순서 DnD | 모듈 카드 드래그로 섹션 순서 변경 | 중간 |
| 모듈 프리셋 | "미니멀", "컬러풀", "프로페셔널" 등 사전 설정 조합 | 낮음 |
| 다른 템플릿 확장 | Link-in-Bio, Dev Showcase 등 스키마 추가 | 중간×N |
| 커스텀 CSS 모듈 | 사용자 정의 CSS 섹션 추가 | 높음 |

### Phase 4: 고급 기능 (Sprint 10+)

| 작업 | 상세 | 복잡도 |
|------|------|--------|
| 이미지 업로드 | GitHub 레포에 이미지 직접 업로드 (Base64 → blob) | 높음 |
| 폰트 선택기 | Google Fonts 통합 + 코드 자동 반영 | 중간 |
| 애니메이션 설정 | Framer Motion 파라미터 폼 | 높음 |
| 반응형 미리보기 | 모듈 편집 → 실시간 모바일/데스크톱 미리보기 | 높음 |
| AI 모듈 설정 | "전문적인 느낌으로" → AI가 모듈 설정 자동 구성 | 중간 |

---

## 7. 다른 템플릿 확장 계획

### 7.1 템플릿별 모듈 매핑

| 템플릿 | 모듈 | 비고 |
|--------|------|------|
| **Personal Brand** (파일럿) | Hero, About, Values, Highlights, Gallery, Contact | 6개 콘텐츠 + 2 레이아웃 |
| **Link-in-Bio Pro** | Profile, LinkList, SocialBar, YouTubeEmbed, Footer | 5개, 테마 전환 특화 |
| **Digital Namecard** | ProfileCard, ContactInfo, SocialLinks, QRCode, SaveButton | 5개, 연락처 특화 |
| **Dev Showcase** | Hero, About, Skills, GitHubGraph, Projects, Experience, Blog, Contact | 8개, 개발자 특화 |
| **Freelancer Page** | Hero, Services, Portfolio, Testimonials, Pricing, Contact | 6개, 비즈니스 특화 |
| **Small Biz** | Hero, Features, About, Team, Pricing, FAQ, Contact | 7개, 사업체 특화 |

### 7.2 공통 모듈 라이브러리 (장기)

템플릿 간 공유 가능한 모듈:

| 공통 모듈 | 사용 템플릿 | 비고 |
|-----------|------------|------|
| HeroModule | 전체 | 이미지/그래디언트/비디오 배경 변형 |
| ContactModule | 전체 | 이메일 + 소셜 링크 |
| FooterModule | 전체 | Linkmap 배지 + 커스텀 텍스트 |
| NavHeaderModule | 전체 | 고정/스태틱 + 언어/테마 토글 |
| FAQModule | Small Biz, SaaS | 아코디언 FAQ |
| PricingModule | Freelancer, SaaS | 가격표 카드 |
| TestimonialsModule | Freelancer, Small Biz | 후기 슬라이더 |

---

## 8. 기술적 고려사항

### 8.1 코드 생성 vs 데이터 기반 렌더링

| 방식 | 장점 | 단점 | 결정 |
|------|------|------|------|
| **코드 생성** (채택) | 사용자가 코드를 소유, 배포 후 독립 실행 | 생성기 유지보수, 코드 복잡도 | ✅ 채택 |
| 데이터 기반 렌더링 | 구현 간단, 실시간 미리보기 | Linkmap 의존성, 코드 소유권 없음 | ❌ 기각 |

**이유**: Linkmap의 핵심 가치는 "코드 소유권". 사용자의 GitHub 레포에 실제 코드가 있어야 함.

### 8.2 미리보기 전략

| 방식 | 설명 | 적합도 |
|------|------|--------|
| GitHub Pages 라이브 URL | 배포 후 실제 사이트 표시 | 현재 사용 중, 배포 후에만 가능 |
| iframe srcdoc | HTML/CSS 직접 주입 | 현재 사용 중, TSX 불가 |
| **Sandpack/WebContainer** | 브라우저 내 빌드+렌더링 | ⚠️ Phase 2+ 검토 (무거움) |
| **SSR 프록시** | 서버에서 빌드 → HTML 반환 | ⚠️ Phase 3+ 검토 (서버 비용) |
| **config.ts만 수정** (Phase 1) | 저장 → 배포 → 라이브 URL 갱신 | ✅ Phase 1 MVP |

**Phase 1 결정**: 폼 수정 → 코드 생성 → 저장(GitHub 커밋) → 자동 배포 → 30초 후 라이브 미리보기 갱신.

### 8.3 보안

- 모듈 폼 입력도 Zod 검증 적용 (XSS 방지)
- 생성된 코드에서 `<script>`, `eval()`, `dangerouslySetInnerHTML` 주입 차단
- config.ts 내 값은 문자열 이스케이프 처리 (백틱, 따옴표)
- 이미지 URL은 허용된 프로토콜(`https://`)만 허용

### 8.4 성능

- 모듈 스키마는 클라이언트 번들에 포함 (정적 JSON, <5KB gzipped)
- 코드 생성은 클라이언트 사이드 순수 함수 (서버 호출 불필요)
- Batch Update API는 기존 인프라 재사용 (추가 API 불필요)

---

## 9. 성공 지표 (KPI)

| 지표 | 목표 | 측정 방법 |
|------|------|----------|
| 모듈 편집 사용률 | 배포 후 50%+ 사용자가 모듈 편집 1회+ | 감사 로그 기반 |
| 편집 → 배포 전환률 | 모듈 편집 사용자의 80%+ 가 실제 배포 | batch-update API 호출 수 |
| 초보자 이탈률 감소 | 코드 에디터 대비 이탈률 30% 감소 | 세션 시간 + 완료율 |
| 평균 편집 시간 | 5분 이내 기본 커스터마이징 완료 | 첫 폼 입력 → 저장까지 시간 |

---

## 10. 변경 추적

| 날짜 | 변경 | 비고 |
|------|------|------|
| 2026-02-20 | 초기 기획 문서 작성 | Personal Brand 파일럿 기준 |
| 2026-02-20 | **Phase 1 구현 완료** | 스키마 타입, PB 모듈 스키마, 코드 제너레이터, 모듈 패널/폼, 에디터 통합, i18n |

---

## 부록 A: Personal Brand config.ts 현재 구조

```typescript
// 현재 config.ts에서 모듈 에디터가 관리할 영역

export const siteConfig = {
  // Hero 모듈
  name: '이지원',
  nameEn: 'Jiwon Lee',
  tagline: '콘텐츠로 세상을 연결하는 크리에이터',
  taglineEn: 'Creator who connects the world through content',
  heroImageUrl: null,

  // About 모듈
  story: '안녕하세요...',
  storyEn: "Hi, I'm...",

  // Values 모듈
  values: [
    { emoji: '🎯', title: '목표 지향', desc: '...' },
    { emoji: '🤝', title: '협업', desc: '...' },
    { emoji: '🚀', title: '성장', desc: '...' },
  ],

  // Highlights 모듈
  highlights: [
    { value: '10K+', label: '구독자' },
    { value: '500+', label: '콘텐츠' },
    { value: '50+', label: '협업 브랜드' },
  ],

  // Gallery 모듈
  galleryImages: [],

  // Contact 모듈
  email: 'hello@jiwonlee.kr',
  socials: [
    { platform: 'youtube', url: 'https://youtube.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ],
};
```

## 부록 B: 생성될 파일 목록 (Phase 1 적용 시)

모듈 편집 → "코드에 적용" 시 변경되는 파일:

| 파일 | 변경 내용 | 조건 |
|------|----------|------|
| `src/lib/config.ts` | 모든 모듈 설정값 반영 | 항상 |
| `src/app/page.tsx` | 활성 모듈 import/렌더링 순서 | 모듈 토글 또는 순서 변경 시 |

Phase 2 추가:

| 파일 | 변경 내용 | 조건 |
|------|----------|------|
| `src/components/hero-section.tsx` | 그래디언트 색상, 패럴렉스 설정 | Hero 스타일 변경 시 |
| `src/components/values-section.tsx` | 컬럼 수 변경 | Values 레이아웃 변경 시 |
| `src/components/gallery-section.tsx` | 컬럼 수, 비율 변경 | Gallery 레이아웃 변경 시 |
| `src/app/globals.css` | 커스텀 색상 변수 | 글로벌 테마 변경 시 |

---

## 부록 C: Phase 1 구현 결과 (완료)

### 구현된 파일 목록

| 파일 | 역할 | 상태 |
|------|------|------|
| `src/lib/module-schema.ts` | 스키마 타입 정의 (ModuleDef, ModuleFieldDef, TemplateModuleSchema, ModuleConfigState) | ✅ 완료 |
| `src/data/oneclick/module-schemas/index.ts` | 스키마 조회 함수 (getModuleSchema) | ✅ 완료 |
| `src/data/oneclick/module-schemas/personal-brand.ts` | PB 6개 콘텐츠 모듈 스키마 | ✅ 완료 |
| `src/lib/oneclick/code-generator.ts` | config.ts/page.tsx 생성, 기존 코드 파싱 | ✅ 완료 |
| `src/components/my-sites/module-form.tsx` | 스키마 기반 동적 폼 렌더러 (7가지 필드 타입) | ✅ 완료 |
| `src/components/my-sites/module-panel.tsx` | 모듈 카드 리스트 + 토글 + 순서 변경 + 폼 | ✅ 완료 |
| `src/components/my-sites/site-editor-client.tsx` | 모듈 패널 통합 (파싱→폼→코드 생성→batch commit) | ✅ 수정 |
| `src/lib/i18n/locales/ko.json` | modulePanel 키 4개 | ✅ 수정 |
| `src/lib/i18n/locales/en.json` | modulePanel 키 4개 | ✅ 수정 |

### 현재 동작 흐름

```
1. 사이트 에디터 진입 → deploy.homepage_templates.slug로 모듈 스키마 조회
2. 스키마 있으면 (personal-brand) → 하단에 모듈 패널 표시
3. 기존 config.ts 내용을 파싱하여 폼 초기값 설정
4. 사용자가 폼에서 값 수정
5. [코드에 적용] 클릭 → generateConfigTs() + generatePageTsx() 실행
6. Batch Update API → GitHub 원자적 커밋
7. 자동 배포 → 30초 후 라이브 미리보기 갱신
```

---

## 부록 C-2: Phase 2 구현 결과 (완료)

### 추가/수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/data/oneclick/module-schemas/personal-brand.ts` | Hero에 gradientFrom/gradientTo/parallaxEnabled 필드, Gallery에 columns 필드 추가, affectedFiles 확장 |
| `src/lib/oneclick/code-generator.ts` | `generateHeroSection`, `generateValuesSection`, `generateGallerySection`, `generateGlobalsCss` 함수 추가. `generateFiles` 시그니처 확장 (`currentFiles?` 파라미터) |
| `src/components/my-sites/site-editor-client.tsx` | `generateFiles(moduleState)` → `generateFiles(moduleState, fileCache)` |

### 동작 방식

```
1. 사용자가 Hero 모듈에서 그래디언트 색상 변경
2. [코드에 적용] 클릭
3. generateFiles(state, fileCache) 호출
4. gradientFrom이 기본값(#ee5b2b)과 다르면:
   - hero-section.tsx의 from-[#hex], to-[#hex] 패턴 교체
   - globals.css의 --color-primary 교체
5. Gallery columns가 기본값(3)과 다르면:
   - gallery-section.tsx의 lg:grid-cols-N 교체
6. Batch Update → GitHub 커밋 → 배포
```

---

## 부록 C-3: Phase 3 구현 결과 (완료)

### 추가/수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/my-sites/module-panel.tsx` | DnD Kit 통합 (SortableModuleCard 컴포넌트), 프리셋 선택 UI 추가 |
| `src/data/oneclick/module-presets/personal-brand.ts` | 3개 프리셋 (minimal, creator, full) |
| `src/data/oneclick/module-presets/index.ts` | `getModulePresets(slug)` 함수 |
| `src/data/oneclick/module-schemas/dev-showcase.ts` | 개발자 포트폴리오 6개 모듈 스키마 |
| `src/data/oneclick/module-schemas/link-in-bio-pro.ts` | Link in Bio 4개 모듈 스키마 |
| `src/data/oneclick/module-schemas/index.ts` | 3개 템플릿 등록 |
| `package.json` | @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities 추가 |

### 지원 템플릿 현황 (2026-02-22 기준)

| 템플릿 | 모듈 수 | 프리셋 | 상태 |
|--------|---------|--------|------|
| personal-brand | 6개 | 3개 (미니멀/크리에이터/풀) | ✅ 완료 |
| dev-showcase | 6개 | ✅ | ✅ 완료 |
| link-in-bio-pro | 4개 | ✅ | ✅ 완료 |
| digital-namecard | 4개+ | ✅ | ✅ 완료 |
| freelancer-page | 6개+ | ✅ | ✅ 완료 |
| small-biz | 7개+ | ✅ | ✅ 완료 |

---

## 부록 C-4: Phase 4 구현 결과 (완료)

### 추가/수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/api/oneclick/deployments/[id]/upload/route.ts` | 이미지 업로드 API (base64 → GitHub blob → commit) |
| `src/app/api/ai/module-suggest/route.ts` | AI 모듈 설정 추천 API (OpenAI Structured Output) |
| `src/components/my-sites/module-form.tsx` | `ImageUrlField` 컴포넌트 (리사이즈 + 업로드), `deployId` prop |
| `src/components/my-sites/module-panel.tsx` | AI 추천 입력 UI, `deployId` prop 전달 |
| `src/components/my-sites/site-editor-client.tsx` | `deployId` → ModulePanel 전달 |
| `src/data/oneclick/module-schemas/personal-brand.ts` | `fontFamily` select 필드 (8개 폰트) |
| `src/lib/oneclick/code-generator.ts` | `generateLayoutTsx()` 함수, layout.tsx 폰트 생성 |
| `src/lib/audit.ts` | `oneclick.image_upload`, `ai.module_suggest` 액션 |

### 이미지 업로드 흐름

```
1. 사용자가 URL 필드 옆 Upload 버튼 클릭
2. 파일 선택 (max 5MB)
3. 클라이언트에서 max 1200px 리사이즈 → WebP 변환
4. base64 → POST /api/oneclick/deployments/[id]/upload
5. GitHub Git Data API: blob(base64) → tree → commit → ref update
6. 반환된 경로를 URL 필드에 자동 입력
```

### AI 모듈 추천 흐름

```
1. 사용자가 "전문적인 느낌으로 설정해줘" 입력
2. POST /api/ai/module-suggest (templateSlug + currentEnabled + moduleNames)
3. OpenAI gpt-4o Structured Output → { enabled, order, values, reasoning }
4. 반환된 state를 onStateChange로 적용
5. reasoning을 toast로 표시
```

---

## 부록 D: Phase 2~4 단계별 구현 가이드

### Phase 2: 컴포넌트 수준 편집

> **목표**: 개별 컴포넌트 파일의 스타일/레이아웃 값 변경
> **선행**: Phase 1 완료 ✅
> **예상 작업량**: 중간~높음

#### Step 2-1: 모듈 스키마에 스타일 필드 추가

**파일**: `src/data/oneclick/module-schemas/personal-brand.ts`

Hero 모듈에 추가할 필드:
```typescript
{ key: 'gradientFrom', type: 'color', label: '그래디언트 시작색', defaultValue: '#ee5b2b' },
{ key: 'gradientTo', type: 'color', label: '그래디언트 끝색', defaultValue: '#f59e0b' },
{ key: 'parallaxEnabled', type: 'boolean', label: '패럴렉스 효과', defaultValue: true },
```

Values 모듈에 추가할 필드:
```typescript
{ key: 'columns', type: 'select', label: '컬럼 수', defaultValue: '3',
  options: [{ value: '2', label: '2열' }, { value: '3', label: '3열' }] },
```

Gallery 모듈에 추가할 필드:
```typescript
{ key: 'columns', type: 'select', label: '컬럼 수', defaultValue: '3',
  options: [{ value: '2', label: '2열' }, { value: '3', label: '3열' }, { value: '4', label: '4열' }] },
```

#### Step 2-2: 컴포넌트 코드 생성기 추가

**파일**: `src/lib/oneclick/code-generator.ts`에 함수 추가

```typescript
// 필요한 새 함수:
export function generateHeroSection(state: ModuleConfigState, baseCode: string): string
export function generateValuesSection(state: ModuleConfigState, baseCode: string): string
export function generateGallerySection(state: ModuleConfigState, baseCode: string): string
```

**구현 방식**: 정규식 기반 값 치환
- `from-[#ee5b2b]` → `from-[${gradientFrom}]`
- `to-[#f59e0b]` → `to-[${gradientTo}]`
- `grid-cols-3` → `grid-cols-${columns}`

#### Step 2-3: generateFiles() 확장

**파일**: `src/lib/oneclick/code-generator.ts`

```typescript
export function generateFiles(state: ModuleConfigState, currentFiles?: Record<string, string>): GeneratedFile[] {
  const files = [
    { path: 'src/lib/config.ts', content: generateConfigTs(state) },
    { path: 'src/app/page.tsx', content: generatePageTsx(state) },
  ];

  // Phase 2: 컴포넌트 파일 변경이 필요한 경우
  if (currentFiles) {
    const heroBase = currentFiles['src/components/hero-section.tsx'];
    if (heroBase && state.values.hero.gradientFrom) {
      files.push({
        path: 'src/components/hero-section.tsx',
        content: generateHeroSection(state, heroBase),
      });
    }
    // ... values, gallery 동일
  }

  return files;
}
```

#### Step 2-4: 에디터에서 기존 컴포넌트 코드 전달

**파일**: `src/components/my-sites/site-editor-client.tsx`

`handleApplyModules`에서 `fileCache`를 `generateFiles()`에 전달하도록 수정.

#### Step 2-5: globals.css 테마 색상 생성기

`src/app/globals.css`의 `--color-primary` CSS 변수를 사용자 선택 색상으로 변경:
```css
@theme {
  --color-primary: ${gradientFrom};
}
```

---

### Phase 3: 드래그 앤 드롭 + 프리셋

> **목표**: 모듈 순서를 드래그로 변경, 사전 설정 조합 제공
> **선행**: Phase 2 완료
> **예상 작업량**: 중간

#### Step 3-1: DnD Kit 설치 및 통합

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**파일**: `src/components/my-sites/module-panel.tsx`

모듈 카드 리스트를 `SortableContext`로 래핑:
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
```

기존 `ChevronUp/ChevronDown` 버튼은 DnD 비활성화 환경(모바일 등)에서 폴백으로 유지.

#### Step 3-2: 모듈 프리셋 시스템

**새 파일**: `src/data/oneclick/module-presets/personal-brand.ts`

```typescript
export interface ModulePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  thumbnail?: string;
  state: Partial<ModuleConfigState>;
}

export const personalBrandPresets: ModulePreset[] = [
  {
    id: 'minimal',
    name: '미니멀',
    nameEn: 'Minimal',
    description: 'Hero + Contact만 활성화한 깔끔한 레이아웃',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'full',
    name: '풀 프로필',
    nameEn: 'Full Profile',
    description: '모든 모듈 활성화',
    state: {
      enabled: ['hero', 'about', 'values', 'highlights', 'gallery', 'contact'],
    },
  },
  {
    id: 'creator',
    name: '크리에이터',
    nameEn: 'Creator',
    description: '히어로 + 소개 + 하이라이트 + 갤러리 + 연락처',
    state: {
      enabled: ['hero', 'about', 'highlights', 'gallery', 'contact'],
      order: ['hero', 'about', 'highlights', 'gallery', 'contact'],
    },
  },
];
```

**UI**: 모듈 패널 상단에 프리셋 드롭다운 추가. 선택 시 `onStateChange(mergePreset(currentState, preset.state))`.

#### Step 3-3: 다른 템플릿 스키마 확장

각 템플릿별 모듈 스키마 파일 추가:
- `src/data/oneclick/module-schemas/link-in-bio-pro.ts`
- `src/data/oneclick/module-schemas/dev-showcase.ts`
- `src/data/oneclick/module-schemas/index.ts` 에 등록

각 스키마는 해당 템플릿의 섹션을 분석하여 모듈 정의.
코드 제너레이터도 템플릿별로 분기 필요 → `generateConfigTs` 함수를 팩토리 패턴으로 리팩토링.

---

### Phase 4: 고급 기능

> **목표**: 이미지 업로드, 폰트 선택, AI 자동 설정
> **선행**: Phase 3 완료
> **예상 작업량**: 높음

#### Step 4-1: 이미지 업로드

**새 API**: `POST /api/oneclick/deployments/[id]/upload`

```typescript
// 이미지를 GitHub 레포의 public/ 디렉토리에 업로드
// 1. Base64 → GitHub blob API로 업로드
// 2. Git tree에 추가
// 3. 커밋
// 4. 반환: 이미지 경로 (/public/images/uploaded-xxx.jpg)
```

**UI**: 모듈 폼의 `url` 필드에 "업로드" 버튼 추가.
파일 선택 → 리사이즈(max 1200px) → API 호출 → URL 자동 입력.

#### Step 4-2: 폰트 선택기

**새 컴포넌트**: `src/components/my-sites/font-picker.tsx`

Google Fonts API에서 인기 폰트 목록 → Select UI.
선택 시:
1. `layout.tsx`의 `<link>` 태그에 폰트 CDN 추가
2. `globals.css`의 `--font-sans` 변수 변경

#### Step 4-3: AI 모듈 설정

기존 ChatTerminal 확장:
- "전문적인 느낌으로 설정해줘" → AI가 ModuleConfigState 생성
- 생성된 상태를 `onStateChange()`로 적용
- `/api/oneclick/ai-chat`에 모듈 스키마 컨텍스트 전달

#### Step 4-4: 반응형 실시간 미리보기 (Sandpack 검토)

> **리스크 높음** — 번들 사이즈 1MB+, 빌드 시간 5초+

검토 후 채택 여부 결정. 대안: 배포 후 라이브 URL 갱신으로 충분할 수 있음.

---

## 부록 E: Phase별 체크리스트

### Phase 1 ✅ 완료
- [x] `src/lib/module-schema.ts` — 타입 정의
- [x] `src/data/oneclick/module-schemas/personal-brand.ts` — PB 스키마
- [x] `src/data/oneclick/module-schemas/index.ts` — 스키마 조회
- [x] `src/lib/oneclick/code-generator.ts` — config.ts + page.tsx 생성
- [x] `src/components/my-sites/module-form.tsx` — 동적 폼 렌더러
- [x] `src/components/my-sites/module-panel.tsx` — 모듈 패널 UI
- [x] `site-editor-client.tsx` 통합 — 모듈 패널 + 코드 적용
- [x] i18n 키 추가 (ko/en 4개)
- [x] 타입체크 통과
- [x] 95개 테스트 통과
- [x] 빌드 성공
- [x] 커밋 + 푸시 완료

### Phase 2 ✅ 완료
- [x] Hero: gradientFrom/gradientTo/parallaxEnabled 스키마 추가
- [x] Gallery: columns 스키마 추가 (2/3/4열)
- [x] `generateHeroSection()` 함수 구현 (Tailwind from/to + linear-gradient + opacity 패턴)
- [x] `generateValuesSection()` 함수 구현 (md:grid-cols-N)
- [x] `generateGallerySection()` 함수 구현 (lg:grid-cols-N)
- [x] `generateGlobalsCss()` 함수 구현 (--color-primary)
- [x] `generateFiles()` 확장 — currentFiles 파라미터, 조건부 컴포넌트 생성
- [x] `handleApplyModules` 수정 — fileCache 전달
- [x] 타입체크 통과 (Phase 2 관련 에러 0개)
- [x] 102개 테스트 통과
- [x] 커밋 `6b71e7f` + 푸시 완료

### Phase 3 ✅ 완료
- [x] `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` 설치
- [x] module-panel.tsx에 DnD 적용 (GripVertical 핸들 + SortableContext)
- [x] 프리셋 시스템 구현 (미니멀/크리에이터/풀 프로필 3개)
- [x] 프리셋 UI (상단 태그 버튼, 호버 시 설명 툴팁)
- [x] link-in-bio-pro 모듈 스키마 (4개 모듈: profile/links/socials/theme)
- [x] dev-showcase 모듈 스키마 (6개 모듈: hero/about/projects/experience/blog/contact)
- [x] 3개 템플릿 스키마 index.ts에 등록
- [x] 95개 테스트 통과
- [x] 커밋 `369ad26` + `d76cedf` + 푸시 완료

### Phase 4 ✅ 완료
- [x] 이미지 업로드 API (`POST /api/oneclick/deployments/[id]/upload`)
- [x] 이미지 업로드 UI (클라이언트 리사이즈 max 1200px → WebP → base64 업로드)
- [x] 폰트 선택기 (Hero 모듈 select 필드, 8개 한/영 폰트)
- [x] 폰트 → layout.tsx Google Fonts CDN + font-family 코드 생성
- [x] AI 모듈 설정 (`POST /api/ai/module-suggest`, OpenAI Structured Output)
- [x] AI 추천 입력 UI (모듈 패널 내 텍스트 입력 + Wand2 버튼)
- [x] 감사 로그: `oneclick.image_upload`, `ai.module_suggest` 추가
- [x] 102개 테스트 통과
- [x] 커밋 `335cf76` + 푸시 완료
- [ ] Sandpack 실시간 미리보기 — 향후 검토 (번들 사이즈 1MB+ 리스크)
