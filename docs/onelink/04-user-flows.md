# OneLink 사용자 플로우 & 상태 머신

> **최종 수정일**: 2026-02-22 (IA Redesign + 모달 UX 반영)

## 1. 마법사 (Wizard) 플로우

### 1.1 메인 시나리오: 로그인 + GitHub 연결된 사용자

> **경로**: `/sites` (tab=new) — IA Redesign으로 `/oneclick`에서 통합됨

```
[/sites?tab=new 진입]
      │
      ▼
┌─────────────────────┐
│  Step: 템플릿 선택     │
│  - TemplateCard 그리드 │
│  - 사이트명 입력       │
│  - "배포" 버튼 클릭    │
└──────────┬──────────┘
           │ handleDeploy() → isAuthenticated ✓ + isGitHubConnected ✓
           ▼
┌─────────────────────┐
│  executeDeploy()     │
│  POST /deploy        │
│  → deploy_id 수신    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│  DeployProgress (모달)        │  ← 토스트 대신 단계별 모달
│  - 3단계 프로그레스 다이얼로그  │
│    1. 레포 생성 ✓             │
│    2. Pages 활성화 ⏳         │
│    3. 사이트 게시 ⏳          │
│  - 3초 폴링                  │
│  - 팁 회전 표시              │
└──────────┬──────────────────┘
           │ deploy_status === 'ready'
           ▼
┌─────────────────────────────┐
│  DeploySuccess                │
│  - 사이트 URL 표시            │
│  - "사이트 보기" 링크         │
│  - "편집하기" 링크            │
│  - 공유 버튼                  │
└─────────────────────────────┘
```

### 1.2 시나리오: 비로그인 사용자

> **참고**: `/sites` 페이지는 dashboard 레이아웃 내에 있으므로 이미 인증된 상태에서만 접근 가능.
> 비로그인 시 Supabase middleware가 `/login?redirect=/sites`로 리다이렉트.

```
[/sites 접근 시도]
           │
           │ middleware → isAuthenticated ✗
           ▼
┌──────────────────────────────────────────┐
│  /login?redirect=/sites로 리다이렉트       │
└──────────────┬───────────────────────────┘
               │ 로그인 완료
               ▼
┌──────────────────────────────────────────┐
│  /sites로 리다이렉트                       │
│  → GitHub 연결 여부 확인                    │
│  → 미연결이면 GitHubConnectModal           │
│  → 연결이면 정상 위저드 진행                │
└──────────────────────────────────────────┘
```

### 1.3 시나리오: 로그인 + GitHub 미연결

```
[템플릿 선택 & 배포 클릭]
           │
           │ handleDeploy() → isAuthenticated ✓, isGitHubConnected ✗
           ▼
┌─────────────────────────────────┐
│  GitHubConnectModal (모달)       │  ← 별도 스텝 대신 모달 표시
│  - "GitHub 연결" 버튼 표시       │
│  - setPendingDeploy(data)       │
└──────────────┬──────────────────┘
               │ 버튼 클릭
               ▼
┌─────────────────────────────────┐
│  GET /api/oneclick/oauth/authorize │
│  → GitHub OAuth 페이지로 리다이렉트│
└──────────────┬──────────────────┘
               │ OAuth 완료
               ▼
┌──────────────────────────────────────────┐
│  /sites?oauth_success=github              │
│  - localStorage에서 pending 복원 (TTL 검증) │
│  - handleGitHubConnected()               │
│  - pendingDeploy 있으면 자동배포            │
│  - URL 쿼리 파라미터 정리 (replaceState)    │
└──────────────────────────────────────────┘
```

---

## 2. 상태 머신

### 2.1 Wizard Step 상태

```
                ┌──────────────────┐
                │  Step 0: Template │ ◄─── handleRetry()
                └────────┬─────────┘
                         │
              ┌──────────┼──────────┐
              │          │          │
        비로그인     GitHub미연결    연결됨
              │          │          │
              ▼          ▼          ▼
         ┌─────────┐ ┌────────┐  executeDeploy()
         │ Login   │ │ Step 1 │    │
         │ Redirect│ │ GitHub │    │
         └─────────┘ └───┬────┘    │
                         │         │
                    OAuth 완료      │
                         │         │
                         ▼         │
                   handleGithub    │
                   Connected()     │
                         │         │
                         └────┬────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Step 2: Deploy  │
                    └────────┬────────┘
                             │
                    ┌────────┼────────┐
                    │        │        │
                  ready    error   timeout
                    │        │        │
                    ▼        ▼        │
                 [완료]  [재시도]     [재시도]
```

### 2.2 배포 상태 (deploy_status)

```
pending ──► creating ──► building ──► ready
                │             │
                ▼             ▼
             error          error
                              │
                              ▼
                           timeout (클라이언트 전용)
```

### 2.3 Pages 상태 (pages_status)

```
pending ──► enabling ──► building ──► built
                             │
                             ▼
                          errored
```

### 2.4 Fork 상태 (fork_status)

```
pending ──► forking ──► forked
                │
                ▼
             failed
```

> **참고**: GitHub Pages 배포에서는 `fork_status`가 항상 바로 `forked`로 설정됨 (실제 fork가 아닌 새 레포 생성이므로)

---

## 3. 폴링 로직 상세

### 클라이언트 (TanStack Query)
```typescript
refetchInterval: (query) => {
  const data = query.state.data;

  // 터미널 상태 → 폴링 중지
  if (['ready', 'error', 'canceled', 'timeout'].includes(data.deploy_status)) {
    if (data.deploy_status === 'ready') {
      // 프로젝트 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
    }
    return false; // 폴링 중지
  }

  // 최대 100회 (≈5분) 후 타임아웃
  if (query.state.dataUpdateCount >= 100) {
    queryClient.setQueryData(..., { ...prev, deploy_status: 'timeout' });
    return false;
  }

  return 3000; // 3초 간격
}
```

