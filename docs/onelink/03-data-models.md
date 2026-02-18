# OneLink 데이터 모델 & DB 스키마

## 1. 데이터베이스 테이블

### 1.1 `homepage_templates` (템플릿 정의)

```sql
CREATE TABLE homepage_templates (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  name_ko     TEXT NOT NULL,
  description      TEXT,
  description_ko   TEXT,
  preview_image_url TEXT,
  github_owner     TEXT NOT NULL,       -- e.g. 'linkmap-templates'
  github_repo      TEXT NOT NULL,       -- e.g. 'portfolio-static'
  default_branch   TEXT DEFAULT 'main',
  framework        TEXT,                -- 'static', 'nextjs'
  required_env_vars JSONB DEFAULT '[]', -- [{key, description, required}]
  tags             TEXT[] DEFAULT '{}',
  is_premium       BOOLEAN DEFAULT false,
  is_active        BOOLEAN DEFAULT true,
  display_order    INTEGER DEFAULT 0,
  deploy_target    TEXT DEFAULT 'github_pages' CHECK (deploy_target IN ('vercel','github_pages','both')),
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);
```

**RLS**: `public_read_templates` - `is_active = true`인 템플릿은 누구나 조회 가능

**시드 데이터 (DB - migration 016)**:
| slug | name_ko | framework | deploy_target | is_premium |
|------|---------|-----------|---------------|------------|
| portfolio-static | 포트폴리오 | static | github_pages | false |
| landing-static | 랜딩 페이지 | static | github_pages | false |
| resume-static | 온라인 이력서 | static | github_pages | false |
| blog-static | 블로그 | static | github_pages | false |
| docs-static | 문서 사이트 | static | github_pages | true |

**시드 데이터 (TypeScript - homepage-templates.ts)**:
| slug | name_ko | framework | deploy_target |
|------|---------|-----------|---------------|
| homepage-minimal | 미니멀 포트폴리오 | nextjs | (없음/vercel) |
| homepage-links | 링크 모음 | nextjs | (없음/vercel) |
| link-in-bio-pro | 링크인바이오 프로 | nextjs | github_pages |
| digital-namecard | 디지털 명함 | nextjs | github_pages |
| dev-showcase | 개발자 쇼케이스 | nextjs | github_pages |

> **해결됨** (migration 023): DB 시드와 TypeScript 시드의 슬러그 불일치는 migration 023에서 해결됨.
> 구 DB 시드 (portfolio-static 등)는 비활성화되고, TS 시드 기반의 신규 슬러그 (link-in-bio-pro 등)로 통합.
> 실제 배포 시 `getTemplateBySlug()`로 번들 콘텐츠를 조회.

---

### 1.2 `homepage_deploys` (배포 이력)

```sql
CREATE TABLE homepage_deploys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  project_id      UUID REFERENCES projects(id),
  template_id     UUID REFERENCES homepage_templates(id),
  site_name       TEXT NOT NULL,

  -- Repository
  forked_repo_full_name TEXT,          -- 'user/my-site'
  forked_repo_url       TEXT,          -- 'https://github.com/user/my-site'
  fork_status     TEXT DEFAULT 'pending' CHECK (fork_status IN ('pending','forking','forked','failed')),

  -- Deployment (general)
  deploy_status   TEXT DEFAULT 'pending' CHECK (deploy_status IN ('pending','creating','building','ready','error','canceled','timeout')),
  deploy_method   TEXT DEFAULT 'vercel' CHECK (deploy_method IN ('vercel','github_pages')),
  deploy_error_message TEXT,
  deployment_url  TEXT,                -- 최종 사이트 URL
  deployed_at     TIMESTAMPTZ,

  -- Vercel (legacy)
  vercel_project_id  TEXT,
  vercel_project_url TEXT,
  deployment_id      TEXT,

  -- GitHub Pages
  pages_url       TEXT,                -- 'https://user.github.io/my-site'
  pages_status    TEXT DEFAULT 'pending' CHECK (pages_status IN ('pending','enabling','building','built','errored')),

  -- Misc
  config_data     JSONB DEFAULT '{}',
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
```

**RLS**: 본인의 배포만 접근 가능 (`user_id = auth.uid()`)

---

### 1.3 관련 테이블 (기존)

#### `projects`
- 배포 시 자동으로 프로젝트 생성
- `name = site_name`, `description = 템플릿명 + 'GitHub Pages 사이트'`

#### `project_github_repos`
- 배포된 레포를 프로젝트에 연결
- `auto_sync_enabled: false` (oneclick 배포는 자동 동기화 비활성)

#### `service_accounts`
- GitHub OAuth 토큰 저장 (AES-256-GCM 암호화)
- `connection_type: 'oauth'`, `status: 'active'`
- User-level 계정 → 배포 시 Project-level로 복사

#### `project_services`
- 프로젝트에 GitHub 서비스 연결

#### `audit_logs`
- 배포, 성공, 에러, 삭제 이벤트 기록

---

## 2. TypeScript 타입 정의

### 2.1 TanStack Query 타입 (queries/oneclick.ts)

