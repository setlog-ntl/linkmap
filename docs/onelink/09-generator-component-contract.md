# 09. 원클릭 제너레이터 ↔ 컴포넌트 계약 (배포 빌드 실패 방지)

> **문서 코드**: ONELINK-CONTRACT
> **상위**: [08-modular-template-editor.md](./08-modular-template-editor.md)
> **작성일**: 2026-07-19
> **상태**: 활성 (재발 방지 가이드 · 회귀 테스트 연동)

이 문서는 원클릭 배포에서 **반복적으로 재발하는 한 가지 버그 클래스**를 설명하고 재발 방지 규칙을 정의한다.

---

## 1. 증상

사용자가 배포한 원클릭 사이트(GitHub repo)의 **GitHub Actions `next build`** 가 타입 에러로 실패한다. 대표 예:

```
./src/app/page.tsx:27:8
Type error: Property 'config' is missing in type '{}' but required in type 'Props'.

> 27 |       <NavHeader />
```

특징:
- **최초 배포는 성공**하는데, **모듈 편집 → "적용"(git 커밋) 이후**의 빌드부터 깨진다.
- Linkmap 본체 CI는 통과한다(초록). Linkmap은 **생성된 템플릿 사이트를 빌드하지 않기 때문**이다 — 타입 에러는 오직 사용자 repo의 배포 빌드에서만 드러난다.

---

## 2. 근본 원인 — "두 경로가 같은 파일을 만든다"

원클릭 배포되는 각 파일(`src/app/page.tsx`, `src/lib/config.ts`, `src/app/layout.tsx` 등)은 **두 경로**로 생성된다:

| 경로 | 언제 | 소스 |
|------|------|------|
| **정적 번들** | 최초 배포(`api/oneclick/deploy`가 번들 `files`를 그대로 push) | `src/data/oneclick/*-template.ts` 의 `const pageTsx = ...` |
| **제너레이터** | 모듈 편집 → 적용(재생성 후 변경 파일만 커밋) | `src/lib/oneclick/generators/*.ts` 의 `generatePageTsx()` |

두 경로가 **같은 결과물을 독립적으로 만들기 때문에**, 한쪽만 컴포넌트 계약과 맞고 다른 쪽이 어긋나면 **지연 실패**가 된다:
- 정적 번들 `page.tsx`는 `<NavHeader config={siteConfig} />`(올바름) → 최초 배포 통과.
- 제너레이터 `generatePageTsx`는 `<NavHeader />`(config 누락) → 편집·적용으로 `page.tsx`가 재생성되는 순간 배포 빌드가 깨짐.

**즉 컴포넌트의 Props를 바꾸면, 그 컴포넌트를 렌더하는 정적 번들 page.tsx와 제너레이터 render를 반드시 함께 고쳐야 한다.** (config.ts 필드도 동일 — [[oneclick-default-content-two-paths]] 참조.)

---

## 3. 발생 이력 (재발 클래스)

| 날짜 | 불일치 | 조치 |
|------|--------|------|
| (초기) | 제너레이터 `MODULE_COMPONENTS`가 템플릿에 **존재하지 않는 컴포넌트**를 참조 → 없는 파일 import | 무결성 테스트 "컴포넌트 파일 존재" 추가 |
| 2026-07-19 | `base-generator.generatePageTsx`가 `<NavHeader/>`·`<Footer/>`를 **config 없이** 렌더, small-biz/cafe 컴포넌트는 config 필수 | render를 `config={siteConfig}`로 수정 + **필수 prop 계약 회귀 테스트** 추가 |

**공통 구조**: 제너레이터가 만드는 코드가 배포 번들의 컴포넌트/파일 계약과 어긋난다. 구문은 유효하지만 **타입/참조**가 깨진다.

---

## 4. 왜 자주 놓치는가

`src/lib/oneclick/__tests__/template-integrity.test.ts`의 "생성 코드 구문 검증"은 `ts.transpileModule`로 **구문(syntax)만** 검사한다. `<NavHeader />`는 **구문상 완전히 유효**하므로 통과한다 — 문제는 **타입 계약**(NavHeader가 config를 요구)이고, 이는 컴포넌트 파일과 함께 컴파일해야만 드러난다. 그런데 그 타입 체크는 사용자 repo 배포 시점에만 일어난다.

