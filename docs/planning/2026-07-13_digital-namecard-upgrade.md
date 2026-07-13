# 디지털 명함(digital-namecard) 고도화 기획

> 작성: 2026-07-13 | 상태: **P0·P1 완료** (typecheck 0 · integrity+deps 79/79) — P2 백로그 잔여 | 담당: tpl-digital-namecard (오케스트레이터: 원클릭)

## 1. 배경

디지털 명함 템플릿은 7개 원클릭 템플릿 중 최소 구성(모듈 4개, 제너레이터 333줄)으로,
최근 고도화된 초대장(완성형 프리셋 6종 + minimal-glass)·카페(SNS 실링크 기본 적용) 대비
디자인 프리셋·공유 기능·샘플 콘텐츠가 한 세대 뒤처져 있다.
에이전트 정합성 점검 결과 **구조적 결함 1건**과 **다크모드 케스케이드 버그 후보 1건**을 발견하여
함께 수정한다.

## 2. 현황 진단 (2026-07-13 기준)

| 영역 | 상태 |
|------|------|
| 모듈 | profile / contact / socials / theme (4개) |
| 프리셋 | 5종 — `accentColor`만 변경 (designPreset·fontFamily 미활용) |
| designPreset | pro / corporate / creative / minimal-dark (4종) |
| 배포 번들 | `homepage-template-content.ts` 802~1830줄 — FlippableCard 외 11개 컴포넌트, KO/EN i18n, 다크모드, QR(페이지 URL), vCard, GA, JSON-LD, OG, print 스타일 |
| 제너레이터 | config.ts + page.tsx 껍데기만 생성 — 카드 UI는 전부 번들 소스 |

## 3. 발견된 결함

### 3-1. 에이전트 담당 파일 누락 (P0)
`tpl-digital-namecard.md`의 담당 파일 표에 배포 번들(`homepage-template-content.ts`)이 없어
에이전트가 카드 UI(FlippableCard·ProfileCard 등)를 수정할 수 없는 구조.
비교: `tpl-invitation.md`는 `invitation-template.ts`(배포 컴포넌트)를 담당 파일에 명시.

### 3-2. preset-override.css 다크모드 케스케이드 (P1)
- 번들 `globals.css`: `.dark { --card-bg … }` (html 클래스, 특이도 0-1-0)
- 제너레이터 `generateNamecardPresetCss()`: `:root { --page-bg … }` (특이도 0-1-0 동일)
- 모듈 편집 후 재생성된 `page.tsx`가 `preset-override.css`를 import → 페이지 CSS가
  레이아웃 CSS(globals)보다 뒤에 로드 → **동일 특이도에서 나중 선언이 승리** →
  밝은 프리셋의 라이트 토큰이 `.dark` 토큰을 덮어써 다크모드 토글 무력화 가능.
- 수정 방향: 밝은 프리셋의 page/card 토큰을 `:root:not(.dark)`로 스코프
  (accent 계열은 양 모드 공통이므로 `:root` 유지, minimal-dark는 현행 유지).

## 4. 로드맵

### P0 — 에이전트 정비 (선행)
| # | 항목 | 대상 파일 |
|---|------|----------|
| P0-1 | 에이전트 문서 보강 — 번들 구간·컴포넌트 맵·i18n/vcard/print/케스케이드 규칙 | `.claude/agents/tpl-digital-namecard.md` |
| P0-2 | 프리셋 완성형 룩 개편 — `designPreset + accentColor + fontFamily` 묶음 (기존 ID 5종 유지, 하위호환) | `src/data/oneclick/module-presets/digital-namecard.ts` |

프리셋 개편안 (ID 불변):

| ID | 룩 | designPreset | accent | font |
|----|-----|-------------|--------|------|
| default-blue | 클래식 블루 | pro | #3b82f6 | Pretendard Variable |
| corporate | 비즈니스 네이비 | corporate | #1e3a5f | Pretendard Variable |
| warm-earth | 내추럴 어스 | pro | #d97706 | Noto Serif KR |
| creative | 크리에이티브 퍼플 | creative | #8b5cf6 | IBM Plex Sans KR |
| midnight | 미드나잇 인디고 | minimal-dark | #818cf8 (다크 배경 가독성) | Pretendard Variable |

### P1 — 기능 고도화 (tpl-digital-namecard 위임)
| # | 항목 | 내용 |
|---|------|------|
| P1-1 | share 기능 | URL 복사 + Web Share API. 초대장 share 모듈(invitation.ts `id: 'share'`) 패턴 참고. 명함 수신자 → Linkmap 유입 바이럴 루프 |
| P1-2 | vCard 보강 | socials(X-SOCIALPROFILE) · extraContacts(EMAIL/TEL/URL 추가 항목) · 아바타(PHOTO;VALUE=URI) · 영문 표기 포함 |
| P1-3 | profile.tagline | 앞면 한 줄 소개 필드 (스키마 + config + ProfileCard + parseConfigToState) |
| P1-4 | 다크모드 케스케이드 수정 | §3-2 — `generateNamecardPresetCss()` `:root:not(.dark)` 스코프 |

### P2 — 확장 (백로그)
- 미팅 예약 CTA (Calendly 등 — HiHello/Blinq 표준 기능)
- skills/전문분야 태그 chip (freelancer services 미니 버전)
- 글래스모피즘 designPreset (초대장 minimal-glass 이식)
- 샘플 콘텐츠 실사용화 (기본 인물·socials 2~3개 기본 활성 — 카페/초대장 커밋 패턴)

## 5. 검증

1. `npm run typecheck`
2. 모듈 에디터에서 프리셋 선택 → designPreset·fontFamily 반영 확인
3. 제너레이터 출력 미리보기 (config.ts / page.tsx / preset-override.css)
4. `parseConfigToState` 라운드트립 (배포 후 재편집 시 값 보존)
5. 다크모드 토글: 밝은 프리셋 적용 상태에서 토글 동작 확인
6. 디자인 변경분 `design-qa-reviewer` 검수 (선택)

## 6. 참고

- 오케스트레이션: `.claude/agents/oneclick-orchestrator.md`
- 유사 선례: 초대장 완성형 프리셋(`module-presets/invitation.ts`), 카페 SNS 실링크(bf3ae079)
- QR은 vCard 직접 인코딩이 아닌 **페이지 URL 기반 유지** (인식률 의사결정 존중)
