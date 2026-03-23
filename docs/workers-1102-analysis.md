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

## Cloudflare Cache Rules — Workers 아키텍처 비적용

> **검증 결과 (03-20):** linkmap.biz는 `@opennextjs/cloudflare` Workers Route로 서빙되므로,
> 요청이 CDN 캐시 레이어를 **우회**하여 Worker로 직접 전달된다.
> Cache Rules를 설정해도 **Worker 진입을 차단하지 못한다.**

### Dashboard 설정 (적용했으나 비적용 확인됨)

| 경로 패턴 | Edge TTL | Browser TTL | 실제 효과 |
|-----------|----------|-------------|-----------|
| `/blog/*` | 3600s (1시간) | 600s | ⚠ Workers에서 비적용 |
| `/guides/*` | 3600s | 600s | ⚠ Workers에서 비적용 |
| `/services/*` | 3600s | 600s | ⚠ Workers에서 비적용 |
| `/faq` | 3600s | 600s | ⚠ Workers에서 비적용 |
| `/glossary` | 3600s | 600s | ⚠ Workers에서 비적용 |
| `/pricing` | 3600s | 600s | ⚠ Workers에서 비적용 |

**Workers 아키텍처의 캐시 레이어:**
- 실제 캐시는 **OpenNext ISR** (`x-nextjs-cache` 헤더) + **KV namespace**가 담당
- `cf-cache-status` 헤더가 응답에 없음 = Edge CDN 캐시 미사용 확인
- Cache Rules는 삭제해도 무방 (해가 되지는 않음)

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

1. ~~**KV 캐시 워밍업 스크립트**~~ → ✅ 03-23 구현 완료 (`scripts/warm-cache.sh` + CI 연동)
2. **Paid Plan 검토** — CPU 제한 10ms → 50ms (Bundled) 또는 30s (Unbound)
3. ~~**번들 크기 모니터링 자동화**~~ → ✅ 03-23 CI 체크 추가 (`.github/workflows/deploy-cloudflare.yml`)
4. **블로그 content 분리** — `BLOG_POSTS` content를 개별 파일로 분리하여 서버 번들 추가 경량화

---

## 2026-03-23 재발 및 근본 해결

### 재발 상황

| 항목 | 내용 |
|------|------|
| **시각** | 2026-03-23 00:21:43 UTC |
| **에러** | Error 1102 (Worker exceeded resource limits) |
| **트리거** | 3/22 10회 배포 → KV 캐시 전면 무효화 → cold start SSR |

### 근본 원인

Phase 2에서 `revalidate`를 3600→86400으로 연장했으나, 이는 **24시간마다 full SSR 재발** + **배포마다 KV 캐시 리셋**이라는 구조적 문제를 해결하지 못했다.

```
배포 → KV 캐시 무효화 → 첫 요청에서 full SSR → CPU 10ms 초과 → 1102
revalidate 만료 → full SSR → CPU 10ms 초과 → 1102
```

해당 페이지들의 데이터는 **모두 코드에 하드코딩** → 런타임 SSR이 불필요.

### Phase 3: 완전 정적화 + 재발 방지 체계 (03-23)

| # | 최적화 내용 | 변경 파일 |
|---|-------------|-----------|
| 3-1 | ISR `revalidate` 86400/3600 → **false** (완전 정적) | 7개 페이지 |
| 3-2 | 캐시 워밍업 스크립트 + CI 연동 | `scripts/warm-cache.sh`, CI yml |
| 3-3 | ESLint `no-link-prefetch` 규칙 | `eslint-rules/no-link-prefetch.mjs` |
| 3-4 | 서버 번들 크기 CI 체크 (10MB 경고) | CI yml |
| 3-5 | CLAUDE.md Workers-Safe 체크리스트 | `CLAUDE.md` |
| 3-6 | 통합 운영 가이드 | `docs/workers-operations-guide.md` |

**Phase 3 핵심:** `revalidate = false`로 ISR 자체를 제거. 빌드 시점에 HTML을 생성하고, 이후에는 KV에서 정적 파일만 서빙. 런타임 SSR이 완전히 사라지므로 CPU 10ms 제한에 걸릴 수 없다.

**대상 페이지 (7개):**
- `src/app/services/page.tsx` (86400→false)
- `src/app/services/[slug]/page.tsx` (86400→false)
- `src/app/services/compare/page.tsx` (86400→false)
- `src/app/services/cost-simulator/page.tsx` (86400→false)
- `src/app/blog/page.tsx` (86400→false)
- `src/app/demo/page.tsx` (3600→false)
- `src/app/showcase/[id]/layout.tsx` (3600→false)

---

*보고서 작성일: 2026-03-20*
*최종 업데이트: 2026-03-23 (Phase 3 근본 해결)*
*분석 도구: Cloudflare GraphQL Analytics API, Next.js Bundle Analyzer*
