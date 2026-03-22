export const content = `> **KEY:** "구글로 로그인" 버튼 하나 넣으려다 콘솔 3개를 오가며 반나절을 날린 적 있으신가요? 소셜 로그인은 코드보다 **설정이 진짜 관문**입니다. 이 글은 OAuth가 뭔지부터 시작해서, 카카오/구글 로그인을 Supabase Auth로 연결하는 전 과정을 정리합니다.

## "로그인 기능 추가해줘" — AI에게 말했더니 생긴 일

바이브코딩으로 앱을 어느 정도 만들고 나면, 다음 단계는 항상 비슷합니다. "이제 로그인 기능을 넣어야겠다."

AI에게 "구글 로그인 추가해줘"라고 말하면, 깔끔한 코드가 뚝딱 나옵니다. 버튼도 예쁘고, \`signInWithOAuth\` 함수도 잘 연결되어 있습니다. 자신감이 생겨서 바로 실행합니다. 그런데 버튼을 누르면...

**"Error 401: invalid_client"**

코드는 맞는데 안 됩니다. AI가 만든 코드에는 문제가 없었습니다. 문제는 **Google Cloud Console에서 앱을 등록하지 않은 것**이었습니다. AI는 코드를 만들어줄 수 있지만, 외부 서비스 콘솔에서 클릭하고 키를 발급받는 과정까지 대신해주지는 못합니다.

이 글은 그 "콘솔 설정"이 어떤 건지, 왜 필요한지, 어디서 막히는지를 정리합니다.

---

## 그래서 소셜 로그인이 뭔데? — OAuth를 5분 만에 이해하기

소셜 로그인의 핵심을 한 문장으로 요약하면 이겁니다: **비밀번호를 내가 다루지 않겠다는 선언.**

비밀번호를 직접 저장한다는 건, 집에 금고를 두는 것과 같습니다. 금고가 있으면 도둑이 금고를 노립니다. 소셜 로그인은 금고 자체를 없애는 전략입니다.

**호텔 체크인으로 이해해봅시다:**

1. 손님(사용자)이 호텔(내 웹사이트)에 도착합니다
2. 호텔은 직접 여권을 확인하지 않고, 로비의 신원확인 데스크(카카오/구글)에 보냅니다
3. 데스크에서 확인 후 "이 분 확인됐습니다" 카드(Access Token)를 줍니다
4. 호텔은 그 카드만 보고 방 키를 내줍니다

이렇게 하면 호텔은 손님의 여권 사본을 보관할 필요가 없습니다. 비밀번호 해킹, 비밀번호 분실 대응, 비밀번호 암호화 — 이 모든 짐을 카카오/구글이 대신 지는 거죠.

> **INFO:** 이 방식의 정식 이름이 OAuth 2.0입니다. 2012년부터 사실상의 표준이고, 여러분이 매일 쓰는 "카카오로 로그인", "구글로 계속하기" 버튼이 전부 이 방식입니다.

---

## 콘솔에서 만나는 용어 5개 — 이것만 알면 설정이 보인다

소셜 로그인 설정에서 처음 보는 영어 단어가 쏟아집니다. Client ID? Redirect URI? 뭘 어디에 넣으라는 건지. 실은 5개만 알면 됩니다.

| 용어 | 쉽게 말하면 | 비유 |
|------|-----------|------|
| Provider | 로그인을 대신 해주는 곳 (Google, Kakao) | 신원확인 데스크 |
| Client ID | 내 앱의 고유 번호 | 사업자등록번호 |
| Client Secret | 내 앱임을 증명하는 비밀 열쇠 | 사업자등록증 원본 |
| Redirect URI | 로그인 후 돌아올 내 사이트 주소 | "확인 끝나면 여기로 보내주세요" |
| Access Token | 로그인 성공 시 받는 출입증 | 호텔 카드키 |

이 5개를 알고 나서 콘솔을 열면, "아, 여기에 Client ID를 넣으라는 거구나"가 보이기 시작합니다.

> **WARNING:** Client Secret은 **절대 브라우저에 노출하면 안 됩니다.** Next.js에서 환경변수 이름을 \`NEXT_PUBLIC_\`으로 시작하면 누구나 볼 수 있습니다. 사업자등록증 원본을 가게 유리창에 붙여놓는 것과 같습니다. [.env 파일은 왜 위험한가](/blog/why-dotenv-is-dangerous)에서 상세히 다뤘습니다.

---

## 잠깐, "키"가 두 종류라고?

바이브코딩을 하다 보면 "키"를 두 군데서 만납니다. 소셜 로그인 설정에서 만나는 키와, OpenAI API 같은 서비스 연동에서 만나는 키. 이 둘을 헷갈리면 삽질이 시작됩니다.

| 구분 | 앱 로그인 (이 글의 주제) | 서비스 API 연동 |
|------|----------------------|----------------|
| 목적 | 사용자가 내 앱에 **들어오는 문** | 내 앱이 외부 API를 **쓰는 열쇠** |
| 예시 | Google/카카오 OAuth | OpenAI API Key, Stripe Secret Key |
| 누가 쓰나 | 최종 사용자 (방문자) | 내 서버 코드 |
| 흐름 | 사용자 → 구글 → 내 앱 | 내 서버 → 외부 API |

쉽게 말해, 소셜 로그인은 **"손님이 들어오는 현관문"** 이고, API 키는 **"내가 다른 가게에 들어가는 뒷문 열쇠"** 입니다. 이 글에서는 현관문(소셜 로그인)만 다룹니다.

서비스 API 연동이 궁금하다면 [Stripe 결제 연동 가이드](/blog/vibe-coding-stripe-payment-guide)를 참고하세요.

---

## Supabase Auth — 왜 다들 이걸 쓰라고 할까

"소셜 로그인을 직접 구현하세요"라고 하면, 해야 할 일이 이만큼입니다.

| 해야 할 것 | 직접 구현하면 | Supabase Auth 쓰면 |
|-----------|------------|-------------------|
| OAuth 토큰 교환 코드 | 직접 작성 | 이미 내장 |
| 사용자 DB 테이블 설계 | 직접 만들기 | \`auth.users\` 자동 생성 |
| 세션/쿠키 관리 | 직접 구현 | \`@supabase/ssr\`이 알아서 |
| Provider 추가 | 각각 따로 구현 | 대시보드에서 클릭 한 번 |
| 보안 (CSRF, 토큰 갱신) | 직접 신경 | 기본 탑재 |

차이가 명확합니다. 그런데 여기서 중요한 게 하나 있습니다: **Supabase가 줄여주는 건 "코드"이지, "콘솔 설정"이 아닙니다.** Google Cloud Console에서 앱을 등록하고, 카카오 개발자 사이트에서 키를 발급받는 과정은 본인이 직접 해야 합니다.

이 콘솔 설정이 초보자에게 가장 어려운 부분입니다. 아래에서 구글과 카카오를 각각 어떻게 연결하는지 정리합니다.

> **TIP:** Supabase 자체가 처음이라면 [Supabase 입문 가이드](/blog/supabase-for-vibe-coders)에서 프로젝트 생성부터 시작하세요. 이 글은 Supabase 프로젝트가 이미 있다는 전제로 진행합니다.

---

## 구글 로그인 — 3단계로 끝내기

구글 로그인은 비교적 직관적입니다. "콘솔에서 앱 등록 → Supabase에 키 입력 → 코드 작성" 3단계면 됩니다.

### 1단계: Google Cloud Console에서 앱 등록

[Google Cloud Console](https://console.cloud.google.com)에 들어가서 OAuth 2.0 클라이언트를 만듭니다.

- 프로젝트 생성 → API 및 서비스 → 사용자 인증 정보
- OAuth 2.0 클라이언트 ID 만들기
- **Redirect URI 입력이 핵심입니다:** \`https://<your-project>.supabase.co/auth/v1/callback\`

여기서 Redirect URI를 빼먹거나 오타를 내면, 나중에 "redirect_uri_mismatch" 에러가 나옵니다. 이게 가장 흔한 실수입니다.

### 2단계: Supabase 대시보드에 키 입력

Supabase 대시보드 → Authentication → Providers → Google 활성화 후, 1단계에서 받은 Client ID와 Client Secret을 붙여넣습니다. 끝입니다.

### 3단계: AI에게 코드 요청

이제 코드는 AI에게 맡기세요. 이런 식으로 요청하면 됩니다:

\`\`\`
Supabase Auth로 Google OAuth 소셜 로그인을 추가해줘.
- "구글로 로그인" 버튼 클릭 시 구글 인증 페이지로 이동
- 인증 후 /auth/callback 라우트에서 code를 교환하고 /dashboard로 리다이렉트
- Supabase 클라이언트는 @supabase/ssr 사용
- /auth/callback 라우트 코드도 같이 만들어줘
\`\`\`

마지막 줄 **"/auth/callback 라우트 코드도 같이 만들어줘"** 가 중요합니다. 이걸 빼먹으면 로그인 후 빈 화면이 뜹니다. 뒤에서 다시 다룹니다.

> **TIP:** 각 단계의 스크린샷이 필요하다면 [구글 로그인 가이드](/guides/auth/google)를 참고하세요.

---

## 카카오 로그인 — 구글보다 한 단계가 더 있다

카카오 로그인을 설정하다가 "어, 왜 Supabase Provider 목록에 카카오가 없지?"라고 당황하신 분이 많을 겁니다. 맞습니다. Supabase 기본 목록에는 카카오가 없습니다. **OIDC(OpenID Connect) Provider**로 직접 등록해야 합니다.

이 한 단계 차이 때문에 카카오 로그인에서 많이들 멈춥니다. 하나씩 정리해보겠습니다.

### 카카오 개발자 콘솔에서 할 일

[Kakao Developers](https://developers.kakao.com)에 들어가서:

1. **애플리케이션 추가** → 앱 키 중 REST API 키를 메모합니다
2. **카카오 로그인 활성화** → Redirect URI를 등록합니다
3. **OpenID Connect 활성화** — 이게 핵심입니다. 카카오 로그인 → 고급 → OpenID Connect 활성화를 켜야 합니다. 이걸 안 켜면 Supabase에서 연동이 안 됩니다
4. **동의항목 설정** → 이메일, 프로필 정보 등 필요한 항목을 선택합니다

> **WARNING:** 이메일을 "필수 동의"로 받으려면 **비즈앱 전환**이 필요합니다. 겁먹을 필요 없습니다 — 개인 개발자도 사업자등록번호 없이 전환할 수 있습니다. 카카오 앱 설정 → 비즈니스 → 비즈앱 전환에서 진행하면 됩니다.

### Supabase에 OIDC Provider로 등록

Supabase 대시보드 → Authentication → Providers → **"Add new provider"** → OIDC를 선택하고:

- **Provider Name:** kakao
- **Client ID:** 카카오 REST API 키
- **Client Secret:** 카카오 보안 탭에서 생성한 Client Secret
- **Issuer URL:** \`https://kauth.kakao.com\`

### AI에게 코드 요청

카카오는 OIDC provider라서, AI에게 요청할 때 이 점을 알려줘야 합니다:

\`\`\`
Supabase Auth로 카카오 로그인을 추가해줘.
- Supabase에서 카카오는 OIDC provider로 등록되어 있어
- provider 이름은 "kakao"
- "카카오로 로그인" 버튼 클릭 시 카카오 인증 페이지로 이동
- 인증 후 /auth/callback에서 code 교환 후 /dashboard로 리다이렉트
- signInWithOAuth의 options.queryParams에 provider: "kakao" 전달
\`\`\`

이 프롬프트에서 **"OIDC provider로 등록되어 있어"** 와 **"provider 이름은 kakao"** 를 꼭 알려주세요. 안 그러면 AI가 기본 Provider 목록에서 카카오를 찾으려다 엉뚱한 코드를 만들어냅니다.

> **TIP:** [카카오 로그인 가이드](/guides/auth/kakao)에서 OIDC 설정과 동의항목까지 스크린샷과 함께 확인할 수 있습니다.

---

## 여기서 막힙니다 — 초보자가 가장 많이 겪는 문제 3가지

소셜 로그인 코드를 만들고 나서 "되나?" 하고 실행하면, 대부분 한 번에 되지 않습니다. 거의 100% 아래 3가지 중 하나에 걸립니다.

### 1. "redirect_uri_mismatch" — URI가 한 글자라도 다르면 실패

이 에러를 안 만나본 사람이 없을 겁니다. 원인은 단순합니다: Provider 콘솔에 등록한 URI와 실제 요청되는 URI가 **정확히** 일치하지 않는 것입니다.

흔한 실수들:

- \`http\`로 등록했는데 실제로는 \`https\`로 요청됨
- 끝에 \`/\`를 붙였는데 실제 요청에는 없음 (또는 그 반대)
- 로컬 개발용 URL만 등록하고 배포 환경 URL을 빼먹음

| 환경 | 등록해야 할 URI |
|------|---------------|
| 로컬 개발 | \`http://localhost:3000/auth/callback\` |
| Supabase 콜백 | \`https://<project>.supabase.co/auth/v1/callback\` |
| 배포 사이트 | \`https://mysite.com/auth/callback\` |

**세 개 다 등록해야 합니다.** 하나라도 빠지면 해당 환경에서 로그인이 실패합니다.

### 2. "로컬에서는 되는데 배포하면 안 돼요"

이 말을 하게 되면, 99% 환경변수 문제입니다.

\`.env\` 파일은 내 컴퓨터에만 있습니다. Vercel이든 Cloudflare든, 배포 환경에도 **별도로** 환경변수를 설정해야 합니다. 로컬에서 잘 되니까 안심하고 배포했는데, 배포 환경에 \`SUPABASE_URL\`이 없어서 터지는 겁니다.

\`\`\`
체크리스트:
✅ .env.local에 SUPABASE_URL, SUPABASE_ANON_KEY 있는지
✅ 배포 환경 대시보드에도 같은 값이 설정되어 있는지
✅ Provider의 Client ID/Secret은 Supabase 대시보드에 입력했는지 (코드가 아님!)
\`\`\`

> **TIP:** 환경변수 관리가 복잡해지기 시작했다면 [환경변수 완전 정복 가이드](/guides/env)를 읽어보세요. 로컬/스테이징/프로덕션 환경별로 어떻게 관리하는지 정리되어 있습니다.

### 3. "로그인 후 빈 화면이 뜬다" — Callback 라우트가 없다

이건 진짜 당황스럽습니다. 구글 로그인 창이 뜨고, 계정을 선택하고, 확인을 누르면... 404 에러 또는 빈 화면.

원인: 소셜 로그인이 끝나면 Provider가 \`/auth/callback?code=xxx\` 주소로 사용자를 돌려보냅니다. 그런데 이 \`/auth/callback\` 페이지가 없으면 갈 곳이 없는 거죠. AI에게 로그인 기능을 요청할 때 **callback 라우트를 같이 만들어달라고** 꼭 말해야 합니다.

\`\`\`
/auth/callback 라우트를 만들어줘.
- URL의 code 파라미터를 Supabase exchangeCodeForSession으로 교환
- 성공 시 /dashboard로 리다이렉트
- 실패 시 /login?error=auth로 리다이렉트
\`\`\`

이 세 줄을 프롬프트에 추가하는 것만으로 "로그인 후 빈 화면" 문제를 예방할 수 있습니다.

---

## 환경변수 정리 — 뭘 어디에 넣어야 하나

소셜 로그인 설정을 하다 보면 키가 이것저것 나옵니다. "이건 \`.env\`에 넣어야 하나? Supabase에 넣어야 하나?" 헷갈리기 시작합니다. 한 번에 정리합니다.

| 변수명 | 어디서 받나 | 어디에 넣나 | 공개 여부 |
|--------|-----------|-----------|----------|
| \`NEXT_PUBLIC_SUPABASE_URL\` | Supabase 대시보드 | \`.env\` + 배포 환경 | 공개 가능 |
| \`NEXT_PUBLIC_SUPABASE_ANON_KEY\` | Supabase 대시보드 | \`.env\` + 배포 환경 | 공개 가능 |
| Google Client ID | Google Cloud Console | **Supabase 대시보드** | — |
| Google Client Secret | Google Cloud Console | **Supabase 대시보드** | — |
| 카카오 REST API 키 | Kakao Developers | **Supabase 대시보드** | — |
| 카카오 Client Secret | Kakao Developers | **Supabase 대시보드** | — |

여기서 핵심: **Google/카카오의 키는 내 코드나 \`.env\`에 넣는 게 아닙니다.** Supabase 대시보드에 입력하면 Supabase가 대신 관리해줍니다. 코드에 직접 키를 넣으려다가 보안 사고가 나는 경우가 많으니, 이 구조를 기억해두세요.

> **TIP:** 프로젝트가 커지면서 연결하는 서비스가 늘어나면 "이 키가 어디서 온 거였지?"가 헷갈리기 시작합니다. [Linkmap](https://www.linkmap.biz)으로 어떤 서비스에 어떤 키가 연결되어 있는지 시각화하면 관리가 훨씬 편해집니다. [서비스 카탈로그](https://www.linkmap.biz/services)에서 Supabase, Google, Kakao를 포함한 128개 서비스의 연결 방법을 확인하세요.

---

> **TRY:** 소셜 로그인을 붙이고 나면, 다음 질문은 보통 이겁니다: "로그인한 사용자의 데이터를 어떻게 보호하지?" 다음 단계로 넘어가세요:
> - [Supabase RLS로 데이터 보호하기](/blog/supabase-rls-vibe-coding-risk) — 다른 사람이 내 데이터를 못 보게
> - [배포 가이드](/blog/vibe-coding-deploy-guide) — 만든 앱을 세상에 공개하기
> - [환경변수 완전 정복](/guides/env) — 키 관리의 모든 것
> - [바이브코딩 런칭 체크리스트](/blog/vibe-coding-launch-checklist) — 출시 전 최종 점검
> - [Linkmap 무료 가입](https://www.linkmap.biz/signup)으로 서비스 연결을 시각화하고 API 키를 안전하게 관리해보세요.

---

*콘솔 설정에서 막힐 때는 [인증 가이드](/guides/auth)의 스크린샷을 참고하세요. 바이브코딩 전반이 궁금하다면 [바이브코딩 시작 가이드](/blog/vibe-coding-getting-started-guide)부터 읽어보세요.*`;
