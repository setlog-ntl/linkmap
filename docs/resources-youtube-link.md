# 무료배포 자료 ↔ 유튜브 상호연결

무료배포 자료(`/resources`)와 유튜브 영상을 양방향으로 잇는 운영 규약.
자료는 영상보다 먼저 만들어지고 영상은 나중에 붙으므로, **영상이 없어도 자료가 완성품으로 서고,
영상이 생기면 코드 한 줄로 연결되는** 구조를 전제로 한다.

---

## 1. 구조

```
DB free_resources 테이블 (M110)         ← 단일 진실 원천(SSOT) · /admin/resources 에서 편집
   │
   ├─ /resources                       허브 카드 — 상단 썸네일 + 우측 유튜브 버튼 / 영상 준비 중 칩
   ├─ /resources/[slug]                상세 — 지시문·CTA (영상 노출 안 함)
   ├─ sitemap.ts · llms.txt            검색·LLM 노출
   └─ public/downloads/<slug>.html     오프라인 배포본 (역링크만 보유)
```

핵심은 **영상 상태를 데이터 한 곳만 들고 있다**는 것. 오프라인 HTML과
유튜브 고정댓글은 자료 페이지의 정식 URL만 가리키므로, 영상이 붙거나 자료가
갱신돼도 배포된 파일·댓글을 다시 고칠 일이 없다.

**영상 진입점은 허브 카드 하나뿐이다.** 상세 페이지는 자료 본문(지시문·CTA)만
다루고 영상을 노출하지 않는다 — 자료를 쓰러 온 사람의 흐름을 영상으로
끊지 않기 위함. 같은 이유로 상세에 `VideoObject` JSON-LD도 붙이지 않는다
(화면에 없는 영상을 구조화 데이터로 선언하면 실제 콘텐츠와 어긋난다).

| 방향 | 수단 | 갱신 지점 |
|---|---|---|
| Linkmap → 유튜브 | 허브 카드 상단 썸네일 · 우측 유튜브 버튼 | 관리자 화면(`/admin/resources`) 한 곳 |
| 유튜브 → Linkmap | 영상 설명란·고정댓글의 정식 URL | 최초 1회, 이후 불변 |

---

## 2. 영상 발행 시 절차 (2단계)

### ① 유튜브 쪽 — 발행 전에 넣는다

영상 설명란 또는 고정댓글에 **자료 페이지 정식 URL**을 넣는다.
오프라인 HTML 파일 주소(`.../downloads/<slug>.html`)를 직접 걸지 말 것 —
그 파일은 헤더·푸터도 다른 자료로 가는 길도 없는 배포 산출물이고,
sitemap에도 없어 유입이 서비스로 이어지지 않는다.

```
https://www.linkmap.biz/resources/<slug>
```

> 유입 판별은 별도 파라미터 없이 된다. `PageTracker`가 `document.referrer`를
> 기록하므로 `visitor_logs.referrer`에 youtube.com이 남는다.
> UTM·쿼리스트링을 붙이지 말 것 — `page_path`는 pathname만 저장한다.

### ② Linkmap 쪽 — 발행 직후 한 칸

관리자로 로그인해 `/resources` 상단 관리자 바 → 「자료 관리」 → 해당 자료 「편집」에서
**유튜브 연결 › 영상 ID 또는 URL** 칸을 채우고 저장한다. 영상 URL을 그대로 붙여 넣어도
된다 — 칸을 벗어나면 `watch?v=` · `youtu.be` · `shorts` 어느 형태든 11자 ID만 남는다.
「영상 제목」 칸은 버튼 툴팁·썸네일 alt에 쓰이므로 함께 채운다.

허브 카드 우측의 회색 "영상 준비 중" 칩이 빨간 유튜브 버튼(「영상 보기」,
새 탭)으로 바뀌고, 카드 상단에 영상 썸네일이 붙는다(클릭 시 유튜브 새 탭).
`title`은 버튼 툴팁·썸네일 alt·스크린리더 라벨로 쓰인다.

