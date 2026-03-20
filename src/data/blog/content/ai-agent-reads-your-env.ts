export const content = `> **KEY:** AI 코딩 에이전트(AI Coding Agent)는 프로젝트 디렉터리 전체를 컨텍스트로 읽으며, 여기에는 .env 파일의 시크릿도 포함됩니다. Knostic 연구에 따르면 AI 앱의 72%에 하드코딩된 시크릿이 있으며, 앱당 평균 5.1개의 시크릿이 노출되어 있습니다.

## AI 코딩 에이전트의 파일 접근 범위 — 당신이 모르는 사실

![AI 코딩 에이전트의 .env 파일 접근 경로](/blog/diagrams/ai-agent-env-access.png)

Claude Code, Cursor, GitHub Copilot, Windsurf 같은 AI 코딩 에이전트는 코드를 이해하기 위해 프로젝트 파일을 읽습니다. 그런데 그 범위가 어디까지인지 정확히 아는 개발자는 많지 않습니다.

대부분의 AI 에이전트는 프로젝트 루트의 모든 파일을 컨텍스트로 수집합니다. .gitignore에 등록된 파일도, .env 파일도 예외가 아닙니다. 에이전트가 "프로젝트를 분석"하는 순간 DATABASE_URL, OPENAI_API_KEY, SUPABASE_SERVICE_ROLE_KEY 같은 시크릿이 모델 컨텍스트 안으로 들어갑니다.

> **WARNING:** .gitignore에 .env를 등록해도 AI 에이전트의 로컬 파일 접근을 막지 못합니다. .gitignore는 Git 추적에서만 제외할 뿐, 로컬 파일 시스템 접근 권한과는 무관합니다.

## Knostic 연구: Claude Code, Cursor의 .env 자동 로드 메커니즘

보안 연구소 Knostic이 2025년 발표한 연구에서 주요 AI 코딩 에이전트의 파일 접근 패턴을 분석한 결과, 충격적인 수치가 나왔습니다.

분석 대상 AI 앱의 **72%에 하드코딩된 시크릿**이 존재했으며, 앱당 평균 **5.1개의 시크릿**이 코드베이스 어딘가에 노출된 상태였습니다. 이 중 상당수는 AI 에이전트가 코드를 생성하는 과정에서 .env 값을 실수로 코드에 삽입하거나, 에이전트의 컨텍스트 창에 평문으로 전달된 경우였습니다.

Claude Code의 경우, 기본 설정에서 프로젝트 루트를 기준으로 파일을 탐색하며 .env, .env.local, .env.production 등을 자동으로 인식합니다. Cursor는 \`@workspace\` 명령 시 전체 파일 트리를 인덱싱하는데, 이 과정에서 .env 내용이 포함될 수 있습니다.

## CVE-2025-55284: Claude Code DNS 유출 취약점의 실체

2025년에 공개된 CVE-2025-55284는 Claude Code의 DNS 기반 정보 유출 취약점입니다. 특정 조건에서 AI 에이전트가 처리 중인 데이터(환경변수 포함)가 DNS 쿼리를 통해 외부로 유출될 수 있다는 내용입니다.

같은 시기 Cursor에서도 CVE-2025-54135가 발견되었습니다. 악의적으로 조작된 프로젝트 파일을 통해 임의 명령을 실행할 수 있는 취약점으로, 공격자가 .env 내용을 탈취하는 벡터로 활용될 수 있습니다.

> **INFO:** CVE(Common Vulnerabilities and Exposures)는 공식 보안 취약점 데이터베이스입니다. [CVE-2025-55284](https://nvd.nist.gov/vuln/detail/CVE-2025-55284)와 CVE-2025-54135는 AI 코딩 도구 생태계에서 발견된 최초의 주요 시크릿 유출 관련 CVE로 기록되었습니다. [Knostic 연구 원문](https://knostic.ai/blog/ai-coding-agents-security)에서 상세 분석을 확인할 수 있습니다.

## AI 시대의 시크릿 격리 전략 4가지

AI 에이전트의 파일 접근을 막는 가장 근본적인 방법은 **시크릿을 프로젝트 디렉터리 밖으로 꺼내는 것**입니다.

**전략 1: 시스템 환경변수 사용**
.env 파일 대신 OS 레벨 환경변수를 사용하면 AI 에이전트가 파일로 접근할 수 없습니다. \`export DATABASE_URL=...\`을 셸 프로파일(.bashrc, .zshrc)에 등록하거나, 운영체제의 환경변수 관리 UI를 활용합니다.

**전략 2: .env 파일 권한 제한**
\`chmod 600 .env\`로 파일 권한을 소유자 읽기 전용으로 설정합니다. 일부 AI 에이전트는 권한이 제한된 파일의 내용을 컨텍스트에 포함하지 않습니다.

**전략 3: AI 에이전트 무시 파일 설정**
Claude Code는 \`.claudeignore\` 파일을 지원하며, Cursor는 \`.cursorignore\`를 통해 특정 파일을 인덱싱에서 제외할 수 있습니다. .env를 이 파일에 명시적으로 추가하세요.

**전략 4: 중앙 집중형 시크릿 관리 도구 전환**
가장 확실한 방법은 .env 파일 자체를 없애는 것입니다. [Linkmap](https://www.linkmap.biz)의 환경변수 관리 기능은 AES-256-GCM으로 암호화된 시크릿을 중앙 서버에 저장하고, 런타임 시 안전하게 주입합니다. 프로젝트 디렉터리에는 시크릿이 존재하지 않으므로 AI 에이전트가 접근할 파일 자체가 없습니다.

---

## 환경변수를 코드에서 완전히 분리하는 방법

코드와 시크릿의 분리는 Twelve-Factor App 방법론의 핵심 원칙(Factor III: Config)입니다. AI 코딩 에이전트 시대에는 이 원칙이 선택이 아닌 필수가 되었습니다.

실전 체크리스트:

- [x] .claudeignore / .cursorignore에 .env 추가
- [x] .env.production, .env.staging 등 환경별 파일 모두 포함
- [ ] 시크릿 관리 도구로 전환 (.env 파일 삭제)
- [ ] 런타임 주입 방식으로 변경 (빌드 타임 하드코딩 제거)
- [ ] 팀 전체 .env 공유 관행 중단

[Linkmap 환경변수 관리](https://www.linkmap.biz/services)는 암호화 저장 + 감사 로그 + GitHub Secrets 동기화를 한 번에 제공합니다. [환경변수 완전 정복 가이드](/guides/env)에서 전환 절차를 단계별로 안내합니다. [Supabase 가이드](/guides/supabase)에서는 Supabase 시크릿을 안전하게 관리하는 방법도 확인할 수 있습니다.

AI 에이전트가 코드를 잘 만들어줄수록, 시크릿 관리는 더 엄격해야 합니다. 에이전트는 당신의 프로젝트를 이해하기 위해 최대한 많은 파일을 읽으려 합니다. 그 경계를 설정하는 것은 개발자의 몫입니다. [Linkmap 서비스 연결 현황](https://www.linkmap.biz/services)에서 128개 서비스의 시크릿 관리 패턴을 확인하세요.

> **TRY:** .env 파일을 삭제하고 싶다면 [Linkmap 무료로 시작하기](https://www.linkmap.biz/signup)에서 암호화 환경변수 관리를 무료로 체험해보세요. AI 에이전트가 읽을 수 없는 구조로 시크릿을 관리합니다.

---

*시크릿 유출 대응 방법은 [API 키 유출 대응 가이드](/blog/api-key-leaked-what-to-do)를, 환경변수 기초는 [환경변수 완전 정복 가이드](/guides/env)를 참고하세요.*`;
