# OneLink (원클릭 배포) 기능 현황 분석

> **분석일**: 2026-02-15 (초기) → **최종 수정일**: 2026-02-22
> **목적**: 리팩토링 계획 수립을 위한 현재 상태 정리
> **코드명**: OneClick (코드베이스) / OneLink (브랜딩)

---

## 문서 목차

| 문서 | 설명 |
|------|------|
| [README.md](./README.md) | 전체 개요 (이 파일) |
| [01-architecture.md](./01-architecture.md) | 아키텍처 & 파일 구조 |
| [02-api-reference.md](./02-api-reference.md) | API 엔드포인트 상세 |
| [03-data-models.md](./03-data-models.md) | DB 스키마 & 데이터 모델 |
| [04-user-flows.md](./04-user-flows.md) | 사용자 플로우 & 상태 머신 |
| [05-issues-and-refactor-plan.md](./05-issues-and-refactor-plan.md) | 현재 문제점 & 리팩토링 방향 |
| [06-template-reselection-plan.md](./06-template-reselection-plan.md) | 템플릿 계획 |
| [07-enhancement-plan.md](./07-enhancement-plan.md) | Phase 1-2 스프린트 상세 기획 |
| [08-modular-template-editor.md](./08-modular-template-editor.md) | 모듈형 에디터 기획 (Phase 1~4 완료) |
| [PMO.md](./PMO.md) | 프로젝트 관리 마스터 문서 |

---

## 1. 기능 요약

**OneLink**는 사용자가 템플릿을 선택하고 GitHub Pages로 자동 배포하여 **3분 안에 개인 홈페이지를 만드는** 원클릭 배포 기능입니다.

### 핵심 가치
- 코드 소유권: 사용자의 GitHub 레포에 코드가 직접 생성됨
- 무료 호스팅: GitHub Pages를 통한 무료 정적 사이트 호스팅
- AI 커스터마이징: 배포 후 AI 채팅으로 사이트 수정 가능
- 모듈 에디터: 코드 없이 섹션 단위로 사이트 편집 가능

### 핵심 플로우
```
템플릿 선택 → GitHub 연결 → 자동 배포 → 모듈 편집 / AI 채팅
```

---

## 2. 기능 분류

### 2.1 핵심 기능 (Core)
| 기능 | 설명 | 상태 |
|------|------|------|
| 템플릿 카탈로그 | 6개 배포 가능 템플릿 (번들 콘텐츠 포함) | 구현 완료 |
| GitHub OAuth | 프로젝트-무관 OAuth 연결 | 구현 완료 |
| 배포 사전 검사 | 계정/쿼터/사이트명 중복 프리플라이트 | 구현 완료 |
| GitHub Pages 배포 | 레포 생성 → Pages 활성화 → 파일 푸시 | 구현 완료 |
| 배포 상태 폴링 | 3초 간격, 최대 5분 타임아웃 | 구현 완료 |
| 쿼터 관리 | 플랜별 배포 한도 (free: 3, pro: 무제한) | 구현 완료 |

### 2.2 관리 기능 (Management)
| 기능 | 설명 | 상태 |
|------|------|------|
| Sites 대시보드 | 배포된 사이트 목록 (`/sites?tab=manage`) | 구현 완료 |
| 배포 삭제 | 배포 레코드 삭제 (레포는 유지) | 구현 완료 |
| 사이트 편집기 | 웹 기반 코드 에디터 | 구현 완료 |
| AI 채팅 | AI로 사이트 코드 수정 제안 (SSE 스트리밍) | 구현 완료 |
| 배치 파일 적용 | AI 제안 일괄 적용 (원자적 Git 커밋) | 구현 완료 |
| 이미지 업로드 | GitHub 레포에 이미지 업로드 (리사이즈 + WebP) | 구현 완료 |

### 2.3 모듈 에디터 (Module Editor)
| 기능 | 설명 | 상태 |
|------|------|------|
| 모듈 스키마 | 6개 템플릿별 편집 모듈 정의 | 구현 완료 |
| 모듈 폼 렌더러 | 스키마 기반 동적 폼 (7가지 필드 타입) | 구현 완료 |
| 코드 제너레이터 | 모듈 설정 → config.ts/page.tsx 코드 생성 | 구현 완료 |
| DnD 순서 변경 | @dnd-kit 기반 모듈 드래그 앤 드롭 | 구현 완료 |
| 모듈 프리셋 | 사전 정의 설정 조합 (미니멀/크리에이터/풀) | 구현 완료 |
| AI 모듈 추천 | AI가 모듈 설정 자동 구성 | 구현 완료 |
| 폰트 선택기 | 8개 Google Fonts 선택 + 코드 반영 | 구현 완료 |

### 2.4 레거시 기능 (Legacy - Vercel)

> **삭제됨**: Sprint 1에서 제거 (2026-02-18). API 라우트 2개, TanStack Query 훅 2개, Zod 스키마 2개 삭제.