썸네일은 `https://i.ytimg.com/vi/<videoId>/hqdefault.jpg`를 그대로 쓴다 —
별도 이미지 파일을 저장하지 않으므로 유튜브에서 썸네일을 바꾸면 그대로 따라온다.
`hqdefault`는 모든 영상에 항상 있고(`maxresdefault`는 없는 영상이 있다), 4:3 프레임의
상하 검은 띠는 카드가 16:9로 잘라 감춘다. 이 도메인은 `next.config.ts` CSP
`img-src`에 허용돼 있으니 지우지 말 것.

공개 페이지는 ISR(`revalidate = 60`)이므로 **저장 후 1분 내 반영된다. 배포는 필요 없다.**
(`revalidatePath`는 OpenNext tagCache 미설정으로 동작하지 않아 시간 기반만 쓴다.)

---

## 3. 자료를 새로 추가할 때

관리자 화면 `/admin/resources` → 「새 자료 추가」. 기존 자료를 바탕으로 만들려면 목록의
「템플릿으로 복제」를 누르면 구성(히어로·지시문 블록·바로가기·마무리)이 그대로 복사되고
slug·영상·발행 상태만 비워진 채 시작한다.

1. **slug**는 발행 후 바꾸지 않는다 — 유튜브 고정댓글·오프라인 배포본이 이 URL을 가리킨다.
2. **자료 번호**(sort_order)가 "자료 N번" 표기이자 허브 정렬 기준. 새 자료는 다음 번호가 제안된다.
3. 본문을 다 채운 뒤 **「공개 페이지에 발행」** 스위치를 켠다. 꺼져 있으면 `/resources`·sitemap·llms.txt
   어디에도 나오지 않는다(RLS). 목록에서 스위치로 바로 켜고 끌 수도 있다.
4. 오프라인 배포본이 있으면 저장소 **`public/downloads/<slug>.html`**에 커밋·배포하고,
   편집기의 「배포본 경로」에 `/downloads/<slug>.html`을 적는다 — 이 파일만은 코드 배포가 필요하다.
   `public/resources/` 아래에 두면 안 된다 (§4의 라우트 가림 함정). 비워 두면 내려받기 섹션이 숨겨진다.
5. (선택) `scripts/warm-cache.sh`의 `PAGES`에 `/resources/<slug>` 추가 — 배포 직후 첫 방문 속도용.

`sitemap.ts`·`llms.txt`는 발행된 자료를 DB에서 읽으므로(1시간 ISR) 별도 작업이 없다.

---

## 4. 오프라인 배포본 규칙

`public/downloads/<slug>.html`은 **외부 요청 0건**이어야 한다 —
인터넷이 막힌 회사 PC에서 열리는 것이 이 파일의 존재 이유다.

> 🚨 **`public/resources/` 아래에 두지 말 것.** Workers는 정적 자산을 라우트보다
> 먼저 매칭하고 `.html`을 확장자 없이도 서빙한다. `public/resources/<slug>.html`은
> Next 라우트 `/resources/<slug>`를 통째로 가려, 정식 URL이 헤더·푸터도 없는
> 배포본을 서빙하게 된다. 로컬 `next dev`에서는 재현되지 않아 배포 후에야 드러난다
> (2026-08-18 실측). 배포본은 `/downloads/` 네임스페이스에 격리한다.

- 로고는 data URI 배경(`.mark`)으로 **1벌만** 둔다.
  SVG를 두 번 인라인하면 `paint*_linear` gradient id가 충돌한다.
- 색은 `src/app/globals.css`의 토큰 값을 그대로 복사해 쓴다 (Tailwind 미사용).
  토큰이 바뀌면 이 파일도 손으로 맞춰야 한다.
- 폰트 CDN·아이콘 CDN 금지. 시스템 폰트 스택 + 인라인 SVG만.
- 영상 링크를 직접 넣지 말고 자료 페이지 역링크만 둔다 (§1 참조).
- 역링크 카드는 **본문(지시문) 아래, 푸터 직전**에 둔다. 이 파일을 여는 사람은
  자료를 쓰러 온 것이므로 본문이 먼저 와야 한다.

---

## 관련 문서

- 자료 데이터: DB `free_resources` (M110) — 편집은 `/admin/resources`, 타입 `src/types/resource.ts`, 서버 읽기 `src/lib/resources/queries.ts`
- 표시 상수·URL 헬퍼: `src/data/resources/free-resources.ts`
- 영상 업로드 메타(외부): `aitube/30_videos/<회차>/07_upload/업로드_메타.md`
