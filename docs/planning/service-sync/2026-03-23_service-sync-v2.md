# Service-Sync 통합 기획서 v2

**작성일**: 2026-03-23
**상태**: 조건부추진 (3.3/5.0)
**선행 문서**: `2026-03-22_env-relay-api.md` (Pull 기각 + Push 설계), `2026-03-23_push-sync-feasibility.md` (6축 분석)
**벤치마킹**: `docs/benchmark/env-secrets-landscape/report.md` (10개 서비스 상세 분석)

---

## 1. 기획 경과

| 일자 | 검토 | 결과 | 점수 |
|------|------|------|------|
| 2026-03-22 | Pull(중계) API 방식 | **기각** — 보안 SPOF, 타겟 불일치, 경쟁 우위 부재 | 2.0/5.0 |
| 2026-03-22 | Push(자동 동기화) 방식 | **추진 결정** — 기존 GitHub 패턴 재활용, 보안 우수 | - |
| 2026-03-23 | Push 6축 심층 분석 | **조건부추진** — Phase 0(수동 Push)부터 시작 | 3.3/5.0 |
| 2026-03-23 | 10개 서비스 벤치마킹 | 시장 현황 + 트렌드 + 차용 아이디어 도출 | - |

**최종 방향**: Push 방식 채택, Phase 0(수동 Push 버튼) → Phase 1(자동 Push) 단계적 접근
**시각화 자료**: `2026-03-23_service-sync-v2.html` (SVG 다이어그램, 단계별 플로우, 인터랙티브 탭 포함)

---

## 0. 한눈에 이해하기 — 이 기능이 뭔가요?

### 쉬운 비유: 택배 서비스

> 여러분이 **여러 온라인 쇼핑몰**(Vercel, Railway, Netlify)에서 물건을 팔고 있다고 상상해보세요.
> 각 쇼핑몰마다 **배송 정보**(API 키, 환경변수)를 따로 입력해야 합니다.
> 배송 주소가 바뀌면? **모든 쇼핑몰에 하나하나 들어가서 변경**해야 합니다.
>
> **Linkmap Service-Sync**는 이걸 해결합니다:
> Linkmap에서 **한 번만 수정**하면, 연결된 모든 플랫폼에 **자동으로 전달**됩니다.

### 핵심 개념 도식

```
                          ┌─────────────────────┐
                          │       Linkmap        │
  👤 사용자 ──[수정]──→   │  환경변수 중앙 관리   │
                          │  API 키 암호화 저장   │
                          └────────┬────────────┘
                                   │
                          ┌────────┼────────┐
                     Push │   Push │   Push │
                          ▼        ▼        ▼
                    ┌──────┐ ┌──────┐ ┌──────┐
                    │Vercel│ │Railway│ │Netlify│
                    └──────┘ └──────┘ └──────┘
                      자동으로 환경변수 반영!
```

### Pull vs Push 비교 (왜 Push인가?)

```
  ❌ Pull 방식 (기각 2.0/5.0)           ✅ Push 방식 (채택 3.3/5.0)

  외부 앱 ──[매번 요청]──→ Linkmap      Linkmap ──[Push!]──→ Vercel
           ←[API 키 반환]──            ──[Push!]──→ Railway
                                        ──[Push!]──→ Netlify
  문제점:                               장점:
  • Linkmap 장애 → 앱 부팅 불가         • Linkmap 장애 → 영향 없음
  • SDK 설치 필수 (어려움)              • SDK 불필요 (버튼만 클릭)
  • "키의 키" 보안 문제                 • 공식 API 사용 (안전)
  • 3-6개월 소요                        • 3-5일 소요 (Phase 0)
```

> **비유**: Pull = 매번 우체국에 가서 편지를 가져오는 것 / Push = 택배 기사가 집까지 배달해주는 것

---

## 0.1 사용자 경험 — 어떻게 쓰나요? (6단계)

코딩을 전혀 몰라도 따라할 수 있습니다. SDK 설치나 코드 작성이 필요 없습니다.

