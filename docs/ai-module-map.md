# AI 서비스 모듈 맵

> 최종 업데이트: 2026-02-22
> 총 22개 API 라우트 · 8개 UI 컴포넌트 · 5개 Admin 컴포넌트 · 4개 Core 라이브러리 · 24개 Query 훅

---

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────────────────────────┐
│                        UI Layer                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ AiChat   │ │ EnvDoctor│ │ MapNarr  │ │ StackArchitect   │   │
│  │ Panel    │ │ Panel    │ │ Panel    │ │ Dialog           │   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────────────┘   │
│       │             │            │             │                 │
│  ┌────┴─────┐  ┌────┴──┐  ┌─────┴────┐  ┌────┴──────────────┐  │
│  │useAiChat │  │fetch  │  │useStream │  │fetch + mutation   │  │
│  │(hook)    │  │       │  │(hook)    │  │                   │  │
│  └────┬─────┘  └────┬──┘  └─────┬────┘  └────┬──────────────┘  │
└───────┼──────────────┼──────────┼─────────────┼─────────────────┘
        │              │          │             │
┌───────┼──────────────┼──────────┼─────────────┼─────────────────┐
│       ▼              ▼          ▼             ▼   API Layer      │
│  /ai/chat    /ai/env-doctor  /ai/map-narrate  /ai/stack-recommend│
│  /ai/command /ai/compare     /ai/module-suggest /ai/feature-config│
│                                                                  │
│  Auth → Zod → Ownership → guardrails → AI Call → Audit Log       │
└───────┼──────────────────────────────────────────────────────────┘
        │
┌───────┼──────────────────────────────────────────────────────────┐
│       ▼              Core AI Layer                                │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  ┌──────────┐ │
│  │ openai.ts   │  │ providers.ts│  │ guardrails │  │resolve-  │ │
│  │ Structured  │  │ OpenAI      │  │ .ts        │  │key.ts    │ │
│  │ Stream      │  │ Anthropic   │  │ Input      │  │ ENV →    │ │
│  │ Tools       │  │ Google      │  │ Filter     │  │ DB →     │ │
│  └──────┬──────┘  └──────┬──────┘  └────────────┘  │ Decrypt  │ │
│         │                │                          └──────────┘ │
└─────────┼────────────────┼──────────────────────────────────────┘
          ▼                ▼
    OpenAI API       Anthropic / Google APIs
    (via CF AI Gateway)
