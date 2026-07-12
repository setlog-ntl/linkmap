# 카페 원클릭배포 고도화 — 네이버 플레이스 기반 자동 생성 (초안)

> ⚠️ **이 문서는 최초 기획 초안입니다. 최신 내용은 [naver-cafe/](./naver-cafe/README.md) 폴더(01~04)를 참조하세요.** Phase 1(카페 라이츠 기본값 교체 + naverPlaceUrl + 피커 노출 순서)은 2026-07-12 완료.
> 상태: **기획 초안 (Draft)** / 대상 템플릿: `small-biz-cafe` (카페·음료 전문점)
> 목적: 네이버 플레이스 링크 1개로 위치·메뉴·정보를 채워 카페 홈페이지를 무료·무AI로 생성
> 최종 갱신: 2026-07-12

---

## 0. 결론 먼저 — 타당성 검토 (AI API·별도 비용 없이 가능한가?)

| 항목 | 가능 여부 | 근거 |
|------|-----------|------|
| **원클릭 홈페이지 생성·배포** | ✅ 완전 가능 (무AI·무비용) | 순수 프리셋 + 문자열 코드 제너레이터. GitHub API로 새 레포 push → GitHub Pages(무료) 배포. LLM 호출 0건 |
| **네이버 데이터 → 폼 자동 채우기** | ✅ 가능 (무AI·무비용, 단 주의사항) | 네이버 플레이스 모바일 페이지(`m.place.naver.com`)에 메뉴·주소·영업시간이 **정적 JSON/HTML로 포함**되어 있어 서버사이드 파싱으로 추출 가능. AI 불필요, 결정론적 파싱 |
| 완전 자동(원클릭 스크래핑 상시) | ⚠️ 조건부 | 스크래핑은 네이버 마크업 변경에 취약 + ToS 고려 필요. **데모/초안 단계에서는 충분**하나, 상용화 시 네이버 검색 OpenAPI(무료·기본필드만) 병행 권장 |

**핵심 결론:** AI API도, 유료 서비스도 필요 없습니다. 홈페이지 생성 파이프라인은 이미 무AI·무비용으로 동작하며, 네이버 데이터 주입도 "링크 → 서버 파싱 → 모듈 폼 프리필" 방식으로 무AI·무비용 구현이 가능합니다. **초안(데모) 진행 가능합니다.**

### 현재 생성 파이프라인 (근거)
- 템플릿 = 하드코딩된 완성형 Next.js 프로젝트 파일 (`src/data/oneclick/small-biz-cafe-template.ts`)
- 코드 생성 = 순수 문자열 치환 (`src/lib/oneclick/generators/small-biz-cafe.ts`, `base-generator.ts`)
- 배포 = GitHub REST API push → GitHub Actions static export → GitHub Pages (`src/app/api/oneclick/deploy/route.ts`)
- `deploy_target: 'github_pages'` (무료), AI/LLM import 0건

---

## 1. 레퍼런스 실데이터 — 카페 라이츠 (네이버 플레이스)

- 출처: `m.place.naver.com/restaurant/2007976823` (placeId `2007976823`)
- 조회일: 2026-07-12

| 필드 | 값 |
|------|-----|
| 상호 | 카페 라이츠 (Kafe Wrights) |
| 카테고리 | 카페, 디저트 |
| 한줄 소개 | 모던한 인테리어와 어우러진 감성 카페 |
| 주소 | 서울 광진구 동일로20길 114 1,2,3층 |
| 오시는 길 | 건대입구역 5번 출구 → 자양역 방면 직진 → LGU+ 우회전 |
| 영업 | 22:00 라스트오더 (영업 중) |
| 인스타그램 | https://www.instagram.com/kafe.wrights |
| SNS | 유튜브·블로그 존재 |
| 리뷰 | 939건 |

### 메뉴 (네이버 등록 기준)
| 카테고리 | 메뉴 | 가격 | 설명 | 뱃지 |
|---------|------|------|------|------|
| 시그니처 | 라이츠라떼 | ₩7,800 | 우유베이스에 진한 에스프레소, 사과크림과 시나몬 | 대표 |
| 디저트 | 크랑떼 | ₩4,800 | 크루아상 결에 버터 풍미, 바삭한 페이스트리 | 대표 |
| 시그니처 | MONTHLY PAIRING (월간페어링) | 변동 | 잠봉 포카치아 샌드위치 + 참외청 에이드 | 대표 |
| 커피 | 플랫화이트 | ₩6,300 | 크리미한 우유와 진한 에스프레소 | |
| 논커피 | 피치블루밍 | ₩7,500 | 복숭아와 패션후르츠, 이른 여름의 맛 | |
| 논커피 | 썬셋피치 | ₩7,800 | 복숭아와 아쌈의 우아한 조화 | |
| 논커피 | 유자민트브리즈 | ₩7,800 | 고흥 유자와 페퍼민트 | |
| 에이드 | 레몬에이드 | ₩7,000 | 청량한 레몬 스파클링 | |
| 에이드 | 자몽에이드 | ₩7,000 | 자몽 과육 스파클링 | |
| 에이드 | 라임에이드 | ₩7,000 | 라임의 싱그러움 | |
| 논커피 | 다크초콜릿 | ₩7,500 | 진한 초콜릿 라떼 | |
| 논커피 | 보성말차라떼 | ₩8,000 | 보성 말차의 깊은 풍미 | |
| 논커피 | 얼그레이 베일 밀크티 | ₩7,500 | 얼그레이에 바닐라가 감도는 밀크티 | |
| 논커피 | 스트로베리라떼 | ₩7,500 | 딸기 과육 라떼 | |

