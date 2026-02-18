# Phase 4: Community (3개 템플릿)

## 상태: DB 마이그레이션 & 시드 데이터 완료 (콘텐츠 파일 대기)

| # | 슬러그 | 이름 | DB Seed | 콘텐츠 파일 | TS 시드 |
|---|--------|------|:-------:|:----------:|:-------:|
| 13 | `community-hub` | 커뮤니티 허브 | ✅ | ⬜ | ✅ |
| 14 | `study-recruit` | 스터디 모집 | ✅ | ⬜ | ✅ |
| 15 | `nonprofit-page` | 비영리 페이지 | ✅ | ⬜ | ✅ |

## 체크리스트

### community-hub
- [x] DB 마이그레이션 (`supabase/migrations/026_phase4_community_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/community-hub-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase4-community/13-community-hub.md`

### study-recruit
- [x] DB 마이그레이션 (`supabase/migrations/026_phase4_community_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/study-recruit-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase4-community/14-study-recruit.md`

### nonprofit-page
- [x] DB 마이그레이션 (`supabase/migrations/026_phase4_community_templates.sql`) ✅
- [ ] 템플릿 콘텐츠 파일 (`src/data/nonprofit-page-template.ts`)
- [x] 시드 데이터 갱신 (`src/data/homepage-templates.ts`) ✅
- [ ] 기획 문서: `docs/템플릿기획/phase4-community/15-nonprofit-page.md`

## 관련 파일
- DB: `supabase/migrations/026_phase4_community_templates.sql` ✅
- 시드 데이터: `src/data/homepage-templates.ts` ✅
- display_order: 13-15 (순차 재할당)
- 기획: `docs/템플릿기획/phase4-community/`

## 참고사항
- DB 마이그레이션과 TS 시드 데이터는 완료됨
- display_order가 순차 13-15로 할당됨
- 템플릿 콘텐츠 파일(HTML/CSS 구조)은 아직 미작성 상태
