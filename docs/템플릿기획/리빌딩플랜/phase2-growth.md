# Phase 2: Growth (5개 템플릿)

## 상태: DB 마이그레이션 & 시드 데이터 완료 (콘텐츠 파일 대기)

| # | 슬러그 | 이름 | DB Seed | 콘텐츠 파일 | TS 시드 |
|---|--------|------|:-------:|:----------:|:-------:|
| 04 | `small-biz` | 소규모 비즈니스 | ✅ | ⬜ | ✅ |
| 05 | `product-landing` | 제품 랜딩 | ✅ | ⬜ | ✅ |
| 06 | `qr-menu-pro` | QR 메뉴 프로 | ✅ | ⬜ | ✅ |
| 07 | `resume-site` | 이력서 사이트 | ✅ | ⬜ | ✅ |
| 08 | `personal-brand` | 퍼스널 브랜드 | ✅ | ⬜ | ✅ |

## 체크리스트

### small-biz
- [x] DB 마이그레이션 (`supabase/migrations/024_phase2_growth_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/small-biz-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase2-growth/04-small-biz.md`

### product-landing
- [x] DB 마이그레이션 (`supabase/migrations/024_phase2_growth_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/product-landing-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase2-growth/05-product-landing.md`

### qr-menu-pro
- [x] DB 마이그레이션 (`supabase/migrations/024_phase2_growth_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/qr-menu-pro-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase2-growth/06-qr-menu-pro.md`

### resume-site
- [x] DB 마이그레이션 (`supabase/migrations/024_phase2_growth_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/resume-site-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase2-growth/07-resume-site.md`

### personal-brand
- [x] DB 마이그레이션 (`supabase/migrations/024_phase2_growth_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/personal-brand-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase2-growth/08-personal-brand.md`

## 관련 파일
- DB: `supabase/migrations/024_phase2_growth_templates.sql` ✅
- 시드 데이터: `src/data/homepage-templates.ts` ✅
- display_order: 4-8 (순차 재할당)
- 기획: `docs/템플릿기획/phase2-growth/`

## 참고사항
- DB 마이그레이션과 TS 시드 데이터는 완료됨
- display_order가 원래 기획서의 6,8,8,9,10에서 4-8로 순차 재할당됨
- 템플릿 콘텐츠 파일(HTML/CSS 구조)은 아직 미작성 상태
