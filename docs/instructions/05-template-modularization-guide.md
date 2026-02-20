# 05 — 템플릿 모듈화 가이드

> **목적**: 기존 또는 새로운 원클릭 배포 템플릿에 모듈형 에디터를 적용하기 위한 단계별 가이드.
> 이 문서를 따라가면 어떤 템플릿이든 모듈 스키마 → 코드 생성기 → 프리셋 → UI 통합까지 완성할 수 있다.

---

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────┐
│                    Site Editor UI                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ ModulePanel   │  │ ModuleForm   │  │ Preview (iframe) │  │
│  │ (DnD 정렬)   │  │ (필드 렌더링) │  │                  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                  │                                │
│         ▼                  ▼                                │
│  ┌──────────────────────────────┐                          │
│  │     ModuleConfigState        │ ← Zustand 상태           │
│  │  { values, enabled, order }  │                          │
│  └──────────────┬───────────────┘                          │
│                 │                                           │
│                 ▼                                           │
│  ┌──────────────────────────────┐                          │
│  │       Code Generator         │ ← 순수 함수              │
│  │  state → GeneratedFile[]     │                          │
│  └──────────────┬───────────────┘                          │
│                 │                                           │
│                 ▼                                           │
│  ┌──────────────────────────────┐                          │
│  │    Batch Update API          │ → GitHub Git Data API     │
│  │  POST /api/oneclick/.../     │                          │
│  └──────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘

┌── 데이터 레이어 ──────────────────────────────────────────┐
│                                                           │
│  src/lib/module-schema.ts      ← 타입 정의               │
│  src/data/oneclick/             │
│    module-schemas/              │
│      index.ts                  ← 스키마 레지스트리         │
│      personal-brand.ts         ← 템플릿별 스키마          │
│      dev-showcase.ts           │
│      link-in-bio-pro.ts        │
│    module-presets/              │
│      index.ts                  ← 프리셋 레지스트리         │
│      personal-brand.ts         ← 템플릿별 프리셋          │
│                                                           │
│  src/lib/oneclick/code-generator.ts  ← 코드 생성 로직     │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### 핵심 흐름

1. **스키마 정의** → 템플릿의 모듈 구성과 각 모듈의 필드를 선언적으로 정의
2. **UI 렌더링** → `ModulePanel`이 스키마를 읽어 토글/순서/폼을 자동 생성
3. **상태 관리** → `ModuleConfigState` (values + enabled + order)로 사용자 편집 추적
4. **코드 생성** → 순수 함수가 상태 → TypeScript/TSX/CSS 코드 문자열 변환
5. **배포** → Batch Update API로 GitHub에 원자적 커밋

---

## 2. 타입 정의 레퍼런스

> 소스: `src/lib/module-schema.ts`

### ModuleFieldDef — 폼 필드 하나

```typescript
interface ModuleFieldDef {
  key: string;                          // 필드 고유 키 (camelCase)
  type: 'text' | 'textarea' | 'color'  // 폼 입력 타입
      | 'number' | 'boolean' | 'select'
      | 'url' | 'array';
  label: string;                        // 한국어 레이블
  labelEn?: string;                     // 영문 레이블
  placeholder?: string;
  defaultValue: unknown;                // 기본값 (타입에 맞게)
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;    // number 타입 전용
    max?: number;
  };
  itemSchema?: ModuleFieldDef[];        // array 타입 전용 — 배열 요소 필드
  maxItems?: number;                    // array 타입 전용 — 최대 항목 수
  options?: Array<{                     // select 타입 전용
    value: string;
    label: string;
  }>;
}
```

### ModuleDef — 모듈 하나

```typescript
interface ModuleDef {
  id: string;                           // 모듈 고유 ID (kebab-case 또는 camelCase)
  name: string;                         // 한국어 이름
  nameEn?: string;                      // 영문 이름
  icon: string;                         // lucide-react 아이콘 이름
  description: string;                  // 한국어 설명
  descriptionEn?: string;
  category: 'content' | 'layout';       // 모듈 카테고리
  required: boolean;                    // true면 비활성화 불가
  defaultEnabled: boolean;              // 초기 활성화 여부
  fields: ModuleFieldDef[];             // 모듈의 설정 필드 목록
  affectedFiles: string[];              // 변경 시 영향받는 파일 경로
}
```

### TemplateModuleSchema — 템플릿 전체 스키마

```typescript
interface TemplateModuleSchema {
  templateSlug: string;                 // 템플릿 slug (DB와 일치)
  modules: ModuleDef[];                 // 모듈 정의 배열
  defaultOrder: string[];               // 모듈 ID의 기본 표시 순서
}
```

