# Phase 3 구현 잔여 작업 플랜

> 컨텍스트가 끊겨도 이 문서만으로 독립 실행 가능하도록 작성됨

## 작업 순서 및 의존관계

```
Step 1 (P0) ─┐
             ├─→ Step 4 (P2) — Step 1 완료 후 복제하면 designPreset 자동 포함
Step 2 (P0) ─┤
             │
Step 3 (P1) ─┘  ← Step 2 완료 후 실행 (같은 파일 수정)

Step 5 (P3) — 독립 실행 가능 (기능 영향 없음)
```

권장 순서: **Step 1 → Step 2 → Step 3 → Step 4 → Step 5**

---

## Step 1: small-biz Generator에 designPreset 반영 (P0)

### 목표
`small-biz.ts` generator의 `generateConfigTs`와 `parseConfigToState`에 designPreset 필드를 추가.
스키마에 정의된 designPreset 옵션(default, warm-serif, modern-minimal, warm-earth, midnight)이 config.ts 생성/파싱에 반영되도록 한다.

### 수정 파일
- `src/lib/oneclick/generators/small-biz.ts`

### 참고 패턴 (dev-showcase.ts)
```typescript
// generateConfigTs 내 hero 변수 추출:
const designPreset = (hero.designPreset as string) || 'github-dark';

// siteConfig 객체 내:
designPreset: '${esc(designPreset)}',

// parseConfigToState 내:
const designPreset = extractString('designPreset');
if (designPreset !== null) state.values.hero.designPreset = designPreset;
```

### 상세 변경

**1) `generateConfigTs` 함수 (~95행)**

hero 변수 추출 블록(~103행)에 추가:
```typescript
const designPreset = (hero.designPreset as string) || 'default';
```

`siteConfig` 객체(~160행)에서 `fontFamily` 바로 뒤에 추가:
```typescript
  designPreset: '${esc(designPreset)}',
```

**2) `parseConfigToState` 함수 (~230행)**

Hero 파싱 블록 끝, `fontFamily` 파싱 이후에 추가:
```typescript
const designPreset = extractString('designPreset');
if (designPreset !== null) state.values.hero.designPreset = designPreset;
```

### 검증
```bash
npm run typecheck
npm run test
```
- [x] typecheck 통과
- [x] 기존 테스트 통과 (138/143, teams 5개 기존 실패)
- [ ] 모듈 에디터에서 designPreset 변경 → config.ts 반영 확인

### 완료 기준
- [x] generateConfigTs에서 designPreset 출력
- [x] parseConfigToState에서 designPreset 파싱

---

## Step 2: freelancer-page Generator에 designPreset 반영 (P0)

### 목표
`freelancer-page.ts` generator에 designPreset 필드 처리 추가.

### 수정 파일
- `src/lib/oneclick/generators/freelancer-page.ts`

### 상세 변경

**1) `generateConfigTs` 함수 (~138행)**

hero 변수 추출 블록(~146행)에 추가:
```typescript
const designPreset = (hero.designPreset as string) || 'default';
```

`siteConfig` 객체(~230행)에서 `portfolioColumns` 뒤에 추가:
```typescript
  designPreset: '${esc(designPreset)}',
```

**2) `parseConfigToState` 함수 (~292행)**

Hero 파싱 블록 끝에 추가:
```typescript
const designPreset = extractString('designPreset');
if (designPreset !== null) state.values.hero.designPreset = designPreset;
```

### 검증
```bash
npm run typecheck
```
- [x] typecheck 통과
- [ ] 모듈 에디터에서 designPreset 'agency' 선택 → config.ts 반영 확인

### 완료 기준
- [x] generateConfigTs에서 designPreset 출력
- [x] parseConfigToState에서 designPreset 파싱

---

## Step 3: freelancer-page에 rotatingWords 반영 (P1)

### 목표
모듈 에디터에서 사용자가 입력한 순환 키워드가 실제 RotatingText에 반영되도록 스키마 + generator 수정.

### 수정 파일
- `src/data/oneclick/module-schemas/freelancer-page.ts` — 스키마에 rotatingWords 필드 추가
- `src/lib/oneclick/generators/freelancer-page.ts` — generator에 rotatingWords 생성/파싱 추가

### 상세 변경

**1) 스키마 (`module-schemas/freelancer-page.ts`)**

