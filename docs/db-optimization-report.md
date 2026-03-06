# DB 인덱싱 & 쿼리 최적화 고도화 보고서

> **작성일**: 2026-03-06
> **범위**: 전체 DB 구조 (70개 마이그레이션, 35+ 테이블, 23개 쿼리 훅, 45+ API 라우트)
> **관점**: CTO / 전문 개발자 수준 점검

---

## 1. 현황 요약

| 항목 | Before | After (M071) |
|------|--------|-------------|
| 인덱스 수 | 92개 (복합 7개) | 106개 (복합 15개) |
| CHECK 제약조건 | 44개 | 48개 |
| DB 함수 (RPC) | 6개 | 10개 |
| N+1 루프 (env/sync) | 3개 루프 | 0개 (배치화) |

---

## 2. 수행된 최적화

### 2.1 인덱스 추가 (14개, M071)

#### HIGH PRIORITY (8개)

| 인덱스 | 테이블 | 근거 |
|--------|--------|------|
| `idx_project_services_status` | project_services | 대시보드 상태 필터링, env/sync 상태 업데이트 |
| `idx_project_services_service` | project_services | service_id 단독 JOIN (카탈로그 연결) |
| `idx_env_vars_service_env` | environment_variables | 서비스별+환경별 조회 (partial: deleted_at IS NULL) |
| `idx_service_accounts_user_status` | service_accounts | 사용자별 활성 계정 조회 (partial: active) |
| `idx_audit_logs_user_time` | audit_logs | 사용자별 감사 이력 시간순 (partial: user_id IS NOT NULL) |
| `idx_team_members_team_user` | team_members | RLS 정책 JOIN 최적화 (가장 빈번한 패턴) |
| `idx_homepage_deploys_user_time` | homepage_deploys | 사용자별 최신 배포 조회 |
| `idx_homepage_deploys_template` | homepage_deploys | 템플릿별 배포 이력 |

#### MEDIUM PRIORITY (6개)

| 인덱스 | 테이블 | 근거 |
|--------|--------|------|
| `idx_user_connections_project_type` | user_connections | 서비스맵 렌더링 필터 (partial: deleted_at IS NULL) |
| `idx_cost_attachments_ps_time` | cost_attachments | 서비스별 비용 첨부 최신순 |
| `idx_feature_requests_category_votes` | feature_requests | 카테고리+인기순 정렬 |
| `idx_visitor_logs_created_path` | visitor_logs | 관리자 통계 시간+경로 |
| `idx_oauth_states_user_expires` | oauth_states | 유효 토큰만 조회 (partial) |
| `idx_projects_user_active` | projects | 메인 프로젝트 목록 (partial: deleted_at IS NULL) |

### 2.2 CHECK 제약조건 보강 (4개)

| 제약 | 테이블 | 이유 |
|------|--------|------|
| `health_checks_environment_check` | health_checks | Zod에만 있고 DB에 누락 |
| `user_connections_source_target_different` | user_connections | 자기 자신 연결 방지 |
| `project_services_cost_tier_xor_custom` | project_services | cost_tier와 custom_cost 상호배제 |
| `oauth_states_flow_context_check` (확장) | oauth_states | 'settings' 값 누락 |

### 2.3 N+1 쿼리 제거 (env/sync)

**Before**: 3개의 순차 루프
```
Loop 1: env var 개별 UPDATE (N회 쿼리)
Loop 2: service status 개별 UPDATE (N회 쿼리)
Loop 3: auto-connect 개별 INSERT (최대 10회)
+ 3개 순차 쿼리 (project_services, dependencies, connections)
```

**After**: 배치 처리
```
Batch 1: service_id별 그룹화 -> Promise.all() 배치 UPDATE
Batch 2: connected/in_progress 2개 배치 UPDATE
Batch 3: 3개 조회 Promise.all() + 단일 배치 INSERT
```

**예상 개선**: 서비스 20개 기준 ~30개 쿼리 -> ~8개 쿼리 (73% 감소)

### 2.4 DB 레벨 통계 함수 (3개)

| 함수 | 용도 | 효과 |
|------|------|------|
| `get_visitor_stats(days)` | 방문자 요약 통계 | 메모리 집계 -> DB 집계 |
| `get_visitor_daily_trend(days)` | 일별 추이 | 30일 로그 전체 로드 불필요 |
| `get_top_pages(days, limit)` | 인기 페이지 | GROUP BY + LIMIT으로 효율적 |

