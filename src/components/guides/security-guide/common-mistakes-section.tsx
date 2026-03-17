'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, Terminal, Globe, ShieldAlert } from 'lucide-react';

const mistakes = [
  {
    icon: KeyRound,
    title: 'API 키 하드코딩',
    description: 'API 키를 코드에 직접 넣으면 GitHub에 올라가는 순간 전 세계에 공개됩니다.',
    bad: `// 나쁜 예시
const apiKey = "sk-abc123...xyz";
const res = await fetch("https://api.openai.com/v1/chat", {
  headers: { Authorization: \`Bearer \${apiKey}\` }
});`,
    good: `// 좋은 예시
const apiKey = process.env.OPENAI_API_KEY;
const res = await fetch("https://api.openai.com/v1/chat", {
  headers: { Authorization: \`Bearer \${apiKey}\` }
});`,
    tagColor: 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400',
  },
  {
    icon: Terminal,
    title: 'console.log로 토큰 출력',
    description: '디버깅용으로 토큰을 console.log에 출력하면 브라우저 콘솔에서 누구나 볼 수 있습니다.',
    bad: `// 나쁜 예시
const token = await getAccessToken();
console.log("token:", token);  // 브라우저 콘솔에 노출!
await callAPI(token);`,
    good: `// 좋은 예시
const token = await getAccessToken();
// console.log 대신 의미 있는 상태만 로깅
console.log("API 호출 시작");
await callAPI(token);
console.log("API 호출 성공");`,
    tagColor: 'bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400',
  },
  {
    icon: Globe,
    title: 'CORS를 *로 설정',
    description: 'Access-Control-Allow-Origin: * 는 모든 사이트에서 API를 호출할 수 있게 허용합니다.',
    bad: `// 나쁜 예시 — 모든 출처 허용
res.setHeader("Access-Control-Allow-Origin", "*");
res.setHeader("Access-Control-Allow-Credentials", "true");`,
    good: `// 좋은 예시 — 허용 출처를 명시
const ALLOWED = ["https://myapp.com", "https://staging.myapp.com"];
const origin = req.headers.get("origin") ?? "";
if (ALLOWED.includes(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin);
}`,
    tagColor: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400',
  },
  {
    icon: ShieldAlert,
    title: '입력값 미검증',
    description: '사용자 입력을 검증 없이 그대로 사용하면 SQL Injection, XSS 등의 공격에 노출됩니다.',
    bad: `// 나쁜 예시 — 검증 없이 그대로 사용
export async function POST(req: Request) {
  const body = await req.json();
  // body.email이 실제 이메일인지 확인하지 않음
  await db.insert(users).values({ email: body.email });
}`,
    good: `// 좋은 예시 — Zod로 입력 검증
import { z } from "zod";
const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const body = await req.json();
  const result = schema.safeParse(body);
  if (!result.success) return Response.json({ error: "잘못된 입력" }, { status: 400 });
  await db.insert(users).values({ email: result.data.email });
}`,
    tagColor: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400',
  },
];

export function CommonMistakesSection() {
  return (
    <section id="common-mistakes" className="scroll-mt-24 py-12 md:py-16">
      <ScrollReveal>
        <h2 className="text-2xl md:text-3xl font-bold mb-3">흔한 보안 실수 4가지</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
          AI와 함께 코딩할 때 가장 많이 발생하는 보안 실수입니다.
          각각 <strong className="text-foreground">나쁜 예시</strong>와 <strong className="text-foreground">좋은 예시</strong>를 비교해보세요.
        </p>
      </ScrollReveal>

      <div className="space-y-6 max-w-3xl">
        {mistakes.map((mistake, idx) => (
          <ScrollReveal key={mistake.title} delay={idx * 0.08}>
            <Card className="overflow-hidden">
              <CardHeader className={`pb-2 ${mistake.tagColor}`}>
                <div className="flex items-center gap-2">
                  <mistake.icon className="h-4 w-4" />
                  <CardTitle className="text-sm">{mistake.title}</CardTitle>
                </div>
                <p className="text-xs text-muted-foreground">{mistake.description}</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* 나쁜 예시 */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="text-xs font-semibold text-red-600 dark:text-red-400">나쁜 예시</span>
                    </div>
                    <pre className="text-[10px] sm:text-xs bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-3 overflow-x-auto leading-relaxed">
                      <code>{mistake.bad}</code>
                    </pre>
                  </div>
                  {/* 좋은 예시 */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-semibold text-green-600 dark:text-green-400">좋은 예시</span>
                    </div>
                    <pre className="text-[10px] sm:text-xs bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3 overflow-x-auto leading-relaxed">
                      <code>{mistake.good}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
