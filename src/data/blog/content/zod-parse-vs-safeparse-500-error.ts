export const content = `> **KEY:** Zod의 \`parse()\`는 잘못된 입력을 받으면 예외를 던져 서버를 500 에러로 만듭니다. \`safeParse()\`는 예외 대신 \`{ success: false, error }\` 객체를 반환해 400 에러로 안전하게 처리할 수 있습니다. AI가 생성한 API 코드에 \`parse()\`가 있다면, 바꿔야 합니다.

## 원인을 알 수 없는 500 에러

바이브코딩으로 API를 만들다 보면 한 번쯤 이런 상황을 겪습니다. 프론트엔드에서 폼을 제출했더니 서버가 500 에러를 뱉습니다. 로그를 봐도 딱히 없고, 코드도 이상해 보이지 않습니다.

범인은 생각보다 가까운 곳에 있습니다. AI가 작성한 입력 검증 코드, 그 중에서도 Zod의 \`parse()\` 한 줄이었습니다.

이 글은 초보 개발자와 바이브코더가 자주 마주치는 이 상황을 해부합니다. Zod가 무엇인지, \`parse()\`와 \`safeParse()\`가 어떻게 다른지, 그리고 왜 AI는 위험한 쪽을 골라 쓰는지를 설명합니다.

> **INFO:** Zod는 TypeScript 프로젝트에서 가장 널리 쓰이는 입력 검증 라이브러리입니다. [공식 문서](https://zod.dev/basics)에 따르면 주간 다운로드가 2,000만 건을 넘습니다. Next.js App Router 프로젝트라면 이미 어딘가에 설치돼 있을 가능성이 높습니다.

---

## Zod란 무엇인가 — 공항 보안 검색대 비유

코드는 믿을 수 없는 세상에 살고 있습니다. 사용자가 이름 필드에 SQL 쿼리를 넣기도 하고, 숫자여야 할 곳에 문자열을 넣기도 합니다. AI가 아무리 깔끔한 코드를 만들어줘도, 예상 밖의 입력이 들어오면 코드는 혼란에 빠집니다.

Zod는 이를 막는 **공항 보안 검색대**입니다. API 서버로 들어오는 모든 입력을 검색대에 태워서, 규칙에 맞지 않으면 통과시키지 않습니다.

\`\`\`typescript
import { z } from 'zod';

// 검색 규칙 정의
const requestSchema = z.object({
  name: z.string().min(1).max(50),   // 이름: 1~50자 문자열
  age: z.number().int().min(0),       // 나이: 0 이상 정수
  email: z.string().email(),          // 이메일 형식
});
\`\`\`

이 스키마가 "검색 규칙"입니다. 이제 입력이 들어오면 이 규칙을 통과시켜야 하는데, 방법이 두 가지입니다. 바로 \`parse()\`와 \`safeParse()\`입니다.

## parse() — 문을 부수는 경비원

\`parse()\`는 규칙 위반을 발견하면 즉시 예외(Exception)를 **던집니다(throw)**. 마치 ID를 보여주지 않으면 문을 부수는 경비원처럼요.

\`\`\`typescript
// ❌ parse() — 규칙 위반 시 예외 발생
const data = requestSchema.parse(body);
// body가 잘못됐으면? → ZodError throw → catch 없으면 → 500 에러
\`\`\`

예외가 던져진 다음에는 두 가지 경로가 있습니다. 첫째, 누군가가 \`try...catch\`로 잡아주면 안전하게 처리할 수 있습니다. 둘째, 아무도 잡지 않으면 예외가 서버 전체로 올라가서 **500 Internal Server Error**가 됩니다.

Next.js App Router의 API 라우트는 잡히지 않은 예외를 500으로 처리합니다. 그래서 \`parse()\`를 \`try...catch\` 없이 쓰면 잘못된 입력이 들어올 때마다 서버 탓으로 보이는 에러가 납니다.

> **WARNING:** 500 에러는 "서버가 잘못했다"는 신호입니다. 사용자는 자신의 입력이 문제인지 알 수 없고, 로그를 보는 개발자도 원인 추적이 어렵습니다. 보안 관점에서도 예외 스택 트레이스가 응답에 노출될 위험이 있습니다.

## safeParse() — 정중하게 돌려보내는 경비원

\`safeParse()\`는 완전히 다르게 동작합니다. 규칙 위반을 발견해도 예외를 던지지 않습니다. 대신 결과를 **객체로 포장해서 반환**합니다.

\`\`\`typescript
// ✅ safeParse() — 예외 없이 결과 객체 반환
const parsed = requestSchema.safeParse(body);

if (!parsed.success) {
  // 규칙 위반: 400 에러로 안전하게 처리
  return NextResponse.json(
    { error: parsed.error.flatten() },
    { status: 400 }
  );
}

// 여기서부터 parsed.data는 타입이 안전하게 확정됨
const { name, age, email } = parsed.data;
\`\`\`

반환되는 객체의 구조는 단순합니다:

| 경우 | 반환 값 |
|------|---------|
| 검증 성공 | \`{ success: true, data: 검증된_값 }\` |
| 검증 실패 | \`{ success: false, error: ZodError }\` |

실패했을 때 \`error.flatten()\`을 쓰면 어느 필드에서 왜 실패했는지 구체적인 메시지를 사용자에게 돌려줄 수 있습니다.

---

## 왜 AI는 parse()를 선택할까

여기서 자연스러운 의문이 생깁니다. safeParse()가 더 안전한데, 왜 AI가 생성한 코드에는 parse()가 더 자주 보일까요?

이유는 세 가지입니다.

**첫째, 코드가 더 짧습니다.** parse()는 한 줄이면 됩니다. safeParse()는 성공/실패 분기 처리 때문에 5~8줄이 필요합니다. AI 코드 생성 모델은 간결한 코드를 선호하는 경향이 있습니다.

**둘째, 타입 추론이 즉시 됩니다.** \`const data = schema.parse(input)\`를 쓰면 \`data\`의 타입이 바로 확정됩니다. safeParse()는 \`if (!parsed.success)\` 분기를 통과해야만 \`parsed.data\`의 타입이 좁혀집니다. 타입스크립트 숙련도가 낮으면 safeParse()의 타입 흐름이 복잡하게 느껴집니다.

**셋째, 학습 데이터 편향입니다.** 인터넷의 많은 Zod 예제 코드가 parse()를 씁니다. 에러 처리 없는 짧은 예제가 더 많이 공유되기 때문입니다. AI 모델은 이 패턴을 학습합니다.

> **TIP:** AI가 생성한 API 코드를 받았을 때, \`schema.parse(\`가 보이면 즉시 \`schema.safeParse(\`로 바꾸는 습관을 들이세요. 코드베이스 전체 검색으로 점검할 수 있습니다.

## 500 vs 400 — 사용자에게 어떤 의미인가

에러 코드는 단순한 숫자가 아닙니다. HTTP 상태 코드는 **누구의 잘못인지**를 나타내는 약속입니다.

| 코드 | 의미 | 누구 탓 | 사용자가 할 수 있는 것 |
|------|------|---------|----------------------|
| 400 Bad Request | 요청이 잘못됨 | 클라이언트(사용자) | 입력을 고쳐서 다시 시도 |
| 500 Internal Server Error | 서버가 처리 실패 | 서버(개발자) | 없음 (기다리는 것 외에) |

parse()로 검증 실패를 처리하지 않으면, 사용자의 실수(잘못된 이름, 빠진 이메일)가 500 에러로 포장됩니다. 사용자는 "내가 뭘 잘못 입력했는지"가 아니라 "서버가 고장났다"고 느낍니다. 재시도를 할 이유를 잃습니다.

safeParse()를 쓰면 검증 실패는 400으로 정확하게 전달됩니다. \`error.flatten()\`의 결과를 그대로 응답에 담으면 "이메일 형식이 올바르지 않습니다" 같은 구체적인 메시지도 줄 수 있습니다.

---

## Linkmap의 API 5단계 패턴

Linkmap 프로젝트는 모든 API 라우트에 이 원칙을 명문화했습니다. 프로젝트 규칙에 기재된 5단계 패턴입니다:

\`\`\`
1. getUser()       — 인증 확인 (로그인한 사용자인가?)
2. safeParse()     — 입력 검증 (데이터가 올바른 형식인가?)
3. 소유권 확인    — 권한 확인 (이 리소스에 접근 권한이 있는가?)
4. 비즈니스 로직  — 실제 처리
5. logAudit()      — 감사 로그 기록
\`\`\`

2단계에 \`safeParse()\`가 명시된 이유는 단순합니다. 이 단계에서 검증을 실패하면 반드시 400을 돌려보내야 하고, 예외가 3~5단계로 올라가면 안 됩니다.

실제 코드에서는 이렇게 씁니다:

\`\`\`typescript
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createItemSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  projectId: z.string().uuid(),
});

export async function POST(req: Request) {
  // 1단계: 인증 확인
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: '인증이 필요합니다' }, { status: 401 });
  }

  // 2단계: safeParse로 입력 검증
  const body = await req.json();
  const parsed = createItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // 3~5단계: 소유권 확인 → 비즈니스 로직 → 감사 로그
  const { title, description, projectId } = parsed.data;
  // ...
}
\`\`\`

이 패턴을 따르면 어떤 이상한 입력이 들어와도 500 에러는 나지 않습니다. 검증 실패는 400, 인증 실패는 401, 권한 없음은 403. 각각의 상황에 맞는 에러 코드가 정확하게 반환됩니다.

> **TIP:** [Linkmap](https://www.linkmap.biz)에서 프로젝트를 관리하면 어떤 API 키가 어떤 서비스에 연결됐는지 시각적으로 추적할 수 있습니다. API가 많아질수록 환경변수 관리가 복잡해지는데, 서비스맵으로 전체 연결 구조를 한눈에 볼 수 있습니다.

## 지금 바로 할 수 있는 체크리스트

글을 읽은 뒤 바로 점검해볼 수 있는 항목입니다.

- [x] 내 프로젝트에 Zod가 설치돼 있는지 확인 (\`package.json\`에서 \`"zod"\` 검색)
- [x] 입력 검증이 없는 API 라우트가 있는지 파악
- [ ] \`schema.parse(\`를 프로젝트 전체에서 검색해 safeParse로 교체
- [ ] 교체 후 \`if (!parsed.success)\` 분기에서 status 400 반환 추가
- [ ] \`parsed.error.flatten()\`을 응답 본문에 포함해 구체적 메시지 제공
- [ ] API 라우트 최상단에 인증 확인(getUser) 순서 점검

> **TRY:** [Linkmap](https://www.linkmap.biz)에서 무료로 프로젝트를 만들어 보세요. GitHub 저장소를 연결하면 프로젝트에 연결된 외부 서비스들이 시각적으로 정리됩니다. API 라우트가 어떤 서비스를 호출하는지 파악하면, 검증이 꼭 필요한 엔드포인트가 어디인지도 보입니다. [무료로 시작하기](https://www.linkmap.biz/signup)

---

*백엔드 API 구조에 대해 더 알고 싶다면 [백엔드 가이드](/guides/backend)를, API 키를 안전하게 보관하는 방법은 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요.*
`;
