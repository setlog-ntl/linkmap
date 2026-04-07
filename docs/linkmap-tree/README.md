# Linkmap Project Blueprint

> **Last Updated:** 2026-04-06
> **Version:** Next.js 16 + Supabase + Cloudflare Workers

## 1. 메뉴 트리 구조

### Public (비인증)
```
/                           Landing Page (히어로, 기능소개, 가격, 소셜프루프)
├── /login                  로그인 (Email/OAuth: Google, GitHub)
├── /signup                 회원가입
├── /reset-password         비밀번호 재설정
├── /pricing                요금제 (Free / Pro / Team)
├── /faq                    자주 묻는 질문
├── /glossary               개발 용어 사전
├── /privacy                개인정보 처리방침
├── /terms                  이용약관
│
├── /services               서비스 카탈로그 (90+ 서비스)
│   ├── /services/[slug]        개별 서비스 상세
│   ├── /services/compare       서비스 비교
│   └── /services/cost-simulator 비용 시뮬레이터
│
├── /blog                   블로그
│   └── /blog/[slug]            포스트 상세
│
├── /showcase               커뮤니티 쇼케이스
│   └── /showcase/[id]          쇼케이스 상세 (좋아요, 댓글, 조회수)
│
├── /feedback               기능 요청 게시판
│   └── /feedback/[id]          요청 상세 (투표, 댓글)
│
├── /shared/map/[token]     공유된 서비스맵 (토큰 기반)
│
├── /demo                   데모 프로젝트 (비로그인 체험)
│   └── /demo/project/[id]
│       ├── /services           서비스 목록
│       ├── /service-map        서비스맵
│       ├── /costs              비용
│       ├── /costs/report       비용 리포트
│       ├── /env                환경변수
│       ├── /connections        연결
│       └── /settings           설정
│
└── /guides                 가이드 허브 (22개 메인 + 64개 서브)
    ├── Stage 1: 시작
    │   ├── /guides/ai-tools           AI 도구 활용
    │   │   ├── prompt-engineering
    │   │   ├── cursor-claude
    │   │   └── ai-api
    │   ├── /guides/frontend           프론트엔드 기초
    │   │   ├── rendering-modes
    │   │   └── react-nextjs
    │   ├── /guides/package-manager    패키지 매니저
    │   │   ├── npm-basics
    │   │   ├── package-json
    │   │   └── troubleshooting
    │   └── /guides/version-control    버전 관리 (Git)
    │       ├── branching
    │       ├── pull-request
    │       └── conflict
    ├── Stage 2: 개발
    │   ├── /guides/env                환경변수 관리
    │   │   ├── dotenv-files
    │   │   └── deploy-vars
    │   ├── /guides/api-basics         API 연동
    │   │   ├── fetch-axios
    │   │   ├── error-handling
    │   │   └── api-auth
    │   ├── /guides/backend            백엔드 기초
    │   │   ├── database
    │   │   └── baas
    │   └── /guides/auth               인증 구현
    │       ├── google
    │       └── kakao
    ├── Stage 3: 완성
    │   ├── /guides/design-ui          디자인/UI
    │   │   ├── tailwind
    │   │   ├── components
    │   │   └── responsive
    │   └── /guides/security           보안 기초
    │       ├── secrets-management
    │       ├── web-vulnerabilities
    │       └── https-cors
    ├── Stage 4: 배포
    │   ├── /guides/domain             도메인 연결
    │   │   ├── how-to-buy
    │   │   └── dns-records
    │   ├── /guides/server             서버/호스팅
    │   │   ├── hosting-types
    │   │   └── cdn
    │   └── /guides/deploy             배포하기
    │       ├── vercel-deploy
    │       ├── github-actions
    │       └── cicd
    ├── Stage 5: 확장
    │   ├── /guides/communication      알림 연동
    │   │   ├── email
    │   │   ├── push
    │   │   └── realtime
    │   ├── /guides/payment            결제 연동
    │   │   ├── stripe
    │   │   ├── toss
    │   │   └── webhook
    │   ├── /guides/monitoring         모니터링
    │   │   ├── error-tracking
    │   │   ├── analytics
    │   │   └── feature-flags
    │   └── /guides/automation         자동화
    │       ├── webhook
    │       ├── scheduling
    │       └── sns-api
    └── Service Guides (서비스별)
        ├── /guides/github             GitHub 연동
        ├── /guides/cloudflare         Cloudflare 연동
        ├── /guides/openai             OpenAI 연동
        ├── /guides/supabase           Supabase 연동
        └── /guides/vercel             Vercel 연동
```

