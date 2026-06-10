# 가이드 콘텐츠 전수 점검 (2026-06-11)

> 가이드 전체 최신화 · 초보자 고도화 작업의 점검 결과. 적용 현황과 후속 과제를 투명하게 기록한다.

## 범위
- **대상**: 메인 가이드 23개 + 서브 가이드 100+개 (정적 컴포넌트 한정 — DB `ServiceGuideSeed` 제외)
- **고도화 4종**: TL;DR(30초 요약) · 비유(AnalogyBox) · 흔한 실수(CommonMistakes) · 용어사전/FAQ

## 최신화(시간민감 콘텐츠) — 검증 출처·일자
- **검증일**: 2026-06-11 (공식 가격표·모델 카탈로그 기준)
- **AI 모델 라인업 반영**
  - Anthropic: Claude **Fable 5**($10/$50, 1M/128K), **Opus 4.8**($5/$25), Sonnet 4.6($3/$15, 1M/64K), Haiku 4.5($1/$5, 200K/64K)
  - OpenAI: **GPT-5.5**($5/$30), GPT-5.4($2.50/$15), GPT-5.4 nano($0.20/$1.25)
  - Google: **Gemini 3.1 Pro**($2/$18), **Gemini 3.5 Flash**($1.50/$9), 2.5 Flash-Lite($0.10/$0.40)
  - 오픈소스: **DeepSeek V4 Flash**($0.14/$0.28)·V4 Pro($1.74/$3.48, V3.2·R1 통합), Llama 4 Maverick($0.20/$0.60)
- **갱신 파일**: `ai-basics-guide/models-content.tsx`, `ai-basics-guide/ai-models-section.tsx`, `ai-basics-guide/ai-trends-content.tsx`, `ai-tools-guide/ai-api-content.tsx`, `ai-tools-guide/cursor-claude-content.tsx`, `openai-guide.tsx`, `app/guides/ai-basics/models/page.tsx`(FAQ JSON-LD)
- **객관성 처리**: 검증 불가 수치("SWE-bench 1위", "5.5배 토큰 효율") 완화, 가격에 "공식 가격표 기준" 명시, `lastUpdated` 갱신
- **버전**: Claude Code 권장 Node 18 → 20(LTS)

## TL;DR(30초 요약) 전수 적용 — 메인 23개

| # | 가이드 | TL;DR | 비고 |
|---|--------|:---:|------|
| 1 | ai-basics | ✅ | + 서브 cost-saving 신규 |
| 2 | ai-tools | ✅ | |
| 3 | frontend | ✅ | |
| 4 | package-manager | ✅ | |
| 5 | version-control | ✅ | |
| 6 | env | ✅ | FAQ 공통화 |
| 7 | api-basics | ✅ | |
| 8 | backend | ✅ | |
| 9 | auth | ✅ | 용어사전·FAQ 공통화 |
| 10 | design-ui | ✅ | |
| 11 | security | ✅ | 네이티브 흔한 실수 섹션 보유 |
| 12 | domain | ✅ | |
| 13 | server | ✅ | |
| 14 | deploy | ✅ | + 서브 post-deploy-checklist 신규 |
| 15 | troubleshooting | ✅ | **신규** 최상위 |
| 16 | communication | ✅ | |
| 17 | payment | ✅ | |
| 18 | monitoring | ✅ | |
| 19 | automation | ✅ | |
| 20 | github (setup) | ✅ | 위저드 hero↔stepper 사이 삽입 |
| 21 | cloudflare | ✅ | 위저드 hero↔stepper 사이 삽입(한글 직접) |
| 22 | openai | ✅ | 모델·가격 최신화 동반 |
| 23 | supabase | ✅ | 네이티브 흔한 실수 섹션 보유 |
| 24 | vercel | ✅ | |

## 4종 고도화 심화 적용 현황

| 가이드 | 비유 | 흔한 실수 | 용어/FAQ |
|--------|:---:|:---:|:---:|
| auth | ✅(용어사전 metaphor) | — | ✅ 용어사전+FAQ |
| env | — | △(가이드 본문) | ✅ FAQ |
| security | — | ✅ 네이티브 | △ |
| supabase / openai | — | ✅ 네이티브 pitfalls | — |
| **cost-saving (신규)** | ✅ AnalogyBox | ✅ CommonMistakes | ✅ FAQ |
| **post-deploy-checklist (신규)** | — | △(콜아웃) | ✅ FAQ |
| **troubleshooting (신규)** | — | ✅ 증상→원인→해결 | ✅ FAQ |

- TL;DR은 **전 메인 가이드 100% 적용**.
- 비유·흔한 실수·용어/FAQ는 **신규 3종 + 진입 핵심 가이드(auth/env/security/supabase/openai)** 위주로 심화 적용.
- 공통 키트(`AnalogyBox`·`CommonMistakes`·`GlossarySection`·`GuideCallout`)가 준비되어, 나머지 가이드 본문 섹션에 점진 삽입 가능.

## 후속 과제 (투명 기록 — 미적용 영역)
- 서브 가이드(100+개) 개별 본문에 비유·흔한 실수 박스 점진 삽입 (현재 TL;DR은 메인 단위, 서브는 신규 3종 중심)
- DB `ServiceGuideSeed`(50+ 서비스 설정 가이드) 최신화 — 이번 범위(정적 컴포넌트 한정)에서 제외
- AI 모델 콘텐츠 분기별 재검증 루틴화

## 검증
- `npm run typecheck` ✅ 통과
- `npm run lint` — 신규/수정 가이드 파일 **에러 0** (set-state-in-effect warning 1건은 기존 `env-guide/checklist-section.tsx`와 동일 패턴)
- 잔여 lint 에러 4건은 untracked 기존 파일 `mcp-setup-guide.tsx`(본 작업과 무관)
