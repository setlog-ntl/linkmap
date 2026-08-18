# 무료배포 자료 ↔ 유튜브 상호연결

무료배포 자료(`/resources`)와 유튜브 영상을 양방향으로 잇는 운영 규약.
자료는 영상보다 먼저 만들어지고 영상은 나중에 붙으므로, **영상이 없어도 자료가 완성품으로 서고,
영상이 생기면 코드 한 줄로 연결되는** 구조를 전제로 한다.

---

## 1. 구조

```
src/data/resources/free-resources.ts   ← 단일 진실 원천(SSOT)
   │
   ├─ /resources                       허브 카드 (영상 연결됨 / 영상 준비 중 배지)
   ├─ /resources/[slug]                상세 — 영상 카드·지시문·CTA
   ├─ sitemap.ts · llms.txt            검색·LLM 노출
   └─ public/resources/<slug>.html     오프라인 배포본 (역링크만 보유)
```

핵심은 **영상 상태를 자료 페이지 한 곳만 들고 있다**는 것. 오프라인 HTML과
유튜브 고정댓글은 자료 페이지의 정식 URL만 가리키므로, 영상이 붙거나 자료가
갱신돼도 배포된 파일·댓글을 다시 고칠 일이 없다.

| 방향 | 수단 | 갱신 지점 |
|---|---|---|
| Linkmap → 유튜브 | 상세 페이지 영상 카드 + `VideoObject` JSON-LD | `free-resources.ts` 한 곳 |
| 유튜브 → Linkmap | 영상 설명란·고정댓글의 정식 URL | 최초 1회, 이후 불변 |

---

## 2. 영상 발행 시 절차 (2단계)

### ① 유튜브 쪽 — 발행 전에 넣는다

영상 설명란 또는 고정댓글에 **자료 페이지 정식 URL**을 넣는다.
오프라인 HTML 파일 주소(`.../resources/<slug>.html`)를 직접 걸지 말 것 —
그 파일에는 영상 카드가 없어 상호연결이 한쪽만 성립한다.

```
https://www.linkmap.biz/resources/<slug>
```

> 유입 판별은 별도 파라미터 없이 된다. `PageTracker`가 `document.referrer`를
> 기록하므로 `visitor_logs.referrer`에 youtube.com이 남는다.
> UTM·쿼리스트링을 붙이지 말 것 — `page_path`는 pathname만 저장한다.

### ② Linkmap 쪽 — 발행 직후 두 줄

`src/data/resources/free-resources.ts`에서 해당 자료의 `youtube`를 채운다.

```ts
youtube: {
  videoId: 'AbC123dEfGh',        // ← null에서 실제 ID로
  title: '클로드 엑셀 — 매달 하던 파일 취합, 클릭 한 번으로 끝냈습니다',
  publishedAt: '2026-08-25',     // ← 추가 (VideoObject JSON-LD 조건)
  series: '바이브코딩 치트키 · 키/실전',
},
```

이걸로 아래가 한꺼번에 바뀐다.

- 상세 페이지: "영상 준비 중" 점선 카드 → 재생 카드 (유튜브 아웃링크)
- 허브 카드: "영상 준비 중" → "영상 연결됨"
- JSON-LD: `VideoObject` 추가 (`videoId` + `publishedAt`이 **둘 다** 있을 때만)

정적 페이지(`revalidate = false`)이므로 **배포해야 반영된다.**

---

## 3. 자료를 새로 추가할 때

1. `FREE_RESOURCES`에 항목 추가 — `order`는 배포자료 번호(허브 정렬 기준)
2. 오프라인 배포본이 있으면 `public/resources/<slug>.html`에 두고 `downloadHref` 지정
3. `scripts/warm-cache.sh`의 `PAGES`에 `/resources/<slug>` 추가
   (공개 페이지 워밍업 누락 시 첫 방문이 느려짐)

`sitemap.ts`·`llms.txt`는 `FREE_RESOURCES`를 순회하므로 별도 작업이 없다.

---

## 4. 오프라인 배포본 규칙

`public/resources/<slug>.html`은 **외부 요청 0건**이어야 한다 —
인터넷이 막힌 회사 PC에서 열리는 것이 이 파일의 존재 이유다.

- 로고는 data URI 배경(`.mark`)으로 **1벌만** 둔다.
  SVG를 두 번 인라인하면 `paint*_linear` gradient id가 충돌한다.
- 색은 `src/app/globals.css`의 토큰 값을 그대로 복사해 쓴다 (Tailwind 미사용).
  토큰이 바뀌면 이 파일도 손으로 맞춰야 한다.
- 폰트 CDN·아이콘 CDN 금지. 시스템 폰트 스택 + 인라인 SVG만.
- 영상 링크를 직접 넣지 말고 자료 페이지 역링크만 둔다 (§1 참조).

---

## 관련 문서

- 자료 데이터: `src/data/resources/free-resources.ts`
- 영상 업로드 메타(외부): `aitube/30_videos/<회차>/07_upload/업로드_메타.md`
