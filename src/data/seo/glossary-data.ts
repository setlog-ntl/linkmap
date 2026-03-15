export interface GlossaryTerm {
  term: string;
  termEn: string;
  definition: string;
  definitionEn: string;
  category: 'core' | 'auth' | 'infra' | 'ai' | 'frontend' | 'backend' | 'devops';
}

export const GLOSSARY_CATEGORIES: Record<string, string> = {
  core: '핵심 개념',
  auth: '인증·보안',
  infra: '인프라·배포',
  ai: 'AI·머신러닝',
  frontend: '프론트엔드',
  backend: '백엔드',
  devops: 'DevOps',
};

export const GLOSSARY_DATA: GlossaryTerm[] = [
  // 핵심 개념
  { term: '바이브 코딩', termEn: 'Vibe Coding', definition: 'AI에게 자연어로 원하는 기능을 설명하면 AI가 코드를 생성해주는 개발 방식. 코딩 경험 없이도 앱을 만들 수 있다.', definitionEn: 'A development approach where you describe what you want in natural language and AI generates the code.', category: 'core' },
  { term: '환경변수', termEn: 'Environment Variable', definition: '앱 실행에 필요한 설정값(API 키, DB URL 등)을 코드 외부의 .env 파일에 저장하는 방법. 보안과 환경별 설정 분리에 필수.', definitionEn: 'Configuration values stored outside code in .env files, essential for security and environment-specific settings.', category: 'core' },
  { term: 'API 키', termEn: 'API Key', definition: '외부 서비스(OpenAI, Supabase 등)에 접근하기 위한 인증 문자열. 절대 코드에 직접 넣지 말고 환경변수로 관리해야 한다.', definitionEn: 'An authentication string for accessing external services. Must be stored as environment variables, never hardcoded.', category: 'core' },
  { term: 'API', termEn: 'Application Programming Interface', definition: '서로 다른 소프트웨어가 통신하는 규약. REST API는 HTTP 요청으로 데이터를 주고받으며, 대부분의 외부 서비스가 API를 제공한다.', definitionEn: 'A set of rules for software communication. REST APIs use HTTP requests to exchange data.', category: 'core' },
  { term: 'SDK', termEn: 'Software Development Kit', definition: '특정 서비스를 쉽게 사용하도록 만든 코드 라이브러리. npm install로 설치하여 API를 직접 호출하는 대신 편리한 함수를 사용할 수 있다.', definitionEn: 'A code library that simplifies using a service, installed via npm install.', category: 'core' },

  // 인증·보안
  { term: 'OAuth', termEn: 'Open Authorization', definition: '비밀번호를 직접 공유하지 않고 제3자 서비스(Google, GitHub 등)를 통해 로그인하는 표준 프로토콜. "Google로 로그인" 버튼이 대표적.', definitionEn: 'A standard protocol for logging in via third-party services without sharing passwords.', category: 'auth' },
  { term: 'JWT', termEn: 'JSON Web Token', definition: '사용자 인증 정보를 담은 토큰. Header·Payload·Signature 3부분으로 구성되며, 서버가 사용자를 식별할 때 사용한다.', definitionEn: 'A token containing user authentication info, composed of Header, Payload, and Signature.', category: 'auth' },
  { term: 'RLS', termEn: 'Row Level Security', definition: 'Supabase/PostgreSQL의 행 단위 접근 제어. "자기 데이터만 읽기/쓰기" 같은 정책을 DB 레벨에서 강제하여 API 우회를 차단한다.', definitionEn: 'Row-level access control in PostgreSQL that enforces data ownership policies at the database level.', category: 'auth' },
  { term: 'AES-256-GCM', termEn: 'AES-256-GCM', definition: '256비트 키를 사용하는 대칭 암호화 알고리즘. GCM 모드는 암호화와 무결성 검증을 동시에 제공한다. Linkmap이 API 키 암호화에 사용.', definitionEn: 'A symmetric encryption algorithm with 256-bit keys. GCM mode provides both encryption and integrity verification.', category: 'auth' },
  { term: 'CORS', termEn: 'Cross-Origin Resource Sharing', definition: '브라우저가 다른 도메인의 리소스를 요청할 때 적용되는 보안 정책. 서버에서 허용할 도메인을 명시해야 한다.', definitionEn: 'A browser security policy for cross-domain requests. The server must specify allowed origins.', category: 'auth' },

  // 인프라·배포
  { term: 'CDN', termEn: 'Content Delivery Network', definition: '전 세계 서버에 콘텐츠를 분산 저장하여 사용자와 가까운 서버에서 빠르게 전달하는 네트워크. Cloudflare, Vercel Edge Network가 대표적.', definitionEn: 'A network that distributes content globally for faster delivery from the nearest server.', category: 'infra' },
  { term: 'DNS', termEn: 'Domain Name System', definition: '도메인 이름(linkmap.biz)을 IP 주소로 변환하는 시스템. A 레코드, CNAME 등의 레코드 타입이 있다.', definitionEn: 'A system that translates domain names to IP addresses using record types like A and CNAME.', category: 'infra' },
  { term: 'Edge Computing', termEn: 'Edge Computing', definition: '사용자와 가까운 서버(엣지)에서 코드를 실행하는 방식. Cloudflare Workers, Vercel Edge Functions가 대표적이며 응답 속도가 빠르다.', definitionEn: 'Running code on servers close to users for faster response times.', category: 'infra' },
  { term: 'CI/CD', termEn: 'Continuous Integration/Deployment', definition: '코드 변경을 자동으로 테스트(CI)하고 배포(CD)하는 파이프라인. GitHub Actions, Vercel 자동 배포가 대표적.', definitionEn: 'Automated pipelines that test (CI) and deploy (CD) code changes.', category: 'devops' },
  { term: 'Docker', termEn: 'Docker', definition: '앱과 실행 환경을 컨테이너로 패키징하는 도구. 어디서든 동일한 환경에서 앱을 실행할 수 있게 한다.', definitionEn: 'A tool that packages apps and their runtime in containers for consistent execution anywhere.', category: 'devops' },

  // AI
  { term: 'LLM', termEn: 'Large Language Model', definition: '방대한 텍스트로 학습한 대규모 언어 모델. GPT-4o, Claude, Gemini 등이 있으며, 코드 생성·번역·요약 등 다양한 작업을 수행한다.', definitionEn: 'A large language model trained on vast text data, capable of code generation, translation, and summarization.', category: 'ai' },
  { term: '프롬프트 엔지니어링', termEn: 'Prompt Engineering', definition: 'AI에게 원하는 결과를 얻기 위해 입력(프롬프트)을 설계하는 기술. 바이브 코딩의 핵심 역량이다.', definitionEn: 'The skill of designing inputs to get desired AI outputs, a core competency in vibe coding.', category: 'ai' },
  { term: 'RAG', termEn: 'Retrieval-Augmented Generation', definition: '외부 데이터를 검색한 뒤 그 결과를 LLM에 전달하여 답변을 생성하는 기법. AI 환각(hallucination)을 줄인다.', definitionEn: 'A technique that retrieves external data before generating LLM responses to reduce hallucinations.', category: 'ai' },
  { term: '벡터 데이터베이스', termEn: 'Vector Database', definition: '텍스트·이미지를 수치 벡터로 변환하여 유사도 검색하는 DB. Weaviate, Qdrant, Chroma 등이 있으며 RAG 파이프라인에 사용된다.', definitionEn: 'A database that stores and searches data as numerical vectors for similarity matching.', category: 'ai' },

  // 프론트엔드
  { term: 'SSR', termEn: 'Server-Side Rendering', definition: '서버에서 HTML을 미리 생성하여 브라우저에 전달하는 방식. SEO에 유리하고 초기 로딩이 빠르다. Next.js의 기본 렌더링 방식.', definitionEn: 'Generating HTML on the server before sending to the browser, beneficial for SEO and initial load.', category: 'frontend' },
  { term: 'SSG', termEn: 'Static Site Generation', definition: '빌드 시점에 HTML을 미리 생성하는 방식. 블로그, 문서 사이트처럼 내용이 자주 바뀌지 않는 페이지에 적합하다.', definitionEn: 'Pre-generating HTML at build time, ideal for pages with infrequent content changes.', category: 'frontend' },
  { term: 'CSR', termEn: 'Client-Side Rendering', definition: '브라우저에서 JavaScript가 실행되며 화면을 그리는 방식. 인터랙티브한 UI에 적합하지만 초기 로딩이 느리고 SEO에 불리하다.', definitionEn: 'Rendering in the browser via JavaScript, suited for interactive UIs but slower initial load.', category: 'frontend' },
  { term: '컴포넌트', termEn: 'Component', definition: 'UI를 독립적인 조각으로 나눈 재사용 가능한 단위. React에서 함수형 컴포넌트로 작성하며, props로 데이터를 전달한다.', definitionEn: 'A reusable, independent piece of UI. In React, written as functional components with props.', category: 'frontend' },
  { term: 'Tailwind CSS', termEn: 'Tailwind CSS', definition: 'HTML에 직접 유틸리티 클래스를 적용하는 CSS 프레임워크. className="text-lg font-bold"처럼 사용한다.', definitionEn: 'A utility-first CSS framework applied directly in HTML via class names.', category: 'frontend' },

  // 백엔드
  { term: 'BaaS', termEn: 'Backend as a Service', definition: '백엔드 인프라(DB, 인증, 파일 저장)를 서비스로 제공하는 플랫폼. Supabase, Firebase가 대표적이며 서버 코드 없이 백엔드를 구축할 수 있다.', definitionEn: 'A platform providing backend infrastructure as a service, enabling serverless backend development.', category: 'backend' },
  { term: 'REST API', termEn: 'RESTful API', definition: 'HTTP 메서드(GET, POST, PUT, DELETE)로 리소스를 조작하는 API 설계 스타일. 대부분의 웹 서비스가 REST API를 제공한다.', definitionEn: 'An API design style using HTTP methods to manipulate resources.', category: 'backend' },
  { term: 'Webhook', termEn: 'Webhook', definition: '특정 이벤트 발생 시 서버가 자동으로 HTTP 요청을 보내는 메커니즘. Stripe 결제 완료, GitHub push 이벤트 알림에 사용된다.', definitionEn: 'A mechanism where servers send HTTP requests automatically when events occur.', category: 'backend' },
  { term: 'ORM', termEn: 'Object-Relational Mapping', definition: '프로그래밍 객체와 DB 테이블을 매핑하는 기술. Prisma, Drizzle이 대표적이며 SQL을 직접 작성하지 않아도 된다.', definitionEn: 'A technique mapping programming objects to database tables, eliminating direct SQL writing.', category: 'backend' },
  { term: 'Serverless', termEn: 'Serverless', definition: '서버 관리 없이 함수 단위로 코드를 실행하는 컴퓨팅 모델. AWS Lambda, Cloudflare Workers가 대표적이며 사용한 만큼만 과금된다.', definitionEn: 'A computing model running code as functions without server management, billed per use.', category: 'backend' },

  // DevOps
  { term: 'Git', termEn: 'Git', definition: '코드 변경 이력을 추적하는 버전 관리 시스템. 브랜치로 독립적 개발, 머지로 통합, 커밋으로 변경 사항을 기록한다.', definitionEn: 'A version control system tracking code changes via branches, merges, and commits.', category: 'devops' },
  { term: 'GitHub', termEn: 'GitHub', definition: 'Git 저장소를 클라우드에서 호스팅하는 플랫폼. 코드 협업, PR 리뷰, Actions(CI/CD), Secrets(환경변수) 관리 등을 제공한다.', definitionEn: 'A cloud platform for Git repositories, offering collaboration, PR reviews, CI/CD, and secrets management.', category: 'devops' },
  { term: 'GitHub Secrets', termEn: 'GitHub Secrets', definition: 'GitHub 저장소에 암호화된 환경변수를 저장하는 기능. CI/CD 파이프라인에서 API 키를 안전하게 사용할 수 있다. Linkmap에서 자동 배포 가능.', definitionEn: 'Encrypted environment variables stored in GitHub repositories for secure CI/CD usage.', category: 'devops' },
  { term: 'Monorepo', termEn: 'Monorepo', definition: '여러 프로젝트를 하나의 저장소에서 관리하는 전략. Turborepo, Nx가 대표적이며 코드 공유와 일관된 빌드가 장점.', definitionEn: 'A strategy managing multiple projects in a single repository using tools like Turborepo or Nx.', category: 'devops' },
];