### 2.5 유틸리티 함수

| 함수 | 용도 |
|------|------|
| `set_updated_at()` | 통합 updated_at 트리거 (3개 중복 해소) |
| `cleanup_expired_oauth_states()` | 만료 CSRF 토큰 정리 |

---

## 3. 발견된 이슈 & 현재 상태

### 3.1 해결 완료

| 이슈 | 상태 | 해결 |
|------|------|------|
| Storage bucket RLS | M041 수정됨 | 폴더 경로 검증 |
| audit_logs INSERT 정책 | M009 수정됨 | service_role만 |
| subscriptions 관리 정책 | M009 수정됨 | service_role만 |
| ai_feature_qna FK 누락 | M050 수정됨 | FK 추가 |
| audit_logs 복합 인덱스 | M051 수정됨 | 3-컬럼 인덱스 |
| Quota race condition | M052 수정됨 | Advisory lock |
| profiles.is_admin 보호 | M021 수정됨 | 트리거 보호 |

### 3.2 M071에서 해결

| 이슈 | 해결 방법 |
|------|---------|
| project_services 상태 인덱스 누락 | 복합 인덱스 추가 |
| team_members RLS JOIN 성능 | 복합 인덱스 추가 |
| env/sync N+1 루프 | 배치 처리 전환 |
| Zod-DB 검증 불일치 4건 | CHECK 제약 추가 |
| 관리자 통계 메모리 집계 | DB 함수 제공 |

### 3.3 향후 개선 권장 (P2-P3)

| 이슈 | 우선도 | 설명 |
|------|--------|------|
| updated_at 트리거 통합 | P2 | 기존 3개 함수를 1개로 교체 (마이그레이션 필요) |
| visitor_logs API 리팩토링 | P2 | DB 함수 활용으로 전환 |
| FK ON DELETE 미지정 정리 | P2 | project_services.service_id, user_connections FK |
| service_accounts UNIQUE 강화 | P3 | 사용자당 서비스별 제한 검토 |
| soft-delete 일관성 확대 | P3 | project_services, service_accounts 등 |
| budget_currency 기본값 | P3 | USD -> KRW 검토 |

---

## 4. 쿼리 패턴 평가

### 4.1 Good Patterns (유지)

- **Promise.all() 병렬 쿼리**: 대시보드(6개), 관리자 통계(8개), 휴지통(3개)
- **Optimistic Updates**: connections, env-vars, favorites
- **QueryKey Factory**: 계층적 네임스페이싱 119줄
- **배치 조회**: health-checks `.in()`, trash 병렬 조회
- **RPC + Advisory Lock**: quota check race condition 방지
- **staleTime 전략**: catalog 5분, dashboard 30초, 환율 1시간

### 4.2 주의 패턴

| 패턴 | 위치 | 위험도 | 대응 |
|------|------|--------|------|
| 전체 로드 + 메모리 집계 | admin/visitors | LOW (admin only) | DB 함수 제공 (M071) |
| encrypted_value 불필요 로드 | env-vars 목록 | LOW | select 컬럼 최적화 가능 |
| dependencies 전체 로드 | env/sync | LOW | 데이터 소량 (~200행) |

---

## 5. RLS 정책 & 보안 평가

| 카테고리 | 점수 | 비고 |
|---------|------|------|
| RLS 커버리지 | 9/10 | 35개 테이블 전체 활성화, 159개 정책 |
| CHECK 제약 | 8/10 | M071에서 4개 보강 |
| UNIQUE 제약 | 8/10 | 27개, 핵심 관계 충분 |
| 참조 무결성 | 7/10 | CASCADE 잘 설정, 일부 RESTRICT 미해결 |
| Zod-DB 동기화 | 8/10 | M071에서 주요 불일치 해소 |

---

## 6. 적용 방법

### 마이그레이션 적용
```
supabase/migrations/071_query_optimization_indexes.sql
```

Supabase MCP 연결이 필요합니다. `/mcp` 명령으로 연결 후 `apply_migration`으로 적용하세요.

**주의**: `CREATE INDEX CONCURRENTLY`는 트랜잭션 내에서 실행 불가.
Supabase Studio SQL Editor에서 직접 실행하거나, `CONCURRENTLY` 제거 후 마이그레이션 적용.

### 코드 변경
```
src/app/api/env/sync/route.ts  -- N+1 루프 -> 배치 처리
```
