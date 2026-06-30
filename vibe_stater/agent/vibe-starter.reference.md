# vibe-starter 서브에이전트 — 설명 & 설치본(사본)

> ⚠️ 이 파일은 **설명용 사본**입니다. 실제로 Claude Code가 로드하는 동작본은
> **`.claude/agents/vibe-starter.md`** 에 있습니다. 정의를 바꾸려면 그 파일을 수정하세요.

---

## 1. 한눈에

| 항목 | 값 |
|------|------|
| 이름 | `vibe-starter` |
| 역할 | 바이브코딩 교육 진행자/해설자 |
| 권한(tools) | `Read`, `Grep`, `Glob` (읽기전용) |
| 모델 | `sonnet` |
| 동작본 위치 | `.claude/agents/vibe-starter.md` |

## 2. 어떻게 호출되나

다음 같은 입력에서 자동 선택된다(트리거 키워드):
- "바이브코딩", "무작정 따라하기", "vibe starter"
- "나만의 홈페이지 만들어줘"
- "교육", "강의"

직접 지정해 호출할 수도 있다(메인 세션에서 Agent 도구 `subagent_type: vibe-starter`).

## 3. 무엇을 하나 (5단계)

1. **의도 해석** — 시청자의 한 마디를 작업으로 번역해 설명
2. **프롬프트 작성법 해설** — 좋은 프롬프트 팁 제시
3. **도구 흐름 시연** — `Glob`/`Grep`/`Read`로 실제 템플릿 구조를 짚어줌(요약만)
4. **결과 구조 미리보기** — Hero/About/Values/Highlights/Contact 기본값을 표로 정리
5. **산출물 반환** — 최종 HTML을 코드블록 텍스트로 제시

## 4. 경계(중요)

- **파일을 쓰지 않는다.** HTML 저장·브라우저 실행은 **메인 세션**의 몫.
  - 저장: `vibe_stater/demo/output/`
  - 실행: `start vibe_stater\demo\output\<파일>.html` (Windows)
- **민감정보를 노출하지 않는다.** `.env`·키·토큰·crypto/audit 파일·PII·내부 절대경로는 읽지도, 출력하지도 않는다.
- 실제 GitHub Pages 배포는 시연 범위 밖 — 로컬 standalone HTML로만 결과를 보여준다.

## 5. 참조 파일 화이트리스트

| 목적 | 경로 |
|------|------|
| 미리보기 HTML 생성기(섹션 구조) | `src/lib/oneclick/preview/personal-brand.ts` |
| 디자인 토큰·CSS·HTML 쉘 | `src/lib/oneclick/preview/base.ts` |
| 모듈 스키마(기본값·필드) | `src/data/oneclick/module-schemas/personal-brand.ts` |
| 색상 프리셋(10종) | `src/data/oneclick/module-presets/personal-brand.ts` |
| 코드 제너레이터 | `src/lib/oneclick/generators/personal-brand.ts` |
| 1화 데모 결과물 | `vibe_stater/demo/personal-brand-sample.html` |

## 6. 수정 가이드

- 트리거 키워드를 늘리려면 동작본 frontmatter의 `description`에 단어를 추가.
- 새 회차(템플릿)를 다루려면 화이트리스트에 해당 템플릿 경로를 추가하고, 플레이북 섹션을 본문에 보강.
- **권한은 읽기전용 유지**가 원칙(교육 안전). 쓰기 작업이 필요하면 메인 세션에 위임.

## 7. 동작 확인

1. Claude Code에서 에이전트 목록에 `vibe-starter`가 보이는지 확인.
2. "나만의 홈페이지를 만들어줘" 입력 시 `vibe-starter`가 선택되는지 확인.
3. 출력에 시크릿·PII·내부 절대경로가 없는지 점검.
