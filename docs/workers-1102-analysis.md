# Cloudflare Workers Error 1102 분석 보고서

> **프로젝트:** Linkmap (linkmap.biz)
> **분석 기간:** 2026-03-19 ~ 2026-03-20
> **상태:** 해결됨 (Phase 0~2 적용 완료)

---

## 문제 요약

linkmap.biz에서 **Cloudflare Workers Error 1102** (Worker exceeded resource limits)가 반복 발생했다.

- **사용자 에러 시점:** 2026-03-19 22:04:54 UTC (Ray ID: `9defc68b9e0addc0`)
- Cloudflare Free Plan Workers CPU 제한: **10ms** (요청당)
- Cold start 시 서버 번들 파싱 + SSR 렌더링이 이 제한을 초과

### Cloudflare GraphQL 분석 결과

| 시각 (UTC) | 이벤트 | 상세 |
|------------|--------|------|
| 03-19 06:04 | `exceededResources` **7건** | cpuTimeP50=10ms → 하드킬 |
| 03-19 15:50 | 최종 배포 이후 | `exceededResources` **0건** (해결됨) |
| 03-19 22:04 | `clientDisconnected` **2건** | 느린 응답 → 사용자 이탈 |

**핵심 수치:**
- Cold start CPU: **225~718ms** (여전히 과도, Free Plan 10ms 대비 22~72배)
- ISR 캐시 히트 시에는 정상 응답
- 캐시 미스(MISS) 시 full SSR 발생 → CPU 폭등 → 1102 또는 503

---

## 근본 원인

### 1. 서버 번들 비대화

서버 사이드 번들에 불필요한 대용량 모듈이 포함되어, cold start 시 파싱만으로 CPU 제한을 초과했다.

```
guide-meta.ts → 52개 lucide-react 아이콘 import
                 → 모든 페이지 서버 번들에 포함
                 → cold start 파싱 비용 급증
```

### 2. 블로그 데이터 전체 로드

```
BLOG_POSTS (3,500+ 줄, content 포함)
  → sitemap.ts에서 import
  → generateStaticParams에서 import
  → slug/lastModified만 필요한데 전체 content 로드
```

### 3. ISR 캐시 미스 시 Full SSR

```
force-dynamic 설정된 페이지들
  → 매 요청마다 서버 렌더링
  → cold start + SSR = CPU 10ms 초과
  → Error 1102 발생
```

### 4. next/og (satori) 서버 번들 포함

```
next/og → satori (2.9MB)
  → OG 이미지 생성용이지만 모든 서버 번들에 포함
  → Workers 번들 크기 + 파싱 비용 폭증
```

---

## 해결 타임라인

### Phase 0: 긴급 대응 (03-19 ~ 03-20, 9개 커밋)

| # | 커밋 | 최적화 내용 | 효과 |
|---|------|-------------|------|
| 1 | `f21a7c87` | 블로그/가이드/쇼케이스 `force-dynamic` 제거 | SSR → ISR 전환 |
| 2 | `ee2f3434` | 공개 페이지 `force-dynamic` **전면 제거** | cold start 빈도 대폭 감소 |
| 3 | `56d0ae71` | `/demo` force-dynamic → ISR 전환 | Demo 페이지 캐싱 |
| 4 | `c8a368f0` | 블로그 상세 클라이언트 번들 **253KB 제거** | 번들 경량화 |
| 5 | `43c24ae7` | 블로그 목록 클라이언트 번들 **225KB 경량화** | 번들 경량화 |
| 6 | `a86b6672` | 블로그 hydration 해결 + CSP 보강 | 안정성 |
| 7 | `4b23d778` | `optimizePackageImports` + `BLOG_CATEGORIES` 분리 | 트리쉐이킹 개선 |
| 8 | `d60b5f71` | `guide-meta.ts` 서버 번들에서 **48개 lucide 아이콘 제거** | 서버 번들 경량화 |
| 9 | `8ed5a172` | `next/og` (satori 2.9MB) 제거 + Polar SDK 동적 import | **근본 해결** |

### Phase 1: 서버 번들 완전 정리 (03-20)

| # | 최적화 내용 | 변경 파일 |
|---|-------------|-----------|
| 1-1 | Header/Footer/Sidebar → `guide-data.ts` 전환 | `header.tsx`, `footer.tsx`, `app-sidebar.tsx` |
|     | 52개 lucide 아이콘 서버 번들 **완전 제거** | `guide-data.ts` |
| 1-2 | `sitemap.ts` → `getBlogSitemapEntries()` 경량 함수 | `sitemap.ts`, `posts.ts` |
| 1-3 | `blog/[slug]/page.tsx` → `getPublishedPostSlugs()` | `page.tsx`, `posts.ts` |