### ModuleConfigState — 런타임 상태

```typescript
interface ModuleConfigState {
  values: Record<string, Record<string, unknown>>;  // 모듈ID → {필드key: 값}
  enabled: string[];                                // 활성 모듈 ID 목록
  order: string[];                                  // 표시 순서
}
```

### ModulePreset — 프리셋

```typescript
interface ModulePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  state: Partial<ModuleConfigState>;    // enabled + order (values는 보통 생략)
}
```

---

## 3. 새 템플릿 모듈화 — 단계별 가이드

### Step 1: 모듈 스키마 파일 생성

파일 위치: `src/data/oneclick/module-schemas/{template-slug}.ts`

```typescript
import type { TemplateModuleSchema } from '@/lib/module-schema';

export const myTemplateModuleSchema: TemplateModuleSchema = {
  templateSlug: 'my-template',  // ← DB의 homepage_templates.slug와 일치
  modules: [
    {
      id: 'hero',               // 모듈 ID (모듈 내 고유)
      name: '히어로',
      nameEn: 'Hero',
      icon: 'Sparkles',         // lucide-react 아이콘
      description: '메인 배너 영역',
      descriptionEn: 'Main banner section',
      category: 'content',
      required: true,           // 필수 모듈은 비활성화 불가
      defaultEnabled: true,
      fields: [
        // ... 필드 정의 (아래 필드 타입별 가이드 참조)
      ],
      affectedFiles: ['src/lib/config.ts'],  // 이 모듈이 변경하는 파일들
    },
    // ... 추가 모듈
  ],
  defaultOrder: ['hero', /* ... */],  // 기본 표시 순서
};
```

### Step 2: 스키마 레지스트리에 등록

파일: `src/data/oneclick/module-schemas/index.ts`

```typescript
import { myTemplateModuleSchema } from './my-template';

const schemaMap: Record<string, TemplateModuleSchema> = {
  'personal-brand': personalBrandModuleSchema,
  'dev-showcase': devShowcaseModuleSchema,
  'link-in-bio-pro': linkInBioProModuleSchema,
  'my-template': myTemplateModuleSchema,  // ← 추가
};
```

### Step 3: 프리셋 파일 생성 (선택)

파일 위치: `src/data/oneclick/module-presets/{template-slug}.ts`

```typescript
import type { ModuleConfigState } from '@/lib/module-schema';

export interface ModulePreset {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  state: Partial<ModuleConfigState>;
}

export const myTemplatePresets: ModulePreset[] = [
  {
    id: 'minimal',
    name: '미니멀',
    nameEn: 'Minimal',
    description: '필수 모듈만 — 깔끔한 스타일',
    descriptionEn: 'Required modules only — clean style',
    state: {
      enabled: ['hero', 'contact'],
      order: ['hero', 'contact'],
    },
  },
  {
    id: 'full',
    name: '전체',
    nameEn: 'Full',
    description: '모든 모듈 활성화',
    descriptionEn: 'All modules enabled',
    state: {
      enabled: ['hero', 'about', 'projects', 'contact'],
      order: ['hero', 'about', 'projects', 'contact'],
    },
  },
];
```

### Step 4: 프리셋 레지스트리에 등록

파일: `src/data/oneclick/module-presets/index.ts`

```typescript
import { myTemplatePresets } from './my-template';

const PRESET_MAP: Record<string, ModulePreset[]> = {
  'personal-brand': personalBrandPresets,
  'my-template': myTemplatePresets,  // ← 추가
};
```

### Step 5: 코드 생성기 확장 (필요시)

파일: `src/lib/oneclick/code-generator.ts`

기본 코드 생성(`generateConfigTs`, `generatePageTsx`)은 모든 템플릿에서 공유.
템플릿 고유의 컴포넌트 수준 변환이 필요한 경우에만 확장:

```typescript
// 예시: 새 템플릿의 테마 색상 변환기
export function generateMyThemeCss(
  state: ModuleConfigState,
  baseCode: string
): string {
  const theme = state.values.theme || {};
  const primary = (theme.primaryColor as string) || '#6366f1';

  return baseCode.replace(
    /--color-primary:\s*#[a-fA-F0-9]{6}/g,
    `--color-primary: ${primary}`
  );
}
```

그리고 `generateFiles()` 함수에 조건부 로직 추가:

```typescript
// generateFiles() 내부
if (currentFiles) {
  const theme = state.values.theme || {};
  if (theme.primaryColor && theme.primaryColor !== '#6366f1') {
    const cssBase = currentFiles['src/app/globals.css'];
    if (cssBase) {
      files.push({
        path: 'src/app/globals.css',
        content: generateMyThemeCss(state, cssBase),
      });
    }
  }
}
```