```
  🔧 ──→ 🎯 ──→ 🔑 ──→ 📂 ──→ 🔄 ──→ ✨
  [1]    [2]    [3]    [4]    [5]    [6]
  설정   플랫폼  토큰   프로젝트 환경    자동
  탭     선택   입력   선택    매핑   동기화 ON!
```

1. **프로젝트 설정** → "동기화" 탭 클릭
2. **플랫폼 선택** → Vercel / Railway / Netlify 카드 클릭
3. **토큰 입력** → 플랫폼 토큰 붙여넣기 (1회만)
4. **프로젝트 선택** → 드롭다운에서 선택
5. **환경 매핑** → Linkmap production → Vercel production
6. **자동 동기화 ON** → 이후 환경변수 변경 시 자동 Push!

---

## 0.2 기술 아키텍처 — 내부에서 어떻게 작동하나요?

### 쉬운 비유: 공장 컨베이어 벨트

> 환경변수가 변경되면 → 컨베이어 벨트(triggerAllSync)가 작동 → 각 플랫폼별 포장 라인(어댑터)에서 해당 플랫폼 형식으로 포장 → 배송(API 호출)

### 전체 아키텍처 도식

```
  ┌──────────────┐      ┌──────────────────┐      ┌─────────────────────────────────────┐
  │ 환경변수 변경 │      │  triggerAllSync() │      │         어댑터 (Adapters)            │
  │              │──→   │                  │──┬→  │  ┌─────────┐    ┌────────────────┐  │
  │ 생성/수정/삭제│      │ • 동기화 대상 조회 │  │   │  │ GitHub  │──→│ GitHub Secrets  │  │
  │              │      │ • 복호화          │  │   │  │ 어댑터   │    │ API (NaCl)      │  │
  │ src/app/api/ │      │   (AES-256-GCM)  │  │   │  └─────────┘    └────────────────┘  │
  │ env/route.ts │      │                  │  │   │  ┌─────────┐    ┌────────────────┐  │
  └──────────────┘      │  ┌────────────┐  │  ├→  │  │ Vercel  │──→│ Vercel Env API  │  │
                        │  │ DB 조회    │  │  │   │  │ 어댑터   │    │ (upsert=true)   │  │
                        │  │ project_   │  │  │   │  └─────────┘    └────────────────┘  │
                        │  │ sync_      │  │  │   │  ┌─────────┐    ┌────────────────┐  │
                        │  │ targets    │  │  ├→  │  │ Railway │──→│ Railway GraphQL │  │
                        │  └────────────┘  │  │   │  │ 어댑터   │    │ (variableUpsert)│  │
                        └──────────────────┘  │   │  └─────────┘    └────────────────┘  │
                                              │   │  ┌─────────┐    ┌────────────────┐  │
                                              └→  │  │ Netlify │──→│ Netlify REST    │  │
                                                  │  │ 어댑터   │    │ API             │  │
                                                  │  └─────────┘    └────────────────┘  │
                                                  └─────────────────────────────────────┘
                                                                      │
                                                                      ▼
                                                              ┌──────────────┐
                                                              │ 📝 상태 기록  │
                                                              │ + 감사 로그   │
                                                              │ logAudit()   │
                                                              └──────────────┘
```

### 보안 처리 흐름

```
  🔒 암호화 저장        🔐 HTTPS 전송         🏢 플랫폼 자체 관리    📋 감사 로그
  ┌──────────┐         ┌──────────┐         ┌──────────┐          ┌──────────┐
  │AES-256-  │  복호화  │ 공식 API │  Push   │각 플랫폼의│          │누가/언제/ │
  │GCM 암호화│──────→  │ 사용     │──────→  │자체 보안  │          │어디로     │
  │Supabase  │         │ 최소 권한│         │정책 적용  │          │동기화?    │
  │DB 저장   │         │ 토큰     │         │          │          │          │
  └──────────┘         └──────────┘         └──────────┘          └──────────┘
  값은 절대 로그에        Doppler/Infisical    Linkmap 장애 시에도     모든 활동
  기록하지 않음           과 동일 방식          앱 정상 작동!          추적 가능
```

