# 원클릭 배포 하네스 통합 + 모바일 초대장 고도화 — 통합 기획서

> **작성일**: 2026-06-18 · **상태**: Phase-1 적용 완료(Track A·B), Phase-2 설계 확정(미구현)
> **출처 스펙**: `linkmap/harness-system/` (v0.1, 최동혁/setlog-ntl) — untracked 중첩 폴더
> **상위 규칙**: 구현 규칙은 항상 `CLAUDE.md`·`SECURITY.md`가 최우선. 충돌 시 레포 규칙 채택.

---

## 1. 배경 & 결정 기록

사용자가 `linkmap/harness-system/`에 원클릭 배포 고도화 기획 패키지(5단계 파이프라인 ·
단일 `site_blueprint` 데이터 계약 · 신규 스킬 3종 · 신규 서브에이전트 3종 · 모바일 초대장
글래스모피즘 디자인스펙)를 작성. 이를 레포에 반영하면서 두 가지 **근본 충돌**이 드러났고, 사용자가 결정:

### 결정 1 — 아키텍처: **단계적(phased)**
- **충돌**: 하네스는 *Linkmap 자체 호스팅*(`site_blueprint` 테이블, `/s/[slug]` 발행, 발행 후
  인라인 편집, RSVP/방문 분석)을 전제. 현재 원클릭은 *사용자 GitHub 저장소로 코드를 내보내
  GitHub Pages에 정적 배포*. RSVP 직접수집·분석·인라인 재발행은 정적 내보내기로 불가능.
- **결정**: 지금은 기존 내보내기 모델 위에서 초대장 고도화 + 에이전트/스킬 정비(Phase-1).
  호스팅형 파이프라인은 **설계만 확정(design-on-paper)**, 구현은 Phase-2.

### 결정 2 — 디자인: **배포물 한정 글래스모피즘**
- **충돌**: 하네스 초대장 디자인은 글래스모피즘인데 `CLAUDE.md`는 앱 UI 글래스모피즘 금지(헤더만 예외).
- **결정**: 배포되는 초대장 사이트(*앱 외부 산출물*)에만 6번째 `minimal-glass` 프리셋으로 글래스 허용.
  앱(대시보드/마케팅) UI 규칙은 불변, 기존 5개 솔리드 프리셋도 유지.

---

## 2. Phase-1 적용 결과 (이번 라운드 완료)

### Track A — `.claude/` 에이전트·스킬 정비
원칙: 기존 export-model 운영 체계 유지 + 하네스 자산을 "활성 / Phase-2 보류"로 분리.

| 자산 | 위치 | 상태 |
|---|---|---|
| `invitation-template-designer` (스킬) | `.claude/skills/invitation-template-designer/SKILL.md` | **활성** — 호스팅 `sections/tokens` 가정을 실제 파일(스키마·제너레이터·프리셋·프리뷰)로 적응, `minimal-glass` 기준 명시 |
| `design-qa-reviewer` (에이전트) | `.claude/agents/design-qa-reviewer.md` | **활성** — 읽기전용 QA 게이트, 점검 대상을 invitation 생성 출력으로 명시 |
| `oneclick-deploy-architect` (스킬) | `.claude/skills/oneclick-deploy-architect/SKILL.md` | **Phase-2** — 트리거를 "호스팅형 발행/site_blueprint/`/s/[slug]`"로 분리, 미구현 배너 |
| `module-editor-builder` (스킬) | `.claude/skills/module-editor-builder/SKILL.md` | **Phase-2** — 기존 `my-sites` 에디터와 매핑 메모 |
| `template-generator` (에이전트) | `.claude/agents/template-generator.md` | **Phase-2** — export 모델은 `tpl-invitation`이 담당 |
| `deploy-integrator` (에이전트) | `.claude/agents/deploy-integrator.md` | **Phase-2** — `/s/[slug]`·analytics 연결 |

**트리거 충돌 방지**: Phase-2 호스팅 자산은 "호스팅형" 전용 문구로 좁혀 활성 `원클릭`
오케스트레이터("원클릭/초대장")와 겹치지 않게 함. 각 Phase-2 정의 상단에 "STATUS: Phase 2(미구현)"
배너 + "백킹 구현 없으니 실행 금지, 회송" 지시.

**기존 정의 업데이트**: `oneclick-orchestrator.md`(invitation 모듈 11개·5단계↔export 매핑 표 추가),
`tpl-invitation.md`(모듈 7→11, `minimal-glass`, 신규 필드 스펙, 3중 등록·키 동기화 체크리스트, 글래스 제약).

### Track B — 모바일 초대장 템플릿 고도화 (export 모델)
신규 옵션 모듈 4종 + 글래스 프리셋 1종. 변경 파일 6개.

