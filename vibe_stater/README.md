# 바이브코딩 무작정따라하기 🎬

Claude Code의 **바이브코딩** 작업 흐름을, Linkmap의 **원클릭 배포(나만의 홈페이지)** 를 소재로 보여주는 교육용 영상 시리즈의 기획·대본·실습 자산 모음입니다.

> **한 줄 컨셉**: "말 한마디로 내 홈페이지가 만들어진다" — 코딩 경험 0인 사람도 따라 할 수 있는 바이브코딩 입문.

---

## 📂 폴더 인덱스

| 경로 | 내용 |
|------|------|
| [`planning/series-plan.md`](planning/series-plan.md) | 시리즈 전체 기획서 — 목표·타겟·포맷·회차 로드맵·녹화 가이드 |
| [`episodes/01-나만의-홈페이지.md`](episodes/01-나만의-홈페이지.md) | **1화 대본** — "나만의 홈페이지를 만들어줘" 프롬프트→해설→결과 |
| [`agent/vibe-starter.reference.md`](agent/vibe-starter.reference.md) | vibe-starter 서브에이전트 설명·설치본(사본) |
| [`demo/personal-brand-sample.html`](demo/personal-brand-sample.html) | **1화 결과물** — 원클릭 기본 페이지를 재현한 단일 HTML |
| [`demo/output/`](demo/output/) | 시연 중 생성하는 HTML을 저장하는 위치 |
| [`guide/민감정보-마스킹-가이드.md`](guide/민감정보-마스킹-가이드.md) | 녹화 시 가릴/보여줄 항목 + 마스킹 표기법 |

---

## 🤖 vibe-starter 서브에이전트

교육 진행을 돕는 **읽기전용** 서브에이전트입니다. 실제 동작본은 `.claude/agents/vibe-starter.md`에 설치되어 있습니다.

- **호출 트리거**: "바이브코딩", "무작정 따라하기", "나만의 홈페이지 만들어줘", "교육/강의" 등
- **역할**: ① 의도 해석 → ② 프롬프트 작성법 해설 → ③ 도구 흐름 시연(Read/Grep/Glob) → ④ 결과 구조 미리보기 → ⑤ HTML 산출물(텍스트) 반환
- **권한**: `Read`, `Grep`, `Glob`만 (파일 쓰기·실행 없음). 시크릿·키·PII는 항상 마스킹.
- **HTML 저장·브라우저 실행**은 메인 세션이 담당.

---

## ▶️ 1화 데모 빠르게 보기

브라우저로 결과물(원클릭 기본 페이지)을 바로 확인:

```powershell
# Windows
start vibe_stater\demo\personal-brand-sample.html
```

```bash
# macOS / Linux
open vibe_stater/demo/personal-brand-sample.html   # macOS
xdg-open vibe_stater/demo/personal-brand-sample.html # Linux
```

---

## ⚠️ 안전 수칙 (녹화 전 필독)

녹화 화면에는 **시크릿·키·`.env`·토큰·내부 절대경로·실제 이메일/실명**이 절대 보이면 안 됩니다.
자세한 내용은 [`guide/민감정보-마스킹-가이드.md`](guide/민감정보-마스킹-가이드.md) 참조.

> 이 폴더의 모든 데모 데이터는 가상값(예: `hello@example.com`, 템플릿 기본 이름 "이지원")입니다.
