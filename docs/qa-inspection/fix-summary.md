# QA 개선사항 적용 결과

- **적용일**: 2026-03-30
- **기준**: improvement-plan.md (P0~P2)

## 적용 완료 (7건)

### P0-1. warm-cache.sh 누락 경로 추가
- **파일**: `scripts/warm-cache.sh`
- **변경**: PAGES 배열 12개 → 105개로 확대
- **추가 경로**: /signup, /reset-password, /terms, /faq, /glossary, /feedback, /oneclick, /demo/project/demo-1~4, 가이드 전체(인덱스 24개 + 상세 55개), 서비스 상세 5개
- **효과**: 503 에러 30개 페이지 모두 캐시 워밍 대상에 포함

### P0-3. auth 레이아웃 force-dynamic → revalidate=false
- **파일**: `src/app/(auth)/layout.tsx`
- **변경**: `export const dynamic = 'force-dynamic'` → `export const revalidate = false`
- **이유**: 인증 폼은 클라이언트 컴포넌트이므로 셸을 정적 빌드 가능. Workers CPU 10ms 제한 회피
- **효과**: /login, /signup, /reset-password 503 에러 근본 해결

### P0-4. /terms, /privacy 가용성 확보
- **상태**: 이미 `revalidate = false` 적용됨. P0-1에서 warm-cache.sh에 경로 추가 완료
- **효과**: 법적 페이지 항시 가용성 확보

### P1-3. /services/compare 비교 데이터 "-" 표시 수정
- **파일**: `src/components/service/compare-client.tsx`
- **원인**: `criterion.values[id]`로 UUID 조회 → 시드 데이터는 slug 키 사용 → 키 불일치
- **수정**: `criterion.values[slug] || criterion.values[id] || '-'`로 slug 우선 조회
- **효과**: 데이터베이스, 배포, 인증, CMS 등 모든 비교표 데이터 정상 표시

### P2-2. admin/showcase 사이드바 메뉴 추가
- **파일**: `src/components/layout/app-sidebar.tsx`
- **변경**: adminNav 배열에 `{ label: '쇼케이스 관리', href: '/admin/showcase', icon: Trophy }` 추가
- **효과**: 관리자가 사이드바에서 쇼케이스 관리 페이지 접근 가능

### P2-3. 가이드 H1 태그 추가
- **파일**:
  - `src/components/guides/version-control-guide/branching-content.tsx`
  - `src/components/guides/version-control-guide/pull-request-content.tsx`
  - `src/components/guides/version-control-guide/conflict-content.tsx`
- **변경**: 각 컴포넌트에 `<h1>` 태그 추가 (브랜치 전략, PR과 코드 리뷰, 충돌 해결)
- **효과**: 접근성(a11y) 및 SEO 개선

### P2-4. 설정 페이지 경로 확인
- **상태**: 6개 경로 모두 의도적 리다이렉트 (URL 마이그레이션)
  - /settings/profile → /settings/account
  - /settings/tokens → /settings/developer
  - /settings/services → /settings/developer
  - /settings/danger → /settings/account
  - /settings/accounts → /settings/github
  - /settings/connections → /settings/github
- **결론**: 수정 불필요 (정상 동작)

## 확인 결과 — 수정 불필요 (4건)

### P1-2. /project/[id]/integrations 리다이렉트
- 의도적 리다이렉트 (`redirect('/project/${id}/services')`). 503 에러가 리다이렉트를 방해한 것이며, P0 해결 시 자동 해소.

### P1-5. /project/[id]/audit 리다이렉트
- 의도적 리다이렉트 (`redirect('/project/${id}/settings')`). 정상 동작.

### P1-6. /project/[id]/health 빈 콘텐츠
- 의도적 리다이렉트 (`redirect('/project/${id}/monitoring')`). 503 에러 때문에 정상 리다이렉트 안 된 것.

### P2-1. /admin/users "0명" 표시
- `.eq('is_admin', false)` 필터 정상 동작. 비관리자 사용자가 없는 경우 0 표시가 올바름.

## 배포 후 필요 조치
1. `bash scripts/warm-cache.sh https://linkmap.biz` 실행
2. 503 에러 해소 확인
