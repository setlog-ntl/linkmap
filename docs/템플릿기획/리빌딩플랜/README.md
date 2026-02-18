# 템플릿 리빌딩 마스터 추적 문서

## 개요

레거시 5개 static 템플릿을 비활성화하고, 새 기획서(15개 템플릿 x 4 Phase)에 맞춰 리빌딩.

## 전체 진행률

| Phase | 템플릿 수 | DB Seed | 콘텐츠 파일 | TS 시드 | 상태 |
|-------|----------|---------|------------|---------|------|
| [Phase 1: MVP+](./phase1-mvp.md) | 3/3 | ✅ (migration 018) | ✅ 3/3 | ✅ | 완료 |
| [Phase 2: Growth](./phase2-growth.md) | 5/5 | ✅ (migration 024) | ⬜ 0/5 | ✅ | DB/시드 완료 |
| [Phase 3: Expansion](./phase3-expansion.md) | 4/4 | ✅ (migration 025) | ⬜ 0/4 | ✅ | DB/시드 완료 |
| [Phase 4: Community](./phase4-community.md) | 3/3 | ✅ (migration 026) | ⬜ 0/3 | ✅ | DB/시드 완료 |

**DB/시드 진행률: 15/15 (100%)**
**전체 진행률 (콘텐츠 포함): 3/15 (20%)**

## 레거시 정리

- [정리 기록](./00-cleanup.md) - 5개 static 템플릿 비활성화, 코드 정리

## Phase별 템플릿 목록

### Phase 1: MVP+ (3개) - 완료
| # | 슬러그 | 이름 | DB | 콘텐츠 | 시드 |
|---|--------|------|:--:|:------:|:----:|
| 01 | `link-in-bio-pro` | 링크인바이오 프로 | ✅ | ✅ | ✅ |
| 02 | `digital-namecard` | 디지털 명함 | ✅ | ✅ | ✅ |
| 03 | `dev-showcase` | 개발자 쇼케이스 | ✅ | ✅ | ✅ |

### Phase 2: Growth (5개) - DB/시드 완료
| # | 슬러그 | 이름 | DB | 콘텐츠 | 시드 |
|---|--------|------|:--:|:------:|:----:|
| 04 | `small-biz` | 소규모 비즈니스 | ✅ | ⬜ | ✅ |
| 05 | `product-landing` | 제품 랜딩 | ✅ | ⬜ | ✅ |
| 06 | `qr-menu-pro` | QR 메뉴 프로 | ✅ | ⬜ | ✅ |
| 07 | `resume-site` | 이력서 사이트 | ✅ | ⬜ | ✅ |
| 08 | `personal-brand` | 퍼스널 브랜드 | ✅ | ⬜ | ✅ |

### Phase 3: Expansion (4개) - DB/시드 완료
| # | 슬러그 | 이름 | DB | 콘텐츠 | 시드 |
|---|--------|------|:--:|:------:|:----:|
| 09 | `freelancer-page` | 프리랜서 페이지 | ✅ | ⬜ | ✅ |
| 10 | `saas-landing` | SaaS 랜딩 | ✅ | ⬜ | ✅ |
| 11 | `newsletter-landing` | 뉴스레터 랜딩 | ✅ | ⬜ | ✅ |
| 12 | `event-page` | 이벤트 페이지 | ✅ | ⬜ | ✅ |

### Phase 4: Community (3개) - DB/시드 완료
| # | 슬러그 | 이름 | DB | 콘텐츠 | 시드 |
|---|--------|------|:--:|:------:|:----:|
| 13 | `community-hub` | 커뮤니티 허브 | ✅ | ⬜ | ✅ |
| 14 | `study-recruit` | 스터디 모집 | ✅ | ⬜ | ✅ |
| 15 | `nonprofit-page` | 비영리 페이지 | ✅ | ⬜ | ✅ |

## 관련 파일

- 기획 문서: `docs/템플릿기획/`
- DB 마이그레이션:
  - `supabase/migrations/018_phase1_mvp_templates.sql` (Phase 1) ✅
  - `supabase/migrations/024_phase2_growth_templates.sql` (Phase 2) ✅
  - `supabase/migrations/025_phase3_expansion_templates.sql` (Phase 3) ✅
  - `supabase/migrations/026_phase4_community_templates.sql` (Phase 4) ✅
- 콘텐츠 파일: `src/data/*-template.ts` (Phase 1만 완료)
- 시드 데이터: `src/data/homepage-templates.ts` ✅ (전체 15개)
- 변경 이력: [changelog.md](./changelog.md)

## 다음 단계

Phase 2-4의 템플릿 콘텐츠 파일 작성이 필요합니다:
- Phase 2: 5개 템플릿 콘텐츠 파일
- Phase 3: 4개 템플릿 콘텐츠 파일
- Phase 4: 3개 템플릿 콘텐츠 파일

display_order는 1-15로 순차 할당 완료되었습니다.
