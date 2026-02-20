# AI 기능 설정 가이드

Linkmap의 AI 분석 기능(스택 추천, 환경변수 진단, 서비스맵 내레이션 등)을 활성화하기 위한 설정입니다.

> AI 키가 없어도 앱의 나머지 기능은 모두 정상 동작합니다. AI 기능만 비활성화됩니다.

---

## AI 기능 목록

| 기능 | API 엔드포인트 | OpenAI 기법 | 설명 |
|------|---------------|-------------|------|
| 스택 아키텍트 | `POST /api/ai/stack-recommend` | Structured Output | 프로젝트 설명 기반 최적 서비스 스택 추천 |
| 환경변수 닥터 | `POST /api/ai/env-doctor` | Function Calling | 환경변수 누락·보안·네이밍 문제 진단 |
| 서비스맵 내레이터 | `POST /api/ai/map-narrate` | SSE Streaming | 서비스맵 아키텍처 분석 및 인사이트 |
| 서비스 비교 | `POST /api/ai/compare-services` | Rich Context Chat | 2개 이상 서비스 비교표 생성 |
| 자연어 커맨드 | `POST /api/ai/command` | Function Calling | 자연어로 서비스 관리 및 페이지 이동 |

---

## API 키 설정

### 방법 1: 환경변수 (권장)

`.env.local` 또는 Cloudflare Workers에 직접 설정합니다.

```bash
# 로컬 개발 — .env.local
OPENAI_API_KEY=sk-...

# Cloudflare Workers — wrangler secret
npx wrangler secret put OPENAI_API_KEY
```

현재 지원하는 키:

| 환경변수 | 프로바이더 | 발급처 |
|----------|-----------|--------|
| `OPENAI_API_KEY` | OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| `ANTHROPIC_API_KEY` | Anthropic | [console.anthropic.com](https://console.anthropic.com/) |
| `GOOGLE_AI_API_KEY` | Google AI | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |

### 방법 2: AI 관리 콘솔 (DB 저장)

대시보드 > AI 설정 > Providers 탭에서 키를 등록할 수 있습니다. DB에 AES-256-GCM으로 암호화 저장됩니다.

### 키 해석 우선순위

```
1. 환경변수 (OPENAI_API_KEY 등)  ← 우선
2. DB fallback (ai_providers 테이블)  ← 환경변수 없을 때
```

`src/lib/ai/resolve-key.ts`에서 이 순서로 키를 탐색합니다. 환경변수가 설정되어 있으면 DB 값은 무시됩니다.

---

## 아키텍처

```
클라이언트 (React)
  │
  ├─ POST /api/ai/[feature]
  │    │
  │    ├─ 1. getUser() — 인증 확인
  │    ├─ 2. Zod safeParse() — 입력 검증
  │    ├─ 3. resolveOpenAIKey() — 키 해석 (환경변수 → DB)
  │    ├─ 4. OpenAI API 호출 (3가지 모드)
  │    │    ├─ callOpenAIStructured() — JSON Schema 응답
  │    │    ├─ callOpenAIWithTools() — Function Calling (최대 5회 반복)
  │    │    └─ callOpenAIStream() — SSE 스트리밍
  │    └─ 5. logAudit() — 감사 로그
  │
  └─ use-streaming.ts 훅 (SSE 파싱, AbortController)
```

주요 파일:

| 파일 | 역할 |
|------|------|
| `src/lib/ai/openai.ts` | OpenAI 클라이언트 (3가지 호출 모드) |
| `src/lib/ai/resolve-key.ts` | 키 해석 (환경변수 → DB fallback) |
| `src/lib/hooks/use-streaming.ts` | 클라이언트 SSE 스트리밍 훅 |
| `src/components/ai-admin-console.tsx` | AI 관리 콘솔 (6개 탭) |

---

## 헬스체크

AI 기능이 정상 동작하는지 확인하는 방법:

### 로컬

```bash
# 1. 환경변수 확인
grep OPENAI_API_KEY .env.local

# 2. 개발 서버에서 API 호출 테스트
curl -X POST http://localhost:3000/api/ai/stack-recommend \
  -H "Content-Type: application/json" \
  -H "Cookie: <세션쿠키>" \
  -d '{"description": "블로그 서비스"}'
```

### Cloudflare Workers (프로덕션)

```bash
# 실시간 로그 확인
npx wrangler tail

# 다른 터미널에서 AI API 호출 → wrangler tail에서 로그 확인
```

---

## 트러블슈팅

### 증상별 진단표

| 증상 | HTTP 코드 | 원인 | 해결 |
|------|-----------|------|------|
| AI 기능 호출 시 서버 에러 | 500 | `OPENAI_API_KEY` 미설정 | 환경변수 또는 AI 콘솔에서 키 등록 |
| "API key is invalid" | 401 | API 키가 만료되거나 잘못됨 | 프로바이더 콘솔에서 키 재발급 |
| 응답이 매우 느림 | 429 | OpenAI rate limit 초과 | 잠시 대기 후 재시도, 또는 상위 플랜 업그레이드 |
| 로컬 OK, 프로덕션 에러 | 500 | Workers에 키 미설정 | `npx wrangler secret put OPENAI_API_KEY` |
| 스트리밍 중 끊김 | - | 네트워크 타임아웃 | 재시도, Cloudflare timeout 설정 확인 |

### 자주 하는 실수

1. **`.env.local`에만 키 설정** — Cloudflare Workers에는 `wrangler secret put`으로 별도 등록 필요
2. **DB에 키를 넣었는데 동작 안 함** — `ENCRYPTION_KEY`가 프로덕션에 설정되어 있는지 확인 (DB 키 복호화에 필요)
3. **키 우선순위 혼동** — 환경변수가 있으면 DB 설정은 무시됨

---

## 보안 참고사항

- API 키는 서버 측(`src/lib/ai/`)에서만 사용됩니다
- DB에 저장된 키는 AES-256-GCM으로 암호화됩니다
- 복호화된 키는 로그에 기록되거나 API 응답에 포함되지 않습니다
- 모든 AI API 호출에 `getUser()` 인증 확인이 선행됩니다
- AI 관리 콘솔은 관리자 권한이 필요합니다
- `OPENAI_API_KEY` 등에 `NEXT_PUBLIC_` 접두사를 붙이지 마세요 (클라이언트 노출)