- **신규 모듈**: `message`(인사말), `share`(카카오/복사/QR), `rsvp`(외부 폼 링크), `footer`(마무리+Powered by 토글).
  - footer는 기존 하드코딩 푸터를 토글 모듈로 전환.
  - share QR = `api.qrserver.com` 외부 이미지 URL(신규 npm 의존성 0), 카카오 = 키 있으면 SDK·없으면 `navigator.share`/복사 폴백, URL은 `useEffect`에서 `window.location.href`로 계산(SSG baking 회피).
  - rsvp = 외부 폼(구글폼/네이버폼) 링크만(정적 사이트 직접수집 불가).
- **신규 프리셋** `minimal-glass`: `#a78bfa→#f9a8d4`, 글래스 토큰(`--inv-glass-*`) + `@supports not (backdrop-filter)` 솔리드 폴백을 제너레이터 주입 CSS·프리뷰 CSS 양쪽에 포함.
- **defaultOrder**: `hero·message·dday·hosts·location·gallery·rsvp·account·share·contact·footer` (hero·dday 필수 유지).
- **변경 파일**: `module-schemas/invitation.ts`, `generators/invitation.ts`, `module-presets/invitation.ts`, `invitation-template.ts`, `preview/invitation.ts`, `__tests__/template-integrity.test.ts`(invitation을 검증 대상 slug에 추가).
- **검증**: `typecheck` 0 · `eslint` 0 · `template-integrity`+`template-deps` 76 tests pass.

---

## 3. 하네스 5단계 ↔ export 모델 매핑

| 단계 | 현재(export, 활성) | 호스팅형(Phase-2, 미구현) |
|---|---|---|
| ① 기획 | 위저드 폼(`src/components/oneclick/`) | blueprint draft 생성 |
| ② 템플릿생성 | `tpl-invitation` + `generators/invitation.ts` | 서브에이전트 `template-generator` |
| ③ 배포 | GitHub repo push → GitHub Pages(`api/oneclick/deploy`) | `deploy-integrator` (`/s/[slug]`) |
| ④ 모듈편집 | `src/components/my-sites/` 모듈 에디터 | 스킬 `module-editor-builder` |
| ⑤ 전체연결 | — (정적) | `deploy-integrator` (analytics·바이럴 귀속) |

---

## 4. Phase-2 호스팅형 설계 (design-on-paper, 미구현)

> **선결 조건**: 구현 착수 전 기존 `my-sites`/publish 관련 테이블·라우트·컴포넌트를 **반드시 선검증**.
> PRD v2 F-21(`/sites/manage` 컬렉션 발행)이 이미 존재할 수 있으므로 **재사용 우선, 중복 테이블 생성 금지**.

### 데이터 모델 (스케치 — 기존 스키마와 정합 후 확정)
`site_blueprint`(또는 기존 published 테이블 확장): 단일 진실 원천.
- `id`, `owner_id`(RLS), `purpose`(invitation|link_hub|launch|…), `status`(draft|published|archived)
- `source`(collection_id, linked_items), `content`(목적별 fields)
- `template`(template_key, tokens, sections[]), `deploy`(slug, og, revalidate, published_at)
- `analytics`(enabled), `attribution`(powered_by_linkmap)
- 신규 테이블 시: RLS + 정책 + `created_at` 필수. 마이그레이션 3-step(types→queries→`docs/db-schema.md`).

### 발행·편집·보안
- 공개 라우트 `/s/[slug]`: `revalidate=false`, `<Link prefetch={false}>`, Workers `cpu_ms` 준수.
- 발행/재발행: 추측 어려운 slug, **재발행 시 slug 불변·원자적 교체**, 실패 시 직전 published 유지.
- 모든 mutation: `getUser() → Zod safeParse → 소유권 확인 → 로직 → logAudit()`.
- 민감필드(account/contact/RSVP PII): OG·서버 응답·로그 미노출, 기본 접힘, RSVP 최소수집·보존기간 명시.
- RLS + API `user_id` 이중 방어. silent catch 금지(`src/lib/api/errors.ts`).

### 분석·바이럴 (⑤)
- `analytics_events`: 방문·클릭·RSVP·공유 (PRD v2 F-24).
- 귀속 링크 클릭 → 가입 유입 추적. "Powered by Linkmap" 무료 유지·유료 제거.

---

## 5. `90_의사전달_요청서` 결정값 (확정)