---

## 2. 데이터 매핑 — 네이버 → `small-biz-cafe` 모듈 스키마

현재 카페 스키마(`src/data/oneclick/module-schemas/small-biz-cafe.ts`)는 네이버 데이터와 **거의 1:1 대응**됩니다. 신규 필드 추가 없이 값만 교체 가능.

| 네이버 필드 | 카페 모듈 | 필드 key |
|-------------|-----------|----------|
| 상호 | `hero` | `name` / `nameEn` |
| 한줄 소개 | `hero` | `description` |
| 전화번호 | `hero` | `phone` |
| 소개/컨셉 | `about` | `stories`, `tags`, `values` |
| 메뉴(카테고리·가격) | `menu` | `items[]` (category/name/desc/price/emoji/isPopular) |
| 영업시간·라스트오더 | `hours` | `items[]` (day/hours/isHoliday) |
| 주소·오시는길 | `location` | `address`, `kakaoMapId` |
| 인스타/블로그/카카오 | `sns` | `instagramUrl`, `naverBlogUrl`, `kakaoChannelUrl` |

**매핑 시 규칙**
- 대표 메뉴 → `isPopular: true`
- 가격 "변동"/미표기 → `price: '변동'` 또는 빈 값 허용
- 메뉴 이모지: 커피 ☕ / 논커피 🍵 / 에이드 🍋 / 디저트 🥐 자동 규칙
- `kakaoMapId`는 네이버 데이터에 없음 → 별도 입력(선택). 위치는 주소 텍스트로도 표시 가능

---

## 3. 서비스 기획 — "네이버 링크로 카페 홈페이지 만들기"

### 3.1 사용자 플로우 (초안/데모)
1. 사용자가 원클릭 카페 템플릿 선택
2. **"네이버 플레이스 링크 붙여넣기"** 입력창에 `map.naver.com/...` 또는 `m.place.naver.com/...` URL 입력
3. 서버가 링크에서 placeId 추출 → 모바일 플레이스 페이지 파싱 → 상호/주소/영업시간/메뉴/SNS 추출
4. 추출 결과를 **모듈 에디터 폼에 프리필**(자동 채움) — 사용자는 검수·수정만
5. 기존 원클릭 배포 파이프라인 그대로 실행 (무AI·무비용)

### 3.2 아키텍처 (신규 요소 최소화)
```
[링크 입력 UI]  →  POST /api/oneclick/import/naver  →  { placeId, 파서 }
                                                       ↓
                                            ModuleConfigState(프리필)
                                                       ↓
                              기존 모듈 에디터 + code-generator + deploy 재사용
```

- **신규**: `POST /api/oneclick/import/naver` (링크 → 구조화 JSON)
  - placeId 정규식 추출: `/place\/(\d+)/` 또는 `/(restaurant|place)\/(\d+)/`
  - 파싱 대상: `m.place.naver.com/restaurant/{id}/home`, `.../menu/list`
  - 5단계 규칙 준수: `getUser()` → Zod safeParse(url) → (소유권 불필요) → 파싱 → 결과 반환
  - Zod `safeParse` 필수, 에러는 `src/lib/api/errors.ts` 헬퍼 사용
- **신규**: `src/lib/oneclick/import/naver-place.ts` — 파서(HTML/JSON → 스키마 매핑)
- **재사용**: 모듈 스키마·제너레이터·배포 API 전부 그대로

### 3.3 파싱 전략 (무AI)
- 네이버 모바일 플레이스는 페이지 내 정적 상태(JSON) + DOM에 메뉴/주소가 포함됨 → `fetch` + 정규식/JSON 파싱
- 실패 시 graceful fallback: 파싱 실패 필드는 비워두고 사용자가 수동 입력
- 캐싱: 동일 placeId 재요청 시 단기 캐시(선택) — 네이버 부하·차단 회피

### 3.4 리스크 & 대응
| 리스크 | 대응 |
|--------|------|
| 네이버 마크업 변경으로 파서 깨짐 | 필드별 독립 파싱 + 실패 시 빈 값 fallback, 파서 버전 로깅 |
| 스크래핑 ToS/차단 | 데모 한정, 저빈도 요청, User-Agent 명시, 상용 시 네이버 검색 OpenAPI 병행 검토 |
| 메뉴 이미지 저작권 | 이미지 자동 복사 금지, 텍스트·가격만 가져오고 이미지는 사용자 업로드 |
| 지도 표시 | 네이버 지도 임베드 대신 주소 텍스트/카카오맵ID(사용자 입력) 유지 |

---

