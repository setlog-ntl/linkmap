# Workers 503 해결 보고서 — Link prefetch 동시 요청 폭발

> **프로젝트:** Linkmap (linkmap.biz)
> **기간:** 2026-03-19 ~ 2026-03-20
> **상태:** 해결 완료

---

## 타임라인

| Phase | 날짜 | 조치 | 효과 |
|-------|------|------|------|
| Phase 1 | 03-19 | 가이드 80개 + 공개 페이지 `revalidate=false` 정적화 | Cold start SSR 제거 |
| Phase 2 | 03-19 | 블로그 posts.ts 3574줄→83줄 분리, `new Date()` 제거 | 서버 번들 경량화 |
| Phase 3 | 03-19 | sitemap.ts `new Date()` → BUILD_DATE 고정 | 빌드 타임 고정 |
| Phase 4 | 03-19 | 가이드/블로그 내부 Link `prefetch={false}` | 가이드 페이지 내 prefetch 차단 |
| **Phase 5** | **03-20** | **Header·Footer·Landing 전체 Link `prefetch={false}`** | **RSC 동시 요청 41건→0건** |

---

## 문제 상세

### 증상

배포 후 `/`, `/blog`, `/pricing`, `/demo`, `/feedback`, `/showcase` 등에서 **503 (Worker exceeded resource limits)** 산발 발생.

Phase 1~4 적용 후에도 간헐적 503 지속.

### Playwright 테스트로 발견된 근본 원인

`/guides/env` 방문 시 콘솔에서 503 에러 6건 포착:

```
GET /showcase?_rsc=13zrp  503
GET /blog?_rsc=13zrp      503
GET /pricing?_rsc=13zrp   503
GET /feedback?_rsc=13zrp  503
GET /?_rsc=13zrp          503
GET /demo?_rsc=13zrp      503
```

### 원인 분석

Next.js `<Link>` 컴포넌트는 기본적으로 뷰포트에 보이는 모든 링크를 **자동 prefetch**한다. 이는 RSC(React Server Component) payload를 미리 요청하는 것으로, `?_rsc=` 쿼리 파라미터가 붙은 요청이 발생한다.

**문제 구조:**

```
사용자가 아무 페이지 방문
  → Header 렌더링 (Link 33개)
  → Footer 렌더링 (Link 12개)
  → 합계 45개 Link 중 41개가 자동 prefetch 활성
  → 41개 RSC payload 요청 동시 발사
  → Cloudflare Workers Free Plan 동시 처리 한계 초과
  → 503 Worker exceeded resource limits
```

### 수치

| 컴포넌트 | Link 총수 | prefetch 차단 전 | 차단 후 |
|----------|----------|-----------------|--------|
| header.tsx (데스크톱 nav) | 9 | 9 자동 prefetch | 0 |
| header.tsx (드롭다운 메뉴) | 2+ | 이미 차단됨 | 0 |
| header.tsx (인증 메뉴) | 7 | 7 자동 prefetch | 0 |
| header.tsx (모바일 Sheet) | 15 | 15 자동 prefetch | 0 |
| footer.tsx | 12 | 10 자동 prefetch | 0 |
| 랜딩 컴포넌트 | 11 | 11 자동 prefetch | 0 |
| **합계** | **56+** | **52 자동 prefetch** | **0** |

---

## 해결 방법

### `prefetch={false}` 일괄 적용

모든 `<Link>` 컴포넌트에 `prefetch={false}` 속성을 추가하여 자동 prefetch를 비활성화했다.

```tsx
// Before
<Link href="/pricing">가격</Link>

// After
<Link href="/pricing" prefetch={false}>가격</Link>
```

### 수정 파일

| 파일 | 수정 Link 수 |
|------|-------------|
| `src/components/layout/header.tsx` | 31개 |
| `src/components/layout/footer.tsx` | 10개 |
| `src/components/landing/hero-section.tsx` | 3개 |
| `src/components/landing/cta-section.tsx` | 2개 |
| `src/components/landing/connection-dashboard.tsx` | 1개 |
| `src/components/landing/how-it-works.tsx` | 1개 |
| `src/components/landing/projects-preview-section.tsx` | 4개 |

### 사용자 체감 영향

- **prefetch 비활성화 = 페이지 전환 속도 저하?** → 아니다. Cloudflare Workers 환경에서는 prefetch 자체가 503을 유발하므로 오히려 안정성이 향상된다.
- 사용자가 실제 클릭 시에만 RSC 요청이 발생하며, 정적화된 페이지는 Cloudflare CDN 캐시에서 즉시 응답한다.

---

## 교훈

1. **Next.js Link prefetch는 Cloudflare Workers Free Plan과 상극이다.** Workers의 동시 요청 처리 한계가 낮기 때문에 자동 prefetch가 오히려 장애를 유발한다.

2. **Header/Footer는 모든 페이지에 존재한다.** 이곳의 Link가 자동 prefetch되면 매 페이지 방문 시 동일한 요청 폭풍이 발생한다.

3. **`?_rsc=` 쿼리 파라미터로 prefetch 요청을 식별할 수 있다.** 네트워크 탭이나 Playwright 콘솔에서 이 패턴을 필터링하면 prefetch 관련 503을 빠르게 진단 가능하다.

4. **Playwright 테스트가 문제를 가시화했다.** 사용자 보고로는 "가끔 503이 뜬다"였지만, Playwright로 콘솔 메시지를 수집하니 정확한 요청 패턴과 503 발생 원인이 드러났다.

---

## 관련 커밋

- `6a25f7f0` — perf: Header·Footer·Landing 전체 Link prefetch={false} — RSC 동시 요청 41건→0건
- `f2f2f9bb` — perf: 홈·공개 페이지·레이아웃 전면 정적화 + sitemap new Date() 제거
- `771ae637` — perf: 가이드/블로그 완전 정적화 + 블로그 콘텐츠 파일 분리
- `8c83727e` — perf: 전체 가이드/블로그 Link prefetch={false} 일괄 적용
- `64a08642` — perf: 가이드/블로그 Link prefetch={false}

## 관련 문서

- `docs/workers-1102-analysis.md` — 1102 에러 분석 (번들 비대화 원인)