### Step 6: 동작 확인

1. 사이트 에디터에서 해당 템플릿 선택
2. 모듈 패널이 정상 렌더링되는지 확인
3. 모듈 토글/순서 변경/값 수정 후 미리보기 반영 확인
4. 프리셋 태그 클릭 시 모듈 구성 변경 확인
5. 저장(Batch Update) 후 GitHub 커밋 확인

---

## 4. 필드 타입별 작성 가이드

### text — 짧은 텍스트 입력

```typescript
{
  key: 'name',
  type: 'text',
  label: '이름',
  labelEn: 'Name',
  defaultValue: '홍길동',
  placeholder: '이름을 입력하세요',
  validation: { required: true, maxLength: 50 },
}
```

### textarea — 여러 줄 텍스트

```typescript
{
  key: 'bio',
  type: 'textarea',
  label: '자기소개',
  labelEn: 'Bio',
  defaultValue: '안녕하세요.',
  validation: { required: true, maxLength: 2000 },
}
```

### color — 색상 피커

```typescript
{
  key: 'primaryColor',
  type: 'color',
  label: '메인 색상',
  labelEn: 'Primary Color',
  defaultValue: '#6366f1',  // hex 6자리 필수
}
```

### number — 숫자 입력

```typescript
{
  key: 'columns',
  type: 'number',
  label: '컬럼 수',
  labelEn: 'Columns',
  defaultValue: 3,
  validation: { min: 1, max: 6 },
}
```

### boolean — 토글 스위치

```typescript
{
  key: 'parallaxEnabled',
  type: 'boolean',
  label: '패럴렉스 효과',
  labelEn: 'Parallax Effect',
  defaultValue: true,
}
```

### select — 드롭다운 선택

```typescript
{
  key: 'fontFamily',
  type: 'select',
  label: '폰트',
  labelEn: 'Font',
  defaultValue: 'Pretendard',
  options: [
    { value: 'Pretendard', label: 'Pretendard (기본)' },
    { value: 'Noto Sans KR', label: 'Noto Sans KR' },
    { value: 'Inter', label: 'Inter' },
  ],
}
```

### url — URL 입력

```typescript
{
  key: 'heroImageUrl',
  type: 'url',
  label: '배경 이미지 URL',
  labelEn: 'Hero Image URL',
  placeholder: 'https://example.com/hero.jpg',
  defaultValue: '',
}
```

### array — 반복 항목 (배열)

```typescript
{
  key: 'items',
  type: 'array',
  label: '항목 목록',
  labelEn: 'Items',
  defaultValue: [
    { title: '항목 1', url: 'https://example.com' },
  ],
  maxItems: 10,
  itemSchema: [              // 각 항목의 필드 정의
    {
      key: 'title',
      type: 'text',
      label: '제목',
      labelEn: 'Title',
      defaultValue: '',
      validation: { required: true },
    },
    {
      key: 'url',
      type: 'url',
      label: 'URL',
      labelEn: 'URL',
      defaultValue: '',
      validation: { required: true },
    },
  ],
}
```

---

## 5. 코드 생성기 패턴

### 기본 생성기 (모든 템플릿 공유)

| 함수 | 역할 | 출력 파일 |
|------|------|----------|
| `generateConfigTs(state)` | 모듈 값 → `config.ts` 상수 객체 | `src/lib/config.ts` |
| `generatePageTsx(state)` | 활성 모듈 → `page.tsx` import/렌더 | `src/app/page.tsx` |
| `buildInitialState(schema)` | 스키마 기본값 → 초기 상태 | — |
| `parseConfigToState(code, schema)` | 기존 config.ts → 상태 복원 | — |
| `parsePageToEnabledModules(code)` | 기존 page.tsx → 활성 모듈 추출 | — |

### 컴포넌트 수준 생성기 (personal-brand 전용, 확장 가능)

| 함수 | 치환 대상 | 정규식 패턴 |
|------|----------|-------------|
| `generateHeroSection` | 그래디언트 색상 | `from-[#hex]`, `to-[#hex]`, `linear-gradient(90deg, ...)` |
| `generateValuesSection` | 그리드 컬럼 수 | `md:grid-cols-N` |
| `generateGallerySection` | 그리드 컬럼 수 | `lg:grid-cols-N` |
| `generateGlobalsCss` | CSS 변수 색상 | `--color-primary: #hex` |
| `generateLayoutTsx` | 폰트 CDN + font-family | `fonts.googleapis.com`, `fontFamily: '...'` |

### 정규식 치환 패턴 모범 사례

