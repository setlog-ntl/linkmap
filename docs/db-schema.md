# Linkmap Database Schema Reference

> **Last Updated**: 2026-02-25
> **Migrations**: 001 ~ 046 (46 files)
> **Engine**: Supabase (PostgreSQL 15+)

이 문서는 바이브코딩 시 DB 구조를 빠르게 참조하기 위한 스키마 레퍼런스입니다.

---

## Table of Contents

1. [Core Tables](#1-core-tables)
2. [Service Catalog Tables](#2-service-catalog-tables)
3. [Project-Service Binding Tables](#3-project-service-binding-tables)
4. [Environment & Security Tables](#4-environment--security-tables)
5. [Team & Auth Tables](#5-team--auth-tables)
6. [GitHub Integration Tables](#6-github-integration-tables)
7. [One-Click Deploy Tables](#7-one-click-deploy-tables)
8. [AI System Tables](#8-ai-system-tables)
9. [Package Registry Tables](#9-package-registry-tables)
10. [Audit & Monitoring Tables](#10-audit--monitoring-tables)
11. [Enums & Custom Types](#11-enums--custom-types)
12. [RLS Policy Summary](#12-rls-policy-summary)
13. [Known Issues & Constraints](#13-known-issues--constraints)
14. [Migration Convention](#14-migration-convention)
15. [TypeScript Type Mapping](#15-typescript-type-mapping)

---

## 1. Core Tables

### profiles
> 사용자 프로필 (auth.users 확장)

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID PK | NO | - | FK → auth.users(id) |
| email | TEXT | NO | - | |
| name | TEXT | YES | NULL | |
| avatar_url | TEXT | YES | NULL | |
| is_admin | BOOLEAN | NO | false | M019에서 추가, M021 트리거로 보호 |
| created_at | TIMESTAMPTZ | NO | now() | |
| updated_at | TIMESTAMPTZ | NO | now() | |

**RLS**: 본인만 조회/수정
**Trigger**: `prevent_is_admin_self_update()` — service_role만 is_admin 변경 가능
**TS Type**: `Profile` (`src/types/core.ts`)

### projects
> 프로젝트 컨테이너

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID PK | NO | gen_random_uuid() | |
| user_id | UUID FK | NO | - | → auth.users(id) |
| name | TEXT | NO | - | |
| description | TEXT | YES | NULL | |
| tech_stack | JSONB | NO | '{}' | |
| team_id | UUID FK | YES | NULL | → teams(id), M005 |
| main_service_id | UUID FK | YES | NULL | → project_services(id), M034 |
| icon_type | TEXT | YES | NULL | 'brand'\|'emoji'\|'custom', M036 |
| icon_value | TEXT | YES | NULL | slug\|char\|URL, M036 |
| link_url | TEXT | YES | NULL | max 500 chars, M038 |
| is_favorited | BOOLEAN | NO | false | 즐겨찾기 여부, M044 |
| created_at | TIMESTAMPTZ | NO | now() | |
| updated_at | TIMESTAMPTZ | NO | now() | |

**Indexes**: `idx_projects_user_id`, `idx_projects_team`, `idx_projects_user_favorited`
**RLS**: 소유자 CRUD + 팀 멤버 조회
**TS Type**: `Project` (`src/types/project.ts`)

---

## 2. Service Catalog Tables

### services
> 시스템 서비스 카탈로그 (읽기 전용)

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID PK | NO | gen_random_uuid() | |
| name | TEXT | NO | - | |
| slug | TEXT UNIQUE | NO | - | |
| category | TEXT | NO | - | CHECK: ServiceCategory enum |
| description | TEXT | YES | NULL | |
| description_ko | TEXT | YES | NULL | |
| icon_url | TEXT | YES | NULL | |
| website_url | TEXT | YES | NULL | |
| docs_url | TEXT | YES | NULL | |
| pricing_info | JSONB | NO | '{}' | |
| required_env_vars | JSONB | NO | '[]' | |
| domain | TEXT FK | YES | NULL | → service_domains(id), M002 |
| subcategory | TEXT FK | YES | NULL | → service_subcategories(id), M002 |
| popularity_score | INT | YES | 0 | M002 |
| difficulty_level | TEXT | YES | NULL | CHECK: beginner\|intermediate\|advanced |
| tags | TEXT[] | YES | '{}' | GIN index, M002 |
| alternatives | TEXT[] | YES | '{}' | M002 |
| compatibility | JSONB | YES | NULL | M002 |
| official_sdks | JSONB | YES | NULL | M002 |
| free_tier_quality | TEXT | YES | NULL | CHECK: excellent\|good\|limited\|none |
| vendor_lock_in_risk | TEXT | YES | NULL | CHECK: low\|medium\|high |
| setup_time_minutes | INT | YES | NULL | M002 |
| monthly_cost_estimate | JSONB | YES | NULL | M002 |
| github_stars | INTEGER | YES | NULL | M047 |
| last_updated | TIMESTAMPTZ | YES | NULL | M002 |
| dashboard_layer | TEXT | YES | 'devtools' | CHECK: frontend\|backend\|devtools, M027 |
| dashboard_subcategory | TEXT | YES | NULL | M027 |
| supports_multi_account | BOOLEAN | YES | false | M031 |
| user_id | UUID FK | YES | NULL | → auth.users(id), M042. 커스텀 서비스 소유자 |
| is_custom | BOOLEAN | NO | false | M042. 커스텀 서비스 여부 |
| icon_emoji | TEXT | YES | NULL | M042. 커스텀 서비스 이모지 아이콘 |
| created_at | TIMESTAMPTZ | NO | now() | |

**Indexes**: `idx_services_category`, `idx_services_slug`, `idx_services_domain`, `idx_services_subcategory`, `idx_services_popularity`, `idx_services_difficulty`, `idx_services_tags` (GIN), `idx_services_dashboard_layer`, `idx_services_dashboard_subcategory`, `idx_services_user_id` (partial, M042), `idx_services_is_custom` (partial, M042)
**RLS**: 글로벌 서비스 인증 읽기 + 커스텀 서비스 본인/팀원 읽기 + 본인 CRUD (M042)
**TS Type**: `Service` (`src/types/service.ts`)

### service_domains
> 서비스 도메인 (1단계 분류)

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | TEXT PK | NO | - |
| name | TEXT | NO | - |
| name_ko | TEXT | YES | NULL |
| description | TEXT | YES | NULL |
| icon_name | TEXT | YES | NULL |
| order_index | INT | NO | 0 |

**RLS**: 공개 읽기
**TS Type**: `ServiceDomainRecord` (`src/types/service.ts`)

### service_subcategories
> 서비스 하위 분류 (3단계)

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | TEXT PK | NO | - |
| category | TEXT | NO | - |
| name | TEXT | NO | - |
| name_ko | TEXT | YES | NULL |
| description | TEXT | YES | NULL |

**RLS**: 공개 읽기
**TS Type**: `ServiceSubcategory` (`src/types/service.ts`)

### service_dependencies
> 서비스 간 의존 관계

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| service_id | UUID FK | NO | - |
| depends_on_service_id | UUID FK | NO | - |
| dependency_type | TEXT | NO | - |
| description | TEXT | YES | NULL |

**Constraint**: UNIQUE(service_id, depends_on_service_id)
**TS Type**: `ServiceDependency` (`src/types/service.ts`)

### service_guides
> 서비스별 상세 가이드 (1:1)

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| service_id | UUID FK UNIQUE | NO | - |
| quick_start | TEXT | YES | NULL |
| setup_steps | JSONB | YES | '[]' |
| code_examples | JSONB | YES | '{}' |
| pros | JSONB | YES | '[]' |
| cons | JSONB | YES | '[]' |
| updated_at | TIMESTAMPTZ | NO | now() |

**TS Type**: `ServiceGuide` (`src/types/service.ts`)

### service_comparisons
> 서비스 비교 매트릭스

**TS Type**: `ServiceComparison` (`src/types/service.ts`)

### service_cost_tiers
> 서비스 가격 단계

**TS Type**: `ServiceCostTier` (`src/types/service.ts`)

### service_changelog
> 서비스 변경 이력

**TS Type**: `ServiceChangelog` (`src/types/service.ts`)

---

## 3. Project-Service Binding Tables

### project_services
> 프로젝트에 연결된 서비스 (M:N)

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| project_id | UUID FK | NO | → projects(id) ON DELETE CASCADE |
| service_id | UUID FK | NO | → services(id) |
| status | TEXT | NO | 'not_started' |
| notes | TEXT | YES | NULL |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |

**Constraint**: UNIQUE(project_id, service_id)
**CHECK**: status IN ('not_started', 'in_progress', 'connected', 'error')
**RLS**: 프로젝트 소유자 + 팀 멤버
**TS Type**: `ProjectService` (`src/types/project.ts`)

### checklist_items
> 서비스별 체크리스트 (시스템 데이터)

**TS Type**: `ChecklistItem` (`src/types/project.ts`)

### user_checklist_progress
> 체크리스트 완료 상태

**TS Type**: `UserChecklistProgress` (`src/types/project.ts`)

### user_connections
> 사용자 정의 서비스 연결선

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID PK | NO | gen_random_uuid() | |
| project_id | UUID FK | NO | → projects(id) ON DELETE CASCADE | |
| source_service_id | UUID FK | NO | → services(id) | |
| target_service_id | UUID FK | NO | → services(id) | |
| connection_type | TEXT | NO | 'uses' | M028 확장 |
| connection_status | TEXT | YES | 'active' | M028 |
| environment | TEXT | YES | 'all' | M037 |
| label | TEXT | YES | NULL | |
| description | TEXT | YES | NULL | M028 |
| last_verified_at | TIMESTAMPTZ | YES | NULL | M028 |
| metadata | JSONB | YES | '{}' | M028 |
| created_by | UUID FK | NO | - | |
| created_at | TIMESTAMPTZ | NO | now() | |
| updated_at | TIMESTAMPTZ | NO | now() | |

**Constraint**: UNIQUE(project_id, source_service_id, target_service_id)
**CHECK connection_type**: uses\|integrates\|data_transfer\|api_call\|auth_provider\|webhook\|sdk
**CHECK connection_status**: active\|inactive\|error\|pending
**CHECK environment**: development\|staging\|production\|all
**TS Type**: `UserConnection` (`src/types/connection.ts`)

### project_service_overrides
> 프로젝트별 서비스 레이어 오버라이드

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| project_id | UUID FK | NO | → projects(id) ON DELETE CASCADE |
| service_id | UUID FK | NO | → services(id) |
| dashboard_layer | TEXT | YES | NULL |
| dashboard_subcategory | TEXT | YES | NULL |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |

**Constraint**: UNIQUE(project_id, service_id)
**TS Type**: (local in `src/lib/queries/layer-overrides.ts`)

---

## 4. Environment & Security Tables

### environment_variables
> 암호화된 환경변수 저장소

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| project_id | UUID FK | NO | → projects(id) ON DELETE CASCADE |
| service_id | UUID FK | YES | → services(id) |
| key_name | TEXT | NO | - |
| encrypted_value | TEXT | NO | - |
| environment | TEXT | NO | - |
| is_secret | BOOLEAN | NO | false |
| description | TEXT | YES | NULL |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |

**CHECK environment**: development\|staging\|production (3가지)
**Indexes**: `idx_env_vars_project`, `idx_env_vars_project_env`
**RLS**: 프로젝트 소유자 + 팀 멤버
**TS Type**: `EnvironmentVariable` (`src/types/env.ts`)

---

## 5. Team & Auth Tables

### teams

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| name | TEXT | NO | - |
| owner_id | UUID FK | NO | → auth.users(id) |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |

**TS Type**: 없음 (필요시 추가)

### team_members

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| team_id | UUID FK | NO | → teams(id) ON DELETE CASCADE |
| user_id | UUID FK | NO | → auth.users(id) |
| role | team_role ENUM | NO | - |
| invited_by | UUID FK | YES | NULL |
| joined_at | TIMESTAMPTZ | NO | now() |

**Constraint**: UNIQUE(team_id, user_id)
**TS Type**: 없음 (필요시 추가)

### subscriptions

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| user_id | UUID FK UNIQUE | NO | → auth.users(id) |
| plan | subscription_plan ENUM | NO | 'free' |
| stripe_customer_id | TEXT UNIQUE | YES | NULL |
| stripe_subscription_id | TEXT UNIQUE | YES | NULL |
| status | TEXT | NO | 'active' |
| current_period_start | TIMESTAMPTZ | YES | NULL |
| current_period_end | TIMESTAMPTZ | YES | NULL |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |

**RLS**: service_role만 관리, 본인 조회
**TS Type**: `Subscription` (`src/types/core.ts`)

### plan_quotas

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| plan | subscription_plan PK | NO | - |
| max_projects | INT | NO | - |
| max_env_vars_per_project | INT | NO | - |
| max_services_per_project | INT | NO | - |
| max_team_members | INT | NO | - |
| max_homepage_deploys | INT | NO | 3 |

**Seed Data**: free(3,20,10,0,3), pro(20,100,50,0,999999), team(100,500,100,25,999999)
**RLS**: 인증된 사용자 읽기 전용
**TS Type**: `PlanQuota` (`src/types/core.ts`)

### api_tokens

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| user_id | UUID FK | NO | → auth.users(id) |
| name | TEXT | NO | - |
| token_hash | TEXT UNIQUE | NO | - |
| last_used_at | TIMESTAMPTZ | YES | NULL |
| expires_at | TIMESTAMPTZ | YES | NULL |
| created_at | TIMESTAMPTZ | NO | now() |

**RLS**: 본인만 관리
**TS Type**: `ApiToken` (`src/types/core.ts`)

---

## 6. GitHub Integration Tables

### service_accounts
> OAuth/API 키 저장 (암호화)

| Column | Type | Nullable | Default | Notes |
|--------|------|----------|---------|-------|
| id | UUID PK | NO | gen_random_uuid() | |
| project_id | UUID FK | YES | NULL | M015에서 nullable |
| service_id | UUID FK | NO | → services(id) | |
| user_id | UUID FK | NO | → auth.users(id) | |
| connection_type | TEXT | NO | - | oauth\|api_key\|manual |
| encrypted_access_token | TEXT | YES | NULL | **서버만** |
| encrypted_refresh_token | TEXT | YES | NULL | **서버만** |
| token_expires_at | TIMESTAMPTZ | YES | NULL | |
| oauth_scopes | TEXT[] | YES | NULL | |
| oauth_provider_user_id | TEXT | YES | NULL | GitHub user ID 등 |
| oauth_metadata | JSONB | YES | '{}' | login, avatar 등 |
| encrypted_api_key | TEXT | YES | NULL | **서버만** |
| api_key_label | TEXT | YES | NULL | |
| display_name | TEXT | YES | NULL | M031 |
| auth_method | TEXT | YES | 'oauth' | M031: oauth\|pat\|github_app\|deploy_key |
| multi_account_provider | BOOLEAN | YES | false | M031, 트리거 자동 설정 |
| status | TEXT | NO | 'active' | active\|expired\|revoked\|error |
| last_verified_at | TIMESTAMPTZ | YES | NULL | |
| error_message | TEXT | YES | NULL | |
| created_at | TIMESTAMPTZ | NO | now() | |
| updated_at | TIMESTAMPTZ | NO | now() | |

**Unique Indexes (M031)**: 4개 partial unique index로 다중 계정 지원
**Trigger**: `set_multi_account_provider()` — services.supports_multi_account 자동 반영
**RLS**: 본인 + 프로젝트 소유자 + 팀 멤버 읽기
**TS Type**: `ServiceAccount` (`src/types/service-account.ts`)

### oauth_states
> CSRF 보호용 OAuth 상태 토큰

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| user_id | UUID FK | NO | → auth.users(id) |
| project_id | UUID FK | YES | NULL |
| service_slug | TEXT | NO | - |
| state_token | TEXT UNIQUE | NO | - |
| redirect_url | TEXT | YES | NULL |
| flow_context | TEXT | YES | 'project' |
| created_at | TIMESTAMPTZ | NO | now() |
| expires_at | TIMESTAMPTZ | NO | - |

**CHECK flow_context**: oneclick\|project\|settings
**TS Type**: 없음 (내부 사용)

### project_github_repos
> 프로젝트-GitHub 리포 바인딩

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| project_id | UUID FK | NO | → projects(id) ON DELETE CASCADE |
| service_account_id | UUID FK | NO | → service_accounts(id) |
| owner | TEXT | NO | - |
| repo_name | TEXT | NO | - |
| repo_full_name | TEXT | NO | - |
| default_branch | TEXT | NO | 'main' |
| auto_sync_enabled | BOOLEAN | NO | false |
| sync_environment | TEXT | NO | 'production' |
| sync_branch | TEXT | YES | NULL | M032 |
| sync_directory | TEXT | YES | NULL | M032 |
| webhook_secret_encrypted | TEXT | YES | NULL | M032 |
| last_synced_at | TIMESTAMPTZ | YES | NULL |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |

**Constraint**: UNIQUE(project_id, repo_full_name)
**RLS**: 프로젝트 소유자 + 팀 editor/viewer
**TS Type**: (queried inline, no dedicated type)

---

## 7. One-Click Deploy Tables

### homepage_templates
> 원클릭 배포 템플릿

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| slug | TEXT UNIQUE | NO | - |
| name | TEXT | NO | - |
| name_ko | TEXT | YES | NULL |
| description | TEXT | YES | NULL |
| preview_image_url | TEXT | YES | NULL |
| github_owner | TEXT | NO | - |
| github_repo | TEXT | NO | - |
| default_branch | TEXT | NO | 'main' |
| framework | TEXT | NO | 'nextjs' |
| required_env_vars | JSONB | YES | '[]' |
| tags | TEXT[] | YES | '{}' |
| deploy_target | TEXT | YES | 'github_pages' | M016 |
| is_premium | BOOLEAN | NO | false |
| is_active | BOOLEAN | NO | true |
| display_order | INT | NO | 0 |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |

**RLS**: 공개 읽기 (is_active=true)
**TS Type**: `HomepageTemplate` (`src/types/core.ts`)

### homepage_deploys
> 배포 추적

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| user_id | UUID FK | NO | → auth.users(id) |
| project_id | UUID FK | YES | → projects(id) |
| template_id | UUID FK | NO | → homepage_templates(id) |
| forked_repo_full_name | TEXT | YES | NULL |
| forked_repo_url | TEXT | YES | NULL |
| fork_status | TEXT | NO | 'pending' |
| deploy_method | TEXT | NO | 'github_pages' | M022 |
| pages_url | TEXT | YES | NULL | M016 |
| pages_status | TEXT | YES | 'pending' | M016 |
| deploy_status | TEXT | NO | 'pending' |
| deploy_error_message | TEXT | YES | NULL |
| site_name | TEXT | YES | NULL |
| custom_domain | TEXT | YES | NULL |
| config_data | JSONB | YES | '{}' |
| created_at | TIMESTAMPTZ | NO | now() |
| updated_at | TIMESTAMPTZ | NO | now() |
| deployed_at | TIMESTAMPTZ | YES | NULL |

**RLS**: 본인만 관리
**TS Type**: `HomepageDeploy` (`src/types/core.ts`)

---

## 8. AI System Tables

### ai_assistant_config
> 글로벌 AI 설정 (1 row)

**TS Type**: `AiAssistantConfig` (`src/types/ai.ts`)
**RLS**: admin CRUD, authenticated 읽기

### ai_personas
> AI 페르소나 프로필

**TS Type**: `AiPersona` (`src/types/ai.ts`)
**RLS**: admin CRUD, authenticated 읽기 (is_active)

### ai_providers
> LLM 프로바이더 설정

**TS Type**: `AiProvider` (`src/types/ai.ts`)
**RLS**: admin 전용
**Seed**: openai(enabled), anthropic, google

### ai_guardrails
> 콘텐츠 필터링 규칙

**TS Type**: `AiGuardrails` (`src/types/ai.ts`)
**RLS**: admin 전용

### ai_prompt_templates
> 프롬프트 라이브러리

**TS Type**: `AiPromptTemplate` (`src/types/ai.ts`)
**RLS**: admin CRUD, authenticated 읽기 (is_active)

### ai_usage_logs
> AI 사용량 분석

**TS Type**: `AiUsageLog` (`src/types/ai.ts`)
**RLS**: admin 전용

### ai_feature_personas (M039)
> AI 기능별 페르소나 매핑

**TS Type**: `AiFeaturePersona` (`src/types/ai.ts`)
**RLS**: admin CRUD, authenticated 읽기 (is_active)

### ai_feature_qna (M040)
> AI 기능별 Q&A 가이드

**TS Type**: `AiFeatureQna` (`src/types/ai.ts`)
**RLS**: admin CRUD, authenticated 읽기 (is_active)

---

## 9. Package Registry Tables

### packages
> 커뮤니티 패키지

| Column | Type |
|--------|------|
| id | UUID PK |
| slug | TEXT UNIQUE |
| name, description | TEXT |
| author_id | UUID FK |
| is_public | BOOLEAN |
| tags | TEXT[] (GIN) |
| tech_stack | JSONB |
| downloads_count | INT |

**TS Type**: 없음 (향후 추가)

### package_versions
> 패키지 버전

**Constraint**: UNIQUE(package_id, version)
**TS Type**: 없음

### package_installations
> 패키지 설치 이력

**TS Type**: 없음

---

## 10. Audit & Monitoring Tables

### audit_logs

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| user_id | UUID FK | YES | NULL |
| action | TEXT | NO | - |
| resource_type | TEXT | NO | - |
| resource_id | TEXT | YES | NULL |
| details | JSONB | YES | '{}' |
| ip_address | INET | YES | NULL |
| created_at | TIMESTAMPTZ | NO | now() |

**Indexes**: `idx_audit_logs_user_id`, `idx_audit_logs_created_at`, `idx_audit_logs_resource`
**RLS**: 본인 조회, service_role INSERT
**TS Type**: `AuditLog` (`src/types/core.ts`)

### health_checks

| Column | Type | Nullable | Default |
|--------|------|----------|---------|
| id | UUID PK | NO | gen_random_uuid() |
| project_service_id | UUID FK | NO | → project_services(id) |
| environment | TEXT | NO | - |
| status | TEXT | NO | - |
| message | TEXT | YES | NULL |
| response_time_ms | INT | YES | NULL |
| details | JSONB | YES | '{}' |
| checked_at | TIMESTAMPTZ | NO | now() |

**CHECK status**: healthy\|unhealthy\|degraded\|unknown
**RLS**: 프로젝트 소유자 + 팀 멤버 조회, service_role INSERT
**TS Type**: `HealthCheck` (`src/types/env.ts`)

---

## 11. Enums & Custom Types

```sql
-- subscription_plan
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team');

-- team_role
CREATE TYPE team_role AS ENUM ('admin', 'editor', 'viewer');
```

### TypeScript Enum Mapping

| DB Value | TS Type | Location |
|----------|---------|----------|
| ServiceCategory (30 values) | `ServiceCategory` | core.ts |
| ServiceDomain (8 values) | `ServiceDomain` | core.ts |
| ServiceStatus (4 values) | `ServiceStatus` | core.ts |
| Environment (3 values) | `Environment` | core.ts |
| ConnectionEnvironment (4 values) | `ConnectionEnvironment` | connection.ts |
| HealthCheckStatus (4 values) | `HealthCheckStatus` | core.ts |
| TeamRole (3 values) | `TeamRole` | core.ts |
| DashboardLayer (3 values) | `DashboardLayer` | dashboard.ts |
| UserConnectionType (7 values) | `UserConnectionType` | connection.ts |
| ConnectionStatus (4 values) | `ConnectionStatus` | connection.ts |
| ServiceAccountConnectionType (3 values) | `ServiceAccountConnectionType` | service-account.ts |
| ServiceAccountStatus (4 values) | `ServiceAccountStatus` | service-account.ts |
| ServiceAccountAuthMethod (4 values) | `ServiceAccountAuthMethod` | service-account.ts |
| AiProviderSlug (3 values) | `AiProviderSlug` | ai.ts |
| ContentFilterLevel (4 values) | `ContentFilterLevel` | ai.ts |
| AiFeatureSlug (6 values) | `AiFeatureSlug` | ai.ts |
| IconType (3 values) | `IconType` | core.ts |
| SubscriptionPlan (3 values) | `SubscriptionPlan` | core.ts |

---

## 12. RLS Policy Summary

| 패턴 | 적용 테이블 | 설명 |
|------|------------|------|
| **본인만** | profiles, subscriptions, api_tokens, oauth_states, homepage_deploys | auth.uid() = user_id |
| **프로젝트 소유자** | project_services, environment_variables, user_connections, project_github_repos | project.user_id = auth.uid() |
| **팀 멤버 확장** | 위 테이블 + health_checks, user_checklist_progress | team_members 조인 |
| **admin 전용** | ai_providers, ai_guardrails, ai_usage_logs | profiles.is_admin = true |
| **인증된 읽기** | services, service_domains, plan_quotas, ai_personas(active) | authenticated role |
| **공개 읽기** | homepage_templates (active) | anon + authenticated |
| **service_role** | audit_logs INSERT, health_checks INSERT, subscriptions CRUD | service_role only |

### RLS 주의사항
- **모든 테이블에 RLS 활성화됨** — `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- API 라우트에서 `getUser()` 체크 + RLS = 이중 방어
- `createAdminClient()`는 RLS 우회 — 감사 로그 전용으로만 사용

---

## 13. Known Issues & Constraints

### CRITICAL
1. ~~**Storage Bucket RLS (M036)**~~: **M041에서 수정 완료** — INSERT/UPDATE/DELETE 정책이 `(storage.foldername(name))[1] = auth.uid()::text`로 본인 폴더만 허용
2. **ai_feature_qna FK 누락 (M040)**: `feature_slug`가 TEXT이며 `ai_feature_personas.feature_slug`로의 FK 제약 없음

### HIGH
3. **service_accounts 복잡한 unique index (M031)**: 4개의 partial unique index → 쿼리 플래너 혼동 가능성
4. **oauth_provider_user_id 검증 누락 (M012)**: OAuth 연결 시 NOT NULL이어야 하지만 스키마에서 강제하지 않음
5. **audit_logs 복합 인덱스 누락**: `(resource_type, resource_id, created_at)` 인덱스 필요

### MEDIUM
6. **dashboard_layer NOT NULL 미강제 (M027)**: 일부 서비스가 NULL일 수 있음
7. **display_order 수동 관리**: 템플릿 추가 시 수동으로 order 지정 필요
8. **Vercel 필드 미정리 (M022)**: `homepage_deploys`에 deprecated된 Vercel 관련 컬럼 잔존

### LOW
9. **ai_personas.previous_version_id**: 순환 참조 가능성 (cycle detection 없음)
10. **project_templates vs homepage_templates**: 두 개의 템플릿 시스템 공존

---

## 14. Migration Convention

### 파일 네이밍
```
supabase/migrations/NNN_description.sql
```
- NNN: 3자리 숫자 (001~046)
- 다음 마이그레이션: **047**

### 마이그레이션 작성 규칙
1. **IF NOT EXISTS / IF EXISTS** 사용 → idempotent하게
2. 새 테이블 생성 시 반드시:
   - `ENABLE ROW LEVEL SECURITY`
   - 최소 1개 RLS 정책
   - `created_at TIMESTAMPTZ NOT NULL DEFAULT now()`
3. 컬럼 추가 시 `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`
4. CHECK 제약조건 추가 시 기존 데이터 호환 확인
5. FK 추가 시 `ON DELETE CASCADE` 또는 `SET NULL` 명시

### 새 마이그레이션 후 필수 작업
1. `src/types/` 해당 타입 파일 업데이트
2. 관련 쿼리 파일 (`src/lib/queries/`) 업데이트
3. 이 문서 (`docs/db-schema.md`) 업데이트
4. RLS 정책 추가 시 `docs/db-schema.md` § 12 업데이트

---

## 15. TypeScript Type Mapping

### 테이블 ↔ 타입 매핑 표

| DB Table | TS Type | File | Status |
|----------|---------|------|--------|
| profiles | `Profile` | core.ts | ✅ |
| projects | `Project` | project.ts | ✅ |
| services | `Service` | service.ts | ✅ |
| project_services | `ProjectService` | project.ts | ✅ |
| checklist_items | `ChecklistItem` | project.ts | ✅ |
| user_checklist_progress | `UserChecklistProgress` | project.ts | ✅ |
| environment_variables | `EnvironmentVariable` | env.ts | ✅ |
| project_templates | `ProjectTemplate` | project.ts | ✅ |
| service_domains | `ServiceDomainRecord` | service.ts | ✅ |
| service_subcategories | `ServiceSubcategory` | service.ts | ✅ |
| service_dependencies | `ServiceDependency` | service.ts | ✅ |
| service_guides | `ServiceGuide` | service.ts | ✅ |
| service_comparisons | `ServiceComparison` | service.ts | ✅ |
| service_cost_tiers | `ServiceCostTier` | service.ts | ✅ |
| service_changelog | `ServiceChangelog` | service.ts | ✅ |
| audit_logs | `AuditLog` | core.ts | ✅ |
| subscriptions | `Subscription` | core.ts | ✅ |
| plan_quotas | `PlanQuota` | core.ts | ✅ |
| teams | - | - | ❌ 미정의 |
| team_members | - | - | ❌ 미정의 |
| api_tokens | `ApiToken` | core.ts | ✅ |
| user_connections | `UserConnection` | connection.ts | ✅ |
| health_checks | `HealthCheck` | env.ts | ✅ |
| packages | - | - | ❌ 미정의 |
| package_versions | - | - | ❌ 미정의 |
| package_installations | - | - | ❌ 미정의 |
| service_accounts | `ServiceAccount` | service-account.ts | ✅ |
| oauth_states | - | - | ❌ 내부전용 |
| project_github_repos | - | - | ❌ 인라인 쿼리 |
| homepage_templates | `HomepageTemplate` | core.ts | ✅ |
| homepage_deploys | `HomepageDeploy` | core.ts | ✅ |
| project_service_overrides | - | - | ⚠️ 로컬 타입 |
| ai_assistant_config | `AiAssistantConfig` | ai.ts | ✅ |
| ai_personas | `AiPersona` | ai.ts | ✅ |
| ai_providers | `AiProvider` | ai.ts | ✅ |
| ai_guardrails | `AiGuardrails` | ai.ts | ✅ |
| ai_prompt_templates | `AiPromptTemplate` | ai.ts | ✅ |
| ai_usage_logs | `AiUsageLog` | ai.ts | ✅ |
| ai_feature_personas | `AiFeaturePersona` | ai.ts | ✅ |
| ai_feature_qna | `AiFeatureQna` | ai.ts | ✅ |

### 타입 동기화 체크리스트

새 DB 컬럼 추가 시:
- [ ] `src/types/` 해당 도메인 파일에 필드 추가
- [ ] Optional 여부 확인 (nullable → `| null`, 기존 컬럼 추가 → `?`)
- [ ] CHECK 제약조건 → TS union type 생성
- [ ] JSONB 컬럼 → 적절한 interface 정의
- [ ] 암호화 필드 → 클라이언트 반환 금지 주석
