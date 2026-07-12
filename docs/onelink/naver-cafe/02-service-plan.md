# 02. 네이버 카페 데이터 기반 홈페이지 생성 서비스 기획

> 작성일: 2026-07-12 · lastUpdated: 2026-07-12 · 상태: Phase 1 실증 완료

## 개요

네이버 플레이스에서 조회한 카페 데이터를 표준 데이터셋으로 정규화하고, 원클릭 카페 템플릿(small-biz-cafe)의 모듈에 결정적으로 매핑해 홈페이지를 생성한다. AI API 없이 동작하며, 수집 방식만 단계적으로 자동화한다.

```
네이버 플레이스 (링크/place id)
   → [수집] 표준 카페 데이터셋 (JSON)
   → [매핑] small-biz-cafe 모듈 값 (hero/about/menu/hours/location/gallery/sns)
   → [생성] 원클릭 배포 (결정적 치환 → GitHub Pages)
```

## ① 표준 카페 데이터셋 스키마

수집 방식과 무관하게 이 형태로 정규화한다. (필드는 small-biz-cafe 모듈 스키마와 1:1 대응 가능하도록 설계)

```json
{
  "source": {
    "naverPlaceId": "2007976823",
    "naverPlaceUrl": "https://map.naver.com/p/entry/place/2007976823",
    "collectedAt": "2026-07-12"
  },
  "name": { "ko": "카페 라이츠", "en": "Kafe Wrights" },
  "tagline": "모던한 인테리어와 어우러진 감성 카페",
  "category": "카페, 디저트",
  "address": {
    "road": "서울 광진구 동일로20길 114",
    "detail": "1,2,3층",
    "jibun": "서울 광진구 자양동 2-14",
    "en": "114, Dongil-ro 20-gil, Gwangjin-gu, Seoul"
  },
  "coordinate": { "lat": 37.5395656, "lng": 127.0695666 },
  "phone": "0507-1485-8892",
  "hours": [
    { "day": "매일", "open": "08:00", "close": "22:30", "lastOrder": "22:00", "isHoliday": false }
  ],
  "sns": { "instagram": "https://www.instagram.com/kafe.wrights", "naverBlog": "", "kakaoChannel": "" },
  "conveniences": ["단체 이용 가능", "포장", "무선 인터넷", "간편결제"],
  "transport": ["건대입구역 5번 출구 108m", "인근 공영주차장"],
  "menu": [
    {
      "category": "시그니처",
      "name": "라이츠라떼",
      "nameEn": "Wrights Latte",
      "price": "₩7,800",
      "desc": "우유베이스에 진한 에스프레소, 사과크림과 시나몬",
      "isPopular": true,
      "isNew": false
    }
  ]
}
```

## ② 네이버 플레이스 → small-biz-cafe 모듈 매핑 규칙

| 템플릿 모듈 | 네이버 소스 | 매핑 규칙 |
|------------|------------|-----------|
| **hero** (가게 정보) | 상호·한줄소개·전화 | `name`/`nameEn` ← 상호, `description` ← 한줄소개, `phone` ← 전화(스마트콜 0507 그대로 허용). 디자인 토큰(primaryColor/font)은 매핑하지 않음 — 템플릿 기본 유지 |
| **about** (소개) | AI 브리핑·리뷰 요약·업체 소개 | `stories` ← 공간·제품 특징을 2문단으로 재서술(리뷰 원문 복사 금지, 사실만 추출), `tags` ← 지역·업종 해시태그 5개, `values` ← 차별점 3개(아이콘+제목+설명) |
| **menu** (메뉴) | 메뉴 탭 `/menu/list` | 메뉴 배열 그대로, **maxItems 30**. 카테고리는 시그니처/커피/티·라떼/에이드 등으로 재분류, 대표 메뉴 → `isPopular`, 신메뉴·시즌 → `isNew`. 가격은 `₩N,NNN` 형식, 변동가는 `변동` |
| **hours** (영업시간) | 영업시간 펼쳐보기 | 요일별 7행. "매일 HH:MM–HH:MM"은 7요일로 전개, 휴무일 → `isHoliday: true`, 라스트오더는 hero의 `hoursNote`에 병기 |
| **location** (위치) | 주소·플레이스 링크 | `address`/`addressEn` ← 도로명, `naverPlaceUrl` ← `https://map.naver.com/p/entry/place/{placeId}` (신규 필드), `kakaoMapId`는 별도 확인 시만 |
| **gallery** (갤러리) | — | **네이버 이미지 무단 사용 금지.** 가게가 직접 촬영·제공한 이미지만 사용. 미제공 시 템플릿 기본(Unsplash placeholder) 유지, `galleryLabels`만 실제 공간에 맞게 수정 |
| **sns** | 홈페이지·SNS 링크 | `instagramUrl`/`naverBlogUrl`/`kakaoChannelUrl` — 플레이스에 등록된 링크만 |