### 서버 (status route)
```
1. DB에서 deploy 레코드 조회
2. deploy_status가 'ready'/'error'가 아니면:
   a. GitHub service_account 조회 → 토큰 복호화
   b. GitHub Pages API 호출
   c. 상태 매핑 & DB 업데이트
3. buildSteps()로 UI 스텝 계산
4. 응답 반환
```

---

## 4. My Sites 플로우

### 4.1 대시보드
```
[/sites?tab=manage]                     ← IA Redesign: /my-sites에서 통합
    │
    ├─ GET /api/oneclick/deployments
    │
    ▼
┌───────────────────────────┐
│  사이트 카드 그리드          │
│  ┌─────┐ ┌─────┐ ┌─────┐  │
│  │Site1│ │Site2│ │Site3│  │
│  └──┬──┘ └─────┘ └─────┘  │
│     │                      │
└─────┼──────────────────────┘
      │
      ├─ "사이트 보기" → pages_url 외부 링크
      ├─ "편집하기" → /sites/{deployId}/edit
      ├─ "관리" → /project/{projectId} (Linkmap 프로젝트)
      └─ "삭제" → DELETE /deployments/{id}
```

### 4.2 사이트 편집기
```
[/sites/{deployId}/edit]                ← IA Redesign: /my-sites/[id]/edit에서 변경
    │
    ├─ GET /deployments/{id}/files (파일 목록)
    │
    ▼
┌─────────────────────────────────────┐
│  ┌────────┬──────────────┬────────┐  │
│  │ 파일    │  코드 에디터  │ 미리보기│  │
│  │ 목록    │              │ (HTML) │  │
│  │        │              │        │  │
│  └────────┴──────────────┴────────┘  │
│  ┌──────────────────────────────────┐ │
│  │  모듈 패널 (모듈 스키마 있을 때)    │ │  ← 모듈 에디터
│  │  [Hero] [About] [Values] [...]   │ │
│  │  ┌─── 선택 모듈 편집 폼 ────────┐ │ │
│  │  │ 이름:     [이지원    ]        │ │ │
│  │  │ 그래디언트: [#ee5b2b]→[#f59e0b]│ │ │
│  │  │         [코드에 적용]         │ │ │
│  │  └──────────────────────────────┘ │ │
│  └──────────────────────────────────┘ │
│  ┌──────────────────────────────────┐ │
│  │  AI 채팅 터미널                    │ │
│  │  "배경색을 파란색으로 바꿔줘"      │ │
│  │  → SSE 스트리밍 응답 → [적용] 버튼 │ │
│  └──────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**편집 플로우**:
1. 파일 선택 → `GET /files?path=style.css` → 에디터에 로드
2. 코드 수정 → "저장" → batch-update API → GitHub 원자적 커밋
3. 미리보기 자동 갱신 (iframe srcdoc)

**모듈 에디터 플로우**:
1. 모듈 스키마 존재하는 템플릿 → 하단에 모듈 패널 표시
2. 모듈 카드 선택 → 편집 폼 표시
3. 폼 값 변경 → [코드에 적용] 클릭
4. Code Generator가 config.ts/page.tsx/컴포넌트 코드 생성
5. Batch Update API → GitHub 원자적 커밋
6. GitHub Actions → 자동 배포 → ~30초 후 라이브 미리보기 갱신

**AI 채팅 플로우**:
1. 메시지 입력 → `POST /ai-chat` (SSE 스트리밍)
2. AI 응답에서 코드 블록 파싱 (`📄 filename.ext`)
3. "적용" → `useBatchApplyFiles` → batch-update API
4. 파일 캐시 무효화 → 미리보기 갱신

---

## 5. OAuth 상태 보존

### 문제
GitHub OAuth 리다이렉트 중에 사용자의 선택 (템플릿, 사이트명)을 보존해야 함

### 해결 (Sprint 3에서 개선 완료)

`localStorage` 기반 10분 TTL로 탭 전환/리다이렉트 안전성 확보:

```typescript
const PENDING_KEY = 'linkmap-pending-deploy';
const PENDING_TTL = 10 * 60 * 1000; // 10분

function savePendingDeploy(data) {
  localStorage.setItem(PENDING_KEY, JSON.stringify({ ...data, savedAt: Date.now() }));
}

function loadPendingDeploy() {
  const raw = localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  const parsed = JSON.parse(raw);
  if (Date.now() - parsed.savedAt > PENDING_TTL) {
    localStorage.removeItem(PENDING_KEY);
    return null;
  }
  return { templateId: parsed.templateId, siteName: parsed.siteName };
}

function clearPendingDeploy() {
  localStorage.removeItem(PENDING_KEY);
  try { sessionStorage.removeItem(PENDING_KEY); } catch {} // 레거시 정리
}
```

```
[배포 시작]
    │ savePendingDeploy({ templateId, siteName })
    ▼
[GitHub OAuth 리다이렉트] — 탭 전환/새 탭에서도 안전
    │
    ▼
[/oneclick?oauth_success=github]
    │ const saved = loadPendingDeploy()  // TTL 검증
    │ clearPendingDeploy()
    ▼
[자동 배포 실행]
```

> **해결됨**: `sessionStorage` → `localStorage` 전환으로 탭 전환 시에도 데이터 보존.
> 10분 TTL로 오래된 데이터 자동 정리.