---

## 2. 시장 현황

### 2.1 시장 규모
- 2025년 42.2억 USD → 2030년 80.5억 USD (CAGR 13.8%)
- SME 세그먼트 CAGR 16% — Linkmap 타겟과 일치
- 머신 ID : 인간 ID = 45:1 — 시크릿 관리 수요 폭증

### 2.2 핵심 트렌드 (2025-2026)

**1. AI 시크릿 위기**
- 2025년 공개 GitHub에 **2,865만 개** 하드코딩 시크릿 발견 (전년 대비 34% 증가)
- AI 서비스 시크릿 노출 **81% 급증** (AI API 키 127만 건)
- AI 생성 코드의 24.7%에 보안 결함 존재
- **Linkmap 시사점**: 바이브코더가 AI로 코드 생성 시 API 키 하드코딩 위험 높음 → "안전한 API 키 관리" 가이드가 고유 가치

**2. OIDC/Workload Identity Federation**
- GitHub Actions OIDC → GCP/AWS/Azure 배포 시 시크릿 불필요
- 크레덴셜 로테이션 오버헤드 95% 감소 주장
- **판단**: CI/CD 인증에 주로 적용. 애플리케이션 API 키(OpenAI, Stripe)는 5년 내 정적 키 유지 예상

**3. MCP + 시크릿 관리**
- Doppler MCP Server 출시 (2026-02) — AI 에이전트가 시크릿 매니저와 직접 상호작용
- OWASP MCP Top 10: "Token Mismanagement" 1위
- MCP 서버의 88%가 크레덴셜 필요, 53%가 정적 시크릿에 의존
- **Linkmap 시사점**: 기존 MCP Server(`packages/mcp-server/`)에 환경변수 컨텍스트 추가 가능

**4. HCP Vault Secrets EOL**
- 2025-06-30 신규 판매 종료, 2026-07-01 EOL
- 소규모 팀 대상 간편 시크릿 관리 시장에 공백 발생
- Doppler/Infisical이 공백 차지 중이나 가격 높음

**5. Config as Service 우세**
- .env 파일 → 중앙 집중형 SaaS로 이동 중
- Gartner: 2026년까지 시크릿 관리 벤더 50%가 크로스 벤더 대시보드 제공 예측

### 2.3 경쟁사 핵심 비교

| 서비스 | Push 동기화 | 통합 수 | 가격 (Free) | 바이브코더 친화성 | 특징 |
|--------|-----------|---------|------------|-----------------|------|
| **Doppler** | 70+ 서비스 | 70+ | 3명 | 중간 | MCP Server, OIDC, 자동 로테이션 |
| **Infisical** | Secret Sync | 50+ | 5 identity | 낮음 | E2EE, 오픈소스, 동적 시크릿 |
| **Vault** | 제한적 | N/A | 오픈소스 | 매우 낮음 | HCP Secrets EOL |
| **1Password** | 없음 | CLI/SDK | $7.99/user | 중간 | `op run` 주입 |
| **Vercel** | 외부→Vercel | 자체 | 포함 | 높음 | 환경별 분리 |
| **Railway** | 내부만 | 자체 | $5/월 Trial | 높음 | Shared/Reference Variables |
| **Netlify** | 외부→Netlify | 자체 | 포함 | 중간 | 4단계 스코프 |
| **Render** | 없음 | 자체 | 포함 | 높음 | Environment Groups |
| **AWS SM** | AWS 내부 | AWS | $0.40/시크릿 | 매우 낮음 | Lambda 로테이션 |
| **GCP SM** | GCP 내부 | GCP | 6버전 무료 | 매우 낮음 | WIF 지원 |

### 2.4 Linkmap 포지셔닝

