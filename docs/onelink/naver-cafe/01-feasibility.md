# 01. 비용/AI 의존성 검토 (Feasibility)

> 작성일: 2026-07-12 · lastUpdated: 2026-07-12 · 상태: 검토 완료

## 판정

**AI API·별도 비용 없이 원클릭 배포 생성 가능.**

원클릭 배포 파이프라인은 순수 결정적(deterministic) 템플릿 치환 방식이며, 외부 유료 API를 일절 호출하지 않는다. 필요한 것은 사용자의 GitHub 계정(OAuth)뿐이다.

## 근거 1 — 파이프라인에 AI import 0건

`src/lib/oneclick/` 및 `src/app/api/oneclick/` 전체에서 OpenAI/AI 관련 import가 한 건도 없다. AI 코드(`src/lib/ai/`, `src/lib/openai/`)는 `src/app/api/ai/*`(chat, cost-report 등)·admin ai-playground·health-check 어댑터에서만 사용되며, 원클릭 파이프라인과 완전히 분리되어 있다. 소개문구 자동생성 같은 선택 기능조차 원클릭 경로에는 연결되어 있지 않다.

### 파이프라인 흐름 (deploy 기준)

```
src/app/api/oneclick/deploy/route.ts
  ① 인증 + 쿼터 사전 체크
  ② DB에서 템플릿 메타 + GitHub 서비스 조회
  ③ GitHub OAuth 토큰 복호화 (workflow 스코프 검증)
  ④ getTemplateBySlug() — 번들된 템플릿 콘텐츠 로드 (하드코딩 문자열)
  ⑤ GitHub repo 생성 (이름 충돌 시 자동 채번)
  ⑥ GitHub Pages(Actions) 활성화
  ⑦ pushFilesAtomically() — 템플릿 파일 원자적 커밋 push
  ⑧ DB project/deploy 레코드 원자적 생성 (RPC)
  → GitHub Actions가 next build 후 Pages 배포
```

- 코드 생성부(`src/lib/oneclick/code-generator.ts`, `generators/base-generator.ts`): 사용자 값을 `esc()` 이스케이프 후 정규식/문자열 치환으로 `config.ts`·`page.tsx` 생성 — LLM 호출 없음.
- 편집 반영(`/api/oneclick/deployments/[id]/batch-update`): 에디터에서 생성한 파일을 GitHub에 push — LLM 호출 없음.

## 근거 2 — 외부 비용 요소 전무

| 항목 | 비용 | 비고 |
|------|------|------|
| GitHub API (repo 생성/push/Pages 활성화) | 무료 | OAuth 사용자 계정 |
| GitHub Actions 빌드 (`npm ci` + `next build`) | 무료 | 공개 repo |
| GitHub Pages 호스팅 | 무료 | |
| Pretendard 폰트 CDN (jsdelivr) | 무료 | 생성 사이트 런타임 |
| AI API | **해당 없음** | 파이프라인에 미사용 |

## 제약 — 배포 개수 쿼터 (비용 아님)

- `src/lib/quota.ts` — `checkHomepageDeployQuota()`가 `homepage_deploys` 행 수를 `max_homepage_deploys`와 비교.
- Free 플랜 기본 **3개** (`DEFAULT_QUOTA.max_homepage_deploys: 3`), 관리자 무제한, 플랜별 값은 `plan_quotas` 테이블.
- 이는 생성 단가가 아니라 리소스 개수 제한 — 데모 진행에 지장 없음.

## 데이터 수집 비용

| 방식 | 비용 | 한계 |
|------|------|------|
| **Phase 1 (현재)**: Claude Code 세션 내 브라우저 조회 (Playwright MCP) | 추가 비용 0 (기존 세션 사용) | 수동/반자동 — 사람이 세션에서 실행 |
| 네이버 지역검색 API (자동화 시) | 무료 쿼터 25,000건/일 | **메뉴·영업시간 미제공** (상호·주소·링크만) |
| 플레이스 페이지 크롤링 (자동화 시) | 서버 비용만 | **약관·robots 리스크 — 반드시 별도 법적 검토 필요** |

Phase 1 데모는 세션 내 브라우저 조회로 충분하며 비용이 발생하지 않는다. 서버 자동 수집(Phase 3)은 네이버 API의 데이터 한계와 크롤링 약관 리스크를 함께 검토한 뒤에만 진행한다 — [02-service-plan.md](./02-service-plan.md) 로드맵 참조.

## 결론

- 생성 파이프라인: AI 의존 없음 → **비용 0**
- 호스팅/빌드: GitHub 무료 티어 → **비용 0**
- 데이터 수집(Phase 1): 세션 내 브라우저 → **비용 0**

카페라이츠 데모는 즉시 진행 가능하다.
