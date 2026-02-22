# Cloudflare AI Gateway 설정 가이드

Linkmap은 OpenAI API 호출 시 **Cloudflare AI Gateway**를 프록시로 사용합니다.
이 문서는 AI Gateway의 역할, Authenticated Gateway 보안 설정, 그리고 코드 적용 방법을 설명합니다.

---

## 왜 AI Gateway를 사용하는가?

OpenAI API는 특정 국가/지역에서 직접 호출이 차단됩니다 (`unsupported_country_region_territory`).
Cloudflare AI Gateway를 프록시로 사용하면 이 제한을 우회하면서 추가 보안·관측 기능을 얻습니다.

| 기능 | 설명 |
|------|------|
| **지역 우회** | Cloudflare 엣지를 통해 OpenAI에 요청 → 지역 차단 회피 |
| **요청 로깅** | 모든 AI 요청/응답을 Cloudflare 대시보드에서 확인 |
| **캐싱** | 동일 요청 캐시 → 응답 지연 최대 90% 감소, 비용 절감 |
| **Rate Limiting** | 게이트웨이 레벨 속도 제한으로 API 쿼터 보호 |
| **비용 추적** | 프로바이더별 토큰 사용량·비용 대시보드 |
| **Guardrails** | 유해 콘텐츠 필터링 (프롬프트/응답 모두) |

---

## 현재 구성

```
OPENAI_BASE_URL=https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai
```

| 항목 | 값 |
|------|-----|
| Account ID | `dc5e2d0712bac464598d10d23900ea56` |
| Gateway Name | `linkmap` |
| Provider | `openai` |

### 요청 흐름

```
클라이언트 → Next.js API Route → Cloudflare AI Gateway → OpenAI API
                                       │
                                       ├─ 인증 확인 (cf-aig-authorization)
                                       ├─ 로그 기록
                                       ├─ 캐시 확인
                                       └─ Rate Limit 확인
```

---

## Authenticated Gateway란?

Authenticated Gateway는 AI Gateway에 **접근 제어 레이어**를 추가하는 보안 기능입니다.

### 활성화 시 동작

- 모든 요청에 `cf-aig-authorization` 헤더가 **필수**
- 헤더가 없거나 토큰이 잘못되면 → **HTTP 401** (`{"error":[{"code":2009,"message":"Unauthorized"}]}`)
- OpenAI API 키(`Authorization: Bearer`)와는 **별도의 인증**

### 비활성화 시 동작

- `cf-aig-authorization` 헤더 불필요
- 게이트웨이 URL을 아는 누구나 요청 가능 (OpenAI 키는 여전히 필요)

### 왜 켜야 하는가?

| 위협 | Authenticated Gateway OFF | Authenticated Gateway ON |
|------|---------------------------|--------------------------|
| 게이트웨이 URL 유출 | 제3자가 URL로 요청 가능 (본인 OpenAI 키 사용) → 로그 오염 | 토큰 없이는 요청 차단 |
| 로그 스토리지 낭비 | 무효 요청도 로그에 기록 → 스토리지 소진 | 인증된 요청만 로그 저장 |
| 비용 추적 왜곡 | 외부 요청이 통계에 포함 | 정확한 사용량 추적 |

> Cloudflare 공식 권장: **로그 저장 시 Authenticated Gateway 활성화를 권장**

---

## 인증 토큰 생성 방법

### 1단계: Cloudflare Dashboard에서 토큰 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com/) 로그인
2. **AI** > **AI Gateway** > `linkmap` 게이트웨이 선택
3. **Settings** 탭 이동
4. **Create authentication token** 클릭
5. **Create an AI Gateway authentication token** 선택
6. 필요 권한: **AI Gateway — Run**
7. 생성된 토큰을 **즉시 복사하여 안전하게 저장** (다시 표시되지 않음)
8. **Authenticated Gateway** 토글 ON

### 2단계: 환경변수 등록

```bash
# 로컬 개발 — .env.local에 추가
CF_AIG_TOKEN=<생성한_토큰>

# Cloudflare Workers — wrangler secret
npx wrangler secret put CF_AIG_TOKEN
```

### 3단계: 코드에서 헤더 추가

토큰을 `cf-aig-authorization: Bearer <token>` 헤더로 모든 AI Gateway 요청에 포함해야 합니다.

#### 적용 대상 파일

| 파일 | 함수 | 설명 |
|------|------|------|
| `src/lib/ai/openai.ts` | `callOpenAIStructured()` | Structured Output 모드 |
| `src/lib/ai/openai.ts` | `callOpenAIWithTools()` | Function Calling 모드 |
| `src/lib/ai/openai.ts` | `callOpenAIStream()` | SSE 스트리밍 모드 |
| `src/lib/ai/providers.ts` | `callOpenAI()` | 멀티 프로바이더 통합 (OpenAI 분기) |

