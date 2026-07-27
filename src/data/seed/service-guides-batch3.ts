import type { ServiceGuideSeed } from './service-guides';

// ---------------------------------------------------------------------------
// Service ID constants (Batch 3 - AI/ML)
// ---------------------------------------------------------------------------
const S = {
  anthropic:      '10000000-0000-4000-a000-000000000011',
  google_gemini:  '10000000-0000-4000-a000-000000000053',
  claude_code:    '10000000-0000-4000-a000-000000000052',
  groq:           '10000000-0000-4000-a000-000000000037',
  replicate:      '10000000-0000-4000-a000-000000000068',
  huggingface:    '10000000-0000-4000-a000-000000000069',
  stability_ai:   '10000000-0000-4000-a000-000000000070',
  pinecone:       '10000000-0000-4000-a000-000000000066',
  langchain:      '10000000-0000-4000-a000-000000000067',
  elevenlabs:     '10000000-0000-4000-a000-000000000044',
  github_copilot: '10000000-0000-4000-a000-000000000081',
  cursor:         '10000000-0000-4000-a000-000000000082',
};

export const serviceGuidesBatch3: ServiceGuideSeed[] = [
  // -------------------------------------------------------------------------
  // 1. Anthropic (Claude)
  // -------------------------------------------------------------------------
  {
    service_id: S.anthropic,
    quick_start: 'Anthropic API 키를 발급받고 @anthropic-ai/sdk를 설치하여 Claude 모델로 텍스트 생성, 도구 호출, 비전 처리를 즉시 시작할 수 있습니다.',
    quick_start_en: 'Get your Anthropic API key and install @anthropic-ai/sdk to instantly start generating text, calling tools, and processing images with Claude models.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Anthropic SDK',
        title_ko: 'Anthropic SDK 설치',
        description: 'Install the official Anthropic TypeScript SDK',
        description_ko: '공식 Anthropic TypeScript SDK 설치',
        code_snippet: 'npm install @anthropic-ai/sdk',
      },
      {
        step: 2,
        title: 'Set API key',
        title_ko: 'API 키 설정',
        description: 'Add your Anthropic API key to environment variables',
        description_ko: 'Anthropic API 키를 환경변수에 추가',
        code_snippet: `# .env
ANTHROPIC_API_KEY=sk-ant-api03-...`,
      },
      {
        step: 3,
        title: 'Send first message',
        title_ko: '첫 메시지 전송',
        description: 'Create an Anthropic client and call the messages API',
        description_ko: 'Anthropic 클라이언트를 생성하고 messages API 호출',
        code_snippet: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const message = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello, Claude!' }],
});
console.log(message.content[0].text);`,
      },
    ],
    code_examples: {
      typescript: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Basic text generation
const response = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  system: 'You are a helpful assistant.',
  messages: [{ role: 'user', content: 'Explain TypeScript generics briefly.' }],
});
console.log(response.content[0].text);

// Streaming
const stream = await client.messages.stream({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
});
for await (const chunk of stream) {
  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
    process.stdout.write(chunk.delta.text);
  }
}

// Vision (image input)
const visionResponse = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 1024,
  messages: [{
    role: 'user',
    content: [
      { type: 'image', source: { type: 'url', url: 'https://example.com/image.png' } },
      { type: 'text', text: 'What is in this image?' },
    ],
  }],
});`,
    },
    common_pitfalls: [
      {
        title: 'Exposing API key in client code',
        title_ko: '클라이언트 코드에 API 키 노출',
        problem: 'Using ANTHROPIC_API_KEY directly in browser-side code exposes the key to users',
        solution: 'Always call the Anthropic API from a server-side route (e.g., Next.js API route or Server Action). Never use the key in client components.',
        code: `// app/api/chat/route.ts (server-only)
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic(); // reads ANTHROPIC_API_KEY on server`,
      },
      {
        title: 'Ignoring token limits',
        title_ko: '토큰 한도 무시',
        problem: 'max_tokens too low causes incomplete responses; context window exceeded causes API errors',
        solution: 'Set max_tokens appropriate for the expected response length and monitor input/output token counts from the response usage field',
        code: `// Check usage after each call
console.log(response.usage); // { input_tokens: 42, output_tokens: 128 }`,
      },
      {
        title: 'Not handling rate limit errors',
        title_ko: '속도 제한 오류 미처리',
        problem: 'Concurrent or rapid requests exceed API rate limits, causing 429 errors',
        solution: 'Implement exponential backoff or use the SDK\'s built-in retry option',
        code: `const client = new Anthropic({ maxRetries: 3 });`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'langchain',
        tip: 'Use @langchain/anthropic package to integrate Claude into LangChain chains and agents with full tool-calling and structured output support',
        tip_ko: '@langchain/anthropic 패키지로 Claude를 LangChain 체인과 에이전트에 통합하여 도구 호출 및 구조화된 출력 지원',
        code: `import { ChatAnthropic } from '@langchain/anthropic';
const model = new ChatAnthropic({ model: 'claude-opus-4-5' });`,
      },
      {
        with_service_slug: 'pinecone',
        tip: 'Combine Claude embeddings (via third-party) with Pinecone vector search to build a RAG pipeline where Claude answers questions grounded in your own documents',
        tip_ko: 'Pinecone 벡터 검색과 Claude를 결합해 자체 문서 기반 RAG 파이프라인 구성',
      },
    ],
    pros: [
      { text: 'Excellent instruction-following and long-context reasoning (up to 200K tokens)', text_ko: '뛰어난 명령 수행 및 긴 컨텍스트 추론 (최대 200K 토큰)' },
      { text: 'First-class tool use (function calling) and structured JSON output', text_ko: '최고 수준의 도구 사용(함수 호출) 및 구조화된 JSON 출력' },
      { text: 'Built-in vision and PDF parsing capabilities', text_ko: '내장 비전 및 PDF 파싱 기능' },
    ],
    cons: [
      { text: 'Higher cost per token compared to some competitors', text_ko: '일부 경쟁 서비스 대비 토큰당 비용이 높음' },
      { text: 'No free tier — requires credit card even for evaluation', text_ko: '무료 플랜 없음 — 평가 단계에서도 결제 수단 필요' },
    ],
    api_key_url: 'https://platform.claude.com/settings/keys',
    api_key_url_label: 'Claude Platform Console',
  },

  // -------------------------------------------------------------------------
  // 2. Google Gemini
  // -------------------------------------------------------------------------
  {
    service_id: S.google_gemini,
    quick_start: 'Google AI Studio에서 API 키를 발급받고 @google/genai SDK를 설치하여 멀티모달 텍스트·이미지·오디오 생성을 바로 시작할 수 있습니다.',
    quick_start_en: 'Get an API key from Google AI Studio and install @google/genai SDK to start multimodal text, image, and audio generation immediately.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Google GenAI SDK',
        title_ko: 'Google GenAI SDK 설치',
        description: 'Install the official Google Generative AI JavaScript/TypeScript SDK',
        description_ko: '공식 Google Generative AI JS/TS SDK 설치',
        code_snippet: 'npm install @google/genai',
      },
      {
        step: 2,
        title: 'Set API key',
        title_ko: 'API 키 설정',
        description: 'Add your Gemini API key from Google AI Studio to environment variables',
        description_ko: 'Google AI Studio에서 발급한 Gemini API 키를 환경변수에 추가',
        code_snippet: `# .env
GEMINI_API_KEY=AIza...`,
      },
      {
        step: 3,
        title: 'Generate content',
        title_ko: '콘텐츠 생성',
        description: 'Initialize the client and call generateContent',
        description_ko: '클라이언트를 초기화하고 generateContent 호출',
        code_snippet: `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Explain machine learning in simple terms.',
});
console.log(response.text);`,
      },
    ],
    code_examples: {
      typescript: `import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Text generation (Gemini 2.5 Flash — best price-performance)
const text = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Write a one-paragraph summary of quantum computing.',
});
console.log(text.text);

// Multimodal: image + text
const vision = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: [
    { inlineData: { mimeType: 'image/jpeg', data: base64ImageData } },
    'Describe what you see in this image.',
  ],
});
console.log(vision.text);

// Chat session (stateful)
const chat = ai.chats.create({ model: 'gemini-2.5-flash' });
const reply = await chat.sendMessage({ message: 'What is 2+2?' });
console.log(reply.text);

// Streaming
const stream = await ai.models.generateContentStream({
  model: 'gemini-2.5-flash',
  contents: 'Tell me a story.',
});
for await (const chunk of stream) {
  process.stdout.write(chunk.text ?? '');
}`,
    },
    common_pitfalls: [
      {
        title: 'Using deprecated @google/generative-ai package',
        title_ko: '구버전 패키지 사용',
        problem: 'The old @google/generative-ai package is deprecated; new projects should use @google/genai',
        solution: 'Install @google/genai (GA since May 2025) for production use. Migrate existing code by updating imports and client initialization patterns.',
        code: `// Deprecated (old)
import { GoogleGenerativeAI } from '@google/generative-ai';
// Current (GA)
import { GoogleGenAI } from '@google/genai';`,
      },
      {
        title: 'Calling Gemini API directly from the browser',
        title_ko: '브라우저에서 직접 API 호출',
        problem: 'Calling Gemini API from browser-side code exposes the API key to users',
        solution: 'For production apps, proxy requests through your server. For prototyping only, browser-side usage is acceptable.',
      },
      {
        title: 'Exceeding free-tier rate limits',
        title_ko: '무료 플랜 속도 제한 초과',
        problem: 'Free tier has strict RPM/RPD limits that are easy to hit during development',
        solution: 'Implement request queuing or caching for repeated identical prompts. Upgrade to pay-as-you-go for production.',
      },
      {
        title: 'Using deprecated gemini-2.0-flash model',
        title_ko: '폐기된 gemini-2.0-flash 모델 사용',
        problem: 'gemini-2.0-flash and gemini-2.0-flash-lite were deprecated and have been shut down since June 1, 2026',
        solution: 'Migrate to gemini-2.5-flash (stable) or the GA gemini-3.5-flash for new projects.',
        code: `// Deprecated — shut down 2026-06-01
model: 'gemini-2.0-flash'
// Recommended replacement
model: 'gemini-2.5-flash'`,
      },
      {
        title: 'Unexpected grounding costs',
        title_ko: 'Grounding 비용 미인지',
        problem: 'Google Search grounding is billed separately at $14/1,000 queries after free tier',
        solution: 'Only enable grounding when real-time web data is needed. Monitor usage in AI Studio billing dashboard.',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'langchain',
        tip: 'Use @langchain/google-genai package to integrate Gemini into LangChain pipelines, supporting chat, embeddings, and structured output',
        tip_ko: '@langchain/google-genai 패키지로 Gemini를 LangChain 파이프라인에 통합 — 채팅, 임베딩, 구조화 출력 지원',
        code: `import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
const model = new ChatGoogleGenerativeAI({ model: 'gemini-2.5-flash' });`,
      },
      {
        with_service_slug: 'pinecone',
        tip: 'Use gemini-embedding-001 to generate embeddings and store in Pinecone for semantic search and RAG applications',
        tip_ko: 'gemini-embedding-001로 임베딩을 생성하고 Pinecone에 저장하여 의미 검색·RAG 구현',
        code: `const embeddingResult = await ai.models.embedContent({
  model: 'gemini-embedding-001',
  contents: 'Your text here',
});
const vector = embeddingResult.embeddings[0].values;`,
      },
    ],
    pros: [
      { text: 'Generous free tier with no credit card required (AI Studio)', text_ko: '결제 수단 없이 사용 가능한 넉넉한 무료 플랜 (AI Studio)' },
      { text: 'Native multimodal support (text, image, audio, video, PDF)', text_ko: '텍스트·이미지·오디오·비디오·PDF 네이티브 멀티모달 지원' },
      { text: 'Up to 1M token context window (Gemini 2.5 Pro)', text_ko: '최대 100만 토큰 초장문 컨텍스트 (Gemini 2.5 Pro)' },
      { text: 'Image/video/music generation via single API (Imagen 4, Veo 3.1, Lyria)', text_ko: '이미지/비디오/음악 생성을 단일 API로 통합 (Imagen 4, Veo 3.1, Lyria)' },
      { text: 'OpenAI-compatible API endpoint for easy migration', text_ko: 'OpenAI 호환 API 엔드포인트로 기존 코드 마이그레이션 용이' },
      { text: 'Batch API offers 50% cost reduction for bulk processing', text_ko: 'Batch API로 대량 처리 시 50% 비용 절감' },
      { text: 'Build Mode enables vibe coding — create apps with natural language', text_ko: 'Build Mode로 자연어만으로 앱 프로토타이핑 가능' },
    ],
    cons: [
      { text: 'Pay-as-you-go pricing can escalate quickly with high token usage', text_ko: '높은 토큰 사용량 시 종량제 비용이 빠르게 증가' },
      { text: 'API surface and model lifecycle change frequently — monitor changelog', text_ko: 'API 인터페이스와 모델 수명주기가 자주 변경 — changelog 모니터링 필수' },
      { text: 'Free tier data may be used to improve Google products', text_ko: '무료 티어 데이터가 Google 제품 개선에 사용될 수 있음' },
      { text: 'Some Gemini 3 series models (e.g., Gemini 3.1 Pro, Gemini 3 Flash) remain in Preview — verify GA status before production use', text_ko: '일부 Gemini 3 시리즈 모델(예: Gemini 3.1 Pro, Gemini 3 Flash)은 아직 Preview 상태 — 프로덕션 적용 전 GA 여부 확인 필요' },
    ],
    api_key_url: 'https://aistudio.google.com/app/apikey',
    api_key_url_label: 'Google AI Studio',
  },

  // -------------------------------------------------------------------------
  // 3. Claude Code
  // -------------------------------------------------------------------------
  {
    service_id: S.claude_code,
    quick_start: 'npm으로 Claude Code CLI를 전역 설치하고 Anthropic API 키를 설정하면 터미널에서 바로 AI 기반 코딩 어시스턴트를 사용할 수 있습니다.',
    quick_start_en: 'Install the Claude Code CLI globally via npm and set your Anthropic API key to start using an AI coding assistant directly in your terminal.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Claude Code CLI',
        title_ko: 'Claude Code CLI 설치',
        description: 'Install the Claude Code CLI tool globally',
        description_ko: 'Claude Code CLI 도구 전역 설치',
        code_snippet: 'npm install -g @anthropic-ai/claude-code',
      },
      {
        step: 2,
        title: 'Authenticate',
        title_ko: '인증',
        description: 'Run the login command to authenticate with your Anthropic account or API key',
        description_ko: 'Anthropic 계정 또는 API 키로 인증',
        code_snippet: 'claude',
      },
      {
        step: 3,
        title: 'Start coding with Claude',
        title_ko: 'Claude와 코딩 시작',
        description: 'Launch an interactive session or pass a task inline',
        description_ko: '대화형 세션 시작 또는 인라인 작업 전달',
        code_snippet: `# Interactive mode
claude

# One-shot task
claude -p "Add error handling to all async functions in src/"`,
      },
    ],
    code_examples: {
      typescript: `// Using Claude Code SDK programmatically
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

// Claude Code uses the standard messages API under the hood.
// For agentic coding tasks, combine tool_use with file operations.
const result = await client.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 4096,
  tools: [
    {
      name: 'str_replace_editor',
      description: 'Edit files by replacing specific strings',
      input_schema: {
        type: 'object' as const,
        properties: {
          path: { type: 'string' },
          old_str: { type: 'string' },
          new_str: { type: 'string' },
        },
        required: ['path', 'old_str', 'new_str'],
      },
    },
  ],
  messages: [{
    role: 'user',
    content: 'Refactor the getUser function in src/lib/users.ts to use async/await',
  }],
});`,
      bash: `# CLI usage examples

# Ask Claude to explain a file
claude -p "Explain what this file does" src/lib/auth.ts

# Fix a bug interactively
claude

# Run a one-off task non-interactively
claude --no-interactive -p "Write unit tests for src/utils/format.ts"`,
    },
    common_pitfalls: [
      {
        title: 'Running Claude Code in project root without context',
        title_ko: '컨텍스트 없이 프로젝트 루트에서 실행',
        problem: 'Claude Code works best when it has access to CLAUDE.md, README, and relevant source files',
        solution: 'Add a CLAUDE.md file at the project root to give Claude persistent context about conventions, architecture, and patterns',
      },
      {
        title: 'Allowing unrestricted file writes',
        title_ko: '무제한 파일 쓰기 허용',
        problem: 'Without review, Claude Code may modify files you did not intend to change',
        solution: 'Use --no-auto-edit flag during evaluation, or review diffs carefully before approving each change',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'anthropic',
        tip: 'Claude Code is powered by the Anthropic API. Set ANTHROPIC_API_KEY in your environment to use your own API quota and access the latest models',
        tip_ko: 'Claude Code는 Anthropic API로 구동됩니다. ANTHROPIC_API_KEY 환경변수를 설정하면 자체 API 쿼터와 최신 모델을 사용할 수 있습니다',
      },
      {
        with_service_slug: 'github',
        tip: 'Use Claude Code inside a GitHub Actions workflow to automate code review, test generation, or documentation updates on every PR',
        tip_ko: 'GitHub Actions 워크플로우 내에서 Claude Code를 사용하여 PR마다 코드 리뷰, 테스트 생성, 문서 업데이트를 자동화',
      },
    ],
    pros: [
      { text: 'Deep codebase understanding — reads files, runs commands, and makes changes autonomously', text_ko: '코드베이스 깊은 이해 — 파일 읽기·명령 실행·변경을 자율적으로 수행' },
      { text: 'Works in any terminal with no IDE dependency', text_ko: 'IDE 의존 없이 모든 터미널에서 동작' },
    ],
    cons: [
      { text: 'Consumes Anthropic API tokens — can be costly for large codebases', text_ko: 'Anthropic API 토큰 소비 — 대형 코드베이스에서 비용이 증가할 수 있음' },
      { text: 'Autonomous file edits require careful review to avoid unintended changes', text_ko: '자율 파일 편집 시 의도치 않은 변경을 방지하기 위한 세심한 검토 필요' },
    ],
    api_key_url: 'https://platform.claude.com/settings/keys',
    api_key_url_label: 'Claude Platform Console',
  },

  // -------------------------------------------------------------------------
  // 4. Groq
  // -------------------------------------------------------------------------
  {
    service_id: S.groq,
    quick_start: 'Groq Console에서 API 키를 발급받고 groq-sdk를 설치하면 LLaMA, Mistral 등 오픈소스 모델을 초고속 추론으로 즉시 사용할 수 있습니다.',
    quick_start_en: 'Get an API key from the Groq Console and install groq-sdk to instantly run open-source models like LLaMA and Mistral with ultra-low latency inference.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Groq SDK',
        title_ko: 'Groq SDK 설치',
        description: 'Install the official Groq Node.js/TypeScript SDK',
        description_ko: '공식 Groq Node.js/TypeScript SDK 설치',
        code_snippet: 'npm install groq-sdk',
      },
      {
        step: 2,
        title: 'Set API key',
        title_ko: 'API 키 설정',
        description: 'Add your Groq API key to environment variables',
        description_ko: 'Groq API 키를 환경변수에 추가',
        code_snippet: `# .env
GROQ_API_KEY=gsk_...`,
      },
      {
        step: 3,
        title: 'Run inference',
        title_ko: '추론 실행',
        description: 'Create a Groq client and make a chat completion request',
        description_ko: 'Groq 클라이언트를 생성하고 채팅 완성 요청',
        code_snippet: `import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const completion = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: 'Explain why Groq is fast.' }],
});
console.log(completion.choices[0].message.content);`,
      },
    ],
    code_examples: {
      typescript: `import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Chat completion
const completion = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [
    { role: 'system', content: 'You are a concise coding assistant.' },
    { role: 'user', content: 'Write a TypeScript function to debounce a callback.' },
  ],
  temperature: 0.7,
  max_tokens: 512,
});
console.log(completion.choices[0].message.content);

// Streaming
const stream = await groq.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [{ role: 'user', content: 'Tell me a short story.' }],
  stream: true,
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}`,
    },
    common_pitfalls: [
      {
        title: 'Model ID format errors',
        title_ko: '모델 ID 형식 오류',
        problem: 'Groq model IDs are specific strings that change as new versions are released',
        solution: 'Always check https://console.groq.com/docs/models for current model IDs. Avoid hardcoding — store model IDs in a config constant.',
        code: `const MODELS = {
  fast: 'llama-3.1-8b-instant',
  balanced: 'llama-3.3-70b-versatile',
} as const;`,
      },
      {
        title: 'Free tier context window limits',
        title_ko: '무료 플랜 컨텍스트 창 제한',
        problem: 'Free tier limits context windows and requests per minute more strictly than the paid tier',
        solution: 'Truncate conversation history to fit the context window and implement a simple token counter or character estimator',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'langchain',
        tip: 'Use @langchain/groq package to plug Groq into LangChain chains for fast, low-cost LLM inference in agentic workflows',
        tip_ko: '@langchain/groq 패키지로 Groq를 LangChain 체인에 연결하여 에이전트 워크플로우에서 빠르고 저렴한 LLM 추론 구현',
        code: `import { ChatGroq } from '@langchain/groq';
const model = new ChatGroq({ model: 'llama-3.3-70b-versatile' });`,
      },
      {
        with_service_slug: 'anthropic',
        tip: 'Use Groq for high-throughput, latency-sensitive tasks (e.g., real-time chat) and Claude for complex reasoning tasks — route requests based on complexity',
        tip_ko: '실시간 채팅 등 지연 민감 작업은 Groq, 복잡한 추론 작업은 Claude로 분리하여 요청 라우팅',
      },
    ],
    pros: [
      { text: 'Fastest LLM inference available (LPU hardware) — sub-second responses', text_ko: '가장 빠른 LLM 추론 (LPU 하드웨어) — 1초 미만 응답' },
      { text: 'OpenAI-compatible API — minimal code changes to migrate', text_ko: 'OpenAI 호환 API — 최소한의 코드 변경으로 마이그레이션 가능' },
      { text: 'Generous free tier for development and prototyping', text_ko: '개발 및 프로토타이핑을 위한 넉넉한 무료 플랜' },
    ],
    cons: [
      { text: 'Limited model selection — only curated open-source models', text_ko: '제한된 모델 선택 — 선별된 오픈소스 모델만 제공' },
      { text: 'No fine-tuning or custom model deployment', text_ko: '파인튜닝 또는 커스텀 모델 배포 불가' },
    ],
    api_key_url: 'https://console.groq.com/keys',
    api_key_url_label: 'Groq Console',
  },

  // -------------------------------------------------------------------------
  // 5. Replicate
  // -------------------------------------------------------------------------
  {
    service_id: S.replicate,
    quick_start: 'Replicate API 토큰을 발급받고 replicate npm 패키지를 설치하면 수천 개의 공개 AI 모델(이미지·비디오·오디오·언어)을 단 몇 줄의 코드로 실행할 수 있습니다.',
    quick_start_en: 'Get a Replicate API token and install the replicate npm package to run thousands of public AI models (image, video, audio, language) in just a few lines of code.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Replicate SDK',
        title_ko: 'Replicate SDK 설치',
        description: 'Install the official Replicate JavaScript client',
        description_ko: '공식 Replicate JavaScript 클라이언트 설치',
        code_snippet: 'npm install replicate',
      },
      {
        step: 2,
        title: 'Set API token',
        title_ko: 'API 토큰 설정',
        description: 'Add your Replicate API token to environment variables',
        description_ko: 'Replicate API 토큰을 환경변수에 추가',
        code_snippet: `# .env
REPLICATE_API_TOKEN=r8_...`,
      },
      {
        step: 3,
        title: 'Run a model',
        title_ko: '모델 실행',
        description: 'Call replicate.run() with a model identifier and input parameters',
        description_ko: 'replicate.run()에 모델 식별자와 입력 파라미터를 전달하여 실행',
        code_snippet: `import Replicate from 'replicate';

const replicate = new Replicate();

const output = await replicate.run(
  'stability-ai/stable-diffusion-3.5-large',
  { input: { prompt: 'A futuristic city at sunset, photorealistic' } }
);
console.log(output); // URL(s) to generated image(s)`,
      },
    ],
    code_examples: {
      typescript: `import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Image generation
const imageOutput = await replicate.run(
  'stability-ai/stable-diffusion-3.5-large',
  {
    input: {
      prompt: 'A serene Japanese garden with cherry blossoms',
      negative_prompt: 'blurry, distorted',
      num_inference_steps: 28,
    },
  }
) as string[];
console.log(imageOutput[0]); // image URL

// Language model
const textOutput = await replicate.run(
  'meta/meta-llama-3-70b-instruct',
  {
    input: {
      prompt: 'Explain REST APIs to a 10-year-old.',
      max_new_tokens: 256,
    },
  }
);
console.log((textOutput as string[]).join(''));

// Streaming predictions
for await (const event of replicate.stream('meta/meta-llama-3-8b-instruct', {
  input: { prompt: 'Write a poem about TypeScript.' },
})) {
  process.stdout.write(String(event));
}`,
    },
    common_pitfalls: [
      {
        title: 'Cold start delays on rarely-used models',
        title_ko: '드물게 사용되는 모델의 콜드 스타트 지연',
        problem: 'Models not recently run are "cold" and take 30–120 seconds to boot before returning results',
        solution: 'Use warm deployments for production workloads, or set a webhook to receive results asynchronously instead of polling',
        code: `// Use webhooks for async results
const prediction = await replicate.predictions.create({
  version: 'model-version-id',
  input: { prompt: '...' },
  webhook: 'https://your-app.com/api/replicate-webhook',
  webhook_events_filter: ['completed'],
});`,
      },
      {
        title: 'Not pinning model versions',
        title_ko: '모델 버전 고정 미적용',
        problem: 'Using the latest model tag means outputs can change when the model owner updates it',
        solution: 'Always pin to a specific version hash in production',
        code: `// Pinned version (recommended for production)
await replicate.run('stability-ai/sdxl:39ed52f2319...', { input: { prompt: '...' } });`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'supabase',
        tip: 'Store Replicate prediction IDs and output URLs in Supabase to track generation history and serve results to users without re-running the model',
        tip_ko: 'Replicate 예측 ID와 출력 URL을 Supabase에 저장하여 생성 이력 추적 및 모델 재실행 없이 결과 제공',
      },
      {
        with_service_slug: 'stability-ai',
        tip: 'Replicate hosts Stability AI models (SDXL, SD3.5) alongside hundreds of community alternatives — compare outputs and switch models without changing client code',
        tip_ko: 'Replicate은 Stability AI 모델과 수백 개의 커뮤니티 모델을 함께 제공 — 클라이언트 코드 변경 없이 모델 비교·전환 가능',
      },
    ],
    pros: [
      { text: 'Thousands of open-source AI models available with a single unified API', text_ko: '단일 통합 API로 수천 개의 오픈소스 AI 모델 사용 가능' },
      { text: 'Pay-per-second billing — no minimum commitment', text_ko: '초 단위 청구 — 최소 약정 없음' },
      { text: 'Supports custom model deployment and fine-tuning via Cog', text_ko: 'Cog를 통한 커스텀 모델 배포 및 파인튜닝 지원' },
    ],
    cons: [
      { text: 'Cold starts can make it unsuitable for latency-sensitive production use cases', text_ko: '콜드 스타트로 인해 지연 민감 프로덕션 환경에 부적합할 수 있음' },
      { text: 'No SLA on free/individual tier', text_ko: '무료/개인 플랜에는 SLA 없음' },
    ],
    api_key_url: 'https://replicate.com/account/api-tokens',
    api_key_url_label: 'Replicate Account',
  },

  // -------------------------------------------------------------------------
  // 6. Hugging Face
  // -------------------------------------------------------------------------
  {
    service_id: S.huggingface,
    quick_start: 'Hugging Face 액세스 토큰을 발급받고 @huggingface/inference를 설치하면 수십만 개의 오픈소스 ML 모델을 즉시 호출할 수 있습니다.',
    quick_start_en: 'Get a Hugging Face access token and install @huggingface/inference to instantly call hundreds of thousands of open-source ML models.',
    setup_steps: [
      {
        step: 1,
        title: 'Install HF Inference SDK',
        title_ko: 'HF Inference SDK 설치',
        description: 'Install the Hugging Face inference JavaScript library',
        description_ko: 'Hugging Face 추론 JavaScript 라이브러리 설치',
        code_snippet: 'npm install @huggingface/inference',
      },
      {
        step: 2,
        title: 'Set access token',
        title_ko: '액세스 토큰 설정',
        description: 'Add your Hugging Face access token to environment variables',
        description_ko: 'Hugging Face 액세스 토큰을 환경변수에 추가',
        code_snippet: `# .env
HF_TOKEN=hf_...`,
      },
      {
        step: 3,
        title: 'Run inference',
        title_ko: '추론 실행',
        description: 'Create an InferenceClient and call a model',
        description_ko: 'InferenceClient를 생성하고 모델 호출',
        code_snippet: `import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(process.env.HF_TOKEN);

const result = await hf.textGeneration({
  model: 'meta-llama/Meta-Llama-3-8B-Instruct',
  inputs: 'What is the capital of France?',
  parameters: { max_new_tokens: 100 },
});
console.log(result.generated_text);`,
      },
    ],
    code_examples: {
      typescript: `import { InferenceClient } from '@huggingface/inference';

const hf = new InferenceClient(process.env.HF_TOKEN);

// Text generation
const gen = await hf.textGeneration({
  model: 'mistralai/Mistral-7B-Instruct-v0.3',
  inputs: '<s>[INST] Write a haiku about programming. [/INST]',
  parameters: { max_new_tokens: 80 },
});
console.log(gen.generated_text);

// Feature extraction (embeddings)
const embeddings = await hf.featureExtraction({
  model: 'sentence-transformers/all-MiniLM-L6-v2',
  inputs: 'Semantic search with embeddings',
});
console.log(embeddings); // number[]

// Image classification
const labels = await hf.imageClassification({
  model: 'google/vit-base-patch16-224',
  data: imageBlob,
});
console.log(labels); // [{ label: 'cat', score: 0.97 }, ...]

// Text-to-image (Serverless)
const image = await hf.textToImage({
  model: 'stabilityai/stable-diffusion-xl-base-1.0',
  inputs: 'A photorealistic landscape',
});
// image is a Blob — save or convert to base64`,
    },
    common_pitfalls: [
      {
        title: 'Model loading timeout on cold start',
        title_ko: '콜드 스타트 시 모델 로딩 타임아웃',
        problem: 'Serverless Inference API loads models on demand; the first request may time out with a 503',
        solution: 'Retry with exponential backoff or check the model\'s loading status before querying',
        code: `// Check if model is loaded
const status = await hf.getModelStatus('model-name');
if (status.state !== 'Loaded') await sleep(5000);`,
      },
      {
        title: 'Using serverless API for gated models without accepting terms',
        title_ko: '이용 약관 미동의 상태에서 게이티드 모델 사용',
        problem: 'Models like Llama require accepting the license on the Hugging Face website before API access',
        solution: 'Visit the model page on huggingface.co, accept the license, then use the same token in your API calls',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'langchain',
        tip: 'Use @langchain/community HuggingFaceInference class to integrate HF models into LangChain chains for RAG, summarization, and classification pipelines',
        tip_ko: '@langchain/community의 HuggingFaceInference 클래스로 HF 모델을 LangChain 체인에 통합하여 RAG·요약·분류 파이프라인 구성',
        code: `import { HuggingFaceInference } from '@langchain/community/llms/hf';
const model = new HuggingFaceInference({ model: 'gpt2', apiKey: process.env.HF_TOKEN });`,
      },
      {
        with_service_slug: 'pinecone',
        tip: 'Generate embeddings with HF sentence-transformers models and store them in Pinecone for low-cost, high-quality semantic search',
        tip_ko: 'HF sentence-transformers 모델로 임베딩을 생성하고 Pinecone에 저장하여 저비용 고품질 의미 검색 구현',
      },
    ],
    pros: [
      { text: 'Access to 900,000+ open-source models across every ML task', text_ko: '모든 ML 작업에 걸쳐 90만 개 이상의 오픈소스 모델 이용 가능' },
      { text: 'Free Serverless Inference API for prototyping', text_ko: '프로토타이핑을 위한 무료 서버리스 추론 API' },
      { text: 'Hub for datasets, model cards, and Spaces demos', text_ko: '데이터셋, 모델 카드, Spaces 데모 허브' },
    ],
    cons: [
      { text: 'Serverless API not suitable for production — rate-limited and unstable', text_ko: '서버리스 API는 프로덕션 부적합 — 속도 제한 및 불안정' },
      { text: 'Dedicated Inference Endpoints are expensive for low-traffic use cases', text_ko: '전용 추론 엔드포인트는 저트래픽 환경에서 비용 과다' },
    ],
    api_key_url: 'https://huggingface.co/settings/tokens',
    api_key_url_label: 'Hugging Face Tokens',
  },

  // -------------------------------------------------------------------------
  // 7. Stability AI
  // -------------------------------------------------------------------------
  {
    service_id: S.stability_ai,
    quick_start: 'Stability AI Platform에서 API 키를 발급받고 REST API 또는 stability-ai npm 패키지를 사용하여 Stable Diffusion 기반 고품질 이미지 생성을 시작할 수 있습니다.',
    quick_start_en: 'Get an API key from Stability AI Platform and use the REST API or stability-ai npm package to start generating high-quality images with Stable Diffusion.',
    setup_steps: [
      {
        step: 1,
        title: 'Get API key',
        title_ko: 'API 키 발급',
        description: 'Create an account on Stability AI Platform and generate an API key',
        description_ko: 'Stability AI Platform에서 계정을 생성하고 API 키 발급',
        code_snippet: `# .env
STABILITY_API_KEY=sk-...`,
      },
      {
        step: 2,
        title: 'Install SDK (optional)',
        title_ko: 'SDK 설치 (선택)',
        description: 'Install the stability-ai npm package or use the REST API directly',
        description_ko: 'stability-ai npm 패키지 설치 또는 REST API 직접 사용',
        code_snippet: 'npm install stability-ai',
      },
      {
        step: 3,
        title: 'Generate an image',
        title_ko: '이미지 생성',
        description: 'Call the Stable Image Core or Ultra API to generate images',
        description_ko: 'Stable Image Core 또는 Ultra API를 호출하여 이미지 생성',
        code_snippet: `import StabilityAI from 'stability-ai';

const stability = new StabilityAI(process.env.STABILITY_API_KEY);

const images = await stability.v2beta.stableImageGenerate.core({
  prompt: 'A majestic mountain at golden hour, photorealistic',
  output_format: 'png',
});
// images[0].base64 contains the PNG data`,
      },
    ],
    code_examples: {
      typescript: `// Direct REST API approach (no external SDK needed)
async function generateImage(prompt: string): Promise<string> {
  const response = await fetch(
    'https://api.stability.ai/v2beta/stable-image/generate/core',
    {
      method: 'POST',
      headers: {
        Authorization: \`Bearer \${process.env.STABILITY_API_KEY}\`,
        Accept: 'application/json',
      },
      body: (() => {
        const form = new FormData();
        form.append('prompt', prompt);
        form.append('output_format', 'png');
        return form;
      })(),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(\`Stability API error: \${JSON.stringify(error)}\`);
  }

  const data = await response.json() as { image: string; finish_reason: string };
  return data.image; // base64-encoded PNG
}

// Usage
const base64Image = await generateImage('A cyberpunk city at night');
// Convert to data URL for <img> tags:
const dataUrl = \`data:image/png;base64,\${base64Image}\`;`,
    },
    common_pitfalls: [
      {
        title: 'Using deprecated v1 API endpoints',
        title_ko: '구버전 v1 API 엔드포인트 사용',
        problem: 'The v1 DreamStudio API is deprecated and many older tutorials reference it',
        solution: 'Use the v2beta endpoints: /v2beta/stable-image/generate/core for Stable Image Core or /v2beta/stable-image/generate/ultra for highest quality',
      },
      {
        title: 'Incorrect Content-Type for multipart requests',
        title_ko: '멀티파트 요청의 잘못된 Content-Type',
        problem: 'Manually setting Content-Type: multipart/form-data without the boundary parameter breaks the request',
        solution: 'Do not set Content-Type manually when using FormData — let the browser/Node.js set it automatically including the boundary',
        code: `// Correct: let FormData set the boundary automatically
const form = new FormData();
form.append('prompt', 'A cat');
// Do NOT add 'Content-Type' header manually`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'replicate',
        tip: 'Replicate also hosts Stability AI models. Use Replicate for model experimentation and Stability AI Platform for production to get SLA guarantees',
        tip_ko: 'Replicate도 Stability AI 모델을 제공합니다. 실험 단계는 Replicate, 프로덕션은 Stability AI Platform으로 SLA 보장',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Store generated images in Supabase Storage and save generation metadata (prompt, model, timestamp) to Postgres for a searchable image gallery',
        tip_ko: '생성된 이미지를 Supabase Storage에 저장하고 생성 메타데이터를 Postgres에 기록하여 검색 가능한 이미지 갤러리 구현',
      },
    ],
    pros: [
      { text: 'State-of-the-art image quality with Stable Diffusion 3.5 Ultra', text_ko: 'Stable Diffusion 3.5 Ultra로 최고 수준의 이미지 품질 제공' },
      { text: 'Affordable credit-based pricing with pay-as-you-go options', text_ko: '크레딧 기반의 합리적인 종량제 가격' },
    ],
    cons: [
      { text: 'API surface has changed significantly — older SDK versions may be broken', text_ko: 'API 인터페이스가 크게 변경 — 구버전 SDK 사용 불가' },
      { text: 'Content policy restrictions limit certain creative use cases', text_ko: '콘텐츠 정책 제한으로 일부 창작 사례 제한' },
    ],
    api_key_url: 'https://platform.stability.ai/account/keys',
    api_key_url_label: 'Stability AI Platform',
  },

  // -------------------------------------------------------------------------
  // 8. Pinecone
  // -------------------------------------------------------------------------
  {
    service_id: S.pinecone,
    quick_start: 'Pinecone 콘솔에서 API 키와 인덱스를 생성하고 @pinecone-database/pinecone SDK를 설치하면 벡터 임베딩 저장·검색 기반 RAG 시스템을 바로 구축할 수 있습니다.',
    quick_start_en: 'Create an API key and index in the Pinecone console, then install @pinecone-database/pinecone SDK to immediately build a vector embedding store and search system for RAG.',
    setup_steps: [
      {
        step: 1,
        title: 'Install Pinecone SDK',
        title_ko: 'Pinecone SDK 설치',
        description: 'Install the official Pinecone TypeScript/Node.js SDK (requires Node.js >= 20)',
        description_ko: '공식 Pinecone TypeScript/Node.js SDK 설치 (Node.js >= 20 필요)',
        code_snippet: 'npm install @pinecone-database/pinecone',
      },
      {
        step: 2,
        title: 'Create a serverless index',
        title_ko: '서버리스 인덱스 생성',
        description: 'Create an index in the Pinecone console or via SDK. Choose dimensions to match your embedding model.',
        description_ko: 'Pinecone 콘솔 또는 SDK로 인덱스 생성. 임베딩 모델 차원에 맞게 dimensions 설정.',
        code_snippet: `import { Pinecone } from '@pinecone-database/pinecone';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

await pc.createIndex({
  name: 'my-docs',
  dimension: 1536,          // OpenAI text-embedding-3-small
  metric: 'cosine',
  spec: { serverless: { cloud: 'aws', region: 'us-east-1' } },
});`,
      },
      {
        step: 3,
        title: 'Upsert and query vectors',
        title_ko: '벡터 업서트 및 쿼리',
        description: 'Upsert embedding vectors with metadata, then query by similarity',
        description_ko: '메타데이터와 함께 임베딩 벡터를 업서트하고 유사도 쿼리',
        code_snippet: `const index = pc.index('my-docs');

// Upsert
await index.upsert([
  { id: 'doc-1', values: embeddingVector, metadata: { text: 'Hello world', source: 'manual' } },
]);

// Query
const results = await index.query({
  vector: queryEmbedding,
  topK: 5,
  includeMetadata: true,
});
console.log(results.matches);`,
      },
    ],
    code_examples: {
      typescript: `import { Pinecone } from '@pinecone-database/pinecone';
import OpenAI from 'openai';

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
const openai = new OpenAI();

const index = pc.index('my-docs');

// Helper: generate embedding
async function embed(text: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}

// Index documents
async function indexDocuments(docs: { id: string; text: string }[]) {
  const vectors = await Promise.all(
    docs.map(async (doc) => ({
      id: doc.id,
      values: await embed(doc.text),
      metadata: { text: doc.text },
    }))
  );
  await index.upsert(vectors);
}

// RAG retrieval
async function retrieve(question: string, topK = 5) {
  const queryVector = await embed(question);
  const results = await index.query({
    vector: queryVector,
    topK,
    includeMetadata: true,
  });
  return results.matches.map((m) => m.metadata?.text as string);
}`,
    },
    common_pitfalls: [
      {
        title: 'Dimension mismatch between embedding model and index',
        title_ko: '임베딩 모델과 인덱스 차원 불일치',
        problem: 'Creating an index with 1536 dimensions but using a model that produces 768-dimensional vectors causes upsert errors',
        solution: 'Always verify your embedding model\'s output dimension and create the Pinecone index with the exact same number',
        code: `// text-embedding-3-small → 1536 dims
// text-embedding-3-large → 3072 dims
// all-MiniLM-L6-v2 → 384 dims`,
      },
      {
        title: 'Querying without specifying namespace',
        title_ko: '네임스페이스 미지정 쿼리',
        problem: 'Vectors upserted to a named namespace are invisible when querying the default namespace',
        solution: 'Always specify the same namespace string in both upsert and query calls',
        code: `const namespacedIndex = pc.index('my-docs').namespace('user-123');
await namespacedIndex.upsert(vectors);
const results = await namespacedIndex.query({ vector, topK: 5 });`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'anthropic',
        tip: 'Build a RAG pipeline: generate embeddings with Claude\'s recommendation (e.g., text-embedding-3-small via OpenAI or HF), store in Pinecone, retrieve context, then pass to Claude for grounded answers',
        tip_ko: 'RAG 파이프라인 구축: 임베딩 생성 → Pinecone 저장 → 컨텍스트 검색 → Claude에 전달하여 문서 기반 답변 생성',
      },
      {
        with_service_slug: 'langchain',
        tip: 'Use LangChain\'s PineconeVectorStore class to manage embeddings, upserts, and similarity search with a high-level abstraction that works with any LangChain LLM',
        tip_ko: 'LangChain의 PineconeVectorStore 클래스로 임베딩·업서트·유사도 검색을 추상화하여 모든 LangChain LLM과 연동',
        code: `import { PineconeStore } from '@langchain/pinecone';
const store = await PineconeStore.fromExistingIndex(embeddings, { pineconeIndex: index });`,
      },
    ],
    pros: [
      { text: 'Fully managed serverless vector database — no infra to maintain', text_ko: '완전 관리형 서버리스 벡터 DB — 인프라 유지 불필요' },
      { text: 'Sub-millisecond query latency at scale with metadata filtering', text_ko: '메타데이터 필터링 포함 대규모 밀리초 미만 쿼리 레이턴시' },
      { text: 'Generous free tier (1 index, 2GB storage)', text_ko: '넉넉한 무료 플랜 (인덱스 1개, 스토리지 2GB)' },
    ],
    cons: [
      { text: 'Serverless cold starts can add latency for infrequent queries', text_ko: '서버리스 콜드 스타트로 간헐적 쿼리 시 레이턴시 증가 가능' },
      { text: 'No support for hybrid search (sparse + dense) on free tier', text_ko: '무료 플랜에서 하이브리드 검색(희소+조밀) 미지원' },
    ],
    api_key_url: 'https://app.pinecone.io',
    api_key_url_label: 'Pinecone Console',
  },

  // -------------------------------------------------------------------------
  // 9. LangChain
  // -------------------------------------------------------------------------
  {
    service_id: S.langchain,
    quick_start: 'langchain과 @langchain/core를 설치하고 원하는 LLM 프로바이더 패키지를 추가하면 체인, 에이전트, RAG 파이프라인을 즉시 구성할 수 있습니다.',
    quick_start_en: 'Install langchain and @langchain/core, add your preferred LLM provider package, and immediately compose chains, agents, and RAG pipelines.',
    setup_steps: [
      {
        step: 1,
        title: 'Install LangChain',
        title_ko: 'LangChain 설치',
        description: 'Install LangChain core and a provider package (e.g., OpenAI or Anthropic)',
        description_ko: 'LangChain core와 프로바이더 패키지 설치 (예: OpenAI 또는 Anthropic)',
        code_snippet: 'npm install langchain @langchain/core @langchain/openai',
      },
      {
        step: 2,
        title: 'Set provider API key',
        title_ko: '프로바이더 API 키 설정',
        description: 'Add the API key for your chosen LLM provider',
        description_ko: '선택한 LLM 프로바이더의 API 키 설정',
        code_snippet: `# .env (example with OpenAI)
OPENAI_API_KEY=sk-...`,
      },
      {
        step: 3,
        title: 'Build a simple chain',
        title_ko: '간단한 체인 구성',
        description: 'Create a prompt template and chain it with a model and output parser',
        description_ko: '프롬프트 템플릿을 생성하고 모델 및 출력 파서와 체인으로 연결',
        code_snippet: `import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

const model = new ChatOpenAI({ model: 'gpt-4o-mini' });
const prompt = ChatPromptTemplate.fromMessages([
  ['system', 'You are a helpful assistant.'],
  ['user', '{input}'],
]);
const parser = new StringOutputParser();

const chain = prompt.pipe(model).pipe(parser);
const result = await chain.invoke({ input: 'What is LangChain?' });
console.log(result);`,
      },
    ],
    code_examples: {
      typescript: `import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import { RunnableSequence } from '@langchain/core/runnables';

// Simple chain
const model = new ChatOpenAI({ model: 'gpt-4o-mini' });
const chain = ChatPromptTemplate.fromMessages([
  ['system', 'Summarize the following text in one sentence.'],
  ['user', '{text}'],
]).pipe(model).pipe(new StringOutputParser());

const summary = await chain.invoke({ text: 'LangChain is a framework...' });

// RAG with vector store
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from '@langchain/openai';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';

const embeddings = new OpenAIEmbeddings();
const vectorStore = await MemoryVectorStore.fromTexts(
  ['LangChain is a framework for LLM applications.'],
  [{ id: 1 }],
  embeddings
);
const retriever = vectorStore.asRetriever();

const combineDocsChain = await createStuffDocumentsChain({
  llm: model,
  prompt: ChatPromptTemplate.fromMessages([
    ['system', 'Answer using context: {context}'],
    ['user', '{input}'],
  ]),
});
const ragChain = await createRetrievalChain({ retriever, combineDocsChain });
const answer = await ragChain.invoke({ input: 'What is LangChain?' });
console.log(answer.answer);`,
    },
    common_pitfalls: [
      {
        title: '@langchain/core version conflicts',
        title_ko: '@langchain/core 버전 충돌',
        problem: 'All LangChain packages must use the same @langchain/core version; mismatches cause runtime errors',
        solution: 'Run npm ls @langchain/core to check for duplicate versions. Add a resolutions field in package.json or use --legacy-peer-deps carefully.',
        code: `// package.json — force a single core version
{
  "resolutions": {
    "@langchain/core": "0.3.x"
  }
}`,
      },
      {
        title: 'Outdated documentation examples',
        title_ko: '구버전 문서 예제 사용',
        problem: 'LangChain v0.1 and v0.2 APIs differ significantly from v0.3; many blog posts reference older APIs',
        solution: 'Always refer to docs.langchain.com/oss/javascript and check the version tag in examples',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'anthropic',
        tip: 'Install @langchain/anthropic and use ChatAnthropic as a drop-in replacement for ChatOpenAI in any LangChain chain or agent',
        tip_ko: '@langchain/anthropic 설치 후 ChatAnthropic을 ChatOpenAI 대신 LangChain 체인·에이전트에 그대로 사용',
        code: `import { ChatAnthropic } from '@langchain/anthropic';
const model = new ChatAnthropic({ model: 'claude-opus-4-5', temperature: 0 });`,
      },
      {
        with_service_slug: 'pinecone',
        tip: 'Use LangChain\'s PineconeVectorStore with OpenAI embeddings for a production-ready RAG pipeline with minimal boilerplate',
        tip_ko: 'LangChain의 PineconeVectorStore와 OpenAI 임베딩을 조합하여 최소 코드로 프로덕션급 RAG 파이프라인 구성',
      },
    ],
    pros: [
      { text: 'Provider-agnostic abstractions — swap LLMs without rewriting logic', text_ko: '프로바이더 독립적 추상화 — LLM 교체 시 로직 재작성 불필요' },
      { text: 'Rich ecosystem: 100+ integrations, built-in RAG, agents, and tool use', text_ko: '풍부한 에코시스템: 100개 이상 통합, 내장 RAG·에이전트·도구 사용' },
      { text: 'LangSmith integration for debugging and tracing LLM calls', text_ko: 'LangSmith 통합으로 LLM 호출 디버깅 및 추적' },
    ],
    cons: [
      { text: 'Rapid API changes and breaking versions require frequent updates', text_ko: '빠른 API 변경으로 잦은 업데이트 필요' },
      { text: 'Abstraction overhead can make debugging difficult for simple use cases', text_ko: '단순한 사용 사례에서 추상화 오버헤드로 디버깅이 어려울 수 있음' },
    ],
  },

  // -------------------------------------------------------------------------
  // 10. ElevenLabs
  // -------------------------------------------------------------------------
  {
    service_id: S.elevenlabs,
    quick_start: 'ElevenLabs API 키를 발급받고 @elevenlabs/elevenlabs-js를 설치하면 자연스러운 다국어 TTS, 음성 복제, 실시간 스트리밍을 즉시 사용할 수 있습니다.',
    quick_start_en: 'Get an ElevenLabs API key and install @elevenlabs/elevenlabs-js to instantly use natural multilingual TTS, voice cloning, and real-time streaming.',
    setup_steps: [
      {
        step: 1,
        title: 'Install ElevenLabs SDK',
        title_ko: 'ElevenLabs SDK 설치',
        description: 'Install the official ElevenLabs JavaScript/TypeScript SDK',
        description_ko: '공식 ElevenLabs JavaScript/TypeScript SDK 설치',
        code_snippet: 'npm install @elevenlabs/elevenlabs-js',
      },
      {
        step: 2,
        title: 'Set API key',
        title_ko: 'API 키 설정',
        description: 'Add your ElevenLabs API key to environment variables',
        description_ko: 'ElevenLabs API 키를 환경변수에 추가',
        code_snippet: `# .env
ELEVENLABS_API_KEY=sk_...`,
      },
      {
        step: 3,
        title: 'Convert text to speech',
        title_ko: '텍스트를 음성으로 변환',
        description: 'Use the textToSpeech API to generate audio from text',
        description_ko: 'textToSpeech API로 텍스트에서 오디오 생성',
        code_snippet: `import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { writeFileSync } from 'fs';

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

const audio = await client.textToSpeech.convert('Rachel', {
  text: 'Hello! This is a test of ElevenLabs text-to-speech.',
  modelId: 'eleven_multilingual_v2',
  voiceSettings: { stability: 0.5, similarityBoost: 0.75 },
});

const chunks: Buffer[] = [];
for await (const chunk of audio) chunks.push(Buffer.from(chunk));
writeFileSync('output.mp3', Buffer.concat(chunks));`,
      },
    ],
    code_examples: {
      typescript: `import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

// Standard TTS (collect all chunks)
async function textToSpeechFile(text: string, outputPath: string) {
  const audioStream = await client.textToSpeech.convert('Rachel', {
    text,
    modelId: 'eleven_multilingual_v2',
    outputFormat: 'mp3_44100_128',
  });
  const chunks: Buffer[] = [];
  for await (const chunk of audioStream) chunks.push(Buffer.from(chunk));
  writeFileSync(outputPath, Buffer.concat(chunks));
}

// Streaming TTS (pipe to HTTP response for real-time playback)
async function streamTTS(text: string, res: Response) {
  const audioStream = await client.textToSpeech.stream('Rachel', {
    text,
    modelId: 'eleven_turbo_v2',
  });
  return new ReadableStream({
    async pull(controller) {
      for await (const chunk of audioStream) {
        controller.enqueue(chunk);
      }
      controller.close();
    },
  });
}

// List available voices
const voices = await client.voices.getAll();
voices.voices?.forEach((v) => console.log(v.voiceId, v.name));`,
    },
    common_pitfalls: [
      {
        title: 'Exhausting free-tier character quota',
        title_ko: '무료 플랜 문자 한도 초과',
        problem: 'Free tier provides only 10,000 characters/month; long texts or repeated calls exhaust it quickly',
        solution: 'Cache generated audio files by text hash to avoid re-generating identical content. Monitor usage in the ElevenLabs dashboard.',
        code: `import { createHash } from 'crypto';
const cacheKey = createHash('md5').update(text).digest('hex');
const cachePath = \`/tmp/tts-\${cacheKey}.mp3\`;`,
      },
      {
        title: 'Using voice IDs instead of voice names',
        title_ko: 'Voice name 대신 Voice ID 사용 혼동',
        problem: 'Voice names like "Rachel" may resolve to different voice IDs across accounts or get deprecated',
        solution: 'List voices via the SDK and use stable voice IDs (UUIDs) in production code',
        code: `const voices = await client.voices.getAll();
const rachel = voices.voices?.find((v) => v.name === 'Rachel');
const voiceId = rachel?.voiceId ?? '21m00Tcm4TlvDq8ikWAM';`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'anthropic',
        tip: 'Build a voice AI assistant: use Claude to generate response text, then pipe it through ElevenLabs TTS for spoken output — combine with streaming for real-time voice chat',
        tip_ko: '음성 AI 어시스턴트 구축: Claude로 텍스트 응답 생성 후 ElevenLabs TTS로 음성 출력 — 스트리밍 결합으로 실시간 음성 대화 구현',
      },
      {
        with_service_slug: 'supabase',
        tip: 'Store generated audio URLs or files in Supabase Storage and log TTS requests (text, voice, timestamp) to Postgres for audit and cost tracking',
        tip_ko: '생성된 오디오를 Supabase Storage에 저장하고 TTS 요청 로그를 Postgres에 기록하여 감사 및 비용 추적',
      },
    ],
    pros: [
      { text: 'Most natural-sounding TTS with voice cloning capabilities', text_ko: '가장 자연스러운 TTS 및 음성 복제 기능' },
      { text: 'Multilingual support with a single voice model', text_ko: '단일 음성 모델로 다국어 지원' },
      { text: 'Real-time streaming API for low-latency voice applications', text_ko: '낮은 레이턴시 음성 앱을 위한 실시간 스트리밍 API' },
    ],
    cons: [
      { text: 'Expensive at scale — character-based billing adds up quickly', text_ko: '대규모 사용 시 비용 과다 — 문자 기반 청구가 빠르게 쌓임' },
      { text: 'Limited free tier (10,000 chars/month)', text_ko: '제한적인 무료 플랜 (월 10,000자)' },
    ],
    api_key_url: 'https://elevenlabs.io/app/settings/api-keys',
    api_key_url_label: 'ElevenLabs Dashboard',
  },

  // -------------------------------------------------------------------------
  // 11. GitHub Copilot
  // -------------------------------------------------------------------------
  {
    service_id: S.github_copilot,
    quick_start: 'GitHub Copilot 구독을 활성화하고 VS Code 또는 JetBrains 플러그인을 설치하면 코드 작성 중 AI 자동완성을 즉시 사용할 수 있습니다.',
    quick_start_en: 'Activate a GitHub Copilot subscription and install the VS Code or JetBrains plugin to instantly get AI code completions while you write.',
    setup_steps: [
      {
        step: 1,
        title: 'Activate Copilot subscription',
        title_ko: 'Copilot 구독 활성화',
        description: 'Enable GitHub Copilot in your GitHub account settings (free for verified students, paid for others)',
        description_ko: 'GitHub 계정 설정에서 Copilot 활성화 (인증된 학생은 무료, 일반은 유료)',
        code_snippet: `# Verify subscription is active
gh auth status`,
      },
      {
        step: 2,
        title: 'Install VS Code extension',
        title_ko: 'VS Code 확장 설치',
        description: 'Install the GitHub Copilot and GitHub Copilot Chat extensions in VS Code',
        description_ko: 'VS Code에서 GitHub Copilot 및 GitHub Copilot Chat 확장 설치',
        code_snippet: `code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat`,
      },
      {
        step: 3,
        title: 'Configure Copilot settings',
        title_ko: 'Copilot 설정 구성',
        description: 'Customize language support and suggestion behavior in VS Code settings',
        description_ko: 'VS Code 설정에서 언어 지원 및 제안 동작 커스터마이징',
        code_snippet: `// .vscode/settings.json
{
  "github.copilot.enable": {
    "*": true,
    "yaml": false,
    "markdown": true
  },
  "github.copilot.editor.enableAutoCompletions": true
}`,
      },
    ],
    code_examples: {
      typescript: `// Copilot usage is through the IDE, but here are CLI examples
// for GitHub Copilot in the CLI (gh extension)

// Install Copilot CLI extension
// $ gh extension install github/gh-copilot

// Explain a shell command
// $ gh copilot explain "awk '{print $1}' file.txt"

// Suggest a command
// $ gh copilot suggest "list all docker containers and their sizes"

// In VS Code, Copilot responds to natural language comments:
// Write a TypeScript function that debounces a callback
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
      bash: `# GitHub Copilot CLI
gh extension install github/gh-copilot

# Explain a command
gh copilot explain "git rebase -i HEAD~3"

# Get command suggestions
gh copilot suggest "compress a folder into tar.gz"`,
    },
    common_pitfalls: [
      {
        title: 'Accepting suggestions without review',
        title_ko: '검토 없이 제안 수락',
        problem: 'Copilot suggestions may introduce security vulnerabilities, outdated APIs, or subtle logic errors',
        solution: 'Always review accepted code. Run linters and tests. Use Copilot Chat to ask "are there any security issues with this code?"',
      },
      {
        title: 'Copilot not working in monorepos without workspace settings',
        title_ko: '모노레포에서 워크스페이스 설정 없이 동작하지 않음',
        problem: 'Copilot context is limited to the open file and nearby code; in large monorepos it may suggest wrong imports',
        solution: 'Open the relevant workspace folder, not the root, to give Copilot focused context',
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'cursor',
        tip: 'GitHub Copilot and Cursor serve similar purposes but differ in approach: Copilot offers inline completions in any IDE, while Cursor provides a full AI-native editor experience. Many developers use both — Copilot in their main IDE and Cursor for AI-intensive refactoring sessions.',
        tip_ko: 'GitHub Copilot과 Cursor는 비슷한 목적이지만 다른 방식: Copilot은 모든 IDE에서 인라인 자동완성, Cursor는 AI 네이티브 에디터 경험 제공. 많은 개발자가 두 가지 모두 사용 — 주 IDE는 Copilot, AI 집중 리팩토링은 Cursor',
      },
      {
        with_service_slug: 'github',
        tip: 'GitHub Copilot integrates natively with GitHub PRs — use Copilot code review in the pull request UI to get automated review comments directly on your diff',
        tip_ko: 'GitHub Copilot은 GitHub PR과 네이티브 통합 — PR UI에서 Copilot 코드 리뷰를 활성화하면 diff에 자동화된 리뷰 코멘트 제공',
      },
    ],
    pros: [
      { text: 'Tight GitHub integration — works inside PRs, issues, and GitHub.com editor', text_ko: 'GitHub 네이티브 통합 — PR·이슈·GitHub.com 에디터 내에서 동작' },
      { text: 'Supports virtually every language and IDE with extensions', text_ko: '거의 모든 언어와 IDE 지원' },
      { text: 'Free for students and open-source maintainers via GitHub Education', text_ko: 'GitHub Education을 통해 학생 및 오픈소스 메인테이너에게 무료 제공' },
    ],
    cons: [
      { text: 'Requires an active paid subscription ($10/month individual)', text_ko: '활성 유료 구독 필요 (개인 월 $10)' },
      { text: 'Context window is limited to the current file — lacks whole-codebase awareness without Copilot Workspace', text_ko: '컨텍스트 창이 현재 파일로 제한 — Copilot Workspace 없이는 전체 코드베이스 인식 부족' },
    ],
    api_key_url: 'https://github.com/settings/copilot',
    api_key_url_label: 'GitHub Copilot Settings',
  },

  // -------------------------------------------------------------------------
  // 12. Cursor
  // -------------------------------------------------------------------------
  {
    service_id: S.cursor,
    quick_start: 'Cursor 에디터를 설치하고 GitHub 계정으로 로그인하면 Claude/GPT-4 기반의 AI 코드 자동완성, 멀티파일 편집, 코드베이스 채팅을 즉시 사용할 수 있습니다.',
    quick_start_en: 'Install Cursor editor and sign in with your GitHub account to immediately use Claude/GPT-4-powered AI code completion, multi-file editing, and codebase chat.',
    setup_steps: [
      {
        step: 1,
        title: 'Download and install Cursor',
        title_ko: 'Cursor 다운로드 및 설치',
        description: 'Download the Cursor installer from cursor.com and run it (available for macOS, Windows, Linux)',
        description_ko: 'cursor.com에서 Cursor 설치 파일을 다운로드하여 실행 (macOS, Windows, Linux 지원)',
        code_snippet: `# macOS via Homebrew
brew install --cask cursor`,
      },
      {
        step: 2,
        title: 'Sign in and import VS Code settings',
        title_ko: '로그인 및 VS Code 설정 가져오기',
        description: 'Sign in with GitHub or Google. Import your existing VS Code extensions and keybindings.',
        description_ko: 'GitHub 또는 Google로 로그인. 기존 VS Code 확장 및 키 바인딩 가져오기.',
        code_snippet: `# Cursor is VS Code-compatible
# Import extensions: Cursor → Preferences → Import VS Code Extensions`,
      },
      {
        step: 3,
        title: 'Configure AI model and rules',
        title_ko: 'AI 모델 및 규칙 설정',
        description: 'Choose your AI model (Claude, GPT-4, etc.) in Settings and add project-level rules as .mdc files in .cursor/rules/',
        description_ko: '설정에서 AI 모델 선택 (Claude, GPT-4 등) 및 .cursor/rules/ 디렉토리에 .mdc 파일로 프로젝트 수준 규칙 추가',
        code_snippet: `# .cursor/rules/typescript.mdc (project root)
---
alwaysApply: true
---

You are an expert TypeScript engineer.
Always use strict null checks.
Prefer functional patterns over classes.
When writing tests, use vitest and @testing-library/react.`,
      },
    ],
    code_examples: {
      typescript: `// Cursor's AI features are IDE-level, but you can use its API key
// passthrough to integrate your own Anthropic or OpenAI key.

// In Cursor Settings → Models → Add Model:
// - Provider: Anthropic
// - API Key: your ANTHROPIC_API_KEY
// This routes Cursor's completions through your own billing account.

// .cursor/rules/nextjs.mdc example for a Next.js project:
/*
---
alwaysApply: true
---

You are an expert full-stack engineer specializing in Next.js 15, TypeScript, and Supabase.

Key rules:
- Use App Router and Server Components by default
- Always handle errors with try/catch and return typed error objects
- Use Zod for all input validation
- Prefer named exports for components
- Write self-documenting code; avoid unnecessary comments
*/`,
      bash: `# Cursor CLI (open files/folders)
cursor .               # Open current directory
cursor src/app/page.tsx  # Open specific file

# Use Cmd+K (inline edit) for targeted changes
# Use Cmd+L (chat) for codebase questions
# Use Cmd+Shift+L (composer) for multi-file edits`,
    },
    common_pitfalls: [
      {
        title: 'Not setting .cursor/rules for project context',
        title_ko: '.cursor/rules 미설정으로 프로젝트 컨텍스트 부재',
        problem: 'Without project rules, Cursor uses generic context and may suggest patterns that conflict with your project conventions. The legacy single .cursorrules file is no longer documented — Cursor now uses .mdc rule files under .cursor/rules/',
        solution: 'Add .mdc rule files under .cursor/rules/ with your stack, coding standards, and patterns (or use AGENTS.md as an alternative). This significantly improves suggestion quality.',
      },
      {
        title: 'Using Cursor for secrets management inadvertently',
        title_ko: 'Cursor에 민감 정보 의도치 않게 노출',
        problem: 'Cursor sends code context to AI providers; avoid pasting .env files or secrets into Cursor chat',
        solution: 'Set up .cursorignore (similar to .gitignore) to exclude .env files and sensitive directories from Cursor\'s codebase indexing',
        code: `# .cursorignore
.env
.env.local
.env.production
secrets/`,
      },
    ],
    integration_tips: [
      {
        with_service_slug: 'anthropic',
        tip: 'Configure Cursor to use your own Anthropic API key in Settings → Models → Add Claude model. This uses your Anthropic billing instead of Cursor\'s request quota.',
        tip_ko: '설정 → 모델 → Claude 모델 추가에서 자체 Anthropic API 키를 사용하도록 구성. Cursor 요청 할당량 대신 Anthropic 청구 계정 사용.',
      },
      {
        with_service_slug: 'github-copilot',
        tip: 'Cursor and GitHub Copilot can coexist: install the Copilot extension in Cursor for inline ghost-text completions while using Cursor\'s Composer for multi-file refactoring tasks',
        tip_ko: 'Cursor와 GitHub Copilot은 공존 가능: Cursor에 Copilot 확장을 설치하여 인라인 자동완성을 사용하고, 멀티파일 리팩토링은 Cursor Composer 활용',
      },
    ],
    pros: [
      { text: 'Multi-file edit (Composer) understands the full codebase context', text_ko: '멀티파일 편집(Composer)이 전체 코드베이스 컨텍스트를 이해' },
      { text: 'VS Code-compatible — import all existing extensions and settings instantly', text_ko: 'VS Code 호환 — 기존 확장 및 설정을 즉시 가져오기 가능' },
      { text: 'Free tier available with limited AI requests per month', text_ko: '월 제한 AI 요청을 포함한 무료 플랜 제공' },
    ],
    cons: [
      { text: 'Paid plan required for heavy usage ($20/month Pro)', text_ko: '고사용량 시 유료 플랜 필요 (Pro 월 $20)' },
      { text: 'Code context is sent to third-party AI providers — review privacy policy for sensitive projects', text_ko: '코드 컨텍스트가 서드파티 AI 프로바이더로 전송 — 민감한 프로젝트에서는 개인정보 정책 확인 필요' },
    ],
    api_key_url: 'https://cursor.com/settings',
    api_key_url_label: 'Cursor Settings',
  },
];