```typescript
// 1. Tailwind 클래스 치환
code.replace(/from-\[#[a-fA-F0-9]{6}\]/g, `from-[${newColor}]`);

// 2. CSS 변수 치환
code.replace(/--color-primary:\s*#[a-fA-F0-9]{6}/g, `--color-primary: ${color}`);

// 3. 그리드 컬럼 수 치환
code.replace(/lg:grid-cols-\d/g, `lg:grid-cols-${cols}`);

// 4. font-family 치환
code.replace(/font-family:\s*[^;]+;/g, `font-family: '${font}', sans-serif;`);
```

### 조건부 생성 규칙

`generateFiles()`에서 컴포넌트 파일은 **값이 기본값과 다를 때만** 생성:

```typescript
// 기본값과 동일하면 파일을 건드리지 않음 → 불필요한 커밋 방지
if (hero.gradientFrom && hero.gradientFrom !== '#ee5b2b') {
  // ... 파일 생성
}
```

`currentFiles` 파라미터는 기존 파일 내용의 캐시로, 이 값이 있을 때만 컴포넌트 수준 편집 수행.

---

## 6. UI 통합 컴포넌트

### ModulePanel (`src/components/my-sites/module-panel.tsx`)

스키마를 자동으로 UI로 변환하는 핵심 컴포넌트:

- **모듈 카드**: 각 모듈을 Switch 토글 + 아이콘 + 이름으로 표시
- **DnD 정렬**: `@dnd-kit` 라이브러리로 드래그 앤 드롭 순서 변경
- **프리셋 태그**: 상단에 프리셋 버튼 표시 (클릭 시 `enabled` + `order` 일괄 변경)
- **AI 추천**: 하단 입력 필드 → `/api/ai/module-suggest` 호출 → 추천 상태 적용

**Props:**

```typescript
interface ModulePanelProps {
  schema: TemplateModuleSchema;
  state: ModuleConfigState;
  onChange: (newState: ModuleConfigState) => void;
  onSelectModule: (moduleId: string) => void;
  selectedModuleId: string | null;
  deployId?: string;  // 이미지 업로드용 배포 ID
}
```

### ModuleForm (`src/components/my-sites/module-form.tsx`)

선택된 모듈의 필드를 동적으로 폼 렌더링:

- 필드 타입별 자동 컴포넌트 매핑 (Input, Textarea, Switch, Select, ColorPicker 등)
- `array` 타입: 항목 추가/삭제/편집 UI
- `url` 타입 + `deployId`: 이미지 업로드 버튼 (클라이언트 리사이즈 → GitHub 업로드)
- 값 변경 시 `onChange` 콜백으로 상태 반영

---

## 7. API 엔드포인트

### 이미지 업로드

- **경로**: `POST /api/oneclick/deployments/[id]/upload`
- **입력**: `{ data: "base64...", filename: "image.webp" }`
- **동작**: base64 → GitHub blob → tree → commit → ref 업데이트
- **출력**: `{ path, commit_sha }`
- **제한**: 최대 2MB, WebP 권장 (클라이언트에서 max 1200px 리사이즈)

### AI 모듈 추천

- **경로**: `POST /api/ai/module-suggest`
- **입력**: `{ prompt, templateSlug, currentEnabled, moduleNames }`
- **동작**: OpenAI Structured Output → `{ enabled, order, values, reasoning }` 반환
- **출력**: 추천 `ModuleConfigState` + `reasoning` 텍스트

---

## 8. 기존 템플릿 예제

### personal-brand (나만의 홈페이지)

| 모듈 | 필수 | 기본활성 | 주요 필드 |
|------|------|---------|----------|
| hero | O | O | name, tagline, gradientFrom/To, fontFamily |
| about | X | O | story (textarea) |
| values | X | O | items (array: emoji + title + desc) |
| highlights | X | O | items (array: value + label) |
| gallery | X | X | images (array: url), columns (select) |
| contact | X | O | email, socials (array: platform + url) |

**프리셋**: 미니멀(2), 크리에이터(5), 풀 프로필(6)
**컴포넌트 생성기**: Hero 그래디언트, Gallery 컬럼, CSS 변수, 폰트

### dev-showcase (개발자 포트폴리오)

| 모듈 | 필수 | 기본활성 | 주요 필드 |
|------|------|---------|----------|
| hero | O | O | name, tagline, typingWords (textarea) |
| about | X | O | story, skills (array: name + level) |
| projects | X | O | githubUsername, maxRepos (select) |
| experience | X | O | items (array: title + company + period) |
| blog | X | X | items (array: title + url + date) |
| contact | X | O | email, github (url), linkedin (url) |

