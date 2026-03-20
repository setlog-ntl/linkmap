export const content = `> **KEY:** Supabase RLS(Row Level Security)가 꺼진 데이터베이스는 anon key를 아는 누구나 전체 테이블을 읽고 쓸 수 있는 공개 API와 같습니다. AI는 작동하는 코드를 만드는 데 집중하기 때문에 RLS를 빠뜨리는 경우가 많습니다.

## CVE-2025-48757: 170개 앱이 한꺼번에 뚫린 날

2025년 5월, 보안 연구자 Matt Palmer는 [CVE-2025-48757](https://mattpalmer.io/posts/2025/05/CVE-2025-48757/)을 공개했습니다. AI 기반 앱 빌더 [Lovable](https://lovable.dev)로 만든 앱 1,645개를 분석한 결과, **170개(10.3%)** 에서 RLS 미설정으로 인한 심각한 데이터 노출이 확인됐습니다.

노출된 데이터는 실명, 이메일, 전화번호 같은 개인정보와 결제 정보, 거래 내역, 그리고 Google Maps·Stripe·Gemini API 키 같은 크리덴셜까지 포함되어 있었습니다. 피해 추정 비용은 2,000만~3,500만 달러입니다.

> **WARNING:** CVE-2025-48757는 Lovable만의 문제가 아닙니다. Cursor, Claude, v0, Bolt 등 어떤 AI 도구로 만든 Supabase 앱이든 RLS를 직접 설정하지 않으면 동일한 위험에 노출됩니다.

## 왜 AI는 RLS를 빠뜨리는가 — LLM의 보안 컨텍스트 한계

첫째, **AI는 "작동하는 코드"를 목표로 합니다.** RLS가 없어도 기능은 정상 동작합니다. 개발 환경에서는 anon key로 테이블을 읽고 쓰는 것이 편리하기 때문에, AI는 이 상태로 코드를 완성합니다.

둘째, **보안 정책은 코드 파일이 아닌 Supabase 대시보드에서 설정합니다.** 마이그레이션 SQL을 생성해도 \`enable row level security\`와 정책 정의를 누락하면 의미가 없습니다.

셋째, **반복적인 수정 과정에서 RLS가 지워질 수 있습니다.** "데이터가 안 불러와진다"는 프롬프트에 AI가 RLS를 임시로 비활성화하는 코드를 제안하고, 그 상태로 배포되는 경우가 있습니다.

> **INFO:** [Supabase 공식 문서](https://supabase.com/docs/guides/database/postgres/row-level-security)는 새 테이블을 만들 때 항상 RLS를 활성화할 것을 권장합니다.

## RLS가 꺼진 Supabase는 공개 API와 같다

Supabase는 PostgreSQL 위에 REST API를 자동 생성합니다. anon key는 공개된 키로, 브라우저 소스 코드에서 확인할 수 있습니다.

![Supabase RLS ON vs OFF 비교](/blog/diagrams/rls-on-off-comparison.png)

---

## 바이브 코더를 위한 Supabase 보안 체크리스트 7가지

**1. RLS 활성화 여부 확인** — Supabase 대시보드 → Table Editor → 각 테이블의 방패 아이콘이 빨간색이면 RLS가 꺼진 상태입니다.

**2. RLS 정책이 실제로 동작하는지 테스트** — 로그인한 사용자로, 비로그인 상태로 각각 테스트하세요.

**3. anon key의 권한 범위 확인** — 공개 데이터만 anon으로 읽을 수 있어야 합니다.

**4. service_role key를 클라이언트에 노출하지 않는다** — \`NEXT_PUBLIC_\` 접두사와 함께 노출되면 모든 RLS 정책이 무력화됩니다.

**5. 인증 없는 쓰기 작업 차단** — 회원가입, 주문, 결제 등 쓰기 작업은 반드시 \`auth.uid()\`가 존재하는 인증된 사용자만 실행할 수 있도록 설정하세요.

**6. 데이터 소유권 정책 추가** — 모든 사용자 데이터 테이블에 \`user_id = auth.uid()\` 조건을 포함한 정책을 추가하세요.

**7. Supabase 보안 어드바이저 실행** — Database → Database Health에서 보안 어드바이저를 실행하면 RLS 미설정, 인덱스 누락, 권한 이슈를 자동으로 감지합니다.

> **TIP:** AI에게 RLS 마이그레이션을 요청할 때는 "RLS를 활성화하고 인증된 사용자만 자신의 데이터에 접근할 수 있는 정책도 함께 생성해줘"라고 명시적으로 요청하세요.

## RLS + API 이중 방어: Linkmap이 선택한 아키텍처

[Linkmap](https://www.linkmap.biz)은 바이브 코딩으로 시작한 프로덕션 서비스이지만, 보안 아키텍처는 RLS 하나에 의존하지 않습니다. **RLS + API 레벨 user_id 이중 방어** 구조입니다.

![API 라우트 보안 5단계 패턴](/blog/diagrams/api-5step-pipeline.png)

RLS만으로는 부족합니다. RLS 정책에 논리 오류가 있거나, 새 테이블에 정책 추가를 깜빡했거나, service_role을 잘못 사용하는 경우에 API 레벨 방어가 마지막 보호막이 됩니다.

> **TRY:** 지금 프로젝트의 Supabase 대시보드를 열고 Table Editor에서 RLS 상태를 확인하세요. 환경변수와 API 키 보안이 걱정된다면 [Linkmap](https://www.linkmap.biz/signup)으로 AES-256-GCM 암호화 저장소를 무료로 시작하세요.

---

*Supabase 설정 전반은 [Supabase 시작하기 가이드](/guides/supabase)를, 프로덕션 배포 전 전체 보안 점검은 [바이브 코딩 보안 체크리스트](/blog/vibe-coding-security-checklist)를 참고하세요.*
`;