```typescript
// 템플릿
interface HomepageTemplate {
  id: string;
  slug: string;
  name: string;
  name_ko: string;
  description: string;
  description_ko: string;
  preview_image_url: string | null;
  github_owner: string;
  github_repo: string;
  framework: string;
  required_env_vars: Array<{ key: string; description: string; required: boolean }>;
  tags: string[];
  is_premium: boolean;
  display_order: number;
  deploy_target?: 'vercel' | 'github_pages' | 'both';
}

// 배포 상태
interface DeployStatus {
  deploy_id: string;
  fork_status: 'pending' | 'forking' | 'forked' | 'failed';
  deploy_status: 'pending' | 'creating' | 'building' | 'ready' | 'error' | 'canceled' | 'timeout';
  deployment_url: string | null;
  deploy_error: string | null;
  forked_repo_url: string | null;
  deploy_method: 'vercel' | 'github_pages';
  pages_url: string | null;
  pages_status: 'pending' | 'enabling' | 'building' | 'built' | 'errored' | null;
  steps: Array<{
    name: string;
    status: 'completed' | 'in_progress' | 'pending' | 'error';
    label: string;
  }>;
}

// 배포 목록 항목
interface HomepageDeploy {
  id: string;
  site_name: string;
  deploy_status: string;
  deploy_method: 'vercel' | 'github_pages';
  pages_url: string | null;
  pages_status: string | null;
  deployment_url: string | null;
  forked_repo_url: string | null;
  forked_repo_full_name: string | null;
  deploy_error_message: string | null;
  created_at: string;
  template_id: string;
  project_id: string | null;
  homepage_templates: { ... } | null;
}

// 파일 편집
interface GitHubFileInfo { name, path, type, size, sha }
interface GitHubFileDetail { name, path, sha, content, size }
```

### 2.2 Zod 스키마 (validations/oneclick.ts)

| 스키마 | 용도 | 필드 |
|--------|------|------|
| `deployPagesRequestSchema` | GitHub Pages 배포 | template_id, site_name, github_service_account_id? |
| `statusQuerySchema` | 상태 조회 | deploy_id |
| `fileUpdateSchema` | 파일 수정 | path, content, sha?, message? |

> **참고**: 레거시 스키마 `forkRequestSchema`, `deployRequestSchema`는 Sprint 1에서 삭제됨

**site_name 규칙**:
- 정규식: `/^[a-z0-9][a-z0-9-]*[a-z0-9]$/`
- 2~100자
- 소문자, 숫자, 하이픈만 허용
- 시작/끝은 소문자 또는 숫자

---

## 3. 번들 템플릿 콘텐츠

### homepage-template-content.ts

```typescript
interface TemplateFile {
  path: string;    // 'index.html', 'style.css' 등
  content: string; // 파일 전체 내용
}

interface HomepageTemplateContent {
  slug: string;       // 'portfolio-static'
  repoName: string;   // GitHub 레포명
  description: string;
  files: TemplateFile[];
}
```

**번들 구조**: 각 템플릿은 Next.js static export 파일을 TypeScript 문자열로 번들링

**현재 구현된 템플릿 (Phase 1 MVP):**
- `link-in-bio-pro` — 링크인바이오 프로 (19 파일)
- `digital-namecard` — 디지털 명함 (19 파일)
- `dev-showcase` — 개발자 쇼케이스 (별도 파일 `dev-showcase-template.ts`)

**조회 방법**: `getTemplateBySlug(slug)` — Map 기반 O(1) 조회
```typescript
import { getTemplateBySlug } from '@/data/homepage-template-content';
const template = getTemplateBySlug('link-in-bio-pro');
// → { slug, repoName, description, files: TemplateFile[] }
```

**공유 워크플로우**: `getDeployWorkflow()` — GitHub Actions 배포 YAML 자동 포함

---

## 4. 쿼터 모델

```typescript
interface PlanQuota {
  plan: string;
  max_projects: number;
  max_env_vars_per_project: number;
  max_services_per_project: number;
  max_team_members: number;
  max_homepage_deploys: number;
}

// 기본값 (plan_quotas 테이블에 없을 때)
const DEFAULT_QUOTA = {
  plan: 'free',
  max_homepage_deploys: 999999,  // 사실상 무제한
  // ...
};
```

> **이슈**: 기본 쿼터가 `999999`로 설정되어 있어 사실상 쿼터 제한이 없음.
> `plan_quotas` 테이블이 비어있으면 모든 사용자가 무제한 배포 가능.

---

## 5. Connections 관련 테이블 (개발 중)

> 아래 테이블은 Connections 시각화 기능 개발 중 추가됨 (미커밋 상태).

### 5.1 `user_connections` 확장 (migration 028)

기존 `user_connections` 테이블에 4개 컬럼 추가:

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `connection_status` | TEXT | active, inactive, error, pending |
| `description` | TEXT | 연결에 대한 선택적 설명 |
| `last_verified_at` | TIMESTAMPTZ | 마지막 연결 확인 시각 |
| `metadata` | JSONB | 추가 메타데이터 |

`connection_type` CHECK 확장: `api_call`, `auth_provider`, `webhook`, `sdk` 추가.

### 5.2 `project_service_overrides` (migration 029)

프로젝트별 대시보드 레이어 커스터마이징 테이블:

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | UUID | PK |
| `project_id` | UUID | FK → projects |
| `service_id` | UUID | FK → services |
| `dashboard_layer` | TEXT | frontend, backend, devtools |
| `dashboard_subcategory` | TEXT | 서브카테고리 |

- Unique constraint: `(project_id, service_id)`
- RLS: 프로젝트 소유자 전체 권한, 팀 에디터+ 전체 권한, 팀 뷰어 읽기 전용