### link-in-bio-pro (링크인바이오)

| 모듈 | 필수 | 기본활성 | 주요 필드 |
|------|------|---------|----------|
| profile | O | O | name, bio, avatarUrl |
| links | O | O | items (array: title + url + emoji, max 15) |
| socials | X | O | items (array: platform + url) |
| theme | X | O | primaryColor (color), bgStyle/cardStyle (select) |

---

## 9. 새 템플릿 추가 체크리스트

```
□ 1. 모듈 스키마 파일 생성
     src/data/oneclick/module-schemas/{slug}.ts
     - TemplateModuleSchema 타입 준수
     - templateSlug가 DB slug와 일치
     - 각 모듈에 id, name, icon, fields, affectedFiles 정의
     - required 모듈 최소 1개 (보통 hero/profile)
     - defaultOrder에 모든 모듈 ID 포함

□ 2. 스키마 레지스트리 등록
     src/data/oneclick/module-schemas/index.ts
     - import 추가
     - schemaMap에 slug → schema 매핑

□ 3. (선택) 프리셋 파일 생성
     src/data/oneclick/module-presets/{slug}.ts
     - 2~3개 프리셋 정의 (minimal, standard, full)
     - state.enabled + state.order만 지정 (values는 기본값 사용)

□ 4. (선택) 프리셋 레지스트리 등록
     src/data/oneclick/module-presets/index.ts
     - import 추가
     - PRESET_MAP에 slug → presets 매핑

□ 5. (선택) 코드 생성기 확장
     src/lib/oneclick/code-generator.ts
     - 템플릿 고유 컴포넌트 변환 함수 추가
     - generateFiles()에 조건부 분기 추가
     - 기본값과 다를 때만 파일 생성

□ 6. (선택) MODULE_COMPONENTS 매핑 추가
     code-generator.ts의 MODULE_COMPONENTS
     - 새 모듈 ID → { importName, importPath, render } 매핑

□ 7. 테스트
     - npm run typecheck (타입 오류 없음)
     - npm run test (기존 테스트 통과)
     - 사이트 에디터에서 모듈 패널 렌더링 확인
     - 모듈 토글 / 순서 변경 / 값 수정 → 미리보기 반영
     - 프리셋 적용 확인
     - 저장 후 GitHub 커밋 확인
```

---

## 10. 설계 원칙

1. **선언적 스키마**: 모듈과 필드를 JSON-like 구조로 정의하면 UI가 자동 생성
2. **순수 함수 생성기**: 코드 생성 로직은 side-effect 없는 순수 함수 (테스트 용이)
3. **조건부 생성**: 기본값과 동일한 값은 파일을 건드리지 않음 → 불필요한 커밋 방지
4. **레지스트리 패턴**: 스키마/프리셋을 중앙 레지스트리에 등록하면 UI가 자동 인식
5. **기존 파일 편집**: 새 파일 생성보다 기존 파일의 특정 패턴을 정규식으로 치환
6. **i18n 지원**: 모든 레이블에 `label` (한국어) + `labelEn` (영문) 쌍 제공
7. **점진적 확장**: `config.ts` + `page.tsx` 기본 생성은 공유, 컴포넌트 생성기만 템플릿별 추가

---

## 11. 관련 파일 목록

| 파일 | 역할 |
|------|------|
| `src/lib/module-schema.ts` | 타입 정의 (ModuleDef, ModuleConfigState 등) |
| `src/data/oneclick/module-schemas/index.ts` | 스키마 레지스트리 |
| `src/data/oneclick/module-schemas/*.ts` | 템플릿별 모듈 스키마 |
| `src/data/oneclick/module-presets/index.ts` | 프리셋 레지스트리 |
| `src/data/oneclick/module-presets/*.ts` | 템플릿별 프리셋 |
| `src/lib/oneclick/code-generator.ts` | 코드 생성 로직 |
| `src/components/my-sites/module-panel.tsx` | 모듈 패널 UI (DnD + 프리셋 + AI) |
| `src/components/my-sites/module-form.tsx` | 동적 폼 렌더링 |
| `src/components/my-sites/site-editor-client.tsx` | 사이트 에디터 메인 |
| `src/app/api/oneclick/deployments/[id]/upload/route.ts` | 이미지 업로드 API |
| `src/app/api/ai/module-suggest/route.ts` | AI 모듈 추천 API |
| `src/lib/audit.ts` | 감사 로그 (oneclick.image_upload, ai.module_suggest) |
| `docs/onelink/08-modular-template-editor.md` | 원본 기획 문서 |
| `docs/instructions/01-module-specification.md` | 아키텍처 사양 |
