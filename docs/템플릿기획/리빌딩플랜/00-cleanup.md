# 레거시 정리 기록

## 비활성화 대상 (5개 static 템플릿)

| 슬러그 | 이름 | 원본 마이그레이션 |
|--------|------|------------------|
| `portfolio-static` | 포트폴리오 | migration 016 |
| `landing-static` | 랜딩 페이지 | migration 016 |
| `resume-static` | 온라인 이력서 | migration 016 |
| `blog-static` | 블로그 | migration 016 |
| `docs-static` | 문서 사이트 | migration 016 |

## 수행 작업

### 1. DB 마이그레이션 (023)
- **파일**: `supabase/migrations/023_template_rebuild_cleanup.sql`
- **내용**:
  - 5개 static 템플릿 `is_active = false` 비활성화
  - Phase 1 3개 템플릿 `display_order` 재할당 (1, 2, 3)

### 2. 코드 정리
- **`src/data/homepage-template-content.ts`**:
  - 5개 static 템플릿 콘텐츠 (HTML/CSS) 제거
  - `HomepageTemplateContent` 인터페이스 유지
  - `homepageTemplates` 배열에서 Phase 1 3개만 유지
  - dev-showcase import 유지

### 3. 결과
- 레거시 static 템플릿은 DB에 남아있지만 `is_active = false`로 비활성화
- 기존 배포된 사이트에 영향 없음 (배포 이력은 `homepage_deploys` 테이블에 별도 관리)
- `homepageTemplates` 배열은 Phase 1 3개 템플릿만 포함

## 완료일: 2026-02-15
