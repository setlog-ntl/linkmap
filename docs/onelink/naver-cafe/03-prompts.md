# 03. 재사용 프롬프트 모음

> 작성일: 2026-07-12 · lastUpdated: 2026-07-12
> 사용법: 아래 코드블록을 복사해 `{…}` 자리만 채워 Claude Code 세션에 입력한다. 모두 AI API 비용 없이 세션 내에서 동작한다.

## 공통 주의사항

- 네이버 플레이스 조회 경로: `https://m.place.naver.com/restaurant/{placeId}/home` (기본 정보·영업시간), `https://m.place.naver.com/restaurant/{placeId}/menu/list` (메뉴 전체). place id는 지도 URL의 `/place/{숫자}` 부분.
- **크롬 확장(claude-in-chrome)이 네이버 접근을 차단하면 Playwright MCP**(`mcp__playwright__browser_navigate` 등)를 사용한다. (2026-07-12 실증 시에도 Playwright로 우회)
- 영업시간은 접혀 있으므로 "펼쳐보기" 클릭 후 읽는다.
- 리뷰 원문 복사 금지 — 사실만 추출해 재서술. 네이버 이미지 사용 금지.
- 검증 없이 완료 보고 금지 — 각 프롬프트의 검증 명령까지 통과해야 완료.

---

## P-1. 신규 카페 온보딩 (플레이스 링크 → 템플릿 기본값 교체)

새 카페를 데모/기본값으로 온보딩할 때 사용. 기존 가게 데이터를 전면 교체한다.

```text
네이버 플레이스 링크 {네이버 지도 URL 또는 place id}를 브라우저(Playwright MCP)로 조회해서
docs/onelink/naver-cafe/02-service-plan.md의 "표준 카페 데이터셋 스키마" 형식으로 추출하고,
small-biz-cafe 템플릿의 기본값을 이 카페 데이터로 교체해줘.

수정 파일 (4개):
1. src/data/oneclick/small-biz-cafe-template.ts
   - siteConfig (name/nameEn/description/heroCategory/phone/address/addressDetail/addressEn/hoursNote/footerTagline/naverPlaceUrl)
   - DEMO_MENU (기존 MenuItem 인터페이스 유지: category/name/nameEn/desc/descEn/price/emoji/isNew/isPopular)
   - DEMO_HOURS (요일별 7행)
   - aboutStories/aboutTags/aboutValues/transportBadges/galleryLabels
   - AboutSection fallback 문자열, 갤러리 섹션 설명, 파일 헤더 주석
2. src/data/oneclick/module-schemas/small-biz-cafe.ts — 모든 defaultValue 동기화
   (hero.name, about.stories/tags/values, menu.items, hours.items, location.address/addressEn/naverPlaceUrl, sns.instagramUrl)
3. src/lib/oneclick/generators/small-biz-cafe.ts — 기본값 (name/nameEn/description/descriptionEn/phone/address/addressEn)
   ※ primaryColor 등 디자인 토큰은 변경 금지
4. src/data/oneclick/template-sample-content.ts — smallBizCafeSample.ko만 동기화

규칙:
- 메뉴 카테고리는 시그니처/커피/티·라떼/에이드 등으로 재분류, 대표 메뉴 isPopular, 시즌 메뉴 isNew
- 매일 영업이면 7요일 전개, 라스트오더는 hoursNote에 병기
- 공개 정보만 사용, businessNumber는 기존 가상값 유지, 네이버 이미지 사용 금지(galleryLabels만 수정)
- 수집 데이터 스냅샷을 docs/onelink/naver-cafe/에 04 형식(04-{카페슬러그}-dataset.md)으로 저장

검증:
- npm run typecheck && npm run lint 통과
- 이전 가게명(예: "카페 라이츠") 잔존 Grep 0건 (src/ 하위, docs 제외)
- npm run dev → /oneclick 카페 템플릿 프리뷰에서 새 데이터 확인
```

## P-2. 데이터 갱신 (메뉴·가격·영업시간 최신화)

이미 온보딩된 카페의 시효성 데이터만 갱신할 때 사용. 가게명·소개·주소는 건드리지 않는다.

```text
현재 small-biz-cafe 템플릿의 기본 카페({현재 카페명}, place {placeId})의
메뉴·가격·영업시간을 네이버 플레이스 최신값으로 갱신해줘.

절차:
1. https://m.place.naver.com/restaurant/{placeId}/menu/list 와 /home의 영업시간(펼쳐보기)을 조회
2. docs/onelink/naver-cafe/04-{카페슬러그}-dataset.md 스냅샷과 비교해 변경분만 정리 (가격 변동/신메뉴/단종/영업시간 변경)
3. 변경분만 반영:
   - src/data/oneclick/small-biz-cafe-template.ts의 DEMO_MENU·DEMO_HOURS·hoursNote
   - src/data/oneclick/module-schemas/small-biz-cafe.ts의 menu.items·hours.items defaultValue
   - src/data/oneclick/template-sample-content.ts의 smallBizCafeSample.ko 메뉴
4. 04 데이터셋 문서의 해당 표와 수집일(lastUpdated)을 갱신

주의: 가게명/소개/주소/SNS/디자인 토큰은 수정 금지. 변경분 요약(전/후 표)을 보고에 포함.

검증: npm run typecheck && npm run lint 통과
```

## P-3. 데이터셋만 추출 (코드 미수정)

후보 카페를 검토하거나 스냅샷만 남길 때 사용. **src/ 코드는 수정하지 않는다.**

```text
네이버 플레이스 링크 {네이버 지도 URL 또는 place id}를 브라우저(Playwright MCP)로 조회해서
카페 데이터를 추출하고, docs/onelink/naver-cafe/04-cafe-wrights-dataset.md와 같은 형식으로
docs/onelink/naver-cafe/04-{카페슬러그}-dataset.md 파일만 만들어줘. src/ 코드는 수정하지 마.

포함할 것: 기본 정보(상호 ko/en·카테고리·한줄소개·주소·좌표·교통·영업시간·전화·SNS·편의시설·플레이스 링크),
메뉴 전체 표(카테고리 재분류·영문명·가격·설명·대표/신메뉴 표시), small-biz-cafe 모듈 매핑안,
수집일과 출처 URL.
```

---

## 프롬프트 유지보수

- 템플릿 파일 구조가 바뀌면(모듈 스키마 개편 등) P-1/P-2의 "수정 파일" 목록을 갱신할 것.
- Phase 2(위저드 링크 입력 필드)가 구현되면 P-1은 개발용, 위저드는 사용자용으로 역할이 분리된다 — [02-service-plan.md](./02-service-plan.md) 로드맵 참조.