### 매핑 시 공통 원칙

- **공개 정보만** 사용한다 (플레이스에 게시된 정보). 사업자등록번호 등 비공개 정보는 가상값 유지.
- 리뷰 텍스트는 **사실 추출 후 재서술** — 원문 복사 금지 (저작권·리뷰 운영정책).
- 모든 값은 결정적 치환으로 반영 — AI 생성은 어떤 단계에도 필수가 아님.

## ③ 수집 방식 3단계 로드맵

| 단계 | 방식 | 비용 | 상태 |
|------|------|------|------|
| **Phase 1 (현재)** | Claude Code 세션에서 플레이스 링크 조회(Playwright MCP) → 표준 데이터셋 추출 → [03-prompts.md](./03-prompts.md) 프롬프트로 템플릿 기본값 반영 | 0 | ✅ 카페라이츠 실증 완료 |
| **Phase 2** | 원클릭 위저드에 "네이버 플레이스 링크" 입력 필드 추가 + 사용자가 플레이스 페이지에서 복사·붙여넣기한 텍스트를 파싱하는 **결정적 파서** (메뉴·영업시간·주소 패턴 매칭) → 모듈 값 자동 채움 | 0 | 기획 |
| **Phase 3 (선택)** | 서버 자동 수집 검토 — ⚠️ 네이버 지역검색 API는 메뉴·영업시간 미제공, 플레이스 크롤링은 약관·robots 리스크로 **법적 검토 선행 필수**. AI 요약(소개문구 다듬기)은 선택 옵션으로만 (필수 경로 금지) | API 무료 쿼터 / 검토 필요 | 보류 |

Phase 2까지는 비용 0으로 도달 가능하며, Phase 3는 리스크 검토 결과에 따라 진행 여부를 결정한다.

## ④ 카페라이츠 실증 결과 (2026-07-12)

- 대상: 카페 라이츠 (place `2007976823`, 건대입구)
- 수집: `m.place.naver.com` 홈·메뉴 탭에서 상호/주소/좌표/영업시간/전화/SNS/편의시설 + **메뉴 14종(가격·설명 포함)** 추출 성공
- 매핑: 표준 데이터셋 → hero/about/menu/hours/location/sns 모듈과 1:1 매핑 확인 (gallery만 이미지 정책상 placeholder 유지)
- 데이터 스냅샷: [04-cafe-wrights-dataset.md](./04-cafe-wrights-dataset.md)
- 반영 파일: `src/data/oneclick/small-biz-cafe-template.ts`, `src/data/oneclick/module-schemas/small-biz-cafe.ts`, `src/lib/oneclick/generators/small-biz-cafe.ts`, `src/data/oneclick/template-sample-content.ts`
- 신규 필드: location 모듈 `naverPlaceUrl` — 네이버지도 버튼이 주소 검색이 아닌 정확한 플레이스 페이지로 연결

## 유의사항

1. **실존 업체 데이터**: 템플릿 기본 데모로 실존 카페 정보가 들어가므로, 신규 배포자가 편집하기 전까지 해당 가게 정보가 노출된다. 공개된 플레이스 정보만 사용하고, 데모 취지를 가게와 협의하는 것을 권장.
2. **이미지**: 네이버 플레이스의 업체·리뷰 이미지는 무단 사용 금지. 직접 촬영분 또는 라이선스 확보분만.
3. **가격·메뉴 시효성**: 수집일 기준 스냅샷 — 갱신은 P-2 프롬프트로 주기 실행.
