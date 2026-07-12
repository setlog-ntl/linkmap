# 네이버 플레이스 데이터 기반 카페 원클릭 배포 고도화

> 작성일: 2026-07-12 · 상태: **Phase 1 완료** (2026-07-12)

## 한 문장 목표

네이버 플레이스에서 조회한 카페 데이터(상호·주소·영업시간·메뉴)를 원클릭 배포 카페 템플릿(small-biz-cafe)에 연결해, **AI API·별도 비용 없이** 실제 가게 홈페이지를 생성하는 파이프라인을 만든다.

## 배경

- 기존 카페 템플릿의 데모 데이터는 가상 업체 "온기 로스터리" — 실제 가게 데이터로 교체해 쇼케이스 신뢰도를 높인다.
- 1호 실증 대상: **카페 라이츠** (건대입구, 네이버 place `2007976823`) — [04-cafe-wrights-dataset.md](./04-cafe-wrights-dataset.md)
- 데이터 수집→템플릿 반영 과정을 재사용 가능한 프롬프트로 표준화해, 이후 어떤 카페든 같은 절차로 온보딩한다.

## 문서 인덱스

| 문서 | 내용 |
|------|------|
| [01-feasibility.md](./01-feasibility.md) | 비용/AI 의존성 검토 — **AI API·별도 비용 없이 가능 판정** 근거 |
| [02-service-plan.md](./02-service-plan.md) | 서비스 기획 — 표준 카페 데이터셋 스키마, 템플릿 매핑 규칙, 3단계 로드맵 |
| [03-prompts.md](./03-prompts.md) | 재사용 프롬프트 모음 — 신규 카페 온보딩(P-1)·데이터 갱신(P-2)·데이터셋 추출(P-3) |
| [04-cafe-wrights-dataset.md](./04-cafe-wrights-dataset.md) | 카페라이츠 수집 데이터 스냅샷 (P-1 입출력 예시 겸용) |

## 현재 단계 (Phase 1)

1. ✅ 비용/AI 의존성 검토 — 파이프라인 AI import 0건 확인
2. ✅ 카페라이츠 데이터 수집 (2026-07-12, 메뉴 14종)
3. ✅ 템플릿 기본값 교체 (온기 로스터리 → 카페 라이츠) + `naverPlaceUrl` 필드 추가 (2026-07-12)
   - 4파일: 모듈 스키마 · 제너레이터 · 템플릿 번들 · 샘플 콘텐츠. `naverPlaceUrl`은 base-generator generateConfigTs/parseConfigToState까지 배선 (생성 config 누락 시 배포 사이트 빌드 실패 방지)
4. ✅ 템플릿 피커 노출 순서 상향 (2026-07-12)
   - 실체는 display_order가 아니라 `template-picker-step.tsx`의 **상단 고정 슬롯**(기존 link-card 고정) — 이를 small-biz-cafe로 교체. display_order(카페 6·링크카드 7)는 카탈로그/랜딩에서 이미 카페가 앞서므로 무변경

이후 로드맵(Phase 2 위저드 입력 필드, Phase 3 자동 수집 검토)은 [02-service-plan.md](./02-service-plan.md) 참조.
