# 서비스 연결 동기화 기획

**상태**: 조건부추진 (2026-03-23 v2 고도화)
**최종 결정**: P1 백로그 완료 후 Phase 0(수동 Push)부터 단계적 착수
**최신 문서**: `2026-03-23_service-sync-v2.md` / `.html` (통합 기획서)

---

## 기획 경과

### 1차 검토: 환경변수 중계(Relay) API -- 기각
- **아이디어**: 외부 서비스에서 Linkmap API 토큰 하나로 환경변수를 pull
- **결과**: 기각 (2.0/5.0) -- 보안 SPOF, 타겟 불일치, 경쟁 우위 부재
- **문서**: `2026-03-22_env-relay-api.md`

### 2차 검토: 자동 동기화(Push) -- 보류 (2026-03-22)
- **아이디어**: Linkmap에서 환경변수 변경 시 Vercel/Railway/Netlify에 자동 push
- **결과**: 기술적으로 실현 가능 (기존 GitHub 동기화 패턴 70-75% 재활용)
- **보류 사유**: 이후 기획으로 보류
- **문서**: `2026-03-22_env-relay-api.md` 섹션 6

### 3차 검토: Push 방식 심층 타당성 분석 -- 조건부추진 (2026-03-23)
- **6가지 관점**: 기술(4/5), 보안(3/5), 시장(3/5), 핵심가치(3/5), 경쟁(3/5), MVP(4/5)
- **종합**: 3.3/5.0 -- 조건부추진
- **핵심 결정**:
  - Phase 0 (수동 Push 버튼) 3-5일로 가치 검증
  - P1 백로그(Stripe, 팀 RBAC)보다 우선순위 낮음
  - 토큰 수집은 PAT 직접 입력으로 MVP
- **문서**: `2026-03-23_push-sync-feasibility.md`

### 4차: v2 통합 기획 고도화 (2026-03-23)
- **10개 서비스 벤치마킹**: Doppler, Infisical, Vault, 1Password, Vercel, Railway, Netlify, Render, AWS SM, GCP SM
- **5대 트렌드 분석**: AI 시크릿 위기(2,865만 건), OIDC/WIF, MCP+시크릿, HCP Vault EOL, Config as Service
- **전략적 포지셔닝**: "시크릿 매니저와 경쟁하지 않는다 — 시각화+동기화 허브"
- **Quick Win 6개**: 환경별 분리, Reference 변수, 안전 관리 가이드, 노후화 알림, Empty State 가이드, MCP 컨텍스트
- **문서**: `2026-03-23_service-sync-v2.md` + `2026-03-23_service-sync-v2.html`
- **벤치마킹**: `docs/benchmark/env-secrets-landscape/report.md`

---

## 추진 로드맵

| Phase | 내용 | 공수 | 조건 |
|-------|------|------|------|
| Phase 0 | 수동 Push 버튼 (Vercel) | 3-5일 | P1 백로그 1개 완료 후 |
| Phase 1 | 자동 Push (Vercel) | +7-11일 | Phase 0 사용자 반응 양호 |
| Phase 2 | Netlify + Railway 추가 | +5-7일 | Phase 1 안정화 후 |
| Phase 3 | GitHub 통합 마이그레이션 | 미정 | 어댑터 구조 안정화 후 |

---

## 파일 목록

| 파일 | 설명 |
|------|------|
| `2026-03-23_service-sync-v2.md` | **v2 통합 기획서** (최신, 모든 분석 통합) |
| `2026-03-23_service-sync-v2.html` | **v2 시각화 기획서** (인터랙티브 HTML) |
| `2026-03-22_env-relay-api.md` | 1-2차 검토 (중계 기각 + Push 초기 설계) |
| `2026-03-22_env-relay-api.html` | 1-2차 검토 시각화 |
| `2026-03-23_push-sync-feasibility.md` | 3차 검토 (Push 심층 타당성 6관점 분석) |
| `README.md` | 이 파일 (기획 경과 요약) |

---

## 재개 시 참고사항
- 기존 GitHub Secrets 자동 동기화가 완전 구현됨 (`src/lib/github/auto-sync.ts`)
- 이 패턴을 어댑터로 범용화하는 것이 핵심
- Vercel API: `upsert=true`로 idempotent CRUD 가능
- 보안 강화(per-project 암호화, 토큰 스코프)는 독립적으로 진행 가능
