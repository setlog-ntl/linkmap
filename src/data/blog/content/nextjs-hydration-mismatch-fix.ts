export const content = `> **KEY:** Hydration Mismatch는 서버에서 만든 HTML과 브라우저에서 실행한 JavaScript의 결과물이 달라서 발생합니다. 다크모드, 언어 설정, 로그인 상태처럼 "브라우저만 아는 값"을 서버가 모르기 때문에 생기며, 로컬에서는 멀쩡한데 배포 후 새로고침하면 깨지는 이유가 바로 이것입니다.

## "새로고침하면 화면이 깨진다" — 이상한 버그의 정체

독서 기록 앱을 만들다가 이상한 현상을 발견했습니다.

로컬 개발 서버에서는 아무 문제 없습니다. 배포 후에도 처음 접속할 때는 괜찮습니다. 그런데 **새로고침을 하면** 화면이 잠깐 이상하게 보이거나, 브라우저 콘솔에 빨간 경고가 가득 찹니다.

\`\`\`
Warning: Text content did not match.
Server: "라이트" Client: "다크"

Warning: Prop \\\`aria-label\\\` did not match.
Server: "다크 모드로 전환" Client: "라이트 모드로 전환"
\`\`\`

이 오류의 정식 이름은 **Hydration Mismatch**입니다. React(Next.js)를 처음 쓸 때 반드시 한 번은 만나는 버그입니다.

> **INFO:** ReadingTree 프로젝트(Next.js + Supabase 독서 기록 앱)에서는 최근 5개 커밋이 전부 이 문제를 고치는 커밋이었습니다. 테마 토글, i18n 언어 설정, Quick Capture 컴포넌트 — 세 군데에서 같은 원인, 다른 증상으로 반복해서 나타났습니다.

## Hydration이란? — 쉬운 비유로 이해하기

Next.js는 페이지를 두 단계로 만듭니다.

**1단계: 서버가 HTML 뼈대를 만든다**

사용자가 URL을 입력하면, 서버(Vercel, Cloudflare 등)가 먼저 HTML을 만들어 브라우저로 보냅니다. 이 HTML은 빠르게 화면에 표시되지만, 아직 버튼 클릭 같은 동작은 작동하지 않습니다.

**2단계: 브라우저에서 JavaScript가 "생명을 불어넣는다"**

브라우저가 JavaScript를 다운받아 실행하면, 그제서야 버튼이 클릭되고 입력창에 타이핑할 수 있게 됩니다. 이 과정을 **Hydration(수화)**이라고 합니다.

비유를 들면 이렇습니다.

\`\`\`
서버 → 마네킹(HTML)을 만들어 보냄
브라우저 → 그 마네킹에 신경계(JS)를 연결해서 살아 움직이게 함
\`\`\`

문제는 이때 발생합니다. 서버가 만든 마네킹과 브라우저가 "이랬을 것"이라고 기대한 마네킹이 **다르면** React가 패닉 상태에 빠집니다. 이게 Hydration Mismatch입니다.

## 왜 불일치가 생기나? — 서버는 브라우저를 모른다

서버에는 \`localStorage\`, \`window\`, \`document\`가 없습니다. 이 세 가지는 오직 브라우저에만 존재하는 객체입니다.

다크모드 테마를 예로 들겠습니다.

\`\`\`
서버가 페이지를 만들 때:
  localStorage.getItem('theme') → ❌ localStorage가 없음 → undefined

브라우저가 JS를 실행할 때:
  localStorage.getItem('theme') → ✅ "dark"
\`\`\`

서버: "테마가 없으니 라이트 모드로 그릴게요."
브라우저: "어? 내 localStorage에는 dark라고 저장되어 있는데?"

이 불일치가 Hydration Mismatch입니다. 언어 설정(i18n), 로그인 상태, 화면 크기에 따른 조건부 렌더링도 같은 이유로 문제가 생깁니다.

> **WARNING:** 로컬 개발 서버(npm run dev)에서는 이 문제가 안 보일 수 있습니다. HMR(핫 모듈 교체) 방식으로 동작해서 서버-클라이언트 불일치가 숨겨지기 때문입니다. "로컬에서는 됐는데 배포 후에 깨진다"면 Hydration Mismatch를 의심하세요.

---

## 실제 코드로 보는 원인과 해결

### 가장 흔한 실수: 초기값에 localStorage 사용

\`\`\`tsx
// ❌ 이렇게 쓰면 서버에서 에러 (localStorage is not defined)
const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'light');

// ✅ 초기값은 서버/클라이언트 모두에서 동일한 값으로
const [theme, setTheme] = useState('light');

useEffect(() => {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
}, []);
\`\`\`

\`useEffect\`는 브라우저에서만 실행됩니다. 서버 렌더링 단계에서는 실행되지 않으므로 안전합니다.

### aria-label도 hydration mismatch의 대상이다

테마 토글 버튼의 aria-label을 현재 테마에 따라 바꾸는 코드도 같은 문제를 일으킵니다.

\`\`\`tsx
// ❌ 서버는 theme가 뭔지 모르는 상태에서 label을 결정함
<button aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}>

// ✅ 클라이언트에서만 결정되는 값은 마운트 후에 적용
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);

<button aria-label={mounted ? (theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환') : '테마 전환'}>
\`\`\`

### 불가피한 경우: suppressHydrationWarning

\`<body>\` 태그나 서드파티 라이브러리처럼 직접 수정할 수 없는 경우에는 \`suppressHydrationWarning\` 속성을 사용합니다.

\`\`\`tsx
// layout.tsx
<body suppressHydrationWarning>
  {children}
</body>
\`\`\`

이 속성은 React에게 "이 요소의 불일치는 알고 있어, 무시해"라고 알려줍니다. 남용하면 실제 버그를 숨길 수 있으니, 꼭 필요한 곳에만 씁니다.

### 클라이언트 전용 컴포넌트 분리

완전히 브라우저에서만 동작해야 하는 컴포넌트라면 \`next/dynamic\`으로 SSR을 끄는 방법도 있습니다.

\`\`\`tsx
import dynamic from 'next/dynamic';

// 이 컴포넌트는 서버에서 렌더링하지 않음
const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
  loading: () => <div className="w-8 h-8" />, // 로딩 중 빈 자리
});
\`\`\`

SSR 없이 클라이언트에서만 렌더링하므로 불일치가 원천 차단됩니다. 단, 첫 페이지 로드 시 해당 컴포넌트가 잠깐 비어보일 수 있습니다.

---

## 바이브코더가 자주 빠지는 함정

AI가 생성한 Next.js 코드를 그대로 복사하면 이 문제를 만날 가능성이 높습니다. AI는 브라우저와 서버의 차이를 항상 구분해서 코드를 짜지는 않기 때문입니다.

특히 이런 패턴이 자주 등장합니다.

**함정 1: typeof window 체크 없이 window 직접 접근**

\`\`\`tsx
// AI가 생성한 코드 (위험)
const isMobile = window.innerWidth < 768;

// 서버 안전 버전
const isMobile = typeof window !== 'undefined' ? window.innerWidth < 768 : false;
// 또는 useEffect 안에서만 사용
\`\`\`

**함정 2: 날짜/시간 직접 사용**

서버와 클라이언트의 시간대(timezone)가 다를 수 있습니다. \`new Date().toLocaleString()\`은 서버와 브라우저에서 다른 결과를 만들 수 있습니다.

**함정 3: Math.random() 사용**

서버에서 생성한 랜덤 ID와 브라우저에서 다시 생성한 랜덤 ID가 달라서 불일치가 생깁니다.

> **TIP:** AI에게 Next.js 코드를 요청할 때 "서버사이드 렌더링(SSR) 환경을 고려해서, localStorage·window·Math.random() 접근은 useEffect 안에서만 하도록 작성해줘"라고 조건을 추가하면 이 문제를 상당 부분 예방할 수 있습니다.

## Hydration Mismatch 해결 체크리스트

프로젝트에서 이 에러가 발생했을 때 순서대로 확인해보세요.

- [x] 브라우저 콘솔에서 "did not match" 경고 문구 확인
- [x] 경고에 표시된 컴포넌트 위치 파악
- [ ] \`useState\` 초기값에 \`localStorage\`, \`window\`, \`document\` 사용 여부 확인
- [ ] 초기값을 서버/클라이언트 모두에서 동일한 값으로 변경
- [ ] 브라우저 전용 로직을 \`useEffect\` 안으로 이동
- [ ] 서드파티 라이브러리의 경우 \`ssr: false\`로 dynamic import 적용
- [ ] 불가피한 경우에만 \`suppressHydrationWarning\` 사용

[Linkmap](https://www.linkmap.biz)처럼 Supabase 인증, 다크모드, 다국어를 동시에 사용하는 앱에서는 이 세 영역 모두가 Hydration Mismatch의 잠재적 원인이 됩니다. 처음부터 "초기값은 서버에서도 유효한 값으로" 원칙을 지키면 나중에 수정 커밋을 5개씩 쌓는 일을 줄일 수 있습니다.

> **TRY:** Linkmap에서는 Next.js + Supabase 프로젝트를 [원클릭으로 배포](/guides/deploy)할 수 있습니다. 배포 설정, 환경변수, 서비스 연결을 한 번에 관리하고 싶다면 [무료로 시작해보세요](https://www.linkmap.biz/signup).

---

*Next.js 배포 환경에서 자주 만나는 또 다른 문제는 [내 사이트가 간헐적으로 안 열린다 — 503 에러 해결기](/blog/cloudflare-workers-nextjs-prefetch-503-fix)에서, 환경변수 설정 기초는 [환경변수 완전 정복 가이드](/guides/env)에서 확인하세요.*`;