| 영역 | 결정 |
|---|---|
| 배포 | Phase-1 = GitHub Pages 내보내기 유지 / 호스팅형 = Phase-2 |
| 콘텐츠 | 범용 이벤트(결혼 비특정), RSVP=외부 폼, account 기본 OFF·표시전용, 지도=Kakao/Naver 딥링크 |
| 카카오 공유 | 키 있으면 SDK, 없으면 Web Share/복사 폴백 |
| 디자인 | 라이트 기본, 프리셋 6종(기존 5 + minimal-glass), 진입 모션 subtle·reduced-motion 존중 |
| 발행 정책 | "Powered by Linkmap" 무료 유지·유료 제거(Phase-2) |
| 설치 | 스킬 `.claude/skills/`, 서브에이전트 `.claude/agents/`, 모델 sonnet, 우선순위 ②③→④→⑤ |
| 완료 정의(Phase-2) | 초대장 1건 발행 <60s, 편집·재발행 <10s, 데이터 손실 0 |

---

## 6. 검증 게이트 (`50_체크리스트` 정리)

### Phase-1 (이번 라운드 — 완료)
- [x] 스킬·서브에이전트 `.claude/` 배치, 활성/Phase-2 분리, 트리거 비충돌
- [x] 초대장 신규 모듈 3중 등록(MODULE_COMPONENTS·importToModuleMap·files) + 키 동기화
- [x] `minimal-glass` 글래스 폴백(제너레이터·프리뷰 양쪽), 본문 텍스트 AA, accent는 비텍스트 한정
- [x] 신규 npm 의존성 0, lockfile 무변경
- [x] `typecheck`·`eslint`·`template-integrity`·`template-deps` 통과

### Phase-2 (호스팅형 — 보류, 착수 시 적용)
- [ ] 기존 `my-sites`/publish 스키마 선검증·재사용 결정
- [ ] `site_blueprint` 저장(신규 테이블 vs 기존 확장) + 마이그레이션 3-step + RLS
- [ ] `/s/[slug]` 발행(revalidate=false), slug 불변 재발행, API 5단계 + logAudit
- [ ] analytics_events 연결 + 바이럴 귀속
- [ ] 민감필드 OG/응답/로그 미노출, RSVP PII 최소수집·보존기간

---

## 7. 후속 메모
- 스펙 원본은 untracked 중첩 폴더 `linkmap/linkmap/harness-system/`에 위치. 정식 관리 시
  `docs/harness-system/`로 이전 검토(선택).
- 디자인 참조 HTML(`20_모바일초대장_프리뷰.html`)은 `minimal-glass` 컴포넌트 마크업의 레퍼런스로 유지.

---

## 8. 2026-06-18 라운드 2 — 동적 페이지 확인 & 반영

### 결정 (사용자 확정)
- **하네스(Phase-2 호스팅형)는 적용하지 않음.** 기존 GitHub Pages 내보내기 모델 유지.
- **"GitHub Page를 동적페이지로 적용" = 정적 `output:'export'` 유지 + 클라이언트 인터랙티브.**
  서버 동적(/s/[slug])이 아니라, 정적 호스팅 위에서 JS로 동작하는 SPA형 동적 페이지를 의미.
- **반영 범위 = 고도화된 초대장(`minimal-glass`) 페이지 한정.** 다른 1100+ working-tree 변경은 미포함.

### 동적 페이지 검증 결과 (이미 충족)
생성되는 초대장 사이트의 모든 섹션이 `'use client'`로, 정적 export와 호환되면서 브라우저에서 동적으로 동작함:

| 인터랙션 | 구현 | 정적 export 호환 |
|---|---|---|
| 히어로 스크롤 페이드 | `useEffect` + scroll 리스너 | ✓ |
| 카운트다운 | `setInterval` 1초 + flip/simple | ✓ |
| 갤러리 캐러셀/라이트박스 | `useState` activeIdx + 자동전환 | ✓ |
| 계좌 복사 | `navigator.clipboard` + 토스트 | ✓ |
| 공유 | Kakao SDK / Web Share / 링크복사 폴백 | ✓ |
| RSVP | 외부 폼 딥링크(서버리스) | ✓ |

→ `shared-template-files.ts`의 `output:'export'` + `Deploy to GitHub Pages` 워크플로 그대로,
   추가 동적화 코드 변경 불필요. 클라이언트 인터랙티브 요건 충족 확인.

### 반영(커밋) 범위
- 소스 5종: `invitation-template.ts`, `module-schemas/invitation.ts`, `module-presets/invitation.ts`,
  `lib/oneclick/generators/invitation.ts`, `lib/oneclick/preview/invitation.ts`
- 문서/자료: 본 기획문서, `docs/planning/new-templates/01-invitation.html`(디자인 레퍼런스)
- 제외: `linkmap/harness-system/` 패키지, `.claude/` 변경, 그 외 working-tree 변경 전부
