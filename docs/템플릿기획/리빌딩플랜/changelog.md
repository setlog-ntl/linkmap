# 템플릿 리빌딩 변경 이력

## 2026-02-15

### 단계 0: 리빌딩플랜 문서 구조 생성
- `docs/템플릿기획/리빌딩플랜/` 폴더 생성
- README.md (마스터 추적), 00-cleanup.md, phase1~4 문서, changelog.md 생성

### 단계 1: 레거시 정리
- `supabase/migrations/023_template_rebuild_cleanup.sql` 생성
  - 5개 static 템플릿 비활성화 (`is_active = false`)
  - Phase 1 display_order 재할당 (1, 2, 3)
- `src/data/homepage-template-content.ts` 리팩토링
  - 5개 static 템플릿 HTML/CSS 콘텐츠 제거
  - Phase 1 3개 템플릿만 유지

### 단계 2: Phase 1 검증 & 보완
- `src/data/homepage-templates.ts` 생성 (Phase 1 시드 데이터 3개)
- Phase 1 문서 업데이트 완료

### 단계 3: Phase 2-4 DB 마이그레이션 & 시드 데이터 완료
- `supabase/migrations/024_phase2_growth_templates.sql` 생성
  - 5개 템플릿 추가 (small-biz, product-landing, qr-menu-pro, resume-site, personal-brand)
  - display_order: 4-8 (원래 6,8,8,9,10에서 순차 재할당)
- `supabase/migrations/025_phase3_expansion_templates.sql` 생성
  - 4개 템플릿 추가 (freelancer-page, saas-landing, newsletter-landing, event-page)
  - display_order: 9-12
- `supabase/migrations/026_phase4_community_templates.sql` 생성
  - 3개 템플릿 추가 (community-hub, study-recruit, nonprofit-page)
  - display_order: 13-15
- `src/data/homepage-templates.ts` 업데이트
  - 전체 15개 템플릿 시드 데이터 추가
  - display_order 1-15로 순차 할당 완료
- 리빌딩플랜 문서 업데이트
  - phase2-growth.md, phase3-expansion.md, phase4-community.md 완료 상태 반영
  - README.md 마스터 진행률 업데이트 (DB/시드: 15/15, 100%)
  - 템플릿 콘텐츠 파일은 Phase 2-4에서 아직 대기 상태 (Phase 1만 완료)
