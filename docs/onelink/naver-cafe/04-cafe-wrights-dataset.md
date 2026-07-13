# 04. 카페 라이츠 수집 데이터 스냅샷

> 수집일: 2026-07-12 · lastUpdated: 2026-07-12 (당일 Playwright 재검증 — 전화·주소·영업시간·메뉴 14종 이름·가격 전부 일치 확인, 대표 뱃지·블로그 URL 2건 보정)
> 출처: https://m.place.naver.com/restaurant/2007976823/home · https://m.place.naver.com/restaurant/2007976823/menu/list
> 용도: [03-prompts.md](./03-prompts.md) P-1 프롬프트의 입출력 예시 겸 기준 스냅샷 (P-2 갱신 시 이 문서와 비교)

## 기본 정보

| 항목 | 값 |
|------|-----|
| 상호 | 카페 라이츠 (Kafe Wrights) |
| 네이버 place id | `2007976823` |
| 플레이스 링크 | https://map.naver.com/p/entry/place/2007976823 |
| 카테고리 | 카페, 디저트 — 1~3층 대형 베이커리 카페, 지하 베이커리 스튜디오 직접 베이킹, 페스츄리 주력 |
| 한줄소개 | 모던한 인테리어와 어우러진 감성 카페 |
| 도로명주소 | 서울 광진구 동일로20길 114 1,2,3층 |
| 지번주소 | 서울 광진구 자양동 2-14 |
| 영문주소 | 114, Dongil-ro 20-gil, Gwangjin-gu, Seoul |
| 좌표 | 37.5395656, 127.0695666 |
| 교통 | 건대입구역 5번 출구 108m (자양역 방면 직진 → LGU+ 우회전) / 차량은 인근 공영주차장 |
| 영업시간 | 매일 08:00–22:30 (22:00 라스트오더, 휴무 없음) |
| 전화 | 0507-1485-8892 (스마트콜) |
| SNS | 인스타 https://www.instagram.com/kafe.wrights · 블로그 https://blog.naver.com/kafewrights_ · 유튜브 https://www.youtube.com/@kafe.wrights (2026-07-13 sns 모듈에 `youtubeUrl` 필드 추가 완료 — 3종 모두 템플릿 기본값 반영) |
| 편의시설 | 단체 이용 가능, 포장, 무선 인터넷, 간편결제 |
| 리뷰 수 | 939 (수집일 기준) |

## 메뉴 14종 (템플릿 카테고리 매핑 완료)

| 카테고리 | 메뉴 | 영문 | 가격 | 설명(네이버 원문 기반) | 표시 |
|---|---|---|---|---|---|
| 시그니처 | 라이츠라떼 | Wrights Latte | ₩7,800 | 우유베이스+에스프레소, 사과크림·시나몬 | isPopular |
| 시그니처 | 크랑떼 | Crangtte | ₩4,800 | 크루아상 결 페이스트리, 버터 풍미 | isPopular |
| 시그니처 | MONTHLY PAIRING | Monthly Pairing | 변동 | 월간 페어링 (샌드위치+에이드 등) | isPopular·isNew |
| 커피 | 플랫화이트 | Flat White | ₩6,300 | 크리미한 우유와 진한 에스프레소 | |
| 티·라떼 | 썬셋피치 | Sunset Peach | ₩7,800 | 복숭아+아쌈 | |
| 티·라떼 | 유자민트브리즈 | Yuzu Mint Breeze | ₩7,800 | 고흥 유자+페퍼민트 | |
| 티·라떼 | 보성말차라떼 | Boseong Matcha Latte | ₩8,000 | 보성 말차 | |
| 티·라떼 | 얼그레이 베일 밀크티 | Earl Grey Veil Milk Tea | ₩7,500 | 얼그레이+바닐라 | |
| 티·라떼 | 스트로베리라떼 | Strawberry Latte | ₩7,500 | 딸기 과육 라떼 | |
| 티·라떼 | 다크초콜릿 | Dark Chocolate | ₩7,500 | 초콜릿 라떼 | |
| 에이드 | 피치블루밍 | Peach Blooming | ₩7,500 | 복숭아+패션후르츠 | |
| 에이드 | 레몬에이드 | Lemon Ade | ₩7,000 | 스파클링 | |
| 에이드 | 자몽에이드 | Grapefruit Ade | ₩7,000 | 스파클링 | |
| 에이드 | 라임에이드 | Lime Ade | ₩7,000 | 스파클링 | |

※ 가격 표기: 네이버 원문은 `7,800원`, 템플릿은 `₩7,800` 형식. 변동가는 `변동`.

## 템플릿 매핑안 (hero/about/기타)

| 템플릿 필드 | 값 |
|------|-----|
| heroCategory | 건대입구 대형 베이커리 카페 |
| hoursNote | 라스트오더 22:00 · 연중무휴 |
| footerTagline | Bakery & Coffee |
| aboutTags | #건대입구 #베이커리카페 #페스츄리 #대형카페 #시그니처음료 |
| aboutValues | 🥐 매일 굽는 베이커리 (지하 스튜디오 직접 베이킹) / ☕ 시그니처 음료 / 🏢 층별로 다른 공간 (1~3층) |
| transportBadges | 🚇 건대입구역 5번 출구 도보 2분(108m) / 🚗 인근 공영주차장 이용 |
| galleryLabels | 카페 인테리어 / 베이커리 진열대 / 시그니처 음료 / 좌석 공간 |
| location.naverPlaceUrl | https://map.naver.com/p/entry/place/2007976823 |
| businessNumber | 가상값 유지 (`123-45-67890`) — 비공개 정보 미수집 원칙 |
| galleryImages | 템플릿 기본(Unsplash placeholder) 유지 — 네이버 이미지 사용 금지 |
| primaryColor / fontFamily | 템플릿 기본 유지 — 디자인 토큰은 매핑 범위 밖 |

## 온기 로스터리 잔존 위치 (의도적 미수정)

src/ 코드의 온기 로스터리 데이터는 카페 라이츠로 교체되었으나, 아래 **문서류는 의도적으로 수정하지 않음** (과거 기획·프리뷰 기록 보존):

- `docs/onelink/preview/small-biz-cafe.html` — 정적 미리보기 HTML (온기 로스터리 기준으로 생성된 과거 산출물)
- `docs/onelink/10-premium-implementation-plan.md:228` — "온기 로스터리 / Ongi Roastery" 예시 언급
- `docs/onelink/template/template-small-biz.md` — 필드 문서 예시 ("온기 베이커리" — 별개 예시명)

이 문서들은 기록물이므로 P-2 갱신 대상도 아니다.