**Phase 1 핵심:** `guide-meta.ts`를 서버에서 완전히 분리. `guide-data.ts`는 아이콘을 string으로만 참조하고, 실제 아이콘 렌더링은 클라이언트 컴포넌트에서 담당.

### Phase 2: ISR 캐시 수명 연장 (03-20)

| # | 최적화 내용 | 변경 파일 |
|---|-------------|-----------|
| 2-1 | ISR `revalidate` 3600 → **86400** (24시간) | `services/*/page.tsx` |
|     | 대상: services, compare, cost-simulator | `compare/*/page.tsx` |

**Phase 2 핵심:** 자주 변경되지 않는 정적 콘텐츠 페이지의 ISR 캐시 수명을 24시간으로 연장하여, cold start 빈도를 추가 감소.

---

## Cloudflare Cache Rules 권장 설정

Workers 진입 자체를 차단하여 cold start CPU를 0으로 만드는 것이 최선의 전략이다.

### Dashboard 설정 (Settings → Caching → Cache Rules)

| 경로 패턴 | Edge TTL | Browser TTL | 비고 |
|-----------|----------|-------------|------|
| `/blog/*` | 3600s (1시간) | 600s | 블로그 콘텐츠 |
| `/guides/*` | 3600s | 600s | 가이드 콘텐츠 |
| `/services/*` | 3600s | 600s | 서비스 카탈로그 |
| `/faq` | 3600s | 600s | FAQ |
| `/glossary` | 3600s | 600s | 용어집 |
| `/pricing` | 3600s | 600s | 가격 페이지 |

**효과:**
- Edge 캐시 히트 → Worker 코드 실행 안 함 → CPU 0ms
- cold start 완전 차단 (해당 경로)
- Free Plan CPU 제한 (10ms) 걱정 없음

### 설정 방법

1. Cloudflare Dashboard → 도메인 선택
2. Caching → Cache Rules → Create Rule
3. Expression: `(http.request.uri.path matches "^/blog/")`
4. Edge TTL: Override → 3600 seconds
5. Browser TTL: Override → 600 seconds

---

## 변경 파일 목록

### Phase 1

| 파일 | 작업 내용 |
|------|-----------|
| `src/data/ui/guide-data.ts` | `GUIDE_CATEGORIES_DATA`, `LEARNING_STAGES_DATA` 추가 (아이콘 string 참조) |
| `src/components/layout/header.tsx` | `guide-meta` → `guide-data` import 변경, `STAGE_ICON_MAP` 클라이언트 매핑 |
| `src/components/layout/footer.tsx` | `guide-meta` → `guide-data` import 변경 |
| `src/components/layout/app-sidebar.tsx` | `guide-meta` → `guide-data` import 변경, `STAGE_ICON_MAP` 클라이언트 매핑 |
| `src/app/sitemap.ts` | `BLOG_POSTS` → `getBlogSitemapEntries()` 경량 함수 사용 |
| `src/data/blog/posts.ts` | `getBlogSitemapEntries()`, `getPublishedPostSlugs()` 함수 추가 |
| `src/app/blog/[slug]/page.tsx` | `BLOG_POSTS` 직접 참조 → `getPublishedPostSlugs()` 사용 |

### Phase 2

| 파일 | 작업 내용 |
|------|-----------|
| `src/app/services/*/page.tsx` | `revalidate` 3600 → 86400 |
| `src/app/compare/*/page.tsx` | `revalidate` 3600 → 86400 |

---

## 교훈 및 권장사항

### 즉시 적용 (완료)

- [x] 서버 번들에서 불필요한 UI 라이브러리 (lucide 아이콘 등) 제거
- [x] `force-dynamic` 최소화 → ISR 활용
- [x] 블로그 데이터 경량 접근 함수 분리
- [x] `next/og` (satori) 제거
- [x] ISR revalidate 연장

### 향후 모니터링 포인트

- Cloudflare Analytics → Workers → CPU Time 분포 주시
- `exceededResources` 이벤트 0건 유지 확인
- `clientDisconnected` 이벤트 추이 모니터링
- cold start CPU 225ms 이하 목표 (현재 225~718ms)

### 장기 개선 방향

1. **Cloudflare Cache Rules 적용** — 정적 페이지 Worker 진입 차단
2. **Paid Plan 검토** — CPU 제한 10ms → 50ms (Bundled) 또는 30s (Unbound)
3. **Edge-side Includes** — 동적 부분만 Worker 처리
4. **번들 크기 모니터링 자동화** — CI에서 서버 번들 크기 경고

---

*보고서 작성일: 2026-03-20*
*분석 도구: Cloudflare GraphQL Analytics API, Next.js Bundle Analyzer*
