# AI + MCP 연동 고도화 계획

> **상태**: 미래 계획 (구현 전)
> **우선순위**: P2 (핵심 기능 안정화 이후)
> **작성일**: 2026-03-01

---

## 개요

Linkmap이 **AI 에이전트의 서비스 자격증명 허브**로 진화하는 방향.
현재 `packages/mcp-server/`에 기초 구조가 존재하며, 이를 확장해 AI가 Linkmap에 등록된 서비스들을 안전하게 사용할 수 있도록 한다.

### 목표 아키텍처

```
사용자 / AI 에이전트 (Claude, GPT 등)
        │
        │  MCP 프로토콜 (도구 호출)
        ▼
[Linkmap MCP 서버] ← 서버사이드 전용, 키 복호화 여기서만
        │
        ├─ "AWS에 배포해줘"     → AWS API 직접 호출 후 결과만 반환
        ├─ "GitHub PR 열어줘"   → GitHub API 직접 호출 후 결과만 반환
        ├─ "Stripe 잔액 확인"   → Stripe API 직접 호출 후 결과만 반환
        └─ ...

        ⚠️ AI에게 키 값 자체는 절대 전달하지 않음
```

---

## 핵심 설계 원칙

### 1. 키 비노출 원칙 (Non-exposure)

```
❌ 잘못된 방식: AI → "AWS 키 알려줘" → 키 값 반환 → AI가 직접 호출
✅ 올바른 방식: AI → "S3에 업로드해줘" → Linkmap이 키로 실행 → 결과만 반환
```

- AI는 키의 **존재**만 알고, **값**은 알 수 없다
- 복호화는 서버 컴포넌트에서만 수행 (현재 AES-256-GCM 구조 유지)
- MCP 도구의 응답에 키 값, 토큰, 시크릿 포함 금지

### 2. 최소 권한 (Least Privilege)

```typescript
// 각 MCP 도구에 허용 작업 화이트리스트 정의
const MCP_TOOL_PERMISSIONS = {
  "aws-s3-upload":   ["s3:PutObject"],           // 업로드만
  "aws-s3-list":     ["s3:ListBucket"],           // 목록 조회만
  "github-pr-create": ["pull_requests:write"],    // PR 생성만
  // "aws-iam-delete": 허용 안 함 — 고위험 작업
};
```

### 3. Human-in-the-loop

고위험 작업(삭제, 결제, 배포)은 AI가 단독 실행 불가 → 사용자 승인 후 실행

```
AI 요청 → [위험도 판단] → 고위험이면 → 사용자에게 승인 요청 → 실행
                        → 일반이면  → 즉시 실행
```

---

## 단계별 구현 계획

### Phase 1 — MCP 서버 인증 강화 (기반 작업)

현재 `packages/mcp-server/`는 `LINKMAP_API_TOKEN` 정적 토큰 방식.
Supabase Auth 세션과 연동하도록 교체 필요.

- [ ] MCP 세션 ↔ Supabase JWT 연동
- [ ] 사용자별 MCP 접근 토큰 발급 (설정 > 연동 페이지)
- [ ] 토큰 스코프 정의 (`read-only`, `execute`, `admin`)
- [ ] 토큰 만료·폐기 UI

### Phase 2 — 서비스 프록시 도구 구현

AI가 호출할 수 있는 MCP 도구 목록 (키는 서버에서만 사용):

| 도구 이름 | 대상 서비스 | 허용 작업 |
|-----------|------------|-----------|
| `aws_s3_upload` | AWS S3 | 파일 업로드 |
| `aws_s3_list` | AWS S3 | 버킷 목록 조회 |
| `github_pr_create` | GitHub | PR 생성 |
| `github_repo_list` | GitHub | 저장소 목록 |
| `stripe_payment_intent` | Stripe | 결제 의도 생성 |
| `vercel_deploy` | Vercel | 배포 트리거 |
| `supabase_query` | Supabase | 읽기 전용 쿼리 |

### Phase 3 — 감사 로그 통합

현재 `logAudit()` 함수를 MCP 레이어에도 적용.

