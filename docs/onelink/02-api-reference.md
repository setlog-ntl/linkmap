# OneLink API 엔드포인트 레퍼런스

> **최종 수정일**: 2026-02-22
> **Rate Limiting**: 모든 엔드포인트의 Rate Limiting은 Cloudflare Rate Limiting Rules로 인프라 레벨에서 적용됩니다.
> 앱 코드의 `lib/rate-limit.ts`는 삭제되었습니다.

## 활성 엔드포인트 (13개)

### 1. GET `/api/oneclick/templates`

**설명**: 활성 홈페이지 템플릿 목록 조회

| 항목 | 값 |
|------|-----|
| 인증 | 선택 (비로그인도 가능) |
| Rate Limit | 30/분 |
| 파일 | `src/app/api/oneclick/templates/route.ts` |

**Query Parameters**:
| 파라미터 | 타입 | 기본값 | 설명 |
|----------|------|--------|------|
| `deploy_target` | string | `github_pages` | `github_pages`, `vercel`, `both`, `all` |

**Response (200)**:
```json
{
  "templates": [
    {
      "id": "uuid",
      "slug": "link-in-bio-pro",
      "name": "Link in Bio Pro",
      "name_ko": "링크인바이오 프로",
      "description": "...",
      "description_ko": "...",
      "preview_image_url": null,
      "github_owner": "linkmap-templates",
      "github_repo": "link-in-bio-pro",
      "framework": "nextjs",
      "required_env_vars": [],
      "tags": ["links", "profile"],
      "is_premium": false,
      "display_order": 1,
      "deploy_target": "github_pages"
    }
  ]
}
```

---

### 2. GET `/api/oneclick/github-check`

**설명**: 사용자의 GitHub OAuth 연결 상태 확인

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 30/분 |
| 파일 | `src/app/api/oneclick/github-check/route.ts` |

**Response (200)**:
```json
{
  "account": {
    "id": "service_account_uuid",
    "status": "active",
    "provider_username": "github-username",
    "oauth_provider_user_id": "12345"
  },
  "quota": {
    "current": 0,
    "max": 3,
    "allowed": true
  }
}
```

---

### 3. GET `/api/oneclick/preflight`

**설명**: 배포 사전 검사 — 계정 상태, 쿼터, 사이트명 중복 여부를 한 번에 확인

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 30/분 |
| 파일 | `src/app/api/oneclick/preflight/route.ts` |

**Query Parameters**:
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `site_name` | string | 배포할 사이트명 (필수) |

**Response (200)**:
```json
{
  "ok": true,
  "account": { "id": "uuid", "provider_username": "user" },
  "quota": { "current": 1, "max": 3, "allowed": true },
  "repoExists": false
}
```

**에러 응답**:
| 코드 | 사유 |
|------|------|
| 401 | 미인증 |
| 403 | 쿼터 초과 |
| 404 | GitHub 계정 미연결 |
| 409 | 동일 이름 레포 이미 존재 |

---

### 4. POST `/api/oneclick/deploy` (핵심)

**설명**: GitHub Pages로 사이트 배포 (레포 생성 → Pages 활성화 → 파일 푸시)

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 5/분 |
| 파일 | `src/app/api/oneclick/deploy/route.ts` |

> **참고**: 이전 `deploy-pages` 엔드포인트는 하위 호환을 위해 이 엔드포인트로 리다이렉트됩니다.

**Request Body** (Zod: `deployPagesRequestSchema`):
```json
{
  "template_id": "uuid (필수)",
  "site_name": "my-site (필수, 2-100자, 소문자+숫자+하이픈)",
  "github_service_account_id": "uuid (선택)"
}
```

