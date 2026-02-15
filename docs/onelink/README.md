# OneLink (원클릭 배포) 기능 현황 분석

> **분석일**: 2026-02-15
> **목적**: 리팩토링 계획 수립을 위한 현재 상태 정리
> **코드명**: OneClick (코드베이스) / OneLink (브랜딩 후보)

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

---

## 1. 기능 요약

**OneLink**는 사용자가 템플릿을 선택하고 GitHub Pages로 자동 배포하여 **3분 안에 개인 홈페이지를 만드는** 원클릭 배포 기능입니다.

### 핵심 가치
- 코드 소유권: 사용자의 GitHub 레포에 코드가 직접 생성됨
- 무료 호스팅: GitHub Pages를 통한 무료 정적 사이트 호스팅
- AI 커스터마이징: 배포 후 AI 채팅으로 사이트 수정 가능

### 핵심 플로우
```
템플릿 선택 → GitHub 연결 → 자동 배포 → 사이트 편집
```

---

## 2. 기능 분류

### 2.1 핵심 기능 (Core)
| 기능 | 설명 | 상태 |
|------|------|------|
| 템플릿 카탈로그 | 5개 정적 HTML 템플릿 제공 | 구현 완료 |
| GitHub OAuth | 프로젝트-무관 OAuth 연결 | 구현 완료 |
| GitHub Pages 배포 | 레포 생성 → Pages 활성화 → 파일 푸시 | 구현 완료 |
| 배포 상태 폴링 | 3초 간격, 최대 5분 타임아웃 | 구현 완료 |
| 쿼터 관리 | 플랜별 배포 한도 (free: 999999) | 구현 완료 |

### 2.2 관리 기능 (Management)
| 기능 | 설명 | 상태 |
|------|------|------|
| My Sites 대시보드 | 배포된 사이트 목록 | 구현 완료 |
| 배포 삭제 | 배포 레코드 삭제 (레포는 유지) | 구현 완료 |
| 사이트 편집기 | 웹 기반 코드 에디터 | 구현 완료 |
| AI 채팅 | AI로 사이트 코드 수정 제안 | 구현 완료 |
| 배치 파일 적용 | AI 제안 일괄 적용 | 구현 완료 |

### 2.3 레거시 기능 (Legacy - Vercel)
| 기능 | 설명 | 상태 |
|------|------|------|
| Fork 템플릿 | linkmap-templates org에서 fork | 미사용 |
| Vercel 배포 | Vercel API를 통한 배포 | 미사용 |
| Vercel 상태 폴링 | Vercel 빌드 상태 체크 | 미사용 |

### 2.4 보안 & 인프라 (Security)
| 기능 | 설명 | 상태 |
|------|------|------|
| Rate Limiting | 엔드포인트별 요청 제한 | 구현 완료 |
| 입력 검증 | Zod 스키마 검증 | 구현 완료 |
| 감사 로깅 | 배포/삭제/에러 이벤트 기록 | 구현 완료 |
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
| AI | OpenAI GPT-4o-mini (기본값), 다중 프로바이더 지원 |
| 암호화 | AES-256-GCM (GitHub OAuth 토큰) |
| 검증 | Zod v4 |

---

## 4. 코드 규모

| 카테고리 | 파일 수 | 비고 |
|----------|---------|------|
| 페이지 | 1 | `/oneclick` |
| 컴포넌트 | 10 | oneclick(6) + my-sites(4) |
| API 라우트 | 11 | 활성 8 + 레거시 3 |
| 라이브러리 | 3 | queries, validations, store |
| 데이터 | 2 | templates, template-content |
| DB 마이그레이션 | 1 | 016_oneclick_github_pages |
| **합계** | **28** | |

---

## 5. 의존성 관계

```
┌─────────────────────────────────────────────────┐
│                   사용자 (브라우저)                │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  /oneclick (Page)                                │
│  └─ OneclickWizardClient                         │
│     ├─ TemplatePickerStep                        │
│     ├─ AuthGateStep / GitHubConnectStep          │
│     └─ DeployStep                                │
└──────────────────────┬──────────────────────────┘
                       │ TanStack Query
┌──────────────────────▼──────────────────────────┐
│  API Routes (/api/oneclick/*)                    │
│  ├─ templates      (GET)                         │
│  ├─ github-check   (GET)                         │
│  ├─ deploy-pages   (POST)  ← 핵심              │
│  ├─ status         (GET)                         │
│  ├─ deployments    (GET/DELETE)                   │
│  ├─ deployments/[id]/files (GET/PUT)             │
│  ├─ ai-chat        (POST)                        │
│  └─ oauth/authorize (GET)                        │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  공유 라이브러리                                  │
│  ├─ lib/github/api.ts (GitHub REST API)          │
│  ├─ lib/crypto/      (AES-256-GCM)              │
│  ├─ lib/quota.ts     (플랜 쿼터)                 │
│  ├─ lib/rate-limit.ts                            │
│  ├─ lib/audit.ts                                 │
│  └─ lib/ai/          (AI 프로바이더)             │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────┐
│  Supabase                                        │
│  ├─ homepage_templates                           │
│  ├─ homepage_deploys                             │
│  ├─ service_accounts (GitHub OAuth)              │
│  ├─ projects                                     │
│  ├─ project_github_repos                         │
│  └─ audit_logs                                   │
└─────────────────────────────────────────────────┘
```