### Authenticated (인증 필요)
```
/dashboard                  대시보드 (프로젝트 목록, 즐겨찾기, 빠른 액션)
├── /trash                  휴지통 (소프트 삭제 복구)
│
├── /sites                  원클릭 배포
│   ├── /sites/new              템플릿 선택 → 배포
│   ├── /sites/manage           배포 사이트 관리
│   ├── /sites/showcase         쇼케이스 등록
│   └── /sites/[deployId]       배포 상세
│       └── /edit               사이트 에디터
│
├── /project/[id]           프로젝트 상세
│   ├── /services               서비스 목록 (레이어별)
│   ├── /service-map            서비스맵 (React Flow 시각화)
│   ├── /costs                  비용 추적
│   │   └── /report             AI 비용 리포트
│   ├── /connections            서비스 연결 관리
│   ├── /env                    환경변수 관리 (암호화)
│   │   └── /conflicts          충돌 해결
│   ├── /credentials            API 자격증명 (AES-256-GCM)
│   ├── /audit                  감사 로그
│   ├── /health                 헬스 체크 타임라인
│   ├── /integrations           서드파티 연동
│   ├── /monitoring             에러 추적/모니터링
│   └── /settings               프로젝트 설정
│
├── /settings               사용자 설정
│   ├── /account                계정 정보
│   ├── /profile                프로필 커스터마이징
│   ├── /accounts               연결된 계정 관리
│   ├── /billing                구독/결제
│   ├── /github                 GitHub 연동 설정
│   ├── /developer              API 토큰/개발자 설정
│   ├── /connections            서비스 연결
│   ├── /services               연결된 서비스 관리
│   ├── /tokens                 API 토큰 관리
│   └── /danger                 위험 구역 (계정 삭제)
│
└── /my-sites               내 사이트 관리
    └── /my-sites/[deployId]    사이트 상세/에디터
```

### Admin (관리자 전용)
```
/admin
├── /ai-config              AI 설정 콘솔 (프롬프트, 모델, 가드레일)
├── /showcase               쇼케이스 관리 (월간 픽)
├── /deploy-errors          배포 오류 모니터링
├── /improvements           기능 개선 추적
├── /usage-stats            플랫폼 사용 통계
└── /users                  사용자 관리
```

---

## 2. 핵심 기능 상세

### 2.1 서비스맵 시각화
- **기술:** React Flow (@xyflow/react) + dynamic import (SSR 비활성)
- **노드:** 헥사곤 서비스 노드 (상태: connected/in_progress/error/not_started)
- **엣지:** 7가지 연결 타입 (uses, integrates, data_transfer, api_call, auth_provider, webhook, sdk)
- **레이아웃:** Zone 기반 자동 배치, 수평/수직 프리셋, DAG/Radial 레이아웃
- **편집:** 드래그&드롭, 스냅 그리드, Undo/Redo (50단계), 멀티셀렉트
- **공유:** 토큰 기반 공개 공유 링크

### 2.2 원클릭 배포
- **플로우:** 템플릿 선택 → GitHub 연결 → Fork → GitHub Pages 배포
- **템플릿:** 17+ 종 (프리미엄/무료)
- **에디터:** 인브라우저 코드 편집, 파일 트리, 구문 하이라이팅, 라이브 프리뷰
- **모듈 시스템:** 모듈 단위 기능 ON/OFF, 배포 전 Diff 뷰

### 2.3 환경변수 관리
- **암호화:** AES-256-GCM (서버 사이드)
- **환경별:** development / staging / production
- **GitHub Sync:** 환경변수 → GitHub Secrets 자동 동기화 (NaCl 암호화)
- **충돌 해결:** 환경 간 변수 충돌 감지 & 해결
- **AI 분석:** ENV Doctor (명명규칙, 보안, 완전성 진단)

### 2.4 AI 기능 (Pro 플랜)
- **Stack Architect:** 프로젝트 컨텍스트 기반 아키텍처 추천
- **ENV Doctor:** 환경변수 진단 (보안, 네이밍, 누락 감지)
- **Cost Report:** AI 비용 분석 리포트
- **Service Compare:** 서비스 비교 분석
- **Map Narrate:** 아키텍처 내러티브 생성
- **Chat:** 스트리밍 대화 (드래그 가능 패널, 마크다운 지원)

### 2.5 비용 추적
- **구성:** 서비스별 월간/연간 비용, 티어 기반 가격
- **예산:** 프로젝트 예산 설정 & 초과 알림
- **OpenAI Usage:** API 사용량 별도 추적
- **첨부파일:** 영수증, 인보이스 관리

### 2.6 헬스 체크 & 모니터링
- **어댑터:** 10개 외부 서비스 연결 상태 확인
- **타임라인:** 상태 이력 시각화
- **스파크라인:** 미니 트렌드 차트
- **임팩트 분석:** 연결 변경이 의존 서비스에 미치는 영향

