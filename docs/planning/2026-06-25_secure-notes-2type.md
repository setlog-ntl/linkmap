# 보안 항목 2-Type 시스템 고도화 기획 (환경변수 + 보안 메모)

- **작성일**: 2026-06-25
- **상태**: 구현 진행 중 (Phase 1)
- **관련**: `서비스 목록 → 수동 등록`(직전 작업), `/project/[id]/env`, `/project/[id]/credentials`

---

## 1. 배경 & 문제 정의

현재 프로젝트의 민감값 저장은 **환경변수(`environment_variables`)** 중심이다. 환경변수는 본질적으로
`KEY=VALUE` 형식의 **설정 변수**이며 다음 제약이 있다.

- 키 이름이 `^[A-Z0-9_]+$` 형식으로 강제됨 (`normalizeEnvKey`)
- "키 1개 = 값 1줄" 구조 → **여러 줄/목록형 텍스트**(백업 코드 묶음, 복구 문구)와 맞지 않음
- 비개발자(바이브코더)에게 "환경변수"라는 개념 자체가 진입장벽

그 결과 **백업 코드, 비밀번호 메모, 복구 시드 문구, 라이선스 키, PIN** 같은
"그냥 텍스트로 안전하게 적어두고 싶은 값"을 저장할 적절한 자리가 없다.
(기존 `service_credentials`는 `아이디(필수) + 비밀번호(선택)` 로그인 계정 전용 구조라 부적합)

> 핵심 가치(`project-core-concept`): **"코딩 경험 0인 바이브코더"** 가 1순위 타겟.
> → 민감값 저장도 개발자 문법(환경변수) 없이 가능해야 한다.

---

## 2. 목표

사용자가 저장하려는 값의 성격에 따라 **2가지 타입으로 명확히 구분**해 관리한다.

| 타입 | 형식 | 대상 값 | 저장소 |
|------|------|---------|--------|
| **환경변수** (기존) | `KEY=VALUE` 구조 | API 키, URL, 토큰 등 코드/배포에 쓰는 설정값 | `environment_variables` |
| **보안 메모** (신규) | 제목 + 자유 텍스트 본문 | 백업 코드, 비밀번호 메모, 복구 문구, 라이선스 키, PIN | `secure_notes` |

원칙:
- 두 타입 모두 **AES-256-GCM 암호화 저장** (기존 `src/lib/crypto` 재사용)
- 두 타입 모두 서비스에 **선택적으로 연결** 가능 (`service_id`)
- 진입점(서비스 목록 → 수동 등록)에서 **탭으로 한 번에 선택**
- 관리 화면은 **분리**: 환경변수는 `/env`, 보안 메모는 `/secure-notes`

비목표(Phase 1 제외): 보안 메모 일괄 가져오기/내보내기, 휴지통(soft delete) 복원 UI, 공유.

---

## 3. 데이터 모델 — `secure_notes` (신규 테이블)

```
secure_notes
  id                UUID PK
  project_id        UUID FK → projects(id) ON DELETE CASCADE   NOT NULL
  service_id        UUID FK → services(id) ON DELETE SET NULL  NULL (선택 연결)
  title             TEXT NOT NULL                              -- 예: "GitHub 2FA 백업코드"
  category          TEXT NOT NULL DEFAULT 'other'
                    CHECK IN (backup_code, password, recovery_phrase,
                              license_key, connection_string, pin, api_note, other)
  encrypted_content TEXT NOT NULL                              -- 본문(자유 텍스트) 암호화
  environment       TEXT NOT NULL DEFAULT 'all'
                    CHECK IN (development, staging, production, all)
  notes             TEXT NULL                                  -- 비민감 메모(설명)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
```

- 인덱스: `idx_secure_notes_project(project_id)`, `idx_secure_notes_project_service(project_id, service_id)`
- RLS: `service_credentials`와 동일 패턴
  - `secure_notes_owner_all` (FOR ALL): `project_id ∈ (내 프로젝트)`
  - `secure_notes_team_read` (FOR SELECT): 팀 멤버 읽기
- 마이그레이션: `supabase/migrations/103_secure_notes.sql`

> **암호화 대상은 `encrypted_content` 1개 컬럼.** `title`/`notes`는 검색·표시를 위해 평문(비민감 가정).
> 민감 본문은 전부 `encrypted_content`에 넣도록 UI에서 유도.

---