## 4. 카페 원클릭 고도화 "새 기준" (제안)

1. **기본 데모 데이터 교체**: "온기 로스터리" → "카페 라이츠"(실데이터 레퍼런스)로 통일 → 데모 완성도↑
2. **메뉴 카테고리 표준화**: `시그니처 / 커피 / 논커피 / 에이드 / 디저트 / 원두` 6종 프리셋
3. **대표 메뉴 강조**: `isPopular` 뱃지 상단 노출 규칙 명문화
4. **위치 섹션**: 주소 + "오시는 길"(도보/차량) 텍스트 필드 추가 검토
5. **네이버 임포트를 기본 진입점으로**: 카페 템플릿 최초 화면 = 링크 붙여넣기 우선
6. **카탈로그 노출 순서**: 카페 ↔ 링크카드 위치 조정 (§6 참고)

---

## 5. 재사용 프롬프트 세트 (계속 사용)

> 아래 프롬프트를 그대로 붙여넣어 단계별로 실행하면 됩니다. 각 프롬프트는 독립 실행 가능.

### 프롬프트 A — 데모 데이터 교체 (온기 로스터리 → 카페 라이츠)
```
carfe 원클릭 템플릿(small-biz-cafe)의 기본 데모 데이터를 "온기 로스터리"에서
"카페 라이츠"로 교체해줘. 소스 데이터는 docs/onelink/12-cafe-naver-import.md의
§1(카페 라이츠 실데이터)과 §2(매핑 표)를 기준으로 한다.
교체 대상 파일:
- src/data/oneclick/module-schemas/small-biz-cafe.ts (defaultValue)
- src/lib/oneclick/generators/small-biz-cafe.ts (제너레이터 기본값)
- src/data/oneclick/small-biz-cafe-template.ts (배포 파일 기본값/env fallback)
- src/data/oneclick/template-sample-content.ts (smallBizCafeSample)
규칙: 상호/주소/전화/영업시간/메뉴(카테고리·가격·설명·이모지)/SNS를 §1 값으로 채우고,
대표 메뉴는 isPopular:true, 스키마 필드 구조는 변경하지 말 것.
작업 후 npm run typecheck 통과 확인.
```

### 프롬프트 B — 네이버 플레이스 임포트 기능 구현
```
원클릭 카페 템플릿에 "네이버 플레이스 링크 붙여넣기 → 폼 자동 채우기" 기능을 구현해줘.
AI API/유료 서비스 사용 금지 (순수 파싱). 설계는 docs/onelink/12-cafe-naver-import.md §3 기준.
1) src/lib/oneclick/import/naver-place.ts: URL에서 placeId 추출 후
   m.place.naver.com 파싱 → { name, description, phone, address, hours[], menu[], sns } 반환.
   필드별 독립 파싱, 실패 시 빈 값 fallback.
2) POST /api/oneclick/import/naver: 5단계 규칙 준수(getUser → Zod safeParse(url) →
   파싱 → 결과 반환), 에러는 src/lib/api/errors.ts 헬퍼 사용, 민감값 로깅 금지.
3) 파서 결과를 small-biz-cafe 모듈 스키마 ModuleConfigState로 매핑(§2 표).
4) 위저드/모듈 에디터에 링크 입력 UI 추가(선택), 프리필만 하고 사용자 수정 가능.
이미지는 자동 복사 금지(텍스트·가격만). 작업 후 typecheck/lint 통과 확인.
```

### 프롬프트 C — 카페 고도화 기준 반영
```
docs/onelink/12-cafe-naver-import.md §4(새 기준)를 small-biz-cafe 템플릿에 반영해줘.
메뉴 카테고리 6종 프리셋(시그니처/커피/논커피/에이드/디저트/원두),
대표 메뉴 isPopular 상단 노출, 위치 섹션에 "오시는 길" 텍스트 필드 검토.
스키마 CHECK/타입 변경 시 마이그레이션 3-step 준수. UI는 한글 우선.
```

### 프롬프트 D — 카탈로그 노출 순서 변경
```
원클릭 템플릿 카탈로그에서 카페(small-biz-cafe, display_order:6)와
링크카드(link-card, display_order:7)의 노출 순서를 서로 바꿔줘.
src/data/oneclick/homepage-templates.ts의 display_order만 조정하고,
다른 템플릿 순서에 영향 없도록 확인. (원하는 최종 순서를 명시하면 그대로 반영)
```

---

## 6. 확인 필요 (사용자 결정)
1. **"링크가드 위치와 변경"의 정확한 의미** — (a) 카탈로그 노출 순서에서 카페↔링크카드 위치 교체인지, (b) 특정 페이지(내홈페이지/쇼케이스) 내 카드 배치 교체인지. 프롬프트 D는 (a) 기준으로 작성됨.
2. **네이버 임포트 방식** — 데모는 스크래핑 파싱으로 진행하되, 상용화 시 네이버 검색 OpenAPI(무료·기본필드) 병행 여부.
3. **실제 코드 반영 시점** — 본 문서는 기획/프롬프트 초안. 프롬프트 A~D 중 어디부터 실제 구현할지.