```
                전문 시크릿 관리 ←————————→ 범용 플랫폼
                     |
       Vault         |         Doppler
       Infisical     |
                     |
엔터프라이즈 ←————————+————————→ 개인/소규모
                     |
       AWS SM        |         Vercel Env
       GCP SM        |         Railway / Render
                     |
                     |    ★ Linkmap ★
                     |    (시각화 + 동기화 허브)
```

**핵심 포지션**: 시크릿 매니저와 경쟁하지 않는다. "시크릿이 어디에 연결되어 있는지 시각화하고, 적절한 곳으로 Push하는 허브" 역할.

---

## 3. 6축 심층 분석

### 3-1. 기술적 실현 가능성 [4/5]

- Vercel REST API `upsert=true`, Railway `variableUpsert`, Netlify REST — 모두 idempotent
- Cloudflare Workers 10ms CPU 제한: I/O 대기 제외이므로 문제 없음 (기존 GitHub auto-sync 동일 패턴)
- 기존 코드 **70-75% 재활용** 가능 (`src/lib/github/auto-sync.ts` 179줄 어댑터 추상화)
- 에러 핸들링: 롤백 불필요 (idempotent upsert). 재시도 1회 + 부분 실패 기록

### 3-2. 보안적 제약 [3/5]

- 증분 리스크 제한적: 이미 GitHub 토큰을 AES-256-GCM으로 `service_accounts`에 저장 중
- 모든 플랫폼(Vercel/Railway/Netlify) 약관에서 제3자 토큰 관리 허용 (Doppler/Infisical 동일 패턴)
- 단일 ENCRYPTION_KEY 문제는 기존 리스크 (이 기능이 도입하는 새 리스크 아님)
- 토큰 스코프: PAT 직접 입력 시 환경변수 CRUD 권한만 요청

### 3-3. 시장 트렌드 [3/5]

- 정적 API 키 기반 서비스(OpenAI, Stripe)는 5년 내 유지 예상
- 다중 플랫폼 배포 증가 추세 → 동기화 니즈 존속
- 리스크: 플랫폼들이 자체 "multi-platform sync" 출시 시 가치 감소
- MCP는 보완적 기회 (위협 아님)

### 3-4. 핵심가치 정렬 [3/5]

- **2층(성장) 리텐션 기능** — 1층 진입과는 무관
- 바이브코더 60%에겐 낮은 우선순위 (단일 플랫폼 사용)
- 2번째 프로젝트 이후 가치 발생 (환경변수 반복 변경 시)
- 전환 비용 증가 효과 (Lock-in)

### 3-5. 경쟁 우위 [3/5]

- **서비스맵 시각화 + 동기화 결합** = Doppler/Infisical에 없는 유일한 차별점
- 통합 수(4 vs 70+)에서는 열세
- Linkmap Push 동기화 = "Doppler 필요 없는 수준의 간단한 동기화"

### 3-6. MVP 접근 전략 [4/5]

- **Phase 0 (수동 Push 버튼) 3-5일**로 가치 검증 가능
- 자동 동기화보다 구현 단순 (이벤트 트리거 불필요)
- 사용자 반응 확인 후 자동화로 업그레이드
- 리스크 최소화된 단계적 접근

### 종합 판정

```
기술적 실현 가능성:  ★★★★☆ (4/5)
보안적 제약:        ★★★☆☆ (3/5)
시장 트렌드:        ★★★☆☆ (3/5)
핵심가치 정렬:      ★★★☆☆ (3/5)
경쟁 우위:          ★★★☆☆ (3/5)
MVP 접근 전략:      ★★★★☆ (4/5)

종합: 3.3/5.0 → 조건부추진
```

---

## 4. 전략적 방향

### 4.1 시크릿 매니저와 경쟁하지 않는다

Doppler(70+ 통합), Infisical(E2EE + 오픈소스)과 직접 경쟁은 무의미. 대신:

- **Linkmap = 서비스 연결 시각화 + 환경변수 동기화 허브**
- Doppler 사용자도 Linkmap을 쓸 이유: 서비스맵 시각화, 원클릭 배포
- Linkmap 사용자가 Doppler를 쓸 이유: 고급 시크릿 관리 (로테이션, SOC 2)

### 4.2 바이브코더의 시크릿 위기가 기회

AI 코드 생성으로 시크릿 유출 급증 → "바이브코더도 안전하게 API 키 관리하는 방법"을 가르치는 것이 고유 가치. 기존 "배우면서 만들고, 만들면서 관리된다" 핵심 콘셉트와 일치.

### 4.3 서비스맵 시각화 + 동기화 결합

1. 서비스맵에서 "Vercel 노드" 클릭 → 동기화 상태 확인 → 재동기화
2. 환경변수 변경 시 "어느 플랫폼에 반영되었는지" 시각적 피드백
3. "이 API 키가 어디에 배포되어 있는지" 한눈에 파악

---

## 5. MVP 로드맵

### Phase 0: 수동 Push 버튼 (3-5일) — 가치 검증

| 작업 | 공수 |
|------|------|
| Vercel 어댑터 기본 구현 | 1-2일 |
| "Vercel에 동기화" 버튼 UI | 1일 |
| PAT 토큰 입력 + 프로젝트 선택 | 1일 |
| 테스트 + 에러 핸들링 | 0.5-1일 |

- 사용자가 명시적으로 "동기화" 버튼 클릭 → Push
- 자동 동기화 없음 (이벤트 트리거 불필요)
- **목적**: 사용자 반응 데이터 수집

### Phase 1: Vercel 자동 Push (2주)

| 작업 | 공수 |
|------|------|
| `src/lib/sync/` 어댑터 인프라 | 2-3일 |
| Vercel 어댑터 완성 | 1-2일 |
| `project_sync_targets` 마이그레이션 | 0.5일 |
| 동기화 설정 UI | 2-3일 |
| env CUD 트리거 통합 | 0.5일 |
| 테스트 + 에러 핸들링 | 1-2일 |

### Phase 2: Netlify + Railway (1주)

| 작업 | 공수 |
|------|------|
| Netlify REST 어댑터 | 1-2일 |
| Railway GraphQL 어댑터 | 2-3일 |
| UI 확장 | 1일 |
| 테스트 | 1일 |

### Phase 3: GitHub 통합 마이그레이션

- 기존 `src/lib/github/auto-sync.ts`를 새 어댑터 구조로 이전
- `secrets-sync-panel.tsx` 통합 UI로 전환

---

## 6. Quick Win (동기화 외 즉시 실행 가능)

| 항목 | 설명 | 예상 공수 |
|------|------|----------|
| 환경별 분리 UI | dev/staging/prod 환경변수 분리 (Vercel/Railway 패턴) | 중 |
| API 키 안전 관리 가이드 | 원클릭 배포 시 "API 키를 코드에 넣지 마세요" 가이드 삽입 | 소 |
| Reference 변수 | `${{VAR_NAME}}` 참조 구문 (Doppler/Railway 패턴) | 중 |
| 시크릿 노후화 알림 | 생성 후 90일 경과 시 갱신 권고 (현재 credentials만 지원) | 소 |
| Empty State 가이드 | 환경변수 없을 때 인터랙티브 시크릿 관리 가이드 | 소 |
| MCP Server 환경변수 컨텍스트 | AI 에이전트가 프로젝트 필요 환경변수 파악 (Doppler MCP 패턴) | 중 |

---

## 7. 추진/보류 조건

### 즉시 추진으로 전환되는 조건
1. P1 백로그(Stripe, 팀 RBAC) 중 1개 이상 완료
2. Phase 0 사용자 테스트에서 양호한 반응 (주 1회 이상 사용)
3. Vercel API 토큰 보안 감사 완료

### 보류로 전환되는 조건
1. Phase 0 출시 후 2주간 사용자 0명
2. Vercel/Railway가 자체 "다중 플랫폼 동기화" 기능 출시
3. 보안 감사에서 단일 ENCRYPTION_KEY 문제의 심각성 재평가