## 4. 보안 설계

- **암호화**: `encrypt()/decrypt()` (`src/lib/crypto`) — env/credential과 동일 AES-256-GCM.
- **복호화 게이트**: `/api/secure-notes/decrypt` 는 `requireMfa()` 적용
  (MFA 미등록자는 통과 — 비개발자 차단 없음 / MFA 등록자는 aal2 필요).
- **감사 로그**: 생성·수정·삭제·복호화 시 `logAudit()` 필수.
  - action: `secure_note.create | update | delete | decrypt`
  - resourceType: `secure_note`
- **응답 규칙**: 복호화된 본문은 decrypt 엔드포인트 응답에만 포함, 로깅 금지.
- **5단계 라우트 패턴 준수**: `getUser()` → Zod `safeParse` → 소유권 확인 → 비즈니스 로직 → `logAudit()`.
- **에러 헬퍼**: `src/lib/api/errors.ts` 재사용.

---

## 5. UI/UX

### 5.1 진입점 — "수동 등록" 2-탭 다이얼로그
서비스 목록(`services-content.tsx`)의 각 서비스 **수동 등록** 버튼 →
`ManualRegisterDialog`(탭):

```
┌ {서비스명} 수동 등록 ─────────────┐
│ [ 환경변수 ]  [ 보안 메모 ]        │  ← Tabs
│                                    │
│ (환경변수 탭) KEY/VALUE 행 + 붙여넣기  (기존 ManualEnvDialog 로직)
│ (보안 메모 탭) 제목 · 분류 · 본문 · 환경 · 메모
└────────────────────────────────────┘
```

- 환경변수 탭: 직전 작업의 행 기반 입력 + `.env 붙여넣기` 그대로.
- 보안 메모 탭: 제목(필수) · 분류(Select) · 본문 Textarea(필수, 자유 텍스트) · 환경 · 설명(선택).
- 저장 시 `service_id`를 현재 서비스로 연결.

### 5.2 관리 화면 — `/project/[id]/secure-notes`
- 목록: 제목 · 분류 배지 · 연결 서비스 · 환경 · 수정일.
- 본문은 기본 마스킹(`••••`), **눈 아이콘**으로 복호화 표시/숨김 + 복사.
- 추가/수정/삭제(확인 다이얼로그). 검색·분류 필터.
- 프로젝트 탭(`project-tabs.tsx`)에 **보안 메모** 탭 추가 (i18n 동결 → `fallbackLabel` 사용).

---

## 6. 구현 단계 (Phase 1)

1. **DB**: `103_secure_notes.sql` (테이블·인덱스·RLS·COMMENT)
2. **타입**: `src/types/secure-note.ts`, barrel, `src/lib/supabase/types.ts`
3. **검증**: `src/lib/validations/secure-note.ts` (create/update zod)
4. **API**: `src/app/api/secure-notes/route.ts`, `.../decrypt/route.ts`
5. **쿼리**: `src/lib/queries/secure-notes.ts`, `keys.ts`, `stale-time.ts`
6. **UI**: `secure-note-form.tsx`, `manual-register-dialog.tsx`(탭),
   `/project/[id]/secure-notes/page.tsx`, `project-tabs.tsx` 탭 추가,
   `services-content.tsx` 진입점 교체
7. **문서**: `docs/db-schema.md` 갱신, 본 문서, `docs/log/2026-06.md`
8. **검증**: `npm run typecheck` + `lint`

마이그레이션 3-step 준수: ① 타입 동기화 → ② 쿼리 반영 → ③ `db-schema.md` 갱신.

---

## 7. 검증 & 적용

- 코드: `typecheck`, `lint` 무경고.
- DB: `103_secure_notes.sql` 를 Supabase에 적용해야 기능 동작.
  - Supabase MCP 연결 후 `apply_migration`, 또는 Studio SQL Editor 직접 실행.
- 적용 전에도 빌드/타입은 통과(테이블 미존재 시 런타임에서 목록 비어있음).

---

## 8. 향후 확장 (Phase 2+)

- 보안 메모 휴지통(soft delete `deleted_at`) + 복원 UI
- 일괄 가져오기/내보내기(.txt/.json), 만료일·회전 알림
- 환경변수 ↔ 보안 메모 상호 변환(예: 메모를 KEY=VALUE로 승격)
- 대시보드 위젯(보안 메모 개수/분류 분포)
