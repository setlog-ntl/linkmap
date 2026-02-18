# Phase 3: Expansion (4개 템플릿)

## 상태: DB 마이그레이션 & 시드 데이터 완료 (콘텐츠 파일 대기)

| # | 슬러그 | 이름 | DB Seed | 콘텐츠 파일 | TS 시드 |
|---|--------|------|:-------:|:----------:|:-------:|
| 09 | `freelancer-page` | 프리랜서 페이지 | ✅ | ⬜ | ✅ |
| 10 | `saas-landing` | SaaS 랜딩 | ✅ | ⬜ | ✅ |
| 11 | `newsletter-landing` | 뉴스레터 랜딩 | ✅ | ⬜ | ✅ |
| 12 | `event-page` | 이벤트 페이지 | ✅ | ⬜ | ✅ |

## 체크리스트

### freelancer-page
- [x] DB 마이그레이션 (`supabase/migrations/025_phase3_expansion_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/freelancer-page-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase3-expansion/09-freelancer-page.md`

### saas-landing
- [x] DB 마이그레이션 (`supabase/migrations/025_phase3_expansion_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/saas-landing-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase3-expansion/10-saas-landing.md`

### newsletter-landing
- [x] DB 마이그레이션 (`supabase/migrations/025_phase3_expansion_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/newsletter-landing-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase3-expansion/11-newsletter-landing.md`

### event-page
- [x] DB 마이그레이션 (`supabase/migrations/025_phase3_expansion_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/event-page-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase3-expansion/12-event-page.md`

## 관련 파일
- DB: `supabase/migrations/025_phase3_expansion_templates.sql` ✅
- 시드 데이터: `src/data/homepage-templates.ts` ✅
- display_order: 9-12 (순차 재할당)
- 기획: `docs/템플릿기획/phase3-expansion/`

## 참고사항
- DB 마이그레이션과 TS 시드 데이터는 완료됨
- display_order가 순차 9-12로 할당됨
- 템플릿 콘텐츠 파일(HTML/CSS 구조)은 아직 미작성 상태