```typescript
// 모든 MCP 도구 실행 시 자동 감사 로그
await logAudit({
  userId,
  action: `mcp.${toolName}`,
  resourceType: 'mcp_tool',
  resourceId: sessionId,
  metadata: { toolInput: sanitized, result: 'success' },
  // ⚠️ 키 값, 토큰은 metadata에 절대 포함 금지
});
```

### Phase 4 — 서비스 맵 자동 시각화

AI가 MCP를 통해 사용한 서비스들을 자동으로 서비스 맵에 반영.

- MCP 도구 실행 → 사용된 서비스 노드 자동 생성/업데이트
- 서비스 간 데이터 흐름 엣지 자동 추가
- AI 에이전트 작업 히스토리 타임라인 뷰

### Phase 5 — 에이전트 오케스트레이션

여러 서비스를 순서대로 연결하는 파이프라인 정의.

```yaml
# 예시: 코드 푸시 → 빌드 → 배포 → 알림 파이프라인
pipeline: deploy-on-push
steps:
  - tool: github_pr_merged
    trigger: true
  - tool: vercel_deploy
    input: { branch: main }
  - tool: slack_notify
    input: { message: "배포 완료: {{vercel_deploy.url}}" }
```

---

## 위험 요소 및 대응

### 보안

| 위험 | 심각도 | 대응 |
|------|--------|------|
| 프롬프트 인젝션으로 키 탈취 시도 | 높음 | 키 값 비노출 원칙 + 입력 sanitization |
| AI 모델(3rd party)에 키 노출 | 높음 | 프록시 방식 — AI는 결과만 수신 |
| MCP 세션 탈취 | 중간 | 단기 토큰 + IP 바인딩 옵션 |
| 권한 범위 초과 호출 | 중간 | 화이트리스트 + 도구별 권한 검사 |
| 감사 로그에 시크릿 누출 | 낮음 | 로그 작성 전 키 패턴 자동 마스킹 |

### 아키텍처

- **단일 장애점 방지**: Linkmap MCP 서버 다운 시 AI 에이전트 폴백 전략 필요
- **Workers 번들 크기**: 프록시 SDK들 추가 시 3MB 한도 재검토 필요
- **Cloudflare Workers 제약**: 일부 서비스 SDK는 Node.js 전용 → fetch 기반 직접 구현 필요

### 법적/컴플라이언스

- **서비스 약관**: Stripe, GitHub 등 자격증명 위임 허용 여부 약관 사전 확인 필요
- **GDPR**: AI 처리 과정에서 개인정보 포함 키 메타데이터 처리 기준 수립
- **SOC2**: AI 에이전트를 통한 자격증명 접근 감사 추적 요건 강화

---

## 현재 코드베이스와의 연결점

### 재사용 가능한 기존 자산

```
packages/mcp-server/src/index.ts  — 기초 MCP 서버 구조 (확장 대상)
src/lib/crypto/                    — AES-256-GCM 복호화 (MCP에서도 동일 사용)
src/lib/audit.ts                   — logAudit() (MCP 레이어에 적용)
src/app/api/tokens/                — API 토큰 발급 구조 (MCP 토큰으로 확장)
src/types/                         — 서비스 타입 정의 재사용
```

### 추가 구현 필요

```
packages/mcp-server/src/tools/     — 서비스별 프록시 도구 모음
packages/mcp-server/src/auth.ts    — Supabase JWT 연동
packages/mcp-server/src/audit.ts   — MCP 전용 감사 로그 래퍼
src/app/api/mcp/                   — MCP 세션 토큰 발급 API
src/app/(dashboard)/settings/mcp/  — MCP 연동 설정 UI
```

---

## 관련 문서

- `docs/service-map-v2.md` — 서비스 맵 시각화 (Phase 4 연동 대상)
- `docs/ai-module-map.md` — AI 모듈 현황
- `ARCHITECTURE.md` — 전체 아키텍처
- `SECURITY.md` — 보안 정책 (MCP 추가 시 업데이트 필요)
- `packages/mcp-server/src/index.ts` — 현재 MCP 서버 구현체
