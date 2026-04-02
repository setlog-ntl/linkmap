export const content = `> **KEY:** AI API 호출이 타임아웃 나는 이유는 "무거운 작업을 응답 전에 모두 끝내려 해서"입니다. Next.js \`after()\` 함수를 쓰면 응답을 먼저 보내고 백그라운드에서 처리할 수 있어, Vercel 10초 제한을 우회하고 사용자 대기시간을 0에 가깝게 줄일 수 있습니다.

## "AI한테 만들었는데 자꾸 느려요" — 왜 이런 일이 생길까

바이브 코딩으로 기능을 빠르게 만들다 보면 꼭 한 번씩 이 상황을 만납니다.

"사진에서 텍스트 추출하는 기능 만들어줘" 하고 AI에게 요청했더니, 깔끔한 코드가 뚝딱 나왔습니다. 코드를 붙여넣고 실행했는데, 업로드 버튼을 누르면 화면이 멈춘 것처럼 5~10초를 기다려야 합니다. 가끔은 이런 에러가 뜹니다.

\`\`\`
Error: Task timed out after 10 seconds
\`\`\`

Vercel에서 기본으로 막아놓은 타임아웃입니다. AI가 만들어준 코드가 틀린 게 아닙니다. 구조의 문제입니다.

> **INFO:** [Vercel Functions](https://vercel.com/docs/functions/runtimes)의 기본 타임아웃은 **10초**입니다. AI API(OpenAI, Google Vision 등)를 동기로 호출하면 API 응답을 기다리는 동안 그 시간이 모두 타임아웃 카운터에 포함됩니다. Hobby 플랜은 최대 60초까지 설정할 수 있지만, 근본 해결책은 처리 방식을 바꾸는 것입니다.

## 동기 처리 vs 비동기 처리 — 식당 비유로 이해하기

프로그래밍 개념을 어렵게 설명하지 않겠습니다. 식당으로 비유하면 딱 이해됩니다.

**동기(Synchronous) 처리 = 요리가 나올 때까지 입구에 서서 기다리기**

식당 입구에서 "제 음식 다 되면 부를게요" 대신 "음식 다 될 때까지 여기 서 계세요"라고 하는 식당을 상상해보세요. 손님은 5분, 10분을 서서 기다려야 합니다. 뒤에 줄 서 있는 사람들은 계속 기다립니다. 이게 지금 AI API를 동기로 처리하는 방식입니다.

\`\`\`
[동기 처리 흐름]

사용자 요청
  → OCR API 호출 (3~8초 기다림)
  → DB 저장
  → 응답 전송 ← 사용자는 여기까지 기다려야 함

  총 대기시간: 3~8초 + DB 처리시간
\`\`\`

**비동기(Asynchronous) 처리 = 번호표 받고 자리 앉기**

번호표를 받고 자리에 앉으면, 음식이 완성됐을 때 직원이 가져다줍니다. 손님은 기다리는 동안 물도 마시고 메뉴도 봅니다. 뒤에 온 손님도 바로 자리에 앉을 수 있습니다. 이게 비동기 처리입니다.

\`\`\`
[비동기 처리 흐름]

사용자 요청
  → "처리 중입니다" 즉시 응답 ← 사용자는 여기서 이미 응답 받음
  → 백그라운드에서 OCR API 호출 (3~8초)
  → 백그라운드에서 DB 저장
  → 완료

  사용자 대기시간: 0.1초 이하
\`\`\`

---

## 어떤 작업에 비동기 처리가 필요한가

모든 작업을 비동기로 바꿀 필요는 없습니다. 응답 전에 반드시 완료되어야 하는 작업과, 나중에 처리해도 되는 작업을 구분하는 것이 핵심입니다.

| 작업 종류 | 처리 방식 | 이유 |
|----------|---------|------|
| 로그인 인증 | 동기 | 성공/실패를 즉시 알아야 함 |
| 결제 금액 검증 | 동기 | 틀리면 바로 에러 보여줘야 함 |
| **AI API 호출 (GPT, Gemini, Claude)** | **비동기 권장** | 응답에 2~30초 걸릴 수 있음 |
| **OCR/이미지 처리** | **비동기 권장** | 파일 크기에 따라 수 초 소요 |
| **이메일 발송** | **비동기 권장** | 보내는 데 1~3초, 사용자는 안 기다려도 됨 |
| **외부 웹훅 연동** | **비동기 권장** | 외부 서버 응답시간 불확실 |
| 대량 데이터 처리 | 비동기 권장 | 처리량에 따라 분 단위 소요 가능 |

## Level 1 — Next.js \`after()\` 함수 (가장 쉬운 방법)

Next.js 15부터 정식 포함된 [\`after()\` 함수](https://nextjs.org/docs/app/api-reference/functions/after)는 "응답을 먼저 보내고, 그 다음에 이 코드를 실행해"라고 지시하는 가장 간단한 방법입니다. 외부 라이브러리 없이 Next.js만으로 해결됩니다.

**Before — 동기 처리 (느리고 타임아웃 위험)**

\`\`\`typescript
// app/api/ocr/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { imageUrl } = await req.json();

  // OCR API 호출 (3~8초 소요) — 사용자는 여기서 기다림
  const text = await callVisionAPI(imageUrl);

  // DB 저장 — 사용자는 여기도 기다림
  await saveToDatabase(text);

  // 모두 끝난 후에야 응답
  return NextResponse.json({ text });
}
\`\`\`

**After — \`after()\`로 비동기 처리 (즉시 응답)**

\`\`\`typescript
// app/api/ocr/route.ts
import { NextResponse } from 'next/server';
import { after } from 'next/server';

export async function POST(req: Request) {
  const { imageUrl } = await req.json();

  // 백그라운드 처리 예약 — 응답 후 실행됨
  after(async () => {
    const text = await callVisionAPI(imageUrl);
    await saveToDatabase(text);
  });

  // OCR이 끝나기 전에 즉시 응답
  return NextResponse.json({ status: 'processing' });
}
\`\`\`

코드 차이는 딱 3줄입니다. 사용자가 느끼는 차이는 8초 대기 → 0.1초 응답입니다.

> **TIP:** \`after()\`는 Next.js 15.0부터 stable 상태입니다. \`next/server\`에서 바로 import할 수 있으니 별도 설치가 필요 없습니다. Vercel, Cloudflare Workers, Node.js 런타임 모두 지원합니다.

---

## Level 2 — 상태 폴링 (처리 결과를 화면에 보여줄 때)

\`after()\`만으로는 "처리가 완료됐을 때 화면을 업데이트"하는 건 어렵습니다. 사용자가 결과를 기다렸다가 화면에 표시해야 한다면 폴링(Polling) 방식을 씁니다. 클라이언트가 주기적으로 완료 여부를 서버에 물어보는 방식입니다.

\`\`\`
[폴링 흐름]

1. 사용자 요청 → 서버: "처리 중" 응답 + jobId 반환
2. 클라이언트: 2초마다 /api/status/[jobId] 요청
3. 서버: DB에서 상태 확인 후 "완료" or "처리 중" 응답
4. 클라이언트: "완료" 받으면 결과 화면 업데이트
\`\`\`

DB에 \`status\` 컬럼 하나만 추가하면 구현할 수 있습니다.

\`\`\`typescript
// 폴링 예시 — 클라이언트
async function waitForResult(jobId: string) {
  const interval = setInterval(async () => {
    const res = await fetch(\`/api/status/\${jobId}\`);
    const { status, result } = await res.json();

    if (status === 'done') {
      clearInterval(interval);
      setResult(result); // 화면 업데이트
    }
  }, 2000); // 2초마다 확인
}
\`\`\`

## Level 3 — SSE / 웹소켓 (실시간 스트리밍)

AI 챗봇처럼 처리 결과가 실시간으로 흘러나와야 한다면 SSE(Server-Sent Events)나 웹소켓을 씁니다. OpenAI Streaming, Anthropic Streaming이 이 방식을 씁니다. 구현 복잡도는 가장 높지만, 사용자 경험은 가장 뛰어납니다.

Level 3는 이미 AI API를 스트리밍으로 쓰고 있는 분들께 해당합니다. 처음 시작한다면 Level 1부터 적용하고, 필요할 때 단계적으로 올라가는 걸 추천합니다.

## 이중 처리 방지 — 버튼 두 번 눌렀을 때

비동기 처리를 도입하면서 반드시 함께 해결해야 할 문제가 있습니다. 사용자가 버튼을 연달아 두 번 눌렀을 때 OCR이 두 번 실행되는 이중 처리 문제입니다.

**프론트엔드: 버튼 비활성화**

\`\`\`typescript
// 요청 중에는 버튼을 비활성화
const [isProcessing, setIsProcessing] = useState(false);

async function handleUpload() {
  if (isProcessing) return; // 이미 처리 중이면 무시

  setIsProcessing(true);
  await fetch('/api/ocr', { method: 'POST', body: formData });
  setIsProcessing(false);
}

return (
  <button onClick={handleUpload} disabled={isProcessing}>
    {isProcessing ? '처리 중...' : '텍스트 추출'}
  </button>
);
\`\`\`

**백엔드: 중복 요청 감지**

프론트 방어만으로는 부족합니다. 서버에서도 "이미 처리 중인 파일"을 확인해야 합니다. DB에 처리 상태를 저장하고, 처리 전에 상태를 확인합니다.

\`\`\`typescript
// 처리 전 상태 확인
const existing = await db.query(
  'SELECT status FROM ocr_jobs WHERE image_url = \$1',
  [imageUrl]
);

if (existing?.status === 'processing') {
  return NextResponse.json(
    { error: '이미 처리 중입니다' },
    { status: 409 }
  );
}
\`\`\`

> **WARNING:** 이중 처리 방지를 서버에서만 하면 사용자가 "왜 버튼이 안 눌리지?"를 모릅니다. 프론트에서도 반드시 버튼 비활성화와 안내 문구를 함께 제공하세요. 프론트에서만 하면 네트워크 탭 열고 직접 API 요청을 보내는 사람에게 뚫립니다. 둘 다 해야 합니다.

---

## 실제 적용 사례 — ReadingTree OCR 기능

이 글의 배경이 된 실제 사례입니다. 책 속 문장을 사진으로 찍어 텍스트로 저장하는 기능에서 Google Vision API를 동기로 호출하다 타임아웃과 이중처리 문제가 동시에 발생했습니다.

\`\`\`
[기존 문제 상황]

POST /api/ocr
  → Google Vision API 호출 (평균 4~6초)
  → DB 저장
  → 응답

  결과: 사용자 8초 대기 + Vercel 10초 타임아웃 간헐 발생
  이중처리: 기다리다 지쳐 버튼 재클릭 → 같은 이미지 2번 처리
\`\`\`

\`after()\` 도입 후 결과입니다.

\`\`\`
[개선 후]

POST /api/ocr
  → after()로 Vision API 예약
  → "처리 중" 즉시 응답 (0.1초)
  → [백그라운드] Vision API 호출 → DB 저장

  결과: 타임아웃 0건 + 이중처리 0건 + /notes 페이지 응답속도 개선
\`\`\`

변경된 코드는 10줄 남짓이었습니다. API 라우트에 \`after()\` 감싸기, 상태 컬럼 추가, 버튼 비활성화가 전부였습니다.

> **TIP:** Linkmap [서비스 카탈로그](https://www.linkmap.biz/services)에서 Google Vision API, OpenAI, Anthropic Claude 등 AI API 연동 정보를 한곳에서 확인할 수 있습니다. 어떤 AI API를 쓰든 타임아웃 패턴은 동일하게 적용됩니다.

## 지금 당장 할 수 있는 체크리스트

내 앱에서 비동기 처리가 필요한지 점검해보세요.

- [x] API 라우트에서 외부 API를 호출하는 코드가 있다
- [x] 사용자가 버튼 누르고 3초 이상 기다리는 경우가 있다
- [ ] 해당 API 응답이 사용자에게 즉시 보여야 하는가? → 동기 유지
- [ ] 해당 API 응답이 나중에 저장되면 되는가? → \`after()\` 적용
- [ ] 처리 결과를 화면에 실시간으로 보여야 하는가? → 폴링 또는 SSE 검토
- [ ] 버튼 중복 클릭 방지 처리가 되어 있는가?

> **TRY:** 내 프로젝트에서 어떤 외부 API를 연결하고 있는지 한눈에 보고 싶다면 [Linkmap](https://www.linkmap.biz)에서 서비스맵을 만들어보세요. 서비스 간 의존성을 시각화하면 어디에 비동기 처리가 필요한지 바로 보입니다. [무료로 시작하기](https://www.linkmap.biz/signup)

---

*비동기 처리 시 환경변수 관리도 함께 점검하세요. 외부 API 키를 안전하게 다루는 방법은 [환경변수 완전 정복 가이드](/guides/env), AI API를 처음 연동하는 분들은 [OpenAI 연동 가이드](/guides/openai)를 참고하세요. API 연동의 흐름 전체는 [바이브 코딩으로 소셜 로그인 구현하기](/blog/vibe-coding-social-login-guide)에서 이어집니다.*
`;
