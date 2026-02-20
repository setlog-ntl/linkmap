# Linkmap — 바이브 코딩 시대의 설정 관리 플랫폼

## 한줄 소개

> 완전 초보자는 원클릭으로 배포하고, 개발자는 서비스맵·환경변수·팀 협업까지 — 한 플랫폼에서.

---

## 문제 정의

### 1. 초보자의 진입장벽
코드를 처음 접하는 바이브 코딩 입문자에게 "GitHub 레포가 뭔지", "배포는 어떻게 하는지"는 너무 높은 벽입니다. 단순한 개인 홈페이지 하나 올리는 데에도 Git CLI, 호스팅 설정, 도메인 연결 등 수많은 단계가 필요합니다.

### 2. API 키·환경변수 산재
프로젝트가 커지면 Supabase, Stripe, OpenAI, Cloudflare 등 다양한 서비스의 API 키가 흩어집니다. Slack으로 .env 파일을 공유하고, 스프레드시트로 관리하는 팀이 대부분이며, 이는 심각한 보안 리스크입니다.

### 3. 서비스 연결 구조 문서화 부재
"우리 프로젝트에 어떤 서비스가 연결되어 있고, 어떤 키를 쓰고 있지?" — 이 질문에 즉시 답할 수 있는 팀은 거의 없습니다. 서비스 간 연결 관계를 시각화하는 도구가 없습니다.

---

## 솔루션

### 1. 원클릭 배포 — 3분 만에 GitHub 체험
템플릿 선택 → GitHub 연결 → 배포 버튼 하나로 개인 홈페이지가 GitHub Pages에 올라갑니다. Git 명령어를 몰라도, 코드를 작성하지 않아도 됩니다. 6종 템플릿(디지털 명함, 우리가게 홍보, 포트폴리오 등)으로 즉시 시작할 수 있습니다.

### 2. 서비스맵 시각화
React Flow 기반 인터랙티브 다이어그램으로 프로젝트의 모든 서비스 연결 구조를 한 화면에 표시합니다. Frontend/Backend/DevTools 레이어 분류, 연결 유형(API/Webhook/SDK), 상태 표시까지 지원합니다.

### 3. 암호화 환경변수 관리
AES-256-GCM으로 모든 환경변수를 암호화하여 저장합니다. 개발/스테이징/프로덕션 환경별 분류, .env 원클릭 다운로드, GitHub Secrets 자동 동기화까지 — API 키 관리의 모든 것을 한 곳에서.

---

## AI 기능 — OpenAI API 5가지 활용

Linkmap은 OpenAI API를 **5가지 서로 다른 기법**으로 제품 내에 통합했습니다:

### Feature 1: AI 스택 아키텍트 (Structured Output)
- **기법**: `response_format: json_schema` (Structured Output)
- **기능**: 프로젝트 목적을 입력하면 최적의 기술 스택을 JSON 구조로 추천
- **예시**: "실시간 채팅 SaaS" → Next.js + Supabase + Redis + Stripe 추천 (레이어별 분류)

### Feature 2: AI 환경변수 닥터 (Function Calling)
- **기법**: `tools` + `tool_choice` (Function Calling)
- **기능**: 프로젝트의 환경변수를 분석하여 누락·중복·보안 위험을 진단
- **Tool Functions**: `check_missing_vars`, `check_security_risks`, `suggest_improvements`

### Feature 3: AI 서비스맵 내레이터 (SSE Streaming)
- **기법**: `stream: true` (Server-Sent Events)
- **기능**: 서비스맵 구조를 읽어서 실시간으로 아키텍처를 설명 (스트리밍 텍스트)
- **UX**: 글자가 하나씩 타이핑되듯 나타나는 실시간 스트리밍 경험

### Feature 4: AI 서비스 비교 (Rich Context Chat)
- **기법**: 풍부한 시스템 프롬프트 + 컨텍스트 주입
- **기능**: 두 서비스(예: Supabase vs Firebase)를 프로젝트 맥락에서 비교 분석
- **컨텍스트**: 프로젝트의 기존 서비스·환경변수·연결 정보를 모두 주입

### Feature 5: AI 자연어 커맨드 (Function Calling)
- **기법**: `tools` + 반복 호출 (Multi-turn Function Calling)
- **기능**: "Supabase 서비스를 추가해줘" 같은 자연어 명령으로 서비스 추가·환경변수 등록
- **Tool Functions**: `add_service`, `add_env_var`, `create_connection` 등

---

## 차별점 — 경쟁사와의 비교

| 기능 | Linkmap | Vault | AWS SM | Doppler |
|------|---------|-------|--------|---------|
| 서비스맵 시각화 | ✅ | ❌ | ❌ | ❌ |
| 환경변수 암호화 | ✅ | ✅ | ✅ | ✅ |
| GitHub Secrets 동기화 | ✅ | ❌ | ❌ | ✅ |
| 원클릭 배포 | ✅ | ❌ | ❌ | ❌ |
| 한국어 지원 | ✅ | ❌ | ❌ | ❌ |
| AI 통합 (5가지) | ✅ | ❌ | ❌ | ❌ |
| 무료 티어 | ✅ | △ | ❌ | ✅ |

**핵심**: 서비스맵 + 환경변수 암호화 + 원클릭 배포를 **한 플랫폼에 통합**한 서비스는 Linkmap이 유일합니다.

---

## 기술 스택 & 개발 지표

### 기술 스택
- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + RLS) + Next.js API Routes
- **AI**: OpenAI API (GPT-4o) — 3가지 기법 (Structured Output, Function Calling, SSE Streaming)
- **보안**: AES-256-GCM 암호화, Row-Level Security, 감사 로그
- **배포**: Cloudflare Workers (@opennextjs/cloudflare)
- **시각화**: React Flow (@xyflow/react)
- **상태관리**: TanStack Query (서버) + Zustand (클라이언트)
- **i18n**: 한국어/영어 완전 지원 (400+ 키)

### 개발 지표
| 지표 | 수치 |
|------|------|
| 개발 기간 | 11일 (2026.02.09 ~ 02.20) |
| 개발 인원 | 1인 × Claude Code (Opus) |
| 총 커밋 | 170+ |
| API Routes | 58개 |
| 테스트 | 95개 (Vitest) |
| DB 마이그레이션 | 33개 |
| i18n 키 | 400+ (ko/en) |
| 서비스 카탈로그 | 20+ 서비스 |

---

## 비즈니스 모델

| 플랜 | 가격 | 프로젝트 | 환경변수 | 서비스 | 기능 |
|------|------|----------|----------|--------|------|
| Free | $0 | 3 | 20 | 10 | 원클릭 배포, 서비스맵, 기본 환경변수 |
| Pro | $9/월 | 20 | 100 | 50 | + 감사 로그, GitHub 동기화, AI 기능 |
| Team | $29/월 | 100 | 500 | 100 | + RBAC, SSO/SAML, 전용 지원 |

---

## 라이브 서비스

- **URL**: https://linkmap.cdhrich2.workers.dev
- **배포 환경**: Cloudflare Workers (글로벌 엣지)
- **인증**: Google/GitHub OAuth (Supabase Auth)

---

## 팀 소개

- **1인 개발자 × Claude Code (Opus)**
- 11일간 집중 개발, 6차 스프린트 (보안 → 테스트 → UX → 버그수정 → 대시보드 → AI)
- "바이브 코딩"의 실제 사례: AI와 함께 프로덕션 수준 SaaS를 완성

> "1인 × Claude Code = 프로덕션 SaaS. This is Vibe Coding."
