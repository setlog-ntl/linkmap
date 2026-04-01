export const content = `> **KEY:** Cloudflare Workers Error 1102는 "요청 하나를 처리하는 데 CPU를 너무 오래 썼다"는 오류입니다. Free Plan은 요청당 CPU 10ms 제한이 있으며, 공개 페이지에서 불필요한 서버사이드 렌더링을 없애는 것이 핵심 해결책입니다.

## "사이트가 갑자기 안 열려요" — Error 1102란?

[Linkmap](https://www.linkmap.biz)을 운영하던 어느 날, 이런 화면이 떴습니다.

\`\`\`
Error 1102 — Worker exceeded resource limits
Ray ID: 9e5901e3deeb1a39
\`\`\`

직역하면 "워커가 리소스 한계를 초과했다"는 뜻입니다. 그런데 처음 보는 사람은 이 메시지만으로는 뭘 어떻게 해야 할지 전혀 알 수 없습니다.

이 글은 Error 1102를 처음 만난 초보 개발자, 또는 바이브 코딩으로 사이트를 만들었는데 이 오류가 뜬 분들을 위한 안내서입니다. 실제로 어떻게 원인을 찾고, 어떻게 해결했는지를 순서대로 설명합니다.

> **INFO:** **Cloudflare Workers**란? 전 세계 300개 이상의 서버에서 코드를 실행해주는 서비스입니다. Next.js 앱을 Cloudflare에 배포하면, 사용자 요청이 들어올 때마다 이 Workers가 페이지를 만들어서 전달합니다. Free Plan은 월 10만 건 요청까지 무료이지만, 요청 하나당 CPU 사용시간이 **10ms**로 제한됩니다.

## Cloudflare Workers CPU 10ms 제한, 얼마나 짧은가?

10ms(밀리초)는 0.01초입니다. 사람이 눈을 깜박이는 시간(150~400ms)의 1/40도 안 됩니다.

이 시간 안에 Workers가 해야 하는 일을 생각해봅시다.

\`\`\`
사용자가 페이지 요청
  → Workers 실행 시작
  → Next.js 코드 로드
  → 페이지 렌더링 시작
  → (여기서 DB 쿼리가 있다면 DB에 연결, 데이터 요청, 응답 대기...)
  → HTML 생성
  → 응답 전송
  ↑ 이 모든 과정이 CPU 기준 10ms 이내여야 함
\`\`\`

중요한 점은 **CPU 시간**이지 **실제 시간**이 아니라는 것입니다. DB에 쿼리를 보내고 응답을 기다리는 동안은 CPU를 쓰지 않으므로 제한에서 제외됩니다. 하지만 코드를 실행하고, 데이터를 가공하고, HTML을 렌더링하는 작업 자체가 CPU를 사용합니다.

간단한 정적 페이지라면 10ms로 충분합니다. 하지만 **매 요청마다 서버에서 새로 렌더링하는 동적 페이지**는 쉽게 한계를 넘습니다.

| 페이지 유형 | CPU 사용량 | 결과 |
|-----------|-----------|------|
| 정적 페이지 (빌드 때 미리 생성) | 매우 낮음 | 안정 |
| 동적 페이지 (요청마다 렌더링) | 높음 | 1102 위험 |
| 동적 + DB 쿼리 여러 건 | 매우 높음 | 1102 발생 |

---

## 원인을 찾지 못했던 이유 — Observability가 꺼져 있었다

이상하게도 에러는 발생하는데 어디서 발생하는지 알 수가 없었습니다. Cloudflare 대시보드에서 Workers 로그를 확인해보려 했더니, 텔레메트리 데이터가 0건이었습니다.

원인은 **Workers Observability(모니터링)가 비활성화**되어 있었기 때문입니다.

> **WARNING:** Cloudflare Workers를 배포하면 기본적으로 Observability(에러 로그, 성능 데이터 수집)가 꺼져 있는 경우가 있습니다. 에러가 나도 어디서 났는지 알 수 없는 상태입니다. 배포 직후 반드시 활성화하세요.

**Observability 활성화 방법:**

1. [Cloudflare 대시보드](https://dash.cloudflare.com) 접속
2. Workers & Pages → 해당 Worker 선택
3. Settings → Observability 탭
4. "Enable" 클릭, 샘플링 비율 100%로 설정

이것만 해도 앞으로 에러가 나면 어떤 요청에서 어떤 에러가 발생했는지 즉시 확인할 수 있습니다.

## 실제 원인 — 공개 페이지가 매번 SSR을 실행하고 있었다

Observability를 켜고, Cloudflare MCP(API 연동 도구)로 Workers 로그를 분석했더니 문제가 보였습니다.

**공개 페이지 9개가 \`force-dynamic\`으로 설정**되어 있었습니다.

### force-dynamic이란?

Next.js 페이지는 두 가지 방식으로 동작합니다.

\`\`\`tsx
// 방식 1: force-dynamic
// "이 페이지는 매 요청마다 서버에서 새로 만들어주세요"
export const dynamic = 'force-dynamic';

// 방식 2: revalidate = false (기본 정적 방식)
// "이 페이지는 빌드할 때 한 번만 만들고, 그걸 계속 씁니다"
export const revalidate = false;
\`\`\`

\`force-dynamic\`은 "항상 최신 데이터를 보여줘야 하는 페이지"에 적합합니다. 예를 들어 로그인 후 내 정보가 보이는 대시보드 페이지가 그렇습니다.

그런데 문제가 된 9개 페이지는 전부 **공개 페이지**였습니다.

### 어떤 페이지들이 문제였나?

**케이스 1 — \`/feedback/[id]\` (피드백 상세 페이지)**

이 페이지는 누구나 볼 수 있는 공개 페이지입니다. 그런데 매 요청마다 이런 작업을 했습니다.

\`\`\`
1. Supabase auth.getUser() 호출 → "현재 접속한 사람이 누구냐?"
2. 프로필 정보 조회 → DB 쿼리 1회
3. 관리자 권한 확인 → DB 쿼리 1회
   → 총 DB 쿼리 3회 (로그인 안 한 일반 방문자에게도!)
\`\`\`

로그인하지 않은 일반 방문자가 피드백을 보러 왔을 뿐인데, 서버는 뒤에서 3번이나 DB에 물어보고 있었던 겁니다.

**케이스 2 — \`/demo/project/[id]/*\` (데모 페이지 8개)**

데모를 보여주는 공개 페이지입니다. 마찬가지로 매 요청마다 6개의 DB 쿼리를 **병렬로** 실행하고 있었습니다.

\`\`\`
매 요청마다 동시에 실행:
  ├── 프로젝트 정보 조회
  ├── 서비스 목록 조회
  ├── 환경변수 목록 조회
  ├── 멤버 정보 조회
  ├── 바인딩 정보 조회
  └── 카탈로그 정보 조회
\`\`\`

데모 페이지는 보여주기용 고정 데이터입니다. 굳이 매번 DB를 6번씩 조회할 이유가 없습니다.

---

## 해결 방법 — 4가지 변경

### 해결 1: force-dynamic → revalidate = false 전환

9개 공개 페이지에서 \`force-dynamic\`을 제거하고 \`revalidate = false\`로 바꿨습니다.

\`\`\`tsx
// Before: 매 요청마다 SSR 실행
export const dynamic = 'force-dynamic';

// After: 빌드 때 한 번만 렌더링, 이후 캐시 사용
export const revalidate = false;
\`\`\`

**효과:** 첫 번째 요청에서만 렌더링하고, 이후에는 캐시된 결과를 즉시 반환합니다. CPU 사용이 사실상 0에 가까워집니다.

> **TIP:** "캐시를 쓰면 최신 내용이 안 반영되지 않나?"라는 의문이 당연히 생깁니다. **공개 페이지에서 매번 최신 데이터가 필요한 경우는 생각보다 드뭅니다.** 데모 페이지, 피드백 읽기 전용 페이지, 서비스 소개 페이지 등은 배포할 때 내용이 결정됩니다. 실시간 업데이트가 필요한 데이터는 클라이언트에서 fetch하는 방식으로 따로 처리하면 됩니다.

### 해결 2: 공개 페이지에서 서버사이드 인증 제거

\`/feedback/[id]\`의 서버 컴포넌트에서 auth 체크와 DB 쿼리를 제거했습니다. 관리자 기능(삭제, 상태 변경 등)은 클라이언트 컴포넌트에서 조건부로 처리하면 충분합니다.

\`\`\`tsx
// Before: 서버에서 매번 auth + DB 쿼리
export const dynamic = 'force-dynamic';
const { data: { user } } = await supabase.auth.getUser();
const profile = await getProfile(user?.id);
const isAdmin = await checkAdminRole(user?.id);

// After: 정적 렌더링, 관리자 기능은 클라이언트에서
export const revalidate = false;
// 서버에서는 공개 데이터만 가져옴
\`\`\`

### 해결 3: 데모 레이아웃 auth 리다이렉트 제거

데모 레이아웃에 있던 "로그인 안 하면 로그인 페이지로 보내기" 코드를 제거했습니다. 데모는 누구나 볼 수 있어야 하는데, 이 코드 때문에 매 요청마다 auth 체크가 실행되고 있었습니다.

### 해결 4: warm-cache.sh에 누락 경로 추가

배포 후 캐시 워밍업 스크립트에 새로 정적화된 페이지 경로를 추가했습니다.

> **INFO:** **캐시 워밍업(Cache Warming)**이란? \`revalidate = false\`로 설정하면 첫 번째 방문자가 페이지를 요청할 때 렌더링이 발생합니다. 배포 직후 자동으로 모든 페이지에 한 번씩 접속해서 캐시를 미리 채워두는 것을 "캐시 워밍업"이라고 합니다. 워밍업 후에는 모든 방문자가 캐시된 결과를 받으므로 CPU를 거의 쓰지 않습니다.

---

## 결과와 핵심 교훈

변경 후 동일한 경로로 접속 테스트를 진행했습니다. Error 1102가 완전히 사라졌습니다.

변경 요약:

| 변경 항목 | 영향 페이지 수 | 효과 |
|----------|-------------|------|
| force-dynamic → revalidate = false | 9개 페이지 | 매 요청마다 SSR 제거 |
| 서버사이드 auth 제거 (feedback) | 1개 페이지 | DB 쿼리 3회 제거 |
| 데모 레이아웃 auth 리다이렉트 제거 | 8개 페이지 | DB 쿼리 제거 |
| Observability 활성화 | 전체 | 향후 에러 즉시 진단 가능 |
| warm-cache.sh 경로 추가 | 9개 경로 | 배포 후 자동 캐시 워밍업 |

이 경험에서 얻은 교훈을 정리합니다.

**공개 페이지에 force-dynamic은 거의 필요 없습니다.** 로그인 없이 누구나 볼 수 있는 페이지라면 대부분 \`revalidate = false\`로도 충분합니다. 내용이 자주 바뀌어야 한다면 배포할 때 다시 빌드하면 됩니다.

**공개 페이지에서 서버사이드 auth 체크는 낭비입니다.** "관리자만 볼 수 있는 버튼"이 있다고 서버에서 auth를 체크할 필요는 없습니다. 페이지 자체는 누구에게나 보여주고, 관리자 전용 기능만 클라이언트에서 조건부로 표시하면 됩니다.

**CPU 시간과 실제 시간은 다릅니다.** CPU 10ms 제한은 "10ms 안에 응답해야 한다"는 뜻이 아닙니다. 실제로 CPU를 연산하는 시간이 10ms를 넘으면 안 된다는 뜻입니다. DB 응답 대기 시간은 포함되지 않지만, 여러 DB 쿼리 결과를 가공하고 렌더링하는 과정이 CPU를 씁니다.

## 지금 바로 확인하는 체크리스트

1. [Cloudflare 대시보드](https://dash.cloudflare.com)에서 Workers → Metrics → CPU Time P99 확인
2. 10ms에 가깝다면 아래 체크리스트 실행

- [x] Observability 활성화 (Settings → Observability → Enable)
- [x] 공개 페이지 코드에서 \`force-dynamic\` 검색 후 제거 여부 판단
- [x] 공개 페이지 서버 컴포넌트에서 \`auth.getUser()\` 호출 확인
- [x] 빌드 타임에 결정 가능한 데이터는 정적화
- [ ] 배포 후 warm-cache 스크립트 실행
- [ ] 이후 CPU Time P99 재확인

> **TRY:** Next.js를 Cloudflare Workers에 배포하고 있다면, [Linkmap](https://www.linkmap.biz)으로 연결된 서비스와 환경변수를 한눈에 관리해보세요. [서비스 카탈로그](https://www.linkmap.biz/services)에서 Cloudflare, Supabase, Vercel 등 128개 서비스를 한 화면에서 확인하고, 배포 환경이 복잡해져도 어떤 서비스가 어디에 연결되어 있는지 파악할 수 있습니다. [무료로 시작하기](https://www.linkmap.biz/signup)

---

*Cloudflare 연결 전반은 [Cloudflare 연결 가이드](/guides/cloudflare)와 [Vercel 배포 가이드](/guides/vercel)에서, prefetch로 인한 503 에러 해결 경험은 [내 사이트가 간헐적으로 안 열린다? — Next.js 배포 후 503 에러 해결기](/blog/cloudflare-workers-nextjs-prefetch-503-fix)에서 읽을 수 있습니다.*`;
