# 무료배포 자료 ↔ 유튜브 상호연결

무료배포 자료(`/resources`)와 유튜브 영상을 양방향으로 잇는 운영 규약.
자료는 영상보다 먼저 만들어지고 영상은 나중에 붙으므로, **영상이 없어도 자료가 완성품으로 서고,
영상이 생기면 코드 한 줄로 연결되는** 구조를 전제로 한다.

---

## 1. 구조

```
src/data/resources/free-resources.ts   ← 단일 진실 원천(SSOT)
   │
   ├─ /resources                       허브 카드 — 우측에 유튜브 버튼 / 영상 준비 중 칩
   ├─ /resources/[slug]                상세 — 지시문·CTA (영상 노출 안 함)
   ├─ sitemap.ts · llms.txt            검색·LLM 노출
   └─ public/resources/<slug>.html     오프라인 배포본 (역링크만 보유)
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
| Linkmap → 유튜브 | 허브 카드 우측 유튜브 버튼 | `free-resources.ts` 한 곳 |
| 유튜브 → Linkmap | 영상 설명란·고정댓글의 정식 URL | 최초 1회, 이후 불변 |

---

## 2. 영상 발행 시 절차 (2단계)

### ① 유튜브 쪽 — 발행 전에 넣는다

영상 설명란 또는 고정댓글에 **자료 페이지 정식 URL**을 넣는다.
오프라인 HTML 파일 주소(`.../resources/<slug>.html`)를 직접 걸지 말 것 —
그 파일은 헤더·푸터도 다른 자료로 가는 길도 없는 배포 산출물이고,
sitemap에도 없어 유입이 서비스로 이어지지 않는다.

```
https://www.linkmap.biz/resources/<slug>
```

> 유입 판별은 별도 파라미터 없이 된다. `PageTracker`가 `document.referrer`를
> 기록하므로 `visitor_logs.referrer`에 youtube.com이 남는다.
> UTM·쿼리스트링을 붙이지 말 것 — `page_path`는 pathname만 저장한다.

### ② Linkmap 쪽 — 발행 직후 한 줄

`src/data/resources/free-resources.ts`에서 해당 자료의 `videoId`를 채운다.
영상 URL이 `https://www.youtube.com/watch?v=AbC123dEfGh`라면 `v=` 뒤가 ID다.

```ts
youtube: {
  videoId: 'AbC123dEfGh',   // ← null에서 실제 ID로
  title: '클로드 엑셀 — 매달 하던 파일 취합, 클릭 한 번으로 끝냈습니다',
},
```

허브 카드 우측의 회색 "영상 준비 중" 칩이 빨간 유튜브 버튼(「영상 보기」,
새 탭)으로 바뀐다. `title`은 버튼의 툴팁·스크린리더 라벨로 쓰인다.

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