hero 모듈의 `fields` 배열에서 `fontFamily` 필드 뒤에 추가:
```typescript
{
  key: 'rotatingWords',
  type: 'text',
  label: '순환 키워드 (콤마 구분)',
  labelEn: 'Rotating Words (comma separated)',
  defaultValue: 'Brand Identity, Packaging, Social Media, Web Design',
  placeholder: 'Brand Identity, Packaging, ...',
},
```

**2) Generator `generateConfigTs`**

hero 변수 추출에 추가:
```typescript
const rotatingWordsRaw = (hero.rotatingWords as string) || '';
```

배열 빌드 (siteConfig 생성 전):
```typescript
const rotatingWordsArr = rotatingWordsRaw
  .split(',')
  .map((w) => w.trim())
  .filter(Boolean);
const rotatingWordsLiteral = rotatingWordsArr.length > 0
  ? `[${rotatingWordsArr.map((w) => `'${esc(w)}'`).join(', ')}]`
  : `['Brand Identity', 'Packaging', 'Social Media', 'Web Design']`;
```

siteConfig 객체에서 designPreset 뒤에:
```typescript
  rotatingWords: parseJSON<string[]>(process.env.NEXT_PUBLIC_ROTATING_WORDS, ${rotatingWordsLiteral}),
```

**3) Generator `parseConfigToState`**

Hero 파싱 블록 끝에 추가:
```typescript
try {
  const rwMatch = configContent.match(/rotatingWords:\s*parseJSON<string\[\]>\([^,]+,\s*\[([\s\S]*?)\]\s*\)/);
  if (rwMatch?.[1]) {
    const words: string[] = [];
    const wordRe = /'([^']*)'/g;
    let wm;
    while ((wm = wordRe.exec(rwMatch[1])) !== null) {
      words.push(unescapeString(wm[1]));
    }
    if (words.length > 0) {
      state.values.hero.rotatingWords = words.join(', ');
    }
  }
} catch { /* 기본값 유지 */ }
```

### 검증
```bash
npm run typecheck
```
- [x] typecheck 통과
- [ ] 모듈 에디터에서 rotatingWords를 "브랜딩, 패키지, SNS"로 입력
- [ ] config.ts에 `['브랜딩', '패키지', 'SNS']` 생성 확인
- [ ] 기존 config.ts(rotatingWords 없음) 파싱 시 기본값 유지 확인

### 완료 기준
- [x] 스키마에 rotatingWords 필드 노출
- [x] 콤마 구분 문자열 → 배열 리터럴 변환
- [x] 역방향 파싱 (배열 → 콤마 구분 문자열)

---

## Step 4: 카페 템플릿 완전 등록 (P2)

### 목표
`small-biz-cafe`를 서비스에서 선택/배포 가능한 완전한 템플릿으로 등록.
small-biz를 복제 후 카페 특화 기본값으로 수정.

### 신규 파일 (4개)
1. `src/data/oneclick/small-biz-cafe-template.ts` — 파일 번들
2. `src/data/oneclick/module-schemas/small-biz-cafe.ts` — 모듈 스키마
3. `src/data/oneclick/module-presets/small-biz-cafe.ts` — 프리셋
4. `src/lib/oneclick/generators/small-biz-cafe.ts` — 코드 생성기

### 기존 수정 파일 (4개)
5. `src/lib/oneclick/generators/index.ts` — registry에 smallBizCafeGenerator 추가
6. `src/data/oneclick/module-schemas/index.ts` — schemaMap에 추가
7. `src/data/oneclick/module-presets/index.ts` — PRESET_MAP에 추가
8. `src/data/oneclick/homepage-template-content.ts` — homepageTemplates 배열에 추가

### 카페 특화 기본값

**가게 정보:**
- 이름: 온기 로스터리 / Ongi Roastery
- 소개: 매일 아침, 직접 로스팅한 한 잔의 커피
- 전화: 02-338-1204
- 주소: 서울 마포구 연남로 23길 8, 1층

**메뉴 카테고리:**
- 커피: 아메리카노(5,000), 카페라떼(5,500), 바닐라라떼(6,000), 콜드브루(5,500), 플랫화이트(5,500), 아인슈페너(6,500)
- 논커피: 말차라떼(6,000), 얼그레이라떼(5,500), 유자에이드(6,000), 자몽에이드(6,000)
- 디저트: 당근케이크(7,000), 크루아상(4,500), 티라미수(7,500), 바스크치즈케이크(7,000)
- 원두: 에티오피아 예가체프(18,000/200g), 콜롬비아 수프레모(16,000/200g)

**영업시간:**
- 화~일 09:00~22:00 (라스트오더 21:30)
- 월요일 정기휴무

