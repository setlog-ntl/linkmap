export const content = `> **KEY:** 바이브 코딩 앱의 보안 취약점은 AI가 "작동하는 코드"를 우선시하기 때문에 발생합니다. 2025년 연구에 따르면 AI가 생성한 코드의 45%에 보안 결함이 존재하며, XSS 방어 실패가 86%, SQL 인젝션 취약점이 20%에 달합니다. 프로덕션 배포 전 이 15가지를 직접 확인해야 합니다.

## 15개 앱 69개 취약점 — 가장 흔한 5가지 패턴

[Invicti의 2025년 연구](https://www.invicti.com/blog/web-security/vibe-coding-security-checklist-how-to-secure-ai-generated-apps)에서 바이브 코딩 앱 15개를 분석한 결과 69개의 취약점이 발견되었고, 그 중 6개는 치명적(Critical) 등급이었습니다.

| 패턴 | 발생 비율 | 위험 수준 |
|------|---------|---------|
| XSS 방어 누락 | 86% | 높음 |
| 인증 없는 API 엔드포인트 | 과반수 | 심각 |
| SQL 인젝션 취약점 | 20% | 심각 |
| 환경변수 클라이언트 노출 | 다수 | 높음 |
| RLS 미설정 (Supabase) | 10.3%+ | 심각 |

![바이브 코딩 앱 취약점 5가지](/blog/diagrams/vulnerability-patterns-chart.png)

> **WARNING:** 바이브 코딩으로 만든 앱을 "AI가 다 알아서 해줬으니 안전하다"고 가정하는 것이 가장 위험합니다. AI는 보안 감사를 수행하지 않습니다.

## 체크리스트 Part 1: 인증 & 인가

**1. 모든 보호된 라우트에 인증 미들웨어가 있는가** — 로그인 없이 /dashboard, /settings, /api/* 직접 접근 시 401이 아닌 200 응답이 오면 인증 누락입니다.

**2. Supabase RLS가 모든 테이블에 활성화되어 있는가** — [CVE-2025-48757](/blog/supabase-rls-vibe-coding-risk)에서 확인된 것처럼 RLS 미설정은 전체 데이터베이스 노출로 이어집니다.

**3. RLS 정책이 user_id 소유권을 검증하는가** — RLS가 활성화되어 있어도 정책이 \`true\`로만 설정된 경우 모든 사용자가 타인 데이터에 접근 가능합니다.

**4. SUPABASE_SERVICE_ROLE_KEY가 서버에서만 사용되는가** — service_role key는 RLS를 우회합니다. \`NEXT_PUBLIC_\` 접두사가 붙으면 즉시 위험합니다.

**5. 세션 만료 및 토큰 갱신이 처리되어 있는가** — AI가 생성한 코드는 초기 로그인만 처리하고 세션 만료를 무시하는 경우가 많습니다.

---

## 체크리스트 Part 2: 입력 & 출력

**6. 모든 API 입력에 Zod safeParse가 적용되어 있는가** — AI가 생성하는 API 라우트는 입력 검증 없이 \`req.body\`를 직접 사용하는 경우가 흔합니다.

\`\`\`
나쁜 패턴:
  const { name } = await req.json(); // 검증 없음

올바른 패턴:
  const result = schema.safeParse(await req.json());
  if (!result.success) return new Response('Bad Request', { status: 400 });
\`\`\`

**7. 사용자 입력이 그대로 렌더링되지 않는가** — React는 기본적으로 XSS를 방어하지만, \`dangerouslySetInnerHTML\`을 사용하는 코드가 있다면 즉시 제거하세요.

**8. ORM이나 파라미터화된 쿼리를 사용하는가** — AI가 raw SQL을 생성할 때 사용자 입력을 문자열 연결로 처리하면 SQL 인젝션이 가능합니다.

> **INFO:** Supabase JavaScript SDK는 내부적으로 파라미터화된 쿼리를 사용하기 때문에 \`.from('table').select().eq('id', id)\` 패턴은 SQL 인젝션으로부터 안전합니다.

## 체크리스트 Part 3: 환경변수 & 시크릿

**9. 서버 전용 키에 NEXT_PUBLIC_ 접두사가 없는가** — \`OPENAI_API_KEY\`, \`STRIPE_SECRET_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\`는 절대로 공개되어서는 안 됩니다.

**10. .env 파일이 Git에 커밋되지 않았는가** — \`git log --all --full-history -- .env\`로 히스토리를 확인하세요.

**11. 환경변수가 암호화 저장소에서 관리되는가** — [Linkmap](https://www.linkmap.biz)은 모든 환경변수를 **AES-256-GCM**으로 암호화하여 저장하고, GitHub Secrets에 1클릭으로 동기화합니다.

> **TIP:** [환경변수 완전 정복 가이드](/guides/env)에서 개발·스테이징·프로덕션 환경별 키 분리 방법을 확인할 수 있습니다.

---

## 체크리스트 Part 4: 배포 & 운영

**12. API 라우트에 CORS 설정이 올바른가** — \`Access-Control-Allow-Origin: *\`으로 모든 출처를 허용하는 경우가 있습니다. 허용 도메인을 명시하세요.

**13. Rate Limiting이 적용되어 있는가** — 인증 관련 엔드포인트에 Rate Limit이 없으면 무차별 대입 공격에 취약합니다.

**14. 에러 메시지에 내부 정보가 노출되지 않는가** — DB 스키마, 파일 경로, 스택 트레이스가 API 응답에 포함되면 공격자에게 유용한 정보가 됩니다.

**15. 민감한 작업에 감사 로그가 남는가** — 로그인, 데이터 삭제, 결제 등 중요한 이벤트는 감사 로그가 있어야 합니다.

> **TIP:** [Linkmap의 감사 로그](https://www.linkmap.biz)는 환경변수 접근·변경·삭제 이력을 모두 기록합니다.

## 배포 전 최종 체크리스트

- [x] Supabase RLS 활성화 + user_id 정책 확인
- [x] SUPABASE_SERVICE_ROLE_KEY 서버 전용 사용 확인
- [ ] 모든 API 라우트 인증 미들웨어 확인
- [ ] Zod safeParse 입력 검증 적용 여부 확인
- [ ] .env 파일 Git 히스토리 노출 여부 확인
- [ ] NEXT_PUBLIC_ 접두사 오용 여부 확인
- [ ] CORS, Rate Limiting, 에러 메시지 점검

> **TRY:** 이 체크리스트를 CI 파이프라인에 포함하세요. 환경변수와 API 키 보안은 [Linkmap 무료 플랜](https://www.linkmap.biz/signup)으로 시작하세요. 프로젝트 3개, 환경변수 50개까지 무료입니다.

---

*인증 설정 전반은 [인증 가이드](/guides/auth)를, Supabase RLS 사례는 [Supabase RLS 미설정](/blog/supabase-rls-vibe-coding-risk)을 참고하세요.*
`;