### 2.5 보안 & 인프라 (Security)
| 기능 | 설명 | 상태 |
|------|------|------|
| Rate Limiting | Cloudflare Rate Limiting Rules (인프라 레벨) | 구현 완료 |
| 입력 검증 | Zod 스키마 검증 + 금지 경로 차단 | 구현 완료 |
| 감사 로깅 | 배포/삭제/에러/이미지 업로드/AI 이벤트 기록 | 구현 완료 |
| 토큰 암호화 | AES-256-GCM으로 GitHub 토큰 암호화 | 구현 완료 |
| RLS | 본인 배포만 접근 가능 | 구현 완료 |

---

## 3. 기술 스택

| 영역 | 기술 |
|------|------|
| 프론트엔드 | Next.js 16 App Router, React, Tailwind CSS, shadcn/ui |
| 상태 관리 | Zustand (persist), TanStack Query |
| 백엔드 | Next.js API Routes |
| 데이터베이스 | Supabase (PostgreSQL + RLS) |
| 외부 API | GitHub REST API (레포 생성, Pages, 파일 관리) |
| AI | OpenAI GPT-4o-mini (기본값), 다중 프로바이더 지원, SSE 스트리밍 |
| 암호화 | AES-256-GCM (GitHub OAuth 토큰) |
| 검증 | Zod v4 |
| DnD | @dnd-kit/core, @dnd-kit/sortable |

---

## 4. 코드 규모

| 카테고리 | 파일 수 | 비고 |
|----------|---------|------|
| 페이지 | 3 | /sites (탭: new/manage), /sites/[id]/edit, 레거시 리다이렉트 2개 |
| 컴포넌트 | 18 | oneclick(11) + my-sites(7) |
| API 라우트 | 13 | deploy, preflight, status, templates, deployments, files, batch-update, upload, ai-chat, oauth 등 |
| 라이브러리 | 4+ | queries, validations, code-generator, deploy-status |
| 모듈 스키마 | 6 | personal-brand, dev-showcase, link-in-bio-pro, digital-namecard, freelancer-page, small-biz |
| 모듈 프리셋 | 6 | 각 템플릿별 프리셋 |
| 데이터 | 22+ | templates, template-content, module-schemas, module-presets |
| DB 마이그레이션 | 3 | 014(초기), 016(Pages 지원), 022(정리) |
| **합계** | **70+** | |

---

## 5. 의존성 관계

```
┌─────────────────────────────────────────────────┐
│                   사용자 (브라우저)                │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  /sites (Page) — IA Redesign 통합 경로           │
│  ├─ tab=new: OneclickPageClient (위저드)          │
│  │  ├─ TemplatePickerStep + TemplateCard         │
│  │  ├─ AuthModal / GitHubConnectModal            │
│  │  ├─ DeployStep → DeployProgress               │
│  │  └─ DeploySuccess                             │
│  └─ tab=manage: MySitesClient                    │
│     ├─ DeploySiteCard (× N)                      │
│     └─ [링크] /sites/[id]/edit                   │
│          ├─ SiteEditorClient                     │
│          ├─ ModulePanel + ModuleForm             │
│          └─ ChatTerminal                         │
└──────────────────────┬──────────────────────────┘
                       │ TanStack Query
┌──────────────────────▼──────────────────────────┐
│  API Routes (/api/oneclick/*)                    │
│  ├─ templates      (GET)                         │
│  ├─ github-check   (GET)                         │
│  ├─ preflight      (GET)   ← 사전 검사          │
│  ├─ deploy         (POST)  ← 핵심 배포          │
│  ├─ deploy-pages   (POST)  ← 하위 호환 리다이렉트│
│  ├─ status         (GET)                         │
│  ├─ deployments    (GET/DELETE)                   │
│  ├─ deployments/[id]/files (GET)                 │
│  ├─ deployments/[id]/batch-update (POST)         │
│  ├─ deployments/[id]/upload (POST) ← 이미지     │
│  ├─ ai-chat        (POST, SSE)                   │
│  └─ oauth/authorize (GET)                        │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  공유 라이브러리                                  │
│  ├─ lib/github/ (GitHub REST API)                │
│  ├─ lib/crypto/  (AES-256-GCM)                   │
│  ├─ lib/quota.ts (플랜 쿼터)                     │
│  ├─ lib/oneclick/ (code-generator, deploy-status)│
│  ├─ lib/ai/     (AI 프로바이더)                  │
│  ├─ lib/module-schema.ts (모듈 타입)             │
│  ├─ (Cloudflare Rate Limiting Rules — 외부)       │
│  └─ lib/audit.ts                                 │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  Supabase                                        │
│  ├─ homepage_templates                           │
│  ├─ homepage_deploys                             │
│  ├─ service_accounts (GitHub OAuth)              │
│  ├─ projects                                     │
│  ├─ project_github_repos                         │
│  ├─ project_services                             │
│  └─ audit_logs                                   │
└─────────────────────────────────────────────────┘
```