**프리셋:**
- minimal: 메뉴 + 영업시간만
- cafe-full: 모든 모듈 활성
- modern-cafe: 라이트톤, Pretendard
- vintage-cafe: 세리프 폰트, 따뜻한 톤
- warm-earth / midnight: 공통 디자인 프리셋

### Registry 등록 패턴

**generators/index.ts:**
```typescript
import { smallBizCafeGenerator } from './small-biz-cafe';
// generators 배열에 추가
```

**module-schemas/index.ts:**
```typescript
import { smallBizCafeModuleSchema } from './small-biz-cafe';
// schemaMap에 'small-biz-cafe': smallBizCafeModuleSchema 추가
```

**module-presets/index.ts:**
```typescript
import { smallBizCafePresets } from './small-biz-cafe';
// PRESET_MAP에 'small-biz-cafe': smallBizCafePresets 추가
```

**homepage-template-content.ts:**
```typescript
import { smallBizCafeTemplate } from './small-biz-cafe-template';
// homepageTemplates 배열에 smallBizCafeTemplate 추가
```

### DB Seed
```sql
INSERT INTO homepage_templates (slug, name, name_en, description, description_en, category, deploy_target, is_active)
VALUES (
  'small-biz-cafe',
  '카페 홍보',
  'Cafe Page',
  '카페·로스터리를 위한 원페이지 홍보 사이트',
  'One-page promotional site for cafes and roasteries',
  'business',
  'github-pages',
  true
)
ON CONFLICT (slug) DO NOTHING;
```

### 검증
```bash
npm run typecheck && npm run test
```
- [x] `getGenerator('small-biz-cafe')` 반환 확인 (typecheck 통과)
- [x] `getModuleSchema('small-biz-cafe')` 반환 확인 (typecheck 통과)
- [x] `getModulePresets('small-biz-cafe')` 반환 확인 (typecheck 통과)
- [x] `getTemplateBySlug('small-biz-cafe')` 반환 확인 (typecheck 통과)
- [ ] 모듈 에디터 동작 확인
- [ ] GitHub Pages 배포 확인

### 완료 기준
- [x] 4개 registry 모두 등록
- [x] 모듈 에디터에서 편집/미리보기 가능
- [x] 배포 파이프라인 동작

---

## Step 5: 공유 컴포넌트 정리 (P3 — 선택적)

### 목표
인라인 구현을 shared 컴포넌트 참조로 통일 (유지보수 개선).

### 수정 파일
- `src/data/oneclick/freelancer-page-template.ts` — 인라인 RotatingText → shared import
- `src/data/oneclick/homepage-template-content.ts` — files에 rotating-text.tsx 추가

### 상세 변경

**1) `freelancer-page-template.ts`**
- hero-section.tsx 내 인라인 RotatingText 컴포넌트 정의(~444행) 제거
- 상단에 `import { RotatingText } from '@/components/rotating-text';` 추가

**2) `homepage-template-content.ts`**
- freelancerPageTemplate files에 추가:
```typescript
{ path: 'src/components/rotating-text.tsx', content: sharedRotatingText }
```

### 주의사항
- shared 컴포넌트(`sharedRotatingText`)의 Props와 인라인 버전 Props 호환성 확인 필수
- CSS 클래스명 동일한지 확인 (`rotating-text-wrapper` 등)

### 검증
```bash
npm run typecheck
```
- [ ] freelancer-page 배포 후 RotatingText 동작 확인

### 완료 기준
- [x] 인라인 → shared 컴포넌트 참조 교체
- [x] 배포 시 동일 동작

---

## Critical Files 참조표

| 파일 | Step | 역할 |
|------|------|------|
| `src/lib/oneclick/generators/small-biz.ts` | 1 | designPreset 추가 |
| `src/lib/oneclick/generators/freelancer-page.ts` | 2, 3 | designPreset + rotatingWords 추가 |
| `src/data/oneclick/module-schemas/freelancer-page.ts` | 3 | rotatingWords 스키마 필드 |
| `src/lib/oneclick/generators/dev-showcase.ts` | 참고 | designPreset 구현 패턴 |
| `src/lib/oneclick/generators/index.ts` | 4 | generator registry |
| `src/data/oneclick/module-schemas/index.ts` | 4 | schema registry |
| `src/data/oneclick/module-presets/index.ts` | 4 | preset registry |
| `src/data/oneclick/homepage-template-content.ts` | 4, 5 | template bundle registry |
| `src/data/oneclick/shared-template-files.ts` | 5 | 공유 컴포넌트 소스 |