### 2.7 쇼케이스 & 커뮤니티
- **등록:** 배포 프로젝트를 쇼케이스에 공개
- **참여:** 좋아요, 댓글, 조회수
- **리더보드:** 주간/월간/전체 순위
- **월간 픽:** 관리자 선정 우수 프로젝트
- **배지:** 성취 기반 배지 시스템

### 2.8 기능 요청 (Feedback)
- **게시판:** 유저 기능 제안
- **투표:** 커뮤니티 투표 시스템
- **댓글:** 토론 스레드
- **관리자:** 상태 업데이트, 관리자 노트

---

## 3. 외부 서비스 연동 맵

### 인증 & ID
| 서비스 | 용도 | 환경변수 |
|--------|------|----------|
| **Supabase Auth** | 사용자 인증, 세션, RLS | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **GitHub OAuth** | OAuth 로그인 + 계정 연결 | `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET` |

### 결제
| 서비스 | 상태 | 용도 | 환경변수 |
|--------|------|------|----------|
| **Polar** | Primary | 구독, 체크아웃, 포탈 | `POLAR_ACCESS_TOKEN`, `POLAR_WEBHOOK_SECRET` |
| **Stripe** | Legacy | 구독 (마이그레이션 중) | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Toss Payments** | 개발 중 | 한국 결제 (501 반환) | `TOSS_SECRET_KEY` |

### AI/LLM
| 서비스 | 용도 | 모델 |
|--------|------|------|
| **OpenAI** | 메인 AI (채팅, 분석, 추천) | gpt-4o |
| **Anthropic (Claude)** | 대체 AI 프로바이더 | claude-3-* |
| **Google AI (Gemini)** | 대체 AI 프로바이더 | gemini-* |
| **Cloudflare AI Gateway** | OpenAI 프록시 | - |

### 인프라 & 배포
| 서비스 | 용도 | 설정 |
|--------|------|------|
| **Cloudflare Workers** | 프로덕션 호스팅 | `wrangler.jsonc`, KV 캐시 |
| **GitHub Pages** | 원클릭 배포 대상 | GitHub API 통해 제어 |
| **GitHub API** | 레포, Secrets, Pages, Fork | 13개 서브모듈 (`src/lib/github/`) |

### 이메일
| 서비스 | 용도 | 타입 |
|--------|------|------|
| **Resend** | 트랜잭션 이메일 | welcome, health_alert, team_invite, subscription_change |

### 분석
| 서비스 | 용도 |
|--------|------|
| **Google Analytics 4** | 페이지뷰, 이벤트 추적 |
| **Microsoft Clarity** | 세션 녹화, 히트맵 |
| **IndexNow** | SEO 인덱싱 (Bing) |

### DB & 스토리지
| 서비스 | 용도 |
|--------|------|
| **Supabase PostgreSQL** | 메인 DB (35+ 테이블, RLS) |
| **Supabase Storage** | 파일 업로드 (프로필, 아이콘, 첨부) |
| **Cloudflare KV** | ISR 캐시 (`NEXT_CACHE_KV`) |

### 보안 & 암호화
| 기술 | 용도 |
|------|------|
| **AES-256-GCM** | 환경변수, 자격증명, OAuth 토큰 암호화 |
| **NaCl (tweetnacl)** | GitHub Secrets 암호화 |
| **HMAC-SHA256** | Webhook 서명 검증, API 토큰 해싱 |

---

## 4. API 엔드포인트 요약

| 도메인 | 엔드포인트 수 | 주요 기능 |
|--------|-------------|-----------|
| Auth/OAuth | 7 | 로그인, OAuth 플로우, Webhook |
| Account | 6 | 프로필, 연결된 계정 |
| Projects | 22 | CRUD, 비용, 대시보드, 공유 |
| Credentials | 7 | 암호화 자격증명 CRUD |
| Environment | 13 | 환경변수 CRUD, 동기화, 충돌 |
| Service Accounts | 5 | 서비스 계정, API 키 검증 |
| GitHub | 7 | 레포, Secrets 동기화 |
| AI | 8 | 채팅, 분석, 추천 (Pro) |
| Admin | 24 | AI 설정, 사용자, 통계 |
| Connections | 10 | 서비스 연결, 헬스, 임팩트 |
| Payments | 6 | Stripe, Polar, Toss |
| Tokens | 3 | API 토큰 생성/폐기 |
| OneClick | 15 | 배포, 파일, 프리플라이트 |
| Showcase | 16 | 쇼케이스 CRUD, 좋아요, 댓글 |
| Feedback | 9 | 기능 요청, 투표, 댓글 |
| Custom Services | 6 | 사용자 정의 서비스 |
| Teams | 4 | 팀 생성, 멤버 관리 |
| Utilities | 8 | 환율, 헬스체크, IndexNow, 시드 |
| **합계** | **~176** | |

---

## 5. 메뉴-서비스 연결 매트릭스