---

## 8. 아키텍처 (확정)

### 어댑터 패턴
```
src/lib/sync/
  ├── types.ts              # SyncAdapter 인터페이스
  ├── trigger.ts            # 범용 triggerAllSync
  ├── adapter-registry.ts   # 어댑터 등록/조회
  ├── name-map.ts           # 플랫폼별 키 이름 매핑
  └── adapters/
      ├── github.ts         # 기존 auto-sync.ts 이동
      ├── vercel.ts         # Vercel REST API (upsert=true)
      ├── railway.ts        # Railway GraphQL (variableUpsert)
      └── netlify.ts        # Netlify REST API
```

### 트리거 흐름
```
환경변수 CUD → triggerAllSync() → project_sync_targets 조회
  ├→ [GitHub]  NaCl 암호화 → GitHub Secrets API
  ├→ [Vercel]  HTTPS TLS → Vercel Env API (upsert=true)
  ├→ [Railway] HTTPS TLS → Railway GraphQL (variableUpsert)
  └→ [Netlify] HTTPS TLS → Netlify Env API
  → last_sync_* 상태 기록 + logAudit()
```

### DB: `project_sync_targets`
```sql
CREATE TABLE project_sync_targets (
  id UUID PK,
  project_id FK -> projects(id),
  user_id FK -> auth.users(id),
  platform TEXT CHECK (IN ('github','vercel','railway','netlify')),
  service_account_id FK -> service_accounts(id),
  external_project_id TEXT NOT NULL,
  external_project_name TEXT,
  auto_sync_enabled BOOLEAN DEFAULT false,
  sync_environment TEXT DEFAULT 'production',
  target_environment TEXT,
  last_synced_at TIMESTAMPTZ,
  last_sync_status TEXT,
  last_sync_error TEXT,
  UNIQUE(project_id, platform, external_project_id, sync_environment)
);
```

---

## 9. 참고 자료

### 플랫폼 API
- [Vercel REST API - Environment Variables](https://docs.vercel.com/docs/rest-api/reference/endpoints/projects/create-one-or-more-environment-variables)
- [Railway - Manage Variables with Public API](https://docs.railway.com/guides/manage-variables)
- [Netlify - Environment Variables Overview](https://docs.netlify.com/build/environment-variables/overview/)

### 경쟁사
- [Doppler 공식](https://www.doppler.com/) | [통합](https://www.doppler.com/integrations) | [MCP Server](https://www.doppler.com/changes)
- [Infisical 공식](https://infisical.com/) | [GitHub](https://github.com/Infisical/infisical) | [가격](https://infisical.com/pricing)
- [HCP Vault Secrets EOL 공지](https://developer.hashicorp.com/hcp/docs/vault-secrets/end-of-sale-announcement)
- [1Password Developer](https://developer.1password.com/)

### 시장 / 보안 트렌드
- [GitGuardian 시크릿 스프롤 2026 보고서](https://blog.gitguardian.com/the-state-of-secrets-sprawl-2026/)
- [OWASP MCP Top 10 - Token Mismanagement](https://owasp.org/www-project-mcp-top-10/2025/MCP01-2025-Token-Mismanagement-and-Secret-Exposure)
- [시크릿 관리 시장 리포트](https://www.mordorintelligence.com/industry-reports/secrets-management-solutions-market)
- [Astrix MCP 보안 보고서 2025](https://astrix.security/learn/blog/state-of-mcp-server-security-2025/)

### 프로젝트 내부
- `src/lib/github/auto-sync.ts` — 기존 GitHub Push 동기화 (179줄)
- `src/lib/crypto/index.ts` — AES-256-GCM 암호화/복호화
- `docs/planning/service-sync/2026-03-22_env-relay-api.md` — Pull 기각 + Push 설계
- `docs/benchmark/env-secrets-landscape/report.md` — 10개 서비스 벤치마킹