```

---

## 2. 모듈 구성 (Module Registry)

### 2-A. Core AI 라이브러리 (`src/lib/ai/`)

| 파일 | 역할 | 주요 Export | 사용처 |
|------|------|-------------|--------|
| `openai.ts` | OpenAI API 3가지 호출 모드 | `callOpenAIStructured`, `callOpenAIStream`, `callOpenAIWithTools`, `buildHeaders`, `ToolDefinition` | 모든 AI API 라우트 |
| `providers.ts` | 멀티 프로바이더 디스패치 | `callAiProvider`, `AiProviderSlug`, `AiChatRequest`, `AiChatResponse` | admin/ai-playground, oneclick/ai-chat |
| `guardrails.ts` | 입력 안전성 검증 | `checkGuardrails`, `GuardrailResult` | /ai/chat, oneclick/ai-chat |
| `resolve-key.ts` | API 키 해석 (ENV → DB 복호화) | `resolveOpenAIKey`, `resolveAIProviderKey`, `AIKeyNotConfiguredError` | 모든 AI API 라우트 |

**의존 관계:**
```
providers.ts → openai.ts (buildHeaders, parseOpenAIError)
resolve-key.ts → supabase/admin + crypto/decrypt
openai.ts, guardrails.ts → 독립 (외부 의존 없음)
```

---

### 2-B. 사용자 AI 기능 (6개 Feature)

| # | Feature | Slug | API Route | 호출 방식 | 응답 | UI 컴포넌트 |
|---|---------|------|-----------|-----------|------|-------------|
| 1 | AI 채팅 | `overview_chat` | `POST /ai/chat` | `callOpenAIStream` (SSE) | 스트리밍 마크다운 + 추천 JSON | `ai-chat-panel.tsx` |
| 2 | 환경변수 진단 | `env_doctor` | `POST /ai/env-doctor` | `callOpenAIWithTools` (Function Calling, 3 tools) | JSON (issues + summary) | `env-doctor-panel.tsx` |
| 3 | 서비스맵 분석 | `map_narrator` | `POST /ai/map-narrate` | `callOpenAIStream` (SSE) | 스트리밍 마크다운 | `map-narrator-panel.tsx` |
| 4 | 스택 추천 | — | `POST /ai/stack-recommend` | `callOpenAIStructured` (JSON Schema) | JSON (services, connections, cost, complexity) | `stack-architect-dialog.tsx` + `stack-result-view.tsx` |
| 5 | 서비스 비교 | `compare_services` | `POST /ai/compare-services` | `callOpenAIStructured` (JSON Schema) | JSON (마크다운 비교표) | `service-comparison-sheet.tsx` |
| 6 | NL 커맨드 | `command` | `POST /ai/command` | `callOpenAIWithTools` (Function Calling, 5 tools) | JSON (message + actions) | 커맨드 팔레트 (inline) |
| 7 | 모듈 제안 | `module_suggest` | `POST /ai/module-suggest` | `callOpenAIStructured` (JSON Schema) | JSON (enabled, order, values) | OneClick 에디터 (inline) |
| 8 | 기능 설정 조회 | — | `GET /ai/feature-config` | DB 조회 (AI 호출 없음) | JSON (config + qna) | `quick-action-buttons.tsx` |

---

### 2-C. Admin AI 관리 (10개 CRUD 그룹)

| # | 관리 대상 | API Route | Methods | DB 테이블 | Admin 컴포넌트 |
|---|-----------|-----------|---------|-----------|----------------|
| 1 | 글로벌 설정 | `/admin/ai-config` | GET, PUT | `ai_assistant_config` | (설정 탭 내) |
| 2 | 가드레일 | `/admin/ai-guardrails` | GET, PUT | `ai_guardrails` | `ai-guardrails-tab.tsx` |
| 3 | 페르소나 | `/admin/ai-personas` | GET, POST | `ai_personas` | `ai-personas-tab.tsx` |
| 4 | 페르소나 상세 | `/admin/ai-personas/[id]` | PUT, DELETE | `ai_personas` | `ai-personas-tab.tsx` |
| 5 | 프로바이더 | `/admin/ai-providers` | GET, PUT | `ai_providers` | (설정 탭 내) |
| 6 | 프롬프트 템플릿 | `/admin/ai-templates` | GET, POST | `ai_prompt_templates` | (설정 탭 내) |
| 7 | 템플릿 상세 | `/admin/ai-templates/[id]` | PUT, DELETE | `ai_prompt_templates` | (설정 탭 내) |
| 8 | 사용량 통계 | `/admin/ai-usage` | GET | `ai_usage_logs` | `ai-usage-tab.tsx` |
| 9 | 기능별 페르소나 | `/admin/ai-feature-personas` | GET, PUT | `ai_feature_personas` | `ai-feature-mapping-tab.tsx` |
| 10 | 기능별 Q&A | `/admin/ai-feature-qna` | GET, POST, PUT, DELETE | `ai_feature_qna` | `ai-feature-mapping-tab.tsx` |
| 11 | 프리셋 | `/admin/ai-feature-presets` | GET, POST | `ai_feature_personas`, `ai_feature_qna` | `ai-feature-mapping-tab.tsx` |
| 12 | 플레이그라운드 | `/admin/ai-playground` | POST | `ai_usage_logs` (write) | `ai-playground-tab.tsx` |

---

### 2-D. OneClick AI

| API Route | 역할 | 호출 방식 |
|-----------|------|-----------|
| `POST /oneclick/ai-chat` | 사이트 에디터 코드 어시스턴트 | `callAiProvider` (멀티 프로바이더, 비스트리밍) |

---

## 3. 타입 시스템 (`src/types/ai.ts`)

| 타입 | 용도 | 사용 위치 |
|------|------|-----------|
| `AiProviderSlug` | `'openai' \| 'anthropic' \| 'google'` | providers.ts, resolve-key.ts, admin routes |
| `ContentFilterLevel` | `'off' \| 'low' \| 'medium' \| 'high'` | guardrails |
| `AiAssistantConfig` | 글로벌 AI 설정 행 | admin/ai-config |
| `AiPersona` | 페르소나 정의 (avatar, system_prompt, model 오버라이드) | admin/ai-personas, chat route |
| `AiProvider` | 프로바이더 행 (available_models, encrypted_api_key) | admin/ai-providers |
| `AiGuardrails` | 가드레일 설정 (filters, denied_topics, blocked_words) | guardrails.ts, chat route |
| `AiPromptTemplate` | 프롬프트 템플릿 (bilingual, category) | admin/ai-templates |
| `AiUsageLog` | 사용 로그 엔트리 | admin/ai-usage |
| `AiUsageSummary` | 집계 통계 | admin/ai-usage |
| `AiFeatureSlug` | 6개 기능 슬러그 유니온 | feature-config, Q&A, persona mapping |
| `AiFeaturePersona` | 기능↔페르소나 매핑 | admin/ai-feature-personas |
| `AiFeatureQna` | 기능별 Q&A 항목 | admin/ai-feature-qna |
| `ChatMessage` | 채팅 메시지 (role, content, recommendations) | useAiChat, AiChatPanel |
| `ServiceRecommendation` | 추천 서비스 (slug, name, layer, reason) | chat, stack-recommend |

---

## 4. Query 훅 (`src/lib/queries/ai-config.ts`)

### Query Key 구조 (`src/lib/queries/keys.ts`)
```ts
aiConfig: {
  global, personas, persona(id),
  providers, guardrails, templates, template(id),
  usage(period), featurePersonas, featurePersona(slug),
  featureQna(slug), featurePresets
}
ai: {
  stackRecommend, envDoctor(projectId), compare(slugs[])
}
```

### 훅 목록 (24개)

| 훅 | 타입 | 엔드포인트 |
|----|------|-----------|
| `useAiGlobalConfig` | query | `GET /admin/ai-config` |
| `useUpdateAiGlobalConfig` | mutation | `PUT /admin/ai-config` |
| `useAiPersonas` | query | `GET /admin/ai-personas` |
| `useCreateAiPersona` | mutation | `POST /admin/ai-personas` |
| `useUpdateAiPersona` | mutation | `PUT /admin/ai-personas/:id` |
| `useDeleteAiPersona` | mutation | `DELETE /admin/ai-personas/:id` |
| `useAiProviders` | query | `GET /admin/ai-providers` |
| `useUpdateAiProvider` | mutation | `PUT /admin/ai-providers` |
| `useAiGuardrails` | query | `GET /admin/ai-guardrails` |
| `useUpdateAiGuardrails` | mutation | `PUT /admin/ai-guardrails` |
| `useAiTemplates` | query | `GET /admin/ai-templates` |
| `useCreateAiTemplate` | mutation | `POST /admin/ai-templates` |
| `useUpdateAiTemplate` | mutation | `PUT /admin/ai-templates/:id` |
| `useDeleteAiTemplate` | mutation | `DELETE /admin/ai-templates/:id` |
| `useAiUsage` | query | `GET /admin/ai-usage?period=` |
| `useAiPlayground` | mutation | `POST /admin/ai-playground` |
| `useAiFeaturePersonas` | query | `GET /admin/ai-feature-personas` |
| `useUpdateAiFeaturePersona` | mutation | `PUT /admin/ai-feature-personas` |
| `useAiFeatureQna` | query | `GET /admin/ai-feature-qna?slug=` |
| `useCreateAiFeatureQna` | mutation | `POST /admin/ai-feature-qna` |
| `useUpdateAiFeatureQna` | mutation | `PUT /admin/ai-feature-qna/:id` |
| `useDeleteAiFeatureQna` | mutation | `DELETE /admin/ai-feature-qna/:id` |
| `useAiFeaturePresets` | query | `GET /admin/ai-feature-presets` |
| `useApplyAiFeaturePreset` | mutation | `POST /admin/ai-feature-presets` |

---

## 5. Zod 검증 스키마 (`src/lib/validations/`)

| 파일 | 스키마 | 검증 대상 |
|------|--------|-----------|
| `ai-chat.ts` | `aiChatSchema` | 채팅 메시지 배열 + project_id + feature_slug + context |
| `ai-chat.ts` | `aiFeaturePersonaUpdateSchema` | 기능별 페르소나 업데이트 |
| `ai-chat.ts` | `createFeatureQnaSchema`, `updateFeatureQnaSchema` | Q&A CRUD |
| `ai-command.ts` | `aiCommandSchema` | NL 커맨드 입력 (command + project_id?) |
| `ai-compare.ts` | `compareServicesSchema` | 서비스 비교 (slugs: 2~4개) |
| `ai-config.ts` | 8개 스키마 | Admin 전체 CRUD (persona, provider, guardrails, template, global, playground) |
| `ai-env.ts` | `envDoctorSchema` | 환경변수 진단 (project_id: UUID) |
| `ai-stack.ts` | `stackRecommendSchema` | 스택 추천 (description: min 5자 + project_id?) |

---

## 6. DB 테이블 (AI 관련)

| 테이블 | 용도 | 관련 라우트 |
|--------|------|-------------|
| `ai_assistant_config` | 글로벌 AI 설정 (1 row) | admin/ai-config |
| `ai_personas` | 페르소나 정의 | admin/ai-personas, /ai/chat |
| `ai_providers` | 프로바이더 설정 + 암호화된 API 키 | admin/ai-providers, resolve-key |
| `ai_guardrails` | 안전 가드레일 (1 row) | admin/ai-guardrails, /ai/chat, oneclick/ai-chat |
| `ai_prompt_templates` | 프롬프트 템플릿 | admin/ai-templates |
| `ai_usage_logs` | 사용 로그 | admin/ai-usage, admin/ai-playground, oneclick/ai-chat |
| `ai_feature_personas` | 기능↔페르소나 매핑 | admin/ai-feature-personas, /ai/chat |
| `ai_feature_qna` | 기능별 Q&A 항목 | admin/ai-feature-qna, /ai/chat, /ai/feature-config |

---

## 7. 시드 데이터 (`src/data/seed/ai-feature-defaults.ts`)

| Export | 설명 |
|--------|------|
| `FEATURE_DEFINITIONS` | 6개 AI 기능 슬러그 정의 (이름, 설명, 기본 페르소나) |
| `DEFAULT_QNA` | 11개 기본 Q&A 항목 (한/영 bilingual) |
| `PRESETS` | 3개 프리셋 (`default`, `expert`, `concise`) — 프롬프트 스타일 + Q&A 세트 |

---

## 8. 파일 디렉토리 트리

```
src/
├── app/api/
│   ├── ai/                              # 사용자 AI 기능 (8 routes)
│   │   ├── chat/route.ts                #   스트리밍 채팅
│   │   ├── command/route.ts             #   NL 커맨드 (Function Calling)
│   │   ├── compare-services/route.ts    #   서비스 비교 (Structured Output)
│   │   ├── env-doctor/route.ts          #   환경변수 진단 (Function Calling)
│   │   ├── feature-config/route.ts      #   기능 설정 조회 (DB only)
│   │   ├── map-narrate/route.ts         #   서비스맵 분석 (SSE)
│   │   ├── module-suggest/route.ts      #   모듈 제안 (Structured Output)
│   │   └── stack-recommend/route.ts     #   스택 추천 (Structured Output)
│   ├── admin/                           # Admin AI 관리 (12 routes)
│   │   ├── ai-config/route.ts           #   글로벌 설정
│   │   ├── ai-guardrails/route.ts       #   가드레일
│   │   ├── ai-personas/route.ts         #   페르소나 목록/생성
│   │   ├── ai-personas/[id]/route.ts    #   페르소나 수정/삭제
│   │   ├── ai-providers/route.ts        #   프로바이더 설정
│   │   ├── ai-templates/route.ts        #   프롬프트 템플릿
│   │   ├── ai-templates/[id]/route.ts   #   템플릿 수정/삭제
│   │   ├── ai-usage/route.ts            #   사용량 통계
│   │   ├── ai-feature-personas/route.ts #   기능별 페르소나
│   │   ├── ai-feature-qna/route.ts      #   기능별 Q&A
│   │   ├── ai-feature-qna/[id]/route.ts #   Q&A 수정/삭제
│   │   ├── ai-feature-presets/route.ts  #   프리셋 적용
│   │   └── ai-playground/route.ts       #   테스트 플레이그라운드
│   └── oneclick/
│       └── ai-chat/route.ts             # 사이트 에디터 AI 어시스턴트
│
├── components/
│   ├── ai/                              # 사용자 AI UI (8 files)
│   │   ├── ai-chat-panel.tsx            #   플로팅 채팅 윈도우
│   │   ├── env-doctor-panel.tsx         #   환경변수 진단 시트
│   │   ├── map-narrator-panel.tsx       #   서비스맵 분석 패널
│   │   ├── quick-action-buttons.tsx     #   Q&A 빠른 액션 버튼
│   │   ├── recommendation-cards.tsx     #   서비스 추천 카드
│   │   ├── service-comparison-sheet.tsx #   서비스 비교 시트
│   │   ├── stack-architect-dialog.tsx   #   스택 추천 다이얼로그
│   │   └── stack-result-view.tsx        #   스택 결과 뷰
│   └── admin/                           # Admin AI UI (5 files)
│       ├── ai-feature-mapping-tab.tsx   #   기능별 설정 탭
│       ├── ai-guardrails-tab.tsx        #   가드레일 탭
│       ├── ai-personas-tab.tsx          #   페르소나 탭
│       ├── ai-playground-tab.tsx        #   플레이그라운드 탭
│       └── ai-usage-tab.tsx             #   사용량 탭
│
├── lib/
│   ├── ai/                              # Core AI 라이브러리 (4 files)
│   │   ├── openai.ts                    #   OpenAI API 호출 (3 modes)
│   │   ├── providers.ts                 #   멀티 프로바이더 디스패치
│   │   ├── guardrails.ts               #   입력 가드레일 검증
│   │   └── resolve-key.ts              #   API 키 해석
│   ├── hooks/                           # AI React 훅 (2 files)
│   │   ├── use-ai-chat.ts              #   채팅 SSE + 추천 파싱
│   │   └── use-streaming.ts            #   범용 SSE 스트리밍
│   ├── queries/
│   │   └── ai-config.ts                #   TanStack Query 훅 (24개)
│   └── validations/                     # Zod 스키마 (6 files)
│       ├── ai-chat.ts
│       ├── ai-command.ts
│       ├── ai-compare.ts
│       ├── ai-config.ts
│       ├── ai-env.ts
│       └── ai-stack.ts
│
├── stores/
│   └── ai-chat-store.ts                # 플로팅 채팅 윈도우 상태
│
├── types/
│   └── ai.ts                            # AI 타입 정의 (16 exports)
│
└── data/seed/
    └── ai-feature-defaults.ts           # 기능 정의 + Q&A + 프리셋 시드
