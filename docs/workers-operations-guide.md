# Cloudflare Workers 통합 운영 가이드

> **프로젝트:** Linkmap (linkmap.biz)
> **플랜:** Cloudflare Workers Free Plan
> **런타임:** `@opennextjs/cloudflare`
> **최종 업데이트:** 2026-03-23

---

## Workers Free Plan 제약 요약

| 제약 | 값 | 위험도 |
|------|-----|--------|
| **CPU 시간** | 10ms / 요청 | 🔴 가장 빈번한 에러 원인 |
| Worker 크기 | 10MB (압축 후 3MB) | 🟡 번들 비대화 시 주의 |
| 메모리 | 128MB | 🟢 현재 여유 |
| 요청 수 | 100,000건 / 일 | 🟢 현재 여유 |
| KV 읽기 | 100,000건 / 일 | 🟢 ISR 캐시용 |
| KV 쓰기 | 1,000건 / 일 | 🟡 ISR revalidation 시 소진 |

---

## 에러 유형별 원인/해결 매트릭스

| 에러 코드 | 의미 | 주요 원인 | 해결 방법 |
|-----------|------|-----------|-----------|
| **1102** | CPU 시간 초과 | cold start SSR, 대형 번들 파싱 | revalidate=false, 번들 최적화 |
| **503** | 서비스 불가 | Link prefetch 동시 요청 폭발 | prefetch={false} 필수 |
| **1101** | Worker 실행 실패 | 메모리 초과, 런타임 에러 | 번들 크기 줄이기 |
| **KV quota** | KV 쓰기 한도 | ISR revalidation 과다 | revalidate 주기 연장 또는 false |

---

## 배포 체크리스트

### 배포 전

- [ ] `npm run typecheck` 통과
- [ ] `npm run lint` 통과 (no-link-prefetch 포함)
- [ ] `npm run build` → 정적 페이지가 `○` 표시 확인
- [ ] 새 공개 페이지 추가했으면 → `scripts/warm-cache.sh`에 경로 추가

### 배포 후 (CI 자동 실행)

- [ ] 번들 크기 10MB 이하 확인 (CI 로그)
- [ ] 캐시 워밍업 성공 확인 (CI 로그)
- [ ] Cloudflare Analytics → `exceededResources` 0건 확인

### 수동 배포 시

```bash
# 1. 배포
npx wrangler deploy

# 2. 캐시 워밍업
bash scripts/warm-cache.sh https://linkmap.biz

# 3. 모니터링 (Cloudflare Dashboard)
# Workers & Pages → linkmap → Analytics → CPU Time 확인
```

---

## 새 페이지 추가 시 Workers-Safe 체크리스트

### 1. 렌더링 전략 선택

```
코드 하드코딩 데이터만? → revalidate = false (완전 정적)
DB 데이터 + 캐시 OK?  → revalidate = 86400 (ISR 24시간)
실시간 데이터 필수?   → revalidate = 60~300 (ISR 단기, 최소화)
인증 필수 페이지?     → force-dynamic (인증 페이지만 허용)
```

### 2. 필수 규칙

| 항목 | 규칙 | 검출 방법 |
|------|------|-----------|
| `<Link>` | `prefetch={false}` 필수 | ESLint `linkmap/no-link-prefetch` |
| 대형 라이브러리 | 서버 컴포넌트에서 import 금지 | `next.config.ts` > `optimizePackageImports` |
| 아이콘 | lucide-react → 클라이언트에서만 렌더 | `guide-data.ts` 패턴 참조 |
| OG 이미지 | `next/og` (satori) 사용 금지 | 코드 리뷰 |

### 3. 캐시 워밍업 등록

공개 페이지를 추가했으면 `scripts/warm-cache.sh`의 `PAGES` 배열에 경로 추가.

---

## 모니터링 포인트

### Cloudflare Dashboard

- **위치:** Workers & Pages → linkmap-biz → Analytics
- **핵심 지표:**
  - `exceededResources` → 0건 유지 (1건이라도 발생 시 즉시 조치)
  - `clientDisconnected` → 추이 모니터링
  - CPU Time P50/P99 → 10ms 미만 유지

### 빌드 로그 확인

```
npm run build 출력에서:

○  (Static)   → 정적 HTML (Workers 부담 없음) ✅
●  (SSG)      → 빌드 시 생성 (Workers 부담 없음) ✅
ƒ  (Dynamic)  → 매 요청 SSR (Workers CPU 소모) ⚠️
◐  (ISR)      → 캐시 만료 시 SSR (주의 필요) ⚠️
```

`ƒ` 마크 페이지가 **인증 필수 페이지만**인지 확인.

---

## 사고 이력

| 날짜 | 에러 | 원인 | 해결 |
|------|------|------|------|
| 2026-03-19 | 1102 (7건) | lucide 52개 + satori 2.9MB 서버 번들 포함 | Phase 0-1: 번들 최적화 |
| 2026-03-20 | 해결 확인 | Phase 0-2 적용 완료 | ISR 3600→86400 |
| 2026-03-23 | 1102 재발 | 10회 배포→KV 리셋 + ISR 만료→SSR | Phase 3: revalidate=false + 워밍업 |

---

## 참고 문서

- `docs/workers-1102-analysis.md` — 상세 분석 보고서
- `docs/workers-503-prefetch-resolution.md` — prefetch 문제 해결
- [Cloudflare Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [@opennextjs/cloudflare](https://opennext.js.org/cloudflare)