**실행 순서**:
1. 사용자 인증 확인
2. 입력 검증 (Zod: `deployPagesRequestSchema`)
3. 사이트명 sanitize (소문자+숫자+하이픈만, 2~100자)
4. 홈페이지 배포 쿼터 확인 (`checkHomepageDeployQuota`)
5. 템플릿 조회 (DB: `homepage_templates`)
6. GitHub 서비스 계정 조회 & 토큰 복호화 (AES-256-GCM)
7. Linkmap 프로젝트 생성 (`projects` 테이블)
8. User-level 서비스 계정을 Project-level로 복사
9. 번들 템플릿 콘텐츠 조회 (`getTemplateBySlug()` — Map O(1) 조회)
10. GitHub 레포 생성 (`auto_init: true`)
11. GitHub Pages 활성화 (2초 대기 후, Actions 빌드 모드)
12. 템플릿 파일 atomic push — `pushFilesAtomically()` (최대 2회 재시도)
13. `project_github_repos` 연결
14. `homepage_deploys` 레코드 생성 (`deploy_method: 'github_pages'`)
15. `project_services` 추가 (GitHub 서비스)
16. 감사 로그 기록 (`oneclick.deploy_pages`)

**Response (201)**:
```json
{
  "deploy_id": "uuid",
  "project_id": "uuid",
  "repo_url": "https://github.com/user/my-site",
  "pages_url": "https://user.github.io/my-site",
  "pages_status": "enabling"
}
```

**에러 응답**:
| 코드 | 사유 |
|------|------|
| 400 | 사이트명 유효하지 않음 |
| 401 | 미인증 / GitHub 토큰 만료 |
| 403 | 쿼터 초과 / GitHub 권한 부족 |
| 404 | 템플릿/GitHub 계정 없음 |
| 409 | 동일 이름 레포 이미 존재 |
| 429 | Rate limit 초과 |
| 502 | GitHub API 오류 |

**롤백**: 실패 시 생성된 레포와 프로젝트를 자동 삭제

---

### 5. POST `/api/oneclick/deploy-pages` (하위 호환)

**설명**: `/api/oneclick/deploy`로 리다이렉트 (기존 클라이언트 호환)

---

### 6. GET `/api/oneclick/status`

**설명**: 배포 상태 폴링 (GitHub Pages API 실시간 확인)

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 60/분 |
| 파일 | `src/app/api/oneclick/status/route.ts` |

**Query Parameters**:
| 파라미터 | 타입 | 설명 |
|----------|------|------|
| `deploy_id` | uuid | 배포 ID (필수) |

**Response (200)**:
```json
{
  "deploy_id": "uuid",
  "fork_status": "forked",
  "deploy_status": "building",
  "deployment_url": null,
  "deploy_error": null,
  "forked_repo_url": "https://github.com/user/my-site",
  "deploy_method": "github_pages",
  "pages_url": "https://user.github.io/my-site",
  "pages_status": "building",
  "steps": [
    { "name": "repo", "status": "completed", "label": "레포지토리 생성" },
    { "name": "pages", "status": "in_progress", "label": "GitHub Pages 활성화" },
    { "name": "live", "status": "pending", "label": "사이트 게시 완료" }
  ]
}
```

---

### 7. GET `/api/oneclick/oauth/authorize`

**설명**: OneClick 전용 GitHub OAuth 시작 (프로젝트 ID 불필요)

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 10/분 |
| 파일 | `src/app/api/oneclick/oauth/authorize/route.ts` |

---

### 8. GET `/api/oneclick/deployments`

**설명**: 사용자의 전체 배포 목록 (Sites 대시보드용)

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 30/분 |
| 파일 | `src/app/api/oneclick/deployments/route.ts` |

**Response (200)**:
```json
{
  "deployments": [
    {
      "id": "uuid",
      "site_name": "my-site",
      "deploy_status": "ready",
      "deploy_method": "github_pages",
      "pages_url": "https://user.github.io/my-site",
      "pages_status": "built",
      "deployment_url": "https://user.github.io/my-site",
      "forked_repo_url": "https://github.com/user/my-site",
      "forked_repo_full_name": "user/my-site",
      "deploy_error_message": null,
      "created_at": "2026-02-15T...",
      "template_id": "uuid",
      "project_id": "uuid",
      "homepage_templates": {
        "id": "uuid",
        "slug": "link-in-bio-pro",
        "name": "Link in Bio Pro",
        "name_ko": "링크인바이오 프로",
        "framework": "nextjs",
        "preview_image_url": null
      }
    }
  ]
}
```

