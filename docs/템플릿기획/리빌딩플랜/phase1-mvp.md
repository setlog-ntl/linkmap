# Phase 1: MVP+ (3개 템플릿)

## 상태: 완료

| # | 슬러그 | 이름 | DB Seed | 콘텐츠 파일 | TS 시드 |
|---|--------|------|:-------:|:----------:|:-------:|
| 01 | `link-in-bio-pro` | 링크인바이오 프로 | ✅ 018 | ✅ `homepage-template-content.ts` | ✅ |
| 02 | `digital-namecard` | 디지털 명함 | ✅ 018 | ✅ `homepage-template-content.ts` | ✅ |
| 03 | `dev-showcase` | 개발자 쇼케이스 | ✅ 018 | ✅ `dev-showcase-template.ts` | ✅ |

## 체크리스트

### link-in-bio-pro
- [x] DB 마이그레이션 (`supabase/migrations/018_phase1_mvp_templates.sql`)
- [x] 템플릿 콘텐츠 파일 (`src/data/homepage-template-content.ts` 내 포함)
- [x] 시드 데이터 (`src/data/homepage-templates.ts`)
- [x] 기획 문서: `docs/템플릿기획/phase1-mvp/01-link-in-bio-pro.md`

### digital-namecard
- [x] DB 마이그레이션 (`supabase/migrations/018_phase1_mvp_templates.sql`)
- [x] 템플릿 콘텐츠 파일 (`src/data/homepage-template-content.ts` 내 포함)
- [x] 시드 데이터 (`src/data/homepage-templates.ts`)
- [x] 기획 문서: `docs/템플릿기획/phase1-mvp/02-digital-namecard.md`

### dev-showcase
- [x] DB 마이그레이션 (`supabase/migrations/018_phase1_mvp_templates.sql`)
- [x] 템플릿 콘텐츠 파일 (`src/data/dev-showcase-template.ts`)
- [x] 시드 데이터 (`src/data/homepage-templates.ts`)
- [x] 기획 문서: `docs/템플릿기획/phase1-mvp/03-dev-showcase.md`

## 관련 파일
- DB: `supabase/migrations/018_phase1_mvp_templates.sql`
- 콘텐츠: `src/data/homepage-template-content.ts`, `src/data/dev-showcase-template.ts`
- 시드: `src/data/homepage-templates.ts`