```

---

## 9. 기능별 수정 가이드

### 새 AI 기능 추가 시

1. `src/types/ai.ts` — `AiFeatureSlug` 유니온에 슬러그 추가
2. `src/data/seed/ai-feature-defaults.ts` — `FEATURE_DEFINITIONS`에 항목 추가, `DEFAULT_QNA` 추가
3. `src/lib/validations/ai-*.ts` — 입력 Zod 스키마 생성
4. `src/app/api/ai/[name]/route.ts` — API 라우트 생성 (5단계 패턴 준수)
5. `src/components/ai/[name].tsx` — UI 컴포넌트 생성
6. (선택) `src/lib/queries/ai-config.ts` — Query 훅 추가

### AI 프로바이더 추가 시

1. `src/types/ai.ts` — `AiProviderSlug` 유니온에 추가
2. `src/lib/ai/providers.ts` — `callAiProvider` switch에 새 프로바이더 핸들러 추가
3. `src/lib/ai/resolve-key.ts` — 환경변수명 매핑 추가
4. `src/app/api/admin/ai-providers/route.ts` — 필요시 초기화 로직 추가

### 가드레일 규칙 변경 시

1. `src/types/ai.ts` — `AiGuardrails` 타입 수정
2. `src/lib/ai/guardrails.ts` — `checkGuardrails` 로직 수정
3. `src/lib/validations/ai-config.ts` — `updateGuardrailsSchema` 수정
4. `src/components/admin/ai-guardrails-tab.tsx` — Admin UI 반영

### 채팅 기능 수정 시

- 스트리밍 로직: `src/lib/ai/openai.ts` → `callOpenAIStream`
- 클라이언트 파싱: `src/lib/hooks/use-ai-chat.ts` (추천 JSON 블록 파싱 포함)
- UI: `src/components/ai/ai-chat-panel.tsx`
- 위치/상태: `src/stores/ai-chat-store.ts`

---

## 10. 호출 패턴 요약

| 패턴 | 함수 | 용도 | 응답 형태 |
|------|------|------|-----------|
| **Structured Output** | `callOpenAIStructured<T>()` | JSON 스키마 강제 응답 | `{ data: T, usage }` |
| **Function Calling** | `callOpenAIWithTools()` | 다중 턴 도구 실행 | `{ content, usage }` |
| **SSE Streaming** | `callOpenAIStream()` | 실시간 텍스트 스트림 | `ReadableStream` (data: {chunk}) |
| **Multi-Provider** | `callAiProvider()` | OpenAI/Anthropic/Google 디스패치 | `{ content, usage }` |