---

### 9. DELETE `/api/oneclick/deployments/[id]`

**설명**: 배포 레코드 삭제 (GitHub 레포는 삭제하지 않음)

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 10/분 |
| 파일 | `src/app/api/oneclick/deployments/[id]/route.ts` |

---

### 10. GET `/api/oneclick/deployments/[id]/files`

**설명**: 배포된 레포의 파일 목록 조회

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 60/분 |
| 파일 | `src/app/api/oneclick/deployments/[id]/files/route.ts` |

**GET** - 파일 목록 또는 특정 파일 내용:
| 파라미터 | 설명 |
|----------|------|
| `path` (없으면) | 루트 디렉토리 파일 목록 |
| `path` (있으면) | 특정 파일 내용 (Base64 디코딩) |

---

### 11. POST `/api/oneclick/deployments/[id]/batch-update`

**설명**: 여러 파일을 한 번의 Git commit으로 원자적 적용

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 10/분 |
| 파일 | `src/app/api/oneclick/deployments/[id]/batch-update/route.ts` |

**Request Body**:
```json
{
  "files": [
    { "path": "index.html", "content": "<html>...</html>" },
    { "path": "style.css", "content": "body { ... }" }
  ],
  "message": "AI 제안 적용 (선택)"
}
```

**동작**:
1. 배포 소유권 확인 (RLS)
2. GitHub 서비스 계정 조회 & 토큰 복호화
3. `pushFilesAtomically()` — Git Data API 기반 원자적 커밋
4. 감사 로그 기록

**Response (200)**:
```json
{
  "sha": "commit-sha",
  "message": "N개 파일 업데이트 완료"
}
```

---

### 12. POST `/api/oneclick/deployments/[id]/upload`

**설명**: 이미지를 GitHub 레포에 업로드 (Base64 → Git blob → commit)

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 10/분 |
| 파일 | `src/app/api/oneclick/deployments/[id]/upload/route.ts` |

**Request Body**:
```json
{
  "content": "base64-encoded-image-data",
  "filename": "hero-bg.webp",
  "path": "public/images/"
}
```

**동작**:
1. 배포 소유권 확인
2. 파일 크기 검증 (max 2MB)
3. GitHub Git Data API: blob(base64) → tree → commit → ref update
4. 감사 로그 (`oneclick.image_upload`)

**Response (200)**:
```json
{
  "path": "public/images/hero-bg.webp",
  "sha": "blob-sha"
}
```

---

### 13. POST `/api/oneclick/ai-chat`

**설명**: AI 기반 사이트 수정 제안 (SSE 스트리밍)

| 항목 | 값 |
|------|-----|
| 인증 | 필수 |
| Rate Limit | 20/분 (사용자별) |
| 파일 | `src/app/api/oneclick/ai-chat/route.ts` |

**Request Body**:
```json
{
  "messages": [{ "role": "user", "content": "배경색을 파란색으로 변경해줘" }],
  "fileContent": "현재 파일 내용",
  "filePath": "style.css",
  "allFiles": ["index.html", "style.css"],
  "persona_id": "uuid (선택)"
}
```

**Response**: SSE (Server-Sent Events) 스트리밍
```
data: {"content":"📄 style.css\n```css\n..."}
data: {"content":"body { background: blue; }"}
data: [DONE]
```

---

## 삭제된 엔드포인트

> Sprint 1 (기반 정리)에서 아래 레거시 Vercel 엔드포인트가 완전 제거되었습니다.

| 엔드포인트 | 삭제일 | 사유 |
|-----------|--------|------|
| `POST /api/oneclick/fork` | 2026-02-18 | Vercel fork 플로우 → GitHub Pages 직접 생성으로 대체 |
| `POST /api/oneclick/deploy` (Vercel) | 2026-02-18 | Vercel 배포 → GitHub Pages Actions 배포로 대체 |

현재 모든 배포는 `POST /api/oneclick/deploy` 단일 API를 통해 진행됩니다.