#### 적용 패턴

```typescript
// 변경 전
const response = await fetch(`${base}/chat/completions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  },
  body: JSON.stringify({ ... }),
});

// 변경 후
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${apiKey}`,
};
// AI Gateway 사용 시 인증 헤더 추가
if (process.env.CF_AIG_TOKEN) {
  headers['cf-aig-authorization'] = `Bearer ${process.env.CF_AIG_TOKEN}`;
}

const response = await fetch(`${base}/chat/completions`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ ... }),
});
```

> `CF_AIG_TOKEN`이 없으면 헤더를 생략하므로, Authenticated Gateway가 비활성화된 환경에서도 호환됩니다.

---

## 인증 구조 요약 (2중 인증)

AI Gateway를 통한 요청은 **두 가지 인증이 동시에 필요**합니다:

```
┌─────────────────────────────────────────────────────┐
│                    요청 (Request)                     │
│                                                       │
│  Header 1: cf-aig-authorization: Bearer <CF_TOKEN>   │ ← Cloudflare 게이트웨이 인증
│  Header 2: Authorization: Bearer <OPENAI_KEY>        │ ← OpenAI API 인증
│                                                       │
│  Body: { model, messages, ... }                      │
│                                                       │
└──────────────┬────────────────────────────────────────┘
               │
               ▼
┌──────────────────────────┐     ┌─────────────────────┐
│   Cloudflare AI Gateway  │────▶│     OpenAI API       │
│                          │     │                      │
│  1. cf-aig-authorization │     │  2. Authorization    │
│     검증 (CF 토큰)       │     │     검증 (API 키)    │
│  3. 로그 기록            │     │                      │
│  4. 캐시/Rate Limit      │     │                      │
└──────────────────────────┘     └─────────────────────┘
```

| 헤더 | 용도 | 검증 주체 | 없으면 |
|------|------|-----------|--------|
| `cf-aig-authorization` | 게이트웨이 접근 인증 | Cloudflare | 401 (code 2009) |
| `Authorization` | OpenAI API 인증 | OpenAI | 401 (invalid_api_key) |

---

## 환경변수 전체 목록 (AI 관련)

```bash
# 필수
OPENAI_API_KEY=sk-...           # OpenAI API 키

# 프록시 (지역 차단 우회)
OPENAI_BASE_URL=https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}/openai

# 게이트웨이 인증 (Authenticated Gateway 활성화 시 필수)
CF_AIG_TOKEN=<cloudflare_ai_gateway_token>

# 선택 — 추가 AI 프로바이더
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_AI_API_KEY=AIza...
```

---

## 트러블슈팅

| 증상 | HTTP | 원인 | 해결 |
|------|------|------|------|
| `Unauthorized` (code 2009) | 401 | Authenticated Gateway ON + `cf-aig-authorization` 헤더 누락 | `CF_AIG_TOKEN` 환경변수 설정 + 코드에 헤더 추가 |
| `unsupported_country_region_territory` | 403 | `OPENAI_BASE_URL` 미설정 → 직접 OpenAI 호출 | `OPENAI_BASE_URL`을 게이트웨이 URL로 설정 |
| `An unknown error occurred` | 500 | 게이트웨이 내부 오류 또는 설정 미완료 | Cloudflare Dashboard > AI Gateway > Logs에서 상세 로그 확인 |
| `invalid_api_key` | 401 | OpenAI API 키 만료/오류 | OpenAI 콘솔에서 키 재발급 |
| 로컬 OK, 프로덕션 에러 | 500 | Workers에 `CF_AIG_TOKEN` 미설정 | `npx wrangler secret put CF_AIG_TOKEN` |

---

## Cloudflare Workers Binding (참고)

Cloudflare Workers에서 AI Gateway를 **Binding**으로 연결하면 `cf-aig-authorization` 헤더가 **자동 포함**됩니다.
현재 Linkmap은 `fetch()` 기반 직접 호출 방식이므로 명시적 헤더 설정이 필요합니다.

향후 Workers Binding 방식으로 전환하면:
- `cf-aig-authorization` 헤더 관리 불필요
- 계정 내 사전 인증 처리
- `wrangler.jsonc`에 바인딩 설정만 추가

---

## 참고 링크

- [AI Gateway 공식 문서](https://developers.cloudflare.com/ai-gateway/)
- [Authenticated Gateway 설정](https://developers.cloudflare.com/ai-gateway/configuration/authentication/)
- [AI Gateway 요금](https://developers.cloudflare.com/ai-gateway/reference/pricing/)
- [OpenAI Provider 설정](https://developers.cloudflare.com/ai-gateway/usage/providers/openai/)
- [캐싱 설정](https://developers.cloudflare.com/ai-gateway/features/caching/)
- [Rate Limiting 설정](https://developers.cloudflare.com/ai-gateway/features/rate-limiting/)