---

## 5. 재발 방지 — 회귀 테스트 (구현됨)

`template-integrity.test.ts`에 다음 가드가 있다:

1. **컴포넌트 존재**: `generator.moduleComponents`의 각 컴포넌트 → `template.files`에 파일 존재.
2. **import/모듈 매핑 일관성**: 스키마 모듈 ↔ `moduleComponents` ↔ `importToModuleMap`.
3. **생성 코드 구문 유효성**: default 상태 `config.ts`/`page.tsx`가 구문상 유효(`transpileModule`).
4. **필수 prop 계약 (2026-07-19 신설)**: 생성 `page.tsx`가 렌더하는 각 컴포넌트 태그가, 배포 번들 **컴포넌트 타입 시그니처(AST로 추출한 non-optional Props 멤버)** 의 **필수 prop을 모두 전달**하는지 대조. `config`뿐 아니라 `items`·`theme`·`images` 등 모든 필수 prop을 검사(optional `?` prop은 제외해 오탐 방지).
5. **라운드트립 불변식**([[oneclick-roundtrip-invariant]]): `module-roundtrip.test.ts` — 제너레이터 emit ↔ 파서 parse 대칭성.

> 4번 테스트는 RED/GREEN으로 실증됨: base-generator의 config를 제거하면 small-biz·small-biz-cafe 2건이 정확히 실패하고, 복원하면 통과한다.

### 한계 (알아둘 것)
- 필수 prop 계약 테스트는 **`@/components/*`에서 import되고 배포 번들에 파일이 있는** 컴포넌트만 검사한다(`SLUGS_WITH_TEMPLATE_FILES`).
- `interface Props extends ...`(상속)나 파라미터 타입이 없는 경우는 오탐 방지를 위해 **미검사**(less-strict)로 둔다.
- prop **이름**만 대조하며 값 타입까지는 보지 않는다(완전한 타입 검사는 사용자 repo 빌드에서 최종 확인).

---

## 6. 체크리스트 — 템플릿/컴포넌트 변경 시 (필수)

- [ ] 컴포넌트의 **Props(필수 prop)를 바꿨다면**, 그 컴포넌트를 렌더하는 **정적 번들 `page.tsx`(`*-template.ts`)** 와 **제너레이터 render**(`generatePageTsx` 하드코딩부 + `MODULE_COMPONENTS`/`SMALL_BIZ_MODULE_COMPONENTS`의 `render` 문자열)를 **둘 다** 갱신.
- [ ] `config.ts` 필드를 바꿨다면 정적 번들 siteConfig와 제너레이터 `generateConfigTs` + `parseConfigToState`를 함께 갱신([[oneclick-roundtrip-invariant]]).
- [ ] `npm run test -- src/lib/oneclick/__tests__/` (무결성 + 라운드트립) 통과 확인.
- [ ] `npm run typecheck` 통과.
- [ ] (가능하면) 실제 생성 페이지를 WSL/Linux에서 materialize 후 빌드 검증([[oneclick-build-verification]]).

---

## 7. 진단 & 복구 (이미 깨진 사용자 repo)

**진단**: 배포 빌드 로그의 `page.tsx:NN Type error: Property 'X' is missing ... Props` → `X`가 필수인 컴포넌트를 제너레이터가 `X` 없이 렌더한 것. 해당 템플릿의 `generatePageTsx`(또는 base-generator 공용) render를 확인.

**복구(사용자)**: Linkmap 제너레이터를 고쳐 배포한 뒤, 사용자가 에디터에서 해당 사이트를 **"적용" 한 번 더** 누르면 새 제너레이터가 `page.tsx`를 올바르게 재생성·커밋해 빌드가 복구된다(내용 변경 없이 "적용"만으로 `page.tsx`가 갱신됨 — 이전 커밋과 diff가 생기므로 반영됨).

---

## 8. 관련

- [08. 모듈형 템플릿 에디터](./08-modular-template-editor.md)
- 회귀 테스트: `src/lib/oneclick/__tests__/template-integrity.test.ts`, `module-roundtrip.test.ts`
- 메모리: `oneclick-roundtrip-invariant`, `oneclick-default-content-two-paths`, `oneclick-build-verification`