| 메뉴/기능 | Supabase | GitHub | Cloudflare | OpenAI | Polar | Stripe | Resend | GA4 | Clarity |
|-----------|:--------:|:------:|:----------:|:------:|:-----:|:------:|:------:|:---:|:-------:|
| 랜딩 페이지 | | | | | | | | O | O |
| 로그인/가입 | O | O | | | | | | | |
| 대시보드 | O | | | | | | | | |
| 서비스맵 | O | | | | | | | | |
| 환경변수 | O | O | | | | | | | |
| 비용 추적 | O | | | O | | | | | |
| 헬스 체크 | O | O | O | O | O | O | O | | |
| AI 채팅 | O | | | O | | | | | |
| AI ENV Doctor | O | | | O | | | | | |
| 원클릭 배포 | O | O | O | | | | | | |
| 사이트 에디터 | O | O | | | | | | | |
| 쇼케이스 | O | | | | | | | | |
| 결제/구독 | O | | | | O | O | | | |
| GitHub Secrets | O | O | | | | | | | |
| 가이드 | | | | | | | | O | O |
| 블로그 | | | | | | | | O | O |
| 이메일 알림 | O | | | | | | O | | |
| 관리자 패널 | O | | | O | | | | | |
| API 토큰 | O | | | | | | | | |
| 팀 관리 | O | | | | | | O | | |

---

## 6. 데이터 흐름 요약

```
[사용자] → 로그인 (Supabase Auth / GitHub OAuth)
    │
    ├─→ [대시보드] → 프로젝트 생성
    │       │
    │       ├─→ [서비스 추가] → 카탈로그에서 선택 or 커스텀
    │       │       │
    │       │       ├─→ [서비스맵] ← React Flow 시각화
    │       │       ├─→ [연결 관리] ← 서비스 간 의존성
    │       │       └─→ [헬스 체크] ← 10개 어댑터
    │       │
    │       ├─→ [환경변수] → AES-256-GCM 암호화
    │       │       └─→ [GitHub Sync] → NaCl → GitHub Secrets
    │       │
    │       ├─→ [비용 추적] → 서비스별 비용 + 예산
    │       │       └─→ [AI 리포트] → OpenAI 분석
    │       │
    │       └─→ [감사 로그] ← 모든 민감 작업 기록
    │
    ├─→ [원클릭 배포]
    │       ├─→ 템플릿 선택 (17+)
    │       ├─→ GitHub Fork + Pages 설정
    │       ├─→ 배포 완료 → URL 발급
    │       └─→ [사이트 에디터] → 코드 편집 + 모듈 관리
    │
    ├─→ [쇼케이스] → 프로젝트 공개 → 좋아요/댓글/리더보드
    │
    ├─→ [설정]
    │       ├─→ 프로필 / 계정
    │       ├─→ 구독 관리 (Polar/Stripe)
    │       ├─→ GitHub 연동
    │       └─→ API 토큰 (stl_ prefix, SHA-256 해시)
    │
    └─→ [AI 어시스턴트] (Pro)
            ├─→ Stack Architect (아키텍처 추천)
            ├─→ ENV Doctor (환경변수 진단)
            ├─→ Cost Report (비용 분석)
            └─→ Service Compare (서비스 비교)
```

---

## 7. 인증 & 권한 매트릭스

| 경로 그룹 | 인증 | 관리자 | 소유권 확인 | 레이아웃 |
|-----------|:----:|:------:|:----------:|---------|
| Public (/, /blog 등) | - | - | - | Header + Footer |
| Auth (/login 등) | - | - | - | 최소 레이아웃 |
| Dashboard | O | - | 프로젝트별 | Sidebar + Header |
| Admin | O | O | - | Sidebar + Header |
| Project/[id] | O | - | user_id == project.user_id | Sidebar + Header |
| Settings | O | - | 본인만 | Sidebar + SettingsNav |
| Demo | - | - | 데모 데이터 | Sidebar + Header |

---

## 8. 기술 스택 요약

| 레이어 | 기술 |
|--------|------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| UI | Tailwind CSS v4 + shadcn/ui v4 |
| State (Server) | TanStack Query |
| State (Client) | Zustand (7 stores) |
| Visualization | React Flow (@xyflow/react) |
| Validation | Zod v4 |
| Database | Supabase PostgreSQL (35+ tables, RLS) |
| Auth | Supabase Auth (Google/GitHub OAuth) |
| Encryption | AES-256-GCM + NaCl |
| Hosting | Cloudflare Workers (@opennextjs/cloudflare) |
| Email | Resend |
| Payment | Polar (primary) / Stripe (legacy) |
| AI | OpenAI gpt-4o + Anthropic + Google AI |
| Analytics | GA4 + Microsoft Clarity |
| Icons | lucide-react |
| Toast | sonner |
| Font | Pretendard Variable + Geist Mono |
